# SOTA Audit — WASM / Compile-time / Build-time Perf Lane

**Scope.** Parser + compiler performance for the keyframes.js + value.js + parse-that
stack. SOTA reference points: lightningcss (Rust→WASM), csstree, the WASM-vs-JS
boundary-cost literature, packrat/Pratt parsing, monomorphic hot-path / JIT-shape
discipline, build-time precompilation.

**Verdict.** The runtime hot paths are already SOTA — `prepareInterpVar` pre-resolves
interpolation dispatch, `allInterpVars` is pre-flattened for zero-alloc iteration,
parse fns are memoized, parse-that's `ParserState` is a mutable save/restore zero-alloc
machine. The **single highest-value finding is architectural, not WASM**: parse-that
*already ships a complete, benchmarked Rust parser engine* that no consumer uses, and
the library's own presets re-parse CSS at runtime when they could be compiled at build
time. WASM-for-the-parser is **NOT** recommended (KISS / honest cost-benefit — see F1).
The realistic wins are (a) build-time preset precompilation, (b) bounded caches, (c)
residual O(N) scans in the compiler, (d) a value.js parser-construction hoist.

Disposition legend: **FOLD-E** (keyframes.js, fold into Tranche E) · **FOLD-VALUEJS-HANDOFF**
(propose a value.js tranche; do not write value.js) · **BOOK** (note for later) ·
**GAP-NAMED** (named gap, no action now) · **ALREADY-SOTA**.

---

## F1 — WASM for the CSS parser: DECLINE (named gap, not a fold)

