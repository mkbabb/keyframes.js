# Tranche G audit — `a-backend-godmodules`

**Lane.** The god-module assay over the post-F engine (`src/animation/**` on
`tranche-g-dev`). For EACH source file >500L: is a cohesive sub-module
decomposition BEFITTING + expedient, or is the file at its gestalt? Plus the
service boundaries, the `addFrame→parse→compile→interp` pipeline orchestration,
DRY, no-nested-imports, no-test-in-src. **MEASURE-FIRST on the split question
(line-count is not a trigger; F.md NEW-3 / `a-engine-post-e F-ENG-5` already
ruled the `Animation` class cohesive — this lane does NOT re-litigate a
split-for-line-count, it re-VERIFIES the gestalt held through F's growth and
hunts for genuinely-cohesive seams the F lane did not name).**

**Method.** Live `file:line` on `tranche-g-dev` (`wc -l` + `grep` of every
top-level decl and class method on each candidate, read of every transitional
region). EXTENDS `F/F.md` (the §library-line-ceiling DECISION, F.W11 boundary
folds) and `F/audit/a-engine-post-e.md` (F-ENG-5, the four-group ruling).
Disposition legend: SHIP-in-G · MEASURE-FIRST · BOOK · KILL · RECORD ·
value.js-HANDOFF · ALREADY-SOTA.

---

## 0. Headline

**The post-F engine is NOT a god-module problem — it is a correctly-decomposed
engine whose two largest files are at their cohesive gestalt.** Of the seven
candidates the brief names, the line counts shifted since F (`engine.ts`
1179→**1313**, the rest stable), but the growth is *concentrated in two cohesive
methods*, not sprawl — and the F-era decomposition discipline (the D.W4
`FrameCompiler` split, the F.W11 boundary folds, the per-concern light/heavy
file family) HELD. Verified post-F facts:

| File | L | Top-level shape | Split BEFITTING? | Disposition |
|---|---|---|---|---|
| `engine.ts` | 1313 | `Animation` (1012L, `:82-1093`) + `CSSKeyframesAnimation` (208L, `:1095-1295`) + 3 module fns + re-export tail | **NO** — gestalt held; but the *re-export tail* is a real seam | **ALREADY-SOTA** (class) + **RECORD** (one micro-observation, G-GM-1) |
| `animations.ts` | 870 | 40 flat preset factories + a 4-bucket taxonomy (`:804-870`) | **MEASURE-FIRST** — the only candidate with a *latent* cohesive seam (the taxonomy already partitions it) | **MEASURE-FIRST → likely RECORD** (G-GM-2) |
| `group.ts` | 752 | `AnimationGroup` (716L) + 1 guard + 3 iface | **NO** — compositor gestalt (blend + managed-child + draw loop are mutually load-bearing) | **ALREADY-SOTA** (G-GM-3) |
| `sequence.ts` | 616 | `Sequence` (517L) + position type + 1 PRM fn | **NO** — transport+scheduling share the same scalar-fold core (`_fold`) | **ALREADY-SOTA** (G-GM-4) |
| `spring.ts` | 491 | `SpringProgress` + duration adapter + ifaces | **N/A** (<500; under ceiling) | **ALREADY-SOTA** (G-GM-5) |
| `waapi.ts` | 473 | 4 free functions (eligibility / keyframes / options / native-scroll) + LUTs | **N/A** (<500) — and note: it is ALREADY function-decomposed, not a class | **ALREADY-SOTA** (G-GM-6) |
| `frame-compiler.ts` | 402 | `FrameCompiler` + `resolveEasingOption` | **N/A** (<500) — IS the D.W4 split's product | **ALREADY-SOTA** (G-GM-7) |

**Only ONE file (`engine.ts`) is over the library's 950L `Animation`-class
growth-guard**, and it is over only because the class is at 1012L — but the
F.md §ceiling DECISION set the guard at the *class*, and F-ENG-5 ruled the class
cohesive. So the honest assay is: **no SHIP-in-G decomposition is befitting.**
The candidates are ALREADY-SOTA. This lane's net-new value is (a) verifying the
gestalt survived F's growth with a re-measured class anatomy, (b) the one
genuinely-latent seam (`animations.ts` taxonomy) measured and dispositioned, and
(c) two small RECORD/BOOK observations no prior lane named.

