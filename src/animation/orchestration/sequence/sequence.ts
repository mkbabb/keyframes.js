/**
 * Sequence — the master-playhead orchestrator (GSAP-`Timeline`-class position
 * sequencing for keyframes.js).
 *
 * ── BOOKED DESIGN DECISION (recorded BEFORE code, per E.W10 §S2 / gate clause 9)
 *
 * (a) NAME — `Sequence`, NOT `Timeline`.
 *     `Timeline` is already a shipped public class (`timeline.ts`: the abstract
 *     scroll/manual *progress driver*, with `ScrollTimeline` / `ManualTimeline`,
 *     exported from the barrel). Reusing that name would shadow a published
 *     export — forbidden by the no-legacy mandate. `Sequence` is the distinct
 *     name: a `Timeline` *drives one progress value from an external source*
 *     (scroll/manual); a `Sequence` *positions many child animations along one
 *     master clock*. Different jobs, different names.
 *
 * (b) SUBSUMPTION — `Sequence` sits BESIDE `AnimationGroup`; it does NOT
 *     replace it.
 *     `AnimationGroup` is the *spatial* compositor: many animations on ONE
 *     target, blended per-frame (`replace`/`add`/`weighted`) into a single
 *     transform — the at:0-parallel case where every child shares the clock AND
 *     the paint. `Sequence` is the *temporal* orchestrator: many animations,
 *     each positioned at its own offset along a master playhead, each painting
 *     its OWN targets. The group's value lives in its per-frame blend math; the
 *     sequence's lives in its clock map. Folding one into the other would force
 *     the blend compositor to grow a position-offset axis (or the position
 *     orchestrator to grow a per-frame blender) — anti-KISS, and it would move
 *     `AnimationGroup`'s pixels (anti-isomorphic). They compose instead: a
 *     `Sequence` entry's `animation` may itself be group-driven by the caller.
 *     The group stays untouched (isomorphism note, E.W10 §Isomorphism).
 *
 * ── MECHANISM
 *
 * A `Sequence` holds ordered `{ animation, at }` entries. `at` resolves to an
 * absolute offset on the master clock (ms): a `number`, a `label` string
 * registered via `.label()`, or a relative `"+=n"` / `"-=n"` token measured
 * from the running insertion cursor (the GSAP idiom). Auto-positioned entries
 * (`at` omitted) append after the previous segment ends — the default-sequential
 * behaviour every timeline leads with.
 *
 * The master playhead → child-clock map is the published absolute-clock driver:
 * `Animation.advanceTo(absoluteClock)` (`engine.ts`). Each child's `startTime`
 * is seeded to its resolved `at`, so `advanceTo(masterClock)` computes the
 * child's local clock as `masterClock − at` exactly — the position-insertion
 * mapping, expressed through the engine's own driver rather than a second clock
 * implementation. `seek(masterClock)` is the synchronous scrub form (clamp the
 * local clock to `[0, duration]`, `interpFrames` it, paint) used for scrubbing
 * and for the unit gate; `play()` rides `RAFPlayback` over the same map.
 *
 * ── BOUNDARY: LIGHT (value.js-free).
 * `sequence.ts` imports only `./playback` (the rAF driver) and the light
 * `./internal/leaves` clamp, plus types (`./engine`, `./constants`) that erase
 * under `verbatimModuleSyntax`. It carries NO static `@mkbabb/value.js` edge: it
 * drives `Animation` through its public `advanceTo` / `interpFrames` / `seek`
 * surface, never the CSS parser. The `Animation` value itself arrives from the
 * caller (who built it via the heavy engine), so the sequence never constructs
 * one. `proof:boundary` stays green.
 */

