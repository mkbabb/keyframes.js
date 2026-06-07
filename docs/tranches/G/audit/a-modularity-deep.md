# Tranche G audit — `a-modularity-deep`

**Lane.** The DEEP modularity assay over `src/animation/**` on `tranche-g-dev`.
EXTENDS `a-backend-godmodules` (which settled the line-count/cohesion question:
every >500L file is at gestalt or is a leaf-catalogue) with the dimensions that
lane did NOT cover: **service-boundary single-responsibility**, **dependency-
injection discipline** (constructor vs setter vs ambient), **pipeline-
orchestration tangle** (addFrame→parse→compile→interp→apply), **non-idiomatic
runtime dynamism** (any-typed dispatch, stringly-typed dispatch, dynamic property
access, escape-hatch casts), the hygiene precepts (nested imports, test-in-src,
DRY), and **documentation gaps** on the public API + hot-path contracts.

**Method.** Live `file:line` on `tranche-g-dev`: read of every structural region
of `engine.ts` (1313L verified `wc -l`), `group.ts`, the setter family, the
playback state machine, the blend kernel, `frame-compiler.ts`, `index.ts`;
`grep` of every `any` / `as unknown as` / dynamic-member-access / `switch` /
function-scoped `import` site; a cross-boundary encapsulation probe over `demo/`
source (excluding `dist/`). Disposition legend: SHIP-in-G · MEASURE-FIRST · BOOK
· KILL · RECORD · value.js-HANDOFF · parse-that-HANDOFF · glass-ui-HANDOFF ·
ALREADY-SOTA.

---

## 0. Headline

**On the DEEP modularity axes, the post-F engine is ALREADY-SOTA — and the deep
lens CONFIRMS the godmodules lane's verdict by an independent route.** The
service seams are single-responsibility; DI is constructor-injected and
idiomatic (zero service-locator, zero ambient singletons in the engine); the
pipeline is a clean staged facade; dispatch is typed-discriminated-union, not
stringly-typed; there is **zero non-idiomatic runtime dynamism** in the engine
(the only `as any` pair is the documented cross-realm parse-that cast already
owned by `G-PT-2`); **zero nested imports, zero test-in-src** (re-verified). DRY
is exemplary.

**The lane manufactures ONE net-new finding the line-count lane could not see**
— a *cross-boundary encapsulation seam*, not a within-file one: the demo
transplants three public-but-internal `Animation` fields
(`animation.options = … / .compiler = … / .unflatten = …`,
`useKeyframeOps.ts:107-109`) to avoid a double-compile, because the engine
exposes **no first-class "adopt a compiled state" method** on its service
boundary. The engine's encapsulation is breached by reach-in mutation that an
`adoptCompiled()` seam would close. **MD-1, MED, SHIP-in-G** (a small additive
engine method + the demo callsite). Everything else is ALREADY-SOTA or a thin
documentation RECORD.

| Axis | Verdict | Disposition |
|---|---|---|
| Service-boundary single-responsibility | clean seams; one missing adopt-seam | **ALREADY-SOTA + MD-1 SHIP** |
| Dependency injection (ctor/setter/ambient) | constructor-injected, idiomatic; live-options-reference contract | **ALREADY-SOTA** (MD-2) |
| Pipeline orchestration (addFrame→parse→compile→interp→apply) | clean staged facade, not a god-method | **ALREADY-SOTA** (MD-3) |
| Non-idiomatic dynamism (any/reflection/stringly dispatch) | none in-engine; one documented cross-realm cast | **ALREADY-SOTA + parse-that-HANDOFF** (MD-4) |
| Nested imports / test-in-src | zero / zero | **HONORED** (MD-5) |
| DRY | single-source physics, single clamp, single rAF owner | **ALREADY-SOTA** (MD-5) |
| Documentation (public API + hot-path contracts) | hot path exemplary; ~10 thin public methods bare | **RECORD** (MD-6) |

---

## MD-1 — the compiler-transplant seam: the demo reaches across the engine boundary to adopt a compiled state — MED, SHIP-in-G

**Cite.** `demo/@/components/custom/animation-controls/keyframes/composables/useKeyframeOps.ts:102-109`:
```ts
const compiled = new CSSKeyframesAnimation(options, ...animation.targets)
    .fromKeyframes(keyframes);
animation.options = compiled.options;     // :107
animation.compiler = compiled.compiler;   // :108
animation.unflatten = compiled.unflatten; // :109
```
The engine side: `compiler!: FrameCompiler<V>` is a **public mutable field**
(`engine.ts:98`); `options: AnimationOptions` public mutable (`:89`); `unflatten`
public (`:142`). The transplant is the ONLY place in `demo/` source that writes
engine internals across the boundary (grep-verified: zero writes to
`_grouped`/`_entries`/`_interpOut`/`_stableKeys`/`resolvePromise`/`_boundFrame`
etc. — those stay private; only this triad is reachable, and only because the
fields are `public`).

