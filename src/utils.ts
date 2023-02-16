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

export async function waitUntil(condition: () => boolean, delay: number = 1000 / 60) {
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
        }, wait);
    };
}

export const hyphenToCamelCase = (str: string) =>
    str.replace(/([-_][a-z])/gi, (group) =>
        group.toUpperCase().replace("-", "").replace("_", "")
    );

export function camelCaseToHyphen(str: string) {
    return str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}
