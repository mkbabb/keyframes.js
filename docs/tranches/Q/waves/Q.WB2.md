# Q.WB2 — `@function` CALL-inlining: bind → substitute → coerce → evaluate a registered `--ident(args)` over the already-threaded `ctx.functions` registry (GATED on value.js 1.2.0 dashed-call parse)

**Band:** B — Engine-perf + emerging-CSS Phase-2 · the "lead the platform" capability (the `@function` arm).
**Phase:** **GATED** — fires atomically on the value.js 1.2.0 dashed-function-CALL parse arm (`--ident(args)` → `FunctionValue('--ident', [arg0, …])`). The DEFINITION-registry half (`extractFunctions`) ALREADY ships in value.js 1.1.0 and kf 4.4.0 ALREADY consumes it (`adapter.ts:282` `extractFunctions(ast)`, threaded onto `ResolveContext.functions`). The ONLY gate is the CALL-parse arm — confirmed absent today (`B1-kf-emerging` GAP 3: `--double(2)` → a bare `ValueUnit`, args dropped, name undefined). The kf inlining arm is authored NOW as a typed seam over the threaded registry; it lands greenable the moment value.js 1.2.0 publishes.
**Sequence (DAG edges):** `Q.WG1 parse-that 0.13.0 ─► Q.WG2 value.js 1.2.0 (the dashed-call parse arm) ─► Q.WG4 kf GATED consume (re-pin ^1.2.0) ─► Q.WB2`. Per the charter DAG §3 chain: this wave is the kf consume that fires on the value.js 1.2.0 publish. Shares the `resolve-values.ts` rewriter with Q.WB1 (distinct `FunctionValue.name` branch — `--ident` vs `style`/`sibling-*`; no edit-collision).
**Owning-DM-or-idea:** `B1-kf-emerging` GAP 3 + the proposed `Q.W-VJ-FNCALL`→`Q.W-EMERGE-FN` chain, and `B5-kf-engine-arch` Q.W-ENG6 (`@function` call-inlining over the value.js-P-gated call-parse). The owner directive: **the library LEADS the platform.** `@function` (CSS Mixins L1) is Chrome-139-shipped; kf inlining it at compile time makes `@function`-bearing keyframes animate in EVERY browser — the same "library leads" remit P.W13 named.

---

## Context

### The breach — a typed seam over a registry that is wired, but a call site that does not parse

P.W13 threaded the `@function` DEFINITION registry NOW (the half kf owns) and left the CALL-inlining as a typed seam GATED on value.js. The current state (`B1-kf-emerging` GAP 3, confirmed on the tree):

1. **The registry is already collected and threaded** — `adapter.ts:282` calls value.js `extractFunctions(ast)` (shipped 1.1.0, mirroring `extractProperties`), populates `ResolvedKeyframes.functions` (`adapter.ts:104`), and threads it into the `ResolveContext` via `makeResolveContext(functions, env)` (`adapter.ts:283`). `ResolveContext.functions: Map<string, CustomFunctionDescriptor>` (`resolve-values.ts:80`) is live.
2. **The inlining seam is typed but inert** — `resolveNode` (`resolve-values.ts:402-406`) already branches on `node.name.startsWith("--") && ctx.functions.has(node.name)` and returns the node UNCHANGED with the comment "Registry present, call-parse pending — return UNCHANGED (no guess). (When value.js-P lands: bind + substitute + evaluate here.)" The `ctx.seen` cycle-guard (`resolve-values.ts:84`) is threaded for exactly this arm.
3. **The call site does NOT parse** — value.js's generic producer drops a dashed-function call's args today: `--double(2)` → a bare `ValueUnit` (name `undefined`, args dropped), so the call never reaches `resolveNode` as a `FunctionValue("--double", [2])`. The arm is genuinely MEASURE-FIRST-blocked on the sibling publish (the inv-16 wall — kf cannot prototype this in-realm).

The chronic: P.W13's `proof:emerging-css-resolve-vjs-p` row (items 3+4) is "born-RED, PENDING the value.js-P call-parse publish." Under Q's no-deferral mandate, the gate that fires it (the dispatch to value.js 1.2.0) is authored NOW (Q.WG2), and the kf consume (this wave) is a complete terminal spec gated on that publish — NOT a perpetual punt.

### The cure — bind → substitute → coerce → evaluate (the `@function` lowering, in one `resolveNode` arm)

