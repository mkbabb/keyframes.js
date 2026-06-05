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
        for (const { animation, at } of this.entries) {
            const local = clamp(
                masterClock - at,
                0,
                animation.options.duration,
            );
            animation.interpFrames(local, true);
        }
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

        this._playOrigin = undefined;

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
        // First frame establishes the wall-clock origin so the master playhead
        // starts at 0 regardless of the rAF timestamp value.
        if (this._playOrigin === undefined) this._playOrigin = clock;
        const masterClock = clock - this._playOrigin;
        this._time = masterClock;

        // Drive each child through the published absolute-clock map. With
        // `startTime` seeded to `at`, `advanceTo(masterClock)` returns the
        // child's local clock `masterClock − at` (and runs `onEnd` — rest paint
        // + `animationend` — once it crosses the segment duration). Three
        // windows per segment:
        //   • not yet reached (`masterClock < at`) — held at the initial frame.
        //   • finished (`local ≥ duration`) — `advanceTo` fired `onEnd` once
        //     (which clears `startTime`); re-advancing would re-run `onStart`
        //     and re-anchor, so we hold the final frame directly instead.
        //   • active — `advanceTo` then paint at the returned local clock.
        for (const { animation, at } of this.entries) {
            const duration = animation.options.duration;
            const local = clamp(masterClock - at, 0, duration);

            if (masterClock < at) {
                animation.interpFrames(0, true);
            } else if (masterClock - at >= duration) {
                animation.interpFrames(duration, true);
            } else {
                await animation.advanceTo(masterClock);
                animation.interpFrames(local, true);
            }
        }

        if (masterClock >= this.duration) {
            this._settle();
            const resolve = this._resolvePlay;
            this._resolvePlay = null;
            resolve?.();
            return false;
        }
        return true;
    }

    /** Release every child back to standalone ownership and clear play flags. */
    private _settle(): void {
        for (const { animation } of this.entries) {
            animation.managed = false;
            animation.started = false;
            animation.startTime = undefined;
        }
        this._playOrigin = undefined;
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
