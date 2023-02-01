import { CSSKeyframes, ValueArray, ValueUnit } from "./units";

export async function sleep(ms: number) {
    return await new Promise((resolve) => setTimeout(resolve, ms));
}

export interface TransformedVars {
    [arg: string]: ValueArray;
}

export function transformObject(input: any): TransformedVars {
    const output = {} as TransformedVars;

    const recurse = (input: any, parentKey: string = ""): ValueArray | undefined => {
        if (typeof input === "object") {
            for (const [k, v] of Object.entries(input)) {
                const currentKey = parentKey ? `${parentKey}.${k}` : k;
                const transformedValues = recurse(v, currentKey);

                if (transformedValues !== undefined) {
                    output[currentKey] = transformedValues;
                }
            }
        } else {
            const p = CSSKeyframes.value.parse(String(input));
            return p.status ? p.value : undefined;
        }
    };

    recurse(input);
    return output;
}

export function reverseTransformObject(
    key: string,
    values: ValueArray,
    original: any
): any {
    const keys = key.split(".");
    let obj = original;

    for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        if (values !== undefined && i === keys.length - 1) {
            obj[k] = values.toString();
        } else {
            obj = obj[k] ?? (obj[k] = {});
        }
    }
    return original;
}

export async function waitUntil(condition: () => boolean, delay: number = 1000 / 60) {
    return await new Promise<void>((resolve) => {
        const interval = setInterval(() => {
            if (condition()) {
                clearInterval(interval);
                resolve();
            }
        }, delay);
    });
}
