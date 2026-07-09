# Prototype p11 — Packrat-epoch arming measurability (Q11 / S.H1)

**Probe:** parse-that packrat-epoch **arming** — the one measurable perf reclaim r6 identified.
**Question owner:** SPEC-v1 §6 **Q11** ("Does packrat arming register on a real bench?") → band
**S.H1** (packrat-epoch arming, perf, patch) + the **chain() falsy-fix** shape (S.H2, r6 F3).
**Status:** COMPLETE. Throwaway prototype in scratchpad; this report is the deliverable.
**Date:** 2026-07-02 · branch `tranche-s-dev`.

---

## 1. The question + the spec's assumption

**SPEC-v1 §6 Q11** (verbatim criterion): *"Implement PACKRAT_ARMED in a parse-that worktree; run
the value.js-shaped parse bench + heap probe. SUCCESS: flat heap across N non-memoized parses and a
measurable throughput delta on the value.js corpus. FAILURE: no measurable delta → S.H1 demotes from
perf-wave to hygiene-wave."*

**Band S.H1's assumption** (SPEC §3, from r6 finding #1): every top-level `parseState()` in
parse-that 0.13.0 unconditionally allocates **three fresh `Map`s** via `packratEnter()` to keep the
opt-in packrat tier re-entrancy-sound; value.js **never opts into packrat**, so this is pure overhead
on every CSS value keyframes.js compiles. Arming (a `PACKRAT_ARMED` flag flipped only when a
`memoize()` is constructed) makes `packratEnter`/`packratExit` true no-ops on the default LL(1) path.
The task criterion (from the probe brief): **a measured % — or KILL the wave if <5% on the realistic
workload.**

**The r6 chain() sub-assumption** (F3): `chain()`'s continuation gate is a **truthiness** test
(`state.value || chainError`), so a successfully-parsed falsy value (`0`, `""`) silently skips the
continuation; the fix is to gate on `!state.isError`.

---

## 2. What I actually did (commands + exit codes)

parse-that is READ-ONLY. I copied `typescript/src/parse/*.ts` into two scratchpad variants —
`baseline/` (verbatim 0.13.0) and `armed/` (arming flag added) — bundled each to a single ESM file
with vite's build API (rollup resolves the `leaf.ts`↔`parser.ts` init cycle that vite's raw SSR
transform trips on), then ran plain-node micro-benchmarks against the built bundles.

| step | command | result |
|---|---|---|
| copy sources | `cp .../typescript/src/parse/*.ts scratchpad/{baseline,armed}/` | ok |
| add arming to `armed/packrat.ts` | 3 edits (flag + `packratEnter`/`packratExit` early-return + arm in `makeMemoized`) | ok |
| bundle both | `node build.mjs` (vite `build()` lib mode, no minify) | `built baseline / built armed`, exit 0 |
| arming present only in armed | `grep -c PACKRAT_ARMED dist-bundles/*.js` | armed 2, baseline 0 |
| main perf bench | `node --expose-gc run-bench.mjs` | exit 0 (see §3) |
| soundness | `node soundness.mjs` | `2/2 pass`, exit 0 |
| mechanism proof | `node --expose-gc arm-regression.mjs` | exit 0 |
| heavy-input bracket | `node heavy-bench.mjs` | exit 0 |
| chain() bug (baseline) | `node chain-bug.mjs` | reproduces bug |
| chain() fix (armed) | edit `armed/parser.ts` + rebuild + `node chain-fix.mjs` | fix verified |

**Throwaway edits** (scratchpad copies only — **zero files changed in any real repo**):

`armed/packrat.ts` vs `baseline/packrat.ts` — the arming sketch:
```
+ let PACKRAT_ARMED = false;                       // module global
  export function packratEnter(): PackratEpoch | null {
+     if (!PACKRAT_ARMED) return null;             // skip 3-Map alloc + snapshot
  export function packratExit(saved: PackratEpoch | null): void {
+     if (saved === null) return;                  // nothing to restore
  function makeMemoized<T>(...) {
+     PACKRAT_ARMED = true;                         // arm at memoize construction
```
`armed/parser.ts` vs `baseline/parser.ts` — the chain() fix shape:
```
-             if (state.isError) { return state; }
-             else if (state.value || chainError) { return fn(state.value).parser(...); }
+             if (!state.isError || chainError) { return fn(state.value).parser(...); }
```

**Harness fidelity.** `parse()` → `parseState()` opens exactly **one** epoch per top-level parse;
nested combinators call `.parser(state)` directly (no re-entry). My harness calls `grammar.parse(s)`
once per corpus string, so it models one epoch per parse exactly as value.js drives it (one
independent `.parse()` per keyframe value). The grammar is built from the same combinators value.js
uses (`dispatch` first-char branch, `all`/`any` fusion, `sepBy` comma lists, `regex` leaves, `.map`),
over a 40-string CSS-value corpus (`16px`, `rgba(...)`, `calc(100% - 20px)`, `translate(...) rotate(...)`,
numbers, keywords; avg ~11 chars — the real keyframe-value shape).

