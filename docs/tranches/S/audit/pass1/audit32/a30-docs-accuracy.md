# a30 — Docs Accuracy Post-R

Lane: a30-docs-accuracy · 32-lane Tranche R audit · read-only, no source/doc mutation except this file.

## Executive summary

R's own wave docs (R.W7) delegate the "authoritative per-file inventory" to
`src/animation/CLAUDE.md` — and that file was never touched during Q or R. It
still describes the **pre-partition flat file layout** (`engine.ts`,
`group.ts`, `waapi.ts`, `frame-compiler.ts` as top-level siblings, no
`physics/`/`orchestration/`/`compile/`/`resolve/`/`ingest/`/`scroll/`/`svg/`
directories at all) — the exact structure R.W1 dissolved. This is not a minor
staleness; it is the single most-referenced internal doc describing a tree
that no longer exists anywhere in the repo. Root `CLAUDE.md` fares better but
still carries a real defect (a wrongly-included excised export, `animate`,
in the published HEAVY list) and a large omission (the entire
ingest/scroll/compile round-trip surface — 20+ exports — is absent from the
HEAVY list even though the zone directories that house it are named in the
same doc). The tranche's own naming is internally inconsistent: R is titled
and repeatedly called the "seven-zone partition" while every wave doc that
enumerates the zones lists ten (`physics/ orchestration/ engine/ group/
compile/ resolve/ ingest/ scroll/ presets/ svg/`), and the shipped tree has
eleven library zones plus `internal/` — twelve counting `waapi/`, which is
missing from the CLAUDE.md tree entirely. `demo/CLAUDE.md`, by contrast, is
accurate and current — it reflects the R.W5 scene-fusion correctly and its
nested structure checks out against `ls`. `docs/frontend-design/demo/*.md`
are pre-fusion proposals that still cite the killed `demo/app/scenes/` and
flat `demo/<name>/` paths; they are historical record, not live guidance, and
should be marked as such or archived. Net: docs accuracy is a genuine R
residue — the tranche shipped code faster than it shipped truth about the
code, and R.W7 institutionalized the gap by pointing the README at a file it
never opened.

## Findings

