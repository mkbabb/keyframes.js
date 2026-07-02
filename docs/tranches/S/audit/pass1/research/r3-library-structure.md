# Lane r3 — Library Deep Audit (content + layout)

**Scope:** `src/animation/` post-Tranche-R (v5.1.0), on branch `tranche-s-dev`.
**Method:** full-tree inventory (98 `.ts` files, ~18,985 LOC), barrel-vs-consumer
diff, cross-zone import graph, dead-export scan (268 value exports, node AST-lite),
legacy/deprecated/suppression sweep. All citations `file:line`.

---

## Executive summary

The R 7-zone partition is **structurally sound and internally cohesive** — the
dead-export scan flags exactly **one** dead symbol across 268 value exports, there
are **zero** `@ts-ignore`/`@ts-expect-error`/`eslint-disable` suppressions, **zero**
typed `: any` annotations, and only one residual `as any` (in a *comment*
describing casts that were *removed*). The codebase is clean at the leaf level.

The refinement opportunity is **at the zone boundary and the file layout**, and the
owner's two seeds are both validated by the evidence:

1. **compile/** already carries the sub-zone shapes as filename prefixes:
   `backward.ts` + `backward-color.ts` + `backward-walk.ts` (894 LOC, the entire
   BACKWARD leg) want `compile/backward/`; `easing-option.ts` + `easing-registry.ts`
   want `compile/easing/`. The prefixes are directories spelled with hyphens.
2. **engine/** has the same tell: `css-animation.ts` + `css-metadata.ts` want
   `engine/css/`.

Beyond the seeds, five items rise: a **213-LOC orphan** (`animate.ts`, on no public
surface, kept alive only by its own two tests — the sharpest "NO-legacy" target); a
**latent boundary fragility** in `constants.ts` (heavy runtime + light types in one
file, boundary held only by `import type` discipline); **two barrels that carry
implementation** instead of being pure re-export surfaces (`timeline/index.ts`,
`resolve/index.ts`), breaking the convention every other zone obeys; **three
cross-zone basename collisions** (`options.ts`, `playback.ts`, `scheduler.ts`); and
**stale documentation** — `src/animation/CLAUDE.md`'s file tree is still the entire
*pre-R flat layout*, and the `waapi/` zone is absent from every zone enumeration
(root CLAUDE.md, `src/animation/CLAUDE.md`, and this lane's own prompt).

Severity legend: **HIGH** = ship-worthy refactor / real debt · **MEDIUM** = cohesion
win worth a wave · **LOW** = polish · **INFO** = recorded, no action urged.

---

## Findings

### 1. [HIGH] `animate.ts` is a 213-LOC orphan — on no public surface, kept alive only by its own tests

`src/animation/animate.ts` (213 LOC) was excised from the published surface at R.W4
(§2.5). The excision was **half-done**: the file and its tests survive, but it is
reachable from **nothing**:

- Not a runtime export of the package barrel — `index.ts:154-158` documents the
  excision, exports nothing from `./animate`.
- Not a dynamic import of the loader — `grep import\( load-engine.ts` returns
  engine/group/svg/ingest/scroll/compile/validate/presets/format/parse-flatten/
  scheduler; **no `./animate`**.
- Explicitly excluded from the `/engine` subpath mirror — `engine/public.ts:13`:
  *"(minus `animate`, which R.W4 excised from the published surface)."*
- Zero `src/` importers (`grep` for `./animate` across `src/animation`: none).

Its **only** consumers are its own two tests, which reach in by deep path:
`test/animate.test.ts`, `test/animate-orchestration.test.ts`. This is dead product
code held up by a test scaffold — precisely the "NO legacy/deprecated code anywhere"
target. It also makes the stale `src/animation/CLAUDE.md` claim ("`animate.ts` …
rides `loadAnimationEngine()`") a lie.

**Proposal:** decide the fate explicitly. Either (a) **delete** `animate.ts` +
both test files (the four-step lifecycle + `/engine` subpath are the documented
"in"); or (b) if the single-call DX front door is wanted for S's "SOTA uplift",
**restore it as a first-class primitive** — re-home to a surface (LIGHT-dispatch
wrapper over the heavy factories, or an explicit `/animate` subpath) and re-publish.
The current in-between is the worst of both.

---

### 2. [MEDIUM] compile/ — the `backward-*` and `easing-*` prefixes are directories spelled with hyphens (owner seed, validated)

`compile/` holds 10 files; the filename prefixes already encode the sub-zones:

| current file | LOC | role |
|---|---|---|
| `backward.ts` | 429 | `compileToCSS` — the BACKWARD leg anchor |
| `backward-color.ts` | 325 | oklab densify (color leg of the compile) |
| `backward-walk.ts` | 140 | the compile-input walkers |
| `easing-option.ts` | 56 | heavy easing-input resolver |
| `easing-registry.ts` | 122 | `getTimingFunction` synchronous resolver |

The three `backward-*` files (**894 LOC**) are the complete reverse pipeline; the two
`easing-*` files are the compile-side timing-function resolution. Evidence they are
already treated as clusters: `compile/index.ts:125-134` groups them under a
`// Backward pipeline` banner; the file headers cross-cite each other
(`backward-walk.ts:2` "carved off `backward.ts`", `backward-color.ts:2` "Split out of
`compile.ts`").

**Proposal:** `compile/backward/{compile.ts,color.ts,walk.ts,index.ts}` and
`compile/easing/{option.ts,registry.ts,index.ts}`. Leaves the forward pipeline
(`frame-compiler.ts`, `parse-flatten.ts`, `numeric-plan.ts`, `selector.ts`,
`format.ts`) at `compile/` root — itself a candidate `compile/forward/` if the
symmetry is wanted, but the forward files are less prefix-clustered so that half is
weaker. The `compile/index.ts` surface stays byte-identical (re-export through the
new sub-barrels).

---

### 3. [MEDIUM] engine/ — `css-animation.ts` + `css-metadata.ts` want `engine/css/` (owner seed, validated)

`engine/` holds 12 files. The `css-*` prefix marks the CSS-parsing subclass and its
metadata-recovery helper:

- `css-animation.ts` (277 LOC) — `CSSKeyframesAnimation`, the CSS-parsing subclass
  (`engine/css-animation.ts:2`).
- `css-metadata.ts` (169 LOC) — CSS-rule metadata recovery called by
  `CSSKeyframesAnimation.fromString` (`engine/css-metadata.ts:2`).

A second, weaker cluster: `options.ts` (193, the normalizers) + `option-setters.ts`
(159, the apply surface) — `option-setters.ts:2` says it "Sits beside `./options`",
i.e. the author already reads them as a pair → `engine/options/`.

**Proposal:** `engine/css/{animation.ts,metadata.ts,index.ts}` (the seed). Optionally
`engine/options/{normalize.ts,setters.ts,index.ts}`. The base `KeyframesAnimation`
(`animation.ts`, 499), `playback.ts` (498), `interpolate.ts` (307), `composition.ts`,
`compile-bridge.ts`, `element-resolve.ts` stay at `engine/` root as the god-class
carve-outs. `engine/index.ts` surface unchanged.

---

### 4. [MEDIUM] `constants.ts` is a boundary hazard — heavy runtime + light types in one file, held apart only by `import type` discipline

`constants.ts` carries a **runtime** value.js edge — `COLOR_SPACE_RANGES`,
`easeInOutCubic`, `timingFunctions` are value imports, not types
(`constants.ts:1-4`). Yet it is imported by **~55 modules including every LIGHT
module** (`easing.ts`, `physics/numeric.ts`, `physics/morph.ts`,
`orchestration/{stagger,flip,timeline}`, `physics/spring/timing-function.ts`).

The LIGHT boundary survives **only because** each light consumer spells the import
`import type { Easing, TimingFunction }` (verified: `easing.ts:19`,
`physics/numeric.ts:6`, `orchestration/stagger.ts:25`, `orchestration/flip.ts:24`,
`physics/morph.ts:2`, `orchestration/timeline/index.ts:6`,
`physics/spring/timing-function.ts:1` — all `import type`). One accidental **value**
import of `easeInOutCubic`/`timingFunctions` from `constants` in a light module
would silently pull value.js onto the light path. `proof:boundary` would catch it in
CI, but the file structure *invites* the mistake rather than preventing it.

**Proposal:** split `constants.ts` into `constants/types.ts` (pure, value.js-free —
`Easing`, `TimingFunction`, `Vars`, `AnimationOptions`, the erasable type surface)
and `constants/defaults.ts` (the value.js-bearing `defaultOptions`/`DIRECTIONS`/
`FILL_MODES`/`easeInOutCubic` runtime). Light modules import from `constants/types`
and the boundary becomes **structural** (a light module cannot even name the heavy
runtime file) rather than a lint-enforced convention. This is the single highest-
leverage boundary hardening in the tree.

---

### 5. [MEDIUM] Two zone barrels carry implementation, violating the "barrel = single re-export surface" convention

Every zone barrel is documented as "the zone's single surface" and most are pure
re-export (`physics/`, `engine/`, `compile/`, `group/`, `svg/`, `presets/`,
`ingest/`, `scroll/`, `waapi/`). Two are not:

- `orchestration/timeline/index.ts` (**215 LOC**) — defines the entire `Timeline`
  abstract class, `KeyframesScrollTimeline`, `ManualTimeline`, `TimelineOptions`
  *in the barrel* (`orchestration/timeline/index.ts:663-837`). `native.ts` is the
  only file split out.
- `resolve/index.ts` (**289 LOC**) — defines the core recursion `resolveNode`/
  `resolveValues`/`hasResolvableValue`/`hasPhase2Node` + the `spring()` helpers
  *in the barrel* (`resolve/index.ts:285-430`), re-exporting `env`/`resolve-if`/
  `resolve-function`.

(A third, milder: `group/index.ts:97` runs a `registerGroupFactory(...)`
**side-effect** at import — defensible as the zone's DI composition point, but it is
not a pure surface either.)

The inconsistency costs a reader: to find the `Timeline` class you open `index.ts`,
but to find `SpringProgress` you open `progress.ts`. The convention should be uniform.

**Proposal:** move the `Timeline` family to `orchestration/timeline/timeline.ts`
and the resolve core to `resolve/core.ts` (or `resolve/resolve.ts`), leaving both
`index.ts` as pure re-export barrels matching every sibling zone.

---

### 6. [LOW] Dead export: `declaredKeyframeBodyFor` (compile/format.ts:223)

`export function declaredKeyframeBodyFor` (`compile/format.ts:223`) has **zero**
consumers across `src`, `test`, `demo`, `scripts` (verified by whole-tree grep). It
is a one-line pass-through to the internal `declaredKeyframeBody` and is not on the
`compile/` barrel. It is the *only* dead value export in the tree (1 of 268).

**Proposal:** delete it (its body `return declaredKeyframeBody(...)` — inline the one
caller if one ever appears).

---

### 7. [LOW] Three cross-zone basename collisions muddy navigation

`find … | basename | sort | uniq -d` → **`options.ts`**, **`playback.ts`**,
**`scheduler.ts`** each appear in two zones with unrelated meanings:

| basename | zone A | zone B |
|---|---|---|
| `options.ts` | `engine/options.ts` (option normalizers) | `waapi/options.ts` (`toWAAPIOptions`) |
| `playback.ts` | `physics/playback.ts` (`RAFPlayback` driver) | `engine/playback.ts` (`PlaybackState` machine) |
| `scheduler.ts` | `internal/scheduler.ts` (`yieldToMain`) | `group/scheduler.ts` (batched advance) |

`group/scheduler.ts` even **imports** `internal/scheduler.ts` — two files named
`scheduler` one edge apart. Editor tabs and stack traces read ambiguously.

**Proposal (cheap):** rename the less-canonical member of each pair, e.g.
`engine/playback.ts` → `engine/playback-state.ts`, `group/scheduler.ts` →
`group/yield-batch.ts`, `waapi/options.ts` → `waapi/waapi-options.ts`. Low urgency,
pure ergonomics.

---

### 8. [MEDIUM] Documentation drift — `src/animation/CLAUDE.md` is entirely pre-R, and `waapi/` is an undocumented zone

- `src/animation/CLAUDE.md`'s **entire "## Files" tree** describes the *flat* pre-R
  layout: `engine.ts`, `group.ts`, `waapi.ts`, `frame-compiler.ts`, `numeric.ts`,
  `smooth.ts`, `spring.ts`, `springLinearStops.ts`, `morph.ts`, `flip.ts`,
  `drag.ts`, `animate.ts`, `animations.ts`, `utils.ts`, `format.ts` — **17
  filenames at `animation/` root that no longer exist** (they are now in
  `physics/`, `engine/`, `group/`, `compile/`, `svg/`, `presets/`, etc.).
  `utils.ts` is referenced but **deleted** (its content moved to `compile/`).
- The root `CLAUDE.md` project tree lists the zones as physics/orchestration/engine/
  group/compile/resolve/ingest/scroll + presets/svg — and mentions WAAPI only as
  "`waapi.ts`" in the architecture notes. But `waapi/` is a full **6-file HEAVY
  zone** (`eligibility.ts`, `emission.ts`, `options.ts`, `delegation.ts`,
  `densify.ts`, `index.ts`) with its own barrel. It is missing from **every** zone
  enumeration, including this lane's own prompt (which lists 11 zones, not 12).

**Proposal:** rewrite `src/animation/CLAUDE.md`'s file tree to the 12-zone R layout;
add `waapi/` to the root CLAUDE.md project tree and zone list. This is a documentation
wave, but it is load-bearing — the stale doc actively misdescribes the boundary.

---

### 9. [LOW] Era-comment provenance density — 493 tranche-ref mentions across `src/animation`

`grep -oE '\b[A-Z]\.W[A-Z]?[0-9]+'` → **493** tranche-marker mentions (R.W2 ×93,
R.W1 ×37, K.W11 ×34, K.W7 ×29, …). Heaviest: `group/group.ts` (31), `engine/
animation.ts` (31), `adapter.ts` (27), `index.ts` (21). These are **not stale** —
they parse to real tranche records — but they are a signal-to-noise cost: a reader
new to the file wades through "R.W2c — a zone barrel re-exports ONLY its own zone"
provenance to reach the behavior. They are archaeology embedded in the hot text.

**Proposal (judgement call for S):** this is *not* a defect and mass-stripping would
erase real design rationale. But S could adopt a policy: provenance markers move to a
per-file `// history:` footer or the tranche docs, and inline comments state the
*invariant* (why the code is shaped this way) without the *when* (which tranche did
it). Low priority; flagged because the mission asks about "stale era-comments."

---

### 10. [LOW] `physics/spring/` is the deepest sub-zone — mild over-decomposition, likely ceremony to change

`physics/spring/` holds **9 impl files + index** (`progress`, `duration`, `reseat`,
`linear-stops`, `timing-function`, `types`, `solver`, `sample`, `vector`). The
three smallest — `solver.ts` (77), `vector.ts` (154), `sample.ts` (66) — have a
**single intra-zone consumer each**: `solver`+`vector` only by `progress.ts`,
`sample` only by `timing-function.ts`+`linear-stops.ts`. In isolation that reads as
over-decomposition.

**Verdict:** the split is **deliberate ring-breaking** — `physics/spring/index.ts:568`
documents "the progress↔duration↔reseat ring is broken by `types.ts`." Merging
`solver`+`vector` back into `progress.ts` would re-fatten the class the split was
made to thin. **Leave as-is** — changing it is ceremony, not cohesion. Recorded for
completeness.

---

### 11. [LOW] Root loose-file audit — most are correctly placed; `adapter.ts`/`validate.ts` are the only movable ones

Root-level non-barrel files: `adapter.ts`, `animate.ts` (finding 1), `constants.ts`
(finding 4), `easing.ts`, `validate.ts` (+ boundary files `index.ts`,
`load-engine.ts`).

- **`easing.ts`** (97) — the LIGHT boundary factory (`resolveEasing`/`toEasing`).
  Correct at root: it is *the* boundary ergonomics seam, consumed by both light and
  heavy (index, compile, orchestration, physics, engine). **Keep.**
- **`adapter.ts`** (329, `resolveKeyframes`) — HEAVY; consumed by `engine/` (7
  files), `ingest/`, `validate.ts`; re-exported through `engine/index.ts:62`. It is
  the input→`ResolvedKeyframes` front seam. **Candidate** to re-home into `compile/`
  (it is a parse/resolve concern feeding `FrameCompiler.parse`) or `engine/`.
  Defensible at root as the shared front seam; a `compile/adapter.ts` home would
  reduce the root loose-file count. Low.
- **`validate.ts`** (242) — HEAVY; the agent-authoring projection over
  `engine`+`compile`+`waapi`. Root is defensible (it spans three zones and belongs
  to none). Could become its own `authoring/` zone if S grows the validate/explain
  surface. Low.

**Proposal:** move `adapter.ts` → `compile/adapter.ts` (it is the compile pipeline's
front door); leave `easing.ts`/`validate.ts`/boundary files at root.

---

### 12. [INFO] `internal/` grab-bag — heterogeneous but genuinely neutral; no action

`internal/` holds 8 files: `animation-id`, `binarySearch`, `errors`, `group-factory`,
`leaves`, `reduced-motion`, `scheduler`, `scroll-phases`. The barrel documents them
as "value.js-free leaves." Two are not leaves in spirit but are **correctly** here:

- `group-factory.ts` (59) — a DI **seam** (the `registerGroupFactory` registry that
  inverts the engine↔group back-edge), not a leaf. It *must* be neutral (imported by
  both `engine/` and `group/`), so `internal/` is the right neutral home.
- `scroll-phases.ts` (16) — a shared constant (`PHASE_FRACTIONS`), correctly DRY:
  read by **both** `compile/selector.ts:15` and `scroll/range.ts:14` (verified — no
  cross-zone compile↔scroll edge; both depend on the shared internal leaf).

The mix is acceptable — `internal/` is the "neutral shared" zone, and "leaf" is
slightly narrower than its actual (correct) role. No change; note the barrel doc
overclaims "leaves" when `group-factory` is a seam.

---

### 13. [LOW] `engine/animation.ts` holds class `KeyframesAnimation` — file named for the pre-5.0.0 concept

Post-5.0.0 the class is `KeyframesAnimation` (the `Animation` alias was dropped,
`index.ts:236`). The file is `engine/animation.ts`. Minor file-vs-class drift; the
CSS subclass file `css-animation.ts`→`CSSKeyframesAnimation` matches, `group.ts`→
`AnimationGroup` matches. Renaming `animation.ts`→`keyframes-animation.ts` would be
consistent but churns the most-imported engine file. **Low / optional** (fold into
the finding-3 `engine/css/` move if that wave touches the zone anyway).

---

## Tranche-S implications (wave-shaped)

**Wave S-LIB-1 — Boundary hardening (highest leverage, do first).**
Split `constants.ts` → `constants/types.ts` (light) + `constants/defaults.ts` (heavy)
(finding 4). Makes the LIGHT/HEAVY boundary *structural* instead of `import type`-
disciplinary. Small diff, big invariant. Re-run `proof:boundary` unchanged.

**Wave S-LIB-2 — Orphan excision (the NO-legacy charter).**
Resolve `animate.ts` (finding 1): delete file + 2 tests, OR restore as a published
primitive. Delete dead `declaredKeyframeBodyFor` (finding 6). This wave *is* the
"NO legacy/deprecated code anywhere" mandate for the library.

**Wave S-LIB-3 — Sub-zoning (the owner's seeds).**
`compile/backward/` + `compile/easing/` (finding 2); `engine/css/` (+ optional
`engine/options/`) (finding 3). Pure re-export barrels, zone surfaces byte-identical,
`proof:no-flat-siblings`/`proof:decomposition` re-run. Fold the `adapter.ts` →
`compile/adapter.ts` re-home (finding 11) into this wave.

**Wave S-LIB-4 — Barrel-purity + naming.**
Move `Timeline` family out of `timeline/index.ts` → `timeline/timeline.ts`; move
resolve core out of `resolve/index.ts` → `resolve/core.ts` (finding 5) so every
barrel is a pure surface. Rename the three colliding basenames (finding 7). Consider
`engine/animation.ts` → `keyframes-animation.ts` (finding 13) if S-LIB-3 already
touches `engine/`.

**Wave S-LIB-5 — Documentation truth (do at close).**
Rewrite `src/animation/CLAUDE.md`'s file tree to the 12-zone R layout; register the
`waapi/` zone in root `CLAUDE.md` and every zone enumeration (finding 8). Adopt an
era-comment policy (finding 9) — invariant inline, provenance to a footer/tranche
doc — applied opportunistically as S touches each file, not as a mass rewrite.

**Explicitly NOT worth a wave (ceremony, recorded):** re-merging
`physics/spring/{solver,vector,sample}.ts` (finding 10 — the split is deliberate
ring-breaking); mass-stripping the 493 era-comments (finding 9 — erases real
rationale); a generic per-target `ResizeObserver` for `cq*` units (already a
RECORDED non-action in `src/animation/CLAUDE.md`).

---

### Appendix — health metrics (evidence base)

- 98 `.ts` files, 18,985 LOC; 12 HEAVY/LIGHT zones (incl. undocumented `waapi/`).
- Dead value exports: **1 / 268** (`declaredKeyframeBodyFor`).
- Type suppressions (`@ts-ignore`/`-expect-error`/`-nocheck`/`eslint-disable`): **0**.
- Typed `: any` annotations: **0**. Residual `as any`: **1**, in a *comment*
  (`compile/parse-flatten.ts:127`) describing casts that were *removed*.
- `@deprecated` runtime aliases: **0** live (all Q.WE1-dropped in 5.0.0; the 3
  `@deprecated` mentions are historical doc-comments, `index.ts:62,236`,
  `engine/animation.ts:50`).
- Era-comment mentions: **493** across `src/animation` (R.W2 ×93 heaviest).
- Largest files: `presets/classic.ts` (728), then a tight cluster at ~499
  (`spring/progress`, `sequence/sequence`, `engine/animation`, `frame-compiler`,
  `engine/playback`, `group/group`) — the R carve capped the god-classes at ~500.
