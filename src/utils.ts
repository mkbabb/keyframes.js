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

export function debounce(func: Function, wait: number = 100, waitingFunc?) {
    let timeout = undefined as unknown as number;
    let interval = undefined as unknown as number;

    return function (...args: Array<any>): void {
        if (timeout !== undefined) {
            clearTimeout(timeout);
            clearInterval(interval);
        }

        timeout = setTimeout(() => {
            func(...args);
            timeout = undefined as unknown as number;
        }, wait) as unknown as number;
    };
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
