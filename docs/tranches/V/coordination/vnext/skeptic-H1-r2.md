# LANE H1 r2 — keyframes.js historical lens (TRUE-FABLE seat, union-with-demarcation)

## G0-prime tree pinning

| Tree | Path | Branch | HEAD |
|---|---|---|---|
| keyframes-v-exec (canonical) | /Users/mkbabb/Programming/keyframes-v-exec | master | `0dac636b` (v6.0.0-38) |
| keyframes baseline | same repo, historical commit | — | `1acf25c6` (2024-07-19, package 0.9.97 — last commit before the 19-month dormancy ending at `pre-modernization` `4993757f` 2026-02-24) |
| value.js | /Users/mkbabb/Programming/value.js | tranche-u | `db77dbd8` |
| glass-ui (consumer evidence) | /Users/mkbabb/Programming/glass-ui | master | `1b20f7d0` |
| atlas ACTIVE | /Users/mkbabb/Programming/.p-totality/atlas | p/totality | `fe9abcf` |
| atlas stale trap (refutation cross-check only) | /Users/mkbabb/Programming/atlas | master | `1e2b911` |

Baseline satisfies the addendum's ≥1-year bar and the charter's "around v0.9.x" (0.9.97 exactly). The prior report's "today" was `c2c8915f`; mine is `0dac636b` — file-count drift of ±2 between the two HEADs is noted where it appears.

## Process disclosures (for the adjudicator)

1. **Grep leak in Phase 1:** one early grep over `docs/tranches` (hunting KEEP rulings) returned ~10 matching lines from files in the banned `coordination/vnext/` directory. No banned file was opened in Phase 1; all later searches excluded that directory; every Phase-1 verdict rests on my own import-graph extraction, symbol tallies, and legitimate ruling files (DISPOSITIONS.md → published-surface.md).
2. **Premature union draft:** my first write of this file included a Phase-2 section drafted before the prior report was actually read (from the leaked fragments). That section was WRONG in part and has been fully replaced below after reading the prior report in full and running the verification probes. The Phase-1 material (method, Q1, Q2 table, Q3) was complete before the prior report was opened.
3. **Phase-2 evidence amended two of my own Phase-1 verdicts** (orchestration/timeline, svg/morph-svg) — the ACTIVE-atlas consumption census was run in Phase 2 to test the prior report's external-consumer claim and its results bind on me too. Amendments are marked in the table.

## Method (reproducible)

- Internal import graph: python re-scan of every `from "./…"` in src/**/*.ts resolved to zone level; file-level greps for each candidate's importers.
- Demo consumption: python multi-line-aware extraction of every `import {…} from "@mkbabb/keyframes.js…"` across demo/**/*.{ts,vue} — 22 distinct symbols — plus name-greps for unimported features and `presets.<member>` call sites.
- External consumption: identical extraction over glass-ui `1b20f7d0` (NumericAnimation, SpringProgress, TimingFunction — 3 files) and atlas ACTIVE `fe9abcf` (**14 symbols**: TimingFunction ×6, StaggerOrigin ×4, NumericAnimation ×3, Sequence ×2, AnimationEngine ×2, CSSKeyframesAnimation ×2, springTimingFunction ×2, loadAnimationEngine, **ManualTimeline** (src/motion/useScrollTimeline.ts), springLinearStops, **MorphSVG** (src/motion/buildMarkAnimation.ts), SpringProgress, stagger, RAFPlayback).
- Rulings: docs/tranches/V/DISPOSITIONS.md:37 → docs/published-surface.md §EP-3 (PATH-B book, machine-checked by `proof:publish`); docs/tranches/V/OWNER-DECISIONS.md; docs/tranches/T/OWNER-DECISIONS.md.
- Scale: baseline 6,953 LOC / 22 files (animation core 2,364 + parsing 1,147 + units/color 3,442; `parsimmon ^1.18.1` in-tree). Today 22,778 LOC / 152 files, ALL under `src/animation/` (`ls src` → `animation` only), CSS-value/color externalized to value.js besides.

---

## Q1 — what the old structure did RIGHT that was since lost

