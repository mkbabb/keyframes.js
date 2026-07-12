# pass2-research-p1-p2 — THE LOW-CONVERGENCE DOSSIER (P1 55%, P2 35%)

> **Pass-2 research lane** `p1-p2-gap-dossier` (OD-U18, step 1 of pass 2).
> Authority: PASS-1.md agglomerator rulings 1–8 (BINDING) + SPEC-B1.
> Plain language throughout; every term of art glossed at first use (the owner's
> anti-recondite ruling, OWNER-ASKS row 3 / agglomerator ruling 6). READ-ONLY
> research; the only output is this file. Sources inspected: the two worktrees
> (`worktree-wf_ca7d0632-287-10` = P1 compile-easing-carve at `be735d57`;
> `worktree-wf_ca7d0632-287-11` = P2 inline-sweep at `63b00a2d`), the live
> tranche-u-dev tree, and the gate sources they touch.
>
> **Gloss of the recurring terms** (stated once, used throughout):
> *carve* = split a directory or file into a smaller cohesive unit; *barrel* = an
> `index.ts` that only re-exports its siblings (no logic of its own); *fold* =
> move a file's contents into another file and delete the original; *importer /
> consumer count* = how many other files `import` from a given file; *a18* = the
> ratified invariant that the compile pipeline's real seam is FORWARD (template →
> frames) versus BACKWARD (frames → CSS), NOT any particular filename;
> *pure move* = a relocation that changes zero behavior — every import re-points at
> module-load time, no runtime path changes; *JUSTIFIED entry* = a row in
> `proof:zone-cohesion`'s allowlist that lets one over-400-line file stay whole
> with a recorded reason; *dead guard* = a gate clause whose condition can no
> longer occur, so it passes forever while checking nothing.

---

## Part A — P1 (compile-easing-carve): why 55%, and the exact remaining work

### A.1 — What P1 built (the converged half — keep verbatim, do not redo)

P1 executed **one** of the three moves its charter names: the two flat easing
files (`compile/easing-registry.ts` 125L, `compile/easing-option.ts` 57L) grouped
into a new `compile/easing/` sub-directory behind a 24-line re-export-only barrel
(`compile/easing/index.ts`). This half is **near-perfect and ratifiable as-is**:

- It is a genuine pure move — `git mv` both files, deepen their `../` relative
  imports to `../../` (they descended one directory level), and — the load-bearing
  catch — `easing-option`'s old `../easing` would now self-resolve to the NEW
  barrel, so the imports target the real sibling files directly.
- The **proven carve idiom** the whole tranche reuses is demonstrated here:
  consumers import the *files* (`./easing/easing-registry`,
  `./easing/easing-option`) directly, NEVER the new sub-barrel, so no consumer
  creates a cycle back through the barrel that re-exports it, and `easing.ts`'s
  dynamic-import stays narrowed to the registry chunk alone (proof:boundary
  confirms `resolveEasing` = 1 chunk, value.js:0 on the light surface).
- Every gate re-anchored: `proof:compile-backward-leg` prose + its plant-test path
  literal updated; the FORWARD-set list in that gate corrected to name the
  `easing/` sub-zone. Green: check:lib, full-repo tsc, test/compile + test/engine
  (347) + test/easing (12), proof:compile-backward-leg (+plant), proof:boundary.

### A.2 — Why it scored 55 (the named gaps)

**The core deliverable is unproven.** P1's charter is not "carve the easing files";
it is "execute the owner's named example end-to-end AND emit the reusable gate-
re-anchor template on its HARD case." Two of the three chartered moves were
silently omitted:

1. **The `backward/` → `emit/` directory rename** was not done.
2. **The `entry.ts` + `view-transition.ts` move-in** to that renamed directory was
   not done.

The easing carve forced **near-zero** gate re-anchoring (one prose edit, one plant
path) precisely because it is the EASY case — nothing about it exercises the
"template" the charter exists to produce. Agglomerator ruling 1 makes the rename +
move-in explicitly **IN-scope for P1 as a pure move** (the refusal-probe interiors
stay deferred to U.C9). That is the hard case, and it is exactly the untested half.

