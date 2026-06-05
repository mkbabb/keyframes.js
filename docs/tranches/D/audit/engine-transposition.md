# D — engine transposition audit (D-1 .. D-6)

The engine's transposition has a gestalt tail. C.W4 unified the steppers and
the loop core (play/drive/loop → one `_run`; one canonical `tickDt(ms)`;
fail-explicit option contract; `Timeline._advance` dedup; core net −20). This
audit applies inv ε to C's own close — auditing the *claim* "the engine is
transposed", not just its code — and finds six architectural transpositions
left, each cited at `file:line` against the live tree (branch `tranche-d-dev`),
each with a falsifiable HARD gate that is a re-runnable instrument, not a
narration.

The constraints hold throughout: elegance / simplicity / performance above all;
transpositions necessary + desirable; **NO legacy / deprecated codepaths**;
KISS; isomorphic (the published surface's behaviour is unchanged unless a
transposition is highly befitting, and then the change is declared in the
major). Net-deletion at the core; the additions are proof instruments.

Line numbers below are the live state at audit. The IMPL home for each is
D.W3 (D-6 snap) or D.W4 (D-1..D-5 + the D-6 re-exports / `| any`).

---

## D-1 [PERF] — the AnimationGroup per-frame allocation

**Current state.** `group.ts:198-290` `transformFramesGrouped(t)` is the lone
hot loop that violates the class's own zero-alloc discipline. The class went to
real lengths for zero-alloc steady state — `_entries` is a dirty-flag-cached
sorted array (`group.ts:81-143`) precisely to avoid `Object.values()` per
frame; `interpFrames(t, false, entry.values)` (`group.ts:214-218`) rewrites a
long-lived per-entry buffer in place so "no fresh object is allocated per entry
per frame" (its own docstring, `group.ts:193-197`). Then the compositor
allocates twice per frame anyway:

- `group.ts:199` — `const groupedValues: Record<string, unknown> = {}` — a fresh
  object every frame, returned (`group.ts:289`) and handed to `this.transform`.
- `group.ts:221-227` — the property whitelist:
  `Object.fromEntries(Object.entries(values).filter(([key]) => layer.properties!.has(key)))`
  allocates an `entries` array **and** a fresh filtered object **per entry, per
  frame**, for every layer that carries a `properties` set.

For a single-target group the draw path runs `transformFramesGrouped` every
frame (`group.ts:405`); for an N-layer group with whitelists that is
1 + N object allocations + N entries-array allocations per frame, all garbage.
This is the one path in the engine that still churns the allocator in steady
state — the `_entries`/`interpFrames` buffers around it exist solely to keep it
allocation-free, and it isn't.

**The transposition.** Hoist `groupedValues` to a `private _grouped:
Record<string, unknown> = {}` instance buffer cleared in place at the top of
`transformFramesGrouped` (the same `for (const k in result) delete result[k]`
pattern `interpFrames` already uses, `engine.ts:790`). Inline the whitelist as
a key-skip inside the blend switch — `if (layer.properties && !layer.properties.has(key)) continue;`
— deleting `filteredValues` and its two allocations entirely; the blend loops
already iterate `Object.entries(values)`, so the filter folds into the existing
walk at zero extra cost. The group's headline path goes allocation-free,
matching the discipline the surrounding cache machinery already pays for.

