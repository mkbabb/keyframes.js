import { NumericAnimation } from "./numeric";
import type { Easing, TimingFunction } from "../constants/types";

export interface MorphRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ElementMorphOptions {
    /**
     * Easing as a callable `TimingFunction` or a typed `Easing` —
     * synchronous and parser-free (`ElementMorph` composes `NumericAnimation`,
     * which shares only Value's `/math` leaf). Resolve a
     * string name first via `await resolveEasing(name)`.
     */
    timingFunction?: TimingFunction | Easing;
    /** Playback duration in milliseconds. Required for `.play()`. */
    duration?: number;
    transformOrigin?: string;
}

interface MorphValues {
    [key: string]: number;
    translateX: number;
    translateY: number;
    scaleX: number;
    scaleY: number;
}

const toRect = (source: HTMLElement | MorphRect): MorphRect => {
    if (source instanceof HTMLElement) {
        const r = source.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
    }
    return source;
};

/**
 * Interpolate position and scale between two elements or rects.
 *
 * Two usage modes:
 * - **Stateless**: call `.at(progress)` or `.toCSSTransform(progress)`
 * - **Managed**: call `.play(element)` to animate an element from source
 *   to destination over the configured duration
 */
export class ElementMorph {
    private animation!: NumericAnimation<MorphValues>;
    private transformOrigin: string;
    private timingFunction: TimingFunction | Easing | undefined;
    private duration: number;

    constructor(
        from: HTMLElement | MorphRect,
        to: HTMLElement | MorphRect,
        options?: ElementMorphOptions,
    ) {
        this.transformOrigin = options?.transformOrigin ?? "top left";
        this.timingFunction = options?.timingFunction;
        this.duration = options?.duration ?? 0;
        this.measure(from, to);
    }

    /** Re-measure source and destination, rebuilding the internal animation. */
    measure(from: HTMLElement | MorphRect, to: HTMLElement | MorphRect): this {
        const f = toRect(from);
        const t = toRect(to);

        const dx = t.x - f.x;
        const dy = t.y - f.y;
        const sx = f.width === 0 ? 1 : t.width / f.width;
        const sy = f.height === 0 ? 1 : t.height / f.height;

        this.animation = new NumericAnimation<MorphValues>(
            [
                { translateX: 0, translateY: 0, scaleX: 1, scaleY: 1 },
                { translateX: dx, translateY: dy, scaleX: sx, scaleY: sy },
            ],
            { timingFunction: this.timingFunction, duration: this.duration },
        );

        return this;
    }

    /** Get raw transform values at the given progress [0, 1]. */
    at(progress: number): MorphValues {
        return this.animation.at(progress);
    }

    /** Get a CSS transform string at the given progress [0, 1]. */
    toCSSTransform(progress: number): string {
        const { translateX, translateY, scaleX, scaleY } =
            this.animation.at(progress);
        return `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
    }

    /** Apply the morph transform to an element at the given progress [0, 1]. */
    apply(element: HTMLElement, progress: number): void {
        element.style.transform = this.toCSSTransform(progress);
        element.style.transformOrigin = this.transformOrigin;
    }

    /**
     * Animate an element from source to destination over the configured duration.
     *
     * @param element — the element to apply transforms to
     * @param duration — override the duration set in constructor options (ms)
     */
    play(element: HTMLElement, duration?: number): Promise<void> {
        return this.animation.play((values) => {
            const { translateX, translateY, scaleX, scaleY } = values;
            element.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
            element.style.transformOrigin = this.transformOrigin;
        }, duration ?? this.duration);
    }

    /** Cancel a running `.play()` animation. */
    stop(): void {
        this.animation.stop();
    }
}
