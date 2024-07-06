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
    let timeout: NodeJS.Timeout | null = null;
    let result: ReturnType<T>;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
        const context = this;

        const later = () => {
            timeout = null;
            if (!immediate) {
                result = func.apply(context, args);
            }
        };

        const callNow = immediate && !timeout;

        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(later, wait);

        if (callNow) {
            result = func.apply(context, args);
        }
    };
}

export async function createHash(algorithm: string, data: string) {
    const sourceBytes = new TextEncoder().encode(data);

    const digestBytes = await crypto.subtle.digest(algorithm, sourceBytes);

    const digestArray = Array.from(new Uint8Array(digestBytes));

    return digestArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function memoize<T extends (...args: any[]) => any>(
    func: T,
    options: {
        maxCacheSize?: number;
        ttl?: number;
    } = {},
): T {
    const cache = new Map<string, { value: ReturnType<T>; timestamp: number }>();
    const { maxCacheSize = Infinity, ttl = Infinity } = options;

    async function hashArgs(...args: any[]) {
        try {
            const jsonString = JSON.stringify(args);
            return await createHash("SHA-256", jsonString);
        } catch (error) {
            return args.map((arg) => String(arg)).join("|");
        }
    }

    const memoized = function (
        this: ThisParameterType<T>,
        ...args: Parameters<T>
    ): ReturnType<T> {
        const key = JSON.stringify(args);
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
    return memoized;
}

export const hyphenToCamelCase = (str: string) =>
    str.replace(/([-_][a-z])/gi, (group) =>
        group.toUpperCase().replace("-", "").replace("_", ""),
    );

export function camelCaseToHyphen(str: string) {
    return str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
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
