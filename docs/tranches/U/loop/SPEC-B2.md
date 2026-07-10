# SPEC-B2 — Track B convergence loop, pass 2: THE REVISED SPECIFICATION

> **SUPERSESSION: SPEC-B2 REPLACES SPEC-B1.** Every ruling below is SPEC-B1 as amended
> by the eight PASS-1 agglomerator rulings (BINDING) and the three pass-2 research
> dossiers (`pass2-research-p1-p2.md`, `pass2-research-p3-p5-p6.md`,
> `pass2-research-spec-questions.md`). Where this spec is silent, SPEC-B1's text
> carries forward unchanged; where they differ, THIS document governs. Step 2
> (synthesis) of the owner 5-step loop — OWNER-ASKS row 6; OD-U15/U16/U17/U18.
>
> Sections: §0 glossary · §1 the granularity rules (G1–G10 carried; G11/G12/G13 new) ·
> §2 the library table as amended · §3 the demo table as amended · §4 the charter
> gaps, updated · §5 the CLAUDE.md removal plan as amended · §6 the suppression plan
> as amended · §7 what B2 amends over B1 · §8 the six pass-2 iteration charters ·
> §9 questions for the pass-2 critique fleet.

---

## §0 — Glossary (agglomerator ruling 6, the anti-recondite ruling)

Every term of art this spec uses, glossed ONCE here before the body. SPEC-B1 carried
a "plain language throughout" banner over unglossed shorthand — the exact
self-contradiction ruling 6 flags. The banner stands only because this section exists.

| term | meaning |
|---|---|
| **zone** | one of the library's eleven cohesive `src/animation/<name>/` directories |
| **barrel** | an `index.ts` whose only job is to re-export its directory's public members behind one import path |
| **carve** | split a directory or file into a smaller cohesive unit |
| **fold** | move a file's contents into another file and delete the original |
| **inline** | fold a whole standalone module into its consumer |
| **pure move** | a relocation that changes zero behavior — every import re-points at module-load time, no runtime path changes |
| **importer / consumer count** | how many OTHER files `import` from a given file (excludes the file itself, comment/string mentions, and a barrel re-export with no downstream reader) |
| **fold-map** | a claim-by-claim table showing, for every sentence a deleted doc carried, where that sentence now lives (or why it was dropped) |
| **a18** | an audit-lane invariant (audit lane "a", finding 18): the compile zone's real seam is FORWARD (template→frames) vs BACKWARD (frames→CSS), enforced as a **zero cross-import edge** between the two legs; `proof:compile-backward-leg` reds if a backward-leg file leaks into the forward pipeline |
| **refusal-probes** | the shared predicate helpers in the backward/emit compiler that detect a kf animation the target CSS format **cannot round-trip faithfully** (a `weighted` blend, a computed unit, a color interpolation) and **REFUSE the lowering with a named reason** rather than silently approximating; today `entry.ts` / `view-transition.ts` / `backward.ts` each carry their own copy |
| **de-accrete** | remove code that has **accreted** (accumulated as duplicated copies over successive edits) — here, extract the three copied refusal checks into one shared file |
| **SoA fold** | SoA (Structure-of-Arrays): the AnimationGroup compositor's **zero-allocation blend loop** that composites layers by iterating parallel per-field arrays instead of an array of per-layer objects, so the hot path allocates nothing per frame |
| **FSM** | finite-state machine — the play/pause/finish state logic copied across `animation.ts`, `play-lifecycle.ts`, and `group/lifecycle.ts`, which U.C1 dissolves into one Transport core |
| **ODE** | ordinary differential equation — the spring physics integration step; the byte-copied version in `spring/vector.ts` dies into U.C4's one modal kernel |
| **Hidden Components** | Mark Thiessen's Vue heuristic — extract a child component only when it owns an **exclusive cluster of props/state**, never by line volume; a single-use region sharing the parent's state stays inline |
| **post-BH** | the per-component directory shape glass-ui adopted after its "BH" tranche: kebab-case dir, PascalCase SFC (single-file component), re-export-only `index.ts`, `constants.ts`, per-component `composables/` |
| **composable** | a Vue function (named `useX`) that packages a slice of reactive state + behavior for a component to call |
| **Deps / Return types** | the interfaces describing what a composable is handed (`useFoo(deps: UseFooDeps)`) and what it hands back (`useFoo(...): UseFooReturn`) |
| **reflexive export** | a symbol marked `export` but referenced only inside its own defining file — an export with no reader; `proof:no-dead-export` exists to catch exactly this |
| **born-RED** | a new gate clause authored to **FAIL on today's tree first**, proving it detects the defect, going green only when the fix lands |
| **ratchet** | a monotone-shrinkage backlog: the list may only get smaller — a new violation not on the list reds, and a stale entry also reds |
| **die-by-fixing** | remove a suppression by **actually fixing what it suppressed** (strictness rises), never by deleting the check |
| **JUSTIFIED entry** | a row in `proof:zone-cohesion`'s allowlist that lets one over-400-line file stay whole with a recorded reason |
| **dead guard** | a gate clause whose condition can no longer occur, so it passes forever while checking nothing |
| **worktree** | an isolated git checkout of a prototype branch; the six prototype branches are EVIDENCE, never merged (OD-U18) |

At each first G3-subclause reference below, the sub-clause is named inline
("G3c — deliberate carve-out", etc.) so a reader need not scroll back.

