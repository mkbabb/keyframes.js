# F.W4 — The dict-mode buffer fold + the single-frame alias (charter F4 — THE HEADLINE)

**Phase:** IMPL (spec authored in DEV — awaits auth) · **Class:** SHIP-in-F — the published engine
(a per-frame hot-path transposition; pixel-identical, kf-local — no value.js edge) ·
**Scope:** `src/animation/engine.ts` (the standalone `interpFrames` clear + merge) +
`src/animation/group.ts` (the `_grouped` composite clear) · **DAG-deps:** depends on
F.W0 (the spine) AND **F.W1** (the benches must run to gate this honestly —
`F.md §F.W4 · §The DAG`, the critical path `F1 → F4`). Heads Band 1.

The §Mandate (F.W0) is the spine; this wave most tests **measure-first** AND **no
quick solutions** — the fold is the V8-correct **stable-key null-fill**, NOT "revert
to fresh-`{}`" (`p-runtime-perf-F §1.2`, the §Mandate's specifically-forbidden
F-escape-hatch). This is **the single largest measured per-frame win in the engine**:
three independent F lanes re-measured the `delete`-loop dict-mode deopt on the LIVE
engine and agree (3.8–6.2×), and the single-active-frame alias removes the per-frame
buffer cost essentially entirely (41.7× standalone). Both were correctly WITHHELD by E
(`E/FINAL.md` W7 Strand-B) for want of a shaped bench; F1 authored the bench, and the
deopt is now directly observed with V8's own `%HasFastProperties`.

This is net-new (an E withhold RE-MEASURED + graduated, NOT inherited debt). Verified
not asserted (inv ε) against `tranche-e-impl`.

**Provenance.** `r-v8-cost-model F-1/F-2` (the `%HasFastProperties` proof + the synthetic
3.8–6.2×/16×), `a-runtime-remeasure RM-1` (the authored `interp-buffer.bench.ts` + 5.4/4.4/3.7×
independent re-measure), `p-runtime-perf-F P-1/P-2` (the LIVE-engine measure: every reused
buffer in dict mode; the W7 threaded-buffer path 4–5.75× SLOWER than fresh-`{}`; 41.7× alias),
`a-engine-post-e` (brief — the one live engine micro-perf fold family).

---

## § The state, verified (not asserted)

The live facts, read- and grep-confirmed on `tranche-e-impl`:

1. **The `delete`-loop clears the reused `out` buffer (standalone path).** `engine.ts:572-573`
   reads `const result = out; for (const k in result) delete result[k];` — verified live.
   `delete obj[key]` is the canonical V8 fast→dictionary-mode trigger; once a reused object
   falls to dictionary mode it does NOT recover, so every `result[key]=…` and `for..in` pays a
   hash probe for the animation's entire lifetime. The buffer's whole purpose is zero-alloc
   steady-state reuse (the docstring at `engine.ts:559-562`).

2. **The same `delete`-loop is in the group composite.** `group.ts:211-212` reads
   `const groupedValues = this._grouped; for (const k in groupedValues) delete groupedValues[k];`
   — verified live, with the comment at `:209-210` naming the zero-alloc intent. The
   `_grouped` buffer's blend keys are the stable union of the children's whitelisted keys
   (`p-runtime-perf-F P-1`), so the stable-key precondition holds here too.

3. **`Object.assign(result, frame.flatVars)` re-copies a stable dict every frame.**
   `engine.ts:636` (inside `processFrame`) reads `Object.assign(result, frame.flatVars);` —
   verified live. `frame.flatVars` is built ONCE at compile (`frame-compiler.ts:360-371`,
   `acc[key] = value.map((v) => v.value)` at `:364`) and its leaf values **are the same
   `ValueUnit` instances** `lerpValue` mutated in place two lines earlier (`engine.ts:628-629`,
   `for (const iv of frame.allInterpVars) lerpValue(eased, iv)`). So `Object.assign` copies
   references that already point at the freshly-mutated units.

4. **The key-set is compile-STABLE.** `flatVars`' keys are built once in `finalizeFrameVars`
   (`frame-compiler.ts:360-371`, verified live) and never change across frames — the
   precondition for a stable-key null-fill reset (`p-runtime-perf-F §1.2`, `r-v8-cost-model F-1`).