**Why it is a genuine deep-modularity finding (not the line-count question).**
The `a-backend-godmodules` lane verified the engine's *internal* decomposition is
at gestalt. This is the *external* service-boundary question that lane did not
ask: **does the engine expose the right verbs, or must a consumer reach in?** The
E.W8-S0 "single compile" optimization is correct and load-bearing (the comment at
`:96-101` documents it: build a throwaway, do the ONE compile, transplant rather
than re-`parse()` the live instance). But it is implemented by **mutating three
public fields of a live object** — the consumer has to know that `compiler` +
`options` + `unflatten` together constitute the "compiled state" and that the
compiler holds a *live reference* to the very `options` object it's also adopting
(the `engine.ts:229-233` constructor contract). Miss one of the three, or adopt
`compiler` without its matching `options`, and the live-options-reference
invariant the `6e29236` test-lock protects is silently violated. The engine's
encapsulation contract is **carried in a demo comment, not enforced at the seam.**

**The fix is the idiomatic adopt-seam, not a wider field-set.** A single additive
method on `Animation` — `adoptCompiled(source: Animation<V>): this` — that
transplants the `{ options, compiler, unflatten }` triad as ONE atomic motion,
re-binds the compiler's live-options reference, and recomputes `_stableKeys`,
turns three reach-in writes into one typed verb that owns its own invariant. The
demo callsite collapses to `animation.adoptCompiled(compiled)`. This is the
"no replaced surface beside its replacement / fail-explicit at the seam" Mandate
posture applied to the service boundary: the engine, not the consumer, owns the
definition of "a compiled state."

- **Disposition: SHIP-in-G (MED).** A ~10-line additive `Animation.adoptCompiled`
  + the demo callsite swap + the `_stableKeys` recompute it folds in.
- **Falsifiable instrument (named per SHIP):** `proof:adopt-compiled` — a test
  that (a) `a.adoptCompiled(b)` yields `a.compiler === b.compiler` AND
  `a.options === a.compiler.options` (the live-options reference re-bound, the
  `6e29236` invariant held through the adopt), and (b) `a.flatKeys` reflects
  `b`'s compiled key-set (the `_stableKeys` recompute fired). **BITE:** transplant
  `compiler` WITHOUT re-binding `options` (the current demo's exact hazard if a
  field is dropped) → assertion (a) reds (`a.options !== a.compiler.options`).
- **Scope note:** the `compiler` field can then become `protected`/`private` set
  with a `get compiler()` accessor (the transplant is the only public writer) —
  tightening encapsulation. That widening is the SHIP's natural tail; gate it on
  the same proof.

---

## MD-2 — dependency injection is constructor-injected + the live-options-reference contract is the DI gestalt — ALREADY-SOTA

**Cite.** The engine's DI seams, each verified:

- **The compiler is constructor-composed, holding a LIVE options reference**
  (`engine.ts:233` `this.compiler = new FrameCompiler<V>(this.options)`;
  `frame-compiler.ts:110` `constructor(private options: AnimationOptions) {}` —
  a TS parameter-property, the idiomatic constructor-DI shape). The ~13 setters
  (`engine.ts:314-533`) mutate `this.options` **in place, never replacing it**
  (`:315` `this.options.timingFunction = …`, etc.), so the compiler's injected
  reference stays live — `setDuration:373` re-derives frame times,
  `setColorSpace:499`/`setHueMethod:517` re-derive colors through
  `this.compiler.renormalizeColors()`. This single live-reference is the DI
  gestalt: inject once at construction, mutate-through forever. The `6e29236`
  commit test-locks exactly this reference.
- **`RAFPlayback` is the ONE injected rAF driver** (`engine.ts:105`
  `readonly playback = new RAFPlayback()`; `group.ts:66` the same). No module
  owns a second rAF handle (re-verified — the no-nested-import grep over the loop
  modules is clean). The standalone loop AND the WAAPI shadow tick both ride
  `this.playback`, so `stop()` halts either uniformly (`:1024-1029`).
- **WAAPI eligibility is delegated to a pure function**, not an injected service
  or an ambient flag — `isWAAPIEligible(this)` (`engine.ts:964`) returns a typed
  `WAAPIEligibility` discriminated union; `playWAAPI(this)` (`:887`) does the
  delegation. The engine injects ITSELF into the stateless WAAPI module; no
  service-locator.