`grep` confirmed: **zero nested/function-scoped imports** (the four `import("./*")`
in `index.ts:192-195` are the documented dynamic-boundary edges, not nesting),
**zero test files in `src/`** (`find src -name '*.test.ts'` → nil). The
no-nested-imports and no-test-in-src precepts are HONORED — nothing to fold.

---

## G-GM-1 — `engine.ts` 1313L: the gestalt HELD through F; the growth is two cohesive methods — ALREADY-SOTA + RECORD

**Cite.** `engine.ts:82-1093` (`Animation`, **1012L** — verified `awk` span),
`:1095-1295` (`CSSKeyframesAnimation`, **208L**), the module fns
`tryParseTime:57`/`hasClone:66`/`getAnimationId:75`, the re-export tail
`:1297-1307`.

**The growth since F is NOT sprawl.** F-ENG-5 measured the class at 913L; it is
now 1012L (+99L) and the subclass 166→208L (+42L). The delta traces to exactly
two F waves, both landing in ONE method each, both cohesive:

- **F.W7** (per-keyframe easing read) + **F.W8** (the sibling-style-rule
  shorthand merged as the option base) landed entirely inside
  `CSSKeyframesAnimation.fromString` (`:1165-1245`) — the ~22-line `base`-merge
  block (`:1182-1203`) and the per-keyframe `cssTwinFor` read (`:1219-1231`).
  This is the parse-input-reconciliation seam doing more of its ONE job
  (read the CSS faithfully), not a new responsibility.
- The `Animation` growth is the F.W4 buffer machinery: `clearBuffer`
  (`:706-711`), the single-frame alias fast-path (`:662-680`), `processFrame`
  (`:721-737`) — the zero-alloc hot-path core, the most load-bearing 70 lines in
  the engine.

**The four-group gestalt F-ENG-5 named is intact and re-verified** (method grep
`:184-1093`): (1) the compile-delegation facade (`flatKeys`/`templateFrames`/
`parsedVars`/`frames`/`frameId` thin accessors → `this.compiler`, `:184-271`);
(2) the ~13 fail-explicit setters sharing the live-options-reference contract
(`setTimingFunction`…`setOptions`, `:314-534` — each mutates `this.options` in
place; `setDuration:353` re-derives frame times, `setColorSpace:483` re-derives
colors — the `6e29236` test-lock on this reference still binds, verified
`git log`); (3) the lifecycle/playback state machine
(`onStart`/`advanceTo`/`_frame`/`play`/`pause`/`resume`/`stop`/`settle`,
`:739-1072`); (4) the fill/rest contract (`restPosition`/`paintRest`/`fill*`,
`:535-583`). **None is independently extractable without severing the
`this`-bound re-derive seam** the FrameCompiler depends on — exactly F-ENG-5's
finding, now re-confirmed at +99L. A split here remains legacy-shaped
(extract-for-line-count), the §Mandate's forbidden shape.

**The ONE genuinely-distinct seam — and why it is NOT a split.** The 11-line
re-export tail (`:1297-1307`: `AnimationGroup` from `./group`, the type re-exports
from `./group`/`./adapter`) is the ONLY part of `engine.ts` that is not
`Animation`/`CSSKeyframesAnimation` body. It is deliberate (the documented
`:1297-1302` rationale: the dynamic boundary hands the whole value.js-bearing
surface through one `import("./engine")`). It is 11 lines — moving it nets
nothing and would *break* the single-dynamic-chunk boundary `proof:boundary`
locks. **Leave it.**

