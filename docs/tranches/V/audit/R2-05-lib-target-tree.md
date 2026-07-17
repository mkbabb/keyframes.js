# R2-05 — The Library Target Tree (final adjudication blueprint)

**Lane:** R2-05 · **Prefix:** LT- · **Date:** 2026-07-17 · **Role:** adjudicator for `src/`'s
final shape. Inputs consumed: R1-04 (LC- census), R1-07 (DD- dead/over-export), R1-06 (TC-4
mirror-gate), AUDIT-REGISTRY charter amendments, ORIGINAL-PROMPT edict, glass-ui BI
STRUCTURE-ADDENDA (read-only), and the `src/` source itself (145 `.ts` + 1 stray `.DS_Store`,
line-counted this session).

## Verdict

The library settlement is **narrower and more surgical than the edict's "massive explosion"
framing** — R1-04 was right that all 24 barrels are pure, `compiled-frame.ts` is a real shared
contract (8 importers, verified below), `physics/spring/` is well-shaped, and `internal/` is
mostly legitimate substrate. I **adjudicate the tree to a KISS-forward target: two new
compile sub-modules (`frame/`, `value/`), three zone sub-modules (`emit/backward/`,
`emit/format/`, `group/composite/`, `engine/play-lifecycle/`), six mechanical stutter renames,
one single-file-dir fold, one kebab rename, one presets-shim fold, two dead-export deletes, and
one encapsulation sweep — under a single grammar and one standing gate.** I **reject four
R1-04 proposals** on KISS/fence grounds: (1) renaming `compiled-frame.ts` → `frame.ts` (loses
meaning; "compiled" is not stutter); (2) the god-class helper carves for
`SpringProgress`/`FrameCompiler`/`AnimationGroup`/`Draggable` (cohesive classes under a 500-line
ceiling stay whole); (3) renaming root `easing.ts` → `easing-boundary.ts` (touches the frozen `.`
barrel specifier + the load-bearing depcruise LIGHT allowlist + rule-comments for a P3 nit — a
doc cross-ref is the right dose); (4) renaming `internal/` → `shared/` (the depcruise
value.js-free-leaf law is keyed on `^src/animation/internal/`; the name is accurate; the churn
buys nothing). The **line-ceiling policy is 500 raw lines** (standing gate, allowlist empty
today — max is 484) **plus exactly two one-time cohesion carves** decided here, not eight. The
**one grammar for the whole library is: a pure `index.ts` barrel in every earned dir; the dir's
primary member (if one exists) is named after the dir (eponymous), else kind-named siblings
only** — this keeps the verified "all barrels pure" invariant and matches glass-ui (whose
atom's dir-named `.vue` is the direct analogue of a keyframes eponymous `.ts`).

Every `src/` file appears below either in the move/merge/split/rename table (§A) or the explicit
KEEP-AS-IS accounting (§F) — total coverage, no silent omission.

---

## LT-01 — Line-ceiling policy: 500 raw + two cohesion carves · P1 · family: god-module

**Decision:** the standing structural check enforces a **500 raw-line hard ceiling** with a
justified allowlist (empty today — the max code file is `physics/spring/progress.ts` at 484L).
Separately, exactly **two** files are carved in V for **cohesion** (mixing unrelated concerns),
independent of line count:

| carve | why (verified seams) |
|---|---|
| `engine/play-lifecycle.ts` (482L) → module | **24 exported free functions** (`wc`/grep confirmed) across events/frame/strategies/transport — the textbook "collection that should be a module". LT-07. |
| `compile/value-ast.ts` (400L) → split | mixes AST **types** (`ParsedVarMap`/`CompiledValue`/`AuthoredSink`) + a **parser** (`parseAndFlattenObject`) + a **value compiler** (`compileValuePair`/`interpolate`/`serialize`) + **four sink builders** — ≥3 unrelated concerns, 17 importers wanting a stable barrel. LT-05. |

**Accepted under the ceiling (cohesive class or single pipeline — NOT carved):**
`physics/spring/progress.ts` (484, one `SpringProgress` class), `engine/animation.ts` (478, one
`KeyframesAnimation` class), `orchestration/drag/draggable.ts` (470, one `Draggable` class +
factory), `ingest/cssom.ts` (466, 3 ingest entrypoints sharing one heavy CSSOM-walk private —
splitting duplicates the walk), `compile/frame-compiler.ts` (461, one `FrameCompiler` class —
module-homed by LT-04, class stays whole), `compile/emit/entry.ts` (459, one `compileToEntry`
async pipeline + 50L type block).

**Rationale:** line count is the wrong axis; **cohesion** is the right one. A 484-line single
class is one responsibility (not a god-*module*); shattering it across `*-internals.ts` files
hurts readability and buys nothing measurable. What the owner's "no godmodules" edict actually
targets is *mixing* — caught by the two carves above, decided once. **Rejected alternative:** a
400-code-line ceiling with a 6-entry cohesive-class allowlist (R1-04's implicit lean + LC-03
item 17's helper-carves) — rejected because the allowlist rots, code-line counting is gameable
and fiddly, and continuously gating a taste judgment ("is this class cohesive?") is exactly the
"contrived gate" the edict says to avoid. Owner may veto toward 400/code-lines; the two carves
stand regardless.

---

## LT-02 — TC-4 mirror gate + LC-04 structure gate: decide BEFORE the first move · P1 · family: vacuous-gate / test-harness

Two gate decisions are ordered as **Batch 0, strictly before any move** (per the R2-05 charge
and TC-4).

**(a) `test/support/mirror.test.ts` → PRUNE.** It is a pure directory-topology assertion
(`readdirSync` on `test/` vs `src/animation/`, verified `mirror.test.ts:36-63`) exercising zero
runtime behavior. My restructure keeps every top-level zone (`compile/`, `engine/`, `group/`, …),
so mirror would not in fact red on my moves — but it adds no behavioral coverage, ossifies
directory names, and the owner's edict says to prune superfluous gates. **Rejected alternative:**
rewrite it zone-name-agnostic — rejected because there is no behavior to bear; it is topology
theatre. The mirror convention survives as a one-line docs note.

**(b) LC-04 structure gate → BUILD `proof:structure` born-RED, FIRST.** The library is currently
**unguarded**: `package.json:50-51` defines only `proof:publish` + `proof:owner-golden`; there is
no no-flat-siblings / zone-cohesion / line-ceiling check anywhere (`scripts/gates/` holds only
`surface/` + `visual/`), yet four source comments assert `proof:no-flat-siblings` is live
(`orchestration/index.ts:7`, `orchestration/view-transition/index.ts:12`,
`orchestration/split-text/index.ts:9`, `physics/index.ts:9`) — a phantom-gate lie. Build
`scripts/gates/structure/index.mjs` (`proof:structure`) checking: (1) no hyphen-prefix-stutter
(basename must not start with parent-dir name), (2) no file >500 raw lines outside the allowlist,
(3) no earned-dir with exactly one non-index `.ts`. It is **born-RED** (6 stutter files + the
`internal/transport/` single-file dir exist today), so the backlog IS the charter; it greens
progressively as Batches 1–4 land. Fold the four phantom comments to cite `proof:structure` (or
drop the claim). Single-consumer-fragment detection is left to `depcruise` (the encapsulation
sweep, LT-13), not this gate — KISS.

---

## LT-03 — Prefix-stutter renames (six Class-A) · P2 · family: naming-stutter

Mechanical `git mv` + import repoint; none are export keys (verified: `exports` map is only `.` +
`./engine`, file paths are not keys).

| # | old → new | note |
|---|---|---|
| 1 | `compile/easing/easing-option.ts` → `compile/easing/option.ts` | edict-named |
| 2 | `compile/easing/easing-registry.ts` → `compile/easing/registry.ts` | edict-named |
| 3 | `waapi/waapi-options.ts` → `waapi/options.ts` | |
| 4 | `resolve/resolve-function.ts` → `resolve/function.ts` | |
| 5 | `resolve/resolve-if.ts` → `resolve/conditional.ts` | `if.ts` is awkward; `conditional` clarifies |
| 6 | `engine/css/css-animation.ts` → `engine/css/animation.ts` | no collision (sibling `engine/animation.ts` is a different dir) |

None of these six appear in the depcruise `LIGHT_BARREL_MODULES` allowlist
(`.dependency-cruiser.cjs:54-79` lists only `physics/*`, `orchestration/*`, `easing`) — so the
depcruise config needs **no** rule-path edit for these; only intra-zone relative-import repoints
+ test-import repoints. Land under `proof:structure` so the stutter cannot re-accrete.

---

## LT-04 — `compile/frame/` module: the frame-compilation kernel · P1 · family: flat-sibling / fragment-split

**Consumer graph verified this session** (relative-specifier grep, §evidence below):

- `compiled-frame.ts` (32L, the `CompiledAnimationFrame`/`NumericFoldPlan` types) — **8
  importers, 5 cross-zone**: `waapi/densify.ts:32`, `waapi/eligibility.ts:7`,
  `resolve/element-resolve.ts:35`, `engine/interpolate.ts:24`, `engine/composition.ts:18`,
  `engine/compile-bridge.ts:18`, + `numeric-plan.ts:1`, `frame-compiler.ts:25`. **Confirmed
  shared contract** (charter amendment 1). KEEP its content; do NOT split.
- `interp-slot.ts` (350L) — cross-zone too: `resolve/element-resolve.ts:36`,
  `engine/interpolate.ts:28`, `engine/composition.ts:19`, `engine/compile-bridge.ts:19`, +
  `value-ast.ts:10`, `compiled-frame.ts:5`, `numeric-plan.ts:5`.
- `numeric-plan.ts` (32L, `buildNumericPlan`) — **single importer** `frame-compiler.ts:80`
  (LC-02 confirmed).
- `frame-compiler.ts` (461L, `FrameCompiler` class) — `compile/index.ts:23`,
  `engine/animation.ts:30`, `engine/compiler-state.ts:1`.

**Decision — BUILD `compile/frame/`:**

```
compile/frame/
  compiler.ts        # ← frame-compiler.ts (class stays whole per LT-01)
  compiled-frame.ts  # ← compiled-frame.ts (shared type contract — KEEP name; "compiled" is
                     #   a distinct word, NOT stutter; R1-04's rename to frame.ts is REJECTED)
  interp-slot.ts     # ← compile/interp-slot.ts
  numeric-plan.ts    # ← compile/numeric-plan.ts (LC-02 fold — now a legit MODULE-INTERNAL
                     #   single-consumer, no longer a naked compile-root sibling)
  index.ts           # PURE barrel: re-exports CompiledAnimationFrame, NumericFoldPlan,
                     #   InterpSlot union + bindInterpSlotTarget, FrameCompiler
```

**Where the shared contract lives (the charge's explicit question):** inside `compile/frame/`,
surfaced through the module's pure `index.ts` barrel. The frame module is the *producer* of
compiled frames; consumers importing the frame TYPE from `compile/frame` (the barrel) is
semantically correct and an improvement over today's flat `../compile/compiled-frame` file
coupling. **Cross-zone repoints:** the 5 external file-specifiers above change
`../compile/compiled-frame` → `../compile/frame` and `../compile/interp-slot` → `../compile/frame`
(barrel-mediated, decoupling consumers from internal layout). `numeric-plan.ts` is NOT
barrel-exported (module-internal, single consumer `compiler.ts`) — this satisfies LC-02's fold
without inlining 32 lines into the 461L class. **Rejected:** R1-04's `frame.ts` rename of
`compiled-frame.ts` — under my LC-09 grammar (LT-12) `frame/frame.ts` would falsely imply the
type file is the dir's *primary* member; `compiler.ts` is. Descriptive `compiled-frame.ts` wins.

Delete `cloneInterpSlot` (DD-2, dead) as part of this wave since `interp-slot.ts` moves here
anyway (LT-13).

**Fence note:** `public.ts` (the `./engine` barrel) does NOT import any frame-kernel file —
verified its specifiers are `./compile`, `./compile/emit/*`, `./compile/value-ast`,
`./validate`, `./internal/scheduler` (grep at `public.ts:52-173`). So this wave does not touch
the `./engine` surface.

---

## LT-05 — `compile/value/` split · P1 · family: god-module (cohesion)

`value-ast.ts` (400L, 17 importers) → split by concern, symmetric to `compile/frame/`:

```
compile/value/
  ast.ts       # types: ParsedVarMap / CompiledValue / AuthoredSink (+ CompileValueOptions,
               #   demoted from export per DD-3)
  compile.ts   # parseAndFlattenObject / compileValuePair / interpolateCompiledValue /
               #   serializeCompiledValue / transformTargetsStyle
  sink.ts      # the four buildAuthoredSink-family builders
  index.ts     # PURE barrel re-exporting the public-ish surface (incl. transformTargetsStyle)
```

**FENCE B (LOAD-BEARING):** `public.ts:172` re-exports `transformTargetsStyle` from
`./compile/value-ast` — this path DIES on the split and **MUST repoint to `./compile/value`**.
This is the one `./engine`-barrel touch in the whole blueprint; re-run the engine-mirror
verification (LT-14) on this wave specifically. All other 16 importers repoint
`../compile/value-ast` → `../compile/value`. **Rejected alternative:** accept value-ast.ts under
the ceiling (it's exactly 400 raw) — rejected because line count isn't the trigger; it mixes
≥3 unrelated concerns (LT-01) and its 17 consumers deserve a stable barrel rather than a flat
file that grows.

---

## LT-06 — `emit/backward/` + `emit/format/` modules · P2 · family: flat-sibling / naming-stutter(B)

The `emit/` zone (12 flat files) carries a backward-emit triad and a format pair with intra-zone
prefix-stutter (LC-01 Class-B). Fold into modules under the LT-12 grammar (eponymous primary +
pure barrel + kind-named helpers):

```
emit/backward/
  backward.ts   # ← backward.ts (393L, the primary backward-emit logic — eponymous)
  color.ts      # ← backward-color.ts (385L; drops the "backward-" stutter)
  walk.ts       # ← backward-walk.ts (148L; drops the stutter)
  index.ts      # PURE barrel
emit/format/
  format.ts     # ← format.ts (342L, eponymous primary)
  options.ts    # ← format-options.ts (169L; drops stutter)
  index.ts      # PURE barrel
```

**FENCE B (transparent):** `public.ts:171` imports from `./compile/emit/format` — after the fold
this resolves to `emit/format/index.ts`. **Verify** the new `format/index.ts` barrel re-exports
exactly the symbols `public.ts` pulls (the format-emit surface) so the `./engine` bytes are
unchanged. `DensifyResult` (`backward-color.ts:326`) and `PremultiplyResult` (`format.ts:249`)
over-exports are demoted in the LT-13 sweep, not here. **Rejected:** R1-04's `emit/backward/
index.ts ← backward.ts` (impl-in-index) — rejected because it breaks the verified "all barrels
pure" invariant; the eponymous-file + pure-barrel grammar (LT-12) keeps purity.

---

## LT-07 — `engine/play-lifecycle/` module · P1 · family: god-module (24 free functions)

`play-lifecycle.ts` (482L) → module (stays under `engine/`, so depcruise `ENGINE_PATH` rule is
unaffected):

```
engine/play-lifecycle/
  events.ts      # dispatchAnimationEvent / shouldReverse / reverse
  frame.ts       # advanceTo / playFrame / renderFrame
  strategies.ts  # playRAF / playViaWAAPI / cancelWAAPI / playReducedMotion /
                 #   snapToReducedMotion / play
  transport.ts   # pause / resume / toggle / stop / playing / effectiveT / settle / reset
  index.ts       # PURE barrel — external consumers (engine/animation.ts et al.) import here
```

**DD-3 interaction (note for LT-13):** `renderFrame`, `cancelWAAPI`, `snapToReducedMotion` are
flagged as over-exports today because they are used only within `play-lifecycle.ts`. After this
carve they become **module-internal cross-file** imports (e.g. `strategies.ts` → `frame.ts`), so
they **keep** the `export` keyword but are **excluded from `index.ts`** — encapsulation moves to
the barrel, not the file. The LT-13 sweep must therefore run AFTER this carve and re-classify
"file-local" against the post-carve tree.

---

## LT-08 — `group/composite/` module · P2 · family: flat-sibling

`group/` (14 flat files) has a tight composite triad (verified imports: `composite-state.ts` →
`compositor.ts` + `composite-storage.ts`; `composite-storage.ts` → `compositor.ts` + `group.ts`):

```
group/composite/
  state.ts       # ← composite-state.ts
  storage.ts     # ← composite-storage.ts
  compositor.ts  # ← compositor.ts (the primary; kind-named, no eponymous file — dir name
                 #   "composite" ≠ a single primary member, so kind-named siblings only)
  index.ts       # PURE barrel
```

Repoint `group.ts` + intra-triad specifiers. The remaining 11 group files stay flat (KEEP —
`group.ts`/`entries`/`layer-api`/`lifecycle`/`soa`/`springs`/`types`/`waapi`/`weight`/
`yield-batch`/`index` are a cohesive single-zone set below any flat-zone concern).

---

## LT-09 — `presets/` shim fold · P2 · family: hollow-shim

`presets/` substance is `catalog.ts` (386L) + `classic-data.ts` (458L, flat data table). The
three "kind" files are pure re-export shims and the `index.ts:5-8` doc-comment misdescribes them
as the substance. **Verified the shims have no external consumer** — the only importers of
`./classic`/`./spring`/`./taxonomy` are `presets/index.ts:48/54/61` itself (`physics/index.ts:33`
imports `./spring` = the `physics/spring/` DIR, not `presets/spring.ts`). **Decision — FOLD:**
delete `classic.ts` (36L), `spring.ts` (6L), `taxonomy.ts` (7L); point `presets/index.ts`
directly at `catalog.ts` (+ `classic-data.ts`) by name; correct the stale doc-comment. Zero
external-surface change (named exports unchanged; only the `index → classic → catalog` double hop
collapses). `PresetGroup`/`PresetFactory`/`definePreset` over-exports (`catalog.ts`) demote in
LT-13.

---

## LT-10 — `internal/` folds; KEEP the `internal/` name · P3 · family: earned-dir / grab-bag

R1-04's importer census refutes the "grab-bag" charge — 7 of 9 members have ≥2 cross-zone
consumers (`leaves` 12, `errors` 11, `reduced-motion` 10, `animation-id` 4, `binarySearch` 2,
`scheduler` 2, `scroll-phases` 2). Two mechanical fixes:

| old → new | mechanism | note |
|---|---|---|
| `internal/transport/core.ts` (36L) → `internal/transport-core.ts` | fold-dir | the only single-`.ts` earned-dir in `src/`; 3 importers (`group/lifecycle`, `orchestration/sequence/lifecycle`, `engine/play-lifecycle`) repoint. `HeldPlayState`/`RunFlags` over-exports demote in LT-13. |
| `internal/binarySearch.ts` → `internal/binary-search.ts` | rename | the sole camelCase filename in `src/`; the exported `binarySearch` **symbol** stays camelCase (JS convention) — only the file kebabs. Test `test/internal/binary-search.test.ts` is already kebab; repoint its import. |

**KEEP the `internal/` name — REJECT the `shared/` rename.** Rationale: `.dependency-cruiser.cjs`
keys the value.js-free-leaf law on `^src/animation/internal/` (`:168`) and the LIGHT-import rule
prose references it; renaming forces a load-bearing config edit across 40+ importers for a taste
preference. `internal/` is *accurate* (non-public substrate). Glass-ui's `shared/`/`_shared/`
naming is a component-library convention; keyframes' `internal/` is idiomatic here.
`helpers.ts` → `compile/` (5 of 6 importers in compile) is **OPTIONAL** (1 engine consumer keeps
it borderline) — defer to owner, do not schedule.

---

## LT-11 — `easing.ts` vs `compile/easing/`: KEEP + cross-ref · P3 · family: naming-collision

Root `src/animation/easing.ts` (99L: `toEasing`/`cssTwinFor`/`resolveEasing`, the light/heavy
boundary resolver) and `compile/easing/` (compile-side option parsing) are **genuinely different
concerns** — not a merge. **Decision — KEEP `easing.ts`; add a one-line cross-reference
doc-comment; do NOT rename.** **Rejected alternative:** rename to `easing-boundary.ts` (my own
first lean, and a reading of LC-08) — rejected because the rename touches (1) the **frozen `.`
barrel specifier** `index.ts:151` `export { resolveEasing, toEasing } from "./easing"`, (2) the
**load-bearing depcruise LIGHT_BARREL_MODULES allowlist** entry `"easing"`
(`.dependency-cruiser.cjs:78`) + its rule-comments (`:53`, `:122`), and (3) `_root` tests —
disproportionate blast radius, incl. the published `.` surface, for a P3 navigation nit. A doc
cross-ref resolves the two-"easing"-homes hazard at ~1/10th the risk.

---

## LT-12 — The ONE library grammar (LC-09 eponymous-dir adjudication) · P3 · family: idiom

**Decision — the single grammar for the whole library:**

> **Every earned dir has a pure `index.ts` barrel. If the dir has one clear primary member, that
> member is named after the dir (eponymous: `group/group.ts`, `emit/backward/backward.ts`). If
> there is no single primary, the dir holds kind-named siblings only (`compile/frame/`,
> `compile/value/`, `group/composite/`, `engine/play-lifecycle/`). Barrels never hold
> implementation.**

This **keeps** the six existing eponymous dirs (`group/group.ts`,
`orchestration/sequence/sequence.ts`, `orchestration/timeline/timeline.ts`,
`orchestration/split-text/split-text.ts`, `orchestration/view-transition/view-transition.ts`,
`physics/spring/solver/solver.ts`) **as-is** and applies the same rule to the new modules. It is
**consistent with glass-ui**, not a divergence: glass's atom dir has a dir-named `.vue` SFC +
`index.ts` barrel + kind-named `.ts` helpers (STRUCTURE-ADDENDA §1 `button/`, `metric-badge/{…,
coalesceMetric.ts}`); a pure-TS library's eponymous `.ts` is the direct analogue of that
dir-named SFC. **Rejected alternative:** collapse eponymous impl INTO `index.ts` (glass's "8
barrels → dir index" move) — rejected because glass only did that to *pure barrels*; doing it to
impl files breaks the verified "all 24 barrels pure" invariant, which is a stronger property than
avoiding one layer of nesting. The double-layering is the deliberate cost of pure barrels.

---

## LT-13 — Dead-export deletes + encapsulation sweep sequencing · P2 · family: dead-export

**Deletes (DD-1/DD-2, truly-dead):** `internal/helpers.ts:9` `isObject` (repo-wide refs = the
def line only) and `compile/interp-slot.ts:340` `cloneInterpSlot` (same). Delete `isObject` in
Batch 2; delete `cloneInterpSlot` folded into the frame-module wave (LT-04) since `interp-slot.ts`
relocates there.

**Encapsulation sweep (DD-3 ~32 src + DD-4 11 demo — LAST, Batch 5):** demote each symbol
`export`ed but used only in its own file to file-local. **Must run AFTER all carves (LT-04..08)**
because the carves change what "file-local" means: symbols like `renderFrame`/`cancelWAAPI`/
`snapToReducedMotion` (play-lifecycle), the `InterpSlot` union members (interp-slot), and
`HeldPlayState`/`RunFlags` (transport-core) become **module-internal cross-file** exports —
they keep `export` but stay out of the module barrel. Scope the demotion to symbols still
same-FILE-only post-move. Guard with a `depcruise` `no-unused-exports`-style rule (or extend
`proof:structure`) so the pattern cannot re-accrete. Verify each demotion with `npm run check`.

---

## LT-14 — FENCES (restated per move) · family: surface-freeze

| Fence | Statement | Verification command (run in the audit copy) |
|---|---|---|
| **A · package exports byte-frozen** | `package.json` `exports` is only `.` + `./engine`; **no move touches a key** (file paths are not keys). Confirmed against every row of §A. | `git diff package.json` = empty for the `exports` block |
| **B · `./engine` 44-key mirror** | Only TWO `public.ts` specifiers are touched: `:172` `./compile/value-ast` → `./compile/value` (LT-05, hard), and `:171` `./compile/emit/format` → resolves to `format/index.ts` barrel (LT-06, transparent). Re-verify the runtime key set of `./engine` ⊇ `loadAnimationEngine()`'s `AnimationEngine` roster, unchanged. | `npm run build:lib && node -e "console.log(Object.keys(require('./dist/engine/index.js')).sort().join('\n'))"` — diff pre/post = empty |
| **C · `.` barrel** | One touched specifier: none, because `easing.ts` is KEPT (LT-11). If the owner vetoes and renames it, `index.ts:151` + depcruise `:78` + `_root` tests repoint. | `grep -c 'export' dist/keyframes.d.ts` roster diff = empty |
| **D · TimingFunction frozen (atlas IN-ATLAS-3)** | `TimingFunction` type lives at `constants/types.ts:45` — **NOT moved, NOT renamed** by any row. `constants/` is a KEEP-AS-IS zone. Home/name/signature untouched. | `grep -n 'export type TimingFunction' src/animation/constants/types.ts` unchanged |
| **E · dist d.ts emit unchanged** | Every restructure batch re-emits identical `.d.ts` export rosters. | `npm run build:lib` then `for f in dist/keyframes.d.ts dist/engine/index.d.ts; do grep -oE 'export (declare )?(type \|const \|function \|class \|interface )[A-Za-z0-9_]+' $f \| sort; done` — diff pre/post = empty |

Note: `npm run build:lib` = `vite build` (no `npm install`; safe in the audit copy). Do NOT run
`npm install`/`ci` (prunes the fresh-Glass linkage).

---

## LT-15 — SEQUENCING (dependency-ordered batches, one wave each)

**Batch 0 — gate + prune (BEFORE any move):** BUILD `proof:structure` born-RED (LT-02b); PRUNE
`test/support/mirror.test.ts` (LT-02a); fold the 4 phantom `proof:no-flat-siblings` comments;
delete `src/.DS_Store` + gitignore; record the ceiling policy (LT-01). Acceptance: `proof:structure`
runs and reds on the known stutter/single-dir set; `test:lib` green sans mirror.

**Batch 1 — mechanical renames (no new dirs):** the six LT-03 stutter renames + `binarySearch` →
`binary-search` (LT-10) + `internal/transport/core.ts` → `internal/transport-core.ts` fold
(LT-10). Repoint intra-zone specifiers + test imports. **No depcruise rule-path edit** (none are
LIGHT_BARREL_MODULES entries; zone prefixes unchanged). Acceptance: `proof:structure` stutter +
single-dir rungs green; `check`/`test:lib`/`lint` green.

**Batch 2 — folds/deletes (independent):** presets 3-shim fold + doc-comment fix (LT-09); delete
`isObject` (LT-13). Acceptance: `check`/`test:lib` green; presets named exports unchanged.

**Batch 3 — compile kernels (touches FENCE B):** `compile/frame/` module (LT-04, deletes
`cloneInterpSlot`) + `compile/value/` split (LT-05, repoints `public.ts:172`). Disjoint file sets
— may land together. **Run FENCE B + E verification on this batch.** Acceptance: engine-mirror
key set + dist d.ts rosters unchanged; `check`/`test:lib`/`lint` green.

**Batch 4 — zone sub-modules:** `emit/backward/` + `emit/format/` (LT-06, FENCE B transparent —
verify format barrel) + `engine/play-lifecycle/` (LT-07) + `group/composite/` (LT-08). Disjoint
zones; may land as sub-waves. Acceptance: `proof:structure` flat-zone rungs green;
`check`/`test:lib`/`lint` green.

**Batch 5 — encapsulation sweep (LAST):** DD-3/DD-4 demotions scoped to post-move file-local
symbols (LT-13) + the `no-unused-exports` rule. Acceptance: `check` green after each demotion;
the new rule reds on a re-introduced over-export.

**Cross-cutting:** test/ paths move in lockstep with each batch (import-specifier repoints; test
dir names unchanged, so no top-level mirror concern — and mirror is pruned in Batch 0 regardless).
depcruise **rule paths** need no edits (all zone prefixes `^src/animation/{compile,engine,group,
internal,...}/` are preserved); only rule-**comment** prose referencing `frame-compiler`/`easing`
(`.dependency-cruiser.cjs:122`) should be refreshed for accuracy in Batch 3.

---

## LT-16 — KEEP-AS-IS total-coverage accounting

Every `src/` file not in §A is KEPT. By zone (counts verified from `find`):

- **`compile/` root (post-moves):** `adapter.ts` (381), `selector.ts` (62), `index.ts` KEEP;
  `{compiled-frame, frame-compiler, interp-slot, numeric-plan}` → `frame/` (LT-04);
  `value-ast` → `value/` (LT-05). `compile/easing/{option,registry,index}` KEEP after rename
  (LT-03). `compile/emit/` KEEP: `css-text` (129), `densify` (132), `easing-serialize` (89),
  `entry` (459, cohesive pipeline), `refusal-probes` (57), `view-transition` (387), `index` —
  plus `backward/` + `format/` modules (LT-06).
- **`constants/`** (`defaults`, `types` 259, `index`) — KEEP, earned dir; `types.ts` is the LIGHT
  global type tier (holds frozen `TimingFunction`). **FENCE D.**
- **`engine/`** — KEEP all except `play-lifecycle.ts` → module (LT-07): `animation` (478,
  cohesive class), `compile-bridge`, `compiler-state`, `composition`, `interpolate`,
  `option-setters`, `options`, `playback-state`, `index`; `engine/css/{animation(renamed),
  metadata, index}`.
- **`group/`** — KEEP all except the composite triad → `composite/` (LT-08): `entries`,
  `group` (437, cohesive class), `layer-api`, `lifecycle`, `soa`, `springs`, `types`, `waapi`,
  `weight`, `yield-batch`, `index`.
- **`ingest/`** (`adopt` 349, `cssom` 466 cohesive-3-entrypoint, `index`) — KEEP.
- **`internal/`** — KEEP all; `transport/core` folded + `binarySearch` kebabed (LT-10):
  `animation-id`, `errors`, `helpers`, `leaves`, `reduced-motion`, `scheduler`, `scroll-phases`.
- **`orchestration/`** — KEEP whole (all eponymous dirs stay per LT-12): `flip`, `index`,
  `stagger`, `drag/{drag-2d, draggable 470 cohesive, index}`, `sequence/{events, index, lifecycle,
  sequence, transport}`, `split-text/{index, refuse, segment, split-text}`, `timeline/{index,
  native, timeline}`, `view-transition/{index, view-transition}`.
- **`physics/`** — KEEP whole (already well-shaped, a negative): `decay`, `index`,
  `managed-stepper`, `morph`, `numeric`, `oscillator`, `playback`, `smooth`, and `spring/**` incl.
  `spring/progress.ts` (484, cohesive class, allowlisted) + `spring/css/**` + `spring/solver/**`.
- **`presets/`** — `catalog` + `classic-data` + `index` KEEP; 3 shims DELETED (LT-09).
- **`resolve/`** — KEEP all; `resolve-function`/`resolve-if` renamed (LT-03): `browser`, `core`,
  `element-resolve`, `env`, `spring-css`, `index`.
- **`scroll/`** — KEEP whole: `dispatch`, `drive`, `grammar` (own product grammar, NOT
  Value-4 residue — R1-07 negative), `range`, `scene`, `trigger`, `index`.
- **`svg/`** — KEEP whole: `draw-svg`, `handle`, `morph-geometry`, `morph-svg`, `motion-path`,
  `index`.
- **`waapi/`** — KEEP all; `waapi-options` renamed (LT-03): `delegation`, `densify`, `eligibility`,
  `emission`, `index`.
- **root files** — `easing.ts` KEEP + cross-ref (LT-11), `index.ts` KEEP (`.` barrel),
  `load-engine.ts` KEEP, `public.ts` KEEP (repoint `:172` only, FENCE B), `validate.ts` KEEP.

---

## §A — The complete move/merge/split/rename table

| # | old path | → new path | mechanism | rationale | finding |
|---|---|---|---|---|---|
| A1 | `test/support/mirror.test.ts` | DELETE | prune | topology gate, zero behavioral coverage, ossifies dirs | TC-4/LT-02a |
| A2 | *(new)* `scripts/gates/structure/index.mjs` | CREATE born-RED | build | the only standing structural guard; today unguarded | LC-04/LT-02b |
| A3 | `src/.DS_Store` | DELETE + gitignore | delete | stray artifact in tracked tree | hygiene |
| A4 | `compile/easing/easing-option.ts` | `compile/easing/option.ts` | rename | drop dir-stutter (edict-named) | LC-01/LT-03 |
| A5 | `compile/easing/easing-registry.ts` | `compile/easing/registry.ts` | rename | drop dir-stutter (edict-named) | LC-01/LT-03 |
| A6 | `waapi/waapi-options.ts` | `waapi/options.ts` | rename | drop dir-stutter | LC-01/LT-03 |
| A7 | `resolve/resolve-function.ts` | `resolve/function.ts` | rename | drop dir-stutter | LC-01/LT-03 |
| A8 | `resolve/resolve-if.ts` | `resolve/conditional.ts` | rename | drop dir-stutter + clarity | LC-01/LT-03 |
| A9 | `engine/css/css-animation.ts` | `engine/css/animation.ts` | rename | drop dir-stutter (no collision) | LC-01/LT-03 |
| A10 | `internal/binarySearch.ts` | `internal/binary-search.ts` | rename | kebab-case (sole camelCase file) | LC-07/LT-10 |
| A11 | `internal/transport/core.ts` | `internal/transport-core.ts` | fold-dir | single-`.ts` earned-dir | LC-07/LT-10 |
| A12 | `presets/classic.ts` | DELETE | fold | hollow re-export shim over catalog.ts | LC-05/LT-09 |
| A13 | `presets/spring.ts` | DELETE | fold | hollow re-export shim | LC-05/LT-09 |
| A14 | `presets/taxonomy.ts` | DELETE | fold | hollow re-export shim | LC-05/LT-09 |
| A15 | `internal/helpers.ts:9 isObject` | DELETE decl | delete | truly-dead export | DD-1/LT-13 |
| A16 | `compile/interp-slot.ts:340 cloneInterpSlot` | DELETE decl | delete | truly-dead export | DD-2/LT-13 |
| A17 | `compile/frame-compiler.ts` | `compile/frame/compiler.ts` | carve-into-module | frame kernel is a module; class stays whole | LC-06/LT-04 |
| A18 | `compile/compiled-frame.ts` | `compile/frame/compiled-frame.ts` | move (KEEP name+content) | shared 8-consumer contract into its producer module | LC-02/LT-04 |
| A19 | `compile/interp-slot.ts` | `compile/frame/interp-slot.ts` | move | frame-kernel member | LC-06/LT-04 |
| A20 | `compile/numeric-plan.ts` | `compile/frame/numeric-plan.ts` | fold-into-module | LC-02 single-consumer → module-internal | LC-02/LT-04 |
| A21 | `compile/value-ast.ts` | `compile/value/{ast,compile,sink,index}.ts` | split | ≥3 unrelated concerns; 17 consumers want a barrel | LC-03/LT-05 |
| A22 | `compile/emit/backward.ts` | `compile/emit/backward/backward.ts` | carve-into-module | backward triad (926L cluster) | LC-06/LT-06 |
| A23 | `compile/emit/backward-color.ts` | `compile/emit/backward/color.ts` | move | drops "backward-" stutter | LC-01B/LT-06 |
| A24 | `compile/emit/backward-walk.ts` | `compile/emit/backward/walk.ts` | move | drops stutter | LC-01B/LT-06 |
| A25 | `compile/emit/format.ts` | `compile/emit/format/format.ts` | carve-into-module | format pair | LC-06/LT-06 |
| A26 | `compile/emit/format-options.ts` | `compile/emit/format/options.ts` | move | drops "format-" stutter | LC-01B/LT-06 |
| A27 | `engine/play-lifecycle.ts` | `engine/play-lifecycle/{events,frame,strategies,transport,index}.ts` | carve-into-module | 24 free functions | LC-03/LT-07 |
| A28 | `group/composite-state.ts` | `group/composite/state.ts` | merge-into-module | tight composite triad | LC-06/LT-08 |
| A29 | `group/composite-storage.ts` | `group/composite/storage.ts` | merge-into-module | composite triad | LC-06/LT-08 |
| A30 | `group/compositor.ts` | `group/composite/compositor.ts` | merge-into-module | composite triad primary | LC-06/LT-08 |
| A31 | `public.ts:172` specifier | `./compile/value-ast` → `./compile/value` | repoint | FENCE B — engine barrel follows the split | LT-05/LT-14 |
| A32 | `presets/index.ts` | repoint → `catalog.ts`/`classic-data.ts` + doc fix | edit | collapse the `index→classic→catalog` hop | LC-05/LT-09 |
| A33 | DD-3 (~32 src) + DD-4 (11 demo) over-exports | demote to file-local (post-move scope) | fold | encapsulation sweep, LAST batch | DD-3/DD-4/LT-13 |
| A34 | `easing.ts` | KEEP + cross-ref doc-comment | keep | REJECT rename (fence/depcruise churn) | LC-08/LT-11 |
| A35 | 6 eponymous `dir/dir.ts` + all 24 barrels | KEEP | keep | the chosen ONE grammar (pure barrel + eponymous primary) | LC-09/LT-12 |
| A36 | 4 phantom `proof:no-flat-siblings` comments | fold → cite `proof:structure` | edit | phantom-gate lie | LC-04/LT-02 |

**Explicitly rejected R1-04 rows:** `compiled-frame.ts`→`frame.ts` rename (A18 keeps the name);
god-class helper carves for `SpringProgress`/`FrameCompiler`/`AnimationGroup`/`Draggable`
(LT-01 accepts them whole); `easing.ts`→`easing-boundary.ts` (LT-11 keeps); `internal/`→`shared/`
(LT-10 keeps); `helpers.ts`→`compile/` (LT-10 optional/deferred, not scheduled).

---

## Negatives (checked, carried forward)

- **All 24 barrels pure** (R1-04) — my grammar (LT-12) preserves this as an invariant; every new
  module barrel is pure by construction. No impl-in-index anywhere.
- **`compiled-frame.ts` is a real contract** — re-verified 8 importers this session; kept, moved
  intact, NOT renamed.
- **`physics/spring/` well-shaped** — KEEP whole; not a flat-zone violation.
- **`constants/types.ts`** — the frozen `TimingFunction` home; NOT moved (FENCE D).
- **depcruise rule PATHS need no edit** — every zone prefix regex (`^src/animation/{engine,
  internal,compile,...}/`) is preserved by keeping top-level zones; only the `easing` LIGHT entry
  would move (avoided by KEEPing easing.ts) and one rule-comment refreshes for accuracy.
- **`scroll/grammar.ts`** is the library's own product grammar (R1-07 negative), not Value-4
  residue — KEEP.

## Coverage gaps

- **God-class internal method partitions** (the accepted-under-ceiling classes) are named by
  export/section reading, not a full call-graph — no carve is scheduled, so this is moot unless
  the owner vetoes toward a 400 ceiling, at which point per-class method partitions need design.
- **Exact cut-sets for the value-ast split** (A21) and the play-lifecycle module (A27) are
  cohesion-motivated from grep of intra-file references; a codemod should re-derive exact
  symbol→file assignment (e.g. shared private helpers between `compile.ts` and `sink.ts`).
- **Did not run the FENCE B/E build verification** this lane (adjudication only) — the commands
  are named for the wave to execute in the audit copy; a restructure wave MUST run them, not
  assume them.
- **DD-3 post-move re-classification** — the 32-symbol list was computed on the flat tree; the
  exact "still file-local after Batches 3–4" subset must be recomputed on the post-move tree
  before the LT-13 sweep demotes (some become legitimate module-internal exports).
</content>
</invoke>
