# P.W13 — the emerging-CSS resolution pass (`resolve-values.ts`): if() · @function · spring() · sibling-index() lowered to concrete animatable values

**Band:** B — Engine (feature) · the "lead the platform" capability.
**Phase:** **NOW** for `if()` + `spring()` (value.js ALREADY parses both — `parsing/index.ts:310` / `parsing/easing.ts:184`); **value.js-P-gated (SMALL)** for `@function` call-inlining (`extractFunctions()`) + `sibling-index()`/`sibling-count()` parse arms.
**Sequence:** `P.W1 apparatus ─► P.W13` (consumes the resolve seam); independent of P.W2/P.W3 (a different concern — value lowering, not blend/egress). Researched 2026-06-22 (`docs/tranches/P/EMERGING-CSS-RESEARCH.md`).
**Owning-idea:** the owner directive (2026-06-22) — **novel CSS features SHOULD be supported in our grammar + engine; the library LEADS the platform, browsers catch up.** The precedent is `springTimingFunction`/`springLinearStops`: the engine already computes a value (a spring `linear()`) the platform lacks. This wave generalizes that to one compile-time lowering pass.

## Why (the grounded capability — NOT a contrivance)

The contrivance smell-test's "speculative dependency" clause does **not** apply to a grammar+engine library proactively supporting standardized + emerging CSS — that is the library's *remit*. And the parser side is **largely already shipped** (value.js O.W4): the net-new work is a self-contained kf lowering pass, mirroring an existing pattern. Three of the four features are real, Chromium-shipped CSS today (`if()` Chrome 137, `@function` Chrome 139, `sibling-index()` Chrome Canary; `spring()` WebKit-only). kf resolving them at compile time makes that CSS animate in **every** browser — exactly as `springLinearStops` gives every browser a spring via `linear()`.

## The seam + the module (the gestalt — ONE pass, not per-feature hacks)

**Seam:** between `resolveKeyframes` (`adapter.ts`) and `FrameCompiler.parse → parseAndFlattenObject` (`utils.ts`), at flatten time — each keyframe value lowers to a concrete value BEFORE frame compilation, so the frame pair holds two concrete values and **interpolation runs exactly as today** (zero hot-path change).

**New module `src/animation/resolve-values.ts` (HEAVY — imports value.js `FunctionValue`/`ValueUnit`):**
```
resolveValues(value, ctx) -> same node types (ValueArray | FunctionValue | ValueUnit)
  ctx = { functions: Map<name,CustomFunctionDescriptor>, properties: Map, env: { matchMedia?, supports?, customProps?, siblingIndex?, siblingCount? }, seen: Set, depth }
```
A recursive rewriter that, per `FunctionValue.name`:
- **`if`** — evaluate each clause's condition in source order: `supports(...)`→`CSS.supports` (sync, SSR-safe), `media(...)`→`matchMedia(...).matches` (the engine already uses `matchMedia` in `smooth.ts:27`/`spring.ts:160`), `style(--p: v)`→read the resolved custom-prop; first-true wins; `else` is the fallback; **no-branch-no-else → guaranteed-invalid → drop the declaration** (do NOT emit empty-string — it would corrupt interpolation). Re-resolve on a `matchMedia('change')` (the `layoutEpoch` re-resolution model already exists for `cq*`).
- **`--foo(args)`** (a dashed-function `@function` call) — bind the descriptor's params to the args (default → guaranteed-invalid order), substitute into the `result` expression, evaluate nested `calc`/`if`, return the concrete value. Cycle-guarded by `seen`.
- **`spring(mass stiffness damping velocity)`** — the natural fit: `springCssToOptions(m,k,c,v0)` → `{ response: 2π·√(m/k), dampingFraction: c/(2·√(k·m)), initialVelocity: v0 }` → the EXISTING `SpringProgress`/`springTimingFunction` (kf already owns the physics). `duration: auto` derives from the solver settle-time (the `maxDuration` logic).
- **`sibling-index()` / `sibling-count()`** — read the element's 1-based index / sibling total at compile → an integer `ValueUnit` (a natural fit for `stagger`).

## Born-RED gate

`proof:emerging-css-resolve` (NEW) — a live, observable-truth gate (the resolution is real, not a grep): compile a keyframe whose endpoints use each feature and assert the engine animates to the **resolved concrete value**, in a browser that does NOT natively support the feature (the lead-the-platform proof):
1. `if(supports(color: lch(0 0 0)): red; else: blue)` on a child → the compiled frame holds the resolved color (`red` where supported, `blue` else) — NOT the literal `if(...)` string.
2. `transition-timing-function: spring(1 100 10 0)` → the engine drives the SpringProgress curve (sample-equal to `springTimingFunction({response, dampingFraction})`), HW-accel held on WebKit per the existing CE-1.0 `linear()` rule.
3. `--double(--x)` with `@function --double(--x){ result: calc(var(--x) * 2) }` → the frame holds the doubled concrete value.
4. cycle-guard: a self-referential `@function` resolves to guaranteed-invalid (drops), never infinite-loops.
Born-RED today: `resolve-values.ts` does not exist; the `if(...)`/`spring(...)` value reaches the frame compiler as an unresolved `FunctionValue` and the animation does not produce the conditional/spring outcome.

## Dependencies

- **`if()` + `spring()` are NOW** — value.js already parses both (`FunctionValue("if",…)` / the `spring` easing producer); kf resolves in-realm, no sibling gate.
- **`@function` call-inlining + `sibling-index()`/`sibling-count()` are value.js-P-gated (SMALL)** — the dispatch (`KF-TO-VALUEJS-P.md`) asks value.js for `extractFunctions(ast)→Map` (~10 lines, mirroring `extractProperties`) + the `sibling-index()`/`sibling-count()` parse arms + (independently) `contrast-color()` (newly Baseline). value.js parses VERBATIM; kf resolves — the division-of-labour law (`value.js parsing/index.ts:234-238`).
- The if() **multi-branch** (>1 non-else condition) is a value.js follow-up (it currently collapses to first-consequent/else); the common 2-branch case ships NOW.

## dev→impl boundary

DOCS ONLY (this spec). The `resolve-values.ts` module + the gate open on authorization. inv-16 holds (kf writes only keyframes.js; the value.js parser gaps are dispatched). Effort: `spring()` LOW (the adapter over existing physics), `if()`/`@function` MEDIUM (the resolution pass + condition evaluators), the value.js gaps SMALL. The pass is ONE module — the gestalt, not four per-feature hacks.
