# Adjudication — panel-2 r2 (TRUE-FABLE seat) — THE PANEL-2 r2 ADJUDICATED SET

> Adjudicator 2, r2 re-deployment, union-with-demarcation protocol. Duty: PROVE or
> DISPROVE every contested/load-bearing finding of the six r2 lanes (H1, H2, D, E, K, F)
> with MY OWN on-disk verification; reconcile every cross-lane conflict explicitly;
> inherit adjudication-panel1-r2's settled rows without re-litigation. Phase 1 below was
> written and fixed on disk BEFORE the prior (Opus) adjudication-panel2.md was opened.
> Every ruling rests on a probe I ran myself (grep/sed/git/find), not on vote-counting.

## G0-prime tree pins (every tree I read)

| tree | path | branch | HEAD | version | role |
|---|---|---|---|---|---|
| keyframes-v-exec | /Users/mkbabb/Programming/keyframes-v-exec | master | `0dac636b` | 6.0.0 | CANONICAL kf |
| kf W9 staging | same repo | v/w9-staging | `b920b190` | — | staged gate quartet |
| kf baseline | same repo, historical | — | `1acf25c6` | 0.9.97 | pre-4.0 archaeology probes |
| value.js | /Users/mkbabb/Programming/value.js | tranche-u | `db77dbd8` | 4.0.0 | value.js |
| parse-that | /Users/mkbabb/Programming/parse-that | master | `ef10d5b` | — | pinned |
| bbnf-lang | /Users/mkbabb/Programming/bbnf-lang | master | `b3cf48e3b` | — | pinned (panel-1 territory) |
| atlas ACTIVE | /Users/mkbabb/Programming/.p-totality/atlas | p/totality | `fe9abcf` | 7.0.0 | external-consumer census |
| glass-ui | /Users/mkbabb/Programming/glass-ui | master | **`2a949abe`** | 7.0.0 | external-consumer census — **NOTE: has ADVANCED past every r2 lane's pin (`1b20f7d0`); docs-only drift for the census (the kf-import set verified identical at both pins where load-bearing)** |

Not read in Phase 1: any skeptic-*/adjudication-*/FINAL-* file beyond the charter's
permitted set (six r2 lanes + adjudication-panel1-r2 + owner corpus). The stale
/Users/mkbabb/Programming/atlas and the dirty /Users/mkbabb/Programming/keyframes.js
were not cited for any fact.

## Inherited settled rows (adjudication-panel1-r2 — NOT re-litigated here)

TP′/G0′ tree discipline · G1′ parser archaeology + incumbency (extant value parser =
unmeasured day-old v4 regex/char-split rewrite; parse-that incumbent v1.0.0→v3.1.0;
S9 was kf-side; benches+perf gate died in `164343c1`) · G2′ value /css owns
keyframes-adjacent grammar · G3′ wedge pricing (ERESOLVE hard-fail; value working-tree
deps bomb → STRIP/RELOCATE, not lockstep-bump) · G4′ kf fence pack + 3 atlas chase
sites · G5′ structure-just-settled + LT-10 amend-don't-fork · G6′ SCI-1 DECIDED
SHIP-4.1.x (D54, vehicle W56) — inherit, never re-adjudicate · G7′ subpaths = 7
files/163L export-map homes, not shims; R13′ dissolution allowed keys-frozen under the
D50 api-extractor boundary · G8′ kf V closed-by-fold · R2′ parser successor =
three-way bench-adjudicated, born-RED greenfield · R6′ gamut policy amendments (deltaE
restore prerequisite; HDR drop row; sequence against W56) · R14′ tests-isomorphism
born-RED on BOTH repos · N-ADJ-1/2/3. My rows below CONNECT to these where relevant.

---

# PHASE 1 — verification + the adjudicated set

## §V — my verification ledger (probes run this session, all reproducible)