- **Disposition: ALREADY-SOTA** (the class is at its gestalt, re-verified
  post-F-growth) **+ RECORD** (the growth-guard is a *class*-scoped 950L line; at
  1012L the class is 62L over the guard the F.md §ceiling DECISION named — this
  is the ONE candidate that trips its own guard). **The honest reading:** the
  guard guarded against *growth*, and F's growth was cohesive (two methods doing
  their one job better), so the guard's INTENT held even as the number crossed.
  **G should DECIDE (BOOK):** either re-baseline the class guard to ~1050L with
  the F.W7/W8 rationale recorded, OR (the cleaner motion) — see G-GM-1b. **Do
  NOT split for the 62L.**

### G-GM-1b — the one cohesive carve that IS expedient (if any): `CSSKeyframesAnimation` → its own file — MEASURE-FIRST → likely RECORD

The single decomposition that would be *cohesive rather than line-count-driven*
is moving `CSSKeyframesAnimation` (`:1095-1295`, 208L) to `css-keyframes.ts`,
leaving `engine.ts` as the `Animation` base + the re-export boundary. This is a
real subclass-vs-base seam (the brief explicitly invites it):
`CSSKeyframesAnimation` adds a DISTINCT concern (the CSS-text→frames adapter:
`fromString`/`fromKeyframes`/`fromVars`/`registerProperties`/`resolveTransform`)
atop the playback-engine base, and it is the surface that grew under F.

**But the §Mandate's MEASURE-FIRST + KISS bite against it:**
- The two classes share the value.js-bearing import set (the parser, the
  `timingFunctions` registry, `getTimingFunction`/`cssTwinFor`) — a split
  duplicates the import header or introduces a back-edge, and both are now in
  ONE dynamic chunk behind `loadAnimationEngine` (the boundary contract). A
  second heavy file is a second thing `proof:boundary` must reason about for
  ZERO consumer-visible benefit (same chunk, same lazy-load).
- It is `export class CSSKeyframesAnimation ... extends Animation` — the subclass
  reads `protected` base internals (`this.options`, `this.addFrame`,
  `this.parse`, `this._ctorOptions`, `this._defaultTransform`); a file split
  forces those from `private`→`protected` purely for the carve, weakening
  encapsulation for cosmetics.
- **The honest test (the F.md NEW-3 standard):** does the carve make the code
  more correct, simpler, or faster? No on all three. It is an
  extract-for-line-count wearing a subclass costume.

- **Disposition: MEASURE-FIRST → RECORD (do NOT carve).** The expedient seam
  exists but fails the cohesion-benefit test; carving it is the legacy-shape the
  Mandate forbids. **Falsifiable instrument if a future wave disputes this:** a
  `proof:boundary` re-run after the carve must show the SAME single dynamic chunk
  AND zero new `protected` widenings — if either regresses, the carve is
  legacy-shaped (it will). RECORD so no future "engine.ts is 1313L, split it"
  reflex re-opens it.

---

## G-GM-2 — `animations.ts` 870L: the ONE latent cohesive seam — the taxonomy already partitions it — MEASURE-FIRST → likely RECORD

**Cite.** `animations.ts:6-802` (40 preset factories, each a `<name>Keyframes`
CSS literal + a `<name>` factory), `:728-731` (4 `SPRING_*` config consts),
`:804-870` (the `enter`/`exit`/`attention`/`loop` taxonomy + `presetTaxonomy`,
landed E.W10 §S6 per the `:804` comment).

This is the brief's named candidate ("`animations.ts` 870 preset library ->
grouped preset modules?") and the **only file in the set with a real latent
seam**: it is a flat catalogue, and a catalogue *can* be partitioned. The file
even SELF-DOCUMENTS the partition — `presetTaxonomy` (`:865-870`) already groups
the 40 presets into enter/exit/attention/loop. So a `presets/enter.ts`,
`presets/exit.ts`, `presets/attention.ts`, `presets/loop.ts` + a barrel
`presets/index.ts` re-assembling `presetTaxonomy` is the *obvious* decomposition.

**Why it is MEASURE-FIRST, not SHIP — three Mandate considerations:**

