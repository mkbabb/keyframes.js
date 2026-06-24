# Tranche R — Lib-Light Lane Audit

**Lane:** lib-light  
**Files audited:** `src/animation/{numeric.ts,smooth.ts,timeline.ts,playback.ts,oscillator.ts,stagger.ts,flip.ts,drag.ts,drag-2d.ts,decay.ts,morph.ts,motion-path.ts,draw-svg.ts,morph-svg.ts}`  
**Total lines:** 3,134

---

## 1. Inventory and line counts

| File | Lines | Boundary | Role |
|---|---|---|---|
| `playback.ts` | 250 | LIGHT | rAF driver / `Tickable` interface |
| `numeric.ts` | 265 | LIGHT | Zero-alloc numeric keyframe interpolator |
| `smooth.ts` | 201 | LIGHT | Exponential-damp progress stepper |
| `timeline.ts` | 272 | LIGHT | Abstract progress pipeline + scroll/manual concrete + `createNativeTimeline` |
| `oscillator.ts` | 143 | LIGHT | Periodic phase clock + waveform shaper |
| `stagger.ts` | 171 | LIGHT | Per-index delay generator |
| `morph.ts` | 122 | LIGHT | `ElementMorph` wrapping `NumericAnimation` |
| `flip.ts` | 176 | LIGHT | FLIP composition over `ElementMorph` |
| `drag.ts` | 462 | LIGHT | 1-axis pointer-capture drag + spring fling |
| `drag-2d.ts` | 115 | LIGHT | 2-axis sugar over two `Draggable`s |
| `decay.ts` | 100 | LIGHT | Frictional-glide closed form |
| `motion-path.ts` | 191 | **HEAVY** | `offset-distance` sweep over `CSSKeyframesAnimation` |
| `draw-svg.ts` | 214 | **HEAVY** | `stroke-dashoffset` sweep over `CSSKeyframesAnimation` |
| `morph-svg.ts` | 452 | **HEAVY** | SVG path morph via `PathGeometry` + `CSSKeyframesAnimation` |

`motion-path.ts`, `draw-svg.ts`, and `morph-svg.ts` **are not light-tier files**. All three carry a static `import { CSSKeyframesAnimation } from "./engine"` and are loaded exclusively through `loadAnimationEngine()` in `load-engine.ts:434–441`. They are included in this audit because the lane assignment included them, but the findings below correctly classify them as HEAVY.

---

## 2. Structural coherence: the flat-file pattern holds

The 14 files live directly in `src/animation/`. The lane spans two genuinely distinct concerns:

- **Physics/interpolation steppers:** `playback`, `numeric`, `smooth`, `oscillator`, `decay`, `morph`, `spring` (the last is the lib-spring lane). These are clock-driven, allocation-minimal, value.js-free.
- **Orchestration helpers:** `stagger`, `flip`, `drag`, `drag-2d`, `timeline`.
- **HEAVY SVG factories:** `motion-path`, `draw-svg`, `morph-svg` — misclassified as "light" in the lane assignment.

A `src/animation/light/` sub-module directory would give the physics/orchestration group a genuine home. The precept says "real DIRECTORY sub-modules, NOT flat hyphenated sibling files." The current layout has neither a directory nor hyphenated siblings *for this group* (the hyphenated names belong to the spring and engine groups). There is no false decomposition here — but there is also no directory home. The group is coherent enough that promoting it warrants a single `src/animation/light/` barrel, not any further splitting.

---

## 3. Findings

### F-1 · `motion-path.ts`, `draw-svg.ts`, `morph-svg.ts` are HEAVY, not LIGHT — MEDIUM (brittleness / api-surface)

**File references:**
- `motion-path.ts:37` — `import { CSSKeyframesAnimation } from "./engine";`
- `draw-svg.ts:38` — `import { CSSKeyframesAnimation } from "./engine";`
- `morph-svg.ts:45–46` — `import { PathGeometry } from "@mkbabb/value.js"; import { CSSKeyframesAnimation } from "./engine";`
- `index.ts:139–150` — only their TYPES are barrel-exported (erased); runtime values are behind `loadAnimationEngine`.

These three files are placed in a lane labelled "light orchestration tier" but carry static engine/value.js edges. The audit lane is thus misleading: the "lib-light" auditable group is really 11 files, and the SVG 3 belong in a `lib-svg` or `lib-heavy-svg` lane. **No code change is required for the current build** — the boundary is correctly enforced via the barrel. The issue is conceptual: the lane boundary for future audit passes should exclude `motion-path`, `draw-svg`, `morph-svg` from the light group.

