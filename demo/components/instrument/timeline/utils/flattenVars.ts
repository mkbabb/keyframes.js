/**
 * Flatten nested vars object into a single-level Record<string, string>.
 *
 * By default, keys are joined with "-" (e.g. `{ border: { color: "red" } }` → `"border-color": "red"`).
 * Pass `transformKey` to customise key handling (e.g. camelCaseToHyphen).
 *
 * Values with a callable `.valueOf` are treated as leaf nodes and stringified;
 * object records without one are traversed recursively.
 */
export function flattenVars(
    obj: Record<string, any>,
    prefix: string,
    result: Record<string, string>,
    transformKey: (key: string) => string = (k) => k,
): Record<string, string> {
    for (const [key, value] of Object.entries(obj)) {
        const prop = prefix
            ? `${prefix}-${transformKey(key)}`
            : transformKey(key);

        if (
            typeof value === "object" &&
            value !== null &&
            typeof value.valueOf !== "function"
        ) {
            flattenVars(value, prop, result, transformKey);
        } else {
            result[prop] = String(value);
        }
    }

    return result;
}
