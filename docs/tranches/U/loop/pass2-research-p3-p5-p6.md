# PASS-2 research — lane `p3-p5-p6-gap-dossier`

**Loop:** OWNER-ASKS row 6 · OD-U18 5-step convergence loop, PASS 2 step 1 (research).
**Authority over this lane:** PASS-1.md's eight agglomerator rulings (BINDING) + SPEC-B1.
**Read-only** except this report. Every worktree diff below was read against `master`;
the prototype branches are EVIDENCE, never merged.

**Plain-language note (agglomerator ruling 6 — anti-recondite, BINDING).** Terms glossed
at first use. "Barrel" = an `index.ts` that only re-exports its directory's public
members. "Zone" = one of the library's eleven cohesive `src/animation/<name>/` directories.
"Fold-map" = a claim-by-claim table showing, for every sentence a deleted doc carried,
where that sentence now lives (or why it was dropped). "Die-by-fixing" = removing a
suppression file by curing what it suppressed, not by re-baselining. "The trio" =
P5's three transport components (container + per-channel host + per-channel options form).

---

## 0 — Scope and method

Four prototypes examined, against the exact PASS-1 gaps and the eight rulings:

| Item | worktree | PASS-1 score | this lane's job |
|---|---|---:|---|
| P3 claudemd-fold | `…287-12` | 72% | remaining redistribute; the in-tree fold-map (ruling 5); cogency of every re-homed comment (ruling 6) |
| P5 demo-component-recut | `…287-17` | 84% | naming re-entry (ruling 7, ground in `TransportChannel`, recommend ONE); the G6 boundary paragraph + dock verdict in-tree (ruling 5); the ruling-8 allowlist question |
| P6 readme-redesign | `…287-18` | 88% | the post-P3 reconciliation list (ruling 4 — which sentences harden vs soften) |
| P4 known-violations-fix | `…287-16` | 95% | name the exact 5% |

Every claim below was checked at the file level in the named worktree. Line counts and
"present/absent" verdicts are from live `git diff master` / `grep` runs, not from the
prototype self-reports.

---

## 1 — P3 (claudemd-fold, 72%): what stage-1 actually did, and the four gaps

### 1.1 What P3 built (verified, keep)

- **Stage 3 (delete) is clean and complete.** All three CLAUDE.md files are gone:
  root `CLAUDE.md` (118 lines, whole-file delete), `src/animation/CLAUDE.md` (395),
  `demo/CLAUDE.md` (126).
- **Stage 2 (gate re-home) is flawless** — this is the 72% that converged. `proof-claude-paths-live.mjs`
  deleted whole (760 lines); `proof:engine` managed-pause-doc re-pointed to `group.ts`;
  `proof:published-surface` clause (e) split; `proof:drag2d-light-certified` CLAUDE reads
  dropped; `proof:no-dead-dependency` trimmed to README+DESIGN.md; the five comment-only
  mentions scrubbed; the dead README link removed.
- **Three genuine inline redistributes landed and are well-written:**
  1. `engine/interpolate.ts` — the `bumpLayoutEpoch` computed-unit container contract,
     stated once at the seam that reads those units (17 lines, cogent).
  2. `group/group.ts:329` — the managed-child lifecycle contract promoted to the
     authoritative home, cross-linked from `group/lifecycle.ts` and
     `orchestration/sequence/lifecycle.ts`.
  3. `README.md` — a `## Structure` section + a `bumpLayoutEpoch` §Units paragraph +
     an expanded managed-child line + a drag2D LIGHT clarification.

### 1.2 Gap A — NO fold-map exists (ruling 5, the load-bearing miss)

There is **no in-tree fold-map** in the P3 worktree — `git diff master --name-only`
shows no `loop/` artifact, no `FOLD-MAP.md`, nothing. OD-U1's zero-loss burden is
**unproven**: the deletion of ~639 lines across three files rests on an unwritten bet
that every load-bearing claim has a home. Ruling 5 makes the fold-map a committed
artifact ("a ratification record that isn't self-contained isn't a record"). This is
P3's single largest remaining deliverable.

### 1.3 Gap B — the zone barrels were NOT populated; the README claim is FALSE today