**Rationale.** Elegance: the compositor finally honours the zero-alloc contract
its own `_entries` cache and in-place `interpFrames` buffer were built to serve
— the one remaining churn site is removed, not papered. Performance: per-frame
GC pressure on the most-composited path (the cube demo runs a 3-layer
single-target group every frame) drops to zero allocations; the 200-cell LoAF
bench (C's >50ms gate) gets headroom. KISS: a key-skip `continue` is strictly
less code than `Object.fromEntries(Object.entries(...).filter(...))`. Net
deletion. No legacy — the public blend semantics (replace/add/weighted) are
byte-identical; `render()`/`_frame()` callers are unchanged.

**Falsifiable HARD gate (`proof:zero-alloc`).** A re-runnable instrument
that drives a 3-layer single-target group (one layer carrying a `properties`
whitelist) for K frames under a heap-allocation probe and asserts **zero**
steady-state object allocations attributable to `transformFramesGrouped` after
the first frame. Bite: re-introduce the `const groupedValues = {}` per-frame
literal → the probe counts K−1 excess allocations → reds. The gate measures
allocation count, not wall-time, so it is deterministic across runner speeds.

---

## D-2 [SIMPLICITY] — `tick` means three things at the driver layer

**Current state.** After C.W4 canonicalized the *stepper* step to one
`tickDt(ms)` (`smooth.ts:109`, `spring.ts:207`, `timeline.ts:123`), the name
`tick` still carries three distinct meanings across the engine:

1. **Absolute-clock advance** — `Animation.tick(t)` (`engine.ts:889-912`) and
   `AnimationGroup.tick(t)` (`group.ts:345-374`) take an **absolute rAF
   timestamp** `t` and compute `this.t = t - this.startTime` internally. The
   argument is a wall clock, not a delta.
2. **Delta step** — `Tickable.tickDt(dt)` (`playback.ts:31`, `smooth.ts:109`,
   `spring.ts:207`) takes a **millisecond delta**. The canonical stepper step.
3. **Nominal-frame step** — `Timeline.tick()` (`timeline.ts:118`) takes **no
   argument** and advances one nominal 60fps frame (`_advance(16.667)`).

Three signatures `(t)` / `(dt)` / `()` under two spellings (`tick` / `tickDt`),
where `tick` at the driver layer (1) is an absolute-clock advance that reads
nothing like the dt-stepper `tick` the rest of the engine canonicalized to.
The collision is the residual C.W4 fixed for the steppers but left at the
driver.

**The transposition.** Rename the absolute-clock advance to its true verb:
`Animation.tick(t)` → `Animation.advanceTo(t)` and `AnimationGroup.tick(t)` →
`AnimationGroup.advanceTo(t)` (and `_tickSlice` → `_advanceSlice`,
`group.ts:377`). After the rename `tick`/`tickDt` mean exactly one thing each:
a delta step over a `Tickable`. `advanceTo(t)` reads as what it is — "advance
the playhead to absolute clock `t`" — and the three-way collision dissolves.
The call sites are internal (the group's `_tickSlice` calls `anim.tick(t)`,
`group.ts:386`; `_frame` calls `this.tick(t)`, `group.ts:398`); no public
consumer drives `Animation.tick` directly (the loop is owned by `RAFPlayback`).

**Rationale.** Simplicity: one name, one meaning — the reader never has to
recover from the signature whether `tick` is `(absoluteClock)`, `(delta)`, or
`()`. Elegance: `advanceTo(t)` names the absolute-clock semantics the body
already implements (`this.t = t - this.startTime`). KISS. This is a major-tier
rename — the already-declared D major absorbs it; no compat alias is kept
(no legacy). Isomorphic: behaviour byte-identical, names only.

**Falsifiable HARD gate (`proof:tick-canon`).** A re-runnable source instrument
asserts: (a) `grep -E '\btick\s*\(' src/animation/{engine,group}.ts` returns
**0** matches (the absolute-clock advance is gone from the driver layer); (b)
every remaining `tick`/`tickDt` symbol in `src/animation/` is a zero/one-arg
delta or nominal-frame step (the `Tickable` surface), enumerated and asserted.
Bite: re-add an `Animation.tick` alias → match count > 0 → reds. Plus `npm test`
green proves the rename is behaviour-preserving.

---

## D-3 [PERF] — the computed-unit DOM round-trip re-serializes every frame

**Current state.** A `calc()`/`var()`/`vh` keyframe interpolates through
`interpFrames` → `lerpValue` → `iv._lerp` → `lerpComputedValue`
(value.js `units/interpolate.ts:17-40`, dispatch pre-resolved by
`prepareInterpVar`, `utils.ts:299`). Every frame, for every computed leaf,
`lerpComputedValue` calls `getComputedValue(start, target)` **and**
`getComputedValue(stop, target)` (value.js `interpolate.ts:28-29`).
`getComputedValue` (value.js `normalize.ts:136-193`) is `memoize`d — but its
memo key is `${value.toString()}-${getElementId(target)}` (`normalize.ts:195`),
so **every frame re-serializes both endpoints to a string** to construct the
key, and the `calc()` branch writes inline style + reads `getComputedStyle` +
restores style (`normalize.ts:154-168`) on the cold path. The memo absorbs the
DOM round-trip for a *fixed* expression, but the per-frame cost paid
unconditionally is: two `value.toString()` serializations + two `Map` key
hashes per computed leaf per frame — the unflattened key-set is never cached,
so the engine re-derives the resolution key for an expression it already
resolved last frame.

The static/dynamic boundary the calc endpoints describe is invariant across the
animation's life: `start`/`stop` are the same two `ValueUnit`s every frame; only
`t` changes. Re-serializing them per frame to look up a memoized resolution is
the inversion D-3 targets.

**The transposition (measure-first).** Cache the resolved endpoint pair on the
`InterpolatedVar` at `prepareInterpVar` time (the dispatch is already
pre-resolved there, value.js `interpolate.ts:143-150`) — store the resolved
`(newStart, newStop, newUnit)` keyed by element identity, so the per-frame path
becomes a single `lerp(cachedStart, cachedStop, t)` with **no** re-serialization
and **no** `Map` lookup. Invalidate on `setTargets` (the only event that
changes the resolution, `engine.ts:1126-1140`) and when the target's box could
have changed (resize) — the cache is per-`(InterpolatedVar, target)`, the same
granularity `getComputedValue`'s memo already uses, lifted up one level so the
key construction itself is paid once, not per frame. **Measure-first**: the
D.W4 spec lands a micro-bench BEFORE the change and gates the transposition on a
demonstrated win, so this is a proven optimization, not a speculative one.

**Rationale.** Performance: the cube demo's `calc(100cqw - 100%)` ball
(MEMORY: AnimationVisualizer) interpolates a computed unit every frame; D-3
removes two string serializations + two map hashes per frame from that path.
Elegance: the resolved boundary is cached at the same lifecycle seam
(`prepareInterpVar`) the dispatch function already is — one consistent
"resolve-once" discipline. KISS: the per-frame body shrinks to a bare `lerp`.
No legacy — the fallback (`getComputedValue` for externally-constructed vars)
stays for the un-prepared path; the cache is additive on the prepared fast
path. Isomorphic: pixel-identical resolution (same `getComputedValue` result,
cached).

**Falsifiable HARD gate (`proof:computed-frame`).** A re-runnable bench drives
N frames of a `calc()`-keyframe animation against a live (jsdom) target with
`value.toString` and `getComputedStyle` call-counters installed, asserting
their per-frame call count is **O(1) constant** (paid once at prepare, not per
frame) — not O(frames). Bite: revert the endpoint cache → `toString`/
`getComputedStyle` counts scale with frame count → reds. Plus a wall-time delta
recorded in the D.W4 measure-first artifact (the declared win).

---

## D-4 [ELEGANCE] — the `Animation` god-object at the wrong seam

**Current state.** `engine.ts` is **1277 lines** (`wc -l`); the `Animation`
class spans `engine.ts:126-1145` — **~1019 lines in one class**. It fuses three
genuinely distinct responsibilities at one seam:

1. **Frame compilation** — `addFrame` (`:263`), `createFrame` (`:304`),
   `buildVarIndex` (`:357`), `reconcileVars` (`:380`), `parse` (`:427-482`),
   `convertFrameStart` (`:246`). Pure: template frames → compiled
   `AnimationFrame[]` with `interpVars`/`allInterpVars`. No playback state.
2. **The options carrier** — `setTimingFunction`/`setDuration`/`setDelay`/
   `setDirection`/`setFillMode`/`setUseWAAPI`/`setRespectReducedMotion`/
   `setColorSpace`/`setHueMethod`/`setOptions` (`engine.ts:494-706`) — ~213
   lines of fail-explicit option validation, structurally one carrier.
3. **The playback state-machine** — `tick`/`onStart`/`onEnd`/`_frame`/
   `_playRAF`/`_playWAAPI`/`_playReducedMotion`/`play`/`pause`/`resume`/`stop`/
   `settle`/`reset` (`engine.ts:844-1124`) + the flags (`started`/`done`/
   `paused`/`reversed`/`iteration`/`startTime`/`pausedTime`/`t`,
   `engine.ts:158-188`).

The seam between (1), (2), (3) is real and clean — `parse()` consumes nothing
from the playback machine; the option setters are a validation carrier; the
state-machine reads `frames`/`options` but never reaches into compilation
internals. The 1019-line class is one object at the wrong granularity.

**The transposition (the deepest D re-architecture, scoped carefully).** Split
along the existing seam:

- **`FrameCompiler`** — extract (1): `addFrame`/`createFrame`/`buildVarIndex`/
  `reconcileVars`/`parse`/`convertFrameStart` + `templateFrames`/`parsedVars`/
  `frames`. A pure compilation unit; `Animation` composes one.
- **`AnimationOptions` carrier** — extract (2): the ten fail-explicit setters +
  `setOptions` onto an options object that owns its own validation (the
  `AnimationOptionError` seam, `internal/errors.ts`, already isolates the
  throw). `Animation` delegates `setX` to it.
- **The playback state-machine** stays the `Animation` core (3) — the flags +
  the lifecycle + `RAFPlayback` ownership.

`CSSKeyframesAnimation` (`engine.ts:1147-1259`) layers the `from*` parsers over
the same composition. Scoped carefully: the split is along seams that already
hold (no behaviour crosses them), and the public `Animation` surface
(`play`/`pause`/`addFrame`/`setDuration`/…) stays — they become thin delegators,
so consumers' call sites are unchanged.

**Rationale.** Elegance: three responsibilities at three seams instead of one
1019-line fusion; each unit is independently readable and testable
(`FrameCompiler` has no DOM/playback dependency — it unit-tests pure). KISS: the
state-machine core drops to the ~300 lines that are actually a state machine.
This is the declared major's deepest move; net-line-neutral-to-deletion (the
extraction removes the visual fusion, not behaviour). No legacy — no compat
shim, no parallel old class; the split is total. Isomorphic: every public method
behaves identically (delegation is transparent); `npm test` is the
behaviour-preservation proof.