5. **The deopt is DIRECTLY OBSERVED (not asserted) and measured three ways.**
   - `r-v8-cost-model F-1`: synthetic mirror under `--allow-natives-syntax` — delete-cleared
     buffer reads `%HasFastProperties === false` (falls to dict mode, never recovers);
     stable-key reads `true`. Steady-state K=2/5/12: **6.2× / 4.6× / 3.8×**; `Object.assign`
     into a dict-mode receiver compounds to **16×** at K=32.
   - `a-runtime-remeasure RM-1`: independent reproduction via the authored
     `bench/interp-buffer.bench.ts` (F1's S2 deliverable) — **5.4× / 4.4× / 3.7×** at K=2/5/12,
     same `%HasFastProperties` deopt.
   - `p-runtime-perf-F P-1/P-2`: the LIVE `CSSKeyframesAnimation.interpFrames` — the standalone
     `out`, the group `_grouped`, AND every child `entry.values` all read
     `%HasFastProperties === false`; the W7 threaded-buffer path is **4–5.75× SLOWER** than the
     fresh-`{}` it replaced ("the optimization regressed the thing it optimized"); the
     single-frame alias is **41.7×** vs delete+assign on the standalone path.

6. **The kf-side fix is the only dictionary-mode hazard in the engine.** `r-v8-cost-model F-5`:
   `%HasFastProperties` over `flatVars`/`interpVars`/`parsedVars`/`allInterpVars` confirms they
   are all fast-mode-clean (assign-once, no `delete`); the two `delete`-loops (`engine.ts:573`,
   `group.ts:212`) are the engine's ONLY dict-mode hazard. The fold is precisely scoped.

The wave's job: replace the `delete`-loop clear with a stable-key null-fill at both sites,
add the single-active-frame alias fast-path (with the aliasing-correctness clause — the GROUP
always takes the buffer path), and close it with a `%HasFastProperties` assertion + a
pixel-identical lock. Pixel-identical, kf-local.

---

## § Goal

**What lands (the IMPL the spec gates):**
- **The stable-key null-fill clear at `engine.ts:573` + `group.ts:212`** — replace
  `for (const k in result) delete result[k]` with a fixed-key reset over the compile-stable
  key-set (assign the known keys, no `delete`), so the reused buffer stays in V8
  fast-properties mode AND zero-alloc. Pixel-identical (same keys, same `ValueUnit[]` values,
  only the clear mechanism changes). (SHIP-in-F.)
- **The single-active-frame alias fast-path** — for the dominant 1-active-frame case (the
  2-stop `fromString`, every preset, every single-property animation), `interpFrames` returns
  `frame.flatVars` directly (no clear, no `Object.assign` copy — the leaves ARE the lerped
  units), with the aliasing-correctness clause: the GROUP always passes its own `entry.values`
  buffer (`group.ts`), so it takes the buffer path and NEVER the alias; the alias fires only
  for the standalone single-frame return. The ≥2-active-frame case keeps the merge, into the
  stable-key buffer (fixed-key copy, not `Object.assign` into a delete-poisoned dictionary).
  (SHIP-in-F.)

**Why:** this is the single largest measured per-frame win in the engine, every item an E
withhold the F lanes re-measured on the live engine (3.8–6.2×, three independent re-measures,
pixel-identical — `F.md §The honest bottom line`). The current W7 buffer-reuse made steady-state
playback SLOWER than the naive fresh-`{}` it replaced, because the reused buffer is trapped in
dictionary mode (`p-runtime-perf-F §1.2`). The fold restores the zero-alloc reuse to its
intended win AND keeps the buffer in fast mode, so the downstream `Object.assign`/`for..in`/read
all run at fixed-offset speed too.

---

## § Scope

### S1 — Stable-key null-fill clear at the standalone `interpFrames` — `r-v8-cost-model F-1` / `p-runtime-perf-F P-1`

**WHAT:** at `engine.ts:573`, replace the `for (const k in result) delete result[k]` clear with
a stable-key reset over the compile-fixed key-set (the `flatVars` keys, stable per
`frame-compiler.ts:360-371`) — write the known keys (assign the freshly-resolved values, or
null-fill then re-assign), with NO `delete` and NO `for..in` enumeration. The buffer stays in
fast-properties mode for the animation's lifetime.

**WHY:** the `delete`-loop forces the reused `out` buffer into dictionary mode permanently —
proven with `%HasFastProperties` (`r-v8-cost-model F-1`) and measured 3.8–6.2× slower per frame
on the synthetic mirror, 4–5.75× slower on the LIVE engine vs fresh-`{}` (`p-runtime-perf-F §1.2`).
The §Mandate specifically forbids "revert to fresh-`{}`" — the correct fix is the buffer that is
BOTH zero-alloc AND fast-properties (`p-runtime-perf-F §1.2`). It is pixel-identical (only the
clear mechanism changes) and the key-set is already compile-stable (the precondition holds).

### S2 — Stable-key null-fill clear at the group `_grouped` composite — `r-v8-cost-model F-1` / `p-runtime-perf-F P-1`

**WHAT:** the identical fix at `group.ts:212` — replace the `delete`-loop over `this._grouped`
with a stable-key reset over the group's blend keys (the stable union of the children's
whitelisted keys). The `entry.values` child buffers, cleared via `interpFrames`, inherit S1's fix.