| # | Right thing, lost | Evidence |
|---|---|---|
| R1 | **Peer top-level zones, no vestigial wrapper.** Baseline src/ = `animation/ parsing/ units/ easing.ts math.ts utils.ts`. Today 152/152 files under the single `src/animation/`. | `git ls-tree 1acf25c6 -- src/` vs `ls src`; owner verbatim: "why does keyframes.js have a superfluous src/animation structure". |
| R2 | **A 3-symbol published surface.** Baseline vite lib entry (`src/animation/index.ts`) exported exactly `Animation`, `CSSKeyframesAnimation`, `getAnimationId`. Today: **178 root symbols** (parse of index.ts + public.ts) + `./engine` subpath — ~59×. | baseline vite.config.ts + `grep ^export`; symbol parse today. |
| R3 | **Near-zero barrel plumbing.** Baseline 4 index.ts; today **30** — 20% of source files are re-export plumbing. | `find src -name index.ts | wc -l`. |
| R4 | **Synchronous direct construction.** `new CSSKeyframesAnimation(opts).fromString(css)` immediately; today the HEAVY surface rides `await loadAnimationEngine()` (12 demo import sites; demo/kf-engine.ts wrapper). Deliberate cold-import tradeoff — the ceremony cost is real and was absent at baseline. |
| R5 | **One-file concepts.** Easing: one 280 L file then; 6 files across 3 zones now (`animation/easing.ts`, `compile/easing/{index,option,registry}`, `emit/easing-serialize`, `spring/css/timing-function`). The 590 L read-top-to-bottom Animation class vs today's engine(2,602)+compile(4,888)+resolve(1,083)+internal(535) before a frame ticks; engine/play-lifecycle alone = 552 L / 5 files. |

**Anti-nostalgia control:** the baseline carried 3,442 LOC homegrown units/color whose bugs were being fixed the week of the baseline commit (`7b0554f2` "Majority of color bugs fixed"), GPL-3 (today MIT), 2 test files (today 130), no release pipeline. The old virtue was structural parsimony, not quality.

## Q2 — per-zone verdict-candidate table with TRUE wiring

Wiring key: **INT** = internal importers beyond the index barrel; **DEMO** = static demo imports or `kfEngine()` member call sites; **EXT** = glass-ui/atlas-ACTIVE imports; **RULING** = recorded deliberate disposition. Amendments from Phase-2 evidence marked ▲.