---

## §1 — The granularity rules

**G1–G10 carry forward from SPEC-B1 verbatim** (cohesion-not-line-count; the cohesive
directory behind one barrel as the unit; the four never-inline protections G3a
entry-shim / G3b named-pipeline-stage / G3c deliberate-carve-out / G3d
multi-consumer-leaf; barrels earn their place at three seams only; two package entry
points; the Vue child-file contract; the ≥2-consumer composable threshold; async seams
at the expensive-panel boundary; the types-fold + InjectionKey-keeps rule; every carve
a pure module-load-safe move). They survived pass 1 with one named conflict, resolved
by G11 below. Three rules are NEW, each ratifying a PASS-1 agglomerator ruling as
general law:

**G11 — Fold-time adjudication (ruling 2, generalized).** An INLINE verdict on a
**shared-contract module** — a module whose exported symbol is referenced *by name*
across module boundaries (a registry id, an `InjectionKey`, a type contract, a shared
constant) — is **provisional** until the fold commit measures the **live** importer
count on the tree as it then stands. The decision rule is fixed in advance and applied
at that measurement:

- **exactly 1 real importer** → INLINE executes (pure indirection; fold into the sole
  owner and delete).
- **≥2 real importers** → the module **KEEPS**; the fold-map records the count and the
  KEEP as an explicit counter-example. The verdict is never forced against the count.

The count is measured at fold time — never carried from a stale census — because prior
waves in the same drive add and remove consumers. This is NOT the forbidden deferred
"watch" (a postponed ruling): the ruling IS the two-branch decision rule, fixed now;
only the **measurement** is deferred to the one moment it is cheap, exact, and
consequential. Fold-time adjudication legitimizes the surviving KEEP-conditionals —
they mirror the retired watch pattern's shape but carry a decision rule and evidence,
not a standing exemption. **Immediate applications, named so no pass re-litigates:**
`flattenVars`, `contenteditable`, and the three `cube/square/amigaKeys` (all now
MEASURED — see §3; every one resolved to KEEP).

**G12 — Dead-gate-retire (ruling 3, generalized).** When a fold, carve, inline, or
delete **moots a gate clause** — the condition the clause checks can no longer occur —
that clause **retires in the same commit as the change that mooted it**. A check must
be able to go RED when its guarded condition clears, or it dies with the concern it
served: the §6 suppression ethos ("self-verifying or die with its concern") extended
from suppression *files* to gate *clauses*. **The two immediate applications, both
mooted by the `constants/index.ts` delete and both landing in that same commit:**

