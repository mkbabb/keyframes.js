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
 * LIGHT module (the value.js-free light barrel): it composes `ElementMorph`
 * (itself light) and `RAFPlayback`, reads no value.js, and accepts easing as a
 * callable {@link TimingFunction} or a typed {@link Easing} via the morph's
 * options — never a string name. The spring twin (`springTimingFunction`)
 * makes the FLIP springy for free.
 *
 * ```ts
 * await flip(card, () => card.classList.toggle("expanded"), { duration: 300 });
 * ```
 */
import type { Easing, TimingFunction } from "../constants";
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

const DEFAULT_FLIP_DURATION = 300;

const rectOf = (el: HTMLElement): MorphRect => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
};

const transformAt = (morph: ElementMorph, progress: number): string => {
    // FLIP plays the INVERSION toward identity: at play-progress `p` the
    // element (physically at its Last rect) is offset by `at(p) − at(1)`, the
    // residual delta back toward First. p=0 → −at(1) = First−Last (the full
    // inversion, element appears at First); p=1 → 0 (identity, element at
    // Last). The morph's easing shapes `p` in the play direction.
    //
    // `NumericAnimation.at()` returns ONE pre-allocated, mutated result object
    // (zero-alloc), so snapshot each sample's fields before the next `at()`
    // call overwrites them.
    const end = morph.at(1);
    const endTX = end.translateX;
    const endTY = end.translateY;
    const endSX = end.scaleX;
    const endSY = end.scaleY;

    const now = morph.at(progress);
    const tx = now.translateX - endTX;
    const ty = now.translateY - endTY;
    // Scale is multiplicative: the residual factor is current/final.
    const sx = endSX === 0 ? 1 : now.scaleX / endSX;
    const sy = endSY === 0 ? 1 : now.scaleY / endSY;
    return `translate(${tx}px, ${ty}px) scale(${sx}, ${sy})`;
};

/**
 * Build the playback driver shared by `flip` and `flipShared`. Given an element
 * physically at its Last rect and a morph whose `from=before`/`to=after`, it
 * inverts the element to its First rect, then animates the inversion to zero.
 */
const playFlip = (
    element: HTMLElement,
    morph: ElementMorph,
    duration: number,
    transformOrigin: string,
): Promise<void> => {
    element.style.transformOrigin = transformOrigin;
    // Invert immediately so the first paint shows the element at its First
    // rect, then play the inversion away.
    element.style.transform = transformAt(morph, 0);

    if (duration <= 0) {
        element.style.transform = transformAt(morph, 1);
        return Promise.resolve();
    }

    const playback = new RAFPlayback();
    return playback.play(duration, (progress) => {
        element.style.transform = transformAt(morph, progress);
    });
};

/**
 * Animate a layout change on `element`: measure (First), run `mutate` (Last),
 * measure again, then invert + play the transform between them via
 * {@link ElementMorph}. Returns the play promise.
 *
 * @param element — the element whose layout `mutate` changes.
 * @param mutate — a synchronous DOM mutation (class toggle, reparent, …).
 * @param options — `{ duration, timingFunction, transformOrigin }`.
 */
export function flip(
    element: HTMLElement,
    mutate: () => void,
    options: FlipOptions = {},
): Promise<void> {
    const {
        duration = DEFAULT_FLIP_DURATION,
        timingFunction,
        transformOrigin = "top left",
    } = options;

    // Batched read-mutate-read: one forced layout per side, no thrash.
    const before = rectOf(element);
    mutate();
    const after = rectOf(element);

    const morph = new ElementMorph(before, after, {
        ...(timingFunction !== undefined ? { timingFunction } : {}),
        transformOrigin,
    });

    return playFlip(element, morph, duration, transformOrigin);
}

/**
 * Shared-element FLIP: animate element `a` onto the rect of element `b`
 * (Motion's `layoutId` / GSAP Flip shared-element style). Unlike `flip`, `a`
 * does NOT move in the DOM — it stays at its own rect (First) and the morph
 * carries it FORWARD onto `b`'s rect (Last). So this is a plain forward
 * {@link ElementMorph} play (identity at t=0 → full delta at t=1), not the
 * inversion `flip` runs.
 *
 * The two reads are batched — one forced layout each, before any write.
 *
 * @param a — the element to animate.
 * @param b — the element whose rect `a` morphs onto.
 * @param options — `{ duration, timingFunction, transformOrigin }`.
 */
export function flipShared(
    a: HTMLElement,
    b: HTMLElement,
    options: FlipOptions = {},
): Promise<void> {
    const {
        duration = DEFAULT_FLIP_DURATION,
        timingFunction,
        transformOrigin = "top left",
    } = options;

    // Both reads up front — one forced layout each, before any write.
    const before = rectOf(a);
    const after = rectOf(b);

    const morph = new ElementMorph(before, after, {
        ...(timingFunction !== undefined ? { timingFunction } : {}),
        duration,
        transformOrigin,
    });

    // Paint the t=0 frame synchronously (identity — `a` at its own rect) so the
    // first paint never flashes an unstyled position; then forward-play walks
    // `a` from its own rect (t=0) to the full delta onto b's rect (t=1).
    morph.apply(a, 0);
    if (duration <= 0) {
        morph.apply(a, 1);
        return Promise.resolve();
    }
    return morph.play(a, duration);
}