**Falsifiable HARD gate (`proof:engine-seam`).** A re-runnable instrument
asserts: (a) `Animation` class body ≤ a declared ceiling (the ~300-line
state-machine core — measured, asserted, biting if exceeded); (b) `FrameCompiler`
exists and carries zero references to playback flags
(`grep -E '\b(paused|started|done|playback)\b'` over its body = 0); (c) the full
`test/animation.test.ts` + `equivalence.test.ts` suite green (behaviour
preserved across the split). Bite: fold a playback flag back into
`FrameCompiler` → (b) reds; let the core regrow past the ceiling → (a) reds.

---

## D-5 — `AnimationGroup.pause` toggle semantics

**Current state.** `group.ts:506-541` `pause()` is a **toggle** —
`this.paused = !this.paused` (`group.ts:509`) — that pauses when playing and
resumes when paused, in one method. Its own docstring confesses the legacy
coupling: *"(Toggle semantics preserved for backward compatibility with demo's
toggleAnimationGroup.)"* (`group.ts:499-501`). This is a named legacy codepath:
the method does two things because one historical consumer (the demo) called it
as a toggle. It is asymmetric with `Animation.pause` — `Animation.pause(draw)`
(`engine.ts:1043-1051`) is *also* a quasi-toggle (`if (this.paused && draw)
return this.resume()`), carrying the same back-compat smell.