- **Cite:** lightningcss-wasm (npmjs.com/package/lightningcss-wasm); WASM-vs-JS
  boundary-cost literature (thenewstack.io "Testing Side-by-Side", elamir.medium.com
  "Brutally Honest Guide to WebAssembly 2025"); modern-web-guidance has **no**
  WASM-for-parsers guide (top similarity 0.37 for "WebAssembly module for compute-heavy
  widget" → `apply-webgl-shaders`, not applicable); the relevant guide is `performance`
  (Baseline: evergreen) which is about main-thread/INP, not WASM.
- **The temptation.** lightningcss proves Rust→WASM CSS parsing is fast in *absolute*
  terms (Bootstrap 4 in ~4ms vs 17ms esbuild vs 544ms cssnano). parse-that *already has*
  the Rust crate (`/Users/mkbabb/Programming/parse-that/rust/parse_that/`) with
  zero-copy `SpanParser` (enum-dispatched, vtable-free), LUT byte scanners
  (`take_until_any_span`, "10-15x faster than regex NFA" per parse-that CLAUDE.md:119),
  `SmallBox<S32>` inline closures, and packrat `memoize()`. Compiling it to wasm32 and
  publishing looks like free SOTA.
- **Why it is the wrong call here (the honest cost-benefit):**
  1. **Workload shape is hostile to WASM.** keyframes.js parses *small* strings —
     a 2-stop keyframe block, a `translateX(20px)` value, a `cubic-bezier(...)` literal.
     The bench (`bench/parser.bench.ts:4-12`) tops out at an 11-stop block. WASM wins on
     *large CPU-bound* workloads; for small/frequent calls the JS↔WASM boundary crossing
     (string copy into linear memory, result marshalling back to JS objects) dominates,
     and JIT-warm JS is "fast enough" or faster (the side-by-side literature is explicit:
     ~2x for *heavy* tasks only; trivial tasks favor JS).
  2. **The output is rich JS objects, not bytes.** lightningcss returns serialized CSS
     *strings* — a clean byte→byte boundary. parse-that here returns live
     `ValueUnit`/`FunctionValue`/`ValueArray`/`Color` graphs (`src/parsing/index.ts:13`,
     `stylesheet.ts:30-58`) that the interpolation engine mutates in place. A WASM parser
     would have to reconstruct that entire graph across the boundary every call — pure
     marshalling overhead with no compute payoff.
  3. **Memoization already erases the parse cost.** Every public parse entry is memoized
     (`parseCSSValue`/`parseCSSTime`/`parseCSSPercent` index.ts:262-291,
     `parseCSSValueUnit` units.ts:114, `parseCSSColor` color.ts:613, `parseCSSStylesheet`
     stylesheet.ts:514). Steady-state parse cost is a `Map.get`. WASM optimizes the cold
     path that runs once per unique string.
  4. **Bundle + complexity tax.** A wasm module + glue is ~tens-to-hundreds of KB and an
     async init, against the library's deliberate light/heavy boundary discipline
     (`src/animation/CLAUDE.md` — light bundle carries *zero* static value.js edges). WASM
     would be a large, eager, opaque dependency that breaks SSR-friendliness and the
     tree-shake story.
- **Disposition:** **GAP-NAMED** — "WASM CSS parser" is consciously declined; record the
  reasoning so it is not re-litigated. The *one* place WASM could pay off is bulk
  stylesheet ingestion (parsing an entire `<style>` sheet of thousands of rules), which
  is not a keyframes.js workload. If a future product parses whole sheets, revisit via
  parse-that's existing Rust crate.
- **Isomorphism:** N/A (no change). Declining preserves pixels and bytes exactly.

---

## F2 — Presets re-parse CSS at runtime; precompile at build time

- **Cite:** `src/animation/animations.ts:5-40` — every preset
  (`fadeIn`/`fadeOut`/`pulse`/… 30+) is `new CSSKeyframesAnimation(...).fromString(<css>)`;
  `fromString` → `addFrame` → `compiler.parse()` (`engine.ts:997-1031`,
  `frame-compiler.ts:278-331`). The CSS template strings are **static literals known at
  build time**, yet the full parse→flatten→reconcile→normalize pipeline runs on first
  call in every consuming app.
- **SOTA gap.** This is the classic "compile-time vs runtime" win — the inverse of WASM.
  Instead of making the parser faster, *don't run it at all* for inputs fixed at build
  time. lightningcss/Stylo and every serious CSS toolchain push static work to build
  time. Here the preset library is the obvious candidate: the template→`AnimationFrame[]`
  compilation is pure and deterministic for a given options-default set.
- **Perf/elegance rationale.** Eliminates the parser + value.js graph construction from
  every preset's first paint — a real INP/first-interaction win on preset-heavy demos.
  Two grades, KISS-ranked:
  - **(a) Lazy memo (trivial, do first):** the preset *factory* result is not cached —
    calling `fadeIn()` twice re-parses. A module-level memo keyed on the serialized
    options would make the 2nd..Nth call O(1). Low effort, isomorphic.
  - **(b) Build-time codegen (higher ceiling):** a build step that runs each preset once
    and emits the compiled `AnimationFrame[]` (or `addFrame` calls with already-parsed
    `ValueUnit`s) as a `.ts` artifact, so the published preset path never touches the
    parser. Bigger lift; only worth it if presets are a measured hot path.
- **Disposition:** **FOLD-E** — (a) is a clean Tranche-E fold (small, isomorphic). (b) is
  **BOOK** pending a measurement that presets are a real cost.
- **Isomorphism:** Pixels/bytes identical — same `AnimationFrame[]`, just produced once
  (a) or at build time (b). Must assert byte-equality of compiled frames in CI for (b).

---

## F3 — Unbounded parse/normalize caches (memory-leak shaped, not perf)

- **Cite:** value.js `memoize` defaults `maxCacheSize = Infinity`
  (`/Users/mkbabb/Programming/value.js/src/utils.ts:114`); **every** parse entry uses the
  default unbounded cache (`parseCSSValue`/`Time`/`Percent` index.ts:262-291,
  `parseCSSValueUnit` units.ts:114, `parseCSSColor` color.ts:613, `parseCSSStylesheet`
  stylesheet.ts:514, `getComputedValue` normalize.ts:136). keyframes.js mirrors this with
  a module-level **unbounded** `Map` (`src/animation/utils.ts:145` `tryParseCache`, set at
  :209, never evicted).
- **SOTA gap.** Memoization is the right call (F1.3 — it is what makes WASM unnecessary),
  but unbounded caches keyed on *arbitrary input strings* are an unbounded-memory hazard
  for any app that parses programmatically-generated CSS (e.g. a value that interpolates a
  number into a string per frame, an editor that re-parses on every keystroke). SOTA
  caches are bounded LRU. The infrastructure *already exists* — `memoize` supports
  `maxCacheSize` with FIFO-ish eviction (utils.ts:141-144) — it is simply never opted into.
- **Perf/elegance rationale.** Bounded LRU is pure upside for long-lived apps; the steady-
  state hit cost is unchanged. The current FIFO eviction (`cache.keys().next().value`) is
  insertion-order, not true LRU — a `Map.delete`+`set` on hit would upgrade it cheaply.
- **Disposition:** keyframes.js side (`tryParseCache` bound + LRU): **FOLD-E**. value.js
  side (`memoize` LRU-on-hit + sane default caps for the parse entries):
  **FOLD-VALUEJS-HANDOFF** — see handoff §H1.
- **Isomorphism:** Hits are byte-identical; only previously-evictable cold entries change
  timing (re-parse instead of hit). Behaviour-stable. Cap must be generous (e.g. 1k) so
  realistic working sets never evict.

---

## F4 — FrameCompiler residual O(N) scan inside the per-variable reconcile loop

- **Cite:** `src/animation/frame-compiler.ts:250-256` — `reconcileVars` was hardened with
  a pre-built `varIndex` (buildVarIndex :203-216) to kill the O(frames²) "next occurrence"
  scan (the comment at :218-225 documents that win — **already-SOTA there**). But the
  *frame-existence* lookup inside the same per-variable loop is still a linear
  `this.frames.findIndex(f => f.ixs.start === startIx && f.ixs.stop === endIx)` run **once
  per (variable × frame)**.
- **SOTA gap.** The `(startIx, stop)` → frame mapping is reconstructible as a `Map` keyed
  on a composite `startIx * N + endIx` (or a nested map), turning the findIndex into O(1)
  and the whole reconcile pass from ~O(V·F²) worst case to O(V·F). For typical keyframe
  counts (≤ ~20 stops) this is negligible, but it is the one un-indexed hot scan left in
  the compile path and the fix is mechanical.
- **Perf/elegance rationale.** Completes the indexing discipline already started in this
  exact function — gestalt cohesion, not new machinery. Compile-time only (runs once per
  `parse()`), so it touches first-paint latency for many-stop animations (editors,
  generated keyframes), not the rAF loop.
- **Disposition:** **FOLD-E** — small, local, completes an existing pattern. Honestly
  *low* priority (bounded by keyframe count); fold opportunistically.
- **Isomorphism:** Pure restructuring; identical `frames[]` output. Behaviour-stable.

---

## F5 — value.js parser construction is module-load eager, not lazy/hoisted (handoff)

- **Cite:** `/Users/mkbabb/Programming/value.js/src/parsing/index.ts:53` builds the math
  parsers at module-eval (`createMathFunctionParsers(...)`); the `Value`/`Function_`/
  `CSSValues` combinator graphs (index.ts:224-256) and the gradient/transform/var parsers
  (`handleGradient`/`handleTransform`/`handleVar`) are all constructed once at import.
  Inside `handleVar` (index.ts:26-48) a fresh `varContent` lazy graph is built **on every
  call** to `handleVar()` — but `handleVar()` itself is only called once, so this is fine;
  the real cost is that the *entire* combinator graph for gradients/transforms/math is
  constructed eagerly even for a consumer that only ever parses `translateX(20px)`.
- **SOTA gap (mild).** parse-that's TS `Parser.lazy` (`parser.d.ts:71`) and the
  `LAZY_PARSER_CACHE` WeakMap (seen in the published `dist/parse.js:1`) exist precisely to
  defer graph construction. The value.js value-parser already uses `Parser.lazy` for the
  recursive cases, so the cold-start cost is modest — but the gradient parser
  (`handleGradient`, ~80 lines of combinators index.ts:125-208) is built eagerly even
  though gradients are rare in animation values. This is a *cold-start*/module-eval cost,
  not a steady-state one.
- **Perf/elegance rationale.** Lazy-constructing the rarely-hit sub-grammars (gradient,
  the full transform matrix) behind `Parser.lazy` trims module-eval time and the retained
  parser-graph footprint. Marginal; flagged for completeness, not urgency.
- **Disposition:** **FOLD-VALUEJS-HANDOFF** — value.js owns this; see handoff §H2. Honest
  assessment: **low** value (cold-start microseconds), include only if a value.js tranche
  is already touching `parsing/index.ts`.
- **Isomorphism:** Lazy vs eager construction yields identical parse results; pure timing.

---

## F6 — parse-that Rust crate is benchmarked but never compiled/published (the real story)

- **Cite:** `/Users/mkbabb/Programming/parse-that/CLAUDE.md:21-43` (full Rust workspace:
  `SpanParser` enum-dispatch, `take_until_any_span` LUT scanner :119, `memoize` packrat
  :117, `cached_regex` Arc cache :118, `seq!`/`alt!` flat N-ary macros :120, 16 benches
  :42). The published npm package (`@mkbabb/parse-that@0.8.2`) ships **only** the
  TypeScript dist (`dist/parse.js`, package.json `exports` → `./dist/parse.js`); there is
  **no** wasm32 crate-type, no `wasm-bindgen`/`wasm-pack` (verified: `grep
  cdylib|wasm-bindgen|crate-type` over `rust/Cargo.toml` → empty), and the dist has no
  `.wasm` artifact.
- **Observation (not a keyframes.js fold).** This is the latent SOTA asset behind F1. The
  Rust engine is the thing you'd compile if WASM ever made sense — and it is *already
  written and benchmarked*. The reason not to wire it in today is F1 (workload shape +
  graph-marshalling boundary), not absence of an engine. Worth recording so the picture is
  honest: "we declined WASM" is a *cost-benefit* decision, not a *capability* gap.
- **Disposition:** **BOOK** — parse-that is a third sibling repo, out of inv-16 scope (not
  keyframes.js, not value.js). Recorded as context for F1; no action proposed in either
  in-scope repo. If a whole-stylesheet ingestion product ever appears, the path is
  "wasm-pack the existing `parse_that` crate, expose a byte→serialized-AST boundary."
- **Isomorphism:** N/A.

---

## F7 — Interpolation + parser hot paths: ALREADY SOTA (do not manufacture work)

- **Cite & verify:**
  - `prepareInterpVar` (`value.js/src/units/interpolate.ts:143-150`) pre-resolves the
    `_lerp` dispatch *once* per `InterpolatedVar`, and `lerpValue` (:113-133) takes the
    `iv._lerp` fast path — no per-call `instanceof`/`typeof` ladder in the rAF loop. This
    is textbook monomorphic-shape discipline.
  - `frame-compiler.ts:318-330` pre-flattens `frame.flatVars` and `frame.allInterpVars`
    (`Object.values(...).flat()`) at compile time so the per-frame interpolation iterates a
    flat array with zero allocation — exactly the "do the shape work at compile time" SOTA
    move.
  - parse-that `ParserState` (`dist/state.d.ts:12-41`) is a mutable save/restore machine
    with zero-copy `Span` (start/end offsets, lazy `spanToString`) — zero-alloc hot path,
    the same model lightningcss uses internally.
  - The value.js value-parser already adopted **identity `keyFn`** for single-string
    memo keys (index.ts:258-266) to avoid `JSON.stringify` synthesizing a quoted copy per
    call — a real, already-landed JIT/alloc win.
  - `getTimingFunction` (`animation/utils.ts:103-143`) resolves cubic-bezier/steps via
    pre-compiled module-level regex literals (:78-85), not per-call regex construction.
- **Disposition:** **ALREADY-SOTA** — flagged explicitly so the lane does not invent perf
  work where the engine is already at the frontier. The runtime interpolation path needs
  nothing from this lane.
- **Isomorphism:** N/A (no change).

---

## value.js hand-off (FOLD-VALUEJS-HANDOFF) — propose a value.js tranche

> value.js is dirty + active; these are *proposals* for the value.js owner to formalize as
> a value.js tranche. Do not write value.js from keyframes.js.

### H1 — Bound the parse/normalize memo caches (LRU)
- **Where:** `value.js/src/utils.ts:108-153` `memoize` + its consumers
  (`parsing/index.ts:262-291`, `parsing/units.ts:114`, `parsing/color.ts:613`,
  `parsing/stylesheet.ts:514`, `units/normalize.ts:136`).
- **Proposal:** (a) give the parse-entry memos a sane default `maxCacheSize` (e.g. 1024 —
  generous enough that real working sets never evict); (b) upgrade `memoize`'s eviction
  from insertion-order FIFO (`cache.keys().next().value`, utils.ts:142) to true LRU by
  `delete`+`set` on hit. Closes the unbounded-memory hazard for apps that parse
  generated/keystroke CSS, with zero steady-state cost.
- **Isomorphism:** hits stay byte-identical; only cold-entry eviction timing changes.

### H2 — Lazy-construct the rare sub-grammars
- **Where:** `value.js/src/parsing/index.ts:125-256` — gradient/transform/math combinator
  graphs built eagerly at module-eval.
- **Proposal:** wrap the rarely-hit sub-grammars (`handleGradient`, full transform matrix)
  behind `Parser.lazy` so a consumer parsing only simple values doesn't pay their
  construction at import. **Low priority** — cold-start microseconds; bundle only if a
  value.js tranche is already in `parsing/index.ts`.
- **Isomorphism:** identical parse results; pure construction-timing.

---

## Summary table

| ID | Title | Disposition | Priority |
|----|-------|-------------|----------|
| F1 | WASM CSS parser — decline | GAP-NAMED | n/a (decision recorded) |
| F2 | Precompile presets (lazy memo / build codegen) | FOLD-E (a) / BOOK (b) | **High** (a) |
| F3 | Bound `tryParseCache` (kf) | FOLD-E | Med |
| F4 | Index the frame-existence lookup in reconcileVars | FOLD-E | Low |
| F5 | Lazy value.js sub-grammar construction | FOLD-VALUEJS-HANDOFF (H2) | Low |
| F6 | parse-that Rust crate unused/unpublished | BOOK | n/a (out of scope) |
| F7 | Interp + parser hot paths already SOTA | ALREADY-SOTA | — |
| H1 | Bound value.js memo caches (LRU) | FOLD-VALUEJS-HANDOFF | Med |

**Net.** No WASM. The lane's real wins are *compile-time*, not *compile-to-wasm*: stop
re-parsing build-time-static presets (F2), bound the caches (F3/H1), finish the compiler's
indexing discipline (F4). The runtime is already at the frontier (F7).
