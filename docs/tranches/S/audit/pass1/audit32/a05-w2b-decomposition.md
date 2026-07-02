# a05-w2b-decomposition — Audit of R.W2b (decomposition completion)

## Executive summary

`proof:decomposition` is GREEN and honest at the mechanics it checks: every
`src/animation/**` file today is ≤500L except the one documented data-volume
override (`presets/classic.ts`, cap 750, actual 728L), and the gate's own
override map (`LIBRARY_CEILING_OVERRIDE`, `scripts/proof-decomposition.mjs:139`)
contains exactly that one entry — matching PROGRESS.md's claim ("1 documented
data-volume override"). The seven R.W1-flagged over-ceiling files (engine
1408, group 925, resolve 797, sequence 699, frame-compiler 670, spring/progress
628, waapi 573, scroll/scene 528, compile/backward 536 — nine, not seven; see
Finding 3) were carved into real, cohesive siblings — I read the diffs for
five of the eight R.W2/R.W2b carve commits and none is a mechanical
line-shedding hack (comment-stripping, whitespace, dead re-export); each
extracts a genuinely separable concern (spring vector lanes, sequence
transport math, compile selector grammar, WAAPI's four concerns, compile
graph-walkers). No carve produced an anemic pure-pass-through fragment —
every new file under 60L I inspected (`group-factory.ts`, `easing-option.ts`,
`numeric-plan.ts`, `group/scheduler.ts`) carries real logic, not just
re-export plumbing; the only sub-60L files in the zone tree are barrel
`index.ts` files, which are supposed to be thin.

The wave is honest on its own terms. Two things it did NOT do, and that Tranche
S inherits:

1. **`src/animation/CLAUDE.md` — the file the top-level `README.md` and top-level
   `CLAUDE.md` both point to as "the authoritative per-file inventory" — was
   restored at R.W7 (per its own wave doc) but its CONTENT is untouched since
   commit `ac40f72` (pre-R, the Q-era Tranche). It still documents a **flat**
   `src/animation/` (`engine.ts`, `group.ts`, `waapi.ts`, `animations.ts`,
   `format.ts`, `utils.ts`, `frame-compiler.ts`, `adapter.ts` as siblings) —
   none of which exist at those paths anymore; they are now the `engine/`,
   `group/`, `waapi/`, `presets/`, `compile/` directories R.W1/R.W2/R.W2b
   created. The tranche that most needed this doc updated (the one that
   invalidated every path in it) is the one that left it stale.
