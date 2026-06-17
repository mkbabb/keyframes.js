# L.W5 — Orchestration-tier SOTA-DX

- **Band:** A · **Class:** SHIP-in-L · **Dep:** none — LIGHT, value.js-free,
  glass-ui-independent; rides the shipped `drag.ts` / `decay.ts` / `spring.ts`
  / `sequence.ts` / `scroll-scene.ts` substrate entirely
- **Gate (born-RED):** `proof:transport-events` (NEW) — absent from today's
  tree; RED on today's tree because the script does not exist. Secondary
  born-RED: **`proof:drag-gesture` extended** — a new `bounds` clause whose
  witness reds today (no bounds clamp is applied; a drag past the declared max
  sets `spring.target` to the out-of-bounds coordinate unguarded).

---

## Context

The shipped orchestration tier is LIGHT, value.js-free, and architecturally
clean — the audit's Lane 32 verdict (completion-lanes-32-36.txt:5-17) finds
**no precept violations** on the drag/decay/spring/Sequence/stagger/flip/animate
surface. What it finds are three **missing-feature gaps** relative to
GSAP-Draggable / Motion `drag` that the L.W5 charter row closes:

### Gap 1 — Draggable: no bounds, no snap, no rubber-band (Lane 32, W-GESTURE-BOUNDS)

`drag.ts` ships pointer-capture follow + release-velocity fling over a
`SpringProgress` (`drag.ts:87-323`). `DragOptions` at `drag.ts:32-62` has five
fields: `axis`, `transform`, `spring`, `springOptions`, `velocityWindow`. There
is no `min`/`max` bound, no snap target array, no rubber-band factor. The
`handleMove` path at `drag.ts:233-240` sets `this.spring.target = value`
unconditionally — the mapped coordinate goes straight to the spring with no
clamp. A drag past a declared bound moves the target freely.

GSAP's `Draggable` ships `bounds`, `edgeResistance`, and `snap` as first-class
options (the GSAP-Draggable parity hole, Lane 32 KEY FINDINGS med). Motion's
`drag` gesture has `dragConstraints: { left, right, top, bottom }` with a built-in
elastic over-drag. These are the three DX features that distinguish a _usable_
drag primitive from a _physics-only_ one. The fix is entirely kf-internal —
`SpringProgress`'s `reset(x, v)` and `target` setter are already the correct
injection points for clamp + rubber-band (`spring.ts:118-145`); `decayRest`
(`decay.ts:72-90`) is the correct tool for snap-target projection.

### Gap 2 — Sequence: no segment-lifecycle callbacks, no label-callback channel (Lane 32, W-TRANSPORT-EVENTS)

`sequence.ts` ships a full transport (`play`, `pause`, `resume`, `stop`,
`timeScale`, `reverse`, `repeat`, `yoyo`, `seek`, `progress`). None of it fires
a callback when a child segment enters or leaves, or when the playhead crosses a
named label. The shipped `_frame` at `sequence.ts:387-452` drives
`_applyAt(phase)` and `advanceTo(phase)` but accumulates no crossing events.
`_isForwardMonotone()` at `sequence.ts:460-462` gates `advanceTo` for the
default transport — but even there, the CROSSING of a label or a segment
boundary fires nothing the caller can observe.

The closest pattern in the shipped codebase is `ScrollScene.on` at
`scroll-scene.ts:506-514` — a typed, per-event subscribe returning an
unsubscribe handle:

```ts
// scroll-scene.ts:507-514
on(event: ScrollSceneEvent, cb: ScrollSceneSubscriber): () => void {
    const set = this.subscribers.get(event)!;
    set.add(cb);
    return () => set.delete(cb);
}
```

`ScrollSceneEvent` is `"enter" | "leave"` (`scroll-scene.ts:190`).
`ScrollSceneSubscriber` receives the local progress at the crossing
(`scroll-scene.ts:192-193`). The parallel for `Sequence` is:

