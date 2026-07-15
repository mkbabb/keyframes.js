# Tranche U — Audit Lane 12 · `lib-compile-resolve-validate`

**Scope:** `src/animation/compile/` (forward: frame-compiler, parse-flatten,
easing-registry, easing-option, selector, numeric-plan, adapter, plain-vars;
backward sub-zone: backward, backward-walk, backward-color, format,
format-options, densify, easing-serialize; the root emitters entry +
view-transition), `src/animation/resolve/`, `validate.ts`.

**Verdict (headline):** The FORWARD leg and the `resolve/` zone are genuinely
coherent, well-carved single pipelines; the BACKWARD leg has **accreted into a
three-emitter sprawl** (backward/, entry.ts, view-transition.ts) that copy-pastes
one refusal-probe vocabulary and breaks its own stated FORWARD-vs-BACKWARD seam,
and the compile zone's `PARSE_ERROR` honesty channel is **dead scaffold** —
un-wireable against the shipped value.js and silently weakening `validate`.

---

## Is the compile zone ONE pipeline, or accreted stages?

**Two answers, one per direction.**

- **FORWARD** (`parse-flatten` → `frame-compiler`, fed by `adapter.resolveKeyframes`,
  with `selector` / `easing-registry` / `easing-option` / `numeric-plan` as
  colocated concern-carves) is a coherent, honest pipeline. The R.W2b carves
  (selector grammar, numeric SoA plan, easing resolvers) are the right seams; the
  re-export ceremony really is dead (consumers import the real modules directly).
  `resolve/` is exemplary: ONE recursive rewriter (`core.resolveNode`) with the
  `if` / `@function` / `spring()` / element-aware arms cleanly split across
  injected-`resolveNode` files and a shared `env.ts` context. No notes on the
  forward architecture itself beyond the file-size carve (F4) and stale comments.

- **BACKWARD has accreted.** `backward/` is a sub-zone (compileToCSS + walkers +
  color densify + format), but TWO more large backward-direction emitters —
  `entry.ts` (434L) and `view-transition.ts` (393L) — live at `compile/` ROOT and
  import *from* `./backward`. All three (`compileToCSS`, `compileToEntry`,
  `compileToViewTransition`) are the SAME shape: walk declared template stops →
  probe a per-animation refusal vocabulary → project `{ css, eligible, refusals }`.
  They independently re-implement that vocabulary (F2) and violate the sub-zone's
  own charter that BACKWARD lives in `backward/` with "zero forward↔backward edges"
  (F3). This is the lane's central structural debt.

---

## Findings (severity-ranked)

### F1 — MAJOR · The `PARSE_ERROR` diagnostics channel is dead scaffold (chronic deferral since K)
`compile/adapter.ts:246-249` declares an `onParseError` sink, then
`void onParseError` — it is **never passed to a parser**. `parseCSSStylesheet` is
called bare at `adapter.ts:256,260`, and value.js 3.1.0's shipped signature is
`parseCSSStylesheet: (input: string) => Stylesheet`
(`node_modules/@mkbabb/value.js/dist/parsing/stylesheet.d.ts:3`) — it accepts **no
error callback**. So a `PARSE_ERROR` `Diagnostic` can never be produced. The
comment "Authored here; populated when that producer lands" (`adapter.ts:245`) has
stood since K across five tranches; the producer has NOT landed.

Downstream this silently weakens the trust surface: `validate.ts:156-159` computes
`parseable` by branching on `d.code === "PARSE_ERROR"` — a code that never fires —
so `parseable` collapses to `css.trim().length > 0 && !EMPTY_PARSE`. A block with a
malformed declaration that value.js partially parses is reported `parseable: true`.
The whole `DiagnosticCode.PARSE_ERROR` union member + `OnParseError` import +
`onParseError` sink is unreachable code masquerading as an honesty channel.