1. **`proof:boundary` assertion 6** (`proof-boundary.mjs:660`, doc'd `:68`) — the
   "no LIGHT-zone bare-`constants`-barrel import" scan. Once the barrel is deleted
   there is no bare barrel to import; the clause is a dead guard. RETIRE it. Its live
   concern (a LIGHT module reaching value.js via `constants/defaults`) is already held
   by the FILE-level `constants/types.ts`-purity clause the same gate carries at
   `:232`, which survives.
2. **`proof:zone-cohesion`'s ring-fence** (`proof-zone-cohesion.mjs:289,306`) — drop
   `"constants"` from `allowedBarrelDirs` and drop the "constants/ barrels are intact"
   phrasing from the success line (`constants/` keeps `types.ts` + `defaults.ts`, no
   barrel).

**G13 — The composable type-export threshold (ruling 8, resolved: STAY LOCAL).**
A composable's `Deps` and `Return` types are exported **only when a second module
genuinely reads them** — a ≥2nd call site, a composing composable that threads the
type, or a published-library API surface (the glass-ui `api/types-extra.ts` precedent,
where an external consumer wrapping `<Concentric>` needs the `Handle` type). Below
that bar the interface is declared **without `export`** (file-local): TypeScript
infers it at the sole call site, and an `export` there is precisely the reflexive dead
export `proof:no-dead-export` and the GRAND COLOCATION EDICT forbid. This is G7's
≥2-consumer test, applied to a composable's *types* exactly as G7 applies it to the
composable *file*: a single-consumer composable earns neither a shared file nor an
exported signature.

*Evidence base:* zero of the demo's 17 backlogged composable Deps/Return/Options types
have any consumer outside their defining file (measured across demo+src+test+scripts);
glass-ui exports-and-consumes only for a component's *public* composable and merely
tolerates dead internal exports because it lacks kf's gate — kf applies its own ethos
to glass-ui's good half.

*Corollary — the barrel is not an escape hatch.* The gate counts a re-export as a
consumer, so a `composables/index.ts` that blanket-re-exports every type would flip
the gate green with no real reader — laundering. Forbidden: the per-component
composables barrel re-exports the composable **functions** (the SFC imports those),
and a type **only** when a downstream module imports that type through it.

*Consequence:* the `proof:no-dead-export` DEFERRED backlog now has a defined exit —
all 17 reflexive rows (P5's 8 included) are "delete the `export` keyword"; the backlog
empties as U.B recuts each composable, and the DEFERRED array + its gate machinery
delete when empty (the gate's own stated exit). No recut ever re-adds rows.

**Two pieces of pass common law, restated as spec law:**

- **The in-tree artifact rule (ruling 5).** Every chartered verdict, analysis, map, or
  template (a fold-map, a gate-re-anchor template, a KEEP-or-carve verdict, a boundary
  paragraph) is committed IN-TREE — under `docs/tranches/U/loop/` or as prose in the
  touched module — never left in an agent return. A ratification record that isn't
  self-contained isn't a record. Each §8 charter names its artifact paths.
- **The charter-surface scoring rule (PASS-1 standing rule).** A prototype's
  convergence % is scored against the CHARTER surface as written in this spec, never
  against a narrowed brief; a prototype that must narrow scope says so explicitly and
  scores the remainder at zero. Execute the hard half first.

**The both-bounds verdict carries from SPEC-B1 unchanged**, now with pass-1
measurement behind it: the LONG direction holds nearly all the work; the SMALL
direction has ONE library kill and — after G11's honest counts (§3) — exactly FOUR
executable demo targets, with six flips to KEEP. The asymmetry is a finding, and the
flips are the sweep doing its job, not failing it.

---

## §2 — The library ruling table, as amended

Everything in SPEC-B1 §2 carries forward except the rows restated below. Verdict
vocabulary unchanged (CARVE-DIR · CARVE-FILE · KEEP · INLINE · DELETE · MOVE · SHRINK).

### The `compile/` backward→emit row, SPLIT (agglomerator ruling 1)

SPEC-B1 entangled the directory rename with the refusal-probe carve in one row. The
row splits into two rows with different clocks:

| move | ruling | clock |
|---|---|---|
| `compile/backward/` → `compile/emit/` (all 8 files, **filenames unchanged** — `backward.ts` keeps its name) + `compile/entry.ts` → `emit/entry.ts` + `compile/view-transition.ts` → `emit/view-transition.ts` | **PURE MOVE — execute NOW (P1 pass 2)** | module-load-safe; zero behavior change; every path literal re-anchors in the same commit (the full blast radius is `pass2-research-p1-p2.md` §A.3, which becomes P1's in-tree template) |
| `backward.ts`'s refusal blocks → `emit/refusal-probes.ts` + the entry/view-transition de-accretion interiors | **DEFERRED — U.C9** | the length-reducing carve; P1 notes seams found, builds nothing |

**The self-cycle idiom, ratified for reuse verbatim:** movers (`entry.ts`,
`view-transition.ts`) and consumers import the real sibling **files** inside `emit/`
directly, never the `emit/` barrel (which re-exports them) — the same
file-not-barrel + `../`→`../../` deepening idiom the easing carve proved.

**CORRECTION to PASS-1's "retire the JUSTIFIED entries BY the move" wording.** The two
`proof:zone-cohesion` JUSTIFIED entries (`compile/backward/backward.ts` 475L,
`compile/entry.ts` 434L) are justified because the files exceed the 400-line ceiling,
and the pure move shrinks neither. The move therefore **RE-KEYS** the entries (to
`compile/emit/backward.ts` / `compile/emit/entry.ts`, reason prose updated to say
`emit/`) — forced by the gate's own stale-justification guard, which reds on absent
paths. **True retirement waits on the deferred U.C9 carve.** No pass-2 scorer expects
a retirement the pure-move charter cannot deliver.

### The `constants/` row, completed by G12

`constants/index.ts` **DELETE** stands (executed and ratified in P1's sibling
prototype P2); the row now carries its G12 rider: the two dead-guard retirements
(§1 G12 applications 1 and 2) land **in the delete commit** — the fold and its gate
surgery are one motion, never a follow-up.

### Everything else in §2: CONFIRMED as written in SPEC-B1

Including: the root-tier SHRINKs (U.C13), `spring/solver/` + `spring/css/` CARVE-DIRs
(U.C7), `spring/vector.ts` DELETE-by-unification (U.C4 before U.C7), the
`compile/easing/` CARVE-DIR (**built and ratified in P1 pass 1 — do not redo**),
`frame-compiler.ts` CARVE-FILE (U.C9), `group/blend/` and `resolve/resolvers/`
MANDATORY CARVE-DIRs, `plain-vars.ts` MOVE → group renderer seam (U.C3), the explicit
KEEPs (`draggable.ts`, `cssom.ts`, `emission.ts` — G3b, a named pipeline stage), the
`internal/` blanket KEEP (G3d, multi-consumer leaves), and `src/env.d.ts` MOVE →
`demo/env.d.ts`.

---

## §3 — The demo ruling table, as amended

Root structure, component-module verdicts, and shared-tier verdicts carry from SPEC-B1
§3 unchanged (the `@/` dissolution awaiting the owner's confirm; the U.B2–B13
confirmations including the stutter-trio re-carve amendment — now PROVEN by P5 and
extended in §4 below).

**The demo INLINE list is REPLACED by the measured fold-time table** (G11 applied; the
counts are live-tree measurements from `pass2-research-p1-p2.md` §B.3, re-verified at
each fold commit per G11):

| target | SPEC-B1 said | measured consumers | **RULING** | why |
|---|---|---|---|---|
| `scenes/cube/matrix-editor/index.ts` | INLINE | 2 | **INLINE** | a 1-line barrel over a 1-component module is pure ceremony (G4) — count is irrelevant for a ceremony barrel; both consumers retarget `MatrixEditor.vue` directly |
| `scenes/cube/cubeKeys.ts` | INLINE | 2 (`useCubeDemo.ts`, `app/scene/scenes.ts`) | **KEEP** (ruling-2 flip) | the scene machine AND the demo composable both consume the registry-id; inlining into one orphans the other |
| `scenes/square/squareKeys.ts` | INLINE | 2 (`SquareScene.vue`, `scenes.ts`) | **KEEP** (ruling-2 flip) | same 2-consumer registry-id contract |
| `scenes/amiga/amigaKeys.ts` | INLINE | 3 (`AmigaScene.vue`, `useAmigaDemo.ts`, `scenes.ts`) | **KEEP** (ruling-2 flip) | 3-consumer contract — inlining triplicates the id string |
| `app/runtime/rafConstants.ts` | INLINE | 2 (`useEasingDemo.ts`, `useSpringHotPath.ts`) | **KEEP** (conditional fold) | exists to KILL a cross-scene duplication (its own docstring says so) — inlining RE-duplicates it (G3d — multi-consumer leaf). If U.B3/B8 creates a shared scene-runtime `constants.ts` both scenes consume, fold THERE; record the dependency, do not build U.B3 |
| `scenes/cube/orbital-drag/types.ts` | INLINE→constants | 4 (all in-module, relative `./types`) | **FOLD → `orbital-drag/constants.ts`** | a `*types.ts` folds to the module's `constants.ts` (G9), not into one owner; co-located with §4.2's barrel-purity bodies — ONE `constants.ts`, P5's landed shape is the reference |
| `keyframes/utils/contenteditable.ts` | INLINE-if-sole | 2 (`KeyframesEditor.vue`, `KeyframesAddDialog.vue`) | **KEEP** (flip) | not a sole consumer; 2 consumers earn the shared seat (G7) |
| `timeline/timelineTypes.ts` | INLINE→constants | 9 | **FOLD → `timeline/constants.ts`** | a types file folds to the module's `constants.ts` regardless of count (G9); 9 importers retarget `./constants` — a relocation, not a duplication |
| `timeline/utils/flattenVars.ts` | INLINE-if-single-owner | 2 (`useTimelineBuild.ts`, `timelineEngine.ts`) | **KEEP** (flip) | the spec's own conditional resolves to KEEP |
| `instrument/index.ts` | DELETE | 0 | **DELETE** | an `export *` umbrella with zero consumers is legacy (G4/U.B11) |
| `transportSource.ts` · lazy barrels · `@/utils/clipboard.ts` | KEEP | — | **KEEP** (unchanged from SPEC-B1) | |

**The honest bottom line, stated plainly:** of ~10 demo targets, FOUR execute
(matrix-editor INLINE, orbital-drag/types FOLD, timelineTypes FOLD, instrument
DELETE) and SIX flip to KEEP — each a multi-consumer shared contract the naive list
would have duplicated. The adjudication IS the deliverable.

**The composable-authoring convention for the whole U.B drive (G13 applied):** the
post-BH `composables/` shape lands with file-local (unexported) Deps/Return types by
default; a type graduates to `export` + barrel re-export at the same moment its
composable graduates to a shared seat (≥2 consumers).

---

## §4 — The charter gaps, updated

1. **`app/dock/`** — KEEP + recut to the glass-ui component-dir shape, as SPEC-B1
   ruled; NOW ALSO: the verdict **materializes in-tree** (ruling 5) as committed prose
   (a docstring on `ChromeDock.vue` or a `loop/` note) stating KEEP + the recut shape.
   P5 pass-2 owns it. Dock BEHAVIOR changes still belong in glass-ui root (standing
   memory rule).
2. **`orbital-drag/index.ts` barrel purity** — DONE in P5's worktree (re-export-only
   barrel, bodies → `constants.ts`, `types.ts` folded, self-barrel cycle killed) and
   ratified. P2's `types.ts` FOLD converges on the SAME `constants.ts`: P5's landed
   shape is the reference; P2 replicates it identically so the eventual ratified wave
   has one shape, not two competing `constants.ts` layouts.
3. **`demo/DESIGN.md`** — KEEP, as SPEC-B1 ruled; it absorbs the ~10-line demo
   orientation tree when `demo/CLAUDE.md` deletes (§5), which P3 pass-2 must actually
   execute (pass 1 deleted without re-homing). Owner confirm still rides §9.
4. **Scene keys** — resolved by §3's measured table: ALL THREE pure-id keys
   (`cube/square/amigaKeys`) are multi-consumer registry-id contracts → KEEP
   (ruling 2). The InjectionKey-bearing keys keep with DECLARED context interfaces
   (G9) — `springKeys.ts` already converted in P5 (done, correct); the remaining two
   (`easing`, `sequence`) convert in U.B's drive.
5. **The P5 trio naming, RATIFIED (ruling 7 — one name set, committed).** The trio is
   **`ChannelGroup`** (container — a set of transport channels; drives and mirrors the
   library's `AnimationGroup`) / **`ChannelControls`** (per-channel host — kept) /
   **`ChannelOptions`** (per-channel options form — kept). Grounded in the existing
   `TransportChannel` domain type (`transport/transportSource.ts:24`); reads
   Group/Controls/Options, all Channel-prefixed; no "Control" echo, no stutter. The
   runner-up `TransportChannels` was rejected (collides visually with the enclosing
   `transport/` directory); the host is NOT renamed (`ChannelSurface`/`ChannelPanel`
   buy nothing). One rename: `control-suite/` → `channel-group/`. **No later lane
   re-litigates this name.**
6. **The P3↔P6 README single-owner split (new; rulings 4+5 escalated).** Both pass-1
   prototypes rewrote the same README sections — the triplication failure generalized
   across prototypes. Resolution, binding on pass 2: **P6 owns the README artifact in
   full.** P3's charter is inline docstrings + gate deaths + demo/DESIGN re-home + the
   fold-map; its ONLY README edit is the dead-link removal that must ride the deletion
   commit (so `proof:readme-paths-live` never reds mid-sequence). Every other README
   delta P3 surfaces (the drag2D LIGHT clarification et al.) is handed to P6, which
   absorbs it.

---

## §5 — The CLAUDE.md total-removal plan, as amended

The three-stage protocol (REDISTRIBUTE → re-home reader gates → DELETE last, same
commit as the README edits) carries from SPEC-B1 §5 unchanged, with the stage-2 gate
surgery **already executed and ratified** in P3's worktree (claude-paths-live deleted
whole; proof:engine re-pointed; published-surface (e) split; drag2d (a) reads dropped;
no-dead-dependency trimmed; five comment mentions scrubbed). The amendments:

**A. The explicit per-file DELETE rows (PASS-1 flagged the missing root row):**

| file | ruling |
|---|---|
| `./CLAUDE.md` (root, 118 lines) | **DELETE after re-home** — its load-bearing content (build table → package.json is authority; the two-"in"s boundary prose → `index.ts`/`load-engine.ts`/`public.ts` docstrings + README; the project tree → README §Structure; conventions → tsconfig/.prettierrc are authority) rides the same fold-map |
| `src/animation/CLAUDE.md` (395) | **DELETE after re-home** (unchanged) |
| `demo/CLAUDE.md` (126) | **DELETE after re-home** (unchanged; the re-home is pass-2 work — see C) |

**B. The redistribute, corrected by measurement.** PASS-1's twelve-file "no inline
home" list was wrong for nine of them (they already carry file-level docstrings from
prior tranches). The genuinely home-less files are exactly THREE:
`compile/backward/format.ts` (the `@keyframes` body/block serializer — path becomes
`compile/emit/format.ts` if P1 lands first; write to whichever path is live),
`physics/morph.ts` (`ElementMorph`), `physics/playback.ts` (`RAFPlayback`). The
deleted "Classes + primitives" prose for the latter two is the content to fold. Do NOT
re-add docstrings to the nine that have them. The narrowing strengthens the case for
doing the redistribute precisely rather than betting it away.

**C. The demo re-home, still owed (a straight OD-U1 zero-loss violation in pass 1):**
the ~10-line orientation tree → `demo/DESIGN.md`; the Scenes table →
`app/scene/scenes.ts` docstring; the `markRaw`/Euler/suppression idiom notes →
docstrings at their owning composables. Deleted-without-a-home is not a ruling.

**D. The barrel-inventory decision (the README-claim fork).** The deleted Zone map's
per-file inventory was routed to "each zone's barrel docstring," but the eleven
barrels still carry R.W1 zone SUMMARIES, and pass-1's README asserts an inventory that
does not exist — fresh doc-rot minted by the anti-rot work. P3 pass-2 DECIDES and
EXECUTES one branch:

- **(a) populate:** fold the per-file lines into each zone barrel's docstring — the
  README "inventory" sentence hardens as written; or
- **(b) the KISS argument:** record the explicit per-zone argument in the fold-map
  (summaries suffice; per-file lists rot on the first carve), and P6's §Structure
  sentence softens to the demonstrably-true form: *"Each zone's barrel docstring
  documents its shape; each class carries its contract in its own source."*

Silence is not a ruling. P6's sentence tracks P3's decision (ruling 4).

**E. The fold-map is a committed artifact (ruling 5):**
`docs/tranches/U/loop/P3-FOLD-MAP.md` — one row per load-bearing claim in all three
deleted files, each mapping to its new home (file + anchor) or an explicit
"DROPPED — reason." OD-U1's zero-loss burden is proven by this artifact, not asserted.

**F. Sequencing (ruling 4, hard constraint):** **P6 lands AFTER P3.** The README's
inventory sentences are target-shape evidence only until P3's stage-1 redistribute
populates the barrels or records the KISS argument. P1's two stale doc-tree line
fixes (`CLAUDE.md:44`, `src/animation/CLAUDE.md:128-129`) are MOOT if P3's deletions
land first — P1 fixes them only if P3 has not; a merge-order note, not a deliverable.

**The README target shape carries from SPEC-B1** (§Structure zone tree;
bumpLayoutEpoch §Units paragraph; managed-child §AnimationGroup line; boundary prose
absorbed; net growth ≤ ~40 lines) with two pass-2 refinements: the light/heavy
boundary is stated ONCE (the §dynamic-engine home; §Structure carries a one-line
pointer, not a framing paragraph), and the two intended DUAL homes are protected from
over-zealous de-duplication — `bumpLayoutEpoch` lives in BOTH `interpolate.ts` (the
source seam) and README §Units (the public consumer obligation); managed-child lives
in BOTH `group.ts` (authoritative) and one README line. Different audiences; keep
both; they must not drift.

---

## §6 — The suppression-removal plan, as amended

SPEC-B1 §6 carries forward whole — deliverable 1 (the known-violations kill) is
**executed and ratified at 95%** in P4's worktree: baseline deleted, `--ignore-known`
dropped everywhere, all eight references un-wired, the planted-cycle self-check still
reds, the vestigial `count < 15` clause retired in-commit (G12, done well), the false
"recorded in the BASELINE" sentence struck. `npm run lint` is now plain
`depcruise src`, green over 131 modules / 578 deps with zero violations and no
baseline — any future baseline is a regression, not a convenience. Amendments:

1. **Cogency rider on deliverable 1 (ruling 6).** The un-wire narrates the
   Q.WA1→R.W1→U genealogy four times (the `proof-lint-clean.mjs` header, the
   `.dependency-cruiser.cjs` no-cycle comment, the two precedent citations at
   `proof-any-ceiling.mjs:35` / `proof-no-dead-export.mjs:34`). A gate comment states
   what the gate verifies NOW ("no baseline; every cycle reds directly"); the lineage,
   if worth keeping, lives once in the wave record. Distill all four.
2. **Deliverables 2–4 are OPEN and are P4's pass-2 charter** (§8.4): the remaining
   dead `eslint-disable` directives (2 at last count) + the visual-lock `_diff/`
   vestige (44 PNGs of a gate retired at T.M3); the any-ceiling calibration slice; the
   `vjL2LinearLanded` skip resolution.
3. **The `proof:no-dead-export` backlog exit is now DEFINED (G13):** all 17 reflexive
   composable-type rows die by deleting the `export` keyword as U.B recuts each
   composable; the DEFERRED array + gate machinery delete when empty. Re-anchoring
   rows to new paths is no longer an accepted disposition — it was correct for P5
   pass-1's scope, and is superseded.
4. **G12 is the standing form of the "same-commit" rule** — the two named
   applications in §1 land in P2's delete commit; every future fold checks its own
   gate shadow.

---

## §7 — What SPEC-B2 amends over SPEC-B1 (the reconciliation record)

**Confirms (no change):** everything §7 of SPEC-B1 confirmed — the full U.C and U.B
wave sets, the ratified terminals, OD-U8's additive-only 5.3.0 bind, the anti-sprawl
covenant (zero new standalone gates; clauses on existing gates, born-RED first). Plus,
newly ratified AS BUILT from pass 1: the `compile/easing/` carve, the
`constants/index.ts` delete + 57-importer retarget, P3's stage-2/3 gate surgery and
deletions, P4's deliverable-1 kill, P5's trio re-cut seam + orbital-drag barrel purity
+ springKeys conversion, P6's README artifact body.

**Amends (each with its authority):**

1. **§0 glossary added**; SPEC-B1's "plain language" banner is now honest (ruling 6 /
   `pass2-research-spec-questions.md` (d)).
2. **G11 fold-time adjudication** added as general law; the three sceneKeys + the two
   §3 conditionals resolved by measurement — six INLINE verdicts flip to KEEP
   (ruling 2; research §B.3).
3. **G12 dead-gate-retire** added; two named applications land in the P2 delete
   commit (ruling 3; research (c)).
4. **G13 stay-local composable types** added; the no-dead-export backlog gains a
   defined exit; barrel-laundering forbidden (ruling 8; research (a)).
5. **The §2 backward→emit row SPLIT**: rename + move-in = pure move NOW; refusal-probe
   interiors stay U.C9 (ruling 1). The JUSTIFIED entries **RE-KEY, not retire** —
   correcting PASS-1's own wording (research §A.4).
6. **§3's inline list replaced by the measured table** (4 execute / 6 KEEP).
7. **Root `./CLAUDE.md` gains its explicit DELETE-after-rehome row** (PASS-1 flagged
   the omission).
8. **The redistribute scope corrected by measurement**: three genuinely home-less
   files, not twelve (research §1.4).
9. **The trio name RATIFIED**: ChannelGroup / ChannelControls / ChannelOptions
   (ruling 7; research §2.2).
10. **The P3↔P6 README single-owner split** + the **P6-after-P3 hard sequencing
    constraint** (rulings 4+5; research §5).
11. **The in-tree artifact rule and the charter-surface scoring rule** promoted to
    spec law (ruling 5 + the PASS-1 standing rule).

---

## §8 — The six pass-2 iteration charters (step 3 of pass 2)

Common law, carried and extended: each prototype **ITERATES on its existing worktree —
none restart**; branches are EVIDENCE, never merged; ring-fences hold (LIGHT/HEAVY
hard; 11-zone map fixed; two entries fixed; test mirror); additive-only under the
5.3.0 bind; ZERO new standalone gates; every path-literal gate re-anchors in the same
motion as any move (G10) and every mooted clause retires in the same commit (G12).
NEW common law: every chartered verdict/analysis lands IN-TREE at the path its charter
names (ruling 5); convergence % is scored against THIS spec's charter surface
(the standing rule); the hard half executes first.

### P1 — `compile-easing-carve` (iterate)
**Worktree:** `/Users/mkbabb/Programming/keyframes.js/.claude/worktrees/wf_ca7d0632-287-10`
**Remaining work (research §A / work order 1–8):**
1. Keep the built easing carve untouched — ratified, do not redo.
2. Execute the pure move: three `git mv`s — `compile/backward/` → `compile/emit/`
   (8 files, filenames unchanged), `entry.ts` and `view-transition.ts` into `emit/`.
3. Re-point the two movers at the real sibling FILES inside `emit/` (never the `emit/`
   barrel) — the ratified self-cycle idiom, reused verbatim.
4. Re-anchor every path literal in the SAME commit per the §A.3 blast-radius map:
   `compile/index.ts` (3 re-export blocks + entry/vt blocks + docstring),
   `load-engine.ts` (3 type-imports + header roster line), `public.ts` (3),
   `index.ts` barrel, the orchestration view-transition references (verify LIGHT-twin
   vs compile literal), the 9 test files, and the gates:
   `proof-compile-backward-leg.mjs` (path const + basenames + message strings +
   clause-1 wording + plant paths — verify the plants still bite),
   `proof-compile-replay.mjs`, `proof-engine.mjs`, `proof-replay-equality.mjs`,
   `proof-entry-roundtrip.mjs`, `proof-vt-roundtrip.mjs`.
5. RE-KEY (not retire) the two zone-cohesion JUSTIFIED entries to the `emit/` paths;
   state the §2 correction in the report.
6. Verify: a18 re-anchored FORWARD↔`emit/` (the gate keys off the seam, not the
   filename); compile round-trip goldens byte-identical; `proof:boundary` green;
   circulars at zero.
7. Emit the completed gate-re-anchor template IN-TREE:
   `docs/tranches/U/loop/P1-REANCHOR-TEMPLATE.md` (the full §A.3 manifest, easy case +
   hard case) — this is P1's core deliverable, the template every later carve follows.
8. Do NOT build the refusal-probe interiors (note seams, defer to U.C9). Fix the two
   stale doc-tree lines ONLY if P3 has not deleted those files.
**Convergence bar:** 100% = all three chartered moves live and green + the template
in-tree + the re-key correction stated. Scored against this charter, not a narrowed one.

### P2 — `small-module-inline-sweep` (iterate; demo half greenfield in-worktree)
**Worktree:** `/Users/mkbabb/Programming/keyframes.js/.claude/worktrees/wf_ca7d0632-287-11`
**Remaining work (research §B / work order 1–5):**
1. Complete the library fragment: keep the `constants/index.ts` delete + retarget; ADD
   in the same commit the two G12 retirements — `proof:boundary` assertion 6 (keep its
   live sibling clauses: the `constants/types.ts` purity file-clause + the
   light-imports-defaults check) and the `proof:zone-cohesion` `allowedBarrelDirs` +
   success-line amendment.
2. Execute the FOUR §3 executables on the pre-dissolution tree: (a) INLINE
   `matrix-editor/index.ts` (both consumers → `MatrixEditor.vue`); (b) FOLD
   `orbital-drag/types.ts` → `orbital-drag/constants.ts`, replicating P5's landed
   shape (ONE constants.ts — §4.2); (c) FOLD `timeline/timelineTypes.ts` →
   `timeline/constants.ts` (9 importers retarget); (d) DELETE the zero-consumer
   `instrument/index.ts` umbrella.
3. KEEP the six flips and RECORD each with its measured count (re-verify at fold time
   per G11): cubeKeys (2), squareKeys (2), amigaKeys (3), contenteditable (2),
   flattenVars (2), rafConstants (2 — record the U.B3 dependency, do not build U.B3).
4. Verify zero behavior change: vitest green through every fold; `npm run gh-pages`
   build green.
5. Commit the per-file fold map IN-TREE: `docs/tranches/U/loop/P2-FOLD-MAP.md` — the
   measured counts, the executed verdicts, the six KEEP flips with reasons, and any
   G3/G9/G11 rule refinement the counts surfaced.
**Convergence bar:** 100% = library fragment + guards retired in-commit + all four
demo executables green + all six KEEPs recorded + fold map in-tree.

### P3 — `claudemd-fold` (iterate)
**Worktree:** `/Users/mkbabb/Programming/keyframes.js/.claude/worktrees/wf_ca7d0632-287-12`
**Remaining work (research §1 / work order 1–5):**
1. Produce `docs/tranches/U/loop/P3-FOLD-MAP.md` — claim-by-claim for ALL THREE
   deleted files, home or "DROPPED — reason" per row (OD-U1 zero-loss, ruling 5).
2. Decide AND execute the barrel-inventory fork (§5.D): populate the eleven zone
   barrels, or record the per-zone KISS argument in the fold-map and hand P6 the
   softened sentence. Do not leave barrels summary-only under an "inventory" README claim.
3. Add file docstrings to exactly the three home-less files (`format.ts` at its live
   path, `physics/morph.ts`, `physics/playback.ts`), folding the deleted ElementMorph
   / RAFPlayback prose. Do NOT re-docstring the nine files that already have them.
4. Re-home demo/CLAUDE.md content (§5.C): orientation tree → `demo/DESIGN.md`; Scenes
   table → `app/scene/scenes.ts` docstring; markRaw/Euler/suppression idioms → their
   owning composables' docstrings.
5. Honor the README single-owner split (§4.6): keep ONLY the dead-link removal; hand
   every other README delta to P6. Correct the drag2d born-RED comment overstatement
   (PASS-1 focus table).
**Convergence bar:** 100% = fold-map complete + the fork decided-and-executed + three
docstrings + demo re-home + README ownership honored. The stage-2/3 gate surgery is
already ratified — do not re-touch it.

### P4 — `known-violations-fix` (iterate)
**Worktree:** `/Users/mkbabb/Programming/keyframes.js/.claude/worktrees/wf_ca7d0632-287-16`
**Remaining work (research §3 / work order 11–14):**
1. Distill the genealogy prose (ruling 6) in all four homes — `proof-lint-clean.mjs`
   header, `.dependency-cruiser.cjs` no-cycle comment, `proof-any-ceiling.mjs:35`,
   `proof-no-dead-export.mjs:34` — to the present-tense invariant.
2. Deliverable 2: delete the remaining dead `eslint-disable` directives + the
   `scripts/baselines/visual-lock/_diff/` vestige (44 PNGs).
3. Deliverable 3: type the U.B4 editor-boundary any-seam slice; lower the ceiling by
   the slice with the ratchet's equality rule satisfied; report per-seam cost
   (answers §9 Q5: in-drive sweep vs own wave) — commit the cost table in-tree
   (`docs/tranches/U/loop/P4-ANY-CALIBRATION.md`).
4. Deliverable 4: resolve `vjL2LinearLanded`/`skipIf`
   (`test/compile/roundtrip-easing.test.ts:164,170`) against the live value.js edge —
   un-skip if VJ-L2 landed; else an explicit deadlined covenant row in U.F's letter.
   No silent conditional skip survives.
5. Confirm the flat-siblings→lint-clean cross-gate handoff is asserted once in the
   wave spec.
**Convergence bar:** 100% = all four deliverables discharged + cogency distilled +
full roster green with the strictness gain intact.

### P5 — `demo-component-recut` (iterate)
**Worktree:** `/Users/mkbabb/Programming/keyframes.js/.claude/worktrees/wf_ca7d0632-287-17`
**Remaining work (research §2 / work order 6–10, amended by G13):**
1. Rename `control-suite/` → `channel-group/`, `ControlSuite` → `ChannelGroup`
   (the §4.5 ratified trio; host and options form keep their names).
2. Apply G13 instead of re-anchoring: drop the `export` on the trio's reflexive
   composable Deps/Return/Options types and DELETE the 8 allowlist rows (they die by
   fixing, not by re-anchor — supersedes P5 pass-1's re-anchor disposition).
3. Commit the G6 boundary paragraph in-tree (ruling 5): the trio's responsibility seam
   justified with prop clusters named — as a docstring on `ChannelGroup.vue` or
   `docs/tranches/U/loop/P5-BOUNDARY.md`.
4. Commit the dock KEEP verdict in-tree (§4.1): KEEP + the recut shape, as prose on
   `ChromeDock.vue` or the same loop note.
5. Tighten `ChannelOptions.progress?: number` → `progress: number` (always
   host-provided).
6. Score the 477-line `ChannelControls` host's own cohesion: decompose on a real
   Hidden-Components seam or justify KEEP in the boundary note — silence is not a ruling.
**Convergence bar:** 100% = rename landed + rows deleted per G13 + both verdicts
in-tree + progress tightened + the host scored, all green (vitest, tsc, gh-pages).

### P6 — `readme-redesign` (iterate, small; LANDS AFTER P3 — ruling 4, hard constraint)
**Worktree:** `/Users/mkbabb/Programming/keyframes.js/.claude/worktrees/wf_ca7d0632-287-18`
**Remaining work (research §4 / work order 15–17):**
1. Track P3's barrel-inventory decision on the §Structure sentence: harden if P3
   populates; soften to "documents its shape … each class carries its contract" if P3
   records the KISS argument.
2. State the light/heavy boundary ONCE (§dynamic-engine home); reduce §Structure to a
   one-line pointer. KEEP the two intended dual homes (bumpLayoutEpoch §Units;
   managed-child §AnimationGroup) — they are dual-audience, not triplication.
3. Absorb P3's README delta (drag2D LIGHT clarification et al.) so P6 is the sole
   README author; confirm the tree's `easing.ts`/`validate.ts` omission is an accepted
   overview simplification, noted in P3's fold-map.
4. Both README gates (`proof:readme-runs`, `proof:readme-paths-live`) green against
   the final artifact; net growth ≤ ~40 lines holds.
**Convergence bar:** 100% = the three reconciliations executed + gates green + the
sequencing constraint honored (P6's artifact reflects P3's actual landed state, not a
forward promise).

---

## §9 — Questions the pass-2 critique fleet must score (step 4)

1. **The zone-barrel timing cost** (carried from B1 §9.1) — P1's hard-case move now
   gives the second measured data point; still a measured decision, not ideology.
2. **`drag/draggable.ts` KEEP** — carried; overturnable only with a concrete
   two-identity seam proposal.
3. **The trio boundary as re-cut by P5** — score the landed seam AND the 477-line host
   verdict against G6/Hidden-Components.
4. **`warmEngine`** — carried; P3/P6 note whether any doc still advertises it.
5. **The any-sweep schedule** — P4's calibration slice ANSWERS this; score the
   answer's evidence, then SPEC-B3 (or the wave set, if converged) schedules it.
6. **DESIGN.md KEEP + the `@`-dissolution confirm** — both still ride to the owner
   with pass-2 results; the ChannelGroup name joins them ONLY if the fleet finds it
   unconverged (it is ratified here — §4.5).
7. **G13's barrel corollary** — verify no pass-2 worktree launders a type through a
   composables barrel to green the gate.
8. **G11's counts** — spot-check the six KEEP flips' importer counts at the fold
   commits; a stale count voids the verdict it produced.