- **Segment lifecycle:** `"enter"` fires when the playhead first crosses a
  segment's `at` offset going forward; `"leave"` fires when it crosses
  `at + duration` (or crosses `at` going backward). The callback receives the
  segment's `animation` reference and the master-clock position at the crossing.
- **Label crossing:** `"label"` fires when the playhead crosses a named position
  registered via `.label(name, at)`. The callback receives `(name, masterClock)`.

Without this channel, a consumer cannot trigger a side-effect at a precise
sequence moment (e.g. play a sound when a hero slide enters, reset a counter
when the playhead crosses "chapter-2"). GSAP Timeline's `addCallback` and
`call` are the incumbent. The fix is LIGHT — `sequence.ts` carries no
value.js edge, and a subscribe/fire idiom mirrors `scroll-scene.ts:360-514`
exactly.

### Gap 3 — 2-D drag: no single-call sugar (Lane 32, W-FRONT-DOOR+)

`drag.ts:29-30` explicitly documents the 2-D composition model:

> The single scalar axis a Draggable tracks. A 2-D drag composes two
> Draggables (one per axis) — the engine stays one-dimensional, the caller
> owns the composition (KISS).

This is architecturally correct. But "the caller owns the composition" means
every 2-D drag in the wild needs eight lines of boilerplate (two `Draggable`
constructions, two `attach` calls, a combined subscriber, two `dispose` calls).
A `drag2D(element, options)` sugar — constructing both axes, wiring a shared
subscriber that emits `(x, y, vx, vy)`, returning a small composite handle —
closes the DX gap without touching the 1-D engine. The K substrate is already
the right shape; the sugar is additive.

### K substrate

Every clause rides existing shipped primitives with no new dependencies:

| File | Relevant surface |
|------|-----------------|
| `drag.ts:32-62` | `DragOptions` — the extension point for bounds/snap |
| `drag.ts:233-240` | `handleMove` — the target-set injection point for bounds clamp |
| `drag.ts:242-257` | `handleUp` — the release-velocity injection point for snap projection |
| `spring.ts:118-145` | `SpringProgress.reset(x, v)` — re-seat from `(value, velocity)` |
| `decay.ts:72-90` | `decayRest(x0, v0, k)` — projected resting point for snap selection |
| `sequence.ts:97-102` | `Sequence.entries` + `labels` — the segment/label sets to fire on |
| `sequence.ts:387-452` | `_frame` — the crossing-detection injection point |
| `sequence.ts:460-462` | `_isForwardMonotone` — the existing event-coherence gate |
| `scroll-scene.ts:506-514` | `ScrollScene.on` — the mirror idiom for `.on(event, cb)` |
| `scroll-scene.ts:190-193` | `ScrollSceneEvent` / `ScrollSceneSubscriber` — type pattern |

---

## Scope

Each S-clause is a concrete falsifiable deliverable. LIGHT/value.js-free
throughout — `proof:boundary` stays green on all three.

### S1 — Draggable bounds + rubber-band (W-GESTURE-BOUNDS)

**Breach.** `DragOptions` at `drag.ts:32-62` has no `min`/`max` field. The
`handleMove` path at `drag.ts:233-240` sets `this.spring.target = value`
unconditionally. A drag beyond any intended constraint moves the spring target
freely — the GSAP-Draggable / Motion-`dragConstraints` parity hole (audit
W-GESTURE-BOUNDS, Lane 32 KEY FINDINGS med).

**Cure.** Extend `DragOptions` with:

```ts
/** Hard constraint on the value domain [min, max]. The drag cannot pull the
 *  spring target beyond these limits (a clamp in value domain, BEFORE the
 *  rubber-band factor). */
bounds?: { min: number; max: number };

/** Rubber-band resistance factor in (0, 1]. When the mapped pointer coordinate
 *  exceeds bounds, the spring target is set to the boundary + (excess *
 *  rubberBand) — the pointer coordinate decays toward the limit rather than
 *  being hard-clamped. Default 0.4 (matches Motion/iOS feel); set 0 for a
 *  hard clamp. Has no effect when bounds is omitted. */
rubberBand?: number;
```