**Proposal (gestalt):** This is a value.js **consume-edge charter**, not a kf patch.
Charter the coordination letter asking value.js's active tranche for a
diagnostics-returning parse (an `onParseError`-accepting `parseCSSStylesheet`, or a
`{ ast, diagnostics }` return). Until it lands, **excise the dead scaffold** (the
`PARSE_ERROR` member, the `onParseError`/`void onParseError` pair, and the
`parseable`-flips-on-PARSE_ERROR claim in validate's doc) rather than ship an
un-fireable branch — "NO legacy code" applies to dead honesty channels most of all.
Wire it in one motion the moment value.js exposes the producer.

### F2 — MAJOR · Three backward emitters copy-paste ONE refusal-probe vocabulary
The CC-3 per-animation eligibility probes are re-implemented three times with
drift risk:
- **empty-declared / computed-drift:** `backward.ts:206 findComputedDrift` ≡
  `entry.ts:171 emptyDeclared` — byte-identical logic, two names.
- **custom-renderer loop:** `backward.ts:246-258` ≡ `entry.ts:252-259` ≡
  `view-transition.ts` (via compileChild) — the same
  `for (frame) if (!usesDefaultRenderer(frame.transform))`.
- **scroll-grammar sniff:** `entry.ts:220-228` ≡ `view-transition.ts:184-198` —
  the same `(animation as … & { scrollOptions? }).scrollOptions != null` cast.
- **color-track probe:** `entry.ts:158-168 hasColorTrack` and `backward-color.ts`
  color-key collection re-walk `parsedVars` for `isColorUnit` independently.
- **the `formatCSS` try/catch artifact tail** is duplicated verbatim at
  `backward.ts:466-472`, `entry.ts:428-433`, `view-transition.ts:387-391`.

**Proposal:** Extract `compile/backward/refusal-probes.ts` — the per-animation
eligibility predicates (`emptyDeclared`, `usesCustomRenderer`, `scrollGrammar`,
`colorTrack`, `computedDrift`) as ONE typed vocabulary, and a `formatOrRaw(raw,
printWidth)` tail helper. Each emitter then COMPOSES the shared probes and adds only
its role-specific refusals (entry's 6, VT's 4). One definition, one place the
trust-surface semantics live — the same DRY discipline `resolve/` already models.

### F3 — MAJOR · The FORWARD/BACKWARD seam is violated by the root emitters (colocation edict)
`backward/index.ts:8-13` declares the zone's law: "The FORWARD leg … stays in
`compile/` root — the real seam is FORWARD vs BACKWARD (a18: zero forward↔backward
edges)." Yet `entry.ts` and `view-transition.ts` are BACKWARD-direction emitters
(JS orchestration/animation → zero-runtime CSS) living in the FORWARD home and
importing across the seam from `./backward` (`entry.ts:46-50`,
`view-transition.ts:43-55`). They are backward code in the forward directory —
exactly the accretion the owner's grand-restructuring edict targets.

**Proposal:** Re-home both under the backward sub-zone as
`compile/backward/emitters/` (alongside `compileToCSS`, which is the parent of the
byte-reused `compileChild` pipeline both consume). This restores the stated
FORWARD-in-root / BACKWARD-in-`backward/` invariant, colocates the three siblings
that share `refusal-probes.ts` (F2), and makes `compile/index.ts` re-export the
backward surface from ONE sub-zone barrel instead of two roots + a sub-zone.

### F4 — MAJOR · Five files exceed the 350L carve ceiling; each has a clean seam
- **`backward.ts` (475L):** `compileChild` alone is 165L (223-388) with five inline
  refusal blocks. Carve the refusal blocks into F2's `refusal-probes.ts`; the
  residual `compileChild` becomes a thin project-or-refuse composition.
- **`frame-compiler.ts` (458L):** the var-reconciliation graph
  (`buildVarIndex` 263-276 + `reconcileVars` 286-331) is a separable concern from
  the addFrame/createFrame/finalize template machinery — carve
  `compile/reconcile.ts` (free functions over `parsedVars`/`frames`), leaving the
  class as template-in → frames-out.
- **`entry.ts` (434L)** and **`view-transition.ts` (393L):** split
  refusal-DETECTION (`detectRefusal`/`emitRole` probes) from rule-ASSEMBLY
  (`transitionList`/`renderDecls`/pseudo-emit) — the detection half largely
  dissolves into F2's shared probes.
- **`backward-color.ts` (353L):** at the ceiling; acceptable as one cohesive color
  concern, but the local `isColorUnit`/`percentOf` (F7) should leave.

**Proposal:** The carves above; each is a concern-seam, not a mechanical split.

### F5 — MINOR · Stale `resolve-values.ts` filename references (dead-file residue)
`adapter.ts:112-113` and `element-resolve.ts:18` reference `resolve-values.ts` — a
file that was renamed to `resolve/core.ts` at S.B4. The references point at nothing.
**Proposal:** Re-point to `resolve/core.ts` (or delete the sentence) as part of the
comment sweep — no code moves.

### F6 — MINOR · Stale "value.js-P-gated / no-op seam" comments contradict live code
`adapter.ts:112` ("the inlining that CONSUMES it is the value.js-P-gated seam"),
`adapter.ts:290` ("consumed by the value.js-P-gated `@function` inlining arm (today
a no-op seam)"), and `env.ts:39` ("call-inlining that CONSUMES it is
value.js-P-gated") all describe the `@function` inlining as an un-landed gated
no-op. It is **LIVE** (`core.ts:87` dispatches to `resolveFunctionCall`,
`resolve-function.ts` fully implements bind→coerce→substitute→evaluate). Likewise
`adapter.ts:96-102` calls per-keyframe `composition` honoring "BOOKed, not
half-wired" — it IS wired (`engine/css/css-animation.ts:250` consumes
`resolved.composition`). **Proposal:** Comment sweep to match the live code; owner's
"NO legacy code" covers comments asserting a shipped feature is still deferred.

