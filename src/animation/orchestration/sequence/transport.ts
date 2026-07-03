/**
 * orchestration/sequence/transport.ts — the pure master-clock transport math
 * (carved off `sequence.ts` in R.W2b).
 *
 * `Sequence` owns the lifecycle (the rAF loop, the `_playingPromise` completion
 * front-door, the segment/label crossing fires) — all stateful + gate-pinned to
 * `sequence.ts`. The TRANSPORT MATH that the lifecycle drives is pure: the
 * `repeat`/`yoyo` phase fold, the terminal rest phase, the no-forward-jump origin
 * seed, the forward-monotone predicate, and the SSR reduced-motion probe. They
 * take their inputs explicitly and return scalars, so they live here, away from
 * the class's private state, and the lifecycle methods read as thin drivers.
 *
 * LIGHT (value.js-free) — plain arithmetic + a `matchMedia` probe.
 */
import { clamp } from "../../internal/leaves";
import type { SequenceEventBus, SequenceEntry } from "./events";
import type { Vars } from "../../constants/types";

/**
 * THE master-playhead → child-clock map, applied as a pure synchronous scrub.
 * For every segment the local clock is `clamp(masterClock − at, 0, duration)`,
 * painted via `interpFrames(local, true)`. This is the ONE map both `seek` (the
 * public scrub) and the rAF play loop drive — so play is pixel-identical to seek
 * BY CONSTRUCTION, forward AND reverse (the C⁰-continuity the F.W9 parity gate
 * locks). It carries no `onEnd`/`startTime` machinery, so re-entering a finished
 * segment under a negative rate paints the same final-frame value `seek` would.
 */
export function applySequenceAt<V extends Vars>(
    entries: readonly SequenceEntry<V>[],
    masterClock: number,
): void {
    for (const { animation, at } of entries) {
        const local = clamp(masterClock - at, 0, animation.options.duration);
        animation.interpFrames(local, true);
    }
}

/**
 * Detect + fire segment-lifecycle + label crossings between the previous painted
 * phase and `phase` — the ONE detector both `seek` (scrub) and the rAF play loop
 * drive, so play fires the identical crossings a scrub would. The detector + the
 * per-event subscriber state live on the `_events` bus; this threads the segments
 * + labels the bus reads. The bus updates its own `_prevPhase` on EVERY call so a
 * subscriber registered mid-transport straddles from the true prior playhead.
 */
export function fireSequenceCrossings<V extends Vars>(
    events: SequenceEventBus<V>,
    entries: readonly SequenceEntry<V>[],
    labels: ReadonlyMap<string, number>,
    phase: number,
): void {
    events.fire(entries, labels, phase);
}

/**
 * A position on the master clock for a sequence entry.
 *
 * - `number` — an absolute offset in milliseconds from the sequence origin.
 * - `` `+=${n}` `` / `` `-=${n}` `` — relative to the running insertion cursor
 *   (the end of the previously-inserted segment): `"+=200"` starts 200ms after
 *   the cursor, `"-=200"` overlaps the previous segment by 200ms.
 * - any other string — a label registered via `Sequence.label`.
 */
export type SequencePosition = number | `+=${number}` | `-=${number}` | string;

/**
 * Resolve a {@link SequencePosition} to an absolute ms offset.
 *
 * - omitted → the running `cursor` (auto-append after the previous segment).
 * - `number` → itself.
 * - `"+=n"` / `"-=n"` → cursor ± n.
 * - any other string → the registered `labels` entry (throws if unknown —
 *   labels are an explicit contract, a typo is a bug, not a silent 0).
 */
export function resolveSequencePosition(
    at: SequencePosition | undefined,
    cursor: number,
    labels: ReadonlyMap<string, number>,
): number {
    if (at === undefined) return cursor;
    if (typeof at === "number") return at;

    const relMatch = /^([+-])=(\d*\.?\d+)$/.exec(at);
    if (relMatch) {
        const sign = relMatch[1] === "+" ? 1 : -1;
        return cursor + sign * Number.parseFloat(relMatch[2]!);
    }

    const labelled = labels.get(at);
    if (labelled === undefined) {
        throw new Error(
            `Sequence: unknown position "${at}". Register it with .label("${at}", at) first, or pass a number / "+=n" / "-=n".`,
        );
    }
    return labelled;
}