import { clamp } from "../../internal/leaves";
import { RAFPlayback } from "../../physics/playback";
// The pure master-clock transport math (the repeat/yoyo fold, the rest phase,
// the no-jump origin seed, the forward-monotone predicate, the SSR RM probe)
// lives in the colocated `./transport` module (R.W2b carve); the lifecycle
// methods here drive them.
import {
    prefersReducedMotion,
    resolveSequencePosition,
    driveSequenceFrame,
    settleSequence,
    reanchorSequence,
    applySequenceAt,
    fireSequenceCrossings,
} from "./transport";
import type { SequencePosition, SequencePlayContext } from "./transport";
// `SequencePosition` (the master-clock position token) + its resolver live in
// `./transport`; re-export the type so the sequence barrel surface is unchanged.
export type { SequencePosition } from "./transport";
import { SequenceEventBus } from "./events";
import type {
    SequenceEntry,
    SequenceEvent,
    SequenceSegmentSubscriber,
    SequenceLabelSubscriber,
    SequenceSubscriber,
} from "./events";
import type { KeyframesAnimation } from "../../engine";
import type { Vars } from "../../constants/types";

// The transport-events concern (the `SequenceEvent` union + subscriber shapes +
// the `SequenceEntry` segment record + the crossing detector) lives in the
// co-located `./events` module (L.WZ decomposition). Re-export the moved TYPES
// THROUGH this file so the sequence barrel's type re-exports keep resolving —
// the published surface is unchanged.
export type {
    SequenceEntry,
    SequenceEvent,
    SequenceSegmentSubscriber,
    SequenceLabelSubscriber,
    SequenceSubscriber,
} from "./events";

export interface SequenceOptions {
    /**
     * When true, `play()` honors `prefers-reduced-motion: reduce` by snapping
     * every child to its rest frame in a single paint (delegated to each
     * child's own reduced-motion contract via a terminal `seek`). Default
     * false. SSR-safe off-DOM.
     */
    respectReducedMotion?: boolean;
}

/**
 * The master-playhead orchestrator. Positions child animations along one clock
 * and drives them via `Animation.advanceTo`. See the module docstring for the
 * booked name + subsumption decision.
 */