1. **It is not a god MODULE — it is a god LIST.** A god-module is a file with too
   many *responsibilities*; `animations.ts` has exactly ONE (the preset library)
   expressed as a flat data table of value-equivalent leaves. Splitting a data
   table by a tag column is organization, not decomposition — the F.md
   "logical grouping without contrivance" test is the bar, and a 4-way split of a
   870L flat catalogue into ~150-220L files is genuinely *more discoverable*
   (the brief's own hypothesis) — but it is also pure file-shuffling with ZERO
   behaviour/perf delta.

2. **The taxonomy seam is NOT a clean cut.** Several factories cross buckets by
   construction: `flip` (`:123`) and `bounce` (`:94`) are attention but also
   common entrances; the `SPRING_*` consts (`:728-731`) feed `springScaleIn`
   (enter), `springPop`/`springWobble` (attention) — a per-bucket file either
   duplicates the spring consts or needs a shared `presets/_spring-config.ts`
   leaf, which is exactly the "nested import / shared-leaf" friction a flat file
   avoids. The taxonomy is a *discovery index*, not a partition — the `:860-864`
   comment says so explicitly ("a discovery index over the library, not a second
   copy of it").

3. **The F.W11 boundary fold just routed presets through `loadAnimationEngine`**
   (`index.ts:195` `import("./animations")`, `:202` `presets` namespace). A split
   turns that one dynamic edge into a barrel-of-dynamic-edges; the bundler still
   emits one chunk (tree-shaking aside), so the lazy-load cost is unchanged but
   the boundary surface `proof:boundary` reasons about grows 4×.

- **Disposition: MEASURE-FIRST → likely RECORD.** The seam is real and the only
  one in the set, but it buys discoverability at the cost of file-count + a
  shared-spring-config leaf, with ZERO behaviour/perf benefit — KISS argues to
  leave the flat catalogue + the `presetTaxonomy` index (which ALREADY delivers
  the discoverability the split would chase, in-file, no new files).
  **Falsifiable instrument IF G elects to split anyway:** a `proof:presets`
  smoke that (a) every name importable from the barrel resolves to the SAME
  factory identity as before the split (byte-identical re-export), (b)
  `presetTaxonomy` enumerates all 40, (c) `proof:boundary` still emits presets in
  the heavy dynamic chunk with no new static value.js edge. **Recommendation:
  RECORD — the discoverability win is already banked by the taxonomy; a split is
  contrivance.** (This is the lane's strongest "candidate that LOOKS like a
  god-module but is a leaf catalogue" finding.)

---

## G-GM-3 — `group.ts` 752L: the compositor gestalt — ALREADY-SOTA

**Cite.** `group.ts:36-752` (`AnimationGroup`, ~716L), method grep `:102-743`.

The compositor's surface is FOUR mutually-load-bearing concerns that share the
same per-frame buffer + managed-child state, none independently extractable:
**(1) entry/key management** (`getEntries`/`invalidateEntries`/`computeGroupedKeys`/
`setSuperKey`, `:154-192` — the `_grouped` stable-key buffer + the F.W4
null-fill clear at `:212`-region live here); **(2) the blend kernel**
(`transformFramesGrouped`, `:238-378` — `replace`/`add`/`weighted` over the
shared buffer; this is the per-frame hot path, the zero-alloc tail the F.md
§ALREADY-SOTA record names); **(3) the managed-child lifecycle**
(`pause`/`resume`/`toggle`/`settle`/`reset`/`stop` + `_advanceSlice`'s
`scheduler.yield` INP batching, `:422-704` — the one-contract managed-child
discipline the `animation/CLAUDE.md` states once); **(4) the draw loop**
(`advanceTo`/`_frame`/`play`/`_playReducedMotion`, `:422-593`).

Concerns (1)-(4) all mutate the SAME `_grouped` buffer + the child `managed`
flags + the `_playingPromise` guard. Splitting the blend kernel from the buffer
it blends into, or the lifecycle from the flags it mutates, is the anaemic-object
anti-pattern F-ENG-5 named for `Animation`. The layer-config accessors
(`setLayerConfig`/`setLayerEnabled`/`getLayerConfig`, `:718-752`) are the only
arguably-separable cluster (~35L) — far too small to carve, and they read the
same `entry` state.

- **Disposition: ALREADY-SOTA.** The compositor is at its gestalt (the same
  ruling as `Animation`, applied to the parallel class). No befitting seam.

---

## G-GM-4 — `sequence.ts` 616L: transport and scheduling share ONE fold core — ALREADY-SOTA

**Cite.** `sequence.ts:97-613` (`Sequence`, ~517L), method grep `:160-602`.

The brief invites a "transport vs scheduling" cut. **The code disproves the
seam.** The two surfaces — scheduling (`label:200`/`add:211`/`resolvePosition:230`
— place segments on the master clock) and transport
(`play:335`/`stop:503`/`pause:519`/`resume:536`/`timeScale:556`/`reverse:576`/
`repeat:587`/`yoyo:602`/`seek:257`) — are NOT separable because **every transport
verb routes through ONE scalar-fold core, `_fold` (`:295-310`)**, which reads the
SAME state scheduling writes: `duration` (derived from the placed segments),
`_repeatCount`, `_yoyoOn`, `_rate`. `timeScale`/`reverse` mutate `_rate`;
`repeat`/`yoyo` mutate `_repeatCount`/`_yoyoOn`; `_fold` folds the master clock
through all of them; `_applyAt` (`:274`) then drives each scheduled segment's
local clock via `clamp(masterClock − at, 0, duration)`. The scheduling state and
the transport state are one coupled scalar field that `seek`/`_frame`/`_fold`
read together every frame.

A "transport module" extracted from a "scheduling module" would either (a) pass
the entire `Sequence` instance back and forth (no encapsulation gained) or (b)
duplicate the scalar field across two objects (a correctness hazard — the F.W9
C⁰-continuity-at-flips lock depends on `_rate`/`_fold` being one coherent state).
F.W9 LANDED this transport on exactly this shared core (`FINAL.md:59-61`,
`test/sequence-transport.test.ts` the lock) — it is a deliberate, gate-backed
gestalt, not accreted sprawl.

- **Disposition: ALREADY-SOTA.** The transport/scheduling cut the brief
  hypothesizes is a false seam — they are one scalar-fold gestalt. Leave it.

---

## G-GM-5 — `spring.ts` 491L: under the ceiling, single-source physics — ALREADY-SOTA

**Cite.** `spring.ts:149-491` (`SpringProgress`), `:101-115`
(`durationToSpringOptions`), `:16-119` (the option/subscriber ifaces).

Below 500 — not a god-module by the brief's own threshold. Worth noting for the
DRY axis: **`SpringProgress` is the SINGLE source of spring physics** — composed
(not duplicated) by `drag.ts:1` (the fling re-seat), `springLinearStops.ts:1`
(the CSS `linear()` emitter), `springTimingFunction.ts:2` (the typed `Easing`
twin). `decay.ts` is a SEPARATE closed-form analytic (frictional decay, not
2nd-order ODE) — correctly not folded into spring. **No duplicated physics
across the spring/decay/drag triad** (grep verified). DRY is exemplary.

- **Disposition: ALREADY-SOTA** (under ceiling; single-source physics; the F.md
  §ALREADY-SOTA spring/decay/drag analytics record holds).

---

## G-GM-6 — `waapi.ts` 473L: already FUNCTION-decomposed (not a class) — ALREADY-SOTA

**Cite.** `waapi.ts` — 4 exported free functions (`isWAAPIEligible:98`,
`toWAAPIKeyframes:232`, `toWAAPIOptions:291`, `attachNativeScrollTimeline:440`) +
the eligibility LUTs (`WAAPI_INELIGIBLE_UNITS:30`,
`PATH_RELATIVE_PERCENT_PROPERTIES:56`, `DIRECTION_MAP:277`/`FILL_MAP:284`) + the
discriminated `WAAPIEligibility`/`NativeScrollAttachment` unions.

Under 500 AND structurally NOT a god-module: it is a flat module of four pure
translation functions (engine-frame → WAAPI), each one cohesive stage of the
delegation pipeline (eligibility-gate → keyframes → options → native-scroll). No
hidden class, no shared mutable state — the cleanest decomposition shape in the
set. The F.W12 `offset-distance` `%`-exemption (`PATH_RELATIVE_PERCENT_PROPERTIES`,
`isOffsetPercentProperty:67`) folded into the existing eligibility predicate
without growing a new concern.

- **Disposition: ALREADY-SOTA.** Exemplary function-decomposition; nothing to do.

---

## G-GM-7 — `frame-compiler.ts` 402L: IS the D.W4 split's product — ALREADY-SOTA

**Cite.** `frame-compiler.ts:86-402` (`FrameCompiler`), `:47-82`
(`resolveEasingOption`).

This file is the *result* of the prior god-module fold: D.W4 extracted the heavy
compile half OUT of `Animation` into `FrameCompiler` (`F/F.md:7`, the "FrameCompiler
split"). It is the clock-free value-in→frames-out pipeline stage
(`convertFrameStart`/`addFrame`/`createFrame`/`buildVarIndex`/`reconcileVars`/
`parse`/`finalizeFrameVars`/`renormalizeColors`) — the `addFrame→parse→compile`
half of the pipeline the brief asks about, already cohesively isolated behind the
`Animation`→`this.compiler` facade (the 6 thin accessors at `engine.ts:184-271`).
Splitting it further would re-fragment what D.W4 deliberately unified. The
F.md §ALREADY-SOTA FrameCompiler record ("at the industry frontier for its
scale") holds.

- **Disposition: ALREADY-SOTA.** It is the answer to the god-module question,
  not an instance of it.

---

## Pipeline orchestration / service boundaries / DI — verified, no fold

The brief asks after the `addFrame→parse→compile→interp` pipeline and DI/service
boundaries. Verified ALREADY-SOTA, no manufactured work:

- **The pipeline is a clean staged facade**, not a god-method.
  `addFrame`/`parse`/`frames`/`frameId` on `Animation` (`engine.ts:184-294`)
  delegate to `this.compiler` (the `FrameCompiler` injected at construction);
  `interpFrames` (`:609`) reads the compiled `frame.flatVars`/`interpVars`. The
  compile half and the interp half are SEPARATE objects with a thin contract —
  textbook stage separation.
- **Dependency injection is present and idiomatic** where it earns its keep: the
  light steppers/timelines take injectable easing (`TimingFunction`/`Easing`,
  resolved once via `resolveEasing`); `ScrollTimeline` takes injectable
  `getScrollY`/`getViewportHeight` (the testability seam the CLAUDE.md names);
  `RAFPlayback` is THE single injected rAF driver every loop rides (no module
  owns a second rAF handle — verified, the boundary the `animation/CLAUDE.md`
  states). No service-locator, no over-injection.
- **The value.js static/dynamic boundary is the one real service boundary** and
  it is gate-locked (`proof:boundary`): light surface carries zero static
  value.js edge; the heavy engine is one dynamic chunk behind
  `loadAnimationEngine`. F.W11 routed presets through it; the boundary held.

---

## Hygiene precepts — HONORED (nothing to fold)

- **NO nested imports.** `grep` for function-scoped `import`/`await import`
  inside bodies → the ONLY hits are `index.ts:192-195` (the four documented
  dynamic-boundary `import("./engine")`/`./animate`/`./motion-path`/`./animations`
  edges in `loadAnimationEngine`) — these are the intentional lazy-boundary, not
  nesting. HONORED.
- **NO test files in `src/`.** `find src -name '*.test.ts' -o -name '*.spec.ts'`
  → nil. HONORED.
- **DRY.** No duplicated physics (spring single-source, G-GM-5); the F.W11 clamp
  convergence HELD (re-verified: every `clamp(…,0,1)`/`clamp(…,0,N)` site across
  `engine`/`numeric`/`sequence`/`smooth`/`spring`/`stagger`/`waapi`/`playback`/
  `timeline`/`frame-compiler` routes through the shared `clamp` — light modules
  via `internal/leaves.clamp:23`, heavy via value.js; ZERO residual open-coded
  `Math.max(0, Math.min(...))` remains, grep-confirmed). HONORED.

---

## Disposition ledger

| ID | Finding | Cite | Disposition |
|---|---|---|---|
| G-GM-1 | `engine.ts` 1313L: gestalt held through F (+99L cohesive, two methods) | `engine.ts:82-1093,1095-1295` | **ALREADY-SOTA** + **RECORD** (class 62L over its own guard; BOOK the re-baseline decision) |
| G-GM-1b | `CSSKeyframesAnimation`→own file (the one cohesive carve) | `engine.ts:1095-1295` | **MEASURE-FIRST → RECORD** (fails the cohesion-benefit test; same chunk, `protected` widening) |
| G-GM-2 | `animations.ts` 870L: taxonomy-partitioned preset catalogue | `animations.ts:6-802,804-870` | **MEASURE-FIRST → likely RECORD** (god-LIST not god-module; taxonomy already banks the discoverability) |
| G-GM-3 | `group.ts` 752L: compositor 4-concern gestalt | `group.ts:36-752` | **ALREADY-SOTA** |
| G-GM-4 | `sequence.ts` 616L: transport/scheduling share `_fold` core | `sequence.ts:97-613,295-310` | **ALREADY-SOTA** (false seam) |
| G-GM-5 | `spring.ts` 491L: under ceiling, single-source physics | `spring.ts:149-491` | **ALREADY-SOTA** |
| G-GM-6 | `waapi.ts` 473L: already function-decomposed | `waapi.ts:98,232,291,440` | **ALREADY-SOTA** |
| G-GM-7 | `frame-compiler.ts` 402L: IS the D.W4 split product | `frame-compiler.ts:86-402` | **ALREADY-SOTA** |
| — | pipeline / DI / service-boundary; nested-imports; test-in-src; DRY/clamp | (see §§ above) | **ALREADY-SOTA / HONORED** |

**What G's god-module band folds: NOTHING.** Zero SHIP-in-G decomposition is
befitting — every candidate is at its cohesive gestalt or is a leaf catalogue
whose only "split" is contrivance. The lane's net-new value is the re-verified
post-F class anatomy (the gestalt survived +99L), the single latent seam
(`animations.ts` taxonomy) measured and dispositioned to RECORD, and the
class-guard re-baseline DECISION booked (G-GM-1). **The post-F engine refutes the
god-module premise by what it leaves correctly unified.**

---

### Verification (re-runnable)

```sh
cd /Users/mkbabb/Programming/keyframes.js
# line counts of the seven candidates (the assay's premise):
wc -l src/animation/{engine,animations,group,sequence,spring,waapi,frame-compiler}.ts
# G-GM-1 — the two classes + their spans:
grep -nE "^export class" src/animation/engine.ts          # Animation:82, CSSKeyframesAnimation:1095
# G-GM-1 — the live-options-reference setters cluster (the carve-blocker):
grep -nE "^    set[A-Z][a-zA-Z]*\(" src/animation/engine.ts
# G-GM-2 — the taxonomy already partitions the catalogue:
grep -nE "export const (enter|exit|attention|loop)Presets|presetTaxonomy" src/animation/animations.ts
# G-GM-4 — every transport verb routes through _fold:
grep -nE "_fold|timeScale|reverse|repeat|yoyo|seek" src/animation/sequence.ts
# hygiene — nested imports (only the documented boundary edges) + no test-in-src:
grep -nE "^\s+import\b|^\s+(const|let).*await import" src/animation/*.ts
find src -name '*.test.ts' -o -name '*.spec.ts'           # expect: nil
# DRY — clamp convergence held (no open-coded Math.max(0,Math.min)):
grep -rnE "Math.max\(0, Math.min" src/animation/                # expect: nil
```