The deleted `src/animation/CLAUDE.md` carried a ~110-line **Zone map** — a per-file
inventory naming every file in every zone (e.g. `compile/entry.ts # @starting-style
emitter`, `group/yield-batch.ts # INP-relief batching`). §5's protocol routes that bulk
to "each zone's `index.ts` barrel docstring."

P3 did **not** touch a single zone barrel. Verified: the only `src/` files P3 changed are
`interpolate.ts`, `group.ts`, `sequence/lifecycle.ts`. The eleven barrels still carry
their **R.W1 zone-summary docstrings** (present and good — they describe the zone's
purpose and name the principal files), but they are **zone summaries, not per-file
inventories**. Several files the old Zone map named have no mention in their barrel.

Yet P3's rewritten README asserts:

> "Each barrel's module docstring is the authoritative per-file inventory for its zone
> (the doc travels with the code, so it can't silently rot)."

This is the **fresh doc-rot PASS-1 flagged (failure mode 3)** — the sentence is false the
moment it is written, because the barrels are summaries. P3 must either (a) genuinely
fold the per-file inventory into the barrels so the sentence becomes true, or (b) soften
the sentence to what is true ("each zone's barrel docstring documents its shape; each
class carries its own contract") and record the KISS argument in the fold-map. Ruling 4
ties this directly to P6 (§4 below).

### 1.4 Gap C — the "no inline home" list is SMALLER than PASS-1 stated; name the real three

PASS-1 §3 listed twelve files as having "no inline documentation home." **Verified false
for most of them** — they already carry file-level docstrings from prior tranches:
`numeric-plan.ts`, `compositor.ts`, `yield-batch.ts`, `entry.ts`, `view-transition.ts`,
`backward-walk.ts`, `backward-color.ts`, `format-options.ts`, `easing-serialize.ts`,
`densify.ts`, `css/metadata.ts` all have top-of-file `/** … */` blocks.

The **genuinely home-less files** (start with a bare `import`, no docstring):
- `compile/backward/format.ts` — the `@keyframes` body/block serializer.
- `physics/morph.ts` — `ElementMorph`.
- `physics/playback.ts` — `RAFPlayback`.

The deleted CLAUDE.md carried a "Classes + primitives" section with real prose for
`ElementMorph` (`morph.ts`) and `RAFPlayback` (`playback.ts`); that prose is the content
to fold. This narrowing is a finding, not a dismissal — it means P3's redistribute work
is bounded and small, which strengthens the case for doing it precisely rather than
betting it away.

### 1.5 Gap D — demo/CLAUDE.md content was deleted but NOT re-homed

§5 routes `demo/CLAUDE.md`'s content: a ~10-line orientation tree → `demo/DESIGN.md`;
the scene table → `app/scene/scenes.ts` docstring; the `markRaw`/Euler/suppression idiom
notes → docstrings at their owning composables. **Verified: P3 touched none of these.**
The only demo file P3 changed is `demo/scenes/cube/orbital-drag/quaternionEuler.ts`.
`demo/DESIGN.md`, `app/scene/scenes.ts`, and the idiom-owning composables are untouched —
so `demo/CLAUDE.md`'s load-bearing content (the `@`→shared ruling is correctly dropped
per OD-U2, but the Structure tree, Scenes table, and Conventions idioms) was **deleted
without a home**. This is a straight OD-U1 zero-loss violation for the demo half.

### 1.6 Cogency of the re-homed comments (ruling 6) — PASS on the three that landed

The `interpolate.ts` bumpLayoutEpoch block, the `group.ts` managed-child block, and the
README prose are all plain-language and state what-is-true-now. No genealogy narration.
The cogency problem in P3 is **not** the comments that landed — it is the **absent**
comments (the un-folded barrel inventory and the un-homed demo idioms).

---

## 2 — P5 (demo-component-recut, 84%): naming, in-tree verdicts, the ruling-8 question

### 2.1 What P5 built (verified, keep)

- **Stage 1–2: the stutter-trio boundary genuinely re-drawn on responsibility.** The old
  `AnimationControls` / `AnimationControlsControls` / `AnimationControlsGroup` split (made
  on volume) became two modules on a real seam: `control-suite/` (the group-level
  container) and `channel-controls/` (the per-channel host + its options form). This is
  the pattern U.B needs, and it is green — keep the seam.
- **Stage 3: orbital-drag barrel purity** — `index.ts` is now re-export-only (three
  `export` lines, bodies moved to `constants.ts`, `types.ts` folded, the self-barrel
  cycle killed). Done, correct (G4).
- **Stage 4: `springKeys.ts` declares `SpringDemoContext`** instead of `ReturnType`-chasing
  the composable (G9). Done, correct.

### 2.2 The naming, resolved (ruling 7) — RECOMMEND ONE

The trio P5 shipped: **`ControlSuite`** (container) / **`ChannelControls`** (per-channel
host) / **`ChannelOptions`** (per-channel options form). Ruling 7's objection stands:
`ControlSuite` breaks the Channel-family lexicon (the trio reads Suite / Channel /
Channel) and re-echoes "Control."

The domain type is `TransportChannel` (defined in `transport/transportSource.ts:24`) — one
transport channel. The container wraps a *set* of channels and drives the library's
`AnimationGroup`; each channel maps one animation.

**Recommendation: rename the container `ControlSuite` → `ChannelGroup`.** Final trio:

| role | name | rationale |
|---|---|---|
| container (set of channels; drives `AnimationGroup`) | **`ChannelGroup`** | Channel-family; mirrors the library `AnimationGroup` it visualizes; no "Control" echo; no stutter |
| per-channel host | **`ChannelControls`** (keep) | already Channel-family; "the controls for one channel" |
| per-channel options form | **`ChannelOptions`** (keep) | already Channel-family; "the options for one channel" |

Trio reads **Group / Controls / Options**, all `Channel`-prefixed — coherent, grounded in
`TransportChannel`, no invented vocabulary. Runner-up: `TransportChannels` (the literal
plural of the domain type) — also correct, but reads less like a component and collides
visually with the enclosing `transport/` directory name; `ChannelGroup` is the cleaner
pick because it names the library concept the container reflects. **Do not** rename the
host to `ChannelSurface`/`ChannelPanel` (ruling 7 floated it): `ChannelControls` is
already coherent and a second rename buys nothing. Keeping the rename minimal (one file,
`control-suite/` → `channel-group/`) is the elegant move.

### 2.3 The G6 boundary paragraph is NOT in-tree (ruling 5)

P5's charter requires the trio's new boundary justified in one paragraph against G6 (the
prop clusters named). **Verified absent** — P5's diff touches no `.md` and no in-tree
prose file carrying the boundary analysis; the only non-source files it changed are proof
scripts. Ruling 5 requires this paragraph committed in-tree (in `loop/` or as a docstring
on `ChannelGroup.vue`), not left in the agent return. Gap.

### 2.4 The dock KEEP verdict is NOT materialized in-tree (ruling 5, §4 gap 1)

`demo/app/dock/` (`ChromeDock.vue` 386L, `MbabbMenu.vue` 245L) exists and P5's charter
required a **KEEP-or-carve verdict** with rationale. **Verified: P5 did not touch the
dock** (only `proof-dock-*.mjs` scripts appear, unrelated). The §4 KEEP-and-recut ruling
has no in-tree materialization. Gap — the verdict must land as committed prose (a
docstring on `ChromeDock.vue` or a `loop/` note), stating KEEP + the recut shape.

### 2.5 `progress` still optional — tighten to required (PASS-1 residue)

`ChannelOptions.vue:269` still declares `progress?: number` (optional) for a value the
host always provides (`:progress="progress"` at :172; the comment at :266 says "the host's
rAF sync bridge owns it"). PASS-1 §3 residue: tighten to `progress: number`. Not done.

### 2.6 The ruling-8 allowlist question — the 8 rows survive, the pattern must DECIDE

P5 **re-anchored** all eight `proof-no-dead-export` allowlist rows to the new paths
(`control-suite/composables/…` and `channel-controls/composables/…`) — correct for its
scope, but the rows **survive**. They are per-component composable `*Deps` / `*Return` /
`*Options` / `*Emit` types that are `export`ed but have no external consumer (hence
"dead-export"), so every future recut that moves a composable re-adds a row.

Ruling 8 requires the ratified U.B pattern to decide **once**: do these per-composable
`Deps`/`Return` interface types **export-and-consume** (the parent imports the composable's
`Return` type instead of re-deriving it — killing the allowlist rows), or **stay local**
(drop the `export`, declare them un-exported inside the composable — also killing the
rows)? Either choice ends the allowlist churn; re-anchoring does not. This is a pass-2
SPEC-B2 question, and the answer sets the composable-authoring convention for the whole
U.B drive. **Recommended answer** (for the critique fleet to score): **stay local** —
a single-consumer composable's `Deps`/`Return` type is internal shape, not a published
contract; drop the `export`, and the allowlist rows die by fixing (the same die-by-fixing
ethos §6 applies to suppression files). Export only the types a sibling genuinely imports.

---

## 3 — P4 (known-violations-fix, 95%): the exact 5%, named

P4's deliverable 1 (the die-by-fixing kill) is the archetype and converged: baseline
deleted, `--ignore-known` dropped everywhere, all eight references un-wired, the
planted-cycle self-check still reds, `proof-no-flat-siblings`'s vestigial `count < 15`
clause **retired in-commit** (ruling 3, done well), the CI step label corrected, the false
"recorded in the BASELINE" sentence struck from `.dependency-cruiser.cjs`. The exact 5% is
**two things**:

### 3.1 The 5%, part one — ruling-6 cogency (genealogy prose in four gate headers)

The un-wire narrates the full lineage **Q.WA1 → R.W1 → U** four times over:
- `proof-lint-clean.mjs` header: "Q.WA1 originally ratcheted the src/animation/ engine
  cluster's co-recursive RUNTIME cycles into … baseline … The R.W1 zone partition then
  DISSOLVED every one … U deleted it."
- `.dependency-cruiser.cjs` no-cycle rule comment: the same dissolution story with the
  full cycle list (`engine↔easing↔frame-compiler↔group↔waapi`, `spring↔spring-duration↔…`).
- `proof-any-ceiling.mjs:35` precedent citation.
- `proof-no-dead-export.mjs:34` precedent citation.

Ruling 6: a gate comment states **what the gate verifies NOW** ("no baseline; every cycle
reds directly"), not the four-tranche genealogy. Distill each to the present-tense
invariant; the lineage, if worth keeping, belongs once in the wave record, not four times
in gate headers. This is the same anti-recondite ruling that scored SPEC-B1's unglossed
shorthand.

### 3.2 The 5%, part two — deliverables 2, 3, 4 are OPEN (the prototype did only #1)

Verified in the worktree:
- **Deliverable 2 (vestige sweep) — OPEN.** Two `eslint-disable` directives still present
  under `src`/`demo`/`test`; `scripts/baselines/visual-lock/_diff/` **still exists** (the
  44-PNG vestige of a gate retired at T.M3).
- **Deliverable 3 (any-ceiling calibration) — OPEN.** No calibration slice; the per-seam
  typing-cost estimate that answers §9 Q5 (in-drive sweep vs. its own wave) is not
  produced.
- **Deliverable 4 (`vjL2LinearLanded` skip) — OPEN.** `test/compile/roundtrip-easing.test.ts`
  still carries `const vjL2LinearLanded` + `it.skipIf(!vjL2LinearLanded)` at :164/:170;
  unresolved against the U consume edge.

PASS-1 already assigns 2–4 to P4's pass-2 (§4 focus table); naming them here confirms the
5% is **cogency + the three open deliverables**, not a craft defect in what landed.

---

## 4 — P6 (readme-redesign, 88%): the post-P3 reconciliation list (ruling 4)

P6's README artifact is essentially done (both gates green, claims source-verified, ≤40
lines). The pass-2 work is **reconciliation with P3**, because **both P3 and P6 edited
`README.md`** — they overlap and will conflict at merge. Ruling 4 sequences them (P6 lands
AFTER P3, gated). The clean resolution: **P6 owns the README; P3's README edits fold into
P6's artifact and P3 stops double-authoring the file.** Sentence-by-sentence:

### 4.1 Sentences that must SOFTEN (the barrel-inventory forward-promise)

P6's §Structure closes:

> "Each zone documents its own inventory in its barrel's docstring; every class carries
> its contract in its own source. There is no separate structure file to drift."

This is **softer than P3's** version (P3 says "authoritative per-file inventory") and is
the better wording, but it still forward-promises that the barrels carry a per-file
*inventory*. Per §1.3, the barrels are zone **summaries**, not per-file inventories, and
P3 did not populate them. **Reconciliation:** if P3 populates the barrels (§1.3 option a),
this sentence hardens as-is. If P3 makes the KISS/rot argument instead (option b), soften
to the demonstrably-true form: *"Each zone's barrel docstring documents its shape; each
class carries its contract in its own source."* — dropping "inventory." The decision is
P3's (fold-map), and P6's sentence tracks it. This is the ruling-4 gate in action.

### 4.2 Prose that must reconcile to "stated once" (boundary triplication)

The light/heavy boundary is explained **three times inside P6's own README**: (1) the
§Structure intro ("split by whether they carry the CSS parser and value.js … light zones
ship on the static `.` barrel; heavy zones … through `loadAnimationEngine()`"),
(2) §The dynamic engine, (3) §Tree-shaking. Ruling for P6: state the boundary **once**
(the §dynamic-engine home), and let §Structure carry a **one-line pointer** ("split light/
heavy — see the dynamic engine"). A one-line pointer is acceptable; the framing paragraph
is not.

### 4.3 Prose that is correctly DUAL-homed (do NOT collapse) — a clarification

Two items look like duplication but are intended dual homes per §5, and must stay:
- **`bumpLayoutEpoch`** lives in BOTH `interpolate.ts` docstring (P3, the source seam) AND
  README §Units (P6, the public consumer obligation). §5 explicitly mandates both. P6's
  README paragraph and P3's docstring are DIFFERENT audiences — keep both, but ensure they
  don't drift (they currently agree).
- **managed-child** lives in BOTH `group.ts` (P3, authoritative) AND one README
  §AnimationGroup line (P6). §5 mandates both. Keep.

The reconciliation target is: the README boundary framing (§4.2) is stated once; the
dual-homed contracts (§4.3) stay dual; the §Structure inventory sentence (§4.1) tracks
P3's fold-map decision.

### 4.4 Residue confirmed (small)

- `bumpLayoutEpoch` paragraph residency: PASS-1 asked whether it is too long; P6's version
  is one tight paragraph under §Units — acceptable, no re-home needed.
- The tree-as-overview omits `easing.ts`/`validate.ts` (the two root facades). PASS-1 §4
  said confirm this is accepted — it is a deliberate overview simplification (both are
  thin facades over zones already shown); **accept**, note it in the fold-map so no future
  lane flags it as a loss.

---

## 5 — Cross-cutting: the P3↔P6 README single-owner problem (ruling 4 + 5, escalated)

The single most important cross-prototype finding: **P3 and P6 both rewrote the same
README sections** (§Structure, the bumpLayoutEpoch paragraph, the managed-child line, plus
P3 also edited the drag section). This is the "boundary prose triplicated" failure
generalized across prototypes. Because ruling 4 already sequences P6 after P3 and ruling 5
demands one self-contained record, the resolution is structural:

- **P3's charter is: inline docstrings + gate deaths + demo/DESIGN rehome + the fold-map.**
  Its README delta should be **handed to P6**, not committed as a competing README edit —
  except the single dead-link removal that §5 requires in the deletion commit (that stays
  with P3 so `proof:readme-paths-live` never reds mid-sequence).
- **P6 owns the README artifact in full.** It absorbs P3's drag2D LIGHT clarification and
  any README content P3 surfaced, states the boundary once, and tracks P3's fold-map on
  the §Structure inventory sentence.

SPEC-B2 should state this ownership split explicitly so pass-2 execution doesn't re-collide.

---

## Work orders

**P3 (claudemd-fold) — close the four gaps:**

1. **Produce the fold-map** as a committed in-tree artifact
   (`docs/tranches/U/loop/P3-FOLD-MAP.md`): one row per load-bearing claim in the three
   deleted CLAUDE.md files, each mapping to its new home (file + anchor) or an explicit
   "DROPPED — reason" (build table, tsconfig/prettier prose → package.json/tsconfig are
   authority). Silence is not a ruling (ruling 5, OD-U1 zero-loss).
2. **Decide the barrel-inventory question and execute it.** Either fold the deleted Zone
   map's per-file lines into each of the eleven zone `index.ts` barrel docstrings (making
   the README "inventory" claim true), OR record the per-zone KISS argument in the fold-map
   and hand P6 the softened §Structure sentence (§4.1). Do not leave the barrels
   summary-only while the README claims per-file inventory.
3. **Add file docstrings to the three genuinely home-less files** — `compile/backward/format.ts`,
   `physics/morph.ts`, `physics/playback.ts` — folding the deleted "Classes + primitives"
   prose for `ElementMorph` and `RAFPlayback`. Do NOT re-add docstrings to the ~9 files
   PASS-1 wrongly listed; they already have them (§1.4).
4. **Re-home demo/CLAUDE.md content** per §5: the ~10-line orientation tree → `demo/DESIGN.md`;
   the Scenes table → `app/scene/scenes.ts` docstring; the `markRaw`/Euler/suppression idiom
   notes → docstrings at their owning composables. Currently deleted without a home (§1.5).
5. **Stop double-authoring the README** (§5 cross-cutting): keep only the dead-link removal
   in P3's deletion commit; hand every other README delta to P6.

**P5 (demo-component-recut) — name, verdict, tighten, decide:**

6. **Rename the container** `control-suite/ControlSuite` → `channel-group/ChannelGroup`
   (final trio ChannelGroup / ChannelControls / ChannelOptions; ruling 7). Re-anchor the
   four `control-suite/composables/*` allowlist rows to `channel-group/`. Do not rename the
   host.
7. **Commit the G6 boundary paragraph in-tree** (ruling 5): the trio's responsibility seam
   justified against G6 with the prop clusters named — as a docstring on `ChannelGroup.vue`
   or a `loop/` note, not an agent return.
8. **Commit the dock KEEP verdict in-tree** (ruling 5, §4 gap 1): KEEP + the glass-ui
   component-dir recut shape, as prose on `ChromeDock.vue` or a `loop/` note.
9. **Tighten `ChannelOptions.progress?: number` → `progress: number`** (always host-provided).
10. **Rule the ruling-8 allowlist question ONCE** for the U.B pattern: recommend **stay
    local** (drop the `export` on single-consumer `*Deps`/`*Return`/`*Options`/`*Emit`
    composable types so the eight rows die by fixing); feed the decision to SPEC-B2 as the
    composable-authoring convention.

**P4 (known-violations-fix) — the exact 5%:**

11. **Distill the genealogy prose** (ruling 6) in the four gate headers
    (`proof-lint-clean.mjs`, `.dependency-cruiser.cjs` no-cycle rule, `proof-any-ceiling.mjs:35`,
    `proof-no-dead-export.mjs:34`) to the present-tense invariant ("no baseline; every cycle
    reds directly"); drop the Q.WA1→R.W1→U four-tranche narration.
12. **Discharge deliverable 2** — delete the 2 remaining dead `eslint-disable` directives +
    `scripts/baselines/visual-lock/_diff/` (44 PNGs).
13. **Discharge deliverable 3** — type the U.B4 editor-boundary any-seam slice and report
    per-seam cost (answers §9 Q5: in-drive sweep vs. own wave).
14. **Discharge deliverable 4** — resolve `vjL2LinearLanded`/`skipIf` in
    `test/compile/roundtrip-easing.test.ts:164/170` against the U consume edge (un-skip if
    VJ-L2 landed; else an explicit deadlined covenant row in U.F — no silent conditional skip).

**P6 (readme-redesign) — reconcile with P3:**

15. **Track P3's fold-map on the §Structure inventory sentence** (ruling 4): harden if P3
    populates the barrels; soften to "documents its shape … each class carries its contract"
    if P3 makes the KISS argument (§4.1).
16. **State the light/heavy boundary once** (§dynamic-engine); reduce §Structure to a
    one-line pointer; keep the dual-homed `bumpLayoutEpoch` (§Units) and managed-child
    (§AnimationGroup) lines — those are intended dual homes, not triplication (§4.2/§4.3).
17. **Absorb P3's README delta** (drag2D LIGHT clarification et al.) so P6 is the sole
    README author; confirm the `easing.ts`/`validate.ts` tree omission is an accepted
    overview simplification and note it in P3's fold-map (§4.4).

**SPEC-B2 (for the synthesis lane, surfaced by this dossier):**

18. State the **P3↔P6 README single-owner split** explicitly (P6 owns the README; P3 keeps
    only the dead-link removal) so pass-2 execution doesn't re-collide (§5).
19. Record the **ruling-8 convention** (stay-local composable types) once, as the U.B
    composable-authoring rule.
20. Record the **container name** `ChannelGroup` as the ratified trio member so no later
    lane re-litigates it.
