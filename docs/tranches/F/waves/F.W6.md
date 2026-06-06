# F.W6 — The computed-unit endpoint cache (charter F6)

**Phase:** IMPL (spec authored in DEV — awaits auth) · **Class:** SHIP-in-F (the kf-side endpoint
cache — the bigger half of D-3) + value.js-HANDOFF (Band V Wave C secondary hardening,
inv-16) · **Scope:** `src/animation/utils.ts` (`prepareInterpVar` — the seam where the
dispatch is already resolved; the `InterpolatedVar` carries the cache) + the
`setTargets`/resize-epoch invalidation seam · **DAG-deps:** depends on F.W0 (the spine)
AND **F.W1** (the interp benches must run to gate the per-frame resolve-count honestly).
Band 1, parallel to F4/F5. Pairs value.js Band V Wave C (inv-16 — kf consumes through
the unchanged `lerpValue → iv._lerp` seam; ZERO kf edit needed for the value.js half).

The §Mandate (F.W0) is the spine; this wave most tests **measure-first** AND **inv-16** —
the kf-side endpoint cache (the bigger half of the real D-3 win) **never landed in E**,
and the value.js memo path it makes cold is a HAND-OFF (kf proposes, never writes
value.js). `lerpComputedValue` re-resolves BOTH endpoints every frame, and the value.js
memo re-serializes its key (`value.toString()`) on every hit for an O(1)-invariant pair
(~190 ns/leaf/frame, empirically sized → ~1.2 ns, −99.3% measured).

This is net-new (the FOLD-E half of D-3 that E.W9 specced but did NOT land — verified
absent in `src/`). Verified not asserted (inv ε) against `tranche-e-impl`.

**Provenance.** `p-runtime-perf-F P-3` (the live verification: no kf endpoint cache exists;
the value.js write→read→write thrash + per-hit re-serialize confirmed live),
`vj-units-compute-aug C1/C2/C4` (the value.js Wave C handoff; C1 endpoint cache MEASURED
−99.3%), `a-vj-consumption-F §1` (the consumed surface — kf reaches the computed-unit
round-trip through `iv._lerp` with no normalize surface).

---

## § The state, verified (not asserted)

The live facts, read- and grep-confirmed on `tranche-e-impl` (and the live value.js tree
at `/Users/mkbabb/Programming/value.js`):

