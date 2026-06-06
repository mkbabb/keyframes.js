# F.W5 — The sync-step fast path: `drive` half SHIP, `Animation`/group half HELD (charter F5)

**Phase:** IMPL (spec authored in DEV — awaits auth) · **Class:** SHIP-in-F (the `drive` half) +
HELD (the `Animation`/group half, behind the event-ordering lock) · **Scope:**
`src/animation/playback.ts` (`RAFPlayback._run` — the loop-core dispatch) +
(HELD half only) `src/animation/engine.ts`/`group.ts` (the `async` `_frame`/`advanceTo`) ·
**DAG-deps:** depends on F.W0 (the spine) AND **F.W1** (`bench/sync-step.bench.ts` must
run to gate the promise-count clause honestly — F1's S3). Band 1, parallel to F4/F6.

The §Mandate (F.W0) is the spine; this wave most tests **measure-first** AND **no
workarounds** — the fold SPLITS by its event-ordering semantics: the `drive` half ships
(synchronous steppers dispatch no animation events, so a sync fast-path is
behaviour-identical), and the `Animation`/group half is HELD until the event-ordering
lock exists (the boundary awaits carry genuine `animationstart`/`iteration`/`end`
semantics that must stay byte-unchanged). `RAFPlayback._run` wraps EVERY frame in
`Promise.resolve().then` — a microtask hop — even for synchronous `drive` steppers
(33 ns/frame measured); `_frame`/`advanceTo` are `async` and the steady-state interior
frame awaits nothing (43 ns/frame; ~2.1 µs/frame on a 50-child group).

This is net-new (an E withhold RE-MEASURED, NOT inherited debt). Verified not asserted
(inv ε) against `tranche-e-impl`.

**Provenance.** `a-engine-post-e F-ENG-1` (E-RT-2 re-confirmed OPEN; the two isomorphic
seams + the MEASURE-FIRST posture), `a-runtime-remeasure RM-2` (the 33/43/~2144 ns
re-measure + the SPLIT disposition + the authored `bench/sync-step.bench.ts`).

---

## § The state, verified (not asserted)

The live facts, read- and grep-confirmed on `tranche-e-impl`:

1. **`RAFPlayback._run` wraps every frame in a promise + microtask hop.** `playback.ts:96-111`
   reads (verified live):
   ```ts
   private _run(step: (now: number) => boolean | Promise<boolean>): void {
       const gen = ++this._gen;
       const frame = (now: number): void => {
           void Promise.resolve(step(now)).then((cont) => {
               if (gen !== this._gen) return;
               if (cont) { this._rafId = requestAnimationFrame(frame); }
               else { this._cleanup(); }
           });
       };
       this._rafId = requestAnimationFrame(frame);
   }
   ```
   Every frame, on every loop shape (`play`/`drive`/`loop`), allocates a promise + schedules a
   microtask hop, even when `step` is synchronous.

2. **`drive` steps a SYNCHRONOUS stepper.** `drive` (`playback.ts:168` per `a-runtime-remeasure RM-2`)
   steps a `Tickable` whose `tickDt` is a plain synchronous boolean-returning stepper
   (`SmoothProgress`/`SpringProgress`, `spring.ts:289` `tickDt`, `smooth.ts`) — it pays a promise +
   microtask turn it never needs, and it dispatches NO animation events.

3. **The `Animation` path compounds — and its awaits carry real semantics.** `_frame`/`advanceTo`
   are `async` (`a-engine-post-e F-ENG-1`: `engine.ts` async `_frame`/`advanceTo`; `group.ts`
   `_advanceSlice` `Promise.all`), so the steady-state interior frame allocates a promise per
   `async` fn + an `await` microtask turn, awaiting nothing on the interior frame (`onStart`/`onEnd`/
   `sleep` are boundary-only). BUT the boundary awaits carry genuine semantics: delay gating, the
   awaited `onEnd`-before-`_resolvePlay`, the WAAPI shadow tick's awaited `playWAAPI`, and the
   `animationstart`/`animationiteration`/`animationend` dispatch ordering (`a-engine-post-e F-ENG-1`,
   `a-runtime-remeasure RM-2`).

4. **The re-measure (independent, node v26).** `a-runtime-remeasure §A.2`: `drive` async = 33.9 ns
   vs sync 0.75 ns → **33.1 ns/frame** overhead; `Animation` interior (2 async fns + `await`) =
   **42.9 ns/frame**; 50-child group async tax **~2144 ns/frame**. Small individually but per-frame,
   per-animation, forever — steady-state microtask + promise garbage feeding minor GC (the same
   class the `out` buffer was added to avoid), felt 2× harder at 120 Hz.

The wave's job: land the `drive`-half sync fast-path (gated on a promise-count clause alone — no
event-ordering subtlety, since `drive` dispatches no events), and HOLD the `Animation`/group half
behind the event-ordering parity lock. Pixel/event-identical.