When value.js 1.2.0 publishes the dashed-call parse (`--double(2)` → `FunctionValue("--double", [ValueUnit(2)])`), the inert seam at `resolve-values.ts:402` becomes the live inlining arm:

- **bind** — look up `ctx.functions.get(node.name)` (the `CustomFunctionDescriptor`: its ordered parameter list + each param's registered `<syntax>` + default + the `result` expression). Positionally bind the call's args (`node.values`) to the descriptor's parameters; a missing positional takes the param's default; a surplus arg → guaranteed-invalid → DROP.
- **coerce (the genuinely-hard part — `B1-kf-emerging` TYPED-ARG COERCION)** — the CSS Mixins L1 spec validates each bound arg against the param's registered `<syntax>` at computed-value time and falls back to the param default on a type mismatch. kf coerces each bound arg through value.js's `@property` syntax-validator (the SAME validator the `@property` registry uses — confirmed value.js owns it) against the param's `<syntax>`; a coercion failure substitutes the param default (the spec fallback), never a NaN.
- **substitute** — replace each `var(--param)` reference in the `result` expression with its bound-and-coerced value (the descriptor's `result` is a parsed expression; substitution is a node rewrite, not a string splice).
- **evaluate** — recurse `resolveNode` over the substituted `result` so a nested `calc()`/`if()`/another `--fn()` inside is lowered too (e.g. `@function --double(--x) { result: calc(var(--x) * 2) }` → substitute `var(--x)` → `calc(50px * 2)` → the `calc` evaluates to `100px`). The recursion is cycle-guarded by `ctx.seen`: push `node.name` before recursing into its `result`, pop after; a self-referential `@function` (`--a` calls `--a`) hits the guard and DROPs (guaranteed-invalid), never infinite-loops.

The result is the SAME node type (a concrete `ValueUnit`/`FunctionValue`), so frame-compile + interpolation run EXACTLY as today — the frame pair holds the doubled concrete value where it held an unresolved `--double(args)` call.

### The cycle-guard + typed-coercion are the falsification anchors (the FRICTION P.W13 named)

`B1-kf-emerging` flags two traps the gate must bite: (1) the typed-arg coercion needs value.js's `@property` syntax-validator on the resolve path — confirm in the Q.WG2 dispatch that value.js exposes it for kf to import (it does — the `@property` registry uses it); (2) a self-reference must DROP, not hang. Both are gate-asserted (S3) so the born-RED truth holds and the cure cannot ship a NaN coercion or a stack-blow.

### Audit evidence

| Ref | Source location | Fact (verified 2026-06-23) |
|-----|-----------------|------------------------------|
| registry-threaded | `src/animation/adapter.ts:282-283` | `extractFunctions(ast)` collected + `makeResolveContext(functions, env)` threads it onto `ResolveContext.functions` (shipped 4.4.0) |
| registry-field | `src/animation/resolve-values.ts:78-80` | `ResolveContext.functions: Map<string, CustomFunctionDescriptor>` — keyed by dashed name (`--double`) |
| inert-seam | `src/animation/resolve-values.ts:402-406` | `node.name.startsWith("--") && ctx.functions.has(node.name)` → returns UNCHANGED, comment "call-parse pending … When value.js-P lands: bind + substitute + evaluate here" |
| cycle-guard-threaded | `src/animation/resolve-values.ts:83-84` | `seen: Set<string>` — the function-call cycle-guard, threaded NOW, consumed ONLY by this arm |
| call-does-not-parse | value.js 1.1.0 (`B1-kf-emerging` GAP 3) | `--double(2)` → a bare `ValueUnit` (args dropped, name undefined) — the call site does NOT parse; the inv-16 wall |
| extractFunctions-shipped | value.js 1.1.0 (`B1-kf-emerging` GAP 3) | `extractFunctions` (the DEFINITION registry collector) confirmed in `dist/index.d.ts` + `src/parsing/extract.ts:124`; kf 4.4.0 consumes it |
| typed-coercion-validator | value.js `@property` registry (`B1-kf-emerging` TYPED-ARG note) | value.js owns the `<syntax>` validator the `@property` registry uses — the SAME validator kf coerces bound args through; confirm exposed in the Q.WG2 dispatch |
| vjs-p-gate-row | P.W13 `proof:emerging-css-resolve-vjs-p` | the PENDING row (items 3 @function inline + 4 cycle-guard), born-RED until the call-parse publishes — this wave's gate inherits it |

---

## Scope

Each S-clause is concrete + falsifiable. The arm is ONE `resolveNode` branch over the already-threaded registry — no new module, no new context shape.

- **S1 — the bind + substitute + evaluate arm (over the threaded registry).** Activate the inert `resolve-values.ts:402` seam: on a `FunctionValue` whose dashed name is in `ctx.functions`, bind params → args (default-fill, surplus → DROP), substitute into the `result` expression, recurse `resolveNode` over the substituted result (nested `calc`/`if`/`--fn` lowered). Cycle-guarded by `ctx.seen` (push name → recurse → pop; self-reference → DROP).
- **S2 — the typed-arg coercion (the hard part).** Coerce each bound arg through value.js's `<syntax>` validator against the param's registered syntax; a mismatch substitutes the param default (the CSS Mixins L1 fallback), never a NaN. GATED on the Q.WG2 dispatch confirming value.js exposes the validator on the resolve path.
- **S3 — the born-RED gate (the live observable + the cycle-guard + the coercion).** `proof:emerging-css-resolve-fn` (graduating the P.W13 PENDING `proof:emerging-css-resolve-vjs-p` row to a live behaviour gate) — a jsdom test that lowers `width: --double(50px)` against a registered `@function --double` and asserts the frame holds `100px`; a self-referential `@function` DROPs (never hangs); a type-mismatched arg falls back to the default.
- **S4 — the GATED re-pin + the consume edge.** The kf `package.json` re-pin to value.js `^1.2.0` (Q.WG4) is the atomic edge that fires this wave; before the publish the arm is a born-RED typed seam, after it is green. No kf wave consumes the unpublished surface (the inv-16 / DAG discipline).

---

### S1 — the bind + substitute + evaluate arm (the inert seam made live)

**Breach.** `resolve-values.ts:402-406` returns the `--ident(args)` call UNCHANGED — the registry is present but the call-parse is pending, so the arm is a no-op. When value.js 1.2.0 parses the call, the seam must do the actual lowering, or an `@function`-bearing keyframe reaches the frame compiler as an unresolved call and flattens to nonsense.

**Cure.** Replace the `return node` no-op with the lowering:
1. `const desc = ctx.functions.get(node.name)` — the descriptor (params + `result` expression).
2. Bind `node.values` (the call args) to `desc.parameters` positionally; a missing positional → the param's default; a surplus arg → `return DROP` (guaranteed-invalid call shape).
3. If `ctx.seen.has(node.name)` → `return DROP` (cycle — a self-reference resolves to guaranteed-invalid, never an infinite loop). Else `ctx.seen.add(node.name)`.
4. Substitute each `var(--param)` in `desc.result` with its bound value (a node rewrite over the parsed `result` expression).
5. `const out = resolveNode(substituted, { ...ctx, depth: ctx.depth + 1 })` — recurse so nested `calc`/`if`/`--fn` lower too.
6. `ctx.seen.delete(node.name)` (pop the cycle-guard); `return out`.

The recursion rides the EXISTING `MAX_RESOLVE_DEPTH` ceiling (`resolve-values.ts:90`) AND the `seen` set — two independent guards (depth bomb + cyclic reference).

**Gate bite.** `proof:emerging-css-resolve-fn` `inline-evaluates` clause: `width: --double(50px)` with `@function --double(--x) { result: calc(var(--x) * 2) }` → the compiled frame's `width` is `100px`. BITE: leaving the seam as `return node` → the frame carries the literal `--double(50px)` call → the `100px` assertion reds.

---

### S2 — the typed-arg coercion (the genuinely-hard part)

**Breach.** A bound arg may not match the param's registered `<syntax>` (e.g. `--double(red)` where `--x` is `<length>`). The CSS Mixins L1 spec validates each arg at computed-value time and falls back to the param default on a mismatch. A naive substitution would splice `red` into `calc(red * 2)` → a NaN/garbage frame.

**Cure.** Before substitution (S1 step 4), coerce each bound arg through value.js's `<syntax>` validator (the SAME validator value.js's `@property` registry uses — confirmed value.js owns it; the Q.WG2 dispatch confirms it is EXPOSED on the resolve path, so kf imports it rather than re-authoring a validator). For each `(param, arg)`: if `arg` validates against `param.syntax`, use it; else substitute `param.default` (the spec fallback). A param with no default AND a mismatched arg → guaranteed-invalid → DROP. Never produce a NaN-bearing substitution.

**Constraint (inv-16 — kf does not re-author the validator).** kf consumes value.js's published `<syntax>` validator; it does NOT hand-roll a parallel syntax checker (that would be a foreign-realm duplicate of value.js's grammar). The Q.WG2 dispatch's terminal-or-KILL clause confirms value.js exposes the validator for resolve-path consumption (it already drives `@property`); if value.js declines to expose it, the coercion arm KILLs to "presence-validate only" (the arg substitutes as-parsed, no `<syntax>` check) — a recorded fork, never a perpetual block.