In `handleMove` (`drag.ts:233-240`), after computing `value = this.coordOf(e)`,
apply the bounds before `spring.target = value`:

```
if bounds:
    if value < min: spring.target = min + (value - min) * rubberBand
    elif value > max: spring.target = max + (value - max) * rubberBand
    else: spring.target = value
else:
    spring.target = value
```

In `handleUp` (`drag.ts:242-257`), after the `endGesture` call, if the
current `spring.value` is outside bounds, set a corrective target at the
nearest bound (so the post-release fling always settles inside the range):

```
if bounds && (spring.value < min || spring.value > max):
    spring.target = clamp(spring.value, min, max)
    // no velocity override — the spring reseat carries the in-flight velocity
```

The `rubberBand = 0` case is a hard clamp (the motion-path constraint idiom);
`rubberBand = 1` is unconstrained (pass-through); the default `0.4` is the
iOS spring-overscroll feel.

**Gate arm (born-RED, S1 extension to `proof:drag-gesture`).** A new clause
in `scripts/proof-drag-gesture.mjs`:

- Construct a `Draggable({ bounds: { min: 0, max: 200 }, rubberBand: 0 })`, simulate
  a pointer-down at `100` and a pointer-move to `300` (100px over max). Assert
  `draggable.spring.target <= 200` (the hard clamp holds). On today's tree
  `draggable.spring.target === 300` (the unclamped coordinate) — the assertion
  FAILS. Additionally, assert that `DragOptions` exports a `bounds` field (static
  source check: `grep -n "bounds.*min.*max\|min.*number.*max.*number" src/animation/drag.ts`
  → zero hits today).

### S2 — Draggable snap targets (W-GESTURE-BOUNDS, snap arm)

**Breach.** On release, `handleUp` at `drag.ts:242-257` calls
`this.spring.reset(value, releaseVelocity)` — the spring decelerates from the
release coordinate under its natural trajectory. No snap target is considered.
The GSAP `Draggable` `snap` option selects the nearest declared value before the
fling begins. The shipped `decayRest(x0, v0, k)` at `decay.ts:72-90` (the
closed-form frictional resting point) is the correct tool: project the fling's
resting point, find the nearest snap target, reseat the spring toward that
target.

**Cure.** Extend `DragOptions` with:

```ts
/** Snap targets in the value domain. On release, the spring's projected resting
 *  point (via decayRest) selects the nearest target; the spring is reseated
 *  toward that target rather than decelerating freely. Bounds (if set) apply
 *  AFTER snap selection — a snap target outside bounds is clamped to the bound. */
snap?: number[];
```

In `handleUp`, after computing `releaseVelocity`:
1. Call `decayRest(value, releaseVelocity, this.spring.k ?? DEFAULT_DECAY_K)`
   to project the natural resting point.
2. If `snap` is non-empty, find the `snap` target nearest to the projected rest.
3. Call `this.spring.reset(value, releaseVelocity)` (seating at release
   coordinate + velocity) then immediately set `this.spring.target = snapTarget`
   so the fling decelerates toward the nearest snap. If `bounds` is set, clamp
   `snapTarget` to `[min, max]`.

The `decayRest` import is already in the LIGHT tier (same boundary — `decay.ts`
carries no value.js edge). The spring's `target` setter is the standard
mid-flight retarget path.

**Gate arm (born-RED, S2 extension to `proof:drag-gesture`).** A new clause:
construct `Draggable({ snap: [0, 100, 200] })`, simulate a release at `x=60`
with `velocity=0` (no fling momentum). The snap target nearest to `60` is `100`
(the `decayRest` projection from rest is `60`; nearest snap is `100`). Assert
`draggable.spring.target === 100` after `handleUp`. On today's tree the spring
target is `60` (no snap applied) — the assertion FAILS.