1. **The kf-side endpoint cache (C1) is NOT landed.** `createInterpVarValue`
   (`utils.ts:325-340`) compiles each var via `prepareInterpVar(normalizeValueUnits(l, r,
   opts))` (`utils.ts:339`, verified live) — value.js resolves the dispatch (`iv._lerp`) once,
   but the returned `InterpolatedVar` carries NO cached resolved endpoints for the computed
   path. A repo-wide grep for `cachedStart`/`cachedStop`/`endpoint.*cache`/`resize.*epoch`/
   `layoutEpoch` in `src/animation/**` returns **nothing** (verified live — "nil — confirmed
   not landed"). The only `ResizeObserver` hits are in the demo. The E handoff Wave C +
   `a-kf-runtime §4` named the kf-side endpoint cache as the FOLD-E half of D-3 owned by
   E.W9 — **it did not land** (`p-runtime-perf-F §3.1`).

2. **The per-frame cost is real and exactly as D named it.** For a `calc(100cqw - 100%)` leaf
   (the demo's `AnimationVisualizer`, per MEMORY.md), the per-frame `lerpValue → iv._lerp →
   lerpComputedValue` re-resolves BOTH endpoints against the live box every tick. Grounded in
   the live value.js tree (`p-runtime-perf-F §3.2`): `interpolate.ts:31-32` resolves
   `newStart`/`newStop` every frame; `normalize.ts:195-196` the memo `keyFn` RE-SERIALIZES on
   every call (hit included): `` `${value.toString()}-${target ? getElementId(target) : "null"}` ``;
   `normalize.ts:162-168` the cold path forces a synchronous layout flush (write → read → restore).
   So even on the memo HIT path, every computed leaf pays `start.toString()` + `stop.toString()`
   (two full `ValueUnit` serializations) + two `Map` hashes + a `Date.now()` (a dead TTL clock,
   `ttl===Infinity`) to retrieve an O(1)-invariant pair.

3. **The win is empirically sized.** `vj-units-compute-aug C1`: ~190 ns/leaf/frame → ~1.2 ns
   (−99.3% measured) for the endpoint cache; the cheaper C2/C4 fallback alone gets to ~8.5 ns
   (−95%). `valuejs-sota-handoff-v2.md:79-80,262`: "This is no longer a withhold."

4. **kf reaches value.js purely through `iv._lerp` — the boundary is clean.** `a-vj-consumption-F §1`:
   the per-frame interp hot path consumes `lerpValue`, `prepareInterpVar`, `normalizeValueUnits`,
   `InterpolatedVar` — kf wraps neither normalize surface; it reaches the computed-unit round-trip
   purely through the `lerpValue → iv._lerp` seam (`engine.ts:629`, `utils.ts:339`). So value.js can
   land the entire Wave C fix with ZERO kf edits, and the kf endpoint cache (the seam at
   `utils.ts:339`) makes the value.js memo path COLD for prepared vars.

The wave's job: cache the resolved `(newStart, newStop, newUnit)` on the `InterpolatedVar` at
`prepareInterpVar` time, invalidate on `setTargets`/resize-epoch, and close it with a call-counter
asserting steady-state resolves are served from the cache, not re-derived — plus re-confirm (NOT
write) the paired value.js Wave C items (inv-16).

---

## § Goal

**What lands (the IMPL the spec gates):**
- **The kf-side endpoint cache (SHIP — the bigger half of D-3)** — cache the resolved
  `(newStart, newStop, newUnit)` on the `InterpolatedVar` at `prepareInterpVar` time (the seam where
  the dispatch is already resolved, `utils.ts:339`; the shape already carries
  `_lerp`/`colorSpace`/`hueMethod` precomputed — the natural home). The per-frame computed body
  collapses to a bare `lerp(cachedStart, cachedStop, t)` — no re-serialize, no value.js memo call, no
  reflow for prepared vars. Invalidate on `setTargets` and on a `ResizeObserver` layout-epoch (a
  generation counter bumped on resize — the one event that changes the resolution). ~190 → ~1.2
  ns/leaf/frame (−99.3% measured). (SHIP-in-F.)
- **The paired value.js Wave C items RE-CONFIRMED (not written)** — C2 (stable-identity memo key, no
  per-hit `toString()`), C3 (batched resolve, cut cold reflows to 1/target), C4 (`ttl===Infinity`
  fast path), C5 (the 24-of-45 no-op length units — standalone correctness, LEADS Wave C), C7 (resize
  eviction). The kf endpoint cache makes the value.js memo HIT path COLD for prepared vars, so
  C2/C3/C4 drop to a SECONDARY hardening for the external/unprepared path. **kf proposes; the value.js
  owner sequences (inv-16) — ZERO kf edit for the value.js half.** (value.js-HANDOFF.)

**Why:** this is the real D-3 win, and the kf-side half is the BIGGER one — it removes the value.js
memo from the hot path ENTIRELY for prepared vars (the prepared majority), so the per-frame computed
leaf stops paying two `ValueUnit` serializations + two `Map` hashes + a dead `Date.now()` to retrieve
an O(1)-invariant pair (`p-runtime-perf-F §3.3`). The cold path's per-leaf forced layout flush
(`normalize.ts:162-168`) — the layout-thrash anti-pattern Motion's batched read/write phase exists to
kill — is eliminated for prepared vars. The value.js half is the fallback hardening for the
unprepared path + the correctness fixes (C5 unit coverage, C7 resize) the kf cache cannot reach.

---

## § Scope

### S1 — The kf-side endpoint cache on the `InterpolatedVar` — `p-runtime-perf-F P-3` / `vj-units-compute-aug C1`

**WHAT:** at `prepareInterpVar` time (`utils.ts:339`, the seam where `iv._lerp`/`colorSpace`/`hueMethod`
are already resolved — the natural home), cache the resolved `(newStart, newStop, newUnit)` on the
`InterpolatedVar` for the computed path. The per-frame `lerpComputedValue` body for a prepared var
collapses to a bare `lerp(cachedStart, cachedStop, t)` — NO `value.toString()`, no `getComputedValue`
memo call, no forced reflow.

**WHY:** the per-frame computed body re-resolves both endpoints every tick and the value.js memo
re-serializes its key on every hit (`p-runtime-perf-F §3.2`) for an O(1)-invariant pair — ~190
ns/leaf/frame for nothing. Caching at the seam where the dispatch is already resolved is the
idiomatic home (the `InterpolatedVar` already carries the precomputed dispatch); it removes the
value.js memo from the hot path entirely for prepared vars (−99.3%). The §Mandate forbids a
workaround — this is not "memoize harder" or "skip the resolve sometimes"; it is caching the genuinely
O(1)-invariant resolved pair at its natural seam.

### S2 — Invalidate on `setTargets` + the resize layout-epoch — `p-runtime-perf-F §3.3` / `vj-units-compute-aug C7`

**WHAT:** the endpoint cache is invalidated on (a) `setTargets` (a new target changes the resolution
context) and (b) a `ResizeObserver` layout-epoch — a generation counter bumped on `resize`, the one
event that changes a computed-unit resolution. A cache entry stamped with a stale epoch is re-resolved
on next use.

**WHY:** the cache is pixel-identical WHILE the layout epoch is stable; the ResizeObserver
invalidation trades one frame of staleness on resize (the current per-frame resolve is never stale)
for eliminating the per-frame thrash — "almost always acceptable, gated by the resize contract"
(`p-runtime-perf-F §3.3`). The invalidation is the correctness clause that makes the cache safe; it
pairs the value.js C7 resize-eviction (the value.js memo's own resize bust, HANDOFF).

### S3 — Re-confirm the paired value.js Wave C items (HANDOFF — kf proposes, never writes) — `vj-units-compute-aug C1-C7` / `a-vj-consumption-F §1`

**WHAT:** re-confirm (NOT write) in the Band V value.js charter v2 that the kf endpoint cache makes the
value.js memo HIT path cold for prepared vars, so:
- **C2** (stable-identity memo key — key on a per-`ValueUnit` monotonic id / `WeakMap` so a HIT pays 0
  `toString()`) drops to SECONDARY hardening for the external/unprepared path (−95% fallback);
- **C3** (batched resolve — cut cold-path forced reflows from N-per-target to 1) — secondary;
- **C4** (`ttl===Infinity` fast path — skip the dead `Date.now()`) — bundle with C2;
- **C5** (the 24-of-45 no-op length units — `50dvh`→`50px` silent wrong pixels) — LEADS Wave C as
  standalone correctness, the cleanest falsifiable gate; jsdom can't catch it; the kf cache cannot
  reach it (it's a value.js conversion bug);
- **C7** (resize eviction) — pairs S2's kf-side invalidation.

**inv-16: kf writes only keyframes.js.** The value.js items route through the Band V charter v2; the
value.js owner sequences them. kf consumes the entire Wave C fix unchanged through `iv._lerp` (ZERO kf
edit for the value.js half — `a-vj-consumption-F §1`).

**WHY:** the kf endpoint cache and the value.js Wave C are NOT blocked by each other — both are real,
and the kf seam re-points the value.js items from "the primary D-3 win" to "the secondary hardening for
the unprepared path + the correctness fixes" (`p-runtime-perf-F §3.3`). Re-confirming the cross-repo
edge (not re-writing the handoff — it is ALREADY authored) keeps the inv-16 boundary clean.

### S4 — `proof:computed-frame` (the falsifiable close) — `vj-units-compute-aug C1` / `F.md §F.W6`

**WHAT:** a new gate `proof:computed-frame` (chained into `proof:all` + CI via F2): a call-counter on
the per-frame resolve path that asserts (a) the steady-state computed resolves are served from the
endpoint cache, not re-derived — a `toString`/`getComputedStyle` call-counter showing O(1)-per-frame
(paid once at prepare), and (b) a forced-reflow count → ~0 steady-state for prepared vars; plus a
`setTargets`/resize re-resolve test (the cache busts on the epoch bump).

**WHY:** inv ε — the close must BITE. The call-counter is the falsifiable form of "the steady-state
resolves are served from the cache"; the forced-reflow count is the falsifiable form of "no per-frame
layout thrash." The gate ships WITH the cache (`vj-units-compute-aug C1`: "the bench ships WITH the
cache"). BITES: revert the cache → the per-frame `toString`/`getComputedStyle` count climbs to
O(frames) → reds.

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES:

1. **Steady-state computed resolves are served from the cache, not re-derived.**
   `proof:computed-frame` clause a: a `toString`/`getComputedStyle` call-counter over a 600-frame
   steady window on a prepared computed var (`calc(100cqw - 100%)`) shows O(1) resolves (paid once at
   prepare), not O(frames). BITES: revert the endpoint cache → the count climbs to O(frames) → reds.
2. **No per-frame layout thrash.** `proof:computed-frame` clause b: the forced-reflow count → ~0
   steady-state for prepared vars. BITES: a per-frame `getComputedStyle` (the cold-path flush) → reds.
3. **The cache busts on `setTargets`/resize.** A re-resolve test: a `setTargets` call or a
   ResizeObserver epoch bump invalidates the cache and the next frame re-resolves. BITES: a stale
   resolution after resize (the cache fails to bust) → reds.
4. **Pixel-identical while the epoch is stable.** The cached path's output is byte-identical to the
   per-frame-resolve path while the layout epoch is stable. BITES: a value drift → reds.
5. **kf-local; the value.js half is HANDOFF (inv-16).** The kf cache touches only `utils.ts`
   (`prepareInterpVar`/the `InterpolatedVar`) + the invalidation seam; ZERO value.js edit (Wave C
   routes through the Band V charter). BITES: a value.js edit in F → reds (inv-16).

---

## § Folds

Retires (by finding id):
- **`R4`/`C1`** — the computed-unit endpoint cache (`F.md §F.W6`) — S1 (cache) + S2
  (invalidate) + S3 (HANDOFF re-confirm) + S4 (gate).
- **`p-runtime-perf-F P-3`** — the real D-3: computed-unit re-resolves both endpoints/frame + memo
  re-serializes key/hit; the kf endpoint cache never landed — S1/S2.
- **`a-vj-consumption-F §1`** — the consumed surface (kf reaches computed-unit round-trip through
  `iv._lerp`; ZERO normalize surface) — S3 (the clean inv-16 boundary).

**value.js-HANDOFF (Band V Wave C — kf proposes, never writes; `vj-units-compute-aug`,
`valuejs-sota-handoff-v2.md:250-289`):**
- **C2** stable-identity memo key (−95% fallback) — SECONDARY hardening for the unprepared path once
  the kf cache lands. HANDOFF.
- **C3** batched resolve (cold reflows N→1/target) — SECONDARY. HANDOFF.
- **C4** `ttl===Infinity` fast path (skip the dead `Date.now()`) — bundle with C2. HANDOFF.
- **C5** the 24-of-45 no-op length units (`50dvh`→`50px` silent wrong pixels) — **LEADS Wave C** as
  standalone correctness; the cleanest falsifiable gate; jsdom can't catch it; bites kf today; the kf
  cache cannot reach it (a value.js conversion bug). HANDOFF (HIGH correctness).
- **C7** `getComputedValue` memo eviction/invalidation (resize layout-epoch) — pairs S2's kf-side
  invalidation. HANDOFF.

**KILL/RECORD ledger for Band 1 (carried so no future lane re-raises — shared with F4/F5,
`F.md §F.W6 (the Band-1 KILL/RECORD ledger)`):** DOM write-skip diff-cache KILL (the real cost is `unflattenObjectToString`
→ value.js-HANDOFF VJ-F4/VJS-2); D1 frozen-shape `ValueUnit` KILL (the lever is D2 SoA → value.js-HANDOFF,
gate on real-K); CSS Typed OM as interp carrier KILL(record); W8 S1 RECORD / S2 MEASURE-FIRST+BOOK /
S3 BOOK; `tryParseCache` eviction RECORD (the bound belongs in value.js `memoize`, Band V F3); preset
lazy memo RECORD.

**RECORD (already-SOTA — `p-runtime-perf-F §5`):** the pre-resolved `_lerp` dispatch (the type-check is
hoisted out of the per-call path), the in-place `value.value` mutation + serialize-only-at-write-boundary,
the WAAPI compositor delegation (its eligibility excludes computed units — `waapi.ts:30` spreads
`COMPUTED_UNITS` — which is WHY the rAF computed resolver is the only consumer and F6 matters for the rAF
majority). LEAVE.

---

## § Design decisions

1. **Cache at the `prepareInterpVar` seam — the natural home — RESOLVED.** The `InterpolatedVar` already
   carries the precomputed dispatch (`_lerp`/`colorSpace`/`hueMethod`); the resolved
   `(newStart, newStop, newUnit)` belongs on the same shape (`vj-units-compute-aug C1`,
   `p-runtime-perf-F §3.3`). The per-frame body for a prepared var collapses to a bare `lerp`. Trade-off:
   the `InterpolatedVar` grows three cached fields — but they are the genuinely O(1)-invariant resolution
   the per-frame body re-derives for nothing; caching them at the seam where the dispatch is already
   resolved is the idiomatic move, not a bolt-on.

2. **Invalidate on the resize layout-epoch — the correctness clause — RESOLVED.** The cache is
   pixel-identical while the layout epoch is stable; the only event that changes a computed-unit
   resolution is resize, so a `ResizeObserver` generation counter is the precise invalidation
   (`p-runtime-perf-F §3.3`). Trade-off: one frame of staleness on resize (vs the current never-stale
   per-frame resolve) — almost always acceptable, and gated by the resize contract; the per-frame thrash
   it removes is the layout-thrash anti-pattern Motion's batched phase exists to kill. The §Mandate's
   isomorphic-unless-named: the named delta is "one frame of resize staleness for −99.3% steady-state."

3. **The kf cache makes the value.js memo cold — the HANDOFF re-points, not duplicates — RESOLVED +
   HONEST (inv-16).** The kf-side endpoint cache (SHIP) is the BIGGER half of D-3; it removes the value.js
   memo from the hot path entirely for prepared vars, so the value.js Wave C items (C2/C3/C4) drop from
   "the primary D-3 win" to "the secondary hardening for the external/unprepared path," and C5/C7 remain
   as the correctness fixes the kf cache cannot reach. kf proposes via the Band V charter; the value.js
   owner sequences (inv-16 — kf writes only keyframes.js). Trade-off: shipping the kf half before the
   value.js half lands means the unprepared path still pays the value.js cost — but the two are not
   blocked by each other, both are real, and the kf half is the larger, kf-local win F can land now
   without breaching the boundary.