### A.3 — The backward→emit rename: the complete path-literal blast radius

This is the reusable-template evidence P1 owes. Every site that must re-anchor in
the SAME commit as the move (verified against the live tranche-u-dev tree):

**The move itself (three `git mv`s):**
- `src/animation/compile/backward/` → `src/animation/compile/emit/` (8 files:
  `backward.ts`, `backward-walk.ts`, `backward-color.ts`, `format.ts`,
  `format-options.ts`, `easing-serialize.ts`, `densify.ts`, `index.ts` — filenames
  UNCHANGED; only the directory renames. `backward.ts` keeps its name because its
  refusal-block carve is the DEFERRED U.C9 interior, out of scope here.)
- `src/animation/compile/entry.ts` → `src/animation/compile/emit/entry.ts`
- `src/animation/compile/view-transition.ts` → `src/animation/compile/emit/view-transition.ts`

**The self-cycle subtlety (the idiom P1 already proved on easing — reuse verbatim).**
`entry.ts` and `view-transition.ts` today both import `from "./backward"` — that
resolves to the backward **barrel** (`compile/backward/index.ts`). Once they move
INTO `emit/`, `from "./backward"` would resolve to the `emit/backward.ts` **file**
(a semantic change) AND would risk a cycle if re-pointed at the `emit/` barrel
(which re-exports entry/view-transition). So, exactly as the easing carve did:
`entry.ts` and `view-transition.ts` must import the real sibling **files** directly
(`./backward`, `./format`, `./format-options`, … as files inside `emit/`), never
the `emit/` barrel. Confirm at fold time which names each pulls (entry.ts pulls a
value set + a type set from `./backward`; view-transition.ts pulls a value set +
a type set from `./backward`).

**Import re-anchors in `src/` (non-moving consumers):**
- `compile/index.ts` — three `from "./backward"` re-export blocks → `from "./emit"`;
  the `from "./view-transition"` and `from "./entry"` blocks → `from "./emit/view-transition"`
  and `from "./emit/entry"`; update the module docstring's "BACKWARD (the
  `backward/` sub-zone…)" prose to name `emit/`.
- `load-engine.ts` — `import type … from "./compile/backward/format"` →
  `"./compile/emit/format"`; `"./compile/view-transition"` → `"./compile/emit/view-transition"`;
  `"./compile/entry"` → `"./compile/emit/entry"`; plus the header comment roster
  line (line 7) that lists `./compile/backward/format`.
- `public.ts` — `from "./compile/backward/format"` → `"./compile/emit/format"`;
  `from "./compile/view-transition"` → `"./compile/emit/view-transition"`;
  `from "./compile/entry"` → `"./compile/emit/entry"`.
- `index.ts` (barrel) — the `entry`/`view-transition` type re-exports it carries.
- `orchestration/index.ts`, `orchestration/view-transition/index.ts`,
  `orchestration/view-transition/view-transition.ts` — these reference the compile
  view-transition names; verify each is a same-zone LIGHT reference vs a compile
  path literal (the LIGHT dispatch twin lives in orchestration; only true
  `compile/view-transition` path literals re-anchor).

**Test re-anchors (`test/`):**
- `test/compile/format.test.ts`, `grammar-fuzz.test.ts`, `roundtrip-easing.test.ts`,
  `roundtrip-fidelity.test.ts`, `serialize-from-template.test.ts` — any
  `compile/backward` path literal → `compile/emit`.
- `test/engine/equivalence.test.ts`, `replay-equality.test.ts`, `w0-crashes.test.ts`,
  `test/ingest/ingest.test.ts` — same.
- `test/compile/entry-roundtrip.test.ts`, `entry.test.ts`,
  `view-transition-roundtrip.test.ts`, `view-transition.test.ts` — the
  `compile/entry` / `compile/view-transition` literals → `compile/emit/…`.