### S3 — Sequence segment-lifecycle + label-callback channel (W-TRANSPORT-EVENTS)

**Breach.** `Sequence._frame` at `sequence.ts:387-452` fires no crossing
callbacks. `sequence.ts:97-102` holds `entries` and `labels` but no `subscribers`
map. There is no `on(event, cb)` surface on `Sequence` today. A consumer cannot
observe segment entry/exit or label crossings without polling `sequence.time` in
an external `requestAnimationFrame` loop — a workaround-tier solution.

**Cure.** Mirror `ScrollScene.on` exactly (scroll-scene.ts:506-514):

```ts
// New types (sequence.ts, new exports)
export type SequenceEvent = "segment:enter" | "segment:leave" | "label";

export type SequenceSegmentSubscriber = (
    animation: Animation<any>,
    masterClock: number,
) => void;

export type SequenceLabelSubscriber = (
    name: string,
    masterClock: number,
) => void;

export type SequenceSubscriber =
    | SequenceSegmentSubscriber
    | SequenceLabelSubscriber;
```

Add to `Sequence`:

```ts
private readonly _subscribers = new Map<
    SequenceEvent,
    Set<SequenceSubscriber>
>([
    ["segment:enter", new Set()],
    ["segment:leave", new Set()],
    ["label", new Set()],
]);

/** Subscribe to a segment or label crossing. Returns an unsubscribe handle.
 *  `"segment:enter"` fires when the playhead enters a segment (masterClock
 *  crosses segment.at going forward, or segment.at + duration going backward).
 *  `"segment:leave"` fires on the complementary crossing.
 *  `"label"` fires on every named label crossing in either direction.
 *  Mirror of ScrollScene.on (scroll-scene.ts:506-514). */
on(event: "segment:enter" | "segment:leave", cb: SequenceSegmentSubscriber): () => void;
on(event: "label", cb: SequenceLabelSubscriber): () => void;
on(event: SequenceEvent, cb: SequenceSubscriber): () => void {
    const set = this._subscribers.get(event)!;
    set.add(cb);
    return () => set.delete(cb);
}
```

In `_frame`, before (or after) `_applyAt(phase)`, fire crossings for:
- **segment:enter:** a segment whose `at <= phase < at + duration` that was NOT
  active at the previous frame (tracked via a `_activeSegments: Set<SequenceEntry>`
  field).
- **segment:leave:** a segment that WAS active at the previous frame and is NOT
  active at the current frame.
- **label:** a label whose registered position was straddled between `_prevPhase`
  and `phase` (in either direction — `min(_prevPhase, phase) < labelPos <=
  max(_prevPhase, phase)`).

The `_prevPhase` field (one number, `undefined` on construction) is the only
new instance state. The crossing logic is ONLY active when at least one
subscriber is registered (early-exit when all three sets are empty — no overhead
for the common zero-subscriber case).

**Constraint.** Crossings fire on EVERY `_frame` call, including reverse and
yoyo cycles — the callback receives the `masterClock` at the crossing, so the
consumer can distinguish direction via `masterClock < prevClock`. No separate
`once` idiom; the consumer unsubscribes in the callback if they want one-shot
behavior (the standard idiom from the unsubscribe handle).

**Gate arm (born-RED, new `proof:transport-events`).** The born-RED gate script
`scripts/proof-transport-events.mjs`:

```
node scripts/proof-transport-events.mjs
```

The script:
1. Imports `Sequence` from the compiled barrel.
2. Constructs two stub `Animation`-shaped objects (the minimal `advanceTo` /
   `interpFrames` / `options.duration` surface; no full engine needed — the test
   is LIGHT).
3. Calls `sequence.on("segment:enter", cb)` and `sequence.on("label", cb)`.
4. Calls `sequence.seek(midpoint)` and asserts the callbacks fire.
5. On today's tree: `sequence.on` does not exist — `sequence.on is not a function`
   — the script exits non-zero. **RED today.**
