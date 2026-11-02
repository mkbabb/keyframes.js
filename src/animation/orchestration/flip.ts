/**
 * `flip` / `flipShared` — the FLIP (First-Last-Invert-Play) layout-animation
 * composition over {@link ElementMorph}.
 *
 * `ElementMorph` already IS the Invert+Play half: it reads a rect, computes the
 * `translate()/scale()` delta between two rects, and plays it. The missing
 * piece is the automatic "measure → mutate → measure → invert + play" loop.
 * This module is that ~30-line composition — no new physics.
 *
 * The two `getBoundingClientRect` reads are BATCHED into a read-mutate-read
 * sequence: one forced layout to capture First, the `mutate()` that changes
 * layout, one forced layout to capture Last. No interleaved read/write thrash.
 *
 * LIGHT module (the parser-free light barrel): it composes `ElementMorph`
 * (which shares Value's `/math` leaf) and `RAFPlayback`, and accepts easing as a
 * callable {@link TimingFunction} or a typed {@link Easing} via the morph's
 * options — never a string name. The spring twin (`springTimingFunction`)
 * makes the FLIP springy for free.
 *
 * ```ts
 * await flip(card, () => card.classList.toggle("expanded"), { duration: 300 });
 *
 * // Interruptible: a second flip mid-flight glides on from the live frame,
 * // and the handle cancels.
 * const handle = flip(list, () => resort(list));
 * handle.cancel();
 * ```
 */
import type { Easing, TimingFunction } from "../constants/types";
import { ElementMorph, type MorphRect } from "../physics/morph";
import { RAFPlayback } from "../physics/playback";

export interface FlipOptions {
    /** Playback duration in milliseconds. Defaults to `300`. */
    duration?: number;
    /**
     * Easing for the play phase — a callable {@link TimingFunction} or typed
     * {@link Easing} (e.g. `springTimingFunction(...)` for a springy FLIP).
     * A string name is rejected; resolve it via `await resolveEasing(name)`.
     */
    timingFunction?: TimingFunction | Easing;
    transformOrigin?: string;
}

/**
 * The handle `flip` / `flipShared` return: the play promise (it resolves when
 * the play completes, or as soon as it is cancelled or re-targeted), extended
 * with `cancel()`. `cancel()` halts the play at its current frame — the
 * element keeps that frame's inline transform, so a following `flip` on it
 * glides on from exactly there.
 */
export type FlipHandle = Promise<void> & {
    /** Halt the play at its current frame and settle the promise. */
    cancel(): void;
};

const DEFAULT_FLIP_DURATION = 300;

/** The identity of the transform string the play writes. */
const IDENTITY_TRANSFORM = "translate(0px, 0px) scale(1, 1)";

const rectOf = (el: HTMLElement): MorphRect => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
};

/**
 * The one in-flight play per element. A new `flip`/`flipShared` on an element
 * still in this map is a RE-TARGET: it reads the element's live (visual) rect
 * as its start, halts the old play, and glides on from there.
 */
const inFlight = new WeakMap<HTMLElement, () => void>();

/**
 * Halt `element`'s in-flight play (if any) and clear its transform so the next
 * read is the bare layout box. Returns whether a play was in flight.
 */
const interrupt = (element: HTMLElement): boolean => {
    const cancel = inFlight.get(element);
    if (cancel === undefined) return false;
    cancel();
    element.style.transform = IDENTITY_TRANSFORM;
    return true;
};

/**
 * The transform that draws `element` — whose layout box is `layout` — at the
 * rect `morph` (built `start → target`) reaches at play-progress `p`.
 *
 * The morph's sample is the delta off `start`: rect(p) = start translated by
 * `(tx, ty)` and scaled by `(sx, sy)`. Re-expressed against the layout box
 * (top-left origin) that is `translate(rect.xy − layout.xy)
 * scale(rect.size / layout.size)`. For `flip` the layout box IS the target
 * (Last), so p=1 is the identity and p=0 the full inversion back to First; for
 * `flipShared` the layout box is `a`'s own, so p=0 is `a` where it stands and
 * p=1 the full delta onto `b`. `start` is the element's VISUAL rect, so a
 * re-target mid-flight begins on the interrupted frame — no snap.
 */
