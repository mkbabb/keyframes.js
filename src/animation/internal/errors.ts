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

/**
 * The stable, machine-branchable reasons a typed option error can carry
 * (J.W1 S8, K3-internal). EXACTLY the two engine-internal rows the
 * ingestion lane folds into J.W1 — a structured `code` ON the typed throw,
 * NOT a diagnostics channel (the full `Diagnostic[]` surface stays a K.W0
 * seed item):
 *
 * - `EMPTY_PARSE` — a blank/whitespace-only keyframe selector reached the
 *   compile seam (the H-A2 "......" class, named).
 * - `UNKNOWN_TIMING_FN` — a present-but-unresolvable timing function (not a
 *   callable, a registry name, or a cubic-bezier()/steps() literal).
 * - `NAMED_SELECTOR_NO_TIMELINE` — a scroll-range named selector
 *   (`entry`/`exit`/`cover`/`contain`) was accepted at ingest (L.W1 S4), but a
 *   numeric `%` position was genuinely demanded with NO `ScrollTimeline`/
 *   `ManualTimeline` present to map the phase. A named selector is only
 *   meaningful in a scroll context; resolving it to a number outside one is a
 *   consumer bug, so the deferred resolve refuses with this code rather than
 *   inventing a position. (The bare-ingest floor — accept + preserve, no
 *   resolution demanded — never throws.)
 */
type AnimationOptionErrorCode =
    | "EMPTY_PARSE"
    | "UNKNOWN_TIMING_FN"
    | "NAMED_SELECTOR_NO_TIMELINE";

/** Thrown when an animation option receives malformed (non-undefined) input. */
export class AnimationOptionError extends Error {
    readonly option: string;
    readonly value: unknown;
    /**
     * Stable structured reason for programmatic consumers — branch on this,
     * never on the human message. Carried only by the two named rows
     * ({@link AnimationOptionErrorCode}); undefined otherwise.
     */
    readonly code?: AnimationOptionErrorCode;

    constructor(
        option: string,
        value: unknown,
        reason: string,
        code?: AnimationOptionErrorCode,
    ) {
        super(
            `Invalid value for animation option "${option}": ` +
                `${repr(value)} — ${reason}`,
        );
        this.name = "AnimationOptionError";
        this.option = option;
        this.value = value;
        if (code !== undefined) this.code = code;
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