| # | Probe | Result → bearing |
|---|---|---|
| V1 | `published-surface.md:44` read | VERBATIM claims "glass-ui BB `W-EASING-PRIMITIVE` + the demo KF-OSCILLATOR scene consume" `Oscillator` — H1's quote exact |
| V2 | glass-ui grep `Oscillator\|waveformValue\|W-EASING-PRIMITIVE` over src at `2a949abe` | ZERO import hits (only unrelated harmonic-oscillator prose in blob physics) → the recorded consumer is FALSE |
| V3 | kf demo scene roster (`ls demo/scenes`) | `amiga cube easing sequence spring square` — NO oscillator scene → the second recorded consumer is FALSE |
| V4 | atlas `activeViz.ts:24` | "`Oscillator` ambient breath is CUT (deferred to D4)" — atlas deliberately does NOT consume it |
| V5 | `waapi/delegation.ts:1`, `scroll/dispatch.ts:31`, `scroll/drive.ts` region | all import `createNativeTimeline`/`NativeTimelineSpec` from `../orchestration/timeline/native` → timeline/native IS engine/scroll-wired (H1 confirmed) |
| V6 | `compile/emit/backward/backward.ts:56`-region, `walk.ts:21`-region | both import `Sequence` from `../../../orchestration/sequence` → Sequence emit-wired (H1 confirmed) |
| V7 | atlas actual import statements | `ManualTimeline` (useScrollTimeline.ts:44), `MorphSVG` via `@mkbabb/keyframes.js/engine` (buildMarkAnimation.ts:7), `Sequence`+`loadAnimationEngine` (useLoadSequence.ts:33-38), `stagger`+`springTimingFunction`+`StaggerOrigin` (useScrollLettering.ts:53-58), `springTimingFunction`+`springLinearStops`+`StaggerOrigin` (variant-registers.ts:9-13), `RAFPlayback`, `NumericAnimation`, `SpringProgress` → H1's atlas census REPRODUCED |
| V8 | atlas `fromDrawSVG` grep | ONLY prose hits (useLoadSequence.ts:42,91 — comments incl. "live-proven: fromDrawSVG(null) degraded the whole /usf route"); the import block (:33-38) does NOT import it → draw-svg EXT=0 stands |
| V9 | glass-ui kf import census at HEAD `2a949abe` | **Draggable ×1 (useDragMorph.ts:54), MorphRect ×1 (useElementMorph.ts:4), SmoothProgress ×3, SpringProgress ×9, NumericAnimation ×4, springTimingFunction ×2, springLinearStops ×1, TimingFunction ×2, SmoothProgressOptions ×1** — census MUCH larger than H1's "3 symbols / 3 files" |
| V10 | `git show 1b20f7d0:src/composables/motion/morph/useDragMorph.ts \| grep Draggable` | line 54 `import { Draggable, SpringProgress } from "@mkbabb/keyframes.js"` — **present at H1's OWN pin** → H1's glass census was undercounted at its own tree |
| V11 | kf demo `Draggable` | file hits are PROSE ("Draggable rows" comment, useSequenceDemo.ts:315); actual imports = `Sequence`, `stagger`, type `CSSKeyframesAnimation` → demo does NOT import Draggable (H1's DEMO=0 right; F's "Draggable (2 files)" cell was filename-grep, not imports) |
| V12 | `published-surface.md:49-50` + EP-3 §196-210 | `splitText` has a MANIFEST row (S.F2 SF-10, a11y-oracle cite) but is NOT in the EP-3 PATH-B decided-terminal table (`flip/flipShared, drag/Draggable, DrawSVG/fromDrawSVG` only — verified) |
| V13 | K.W8/K.W9 book rows (published-surface.md:90, :111) | both sections exist as recorded feature theses → scroll/ingest OWNER-DECISION grounded |
| V14 | value src greps: `Into(` / `color-mix\|contrast-color` / `okhsl` | ALL zero → D3/D6/D8/D5 drop facts confirmed |
| V15 | `git show 164343c1:CHANGELOG.md` §4.0.0 ONLY (awk-scoped to the first `## `) | exactly ONE hit: ":25 `/color` owns … gamut mapping, contrast …" — continuity language; ZERO capability-drop names (raytrace/okhsl/deltaE/ramp/Into/color-mix) in the 4.0.0 section; the 14 whole-file hits are all HISTORICAL sections → D-r2-04 silent-drop finding CONFIRMED at the section grain |
| V16 | `mapColorToGamut` read (operations.ts:133+) | chroma bisection over Result-allocating convert/numericSource calls, no ΔE stop — D §2 profile confirmed |
| V17 | kf scars | color.ts:120-124 hand-rolled oklab Euclidean ΔE; backward.ts:30-32 stale `sampleColorRamp`/`deltaEOK` docstrings; easing.ts:44 `bounceInEase`; format.ts:62 `unflattenObjectToString` — ALL verified verbatim |
| V18 | `git grep -ci gamut 1acf25c6 -- src` (kf) | ZERO → K's no-gamut-in-kf-baseline proof re-derived |
| V19 | blob-hash: kf `1acf25c6:src/units/color/colorFilter.ts` vs value `35cd9d5d:src/units/color/colorFilter.ts` | BOTH `5ffd41c3…` — byte-identical → K's carve-out identity proof re-derived |
| V20 | `4ee8e345` commit body | "ADDITIVE only; the JS Timeline sampler stays (the ARCH-kill of REPLACING it HOLDS; no polyfill)" — K-1 verbatim |
| V21 | `git grep toRgba8Into 164343c1^ -- src` | zero → never existed pre-v4 (D's refutation of the Opus into-list confirmed); `parseSpring` DID exist (`164343c1^:src/index.ts` + parsing/timeline) → D's U11 confirmed |
| V22 | kf workflows grep `depcruise\|proof:structure\|run lint` | ZERO hits → F2-GAP1 confirmed; `ci.yml:16` cron `"17 3 * * 1"` = weekly → F2-GAP2 confirmed; `ci.yml:100` `npm run audit:lighthouse \|\| echo` masked → F confirmed; `smoke.mjs` pageerror = 0; `deploy-pages.yml:38,41` dispatch-bypass `if:` guards verified |
| V23 | `.dependency-cruiser.cjs:126-131` | "There is NO known-violations baseline … never created and is not wired" — F's OPUS-refutation #1 (phantom GS-04 doc-fix) verified |
| V24 | `boundary-cohesion.test.ts` head | readFileSync/readdirSync source-text asserts → shape-class confirmed; `v/w9-staging` = `b920b190`+`95e53f5e` staged-only confirmed |
| V25 | zone test LOC | scroll 800 / svg 807 / ingest 1027 / waapi 737 — F's figures EXACT |
| V26 | value e2e: library imports / ci.yml | 0 library imports; 0 playwright/e2e refs in ci.yml → E's UC-1/UC-2 re-derived |
| V27 | `V-PRIME.md:110` B3 | "the journey subset + the 11.7k-line e2e corpus pruning at **W55** (owns the .github edit)" verbatim → E's N-1 confirmed; B1 row = the W53 perceived-space plate rebuild (bears on the boundary-sampler RESTORE rider) |
| V28 | named catches | T/PROGRESS.md:212 contains "smoke-safari engine oracle" (grep-verified); U/PROGRESS.md:121 U.W-A11Y BR-1..BR-11 + lane commit `42608eb`; o12 mint commit `15e306e0` "boot-G o12 mint" + U/DISPOSITION-LEDGER.md:273 "ZERO hits for backing-ratio / o12" → E's C1/C4 catches + the R-1 born-GREEN-post-cure refutation all verified |
| V29 | value decompose/quantize consumers | `decomposeMatrix\|recomposeMatrix\|interpolateDecomposed` = 0 across kf src/demo/test/bench; `quantizePixels\|dominantColor` = 0 across kf + glass-ui + atlas; decompose = 609 LOC exact → H2's F-H2-4/5 confirmed |
| V30 | value repo hygiene | root `*.png` = 39 exact; api `.ts` sans dist = 125 files (H2 said 138 — file-type counting drift, immaterial) → H2's F-H2-6/8 confirmed in substance |
| V31 | value deps block | `{"@mkbabb/glass-ui":"^7.0.0","@mkbabb/keyframes.js":"^6.0.0"}` in `dependencies` → G3′ inherited fact re-verified |

## §X — cross-lane conflict reconciliations (explicit, each with the ruling)

**X1. Parser-history (K) vs parser-present (D) vs panel-1 G1′ — NO CONTRADICTION; a
two-repo answer.** K proves the kf-side parser EXIT was RIGHTLY (blob-identical
carve-out V19, staged delegation, owner-doctrine-ratified; kf has had no parser since
2026-04-17). D proves the value-side v4 REPLACEMENT of the measured parse-that parser
was the UNJUSTLY event (unmeasured day-old regex successor, benches+gate deleted in
the same commit — V14/V15 + inherited G1′). The owner's "why was this done, in what
tranche" answer: the kf→value delegation across 2026-02-25/04-17 (RIGHTLY), then the
value-internal `164343c1` rewrite of 2026-07-17 (condemned; successor decided by the
inherited R2′ three-way bench). RULING: both lanes stand; the packet must present the
split answer, never a single "the parser drop" row.

**X2. Zone wiring vs zone consumption — the wiring class is REAL and verified.**
timeline/native has 3 runtime engine/scroll importers (V5); Sequence is emit-wired
(V6); waapi rides the play strategy (H1, consistent with V5's delegation file). A
"zero demo imports" observation can never prune play-path/emit infrastructure.
RULING: H1's wiring-amended verdicts (timeline KEEP-EARNED, waapi KEEP-EARNED,
sequence KEEP-EARNED) ADOPTED on my own probes.

**X3. Deliberate-KEEP records vs prune candidates — three different record states,
three different outcomes.** (a) EP-3 PATH-B rows (flip, drag, draw-svg) are
decided-terminal, machine-checked → OWNER-DECISION class, EXCEPT where live
consumption now defeats the vacuity premise (drag — X6). (b) The oscillator record
(published-surface.md:44) EXISTS but BOTH its named consumers are FALSE on disk
(V2/V3/V4): a record whose factual predicates fail is not a decision — it is a
doc-truth defect. RULING: oscillator = PRUNE-CANDIDATE (record-refuted), with a
mandatory record-correction rider and owner visibility flagged (charter tension
acknowledged: the shield is pierced by refutation, not absence). (c) K's F6 register
(K-1 thrice-affirmed JS-sampler KEEP, no-polyfill law, ARCH-kill wall, spring-solver
LEAD, OD-3) FENCES the scroll/timeline/physics prune debates: any V-next prune there
must cite and overturn the named ruling with new Baseline evidence. RULING: F6
becomes a standing FENCE ANNEX attached to the zone tables.

**X4. H2's "subpaths RESTRUCTURE (NO SHIMS)" vs inherited G7′ ("export-map homes, not
shims").** RECONCILED via R13′: the files may dissolve (keys frozen, explicit
`/index` specifiers per D50, packed-surface re-verify) — the owner's aesthetic edict
is honored by dissolution WITHOUT accepting the "shim" characterization G7′ disproved.
H2's row is re-worded accordingly in table (b).

