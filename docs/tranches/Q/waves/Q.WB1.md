# Q.WB1 — emerging-CSS Phase-2: the element-AWARE resolve pass (`if(style(--p))` · `sibling-index()` · `sibling-count()`) over a post-`setTargets` second `resolveValues` against the SAME `ResolveContext`

**Band:** B — Engine-perf + emerging-CSS Phase-2 · the "lead the platform" capability (Phase 2).
**Phase:** NOW — fully in-realm. value.js 1.1.0 ALREADY parses all three nodes (`if(style(--p))` → a `FunctionValue("if",…)` whose condition is `style(--p)`; `sibling-index()`/`sibling-count()` → `FunctionValue('sibling-index'|'sibling-count', [])` via the generic producer — confirmed at `B1-kf-emerging` GAP 2). No sibling publish gates this wave; the parse half is free.
**Sequence (DAG edges):** `Q.WA3 master-merge-reconcile (the FIRST motion) ─► Q.WB1`. Independent of Q.WB2 (the `@function` arm — a different `FunctionValue.name` branch), Q.WB3 (the SoA interp substrate — a hot-path concern, not a lowering concern), Q.WB4 (WAAPI densify). Shares the `resolve-values.ts` rewriter + `ResolveContext` shape with Q.WB2 (both add an arm to `resolveNode`); the two are authored to land in either order over the same module (no edit-collision — distinct `FunctionValue.name` branches).
**Owning-DM-or-idea:** `B1-kf-emerging` GAP 1 + GAP 2 + GAP 3 (the typed Phase-2 seam with NO pass behind it) and `B5-kf-engine-arch` Q.W-ENG5 (the post-`setTargets` second resolution pass over the SAME `ResolveContext`). The owner directive (2026-06-22, carried into Q): **novel CSS features SHOULD be supported in our grammar + engine; the library LEADS the platform, browsers catch up.** P.W13 shipped the Phase-1 element-INDEPENDENT arm (`if(supports/media)` + `spring()`); this wave finishes the advertised completion P.W13 left as a typed-but-dead seam.

---

## Context

### The breach — a typed Phase-2 seam with NO pass behind it (a complete no-op since P.W13)

P.W13 shipped `resolve-values.ts` with the Phase-2 element-aware fields **typed but never populated**, and the second resolution pass that would consume them **never authored**. Three confirmed dead seams (`B1-kf-emerging`):

1. **The `ResolveEnv` Phase-2 fields are dead** — `resolve-values.ts:62-67` declares `customProps?`, `siblingIndex?`, `siblingCount?` "so the second-pass call site (post-`setTargets`) threads the SAME context shape." Nothing ever sets them; nothing ever reads them.
2. **`if(style(--p))` stays unresolved forever** — `evalCondition` (`resolve-values.ts:284`) returns `undefined` for `name === "style"` ("the NOW pass cannot evaluate it (no element here)"), and `resolveIf` (`resolve-values.ts:350-354`) returns the `if()` UNCHANGED on an `undefined` decision "for the element-aware second pass." That second pass does not exist, so a `style(--p)` `if()` lowers to the literal `if(...)` string and flattens to nonsense at interpolation.
3. **`sibling-index()`/`sibling-count()` never even ENTER the pass** — `hasResolvableValue` (`resolve-values.ts:463-472`) admits ONLY `if`/`spring`-bearing nodes (`value.name === "if" || value.name === "spring"`), so the adapter's `if (value instanceof ValueArray && hasResolvableValue(value))` guard (`adapter.ts:151`) skips any declaration whose only lowerable node is a bare `sibling-index()`. The pass never sees them — even though value.js parses them for free.

The chronic: P.W13's own header comment (`resolve-values.ts:23-24`) calls Phase 2 "deferred, a typed seam below." Under Q's no-deferral mandate, the seam must be made live — fully in-realm, the parse half already free.

### The cure — ONE rewriter, a SECOND lifecycle point (the gestalt P.W13 already designed)

P.W13 chose the right architecture and explicitly built for this: "ONE rewriter, two lifecycle points, not two divergent context types" (`resolve-values.ts:54-55`). The cure is to *run* the second point, not to add a second rewriter:

- **The pass re-runs post-`setTargets`** — the engine's `setTargets` (`engine.ts:1170`) is where the animation first has its resolved DOM target. After targets bind, re-run `resolveValues` over the declarations that carried an UNRESOLVED Phase-2 node (the `if(style(--p))` left intact by Phase 1, and the `sibling-*` nodes the widened guard now admits) with a **populated `ResolveEnv`**: `customProps = name => getComputedStyle(target).getPropertyValue(name) || undefined`, `siblingIndex = () => [...target.parentElement.children].indexOf(target) + 1`, `siblingCount = () => target.parentElement.children.length`. The SAME `ResolveContext` shape, the SAME recursive rewriter — only the env is now element-populated.
- **`evalCondition` gains the `style` branch** — when `ctx.env.customProps` is present (Phase 2), `name === "style"` reads the resolved custom-prop and evaluates the `style(--p)` / `style(--p: v)` condition (presence-or-equality), instead of returning `undefined`. When absent (Phase 1), it still returns `undefined` and leaves the `if()` for the second pass (the existing behaviour — unchanged).
- **`resolveNode` gains the `sibling-*` arm** — a `FunctionValue("sibling-index", [])` resolves to an integer `ValueUnit` from `ctx.env.siblingIndex()`; `sibling-count()` likewise. A bare `sibling-index()` left over from Phase 1 (no env) stays intact; the second pass finishes it.
- **`hasResolvableValue` widens** — admit `sibling-index`/`sibling-count` AND `style(...)`-bearing `if()` so the adapter guard lets them into the pass at all (GAP 3 — the precondition).

### The double-resolution guard (the FRICTION P.W13 named, pre-empted here)

`B1-kf-emerging` flags the exact mid-tranche trap: the second pass must NOT re-resolve the Phase-1 nodes (the already-concrete `if(supports)`/`spring()` values) — re-running the full pass over the flattened-and-resolved declaration would either double-resolve or fail to find a `FunctionValue` where Phase 1 already wrote a concrete leaf. The cure (S3): the second pass runs over the **pre-flatten `decl.value` snapshot**, NOT the flattened frame, and resolves ONLY the residual unresolved nodes — a Phase-1-resolved node is already a concrete leaf (`resolveNode` returns a `ValueUnit` as-is, `resolve-values.ts:387`), so it is idempotent. The pass is gated to run only on declarations that carried a Phase-2 node (`hasPhase2Node`, a sibling sniff of `hasResolvableValue`), so a pure-Phase-1 animation pays zero second-pass cost.

### Audit evidence

| Ref | Source location | Fact (verified 2026-06-23) |
|-----|-----------------|------------------------------|
| phase2-fields-dead | `src/animation/resolve-values.ts:62-67` | `customProps?`/`siblingIndex?`/`siblingCount?` typed on `ResolveEnv` — never populated, never read |
| style-undefined | `src/animation/resolve-values.ts:281-284` | `evalCondition` returns `undefined` for `name === "style"` — "the NOW pass cannot evaluate it (no element here)" |
| if-left-intact | `src/animation/resolve-values.ts:349-354` | `resolveIf` returns the `if()` UNCHANGED on `decided === undefined` — "leave the if() intact for the element-aware pass; do NOT guess" |
| guard-too-narrow | `src/animation/resolve-values.ts:463-472` | `hasResolvableValue` admits ONLY `if`/`spring` — a bare `sibling-index()` never enters the pass (GAP 3) |
| adapter-guard | `src/animation/adapter.ts:151` | `if (value instanceof ValueArray && hasResolvableValue(value))` — the only entry to `resolveValues`; skips Phase-2-only declarations |
| no-element-at-flatten | `src/animation/adapter.ts:218-221` | `resolveKeyframes(input: string \| Stylesheet, env?)` — no element/target at flatten time (the structural reason Phase 2 needs a second pass) |
| setTargets-seam | `src/animation/engine.ts:1170` | `setTargets(...targets)` — the lifecycle point where the animation first has a resolved DOM target (the Phase-2 call site) |
| parse-is-free | value.js 1.1.0 (`B1-kf-emerging` GAP 2) | `sibling-index()`/`sibling-count()` → `FunctionValue('sibling-index'\|'sibling-count', [])` via the generic producer; `style(--p)` condition round-trips through `parseCSSValue` — NO value.js ask |
| stagger-consumer | `src/animation/stagger.ts` (`B1-kf-emerging` finding) | the natural consumer for a resolved `sibling-index()` is the existing `stagger(count, opts)` delay distribution — a grounded betterment |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. The pass is ONE rewriter at a SECOND lifecycle point — no second module, no per-feature hack.

