# Lane a32 — Performance Posture Post-R (Tranche R deep audit, pass 1)

**Scope:** Did the R surgical refactor (7-zone `src/animation` partition, god-class
DI carves, `./engine` subpath, `animate()` excision) cost anything at runtime?
Hot-path allocation census; DI-indirection cost (`getGroupFactory` call sites,
`PlaybackState` object shape); zone-barrel import-graph vs tree-shaking; whether
5.1.0 is performance-honest and what perf waves S should carry.

**Range audited:** master `a15cd48..18e8617` (78 commits), read-only via
`git show`. Repo left on `tranche-s-dev`.

---

## Executive summary

**Verdict: 5.1.0 is performance-honest. R introduced no per-frame CPU regression,
and in one place it *improved* the design (excised the `this as unknown as
PlaybackHost` privacy-inversion cast).** R was a structural refactor: it *moved*
and *re-homed* code across zones without rewriting the hot loops. The per-frame
interpolation core (`interpFrames`/`processFrame`), the SoA compositor fold, the
zero-alloc buffer discipline, and the sync-rAF fast-path are all **Q-era work
that pre-existed `a15cd48` and was relocated byte-for-byte** — the SoA numeric
fold (`_numericPlan`, `lerpArray`) already lived in the flat `engine.ts` at the
R baseline (`git show a15cd48:src/animation/engine.ts` line 813).

The DI carves that the audit was told to suspect are **cold-path**:
- `getGroupFactory()` fires only inside `KeyframesAnimation.group()`
  (`engine/animation.ts:492`) — a construction convenience, never per frame.
- The `PlaybackState` struct costs **one extra property hop per frame**
  (`anim._playback._interpOut` vs the pre-R direct `this._interpOut`), which is
  negligible and *bought* the removal of the `PlaybackHost` cast.
- The interpolate/playback/compositor free-functions read the concrete `anim`'s
  fields directly — no per-frame closure, no per-call allocation — so V8 keeps
  the steady state zero-alloc (asserted by `proof:standalone-zero-alloc` /
  `proof:processframe-soa`, both still green).

Tree-shaking is clean: the LIGHT barrel (`index.ts`) is pure re-exports with the
one module side-effect (`registerGroupFactory`) living on the HEAVY/dynamic side.

**The two real perf residues S inherits — neither caused by R:**
1. A **per-frame `new Set(...)` allocation** in the group's color-tail/mixed
   blend residual (`group/compositor.ts:182`), pre-existing since P.W2 and carried
   verbatim by the R.W2 carve. Fires once per frame per layer with a non-empty
   boxed residual (the 6 `colorTail` taxonomy cases).
2. A **monolithic dynamic surface**: `loadAnimationEngine()` fans out ~13 heavy
   chunks via one `Promise.all`, pulling scroll/svg/ingest/validate/presets even
   for a bare `fromString` consumer (load-time only, not CPU).

Plus one **cross-lane doc residue**: `src/animation/CLAUDE.md` still describes the
**pre-R flat layout** (`engine.ts`/`frame-compiler.ts`/`group.ts` at top level,
class named `Animation`), never refreshed by R.W7/R.W8.

---

## Findings

### F1 — `PlaybackState` DI adds exactly one property-hop per frame; it bought the removal of the `PlaybackHost` cast — INFO
**Severity: info (perf-neutral; a design win)**
**Evidence:**
- Post-R hot read: `engine/playback.ts:249-253` — `renderFrame` passes
  `anim._playback._interpOut` as the reused interp buffer.
- Pre-R direct field: `git show a15cd48:src/animation/engine.ts` line 237 —
  `private _interpOut: Record<string, ValueUnit[]> = {};` (a direct class field).
- Pre-R cast removed: `git show a15cd48:src/animation/engine.ts` lines 917-918 —
  `private get _host(): PlaybackHost<V> { return this as unknown as
  PlaybackHost<V>; }`. This cast is **gone** post-R; every `PlaybackHost` mention
  in the current tree is comment-only (`engine/animation.ts:82,162,391`,
  `engine/playback.ts:13,20,46`).