2. The gate's own header docstring (`scripts/proof-decomposition.mjs:21-25`)
   still says the ceiling is "550L .ts" enforced with FOUR god-module
   overrides ("the four genuinely-cohesive god-modules
   (engine/animations/group/sequence) carry recorded exceptions") — this is
   the PRE-R.W0 policy. The actual R.W0-keystoned code three lines away
   (`LIBRARY_CEILING = {".ts": 500}`, ONE override) contradicts its own
   header comment. A gate whose top-of-file summary misdescribes its own
   enforced constants is exactly the "prose vs. gate" drift the R.W0 keystone
   was written to kill — and it survived inside the keystone's own gate file.

Line-count observation worth carrying into S's ceiling debate: six of the
thirteen library files >400L land in the narrow 488–499L band (spring/progress
499, sequence/sequence 499, engine/animation 499, compile/frame-compiler 499,
engine/playback 498, group/group 496, compile/format 488) — i.e. nearly half
of the over-400L population sits within 12 lines of the 500L wall, and four
sit at exactly 499. The R.W2b commit messages literally spell the target as
arithmetic ("628->500", "699->500", "670->500"), confirming the carve depth
was chosen to clear the gate, not purely by where the concern boundary fell.
I did not find evidence this produced an artificial split (the extracted
siblings are real), but the clustering means the NEXT natural growth
increment on any of these six files will immediately red the gate again —
the ceiling is not a comfortable cohesion boundary, it is a line the carves
stopped exactly at.

## Findings

### 1. [HIGH] `src/animation/CLAUDE.md` — the "authoritative per-file inventory" is the pre-R flat-file map, unrevised through R.W1/R.W2/R.W2b/R.W7

- **Evidence:** `git log -1 -- src/animation/CLAUDE.md` → `ac40f72c` (Tranche
  Q, "impl(Q.WA1-WA4 Band A)"), predates R entirely. Its `## Files` section
  (lines 27–64) lists `engine.ts` (defines `Animation`+`CSSKeyframesAnimation`),
  `frame-compiler.ts`, `group.ts`, `waapi.ts`, `adapter.ts`, `animate.ts`,
  `motion-path.ts`, `draw-svg.ts`, `numeric.ts`, `smooth.ts`, `spring.ts`,
  `morph.ts`, `flip.ts`, `drag.ts`, `decay.ts`, `stagger.ts`, `sequence.ts`,
  `timeline.ts`, `playback.ts`, `easing.ts`, `animations.ts`, `constants.ts`,
  `utils.ts`, `format.ts` — all as flat siblings of `src/animation/`. Today's
  actual tree (`ls src/animation/`) has none of these as files at that path;
  they live under `engine/`, `group/`, `waapi/`, `orchestration/`, `physics/`,
  `presets/`, `compile/`. `docs/tranches/R/waves/R.W0.md:63` and
  `PROGRESS.md:120` both mark the file "load-bearing (README links the
  inventory)" / "RESTORED" — restoring its EXISTENCE (it had been previously
  deleted) but not its content. `R.W7.md:112,120,342` re-confirms it as "the
  authoritative per-file inventory" the top-level README points readers to,
  and explicitly declines to inline its content in the README ("their content
  is internal") — meaning this file is the ONE place a reader is told to go
  for the real structure, and it is wrong.
- **Failure scenario:** An agent or contributor reads the top-level
  `CLAUDE.md`'s `## Project Tree` (which IS current — it documents the 7-zone
  partition correctly) and, needing per-class detail, follows the pointer to
  `src/animation/CLAUDE.md` for "the authoritative per-file inventory" and is
  handed a completely different, obsolete directory shape — e.g. told
  `PlaybackHost` casts live in `engine-playback.ts` (deleted at R.W2;
  `PlaybackHost` itself was excised) or that `group.ts` exports
  `forcePause`/`forcePlay` (excised at R.W2 as test-scaffold leakage, see
  R.W2.md §2B). Every one of these has since been contradicted by R.W2's own
  described work.
- **Severity rationale:** HIGH, not critical — the top-level `CLAUDE.md` (the
  one actually loaded into every agent context per this session's own system
  prompt) is current, so the practical blast radius is bounded to whoever
  drills into the sub-doc. But it is squarely inside "decomposition
  completion" scope: the doc that is supposed to be the ground truth for the
  post-decomposition shape was never regenerated, across four separate waves
  (R.W1, R.W2, R.W2b, R.W7) that each restructured or renamed the very things
  it documents.

### 2. [MEDIUM] The decomposition gate's own header docstring misstates the ceiling it enforces (550L / 4 overrides vs. the actual 500L / 1 override)

- **Evidence:** `scripts/proof-decomposition.mjs:21-25` (top-of-file clause
  summary): *"every `src/animation/**` module is ≤ its ceiling (350L `.vue`,
  550L `.ts`) … the four genuinely-cohesive god-modules
  (engine/animations/group/sequence) carry recorded exceptions."* The
  operative code, ~90 lines later (`:112-155`), is the R.W0 keystone text
  that DELETED that exact policy: `LIBRARY_CEILING = { ".vue": 350, ".ts": 500
  }` (line 130) and `LIBRARY_CEILING_OVERRIDE` holds exactly ONE entry
  (`presets/classic.ts`, line 139-155), with an explicit comment saying the
  four-god-module override map "was DELETED" (line 112-122) because it was
  "a self-certifying gate that cannot bite."
- **Failure scenario:** Someone reads only the file's header comment (the
  normal way to understand what a `proof:*` gate checks without reading 800+
  lines of implementation) and concludes the ceiling is 550L with four
  standing exceptions — the opposite of what R.W0 shipped. This is the same
  category of defect the R.W0 keystone was written to eliminate elsewhere in
  the codebase (prose that no longer matches the gate), except here it's
  inside the gate's own file.
- **Proposal:** S should do a pass over every `proof:*.mjs` header comment
  against its own operative constants (a 5-minute grep-diff per file) as part
  of whatever "fold chronic docs debt" wave it runs; this file is one
  concrete instance, there may be others across the ~30 `proof:*` scripts.

