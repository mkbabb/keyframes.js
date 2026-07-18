# SKEPTIC H2 (Fable seat) — value.js historical-comparison lens

Posture: null hypothesis = the year-old library was righter; every modern zone must EARN
its keep. Verdict: the null is **partly FALSIFIED** (the library core shrank, not exploded)
and **partly VINDICATED** (a shim dir + two orphaned zones + a lost cohesion primitive).

## Baseline selection

- Baseline = **`2e60e86`, 2025-05-05** ("tmp") — the newest commit ≥12 months old.
  Structurally identical to `a2ce97b` (2025-04-10, "initial refactor complete"), so the
  snapshot is stable, not a WIP artifact. The next commit (`684c818`, Tailwind-4 upgrade)
  lands 2025-07-24, six days past the 1-year cutoff.
- History shape: 19 commits 2024-07, ~15 in 2025-04/05, then a **9-month silence**, then the
  explosion (112 in 2026-02 → 811 in 2026-07). The baseline sits squarely in the "pre-explosion"
  era the owner names. HEAD = `4c1e927` (2026-07-17).

## Inventory: baseline vs today

| Metric | Baseline (2025-05-05) | Today (HEAD) | Δ |
|---|---|---|---|
| **Library src LOC** | **5020** | **4654** | **−7% (SHRANK)** |
| Library src files | 16 | 26 (25 real + vite-env) | more, smaller |
| Total repo files | 383 | **1949** | +410% |
| demo LOC / files | (339 files) | 31,100 / 271 | full palette SPA |
| **api/ backend** | **absent** | **13,141 LOC / 134 files** | NEW |
| **e2e/ oracle suite** | 2 test files | **13,333 LOC / 84 specs** | NEW |
| Public exports | **one `.`** → `src/units/index.ts` | **7 subpaths** via a `subpaths/` shim dir | shim interposed |
| Parser | **parsimmon `^1.18.1`** (combinator dep) | **dep-free custom byte-scanner** | dep dropped |
| Color primitive | `ValueUnit<T=any>` (mutable) | `CssValue` readonly AST + `Color` classes | typed/immutable |