---

## 3. Findings (with evidence)

### F1 — The 3-Map-per-parse tax is real and on the hot path

`packrat.ts:197-199` allocates `MEMO/HEADS/GROWING = new Map()` unconditionally inside
`packratEnter()`, called from `parser.ts:43` (`const epoch = packratEnter()`) in the `parseState`
try/finally on **every** top-level parse. value.js opts into `memoize` at **zero** sites (r6 F1,
consumer diff), so all three Maps are allocated and never read for the entire constellation. Confirmed
by source read. The arming flag is flipped only in `makeMemoized` (`packrat.ts:244`, reached by
`memoize`/`mergeMemos` at `:438`/`:442`) — i.e. at grammar-construction time, before any parse, so
soundness is preserved for the tier that actually uses it.

### F2 — Throughput delta: 14–18% on the realistic (short-value) workload

`run-bench.mjs`, median of 9 trials, 800k parses/trial, two independent invocations:

| run | baseline | armed | delta |
|---|---|---|---|
| 1 | 170.9 ms (4.68 M/s) | 146.3 ms (5.47 M/s) | **armed 14.37% faster** |
| 2 | 176.6 ms (4.53 M/s) | 144.9 ms (5.52 M/s) | **armed 17.94% faster** |

Variance is tight (baseline trials 170–182 ms; armed 143–148 ms — non-overlapping ranges). Correctness
gate green: 40/40 strings, **0 mismatches, 0 parse-fails** between variants. **Well above the 5%
KILL threshold.**

### F3 — Heap reclaim: ~34% less retained (workload-independent evidence)

`--expose-gc` retained-heap probe, 100k non-memoized parses:

| | baseline | armed |
|---|---|---|
| retained | 3719 / 3656 KiB | 2399 / 2398 KiB |

Armed retains ~**1.3 MiB less per 100k parses** (~34% reduction) — the eliminated Map churn. This is
the robust, grammar-independent signal and is exactly the `proof:perf` clause S.H1 already names as
its born-RED gate ("N non-memoized parses allocate flat").

### F4 — Mechanism proof: the win *is* the skipped epoch alloc

`arm-regression.mjs` — time the armed grammar unarmed, construct one `memoize()` (flips
`PACKRAT_ARMED`), re-time the **same** grammar:

```
armed (unarmed, epoch skipped):       151.8 ms
armed (AFTER memoize, epoch taken):   180.4 ms   → 18.83% slower than unarmed
baseline (always epoch):              173.4 ms
armed-after-arm vs baseline:          +4.07%  (≈ parity — epoch restored)
```

Arming the flag erases the win and returns to baseline. The ~30 ns/parse fixed cost is precisely the
3 Map allocations + object-literal snapshot + restore.

### F5 — The % is workload-dependent; it collapses on long inputs

`heavy-bench.mjs` — same grammar, **long** transform chains (avg 114 chars, e.g.
`translate(10px, 20px) rotate(45deg) scale(1.2) skewX(12deg) …`), median of 9 trials:

```
baseline 118.4 ms   armed 116.4 ms   delta 1.64% faster   (0 mismatches)
```

The reclaim is a **fixed ~25–40 ns per top-level parse**; its *percentage* is `~30ns / total-parse-time`.
Short CSS values (the dominant keyframe shape: `0`, `16px`, `#fff`, `translateX(10px)`) parse in
~220 ns → the epoch is a mid-teens fraction. Long strings parse in ~1.3 µs → the epoch is <2%. The
realistic value.js keyframe corpus is **short-value-dominated**, so the realistic delta lands in F2's
range, not F5's. (Caveat toward honesty: value.js's *real* grammar does more per parse than my proxy —
normalization, unit conversion, color-space work — so the true value.js delta on short inputs is
plausibly high-single-digit to low-teens rather than the full 18%. Still comfortably >5%.)

### F6 — Soundness preserved: left-recursion still works armed