**Gate bite.** `proof:emerging-css-resolve-fn` `coerce-fallback` clause: `--double(red)` with `--x: <length>` default `0px` → the frame's `width` is `0px` (the default fallback), NOT `NaN` or `calc(red * 2)`. BITE: substituting `red` un-coerced → the `calc` produces NaN → the `0px`-fallback assertion reds.

---

### S3 — the born-RED gate (graduating the P.W13 PENDING row to a live behaviour gate)

**Breach.** P.W13's `proof:emerging-css-resolve-vjs-p` is a PENDING source-anchor row (items 3+4), un-greenable in-realm until the call parses. There is no LIVE behaviour gate over the inlining + the cycle-guard + the coercion.

**Cure.** Author `scripts/proof-emerging-css-resolve-fn.mjs` + `test/emerging-css-resolve-fn.test.ts` (source-grep half CHAINED with behaviour half — the Phase-1 gate idiom). The behaviour half is the REAL observable:
1. **inline-evaluates** — `width: --double(50px)`, `@function --double(--x) { result: calc(var(--x) * 2) }` → frame `width` is `100px`.
2. **nested-lowering** — `--double(--triple(10px))` with both registered → `60px` (10×3×2) — the recursion lowers the nested call.
3. **cycle-guard** — `@function --a(--x) { result: --a(var(--x)) }` (self-reference) → the declaration DROPs (the property omitted), never hangs; the test asserts completion within a bounded tick.
4. **coerce-fallback** — `--double(red)` with `--x: <length>` default `0px` → `0px`, not NaN.

