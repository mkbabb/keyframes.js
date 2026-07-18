import {
    parseKeyframeSelector,
    type KeyframeSelector,
} from "@mkbabb/value.js/css";
import { namedSelectorToFraction } from "@src/animation/compile/selector";

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

export const selectorPercent = (selector: KeyframeSelector): number =>
    (selector.kind === "percent"
        ? selector.value
        : namedSelectorToFraction(selector)) * 100;