**Proposal:** Future lane assignments should split these into their own `lib-svg-factories` lane. No refactor needed now; document the correct grouping so the next audit driver does not re-audit them as "light."

---

### F-2 · Three-way DRY violation: `play/pause/stop` wrapper classes are byte-identical — LOW (dry)

**Files:**
- `motion-path.ts:176–191` — `MotionPath.play/pause/stop` delegate one-to-one to `this.animation`.
- `draw-svg.ts:195–214` — `DrawSVG.play/pause/stop/finished` delegate one-to-one to `this.animation`.
- `morph-svg.ts:431–451` — `MorphSVG.play/pause/stop/finished` delegate one-to-one to `this.animation`.

All three class wrappers are structurally identical: each holds a `readonly animation: CSSKeyframesAnimation<V>` field and wraps `play()`/`pause()`/`stop()` (and optionally `finished`) as pass-through delegates with no added logic. The only differentiator is the constructor.

```ts
// motion-path.ts:176-189
export class MotionPath<V extends Record<string, any> = any> {
    readonly animation: CSSKeyframesAnimation<V>;
    constructor(...) { this.animation = fromMotionPath(...); }
    play(): Promise<void> { return this.animation.play(); }
    pause(): this { this.animation.pause(); return this; }
    stop(): this { this.animation.stop(); return this; }
}
// draw-svg.ts and morph-svg.ts: structurally identical
```

**Proposal:** Extract a `AnimationHandle<V>` base class or a shared mixin with `play/pause/stop/finished` delegating to `this.animation`, and have all three wrapper classes extend it (or use composition with a type alias `type AnimationHandle<V> = Pick<CSSKeyframesAnimation<V>, "play"|"pause"|"stop"|"finished">`). Since the wrappers add nothing beyond the factory call, consider whether the class wrappers are needed at all — the `from*` factory functions are the canonical entry and already return the control handle directly. If the class form exists only for `new`-style ergonomics, a single `AnimationHandle<V>` thin class with a constructor accepting a factory result eliminates all three.

---

### F-3 · `autoPlay` boilerplate triplicated across SVG factories — LOW (dry)

**Files:**
- `motion-path.ts:148–153` — `if (autoPlay) { void animation.play(); }`
- `draw-svg.ts:169–174` — same pattern verbatim
- `morph-svg.ts:381–388` — same pattern verbatim

Each `from*` factory ends with:

```ts
if (autoPlay) {
    // Fire the play loop; the handle carries the play promise via its own
    // re-entrant `play()`. We do NOT await — the handle IS the control
    // surface (the `animate()` contract).
    void animation.play();
}
return animation;
```

This is the same comment and code verbatim in three files. The comment is load-bearing (it explains the `void` and the control-surface contract), but it should live once.

**Proposal:** Extract a shared `maybeAutoPlay(animation: CSSKeyframesAnimation, autoPlay: boolean): CSSKeyframesAnimation` helper in a shared `src/animation/svg-factory-util.ts` (or fold it into the `AnimationHandle` base class constructor). Three call sites become one-liners.

---

### F-4 · `draw-svg.ts:167` casts `SVGDrawTarget` to `HTMLElement` via double erasure — MEDIUM (brittleness)

**Location:** `draw-svg.ts:167`

```ts
animation.setTargets(target as unknown as HTMLElement);
```

`setTargets` is typed `(...targets: HTMLElement[])` in `engine.ts:1008`. An SVG geometry element (`SVGGeometryElement`, typed as `SVGElement & { getTotalLength(): number }`) is NOT an `HTMLElement` — SVG elements derive from `SVGElement`, not `HTMLElement`. The cast is structurally unsound; it works at runtime because `setTargets` only uses the element as a DOM handle (reading `.style` / `getComputedStyle`) and those APIs are available on `SVGElement` too, but the cast hides a type mismatch.

**Proposal:** Widen `setTargets` in `engine.ts` to accept `Element` (or at least `HTMLElement | SVGElement`). The cost is a small type widening in the engine; the benefit is removing the `as unknown as HTMLElement` escape hatch. Alternatively, introduce an `SVGDrawable` overload on `setTargets`.

---

### F-5 · `drag.ts:273,395` uses optional chaining on `setPointerCapture`/`releasePointerCapture` — LOW (workaround)

**Location:** `drag.ts:273`, `drag.ts:395`

```ts
el.setPointerCapture?.(e.pointerId);       // line 273
el.releasePointerCapture?.(this.capturedPointerId);  // line 395
```

Pointer Capture (`setPointerCapture`/`releasePointerCapture`) is Baseline Available since 2020 and present in every supported browser. The optional chaining `?.` silently no-ops on environments where Pointer Capture is absent — but without capture, `pointermove` and `pointerup` outside the element are dropped silently and the drag breaks. The graceful degradation is invisible to the consumer and produces a subtly broken drag, not an explicit error.