- **S1 — widen the entry guard (the precondition, GAP 3).** Extend `hasResolvableValue` to admit `sibling-index`/`sibling-count` `FunctionValue`s AND an `if()` whose condition is a `style(...)` form, so the adapter lets a Phase-2-only declaration into the pass. Add a sibling `hasPhase2Node(value)` predicate (the Phase-2 subset) so the SECOND pass runs ONLY on declarations carrying an element-aware node.
- **S2 — the element-aware env populate.** At `setTargets`, build a `ResolveEnv` from the bound target: `customProps`, `siblingIndex`, `siblingCount` reading `getComputedStyle`/`parentElement.children`. SSR-safe (no target / no `parentElement` → the field is omitted, the node stays unresolved, never a throw).
- **S3 — the second `resolveValues` pass (the gestalt — SAME `ResolveContext`).** Re-run `resolveValues` post-`setTargets` over the residual Phase-2 nodes against the populated env, idempotent over already-concrete Phase-1 leaves (the double-resolution guard: run over the pre-flatten `decl.value` snapshot, gated by `hasPhase2Node`). `evalCondition` evaluates `style(--p)` when `ctx.env.customProps` is present; `resolveNode` resolves `sibling-*` to an integer `ValueUnit` when `ctx.env.siblingIndex`/`siblingCount` is present.
- **S4 — the born-RED gate (the live observable, NOT a grep).** `proof:emerging-css-resolve-P2` — a jsdom behaviour test that attaches a real target with a set `--p` custom prop + N DOM siblings and asserts the COMPILED frame holds the resolved branch / the integer sibling index, not the literal `if(...)`/`sibling-index()` string.

---

### S1 — widen the entry guard (the precondition)

