import type { InputAnimationOptions, KeyframesAnimation } from "@mkbabb/keyframes.js";
import { getAuthoredAnimationOptions, getStoredAnimationOptions } from "@state";
import type { UrlKey } from "./urlState";

// ─────────────────────────────────────────────────────────────────────────────
// FORTY-SIXTH E2 (owner, 23 Nov 2026: "we should store page state in the URL,
// not just in browser session") — a channel's options travel in the address.
//
//   o.<Channel>=d:2s;dl:100ms;n:3;dir:normal;f:both;e:ease-in
//
// One key per channel, spelling only the fields that differ from what the
// channel's author wrote (a channel at its authored options has no key). The
// six fields are the options form's: duration, delay, iterations, direction,
// fill mode and easing. An easing literal is written without the spaces after
// its commas (`e:cubic-bezier(0.2,0.65,0.6,1)`) and read back in the engine's
// own spelling. A change of an option is a tuned value: it replaces the
// current entry once the value rests.
// ─────────────────────────────────────────────────────────────────────────────

type Field = "duration" | "delay" | "iterationCount" | "direction" | "fillMode" | "timingFunction";

/** The fields in the link's order, each with its short name. */
const FIELDS: readonly (readonly [Field, string])[] = [
    ["duration", "d"],
    ["delay", "dl"],
    ["iterationCount", "n"],
    ["direction", "dir"],
    ["fillMode", "f"],
    ["timingFunction", "e"],
];
const BY_SHORT = new Map(FIELDS.map(([field, short]) => [short, field]));

/** A field's value as text (the store's spelling, the engine's literal). */
const text = (v: unknown): string => (v === undefined || v === null ? "" : String(v));
/** The link's spelling of a value: no spaces after commas, no `;`. */
const linkSpelling = (v: string): string => v.replace(/,\s+/g, ",");
/** The engine's spelling of a value read from the link. */
const engineSpelling = (v: string): string => v.replace(/,(?=\S)/g, ", ");

/** The fields that differ from the authored options, in the link's spelling. */
export function encodeChannelOptions(
    stored: Partial<Record<Field, unknown>>,
    authored: Partial<Record<Field, unknown>>,
): string {
    const parts: string[] = [];
    for (const [field, short] of FIELDS) {
        const v = linkSpelling(text(stored[field]));
        if (v === "" || v === linkSpelling(text(authored[field]))) continue;
        parts.push(`${short}:${v}`);
    }
    return parts.join(";");
}

/** The fields a link spells (engine spelling), or `undefined` for a value
 *  that is not one (an unknown field, a field twice, an empty value). */
export function decodeChannelOptions(raw: string): Partial<Record<Field, string>> | undefined {
    const out: Partial<Record<Field, string>> = {};
    if (raw === "") return out;
    for (const part of raw.split(";")) {
        const i = part.indexOf(":");
        if (i <= 0) return undefined;
        const field = BY_SHORT.get(part.slice(0, i));
        const value = part.slice(i + 1).trim();
        if (!field || value === "" || out[field] !== undefined) return undefined;
        out[field] = engineSpelling(value);
    }
    return out;
}

/** Apply one field to the running channel through the engine's own setter
 *  (fail-explicit: a value the engine refuses throws, and is not stored). */
function applyField(animation: KeyframesAnimation<any>, field: Field, value: string): void {
    switch (field) {
        case "duration":
            animation.setDuration(value as InputAnimationOptions["duration"] & string);
            return;
        case "delay":
            animation.setDelay(value as InputAnimationOptions["delay"] & string);
            return;
        case "iterationCount":
            animation.setIterationCount(value as InputAnimationOptions["iterationCount"] & string);
            return;
        case "direction":
            animation.setDirection(value as NonNullable<InputAnimationOptions["direction"]>);
            return;
        case "fillMode":
            animation.setFillMode(value as NonNullable<InputAnimationOptions["fillMode"]>);
            return;
        case "timingFunction":
            animation.setTimingFunction(value as NonNullable<InputAnimationOptions["timingFunction"]>);
    }
}

/** The address key of one channel's options. */
export function channelOptionsKey(name: string, animation: KeyframesAnimation<any>): UrlKey<string> {
    const stored = () => getStoredAnimationOptions(animation).animationOptions as Partial<Record<Field, unknown>>;
    const authored = () => getAuthoredAnimationOptions(animation) as Partial<Record<Field, unknown>>;
    return {
        key: `o.${name}`,
        get: () => encodeChannelOptions(stored(), authored()),
        set: (value: string) => {
            const fields = decodeChannelOptions(value) ?? {};
            const target = authored();
            const bucket = getStoredAnimationOptions(animation).animationOptions as Record<Field, unknown>;
            for (const [field] of FIELDS) {
                const want = fields[field] ?? text(target[field]);
                if (want === "" || linkSpelling(want) === linkSpelling(text(bucket[field]))) continue;
                try {
                    applyField(animation, field, want);
                } catch (e) {
                    if (!(e instanceof Error) || e.name !== "AnimationOptionError") throw e;
                    continue;
                }
                bucket[field] = field === "iterationCount" && (want === "∞" || want === "Infinity") ? "infinite" : want;
            }
        },
        fallback: () => "",
        encode: (v: string) => v,
        decode: (raw: string) => {
            const fields = decodeChannelOptions(raw);
            return fields === undefined ? undefined : encodeChannelOptions(fields, {});
        },
        history: "replace",
    };
}
