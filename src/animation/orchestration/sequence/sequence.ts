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
// the no-jump origin seed, the forward-monotone predicate) lives in the
// colocated `./transport` module (R.W2b carve); `seek` + `_frame` drive them.
import {
    resolveSequencePosition,
    driveSequenceFrame,
    applySequenceAt,
    fireSequenceCrossings,
} from "./transport";
// S.B5 — the TRANSPORT verbs (play/stop/pause/resume) + the rate/repeat
// modifiers (timeScale/reverse/repeat/yoyo) are FREE FUNCTIONS in the colocated
// `./lifecycle` module; the methods below are thin `this`-delegates over them.
import * as lifecycle from "./lifecycle";
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
export class Sequence<V extends Vars = Vars>
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

    /** @internal (S.B5) — read by `./lifecycle`'s `play` reduced-motion arm. */
    readonly respectReducedMotion: boolean;

    /** THE rAF owner for the sequence's play loop. */
    readonly playback = new RAFPlayback();

    /** @internal (S.B5) — the pre-bound frame callback `./lifecycle`'s
     * `play`/`resume` hand to `playback.loop`. */
    _boundFrame: (t: number) => Promise<boolean>;
    _resolvePlay: (() => void) | null = null;
    _playOrigin: number | undefined = undefined;
    /** @internal (S.B5) — the ONE held play promise the `finished` front-door
     * exposes; read/written by the transport free functions in `./lifecycle`. */
    _playingPromise: Promise<void> | null = null;
    private _duration = 0;

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
        return this._duration;
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
        this._duration = Math.max(this._duration, this.cursor);
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

    /** Drive the sequence over real time via `RAFPlayback` — re-entrant, and
     * PRM-aware. Body in `./lifecycle` (S.B5). */
    play(): Promise<void> {
        return lifecycle.play(this);
    }

    // THE rAF play-loop step BODY lives in `./transport` (R.W2b carve) — a pure
    // driver over this play-machine context (`Sequence implements
    // SequencePlayContext`). `_frame` stays a method (the seek↔play parity test
    // drives `seq._frame(...)` directly) but delegates the body, so the loop math
    // is colocated with the fold/restphase it uses. The settle + re-anchor the
    // transport verbs drive also live in `./transport`; the verbs themselves —
    // and their former `_settle`/`_reanchor` helpers — moved to `./lifecycle`
    // (S.B5), which calls the transport drivers directly.
    async _frame(clock: number): Promise<boolean> {
        return driveSequenceFrame(this, clock);
    }

    /** Halt the play loop where it stands and resolve any pending `play()`.
     * Body in `./lifecycle` (S.B5). */
    stop(): this {
        lifecycle.stop(this);
        return this;
    }

    /** Halt the play loop WITHOUT releasing the playhead — the managed-pause
     * contract (`_time` + the play promise are retained for `resume`). No-op when
     * not playing or already paused. Body in `./lifecycle` (S.B5). */
    pause(): this {
        lifecycle.pause(this);
        return this;
    }

    /** Resume a paused sequence — restart the rAF loop with the origin
     * re-anchored so the first resumed frame's master clock equals the retained
     * `_time` (no forward jump). No-op when not paused. Body in `./lifecycle`. */
    resume(): this {
        lifecycle.resume(this);
        return this;
    }

    /** Set the scalar playback rate — slow-mo (`< 1`), real-time (`1`),
     * fast-forward (`> 1`), or backward (`< 0`, the {@link reverse} form); the
     * master clock is re-anchored so the playhead is C⁰-continuous at the flip.
     * Body in `./lifecycle` (S.B5). */
    timeScale(n: number): this {
        lifecycle.timeScale(this, n);
        return this;
    }

    /** Flip the playback direction — the playhead walks backward (negative rate)
     * or forward again, preserving `|rate|`, C⁰-continuous. Body in `./lifecycle`. */
    reverse(): this {
        lifecycle.reverse(this);
        return this;
    }

    /** Set how many cycles `play()` runs before settling — `1` single-play, `n`
     * cycles, `Infinity` loops forever. Body in `./lifecycle` (S.B5). */
    repeat(count: number): this {
        lifecycle.repeat(this, count);
        return this;
    }

    /** Toggle yoyo (ping-pong) — odd cycles run reflected across the `repeat`
     * cycles. Body in `./lifecycle` (S.B5). */
    yoyo(on = true): this {
        lifecycle.yoyo(this, on);
        return this;
    }
}