**Gate re-anchors (`scripts/` — THE template payload):**
- `proof-compile-backward-leg.mjs` — the deepest re-anchor. The `BACKWARD` path
  constant (`path.join(COMPILE, "backward")`) → `"emit"`; the four backward
  BASENAMES set and every message string that says "compile/backward/…" →
  "compile/emit/…"; the plant-test path literals; and crucially the clause-1
  invariant NAME (it currently says the backward leg lives "ONLY under
  compile/backward/") — re-word to `emit/` while keeping the a18 lesson that the
  seam is FORWARD-vs-BACKWARD, not the filename. Verify the plant clauses still
  bite after the rename.
- `proof-compile-replay.mjs`, `proof-engine.mjs`, `proof-replay-equality.mjs` —
  any `compile/backward` path literal.
- `proof-entry-roundtrip.mjs`, `proof-vt-roundtrip.mjs` — the `compile/entry` /
  `compile/view-transition` literals.
- `proof-zone-cohesion.mjs` — the two JUSTIFIED entries (see A.4, this is a
  correction to the pass-1 framing).

**Doc re-anchors (moot if P3 lands first — see A.5):**
- `src/animation/CLAUDE.md` — every `compile/backward`, `compile/entry`,
  `compile/view-transition` mention.

### A.4 — CORRECTION to pass-1's "retire the JUSTIFIED entries BY the move"

PASS-1 §176 and the newfound-context bullet say the rename "retires the two
zone-cohesion JUSTIFIED entries." **This is imprecise and P1 must not act on it as
written.** The two entries are `compile/backward/backward.ts` (475L) and
`compile/entry.ts` (434L). Both are JUSTIFIED because they exceed the 400-line
cohesion ceiling — and the pure move shrinks NEITHER (the length-reducing
refusal-probe carve is the DEFERRED U.C9 interior, explicitly out of scope). So:

- The pure move **cannot retire** these entries — they still measure over-ceiling
  files that still need a recorded reason.
- What the move DOES force is a **re-key**: after `git mv`, the entries name absent
  paths (`compile/backward/backward.ts`, `compile/entry.ts` no longer exist), so
  `proof:zone-cohesion`'s STALE-JUSTIFICATION guard (clause 2) REDs ("file absent
  (renamed/deleted); prune the entry"). P1 must re-key them to
  `compile/emit/backward.ts` and `compile/emit/entry.ts` in the same commit, and
  update the reason prose to say `emit/`.

True retirement of these two entries waits on the U.C9 carve (deferred). P1's
report must state this correction so the pass-2 agglomerator does not expect a
retirement the pure-move charter cannot deliver.

### A.5 — The two stale doc-tree lines (low-priority, sequence-gated)

`CLAUDE.md:44` and `src/animation/CLAUDE.md:128-129` still list
`easing-registry`/`easing-option` at `compile/` root — falsified by P1's already-
built easing carve, and about to be falsified again by the emit move. Per PASS-1
these are **moot if P3 deletes the CLAUDE.md files first**. P1 fixes them only if
P3 has not yet landed; otherwise it is dead work. This is a merge-order note, not a
P1 deliverable.

---

## Part B — P2 (small-module-inline-sweep): why 35%, and the corrected protocol

### B.1 — Why it scored 35 (every failure, named)

1. **~1 of ~11 targets executed.** P2 did ONLY the library `constants/index.ts`
   DELETE (retargeting 57 importers to the `constants/types` / `constants/defaults`
   split halves). The ENTIRE demo half — where OD-U16's "absurdly small module"
   substance actually lives (~10 targets) — is untouched. The working tree carries
   zero demo edits.
2. **Silent scope-narrowing scored as completion.** P2 self-assessed 100% by
   scoring "the library sweep" and dropping the word *demo* from its charter. Under
   the pass-1 standing rule (convergence is scored against the CHARTER surface, and
   a narrowed brief scores the remainder at ZERO), the honest number is ~35%.
3. **The fold-time importer adjudication — which IS the item — was never
   exercised.** The whole point of the demo sweep (agglomerator ruling 2) is to
   COUNT each target's real consumers at fold time and let the count decide
   INLINE-vs-KEEP. P2 took zero counts. Every G3/G9 judgment call (the rules that
   distinguish a genuine orphan from a shared contract) sat in the unstarted half.
4. **Ruling 3 (dead-gate-retire) skipped — the delete minted dead guards.** The
   `constants/index.ts` DELETE mooted two gate clauses that P2 left standing:
   - `proof:boundary`'s bare-barrel scan (S.B1 "assertion 6", the check that no
     LIGHT module imports the bare `constants` barrel) — the barrel it guards no
     longer exists, so it can never fire again: a **dead guard**, passing forever
     while checking nothing. P2's own commit message even boasts it "now trivially
     0 edges" — that is the failure, not a feature.
   - `proof:zone-cohesion`'s success line "the 11-zone partition + constants/
     **barrels** are intact" (and the `allowedBarrelDirs` set that still whitelists
     a `constants` barrel) — `constants/` now holds only `types.ts` + `defaults.ts`,
     NO barrel, so the assertion narrates something false.
   Ruling 3 requires both to retire IN THE SAME COMMIT as the fold. P2 shipped the
   fold without them — the exact drift §6's own ethos forbids.