- **The default renderer is injected as ONE bound instance field** —
  `_defaultTransform` (`engine.ts:195`), and "did the consumer supply a custom
  transform?" is a reference comparison (`usesDefaultRenderer:199`) — typed +
  bind-proof, the documented replacement for the Symbol-tag-on-a-closure that
  `Function.prototype.bind` silently dropped. This is the *right* shape for an
  injected-strategy identity check.
- **`ScrollTimeline` takes injectable `getScrollY`/`getViewportHeight`**
  (`timeline.ts` ctor; the CLAUDE.md-named testability seam) — the one place a
  callback-injection is befitting, and it is present + idiomatic.

There is **zero ambient-singleton DI in the engine** (no module-level mutable
service the classes read), **zero over-injection** (the setters take values, not
strategy objects), and **zero service-locator**. The one ambient detector
(`withReducedMotion`/`prefersReducedMotion`, `internal/reduced-motion.ts`) is a
*capability* probe (a DOM media-query), correctly NOT injected — it is the
environment, not a dependency.

- **Disposition: ALREADY-SOTA.** The DI is constructor-injected, the
  live-options-reference is the cohesive DI contract (test-locked), and the
  injection points are exactly the ones that earn their keep. Nothing to fold.

---

## MD-3 — pipeline orchestration is a clean staged facade, not a tangle — ALREADY-SOTA

**Cite.** The `addFrame → parse → compile → interp → apply` pipeline, traced:

1. **addFrame / parse delegate to the injected compiler**
   (`engine.ts:273-288`): `addFrame` → `this.compiler.addFrame`; `parse` →
   `this.compiler.parse(this.targets)` then `this.computeStableKeys()`. The
   compile half is a SEPARATE object (`FrameCompiler`) behind a thin facade (the
   6 accessors `templateFrames`/`parsedVars`/`frames`/`frameId` +
   `flatKeys`, `:184-271`) — textbook stage separation, the D.W4 split's product.
2. **interp reads the compiled output, never re-compiles** (`interpFrames:609`
   reads `frame.allInterpVars`/`frame.flatVars`; `processFrame:721` lerps in
   place). The hot path touches ZERO compile state.
3. **apply is the `transform` callback at the tail of the SAME `processFrame`**
   (`:734-736`) — the render stage is one branch, not a tangled re-entry.

The two halves (compile = clock-free value-in→frames-out; interp = clock-driven
frames→pixels) are **separate objects with a thin contract**. The pipeline is not
a god-method: no single method spans more than one stage, and the stages
communicate only through the compiled `AnimationFrame[]` data structure. This is
the correct shape — the brief's "is it a clean pipeline or tangled?" resolves
**clean**.

One micro-observation, RECORD only: `fillForwards`/`fillBackwards`
(`engine.ts:548-554`) and `at` (`:584`) and `paintRest` (`:572`) all route
through `interpFrames` — the SINGLE interp entry point — so even the
fill/rest/query surface funnels through one stage (no parallel interp path). DRY
on the orchestration itself.

- **Disposition: ALREADY-SOTA.** The pipeline is a staged facade; the compile/
  interp/apply seams are clean and single-funnel. No fold.

---

## MD-4 — non-idiomatic runtime dynamism: NONE in-engine; the one cast is the documented cross-realm parse-that seam — ALREADY-SOTA + parse-that-HANDOFF

**Cite + the full dynamism sweep:**

- **`any` is exclusively the idiomatic generic default.** Every `\bany\b` hit in
  the engine is `<V extends Vars = any>` (the class/fn type-param default —
  `engine.ts:82`, `group.ts`/`sequence.ts`/`frame-compiler.ts:86`,
  `animate.ts:135`, `motion-path.ts:105,164`) or a comment. There is **zero
  any-typed dispatch, zero `Reflect`, zero `eval`/`Function()` construction,
  zero dynamic-method-name dispatch** (grep-verified across `src/animation/*.ts`).
- **Dispatch is typed-discriminated-union, not stringly-typed.** The blend kernel
  is `switch (layer.blendMode)` over the `BlendMode = 'replace'|'add'|'weighted'`
  union (`group.ts:287`); the playback dispatch is a typed branch (reduced-motion
  → WAAPI-eligible → rAF, `engine.ts:955-975`) returning typed promises. Neither
  is a string-keyed handler table — they are exhaustive typed branches the
  compiler checks.