### F7 — MINOR · Primitive re-implementations of value.js/sibling helpers (DRY)
- `backward-color.ts:52-55` defines a LOCAL `isColorUnit` (`.unit === "color"`)
  while value.js EXPORTS `isColorUnit` (used correctly in `plain-vars.ts:28`).
- `backward-color.ts:136 percentOf` ≡ `densify.ts:23 percentOfStart` — the same
  `/([\d.]+)\s*%/` extraction, two copies.
- `frame-compiler.ts:127-128` has a no-op self-assignment `else if (typeof start
  === "string") { start = start; }`.
**Proposal:** Consume value.js's `isColorUnit`, hoist ONE `percentOf` into the
backward sub-zone, drop the no-op branch. Trivial, but each is legacy residue.

### F8 — MINOR · Version-pinned historical comments spread across a dep that is now 3.1.0
The zone is annotated with a spread of stale value.js version anchors — "value.js
0.12.0" (`adapter.ts:129`), "value.js 0.13.0" (`validate.ts:27`), "value.js 1.2.0
bug" (`resolve-function.ts:49`, `coerceArg`), "value.js ≥ 1.2.0" (`parse-flatten.ts`),
"value.js 2.0.x" (`resolve-function.ts:22`) — while the installed dep is **3.1.0**.
Several describe bugs since fixed upstream (the R.W3 §2C recovery apparatus is
already noted DELETED but the surrounding prose still narrates the 1.2.0 bug).
**Proposal:** A single consume-edge comment sweep pinned to the CURRENT value.js
minor, folding the historical bug-narration into the git history it belongs in — an
architectural-hygiene pass, not per-comment archaeology.

---

## What U must charter

- **Charter the value.js consume-edge for parse diagnostics** — a
  diagnostics-returning `parseCSSStylesheet` (onParseError callback or `{ ast,
  diagnostics }`); until it lands, EXCISE the dead `PARSE_ERROR`/`onParseError`
  scaffold in `adapter.ts` and correct `validate`'s `parseable` contract (F1).
- **Charter `compile/backward/refusal-probes.ts`** — one per-animation eligibility
  vocabulary + a `formatOrRaw` tail, composed by all three backward emitters (F2).
- **Charter re-homing `entry.ts` + `view-transition.ts` under
  `compile/backward/emitters/`** — restore the FORWARD-in-root / BACKWARD-in-sub-zone
  seam and honor the colocation edict (F3).
- **Charter the >350L carves** — `backward.ts`→refusal-probes, `frame-compiler.ts`→
  `reconcile.ts`, `entry.ts`/`view-transition.ts` detection-vs-assembly splits (F4).
- **Charter a compile/resolve comment-hygiene sweep** — dead `resolve-values.ts`
  refs, stale "value.js-P-gated"/"BOOKed" claims that contradict live code, and the
  version-pinned historical prose re-anchored to value.js 3.1.0 (F5, F6, F8).
- **Charter the primitive-dedup** — consume value.js `isColorUnit`, one `percentOf`,
  drop the no-op self-assign (F7).