The play run-state (`resolvePromise`, `_playingPromise`, `_waAnimations`,
`_boundFrame`, `_interpOut`) moved onto a composed `readonly _playback:
PlaybackState` field (`engine/animation.ts:84`, `engine/playback.ts:62-72`). The
steady-state hot **loop** (`interpFrames`/`processFrame`, `engine/interpolate.ts`)
still reads `anim.frames` / `anim._stableKeys` / `anim._hasComposition` directly
off the animation — only the once-per-frame buffer handoff in `renderFrame` takes
the extra `._playback.` hop. `_playback` is a stable, long-lived object, so V8
keeps the access monomorphic. **Net: one indirection per frame in exchange for
dissolving a privacy-inversion cast — a good trade, not a regression.**
**Proposal:** none. S should NOT reverse this carve for perf reasons.

### F2 — `getGroupFactory()` DI seam is construction-only; zero hot-path cost — INFO
**Severity: info (perf-honest)**
**Evidence:**
- The only runtime call: `engine/animation.ts:492` inside `.group(...)` — a
  convenience constructor, invoked at group-build time, never per frame.
- The seam: `internal/group-factory.ts:34-59` (a module-level mutable singleton
  `_groupFactory` + a guarded getter).
- The registration side-effect: `group/index.ts:27-33` (`registerGroupFactory`
  at the group-zone barrel, a cold module-init on the HEAVY/dynamic side).

This inverts the engine→group back-edge that closed the `no-cycle` ring
(R.W2c). The cost is a single indirect call at construction plus one module-init
registration — no per-frame, per-tick, or per-sample penalty. **Perf-honest.**
**Proposal:** none.

### F3 — Per-frame `new Set(only)` in the color-tail/mixed blend residual — MEDIUM
**Severity: medium (real per-frame allocation on the mixed-group path; not R-caused)**
**Evidence:**
- `group/compositor.ts:182` — `const onlySet = only ? new Set(only) : undefined;`
  inside `boxedBlendArm`.
- Reached per frame at `group/compositor.ts:112-117`: on the SoA path, when a
  layer's `plan.boxedKeys.length > 0`, `boxedBlendArm(..., plan.boxedKeys)` runs
  every frame, re-allocating the Set from the same stable `boxedKeys` array each
  time.
- **Pre-existing, not an R regression:** `git show a15cd48:src/animation/group.ts`
  line 432 — the identical `const onlySet = only ? new Set(only) : undefined;`
  existed in the flat P.W2 group.ts; R.W2 relocated `boxedBlendArm` verbatim into
  `compositor.ts`.
- The affected shapes are the 6 `colorTail` SoA/boxed cases classified in
  `bench/taxonomy.json` (commit `1f7d323`). Pure-numeric groups never hit it
  (`boxedKeys` empty → the guard skips the call).

The `soa.ts` docstring correctly claims `groupSoABlendLayer` "allocates NOTHING
per frame" (`group/soa.ts:39-44`) — that fold *is* zero-alloc — but the boxed
**residual** it delegates to allocates a Set per frame per mixed layer. This is
invisible to `proof:soa-composite` (which bites the numeric fold path), so it is
an unguarded gap.
**Proposal (Tranche-S SoA-extension):** precompute the residual key set as a
`Set<string>` INTO `SoALayerPlan` at `buildSoAPlans` time (a structural-change
event, `group/soa.ts:236-242`), and have `boxedBlendArm` accept the pre-built set
instead of re-constructing it from the array each frame. Zero-alloc for mixed
groups too.

### F4 — Monolithic dynamic surface: one `Promise.all` pulls the entire heavy graph — MEDIUM (load-time only)
**Severity: medium for a SOTA-bundle target; low for CPU (parallel-fetched, warm-able)**
**Evidence:**
- `load-engine.ts:242-339` — `loadAnimationEngine()` `Promise.all`s ~13 dynamic
  imports: `engine`, `group`, `svg/motion-path`, `svg/draw-svg`, `svg/morph-svg`,
  `ingest`, `scroll`, `compile`, `validate`, `presets`, `compile/format`,
  `compile/parse-flatten`, `internal/scheduler`.
- R.W1 §2f excised the granular loaders (`loadEngine`/`loadCompiler`/
  `loadIngest`) — `load-engine.ts:213-214` documents "zero real call sites; the
  demo uses only the full `loadAnimationEngine()`."

