# Lane a04 — R.W2 Group Carve (SPEC vs SHIPPED vs GESTALT)

**Auditor lane:** a04-w2-group-carve
**Scope:** `src/animation/group/` — the `group.ts` 924→496L carve, the `soa.ts` /
`compositor.ts` SoA-compositor boundary, `layer-springs.ts` junk-drawer split,
zero-alloc discipline, gate-follows-code honesty.
**Method:** read the R.W2 spec (`docs/tranches/R/waves/R.W2.md`), the shipped
files, the retargeted gates (`scripts/proof-{blend,spring-blend-weight,soa-composite}.mjs`),
git history (`81a5114` = the group carve commit), `tsc --noEmit -p tsconfig.lib.json`
(clean), and `vitest run` of `group/zero-alloc/blend` (45 passed).

---

## Executive summary

**R.W2's group carve is the strongest wave in the tranche I have audited — it OVER-delivered
against its own spec and did so honestly.** The spec estimated `group.ts` landing at ~750L with a
4-file result (`group.ts`, `soa.ts`, `entries.ts`, `scheduler.ts`, `springs.ts`). The SHIPPED result
is `group.ts` at **496L (under the hard 500 ceiling)** decomposed into **eight** cohesive files —
the spec's set plus two the spec never named: `compositor.ts` (the single-target composite engine)
and `layer-api.ts` (the layer/transition API). Every scaffold excision the spec promised is real and
grep-verified (`forcePause`/`forcePlay`, `onStart`/`onEnd`, `soaBlendLayer` are gone; the demo
migrated to `render()`; the silent `|| performance.now()` fabrications are excised). The gate
retargeting is genuine "gate follows code," not cosmetic: `proof:blend` now reads `compositor.ts`
(`proof-blend.mjs:78`), `proof:spring-blend-weight` reads `group.ts`+`springs.ts`+`compositor.ts`+`layer-api.ts`,
and `proof:soa-composite` replaced its excised-wrapper monkey-patch with a **more robust** buffer-effect
probe (`proof-soa-composite.mjs:472-486`). The SoA compositor boundary is clean and the zero-alloc
discipline holds **on the all-numeric majority path**.

The residue is not structural rot — it is **documentation drift and a partial encapsulation**:

1. `soa.ts`'s own header (`:21`, `:113`) still describes a `AnimationGroup.soaBlendLayer` "thin
   delegating wrapper" that R.W2 **excised** — the module doc contradicts the code it documents and
   the gate that verifies it (`proof-soa-composite.mjs:467` says it was excised).
2. `group/index.ts:3-7` barrel doc still describes the pre-carve `layer-springs.ts` shape.
3. `transformFramesGrouped`'s "private" demotion protects only the published `.d.ts`; the entire
   test/bench corpus (~15 files, 40+ call sites) + a proof gate reach through it via untyped runtime
   access, because `test/` is in **no** tsconfig include.
4. A per-frame `new Set(only)` allocation in the boxed residual path (`compositor.ts:182`) — inherited
   verbatim from P.W2, a real zero-alloc gap on the mixed-leaf tail.
5. `group.ts` is both the `AnimationGroup` class **and** the type-definition hub — all six siblings
   `import type` from `./group`, a structural coupling (no runtime cycle) a `group/types.ts` leaf
   would dissolve.

None of these is a correctness defect. This wave passes the honesty test cleanly; the findings are
Tranche-S sub-zoning and hygiene work, not a re-do.

---

## Findings

### 1. [POSITIVE / INFO] The carve exceeded its spec and stayed honest

**Evidence.** Spec (`R.W2.md:230-247`) projected `group.ts ~750L` and a 4-way split. Shipped:
`group.ts` = **496L** (`wc -l`), decomposed into `soa.ts` (254), `compositor.ts` (241), `entries.ts`
(127), `springs.ts` (92), `layer-api.ts` (91), `scheduler.ts` (52), `index.ts` (33). The spec named
neither `compositor.ts` nor `layer-api.ts` — the IMPL recognised that `transformFramesGrouped`+`boxedBlendArm`
(the "146L+70L carve" the spec §4 flagged) belonged in their own composite-engine file, and that the
layer/transition API was a distinct concern from the spring physics. This is the "gate verifies
post-carve, prose does not pre-assume" discipline (`R.W2.md:4`) working as designed: the estimate was
a target, the result beat it.

`group.ts` is now a clean **state + lifecycle owner** — fields, entry cache, play/pause/resume/stop/
settle/reset/toggle, `render`, `advanceTo`, the `_frame`/`_renderFrame` draw loop — delegating all
computation (`compositor.compositeFrame`, `layerApi.*`, `springs.advanceLayerSprings`,
`scheduler.advance*`, `entries.*`). Verified `check:lib` clean and 45 group/blend/zero-alloc tests green.