**X5. F's demo-Draggable cell vs H1's drag DEMO=0.** V11: the two demo files match on
PROSE only; no import exists. H1 right; F's cell corrected (immaterial to F's own
verdicts — the zone-orphan binding survives).

**X6. The glass-ui census drift — adjudicator-novel, changes one zone verdict.**
V9/V10: glass-ui imports `Draggable` at runtime (useDragMorph.ts:54) — at H1's OWN pin
and at HEAD. H1's "drag EXT=0" is FALSE; orchestration/drag has a live external
runtime consumer. RULING: drag → **KEEP-EARNED** (amended from OWNER-DECISION); the
EP-3 row's no-DEMO-scene disclosure stays true and stays booked (the auto-flip
trigger is demo-scene-specific and has NOT fired). Likewise physics/smooth gains
glass-ui ×3 consumption (strengthens KEEP-EARNED) and physics/morph gains a
`MorphRect` type-only edge (noted; type edges do not defeat runtime vacuity).

**X7. H2's e2e SHRINK flag vs E's per-oracle set.** E's lane owns the grain; H2's
magnitude flag folds into E's adjudicated table (d.3) with zero conflict.

**X8. D's R4 measured-parser restore vs panel-1 R2′.** The RESTORE row does NOT
pre-decide the successor: it restores the MEASUREMENT (bench/ + portable ratio gate +
the reference corpus) and lands whichever successor the R2′ three-way bench crowns.
Sequenced accordingly in (c).

**X9. D's R13 boundary-samplers rider vs V-PRIME B1.** V27: value's own plan rebuilds
the perceived-space plate at W53 (the gamut overlay is terminally retired). The
boundary-sampler restore is GATED on W53's actual needs — connected, not duplicated.

## (a) THE kf ZONE DISPOSITION TABLE (canonical `0dac636b`)

Classes: KEEP-EARNED (consumption/wiring/measurement earned) · OWNER-DECISION
(deliberate record or restructure edict — distinct from PRUNE per charter) ·
PRUNE-CANDIDATE (no unrefuted record, zero consumption on all four consumer trees).