The precept says: "NO fallback/fall-through behavior. Every instance must be EXCISED entirely OR made to fail EXPLICITLY."

**Proposal:** Replace optional chaining with a hard call:

```ts
el.setPointerCapture(e.pointerId);
el.releasePointerCapture(this.capturedPointerId!);
```

If `setPointerCapture` is absent (non-browser environment), `attach()` itself should gate: either a runtime check that throws `new Error("Draggable requires a DOM environment with Pointer Capture (setPointerCapture)")`, or a guard in `attach()` before binding any listener:

```ts
if (typeof element.setPointerCapture !== 'function') {
    throw new Error('Draggable.attach(): element.setPointerCapture is not available.');
}
```

This converts a silent degraded-drag into an explicit fail at attach time, which the precept requires.

---

### F-6 · `morph.ts:49` uses definite-assignment assertion `animation!` — LOW (brittleness)

**Location:** `morph.ts:49`

```ts
private animation!: NumericAnimation<MorphValues>;
```

The `!` asserts to TypeScript that the field is always initialized. In practice it IS always initialized — the constructor calls `this.measure(from, to)` which sets `this.animation`. But the `!` is a type-system escape that bypasses the compiler's flow-analysis guarantee. If `measure` were ever overridden or if the constructor call order changed, the `!` would silently allow reads of an unset field.

**Proposal:** Initialize inline or assign synchronously in the constructor without the `!`:

```ts
private animation: NumericAnimation<MorphValues>;
constructor(...) {
    ...
    this.animation = this.buildAnimation(from, to);
}
private buildAnimation(from: ..., to: ...): NumericAnimation<MorphValues> {
    // what measure() currently does, extracted as a pure builder
}
measure(from: ..., to: ...): this {
    this.animation = this.buildAnimation(from, to);
    return this;
}
```

This removes the `!` without restructuring the API, letting the compiler verify the field is set before use.

---

### F-7 · `decay.ts:17` documents an open VJ-1 "ships keyframes-local today and collapses" handoff — LOW (legacy / workaround)

**Location:** `decay.ts:16–18`

```ts
// A richer canonical closed form is the
// value.js hand-off VJ-1; `decay` ships keyframes-local today and collapses
// to a thin caller once value.js publishes the canonical surface.
```

This comment, present since at least Tranche I, marks `decay.ts` as a temporary local copy pending a value.js VJ-1 dispatch. The Constellation Campaign (shipped 2026-06-19) published value.js 1.0.0 → 1.2.0, and Tranche Q (shipped 2026-06-24) did the kf 5.0.0 re-pin. The VJ-1 decay surface did not land in value.js 1.x (it was never dispatched). The comment is now stale-forward-looking: either the dispatch should be filed and the comment updated to reference the open ticket, or the comment should be dropped to reflect that `decay.ts` is the final home.

The actual code is correct and self-contained. The workaround framing in the comment ("ships keyframes-local today and collapses to a thin caller") creates a false expectation of future deletion.

**Proposal:** Either (a) file the value.js dispatch and link it by issue number, or (b) drop the VJ-1 forward-reference and own `decay.ts` as the permanent canonical implementation. The math is ~25 lines, pure, correct, and domain-appropriate to keyframes.js. A value.js dispatch adds no user value here.

---

### F-8 · `timeline.ts:228` describes the JS `Timeline` as the "proven fallback" in `createNativeTimeline` — LOW (framing)

**Location:** `timeline.ts:228`

```ts
// Returns `null` where the platform lacks the API
// (Firefox today, SSR, jsdom) — the caller then keeps the JS {@link Timeline}
// sampler, which is the proven fallback AND the only general driver over
// non-DOM targets.
```

The phrase "proven fallback" is technically correct (the JS timeline IS the fallback to the native Houdini ScrollTimeline/ViewTimeline) but uses the word "fallback" the precept flags. This is a legitimate use of the word — it documents a progressive-enhancement pattern, not a deprecated code path. The native timeline is the fast lane; the JS timeline is the general path. The precept's "NO fallback/fall-through behavior" targets silent graceful degradation in logic, not documented progressive-enhancement commentary.

**Verdict:** No action required. The comment is correct. This is a note, not a finding.

---

### F-9 · `timeline.ts` mixes three distinct concerns in one 272-line file — LOW (decomposition)

**Location:** `timeline.ts`

The file contains:

1. **Abstract base:** `Timeline` (lines 35–151) — the abstract progress pipeline with smoothing + boundary snap.
2. **Concrete scroll sampler:** `KeyframesScrollTimeline` (lines 175–192) — reads `window.scrollY`.
3. **Concrete manual sampler:** `ManualTimeline` (lines 194–209) — accepts an externally-set value.
4. **Native platform bridge factory:** `createNativeTimeline` (lines 240–272) — feature-detects and constructs native `ScrollTimeline`/`ViewTimeline`.

Concerns 1–3 are cohesive (the JS progress pipeline family). Concern 4 (`createNativeTimeline`) is a DOM feature-detect helper that is also imported by `waapi.ts:3` for the WAAPI scroll-driven fast lane — a different consumer than the JS pipeline. The file is 272 lines and under the 500-line threshold; the mixing is a design smell, not a violation.

**Proposal:** If a `timeline/` sub-directory is created (as would happen under a `src/animation/light/` restructure), `createNativeTimeline` belongs in `timeline/native.ts` (or `timeline/bridge.ts`), not in `timeline/index.ts`. The separation makes it clear that native scroll-driven is an additive fast lane, not part of the base JS sampler abstraction.

---

### F-10 · `drag.ts:455–462` re-exports `drag2D` from a sibling file — LOW (api-surface / encapsulation)

**Location:** `drag.ts:455–462`

```ts
// The 2-D drag sugar (`drag2D` + its `Drag2DHandle` return type) lives in the
// co-located `./drag-2d` module — two one-axis `Draggable`s composed behind a
// single `(x, y, vx, vy)` surface. Split out as additive sugar so this file
// stays the 1-D engine (KISS). LIGHT: `drag-2d.ts` imports only `Draggable` +
// `DragOptions` from here, so it carries zero static `@mkbabb/value.js` edge.
// Re-exported THROUGH this barrel so `export { drag, Draggable, drag2D } from
// "./drag"` keeps resolving unchanged.
export { drag2D, type Drag2DHandle } from "./drag-2d";
```

`drag.ts` re-exports `drag2D` from `drag-2d.ts` to maintain backward-compat so consumers can `import { drag2D } from "./drag"`. This is a two-file flat sibling layout (exactly the pattern the precept prohibits: "NOT flat hyphenated sibling files"). The split is well-motivated (keep the 1-D engine minimal) but the re-export coupling between the two files creates a circular-feeling dependency: `drag-2d.ts` imports from `drag.ts`; `drag.ts` re-exports from `drag-2d.ts`.

**Proposal:** Consolidate into a `drag/` directory:

```
src/animation/drag/
  index.ts        — re-exports draggable + drag + drag2D + Drag2DHandle
  draggable.ts    — Draggable class (the 1-D engine)
  drag-2d.ts      — drag2D function + Drag2DHandle
