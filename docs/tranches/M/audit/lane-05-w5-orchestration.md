# Lane 05 — W5 Orchestration (drag bounds/snap/rubber-band/drag2D, Sequence segment/label events)

**Lane:** 05 · **Wave:** L.W5 · **Commit range:** `29bf376` (impl) + `d7c7f3d`/`e4a1cc3` (roster
reconciliation) · **Date:** 2026-06-17 · **Tree:** `tranche-l-dev` tip `529fcfd`

---

## Verdict

L.W5 LANDED clean. All four S-clauses (bounds/rubber-band, snap, segment/label callbacks, drag2D) are
implemented, both born-RED gates re-run GREEN at this audit, the LIGHT boundary holds, and the
WZ-decomposition split (`drag-2d.ts`, `sequence-events.ts`) keeps both host files under ceiling.
One post-close roster correction (`proof:transport-events` tier move) was recorded honestly in
FINAL.md §S6 and verified applied. Three minor M candidates surface from this audit (vitest coverage
gap, snapDecayFriction configurability, first-seek/label asymmetry documentation). No precept
violations found on the as-built surface.

---

## §1 — LIGHT/value.js-free boundary (born-RED premise verified)

**Claim:** all four W5 clauses are LIGHT — zero static `@mkbabb/value.js` edge.

**Verified** by running `node scripts/proof-boundary.mjs` (exit 0 at this tree) and by direct import
inspection:

- `src/animation/drag.ts` runtime imports: `./decay`, `./internal/leaves`, `./spring` (line 1-4).
  No value.js edge.
- `src/animation/drag-2d.ts` runtime imports: `./drag` only (line 1). No value.js edge.
- `src/animation/sequence.ts` runtime imports: `./internal/leaves`, `./playback`, `./sequence-events`
  (lines 59-61). The three `import type` references (`./engine`, `./constants`, `./sequence-events`
  types) are erased under `verbatimModuleSyntax`. No value.js edge.
- `src/animation/sequence-events.ts` runtime imports: `import type` only (lines 28-29). No value.js
  edge.

`proof:boundary` output confirms "24 light source module(s), 0 dormant static specifier(s)" — the
new modules are enumerated, not silently exempt.

---

## §2 — S1/S2: Draggable bounds + rubber-band + snap

### S1 bounds + rubber-band (file:line anchors)

`DragOptions` at `src/animation/drag.ts:64-88` carries `bounds?: { min: number; max: number }` and
`rubberBand?: number` (default 0.4). The injection point is `handleMove` → `applyBounds` at
`drag.ts:294-316`. The corrective retarget fires in `handleUp` at `drag.ts:358-369` — after the
`spring.reset(value, releaseVelocity)` call, if `spring.value` is outside bounds, `spring.target` is
set to `clamp(v, min, max)`.

Gate arm: `scripts/proof-drag-gesture.mjs` clause (S1 bounds), re-run at this audit:

```
  ✓ clause (S1 bounds) — a drag past max=200 (rubberBand:0) clamps `spring.target` to 200 (<= 200);
    DragOptions carries a bounds field
```

Exit 0. Born-RED-on-pre-cure (the pre-cure tree set `spring.target = 300` unconditionally).

### S2 snap (file:line anchors)

`DragOptions` at `drag.ts:81-88` carries `snap?: number[]`. In `handleUp` at `drag.ts:328-350`, the
snap path: calls `decayRest({ initial: value, velocity: releaseVelocity, friction: DEFAULT_DECAY_K })`
(`decay.ts:72-90`), finds `nearestSnap` (`drag.ts:372-386`), clamps to bounds if set, then
`spring.reset(value, releaseVelocity)` + `spring.target = snapTarget`.

Gate arm (S2 snap), re-run at this audit:

```
  ✓ clause (S2 snap) — a release at x=60 (vel 0) reseats `spring.target` to 100 (the nearest snap
    target); DragOptions carries a snap field
```

Exit 0.

---

## §3 — S3: Sequence segment/label callback channel

### Decomposition

