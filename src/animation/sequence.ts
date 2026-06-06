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

import { clamp } from "./internal/leaves";
import { RAFPlayback } from "./playback";
import type { Animation } from "./engine";
import type { Vars } from "./constants";

/**
 * A position on the master clock for a sequence entry.
 *
 * - `number` — an absolute offset in milliseconds from the sequence origin.
 * - `` `+=${n}` `` / `` `-=${n}` `` — relative to the running insertion cursor
 *   (the end of the previously-inserted segment): `"+=200"` starts 200ms after
 *   the cursor, `"-=200"` overlaps the previous segment by 200ms.
 * - any other string — a label registered via {@link Sequence.label}.
 */
export type SequencePosition = number | `+=${number}` | `-=${number}` | string;

/** A resolved sequence segment: a child animation anchored at an absolute ms offset. */
export interface SequenceEntry<V extends Vars> {
    animation: Animation<V>;
    /** Absolute offset (ms) of this segment's local t=0 on the master clock. */
    at: number;
}

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
export class Sequence<V extends Vars = any> {
    /** Resolved segments, in insertion order. */
    readonly entries: SequenceEntry<V>[] = [];

    /** Named positions on the master clock, registered via {@link label}. */
    private readonly labels = new Map<string, number>();

    /**
     * The running insertion cursor (ms) — the end of the last-inserted
     * segment. Relative `"+="`/`"-="` positions and auto-append (`at` omitted)
     * measure from here, matching GSAP's append-by-default timeline.
     */
    private cursor = 0;

    /** Master clock (ms) of the current playhead. */
    private _time = 0;

    private readonly respectReducedMotion: boolean;

    /** THE rAF owner for the sequence's play loop. */
    readonly playback = new RAFPlayback();

    private _boundFrame: (t: number) => Promise<boolean>;
    private _resolvePlay: (() => void) | null = null;
    private _playOrigin: number | undefined = undefined;
    private _playingPromise: Promise<void> | null = null;

    /**
     * The scalar playback rate — the single field that drives `timeScale`
     * and `reverse`. `_rate = 1` is real-time forward (the existing
     * single-play default); `n` is `timeScale(n)` (slow-mo `< 1` /
     * fast-forward `> 1`); a negative `_rate` walks the master clock
     * backward (`reverse`). It scales the master clock in {@link _frame}:
     * `masterClock = (clock − _playOrigin) * _rate`.
     */
    private _rate = 1;

    /**
     * How many master-clock cycles `play()` runs before settling. `1` is the
     * existing single-play; `Infinity` never settles (the loop case);
     * `n` runs `n` cycles. The master clock folds modulo `duration`
     * (see {@link _fold}).
     */
    private _repeatCount = 1;

    /**
     * When true, odd cycles reflect the folded phase (`duration − phase`) —
     * the GSAP `yoyo` ping-pong. Default off (every cycle runs forward).
     */
    private _yoyoOn = false;

    /** Whether `pause()` has halted the loop with the playhead retained. */
    private _paused = false;