The constraint: **NO legacy / deprecated codepaths — this is a development
product.** The demo is now in-tree (D.W1 decomposes it), so the historical
external-consumer justification for the toggle has dissolved — there is no
remaining reason to keep the conflated method.

**The transposition.** Split into honest verbs: `pause()` (pauses, idempotent —
a second `pause()` is a no-op, not a resume), `resume()` (resumes, idempotent),
and `toggle()` (the explicit flip, for the one UI affordance that wants it).
The demo's `toggleAnimationGroup` — now in-tree (D.W1) — calls `group.toggle()`
explicitly where it means a flip, and `pause()`/`resume()` where it means a
direction. `Animation.pause(draw)`'s toggle branch retires the same way
(`pause()` pauses, `resume()` resumes). The `draw` boolean parameter — a second
overloaded concern — separates into the honest call.

**Rationale.** Elegance: a method named `pause` pauses; the reader never has to
know the current state to predict the effect. KISS: three single-responsibility
methods beat one stateful overload. **No legacy**: the back-compat toggle is
deleted, not deprecated — the only consumer is in-tree and updated in the same
tranche, so there is no external break to shim. Isomorphic: the demo's observed
behaviour (a button that toggles) is preserved via `toggle()`; the engine's
contract is now honest.

**Falsifiable HARD gate (`proof:pause-honest`).** A unit instrument asserts:
two consecutive `group.pause()` calls leave the group paused (idempotent, **not**
resumed); two consecutive `resume()` calls leave it playing; `toggle()` flips.
Bite: restore `this.paused = !this.paused` in `pause()` → the second-`pause()`
assertion (still paused) reds. Plus a source grep asserting the string
`"backward compatibility"` / `toggleAnimationGroup`-coupling docstring is gone
from `group.ts` (the legacy marker is removed, not just the behaviour).