```

`draggable.ts` imports nothing from `drag-2d.ts`; `drag-2d.ts` imports only `Draggable` from `draggable.ts`. The re-export coupling disappears. The barrel `drag/index.ts` presents the same public surface.

---

### F-11 · `morph-svg.ts:418–429` `MorphSVG.sampleD` allocates `new Array(samples + 1)` per call — LOW (effusive-dynamism)

**Location:** `morph-svg.ts:418–422`

```ts
sampleD(t: number): string {
    const clamped = t < 0 ? 0 : t > 1 ? 1 : t;
    const ms = clamped * this.animation.options.duration;
    const out = this.animation.interpFrames(ms, false);
    const pts: MorphPoint[] = new Array(this.samples + 1);
    for (let i = 0; i <= this.samples; i++) { ... }
    return pointsToD(pts);
}
```

The file itself notes the issue at `morph-svg.ts:195`: "contrast `MorphSVG.sampleD`'s per-call allocation, fine for a one-off manual pull, NOT a 60Hz render." The code comment acknowledges this is NOT for 60Hz use. The render-path uses `makeMorphRenderer`'s hoisted scratch buffer.

**Proposal:** Add a scratch `MorphPoint[]` array as an instance field on `MorphSVG`, initialized lazily on first `sampleD` call. The comment should be updated to say "allocation-free when the scratch is pre-warmed" rather than accepting it as a per-call cost. This is LOW priority since the comment already gates it to non-hot-path use.

---

### F-12 · `oscillator.ts` `tick(dt)` uses SECONDS while `Tickable.tickDt(dt)` expects MILLISECONDS — MEDIUM (brittleness / api-surface)

**Location:** `oscillator.ts:15–16`, `playback.ts:31–32`

`Tickable.tickDt(dt)` is documented as `dt` in **milliseconds** (`playback.ts:31`: "Advance the stepper by `dt` milliseconds"). `SmoothProgress.tickDt` and `SpringProgress.tickDt` both use milliseconds. The `RAFPlayback.drive` loop feeds milliseconds to `tickDt`.

`Oscillator.tick(dt)` uses **seconds** (`oscillator.ts:15–16`: "with `dt` in SECONDS from the caller's `RAFPlayback` loop"). `Oscillator` deliberately does NOT implement `Tickable` (confirmed: no `implements Tickable` declaration). The module comment acknowledges the design: "a pure stepper, the consumer owns the clock."

The clock unit mismatch (ms vs seconds) is a genuine API surface danger: a consumer who wires `RAFPlayback.drive(osc, ...)` would get dt in ms, and a frequency of `1` would mean one cycle per 1000 seconds (1 mHz), not 1 Hz. There is no compile-time guard because `Oscillator` does not implement `Tickable`.

Two schools:
- Keep `Oscillator` in seconds (physics convention; a `frequency` of `1` is 1 Hz naturally).
- Align to the rest of the engine (ms convention; `RAFPlayback` feeds ms).

**Proposal:** Document the mismatch explicitly with a warning in `OscillatorConfig.frequency`'s JSDoc: "Note: `dt` is in **seconds**, unlike `SmoothProgress.tickDt`/`SpringProgress.tickDt` which use milliseconds. Do not pass a `RAFPlayback` ms delta directly — divide by 1000." Alternatively add a `tickMs(dtMs: number)` alias that divides by 1000 internally, making the `RAFPlayback` wiring ergonomic. The seconds choice is defensible (signal-processing convention) but the mismatch with every sibling stepper is a trap for consumers bridging the two.

---

## 4. Sub-module grouping proposal

If a `src/animation/light/` directory is adopted (the `decomposition` finding):

```
src/animation/light/
  index.ts           — barrel; re-exports all public symbols
  playback.ts        — RAFPlayback + Tickable (the rAF core)
  numeric.ts         — NumericAnimation
  smooth.ts          — SmoothProgress
  oscillator.ts      — Oscillator + waveformValue
  decay.ts           — decay + decayRest
  morph.ts           — ElementMorph
  timeline/
    index.ts         — Timeline + KeyframesScrollTimeline + ManualTimeline
    native.ts        — createNativeTimeline + NativeTimelineSpec
  drag/
    index.ts         — re-exports
    draggable.ts     — Draggable (1-D engine)
    drag-2d.ts       — drag2D + Drag2DHandle
  stagger.ts         — stagger + StaggerFn
  flip.ts            — flip + flipShared
```

`motion-path.ts`, `draw-svg.ts`, `morph-svg.ts` belong in `src/animation/svg/` or stay in `src/animation/` beside the rest of the HEAVY modules (engine, compile, ingest, scroll-scene) — they are not part of the light tier.

---

## 5. Summary table

| # | Severity | Category | File(s) | Summary |
|---|---|---|---|---|
| F-1 | medium | brittleness | motion-path.ts, draw-svg.ts, morph-svg.ts | Misclassified as light; all three are HEAVY (static engine import) |
| F-2 | low | dry | motion-path.ts, draw-svg.ts, morph-svg.ts | `play/pause/stop` wrapper classes byte-identical across all three |
| F-3 | low | dry | motion-path.ts, draw-svg.ts, morph-svg.ts | `autoPlay` guard triplicated verbatim |
| F-4 | medium | brittleness | draw-svg.ts:167 | `SVGDrawTarget as unknown as HTMLElement` — type escape for a structurally unsound cast |
| F-5 | low | workaround | drag.ts:273,395 | `setPointerCapture?.` / `releasePointerCapture?.` — silent optional chaining on a Baseline-Available API |
| F-6 | low | brittleness | morph.ts:49 | `animation!` definite-assignment assertion bypasses compiler guarantee |
| F-7 | low | legacy | decay.ts:16–18 | Stale "collapses to value.js VJ-1" comment; handoff was never dispatched |
| F-8 | — | — | timeline.ts:228 | "proven fallback" is correct progressive-enhancement language; no action |
| F-9 | low | decomposition | timeline.ts | `createNativeTimeline` mixed into JS sampler file; belongs in `timeline/native.ts` if directory adopted |
| F-10 | low | decomposition | drag.ts:455–462, drag-2d.ts | Flat sibling re-export coupling; use `drag/` directory |
| F-11 | low | effusive-dynamism | morph-svg.ts:422 | `sampleD` allocates per call; instance-level scratch would eliminate it |
| F-12 | medium | api-surface | oscillator.ts, playback.ts | `Oscillator.tick` uses SECONDS; all sibling steppers use ms; undocumented trap |
