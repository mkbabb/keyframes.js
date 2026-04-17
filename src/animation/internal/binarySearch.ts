/**
 * Binary search over a sorted array of non-overlapping ranges.
 * Returns the index of the range containing `value`, or -1 if none.
 *
 * Ranges are defined by accessor functions so the utility works with
 * any sorted structure (`AnimationFrame`, `NumericSegment`, etc.).
 *
 * Engine-internal — animation.js's interpolation hot path uses this
 * to locate the active frame in O(log N). Lives in `src/animation/`
 * (not value.js) because value.js has no interpolation engine of
 * its own to consume it.
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
