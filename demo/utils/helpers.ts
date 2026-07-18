/**
 * Demo-owned helpers, re-homed from the library's internal substrate at the
 * Glass-7 consume (V.W2). The library's encapsulation sweep (V.W6) measured
 * these dead on the src tree and deleted them; the consumed demo is their
 * real owner and holds them here rather than reaching into library
 * internals (the CT-04 defect class — the remaining deep-import retirement
 * belongs to the folded-forward demo settlement wave).
 */
import { convertToPixels } from "@src/animation/resolve/browser";

/** `margin-left` → `marginLeft` — the CSS-property casing bridge. */
export const hyphenToCamelCase = (value: string): string =>
    value.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());

/** Trailing-edge debounce; each call resets the timer. */
export function debounce<Args extends unknown[]>(
    fn: (...args: Args) => void,
    milliseconds: number,
): (...args: Args) => void {
    let timer: ReturnType<typeof setTimeout> | undefined;
    return (...args: Args): void => {
        if (timer !== undefined) clearTimeout(timer);
        timer = setTimeout(() => fn(...args), milliseconds);
    };
}

/** Pixels → `ch` units, measured against the element's own font metrics. */
export const convertPixelsToCh = (pixels: number, element: HTMLElement): number =>
    pixels / convertToPixels(1, "ch", element);