**Hardest structural finding (falsifies the owner's premise for the LIBRARY):** the published
library did **not** explode — its own source is **7% smaller** than a year ago while spec coverage
grew. The "massive explosion in complexity" is real but lives almost entirely in the
**~57k-LOC apparatus** (demo 31k + a wholly-new api/ backend 13k + e2e oracle fleet 13k) wrapped
around a 4.6k-LOC library. Judge the library on the library.

## The three questions

### (a) What the old structure did RIGHT that was lost

1. **One obvious value primitive → dissolved.** Baseline's vite lib entry pointed *directly* at
   `src/units/index.ts`, whose head is the `ValueUnit` class (`2e60e86:src/units/index.ts:5`) —
   value + unit + `convertToPixels`/`normalize`, one greppable class = the whole "value.js" thesis.
   Today value.js has **no `ValueUnit`** (`git grep ValueUnit HEAD -- src` = empty); the unit
   machinery (~1445 LOC: `units/constants.ts` 712 + `utils` 339 + `normalize` 195 + `index` 199)
   is gone, migrated into keyframes.js. `src/value.ts` (36 L) is now a bare `CssValue` union.
   *Lost virtue:* cohesion/discoverability of one value primitive. *Mitigant (real):* the split is
   cleaner — parser-AST here vs unit-resolution (DOM-coupled) in the consumer, no more `T=any`,
   readonly. Candidate **LOST-VIRTUE, lean-KEEP**.
2. **Direct `X2Y` conversion functions → indirection.** Baseline exposed a flat, greppable pile:
   `hsl2rgb`, `oklab2xyz`, `xyz2lab`, `kelvin2xyz`, `color2`, `gamutMap`
   (`2e60e86:src/units/color/utils.ts`). Today routes everything through a generic
   `convertColor(from,to)` over an anchor graph (`color/anchors.ts` 377 L). DRYer (N-to-hub vs N²),
   and baseline already hubbed on XYZ — but `convertColor("hsl","rgb")` is less obvious than
   `hsl2rgb()`. Mild **LOST-VIRTUE (discoverability)**, lean-KEEP.
3. **No shim layer.** Baseline had a single `.` entry aimed straight at the module. Today's
   `src/subpaths/` is 7 pure re-export files (`subpaths/value.ts` = 2 lines, `subpaths/quantize.ts`
   = 2 lines) — the owner's named "code smell supreme… NO SHIMS." **LOST-VIRTUE-RESTORE.**

### (b) OVERFIT / SUPERFLUOUS zones (evidence, not nostalgia)

Consumer = keyframes.js at `keyframes-v-exec` (the canonical library consumer) + value.js's own demo.

| Zone | LOC | kf consumers | Verdict |
|---|---|---|---|
| **`transform/decompose.ts`** | **609** | **ZERO** — kf grep for `decomposeMatrix\|recompose\|interpolateDecomposed\|slerp` = empty; not imported by value.js demo either; only self-referenced via the shim. Platform provides `DOMMatrix`. | **SUPERFLUOUS-PRUNE** (strong) |
| **`subpaths/` dir** | ~200 | pure re-export indirection; owner-named smell | **PRUNE/RESTORE** (make modules the entry points) |
| **`quantize.ts`** | 139 | **ZERO kf**; sole consumer = value.js demo's image-eyedropper (`demo/workbenches/extract/…useImageSampler`). An image-processing app feature published as a library subpath — cohesion violation with value/CSS/animation. | **SUPERFLUOUS-PRUNE from public API** (demote into demo) |
| exotic color spaces (`jzazbz`,`ictcp`,`rec2020`,`prophotoRgb`,`a98Rgb`,`displayP3`) | within color/ | **not imported by kf** (kf pulls only `mixColors`,`convertColor`,`SpaceId`,`HueInterpolationMethod`); serve the demo palette/gradient tool. NEW vs baseline (baseline had oklab/oklch/lab/lch/hsv/hwb/kelvin but **none** of these). | **KEEP** (owner mandates "all spaces"; demo-earned) — but they belong with the color-app, not the animation core if ever split |
| `css/…collectDeclarations` | — | **0 kf consumers** (every other `collect*`/`parse*` IS consumed) | minor **PRUNE-CANDIDATE** |
| `transform/path.ts` (`PathGeometry`) | 564 | kf imports `PathGeometry` (2 sites) for offset-path; platform `getPointAtLength` is DOM-bound | **KEEP-EARNED**, watch size |

**Refuted overfit suspicion — the full CSS grammar/AST is NOT superfluous.** kf consumes it
densely: `parseKeyframeSelector`×10, `parseStylesheet`×9, `collectAnimationOptions`×9,
`collectStyleRules`×8, `collectTimelineOptions`×7, `collectCustomFunctions`×5,
`collectPropertyDescriptors`×4, `parseAnimationTimeline/Range`×3 each. The 2026 spec surface
(@keyframes, scroll/view timelines, @property, @function) is genuinely exercised. `css/` =
**KEEP-EARNED**; only `collectDeclarations` is orphaned.

### (c) What is GENUINELY better/tighter/faster today (with measurement)

1. **Dropped the `parsimmon` runtime dependency** for a dep-free custom byte-scanner (migration
   commit `470818c9`). value.js's OWN research doc concedes a library-helper rewrite "would not be
   faster — possibly slower if the library helper allocates more"; the hand-rolled scanners are
   "char-by-char **zero-allocation** loops" (docs/tranches, `stylesheet.ts:99-181 balancedText`).
   Tighter (no external dep) AND the perf story is documented. *(Note the tension with the parent
   prompt's parse-that desire — that's the other panel's fight; historically the custom scanner is
   the genuine win over parsimmon.)*
2. **Zero-alloc color math** — module-level scratch tuples, per-subclass cached `keys()`, in-place
   per-channel writes, `toAnimationString` precision serializer (docs Wave B1). Baseline allocated
   arrays per conversion.
3. **Immutable typed AST** — `CssValue` (readonly scalar/call/list) replaces mutable `ValueUnit<T=any>`.
4. **Broader SOTA color** — +6 spaces (jzazbz/ictcp/rec2020/prophoto/a98/p3) + `mapColorToGamut`
   over baseline's `gamutMap`.
5. **Library shrank 5020→4654 LOC while coverage grew** — the tightest single proof of "more
   optimized."

## Disposition table (candidates for adjudication, not rulings)

| Zone | Old-era analog | Verdict candidate | Evidence |
|---|---|---|---|
| `foundation/math` (+ `/math` subpath) | `src/math.ts` (92 L) | **KEEP-EARNED** | kf `clamp`×26, heaviest consumer |
| `css/*` (grammar/syntax/stylesheet/timeline/types) | `src/parsing/*` (parsimmon, 1154 L) | **KEEP-EARNED** | dense kf consumption; dep dropped; zero-alloc |
| `color/*` (anchors/model/operations) | `units/color/*` (2117 L) | **KEEP-EARNED** | shrank to 891 L, +spaces, zero-alloc; but flat `X2Y` greppability = mild LOST-VIRTUE |
| `easing.ts` | (in parsing/units) | **KEEP-EARNED** | kf consumes presets + fns |
| `value.ts` (`CssValue`) | `ValueUnit` class | **KEEP** + **LOST-VIRTUE note** | typed/immutable win; lost the one-obvious-primitive cohesion |
| `transform/path.ts` | absent | **KEEP-EARNED** (watch 564 L) | kf `PathGeometry`×2 |
| **`transform/decompose.ts`** | absent | **SUPERFLUOUS-PRUNE** | 609 L, zero consumers anywhere; DOMMatrix exists |
| **`quantize.ts`** | absent | **SUPERFLUOUS-PRUNE (from public API)** | 0 kf; demo-only image feature; cohesion violation |
| **`subpaths/` dir** | direct `.`→module entry | **LOST-VIRTUE-RESTORE** | owner-named shim; make modules the entry points |
| `css…collectDeclarations` | — | **PRUNE-CANDIDATE** | 0 kf consumers |

---

## 10-line summary (hardest findings)

1. The LIBRARY did not explode — its own src SHRANK 5020→4654 LOC (−7%) while spec coverage grew; the null hypothesis "over-built vs the leaner past" is FALSIFIED for the core.
2. The real explosion is the ~57k-LOC APPARATUS: demo 31k + a wholly-new api/ backend 13k + e2e oracle fleet 13k, around a 4.6k-LOC library. Judge the library on the library.
3. `transform/decompose.ts` (609 L) is exported-but-DEAD: zero consumers in kf, in the demo, or internally — matrix decomposition the platform already ships (DOMMatrix). SUPERFLUOUS-PRUNE.
4. `quantize.ts` (139 L) has zero kf consumers; its only user is the demo's image eyedropper — an image-processing app feature masquerading as a published value/CSS subpath.
5. `src/subpaths/` is a literal 7-file re-export shim (2-line files); baseline aimed the vite entry straight at the module. The owner's named "code smell supreme." RESTORE the direct-entry virtue.
6. LOST VIRTUE: baseline's ONE obvious `ValueUnit` primitive (value+unit+convert, the whole thesis) is gone from value.js; `CssValue` is cleaner (typed/immutable) but the cohesive value-with-units primitive dissolved into the consumer.
7. REFUTED overfit suspicion: the full 2026 CSS grammar/AST is densely consumed by kf (parseStylesheet×9, collectStyleRules×8, collectAnimationOptions×9, timeline/@property/@function all live) — css/ is KEEP-EARNED, only `collectDeclarations` orphaned.
8. GENUINELY better: dropped the parsimmon runtime dep for a dep-free zero-alloc byte-scanner (commit 470818c9) — value.js's own docs admit a combinator rewrite would be no faster, possibly slower.
9. GENUINELY better: +6 color spaces (jzazbz/ictcp/rec2020/prophoto/a98/p3) + zero-alloc color discipline over baseline's array-allocating conversions — though kf uses none of the exotic spaces (demo-earned only).
10. Mild LOST VIRTUE: baseline's flat greppable `hsl2rgb`/`oklab2xyz` direct conversions became a generic `convertColor` anchor-graph — DRYer but less discoverable.