/**
 * Fold a raw, repeat-extended master clock down to an effective phase in
 * `[0, duration]` per the `repeat`/`yoyo` transport. With `repeatCount = 1` +
 * `yoyoOn = false` (the defaults) this is the identity on `[0, duration]` (the
 * single-play). For `repeat`, the phase is `raw mod duration`; for `yoyo`, odd
 * cycles reflect (`duration − phase`) so the playhead ping-pongs. The terminal
 * clock of the LAST cycle resolves to the rest phase (`duration` forward, `0`
 * reflected) rather than wrapping to `0` — so a settled run lands on its end frame.
 */
export function foldPhase(
    raw: number,
    duration: number,
    repeatCount: number,
    yoyoOn: boolean,
): number {
    if (duration <= 0) return 0;

    const clamped = clamp(raw, 0, duration * repeatCount);
    let cycle = Math.floor(clamped / duration);
    let phase = clamped - cycle * duration;
    // The exact cycle boundary (and the terminal clock) belongs to the END of
    // the cycle it closes, not the start of the next — so a finished forward
    // cycle rests at `duration`, a finished reflected cycle at `0`.
    if (phase === 0 && cycle > 0) {
        cycle -= 1;
        phase = duration;
    }
    return yoyoOn && cycle % 2 === 1 ? duration - phase : phase;
}

/**
 * The terminal rest phase of a `repeat`/`yoyo` run — where the playhead lands
 * when the final cycle closes. A forward run rests at `duration`; an odd-cycle
 * yoyo run that closes reflected rests at `0`. Mirrors the boundary `foldPhase`
 * resolves at the terminal clock.
 */
export function restPhase(
    duration: number,
    repeatCount: number,
    yoyoOn: boolean,
): number {
    const lastCycleReflected = yoyoOn && (repeatCount - 1) % 2 === 1;
    return lastCycleReflected ? 0 : duration;
}

/**
 * True for the byte-stable default transport — forward real-time, single cycle,
 * no yoyo. The event-dispatch path runs ONLY here, so an existing caller's
 * `play()` fires the same `animationstart`/`animationend` it always did; any
 * transport modifier opts into the scrub-paint authority.
 */
export function isForwardMonotone(
    rate: number,
    repeatCount: number,
    yoyoOn: boolean,
): boolean {
    return rate === 1 && repeatCount === 1 && !yoyoOn;
}

/**
 * Seed the play-loop origin so the master clock is CONTINUOUS — the FIRST/resumed
 * frame's master clock equals the retained `time`. Solving `(clock − origin) *
 * rate = time` for the origin: `origin = clock − time / rate`. A zero rate
 * freezes the playhead, so the origin collapses to the bare clock.
 */
export function seedOrigin(clock: number, time: number, rate: number): number {
    return rate === 0 ? clock : clock - time / rate;
}

/**
 * SSR-safe `prefers-reduced-motion: reduce` probe. Mirrors the engine's off-DOM
 * posture (no `matchMedia` → false).
 */
export function prefersReducedMotion(): boolean {
    return (
        typeof matchMedia === "function" &&
        matchMedia("(prefers-reduced-motion: reduce)").matches
    );
}

/**
 * The play-machine view the rAF-loop driver reads + writes. `Sequence` IS this
 * shape (its fields), so the loop body lives here without copying state — the
 * class's `_frame`/`_settle` are thin delegates that pass `this`. Keeping the
 * fields on `Sequence` preserves the seek↔play parity test's direct reaches
 * (`seq._time` / `seq._rate` / `seq._frame(...)`); only the loop BODY moved.
 */
export interface SequencePlayContext<V extends Vars> {
    readonly entries: SequenceEntry<V>[];
    readonly labels: ReadonlyMap<string, number>;
    readonly events: SequenceEventBus<V>;
    readonly duration: number;
    _time: number;
    _rate: number;
    _repeatCount: number;
    _yoyoOn: boolean;
    _paused: boolean;
    _playOrigin: number | undefined;
    _lastClock: number | undefined;
    _resolvePlay: (() => void) | null;
}

/**
 * THE rAF play-loop step — the raw wall clock → folded master phase → paint, with
 * the forward-monotone event-dispatch window and the terminal settle. The ONE
 * map both `seek` (the public scrub) and this loop drive, so play is pixel-
 * identical to seek BY CONSTRUCTION (the C⁰-continuity the F.W9 parity gate
 * locks). Returns `false` (and settles) on the directional/cycle bound, else
 * `true`. Mutates the context's playhead state in place.
 */