**Disposition:** no action; this is the model the other waves should be judged against.

---

### 2. [MEDIUM] `soa.ts` header documents an excised `soaBlendLayer` wrapper — self-contradictory

**Evidence.**
- `src/animation/group/soa.ts:20-23`: *"`groupSoABlendLayer` — the per-frame fold for ONE layer …
  the `AnimationGroup.soaBlendLayer` instance method stays a thin delegating wrapper, so
  `proof:soa-composite`'s `soa-path-taken` monkey-patch on the instance still bites."*
- `src/animation/group/soa.ts:112-114`: *"the `AnimationGroup.soaBlendLayer` method stays a thin
  wrapper that forwards `this._compositeBuf!`."*
- But R.W2 **excised** `soaBlendLayer` (spec `R.W2.md:194-208`; `group.ts:441` comment confirms the
  sibling excisions; `grep soaBlendLayer src/animation/group/group.ts` → **none**). The fold is now
  called DIRECTLY at the blend site (`compositor.ts:114`).
- The gate that this doc claims relies on the wrapper explicitly records its removal:
  `scripts/proof-soa-composite.mjs:467` — *"the `soaBlendLayer` private wrapper was EXCISED (the
  bench-monkey-patch anti-pattern)"* — and now probes the buffer effect, not a wrapper call.

The module's own header describes a mechanism that the same wave deleted. A reader trusting `soa.ts:22`
would expect a `group.soaBlendLayer` method and a monkey-patch gate that no longer exist.

**Severity rationale:** MEDIUM — no runtime effect, but it is actively misleading doc on the flagship
perf module, and it survived a wave whose whole thesis is "honest, not cosmetic." Comment rot on the
SoA seam is exactly the kind of drift the tranche method claims to prevent.

**Proposal (S):** rewrite `soa.ts:20-23` and `:112-114` to state the current contract — the fold is
invoked directly from `compositor.ts:114`; `proof:soa-composite` verifies it via the buffer-effect
probe (`proof-soa-composite.mjs:472-486`), not a wrapper monkey-patch. Also scrub the residual prose
in `proof-soa-composite.mjs:534,539` ("soaBlendLayer ran Nx") which describes the old mechanism.

---

### 3. [LOW-MED] `group/index.ts` barrel doc describes the pre-carve `layer-springs.ts` shape

**Evidence.** `src/animation/group/index.ts:2-7`: *"The `group.ts` class … over `soa.ts` (the
zero-alloc SoA blend fold) and `layer-springs.ts` (the spring-weight helpers)."* There is no
`layer-springs.ts` — R.W2 split it into `springs.ts` / `entries.ts` / `scheduler.ts` and added
`compositor.ts` / `layer-api.ts` (`ls src/animation/group/`). The barrel doc still narrates the R.W1
intermediate state ("the … carve … is R.W2") as if unshipped.

**Severity:** LOW-MED — the barrel is the zone's single documented surface; its map of the zone is wrong.

**Proposal (S):** update the `index.ts` header to enumerate the shipped eight-file zone.

---

### 4. [MEDIUM] `transformFramesGrouped` "private" is a `.d.ts`-only fence; the test/bench corpus reaches through it

**Evidence.** Spec §2B demoted `transformFramesGrouped` to `private` and migrated the demo to
`render()`. The demo migration is REAL (`scenePlaybackAdapters.ts:129-131` → `group.render(now)`).
But the method is now the de-facto internal composite-assertion entry point for the **entire** test
surface, reached through untyped runtime access:
- `group.ts:206` declares `private transformFramesGrouped(t)`.
- ~40 call sites across ~15 files still call it directly: `test/group.test.ts:100,122,137,152,405`,
  `test/blend.test.ts:51,70,87,111,138`, `test/zero-alloc.test.ts:55-57,65-66,84,102-103,117,120`,
  `test/spring-blend-weight.test.ts:117,153,187-191`, `test/interp-fastprops.test.ts:113`,
  `test/performance.test.ts:99,139`, `bench/*.bench.ts`, and the gate harness
  `proof-soa-composite.mjs:481,499`.
- `test/useAnimationGroupPlayback.test.ts:48,82` **`vi.spyOn(group, "transformFramesGrouped")`** a
  private method; `test/zero-alloc.test.ts:97` **`override transformFramesGrouped`** on a subclass.
- This never fails typecheck because **`test/` is in no tsconfig include**: `tsconfig.json`
  `include: ["src/","demo/"]`; `tsconfig.lib.json` is the library only (verified — `grep -l test
  tsconfig*.json` → none). Vitest transpiles via esbuild, which strips `private` without checking.