---

## § Goal

**What lands (the IMPL the spec gates):**
- **The `drive`-half sync fast-path in `_run`** — `const r = step(now); if (r && typeof r.then ===
  "function") { /* async branch, unchanged */ } else { /* sync reschedule */ }`. The `typeof` picks
  the path, costs nothing for the async case, and removes the 33 ns/frame from every
  `SmoothProgress`/`SpringProgress`/`Draggable` fling. Behaviour-identical (the `.then` callback body
  runs inline when `r` is not a thenable). Gated on the promise-count clause ALONE — `drive`
  dispatches no animation events. (SHIP-in-F.)
- **The `Animation`/group half HELD** — making `_frame` synchronous requires splitting the
  steady-state advance from the boundary frames (hoist the one-time `onStart` delay/dispatch out of
  the per-frame path; `onEnd` mutates flags + dispatches — neither needs `await`). The boundary
  awaits carry genuine event-ordering semantics; this half SHIPS ONLY on the event-ordering lock
  proving byte-unchanged `animationstart`/`iteration`/`end` ordering across `play`/`loop`/group —
  else recorded-withheld WITH the measurement. (MEASURE-FIRST → HELD.)

**Why:** the `drive` overhead is pure steady-state microtask garbage on a synchronous stepper that
needs none of it — a clean, event-free win (`a-runtime-remeasure RM-2`: "behavior-identical … no
event-ordering subtlety"). The `Animation`/group half is the larger win (~2.1 µs/frame on a
50-child group) but its boundary awaits are load-bearing — the §Mandate-correct posture is to ship
the safe half on a promise-count clause and HOLD the subtle half behind the lock that proves the
event ordering is preserved EXACTLY (`a-engine-post-e F-ENG-1`: "It does NOT ship on assertion").

---

## § Scope

### S1 — The `drive`-half sync fast-path in `_run` — `a-runtime-remeasure RM-2` / `a-engine-post-e F-ENG-1`

**WHAT:** in `RAFPlayback._run` (`playback.ts:99-108`), branch on whether `step(now)` returns a
thenable: `const result = step(now); if (result && typeof result.then === "function") { result.then(
(cont) => { … the current async reschedule … }); } else { /* synchronous: reschedule inline with the
boolean result, no promise, no microtask */ }`. For a synchronous `drive` stepper (the common case)
this removes the per-frame `Promise.resolve().then`. The async branch is byte-unchanged for the
`Animation`/group draw frame (which still returns a `Promise<boolean>`).

**WHY:** `drive` steppers are unconditionally synchronous (`tickDt` returns a boolean) and dispatch
NO animation events — so a sync reschedule is behaviour-identical, with no event-ordering subtlety
(`a-runtime-remeasure RM-2`). It removes 33 ns/frame from every `SmoothProgress`/`SpringProgress`/
`Draggable` fling — per-frame, forever. The `typeof result?.then` check is the genuine
feature-detect (a thenable takes the async path; a boolean takes the sync path), not a workaround:
the async branch remains the true path for the genuinely-async draw frame.

### S2 — HOLD the `Animation`/group half behind the event-ordering lock — `a-runtime-remeasure RM-2` / `a-engine-post-e F-ENG-1`

**WHAT:** the `Animation`/group sync transposition (split the steady-state advance from the boundary
frames; hoist `onStart`; make the interior `_frame` a synchronous boolean-returning function;
`onEnd` mutates flags + dispatches without `await`) is SPECIFIED but HELD. It SHIPS only if the
event-ordering lock (S3 clause 2) is authored and green in F — proving `animationstart`/
`animationiteration`/`animationend` + the play-promise resolve point are byte-unchanged across
`play`/`loop`/group. Else it is recorded-withheld WITH the 43 ns / ~2.1 µs measurement.

