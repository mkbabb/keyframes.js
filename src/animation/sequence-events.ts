/**
 * Sequence TRANSPORT EVENTS — the segment-lifecycle + named-label crossing
 * channel that {@link Sequence.on} (`sequence.ts`) exposes.
 *
 * One cohesive concern lifted off the `Sequence` god-object (L.WZ decomposition,
 * the `engine-composition.ts`/`engine-options.ts`/`engine-css-metadata.ts`
 * precedent): the typed `SequenceEvent` union + its subscriber shapes, the
 * `SequenceEntry` segment record the detector reads, and the crossing DETECTOR
 * itself — the per-event subscriber registry plus the `from`-phase → `to`-phase
 * straddle math that fires the enter/leave/label callbacks. It lives here as the
 * {@link SequenceEventBus}: `Sequence` constructs ONE bus, forwards its
 * overloaded `.on(...)` to {@link SequenceEventBus.subscribe}, and threads every
 * paint through {@link SequenceEventBus.fire}. The three event fields
 * (`subscribers`, `_activeSegments`, `_prevPhase`) live on the bus, not the
 * class. ZERO behavior change — `fire` does exactly what the inlined
 * `Sequence._fireCrossings` body did.
 *
 * INTERNAL colocated module beside `sequence.ts`; the moved TYPES are re-exported
 * THROUGH `sequence.ts` so the barrel's `export type { SequenceEvent, … } from
 * "./sequence"` keeps resolving (the published surface is unchanged).
 *
 * ── BOUNDARY: LIGHT (value.js-free).
 * This module imports ONLY types (`./engine`'s `Animation`, `./constants`'s
 * `Vars`) that erase under `verbatimModuleSyntax`. It carries NO static
 * `@mkbabb/value.js` edge — `proof:boundary` stays green.
 */

import type { Animation } from "./engine";
import type { Vars } from "./constants";

/**
 * A resolved sequence segment: a child animation anchored at an absolute ms
 * offset. The shape {@link SequenceEventBus.fire} reads to test segment
 * membership.
 */
export interface SequenceEntry<V extends Vars> {
    animation: Animation<V>;
    /** Absolute offset (ms) of this segment's local t=0 on the master clock. */
    at: number;
}

/**
 * The transport-crossing events a `Sequence` fires via {@link Sequence.on} —
 * the segment-lifecycle pair plus the named-label crossing.
 *
 * - `"segment:enter"` — the playhead crossed INTO a segment's
 *   `[at, at + duration)` span (forward across `at`, or backward across the
 *   span's end).
 * - `"segment:leave"` — the complementary crossing OUT of that span.
 * - `"label"` — the playhead straddled a position registered via
 *   {@link Sequence.label}, in EITHER direction.
 *
 * Mirror of `ScrollSceneEvent` (`scroll-scene.ts:190`) — a typed, per-event
 * subscribe channel.
 */
export type SequenceEvent = "segment:enter" | "segment:leave" | "label";

/**
 * A `segment:enter` / `segment:leave` subscriber. Receives the crossing
 * segment's own `animation` reference and the master-clock position (ms) at the
 * crossing. The clock lets the consumer infer direction (a backward crossing
 * arrives with a smaller `masterClock` than the prior call).
 */
export type SequenceSegmentSubscriber = (
    animation: Animation<any>,
    masterClock: number,
) => void;

/**
 * A `label` subscriber. Receives the crossed label's `name` and the
 * master-clock position (ms) at the crossing.
 */
export type SequenceLabelSubscriber = (
    name: string,
    masterClock: number,
) => void;

/** The union over the two subscriber shapes (the {@link Sequence.on} fallthrough). */
export type SequenceSubscriber =
    | SequenceSegmentSubscriber
    | SequenceLabelSubscriber;

/**
 * The Sequence transport-events BUS — the per-event subscriber registry + the
 * crossing DETECTOR, owned beside `Sequence` (`sequence.ts`). `Sequence`
 * constructs ONE bus and forwards `.on(...)` to {@link subscribe} and every
 * paint to {@link fire}; the three event fields (`subscribers`,
 * `_activeSegments`, `_prevPhase`) live here, not on the class.
 */
export class SequenceEventBus<V extends Vars> {
    /**
     * The per-event subscriber sets — the {@link subscribe} channel (three Sets
     * keyed by {@link SequenceEvent}). Empty by construction; {@link fire}
     * early-exits while all three stay empty (zero overhead for the common
     * no-subscriber transport). Mirror of `ScrollScene.subscribers`
     * (`scroll-scene.ts:360-366`).
     */
    private readonly subscribers = new Map<
        SequenceEvent,
        Set<SequenceSubscriber>
    >([
        ["segment:enter", new Set()],
        ["segment:leave", new Set()],
        ["label", new Set()],
    ]);

