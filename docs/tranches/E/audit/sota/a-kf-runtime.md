# SOTA audit — keyframes.js runtime hot-path perf (Tranche E)

**Lane:** the per-frame runtime hot path. `engine.ts` `interpFrames`
(binary-search + `processFrame` + `Object.assign`), `utils.ts` `lerpValue`
dispatch + `transformTargetsStyle`, `group.ts` compositor, `playback.ts` loop
core. Steady-state allocations (D made the *group composite* zero-alloc — what
about the rest?), monomorphism, the per-frame DOM write, and a fresh-eyes
re-examination of **D-3** (the computed-unit DOM round-trip, withheld in D.W4).

**Scope:** keyframes.js engine `src/animation/` only. Research-only.
**inv-16:** keyframes.js findings → `FOLD-E`; value.js findings →
`FOLD-VALUEJS-HANDOFF` (value.js is dirty + active; propose a value.js tranche,
never write it). This file is the only one this lane writes.

**Method:** live code (`file:line`) grounded against the
`modern-web-guidance@latest` Baseline corpus and the value.js source the engine
consumes (`/Users/mkbabb/Programming/value.js`). Every finding carries a
disposition and an isomorphism note. Branch at audit: `tranche-d-impl`.

---

## 0. Executive verdict — the group is zero-alloc; the *standalone* loop is not

D.W4 D-1 made the `AnimationGroup` composite path allocation-free and proved it
with a buffer-identity gate (`test/zero-alloc.test.ts`). That work is real and
holds. But the lane question — *"D made the group zero-alloc — others?"* — has a
sharp answer: **the standalone `Animation` play loop and the steady-state
per-frame DOM write are NOT zero-alloc, and the `RAFPlayback` core allocates two
promises + microtasks per frame for EVERY loop including the synchronous
ones.** The zero-alloc discipline stopped at the group's `transformFramesGrouped`
return value; it never reached (a) `interpFrames`'s default `out = {}`, (b) the
`processFrame` closure rebuilt per call, (c) the `async`/`await` frame chain, or
(d) `transformTargetsStyle`'s per-frame re-serialization + unconditional
`setProperty`.

The headline runtime findings, in descending value:

1. **E-RT-1 (FOLD-E)** — the standalone `Animation` hot path allocates a fresh
   `out` object **and** a fresh `processFrame` closure **every frame**. The
   group buffer-passes; the standalone path does not. The zero-alloc bench
   covers only the group. *High value, low risk, isomorphic.*
2. **E-RT-2 (FOLD-E)** — `RAFPlayback._run` wraps every frame in
   `Promise.resolve(step(now)).then(...)`, and `Animation._frame` / `advanceTo`
   are `async` even on the steady-state path that awaits nothing. ~2 promises +
   2 microtask hops per animation per frame. *High value; needs care around the
   genuinely-async delay/onEnd path — split the steady-state stepper from the
   lifecycle awaits.*
3. **E-RT-3 (FOLD-E)** — `transformTargetsStyle` (the per-frame DOM WRITE)
   re-serializes the whole var-set via `unflattenObjectToString` and calls
   `setProperty` for every key every frame, even when the produced string is
   byte-identical to last frame. Diff-and-skip + a cached serialization key is
   the SOTA "batch writes, avoid redundant style mutations" move. *Medium-high
   value; pairs with E-RT-1's buffer.*
4. **D-3 re-confirmed (FOLD-VALUEJS-HANDOFF, with a keyframes-local seam)** — the
   computed-unit (`calc`/`var`/`vh`/`cqw`) path pays two `value.toString()`
   serializations + two `Map` key-hashes + a `Date.now()` **per computed leaf
   per frame** purely to construct a memo key for a resolution that is invariant
   across the animation's life. D withheld this pending measurement; with fresh
   eyes the *keyframes-side* cache seam (cache resolved endpoints on the
   `InterpolatedVar`) is sound and the *value.js-side* memo-key cost is real.
   Split disposition below.
5. **E-RT-5 (FOLD-E)** — `processFrame`'s `scale(t, start, stop, 0, 1)` throws on
   a zero-width frame (`start === stop`, two keyframes at the same percent). Edge
   robustness, not perf. *Low value, named.*