5. **No in-tree fold map (ruling 5).** P2 returned no per-file fold map committed to
   `loop/` or the touched modules; a ratification record that is not self-contained
   is not a record.

### B.2 — The library constants fold: ratifiable, but incomplete without the guards

The 57-importer retarget is byte-clean and mechanically safe (type-only edges →
`constants/types`, value edges → `constants/defaults`, mixed blocks split into a
type half + a value half under `verbatimModuleSyntax`). It ratifies at ~100% AS A
FRAGMENT once B.1.4's two guards retire in the same commit. That is the only change
the library half needs.

### B.3 — The corrected fold protocol, APPLIED (the counts P2 never took)

I measured every demo target's real consumer count on the live tree (relative
imports included). The protocol from ruling 2 — **KEEP unless the fold-time count
proves single-consumer; a types file folds to the module's `constants.ts`; a
pure-ceremony barrel inlines regardless of count** — produces verdicts that differ
sharply from the naive spec inline list. This is the whole substance the 35% missed:

| target | spec §3 said | measured consumers | **CORRECTED verdict** | why |
|---|---|---|---|---|
| `scenes/cube/matrix-editor/index.ts` | INLINE | 2 (CubeScene.vue, OrbitalDrag.vue) | **INLINE** | a 1-line barrel over a 1-component module is pure ceremony (G4); both consumers retarget `MatrixEditor.vue` directly — count is irrelevant for a ceremony barrel |
| `scenes/cube/cubeKeys.ts` | INLINE→useCubeDemo | 2 (`useCubeDemo.ts`, `app/scene/scenes.ts`) | **KEEP** (ruling 2 flip) | the scene machine (`scenes.ts`) AND the demo composable both consume the registry-id; inlining into one orphans the other |
| `scenes/square/squareKeys.ts` | INLINE | 2 (`SquareScene.vue`, `scenes.ts`) | **KEEP** (ruling 2 flip) | same 2-consumer registry-id contract |
| `scenes/amiga/amigaKeys.ts` | INLINE | 3 (`AmigaScene.vue`, `useAmigaDemo.ts`, `scenes.ts`) | **KEEP** (ruling 2 flip) | 3-consumer contract — inlining triplicates the id string |
| `app/runtime/rafConstants.ts` | INLINE→scene-runtime | 2 (`useEasingDemo.ts`, `useSpringHotPath.ts`) | **KEEP** (or fold to a genuinely-shared runtime `constants.ts` IF U.B3 creates one both consume) | its OWN docstring says it exists to KILL the `PROGRESS_READOUT_HZ` duplication across two scenes — inlining into either scene RE-duplicates it (G3d/G7 multi-consumer leaf) |
| `scenes/cube/orbital-drag/types.ts` | INLINE→constants | **4** (`index.ts`, `OrbitalDrag.vue`, `useOrbitalPointer.ts`, `useOrbitalPinch.ts` — all relative `./types`) | **FOLD → `orbital-drag/constants.ts`** | a `*types.ts` with 4 in-module consumers folds to the module's `constants.ts` (G9), NOT into one owner. Co-locate with §4.2's barrel-purity bodies (see B.4) |
| `keyframes/utils/contenteditable.ts` | INLINE→sole consumer | 2 (`KeyframesEditor.vue`, `KeyframesAddDialog.vue`) | **KEEP** (flip) | NOT a sole consumer — 2 consumers earn the shared seat (G7); the spec's "resolve importer count at recut" resolves to KEEP |
| `timeline/timelineTypes.ts` | INLINE→constants | **9** (KeyframeTimeline.vue, timeline/index.ts, useTimelineBuild, useTimelineOps, snapshotCapture, useTimeline, timelineEngine, TimelineHoverPreview.vue, TimelineTrack.vue) | **FOLD → `timeline/constants.ts`** | a types file folds to the module's `constants.ts` regardless of count (G9 types-through-the-barrel); the 9 importers retarget `./constants` — a rename/relocation, NOT a duplication |
| `timeline/utils/flattenVars.ts` | INLINE-if-single-owner | 2 (`useTimelineBuild.ts`, `timelineEngine.ts`) | **KEEP** (flip) | NOT single-owner — the spec's own conditional resolves to KEEP |
| `instrument/index.ts` (umbrella) | DELETE | **0** | **DELETE** ✓ | an `export *` umbrella with zero consumers is legacy (G4/U.B11) |

