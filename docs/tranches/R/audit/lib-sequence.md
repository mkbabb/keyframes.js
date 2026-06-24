# Tranche R Audit — Lane: lib-sequence

**Date:** 2026-06-24
**Files in scope:** `src/animation/sequence.ts` (698L), `src/animation/sequence-events.ts` (216L)
**Total line-count under review:** 914L

---

## 1. What These Files Actually Are

`sequence.ts` exports the `Sequence<V>` master-playhead orchestrator (GSAP-Timeline-class temporal positioning) — a single class of 698 lines. `sequence-events.ts` exports `SequenceEventBus<V>` (the segment/label crossing detector), five types, and one interface — 216 lines.

`sequence.ts` was a prior-tranche decomposition target (L.WZ). The types and event-bus were lifted off into `sequence-events.ts`. The class body itself was not restructured.

---

## 2. Fitness Against the Tranche R Precepts

### 2a. Size

`sequence.ts` at 698L **exceeds the 500L decomposition threshold** stated in the precepts. The excess is not gratuitous — the class genuinely covers a coherent concern (temporal orchestration) — but the precepts require a directory decomposition regardless of coherence once the 500L gate is crossed.

### 2b. The flat hyphenated sibling pattern — partial

`sequence-events.ts` is an L.WZ sibling lift. It is one file, not a directory, collocated with `sequence.ts`. The precept says "real DIRECTORY sub-modules, NOT flat hyphenated sibling files." A flat `sequence/` directory (`index.ts` + `events.ts` + `transport.ts`) would satisfy the precept. The current two-file flat layout is a partial decomposition.

### 2c. Legacy / workaround / fallback

One instance confirmed. See F-3 (inlined `prefersReducedMotion` predicate).

### 2d. DRY vs `timeline.ts`

`Sequence` and `Timeline` serve entirely different contracts (temporal orchestrator vs. progress sampler). There is no DRY violation between the two — the name/subsumption decision is deliberately booked and correct. No code should be merged or shared.

### 2e. DRY vs `scroll-scene.ts`

Both `SequenceEventBus` and `ScrollScene` implement the identical `Map<EventType, Set<Subscriber>> + on(event, cb): () => void + fire()` pattern (flagged below as F-4).

---

## 3. Specific Findings

---

### F-1 · `sequence.ts` exceeds 500L decomposition threshold — HIGH

**Location:** `src/animation/sequence.ts` — 698 lines, one exported class  
**Category:** god-module / decomposition

The class body bundles three distinct concerns:

| Concern | Lines (approx.) | Description |
|---|---|---|
| **Position resolution** | 278–295 | `resolvePosition` — regex parser for `"+=n"` / `"-=n"`, label lookup, cursor tracking |
| **Transport / playback machine** | 130–185, 397–683 | `_rate`, `_repeatCount`, `_yoyoOn`, `_paused`, `_playOrigin`, `_lastClock`, `_playingPromise`, `_resolvePlay`, `_boundFrame`; `play`, `pause`, `resume`, `stop`, `_frame`, `_fold`, `_restPhase`, `_reanchor`, `_settle`, `_isForwardMonotone`, `timeScale`, `reverse`, `repeat`, `yoyo` |
| **Clock application / scrub** | 305–385 | `seek`, `_applyAt`, `_fireCrossings`, `setTargets`, `duration`, `time`, `progress`, `rate`, `finished` |

**Proposal:** Dissolve into a `src/animation/sequence/` directory:

```
src/animation/sequence/
    index.ts          — re-exports Sequence + all public types (barrel; barrel stays)
    sequence.ts       — Sequence class shell: entries, labels, cursor; add/label/on; seek/_applyAt/_fireCrossings; setTargets; duration/time/progress/rate/finished
    transport.ts      — the playback machine: _rate/_repeatCount/_yoyoOn/_paused/_playOrigin/_lastClock fields; play/pause/resume/stop/timeScale/reverse/repeat/yoyo; _frame/_fold/_restPhase/_reanchor/_settle/_isForwardMonotone
    events.ts         — SequenceEventBus (currently sequence-events.ts body)
    position.ts       — resolvePosition + SequencePosition type (20 lines, but a natural cohesion unit — the GSAP-idiom parser)
```