---

## D-6 — the `_snapSettled` asymmetry + `leaves.ts | any` + the deprecated re-exports

Three W0-slipped residuals (booked into C.W0, slipped C.W4), folded here.
D-6a (snap symmetry) lands in **D.W3**; D-6b (`| any`) + D-6c (re-exports) in
**D.W4**.

### D-6a — the `_snapSettled` asymmetry (smooth / spring)

**Current state.** The reduced-motion / immediate snap is implemented twice,
asymmetrically:

- `smooth.ts:99-103` `_snapSettled()`: sets `currentValue = targetValue`,
  `isSettled = true`, emits `_onFrame?.(currentValue)`. It does **not** stop the
  playback (no `_playback.stop()`).
- `spring.ts:188-197` `_snapSettled()`: sets value + velocity + origin, settles,
  `emit()`, **and** `this._playback.stop()` (`spring.ts:196`).

The spring snap halts its driver; the smooth snap does not. `SmoothProgress`'s
own `snap()` (`smooth.ts:131-135`) *does* call `_playback.stop()` — so the
private `_snapSettled` path is the asymmetric one: a reduced-motion `setTarget`
(`smooth.ts:83-86`) snaps the value but can leave a `drive` loop scheduled,
where the spring's equivalent path tears it down. Two steppers with the same
`Tickable` contract should snap identically.

**The transposition.** Make `smooth.ts:_snapSettled` symmetric with the
spring's: stop the playback on snap (`this._playback.stop()`), so a
reduced-motion snap leaves no scheduled `drive` frame on either stepper. The two
`_snapSettled` bodies become structurally identical (value-set + settle + emit +
stop), differing only in the spring's velocity/origin fields — the symmetry the
shared `Tickable` surface implies.

**Rationale.** Elegance: one snap contract across both steppers — the
reduced-motion path is uniform, not per-class. Correctness: a reduced-motion
`SmoothProgress.setTarget` no longer leaves a stray scheduled frame.
Performance: no orphaned `drive` loop ticking a settled stepper. KISS. No legacy.
Isomorphic on the non-reduced-motion path (untouched); the reduced-motion path
gains the missing teardown.

**Falsifiable HARD gate (`proof:snap-symmetry`).** An instrument arms a
`SmoothProgress.play(onFrame)` under emulated `prefers-reduced-motion: reduce`,
calls `setTarget`, and asserts the driver is **not running** after the snap
(`_playback.running === false`) — identical to the same assertion on
`SpringProgress`. Bite: remove the `_playback.stop()` from
`smooth.ts:_snapSettled` → the running-after-snap assertion reds. The two
steppers run the **same** assertion (≥2 consumers).

### D-6b — `leaves.ts | any`

**Current state.** `internal/leaves.ts:75` —
`export function cancelAnimationFrame(handle: number | undefined | null | any)`.
The `| any` widens the whole union to `any`, defeating the union's intent (the
shim accepts a `number` browser handle or a `NodeJS.Timeout` setTimeout handle).
Under the project's `strict: true`, a stray `| any` in a leaf is a type hole.

**The transposition.** Tighten to the real opaque-handle type:
`number | ReturnType<typeof setTimeout> | undefined | null` — the two handle
shapes the local `requestAnimationFrame` shim actually returns
(`leaves.ts:55-72`), matching the `_rafId` typing in `playback.ts:66`
(`ReturnType<typeof requestAnimationFrame> | null`). The `| any` is deleted.

