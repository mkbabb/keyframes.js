/** Small product-owned helpers that do not belong to the Value domain. */

export const camelCaseToHyphen = (value: string): string =>
    value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

export const sleep = (milliseconds: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, milliseconds));

export function seekPreviousValue<T>(
    fromIndex: number,
    values: readonly T[],
    predicate: (value: T) => boolean,
): number | undefined {
    for (let index = fromIndex - 1; index >= 0; index--) {
        if (predicate(values[index]!)) return index;
    }
    return undefined;
}