    /**
     * The `segment:enter`/`segment:leave` edge memory: the segments whose
     * `[at, at + duration)` span held the PREVIOUS painted phase. A segment in
     * the current active set but not here ENTERED; one here but not in the
     * current set LEFT. Maintained only while a segment subscriber is registered
     * (the detector early-exits otherwise).
     */
    private readonly _activeSegments = new Set<SequenceEntry<V>>();

    /**
     * The previous painted phase (ms) — the `from` end of every crossing
     * straddle (`label`, and the directional `segment` edges). `undefined`
     * before the first paint; updated on EVERY {@link fire} so a subscriber
     * registered mid-transport straddles from the true prior playhead (not a
     * stale or zeroed origin).
     */
    private _prevPhase: number | undefined = undefined;

    /**
     * Register a subscriber for `event`; returns an unsubscribe handle — the
     * `ScrollScene.on` idiom (`scroll-scene.ts:506-514`). The class's overloaded
     * `on(...)` forwards here.
     */
    subscribe(event: SequenceEvent, cb: SequenceSubscriber): () => void {
        const set = this.subscribers.get(event)!;
        set.add(cb);
        return () => set.delete(cb);
    }

    /**
     * Detect and fire segment-lifecycle + label crossings between the previous
     * painted phase (`_prevPhase`) and `phase` — the ONE detector both `seek`
     * (scrub) and `_frame` (the rAF play loop) drive, so play fires the identical
     * crossings a scrub would. Mirror of `ScrollScene.fire` (`scroll-scene.ts:513`).
     *
     * `_prevPhase` is updated on EVERY call (even the early-exit) so a subscriber
     * registered mid-transport straddles from the true prior playhead. The firing
     * loops run ONLY while at least one subscriber set is non-empty — the
     * zero-overhead path for the common no-subscriber transport.
     */
    fire(
        entries: readonly SequenceEntry<V>[],
        labels: ReadonlyMap<string, number>,
        phase: number,
    ): void {
        const enterSet = this.subscribers.get("segment:enter")!;
        const leaveSet = this.subscribers.get("segment:leave")!;
        const labelSet = this.subscribers.get("label")!;

        // Early-exit when ALL three sets are empty — no segment/label iteration
        // for the common no-subscriber transport. `_prevPhase` still advances
        // below so a later subscriber straddles from the true prior playhead.
        if (enterSet.size === 0 && leaveSet.size === 0 && labelSet.size === 0) {
            this._prevPhase = phase;
            return;
        }

        const prev = this._prevPhase;

        // ── Segment lifecycle ────────────────────────────────────────────────
        // A segment is active when `at ≤ phase < at + duration`. Comparing the
        // current active membership against `_activeSegments` (the previous
        // membership) yields the enter/leave edges — independent of direction,
        // so reverse and yoyo sweeps fire the complementary crossing naturally.
        if (enterSet.size > 0 || leaveSet.size > 0) {
            for (const entry of entries) {
                const isActive =
                    phase >= entry.at &&
                    phase < entry.at + entry.animation.options.duration;
                const wasActive = this._activeSegments.has(entry);
                if (isActive && !wasActive) {
                    this._activeSegments.add(entry);
                    for (const cb of enterSet) {
                        (cb as SequenceSegmentSubscriber)(
                            entry.animation,
                            phase,
                        );
                    }
                } else if (!isActive && wasActive) {
                    this._activeSegments.delete(entry);
                    for (const cb of leaveSet) {
                        (cb as SequenceSegmentSubscriber)(
                            entry.animation,
                            phase,
                        );
                    }
                }
            }
        }

        // ── Label crossing ───────────────────────────────────────────────────
        // A label fires when its position was STRADDLED between the previous and
        // current phase, in either direction: `min(prev, phase) < pos ≤
        // max(prev, phase)`. Skipped on the first paint (no prior phase to
        // straddle from).
        if (labelSet.size > 0 && prev !== undefined && prev !== phase) {
            const lo = Math.min(prev, phase);
            const hi = Math.max(prev, phase);
            for (const [name, pos] of labels) {
                if (pos > lo && pos <= hi) {
                    for (const cb of labelSet) {
                        (cb as SequenceLabelSubscriber)(name, phase);
                    }
                }
            }
        }

        this._prevPhase = phase;
    }
}