export class Sequence<V extends Vars = any>
    implements SequencePlayContext<V>
{
    /** Resolved segments, in insertion order. */
    readonly entries: SequenceEntry<V>[] = [];

    /** Named positions on the master clock, registered via {@link label}. */
    readonly labels = new Map<string, number>();

    /**
     * The transport-events bus — the per-event subscriber registry + the
     * crossing detector (segment-lifecycle + label straddle). `on(...)` forwards
     * to `events.subscribe`; the transport's `fireSequenceCrossings` to
     * `events.fire`. See `./events` for the channel + detector body.
     */
    readonly events = new SequenceEventBus<V>();

    /**
     * The running insertion cursor (ms) — the end of the last-inserted
     * segment. Relative `"+="`/`"-="` positions and auto-append (`at` omitted)
     * measure from here, matching GSAP's append-by-default timeline.
     */
    private cursor = 0;

    /** Master clock (ms) of the current playhead. */
    _time = 0;

    private readonly respectReducedMotion: boolean;

    /** THE rAF owner for the sequence's play loop. */
    readonly playback = new RAFPlayback();

    private _boundFrame: (t: number) => Promise<boolean>;
    _resolvePlay: (() => void) | null = null;
    _playOrigin: number | undefined = undefined;
    private _playingPromise: Promise<void> | null = null;

    /**
     * The scalar playback rate — the single field that drives `timeScale`
     * and `reverse`. `_rate = 1` is real-time forward (the existing
     * single-play default); `n` is `timeScale(n)` (slow-mo `< 1` /
     * fast-forward `> 1`); a negative `_rate` walks the master clock
     * backward (`reverse`). It scales the master clock in {@link _frame}:
     * `masterClock = (clock − _playOrigin) * _rate`.
     */
    _rate = 1;

    /**
     * How many master-clock cycles `play()` runs before settling. `1` is the
     * existing single-play; `Infinity` never settles (the loop case);
     * `n` runs `n` cycles. The master clock folds modulo `duration`
     * (see {@link _fold}).
     */
    _repeatCount = 1;

    /**
     * When true, odd cycles reflect the folded phase (`duration − phase`) —
     * the GSAP `yoyo` ping-pong. Default off (every cycle runs forward).
     */
    _yoyoOn = false;

    /** Whether `pause()` has halted the loop with the playhead retained. */
    _paused = false;

    /**
     * The loop's last rAF timestamp — the re-anchor reference. The
     * `RAFPlayback`/`AnimationGroup` managed-pause records the loop's LAST rAF
     * timestamp (not `performance.now()`) so resume adjusts the origin against
     * the SAME clock the loop reads, with no forward jump. `Sequence` records
     * it here per frame (the driver does not expose it) for that one re-anchor.
     */
    _lastClock: number | undefined = undefined;

    constructor(options?: SequenceOptions) {
        this.respectReducedMotion = options?.respectReducedMotion ?? false;
        this._boundFrame = this._frame.bind(this);
    }

    /** The full span of the sequence (ms): the latest segment end. */
    get duration(): number {
        let end = 0;
        for (const entry of this.entries) {
            const segEnd = entry.at + entry.animation.options.duration;
            if (segEnd > end) end = segEnd;
        }
        return end;
    }

    /** The current master-clock position (ms). */
    get time(): number {
        return this._time;
    }

    /**
     * The normalized playhead position in `[0, 1]` — the GSAP
     * `Timeline.progress()` idiom. Pure division over the existing scrub:
     * the getter is `_time / duration`; the setter scrubs to `p * duration`
     * via {@link seek}.
     */
    get progress(): number {
        return this.duration === 0 ? 0 : this._time / this.duration;
    }

    set progress(p: number) {
        this.seek(clamp(p, 0, 1) * this.duration);
    }

    /** The scalar playback rate (`timeScale` / sign of `reverse`). */
    get rate(): number {
        return this._rate;
    }

    /** Register a named position on the master clock. Chainable. */
    label(name: string, at?: SequencePosition): this {
        this.labels.set(
            name,
            resolveSequencePosition(at, this.cursor, this.labels),
        );
        return this;
    }

    /**
     * Subscribe to a segment-lifecycle or label crossing. Returns an
     * unsubscribe handle — the `ScrollScene.on` idiom (`scroll-scene.ts:506-514`).
     *
     * - `"segment:enter"` fires when the playhead enters a segment's
     *   `[at, at + duration)` span (forward across `at`, or backward across the
     *   span end); the callback receives that segment's `animation` reference
     *   and the master-clock position at the crossing.
     * - `"segment:leave"` fires on the complementary crossing OUT of the span.
     * - `"label"` fires when the playhead straddles a registered label position
     *   in EITHER direction; the callback receives `(name, masterClock)`.
     *
     * Crossings fire on EVERY paint — `seek` (scrub) and the rAF play loop,
     * forward, reverse, and yoyo. The callback's `masterClock` lets the consumer
     * infer direction; there is no `once` idiom — unsubscribe in the callback
     * (via the returned handle) for one-shot behaviour.
     */
    on(
        event: "segment:enter" | "segment:leave",
        cb: SequenceSegmentSubscriber,
    ): () => void;
    on(event: "label", cb: SequenceLabelSubscriber): () => void;
    on(event: SequenceEvent, cb: SequenceSubscriber): () => void {
        return this.events.subscribe(event, cb);
    }

    /**
     * Append a child animation at `at` (absolute ms, a label, a `"+="`/`"-="`
     * relative token, or — omitted — the running cursor, i.e. after the
     * previous segment). Advances the insertion cursor to this segment's end.
     * Chainable.
     */
    add(animation: KeyframesAnimation<V>, at?: SequencePosition): this {
        const resolved = resolveSequencePosition(at, this.cursor, this.labels);
        this.entries.push({ animation, at: resolved });
        // Position-insertion: re-sort so seek/advance walk segments in clock
        // order regardless of insertion order (a later `at:0` is legal).
        this.entries.sort((a, b) => a.at - b.at);
        this.cursor = resolved + animation.options.duration;
        return this;
    }

    /**
     * Map the master playhead to each child's LOCAL clock and paint it. This is
     * the synchronous scrub form: for every segment, the local clock is
     * `clamp(masterClock − at, 0, duration)`, applied via `interpFrames(local,
     * true)`. Segments not yet reached rest at their initial frame; segments
     * past their end rest at their final frame — the timeline-scrub contract.
     * Chainable.
     */
    seek(masterClock: number): this {
        this._time = masterClock;
        // The scrub map + crossing detector are the ONE pair `_frame` (the rAF
        // play loop) also drives — so play is pixel-identical to seek (the
        // C⁰-continuity the F.W9 parity gate locks). Both live in `./transport`.
        fireSequenceCrossings(
            this.events,
            this.entries,
            this.labels,
            masterClock,
        );
        applySequenceAt(this.entries, masterClock);
        return this;
    }

    /**
     * Set targets on every child segment. Convenience for the common case
     * where one target receives the whole sequence; per-segment targets can be
     * set on each `animation` directly before `.add`. Chainable.
     */
    setTargets(...targets: HTMLElement[]): this {
        for (const { animation } of this.entries) {
            animation.setTargets(...targets);
        }
        return this;
    }

    /**
     * Drive the sequence over real time via `RAFPlayback`. Each child is driven
     * through the published `Animation.advanceTo(absoluteClock)` map: its
     * `startTime` is seeded to its resolved `at`, so `advanceTo(masterClock)`
     * yields the child's local clock as `masterClock − at` exactly. Resolves
     * when the master playhead passes the sequence `duration`.
     *
     * Re-entrant: a `play()` while one is in flight returns the same promise.
     * Under `respectReducedMotion` + an active query, snaps to the rest frame
     * in one paint (a terminal `seek(duration)`), no draw loop.
     */
    /**
     * The completion front-door (G.W13) — `await sequence.finished` resolves
     * once the in-flight transport settles. Exposes the ONE held
     * `_playingPromise` `play()` constructs (the re-entrant guard returns it;
     * the `finally`-clear nulls it on settle) — NOT a second completion
     * lifecycle. A settled (or never-played, or reduced-motion-snapped)
     * sequence resolves immediately.
     */
    get finished(): Promise<void> {
        return this._playingPromise ?? Promise.resolve();
    }

    play(): Promise<void> {
        if (this._playingPromise) return this._playingPromise;

        if (this.respectReducedMotion && prefersReducedMotion()) {
            this.seek(this.duration);
            return Promise.resolve();
        }

        // Seed each child's absolute-clock anchor: advanceTo(clock) computes
        // local = clock − startTime, and we want local = masterClock − at, so
        // startTime := at. Pre-seeding `startTime` (and `started`) makes
        // `advanceTo` skip its lazy `onStart` (no per-child `delay` sleep, no
        // duplicate `animationstart`) while still honoring `onEnd` (rest-frame
        // paint + `animationend`) when the segment passes its duration.
        // (Sequence children carry no own `delay`; the `at` IS the offset.)
        for (const { animation, at } of this.entries) {
            animation.startTime = at;
            animation.started = true;
            animation.managed = true;
        }

        // A fresh play starts the master clock at 0 (the origin seed reads
        // `_time`). `resume()` keeps `_time` so the playhead continues.
        this._time = 0;
        this._paused = false;
        this._playOrigin = undefined;
        this._lastClock = undefined;

        const result = new Promise<void>((resolve) => {
            this._resolvePlay = resolve;
            this.playback.loop(this._boundFrame);
        });

        this._playingPromise = result;
        result.finally(() => {
            this._playingPromise = null;
        });
        return result;
    }

    // THE rAF play-loop step + the settle + the re-anchor BODIES live in
    // `./transport` (R.W2b carve) — pure drivers over this play-machine context
    // (`Sequence implements SequencePlayContext`). These remain methods (the
    // seek↔play parity test drives `seq._frame(...)` directly) but delegate the
    // body, so the loop math is colocated with the fold/restphase it uses.
    async _frame(clock: number): Promise<boolean> {
        return driveSequenceFrame(this, clock);
    }

    private _reanchor(): void {
        reanchorSequence(this, this._playingPromise != null);
    }

    private _settle(): void {
        settleSequence(this);
    }

    /** Halt the play loop where it stands and resolve any pending `play()`. */
    stop(): this {
        this.playback.stop();
        this._settle();
        const resolve = this._resolvePlay;
        this._resolvePlay = null;
        resolve?.();
        return this;
    }

    /**
     * Halt the play loop where it stands WITHOUT releasing the playhead — the
     * managed-pause contract. The rAF loop stops; `_time` and the play promise
     * are RETAINED (children stay `managed`, unlike `stop()`/`_settle`), so a
     * later {@link resume} continues from exactly here. No-op when not playing
     * or already paused. Chainable.
     */
    pause(): this {
        if (!this._playingPromise || this._paused) return this;
        this._paused = true;
        this.playback.stop();
        // The next resume re-seeds the origin from the retained `_time`; clear
        // it so a stale pre-pause origin cannot leak a forward jump.
        this._playOrigin = undefined;
        return this;
    }

    /**
     * Resume a paused sequence — restart the rAF loop with the origin
     * re-anchored so the FIRST resumed frame's master clock equals the
     * retained `_time` (the no-forward-jump re-anchor, the same `RAFPlayback`/
     * `AnimationGroup` managed-pause contract — `src/animation/CLAUDE.md`
     * §Managed-child lifecycle). No-op when not paused. Chainable.
     */
    resume(): this {
        if (!this._playingPromise || !this._paused) return this;
        this._paused = false;
        // Clearing the origin makes the next frame seed it from `_time` (the
        // `_frame` origin-seed: `origin = clock − _time / rate`), so the master
        // clock continues from the paused playhead with no forward jump.
        this._playOrigin = undefined;
        this._lastClock = undefined;
        this.playback.loop(this._boundFrame);
        return this;
    }

    /**
     * Set the scalar playback rate — slow-mo (`< 1`), real-time (`1`),
     * fast-forward (`> 1`), or backward (`< 0`, the {@link reverse} form). The
     * master clock is re-anchored so the playhead is CONTINUOUS at the
     * rate-change instant (no jump) — the same re-anchor as {@link resume}.
     * Takes effect immediately whether or not the sequence is playing.
     * Chainable.
     */
    timeScale(n: number): this {
        if (!Number.isFinite(n)) {
            throw new Error(
                `Sequence.timeScale(n): n must be a finite number, got ${n}.`,
            );
        }
        // Re-anchor at the OLD rate's playhead, THEN adopt the new rate, so the
        // origin solves `(clock − origin) * newRate = _time` from the current
        // `_time` — continuous across the flip.
        this._rate = n;
        this._reanchor();
        return this;
    }

    /**
     * Flip the playback direction — the playhead walks backward from where it
     * stands (a negative rate) or forward again, preserving `|rate|`. C⁰-
     * continuous: the re-anchor keeps the playhead exactly where it is at the
     * flip instant (locked by the F.W9 seek↔play parity gate). Chainable.
     */
    reverse(): this {
        this._rate = -this._rate;
        this._reanchor();
        return this;
    }

    /**
     * Set how many cycles `play()` runs before settling — `1` is single-play,
     * `n` runs `n` cycles, `Infinity` loops forever (until `stop()`). The
     * master clock folds modulo `duration` per cycle. Chainable.
     */
    repeat(count: number): this {
        if (count !== Infinity && (!Number.isInteger(count) || count < 1)) {
            throw new Error(
                `Sequence.repeat(count): count must be a positive integer or Infinity, got ${count}.`,
            );
        }
        this._repeatCount = count;
        return this;
    }

    /**
     * Toggle yoyo (ping-pong) — when on, odd cycles run reflected
     * (`duration − phase`) so the playhead bounces back and forth across the
     * `repeat` cycles. Chainable.
     */
    yoyo(on = true): this {
        this._yoyoOn = on;
        return this;
    }
}