Born-RED today: the call does not parse (the arm never fires), so all four assertions fail on the current tree (the literal `--double(...)` reaches the frame). After value.js 1.2.0 publishes + the kf re-pin (Q.WG4), the arm activates and the gate greens. The source-grep half names post-cure anchors (the bind/substitute/evaluate body replacing the `return node` no-op at `resolve-values.ts:402`, the `ctx.seen.add`/`.delete` cycle-guard calls, the `<syntax>` coercion import) absent from the uncured source.

**The plant-a-failure.** On the cured tree, regress the cycle-guard to skip `ctx.seen.add` → the self-referential `@function` infinite-loops past the depth ceiling and (with the ceiling) DROPs but burns 32 frames of recursion — the `cycle-guard` clause asserts the DROP happens at the FIRST re-entry (via `seen`), not the depth ceiling, so the regression reds. Or regress the coercion to substitute un-validated → `--double(red)` produces NaN → the `coerce-fallback` clause reds. Each witness is a live lowering, never a grep.

---

## Born-RED gate

**Gate:** `proof:emerging-css-resolve-fn` (NEW — `scripts/proof-emerging-css-resolve-fn.mjs` CHAINED with `vitest run test/emerging-css-resolve-fn.test.ts`), graduating the P.W13 PENDING `proof:emerging-css-resolve-vjs-p` row to a live behaviour gate. Born-RED on today's tree: the call does not parse, the arm is inert.

| Clause | The REAL observable | Born-RED witness |
|--------|----------------------|--------------------|
| `inline-evaluates` (KEYSTONE) | `--double(50px)` → `100px` against the registered descriptor | the call → bare `ValueUnit` (un-parsed) → literal reaches frame → RED |
| `nested-lowering` | `--double(--triple(10px))` → `60px` (the recursion lowers nested calls) | no inlining arm → literal nested call reaches frame → RED |
| `cycle-guard` | a self-referential `@function` DROPs at first re-entry, never hangs | no `seen` push/pop active → (and no call parses) → RED |
| `coerce-fallback` | `--double(red)` with `<length>` default → `0px`, not NaN | no coercion arm → (and no call parses) → RED |