So the "encapsulation" fixed exactly one consumer (the demo) and protects only the published type
surface. The internal name is pinned by a large untyped corpus; a Tranche-S rename of the composite
entry ripples through ~15 files with no compiler help, and a subclass `override` of a `private` is a
latent TS foot-gun the moment `test/` is ever added to a project.

**Severity rationale:** MEDIUM — the demotion's stated goal (stop consumers reaching into group
internals) is only half-met; the test suite still treats an internal as API, and does so invisibly.

**Proposal (S):** (a) add `test/` to a typechecked tsconfig (or a `tsconfig.test.json` in the `check`
roster) so private/override violations surface — this is a tranche-wide gap, not group-only; (b)
consider exposing a small, intentional test seam (e.g. `render()` returning the composited object, or
a `__composite(t)` documented-internal) so tests assert against a stable contract instead of a
`private` they pierce; (c) if `transformFramesGrouped` stays the assertion target, make it non-private
and rename to signal internal-but-testable, rather than lying with `private`.

---

### 5. [LOW-MED, INHERITED] Per-frame `new Set(only)` allocation on the boxed residual path

**Evidence.** `compositor.ts:182` — `boxedBlendArm` does `const onlySet = only ? new Set(only) :
undefined;`. `only` is `plan.boxedKeys` (`compositor.ts:116`), passed on **every frame** for any group
whose composite has a non-numeric / mixed / first-touch leaf (`soa.ts:86-96` — `boxedKeys` is the SoA
residual). For such groups this allocates a fresh `Set` per layer per frame. `boxedKeys` is
structural-stable (rebuilt only on the `_groupedKeysDirty` seam, `compositor.ts:41`), so the Set is
recomputed from unchanging data every frame.

This is **inherited from P.W2, not introduced by R.W2**: `git show 81a5114^:.../group.ts:432`
shows `const onlySet = only ? new Set(only)` already present pre-carve; R.W2 moved it verbatim into
`compositor.ts`. The module's own zero-alloc prose (`soa.ts:39-44`) correctly scopes the guarantee to
"the constant-shape draw path … the dominant all-numeric shape" — the mixed tail was never covered.

**Severity:** LOW-MED — zero-alloc holds on the all-numeric majority (the SoA fold, verified by
`proof:soa-composite` `bufStable`); the leak bites only composite groups with non-numeric leaves, per
frame per boxed layer.

**Proposal (S):** precompute `boxedKeys` as a `Set` on `SoALayerPlan` at `buildSoAPlans` time
(`soa.ts:236`), or hoist the `onlySet` construction to the plan build. Removes the last per-frame
allocation from the composite path and lets `proof:zero-alloc` extend its buffer-identity assertion to
the mixed-leaf shape.

---

### 6. [LOW-MED] `group.ts` is both the class and the type-definition hub — extract `group/types.ts`

**Evidence.** `AnimationGroupEntry`, `AnimationGroupObject`, `AnimationGroupInput` are declared in
`group.ts:37-50`. All six siblings `import type` them back from `./group`: `entries.ts:20`,
`springs.ts:20`, `soa.ts:48`, `compositor.ts:24`, `layer-api.ts:21`, plus `index.ts:10`. Because the
imports are type-only (erased under `verbatimModuleSyntax`), there is **no runtime cycle** — the
runtime DAG is acyclic (`group.ts` → helpers, helpers ↛ `group.ts` at runtime; verified: no sibling
runtime-imports the group class). But it is a structural type-hub: the leaf helpers each depend on the
god-file's declaration surface, so the class module can never be read or reasoned about in isolation
from its helpers, and the helpers carry a back-reference to the file the carve was meant to shrink.

**Severity:** LOW-MED — idiomatic-enough (type-only), no cycle, but it is the residual coupling that
keeps `group.ts` central. This is precisely the Tranche-S "deeper sub-zoning of library zones" target.

**Proposal (S):** lift the three entry/input types into `group/types.ts` (a value.js-free leaf);
`group.ts` and all helpers import from `./types`. Decouples the helper leaves from the class module and
lets `group.ts` shrink further if S carves more off it.

---

### 7. [INFO] SoA boundary + zero-alloc discipline: verified clean on the hot path

**Evidence.** The SoA seam is genuinely well-factored:
- `buildSoAPlans` (`soa.ts:162-254`) allocates the `Float64Array` scratch **at most once per
  structural change** (`soa.ts:248-251`, grown only when `maxWidth` exceeds capacity) and mirrors the
  boxed carrier semantics exactly (`soa.ts:198-232`) so the fold is bit-identical (`maxErr=0`,
  `soa-composite-decision.json`).
