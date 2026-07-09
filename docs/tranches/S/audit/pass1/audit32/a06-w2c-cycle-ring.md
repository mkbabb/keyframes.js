# Lane a06 — R.W2c cycle-ring break (audit)

**Lane:** a06-w2c-cycle-ring · **Tranche:** R deep audit (pass 1 / 32) · **Date:** 2026-07-02
**Scope:** `internal/group-factory.ts` (getGroupFactory DI seam), `internal/animation-id.ts`,
`physics/spring/solver.ts` re-home, `.dependency-cruiser.cjs` (no-cycle + type-only exemption),
`.dependency-cruiser-known-violations.json` (baseline). Range `a15cd48..18e8617`.
**Method:** read-only. Ran `depcruise src` under the shipped config (GREEN) and under a scratchpad
copy with the `viaOnly` clause removed (26 rings surface) to measure exactly what the type-only
exemption hides. All findings cite `file:line` or SHA. No repo file modified except this report.

---

## Executive summary

R.W2c is **honest and largely well-built**, but the headline "cycle ring BROKEN / baseline empty"
(`docs/tranches/R/FINAL.md:152`, `PROGRESS.md:58`) **conflates two mechanisms of different kinds**,
and one of the two is a disguised service-locator that S should dissolve, not preserve.

1. **The type-only exemption is genuinely SOUND.** I removed the `viaOnly` clause from a scratchpad
   copy of the config and re-ran depcruise: **26 rings surface, and 0 of them are all-runtime** —
   every masked ring closes through at least one erased `import type` edge, so none is a runtime
   module-init hazard. The `viaOnly.dependencyTypesNot: ["type-only"]` addition (d3c6976,
   `.dependency-cruiser.cjs:145-147`) fixed a **real over-strict-config bug** (the prior config gated
   only the head edge, false-RED'ing a runtime head that reached back through a type-only edge). This
   is the correct, blessed dep-cruiser mechanism. **Not a workaround.**

2. **The `getGroupFactory` seam is a SERVICE LOCATOR, not "DI".** R.W2's own charter title is *"DI not
   param-bags"* (`R.W2.md:1`), yet R.W2c ships a mutable module-level singleton
   (`internal/group-factory.ts:34` `let _groupFactory`), registered by import side-effect
   (`group/index.ts:27`), resolved at call time (`engine/animation.ts:492`), typed as bare `object`
   and re-narrowed by a **double `as unknown as`** (register + call sites), guarded by a
   throw-on-impossible-state. That is textbook Service Locator — the anti-pattern constructor-DI
   exists to avoid. It is *sound* and *harmless at runtime*, but it is mislabelled "dependency
   injection" in its own header (`group-factory.ts:11`).

3. **The seam exists to serve exactly ONE caller.** `.group()` has a single real call site in the
   whole tree: `demo/@/components/custom/animation-controls/keyframes/KeyframesEditor.vue:210`. The
   entire registry + singleton + guard + cast apparatus is scaffolding for one demo convenience call.
   The **gestalt fix** the lane asks about — *"would group-depends-on-engine-only be the fix?"* — is
   yes: remove `.group()` from the engine, provide grouping from the `group/` zone (`AnimationGroup.of`
   or a free `group(a, …rest)`), and the seam, the singleton, the guard, and both casts all vanish.
   One-site migration.

4. **The clean pattern was used elsewhere in the SAME wave** — `physics/spring/solver.ts` (ac4883f)
   is the gold standard: the pure `solveDampedHarmonic` kernel extracted to a leaf both `progress.ts`
   and `sample.ts` read, genuinely inverting the `progress↔sample` runtime ring with **no locator**.
   The contrast proves the team can do extract-shared-leaf; the group case only resisted because
   `.group()` forces a value edge, and that method should not exist on the engine.

5. **26 type-only co-recursion rings remain**, concentrated on the carved class modules
   (`engine/animation.ts`, `engine/index.ts`, `group/group.ts`, `group/index.ts` are the reach-back
   targets). The zone graph is **not structurally acyclic**; it is *"acyclic modulo erased type
   edges."* Harmless today, but a real signal the R.W1/R.W2 carve left the module + extracted-submodule
   type co-recursion in place. S can close it with a shared types leaf.

6. **Residual doc-drift:** the config comment (`.dependency-cruiser.cjs:118-128`) and the gate header
   (`scripts/proof-lint-clean.mjs:31-41`) still describe the baseline as ratcheting pre-existing
   cycles under **pre-R.W1 flat filenames** (`spring-duration`, `spring-reseat`, `group-layer-springs`,
   `drag-2d`) — modules that no longer exist. The baseline is now `[]`. Also, `compile/backward-walk.ts:17`
   imports `getAnimationId` from the heavy `../engine` barrel, contradicting `animation-id.ts`'s own
   claim that *"group/compile read it from here [the leaf]."*

**Verdict:** the *runtime* cycle ring is genuinely broken and the baseline ratchet is genuinely at
zero (any NEW all-runtime cycle reds — I confirmed the PLANT-1 all-runtime fixture still bites under
the new config). But two of the three "breaks" are: (a) a legitimate config correction reclassifying
type-only rings, and (b) a service-locator preserving a one-caller convenience. S should invert
ownership to delete the locator and, optionally, collapse the residual type-only rings.

---

## Findings

### 1. `getGroupFactory` is a service-locator mislabelled "dependency injection" — MEDIUM

**Evidence.** `internal/group-factory.ts:34` `let _groupFactory: GroupFactory | null = null;` (mutable
module singleton); `:41` `registerGroupFactory` (setter); `:50-59` `getGroupFactory` throws if unset;
`group/index.ts:27-33` registers by **import side-effect** at barrel module-init; `engine/animation.ts:492`
`const group = getGroupFactory()(this, ...animations);` then `:493` `return group as unknown as
AnimationGroup<V>;`. The factory type erases everything: `type GroupFactory = (first: unknown,
...rest: unknown[]) => object` (`group-factory.ts:32`), so the register site *also* casts
(`group/index.ts:30-31` `first as KeyframesAnimation` + `rest as AnimationGroupInput<any>[]`).

**Why it's a smell.** This is the Service Locator pattern, which constructor-DI exists to replace:
the engine's dependency on the group constructor is **invisible** in its signature; correctness
depends on **global mutable state + import ordering**; a missing registration is deferred to a
**runtime throw** (`group-factory.ts:52-56`) rather than caught structurally; and the type system is
**defeated at the seam** by a double `as unknown as` (both `object → AnimationGroup` and the register
side's arg casts). The header calls this *"dependency injection through a neutral seam"*
(`group-factory.ts:11`) — but R.W2's charter explicitly demands *"DI not param-bags"* (`R.W2.md:1`),
and this is neither DI nor a param-bag; it is a registry locator. The honesty gap is in the *naming*,
not the behaviour.

**Why it's tolerable.** Given `.group()` must (a) stay synchronous and (b) live on the engine class,
and the engine cannot statically `import { AnimationGroup }` without re-closing the runtime ring,
the locator is the least-bad of {locator, async dynamic-import (changes the signature), caller-passes-ctor
(leaks impl)}. The soundness argument in the header (`group-factory.ts:14-17`) is correct:
`loadAnimationEngine()` loads both zones, so the seam is always armed before any `KeyframesAnimation`
exists.

**Proposal.** See Finding 2 — the locator is only tolerable *because* `.group()` is assumed fixed.
Lift that assumption and the locator disappears entirely. Short of that, at minimum re-title the
header: it is a "registry seam / service locator," not "DI."

---

### 2. The entire seam serves ONE caller — ownership inversion is the gestalt fix — MEDIUM (gestalt)

**Evidence.** The only real `.group()` call site in the tree is
`demo/@/components/custom/animation-controls/keyframes/KeyframesEditor.vue:210`
(`.group(presets.jumpUp().setTargets(el2))`). Every other `.group(` hit is either the factory's own
doc comments (`group-factory.ts:2,7,11,17,55`) or vendored `dist` artifacts. There are **zero** other
`src/` or `demo/` consumers of `KeyframesAnimation.group()`.

**Analysis.** `engine/animation.ts:490-494` `.group()` is the **only** wrong-way runtime edge the seam
was built to invert — and it is a low-value convenience that one demo uses. The natural layering is
`group → engine` (the group composes `KeyframesAnimation` instances: `group/group.ts:7` value-imports
the class, used at `group/group.ts:124` `input instanceof KeyframesAnimation`). If grouping is offered
from the group zone instead of the engine class — `AnimationGroup.of(a, …rest)` (static) or a free
`group(a, …rest)` in `group/` — then:

- `group` depends on `engine` only; **no engine→group value edge at all**.
- `internal/group-factory.ts` is **deleted** (singleton, setter, getter, throw-guard, `object` type).
- `group/index.ts:21-33` (the side-effecting `registerGroupFactory` block) is **deleted**.
- Both `as unknown as` casts (`engine/animation.ts:493`, `group/index.ts:30-31`) are **deleted**;
  the API regains full type safety at the seam.
- The demo migrates one line: `a.group(b)` → `group(a, b)`.

This is precisely the *"group depends on engine only"* inversion the lane names, and it is **cleaner
and smaller** than what shipped. R.W2c chose to preserve `.group()`'s shape and pay for it with a
locator; S should pay a one-line demo migration and delete the locator.

**Proposal.** S wave: **excise `KeyframesAnimation.group()`**; add `AnimationGroup.of(first, …rest)`
(or a free `group()` export from `group/`); delete `internal/group-factory.ts` and the
`registerGroupFactory` side-effect; migrate `KeyframesEditor.vue:210`. Net: −59 LOC leaf, −1 singleton,
−1 runtime guard, −2 unsafe casts, +1 idiomatic static factory. Gate: `proof:lint-clean` stays green
(the engine→group runtime edge is now *gone*, not *inverted*).

---

### 3. The type-only exemption is sound — 0 genuine runtime cycles masked (validated) — INFO

**Evidence.** I copied `.dependency-cruiser.cjs` to scratchpad, removed the `viaOnly` block
(`.dependency-cruiser.cjs:145-147`), and re-ran `depcruise src`: **26 no-cycle violations** surface
(vs. 0 under the shipped config). I then parsed the JSON output and checked every reported cycle's
per-edge `dependencyTypes`: **26/26 contain at least one `type-only` edge; 0/26 are all-runtime.**
The reach-back type-only targets are exactly `engine/animation.ts`, `engine/index.ts`, `group/group.ts`,
`group/index.ts` (e.g. `waapi/delegation.ts:3` `import type { KeyframesAnimation } from "../engine"`
is the erased edge closing the long WAAPI ring).

**Analysis.** A cycle that closes through an `import type` edge is erased under
`verbatimModuleSyntax` and carries **no runtime module-init hazard** — exactly what the rule comment
promises (`.dependency-cruiser.cjs:118-121`). dep-cruiser's `viaOnly.dependencyTypesNot` is the
blessed mechanism for expressing "report only if the *whole ring* is runtime." The prior config
(head-edge gating only) was genuinely buggy: it flagged a runtime head reaching back through an erased
edge as a "cycle that does not exist at runtime" (`.dependency-cruiser.cjs:141-144` documents this).
d3c6976's config change is a **correct bug-fix**, not a loosening.

**Caveat (low).** The exemption's safety is coupled to `import type` discipline: dep-cruiser classifies
an edge as `type-only` by the keyword, not by tree-shaking analysis. `verbatimModuleSyntax: true`
enforces that a value-position import cannot be silently type-only, so the coupling holds today — but
it is worth stating that the no-cycle floor's runtime-safety guarantee *depends on* that tsconfig flag
remaining set. If `verbatimModuleSyntax` were ever relaxed, the exemption could mask a real edge.

---

### 4. The residual 26 type-only rings signal an incomplete carve — MEDIUM (gestalt)

**Evidence.** The 26 rings concentrate entirely in engine/waapi/group (edge-count 57/26/26 across
zones from the scratchpad run) and all reach back to the four carved class modules named in Finding 3.
This is the classic **module + extracted-submodule** co-recursion the R.W1/R.W2 carve created: e.g.
`engine/animation.ts → engine/playback.ts` (runtime) and `engine/playback.ts` reads
`KeyframesAnimation` back as a type; `engine/option-setters.ts`, `interpolate.ts`, `element-resolve.ts`,
`compile-bridge.ts` each form the same pattern with `animation.ts`.

**Analysis.** These are harmless (Finding 3), so this is *not* a correctness finding — it is a
gestalt/architecture observation. "Cycle ring BROKEN" (`FINAL.md:152`) overstates: the *runtime*
ring is broken, but the zone graph is *"acyclic modulo type-only edges,"* and 26 type rings persist.
The idiomatic elimination is a **shared types leaf** (or making the extracted submodules generic over
the animation type rather than importing the concrete `KeyframesAnimation` type). The spring
`solver.ts` split (Finding 5) shows the team already knows this move for *runtime* leaves; the same
discipline applied to the *type* seam would make the graph truly acyclic and let S drop the `viaOnly`
exemption entirely (a stronger invariant: "no cycle, period").

**Proposal.** S wave (optional, hardening): extract a `engine/types.ts` (or `internal/animation-shape.ts`)
holding the structural type the submodules need; point the submodules' `import type … from "../engine…"`
reach-backs at it; re-measure with `viaOnly` removed. If the count drops to 0, *delete the `viaOnly`
clause* and gain a graph that is unconditionally acyclic — a materially stronger floor.

---

### 5. `physics/spring/solver.ts` split is the gold-standard fix (contrast) — INFO

**Evidence.** ac4883f `R.W2c: split spring solver kernel to neutral leaf (break progress<->sample
ring)`. `physics/spring/solver.ts:1-15` header: the pure `solveDampedHarmonic` closed-form kernel
extracted off `sample.ts` so **both** `progress.ts` and `sample.ts` read it *"without either side
reaching back through the other."* This inverts the `progress↔sample` runtime ring via
**extract-shared-leaf** — no singleton, no locator, no cast, no guard.

**Analysis.** This is the idiomatic pattern and it worked cleanly. Its existence in the same wave is
the strongest argument that the group seam (Findings 1-2) is *not* forced by the problem shape — it is
forced by the decision to keep `.group()` on the engine. Where a genuine shared leaf existed
(the math kernel), R.W2c did the right thing. Where a *value construction* edge existed (`.group()`
building an `AnimationGroup`), it reached for a locator instead of removing the edge.

---

### 6. `compile` never adopted the `getAnimationId` leaf — LOW

**Evidence.** `internal/animation-id.ts:13` header claims *"group/compile read it from here."* But
`compile/backward-walk.ts:17` reads `import { getAnimationId } from "../engine";` — the **heavy engine
barrel**, not the leaf. `group/` did adopt the leaf (`group/group.ts:8`, `group/entries.ts:18` both
import from `../internal/animation-id`); `compile/` did not.

**Analysis.** No cycle results (the depcruise run is clean), so this is a hygiene finding, not a
correctness one. Two costs: (a) the leaf's stated DRY intent is only half-realized — the whole reason
`getAnimationId` was relocated to a value.js-free leaf (`animation-id.ts:4-9`) was to kill runtime
edges *to the engine class*, and `backward-walk.ts` keeps exactly such an edge for a pure string
helper; (b) `backward-walk.ts` drags the entire heavy `engine/index` barrel (KeyframesAnimation +
CSSKeyframesAnimation) into its import graph to obtain a 6-line string function.

**Proposal.** S: change `compile/backward-walk.ts:17` to `import { getAnimationId } from
"../internal/animation-id";`. Trivial, honors the leaf's charter, lightens compile's graph.

---

### 7. Stale doc-drift in the config and gate header — LOW

**Evidence.** `.dependency-cruiser.cjs:122-128` (no-cycle rule comment) still lists the baseline as
recording *"engine↔easing↔frame-compiler↔group↔waapi, spring↔spring-duration↔spring-reseat,
group↔group-layer-springs, drag↔drag-2d"* — **pre-R.W1 flat filenames** (`spring-duration`,
`spring-reseat`, `group-layer-springs`, `drag-2d` no longer exist as modules). The baseline is now
`[]` (`.dependency-cruiser-known-violations.json:1`). Same stale narrative in
`scripts/proof-lint-clean.mjs:31-41` (*"they are recorded in dependency-cruiser's known-violations
BASELINE"* — the baseline is empty).

**Analysis.** The *gate logic* is fine — `proof-lint-clean.mjs:138` prints `baseline.length`
dynamically and correctly reports "0 pre-existing cycle(s)." Only the header prose lies. A reader
auditing the floor is told a populated baseline of flat-named cycles exists when it does not. Low
severity but exactly the kind of narrative-vs-code drift this audit exists to catch.

**Proposal.** S: rewrite `.dependency-cruiser.cjs:118-128` and `proof-lint-clean.mjs:31-41` to state
the *current* posture — "baseline is `[]`; the no-cycle rule bites any new all-runtime cycle; type-only
rings are exempted structurally by `viaOnly`, not baselined." If Finding 4 lands (graph made
unconditionally acyclic), the `viaOnly` narrative can go too.

---

### 8. The baseline ratchet is genuinely at zero and still bites (positive) — INFO

**Evidence.** `npm run lint` = `depcruise src --ignore-known` (`package.json:211`); with baseline `[]`,
`--ignore-known` ignores nothing, so **any** new violation reds. `proof-lint-clean.mjs:202-217`
PLANT-1 writes a real all-runtime `a↔b` fixture and asserts depcruise reds `no-cycle` **through** the
baseline — I confirmed this plant is an all-runtime pair, so it still bites under the new `viaOnly`
config (both edges runtime → `viaOnly` matches → reds). The boundary-baseline guard
(`proof-lint-clean.mjs:123-135`) additionally forbids any rule-2/3 (leaf/light-barrel) entry from ever
being ratcheted. This is a real, defensible improvement over the Q-close baseline (which carried 15
entries, `FINAL.md:152`).

---

## Tranche-S implications

Concrete, wave-shaped recommendations, ordered by value:

1. **[S — ownership inversion] Delete the `getGroupFactory` service-locator.** Excise
   `KeyframesAnimation.group()` (`engine/animation.ts:490-494`); add `AnimationGroup.of(first, …rest)`
   (static) or a free `group()` export in `group/`; delete `internal/group-factory.ts` and the
   `registerGroupFactory` side-effect (`group/index.ts:21-33`); migrate the one caller
   (`KeyframesEditor.vue:210`). Removes a singleton, a runtime guard, and two `as unknown as` casts,
   and makes `group → engine` the *only* cross-edge (Findings 1-2). This is the gestalt fix; it is
   smaller than what shipped.

2. **[S — hardening, optional] Collapse the 26 residual type-only rings** via a shared types leaf
   (`engine/types.ts` or making submodules generic over the animation shape), then **delete the
   `viaOnly` exemption** and enforce unconditional acyclicity (Finding 4). This upgrades the floor
   from "acyclic modulo erased edges" to "acyclic, period" — a materially stronger invariant that
   removes the `verbatimModuleSyntax`-coupling caveat (Finding 3).

3. **[S — hygiene] Finish the `getAnimationId` leaf adoption:** repoint `compile/backward-walk.ts:17`
   at `../internal/animation-id` (Finding 6). One line; honors the leaf's own charter; lightens
   compile's graph.

4. **[S — doc truth] Rewrite the stale baseline narratives** in `.dependency-cruiser.cjs:118-128` and
   `proof-lint-clean.mjs:31-41` to the current `[]`-baseline / `viaOnly`-exemption posture, dropping
   the dead flat filenames (Finding 7). Fold into (2) if the exemption is removed.

5. **[S — naming honesty, if the locator is *kept*] Re-title** `internal/group-factory.ts`'s header:
   it is a registry seam / service locator, not "dependency injection" (Finding 1). Prefer (1) over
   this.

6. **[S — method note] Carry the extract-shared-leaf pattern (solver.ts) as the canonical ring-break
   recipe** and treat any *new* locator/registry as a code-smell requiring justification. R.W2c proves
   the team defaults to the clean pattern for runtime leaves; the group case is the one exception, and
   it exists only to preserve a one-caller API.

**Net posture for S:** R.W2c broke the *runtime* engine↔group ring correctly and drove the baseline
ratchet to zero — genuine, verifiable work (validated by the scratchpad `viaOnly`-off run showing 0
all-runtime cycles). The residue S inherits is (a) a service-locator that should be inverted away
entirely, (b) 26 harmless-but-real type-only rings that a shared types leaf would erase, and (c) two
small hygiene/doc drifts. None is a correctness defect; all are gestalt/idiom improvements the S
charter ("no legacy/workaround, deeper sub-zoning, gestalt") explicitly targets.
