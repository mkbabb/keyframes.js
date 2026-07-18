# Adjudication — thrice-panel TWO (Fable, final adjudicator seat)

> Duty: PROVE or DISPROVE each contested/load-bearing finding of the historical &
> challenge lanes (H1, H2, D, E, K, F) with my OWN on-disk verification, reconcile the
> named conflicts, and emit the panel-2 adjudicated set. I inherit panel-1's amendment
> set (G0'–G14', R1'–R14') and do NOT re-litigate what it settled; panel-2 rows connect
> to panel-1 rows where noted. All repos READ-ONLY.
>
> **G0' tree pins (verified):** value.js HEAD `db77dbd8` (branch `tranche-u`, v4.0.0) —
> 1 commit past panel-1's `91fa1368` (ancestor; drift immaterial, every structural claim
> reproduces). keyframes-v-exec HEAD `c2c8915f` (branch `master`, v6.0.0) — matches every
> skeptic. value's own `dependencies` still declare glass `^7.0.0` + kf `^6.0.0` (the
> manifest value→kf→value cycle panel-1 G3' flagged; re-confirmed).

---

## DOCKET 1 — the parser chronology (reconcile A vs H2)

**RULING: BOTH CORRECT ABOUT DIFFERENT TREES. H2's "byte-scanner genuinely better" is a
HISTORICAL truth about a RETIRED artifact; A/panel-1's "regex rewrite" is the CURRENT
tree. They do not conflict — the v4 cut REPLACED the measured-better parser with the
unmeasured regex one, which corroborates the drops archaeology (owner's "ill-defined and
slow parser" residue).**

My per-file evidence at value HEAD `db77dbd8`:

| File | LOC | Regex sites | charCodeAt / scan-loop | Verdict |
|---|---|---|---|---|
| `src/css/grammar.ts` | 483 | **25** (`.match`/`.test` tokenize numbers, angles, color fns, calc, easing) | 0 / 0 | **PURE REGEX** — condemned |
| `src/css/stylesheet.ts` | 899 | 12 (inline `/\s/.test(source[cursor])` in cursor loops) | 0 / char-index loops only | char-index + inline-regex; **no byte-scanner, no `balancedText`** — condemned |
| `src/css/timeline.ts` | 124 | 9 | 0 / 0 | regex — condemned |
| `src/css/syntax.ts` | 101 | 1 | 0 / 0 | regex — condemned |
| `src/value.ts` / `quantize.ts` / `easing.ts` | 36/… | 0 | 0 / 0 | **NOT parsers** (union type / factory / data) — out of scope |

- **The pre-v4 tree was a parse-that-combinator + `balancedText` byte-scanner HYBRID** and
  it was MEASURED: `git show 164343c1~1` shows `src/parsing/stylesheet/stylesheet.ts:84-114`
  wiring `balancedText` (the "raw balanced-text scanner"), `src/parsing/utils.ts` the sole
  `charCodeAt` home (16 hits). The v4 cut `164343c1` ("retire pre-v4 src trees") DELETED all
  of `src/parsing/` AND its two benches `bench/css-parse-perf.mjs` + `bench/parser-namelookup.mjs`
  in the same commit. That is the tree H2 praised.
- **H2 mis-labeled it "dep-free byte-scanner."** The migration H2 cited (`470818c9`,
  2026-02-25 "parser migration") actually vendored parse-that (`vendor/mkbabb-parse-that-0.6.0.tgz`)
  — parsimmon→parse-that, NOT parsimmon→byte-scanner. "dep-free" is *accidentally* true at
  HEAD only because the whole parse-that tree was later deleted; parse-that is not a
  dependency now (deps = glass-ui + kf only).
- **What the regex-abrogation ruling (addendum-2) condemns, named exactly:** `src/css/grammar.ts`
  (25 regex), `src/css/stylesheet.ts` (char-index + inline-regex), `src/css/timeline.ts` (9),
  `src/css/syntax.ts` (1). **What already satisfies a dep-lean/scanner ideal at HEAD:
  NOTHING** — the byte-scanner H2 praised was deleted. `value.ts`/`quantize.ts`/`easing.ts`
  are data/factory files and are NOT in scope.

**Consequence:** panel-1's R2' three-way greenfield bench framing stands and is REINFORCED —
the extant parser is unmeasured (benches deleted); H2's historical evidence is not a defense
of the incumbent but a witness that a measured, better predecessor was dropped at v4. → **H1'.**

---

## DOCKET 2 — subpaths/ (reconcile B vs H2)

**RULING: SYNTHESIS — DISSOLVE the directory; repoint the export keys straight at module
indexes; keys frozen. B and H2 are each partly right (it is a MIX of literal 2-line shims
AND curated barrels), but every file is a PURE re-export pointing at a domain module index —
exactly the owner's "subpaths/ as a module… code smell supreme. NO SHIMS." Inherits +
strengthens panel-1 R13' with the measured blast radius.**

My evidence (all 7 read at HEAD):

| Subpath | LOC | Shape | Points at | kf consumes |
|---|---|---|---|---|
| `quantize.ts` | **2** | literal shim (H2 right) | `../quantize` | **0** |
| `value.ts` | **2** | literal shim (H2 right) | `../value` | 16 |
| `math.ts` | 17 | thin re-export | `../foundation/math` | 8 |
| `transform.ts` | 23 | curated, merges 2 modules | `../transform/decompose` + `../transform/path` | 2 (path only) |
| `easing.ts` | 25 | curated barrel (B right) | `../easing` | 3 |
| `color.ts` | 38 | curated named allowlist (B right) | `../color/index` | 7 |
| `css.ts` | 56 | curated named allowlist (B right) | `../css/index` | 29 |

- **Surface-widening risk is trivial.** `subpaths/color.ts` value-exports are **byte-identical**
  to `color/index.ts` value-exports (23 fns); the only delta is one extra TYPE (`ColorFactory`)
  the index exposes. Direct-repoint `./color`→`dist/color/index.js` widens the type surface by
  ≤1 symbol — accept it, or add a curated `export {}` at the index.
- **The one that does NOT map 1:1 is `./transform`** — it merges `decompose` + `path` and there
  is **no `src/transform/index.ts`**. Dissolution requires creating a real `transform/index.ts`
  module barrel (a module index, NOT a shim). BUT `decompose.ts` is DEAD (docket 7) → `./transform`
  collapses to `path.ts` only. **Couples D2 to D7.**
- **Blast radius (measured):** (a) `package.json` exports (7 keys); (b) `vite.config.ts:216-235`
  the `dist/subpaths/` dts-entry block (7 explicit `src/subpaths/*.ts` inputs) + the self-alias
  set (:25-65); (c) the dts rollup `outDir`. **Nothing internal imports `subpaths/`** (only build
  + exports reference it), so no source-import fan-out. **The 6 consumed KEYS are frozen** (kf:
  css×29/value×16/math×8/color×7/easing×3/transform×2). `./quantize` is a **removal candidate**
  (0 kf; demo-only — docket 7). → **H2'.**

---

## DOCKET 3 — H1's PRUNE-CANDIDATE zones vs the TRUE import graph

**RULING: H1 is REFUTED on `waapi/` (engine-wired) and PARTLY on `scroll/` (its serialize
half is compiler-wired); UPHELD on `svg`/`ingest`/`orchestration-extras`. The docket's
proposed orchestration split (stagger/sequence/viewTransition/decay KEEP vs
flip/drag/split-text/timeline PRUNE) is CONFIRMED by BOTH internal-wiring AND demo-consumption.
F's "Draggable/drag consumed" is CORRECTED — comment-only, never imported.**

My import-graph evidence (kf `c2c8915f`):

- **`waapi/` — ENGINE-WIRED (category c), H1's SUPERFLUOUS-PRUNE REFUTED.**
  `engine/play-lifecycle/strategies.ts:16` `import { isWAAPIEligible, playWAAPI } from "../../waapi"`,
  and `playViaWAAPI(anim)` (`:121`) is one of the THREE play drivers
  (reduced-motion→WAAPI-eligibility→rAF). Also imported by `group/index.ts`, `group/lifecycle.ts`
  (`lowerGroupWAAPI`), `scroll/dispatch.ts`, `validate.ts`. Pruning it breaks the engine's
  `useWAAPI` path + group WAAPI lowering + scroll dispatch. **Product-dormant** (demo NEVER
  sets `useWAAPI`) + platform-redundant + K's **admitted E.W9 deliberate platform-reimpl KEEP**
  → **OWNER-DECISION** (keep the WAAPI compositor play strategy vs collapse to the rAF-only
  engine), NOT a unilateral prune.
- **`scroll/` — SPLIT.** The SERIALIZE half is compiler-wired: `compile/emit/backward/backward.ts:68`
  `import { serializeScrollOptions } from "../../../scroll"` (the scroll-grammar EMIT half of the
  round-trip) → **KEEP-EARNED**. The `ScrollScene`/`parseScrollCSS` rAF sampler is
  public-barrel-only (index.ts + public.ts re-export), **zero demo consumption** (ScrollScene=0,
  parseScrollCSS=0), platform-redundant (native scroll-timeline), E.W9 deliberate-reimpl class →
  **OWNER-DECISION**.
- **`svg/` — SPLIT (H1 upheld):** motion-path (native `offset-path`) + draw-svg (trivial
  dashoffset) → **PRUNE**; morph-svg (no native analog, but zero demo, SPECULATIVE birth,
  consumes value's `PathGeometry`) → **OWNER-DECISION**. Only importer of the barrel is
  `public.ts`. Demo: morphSVG/drawSVG/motionPath/fromMorphSVG all = **0**.
- **`ingest/` — PRUNE-CANDIDATE (H1 upheld):** importers = index.ts + public.ts only; demo
  fromStyleSheets/fromLiveAnimations/adoptRunning all = **0**; SPECULATIVE, no deliberate-keep
  record. Reads live CSSOM (a real capability) → lean PRUNE, OWNER may reprieve.
- **`orchestration/` — the split holds, by demo IMPORT SURFACE (authoritative):**
  demo imports from kf: `stagger`×2, `decay`×2 + `DecaySample`, `Sequence`×1, `viewTransition`×1
  → **KEEP-EARNED**; `view-transition` is ALSO the only internally-imported orchestration
  sub-module (engine/compiler). `flip`/`split-text`/`timeline` = 0 internal + 0 demo →
  **PRUNE-CANDIDATE**. `drag`/`Draggable` = **comment-only in demo, never imported** (all 3 raw
  hits are `//` comments) → **PRUNE-CANDIDATE** (corrects F's "Draggable(2)/drag(1) consumed").
  `orchestration/timeline` (JS ScrollTimeline sampler) is K's ADMITTED E.W9 deliberate KEEP →
  **OWNER-DECISION**.
- Confirmed KEEP-EARNED by demo import surface: physics (`SpringProgress`×8, `NumericAnimation`×3,
  `RAFPlayback`×4, `SmoothProgress`, `springTimingFunction`×4, `springLinearStops`), engine core
  (`KeyframesAnimation`×26, `loadAnimationEngine`×12, `AnimationGroup`×11), compile forward
  (`compileToCSS`×3, `compileToEntry`×5).

**None of these zones is category (a) "dead from every entry"** — all are re-exported by the
public barrel. The real axis is (b) reachable-but-product-unconsumed vs (c) engine-wired, with
OWNER-DECISION reserved for the platform-reimpl zones carrying a recorded deliberate KEEP. → **H3'.**

---

## DOCKET 4 — the backward-emit round-trip (H1 OVERFIT-SHRINK vs "differentiator")

**RULING: OVERFIT-SHRINK (differentiator-preserving). The round-trip IS a real, consumed
product differentiator — H1's "one consumed verb" UNDERCOUNTS (TWO verbs consumed) — but the
unconsumed sub-verbs are trimmable. Not full-prune, not full-keep.**

My evidence:
- `compile/emit/` = **2,812 LOC** (backward/ subtree 957). H1's "~2400" is close.
- Demo consumption: `compileToCSS`×3, `compileToEntry`×5 — **CONSUMED**. `compileToViewTransition`=0,
  `compileToString`=0, `formatKeyframes`=0 — **NOT consumed**.
- The differentiator is genuine and load-bearing: `backward.ts:17-22` "keyframes.ts run
  backward… GSAP/Motion/anime author in a bespoke tween model — 'export to CSS' for them" is
  categorically different; and the **CC-3 honest-refusal** design (`backward.ts`: refuses
  weightBlend / custom renderer / perceptual-oklab-under-ΔE / computed-unit-drift with NAMED
  reasons) is a defensible, unique capability, not decoration.

**Disposition: KEEP the `compileToCSS`+`compileToEntry` round-trip core + CC-3 refusal
(the consumed differentiator); SHRINK/prune the unconsumed `compileToViewTransition` RUNTIME
emit (native `startViewTransition` exists, 0 demo) + dead `compileToString`/`formatKeyframes`.**
This preserves "keyframes.ts run backward" while cutting ~unconsumed surface. → **H4'.**

---

## DOCKET 5 — the DOUBLE GAMUT LOSS unification (K#2 + D#2)

**RULING: THE DOUBLE LOSS IS REAL AND VERIFIED. Constellation RESTORE: gamut lives in VALUE
(owner: value owns core CSS color), restored per D's priority (MINDE/raytrace + deltaEOK first);
kf consumes and DROPS its local oklab-ΔE duplication. D#4's kf-duplication citations CONFIRMED,
including the stale docstrings.**

My evidence:
- **Loss #1 (kf, K#2/D1):** kf deleted its own gamut/color subsystem at modernization
  (903-LOC `color/utils.ts` w/ 48 gamut/oklab refs) delegating to value — verified by K against
  kf history; kf has ZERO gamut at v4.0.0.
- **Loss #2 (value, D#2/A2):** value's raytrace oracle + ΔE metrics DELETED at v4. My grep at
  value HEAD: `raytrace`=**0**, `deltaEOK`/`deltaE2000`/`deltaEITP`=**0**, `sampleColorRamp`/`mixColorsN`=**0**,
  `MINDE`/clip-vs-reduced=**0** in `src`. Panel-1 RULING 3/4 verified these SHIPPED (git 60bb64e9
  raytrace, 07760131 sampleGamutBoundaryInto) then dropped; `mapColorToGamut` (operations.ts:133-176)
  is a hue-preserving 32-iter chroma reduction — a §13.2 SIMPLIFICATION.
- **Net: NEITHER library now has a reference gamut oracle.** The owner's named "major loss" is
  a two-sided extinction.
- **D#4 kf-duplication CONFIRMED:** `compile/emit/backward/color.ts` (K.W10 CC-2 "the oklab
  DENSIFY") imports only `mixColors, oklab, convertColor` from value and re-derives a LOCAL
  oklab conversion + local ΔE threshold — because value's `sampleColorRamp`/`deltaEOK` are gone.
  The docstring at `backward.ts:30,47` STILL NAMES value's dropped `sampleColorRamp` /
  `deltaEOK` ("sampled from value.js's `sampleColorRamp`… gated on ΔE-ε `deltaEOK`") — a
  **stale-fiction docstring** describing primitives value no longer ships. Restoring value's
  ramp + ΔE (below) re-consolidates it and makes the docstring TRUE again.

Connects to panel-1 R6' (decide §13.2 MINDE policy) and R7' (v4-capability-loss family). → **H5' + the RESTORE ledger.**

---

## DOCKET 6 — E's fleet verdict + F's program (verify one point each; fold both)

**RULING: BOTH UPHELD. E's headline verified myself; F's boundary-cohesion verified myself.
Fold E's fleet table (ABROGATE for value.js; ~500-LOC demo-tranche survivor set) and F's
minimal-seven + subtraction/wiring program into the adjudicated set.**

My verification:
- **E's headline (0/191):** value HEAD `db77dbd8` — 71 `*.spec.ts`, **193** `test()` blocks,
  **0 spec files import the library** (`@mkbabb/value.js` or `src/` = empty), and the fleet is
  **wired into NO ci.yml job** (grep `e2e|playwright|test:e2e|--project` in ci.yml = empty).
  E's "0/191 + already CI-abrogated" is TRUE. Fleet verdict ABROGATE-for-value.js UPHELD.
- **F's headline (boundary-cohesion.test.ts is implementation-shape):** `test/engine/boundary-cohesion.test.ts`
  `readFileSync`s source and asserts `.not.toMatch(/Math\.max\(0, Math\.min\(1/)` ("no open-coded
  clamp"), "timeline index.ts deleted the local clamp01", "group compositor does not import lerp
  from the light leaf" — **PURE source-text assertion, zero runtime behavior.** F's PRUNE UPHELD
  (duplicates lint + proof:structure R6).
- **F's "R2-07 prune never landed" CONFIRMED:** `bench/taxonomy.json` PRESENT, `scripts/gates/visual/index.mjs`
  PRESENT, `package.json` still `proof:owner-golden` (relabel not done). The contrivances are all
  still on master.
- **value has NO structure gate (panel-1 R14' reconfirmed):** `scripts/gates` ABSENT, no `proof:*`
  scripts — value's isomorphism/structure gate is CREATE-from-scratch, not "extend."

→ **H6'** folds E's ~500-LOC survivor set (page-load smoke + ≤3 named-catch demo oracles
o16/color-space/o12 + 1 axe battery, to the DEMO tranche NOT value's gate surface) and F's
minimal-seven gate set + subtraction (land R2-07's 9 prunes + PRUNE boundary-cohesion) + wiring
(land the 4 MRs, relabel owner-golden).

---

## DOCKET 7 — H2's value dispositions (verify decompose deadness + quantize demo-only)

**RULING: BOTH UPHELD, decompose STRENGTHENED. `transform/decompose.ts` is 609 LOC with ZERO
real consumers (kf's `/transform` use is `PathGeometry` from `path.ts`, NOT decompose);
`quantize.ts` is demo-only. PRUNE decompose; DEMOTE quantize out of the public API.**

My evidence:
- `src/transform/decompose.ts` = **609 LOC**. kf imports of `decomposeMatrix`/`recomposeMatrix`/
  `interpolateDecomposed`/`slerp` = **0**. The two kf `/transform` importers
  (`svg/morph-svg.ts:45`, `svg/morph-geometry.ts:18`) both import **`PathGeometry`** — from
  `path.ts`, not decompose. So H2's "zero consumers anywhere" STANDS; platform `DOMMatrix`
  covers it → **SUPERFLUOUS-PRUNE**.
- `path.ts` (`PathGeometry`) IS consumed (kf morph ×2) → **KEEP-EARNED**, but its only consumers
  are the unconsumed-by-demo `svg/morph` zone (docket 3 OWNER-DECISION) — a transitive coupling
  to watch; if morph is pruned, path.ts loses its last consumer.
- `quantize.ts` = 139 LOC; kf consumers = **0**; sole users = value **demo** extract workbench
  (`quantize-worker.ts`, `useExtractSession.ts`, `useImageQuantize.ts`) → an image-processing
  app feature published as a library subpath → **SUPERFLUOUS-PRUNE from public API** (demote into
  the value demo; drop the `./quantize` export key). → **H7'.**

---

## DOCKET 8 — the silent-drop governance defect (D#6 / K#4)

**RULING: standing-law row RATIFIED and EXTENDED. Panel-1 R7' already ruled the
capability-preservation gate IN; panel-2 extends it with the DROPS-SECTION requirement and a
surface-diff enforcement at every major cut.**

Evidence of the defect class (D + K, spot-checked): the v4 cut `164343c1` enumerated the
STRUCTURAL breaks + RENAMES but not ONE of the ~15 color/parser capability DELETIONS;
`raytrace`/`okhsl`/`sampleColorRamp`/`mixColorsN`/`deltaE2000` = **0 hits each in
`docs/tranches/V/**`** — documented in R/S where BUILT, invisible in V where KILLED (the
silent-drop signature). The pre-v3.0.0 kf gamut/parser subsystem (K#2/D1) likewise vanished
under a single commit sub-bullet (no changelog/tranche existed yet). Root cause: a
"green-consumer-compile" gate is blind to a capability that had no first-party consumer at cut
time — exactly the rule the owner's V-next voids ("consumer count is NOT enough").

**The standing law:** (1) a capability-preservation gate on major rewrites — a public-surface +
capability diff that **born-REDs on any dropped symbol across a major** (panel-1 R7'); (2) every
major-cut wave spec MUST carry a **DROPS section** enumerating every dropped symbol classified
RIGHTLY / UNJUSTLY / UNCLEAR with a one-line tombstone; (3) the surface-diff check at the cut
FAILS on any public deletion not present in that DROPS section. → **H8'.**

---

# THE PANEL-2 ADJUDICATED SET

## (a) kf zone disposition table

| Zone / sub-module | Verdict | One-line why | Coupled tests (bind to verdict) |
|---|---|---|---|
| engine core (animation + play-lifecycle transport) | **KEEP-EARNED** | demo `KeyframesAnimation`×26 / `loadAnimationEngine`×12; the pipeline core | engine 22/~3900 behavior — KEEP |
| engine `play-lifecycle/` (5-file atomization) | **OVERFIT-SHRINK** (agglomerate) | H1: baseline ran it inline ~250 LOC; goldilocks-recombine, do not prune | — |
| compile/ forward (frame+value+adapter) | **KEEP-EARNED** | feeds consumed `compileToCSS`/`compileToEntry` | compile 25/3577 — KEEP |
| compile/emit/backward (round-trip) | **OVERFIT-SHRINK (differentiator-preserving)** | keep compileToCSS+compileToEntry+CC-3 refusal (2 demo verbs, the "run backward" differentiator); trim compileToViewTransition runtime + dead compileToString/formatKeyframes | compile-roundtrip contract — KEEP |
| group/ core | **KEEP-EARNED** | demo `AnimationGroup`×11 | group 10/1559 — KEEP |
| group/ composite-SoA | **OVERFIT** | ≥1.2×@K=8 bit-identical only (bench header) | — |
| physics/ (spring/numeric/smooth/decay/playback) | **KEEP-EARNED** | demo SpringProgress×8 / NumericAnimation×3 / RAFPlayback×4 | physics 14/2397 — KEEP |
| physics/spring/css (`linear()` emit) | **OVERFIT** | platform-redundant (native `linear()`) | — |
| resolve/ | **KEEP-EARNED** | calc/container-query/env — real capability baseline lacked | resolve 4/850 — KEEP |
| presets/ | **KEEP-EARNED** | clean lineage animations.ts 36→45 (K-verified unbroken) | presets 2/171 — KEEP |
| **waapi/** | **OWNER-DECISION** | ENGINE-WIRED (playViaWAAPI + group lowering + scroll dispatch) so NOT dead; but product-dormant (demo never sets useWAAPI) + platform-redundant + E.W9 deliberate KEEP → keep-strategy vs collapse-to-rAF is the owner's call | waapi 3/737 — KEEP-IF-KEPT |
| **scroll/** serialize (`serializeScrollOptions`) | **KEEP-EARNED** | compiler-wired (backward.ts:68 round-trip EMIT half) | scroll 2/800 partial — KEEP |
| **scroll/** `ScrollScene`/`parseScrollCSS` rAF sampler | **OWNER-DECISION** | native scroll-timeline; 0 demo; E.W9 deliberate-reimpl class | scroll 2/800 partial — bind |
| **svg/** motion-path + draw-svg | **PRUNE** | native `offset-path` / trivial dashoffset; 0 consumer | svg 3/807 partial — die with zone |
| **svg/** morph-svg | **OWNER-DECISION** | no native analog but 0 demo, SPECULATIVE; consumes value PathGeometry | svg 3/807 partial — bind |
| **ingest/** | **PRUNE-CANDIDATE** | 0 demo/internal, SPECULATIVE, no deliberate-keep; reads live CSSOM (owner may reprieve) | ingest 3/1027 — die with zone |
| orchestration/ stagger, sequence, view-transition, decay | **KEEP-EARNED** | demo stagger×2/decay×2/Sequence×1/viewTransition×1; view-transition also engine-wired | — KEEP |
| orchestration/ flip, split-text | **PRUNE-CANDIDATE** | 0 internal + 0 demo; SPECULATIVE E.W10 tier | split-text/flip tests — die with zone |
| orchestration/ drag | **PRUNE-CANDIDATE** | demo refs are COMMENT-ONLY, never imported (corrects F) | drag tests — die with zone |
| orchestration/ timeline (JS ScrollTimeline sampler) | **OWNER-DECISION** | E.W9 ADMITTED deliberate KEEP alongside native | timeline tests — bind |
| internal/ | **LOST-VIRTUE-RESTORE (dissolve/colocate)** | owner-named "I don't like this at all"; grab-bag | — |
| load-engine + LIGHT/HEAVY apparatus | **OWNER-DECISION** | ceremonial (index ~60% prose, cold-import bench observe-only, demo always calls loadAnimationEngine) | — |
| `src/animation/` lone top-level wrapper | **LOST-VIRTUE-RESTORE (flatten to `src/`)** | lone dir only because parse/units left for value.js; owner's exact objection | R4' flatten blast radius (panel-1) |

> **Zone-orphaned tests (F, verified): scroll 2/800 + svg 3/807 + ingest 3/1027 + waapi 3/737 +
> orchestration split-text/flip/timeline (~3.5–4.3k LOC total) are contract-bearing for zones
> nobody uses. They are KEEP-ONLY-IF-THE-ZONE-SURVIVES — bind each to its zone verdict; never
> leave orphaned-green.**

## (b) value.js zone disposition table

| Zone | Verdict | One-line why |
|---|---|---|
| `css/*` (grammar/stylesheet/timeline/syntax/types) | **KEEP-EARNED (SURFACE) / REGEX-ABROGATION TARGET (parser)** | densely kf-consumed (parseStylesheet×9, collect*×8-9), but the parser IS the unmeasured regex rewrite — panel-1 R2' three-way bench applies (docket 1) |
| `color/*` (model/anchors/operations) | **KEEP-EARNED + RESTORE** | shrank 2117→891 LOC, +spaces, zero-alloc; but gamut/ΔE/ramp UNJUSTLY dropped (docket 5) |
| `foundation/math` | **KEEP-EARNED** | kf `clamp`×26, heaviest consumer |
| `easing.ts` | **KEEP-EARNED** | kf presets + fns |
| `value.ts` (`CssValue`) | **KEEP + LOST-VIRTUE note** | typed/immutable win; lost the one-obvious `ValueUnit` primitive cohesion |
| `transform/path.ts` (`PathGeometry`) | **KEEP-EARNED (watch)** | kf ×2 — but only via unconsumed svg/morph (transitive coupling) |
| **`transform/decompose.ts`** | **SUPERFLUOUS-PRUNE** | 609 LOC, ZERO real consumers; DOMMatrix exists (docket 7) |
| **`quantize.ts`** | **SUPERFLUOUS-PRUNE from public API** | 0 kf; demo-only image-extract feature; drop `./quantize` key (docket 7) |
| **`subpaths/` dir** | **DISSOLVE** | pure re-exports; owner "code smell supreme, NO SHIMS"; repoint keys at module indexes, keys frozen (docket 2) |
| `css/…collectDeclarations` | **PRUNE-CANDIDATE** | 0 kf consumers (every other collect*/parse* IS consumed) |
| exotic spaces (jzazbz/ictcp/rec2020/prophoto/a98/p3) | **KEEP** | owner mandates "all spaces"; demo-earned — but belong with the color-app if ever split |
| **e2e/ fleet (13.4k LOC / 71 specs)** | **ABROGATE for value.js** | 0/193 blocks import the library; already CI-unwired; survivors → demo tranche (docket 6) |

## (c) RESTORE ledger (priority-ordered, owning library)

> Home = value.js `src/color/` + `src/css/` (no `subpaths/` shim). Gamut lives in VALUE
> (owner: value owns core CSS color); kf consumes. SCI-1 is DECIDED SHIP-4.1.x (panel-1 G6').

| # | Restore | Shape | Lands in | Owner |
|---|---|---|---|---|
| **R1** | §13.2 MINDE gamut map + raytrace reference twin (owner seed #1) | restore-MODERNIZED: `mapColorToGamut` gains deltaEOK + clip-vs-reduced (MINDE) + L≥1→white/L≤0→black short-circuit; raytrace as WPT-gated exact oracle | `src/color/gamut.ts` + `operations.ts` | **value** |
| **R2** | `deltaEOK` / `deltaE2000` (Sharma) / `deltaEITP` + ICtCp/Jzazbz explicit | restore-as-was (exact vectors survive in R docs) | `src/color/difference.ts` — kf drops local ΔE | **value** |
| **R3** | zero-alloc into-variants (owner seed #2) — EXTEND SCI-1 | add `color2Into`, `sampleGamutBoundaryInto`, **`mapColorToGamutInto`/`safeAccentColorInto`** (the 10³–10⁴-alloc hot path SCI-1's 2 verbs miss) | `src/color/operations.ts` | **value** |
| **R4** | N-stop ramp `sampleColorRamp`/`mixColorsN`/`sampleColorRampAt` | restore-modernized (SoA-backed); **kf `compile/emit/backward/color.ts` consumes it → kills the local duplication + un-stales backward.ts:30,47** | `src/color/ramp.ts` | **value** |
| R5 | SoA packed-color-channel fold (`color-soa`) | re-litigate the 3.0.0 consumer-count excision under the zero-alloc mandate | `src/color/` | **value** |
| R6 | OKHSL/OKHSV picker spaces | restore-as-was | `src/color/operations.ts` | **value** |
| R7 | `evaluateMathFunction` (calc EVALUATOR — parse survives, evaluate gone) | restore-modernized over the W9 calc AST | `src/css/` | **value** |
| R8 | WCAG `contrast-color()` + `wcagContrastRatio`/`wcagRelativeLuminance` | restore-as-was (2026 CSS Color 5) | `src/color/operations.ts` | **value** |
| R9 | gamut-boundary contour samplers | restore IFF demo gamut-viz rebuilt on value (owner frontend focus) | `src/color/gamut.ts` | **value** |
| R10 | `spring()` CSS easing parse/lowering | restore in grammar; decide value-owns vs kf-physics-owns | `src/css/grammar.ts` or kf `easing.ts` | value / kf |
| R11 (low) | CSS filter-chain recolor solver | restore only on a named consumer | `src/color/filter.ts` | **value** |

> NOTE: the kf 903-LOC gamut subsystem (K#2/D1) is NOT restored to kf — it delegates to value's
> restored gamut. RIGHTLY-DROPPED at kf level (separation of concerns); the loss was value not
> holding it.

## (d) gates/tests program

**kf minimal HONEST gate set (F, verified):**
`check:lib && build:lib && test:lib && proof:publish` (+ `proof:structure` via `check`, + `lint`,
+ `release:changelog` on tag). Seven mechanisms. **KEEP-EARNED:** proof:publish spine (actuated
negatives), proof:structure (47 recorded catches + `--selftest`), release:changelog.
- **SUBTRACTION:** land R2-07's 9 unshipped prunes (taxonomy.json 654L, zero-alloc gc arm,
  group-snapshot it.fails, 2 orphan `.measure.test.ts`, 2 orphan `.mjs`, probe-webkit) +
  **PRUNE `engine/boundary-cohesion.test.ts`** (implementation-shape, duplicates lint + R6).
- **WIRING:** land the 4 staged MRs (MR1 pageerror-key, MR2 5 oracles nightly, MR3 dispatch gate,
  MR4 test:demo→gates); **relabel `proof:owner-golden`→`review:owner-golden`** (enforcing leg runs
  in zero workflows). Zone-orphaned tests bind to zone verdicts.
- No new gate GENRE warranted — the owner's "little process, direct verification" is ~90% met.

**value.js e2e verdict (E, verified):** **ABROGATE for value.js-the-library** (0/193 import the
library; already CI-unwired at HEAD). Survivor ~500 LOC (`page-load` smoke + ≤3 named-catch
oracles o16-cascade-clobber / color-space-liveness / o12-backing-store + 1 axe battery) relocates
to the **DEMO restructure tranche**, NOT value's gate surface. value.js needs a NEW structure gate
BUILT FROM SCRATCH (no `scripts/gates`, no `proof:*`) — panel-1 R14', reconfirmed.

## (e) amendment rows H1'..H8' (for the recommendation set)

**H1' (parser reconciliation).** The extant value parser is `src/css/{grammar.ts (25 regex),
stylesheet.ts (char-index+inline-regex, no scanner), timeline.ts (9), syntax.ts (1)}` — an
UNMEASURED regex rewrite (benches deleted at v4 `164343c1`). H2's "byte-scanner genuinely
better" describes the RETIRED pre-v4 parse-that+`balancedText` hybrid (measured, deleted) — it
does NOT defend the incumbent; it WITNESSES the owner's "ill-defined, slow parser" loss. The
regex-abrogation ruling (addendum-2) condemns those four css/ files; NOTHING at HEAD satisfies a
scanner ideal. Reinforces panel-1 R2' (three-way greenfield bench); connects to G1'.

**H2' (subpaths dissolution + blast radius).** DISSOLVE `src/subpaths/`; repoint the 6 consumed
export keys at their module indexes (`./color`→`dist/color/index.js`, etc.), keys FROZEN; create
a real `src/transform/index.ts` for `./transform` (path.ts only once decompose is pruned); DROP
the `./quantize` key. Widening risk ≤1 type (`ColorFactory`). Blast radius: exports map +
vite.config.ts:216-235 dts entries + self-alias set + dts rollup; nothing internal imports
subpaths. Strengthens panel-1 R13'.

**H3' (kf zone dispositions).** Adopt the table in (a). Headline corrections to H1/F:
`waapi/` is ENGINE-WIRED (playViaWAAPI play strategy) → OWNER-DECISION not prune; `scroll/`
serialize is compiler-wired (KEEP) while its rAF sampler is OWNER-DECISION; `drag/Draggable` is
comment-only (PRUNE, not "consumed"). Platform-reimpl zones with a recorded E.W9 deliberate KEEP
(waapi, scroll-sampler, orchestration/timeline, svg/morph) are OWNER-DECISION rows, not unilateral
prunes. All zone-orphaned tests bind to their zone verdict.

**H4' (backward-emit OVERFIT-SHRINK, differentiator-preserving).** Keep `compileToCSS` +
`compileToEntry` + the CC-3 honest-refusal (the consumed "keyframes.ts run backward" differentiator,
TWO demo verbs — H1's "one" undercounts); trim the unconsumed `compileToViewTransition` runtime
emit + dead `compileToString`/`formatKeyframes`.

**H5' (double gamut loss → constellation RESTORE).** BOTH libraries lost their reference gamut
oracle (kf's 903-LOC subsystem at modernization; value's raytrace+ΔE at v4 — grep=0 verified).
Restore into VALUE per ledger (c) R1→R4 first (MINDE/raytrace + deltaEOK + into-variants + N-ramp);
kf consumes and drops `compile/emit/backward/color.ts`'s local oklab-ΔE duplication (the stale
docstrings backward.ts:30,47 naming value's dropped `sampleColorRamp`/`deltaEOK` become true again).
Connects panel-1 R6'/R7'.

**H6' (e2e + kf gates program).** value.js e2e fleet ABROGATE (0/193 import library; CI-unwired);
~500-LOC survivor set → DEMO tranche, not value's gate surface. kf minimal-seven gate set (d);
subtraction = land R2-07's 9 prunes + PRUNE boundary-cohesion; wiring = land 4 MRs + relabel
owner-golden. value needs a from-scratch structure gate (panel-1 R14').

**H7' (value dispositions).** PRUNE `transform/decompose.ts` (609 LOC, ZERO real consumers —
kf's `/transform` use is `PathGeometry` from `path.ts`); DEMOTE `quantize.ts` out of the public
API into the value demo (0 kf; demo-only image-extract). `path.ts` KEEP-EARNED but watch its
transitive coupling to the OWNER-DECISION svg/morph zone.

**H8' (silent-drop standing law — extends panel-1 R7').** Ratify the capability-preservation gate
(born-RED on any dropped public symbol across a major) AND require every major-cut wave spec to
carry a DROPS section enumerating dropped symbols classified RIGHTLY/UNJUSTLY/UNCLEAR with
one-line tombstones; the surface-diff check FAILS on any public deletion absent from that DROPS
section. Proof of need: v4's ~15 silent color/parser deletions (0 hits in docs/tranches/V).