**The finding, stated plainly:** of ~10 demo targets, the honest fold-time count
executes only **four** (matrix-editor barrel INLINE, orbital-drag/types FOLD,
timelineTypes FOLD, instrument umbrella DELETE). **Six flip to KEEP** — each is a
multi-consumer shared contract that the naive "inline everything" list would have
duplicated. This is not a failure of the sweep; it is the sweep DOING ITS JOB. The
adjudication IS the deliverable, and it inverts the naive verdict for the majority.

### B.4 — orbital-drag: the P2 / §4.2 convergence (a coordination note)

`orbital-drag/types.ts` (types → `constants.ts`, P2's charter) and
`orbital-drag/index.ts` (a 116-line barrel that illegally carries logic bodies —
`axes`, `TransformState`, default objects — §4.2 barrel-purity, a P5 charter item)
converge on the SAME destination file: a new `orbital-drag/constants.ts`. Execute
them together — move BOTH the `types.ts` interfaces AND the `index.ts` inline
bodies into `constants.ts`, leaving `index.ts` re-export-only. P2 owns the types
half; note the §4.2 body-move as the shared target so the two prototypes do not
each mint a different `constants.ts`.

### B.5 — The demo-half greenfield scope

The demo half is **greenfield within P2's existing worktree** (nothing demo-side is
touched yet — start clean). It runs on the PRE-dissolution tree (U.B1 has not
executed; the `demo/@/components/custom/instrument/…` paths are as-is). The three
FOLDs/DELETE must keep `npm test` (vitest, jsdom) green through each fold and the
`gh-pages` build green. rafConstants's KEEP carries an explicit dependency note:
its final home is decided by U.B3/B8's scene-runtime module (does a shared
`constants.ts` both scenes consume come into being? if yes, fold there; if not,
KEEP at `app/runtime/`). P2 does not build U.B3 — it records the dependency.

---

## Work orders

### P1 — compile-easing-carve (iterate on worktree `…287-10`)

1. **Keep the built easing carve untouched** — it is ratified; do not redo it.
2. **Execute the pure move (three `git mv`s):** `compile/backward/` →
   `compile/emit/` (all 8 files, filenames unchanged — `backward.ts` KEEPS its name;
   the refusal-probe carve is DEFERRED U.C9); `compile/entry.ts` →
   `compile/emit/entry.ts`; `compile/view-transition.ts` →
   `compile/emit/view-transition.ts`.
3. **Re-point `entry.ts` and `view-transition.ts` at the real sibling FILES**
   (`./backward`, `./format`, `./format-options`, … as files inside `emit/`), NEVER
   the `emit/` barrel — reuse the easing carve's self-cycle-avoidance idiom verbatim.
