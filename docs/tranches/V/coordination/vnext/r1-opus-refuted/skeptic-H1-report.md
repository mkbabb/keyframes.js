# SKEPTIC H1 (Fable seat) — the historical-comparison lens on keyframes.js

Posture: null hypothesis = the year-old tree was righter; every modern zone must EARN itself with evidence. Verdicts below are CANDIDATES for adjudication, not rulings.

## Baseline selection

- **Baseline = `1acf25c6` (2024-07-19, v0.9.97)** — the newest commit before 2025-07-18. NOTE: the repo has NO 2025 history (per-year: 2021×14, 2023×72, 2024×70, 2026×1244). The "massive explosion" began `54424ee0` (2026-02-25, "full modernization — TW4, reka-ui, deduplication, parse-that"). So this baseline is exactly the pre-explosion tree the owner names; it is ~2yr old by calendar but is the correct ≥1yr pre-explosion state.

## Inventory

| | Baseline `1acf25c6` | Today `c2c8915f` (v6.0.0) | Δ |
|---|---|---|---|
| src files (.ts, non-test) | 22 | 153 | **7×** |
| src LOC | 6,953 | 22,778 | **3.3×** |
| test files | 2 | 132 | 66× |
| public exports | 1 (`.`) | 2 (`.`, `./engine`) + ~60 barrel symbols | — |
| parser dep | `parsimmon` (in-tree parsing/) | `@mkbabb/value.js` (parse+color externalized) | — |
| top-level src dirs | animation/ parsing/ units/ + easing/math/utils.ts | **animation/ ONLY** (owner's complaint) | — |

**Baseline feature set (entire library):** `Animation` class (play/pause/stop/reverse + fill/direction/iteration/delay), `CSSKeyframesAnimation` (fromVars/fromKeyframes/fromString), `AnimationGroup`, CSS-keyframes parse via parsimmon, `ValueUnit` interpolation with calc() + a full color subsystem (units/color/ ~1,997 LOC), **36 preset animations** (animations.ts:710), an easing library. That's it — parse → interpolate → rAF → write style, plus grouping. The whole render loop (`tick`/`draw`/`interpFrames`) is readable top-to-bottom in ONE 590-LOC `animation/index.ts`.

## Zone map (today) — LOC / files / baseline analog / verdict candidate

| Zone | LOC/files | Baseline analog | Verdict candidate | Evidence |
|---|---|---|---|---|
| **compile** | 4888/29 | parsing/ (1147) + Animation.parse | forward KEEP-EARNED; **emit/backward OVERFIT-SHRINK** | forward parse (frame+value+adapter ~2000) is core; emit/ round-trip ~2400 (entry 459, view-transition 387, backward/ 679) — demo uses compileToCSS(2 files)/compileToEntry(1); **compileToViewTransition = 0** |
| **orchestration** | 3215/20 | **NONE** | stagger/sequence/viewTransition/decay KEEP; **flip/drag/split-text/timeline PRUNE-CANDIDATE** | zero real demo call-sites for `flip(`/`Draggable`/`drag(`/`splitText` (only comment matches); drag 585, split-text 486, flip 176, timeline 322 all unconsumed |
| **engine** | 2602/17 | Animation index.ts (590) | KEEP core; **play-lifecycle OVERFIT-SHRINK** | play-lifecycle/ = 552 LOC across 5 files (events/frame/strategies/transport) for what baseline ran inline in ~250 LOC of index.ts |
| **physics** | 2552/22 | easing.ts only (280) | spring/numeric/smooth/decay/playback KEEP-EARNED; **spring/css OVERFIT** | demo runtime-imports SpringProgress×6, NumericAnimation×3, SmoothProgress, decay, RAFPlayback×4, springTimingFunction×3. spring/css (timing-function 116 + linear-stops 71) emits native `linear()` — platform-redundant |
| **group** | 1665/15 | group.ts (214) | core KEEP; **composite/SoA OVERFIT-SHRINK** | 8× LOC growth; SoA blend win is **only ≥1.2× at K=8, bit-identical** (bench/group-composite.bench.ts header) — a modest win gated on ≥8 concurrent grouped animations |
| **scroll** | 1233/7 | NONE | **SUPERFLUOUS-PRUNE-CANDIDATE** | zero demo consumption (ScrollScene/parseScrollCSS = 0 files); scroll-driven animation is **native CSS** (scroll-timeline/view-timeline) since 2024 |
| **resolve** | 1083/8 | animation/utils getComputedValue | KEEP-EARNED | calc()/computed/container-query/env resolution — a real baseline feature (calc was in baseline) grown into a coherent zone |
| **waapi** | 978/6 | NONE | **SUPERFLUOUS-PRUNE-CANDIDATE** | densify 318 / eligibility 267 / delegation 173; zero demo consumption; delegates to the WAAPI the rAF engine already re-implements — duplicated substrate |
| **svg** | 956/6 | NONE | **PRUNE-CANDIDATE (split)** | zero real demo call-sites. motion-path (177) is native CSS `offset-path`; draw-svg (194) is the trivial dashoffset trick; only morph-svg (350) has no native analog — but is unconsumed |
| **presets** | 905/3 | animations.ts (710, 36 presets) | **KEEP-EARNED** | direct descendant; demo destructures `presets` from the engine (2 files). The one clean lineage. |
| **ingest** | 835/3 | NONE | **SUPERFLUOUS-PRUNE-CANDIDATE** | fromStyleSheets/fromLiveAnimations/adoptRunning = 0 demo files, 0 external |
| **internal** | 535/9 | scattered utils.ts/math.ts | **LOST-VIRTUE-RESTORE (colocate/dissolve)** | owner verbatim: "src/animation/internal—I don't like this at all". Grab-bag: reduced-motion 162, errors 108, leaves 75, scheduler 49, binary-search 37… |
| **load-engine + LIGHT/HEAVY split** | 129 + ~315 index prose | NONE (baseline = 1 direct export) | **OVERFIT** | index.ts is mostly prose justifying the dynamic boundary; the cold-import bench is **OBSERVE-ONLY, no floor** (bench/cold-import.bench.ts header, C-10) |

External consumers confirmed nil for the heavy zones: nothing outside src/demo/bench/test/docs imports scroll|morph-svg|ingest|waapi; per prompt, glass-ui does not consume the engine, atlas consumes `TimingFunction` (an erased type) only.

## The three questions

**(a) What the OLD did RIGHT, since lost.**
1. **ONE obvious entry point.** Baseline: `import { Animation } from "keyframes.js"` → the class, directly, 590 LOC, whole render loop visible. Today: `index.ts` (315 LOC, ~60% prose) → `load-engine.ts` → `await import("./engine")` → `engine/index.ts` → `engine/animation.ts` + `engine/play-lifecycle/{5 files}`. A 4-hop chain behind a dynamic import to reach the same class.
2. **`src/animation/` was NOT superfluous THEN.** Baseline had animation/ as a *peer* of parsing/, units/, easing.ts, math.ts. It became the lone top-level ONLY because parsing+units moved to value.js — so the wrapper dir is now pure redundant nesting (owner's exact objection). The virtue lost is the *flat, honest top level*.
3. **Small, whole files over god-module-fear splits.** Baseline read the play loop in one file; today play-lifecycle is fragmented into events/frame/strategies/transport — atomized past the goldilocks the owner wants.

**(b) OVERFIT / SUPERFLUOUS (vacuity/superfluity).**
- **Native-platform-redundant + unconsumed:** scroll/ (1233 — native scroll-timeline), waapi/ (978 — the platform it wraps), svg/motion-path (native offset-path), the view-transition *runtime* (native startViewTransition). These re-implement, in rAF JS, features the 2026 web platform ships. Zero demo, zero external.
- **Unconsumed, no clean analog but speculative:** ingest/ (835), svg/morph-svg+draw-svg (544), orchestration/{drag 585, split-text 486, flip 176, timeline 322}. Real features, but the deployed demo never calls one of them.
- **Modest-win over-engineering:** group/composite SoA (≥1.2×@K=8 only); compile/emit/backward round-trip (~2400 LOC, one demo verb consumed); the entire LIGHT/HEAVY dynamic-boundary apparatus (index prose + load-engine indirection) whose bench is observe-only and whose primary consumer, the demo, always calls `loadAnimationEngine()` anyway.

**(c) Genuinely BETTER / tighter / faster (with the measurement).**
- **Parse+color externalized to value.js.** Baseline shipped `parsimmon` + ~1,997 LOC of in-tree units/color god-files (color/utils.ts:839, units/constants.ts:712). Today keyframes owns animation only; the split is a real separation-of-concerns win. Measured value.js dividend: **cache 116×** on repeat parse, nameParser **37×** (regex+Set), color2 DIRECT_PATHS.
- **Settled goldilocks grouping** in the core: compile/frame, compile/emit, physics/spring/solver — vs baseline's 710-LOC animations.ts and 839-LOC color/utils.ts monoliths.
- **Real kf-local perf wins:** SoA blend **≥1.2×@K=8 bit-identical** (group-composite.bench), `decayRest ~22×`, `flatVars` fast-properties **41.7×** (interp-buffer). Legit, if narrow.
- **Test coverage 2 → 132 files.** From ~nothing to a real suite.
- **resolve/** genuinely more capable: calc/container-query/env/conditional resolution the baseline only stubbed.

## Ten hardest findings

1. **Half the library is net-new-since-baseline zones with ZERO baseline analog:** scroll+physics+waapi+svg+ingest+orchestration ≈ 9,767 LOC — the core parse→interp→rAF→write pipeline (compile+engine+group+resolve, the baseline's whole job) is only ~10,238 LOC.
2. **`src/animation/` is the lone top-level dir ONLY because parsing+units left for value.js** — the wrapper is now pure redundant nesting; the baseline's flat peer-dir top level was righter (owner concurs).
3. **The Animation class went from a 590-LOC read-it-top-to-bottom file to a 4-hop dynamic-import chain** (index→load-engine→import(engine)→engine/index→animation+play-lifecycle/5-files); directness is the clearest lost virtue.
4. **scroll/ (1233) + waapi/ (978) + svg/motion-path re-implement native 2026 platform features** (scroll-timeline, WAAPI, offset-path) in rAF JS — overfit against the web platform, zero demo/external consumption.
5. **ingest/ (835), morph-svg+draw-svg (544), drag/split-text/flip/timeline (~1569) have zero real demo call-sites** — grep found only comment matches; nothing external rescues them.
6. **The group/composite SoA compositor (8× the baseline group.ts) buys ≥1.2× only at K≥8 grouped animations, bit-identical** — a lot of coupling for a narrow win (bench header, self-cited).
7. **The LIGHT/HEAVY dynamic-boundary apparatus is largely ceremonial:** index.ts is ~60% justification prose, its cold-import bench is observe-only (no floor), and the deployed demo always calls loadAnimationEngine() — paying the full heavy cost the split exists to defer.
8. **compile/emit/backward round-trip (~2400 LOC) ships one consumed verb** (compileToCSS/compileToEntry in the demo); compileToViewTransition has zero consumption.
9. **`internal/` is exactly the grab-bag the owner rejects** — reduced-motion/errors/leaves/scheduler/binary-search co-heaped; a colocation/dissolution target, not a module.
10. **Genuinely earned, and should be recorded so:** the value.js parse/color externalization (cache 116×, nameParser 37×), presets/ (clean lineage from animations.ts:710), resolve/ (calc/container-query capability the baseline lacked), and the 2→132 test-file jump. The modernization is not all fat — but the burden of proof the owner set is met by roughly half the tree, not the whole.