    /**
     * The loop's last rAF timestamp — the re-anchor reference. The
     * `RAFPlayback`/`AnimationGroup` managed-pause records the loop's LAST rAF
     * timestamp (not `performance.now()`) so resume adjusts the origin against
     * the SAME clock the loop reads, with no forward jump. `Sequence` records
     * it here per frame (the driver does not expose it) for that one re-anchor.
     */
    private _lastClock: number | undefined = undefined;

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
        this.labels.set(name, this.resolvePosition(at));
        return this;
    }

    /**
     * Append a child animation at `at` (absolute ms, a label, a `"+="`/`"-="`
     * relative token, or — omitted — the running cursor, i.e. after the
     * previous segment). Advances the insertion cursor to this segment's end.
     * Chainable.
     */
    add(animation: Animation<V>, at?: SequencePosition): this {
        const resolved = this.resolvePosition(at);
        this.entries.push({ animation, at: resolved });
        // Position-insertion: re-sort so seek/advance walk segments in clock
        // order regardless of insertion order (a later `at:0` is legal).
        this.entries.sort((a, b) => a.at - b.at);
        this.cursor = resolved + animation.options.duration;
        return this;
    }

    /**
     * Resolve a {@link SequencePosition} to an absolute ms offset.
     *
     * - omitted → the running cursor (auto-append after the previous segment).
     * - `number` → itself.
     * - `"+=n"` / `"-=n"` → cursor ± n.
     * - any other string → the registered label (throws if unknown — labels
     *   are an explicit contract, a typo is a bug, not a silent 0).
     */
    private resolvePosition(at?: SequencePosition): number {
        if (at === undefined) return this.cursor;
        if (typeof at === "number") return at;

        const relMatch = /^([+-])=(\d*\.?\d+)$/.exec(at);
        if (relMatch) {
            const sign = relMatch[1] === "+" ? 1 : -1;
            return this.cursor + sign * Number.parseFloat(relMatch[2]!);
        }

        const labelled = this.labels.get(at);
        if (labelled === undefined) {
            throw new Error(
                `Sequence: unknown position "${at}". Register it with .label("${at}", at) first, or pass a number / "+=n" / "-=n".`,
            );
        }
        return labelled;
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
        this._applyAt(masterClock);
        return this;
    }

    /**
     * THE master-playhead → child-clock map, applied as a pure synchronous
     * scrub. For every segment the local clock is `clamp(masterClock − at, 0,
     * duration)`, painted via `interpFrames(local, true)`. This is the ONE map
     * both `seek` (the public scrub) and `_frame` (the rAF play loop) drive —
     * so play is pixel-identical to seek BY CONSTRUCTION, forward AND reverse
     * (the C⁰-continuity the F.W9 parity gate locks). It carries no `onEnd`/
     * `startTime` machinery, so re-entering a finished segment under a negative
     * `rate` paints the same final-frame value `seek` would — there is no
     * forward-monotone re-anchor window to break (F.W9 §S3 MEASURE-FIRST).
     */
    private _applyAt(masterClock: number): void {
        for (const { animation, at } of this.entries) {
            const local = clamp(
                masterClock - at,
                0,
                animation.options.duration,
            );
            animation.interpFrames(local, true);
        }
    }

    /**
     * Fold a raw, repeat-extended master clock down to an effective phase in
     * `[0, duration]` per the `repeat`/`yoyo` transport. With `repeat(1)` +
     * `yoyo(false)` (the defaults) this is the identity on `[0, duration]`
     * (the existing single-play). For `repeat`, the phase is `raw mod
     * duration`; for `yoyo`, odd cycles reflect (`duration − phase`) so the
     * playhead ping-pongs. The terminal clock of the LAST cycle resolves to
     * the rest phase (`duration` forward, `0` reflected) rather than wrapping
     * to `0` — so a settled `repeat`/`yoyo` run lands on its true end frame.
     */
    private _fold(raw: number): number {
        const duration = this.duration;
        if (duration <= 0) return 0;

        const clamped = clamp(raw, 0, duration * this._repeatCount);
        let cycle = Math.floor(clamped / duration);
        let phase = clamped - cycle * duration;
        // The exact cycle boundary (and the terminal clock) belongs to the END
        // of the cycle it closes, not the start of the next — so a finished
        // forward cycle rests at `duration`, a finished reflected cycle at `0`.
        if (phase === 0 && cycle > 0) {
            cycle -= 1;
            phase = duration;
        }
        return this._yoyoOn && cycle % 2 === 1 ? duration - phase : phase;
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

    private async _frame(clock: number): Promise<boolean> {
        // Seed the origin so the FIRST frame's master clock equals the RETAINED
        // `_time` (0 on a fresh play — the existing start-at-0; the paused
        // playhead on resume — no forward jump). Solving `(clock − origin) *
        // rate = _time` for the origin: `origin = clock − _time / rate`. A zero
        // rate freezes the playhead, so the origin collapses to the bare clock.
        if (this._playOrigin === undefined) {
            this._playOrigin =
                this._rate === 0 ? clock : clock - this._time / this._rate;
        }
        this._lastClock = clock;

        // Scalar-field arithmetic: the rate scales the wall-clock delta into a
        // master clock (negative walks it backward — `reverse`). The raw,
        // unfolded master clock is what `repeat`/`yoyo` extend over.
        const rawMaster = (clock - this._playOrigin) * this._rate;
        const total = this.duration * this._repeatCount;

        // Directional / cycle settle bound. Forward (`rate ≥ 0`) settles once
        // the raw master clock passes the repeat-extended span; reverse
        // (`rate < 0`) settles once it walks back to 0. `Infinity` repeat never
        // satisfies the forward bound — the loop runs until `stop()`.
        const finished =
            this._rate >= 0 ? rawMaster >= total : rawMaster <= 0;

        // The painted master clock is the raw clock folded by repeat/yoyo into
        // an effective phase, then snapped to the terminal rest phase on the
        // final frame so a settled run lands EXACTLY on its end frame.
        const phase = finished
            ? this._rate >= 0
                ? this._restPhase()
                : 0
            : this._fold(rawMaster);
        this._time = phase;

        // Event coherence for the FORWARD-MONOTONE single-play (the byte-stable
        // default: rate 1, repeat 1, yoyo off). Each child seeded with
        // `startTime = at`, so `advanceTo(phase)` fires `animationstart` once
        // on entry and `animationend` once on crossing — through the published
        // driver, exactly as the pre-transport `_frame` did. Skipped under any
        // non-default transport (reverse / repeat / yoyo), where the children's
        // own forward `onEnd`-clears-`startTime` window is the very thing the
        // scrub-paint side-steps — events there ride the children's fill
        // semantics, consistent with `seek`.
        if (this._isForwardMonotone()) {
            for (const { animation, at } of this.entries) {
                if (phase >= at && phase - at < animation.options.duration) {
                    await animation.advanceTo(phase);
                }
            }
        }

        // ONE map — identical to `seek`. No `advanceTo`/`onEnd` window, so a
        // reverse / yoyo sweep that re-enters a finished segment paints the
        // same value `seek` would (the C⁰-continuity the parity gate locks).
        this._applyAt(phase);

        if (finished) {
            this._settle();
            const resolve = this._resolvePlay;
            this._resolvePlay = null;
            resolve?.();
            return false;
        }
        return true;
    }

    /**
     * True for the byte-stable default transport — forward real-time, single
     * cycle, no yoyo. The event-dispatch path runs ONLY here, so an existing
     * caller's `play()` fires the same `animationstart`/`animationend` it
     * always did; any transport modifier opts into the scrub-paint authority.
     */
    private _isForwardMonotone(): boolean {
        return this._rate === 1 && this._repeatCount === 1 && !this._yoyoOn;
    }

    /**
     * The terminal rest phase of a `repeat`/`yoyo` run — where the playhead
     * lands when the final cycle closes. A forward run rests at `duration`;
     * an odd-cycle yoyo run that closes reflected rests at `0`. Mirrors the
     * boundary `_fold` resolves at the terminal clock.
     */
    private _restPhase(): number {
        const duration = this.duration;
        const lastCycleReflected =
            this._yoyoOn && (this._repeatCount - 1) % 2 === 1;
        return lastCycleReflected ? 0 : duration;
    }

    /**
     * Re-anchor `_playOrigin` against the loop's last rAF timestamp so the
     * master clock is CONTINUOUS across a transport edit — the
     * `RAFPlayback`/`AnimationGroup` managed-pause re-anchor (no forward jump).
     * The invariant restored: `(clock − _playOrigin) * rate === _time` at the
     * edit instant. Solving for the origin: `_playOrigin = clock − _time /
     * rate`. With `rate = 0` the playhead is frozen, so the origin collapses
     * to the bare timestamp (the next non-zero rate re-anchors again).
     */
    private _reanchor(): void {
        if (!this._playingPromise) return;
        const last = this._lastClock;
        if (last === undefined) {
            // No frame has run yet — the first frame seeds the origin so the
            // master clock starts from `_time`; defer by clearing the origin.
            this._playOrigin = undefined;
            return;
        }
        this._playOrigin =
            this._rate === 0 ? last : last - this._time / this._rate;
    }

    /** Release every child back to standalone ownership and clear play flags. */
    private _settle(): void {
        for (const { animation } of this.entries) {
            animation.managed = false;
            animation.started = false;
            animation.startTime = undefined;
        }
        this._playOrigin = undefined;
        this._lastClock = undefined;
        this._paused = false;
        // The configured `rate`/`repeat`/`yoyo` PERSIST across plays (the GSAP
        // transport idiom — a `timeScale`/`reverse` set on a timeline holds);
        // only the per-play anchor state resets here.
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

/**
 * SSR-safe `prefers-reduced-motion: reduce` probe. Mirrors the engine's
 * off-DOM posture (no `matchMedia` → false). Inlined (not imported from
 * `internal/reduced-motion`) to keep the dependency surface to the two light
 * modules the docstring names; the predicate is one line.
 */
const prefersReducedMotion = (): boolean =>
    typeof matchMedia === "function" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches;