**Rationale.** Simplicity: the type states the contract (an opaque cancel
handle from this module's own shim) instead of collapsing to `any`. No legacy.
Isomorphic (types only; `clearTimeout(handle)` accepts both at runtime).

**Falsifiable HARD gate.** `grep -nE ':\s*.*\|\s*any\b' src/animation/internal/leaves.ts`
returns **0**; `tsc --noEmit` green. Bite: re-add `| any` → grep matches → reds.

### D-6c — the deprecated path-compat re-exports

**Current state.** Two named legacy re-export blocks linger:

- `src/animation/utils.ts:34-42` — re-exports `lerpColorValue`/`lerpComputedValue`/
  `lerpNumericValue`/`lerpValue` from value.js, with the comment *"Re-export
  value.js interpolation primitives so consumers of keyframes.js continue to
  find them at this path. New code should import from @mkbabb/value.js
  directly."* — a path-compat shim, self-documented as such (`src/animation/utils.ts:34-36`),
  reiterated at `src/animation/utils.ts:159-161`.
- `src/animation/format.ts:12-16` — re-exports `formatCSS` from value.js *"for the
  convenience of consumers that already import animation-class helpers from this
  module."* (the `export { formatCSS }` at `src/animation/format.ts:16`) — the
  same convenience-compat re-export.

Both are explicit "old import path still works" shims — legacy by their own
documentation. The constraint forbids deprecated codepaths.

**The transposition.** Delete both re-export blocks. The single in-tree caller
of each is updated to import from `@mkbabb/value.js` directly (the canonical
source the comments themselves point at). The barrel surface
(`src/parsing/units.ts`, `src/parsing/utils.ts` per CLAUDE.md) that legitimately
re-exports value.js stays — D-6c removes only the **animation-domain
convenience duplicates** in `utils.ts`/`format.ts`, not the documented parsing
barrels.

**Rationale.** No legacy — the "continue to find them at this path" shim is the
exact deprecated-codepath the development-product constraint forbids; deleted,
not kept. Elegance: one canonical import path per primitive. KISS. Net deletion.
Isomorphic (no published behaviour change; the primitives are unchanged at their
canonical value.js home).

**Falsifiable HARD gate (`proof:no-compat-reexport`).** Asserts (a)
`grep -n "New code should import from" src/animation/utils.ts` = 0 and the
`export { lerpColorValue, … }` block is gone; (b) `grep -n "export { formatCSS }"
src/animation/format.ts` = 0; (c) `npm run build` + `proof:boundary` green
(the deletion doesn't break the light/heavy boundary). Bite: restore either
re-export block → the corresponding grep matches → reds.

---

## Disposition summary

| Item | Tag | File:line evidence | IMPL wave | Falsifiable gate |
|---|---|---|---|---|
| **D-1** group per-frame alloc | PERF | `group.ts:199`, `:221-228` | D.W4 | `proof:zero-alloc` (zero steady-state allocs; bite on `KF_ALLOC_INJECT=group` literal) |
| **D-2** `tick` triple-meaning | SIMPLICITY | `engine.ts:889`, `group.ts:345`, `timeline.ts:118` | D.W4 | `proof:tick-canon` (0 driver-layer `tick(` ; tests green) |
| **D-3** computed DOM round-trip | PERF | value.js `interpolate.ts:28-29`, `normalize.ts:195` | D.W4 | `proof:computed-frame` (O(1) `toString`/`getComputedStyle` per frame) |
| **D-4** `Animation` god-object | ELEGANCE | `engine.ts:126-1145` (~1019L / 1277L file) | D.W4 | `proof:engine-seam` (core ≤ ceiling; FrameCompiler playback-free; tests green) |
| **D-5** `pause` toggle | NO-LEGACY | `group.ts:506-541`, `:499-501` | D.W4 | `proof:pause-honest` (idempotent pause; toggle docstring gone) |
| **D-6a** `_snapSettled` asymmetry | NO-LEGACY | `smooth.ts:99-103` vs `spring.ts:196` | D.W3 | `proof:snap-symmetry` (driver stopped after snap, both steppers) |
| **D-6b** `leaves.ts \| any` | SIMPLICITY | `leaves.ts:75` | D.W4 | `grep '\| any'` = 0; `tsc` green |
| **D-6c** deprecated re-exports | NO-LEGACY | `src/animation/utils.ts:34-42`, `src/animation/format.ts:12-16` | D.W4 | `proof:no-compat-reexport` (blocks gone; build + boundary green) |

Verified not asserted: every cite above is a live `file:line` on
`tranche-d-dev`; every gate is a re-runnable instrument with a stated bite, not
a narration. Net-deletion at the core; the additions are the proof instruments.