| Zone (LOC) | Verdict | One-line why | Bound tests |
|---|---|---|---|
| engine/ (2,602) | **KEEP-EARNED** | universal hub; heaviest demo+external consumption | test/engine/**, test/characterization/** |
| compile/ (4,888) | **KEEP-EARNED** (emit-shrink note) | the 6.0.0 forward pipeline; emit/backward Sequence-wired (V6); `compileToViewTransition` demo=0 noted | test/compile/** |
| resolve/ (1,083) | **KEEP-EARNED** | calc/container-query/env capability | test/resolve/** |
| group/ (1,665) | **KEEP-EARNED** | AnimationGroup demo ×11; SoA floor ≥1.2×@K=8 bit-identical (floor-only evidence noted) | test/group/** |
| waapi/ (978) | **KEEP-EARNED** | engine-wired play strategy (delegation-TO-native); every eligible play rides it | test/waapi/** (737L — bound: survives with zone) |
| physics/spring + spring/css | **KEEP-EARNED** | glass-ui SpringProgress ×9 + springTimingFunction ×2 + springLinearStops ×1 (V9); atlas ×4; MEASURED 2.97–3.78×; K F6.6 solver-LEAD fence | test/physics/spring*.test.ts |
| physics/decay | **KEEP-EARNED** | scroll+drag wired; MEASURED ~22× | test/physics/decay.test.ts |
| physics/smooth | **KEEP-EARNED** (census upgraded) | glass-ui ×3 files (V9) + scroll/timeline wired | test/physics/smooth.test.ts |
| physics/numeric | **KEEP-EARNED** | glass-ui ×4 + atlas ×3 (V7/V9) | test/physics/numeric.test.ts |
| physics/playback | **KEEP-EARNED** | engine/group + atlas RAFPlayback | test/physics/playback-bind.test.ts |
| physics/oscillator (~150) | **PRUNE-CANDIDATE (record-refuted)** | published-surface.md:44's BOTH named consumers false on disk (V1–V4); record-correction rider mandatory; owner visibility flagged | test/physics/oscillator.test.ts (dies with zone) |
| physics/morph | **OWNER-DECISION** | rides flip's PATH-B; glass-ui `MorphRect` TYPE edge noted (V9) — type-only, does not flip the class | test/physics/morph.test.ts |
| orchestration/sequence | **KEEP-EARNED** | emit-wired (V6) + demo sequence scene (V11) + atlas useLoadSequence (V7) | test/orchestration/sequence*.test.ts |
| orchestration/stagger | **KEEP-EARNED** | demo + atlas useScrollLettering/StaggerOrigin ×4 (V7) | test/orchestration/stagger.test.ts |
| orchestration/view-transition | **KEEP-EARNED** (thin) | demo-consumed | test/orchestration/view-transition.test.ts |
| orchestration/timeline (322) | **KEEP-EARNED** | native.ts 3 runtime importers (V5); atlas ManualTimeline runtime (V7); K-1 fence (V20) | test/orchestration/timeline.test.ts |
| orchestration/flip (176) | **OWNER-DECISION** | EP-3 PATH-B decided-terminal (V12); demo hits prose-only; auto-flip trigger recorded, unfired | test/orchestration/flip.test.ts |
| orchestration/drag (585) | **KEEP-EARNED** ← amended (X6) | glass-ui `Draggable` RUNTIME import (useDragMorph.ts:54, both pins — V9/V10); EP-3 disclosure row stays booked | test/physics/drag.test.ts |
| orchestration/split-text (486) | **PRUNE-CANDIDATE** | 0 consumers on all four trees (V11-class greps + H1); manifest row :49 is descriptive, NOT a decided-terminal EP-3 row (V12); casualty = the split-a11y oracle, named | test/orchestration/split-text.test.ts, split-a11y-oracle.test.ts |
| svg/draw-svg (~194) | **OWNER-DECISION** | EP-3 PATH-B (V12); atlas `fromDrawSVG` hits are PROSE-only (V8) — but that prose records a real historical live-proof; the book row is the owner's call | test/svg/draw-svg.test.ts |
| svg/morph-svg (~350) | **KEEP-EARNED** | atlas `MorphSVG` runtime via `./engine` (buildMarkAnimation.ts:7 — V7) | test/svg/morph-svg.test.ts |
| svg/motion-path (~180) | **PRUNE-CANDIDATE** | 0 consumers anywhere; no EP-3 row; rides native offset-path (not a duplicate — mechanism per CHANGELOG F.W12); atlas lean-catalog names it only as a "reserved fold-slot; no live preset" | test/svg/motion-path.test.ts |
| scroll/ (1,233) | **OWNER-DECISION** | K.W9 book (V13) + compile-wired + drives the native fast lane; FENCED by K-1 thrice-affirmed + no-polyfill law (V20, K F6) | test/scroll/** (800L — bound) |
| ingest/ (835) | **OWNER-DECISION** | K.W8 book (V13); zero consumption disclosed; round-trip differentiator thesis is the owner's to keep or kill | test/ingest/** (1,027L — bound) |
| presets/ (905) | **KEEP-EARNED** (SHRINK note) | 4 of ~41 presets demo-touched — catalog breadth is the excess, not the zone | test/presets/** |
| internal/ (535) | **OWNER-DECISION (restructure, not prune)** | owner verbatim dislike; 10-zone fan-in; inherited G5′/LT-10 amend-don't-fork governs the rename debate | test/internal/** |
| constants/ (370) | **KEEP-EARNED** | the type spine; atlas TimingFunction | — |
| validate/public/load-engine (547) | **KEEP-EARNED** | demo ×12 + atlas loadAnimationEngine (V7); LIGHT barrel's beneficiaries live (glass-ui/atlas LIGHT sets) | test/_root/** |

**Aggregate:** unilaterally prune-eligible ≈ **0.8k LOC** (split-text 486 +
motion-path ~180 + oscillator ~150); OWNER-DECISION book-kept ≈ **2.4k LOC** (flip,
draw-svg, physics/morph, scroll, ingest — drag having exited to KEEP-EARNED);
everything else KEEP-EARNED with named shrink notes (emit-backward, play-lifecycle
552L/5-file fragmentation, presets breadth, SoA floor-only evidence).

## (b) THE value.js ZONE DISPOSITION TABLE (`db77dbd8`)

| Zone (LOC) | Verdict | One-line why | Bound tests/gates |
|---|---|---|---|
| color/ (891) | **KEEP + RESTORE program** | kf ×7 + demo consumption; the v4 gamut successor is the owner's named interrogation target (V16); restores land here (c) | test/ color suites + `proof:gamut-alloc`-class gates to be resurrected with (c) |
| css/ (1,948) | **KEEP surface, REWRITE parser** | kf 29 sites / 39 symbols; parser = the inherited R2′ born-RED three-way bench; `collectDeclarations` orphan noted | grammar-fuzz + fixtures + resurrected bench/ (c-P4) |
| value.ts (36) | **KEEP** | CssValue ubiquitous in kf (×16 sites) | existing unit suites |
| foundation/ (126) | **KEEP** | kf ×5 src + 34 demo sites | existing |
| easing.ts (171) | **KEEP** (+ D13 rider UNCLEAR) | kf ×3 sites; the halved curve-family line is principle-less — restore-or-tombstone decision rides (c)-P11 region | existing |
| transform/path.ts (564) | **KEEP** | kf morph/draw-svg PathGeometry (2 sites) | existing |
| transform/decompose.ts (609) | **PRUNE or decided kf-adoption wave** | ZERO consumers outside own tests (V29); the natural consumer solved the problem another way | its 2 test files die or move with it |
| quantize.ts + /quantize (139+2) | **DEMOTE to demo** | zero kf/glass/atlas consumers (V29); value-demo-only | demo test tree |
| subpaths/ (163) | **DISSOLVE-ALLOWED (keys frozen)** | per inherited G7′/R13′ — export-map homes, not shims; D50 explicit-`/index` boundary + packed-surface re-verify gate the move (X4) | `proof:packed-surface`-class gate |
| api/ (125 .ts files sans dist) | **EXTRACT from repo** | standalone palette backend; zero library imports (V30) | its own CI when extracted |
| e2e/ (~13.4k) | **per the E-lane adjudicated set** — table (d).3 | ABROGATE ~5.9k oracles + ~856 perf; FOLD ~1.7k; KEEP-EARNED ~1.7k; plan-KEEP journey ~1.2k at W55 (V26–V28) | W55 re-gate owns the .github edit |
| demo/ (31k) | **KEEP as product; tranche-work restructure** | owner addendum-3 §2; colocation edict; W53 plate rebuild row noted (V27) | W42 typecheck re-gate + W50 journeys (V-PRIME B3/B4) |
| root PNGs ×39 + demo tests in test/ | **DELETE / DISPLACE** | verified 39 exact (V30); tests-isomorphic edict + inherited R14′ | the R14′ born-RED isomorphism gate |
| package.json deps block | **STRIP/RELOCATE → devDependencies** | inherited G3′ (+N-ADJ-1 self-dep prior art); registry cycle + install drag otherwise (V31) | pre-publish manifest gate |

## (c) THE RESTORE LEDGER (priority-ordered; owning library; landing module)

All rows are UNJUSTLY-DROPPED (or panel-1-amended) capabilities; kf-side work is
CONSUME-ONLY + scar deletion (V17) — K proved no kf-owned capability needs restoration
(V18/V19). Sequencing constraints inherited: G6′ (SCI-1/W56 is DECIDED — extend, don't
re-adjudicate), R6′ (deltaE restore is a PREREQUISITE of the gamut anchor), X8/X9.

| P | Row | What (mode) | Owner | Landing module |
|---|---|---|---|---|
| 1 | R-DELTAE | ΔE family: deltaEOK (+JND const), deltaE2000, deltaEITP — as-was, typing modernized; PREREQUISITE of P2 | value.js | `src/color/` |
| 2 | R-GAMUT | analytical Ottosson engine (cusp+Halley) + ΔE-OK JND clip criterion (CSS Color 4 §13 conformant) + raytrace exact-boundary as TEST-SIDE reference oracle; zero-alloc kernel under the frozen v4 facade | value.js | `src/color/` (kernel) + `test/` (raytrace oracle) |
| 3 | R-INTO | zero-alloc Into family EXTENDED beyond the decided SCI-1 pair: convert/mix/gamut-map/ramp out-param channel paths incl. `mapColorToGamutInto`/`safeAccentColor`-class hot paths — rides/extends the W56 4.1.x vehicle, never forks it | value.js | `src/color/` |
| 4 | R-PARSER | the MEASUREMENT restore: `bench/` corpus (recipe `git show 164343c1^:bench/css-parse-perf.mjs`) + the portable co-scaling ratio gate (U-F14 lesson) + the R2′ three-way successor bench; the successor lands whichever contender the bench crowns (X8) | value.js | `src/css/` + `bench/` + CI |
| 5 | R-RAMP | `sampleColorRamp`/`At`/`Into` + `mixColorsN`; kf backward-emit re-adopts, DELETING the V17 scars (color.ts:120-124/:181, backward.ts:30-32 docstrings) | value.js (kf consume rider) | `src/color/` |
| 6 | R-MIX-GRAMMAR | `color-mix()` grammar + structural node (V14: zero hits today) | value.js | `src/css/grammar.ts` |
| 7 | R-RELATIVE | relative color `from` syntax (grammar hard-fails it today) | value.js | `src/css/grammar.ts` |
| 8 | R-CONTRAST | `contrast-color()` grammar + decision rider: re-publish WCAG metrics | value.js | `src/css/` + `src/color/` |
| 9 | R-OKHSL | OKHSL/OKHSV spaces (reuse P2's cusp math) | value.js | `src/color/` |
| 10 | R-HDR | the 11-day HDR parse drop (`ictcp()`/`jzazbz()` spellings, 3.1.0→4.0.0) — inherited R6′(c); owner decides vs the CSS-native-only law | value.js | `src/css/` |
| 11 | R-SPRING-GRAMMAR | CSS `spring()` easing grammar (`parseSpring`/`lowerSpringEasing` — existed pre-v4, V21) with an ownership decision value-vs-kf (kf owns the spring SOLVER — K F6.6; the GRAMMAR is CSS-spec territory) | decision row | `src/css/` or kf `spring/css` |
| 12 | R-EVAL | calc/math static evaluator (`evaluateMathFunction`) — WEAK candidate; owner spec-coverage mandate vs DOM-resolution status quo | value.js | `src/css/` or `src/foundation/math.ts` |
| 13 | R-SOA | channel-fold SoA re-litigation as a NEW primitive under the zero-alloc mandate (the 3.0.0 tombstone stands as written — no relitigation of the record) | value.js | `src/color/` |
| 14 | R-BOUNDARY | gamut boundary samplers — GATED on the W53 perceived-space-plate rebuild's actual needs (X9); UNCLEAR otherwise | value.js | `src/color/` iff pulled |

Tombstones (RIGHTLY — never re-litigate): the OO/ValueUnit model flip · kf 5.0.0
aliases · animate.ts zombie · loadEngine/loadCompiler/loadIngest · flattenObject
family (D28/D54) · cubicBezierToSVG · the `timingFunctions` aggregate registry
(S live-bug) · BBNF grammar files · color-soa-as-3.0.0-decided · kf parsimmon parser
+ kf units/color (TRANSFERRED, not lost — V19) · the U apparatus collapse
(owner-ordered) · keyframes-vue (owner-killed).

## (d) THE GATES/TESTS PROGRAM (both repos)

**kf (all facts verified V22–V25):**
1. **LAND W9 first** (rebase per FOLD-FORWARD over the W2-landed deploy-pages.yml):
   MR1 pageerror-keying, MR2 wire the 5 skip-masked browser oracles, MR3
   `require_demo_green` default-true break-glass, MR4 `test:demo` in CI; plus the
   staged prune (~1,384L bench/scripts cruft + the gc arm + the it.fails wrapper +
   `proof:owner-golden`→`review:`).
2. **WIRE the two enforcement-free structural guards** — `lint` (depcruise) +
   `proof:structure` as two one-line CI steps (<2s each; zero workflow hits in all
   history — V22). The single cheapest real wire before a restructure tranche.
3. **DEMOTE `audit:lighthouse` from ci.yml** (masked `|| echo`, cannot fail, no named
   catch — V22); keep as local instrument.
4. **RELABEL the weekly roster** (cron dow=1 — V22) — NOTE: this is ALREADY BOOKED as
   DISPOSITIONS.md CH-05 "FOLD W10" (my connection; F's FABLE-NEW-2 is pre-booked in
   part — fold, don't double-book; the freshness-window prose correction rides it).
5. **Fold-or-lose the clamp invariant**: `boundary-cohesion.test.ts` (source-text
   class — V24) folds its clamp-single-site rule into proof:structure, then dies; the
   3 partial `readFileSync` asserts (oscillator/resize-tracks/orbital-rotate3d) get
   FLAG rows at the restructure.
6. **BIND zone tests to zone verdicts** (scroll 800 / svg 807 / ingest 1027 / waapi
   737 — V25): a pruned/owner-killed zone takes its suite with it; no orphaned green.
7. **SEQUENCING LAW**: MR2/MR4 land BEFORE the restructure (green witnesses before the
   ~340-line import-rewrite churn — inherited R4′/FLAT′ census).
8. **The owner's presumption ruling**: "most tests are overfit nonsense" is REFUTED on
   this tree — ~98% behavior/contract-bearing, residue ~500L/130 files, snapshot-
   theatre family EMPTY (1 deliberate characterization file). The apparatus is
   half-right-condemned: honest gates, unlanded adjudication + 2 unwired guards + 1
   pretense name + 1 unfailable observer + a 7× cadence mislabel.

**value.js:**
1. **BUILD the tests-isomorphism gate** (inherited R14′ — born-RED: 5 demo-component
   test files at library test/ root; no structure gate exists at all).
2. **The library gate surface stays producer+api** — the e2e fleet proves nothing
   about the packed library (0 imports — V26); no e2e on library gates.
3. **The e2e adjudicated set (E-lane union, honoring V-PRIME B3/W55 — V27):**
   ABROGATE the `oracles/` design-census mass (~5.9k, 0 catches — the o12 credit
   died at V28's born-GREEN mint proof) + headless `perf/`+`reactivity-instant`
   (~856; U-F54 ×3) · FOLD o1/o2→boot, browse×2→walk, mobile→viewport param,
   dual-pane→build-check, webgl→CH-7 annex + 1 context-loss probe,
   o16→glass-ui producer surface · KEEP-EARNED page-load/walk/admin-walk/
   color-space-switching/a11y-battery/safari-trio (~1.7k; catches C1/C2/C4 verified
   V28) · plan-KEEP the journey subset (~1.2k; flows/admin-flows/populated/
   gradient+mix) at the W55 re-gate; safari + real-GPU annex pre-deploy/nightly.
4. **Pre-publish manifest gate** (deps strip; N-ADJ-1 self-dep prior art) — inherited.
5. **Resurrect bench/ + the portable ratio perf gate** with RESTORE P4.
6. **Capability-diff gate** — see (f).

## (e) AMENDMENT ROWS (H1′ onward) for the recommendation set

| Row | Amendment |
|---|---|
| **H1′** | H1-r2's zone table ADOPTED with THREE census amendments on my probes: (i) orchestration/drag → KEEP-EARNED (glass-ui `Draggable` runtime import at BOTH pins — V9/V10; H1's 3-symbol glass census was undercounted at its own tree); (ii) physics/smooth carries glass-ui ×3 external consumption; (iii) physics/morph carries a `MorphRect` type edge. Oscillator PRUNE upheld AND generates a doc-truth defect row: published-surface.md:44's two consumer claims are false and `proof:publish` does not check consumer-claims — only coverage-file existence. |
| **H2′** | H2-r2's table ADOPTED with: subpaths row reconciled to G7′/R13′ dissolve-allowed (X4); api count 125 .ts sans dist (immaterial drift); deps row inherits G3′ STRIP (never lockstep-bump). The core-shrank headline (5,020→4,647, −7.4%; the explosion is ~93% apparatus) stands and should HEAD the value.js narrative in the packet. |
| **D′** | D-r2's union RESTORE set ADOPTED as table (c) with my priority order + the W56/W53 sequencing constraints (X8/X9). The v4-section CHANGELOG probe (V15) sharpens D-r2-04 to the section grain: ONE continuity line, ZERO capability-drop names. D's F14 selective-silence mechanism (no advocate ⇒ no tombstone) is the named failure mode for (f). |
| **E′** | E-r2's union verdict table ADOPTED whole (V26–V28 re-derivations); the W55 plan is the binding vehicle; the o12 catch-credit stays dead (born-GREEN mint `15e306e0` — V28); safari + a11y KEEP-EARNED on verified catches. |
| **K′** | K-r2 ADOPTED in full — the blob-hash identity and no-gamut-in-kf proofs re-run by me (V18/V19); headline for the packet: NO unjust drop exists in kf's pre-4.0 window; the owner's named losses are value.js-lane entirely. K's F6 8-ruling register becomes the standing FENCE ANNEX (X3c). |
| **F′** | F-r2 ADOPTED with two adjudicator notes: the weekly-relabel is partially pre-booked at DISPOSITIONS CH-05 (fold, don't double-book — d.4); the demo-Draggable cell was filename-grep noise (V11). F's refutation of the phantom GS-04 doc-fix row verified (V23) — that row must NOT enter the successor tranche. |
| **X′** | The cross-lane reconciliations X1–X9 enter the packet as explicit rows (the parser two-repo answer X1 and the record-state trichotomy X3 are load-bearing for the owner's addendum-2 questions). |

## (f) THE SILENT-DROP GOVERNANCE LAW ROW — SUPPORTED, evidence named

Evidence base: V15 (the v4.0.0 CHANGELOG section names ZERO dropped capabilities while
asserting "/color owns … gamut mapping" continuity over an engine swap) · D's U19/F14
selective-silence (consumer-advocated rows got D28/D54 dispositions; unadvocated
capabilities — raytrace, ΔE, OKHSL, ramps, the parser+benches — died with zero paper)
· K's finding that both silent kf cuts predate the governance apparatus and the record
turns clean exactly where governance begins (CHANGELOG v2.1.0, tranches at A) ·
N-ADJ-1 (inherited: the constellation has shipped a nonsense manifest before) · E's
RF-3 ("pruning theater ≠ dropping product coverage") already ratified value-side.

**LAW (proposed for ratification at V-next formation):** *No capability may leave a
published surface without a by-name tombstone row — RIGHTLY / UNJUSTLY / UNCLEAR +
one-line rationale — in the cutting release's CHANGELOG section, machine-checked by a
capability-diff gate (export-census diff between the prior tag and the candidate cut;
red on any removed export lacking a tombstone row). "No audited consumer" alone is an
INVALID drop rationale (owner edict: consumer count is NOT enough). The named failure
mechanism this law kills: no-advocate ⇒ no-tombstone.* Owning repos: BOTH (value.js
first — it is where the mechanism fired; kf's 6.0.0 record already models compliance).

---

# PHASE 2 — union with the prior (Opus) adjudication-panel2.md

*(Opened only after Phase 1 above was fixed on disk. Every material Opus ruling
presumed INCORRECT and tested against my own probes; fresh Phase-2 probes:
balancedText at `164343c1^` (13 hits — its docket-1 cite REAL), `src/transform/`
listing (no index.ts — its docket-2 requirement REAL), `backward.ts:68`
`serializeScrollOptions` (EXACT — its scroll-serialize wiring REAL),
`constants/defaults.ts:86` `useWAAPI: true`, src-wide
`compileToString\|formatKeyframes` = 0, plus V1–V31 above.)*

Root assessment: the prior adjudication's mechanics are strong where it ran probes
(parser per-file table, subpaths blast radius, decompose/quantize, scroll-serialize
wiring, the silent-drop law) — but its zone dispositions carry ONE systematic hole:
**it never ran an external-consumer census** (glass-ui/atlas checked nowhere in its
evidence), and it inherited the r1 lanes' worst errors (the kf-gamut premise, the
~500-LOC e2e survivor set, the o12 catch credit). Five kf zone verdicts and the
archaeology headline die of it.

## OPUS-REFUTED (tested and wrong — the disproofs) — 13

| # | Prior ruling | Disproof |
|---|---|---|
| XR1 | Docket 3/H3′: **waapi OWNER-DECISION on "product-dormant (demo NEVER sets useWAAPI)"** | `constants/defaults.ts:86` — `useWAAPI: true` is the DEFAULT; the demo doesn't set it because it's ON; every eligible play on the deployed demo rides the WAAPI strategy. Dormancy premise false; "platform-redundant" inverts the delegation-TO-native direction. → **KEEP-EARNED** |
| XR2 | Docket 3: **orchestration/timeline OWNER-DECISION** (E.W9 KEEP only; "0 internal + 0 demo" for the prune half) | timeline/native has 3 RUNTIME engine/scroll importers (V5) and atlas imports `ManualTimeline` at runtime (useScrollTimeline.ts:44 — V7). The zone is consumption-earned, not merely record-shielded. → **KEEP-EARNED** |
| XR3 | Docket 3: **flip PRUNE-CANDIDATE** | EP-3 PATH-B decided-terminal row exists, machine-checked by proof:publish (V12) — the charter's OWNER-DECISION class; the ruling axis was never checked. → **OWNER-DECISION** |
| XR4 | Docket 3: **drag PRUNE-CANDIDATE ("comment-only, never imported")** | Demo comment-only is TRUE (V11) but glass-ui imports `Draggable` at RUNTIME (useDragMorph.ts:54 — at the r2 lanes' pin AND HEAD, V9/V10). The external census was never run. → **KEEP-EARNED** |
| XR5 | Docket 3: **draw-svg PRUNE** | EP-3 PATH-B row (`DrawSVG`/`fromDrawSVG` — V12). Ruling axis unchecked. → **OWNER-DECISION** |
| XR6 | Docket 3: **morph-svg OWNER-DECISION on "zero demo, SPECULATIVE"** | atlas imports `MorphSVG` at runtime via `./engine` (buildMarkAnimation.ts:7 — V7). → **KEEP-EARNED** |
| XR7 | Docket 3: **ingest PRUNE-CANDIDATE ("no deliberate-keep record")** | The K.W8 book row EXISTS (published-surface.md:90 — V13). → **OWNER-DECISION** |
| XR8 | Zone table (a): **physics/spring/css OVERFIT ("platform-redundant native linear()")** | `springTimingFunction`/`springLinearStops` LIVE in spring/css and are demo- + atlas- (V7) + glass-ui-consumed (×2/×1 — V9); emitting `linear()` IS the export-to-native seam. → **KEEP-EARNED** |
| XR9 | Zone table (a): **load-engine/LIGHT-HEAVY OWNER-DECISION ("ceremonial… demo always calls loadAnimationEngine")** | The LIGHT static barrel has live external beneficiaries consuming it WITHOUT the heavy chunk: glass-ui's entire kf set (V9) + atlas LIGHT imports (V7). The split's raison d'être is alive. → **KEEP-EARNED** |
| XR10 | Docket 5/H5′: **"DOUBLE gamut loss… kf deleted its own gamut subsystem (903-LOC color/utils.ts w/ 48 gamut/oklab refs)… two-sided extinction"** | `git grep -ci gamut 1acf25c6 -- src` = ZERO (V18); the baseline's oklab hits are CONVERSION function names; every deleted kf color file was byte-identical in value.js since `35cd9d5d` 2024-07-17 (V19). kf NEVER had gamut-mapping code; the loss is SINGLE-sided (value.js v4). The value-side half of the docket survives (V14/V16). The "loss was value not holding it" note is also false — value held it from its first commit. |
| XR11 | Docket 6/H6′: **the ~500-LOC e2e survivor set ("page-load + ≤3 named-catch oracles o16/color-space/o12 + 1 axe battery")** | o12's catch credit is DEAD (born-GREEN post-cure mint `15e306e0` + DISPOSITION-LEDGER:273 — V28); `safari/` is OMITTED despite the fleet's best-documented wild catch (WebKit veil-forever, T/PROGRESS.md:212 — V28); "1 axe battery" cannot subsume the DRIVEN a11y battery that found 2 born-RED WCAG defects (U/PROGRESS.md:121 — V28). → replaced by the E-r2 union set (~2.9k: KEEP-EARNED core + W55 journey subset) in (d).3 |
| XR12 | Docket 6: **boundary-cohesion PRUNE because it "duplicates lint + proof:structure R6"** | depcruise checks IMPORT EDGES; R6 checks UNUSED EXPORTS; NEITHER enforces the no-open-coded-clamp SOURCE-TEXT invariant. A naked prune LOSES the invariant. → prune-with-FOLD into proof:structure (d).5 |
| XR13 | Docket 4/H4′: **trim "dead `compileToString`/`formatKeyframes`"** | Both symbols = ZERO hits across all of kf src at `0dac636b` — phantom trim rows against a nonexistent surface. The real shrink note is `compileToViewTransition` (demo=0, verified) |

## OPUS-UNVERIFIABLE (excluded from the union product; for the record) — 2

1. Zone table (a) **group/composite-SoA "OVERFIT"** — the floor-only evidence fact
   (≥1.2×@K=8, bit-identical) is confirmed; "OVERFIT" as a verdict is judgment beyond
   the evidence (the arm is validated-ADOPT). Carried as an evidence-note, not a verdict.
2. H6′'s **"proof:structure (47 recorded catches…)"** — no such count exists anywhere I
   read (the on-disk record: 4 born-RED witness logs + 2 named catch classes). Not
   provable, not load-bearing; the KEEP verdict stands on the selftest + witnesses.

## UNION-CONFIRMED (in the prior set AND independently re-derived) — ~25 row-cores

Docket 1 parser reconciliation (= my X1's value-side half; per-file regex table
direction; balancedText pre-v4 cite verified) · Docket 2 subpaths dissolution +
keys-frozen + create-`transform/index.ts` + drop-`./quantize`-key + blast radius (V29,
`src/transform/` listing) · Docket 3's scroll SPLIT (serialize KEEP-EARNED —
backward.ts:68 verified; sampler OWNER-DECISION — I attach the K-1 fence) and its
split-text/motion-path prunes · Docket 4's shrink direction (compileToCSS+
compileToEntry consumed ×4 demo files; VT=0; CC-3 refusal is real) · Docket 5's
VALUE-side loss half (raytrace/ΔE/ramp/Into = 0 at HEAD — V14) + the kf scar/stale-
docstring findings (V17) · Docket 6's ABROGATE-for-value.js-the-library (V26) +
"R2-07 prune never landed" (V24) + value-needs-a-from-scratch-structure-gate (R14′) ·
Docket 7 decompose-PRUNE + quantize-DEMOTE (V29) · Docket 8's silent-drop law (= my
(f); V15) · zone rows engine/compile/resolve/group/physics-core/presets/sequence/
stagger/view-transition KEEP-EARNED · internal restructure direction (G5′ mechanism
attached) · the `src/animation/` flatten (R4′) · zone-orphan test binding (V25) ·
play-lifecycle shrink note · the RESTORE core R1–R9/R11 ≈ my P1–P5/P8/P9/P11–P14
(with my sequencing riders).

## FABLE-NEW (mine, absent from the prior adjudication) — 15 families

1. The **oscillator row** — absent from the Opus zone table entirely: PRUNE-CANDIDATE
   (record-refuted, V1–V4) + the doc-truth defect row (proof:publish checks coverage-
   file existence, NOT consumer claims).
2. The **physics/morph row** (also absent) — OWNER-DECISION + glass-ui `MorphRect`
   type edge.
3. The **external-consumer census upgrade** as a standing discipline: glass-ui
   `2a949abe` census (Draggable/SmoothProgress×3/MorphRect/springLinearStops — V9/V10)
   + the tree-drift note (glass-ui advanced past every lane pin).
4. value **api/ EXTRACT** row (125 .ts files sans dist — absent from the Opus table).
5. value **hygiene rows** (39 root PNGs; demo tests displaced per R14′).
6. RESTORE **P6 `color-mix()`** + **P7 relative-color `from`** grammar rows (V14 —
   absent from the Opus ledger).
7. RESTORE **P10 HDR parse drop** row (inherited R6′(c) into the panel-2 product).
8. The kf gates **WIRE gap** (lint + proof:structure in NO workflow ever — V22) +
   lighthouse DEMOTE (masked `|| echo`) + the weekly-cadence relabel WITH the CH-05
   pre-booking connection (fold, don't double-book).
9. The **test-corpus presumption ruling**: REFUTED on tree (~98% behavior-bearing;
   snapshot-theatre family EMPTY; residue ~500L) + the 3 partial readFileSync flags +
   the PATH-COUPLING sequencing law (MR2/MR4 before the restructure).
10. The **W55/V-PRIME B3 vehicle** (V27) — the e2e survivors ride a RATIFIED plan, and
    the **W53 gating of the boundary-sampler restore** (X9).
11. **K's F6 eight-ruling FENCE ANNEX** (K-1 thrice-affirmed, no-polyfill, ARCH-kill
    wall, spring-solver LEAD, OD-3…) attached to every prune debate.
12. The **two-repo parser answer** (X1) with K's stage-0 carve-out + blob-hash proofs
    (V18/V19): NO unjust drop exists in kf's pre-4.0 window — the packet must never
    carry a kf-side parser/gamut loss row.
13. The **record-state trichotomy** (X3): intact record → OWNER-DECISION; REFUTED
    record → pierced shield + correction duty; fence-register rulings → cite-to-
    overturn.
14. The **selective-silence mechanism** (no advocate ⇒ no tombstone) named inside the
    (f) law, with the v4-section-grain probe (V15).
15. The **F-lane corrections carried into the program**: the phantom GS-04 doc-fix row
    (V23) and the demo-Draggable filename-grep noise (V11) must not enter the
    successor tranche.

## Final tally + the union product

- **[UNION-CONFIRMED]: ~25 row-cores** (enumerated above)
- **[FABLE-NEW]: 15 families**
- **[OPUS-REFUTED]: 13** (XR1–XR13; the most consequential = the MISSING
  EXTERNAL-CONSUMER CENSUS, which alone flips FIVE zone verdicts — XR1/XR2/XR4/XR6/
  XR9 — and, jointly with the record-axis misses XR3/XR5/XR7, would have mis-directed
  the executing tranche into pruning consumed, book-kept capability; second = XR10,
  the false kf-gamut premise heading the owner's archaeology seed)
- **[OPUS-UNVERIFIABLE]: 2** (excluded)

**The union product = Phase 1's tables (a)–(f) as demarcated above** — every cell
either FABLE-NEW or UNION-CONFIRMED on my own probes; the XR corrections MUST reach
the final packet: waapi/timeline/drag/morph-svg/spring-css/load-engine are
KEEP-EARNED (not owner-decision/prune/overfit), flip/draw-svg/ingest are
OWNER-DECISION (not prune), the gamut loss is SINGLE-sided (value.js), the e2e
survivor set is the E-r2 union (~2.9k incl. safari + the driven a11y battery, W55
vehicle), boundary-cohesion folds before it dies, and no phantom trim/doc-fix rows
(compileToString/formatKeyframes, GS-04) may be booked.