A consumer that only wants `new CSSKeyframesAnimation().fromString(css)` still
triggers the fetch of scroll-grammar, SVG morph geometry, the CSSOM ingest walk,
the round-trip compiler, the `validate` projection, and the full preset catalog.
Because these are **separate hash-named chunks fetched in parallel** and
`warmEngine()` (`load-engine.ts:349`) can pre-flight them at idle, the wall-clock
hit is mitigated — but the *bytes transferred and parsed* on first-await are the
whole heavy surface. This is a load-time / bundle-budget concern, **not** a
per-frame CPU cost. Excising the granular loaders was correct given zero call
sites; it leaves one coarse facet as the only granularity.
**Proposal (Tranche-S, BOOK-not-manufacture):** re-introduce lazy sub-facet
accessors (`loadScroll`, `loadSVG`, `loadIngest`, `loadValidate`) ONLY if a real
bundle-budget consumer materializes. Absent that, keep the single facet — do not
manufacture the split speculatively. Worth a bench: measure the transfer/parse
cost of the non-`fromString` chunks on a cold cache.

### F5 — Hot loops are byte-preserved; the Q-era SoA + zero-alloc work survived the carve intact — INFO
**Severity: info (positive confirmation)**
**Evidence:**
- `engine/interpolate.ts:120-287` — `interpFrames`/`processFrame` are module-level
  free functions (not per-call lambdas), reading `anim` fields directly; the
  single-active-frame alias fast-path (`interpolate.ts:183-192`) returns
  `flatVars` with no copy; the reused-buffer path null-fills via `_stableKeys`
  (`clearBuffer`, `interpolate.ts:217-225`) with NO `delete` (the V8
  dictionary-mode trap the F.W4 discipline avoids).
- The numeric SoA fold pre-existed the R baseline: `git show
  a15cd48:src/animation/engine.ts` lines 805-816 already carried `_numericPlan` +
  `lerpArray(from, to, eased, out)`. R.W2b merely relocated the plan builder to
  `compile/numeric-plan.ts` (`buildNumericPlan`, allocating the `Float64Array`s
  ONCE at parse — `numeric-plan.ts:51-58`).