**WHY:** the live group `_grouped` AND every child `entry.values` read
`%HasFastProperties === false` (`p-runtime-perf-F P-1`) — the group is "zero-alloc" but each
reused buffer pays the dictionary-access tax per key per frame. The same stable-key precondition
holds (blend keys stable per group). Pixel-identical; the compositor blend is byte-unchanged.

### S3 — The single-active-frame alias fast-path (with the aliasing-correctness clause) — `r-v8-cost-model F-2` / `p-runtime-perf-F P-2`

**WHAT:** branch `interpFrames` on the active-frame count:
- **1 active frame (the dominant path)** — return `frame.flatVars` directly. No clear, no
  `Object.assign` copy: `frame.flatVars`' leaves ARE the `ValueUnit`s `lerpValue` just mutated
  in place (`frame-compiler.ts:364` ↔ `engine.ts:628-629`), and a 2-stop property has exactly
  one active frame at any `t` (the binary-search seed + contiguous-neighbor scan,
  `engine.ts:579-606`, finds one).
- **≥2 active frames** — keep the merge, into the stable-key (S1) buffer via a fixed-key copy
  (NOT `Object.assign` into a delete-poisoned dictionary).
- **The aliasing-correctness clause:** the GROUP always passes its own `entry.values` buffer
  (`group.ts`), so the group takes the buffer path and NEVER the alias. The alias fires ONLY for
  the standalone single-frame return. No caller may mutate the aliased object expecting a private
  copy — the gate's round-trip clause covers it (`r-v8-cost-model F-2`, `p-runtime-perf-F §2.3`).

**WHY:** the alias removes the per-frame buffer cost essentially entirely for the dominant case —
measured 41.7× vs delete+assign on the standalone path (`p-runtime-perf-F §2.2`), ~0.3–0.5 ns vs
103–467 ns (`r-v8-cost-model F-2`). The stable-key clear makes the buffer cheap; the alias makes
it FREE for the common path. The aliasing clause is "the one subtlety that makes it gated-ship,
not a blind fold" (`r-v8-cost-model F-2`).

### S4 — `proof:interp-fastprops` (the falsifiable close) — `r-v8-cost-model §A.3` / `a-runtime-remeasure RM-1`