const transformAt = (
    morph: ElementMorph,
    start: MorphRect,
    layout: MorphRect,
    progress: number,
): string => {
    const { translateX, translateY, scaleX, scaleY } = morph.at(progress);
    const tx = start.x + translateX - layout.x;
    const ty = start.y + translateY - layout.y;
    const sx =
        layout.width === 0 ? 1 : (start.width * scaleX) / layout.width;
    const sy =
        layout.height === 0 ? 1 : (start.height * scaleY) / layout.height;
    return `translate(${tx}px, ${ty}px) scale(${sx}, ${sy})`;
};

/**
 * The playback driver shared by `flip` and `flipShared`: paint the t=0 frame
 * synchronously (the first paint never flashes the bare layout box), then play
 * `start → target` over the element's `layout` box, registered as the
 * element's one in-flight play.
 */
const playFlip = (
    element: HTMLElement,
    start: MorphRect,
    layout: MorphRect,
    target: MorphRect,
    options: FlipOptions,
): FlipHandle => {
    const {
        duration = DEFAULT_FLIP_DURATION,
        timingFunction,
        transformOrigin = "top left",
    } = options;

    const morph = new ElementMorph(start, target, {
        ...(timingFunction !== undefined ? { timingFunction } : {}),
        transformOrigin,
    });

    element.style.transformOrigin = transformOrigin;
    element.style.transform = transformAt(morph, start, layout, 0);

    if (duration <= 0) {
        element.style.transform = transformAt(morph, start, layout, 1);
        return Object.assign(Promise.resolve(), { cancel: () => {} });
    }

    const playback = new RAFPlayback();
    const cancel = (): void => {
        playback.stop();
        if (inFlight.get(element) === cancel) inFlight.delete(element);
    };
    inFlight.set(element, cancel);

    const played = playback
        .play(duration, (progress) => {
            element.style.transform = transformAt(
                morph,
                start,
                layout,
                progress,
            );
        })
        .then(() => {
            if (inFlight.get(element) === cancel) inFlight.delete(element);
        });
    return Object.assign(played, { cancel });
};

/**
 * Animate a layout change on `element`: measure (First), run `mutate` (Last),
 * measure again, then invert + play the transform between them via
 * {@link ElementMorph}. Returns a {@link FlipHandle} — the play promise with a
 * `cancel()`.
 *
 * Interruptible: called on an element whose previous flip is still playing,
 * First is the element's CURRENT interpolated rect (the live visual box), the
 * previous play is halted (its handle settles), and the new play glides on
 * from that frame toward the new Last — no snap, no queue.
 *
 * @param element — the element whose layout `mutate` changes.
 * @param mutate — a synchronous DOM mutation (class toggle, reparent, …).
 * @param options — `{ duration, timingFunction, transformOrigin }`.
 */
export function flip(
    element: HTMLElement,
    mutate: () => void,
    options: FlipOptions = {},
): FlipHandle {
    // Batched read-mutate-read: one forced layout per side, no thrash. First
    // is the visual box — mid-flight, the interrupted frame.
    const before = rectOf(element);
    interrupt(element);
    mutate();
    const after = rectOf(element);

    return playFlip(element, before, after, after, options);
}

/**
 * Shared-element FLIP: animate element `a` onto the rect of element `b`
 * (Motion's `layoutId` / GSAP Flip shared-element style). Unlike `flip`, `a`
 * does NOT move in the DOM — it stays at its own rect (First) and the morph
 * carries it FORWARD onto `b`'s rect (Last): identity at t=0 → full delta at
 * t=1. Returns a {@link FlipHandle}.
 *
 * Interruptible like `flip`: re-targeting `a` (onto a new `b`) mid-flight
 * starts from `a`'s current interpolated rect and halts the previous play.
 *
 * The reads are batched — one forced layout each, before any play write.
 *
 * @param a — the element to animate.
 * @param b — the element whose rect `a` morphs onto.
 * @param options — `{ duration, timingFunction, transformOrigin }`.
 */
export function flipShared(
    a: HTMLElement,
    b: HTMLElement,
    options: FlipOptions = {},
): FlipHandle {
    const before = rectOf(a);
    // Mid-flight, `before` is a's visual box; its layout box is read bare.
    const layout = interrupt(a) ? rectOf(a) : before;
    const after = rectOf(b);

    return playFlip(a, before, layout, after, options);
}