**WHY:** the boundary awaits carry genuine semantics (delay gating, the awaited
`onEnd`-before-`_resolvePlay`, the WAAPI shadow tick's awaited `playWAAPI`) that the transposition
must preserve EXACTLY (`a-engine-post-e F-ENG-1`). The §Mandate forbids shipping on assertion: this
half ships ONLY on the lock proving byte-unchanged ordering, never on "it should be equivalent." It
is the larger win, but the riskier — so it is HELD, not blind-shipped.

### S3 — `proof:sync-step` (the falsifiable close) — `a-runtime-remeasure RM-2` / `a-engine-post-e F-ENG-1`

**WHAT:** a new vitest gate `proof:sync-step` (chained into `proof:all` + CI via F2) with two clauses:
1. **Promise-count clause (gates the `drive` half).** Monkeypatch `Promise.resolve` (or an
   `--expose-gc` heap-delta probe) over a 600-frame steady `drive` window; assert the count drops
   from O(frames) → O(1) on the synchronous-stepper fast path. BITES: revert to the always-async
   `_run` → the count is O(frames) → reds. (`bench/sync-step.bench.ts`, F1's S3 harness, supplies the
   wall-time delta.)
2. **Event-ordering lock (gates/locks-OUT the `Animation`/group half).** Assert
   `animationstart`/`animationiteration`/`animationend` + the play-promise resolve point are
   byte-unchanged vs the current async path across `play`/`loop`/group. The held `Animation`/group
   half is LOCKED OUT by this clause: it may land ONLY when this parity test is green; a sync
   `_frame` that reorders any boundary event REDS it.

**WHY:** inv ε — the close must BITE. The promise-count clause is the falsifiable form of "the
`drive` path schedules zero microtasks"; the event-ordering lock is the falsifiable form of "the
`Animation`/group ordering is byte-unchanged" — it is the gate that lets the held half ship only on
proof, never on assertion. `proof:standalone-zero-alloc` already proves the buffer half; this is its
loop-core sibling (`a-engine-post-e F-ENG-1`).

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES:

1. **The `drive` path schedules zero microtasks.** `proof:sync-step` clause 1: a synchronous `drive`
   stepper over a 600-frame window schedules O(1) (not O(frames)) microtasks. BITES: revert `_run`
   to always-async → O(frames) → reds.
2. **The `drive` fast-path is behaviour-identical.** The `drive`-driven `SmoothProgress`/
   `SpringProgress` output (and `Draggable` fling) is byte-identical to the async path; no event is
   dispatched on the `drive` path (it has none). BITES: a value/timing drift on the sync path → reds.
3. **The held `Animation`/group half is LOCKED OUT until the event-ordering lock is green.**
   `proof:sync-step` clause 2: the event-ordering parity test asserts byte-unchanged
   `animationstart`/`iteration`/`end` + play-promise resolve across `play`/`loop`/group. The
   `Animation`/group sync transposition may land ONLY when this is green. BITES: a sync `_frame` that
   reorders any boundary event → reds (so the held half cannot ship on assertion).
4. **kf-local, pixel/event-identical.** The `drive` fold touches only `playback.ts`'s loop-core
   dispatch; the held half (if it lands) touches `engine.ts`/`group.ts` boundary/interior split only,
   gated by clause 3. ZERO value.js edge. BITES: a value.js edit, or an unsanctioned `Animation`-half
   ship without the green lock → reds.

---

## § Folds

Retires (by finding id):
- **`R3`/`MF-3`** — the sync-step fast path, `drive` half (`F.md §F.W5`) — S1 (ship
  `drive`) + S2 (hold `Animation`/group) + S3 (gate).
- **`a-engine-post-e F-ENG-1`** — E-RT-2 re-confirmed OPEN; the two isomorphic seams; MEASURE-FIRST —
  S1/S2/S3.
- **`a-runtime-remeasure RM-2`** — 33/43/~2144 ns re-measure; SPLIT disposition (land `drive`, hold
  `Animation`/group) — S1/S2/S3.

**KILL/RECORD ledger for Band 1 (carried so no future lane re-raises — shared with F4 §Folds,
`F.md §F.W6 (the Band-1 KILL/RECORD ledger)`):**
- **DOM write-skip diff-cache** (`R5`/`MF-4`) — **KILL** (~0; the real cost is the
  `unflattenObjectToString` alloc → **value.js-HANDOFF VJ-F4/VJS-2**). F must NOT re-open the diff-skip.
- **D1 frozen-shape `ValueUnit`** (`R6`) — **KILL** (mono ≈ mega; the carrier store is a fast
  stable-offset store, NOT a dictionary lookup). The lever is **D2 SoA → value.js-HANDOFF**; the
  kf-local numeric-segment compile is MEASURE-FIRST/BOOK (gate on real-K). F must NOT monomorphize the
  carrier.
- **CSS Typed OM as interp carrier** (`R7`) — **KILL (record)** (allocates per `.add`/`.mul`;
  DOM-coupled). The Typed-OM write substrate is a SEPARATE MEASURE-FIRST axis.
- **W8 S1/S2/S3** (`MF-6`/`MF-7`/`MF-8`) — **RECORD / MEASURE-FIRST+BOOK / BOOK** (the withhold HOLDS,
  re-measured with the full-tick denominator `a-framecompiler-remeasure` gave it).
- **`tryParseCache` eviction** (`MF-9`) — **RECORD** (cold path; the bound belongs in value.js
  `memoize`, Band V F3).
- **preset lazy memo** (`MF-5`) — **RECORD** (a memo breaks instance independence).

**RECORD (already-SOTA — `a-runtime-remeasure §ALREADY-SOTA`, `a-engine-post-e §ALREADY-SOTA`):**
- **The light steppers are stall-robust BY CONSTRUCTION** — `SmoothProgress.tickDt` is
  frame-rate-independent exponential smoothing; `SpringProgress` is closed-form analytic. The `drive`
  loop's un-clamped `dt` (`playback.ts:173`) is CORRECT (a huge post-stall `dt` saturates the smoothing
  → snap, or lands the analytic spring at its mathematically-correct position). NOT a gap — note it as
  a LEAD. F5's `drive` fast-path must preserve this (the sync reschedule passes the same `dt`).