- **Dynamic member access is the zero-alloc buffer idiom, correctly applied.**
  The `groupedValues[key]` / `values[key]` computed access in
  `transformFramesGrouped` (`group.ts:289-361`) is `for..in` over the
  compile-STABLE key-set (`_groupedKeys`), with the F.W4 null-fill keeping the
  buffer in V8 fast-properties mode — this is *deliberate hot-path discipline*,
  not reflective dynamism. The same in `interpFrames`/`clearBuffer`
  (`engine.ts:707-711`). These are dictionaries-by-design at the leaf, accessed
  through a stable shape — the opposite of the dict-mode trap they explicitly
  avoid.
- **`as unknown as` is 9 sites, all narrow + load-bearing** (3 `engine.ts`,
  5 `frame-compiler.ts`, 1 `motion-path.ts`) — the generic-erasure bridges at
  the `Vars`/`flatVars` boundary (e.g. `engine.ts:280` `this as unknown as
  Animation<K>` for the chainable `addFrame<K>` re-narrow; `:672` the
  single-frame alias). These are TYPE bridges over generic variance, not runtime
  dynamism — no value is reshaped, no property is dynamically resolved.
- **The ONE genuine `as any` pair** is `utils.ts:251,258`
  (`(CSSFunction.FunctionArgs as any).map` + `(parseAny as any)(...)`) — the
  documented cross-realm parse-that cast: value.js and keyframes.js each carry
  their own `@mkbabb/parse-that` realm, so the `Parser<T>` classes are nominally
  distinct to TS though identical at runtime (`utils.ts:246-250` comment). This
  is the EXACT item the gap-scorecard already owns as `G-PT-2`/`F-BL-5` (collapse
  via a parse-that peer-declare to converge the realm — Band V).

- **Disposition: ALREADY-SOTA** (the engine has no non-idiomatic dynamism) **+
  parse-that-HANDOFF** (the one cross-realm cast is `G-PT-2`, already sequenced in
  Band V; this lane CONFIRMS it is the sole dynamism escape-hatch in the surface
  — no new dynamism finding). **No net-new SHIP.**

---

## MD-5 — hygiene precepts (nested imports / test-in-src / DRY) — HONORED, nothing to fold

**Cite (re-verified live):**

- **Zero nested / function-scoped imports.** `grep` for `^\s+(await )?import\(`
  across `src/animation/*.ts` excluding `index.ts` → nil. The only dynamic
  imports are the four documented boundary edges in `index.ts:192-195`
  (`loadAnimationEngine`'s `import("./engine")`/`./animate`/`./motion-path`/
  `./animations`) — the intentional value.js static/dynamic boundary, not
  nesting.
- **Zero test files in `src/`.** `find src -name '*.test.ts' -o -name '*.spec.ts'`
  → nil.
- **DRY is exemplary.** Single-source physics (`SpringProgress` composed, not
  duplicated, by drag/springLinearStops/springTimingFunction — re-verified per
  `a-backend-godmodules G-GM-5`); single `clamp` (no open-coded
  `Math.max(0,Math.min)` — grep nil); single rAF owner (`RAFPlayback`, MD-2);
  single interp entry (`interpFrames`, MD-3); the setter family shares ONE
  fail-explicit contract block (`engine.ts:304-313`) rather than repeating the
  rationale per setter.

- **Disposition: HONORED.** Nothing to fold. (Concurs with
  `a-backend-godmodules §Hygiene`.)

---

## MD-6 — documentation: the hot path + the contracts are exemplary; ~10 thin public methods are bare — RECORD

**Cite.** The hot-path + contract documentation is genuinely SOTA: `interpFrames`
(`engine.ts:593-608` — the binary-search + zero-alloc-buffer contract),
`processFrame`/`clearBuffer` (the F.W4 V8 dict-mode rationale, `:695-720`),
`restPosition`/`settle`/`reset` (the rest-position contract, `:556-1072`), the
managed-child lifecycle (`animation/CLAUDE.md`, stated once), the value.js
boundary (`index.ts:1-27` + `engine.ts:1-14`), the live-options-reference
contract (`:91-98,304-313`). These are the load-bearing surfaces and they are
documented to a high bar — a hot-path contract a future maintainer can trust.

**The gap is thin and uniform.** ~10 PUBLIC `Animation` methods carry no JSDoc:
`reverse` (`:535`, has an inline comment but no `/** */`), `fillForwards`/
`fillBackwards` (`:548-554`), `onStart`/`onEnd` (`:739-782` — these are part of
the public driver contract `Sequence`/`AnimationGroup` call, yet undocumented),
`playing` (`:1031`), `setTargets` (`:1074`), `group` (`:1090`),
`CSSKeyframesAnimation.transform` (`:1292`). The setter family
(`setIterationCount`…`setHueMethod`) is acceptably covered by the shared
`:304-313` contract block (DRY documentation, not a gap). The genuine omissions
are the lifecycle verbs (`onStart`/`onEnd`) — public because the driver tier
calls them, but a consumer reading the class can't tell they are the
driver-contract seam vs internal.

