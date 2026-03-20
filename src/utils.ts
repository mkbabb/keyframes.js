// Re-export most utilities from value.js
export {
    FRAME_RATE,
    isObject,
    clone,
    arrayEquals,
    sleep,
    waitUntil,
    debounce,
    createHash,
    memoize,
    hyphenToCamelCase,
    camelCaseToHyphen,
    seekPreviousValue,
    requestAnimationFrame,
    cancelAnimationFrame,
} from "@mkbabb/value.js";
export type { MemoizeOptions } from "@mkbabb/value.js";

// ── Generic search utilities ────────────────────────────────────────

/**
 * Binary search over a sorted array of non-overlapping ranges.
 * Returns the index of the range containing `value`, or -1 if none.
 *
 * Ranges are defined by accessor functions so the utility works with
 * any sorted structure (AnimationFrame, NumericSegment, etc.).
 *
 * Complexity: O(log N) comparisons.
 *
 * @param items - Sorted array of range objects (by start, ascending)
 * @param value - Value to locate within ranges
 * @param getStart - Accessor for the range's lower bound (inclusive)
 * @param getStop - Accessor for the range's upper bound (inclusive)
 * @returns Index of the containing range, or -1 if not found
 */
export function binarySearchRange<T>(
    items: readonly T[],
    value: number,
    getStart: (item: T) => number,
    getStop: (item: T) => number,
): number {
    let lo = 0;
    let hi = items.length - 1;
    while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        const item = items[mid]!;
        if (value < getStart(item)) hi = mid - 1;
        else if (value > getStop(item)) lo = mid + 1;
        else return mid;
    }
    return -1;
}

// Keep memoizeDecorator locally — animation-specific, uses experimentalDecorators
import { memoize } from "@mkbabb/value.js";

export function memoizeDecorator(options: { maxCacheSize?: number; ttl?: number; keyFn?: (...args: any[]) => string } = {}) {
    return function <T extends (...args: any[]) => any>(
        _target: object,
        _propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<T>,
    ): TypedPropertyDescriptor<T> {
        if (!descriptor.value) {
            throw new Error("memoizeDecorator can only be used on methods");
        }

        const originalMethod = descriptor.value;
        const memoizedMethod = memoize(originalMethod, options);

        descriptor.value = function (this: any, ...args: Parameters<T>): ReturnType<T> {
            return memoizedMethod.apply(this, args);
        } as T;

        return descriptor;
    };
}
