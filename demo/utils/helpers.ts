/**
 * Demo-owned helpers, re-homed from the library's internal substrate at the
 * Glass-7 consume (V.W2). The library's encapsulation sweep (V.W6) measured
 * these dead on the src tree and deleted them; the consumed demo is their
 * real owner and holds them here rather than reaching into library
 * internals (the CT-04 defect class — the remaining deep-import retirement
 * belongs to the folded-forward demo settlement wave).
 *
 * X.KF.W8 unit c IS that retirement. KF.W5's publication decision (S-3,
 * `src/animation/public.ts`) put `cssIdent`, `reverseCSSTime` and
 * `serializeTimingFunction` on the heavy surface and nothing else, so the
 * library names the demo still reached had no published door and were
 * reachable only by the `@src/` deep path this wave extirpates. Each is
 * re-homed below as the demo's OWN body — never a re-export of the library
 * module (a demo shim forwarding the same private module is the falsifier
 * G1 clause 2 names), and never a second specifier onto it.
 */

/** `margin-left` → `marginLeft` — the CSS-property casing bridge. */
export const hyphenToCamelCase = (value: string): string =>
    value.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());

/** `marginLeft` → `margin-left` — the same bridge, read the other way. */
export const camelCaseToHyphen = (value: string): string =>
    value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

/** A debounced function: the trailing-edge caller plus a `cancel` handle. */
export interface Debounced<Args extends unknown[]> {
    (...args: Args): void;
    /**
     * Drop the pending call, if any, WITHOUT running it. A caller that never
     * invokes this sees the plain trailing-edge debounce it always had.
     */
    cancel(): void;
}

/**
 * Trailing-edge debounce; each call resets the timer. The returned function
 * carries `.cancel()` so an owner can retract an armed call when the world
 * it was armed against has changed (an editor whose buffer was replaced from
 * outside, a component that is unmounting) — the one thing a closure-private
 * timer could not offer.
 */
export function debounce<Args extends unknown[]>(
    fn: (...args: Args) => void,
    milliseconds: number,
): Debounced<Args> {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const debounced = (...args: Args): void => {
        if (timer !== undefined) clearTimeout(timer);
        timer = setTimeout(() => {
            timer = undefined;
            fn(...args);
        }, milliseconds);
    };
    debounced.cancel = (): void => {
        if (timer !== undefined) clearTimeout(timer);
        timer = undefined;
    };
    return debounced;
}

/**
 * One `ch` in pixels for an element's own font — the only branch the demo
 * ever asked the library's `convertToPixels` for. It mirrors that resolver's
 * `ch` arm (`resolve/browser.ts`: the half-em approximation it applies to
 * `ex`/`ch`, over the element's computed `font-size`, falling back to 16px),
 * so the metric the demo lays out against is unchanged by the re-home.
 */
const chInPixels = (element: HTMLElement): number =>
    (Number.parseFloat(getComputedStyle(element).fontSize) || 16) * 0.5;

/** Pixels → `ch` units, measured against the element's own font metrics. */
export const convertPixelsToCh = (
    pixels: number,
    element: HTMLElement,
): number => pixels / chInPixels(element);
