export const FRAME_RATE = 1000 / 60;

export const isObject = (value: any) => {
    return !!value && value.constructor === Object;
};

export const arrayEquals = (a: any[], b: any[]) => {
    if (!a || !b || a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
};

export async function sleep(ms: number) {
    return await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function waitUntil(condition: () => boolean, delay: number = FRAME_RATE) {
    return await new Promise<void>((resolve) => {
        const interval = setInterval(() => {
            if (condition()) {
                clearInterval(interval);
                return resolve();
            }
        }, delay);
    });
}

export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number = 100,
    immediate: boolean = false,
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let result: ReturnType<T>;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
        const context = this;

        const later = function () {
            timeout = null;
            if (!immediate) result = func.apply(context, args);
        };

        const callNow = immediate && !timeout;

        if (timeout) clearTimeout(timeout);

        timeout = setTimeout(later, wait);

        if (callNow) result = func.apply(context, args);
    };
}

export async function createHash(algorithm: string, data: string) {
    const sourceBytes = new TextEncoder().encode(data);

    const digestBytes = await crypto.subtle.digest(algorithm, sourceBytes);

    const digestArray = Array.from(new Uint8Array(digestBytes));

    return digestArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

interface MemoizeOptions {
    maxCacheSize?: number;
    ttl?: number;
    keyFn?: (...args: any[]) => string;
}

export function memoize<T extends (...args: any[]) => any>(
    func: T,
    options: MemoizeOptions = {},
): T & { cache: Map<string, { value: ReturnType<T>; timestamp: number }> } {
    const cache = new Map<string, { value: ReturnType<T>; timestamp: number }>();
    const { maxCacheSize = Infinity, ttl = Infinity, keyFn = JSON.stringify } = options;

    const memoized = function (
        this: ThisParameterType<T>,
        ...args: Parameters<T>
    ): ReturnType<T> {
        const key = keyFn.apply(this, args);
        const now = Date.now();

        if (cache.has(key)) {
            const cached = cache.get(key)!;
            if (now - cached.timestamp <= ttl) {
                return cached.value;
            } else {
                cache.delete(key);
            }
        }

        const result = func.apply(this, args);
        cache.set(key, { value: result, timestamp: now });

        if (cache.size > maxCacheSize) {
            const oldestKey = cache.keys().next().value;
            cache.delete(oldestKey);
        }

        return result;
    } as T;

    // @ts-ignore
    memoized.cache = cache;

    return memoized as any;
}

export function memoizeDecorator(options: MemoizeOptions = {}) {
    return function <T extends (...args: any[]) => any>(
        target: Object,
        propertyKey: string | symbol,
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

export const hyphenToCamelCase = (str: string) =>
    str.replace(/([-_][a-z])/gi, (group) =>
        group.toUpperCase().replace("-", "").replace("_", ""),
    );

export function camelCaseToHyphen(str: string) {
    return str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}

export function seekPreviousValue<T>(ix: number, values: T[], pred: (f: T) => boolean) {
    for (let i = ix - 1; i >= 0; i--) {
        if (pred(values[i])) {
            return i;
        }
    }

    return undefined;
}

export function requestAnimationFrame(callback: FrameRequestCallback) {
    if (typeof window !== "undefined" && window.requestAnimationFrame) {
        return window.requestAnimationFrame(callback);
    }

    let delay = FRAME_RATE;
    let prevT = Date.now();

    return setTimeout(() => {
        let t = Date.now();
        let delta = t - prevT;

        prevT = t;
        delay = Math.max(0, FRAME_RATE - delta);

        callback(t);
    }, delay);
}

export function cancelAnimationFrame(handle: number | undefined | null | any) {
    if (typeof window !== "undefined" && window.cancelAnimationFrame) {
        return window.cancelAnimationFrame(handle);
    }

    clearTimeout(handle);
}

import { TailwindConfig, createTailwindcss } from "@mhsdesign/jit-browser-tailwindcss";
import { Config } from "tailwindcss";

export async function compileTailwindCss(
    css: string,
    tailwindConfig: TailwindConfig | Config,
) {
    const tailwind = createTailwindcss({
        tailwindConfig: tailwindConfig as TailwindConfig,
    });

    return await tailwind.generateStylesFromContent(css, [""]);
}