Everything else in the hot path — the **binary search** (`binarySearchRange`,
O(log N), correct), the **pre-resolved `lerpValue` dispatch** (`_lerp` set once
at `prepareInterpVar`), the **pre-flattened `allInterpVars`** (built once in
`parse`), the **dirty-flagged sorted `_entries`** cache, the **`scheduler.yield`
batched advance** (INP relief) — is **ALREADY SOTA** and should be flagged as
such, not re-litigated. See §6.

---

## 1. E-RT-1 [FOLD-E] — the standalone `Animation` loop is not zero-alloc

**File:** `src/animation/engine.ts:547-607` (`interpFrames`), called at
`engine.ts:699` (`this.interpFrames(t, true)` — the standalone rAF play frame)
and `engine.ts:526` (`at()`), and `demo/app/App.vue:333`
(`anim.interpFrames(snap.t, false)` — scrub).

**The gap.** `interpFrames` signature is:

```ts
interpFrames(t, transformFrames = false, out: Record<string, ValueUnit[]> = {}) {
    const result = out;
    for (const k in result) delete result[k];
    ...
    const processFrame = (frame) => { ... };   // ← closure ALLOCATED per call
    ...
}
```

Two steady-state allocations per call on the standalone path:

- **The default `out = {}`** — the group passes `entry.values` (the zero-alloc
  win, `group.ts:228-232`), but the standalone play loop (`engine.ts:699`),
  `at()` (`engine.ts:526`), `fillForwards`/`fillBackwards` (`engine.ts:487,491`),
  and the demo scrub (`App.vue:333`) all call WITHOUT an `out` buffer → a fresh
  object every frame. For a 60 fps standalone animation that is one object +
  N `ValueUnit[]` slot assignments allocated per frame, garbage every frame.
- **The `processFrame` closure** (`engine.ts:573`) is a new function object
  every `interpFrames` call. It closes over `t`, `result`, `transformFrames`,
  `this` — a per-frame closure allocation in the hottest method of the engine.

**The transposition.** (a) Hoist a per-instance `_interpOut` buffer the same way
the group hoisted `_grouped` (`group.ts:91`); have the standalone `_frame`
(`engine.ts:699`) pass it, so a standalone animation reuses one cleared buffer
exactly as the group does. (b) Lift `processFrame` to a private method (or inline
the two scan loops over a shared body) so no closure is minted per frame — `t`,
`out`, `transformFrames` become parameters/fields. The group already proved the
pattern; this is *applying the same discipline one layer down*, where most
single-animation consumers actually live.

**Perf/elegance rationale.** The single-`Animation` play path is the *common*
case (the group is the compositor special-case). Today the headline "zero-alloc"
property is true only for the multi-animation compositor; a plain
`anim.play()` allocates every frame. Closing this makes the zero-alloc claim
hold for the primitive, not just the composite — gestalt cohesion.

**Disposition: FOLD-E.** Pure keyframes-side change in `engine.ts`.

**Isomorphism.** Pixel-identical: the buffer holds the same keys/values; only the
allocation site changes. The zero-alloc bench (`test/zero-alloc.test.ts`) should
grow a sibling that asserts **standalone** `interpFrames` returns the same buffer
reference across frames when handed one (the buffer-identity instrument the group
test already uses, extended to `Animation`).

---

## 2. E-RT-2 [FOLD-E] — per-frame promise + microtask churn in the loop core

**File:** `src/animation/playback.ts:96-111` (`_run`), `engine.ts:662-685`
(`advanceTo`, `async`), `engine.ts:691-712` (`_frame`, `async`),
`group.ts:360-389` (`advanceTo`, `async`), `group.ts:392-404` (`_advanceSlice`,
`Promise.all`).

**The gap.** The shared scheduler core wraps EVERY frame:

```ts
// playback.ts:99-108
const frame = (now) => {
    void Promise.resolve(step(now)).then((cont) => { ... });
};
```

