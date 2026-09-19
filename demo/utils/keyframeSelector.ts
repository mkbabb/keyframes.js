import {
    parseKeyframeSelector,
    type KeyframeSelector,
} from "@mkbabb/value.js/css";

/**
 * The default timeline span of each scroll-range phase the keyframe-selector
 * grammar can name. MIRRORS the library's `internal/scroll-phases.ts`
 * `PHASE_FRACTIONS`, which stays the engine's single source for compilation:
 * KF.W5's publication decision published no door onto it, and the demo's
 * timeline needs a position for a named keyframe, so the demo owns its own
 * reading of the four spans rather than deep-reaching `@src/` for the
 * engine's (X.KF.W8 unit c). Same name on both sides so the pair is one
 * `git grep` apart, and the map is keyed off value.js's OWN published
 * selector union — a fifth phase in the grammar fails this file to compile
 * rather than silently resolving to nothing.
 */
const PHASE_FRACTIONS: Record<
    Extract<KeyframeSelector, { kind: "named" }>["name"],
    Readonly<{ start: number; end: number }>
> = {
    entry: { start: 0, end: 0.25 },
    cover: { start: 0.25, end: 0.75 },
    contain: { start: 0.375, end: 0.625 },
    exit: { start: 0.75, end: 1 },
};

export const selectorText = (selector: KeyframeSelector): string =>
    selector.kind === "percent"
        ? `${selector.value * 100}%`
        : `${selector.name}${
              selector.offset === undefined ? "" : ` ${selector.offset * 100}%`
          }`;

export const requireKeyframeSelector = (source: string): KeyframeSelector => {
    const result = parseKeyframeSelector(source);
    if (result.ok) return result.value;
    const issue = result.diagnostics[0];
    throw new TypeError(
        `Invalid keyframe selector ${JSON.stringify(source)}: ${issue.code} at ${issue.start}-${issue.end}.`,
    );
};

export const percentSelector = (percent: number): KeyframeSelector => ({
    kind: "percent",
    value: percent / 100,
});

export const selectorPercent = (selector: KeyframeSelector): number => {
    if (selector.kind === "percent") return selector.value * 100;
    const { start, end } = PHASE_FRACTIONS[selector.name];
    return (start + (selector.offset ?? 0) * (end - start)) * 100;
};