The transport-events concern was extracted to `src/animation/sequence-events.ts` (216 lines) by the
WZ decomposition (`d7c7f3d`). `sequence.ts` imports `SequenceEventBus` as a runtime import (line 61)
and re-exports the TYPES through (`lines 77-83`) so the barrel's `export type { SequenceEvent, … }
from "./sequence"` keeps resolving unchanged.

### Implementation

`Sequence.on()` is an overloaded method at `sequence.ts:244-251`. It forwards to
`this._events.subscribe(event, cb)` where `_events` is a `SequenceEventBus<V>` (line 124).

`SequenceEventBus.fire()` at `sequence-events.ts:147-215`:
- Segment lifecycle: compares current active set (`phase >= at && phase < at + duration`) against
  `_activeSegments` to detect enter/leave edges (lines 171-195). Fires `segment:enter` on new active,
  `segment:leave` on newly inactive.
- Label crossing: straddle test `min(prev, phase) < pos <= max(prev, phase)` at lines 202-213.
  Skipped when `prev === undefined` (first paint) or `prev === phase` (no movement).
- Early-exit when ALL three subscriber sets are empty (lines 159-162): `_prevPhase` still advances.

Both `seek` and `_frame` drive `_fireCrossings(phase)` before `_applyAt(phase)`, so play fires the
identical crossings a scrub would.

Gate: `scripts/proof-transport-events.mjs`, re-run at this audit:

```
  ✓ clause (a) — `sequence.on` is a function
  ✓ clause (b) — "segment:enter" fires with (segB, masterClock=1200) on a seek past segB's at-offset
  ✓ clause (c) — "label" fires with (name="mid", masterClock=800) on a seek past the registered label
proof:transport-events — PASS
```

Exit 0.

### Tier correction (FINAL.md §S6)

The W5 impl initially wired `proof:transport-events` to `proof:correctness` (`29bf376`). The
`proof:gate-is-runtime` meta-gate requires every `correctness`-tier member to open a real browser.
`proof:transport-events` is a node/vitest-barrel gate (no browser). CURE at `d7c7f3d`/`e4a1cc3`:
moved to `proof:hygiene` (verified: `package.json:190` contains `proof:transport-events` in the
hygiene chain; NOT in `proof:correctness` at line 189). `proof:gate-is-runtime` exits 0. The FINAL
records this as the S6 roster red, cured honestly.

---

## §4 — S4: drag2D single-call sugar

`src/animation/drag-2d.ts` (115 lines) exports `drag2D(element, options?)` and `Drag2DHandle`.
Re-exported through `drag.ts` at line 462: `export { drag2D, type Drag2DHandle } from "./drag-2d"`.
Barrel `index.ts` exports `drag2D` at line 88, `Drag2DHandle` as a type at lines 93-94.

The `posOf` helper at `drag-2d.ts:75-76` reads `d.spring.target` when `d.dragging` (the live
pointer-pinned target) and `d.spring.value` otherwise (the physics output). This is intentionally
asymmetric with `Draggable.value` (which reads `spring.value` only). The reasoning: during a drag
the target IS the pointer (rubber-banded), so `spring.target` gives instant 2D feedback; post-release
the fling physics owns the value.

Gate arm (S4 drag2D), re-run at this audit:

```
  ✓ clause (S4 drag2D) — drag2D follows both axes to (100, 120); Drag2DHandle exported