6. On cure: `sequence.on("segment:enter", cb)` registers; `seek` to a point past
   a segment's `at` fires `cb` with the correct `animation` reference and
   `masterClock`. **GREEN on cure.**

Wire into `package.json`:
```json
"proof:transport-events": "node scripts/proof-transport-events.mjs"
```

Add to `proof:correctness` and to `ci.yml` `gates` job (LIGHT, no browser,
no demo build needed — vitest-jsdom is sufficient; the gate is a node script
over the compiled barrel, matching the `proof:orchestration` pattern).

**Source anchor for born-RED proof.** Today:
```
grep -n "\.on\b\|subscribe\|_subscribers\|SequenceEvent" \
    src/animation/sequence.ts
→ zero hits
```
The absence is the born-RED: `proof:transport-events` exits non-zero before
any cure is applied.

### S4 — 2-D drag single-call sugar (W-FRONT-DOOR+)

**Breach.** `drag.ts:29-30` documents the 2-D composition model as "caller
owns the composition (KISS)." This is architecturally correct but forces
eight lines of boilerplate per 2-D drag. No `drag2D` sugar exists in the
barrel (`index.ts`) or in `drag.ts`. The `Draggable` demo in the sequence
scene (`demo/sequence/`) wires both axes manually.

**Cure.** Add to `drag.ts` (LIGHT — same file, no new module):

```ts
export interface Drag2DHandle {
    /** The x-axis Draggable. */
    readonly x: Draggable;
    /** The y-axis Draggable. */
    readonly y: Draggable;
    /** Current (x, y) position. */
    readonly value: { x: number; y: number };
    /** Current (vx, vy) velocity. */
    readonly velocity: { x: number; y: number };
    /** True when BOTH axes have settled. */
    readonly settled: boolean;
    /** Subscribe to (x, y, vx, vy) emissions. Returns an unsubscribe handle. */
    subscribe(fn: (x: number, y: number, vx: number, vy: number) => void): () => void;
    /** Remove all listeners and dispose both Draggables. */
    dispose(): void;
}

/** Construct a 2-D drag — two one-axis Draggables, a combined subscriber,
 *  and a unified dispose. KISS: the 1-D engine stays 1-D; this is sugar only.
 *  Returns a Drag2DHandle. */
export function drag2D(
    element: HTMLElement,
    options?: { x?: DragOptions; y?: DragOptions },
): Drag2DHandle;
```

The implementation constructs `new Draggable({ axis: "x", ...options?.x })` and
`new Draggable({ axis: "y", ...options?.y })`, attaches both to `element`, wires
a shared spring subscriber that emits `(x, y, vx, vy)` whenever either axis
updates. `dispose()` calls both `Draggable.dispose()`. The `bounds` and `snap`
options from S1/S2 pass through to each axis independently — a consumer can
bound x to `[0, viewport.width]` and y to `[0, viewport.height]` separately.

**Gate arm (born-RED, S4 extension to `proof:drag-gesture`).** A static source
check:
```
grep -n "drag2D\|Drag2DHandle" src/animation/drag.ts
→ zero hits today
```
And a functional clause: construct `drag2D(element)`, simulate a pointer-down
at `(50, 80)`, pointer-move to `(100, 120)`. Assert `handle.value.x` is near
`100` and `handle.value.y` is near `120` (the 2-D follow). On today's tree
`drag2D is not a function` — the clause fails. On cure both assertions pass.

---

## Born-RED gate

### Primary: `proof:transport-events` (NEW)

**Gate name:** `proof:transport-events`

**Script:** `scripts/proof-transport-events.mjs` — does not exist today.

**Witness input:**
```
node scripts/proof-transport-events.mjs
```

**RED today:** exit code non-zero — `node: no such file` (the script is
absent). Additionally, the structural anchor:
```
grep -n "\.on\b" src/animation/sequence.ts
→ (output:) 340:  * lifecycle. A settled (or never-played, ...
→ (output:) 546:  * §Managed-child lifecycle). ...
```
Both hits are COMMENTS (the word "lifecycle", not a `.on()` method call).
There is no `.on` METHOD on `Sequence` — confirmed zero hits for `on(event`
or `\.on\s*(` in `sequence.ts`.