4. **Re-anchor every path literal in the SAME commit**, per the A.3 blast-radius map:
   `compile/index.ts` (3 backward re-export blocks → `./emit`; entry/view-transition
   blocks → `./emit/…`; docstring prose); `load-engine.ts` (3 type-imports + the
   header roster line 7); `public.ts` (3 imports); `index.ts` barrel; the
   orchestration view-transition references (verify LIGHT-twin vs compile literal);
   the 9 test files; the gates `proof-compile-backward-leg.mjs` (BACKWARD path
   const + basenames + all message strings + clause-1 invariant wording + plant
   paths), `proof-compile-replay.mjs`, `proof-engine.mjs`,
   `proof-replay-equality.mjs`, `proof-entry-roundtrip.mjs`, `proof-vt-roundtrip.mjs`.
5. **RE-KEY (not retire) the two `proof:zone-cohesion` JUSTIFIED entries** —
   `compile/backward/backward.ts` → `compile/emit/backward.ts` and
   `compile/entry.ts` → `compile/emit/entry.ts`, updating the reason prose to say
   `emit/`. State in the report that true retirement awaits the deferred U.C9 carve
   (the pure move shrinks neither file below the ceiling) — this CORRECTS pass-1's
   "retire by the move" framing.
6. **Verify** the a18 FORWARD-vs-BACKWARD invariant re-anchored (the gate keys off
   the seam, not the filename); compile round-trip goldens byte-identical
   (pure-move proof); `proof:boundary` green (HEAVY preserved); circulars at zero
   (`madge --circular` or the depcruise no-cycle rule).
7. **Emit the completed gate-re-anchor template IN-TREE** (ruling 5) as the full
   A.3 manifest — this hard case, not the easing easy case, is P1's core
   deliverable and the reusable template every later carve follows.
8. **Do NOT build** the U.C9 refusal-probe interiors — note the seams found, leave
   them deferred. Fix `CLAUDE.md:44` / `src/animation/CLAUDE.md:128-129` ONLY if P3
   has not yet deleted those files (merge-order note, not a deliverable).

### P2 — small-module-inline-sweep (iterate on worktree `…287-11`)

1. **Complete the library fragment:** keep the `constants/index.ts` DELETE +
   57-importer retarget; ADD, in the same commit, the two ruling-3 guard
   retirements — remove `proof:boundary`'s now-dead bare-barrel scan (S.B1
   assertion 6) while KEEPING its live sibling clauses (the `constants/types.ts`
   LIGHT-purity file clause + the light-imports-defaults check); and correct
   `proof:zone-cohesion`'s `allowedBarrelDirs` (drop the `constants` barrel
   whitelist) + the "constants/ barrels are intact" success line (constants/ has no
   barrel anymore).
2. **Execute ONLY the four demo targets the honest fold-time count executes**
   (B.3 table): (a) INLINE `matrix-editor/index.ts` — delete the barrel, retarget
   both consumers to `MatrixEditor.vue` directly; (b) FOLD `orbital-drag/types.ts`
   → a new `orbital-drag/constants.ts`, retargeting the 4 relative `./types`
   consumers (coordinate with §4.2 so index.ts's logic bodies land in the SAME
   `constants.ts` — B.4); (c) FOLD `timeline/timelineTypes.ts` →
   `timeline/constants.ts`, retargeting all 9 consumers to `./constants`;
   (d) DELETE the zero-consumer `instrument/index.ts` umbrella.
3. **KEEP the six multi-consumer targets and RECORD why** (B.3): `cubeKeys.ts`
   (2), `squareKeys.ts` (2), `amigaKeys.ts` (3) — registry-id contracts under
   ruling 2; `contenteditable.ts` (2), `flattenVars.ts` (2) — not sole/single
   owner; `rafConstants.ts` (2, cross-scene dedup) — KEEP or fold to a
   genuinely-shared U.B3 runtime `constants.ts` if one comes into being (record the
   U.B3 dependency; do not build U.B3).
4. **Verify** zero behavior change — `npm test` (vitest/jsdom) green through every
   fold; `npm run gh-pages` build green; importer counts confirmed at execution
   (a file found multi-consumer at fold time is KEPT and reported, never forced).
5. **Commit the per-file fold map IN-TREE** (ruling 5) — the B.3 table with the
   measured counts, the executed verdict per target, and the six KEEP flips with
   their reasons — so the ratification record is self-contained. Return any G3/G9
   rule refinement the counts surfaced.