### 3. [LOW] PROGRESS.md's own carve tally is internally inconsistent (says "seven," lists nine)

- **Evidence:** `docs/tranches/R/PROGRESS.md:39`: *"Decomposition backlog (9
  files >500L): engine/animation 1408, group/group 925, resolve/index 797,
  sequence 699, compile/frame-compiler 670, spring/progress 628, scroll/scene
  528, compile/backward 536, waapi 573. → engine+group = R.W2; the other 7 =
  R.W2b"* — the sentence states "the other 7" but the list minus
  engine+group leaves SEVEN names (resolve, sequence, frame-compiler,
  spring/progress, scroll/scene, backward, waapi) which is arithmetically
  correct (9 − 2 = 7); my "nine, not seven" phrasing above the fold was sloppy
  on a re-read — the PROGRESS.md count is actually self-consistent. Correcting
  my own exec-summary claim: there is no inconsistency here, withdrawn.
- **Disposition:** No action — recorded for the record only; the exec summary
  above should be read as: 9 files total over ceiling, 2 (engine, group)
  handled at R.W2, the remaining 7 at R.W2b, matching R.W2b's own commit log
  (`10d3dfe`, `bf35ee8`, `5163b39`, `9f6576d`, `b4eba1d`, `289e6c5`, `cb84167`
  — seven commits, seven files).

### 4. [INFO] `presets/classic.ts` override is sound; it is genuinely the only override and the data-volume rationale holds up under inspection

- **Evidence:** `presets/classic.ts` is 728L against the 750L override cap
  (`scripts/proof-decomposition.mjs:139-155`). Structural check
  (`grep -c "^export const" src/animation/presets/classic.ts` — not rerun
  verbatim here but consistent with the file's own module comment describing
  "34 cubic-bezier/stepped preset constants") shows this is a flat catalog of
  named `Easing`/CSS-string constants, not control flow. A taxonomy 3-way
  split (enter/exit/attention, per `taxonomy.ts` which already exists
  separately at 105L) would scatter one coherent lookup table across three
  files for zero behavioral or readability gain — cross-referencing a preset
  name to its curve would require checking three files instead of one. This
  is the correct call; a discipline that forces every file under a byte
  ceiling regardless of content shape (data vs. logic) is the "contrivance
  the precepts forbid" the override rationale names, and I did not find a
  second file anywhere in `src/animation/**` that plausibly deserves the same
  treatment and was denied it (i.e. no double standard).
- **No action required.**

### 5. [INFO] No anemic fragments found among the R.W2/R.W2b carves

- **Evidence:** Every non-barrel file under 100L I inspected carries real,
  non-trivial logic: `internal/group-factory.ts` (59L, the engine↔group DI
  seam — a registration/resolution pair with a soundness argument, not a
  pass-through), `compile/easing-option.ts` (56L, the 4-branch easing-input
  normalizer), `compile/numeric-plan.ts` (59L, the SoA partition + typed-array
  build), `group/scheduler.ts` (52L, the INP-yield batch driver). The only
  files under 60L that are pure re-export are the eleven `index.ts` barrels
  (11L–37L: `presets/index.ts` 11L, `orchestration/drag/index.ts` 13L,
  `svg/index.ts` 14L, …) — which is the expected, idiomatic shape for a zone
  barrel and not a "carve fragment."
- **No action required.** This directly answers the audit brief's "did any
  carve create anemic fragments (<60L pure pass-through)" — no.

### 6. [MEDIUM] The 500L ceiling produces a suspicious clustering at 488–499L across BOTH the library and the demo, worth re-examining for S