```

Exit 0. Runtime verification:

```
LIGHT exports present: Draggable, drag, drag2D, Sequence, stagger
drag2D type: function
```

---

## §5 — Decomposition ceiling check

Post-WZ the four W5 files are under ceiling:

| File | Lines | Ceiling |
|---|---|---|
| `drag.ts` | 462 | 550 |
| `drag-2d.ts` | 115 | 550 |
| `sequence.ts` | 698 | 700 |
| `sequence-events.ts` | 216 | 550 |

`proof:decomposition` exits 0 at this tree.

---

## §6 — Precept findings

**NO precept violations** found on the L.W5 as-built surface. The Lane 32 audit (`completion-lanes-32-36.txt:16`) found "NO NEW violations" on the gesture/DX surface. Verified: the as-built code does not introduce quick-solutions, workarounds, legacy code, or value.js boundary violations.

**One post-close tier error (recorded, not ongoing):** `proof:transport-events` was initially mis-tiered to `proof:correctness`. This was the `proof:gate-is-runtime` S6 roster red, cured honestly in `d7c7f3d` and recorded in `FINAL.md §S6`. The current tree is correct.

---

## §7 — M-wave candidates and deferred folds

### M-BOOK-1: `snapDecayFriction` configurability in `DragOptions`

`DEFAULT_DECAY_K = 5` is hardcoded in `drag.ts:112`. The snap projection (`handleUp` lines 336-339)
uses this friction for `decayRest` regardless of the user's spring stiffness. A stiffer or looser
spring may project a different natural rest than k=5 implies, causing the snap to select a
sub-optimal target. GSAP's InertiaPlugin exposes `resistance`; Motion has no equivalent but the
ecosystem gap is real.

**Proposed fix:** add `snapDecayFriction?: number` to `DragOptions` (default 5); pass it to
`decayRest` in `handleUp`. One-line additive change. No new dependency. LIGHT.

**M disposition:** BOOK-with-tripwire — a consumer-reported missnap is the tripwire; or a
bench showing that DEFAULT_DECAY_K=5 mis-projects vs actual spring trajectory for common spring
configs. Currently unwitnessed.

### M-BOOK-2: vitest coverage for Draggable bounds/snap/drag2D + SequenceEventBus

`test/drag.test.ts` (251 lines) tests `decay`, `Draggable` pointer follow, fling, transform,
axis, subscribe, and `drag()` sugar (`test/drag.test.ts:34-251`). It has ZERO coverage of the W5
additions: `bounds`, `rubberBand`, `snap`, `drag2D`, `Drag2DHandle`. The new behavior is covered
ONLY by the node gate.

`test/sequence-transport.test.ts` (400 lines) covers seek/play parity, pause/resume, progress,
repeat/yoyo, reverse/timeScale, and the bite tests. It has ZERO coverage of `segment:enter`,
`segment:leave`, or `label` events. `test/sequence.test.ts` has none either. The SequenceEventBus is
covered ONLY by `scripts/proof-transport-events.mjs`.

**Proposed fix:** extend `test/drag.test.ts` with bounds/rubber-band/snap/drag2D vitest tests.
Extend `test/sequence-transport.test.ts` with SequenceEventBus crossing tests. This makes the
corpus device-independent (vitest jsdom, no node gate needed for the pure-logic paths).

**M disposition:** M-wave candidate. A `proof:orchestration` audit-clause extension that asserts
vitest coverage anchors exist in `test/drag.test.ts` for bounds/snap and `test/sequence-transport.test.ts`
for transport events would be the born-RED gate. Currently GREEN vacuously (the orchestration gate
checks for specific test file anchors, not these new ones).

### M-BOOK-3: segment/label first-seek asymmetry documentation

`SequenceEventBus.fire()` at `sequence-events.ts:202`: label crossings are skipped when
`_prevPhase === undefined` (first paint). Segment lifecycle IS detected on first paint (because
`_activeSegments` is empty, any active segment fires `enter`). This asymmetry is correct by design
(a crossing requires a FROM; labels need two points, segment membership does not), but it is
undocumented in the method docstring or in `L.W5.md`. A consumer who registers `on("label", cb)`
then immediately calls `seek(past-the-label)` without a prior seek will miss the label.

The gate test at `scripts/proof-transport-events.mjs:148-151` implicitly avoids this by calling
`seq.seek(200)` before registering the label subscriber. The pattern is not documented as required.

**Proposed fix:** document the first-seek skip in the `Sequence.on` docstring and in
`SequenceEventBus.fire`. Alternatively, initialize `_prevPhase = -Infinity` so the first seek is
treated as "coming from -Infinity", which would fire the label on the first paint past it.

**M disposition:** BOOK-with-tripwire — a consumer bug report is the tripwire. The fix would be a
one-line change (`_prevPhase: number | undefined = -Infinity`) or a documentation addition.

### M-BOOK-4: drag2D double-emit per rAF frame

`drag-2d.ts:88-89` subscribes to both x and y axes' springs:
```
const unsubX = x.subscribe(() => emit());
const unsubY = y.subscribe(() => emit());
```
When both springs are active (fling after release), a single rAF tick drives both springs, causing
two calls to `emit()` per frame: one from x, one from y. The subscriber sees `(x_new, y_old)` then
`(x_new, y_new)` in the same frame tick. For a heavy subscriber (say, a DOM render), this is an
extra paint per frame.

**Proposed fix:** coalesce emits within a rAF tick by wrapping the emit in a `requestAnimationFrame`
microbatch, or by driving both axes from a single shared rAF loop. The latter would require a small
refactor to allow an external `tick` path on `SpringProgress`.

**M disposition:** BOOK-with-tripwire — a measured double-paint in the demo (or a user-reported
performance issue with 2D drags) is the tripwire. Currently unwitnessed; the behavior is usable.

---

## §8 — Cross-repo asks

None for W5 specifically. The orchestration tier is kf-internal LIGHT; no value.js, glass-ui, or
parse-that surface is touched.

The `DEFAULT_DECAY_K = 5` constant (M-BOOK-1) is kf-owned, not a sibling ask.

---

## §9 — Performance

No regressions measured. The `SequenceEventBus.fire()` early-exit (lines 159-162) ensures zero
overhead for the common no-subscriber transport. Gate (`proof:transport-events`) is a node/barrel
gate — not a bench. The `drag.ts` bounds clamp is O(1) per move event. The snap selection
(`nearestSnap`) is O(N) over the snap targets array — acceptable for the small N typical in
snapping UIs.

The `drag-2d.ts` double-emit (M-BOOK-4) adds at most one extra subscriber call per rAF frame — not
measured, but qualitatively minor for typical consumers.

---

## §10 — Evidence summary

| Claim | Oracle | Observed result |
|---|---|---|
| LIGHT boundary holds | `node scripts/proof-boundary.mjs` | exit 0 |
| S1 bounds clamp | `proof-drag-gesture.mjs` clause (S1) | `spring.target = 200 <= 200` ✓ |
| S2 snap nearest target | `proof-drag-gesture.mjs` clause (S2) | `spring.target = 100` ✓ |
| S3 segment:enter fires | `proof-transport-events.mjs` clause (b) | `segB, masterClock=1200` ✓ |
| S3 label fires | `proof-transport-events.mjs` clause (c) | `name="mid", masterClock=800` ✓ |
| S4 drag2D follows axes | `proof-drag-gesture.mjs` clause (S4) | `(100, 120)` ✓ |
| Files under ceiling | `proof:decomposition` | exit 0 |
| Tier correction applied | `package.json:189-190` python grep | hygiene=true, correctness=false |
| proof:gate-is-runtime holds | `node scripts/proof-gate-is-runtime.mjs` | exit 0 |
| drag2D runtime export | node inline check | `drag2D type: function` ✓ |

---

## §11 — The M-wave proposal distilled

The three actionable M candidates from this audit (in priority order):

1. **M-W5-vitest-coverage** (M-BOOK-2): extend `test/drag.test.ts` and `test/sequence-transport.test.ts`
   to cover bounds/snap/drag2D and SequenceEventBus crossings. Born-RED gate: a `proof:orchestration`
   clause that asserts coverage anchors exist. Currently no vitest test exercises the W5 additions.

2. **M-W5-snapDecayFriction** (M-BOOK-1): expose `snapDecayFriction?: number` in `DragOptions` to let
   callers tune the snap projection friction. Currently hardcoded `DEFAULT_DECAY_K = 5`
   (`drag.ts:112`). Additive LIGHT change, one-line DragOptions extension + one-line handleUp pass.

3. **M-W5-label-firstseek-doc** (M-BOOK-3): document (or fix) the first-seek label-skip asymmetry.
   Simplest fix: `_prevPhase: number | undefined = -Infinity` in `sequence-events.ts:123` so a fresh
   seek fires label crossings from "negative infinity". Or document it in `Sequence.on()` JSDoc.