`Promise.resolve(...).then(...)` allocates a promise + schedules a microtask
**every frame, for every loop** — including `drive` (`playback.ts:168`), whose
`Tickable` step (`SmoothProgress`/`SpringProgress` `tickDt`) is **synchronous**
and returns a plain boolean. A synchronous stepper pays a promise + microtask
hop it never needs.

On the `Animation` path it compounds: `_frame` is `async` and does
`t = await this.advanceTo(t)` (`engine.ts:692`); `advanceTo` is `async`
(`engine.ts:662`). On the steady-state frame — not the first frame, not the
last — `onStart`/`onEnd`/`sleep(delay)` are NOT reached, so nothing is actually
awaited, yet the `async` functions still allocate a promise each and the `await`
inserts a microtask turn. Net: roughly **two promises + two microtask hops per
animation per frame** with zero real asynchrony in steady state. In a group of N
children this is 2N promises/frame on top of `_advanceSlice`'s `Promise.all`
(`group.ts:403`) allocating a promises array + an aggregate promise per slice
per frame.

**The transposition.** Two seams, both isomorphic:

- **`_run` fast path for synchronous steps.** When `step(now)` returns a
  boolean (not a thenable), reschedule synchronously without the
  `Promise.resolve().then` wrap. The async branch stays for `loop` callbacks
  that genuinely return a promise (the `Animation`/`group` draw frames today).
  A `typeof result?.then === "function"` check picks the path. `drive`
  (synchronous steppers) stops paying for asynchrony it doesn't use.
- **Make the steady-state advance synchronous.** `advanceTo`/`_frame` are
  `async` only because the *first* frame may `await onStart()`→`sleep(delay)`
  and the *last* may `await onEnd()`. The steady-state body
  (`this.t = t - this.startTime; interpFrames(...)`) is synchronous. Hoist the
  one-time `onStart` (delay/dispatch) out of the per-frame path (run it before
  the loop starts, as `RAFPlayback.play` already does for its duration loop),
  and let the per-frame step be a synchronous function returning a boolean —
  the `onEnd` lifecycle can fire without forcing the whole stepper async (it
  mutates flags + dispatches an event; neither needs an `await`). Then the
  `Animation`/`group` draw frame rides the `_run` synchronous fast path above
  and the steady state allocates nothing in the scheduler.

**Perf/elegance rationale.** Promise/microtask churn at 60 fps × N animations is
exactly the "long animation frame" tax the
`modern-web-guidance` LoAF guides target (`identify-heavy-scripts`,
`identify-inp-causes` — both Baseline-current). The demo already ships a LoAF
observer (`demo/app/loaf-observer.ts`); this is the engine-side counterpart —
*don't generate the per-frame microtask the observer would flag*. Elegance: the
loop core's "is this step async?" decision is made once per frame at the cheapest
possible check, and the steady-state animation step becomes a pure synchronous
function — KISS.