**GREEN on cure:** the script exists; `sequence.on("segment:enter", cb)`
registers; `sequence.seek(...)` fires `cb` with the correct arguments;
`sequence.on("label", labelCb)` fires on label crossings; the script exits 0.

**Gate discipline:** gate-first — `scripts/proof-transport-events.mjs` is
authored and wired into `package.json` BEFORE any change to `sequence.ts`.
The script exits non-zero because `sequence.on` does not exist. The cure
lands in `sequence.ts` second; the gate turns green.

### Secondary: `proof:drag-gesture` extended (bounds + snap + 2D clauses)

**Witness input:**
```
node scripts/proof-drag-gesture.mjs
```
after adding the three new clauses (S1 bounds, S2 snap, S4 2D).

**RED today:** each new clause finds `DragOptions` missing `bounds`/`snap`,
`drag2D` absent, and `spring.target` set to unclamped coordinates.

**GREEN on cure:** the bounds clamp and snap projection are applied in
`drag.ts`; `drag2D` is exported; all three new clause assertions pass.

---

## Deps

None. All four S-clauses are kf-internal edits to `drag.ts` and `sequence.ts`
— two LIGHT files with no value.js or glass-ui dependency. No sibling publish
gate is required:

- `SpringProgress.reset(x, v)` — shipped at `spring.ts:118-145`, no new API
- `decayRest` — shipped at `decay.ts:72-90`, already LIGHT, already exported
  from the barrel (`index.ts`)
- `ScrollScene.on` — the mirror idiom, already shipped at `scroll-scene.ts:507`;
  no cross-file coupling (the Sequence implementation stands alone)
- `RAFPlayback` — unchanged; Sequence's `_frame` is the injection point, not
  a new rAF owner

L.W5 is file-disjoint from L.W1 (adapter/format — replay-equality),
L.W2 (compile.ts), L.W3 (ingest.ts), and L.W4 (scripts/ci.yml). It can proceed
in parallel with the other Band A waves. The only ordering constraint is that
`proof:transport-events` is authored (and red) before `sequence.ts` is touched.

`proof:boundary` — the LIGHT static boundary gate — must stay green throughout.
The cure for S1/S2/S3/S4 is additive to `drag.ts` and `sequence.ts`; neither
file carries a static `@mkbabb/value.js` edge today (`drag.ts` imports only
`./spring`; `sequence.ts` imports only `./playback` and `./internal/leaves` —
`sequence.ts:59-63`). The new `on()` method and `drag2D()` export introduce no
new import edges. `proof:boundary` stays green by construction.

---

## Bite — what regression each clause gate catches

| Clause | Gate | Regression it catches |
|--------|------|-----------------------|
| S1 bounds/rubber-band | `proof:drag-gesture` bounds clause | A future `handleMove` refactor that removes the bounds clamp — the spring target exceeds `max`; a consumer's constrained carousel overscrolls |
| S2 snap | `proof:drag-gesture` snap clause | A future `handleUp` simplification that drops the `decayRest` + snap selection — a drag-to-slot UI overshoots all snap targets and never lands |
| S3 segment + label callbacks | `proof:transport-events` | `Sequence._frame` refactored to not fire crossings (e.g. `_applyAt` rewritten as a single-pass without the crossing loop), silently breaking all `.on("segment:enter")` subscribers fleet-wide |
| S3 label crossing | `proof:transport-events` | `.label("chapter-2", 3000)` registered; `_frame` updated but the label-fire path not ported — `on("label", cb)` never fires; a consumer's chapter-counter stays at 0 |
| S4 2-D sugar | `proof:drag-gesture` 2D clause | `drag2D` deleted or renamed without a barrel update — every 2-D drag consumer silently falls back to `drag is not a function` at runtime |