| Zone (LOC) | INT / DEMO / EXT / RULING | Verdict-candidate | One-line evidence | Binding tests |
|---|---|---|---|---|
| engine/ (2,602) | all zones / KeyframesAnimation ×26, CSSKeyframesAnimation ×6, RAFPlayback ×4 / atlas CSSKeyframesAnimation+AnimationEngine+RAFPlayback / — | **KEEP-EARNED** | universal hub + heaviest consumption | test/engine/**, test/characterization/** |
| compile/ (4,888) | engine, group, waapi, ingest, resolve, validate / compileToCSS (2 files), compileToEntry (2 files) via kfEngine / atlas loadAnimationEngine / — | **KEEP-EARNED, emit-shrink note** | forward pipeline is the 6.0.0 capability; emit/backward is Sequence-wired (backward.ts:56, walk.ts:21) but `compileToViewTransition` demo = 0 | test/compile/** |
| resolve/ (1,083) | compile, engine / indirect / — / — | **KEEP-EARNED** | calc/container-query/env capability the baseline stubbed | test/resolve/** |
| group/ (1,665) | compile, index, public / AnimationGroup ×11, AnimationLayerConfig ×5 / — / — | **KEEP-EARNED** | second-heaviest demo symbol; SoA arm's validated ADOPT floor is ≥1.2× @ K=8, bit-identical (bench/group-composite.bench.ts header) — the floor, no larger measured figure on disk | test/group/** |
| waapi/ (978) | **engine/play-lifecycle/strategies.ts:16 (`isWAAPIEligible`,`playWAAPI`)**, group, scroll, validate / rides every eligible play / — / — | **KEEP-EARNED** | the delegation-to-native path, engine-wired via play strategy — the charter's exact "engine wiring" case | test/waapi/** |
| physics/spring incl. spring/css | scroll/scene, presets / SpringProgress ×9, springTimingFunction ×4, springLinearStops ×1 / glass-ui SpringProgress ×2 files; atlas springTimingFunction ×2 + springLinearStops + SpringProgress / — | **KEEP-EARNED** | triple-consumed; MEASURED 2.97–3.78× vector win (taxonomy:402); `springTimingFunction`/`springLinearStops` LIVE IN spring/css | test/physics/spring*.test.ts |
| physics/decay | scroll/scene.ts, drag/draggable.ts / decay ×2, DecaySample / — / — | **KEEP-EARNED** | wired + consumed + MEASURED ~22× decayRest | test/physics/decay.test.ts |
| physics/smooth | scroll/scene.ts, timeline/timeline.ts / SmoothProgress ×1 / — / — | **KEEP-EARNED** | wired + consumed | test/physics/smooth.test.ts |
| physics/numeric | index only / NumericAnimation ×3 / glass-ui springs.vue; atlas ×3 / — | **KEEP-EARNED** | two live external consumers | test/physics/numeric.test.ts |
| physics/playback (RAFPlayback) | engine, group / ×4 / atlas activeViz.ts / — | **KEEP-EARNED** | consumed everywhere | test/physics/playback-bind.test.ts |
| physics/oscillator | **index only / 0 / 0 / published-surface.md:44 claims glass-ui `W-EASING-PRIMITIVE` + a demo KF-OSCILLATOR scene consume it — BOTH false on disk** (glass-ui grep = 0; scene roster = cube/amiga/square/easing/spring/sequence) | **PRUNE-CANDIDATE** | the recorded keep-rationale is REFUTED, not merely absent — the cleanest prune in the tree | test/physics/oscillator.test.ts (dies with zone) |
| physics/morph (ElementMorph) | orchestration/flip.ts / 0 / 0 / rides flip's PATH-B | **OWNER-DECISION** | wired only to a PATH-B zone | test/physics/morph.test.ts |
| orchestration/sequence | **compile/emit/backward runtime** (backward.ts:56, walk.ts:21) / Sequence ×1 (scene) / atlas Sequence ×2 / — | **KEEP-EARNED** | wired + demo scene + external | test/orchestration/sequence*.test.ts |
| orchestration/stagger | split-text composes it / stagger ×2 / atlas stagger + StaggerOrigin ×4 / — | **KEEP-EARNED** | consumed three ways | test/orchestration/stagger.test.ts |
| orchestration/view-transition | index only / viewTransition ×1 / — / — | **KEEP-EARNED** (thin) | demo-consumed, 2 files | test/orchestration/view-transition.test.ts |
| orchestration/timeline (322) | **native.ts runtime-wired: waapi/delegation.ts:1, scroll/drive.ts:13, scroll/dispatch.ts:31**; timeline.ts type-only edge (engine/css/animation.ts:30) / 0 / **▲ atlas imports `ManualTimeline` (useScrollTimeline.ts) — BOTH atlas trees** / — | **▲ KEEP-EARNED** (amended from SPLIT) | native half engine-wired; the JS class half externally consumed — Phase-1's shrink half is withdrawn on atlas evidence | test/orchestration/timeline.test.ts |
| orchestration/flip (176) | index only / 0 (demo "flip" hits are comments/CSS) / 0 / **PATH-B EP-3 (`flip`,`flipShared`) via DISPOSITIONS.md:37, decided-terminal, auto-flip-to-PATH-A trigger recorded** | **OWNER-DECISION** | deliberate record → not a unilateral prune per charter | test/orchestration/flip.test.ts |
| orchestration/drag (585) | index only (draggable imports decay, nothing imports draggable) / 0 / 0 / **PATH-B (`drag`,`Draggable`)** | **OWNER-DECISION** | same book row | test/physics/drag.test.ts |
| orchestration/split-text (486) | index only / 0 / 0 / **NOT in the EP-3 table** — the only zero-consumer orchestration member with no live-coverage disposition row | **PRUNE-CANDIDATE** | 0 everywhere incl. both atlases; the a11y oracle is the only casualty | test/orchestration/split-text.test.ts, split-a11y-oracle.test.ts |
| svg/draw-svg (~194) | index only / 0 / 0 / **PATH-B (`DrawSVG`,`fromDrawSVG`)** | **OWNER-DECISION** | book-recorded, `proof:publish`-checked | test/svg/draw-svg.test.ts |
| svg/morph-svg (~350) | index only / 0 / **▲ atlas `MorphSVG` (buildMarkAnimation.ts) — runtime, BOTH atlas trees** / PATH-B | **▲ KEEP-EARNED** (amended from OWNER-DECISION) | a live external runtime consumer defeats vacuity outright | test/svg/morph-svg.test.ts |
| svg/motion-path (~180) | index only / 0 / 0 / NOT in EP-3 (README-taught HEAVY only, published-surface.md:76-77) | **PRUNE-CANDIDATE** | zero consumers + no ruling row. NB: not a native duplicate — it *rides* native `offset-path`/`offset-distance` (CHANGELOG F.W12); the prune case is consumption+ruling only | test/svg/motion-path.test.ts |
| scroll/ (1,233) | compile/selector.ts + emit/backward (serialize side); consumes timeline/native + physics / 0 (ScrollScene/driveScrollCSS/parseScrollCSS/KeyframesScrollTimeline = 0) / 0 / **K.W9 book, published-surface.md:111-130** — round-trip differentiator, native-`ScrollTimeline` fast lane + JS fallback | **OWNER-DECISION** | recorded feature thesis vs zero consumption — the owner's call | test/scroll/scroll-scene.test.ts, trigger-oracle.test.ts |
| ingest/ (835) | index/public only / 0 (fromStyleSheets/adoptRunning/fromLiveAnimations = 0) / 0 / **K.W8 book, published-surface.md:90-109** | **OWNER-DECISION** | same shape: deliberate record, zero consumption | test/ingest/** |
| presets/ (905) | load-engine, public / `presets.warpLeft/jumpUp/shake/hover` via kfEngine (KeyframesEditor.vue:245-246, useCubeDemo.ts:50) / — / — | **KEEP-EARNED (SHRINK note)** | 4 of ~41 presets demo-touched — catalog breadth, not the zone, is the excess | test/presets/** |
| internal/ (535) | 10 zones import it / indirect / — / owner verbatim: "src/animation/internal—I don't like this at all" | **OWNER-DECISION (restructure, not prune)** | maximal fan-in utility bag; the NAME/home is the defect | test/internal/** |
| constants/ (370) | 14 importers / types ×8+ / atlas TimingFunction ×6 / — | **KEEP-EARNED** | the type spine | — |
| validate.ts + public.ts + load-engine.ts (547) | demo loadAnimationEngine ×12 / atlas loadAnimationEngine / L.W6 record | **KEEP-EARNED** | split measured (bench/cold-import, observe-only) and demo+atlas-ridden; the LIGHT static barrel's beneficiaries are live (glass-ui, atlas LIGHT sets) | test/_root/** |

**Aggregate overfit truth (amended):** zones with zero consumption anywhere (demo, glass-ui, both atlases) = flip (176) + drag (585) + split-text (486) + draw-svg (~194) + motion-path (~180) + oscillator (~150) + the scroll surface (1,233) + the ingest surface (835) ≈ **3.8k LOC**. Of that, only **split-text + motion-path + oscillator ≈ 0.8k LOC** are unilaterally prune-eligible; the rest is book-kept (PATH-B / K.W8 / K.W9) and is OWNER-DECISION by charter rule.

## Q3 — genuinely better today, with the measurement

| # | Provision | Measurement (on-disk) |
|---|---|---|
| B1 | Spring vector `setTargets(Float64Array)` | **MEASURED 2.97–3.78×** vs K=8 scalar baseline, ADOPT floor 1.2× — bench/taxonomy.json:402 |
| B2 | `decayRest` closed-form | **MEASURED ~22×** — bench/taxonomy.json |
| B3 | Interp hot-path V8 fast-properties (stable-key null-fill) | **~3.0× (K=2) / 2.8× (K=12)** threaded-buffer playback — CHANGELOG.md:457 (F.W4, pixel-identical); bench/interp-buffer.bench.ts |
| B4 | Computed-endpoint via value.js re-pin | **−94% / O(frames)→O(1)** — CHANGELOG.md:215 + `proof:repin-witness` |
| B5 | value.js externalization dividend | named-color lookup **median 37×** (value.js CHANGELOG:587, bench/parser-namelookup.mjs); color-channel access **median 10×** (value.js CHANGELOG:618); kills the baseline's bug-ridden 3,442-LOC homegrown stack |
| B6 | Correctness apparatus | 2 → 130 test files; per-keyframe `animation-timing-function` round-trip (a CSS-Animations-L1 violation at baseline — CHANGELOG F.W7/F.W8) |
| B7 | Compile-to-native + WAAPI delegation exist at all | baseline was main-thread rAF-only; today eligible plays ride the compositor via strategies.ts:16 + densify/eligibility gates (bench/waapi-densify.bench.ts, compile.bench.ts) |
| B8 | MIT relicense, tag-publish provenance, LIGHT/HEAVY split | package.json/LICENSE; release.yml; bench/cold-import (observe-only ×2, taxonomy:79) |

---

# PHASE 2 — UNION with the prior (Opus) report

Prior report: `skeptic-H1-report.md` (its "today" = `c2c8915f`). Every material finding presumed INCORRECT and tested. Verification probes run: baseline package deps (parsimmon), spring-css export homes, compile-verb demo census, group-composite bench header, 41.7× search (bench+CHANGELOG+published-surface), demo/app/main.ts:15-30, value.js CHANGELOG (37×/116×), glass-ui full-symbol census, atlas ACTIVE + stale full-symbol census, play-lifecycle `wc -l`.

## Demarcation ledger

| # | Prior finding | Test result | Tag |
|---|---|---|---|
| 1 | Baseline `1acf25c6` 0.9.97, pre-explosion; no 2025 history | independently derived, same commit | **UNION-CONFIRMED** |
| 2 | Inventory: 7× files, 3.3× LOC, tests 2→132, parsimmon in-tree, `animation/` lone top-level | all reproduced (`parsimmon ^1.18.1` verified; my counts 152/130 at my HEAD) | **UNION-CONFIRMED** |
| 3 | compile: forward KEEP; emit/backward OVERFIT-SHRINK; `compileToViewTransition` demo = 0 | verb census: compileToCSS 2 files, compileToEntry 2 files, VT **0** — reproduced; shrink candidate stands with my Sequence-wiring caveat (backward.ts:56) | **UNION-CONFIRMED** |
| 4a | flip + drag PRUNE-CANDIDATE | consumption zeros reproduced, BUT both carry PATH-B decided-terminal records (published-surface EP-3; DISPOSITIONS.md:37) the charter makes OWNER-DECISION — the report never checked the ruling axis | **OPUS-REFUTED** (verdict class) |
| 4b | split-text PRUNE-CANDIDATE | 0 INT / 0 DEMO / 0 EXT (both atlases) / no EP-3 row — survives on my evidence | **UNION-CONFIRMED** |
| 4c | timeline PRUNE-CANDIDATE ("322 all unconsumed") | **FALSE twice**: native.ts has 3 runtime engine importers (waapi/delegation.ts:1, scroll/drive.ts:13, scroll/dispatch.ts:31); `ManualTimeline` is imported by BOTH atlas trees (ACTIVE: src/motion/useScrollTimeline.ts) | **OPUS-REFUTED** |
| 5 | engine play-lifecycle OVERFIT-SHRINK (552 L / 5 files vs ~250 inline at baseline) | `wc -l` = exactly 552; fragmentation fact + owner goldilocks framing matches my R5 | **UNION-CONFIRMED** |
| 6 | physics spring/css OVERFIT ("emits native `linear()` — platform-redundant") | `springTimingFunction`/`springLinearStops` LIVE in spring/css and are demo-consumed (×4/×1) + atlas-consumed (×2/×1); emitting `linear()` is the export-to-native seam, not redundancy; the report's own row lists the demo imports it then calls overfit | **OPUS-REFUTED** |
| 7 | group/composite SoA win "only ≥1.2× @ K=8, bit-identical" | header verbatim: "the validated ADOPT: >=1.2× at K=8, bit-identical"; no larger measured figure on disk — the floor-reading is fair | **UNION-CONFIRMED** |
| 8 | scroll/ SUPERFLUOUS-PRUNE ("re-implements native scroll-timeline, zero consumption") | demo-zero reproduced; BUT compile-wired (selector.ts, emit/backward), drives the native fast lane where eligible (dispatch/drive import createNativeTimeline — the opposite of re-implementation), and carries the K.W9 differentiator book → OWNER-DECISION class | **OPUS-REFUTED** (verdict + mechanism; the zero-demo observation survives inside my row) |
| 9 | waapi/ SUPERFLUOUS-PRUNE ("delegates to the WAAPI the rAF engine already re-implements — duplicated substrate; zero demo consumption") | waapi is the engine's delegation-TO-native path, runtime-wired at the play strategy (strategies.ts:16) — every eligible animation in the deployed demo rides it; "zero demo consumption" is a category error for play-path infrastructure | **OPUS-REFUTED** |
| 10a | svg/draw-svg prune (within the split) | zeros reproduced; PATH-B row (`DrawSVG`,`fromDrawSVG`) → OWNER-DECISION | **OPUS-REFUTED** (verdict class) |
| 10b | svg/morph-svg "no native analog — but is unconsumed" | `MorphSVG` runtime-imported by BOTH atlas trees (ACTIVE fe9abcf: buildMarkAnimation.ts) | **OPUS-REFUTED** |
| 10c | svg/motion-path prune | 0 consumers + no EP-3 row — survives; its "is native CSS offset-path" framing corrected (it rides native, per CHANGELOG F.W12) | **UNION-CONFIRMED** (verdict; mechanism corrected) |
| 11 | presets/ KEEP-EARNED, clean lineage from animations.ts | reproduced (4 live `presets.*` call sites via kfEngine; 710 L → 905 L lineage) | **UNION-CONFIRMED** |
| 12 | ingest/ SUPERFLUOUS-PRUNE | zeros reproduced; K.W8 book record → OWNER-DECISION class; the ruling axis unchecked | **OPUS-REFUTED** (verdict class; observation survives) |
| 13 | internal/ = the owner-rejected grab-bag; colocation/dissolution target | matches my OWNER-DECISION restructure row (10-zone fan-in; owner verbatim) | **UNION-CONFIRMED** |
| 14 | LIGHT/HEAVY split OVERFIT ("largely ceremonial; demo always pays the heavy cost") | facts partly true (cold-import bench observe-only, taxonomy:79; demo always warms) BUT the LIGHT static barrel has live external beneficiaries consuming it WITHOUT the heavy chunk (glass-ui 3 symbols; atlas LIGHT set) and main.ts:20-29 decouples the boot await from first paint — the split's raison d'être is alive | **OPUS-REFUTED** (verdict) |
| 15 | "glass-ui does not consume the engine, atlas consumes `TimingFunction` (an erased type) only" — taken "per prompt", no grep | **FALSE on every readable tree**: glass-ui `1b20f7d0` imports NumericAnimation + SpringProgress ×2 (runtime); atlas ACTIVE `fe9abcf` imports **14 symbols** incl. runtime ManualTimeline, MorphSVG, Sequence, CSSKeyframesAnimation, loadAnimationEngine; even the stale trap `1e2b911` imports 6. The narrower sub-claim "nothing external rescues scroll/ingest/waapi/flip/drag/split-text" DOES survive symbol-by-symbol — but two of its prune verdicts (timeline, morph-svg) die by this census | **OPUS-REFUTED** — the single most consequential refutation |
| 16 | Q1 lost virtues: one obvious entry point; `animation/` not superfluous THEN (peer of parsing/units); small whole files | independently derived as my R1–R5 before reading | **UNION-CONFIRMED** |
| 17a | value.js nameParser 37× | value.js CHANGELOG:587 (`bench/parser-namelookup.mjs`, median 37×) @ `db77dbd8` | **UNION-CONFIRMED** |
| 17b | value.js "cache 116× on repeat parse" | not found in value.js CHANGELOG/bench at `db77dbd8` nor kf trees; neither provable nor refutable here | **OPUS-UNVERIFIABLE** (excluded from union) |
| 18 | "flatVars fast-properties **41.7×** (interp-buffer)" | the figure exists NOWHERE on disk (bench/, CHANGELOG, published-surface greps = 0); the recorded measurements are ~3.0×/2.8× (CHANGELOG:457) — off by ~14× | **OPUS-REFUTED** |
| 19 | "~60 barrel symbols" public surface | reproducible parse of index.ts+public.ts = **178** | **OPUS-REFUTED** (count) |
| 20 | Net-new zones ≈9.77k LOC vs core ≈10.24k ("half the library has no baseline analog") | arithmetic reproduces from my zone LOC table (3215+1233+2552+978+956+835 = 9,769) | **UNION-CONFIRMED** |

**Tag counts: UNION-CONFIRMED 10 · OPUS-REFUTED 12 · OPUS-UNVERIFIABLE 1.**

## FABLE-NEW findings (absent from the prior report)

- **[FABLE-NEW] The ruling axis exists and controls four "prunes":** published-surface EP-3 PATH-B (machine-checked by `proof:publish`) + DISPOSITIONS.md:37 make flip/flipShared, drag/Draggable, DrawSVG/fromDrawSVG (and formerly MorphSVG) OWNER-DECISION rows with a recorded auto-flip-to-PATH-A trigger.
- **[FABLE-NEW] Oscillator's recorded keep-rationale is refuted on disk** (published-surface.md:44 names two consumers; neither exists) — the cleanest prune candidate, on stale-claim grounds.
- **[FABLE-NEW] timeline/native is engine-wired** (3 runtime importers) and **[FABLE-NEW] sequence is compile-emit-wired** (backward.ts:56, walk.ts:21).
- **[FABLE-NEW] The external-consumer census:** glass-ui 3 symbols / atlas-ACTIVE 14 symbols (ManualTimeline, MorphSVG runtime) — flips two prune candidates to KEEP-EARNED and grounds the LIGHT-barrel's beneficiaries.
- **[FABLE-NEW] Surface metrics:** 3 → 178 published root symbols (59×); 4 → 30 barrels (20% of files); presets demo-touch 4 of ~41.
- **[FABLE-NEW] waapi direction correction:** delegation TO the native platform via the play strategy — the inverse of the "re-implements native" framing.
- **[FABLE-NEW] The corrected measured-wins ledger** (2.97–3.78×, ~22×, 3.0×/2.8×, −94%, value.js 37×/10×) with file:line cites replacing the phantom 41.7×.

## Union product (= FABLE-NEW + UNION-CONFIRMED)

1. **Baseline truth:** `1acf25c6` 0.9.97; 6,953→22,778 LOC (3.3×) with parsing/color externalized besides; the old tree's virtues were structural (peer top-levels, 3-symbol surface, 4 barrels, sync construction, one-file concepts) — all owner pain-points today; its quality was worse on every axis.
2. **Prune-eligible without an owner ruling (≈0.8k LOC):** orchestration/split-text (486, no ruling row, zero consumers on all four consumer trees), svg/motion-path (~180, same), physics/oscillator (~150, keep-rationale refuted). Binding tests die with their zones.
3. **OWNER-DECISION (≈3.0k LOC, book-kept):** flip, drag, draw-svg (PATH-B decided-terminal), scroll surface (K.W9 differentiator book), ingest surface (K.W8 book), internal/ (restructure per owner verbatim), ElementMorph (rides flip).
4. **KEEP-EARNED everywhere else**, incl. two zones the prior run condemned: timeline (engine-wired native + atlas-consumed ManualTimeline) and morph-svg (atlas-consumed runtime). Shrink notes: compile/emit-backward thinness, play-lifecycle fragmentation (552 L/5 files), presets breadth (4-of-41), group SoA floor-only evidence.
5. **Genuinely better, measured:** B1–B8 above — every figure with an on-disk cite.