**Green condition.** value.js 1.2.0 publishes the dashed-call parse + exposes the `<syntax>` validator; the kf re-pin to `^1.2.0` (Q.WG4) fires; the `resolve-values.ts:402` seam activates — bind → coerce → substitute → evaluate, cycle-guarded; the live jsdom test reads the doubled/nested/fallback concrete value off the compiled frame. The P.W13 Phase-1 + Q.WB1 Phase-2 gates stay GREEN (no regression to the other arms).

---

## Dependencies

- **value.js 1.2.0 (the dashed-call parse arm) — GATED PUBLISH (Q.WG2 dispatch → Q.WG4 consume).** The ONE gate. The dispatch (`KF-TO-VALUEJS-Q.md`, authored Q.WG2) asks value.js for `--ident(args) → FunctionValue('--ident', [args])` AND confirms the `<syntax>` validator is exposed on the resolve path. Terminal-or-KILL: if value.js declines the call-parse, this wave KILLs (the seam stays inert, recorded) — never a perpetual block. inv-16 holds (kf authors only the consume; the parse is the sibling's).
- **value.js 1.1.0 (`extractFunctions`) — ALREADY published + consumed.** The DEFINITION registry half is done (`adapter.ts:282`); only the CALL-parse half gates.
- **The `ctx.functions` registry + `ctx.seen` cycle-guard + the inert seam — already shipped** (`adapter.ts:282-283`, `resolve-values.ts:80,84,402`). This wave activates the seam P.W13 built; NO new context shape, NO new module.
- **Independent of Q.WB1/WB3/WB4.** Shares `resolve-values.ts` with Q.WB1 (distinct `FunctionValue.name` branch — no edit-collision). File surfaces: `src/animation/resolve-values.ts` (the `--ident` arm at :402), `scripts/proof-emerging-css-resolve-fn.mjs` (NEW), `test/emerging-css-resolve-fn.test.ts` (NEW), `package.json` (the `^1.2.0` re-pin — shared with Q.WG4).

---

## dev→impl boundary

This file is the Tranche Q DEVELOPMENT spec for Q.WB2 — **DOCS ONLY.** It writes zero source (inv-16: the parse half is the value.js dispatch Q.WG2; the kf consume opens only after the gated publish). On owner authorization + the value.js 1.2.0 publish + the Q.WG4 re-pin, the `resolve-values.ts:402` seam activates + the gate file opens — gate-first (`proof:emerging-css-resolve-fn` authored born-RED BEFORE the arm activates), observable-truth (the live jsdom lowering, NOT a grep), no-legacy (the inert seam becomes the live arm — no dead parallel), gestalt (ONE `resolveNode` branch over the threaded registry — not a per-function hack). The GATED phase means NO kf source is touched until the sibling publishes — the inv-16 / DAG-ordered discipline.

---

## Mid-tranche-friction pre-emption

- **FRICTION: authoring the inlining before the call parses** — the exact P.W13 mid-tranche trap (the arm cannot even born-RED because nothing parses `--double(2)`). **PRE-EMPT:** this wave is GATED, not NOW — the kf arm is a typed seam over the threaded registry NOW; it lands greenable only on the value.js 1.2.0 publish + the Q.WG4 re-pin. The DAG edge (Q.WG2 → Q.WG4 → Q.WB2) names the EXACT publish that fires it; no kf source is touched until then.
- **FRICTION: the typed-arg coercion needs a validator kf does not import today** — `B1-kf-emerging` TYPED-ARG note. **PRE-EMPT:** S2 confirms value.js exposes its `<syntax>` validator on the resolve path in the Q.WG2 dispatch (it already drives `@property`), so kf consumes the published validator (inv-16 — no re-authored parallel checker); the dispatch's terminal-or-KILL has a recorded fallback (presence-validate-only) if value.js declines.
- **FRICTION: a self-referential `@function` could blow the stack** before the depth ceiling. **PRE-EMPT:** S1 threads the `ctx.seen` cycle-guard (push name → recurse → pop) so a self-reference DROPs at FIRST re-entry, independent of (and tighter than) the `MAX_RESOLVE_DEPTH` ceiling; the `cycle-guard` gate clause asserts the DROP is via `seen`, not the depth bomb.
- **FRICTION: the dispatch could become a perpetual punt** (the P-inv-28 risk). **PRE-EMPT:** the Q.WG2 dispatch carries a terminal-or-KILL clause (charter §3 friction-chain 4); this wave KILLs to a recorded inert-seam state if value.js declines, never an open-ended wait.