### 1. `src/animation/CLAUDE.md` describes a tree that no longer exists (CRITICAL)
**Evidence:** `src/animation/CLAUDE.md:32-58` ("Files" tree) lists `engine.ts`,
`frame-compiler.ts`, `group.ts`, `waapi.ts`, `adapter.ts`, `animate.ts`,
`motion-path.ts`, `draw-svg.ts`, `numeric.ts`, `smooth.ts`, `spring.ts`,
`springLinearStops.ts`, `springTimingFunction.ts`, `morph.ts`, `flip.ts`,
`drag.ts`, `decay.ts`, `stagger.ts`, `sequence.ts`, `timeline.ts`,
`playback.ts`, `easing.ts`, `animations.ts`, `constants.ts`, `utils.ts`,
`format.ts` as flat top-level files under `src/animation/`, with `internal/`
holding only 5 files. None of the zone directories introduced by R.W1
(`physics/`, `orchestration/`, `engine/`, `group/`, `compile/`, `resolve/`,
`ingest/`, `scroll/`, `presets/`, `svg/`) or by Q (`waapi/` per commit
`6f2493d`) appear anywhere in the file. `git log -1 --format=%h -- src/animation/CLAUDE.md`
= `ac40f72`, dated 2026-06-23 21:25 — pre-Q, pre-R. R.W7
(`docs/tranches/R/waves/R.W7.md:101-103,342-344`) explicitly discusses this
file, calls it "restored" (i.e., NOT deleted), and states the README should
point to it "for the authoritative per-file inventory" (`README.md:120`:
`For the authoritative per-file inventory, see [src/animation/CLAUDE.md]`) —
but R.W7 never re-authored its content. The Classes section
(`src/animation/CLAUDE.md:112-121`) documents `Animation`/`CSSKeyframesAnimation`
as living in `engine.ts` (a file that no longer exists — split into
`engine/animation.ts` + `engine/css-animation.ts`), and documents `animate()`
(`src/animation/CLAUDE.md:200-206`) as a live front door — but `animate()` was
EXCISED from the published surface at R.W4 (`src/animation/index.ts:154-158`:
"R.W4 §2.5 — `animate()` was EXCISED from the published surface... 0 demo call
sites... owner-ratified 2026-06-24").
**Proposal:** Full rewrite of `src/animation/CLAUDE.md` against the current
11-zone tree (§ finding 3) is Tranche-S wave-1 work — every class/file
reference in the file is suspect until re-verified, not just spot-fixed.

### 2. Root `CLAUDE.md` HEAVY export list is wrong (includes excised `animate`, omits ~20 live exports) (HIGH)
**Evidence:** `CLAUDE.md:71`: `**HEAVY (dynamic...):** Animation, CSSKeyframesAnimation,
AnimationGroup, getAnimationId, getTimingFunction, resolveKeyframes, animate,
MotionPath/fromMotionPath, DrawSVG/fromDrawSVG, presets, DIRECTIONS, FILL_MODES,
defaultOptions, defaultLayerConfig.` Two defects:
  - `animate` is listed but was excised from the published surface at R.W4
    (see finding 1's citation of `index.ts:154-158`). It is reachable only via
    a deep import of `animate.ts`, not via `loadAnimationEngine()`'s
    `AnimationEngine` interface (`src/animation/load-engine.ts:118-197` — no
    `animate` key in the interface).
  - The actual `AnimationEngine` interface (`load-engine.ts:118-197`) exports
    ~39 members; the CLAUDE.md list names 14 and is missing `MorphSVG`/
    `fromMorphSVG`, `fromStyleSheets`, `fromLiveAnimations`,
    `resolveLiveKeyframes`, `adoptRunning`, `ScrollScene`/`createScrollScene`,
    `parseScrollCSS`/`parseScrollTimeline`/`parseScrollRange`,
    `serializeScrollOptions`, `roundTripScrollCSS`, `dispatchScrollBackend`,
    `resolveRange`, `pinCSS`, `compileToCSS`, `validate`, `explain`,
    `CSSKeyframesToString`/`CSSKeyframesToStrings`,
    `formatCSSKeyframeString`, `transformTargetsStyle`, `yieldToMain` — i.e.
    the entire ingest/scroll/compile round-trip surface that the SAME doc's
    zone-directory list (`compile/`, `resolve/`, `ingest/`, `scroll/`,
    `CLAUDE.md:23`) claims exists.
**Proposal:** Regenerate the HEAVY list mechanically from
`AnimationEngine`'s keys (there is already a generator precedent —
`scripts/gen-agent-surface.mjs`); do not hand-maintain it.

### 3. "Seven-zone partition" is a persistent misnomer — actual count is 10 (11 incl. internal/, 12 incl. waapi/) (HIGH)
**Evidence:** `CLAUDE.md:20-22`: "The library is partitioned into seven
cohesive zone directories (R.W1)... `physics/`, `orchestration/`... `engine/`,
`group/`, `compile/`, `resolve/`, `ingest/`, `scroll/` + `presets/` + `svg/`" —
that sentence itself names 10 directories under the label "seven." The origin
is `docs/tranches/R/R.md:42-43`: "a **seven-zone directory partition**
(`physics/ orchestration/ engine/ group/ compile/ resolve/ ingest/ scroll/` +
`presets/ svg/`)" — same 10-item list, same "seven" label. The wave doc that
actually specs the work is internally consistent about the true count:
`docs/tranches/R/waves/R.W1.md:477`: "the sole exception to the barrel rule
across **10 zone directories**" and `:498`: "Every introduced zone directory
(`physics/`, `orchestration/`, `engine/`, `group/`, `compile/`, `resolve/`,
`ingest/`, `scroll/`, `presets/`, `svg/`)" — 10, matching `ls
src/animation/`. Shipped reality (`ls src/animation/`) is 12 directories:
the 10 above + `internal/` (pre-existing, absorbed into the barrel rule per
R.W1 decision) + `waapi/` (promoted from a flat `waapi.ts` sometime after
R.W1, evidenced by commit `1f7d323`: "waapi-densify uses KeyframesAnimation
type" and the live `src/animation/waapi/{delegation,densify,eligibility,emission,options,index}.ts`).
The Tranche-S mission brief you were given even inherits the error verbatim:
"7-zone src/animation partition [physics, orchestration, engine, group,
compile, resolve, ingest, scroll, svg, presets, internal]" — that bracketed
list has 11 items under a "7-zone" label, and omits `waapi/` (a 12th).
**Proposal:** Either (a) rename the pattern honestly — "the N-zone
partition" computed from `ls -d src/animation/*/ | wc -l` at every doc
touch, or (b) fold `waapi/` into `engine/` (it is WAAPI delegation for the
engine, a plausible sub-zone) to make the directory count match SOME
intentional number, and state that number correctly everywhere. Do not
carry "seven" forward into Tranche S wave names.

### 4. `CLAUDE.md`'s `group/` and `engine/` file citations are stale relative to the actual zone contents (MEDIUM)
**Evidence:** `CLAUDE.md:41`: "`group/` ... AnimationGroup (group.ts) + soa.ts
+ **layer-springs.ts**" — the actual file is `src/animation/group/springs.ts`
(confirmed via `ls src/animation/group/`: `compositor.ts, entries.ts,
group.ts, index.ts, layer-api.ts, scheduler.ts, soa.ts, springs.ts`; commit
`81a5114` "R.W2: group — demote scaffold... 4-way layer-springs split
(entries/scheduler/springs/layer-api)" — the split RENAMED the concept but the
doc kept the pre-split filename). `CLAUDE.md:40`: "`engine/` ... KeyframesAnimation
+ CSSKeyframesAnimation (animation.ts)" — actual: `KeyframesAnimation` is in
`engine/animation.ts`, `CSSKeyframesAnimation` is in a SEPARATE file
`engine/css-animation.ts` (`grep -n "^export class" src/animation/engine/{animation,css-animation}.ts`
confirms the split). `CLAUDE.md:42`'s `compile/` file list ("frame-compiler,
backward, backward-color, format, parse-flatten, easing-registry") omits 4 of
10 actual files: `backward-walk.ts`, `easing-option.ts`, `numeric-plan.ts`,
`selector.ts`. `CLAUDE.md:104`: "**WAAPI eligibility** (`waapi.ts`)" cites a
single file; it is a 6-file directory (`waapi/{delegation,densify,eligibility,emission,options,index}.ts`).
`CLAUDE.md:44`'s `internal/` list ("leaves, binarySearch, errors,
reduced-motion, scheduler, scroll-phases") omits `animation-id.ts` and
**`group-factory.ts`** — the latter is the DI seam R itself calls out as a
keystone deliverable (memory: "the engine↔group↔waapi no-cycle ring BROKEN
[via] `getGroupFactory` DI seam"), yet it is invisible in the doc meant to
inventory `internal/`.
**Proposal:** Fold into the same rewrite pass as finding 1 — these are all
symptoms of the same file never being touched post-R.W2/R.W2c.

### 5. `docs/frontend-design/demo/*.md` cite paths killed by R.W5 fusion (MEDIUM)
**Evidence:** All 8 per-scene design docs open with a path header citing the
PRE-fusion layout: `docs/frontend-design/demo/amiga.md:3`: "`demo/app/scenes/AmigaScene.vue`
(+ `demo/amiga/{useAmigaAnimations,useSphereSpin,utils}.ts`)"; similarly
`cube.md:3,349`, `easing.md:3`, `motion-path.md:3`, `sequence.md:3`,
`spring.md:3,412`, `square.md:3,115` all cite `demo/app/scenes/<Name>Scene.vue`
and flat `demo/<name>/...ts`. R.W5 fused both roots into
`demo/scenes/<name>/` (confirmed live: `ls demo/scenes/` = `amiga cube easing
morph motion-path sequence spring square`; `demo/app/` no longer has a
`scenes/` subdirectory — `ls demo/app/` shows no `scenes/` entry). These docs
are dated 2026-06-17 (`git log -1 -- docs/frontend-design/demo` last touch
predates R by roughly a week) and are explicitly framed as PROPOSALS ("This is
a PROPOSAL — no source is written outside this doc" — `square.md:3`), so they
are not lying about current state so much as now unreadable without knowing
which paths moved.
**Proposal:** Archive-candidate, not delete — they carry real design
rationale (touch lists, palette decisions) that Tranche-S's frontend work may
still want. Either (a) move to `docs/frontend-design/archive/` with a
one-line path-remap note at the top of each, or (b) do a mechanical
`demo/app/scenes/` → `demo/scenes/` and `demo/<name>/` → `demo/scenes/<name>/`
sed pass if the docs are still going to guide live work.

### 6. `docs/precepts/audits/` — relevance unclear, no README pointer (LOW)
**Evidence:** `docs/precepts/audits/overfitting-audit.md` and
`docs/precepts/audits/REAUDIT-2026-04-30/` last touched 2026-06-17 (`3dd6335`)
and untouched further; `docs/precepts/README.md` exists but this lane did not
find it cross-linking the audits directory contents into current tranche
process (not verified exhaustively — spot check only). No stale path
references were found IN `overfitting-audit.md` itself (0 hits for
`src/animation/*.ts` patterns), so it is not factually wrong, just of
uncertain standing relative to the newer `docs/tranches/<letter>/audit/`
convention used since at least Tranche O.
**Proposal:** Tranche S should decide once whether `docs/precepts/audits/`
is a living lane (fold into the tranche audit convention) or a frozen
snapshot (rename with a date-frozen marker, e.g.
`docs/precepts/audits/2026-04-30-FROZEN/`) — low urgency, no correction
needed today, just a namespacing decision.

### 7. Root `CLAUDE.md`'s `demo/@/` bullet flattens a two-level path (LOW)
**Evidence:** `CLAUDE.md:52`: "`├── @/  # Shared library: animation-controls
suite, asset-manager, dock, editor-shell, matrix-editor, orbital-drag,
composables, styles, utils`" reads as if those six named things sit directly
under `demo/@/`. They actually sit under `demo/@/components/custom/` (`ls
demo/@/components/custom/` confirms `animation-controls, asset-manager, dock,
editor-shell, matrix-editor, orbital-drag` plus 10 singleton `.vue` files not
named at all); `demo/@/components/ui/menubar/` is a sibling not mentioned;
`composables/`, `styles/`, `utils/` ARE directly under `demo/@/` and correctly
named. `demo/CLAUDE.md:23-32` gets this right (nests correctly under
`components/custom/` and `components/ui/menubar/`) — so the fix is to make
root `CLAUDE.md` consistent with the (correct) `demo/CLAUDE.md`, e.g. by
deferring entirely to it rather than restating a compressed, misleading
version.
**Proposal:** Either delete the demo sub-bullet detail from root `CLAUDE.md`
(point to `demo/CLAUDE.md` only, same pattern R.W7 chose for
`src/animation/CLAUDE.md`) or fix the nesting.

### 8. `bench/` count in root `CLAUDE.md` is off by one, self-computing comment makes it low-severity (INFO)
**Evidence:** `CLAUDE.md:59`: "`bench/ # ... Count: ls bench/*.bench.ts | wc
-l (9 at the O+P impl-drive)`" — live count is 10 (`ls bench/*.bench.ts | wc
-l` = 10). The doc already instructs the reader to derive the number rather
than trust the parenthetical, same convention as the `test/` line
immediately above it (`CLAUDE.md:57-58`, which is accurate: 97 files matches;
956 vs. claimed 957 is within the doc's own "derive, don't trust a frozen
number" caveat). Not a correction so much as a note that the self-computing
convention is working as designed — flagging only because the parenthetical
number itself is stale and could be dropped instead of updated forever.
**Proposal:** Drop the parenthetical entirely (keep only the `ls`/`wc`
command) for both `test/` and `bench/` lines — the "N at tranche X" annotation
guarantees staleness on every future tranche; the command needs no annotation.

## Positive findings (accurate, no correction needed)

- `demo/CLAUDE.md` tree (lines 1-45) matches `ls -R demo/` exactly, including
  the R.W5-fused `scenes/<name>/` layout, `app/` composables
  (`useContractAnimGroup.ts`, `useSceneTransport.ts` — confirmed present, no
  more, no less), and the `animation-controls/` internal breakdown.
- README.md's dynamic-boundary section (`README.md:124-140`) and Quick Start
  (`README.md:12`, `./engine` subpath) correctly reflect the shipped R.W4
  surface — no stale flat-file references found via targeted grep.
- `package.json` script names (`check`, `check:lib`, `dev`, `dev:playground`,
  `build`, `gh-pages`, `test`, `bench`, `proof:all`) all match root
  `CLAUDE.md`'s `## Build` block verbatim (`package.json:40-44,47,237-240`).
- The scene-switcher removal claimed in R.W1's plan table
  (`docs/tranches/R/R.md:71`) and audited in
  `docs/tranches/R/audit/challenge-demo.md` is genuinely reflected in the
  shipped demo: zero `SceneSwitcherCarousel` hits anywhere under `demo/`.

## Tranche-S implications

1. **Wave 1, first item, blocking:** rewrite `src/animation/CLAUDE.md` from
   scratch against the live 12-directory tree (`ls -d src/animation/*/`).
   Treat every sentence in the current file as unverified; do not patch, redo.
   This is the file the README explicitly delegates authority to
   (`README.md:120`) — it cannot ship another tranche stale.
2. **Same wave:** regenerate root `CLAUDE.md`'s HEAVY export list
   mechanically from `AnimationEngine`'s interface keys
   (`src/animation/load-engine.ts:118-197`), not by hand. Remove `animate`.
   Consider a `proof:claude-md-surface-sync` gate (analogous to
   `proof:published-surface`) that diffs the documented HEAVY list against
   the actual interface keys and REDs on drift — this class of bug will recur
   every time a zone gains an export otherwise.
3. **Same wave:** resolve the "seven-zone" misnomer once, everywhere
   (`CLAUDE.md`, `README.md` if it echoes it, `docs/tranches/R/R.md` can stay
   as historical record but a corrective footnote is cheap). Recommend either
   renaming to the true count or explicitly folding `waapi/` into `engine/`
   as a deliberate S-tranche sub-zoning decision (this dovetails with the
   mission brief's "deeper sub-zoning" goal — `waapi/` under `engine/waapi/`
   is a natural fit and would also fix the miscount by construction).
4. **Docs-cleanup wave:** either sed-remap or archive
   `docs/frontend-design/demo/*.md`'s pre-fusion paths — pick one, don't leave
   them ambiguous, since Tranche S's frontend-design SOTA-uplift charter will
   likely re-read these for prior art.
5. **Low-cost, do alongside wave 1:** drop the frozen "(N at tranche X)"
   parentheticals from the `test/`/`bench/` count lines in root `CLAUDE.md`;
   they are self-defeating against the doc's own "derive, don't trust"
   instruction.
6. **Decide, don't defer:** `docs/precepts/audits/` — fold into the
   `docs/tranches/<letter>/audit/` convention or freeze-and-rename. Low
   urgency but currently ownerless.
7. **Process note for the tranche method itself:** R.W7's "point the README
   at CLAUDE.md for the authoritative inventory, but don't verify CLAUDE.md
   is current" pattern is exactly how this lane's biggest finding happened.
   Any future wave that delegates authority to a doc file should include a
   diff-against-tree assertion in its own gate, not just a prose claim that
   the file "is restored."