export async function driveSequenceFrame<V extends Vars>(
    ctx: SequencePlayContext<V>,
    clock: number,
): Promise<boolean> {
    // Seed the origin so the FIRST frame's master clock equals the RETAINED
    // `_time` (0 on a fresh play; the paused playhead on resume — no jump).
    if (ctx._playOrigin === undefined) {
        ctx._playOrigin = seedOrigin(clock, ctx._time, ctx._rate);
    }
    ctx._lastClock = clock;

    // Scalar-field arithmetic: the rate scales the wall-clock delta into a master
    // clock (negative walks it backward — `reverse`). The raw, unfolded master
    // clock is what `repeat`/`yoyo` extend over.
    const rawMaster = (clock - ctx._playOrigin) * ctx._rate;
    const total = ctx.duration * ctx._repeatCount;

    // Directional / cycle settle bound. Forward (`rate ≥ 0`) settles once the raw
    // master clock passes the repeat-extended span; reverse (`rate < 0`) once it
    // walks back to 0. `Infinity` repeat never satisfies the forward bound.
    const finished = ctx._rate >= 0 ? rawMaster >= total : rawMaster <= 0;

    // The painted master clock is the raw clock folded by repeat/yoyo, then
    // snapped to the terminal rest phase on the final frame so a settled run
    // lands EXACTLY on its end frame.
    const phase = finished
        ? ctx._rate >= 0
            ? restPhase(ctx.duration, ctx._repeatCount, ctx._yoyoOn)
            : 0
        : foldPhase(rawMaster, ctx.duration, ctx._repeatCount, ctx._yoyoOn);
    ctx._time = phase;

    // Event coherence for the FORWARD-MONOTONE single-play (rate 1, repeat 1,
    // yoyo off): each child seeded with `startTime = at`, so `advanceTo(phase)`
    // fires `animationstart`/`animationend` once through the published driver.
    // Skipped under any non-default transport (reverse / repeat / yoyo), where
    // events ride the children's own fill semantics, consistent with `seek`.
    if (isForwardMonotone(ctx._rate, ctx._repeatCount, ctx._yoyoOn)) {
        for (const { animation, at } of ctx.entries) {
            if (phase >= at && phase - at < animation.options.duration) {
                await animation.advanceTo(phase);
            }
        }
    }

    // Crossings fire BEFORE the paint (matching `seek`'s order); then the ONE map.
    fireSequenceCrossings(ctx.events, ctx.entries, ctx.labels, phase);
    applySequenceAt(ctx.entries, phase);

    if (finished) {
        settleSequence(ctx);
        const resolve = ctx._resolvePlay;
        ctx._resolvePlay = null;
        resolve?.();
        return false;
    }
    return true;
}

/**
 * Release every child back to standalone ownership and clear the per-play anchor
 * state. The configured `rate`/`repeat`/`yoyo` PERSIST across plays (the GSAP
 * transport idiom); only the per-play anchor state resets here.
 */
export function settleSequence<V extends Vars>(
    ctx: SequencePlayContext<V>,
): void {
    for (const { animation } of ctx.entries) {
        animation.managed = false;
        animation.started = false;
        animation.startTime = undefined;
    }
    ctx._playOrigin = undefined;
    ctx._lastClock = undefined;
    ctx._paused = false;
}

/**
 * Re-anchor `_playOrigin` against the loop's last rAF timestamp so the master
 * clock is CONTINUOUS across a transport edit (no forward jump). The invariant
 * restored: `(clock − _playOrigin) * rate === _time` at the edit instant. With
 * `rate = 0` the playhead is frozen, so the origin collapses to the bare
 * timestamp. No-op (clears the origin) before the first frame.
 */
export function reanchorSequence<V extends Vars>(
    ctx: SequencePlayContext<V>,
    isPlaying: boolean,
): void {
    if (!isPlaying) return;
    const last = ctx._lastClock;
    if (last === undefined) {
        // No frame has run yet — the first frame seeds the origin from `_time`.
        ctx._playOrigin = undefined;
        return;
    }
    ctx._playOrigin = seedOrigin(last, ctx._time, ctx._rate);
}
