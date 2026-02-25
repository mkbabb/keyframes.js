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