`src/animation/sequence-events.ts` folds into `sequence/events.ts`. The flat sibling disappears. The barrel in `sequence/index.ts` re-exports through `./sequence`, `./events`, `./position` so the outside import set (`index.ts`, `compile.ts`, `animate.ts`) changes only one path segment.

---

### F-2 · `Sequence._frame` is unconditionally `async` — MEDIUM

**Location:** `src/animation/sequence.ts` line 450

```ts
private async _frame(clock: number): Promise<boolean> {
```

`_frame` is declared `async` so it can `await animation.advanceTo(phase)` inside the `_isForwardMonotone()` guard (lines 494–500). But when `_isForwardMonotone()` is `false` (any non-default transport: `reverse`, `repeat`, `yoyo`), the `async` keyword wraps the synchronous return path in a `Promise` allocation on every frame — an unnecessary microtask hop per rAF tick.

The `_boundFrame` field type is:

```ts
private _boundFrame: (t: number) => Promise<boolean>;  // line 141
```

`RAFPlayback.loop` accepts `boolean | Promise<boolean>`. `AnimationGroup._frame` and `engine.ts`'s `_frame` correctly return `boolean | Promise<boolean>`, taking the sync fast-path the `RAFPlayback._run` sync branch (line 139 of `playback.ts`) was specifically built for:

> "A synchronous `step` … reschedules INLINE — no `Promise.resolve`, no microtask hop."

`Sequence._frame` never takes that fast-path for non-default transports.

**Proposal:** Convert to `boolean | Promise<boolean>` and branch on `_isForwardMonotone()`:

```ts
private _frame(clock: number): boolean | Promise<boolean> {
    // ... clock/phase logic (sync) ...
    if (!this._isForwardMonotone()) {
        this._fireCrossings(phase);
        this._applyAt(phase);
        return this._frameFinalize(phase, finished);
    }
    // forward-monotone: async advanceTo path
    const pending = this._frameForwardMonotone(phase, finished);
    return pending;
}
```

Update `_boundFrame` type to `(t: number) => boolean | Promise<boolean>` to match `AnimationGroup`.

---

### F-3 · Inlined `prefersReducedMotion` predicate — MEDIUM (legacy / workaround)

**Location:** `src/animation/sequence.ts` lines 692–698

```ts
/**
 * SSR-safe `prefers-reduced-motion: reduce` probe. Mirrors the engine's
 * off-DOM posture (no `matchMedia` → false). Inlined (not imported from
 * `internal/reduced-motion`) to keep the dependency surface to the two light
 * modules the docstring names; the predicate is one line.
 */
const prefersReducedMotion = (): boolean =>
    typeof matchMedia === "function" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches;
```

The canonical authority already exists at `src/animation/internal/reduced-motion.ts` (`prefersReducedMotion` and `withReducedMotion`). The docstring justifies the copy with "keep the dependency surface to two light modules." But:

1. `internal/reduced-motion.ts` is **explicitly value.js-free** — it imports nothing from `@mkbabb/value.js`, only reads `window.matchMedia`. Importing from it carries zero boundary cost.
2. The inlined copy calls `matchMedia(…).matches` fresh every invocation — it does NOT use the shared `MediaQueryList` singleton (`prmQuery`) that `internal/reduced-motion.ts` maintains for live `.matches` re-reads without re-constructing the query. The canonical version is strictly better.
3. `sequence.ts` already imports from `./internal/leaves` (another `internal/` module). The "keep to two light modules" rationale was never a hard constraint and is now inconsistent with the import set.

This is a silent divergence from the canonical gate — exactly the pattern the `internal/reduced-motion.ts` header says it closes: *"Collapses the formerly hand-rolled `prefersReducedMotion()` copies."*

**Proposal — explicit excision:**

Delete lines 691–698 entirely. Import `withReducedMotion` from `./internal/reduced-motion`. Replace:

```ts
if (this.respectReducedMotion && prefersReducedMotion()) {
    this.seek(this.duration);
    return Promise.resolve();
}
```

with:

```ts
return withReducedMotion(
    this.respectReducedMotion || undefined,
    () => { this.seek(this.duration); return Promise.resolve(); },
    () => { /* existing play body */ },
);
```

Or, more precisely matching the existing scalar policy shape:

```ts
if (this.respectReducedMotion) {
    return withReducedMotion(true, () => {
        this.seek(this.duration);
        return Promise.resolve();
    }, normalPlay);
}
return normalPlay();
```

The inlined copy must not survive Tranche R.

---

### F-4 · `SequenceEventBus` and `ScrollScene.subscribers` are byte-identical subscriber registries — MEDIUM (DRY / decomposition)

**Location:** `src/animation/sequence-events.ts` lines 98–134, `src/animation/scroll-scene.ts` lines 360–514

Both classes independently implement:

```ts
// sequence-events.ts lines 98–104
private readonly subscribers = new Map<SequenceEvent, Set<SequenceSubscriber>>([
    ["segment:enter", new Set()],
    ["segment:leave", new Set()],
    ["label", new Set()],
]);

// scroll-scene.ts lines 360–366
private readonly subscribers = new Map<ScrollSceneEvent, Set<ScrollSceneSubscriber>>([
    ["enter", new Set()],
    ["leave", new Set()],
]);
```

Both implement the same subscribe body:

```ts
// sequence-events.ts line 131–133
subscribe(event, cb) {
    const set = this.subscribers.get(event)!;
    set.add(cb);
    return () => set.delete(cb);
}

// scroll-scene.ts lines 507–511
on(event, cb) {
    const set = this.subscribers.get(event)!;
    set.add(cb);
    return () => set.delete(cb);
}
```

The subscribe body is identical in structure; only the method name differs (`subscribe` vs `on`). The `fire`/`dispatch` side differs (sequence has crossing-detection logic, scroll-scene fires immediately), so the firing side should NOT be merged. Only the registry mechanic (construction + subscribe) is DRY.

**Proposal:** Extract a minimal `EventRegistry<K extends string, CB>` generic into `src/animation/internal/event-registry.ts`:

```ts
export class EventRegistry<K extends string, CB extends (...args: any[]) => void> {
    private readonly sets: Map<K, Set<CB>>;
    constructor(events: readonly K[]) {
        this.sets = new Map(events.map((k) => [k, new Set<CB>()]));
    }
    get(event: K): Set<CB> { return this.sets.get(event)!; }
    subscribe(event: K, cb: CB): () => void {
        const set = this.sets.get(event)!;
        set.add(cb);
        return () => set.delete(cb);
    }
}
```

`SequenceEventBus` and `ScrollScene` each hold an `EventRegistry` instance; the `on`/`subscribe` method delegates to `registry.subscribe`; the `fire` logic in each retains its bespoke crossing detection. This eliminates the duplicate registry boilerplate without merging the distinct detection algorithms.

---

### F-5 · `SequencePosition` type union — redundant template literals — LOW (api-surface)

**Location:** `src/animation/sequence.ts` line 94

```ts
export type SequencePosition = number | `+=${number}` | `-=${number}` | string;
```

The template-literal members `` `+=${number}` `` and `` `-=${number}` `` are structural subtypes of `string`. Because `string` is the last union member, TypeScript resolves any string to `string`, making the template-literal members documentational-only — they provide no narrowing to a caller (you cannot write `overload(pos: \`+=${number}\`)` against a `SequencePosition` parameter and have TypeScript prefer it). The only consumer of this type is `resolvePosition`, which uses a regex at runtime anyway.

This is a low-severity cosmetic issue, not a bug. However, per the KISS precept: the type union is misleading — it implies TypeScript will enforce the `+=` form, but it will not.

**Proposal:** Simplify to `number | string` and document the two string sub-forms in JSDoc only. OR, if the template-literal IDE hint is considered worthwhile, keep them but **drop the trailing `| string`** and let unknown-string callers get a type error (which would be *more* correct — the type system then rejects an arbitrary label string unless the overload is explicit, matching the runtime `throw` for unknown labels). The "drop trailing `| string`" variant is the honest form; the "simplify to `string`" variant is the KISS form.