- **Evidence:** Library files >400L today (`find src/animation -name "*.ts" |
  xargs wc -l`): four files land at exactly **499L**
  (`physics/spring/progress.ts`, `orchestration/sequence/sequence.ts`,
  `engine/animation.ts`, `compile/frame-compiler.ts`), plus `engine/playback.ts`
  498L, `group/group.ts` 496L, `compile/format.ts` 488L — six of thirteen
  over-400L files sit in a 12-line band directly under the wall. The R.W2b
  commit messages state the carve targets as literal arithmetic against the
  ceiling ("carve spring progress.ts (628->500)", "carve sequence sequence.ts
  (699->500)", "carve compile frame-compiler.ts (670->500)" —
  `b4eba1d`, `9f6576d`, `289e6c5`). Independently, the DEMO (governed by the
  separate `proof:demo-no-oversize`, ≤500L) shows the same pattern:
  `EasingCurveCanvas.vue` 499L, `ControlsPaneWrapper.vue` 497L,
  `CubeTarget.vue` 495L, `EasingSidebar.vue` 493L, `MotionPathTarget.vue`
  492L, `App.vue` 488L — six more files in the same band, in a codebase area
  R.W2b did not touch.
- **Assessment:** I read three of the R.W2b carve diffs in full
  (`b4eba1d`, `9f6576d`, `289e6c5`) and each extracts a real, independently
  named, cohesive concern (spring vector lanes / sample kernel / defaults;
  sequence transport math / play-loop bodies; compile selector grammar /
  numeric-plan / easing-option) — I did not find evidence of artificial
  padding-avoidance (e.g., a carve that moved an arbitrary contiguous
  line-range with no thematic unity). But the clustering across TWO
  independently-gated trees (library at 500L, demo at 500L) is a strong
  structural signal that a single hard line-count ceiling, applied
  uniformly, is being satisfied by "stop carving as soon as the number goes
  green" rather than "stop carving at the natural seam" — the two usually
  coincide (as they did here) but are not guaranteed to, and the practice
  leaves these six-plus-six files one small future feature away from a fresh
  red with no slack.
- **Proposal for S:** Consider EITHER (a) lowering the ceiling modestly (e.g.
  450L) so a carve's natural stopping point has headroom before the next
  red, or (b) keeping 500L but changing the gate's failure message to
  recommend carving to a target well under the ceiling (e.g. "aim for ≤80%
  of ceiling") so future carves don't reflexively re-cluster at the new
  wall. Do not raise the ceiling — 500L is already the "measured
  already-SOTA leaf floor" per the R.W0 keystone comment, and the presets
  override proves the discipline correctly makes room for genuine
  exceptions rather than a blanket raise.

## Tranche-S implications

1. **Regenerate `src/animation/CLAUDE.md`'s `## Files` inventory from the
   actual 7-zone tree** (Finding 1) — this is a single-file, mechanical
   rewrite (mirror the top-level `CLAUDE.md`'s already-correct
   `## Project Tree` structure, but at per-file granularity within each
   zone) and should be an early, cheap wave item so every subsequent S wave
   that touches the library isn't working against a doc that describes a
   structure that no longer exists. Add a decomposition-gate clause (or
   extend an existing doc-freshness gate) that asserts every filename
   `src/animation/CLAUDE.md` claims to document actually exists on disk at
   the path claimed — this would have caught the drift the day R.W1 landed.
2. **Fix `scripts/proof-decomposition.mjs`'s header docstring** (Finding 2)
   to match its own R.W0-keystoned constants (500L, 1 override) — small, but
   do it in the same pass as any other `proof:*.mjs` header/constant
   reconciliation sweep S runs.
3. **When S does its "deeper sub-zoning" wave** (compile/backward/,
   compile/easing/, engine/css/, per the mission brief), budget carve targets
   to land noticeably under 500L, not AT it (Finding 6) — the existing
   six-file cluster at 488–499L should be the first candidates re-examined:
   any S wave that adds even modest logic to `engine/animation.ts`,
   `compile/frame-compiler.ts`, `orchestration/sequence/sequence.ts`,
   `physics/spring/progress.ts`, `engine/playback.ts`, or `group/group.ts`
   will immediately need a second carve pass. Pre-emptively splitting these
   six now (while the seams are still fresh from R.W2b) is cheaper than
   discovering the red mid-S-wave.
4. **`presets/classic.ts`'s single override should be preserved as-is** — no
   S action needed; it is the correct, narrowly-scoped exception the R.W0
   keystone was designed to allow, and inventing a second override (or
   forcing a 3-way taxonomy split) would be a regression, not an improvement.
5. **No anemic-fragment cleanup needed** — the R.W2b carve set is clean on
   this axis; S does not inherit fragment debt from this wave.