---

## § Design decisions

1. **Split by event-ordering semantics — ship the safe half, HOLD the subtle — RESOLVED.** The
   `drive` half dispatches no animation events, so a sync fast-path is behaviour-identical and gates on
   a promise-count clause alone (`a-runtime-remeasure RM-2`). The `Animation`/group half's boundary
   awaits carry genuine `animationstart`/`iteration`/`end` semantics that must stay byte-unchanged — so
   it HOLDS behind the event-ordering lock and ships ONLY on proof. Trade-off: holding the larger win
   (~2.1 µs/frame on a 50-child group) reads as leaving value on the table — but the §Mandate forbids
   shipping the subtle half on assertion; the honest posture is the safe half now, the subtle half on
   the green lock or recorded-withheld with the number.

2. **`typeof result?.then` is a genuine feature-detect, NOT a workaround — RESOLVED.** The async
   branch remains the TRUE path for the genuinely-async draw frame; the sync branch fires only when
   `step` returns a boolean (the `drive` stepper). This is the no-legacy feature-detect discipline (the
   JS/async path is the genuine fallback), not a special-case hack — the dispatch picks the correct
   path by the return type, which IS the contract. Trade-off: the branch adds a `typeof` check per
   frame — negligible (sub-ns) vs the 33 ns promise+microtask it removes.

3. **The event-ordering lock GATES the held half — it does not merely document it — RESOLVED + HONEST
   (inv ε).** `proof:sync-step` clause 2 is not a note that "the ordering should be preserved" — it is
   the executable parity test that LOCKS OUT the `Animation`/group sync transposition until it is green.
   The held half lands in F only if the lock is authored and passing; else it is recorded-withheld with
   the 43 ns / ~2.1 µs measurement (the D-3/E.W5 honest-close discipline). Trade-off: authoring the lock
   is real work for a held fold — but it is the ONLY way the subtle half can ship without violating the
   §Mandate's no-ship-on-assertion, and it doubles as the standing isomorphism guard for any future
   `_frame` change.