**Risk note (honest).** This is the highest-care finding in the lane. The
`async` chain currently carries genuine semantics on the *boundary* frames
(delay gating, the awaited `onEnd` before `_resolvePlay`, the WAAPI shadow
tick's awaited `playWAAPI`). The transposition must preserve those exactly —
the win is isolating the steady-state frame from the boundary frames, not
deleting the awaits. Measure-first, like D-3: a per-frame
promise-allocation counter (or a LoAF-style microtask probe) gates the change.

**Disposition: FOLD-E.** All in `playback.ts` + `engine.ts`/`group.ts`.

**Isomorphism.** Behaviour-identical: same frames, same events, same resolve
timing on completion. Only the per-frame microtask/promise allocation changes.
A test asserting `animationstart`/`animationiteration`/`animationend` ordering +
the play-promise resolve point is unchanged is the guard.

---

## 3. E-RT-3 [FOLD-E] — the per-frame DOM write re-serializes + writes unconditionally

**File:** `src/animation/utils.ts:305-319` (`transformTargetsStyle`), called
per-frame from `Animation.transform` (`engine.ts:159-161`, the
`_defaultTransform`) and `CSSKeyframesAnimation.transform` (`engine.ts:1036`),
through value.js `unflattenObjectToString` (`value.js
src/units/utils.ts:115-148`).

**The gap.** Every painted frame:

```ts
const styleStringVars = unflattenObjectToString(vars);   // fresh object + per-key string build
targets.forEach((target) => {
    Object.entries(styleStringVars).forEach(([key, value]) => {   // fresh entries array
        target.style.setProperty(key, value);                     // unconditional write
    });
});
```

- `unflattenObjectToString` (value.js) allocates a fresh result object and
  builds each property string via `+=` with `keys.split(".")` per key — a fresh
  allocation set per frame.
- `Object.entries(...)` allocates an array of pairs per target per frame.
- `target.style.setProperty(key, value)` fires **even when `value` is identical
  to the value written last frame** — e.g. a `transform` whose serialized string
  hasn't changed because the eased delta rounded to the same px. Redundant style
  writes are the "avoid layout thrashing / batch writes" anti-pattern called out
  in the `performance` guide (Baseline-current): *"DON'T cause layout thrashing…
  batch DOM reads, then batch DOM writes."* A redundant `setProperty` with an
  unchanged value still dirties style and can invalidate.

**The transposition.** Cache the last-written string per `(target, property)` on
the instance and **diff-and-skip**: only call `setProperty` when the serialized
value actually changed. Pair this with E-RT-1's buffer so the var-set the writer
consumes is itself stable. The serialization (`unflattenObjectToString`) can be
done into a reused per-instance string map (cleared in place) rather than a
fresh object — the same hoist-and-clear idiom the group composite uses. The
value.js `unflattenObjectToString` itself could expose a buffer-reusing
variant (see handoff note below), but the *write-skip* and the *string-cache*
are entirely keyframes-side and land independently.

**Perf/elegance rationale.** This is the literal "per-frame DOM write" the lane
names. The group went to great lengths to be zero-alloc up to `this.transform(...)`
(`group.ts:302`) — and then the transform allocates and writes unconditionally,
undoing the discipline at the last step. Closing the write path is the natural
completion of the zero-alloc story: composite without garbage, *then* write
without garbage and without redundant style mutations.

**Disposition: FOLD-E** for the keyframes-side write-skip + string cache.
**FOLD-VALUEJS-HANDOFF** for a buffer-reusing `unflattenObjectToString` variant
(see §5).

**Isomorphism.** Pixel-identical: the same final CSS lands on the element; only
*redundant* writes are elided and the serialization stops generating garbage. A
`setProperty` call-counter test (write count over a steady window with an
unchanging key) is the falsifiable gate — counts drop from O(frames) to
O(changes), pixels unchanged.

---

## 4. D-3 re-examined [FOLD-VALUEJS-HANDOFF + FOLD-E seam] — the computed-unit memo-key cost

**File (keyframes seam):** `src/animation/engine.ts:578-580` (`interpFrames` →
`lerpValue(eased, iv)` over `frame.allInterpVars`), `utils.ts:281`
(`prepareInterpVar` at compile time). **File (value.js cost):**
`value.js src/units/interpolate.ts:17-40` (`lerpComputedValue`),
`value.js src/units/normalize.ts:136-206` (`getComputedValue` + its memo
`keyFn`), `value.js src/utils.ts:108-152` (`memoize`).

**Fresh-eyes confirmation of D's analysis.** D.W4 spec'd D-3 as "cache the
resolved endpoint pair on the `InterpolatedVar`; write changed keys only;
measure-first" and **withheld** it pending a demonstrated bench win. Re-reading
the live code, D's diagnosis is **correct and the cost is real**:

- A `calc()`/`var()`/`vh`/`cqw` leaf dispatches (via the pre-resolved `_lerp`,
  `interpolate.ts:144-145`) to `lerpComputedValue`, which calls
  `getComputedValue(start, target)` **and** `getComputedValue(stop, target)`
  every frame (`interpolate.ts:28-29`).
- `getComputedValue` is `memoize`d, so the DOM round-trip (write inline style →
  `getComputedStyle` → restore) is absorbed for a fixed expression. **But the
  memo key is recomputed every call**: `memoize` (`value.js src/utils.ts:123,127`)
  does `keyFn.apply(this, args)` unconditionally, and the keyFn
  (`normalize.ts:195`) is `` `${value.toString()}-${getElementId(target)}` `` —
  so **every frame, every computed leaf** pays `start.toString()` +
  `stop.toString()` (two full `ValueUnit` serializations) + two string
  concatenations + two `Map.has`/`get` lookups + a `Date.now()` (the TTL clock,
  `utils.ts:128`). The endpoints are the *same two `ValueUnit`s* every frame;
  only `t` changes. The key construction is pure waste on the hot path.

This matches D's write-up (`docs/tranches/D/audit/engine-transposition.md:126-180`)
exactly. The withhold was honest — it was gated on a measured win that D.W4 did
not land — but the *opportunity is genuine*, and it splits cleanly across the
repo boundary:

**The keyframes-side seam (FOLD-E).** At `prepareInterpVar` time
(`utils.ts:281`, compile, once per `InterpolatedVar`) the dispatch is already
resolved. For a computed leaf, the resolution endpoints are invariant for a given
`(InterpolatedVar, target)` until `setTargets` (`engine.ts:906`) or a box change.
keyframes can cache the resolved `(newStart, newStop, newUnit)` on the
`InterpolatedVar` so the per-frame body collapses to a single
`lerp(cachedStart, cachedStop, t)` — **no re-serialization, no `Map` lookup**.
Invalidate on `setTargets` (the one event that changes resolution) and on a
box-change signal (resize). This is purely additive on the prepared fast path;
the unprepared/external path keeps calling `getComputedValue`.

**The value.js-side win (FOLD-VALUEJS-HANDOFF).** Even without the keyframes
cache, `getComputedValue`'s memo pays the full `value.toString()` key
serialization on **every** call (cache hit included). value.js could key the
memo on a cheaper stable identity (e.g. a per-`ValueUnit` monotonic id +
element id) so a cache *hit* doesn't re-serialize. This is a value.js-internal
change to its `memoize` usage / `keyFn`, not something keyframes should reach in
and write. **Propose a value.js tranche**: *"computed-value memo keyed on stable
ValueUnit identity, not per-call `toString()` serialization — the animation hot
path hits this memo once per frame per leaf and pays two full serializations on
every hit."* The value.js owner formalizes whether to add a `ValueUnit` id or a
WeakMap-keyed memo.

**Why split (honest framing).** The keyframes-side endpoint cache is the bigger,
cleaner win and is FOLD-E — it removes the value.js memo call from the hot path
*entirely* for prepared vars, so the value.js handoff becomes a *secondary*
hardening for the externally-constructed/unprepared path. If E lands the
keyframes seam, the value.js handoff drops in priority (the hot path no longer
hits the memo); if E defers it, the value.js handoff is the fallback that still
shaves the per-hit serialization. Both are real; neither blocks the other.

**Perf/elegance rationale.** The cube demo's `calc(100cqw - 100%)` ball
(MEMORY: AnimationVisualizer) interpolates a computed unit every frame — this is
a *live* hot path, not hypothetical. The endpoint cache removes two
serializations + two map hashes + a `Date.now()` per frame from it. Elegance:
the resolution is cached at the same `prepareInterpVar` seam the dispatch already
is — one "resolve-once" discipline. KISS: the per-frame body becomes a bare
`lerp`.

**Disposition: FOLD-E (keyframes endpoint cache) + FOLD-VALUEJS-HANDOFF
(value.js memo-key serialization).**

**Isomorphism.** Pixel-identical: same resolved values, cached. **Measure-first
remains the gate** (D's own posture): a re-runnable bench with
`value.toString`/`getComputedStyle` call-counters asserting O(1)-per-frame (paid
once at prepare), plus a wall-time delta. This is the `proof:computed-frame`
gate D.W4 specced (`engine-transposition.md:174-180`) — E can land the test and
the keyframes seam together.

---

## 5. FOLD-VALUEJS-HANDOFF — value.js-side items surfaced by the hot path

These are value.js findings (the parser/units library the engine consumes). Per
inv-16, **do not write value.js** — propose a value.js tranche the value.js owner
formalizes.

- **VJS-1 — `getComputedValue` memo re-serializes on every hit.**
  `value.js src/units/normalize.ts:195` keyFn is
  `` `${value.toString()}-${getElementId(target)}` ``; `memoize`
  (`value.js src/utils.ts:123`) calls it unconditionally. The animation hot path
  hits this once per computed leaf per frame and pays two full `ValueUnit`
  serializations per hit. Propose: a stable-identity memo key (per-`ValueUnit`
  id or a WeakMap-keyed cache) so a cache hit is O(1) without `toString()`.
  *(Secondary to E-RT-4's keyframes-side endpoint cache, which removes the call
  from the hot path for prepared vars — see §4.)*

- **VJS-2 — `unflattenObjectToString` allocates per call.**
  `value.js src/units/utils.ts:115-148` builds a fresh result object + per-key
  strings every frame on the paint path (§3). Propose: a buffer-reusing variant
  (write into a caller-supplied map, cleared in place) so the per-frame paint
  serialization is allocation-free — the same hoist-and-clear idiom the engine's
  group composite uses. keyframes can diff-and-skip the *writes* without this
  (FOLD-E), but the *serialization garbage* is value.js-owned.

- **VJS-3 — `memoize`'s `Date.now()` per call (minor).**
  `value.js src/utils.ts:128` reads `Date.now()` on every memoized call for the
  TTL check, even when `ttl === Infinity` (the `getComputedValue` case,
  `normalize.ts:196-204` sets no `ttl`). Propose: skip the clock read when
  `ttl === Infinity`. Micro, but `getComputedValue` is on the per-frame path and
  this is a free win once VJS-1 is in flight. Bundle with VJS-1.

---

## 6. ALREADY-SOTA — do not manufacture work here

Flagged honestly so E doesn't re-litigate solved problems:

- **Binary-search frame lookup** — `internal/binarySearch.ts:21-37`,
  `binarySearchRange`, O(log N), correct inclusive-range semantics. The hot
  path (`engine.ts:561-566`) seeds via binary search then scans contiguous
  overlapping neighbors (frames sorted by `(start, stop)` at compile,
  `frame-compiler.ts:304-309`). This is the right algorithm; a linear scan would
  be the regression. **ALREADY-SOTA.**

- **Pre-resolved interpolation dispatch** — `value.js
  interpolate.ts:143-150` `prepareInterpVar` sets `_lerp` once; `lerpValue`
  (`interpolate.ts:113-119`) takes the fast branch with no per-call type checks.
  keyframes calls `prepareInterpVar` at compile (`utils.ts:281`). Monomorphic
  dispatch, paid once. **ALREADY-SOTA.**

- **Pre-flattened `allInterpVars`** — `frame-compiler.ts:329`
  (`Object.values(frame.interpVars).flat()` built once in `parse`), iterated
  flat in the hot loop (`engine.ts:578`) with no per-frame `Object.values`/`flat`.
  **ALREADY-SOTA.**

- **`buildVarIndex` reconciliation** — `frame-compiler.ts:203-216` builds a
  `Map<varName, frameIdx[]>` so `reconcileVars` is O(1)-lookup, not O(frames²)
  `findIndex`. This is a *compile*-time win (not per-frame) but it's the right
  call and worth not regressing. **ALREADY-SOTA.**

- **Group entry cache** — `group.ts:145-157` dirty-flagged `_entries` (sorted by
  zIndex once, rebuilt only on mutation) avoids `Object.values()` + sort per
  frame. **ALREADY-SOTA.**

- **Group composite zero-alloc** — `group.ts:91,207-305` hoisted `_grouped`
  buffer cleared in place, inline whitelist skip (no `filteredValues` object),
  in-place numeric accumulation for `add`/`weighted`. Proven by
  `test/zero-alloc.test.ts`. This is D.W4 D-1 and it is **genuinely SOTA** for
  the compositor. (E-RT-1/E-RT-3 extend the *same discipline* to the standalone
  loop + the write path — they don't undo this.)

- **`scheduler.yield` batched advance** — `group.ts:368-382` ticks children in
  `YIELD_BATCH`-sized slices with `yieldToMain()` between them for large groups.
  This is exactly the `modern-web-guidance` INP guidance
  (`performance` guide: *"DO use `scheduler.yield()` with a fallback"*,
  Baseline-current) applied engine-side. **ALREADY-SOTA.**

- **WAAPI compositor delegation** — `waapi.ts` + the spring `linear()` twin
  (`springTimingFunction.ts`) push eligible animations to the compositor thread,
  the single biggest runtime win the platform offers. Eligibility is a
  reference-comparison (`usesDefaultRenderer`, `engine.ts:163-165`), bind-proof.
  This is the off-main-thread path and it is correctly wired. **ALREADY-SOTA.**
  (Coverage/eligibility *breadth* is an `r-anim-libs` / `r-scroll-view-transitions`
  lane concern, not a hot-path-perf one.)

---

## 7. Cross-lane notes (not this lane's to fold)

- **Native `ScrollTimeline` / `animation-timeline` delegation** — a runtime
  off-main-thread win in principle, but the engine's `Timeline`
  (`timeline.ts:163-178`, JS-polled `getScrollY()/maxScroll`) is a *more general*
  caller-driven progress sampler, and the native path is not yet Baseline. The
  ARCH-kill is re-confirmed in the sibling `r-scroll-view-transitions.md` lane
  — **not re-litigated here.** Pointer only.

- **Orchestration features** (stagger, timeline labels, FLIP, inertia) are an
  `r-anim-libs.md` competitive-surface concern, not runtime hot-path. Pointer
  only.

---

## 8. Disposition ledger

| ID | Finding | File:line | Disposition | Value | Iso |
|---|---|---|---|---|---|
| E-RT-1 | standalone `interpFrames` allocates `out={}` + `processFrame` closure/frame | `engine.ts:550,573,699`; `App.vue:333` | **FOLD-E** | High | pixel-identical (buffer reuse) |
| E-RT-2 | per-frame promise+microtask churn (`_run` wrap; `async` advance) | `playback.ts:99-108`; `engine.ts:662,691`; `group.ts:392-404` | **FOLD-E** (measure-first, careful) | High | behaviour-identical (events/resolve unchanged) |
| E-RT-3 | per-frame DOM write re-serializes + writes unconditionally | `utils.ts:305-319`; value.js `units/utils.ts:115` | **FOLD-E** (write-skip+string cache) | Med-High | pixel-identical (redundant writes elided) |
| D-3 / E-RT-4 | computed-unit endpoint cache (keyframes seam) | `utils.ts:281`; `engine.ts:578`; value.js `interpolate.ts:28-29` | **FOLD-E** (measure-first; `proof:computed-frame`) | High (when calc/cqw present) | pixel-identical (cached resolution) |
| E-RT-5 | `scale()` throws on zero-width frame (`start===stop`) | `engine.ts:575`; value.js `math.ts:7-24` | **GAP-NAMED** (edge robustness) | Low | n/a (degenerate input) |
| VJS-1 | `getComputedValue` memo re-serializes per hit | value.js `normalize.ts:195`; `utils.ts:123` | **FOLD-VALUEJS-HANDOFF** | High (paired w/ E-RT-4) | pixel-identical |
| VJS-2 | `unflattenObjectToString` allocates per call | value.js `units/utils.ts:115-148` | **FOLD-VALUEJS-HANDOFF** | Med | pixel-identical |
| VJS-3 | `memoize` reads `Date.now()` when `ttl===Infinity` | value.js `utils.ts:128` | **FOLD-VALUEJS-HANDOFF** (bundle w/ VJS-1) | Low | identical |
| — | binary search / dispatch / allInterpVars / entry cache / group zero-alloc / scheduler.yield / WAAPI | (see §6) | **ALREADY-SOTA** | — | — |

**Headline:** the group composite is SOTA-zero-alloc; the **standalone loop, the
loop core, and the per-frame DOM write are not** — three FOLD-E findings extend
the existing zero-alloc discipline to the primitive and the paint, and **D-3 is
re-confirmed as a genuine (measure-first) win** split across a keyframes endpoint
cache (FOLD-E) and a value.js memo-key handoff (FOLD-VALUEJS-HANDOFF).