- **Disposition: RECORD** (NOT a SHIP — the hot path + every correctness contract
  is documented; the gap is cosmetic public-surface JSDoc, byte-cheap and
  non-load-bearing). **If G elects to fold it** (cheap rider on MD-1's engine
  touch), the falsifiable instrument is a `proof:public-jsdoc` clause: every
  non-`private`/`protected` method on `Animation`/`CSSKeyframesAnimation`/
  `AnimationGroup` has a preceding `/** */` OR is covered by a shared
  contract-block reference. **BITE:** add a new bare public method → the clause
  reds. **Recommendation: RECORD** — the contracts that MATTER are documented;
  this is a discipline-gate worth booking, not a G headline. (Concurs with the
  charter's "no manufactured deficit where the state is exemplary.")

---

## Disposition ledger

| ID | Finding | Cite | Disposition |
|---|---|---|---|
| MD-1 | compiler-transplant: demo reaches across the boundary; no `adoptCompiled` seam | `useKeyframeOps.ts:107-109`, `engine.ts:98,229-233` | **SHIP-in-G (MED)** — additive `adoptCompiled` + `proof:adopt-compiled` |
| MD-2 | DI is constructor-injected; live-options-reference is the DI gestalt | `engine.ts:233,314-533`; `frame-compiler.ts:110`; `playback`/WAAPI delegation | **ALREADY-SOTA** |
| MD-3 | pipeline is a clean staged facade (compile/interp/apply separate) | `engine.ts:273-288,609,721-736` | **ALREADY-SOTA** |
| MD-4 | no non-idiomatic dynamism; typed dispatch; one cross-realm cast | `utils.ts:251,258` (=G-PT-2); `group.ts:287`; `engine.ts:955-975` | **ALREADY-SOTA + parse-that-HANDOFF** |
| MD-5 | nested-imports / test-in-src / DRY | grep nil; `engine.ts:304-313` | **HONORED** |
| MD-6 | hot-path + contracts exemplary; ~10 thin public methods bare | `engine.ts:535,548-554,739-782,1031,1074,1090,1292` | **RECORD** (optional `proof:public-jsdoc` rider) |

**What G's deep-modularity lane folds: ONE SHIP (MD-1).** The engine's service
boundaries, DI, pipeline orchestration, and dynamism posture are ALREADY-SOTA —
the deep lens confirms `a-backend-godmodules`' line-count verdict by an
orthogonal route. The single net-new finding is a CROSS-boundary one the
within-file lane could not surface: the engine exposes no first-class
"adopt-compiled-state" verb, so the demo reaches in and mutates three public
internals, carrying the live-options-reference invariant in a comment rather than
enforcing it at the seam. `adoptCompiled()` closes it. The documentation gap is
RECORD — every contract that bears weight is documented to a high bar.

---

### Verification (re-runnable)

```sh
cd /Users/mkbabb/Programming/keyframes.js
# MD-1 — the transplant seam (the one cross-boundary reach-in):
grep -rnE "animation\.(options|compiler|unflatten) *=" demo --include="*.ts" --include="*.vue" | grep -v /dist/
grep -nE "^    (compiler|options|unflatten)\b" src/animation/engine.ts   # public mutable internals
# MD-2 — constructor-DI + live-options-reference:
grep -n "new FrameCompiler" src/animation/engine.ts                      # :233
grep -n "constructor(private options" src/animation/frame-compiler.ts    # :110
# MD-4 — dynamism sweep (expect: only generic-default any + the one G-PT-2 cast):
grep -nE "\bany\b|as unknown as|Reflect|\beval\b" src/animation/*.ts | grep -vE "extends Vars = any|Record<string, any>|//|\* "
grep -n "as any" src/animation/utils.ts                                  # :251,258 (G-PT-2 cross-realm)
# MD-5 — hygiene (expect nil / nil / nil):
grep -rnE "^\s+(await )?import\(" src/animation/*.ts | grep -v index.ts
find src -name '*.test.ts' -o -name '*.spec.ts'
grep -rnE "Math.max\(0, Math.min" src/animation/
# MD-6 — bare public methods:
grep -nE "^    (async )?[a-zA-Z_]+\(" src/animation/engine.ts            # cross-ref against preceding /** */
```