- Physics steppers (LIGHT zone, untouched by R's move): `physics/numeric.ts:25`
  uses a module-level `let _out = new Float64Array(0)` shared scratch grown on
  demand; `physics/spring/progress.ts` lazy-inits `SpringVectorLanes`
  (`progress.ts:391`). No per-frame allocation.
- The SoA perf claims are substantiated by device-independent same-report
  decision JSONs: `scripts/processframe-soa-decision.json` (`60×` at K=8, ADOPT)
  and `scripts/soa-composite-decision.json` (`4.68×` add / `4.40×` weighted at
  K=8, ADOPT). These are Q verdicts; R did not re-run or regress them.

The single-active-frame path, the sync-rAF fast-path (`physics/playback.ts:125-148`
— inline reschedule for sync frames, no microtask hop), and the numeric fold are
all intact. **R preserved the perf substrate.**
**Proposal:** none — but see the S-warning below.

### F6 — `src/animation/CLAUDE.md` still describes the pre-R FLAT layout — LOW (cross-lane doc residue)
**Severity: low (misleads the perf reader's file map; a docs lane owns the fix)**
**Evidence:** `src/animation/CLAUDE.md:42-44` lists a flat `engine.ts` /
`frame-compiler.ts` / `group.ts` Files tree; lines 78, 91 name the class
`Animation` (renamed `KeyframesAnimation` in Q 5.0.0); line 265 lists flat
value.js-import sites. The zone partition (physics/ engine/ compile/ group/ …) is
mentioned exactly once (a single grep hit). R.W8 refreshed the **root** CLAUDE.md
and demo/CLAUDE.md (`5a5f7db`) but never the animation-zone doc. A reader mapping
the interpolation hot path from this doc is directed to files that no longer exist
at those paths.
**Proposal:** fold the `src/animation/CLAUDE.md` refresh into the Tranche-S
sub-zoning wave (it must be rewritten anyway when `compile/backward/`,
`engine/css/` etc. land).

### F7 — LIGHT-barrel tree-shaking is clean — INFO
**Severity: info (positive confirmation)**
**Evidence:** `index.ts:30-266` is pure `export {…} from "./physics/…"` /
`export type {…}` re-exports with no top-level executable statements. The one
module side-effect in the graph — `registerGroupFactory(...)` at
`group/index.ts:27` — lives on the HEAVY/dynamic side, so a light-only consumer
(`SpringProgress`, `drag`, `decay`, `flip`, `stagger`) never evaluates it. No
static `@mkbabb/value.js` runtime edge exists in `physics/` or `orchestration/`
(grep for `from "@mkbabb/value.js"` returns zero; the only mentions are `import
type` and doc comments), which `proof:boundary` enforces per light entry.
**Proposal:** none.

---

## Tranche-S implications

Wave-shaped recommendations, most load-bearing first.

1. **S-PERF-1 · SoA color-tail extension (folds F3).** Precompute the residual
   `boxedKeys` as a `Set` into `SoALayerPlan` at `buildSoAPlans`
   (`group/soa.ts:236`) so `boxedBlendArm` (`group/compositor.ts:175`) stops
   allocating a Set per frame per mixed layer. Extend `proof:soa-composite` /
   `proof:zero-alloc` to bite the **residual** path (the 6 `colorTail` taxonomy
   cases), which is currently unguarded. Note the color numeric-pack itself was
   deliberately DECLINED at Q (`scripts/color-soa-decision.json` — "consumed
   in-leaf"), so this wave targets the *Set allocation*, not a color Float64 pack.

2. **S-PERF-2 · Typed-OM write-path adopt/kill (SOTA uplift).** The
   `bench/typed-om-validate.mjs` spike (P.W3) is unresolved — it needs a real
   browser to produce an honest `attributeStyleMap.set` (build `CSSStyleValue`, no
   parse) vs `.style` string-write ratio. Carry it to a browser bench in S; if
   ADOPT, route `transformTargetsStyle` (`compile/parse-flatten`) through Typed OM
   to skip the serialize→reparse round-trip on the DOM apply channel. This is the
   single largest remaining SOTA-animation lever after the SoA fold.

3. **S-PERF-3 · WAAPI densify.** `bench/waapi-densify.bench.ts` exists but WAAPI
   eligibility (`waapi.ts`) still rejects multi-segment CSS-twin easing. Densify
   multi-segment easing into a single `linear()` so more `fromString` animations
   qualify for the compositor thread, cutting main-thread rAF load. Pair with the
   WebKit `linear()` HW-accel carve-out already in place (CE-1.0).

4. **S-PERF-4 · Facet-lazy loading (BOOK, do not manufacture).** Only if an S
   bundle-budget consumer materializes, re-introduce lazy sub-facets
   (`loadScroll`/`loadSVG`/`loadIngest`/`loadValidate`) behind the
   `loadAnimationEngine()` monolith (F4). First run a cold-cache transfer/parse
   bench to prove the non-`fromString` chunks are a real cost. Absent evidence,
   keep the single facet.

5. **S-METHOD warning for the sub-zoning waves.** S plans deeper sub-zoning
   (`compile/backward/`, `compile/easing/`, `engine/css/`). The R carves keep
   zero-alloc **because** the hot-path functions are free functions over the
   *concrete* `anim`/`group` reading fields directly (no per-call closure, no
   interface boxing) — see F1/F5. Any S sub-zone that re-homes a hot function MUST
   preserve this DI-by-concrete-argument pattern; do NOT introduce a per-frame
   adapter object or an interface-typed collaborator on the interp/compositor
   path, or the steady-state alloc census regresses. Anchor a `proof:*` clause to
   the free-function shape if `engine/css/` splits the apply path.

6. **S-DOC · refresh `src/animation/CLAUDE.md` (folds F6)** inside the sub-zoning
   wave — it is pre-R stale and will be rewritten by the zone split regardless.

**Bottom line for S:** the R structural work is perf-clean and should stand; S's
perf budget is best spent *extending* the SoA/Typed-OM/WAAPI frontier (waves 1-3),
not undoing any R carve. The only genuine per-frame residue (F3) is a small,
well-scoped, pre-R allocation with a one-line-per-plan fix.