**WHAT:** a new gate `proof:interp-fastprops` authored as a **standalone Node script**
`scripts/proof-interp-fastprops.mjs` run with `node --allow-natives-syntax` (the established
`node scripts/proof-*.mjs` idiom — `package.json:41-50`), wired as a `package.json` script
`"proof:interp-fastprops": "node --allow-natives-syntax scripts/proof-interp-fastprops.mjs && vitest run test/interp-fastprops.test.ts"` and chained into `proof:all` + CI via F2. It is split
deliberately into the natives-syntax half (the `.mjs`, where `%HasFastProperties` survives) and a
vitest half (the round-trip lock, ordinary `.ts`). Three biting clauses:
1. **Fast-properties clause (the `.mjs` half — NOT a vitest test).** `%HasFastProperties(obj)`
   is a V8 *intrinsic* — `esbuild`/`tsc` (vitest's transform) reject the `%`-token outright
   (verified live: `printf 'function f(o){return %%HasFastProperties(o);}' | esbuild → ✘ [ERROR]
   Unexpected "%"`), so this clause CANNOT live in a transformed `.ts` test; it MUST be a plain
   `.mjs` run under `node --allow-natives-syntax` (no transform layer), exactly as the
   `r-v8-cost-model §A` samples are (`// node --allow-natives-syntax drt1-bench.mjs`).
   **(Overrides the `a-runtime-remeasure RM-1:146` sketch** — which proposed "a vitest test …
   vitest `poolOptions` exposes V8 natives": setting `poolOptions.execArgv:
   ['--allow-natives-syntax']` reaches V8, but vitest still transforms the `.ts` through esbuild
   FIRST, which rejects the `%` before V8 sees it — so the natives clause is a standalone `.mjs`,
   not a `poolOptions` vitest test. `r-v8-cost-model §A.3`'s `.mjs` form is the correct one; this
   spec reconciles the two lanes to it.)**
   The script imports `interpFrames` from the value module `../src/animation/engine` (the F1 S1
   path-fix idiom), plays one animation reusing one `out` buffer for N frames, and asserts the
   buffer is `%HasFastProperties === true` with the stable-key fix AND `=== false` with the
   (injected) delete-loop. BITES: revert to the delete-loop → the buffer reads `false` → exit
   non-zero → reds.
2. **Wall-time clause — AND the named honest fallback when natives are unreachable.** Over
   `bench/interp-buffer.bench.ts` (F1's threaded-buffer harness), assert the fix is faster at the
   demo's K=2/5/12 distribution with NO K regressing. **This clause is the gate's honest fallback
   instrument** if the runner cannot expose `--allow-natives-syntax` (a sandboxed CI worker, a
   future esbuild/vitest pool with no `execArgv` reach): the dictionary-mode deopt is what makes
   playback 3.8–6.2× slower, so a threaded-buffer wall-time *regression* RE-DETECTS the exact
   deopt clause 1 names — the gate still BITES the deopt via the timing delta even where
   `%HasFastProperties` is unavailable. The `.mjs` half is the *direct* mechanism probe; clause 2
   is the *behavioural* probe that bites the same regression without the intrinsic.
3. **Round-trip (pixel-identical) clause (the vitest half — ordinary `.ts`).** The fix's output is
   byte-identical to the current delete-loop path over the kf parsing corpus (same keys, same
   `ValueUnit[]` values) — covering both the stable-key merge AND the single-frame alias (no
   drift). This half carries no `%`-intrinsic, so it is a normal `vitest run` test.

**WHY:** inv ε — the close must BITE the exact regression the fold removes. The fast-properties
assertion is the *direct* falsifiable form of "the buffer stays in fast mode"; because
`%HasFastProperties` is a V8 intrinsic that the vitest/esbuild transform cannot parse (verified
above), the honest instrument is the standalone `node --allow-natives-syntax` `.mjs` (the
`proof-*.mjs` idiom), NOT a vitest test — and the threaded-buffer wall-time clause is the NAMED
fallback that bites the same deopt where the intrinsic is unreachable, so the gate is never
narration-only. The round-trip clause is the falsifiable form of "pixel-identical." The bench it
gates against (`bench/interp-buffer.bench.ts`) is F1's deliverable — F4 depends on F1
(`F.md §F.W4`).

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES:

1. **The reused buffer stays in fast-properties mode.** `proof:interp-fastprops` clause 1 — the
   standalone `node --allow-natives-syntax scripts/proof-interp-fastprops.mjs` half (NOT a vitest
   test: `%HasFastProperties` is a V8 intrinsic the esbuild/tsc transform rejects, verified
   `esbuild → "Unexpected %"`): the threaded `out` buffer reads `%HasFastProperties === true`
   after N frames with the stable-key fix. BITES: inject the `delete`-loop → the buffer reads
   `false` → the script exits non-zero → reds. (The group `_grouped` + `entry.values` assert the
   same.) **Fallback (named):** where the runner cannot reach `--allow-natives-syntax`, clause 2's
   threaded-buffer wall-time regression bites the same deopt (it is what makes playback 3.8–6.2×
   slower) — the gate is never narration-only.
2. **No K regresses; the fix is faster at the demo's K (the honest-fallback deopt probe).**
   `proof:interp-fastprops` clause 2: `bench/interp-buffer.bench.ts` shows the stable-key + alias
   path faster at K=2/5/12 with no K slower. BITES: a slower K → reds — and a K regressing back to
   the 3.8–6.2× delete-loop band is the behavioural signature of the dictionary-mode deopt clause 1
   probes directly.
3. **Pixel-identical output.** `proof:interp-fastprops` clause 3: the fix's output is
   byte-identical to the delete-loop path over the parsing corpus (the stable-key merge AND the
   single-frame alias). BITES: any value/key drift → reds.
4. **The alias never fires for the group.** The aliasing-correctness clause: a test asserts the
   group path always takes the buffer (its `entry.values`), never the standalone alias; no caller
   mutates the aliased object expecting a private copy. BITES: a group taking the alias path, or a
   mutation through the alias → reds.
5. **kf-local, no value.js edge.** The fold touches only `engine.ts` + `group.ts` clear/merge
   mechanism; ZERO value.js change (the per-frame serialization garbage is value.js-HANDOFF,
   §Folds). BITES: a value.js edit smuggled in → reds (the §Mandate's inv-16).

---

## § Folds

Retires (by finding id):
- **`R1`+`R2`/`MF-1`+`MF-2`** — the dict-mode buffer fold + the single-frame alias
  (`F.md §F.W4`) — S1+S2 (stable-key clear) + S3 (alias) + S4 (gate).
- **`r-v8-cost-model F-1/F-2`** — the `delete`-loop deopt (`%HasFastProperties`-proven,
  3.8–6.2×/16×) + the single-frame alias — S1/S2/S3.
- **`a-runtime-remeasure RM-1`** — the authored `interp-buffer.bench.ts` + 5.4/4.4/3.7×
  independent re-measure — S4 (gate rides F1's bench).
- **`p-runtime-perf-F P-1/P-2`** — the LIVE-engine measure (every buffer in dict mode; W7
  4–5.75× slower than fresh-`{}`; 41.7× alias) — S1/S2/S3.

**KILL/RECORD ledger for Band 1 (carried so no future lane re-raises — `F.md §F.W6 (the Band-1 KILL/RECORD ledger)`):**
- **DOM write-skip diff-cache** (`R5`/`MF-4`) — **KILL**: measured ~0 (every interpolating key
  changes every frame — E's `d3-changed-keys.measure.test.ts` settled it, `a-runtime-remeasure RM-3`,
  `a-engine-post-e F-ENG-2`). F must NOT re-open the diff-skip. The real per-frame garbage is
  `unflattenObjectToString` alloc → **value.js-HANDOFF (VJ-F4/VJS-2)** (the buffer-reusing
  serializer; kf cannot fix it from its side; propose, never write — inv-16).
- **D1 frozen-shape `ValueUnit`** (`R6`) — **KILL**: measured non-win (mono ≈ mega; the carrier
  store IC is a fast stable-offset store, NOT a dictionary lookup — `r-v8-cost-model F-3`,
  `r-interpolation-carrier`). The lever is **D2 SoA `Float64Array`** (~2.0–2.3× at K≥16) →
  **value.js-HANDOFF (re-pointed Wave D)**, gate on real-K (the mono-vs-mega magnitude is
  bench-shape-sensitive, `p-runtime-perf-F P-4` records the inter-lane dispute). The kf-local
  numeric-segment SoA compile is MEASURE-FIRST/BOOK (gated on representative-K, absent at the
  dominant K=1). F must NOT reach for monomorphize-the-carrier.
- **CSS Typed OM as interp carrier** (`R7`) — **KILL (record)**: allocates per `.add`/`.mul`;
  vs a string-CSSOM baseline kf doesn't use; DOM-coupled (breaches the boundary). RECORDED so no
  future "modernize the carrier" pass reaches for it. (The Typed-OM *write substrate* is a
  SEPARATE axis — MEASURE-FIRST, feature-detected, only if a bench bites + zero-alloc preserved.)
- **W8 S1 typed time index** (`MF-6`) — **RECORD**: ~4 ns of a 128–168 ns full tick, NEGATIVE at
  the dominant N=2 (`a-framecompiler-remeasure §1` gave it the full-tick denominator the BOOK lacked).
  The withhold HOLDS; forks the shared `binarySearchRange`. Not a fold.
- **W8 S2 slot map** (`MF-7`) — **MEASURE-FIRST + BOOK** (after the carrier lane; only bites
  ≥2 active frames, no such bench; the slot-map shape already exists at `numeric.ts:8-15,175-181`
  — `a-framecompiler-remeasure §2`).
- **W8 S3 incremental `updateSegments`** (`MF-8`) — **BOOK**: compiles in sub-100 µs against the
  editor's 1000 ms debounce (`useKeyframeOps.ts:71,119-120,122,150-151`); trading the FC-2
  byte-determinism lock (`compile-deterministic.test.ts`) for a dirty-state machine is unjustified
  at ≤~20 stops. The `proof:compile-incremental` byte-equality contract is RECORDED so it is not
  reinvented (`a-framecompiler-remeasure §3`).
- **`tryParseCache` eviction** (`MF-9`) — **RECORD** (withhold HOLDS; cold compile path, bounded
  in practice by distinct-CSS-value count; the bound belongs in value.js `memoize`, Band V F3 —
  `a-engine-post-e F-ENG-7`, `r-v8-cost-model F-4`).
- **preset lazy memo** (`MF-5`) — **RECORD** (a memo breaks instance independence — a correctness
  bug, not a perf win; the parse is already memoized by `tryParseCache`; presets are cold one-time
  — `a-runtime-remeasure RM-4`).

**RECORD (already-SOTA, manufacture no work — `r-v8-cost-model F-5`, `p-runtime-perf-F §5`):**
- The compile-path object shapes (`flatVars`/`interpVars`/`parsedVars`/`allInterpVars`) are
  fast-mode-clean (assign-once, no `delete`); the pre-resolved monomorphic `_lerp` dispatch; the
  binary-search seed + contiguous-neighbor scan; the zero-width snap. LEAVE — the two `delete`-loops
  are the ENGINE's only dict-mode hazard, and F4 scopes precisely to them.

---

## § Design decisions

1. **Stable-key null-fill, NOT revert-to-fresh-`{}` — RESOLVED (the §Mandate's named F-trap).**
   The `delete`-loop made the reused buffer SLOWER than the fresh-`{}` it replaced
   (`p-runtime-perf-F §1.2`) — but the honest fix is NEITHER. Reverting to `{}` reintroduces the
   per-frame GC churn the buffer was added to kill (the INP/jank cost — `p-runtime-perf-F §1.2`
   warns "do NOT misread this as revert to `{}`"); the §Mandate specifically forbids it
   (`F.md §Mandate`). The transposition is the buffer that is BOTH zero-alloc AND
   fast-properties (stable-key null-fill). Trade-off: a fixed-key reset over a known key-set is
   marginally more code than a `delete`-loop — but it is the only fix that keeps both invariants,
   and the key-set is already compile-stable (the precondition is free).

2. **The single-frame alias is gated-ship, NOT a blind fold — RESOLVED.** The alias removes the
   buffer cost entirely for the dominant path (41.7×), but it returns the frame's own long-lived
   `flatVars` sometimes and the merge buffer other times — so the gate MUST assert no caller
   mutates the returned object expecting a private copy, and that the group always takes the buffer
   path (its `entry.values`), never the alias (`r-v8-cost-model F-2`). Trade-off: the branch adds a
   path — but the aliasing-correctness clause is exactly the subtlety that makes it a measured,
   gated transposition rather than a workaround; the §Mandate's no-quick-solution demands the
   correctness clause be in the gate, and it is.

3. **The DOM write-skip is KILLED, not folded — RESOLVED + HONEST (inv ε).** A diff-and-skip
   `setProperty` cache saves ~0 because every interpolating key changes every interior frame —
   E's `d3-changed-keys.measure.test.ts` settled it (`a-runtime-remeasure RM-3`). F4 must NOT
   re-open it (the §Mandate's KILL discipline). The real per-frame garbage (`unflattenObjectToString`
   alloc) is value.js-owned → HANDOFF (inv-16: propose, never write). Trade-off: leaving a named
   per-frame alloc unfolded reads as incomplete — but it is across the value.js boundary, and
   reaching into it would breach inv-16; the honest move is the precise HANDOFF.

4. **kf-local + pixel-identical — RESOLVED.** The fold touches only the clear/merge mechanism in
   `engine.ts` + `group.ts`; same keys, same `ValueUnit[]` values, same compositor blend output.
   No value.js edge (the boundary is exemplary, §ALREADY-SOTA — kf reaches value.js through the
   single `lerpValue → iv._lerp` seam, unchanged). Trade-off: none — this is the cleanest class
   of transposition (mechanism-only, output-identical), which is why it ranks SHIP over the held
   F5 Animation-half and the value.js-gated F6 secondary.