**Breach.** `hasResolvableValue` (`resolve-values.ts:463-472`) is too narrow: a declaration whose only lowerable node is `sibling-index()` is never admitted to `resolveValues` (the adapter's `hasResolvableValue(value)` guard returns false), so the pass never sees it. And there is no predicate distinguishing a Phase-2 node from a Phase-1 node, so the second pass cannot be gated to run only where needed.

**Cure.** Widen `hasResolvableValue` to also return true for `FunctionValue.name === "sibling-index" \| "sibling-count"` and for an `if()` whose first value is a `style(...)` condition. Add `hasPhase2Node(value): boolean` — the structural sniff for the SECOND pass — true iff the value carries a `sibling-*` node OR an `if()` with a `style(...)` condition (the residual the Phase-1 pass deliberately left). A pure-`if(supports)`/`spring()` declaration returns false → the second pass skips it entirely (zero cost).

**Gate bite.** `proof:emerging-css-resolve-P2` `guard-admits-sibling` clause: a `transform: translateX(calc(sibling-index() * 10px))` declaration is admitted to the pass (the compiled frame holds a concrete `translateX`, not the literal `sibling-index()`). BITE: leaving `hasResolvableValue` un-widened → the declaration skips the pass → the frame carries the literal `sibling-index()` string → the resolved-integer assertion reds.

---

### S2 — the element-aware env populate (post-`setTargets`)

**Breach.** The `ResolveEnv` Phase-2 fields (`resolve-values.ts:62-67`) are dead — `customProps`/`siblingIndex`/`siblingCount` are never assigned. There is no point in the engine where a resolved target is read into a `ResolveEnv`.

**Cure.** At `setTargets` (`engine.ts:1170`), after the target binds, build the element-aware env from `target = this.targets[0]`:
- `customProps = (name) => { const v = getComputedStyle(target).getPropertyValue(name).trim(); return v === "" ? undefined : v; }`
- `siblingIndex = () => { const p = target.parentElement; return p ? [...p.children].indexOf(target) + 1 : 1; }` (1-based, per the CSS `sibling-index()` definition)
- `siblingCount = () => target.parentElement?.children.length ?? 1`

SSR-safe: no `document`/no target → the fields are omitted (not assigned) and the residual node stays unresolved (idempotent — the same posture Phase 1 holds for `style(--p)` today). The env is built ONCE per `setTargets`, not per frame (the pass is a compile-time lowering, never on the hot path).

**Gate bite.** `proof:emerging-css-resolve-P2` `env-populated` clause: attach a target with `--p: 12px` set inline; assert `if(style(--p): A; else: B)` resolves to `A` (the custom-prop present). BITE: leaving the env-populate unwired → `ctx.env.customProps` undefined → `evalCondition` returns `undefined` → the `if()` stays literal → the `A`-branch assertion reds.

---

### S3 — the second `resolveValues` pass (the gestalt: SAME `ResolveContext`, idempotent over Phase-1)

**Breach.** No second pass exists. The Phase-2-residual nodes (`if(style(--p))` left intact by `resolveIf`'s `undefined`-decision return; the `sibling-*` nodes the widened guard now admits) are never resolved against an element — they reach the frame compiler as unresolved `FunctionValue`s and flatten to nonsense.

**Cure.** In `setTargets`, after building the element-aware env (S2), re-run the lowering over the declarations that carry a Phase-2 node:
- The pass runs over the **pre-flatten `decl.value` snapshot** (the `ValueArray` the adapter captured), NOT the flattened frame — so a Phase-1-resolved node (already a concrete `ValueUnit`) is returned as-is by `resolveNode` (`resolve-values.ts:387`), making the second pass idempotent over the Phase-1 result. Gated by `hasPhase2Node` (S1) so a pure-Phase-1 animation never re-resolves.
- `evalCondition` gains the live `style` branch: when `ctx.env.customProps` is present, `name === "style"` reads `customProps(prop)` and evaluates `style(--p)` (presence: the prop is set) / `style(--p: value)` (equality: the resolved prop equals `value`). When `customProps` is absent (Phase 1), it still returns `undefined` — the existing Phase-1 behaviour is untouched.
- `resolveNode` gains the `sibling-*` arm: `node.name === "sibling-index"` → `new ValueUnit(ctx.env.siblingIndex(), "")` (an integer-position leaf); `sibling-count()` likewise; both nested-`calc`-aware (the producer already nests them, e.g. `calc(sibling-index() * 10px)` → the `calc` recurses into its children and the `sibling-index()` child resolves to the integer).
- The re-resolved declaration replaces the original on the frame (the compiler re-runs over the now-concrete value), so interpolation runs EXACTLY as today — the frame pair holds two concrete values where it held an unresolved `FunctionValue`.

**Constraint (the gestalt — no divergent context).** The second pass consumes the SAME `ResolveContext` shape (`functions`/`env`/`seen`/`depth`) the Phase-1 pass uses; the ONLY delta is the element-populated `env`. No second module, no second rewriter, no per-feature branch outside the existing `resolveNode`/`evalCondition` dispatch. The double-resolution guard (run over the pre-flatten snapshot, gated by `hasPhase2Node`, idempotent over Phase-1 leaves) is the falsification anchor for "the second pass corrupts the Phase-1 result."

**Gate bite.** `proof:emerging-css-resolve-P2` `idempotent-over-phase1` clause: a declaration carrying BOTH `if(supports(...))` (Phase 1) AND `sibling-index()` (Phase 2) resolves the supports-branch ONCE (Phase 1) and the sibling-index ONCE (Phase 2) — the supports-branch is NOT re-evaluated against the element. BITE: running the full pass over the flattened frame (instead of the pre-flatten snapshot) → the Phase-1-concrete leaf has no `FunctionValue` to re-resolve, OR a double-resolve mangles it → the resolved-value-equality assertion reds.

---

### S4 — the born-RED gate (`proof:emerging-css-resolve-P2`)

**Breach.** No gate covers the element-aware arm. `proof:emerging-css-resolve-now` (the P.W13 gate) is Phase-1-only and jsdom-clean by construction (no element). There is no live witness that `if(style(--p))`/`sibling-*` resolves against a real attached target.

**Cure.** Author `scripts/proof-emerging-css-resolve-P2.mjs` + `test/emerging-css-resolve-p2.test.ts` (the SOURCE-GREP-half-CHAINED-with-BEHAVIOUR-half idiom the Phase-1 gate established). The behaviour half is the REAL observable (the gate-blindspot lesson: a demo/interaction-axis gate, not a source grep):
1. **`if(style(--p)) → resolved branch.** Attach an `HTMLElement` with `style.setProperty("--p", "12px")`; compile a 2-frame keyframe with `width: if(style(--p): 100px; else: 0px)`; `setTargets(el)`; assert the compiled frame's `width` is the resolved `100px` leaf (the prop present), and with `--p` UNSET asserts `0px` (the else branch) — NOT the literal `if(...)` string.
2. **`sibling-index() → integer.** Build a parent with 3 children, attach the 2nd; compile `transform: translateX(calc(sibling-index() * 10px))`; `setTargets(child2)`; assert the resolved `translateX` is `20px` (index 2 × 10px). `sibling-count()` → `30px` for a `calc(sibling-count() * 10px)` over 3 children.
3. **idempotency.** A `width: if(supports(width: 1px): if(style(--p): 100px; else: 50px); else: 0px)` resolves the supports-branch in Phase 1 then the style-branch in Phase 2 — assert the final leaf is the doubly-resolved concrete value, with the Phase-1 supports-branch evaluated exactly once.

Born-RED today: `evalCondition` returns `undefined` for `style(...)`, `resolveNode` has no `sibling-*` arm, `hasResolvableValue` skips `sibling-*`, and no second pass runs — so all three assertions fail on the current tree (the literal `if(...)`/`sibling-index()` string reaches the frame). The SOURCE-GREP half names post-cure anchors (the `setTargets` env-populate call site, the `style`-branch in `evalCondition`, the `sibling-*` branch in `resolveNode`) absent from the uncured source, so the gate is RED by construction and false-passes on nothing.

**The plant-a-failure.** On the cured tree, regress `resolveNode`'s `sibling-index()` arm to return the integer `siblingCount()` instead of `siblingIndex()` → the `translateX` reads `30px` not `20px` → the resolved-integer assertion reds. Or regress the env-populate to read `parentElement.children.length` 0-based → the index is off by one → reds. Each born-RED witness is a live attached-DOM resolution, never a grep a stub could green.

---

## Born-RED gate

**Gate:** `proof:emerging-css-resolve-P2` (NEW — `scripts/proof-emerging-css-resolve-P2.mjs` source-grep half CHAINED with `vitest run test/emerging-css-resolve-p2.test.ts` behaviour half). Born-RED on today's tree: the Phase-2 arm is a complete no-op (`evalCondition` `undefined` for `style`, no `sibling-*` arm, no second pass, narrow guard).

| Clause | The REAL observable | Born-RED witness on today's tree |
|--------|----------------------|------------------------------------|
| `guard-admits-sibling` (precondition) | a `sibling-index()`-only declaration enters the pass | `hasResolvableValue` skips it → the frame carries the literal `sibling-index()` → RED |
| `env-populated` | `if(style(--p))` resolves against a set custom-prop | `ctx.env.customProps` undefined → the `if()` stays literal → RED |
| `sibling-resolved` (KEYSTONE) | `sibling-index()`/`sibling-count()` → the integer position against a real attached child | `resolveNode` has no `sibling-*` arm → the literal string reaches the frame → RED |
| `idempotent-over-phase1` (the double-resolution guard) | a mixed Phase-1+Phase-2 declaration resolves each arm exactly once | no second pass exists → the Phase-2 node never resolves → RED |

**Green condition.** The widened guard admits Phase-2 nodes; `setTargets` populates the element-aware env; the second `resolveValues` pass resolves `if(style(--p))`/`sibling-*` against the bound target, idempotent over the Phase-1 result; the live jsdom behaviour test reads the resolved branch / integer position off a real attached DOM target. The Phase-1 `proof:emerging-css-resolve-now` gate stays GREEN unchanged (no regression to the element-independent arm).

---

## Dependencies

- **value.js 1.1.0 — ALREADY published; NO new ask.** value.js's generic producer already parses `sibling-index()`/`sibling-count()` → `FunctionValue` and round-trips a `style(--p)` `if()` condition (`B1-kf-emerging` GAP 2). The parse half is free; this wave is the kf-side resolve half, entirely in-realm (inv-16 holds — no foreign-tree edit).
- **`resolve-values.ts` + `ResolveContext` + `setTargets` — already shipped** (`resolve-values.ts`, `engine.ts:1170`). The typed Phase-2 seam P.W13 built is the substrate; this wave activates it. NO new module.
- **Independent of Q.WB2/WB3/WB4.** Q.WB2 adds a DIFFERENT `resolveNode` branch (the `--ident(args)` call) over the SAME module — distinct `FunctionValue.name`, no edit-collision; Q.WB3 is the hot-path interp substrate (orthogonal to this compile-time lowering); Q.WB4 is WAAPI emit. File surfaces: `src/animation/resolve-values.ts` (the `style`/`sibling-*` arms + the widened guard), `src/animation/engine.ts` (the `setTargets` env-populate + second pass), `scripts/proof-emerging-css-resolve-P2.mjs` (NEW), `test/emerging-css-resolve-p2.test.ts` (NEW).
- **`stagger` (the natural consumer) — already shipped** (`stagger.ts`). A resolved `sibling-index()` feeds the existing `stagger(count, opts)` delay distribution; this wave makes that data available, no `stagger` change required.

---

## dev→impl boundary

This file is the Tranche Q DEVELOPMENT spec for Q.WB1 — **DOCS ONLY.** It writes zero engine/library source (inv-16: kf writes only keyframes.js; the parse half is value.js-already-published, no dispatch). On owner authorization the `resolve-values.ts` `style`/`sibling-*` arms + the widened guard + the `setTargets` env-populate + the second pass + the two new gate files open — gate-first (`proof:emerging-css-resolve-P2` authored born-RED BEFORE the arms land), observable-truth (the live attached-DOM resolution, NOT a source grep), no-legacy (the dead Phase-2 fields become live — no half-measure left), gestalt (ONE rewriter, a SECOND lifecycle point — the architecture P.W13 already chose).

---

## Mid-tranche-friction pre-emption

- **FRICTION: the double-resolution hazard** — re-running the full pass over the flattened frame would either double-resolve the Phase-1 nodes or fail to find a `FunctionValue` where Phase 1 already wrote a concrete leaf (the exact ambiguity `B1-kf-emerging` flags). **PRE-EMPT:** S3 scopes the second pass to the pre-flatten `decl.value` snapshot, gated by `hasPhase2Node`, idempotent over already-concrete leaves; the `idempotent-over-phase1` gate clause is the live falsification anchor — the enabling discipline is authored NOW, not discovered mid-impl.
- **FRICTION: the Phase-2 lifecycle point ambiguity** — `setTargets` (`engine.ts:1170`) re-runs `compiler.parse(this.targets)` which re-flattens from `decl.value`; the second pass must run AFTER that re-flatten reads the resolved value, not race it. **PRE-EMPT:** S2/S3 sequence the env-populate + second pass explicitly within `setTargets`, after the target binds and before the compile reads the value — the ordering is specified here, not left to impl-time discovery.
- **FRICTION: a Phase-2 node with no element (a string-only compile, `at()` before `setTargets`)** could throw on `getComputedStyle(undefined)`. **PRE-EMPT:** S2 makes the env SSR-safe (no target → the field is omitted → the node stays unresolved, the same posture Phase-1 holds for `style(--p)` today) — never a throw on the no-element path.
- **FRICTION: this wave shares `resolve-values.ts` with Q.WB2** (both add a `resolveNode` arm). **PRE-EMPT:** the two waves touch DISTINCT `FunctionValue.name` branches (`style`/`sibling-*` here, `--ident` in WB2) — no edit-collision; either order lands cleanly. Stated here so the impl ordering carries no hidden coupling.