- `groupSoABlendLayer` (`soa.ts:116-139`) allocates **nothing** per frame — seed/op/writeback over
  the passed-in buffer.
- The partition discipline is correct: a mixed leaf goes **entirely** to `boxedKeys`, never split
  across both paths (`soa.ts:200-222`), so no double-blend.
- `proof:soa-composite` verifies `bufStable` over 200 frames (`proof-soa-composite.mjs:499-503`) — the
  buffer identity is unchanged, confirming zero per-frame alloc on the numeric path.

The only gap is the boxed-residual Set (finding 5). The cohesion split between `soa.ts` (the fold +
plan), `compositor.ts` (the frame orchestration + boxed arm), and `group.ts` (the thin delegate) is
clean — `soa.ts` has "NO dependency on the managed-child lifecycle, the scheduler-yield batching, or
the spring-weight composite statements" (`soa.ts:13-15`), which the code bears out.

**Disposition:** no action; recorded as the positive baseline for the SoA-boundary question the lane asked.

---

### 8. [INFO] `layer-springs.ts` 3-way split is cohesion-correct; minor spring-lifecycle spread

**Evidence.** The spec's junk-drawer split (`R.W2.md:167-189`) shipped as: entry lookup/union/render/
snap/pause → `entries.ts`; scheduler-yield → `scheduler.ts`; spring seed+advance → `springs.ts`. Each
file is a tight, `this`-free, allocation-conscious unit (`entries.ts:1-17` header enumerates its five
pure folds honestly). One minor spread: spring lifecycle is split across `layer-api.ts` (the
transition API: seed-trigger + mid-flight re-seat, `layer-api.ts:52-74`) and `springs.ts` (seed
construction + per-frame advance). This is defensible (API vs physics), and both are cohesive; noting
only that a reader tracing "how a layer spring lives and dies" touches two files.

**Disposition:** accept as-is; the API/physics split is the right seam.

---

## Tranche-S implications

Wave-shaped recommendations, ordered by leverage:

1. **`S.Wx` — group/ doc-drift scrub (fold with finding 2/3).** Rewrite `soa.ts:20-23,112-114` (excised
   `soaBlendLayer`), `group/index.ts:2-7` (dead `layer-springs.ts` map), and
   `proof-soa-composite.mjs:534,539` prose to the shipped reality. Cheap, high-honesty. Pair with a
   repo-wide "stale-comment sweep" gate idea: grep source comments for identifiers that no longer
   exist in the zone (`soaBlendLayer`, `layer-springs`) — the same "gate follows code" discipline R.W2
   applied to *scripts* should apply to *doc comments*.

2. **`S.Wx` — typecheck `test/` (tranche-wide, surfaced here).** `test/` is in no tsconfig include, so
   the whole suite escapes `strict`/`private`/`override` checking. Finding 4 (a `private` method spied
   and `override`n by ~15 test files) is invisible today. Add `tsconfig.test.json` to the `check`
   roster. This is bigger than group — every lane's "private demotion" claim is only `.d.ts`-deep until
   this lands.

3. **`S.Wx` — `group/types.ts` leaf (finding 6).** Lift `AnimationGroupEntry`/`Object`/`Input` out of
   `group.ts` into a value.js-free `group/types.ts`; repoint all six siblings. Decouples the helper
   leaves from the class module — the concrete next step of "deeper sub-zoning of library zones."

4. **`S.Wx` — close the last composite allocation (finding 5).** Precompute `boxedKeys` as a `Set` on
   `SoALayerPlan`; extend `proof:zero-alloc` to assert buffer/Set identity on the **mixed-leaf** shape,
   not just all-numeric. Completes the zero-alloc story P.W2/R.W2 left scoped to the numeric majority.

5. **`S.Wx` — resolve the test↔internal coupling (finding 4).** Decide the intentional test seam for
   the composite: either a documented non-private internal (`__composite(t)`) or assert against
   `render()`'s output. Remove the `vi.spyOn(private)` / `override private` foot-guns so a Tranche-S
   rename of the composite path is compiler-checked, not grep-and-pray across 15 files.

**Method verdict for the owner:** R.W2-group is the counter-example to the tranche's cosmetic-decomp
worry — it beat its own line estimate, split further than specified, and moved gates to follow code.
The tranche method's weakness it exposes is **not** in the carve but in the *verification perimeter*:
gates and `check` cover `src/`+`demo/` but not `test/`, and doc comments are outside any gate, so a
correct carve still ships with a lying module header (finding 2) and an un-typechecked private-piercing
test corpus (finding 4). Tranche S should widen the perimeter, not re-carve the zone.