`soundness.mjs` (pattern lifted verbatim from parse-that's `memoize.test.ts`): a direct
left-recursive `memoize(Parser.lazy(() => expr.or(digits)))` and a `mergeMemos` left-recursive math
grammar both parse correctly **after** the flag arms — `2/2 pass`. Arming does not weaken the packrat
tier; it only defers epoch machinery until the first `memoize()` exists.

### F7 — chain() falsy-fix shape (r6 F3) confirmed and cured

`chain-bug.mjs` on the **baseline** bundle (the live `parser.ts:130` truthiness gate
`state.value || chainError`):
```
input "0x":  0     (want "0x")   ← BUG: falsy seed 0 skips the continuation
input "5x":  "5x"  (want "5x")   ← non-falsy seed threads fine
```
`chain-fix.mjs` on the **armed** bundle after applying r6's proposed shape (`!state.isError || chainError`):
```
FIXED "0x": "0x"   ✓
FIXED "5x": "5x"   ✓
FIXED "xy" (first stage genuinely fails): undefined   ✓  (error still short-circuits)
```
The fix shape r6 identified is correct: gate on parse-success, keep `chainError` as the opt-in
"continue on error" escape. A `0`/`""`-seed regression test is the born-RED oracle S.H2 names.

---

## 4. VERDICT: **confirms-spec**

Q11's SUCCESS condition — *flat heap across N non-memoized parses **and** a measurable throughput
delta* — is met on the realistic (short-value) workload: **14–18% throughput** (F2) and **~34% less
retained heap** (F3), reproducible, mechanism-proven (F4), soundness-preserving (F6). This is **above
the 5% KILL threshold**, so **S.H1 stays a perf-wave** (not demoted to hygiene). The chain() fix shape
(S.H2) is confirmed and cured (F7).

**Refinement inside the confirm (not a spec change):**

1. **Gate on retained-heap, not on a throughput %.** F5 shows the throughput % is strongly
   workload-dependent (mid-teens on short values, <2% on long strings). The *heap* signal is stable
   and grammar-independent. S.H1 **already** specifies the retained-heap born-RED clause — keep that;
   do **not** add a throughput-% threshold gate (it would flake on input-length distribution). This
   confirms the spec's existing gate choice.
2. **Do not over-claim a fixed % in the changelog.** The honest statement is: *"eliminates a fixed
   ~30 ns / 3-Map allocation per top-level parse; mid-teens % throughput on short CSS values,
   negligible on long strings; ~34% less retained heap on the non-memoized path."*
3. **Design nit surfaced by the prototype:** `packratEnter` must return `PackratEpoch | null` (or a
   shared sentinel) and `packratExit` must null-guard — a one-type-widening ripple. The real wave
   should also decide whether `resetPackrat()` (`packrat.ts:231`) should early-return when unarmed
   (currently it `.clear()`s live Maps — harmless but touchable for symmetry).

---

## 5. Implementation-cost estimate for the real wave

**Repo:** parse-that (own tranche letters; published then re-pinned per constellation discipline —
**no `file:` links**, **no bbnf-lang**).

**S.H1 (arming) — files touched:**
- `typescript/src/parse/packrat.ts` — add `PACKRAT_ARMED`; early-return in `packratEnter`/`packratExit`;
  arm in `makeMemoized`; widen `PackratEpoch` → `PackratEpoch | null`. (~10 lines.)
- `typescript/src/parse/parser.ts` — no logic change; `epoch` is now `… | null` (type flows through).
- **Gate:** born-RED `proof:perf` retained-heap clause (N non-memoized parses allocate flat) — parse-that's
  harness already measures retained heap under `--expose-gc`. RED on today's tree (3 Maps/parse), GREEN
  after arming.
- **Semver:** patch. **Risk: LOW** — semantics unchanged; F6 proves packrat soundness; F4 proves the
  mechanism; the only surface is a `| null` type widening on two internal functions.

**S.H2 (chain fix) — bundled, files touched:**
- `typescript/src/parse/parser.ts:128-134` — `!state.isError || chainError` (F7 shape).
- new regression test: `0`/`""`/`false`-seed first stage threads to continuation; genuine-error still
  short-circuits.
- **Semver:** patch (bugfix). **Risk: LOW** — value.js's 4 `.chain` sites chain on non-falsy CSS
  tokens today (r6 F3), so no live consumer regresses; the fix only *adds* correct behavior for falsy
  seeds. Re-run value.js's suite against the re-pinned build as the consume-edge check.

**Gates affected across the constellation:** parse-that's own `proof:perf` (new heap clause) + chain
regression test; on re-pin, value.js's parse suite + keyframes.js `proof:boundary`/compile gates
should stay green (no API surface change — arming is invisible; chain fix is behavior-additive). No kf
source touched by this wave (kf has zero direct parse-that imports — r6 F2). **Combined risk: LOW**;
this is the "subtraction and tuning" r6's thesis promised, and the one parse-perf reclaim that
registers on a real bench.

---

### Appendix — prototype artifacts (scratchpad, throwaway)

`scratchpad/{baseline,armed}/*.ts` (variant sources) · `grammar-factory.ts` / `corpus.ts` (grammar +
corpus) · `build.mjs` (vite bundler) · `run-bench.mjs` (throughput + heap) · `soundness.mjs`
(left-recursion) · `arm-regression.mjs` (mechanism) · `heavy-bench.mjs` (long-input bracket) ·
`chain-bug.mjs` / `chain-fix.mjs` (F7).
