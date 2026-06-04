/**
 * Typed option-validation errors — the fail-explicit seam.
 *
 * The engine's option setters and the light engines' easing inputs THROW on
 * malformed input rather than silently defaulting or no-oping — the posture
 * the layer API already chose ("silent no-ops were hiding consumer bugs",
 * `group.ts` setLayerConfig). Defaulting happens only for genuine
 * `undefined`: an omitted option means "use the default"; a
 * present-but-malformed option is a consumer bug and surfaces as one of
 * these.
 *
 * Value.js-free: light modules import these without touching the boundary.
 */

const repr = (value: unknown): string => {
    if (typeof value === "string") return JSON.stringify(value);
    if (typeof value === "function") {
        return `[function ${(value as { name?: string }).name || "anonymous"}]`;
    }
    return String(value);
};

/** Thrown when an animation option receives malformed (non-undefined) input. */
export class AnimationOptionError extends Error {
    readonly option: string;
    readonly value: unknown;

    constructor(option: string, value: unknown, reason: string) {
        super(
            `Invalid value for animation option "${option}": ` +
                `${repr(value)} — ${reason}`,
        );
        this.name = "AnimationOptionError";
        this.option = option;
        this.value = value;
    }
}

/** Thrown when a string easing name cannot be resolved through the registry. */
export class UnknownEasingError extends Error {
    readonly easingName: string;

    constructor(easingName: string) {
        super(
            `Unknown easing name ${repr(easingName)} — not a value.js ` +
                `registry entry or cubic-bezier() literal. Pass a callable ` +
                `TimingFunction (or a typed Easing), or resolve the name ` +
                `first via \`await resolveEasing(name)\`.`,
        );
        this.name = "UnknownEasingError";
        this.easingName = easingName;
    }
}

/**
 * Parse-or-throw seam for option setters: `parse` returns the parsed value
 * or `undefined` for malformed input, which converts to a thrown
 * `AnimationOptionError` carrying the option name + offending value.
 */
export function parseOption<T>(
    option: string,
    raw: unknown,
    parse: (raw: unknown) => T | undefined,
    reason: string,
): T {
    const parsed = parse(raw);
    if (parsed === undefined) {
        throw new AnimationOptionError(option, raw, reason);
    }
    return parsed;
}