---

### F-6 · `duration` getter re-walks all entries on every call — LOW (brittleness / efficiency)

**Location:** `src/animation/sequence.ts` lines 188–195

```ts
get duration(): number {
    let end = 0;
    for (const entry of this.entries) {
        const segEnd = entry.at + entry.animation.options.duration;
        if (segEnd > end) end = segEnd;
    }
    return end;
}
```

`_frame` calls `this.duration` on lines 466 and 479 (via `_fold` calling it at 359 and `_restPhase` calling it at 541). `progress` calls it twice (getter line 209, setter line 213). `seek` / `play` / `resume` call it indirectly. On the hot rAF path there are **2–3 linear walks of `entries` per frame** from `duration` alone.

The `entries` array is sorted-on-insert in `add()` and is append-only (no remove API). The running maximum end-time is monotonically non-decreasing as entries are added. A cached `_duration` field invalidated only by `add()` would eliminate the hot-path walk.

This is a brittleness (latent performance cliff with many segments) not a correctness bug. The precept cites "no silent fallback behavior" and KISS — this is a minor KISS violation.

**Proposal:** Cache as `private _durationCache = 0` updated at the end of `add()`:

```ts
add(animation, at) {
    const resolved = this.resolvePosition(at);
    this.entries.push({ animation, at: resolved });
    this.entries.sort((a, b) => a.at - b.at);
    this.cursor = resolved + animation.options.duration;
    // Invalidate cache
    const end = resolved + animation.options.duration;
    if (end > this._durationCache) this._durationCache = end;
    return this;
}
get duration() { return this._durationCache; }
```

Note: because `at` can be less than the current max end (e.g. `at:0` after a long segment), the max end must be recomputed from all entries when a new `at` is inserted behind the cursor. A simpler correct approach: on every `add()` just iterate to recompute once-on-insert (O(n) once per add, not per frame).

---

## 4. Decomposition Proposal — `src/animation/sequence/`

```
src/animation/sequence/
    index.ts          (barrel — re-exports Sequence + all public types unchanged)
    sequence.ts       (~350L) Sequence class: entries, labels, cursor; constructor; add/label/on; seek/_applyAt/_fireCrossings; setTargets; duration/time/progress/rate/finished
    transport.ts      (~280L) Exported mixin or composed object: _rate, _repeatCount, _yoyoOn, _paused, _playOrigin, _lastClock, _resolvePlay, _playingPromise, _boundFrame; play/pause/resume/stop/timeScale/reverse/repeat/yoyo; _frame/_fold/_restPhase/_reanchor/_settle/_isForwardMonotone
    events.ts         (~216L) SequenceEventBus — body of current sequence-events.ts, uses shared EventRegistry from internal/
    position.ts       (~30L) resolvePosition + SequencePosition type
```

The flat sibling `src/animation/sequence-events.ts` is deleted; its body moves to `sequence/events.ts`. External import paths in `compile.ts` and `animate.ts` change from `"./sequence"` to `"./sequence/index"` (or the same `"./sequence"` if Node module-resolution handles the directory index). The public barrel (`index.ts`) exports are **unchanged**.

---

## 5. DRY check vs `timeline.ts`

No DRY overlap found. `Timeline`/`KeyframesScrollTimeline`/`ManualTimeline` are progress samplers driven by scroll/manual input; `Sequence` is a clock distributor driven by rAF. They share no logic. The booked name/subsumption decision (module docstring §a and §b) is correct and should not be revisited.

---

## 6. Summary Table

| ID | Severity | Category | File:line |
|---|---|---|---|
| F-1 | high | god-module / decomposition | `sequence.ts` entire file (698L) |
| F-2 | medium | brittleness | `sequence.ts:450` (`async _frame`) |
| F-3 | medium | legacy / workaround | `sequence.ts:692–698` (inlined PRM probe) |
| F-4 | medium | dry | `sequence-events.ts:98–134` + `scroll-scene.ts:360–514` |
| F-5 | low | api-surface | `sequence.ts:94` (`SequencePosition` union) |
| F-6 | low | brittleness | `sequence.ts:188–195` (`duration` getter hot walk) |
