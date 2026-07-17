import {
    mixColors,
    type AnyColor,
    type Color,
    type HueInterpolationMethod,
    type SpaceId,
} from "@mkbabb/value.js/color";
import { serializeCssColor } from "@mkbabb/value.js/css";
import { lerp } from "@mkbabb/value.js/math";
import {
    isLayoutTrackingUnit,
    type CssValue,
} from "@mkbabb/value.js/value";
import {
    convertToPixels,
    getLayoutEpoch,
    resolveBrowserScalar,
} from "../../resolve/browser";
import { serializeCssValue } from "../emit/css-text";

export interface NumericInterpSlot {
    readonly kind: "number";
    readonly from: number;
    readonly to: number;
    current: number;
    readonly unit: string;
}

interface ColorInterpSlot {
    readonly kind: "color";
    readonly from: AnyColor;
    readonly to: AnyColor;
    current: Color<SpaceId>;
    readonly space: SpaceId;
    hue?: HueInterpolationMethod;
}

interface ComputedInterpSlot {
    readonly kind: "computed";
    readonly from: CssValue;
    readonly to: CssValue;
    current: number;
    unit: string;
    target?: HTMLElement;
    readonly property: string;
    cache: Readonly<{
        epoch: number;
        target: HTMLElement;
        from: number;
        to: number;
        unit: string;
    }> | undefined;
}

interface DiscreteInterpSlot {
    readonly kind: "discrete";
    readonly from: CssValue;
    readonly to: CssValue;
    current: CssValue;
}

export type InterpSlot =
    | NumericInterpSlot
    | ColorInterpSlot
    | ComputedInterpSlot
    | DiscreteInterpSlot;

interface InterpSlotOptions {
    readonly colorSpace: SpaceId;
    readonly hueMethod?: HueInterpolationMethod;
    readonly target?: HTMLElement;
    readonly property: string;
}

const ANGLE_FACTORS: Readonly<Record<string, number>> = {
    deg: 1,
    grad: 0.9,
    rad: 180 / Math.PI,
    turn: 360,
};
const TIME_FACTORS: Readonly<Record<string, number>> = { ms: 1, s: 1000 };
const RESOLUTION_FACTORS: Readonly<Record<string, number>> = {
    dpi: 1,
    dpcm: 2.54,
    dppx: 96,
};
const LENGTH_UNITS = new Set([
    "px", "cm", "mm", "Q", "in", "pc", "pt", "em", "ex", "ch",
    "cap", "ic", "rem", "lh", "rlh", "vw", "vh", "vmin", "vmax",
    "vb", "vi", "svw", "svh", "svi", "svb", "svmin", "svmax",
    "lvw", "lvh", "lvi", "lvb", "lvmin", "lvmax", "dvw", "dvh",
    "dvi", "dvb", "dvmin", "dvmax", "cqw", "cqh", "cqi", "cqb",
    "cqmin", "cqmax", "%",
]);
const FONT_RELATIVE_UNITS = new Set([
    "em", "rem", "ex", "ch", "cap", "ic", "lh", "rlh",
]);

const scalar = (value: CssValue) =>
    value.kind === "scalar" ? value.payload : undefined;

const numeric = (value: CssValue) => {
    const payload = scalar(value);
    return payload?.type === "number" ? payload : undefined;
};

const color = (value: CssValue): AnyColor | undefined => {
    const payload = scalar(value);
    return payload?.type === "color" ? payload.value : undefined;
};

const computed = (value: CssValue): boolean =>
    value.kind === "call" && (value.name === "var" || value.name === "calc");

const browserResolvedPair = (left: CssValue, right: CssValue): boolean =>
    computed(left) ||
    computed(right) ||
    (left.kind === "call" && right.kind === "call" && left.name !== right.name) ||
    (left.kind !== right.kind && (left.kind === "call" || right.kind === "call"));

const lateResolvedNumericPair = (
    left: NonNullable<ReturnType<typeof numeric>>,
    right: NonNullable<ReturnType<typeof numeric>>,
): boolean => {
    let leftUnit = left.unit;
    let rightUnit = right.unit;
    if (left.value === 0 && leftUnit === "" && rightUnit !== "") leftUnit = rightUnit;
    if (right.value === 0 && rightUnit === "" && leftUnit !== "") rightUnit = leftUnit;
    if (leftUnit === rightUnit) return false;
    if (!LENGTH_UNITS.has(leftUnit) || !LENGTH_UNITS.has(rightUnit)) return false;
    return isLayoutTrackingUnit(leftUnit) ||
        isLayoutTrackingUnit(rightUnit) ||
        FONT_RELATIVE_UNITS.has(leftUnit) ||
        FONT_RELATIVE_UNITS.has(rightUnit);
};

const computedSlot = (
    left: CssValue,
    right: CssValue,
    options: InterpSlotOptions,
): ComputedInterpSlot => ({
    kind: "computed",
    from: left,
    to: right,
    current: 0,
    unit: "",
    property: options.property,
    cache: undefined,
    ...(options.target === undefined ? {} : { target: options.target }),
});

const normalizedNumericPair = (
    left: NonNullable<ReturnType<typeof numeric>>,
    right: NonNullable<ReturnType<typeof numeric>>,
    options: InterpSlotOptions,
): readonly [number, number, string] => {
    let leftUnit = left.unit;
    let rightUnit = right.unit;

    if (left.value === 0 && leftUnit === "" && rightUnit !== "") leftUnit = rightUnit;
    if (right.value === 0 && rightUnit === "" && leftUnit !== "") rightUnit = leftUnit;
    if (leftUnit === rightUnit) return [left.value, right.value, leftUnit];

    const angleLeft = ANGLE_FACTORS[leftUnit];
    const angleRight = ANGLE_FACTORS[rightUnit];
    if (angleLeft !== undefined && angleRight !== undefined) {
        return [left.value * angleLeft, right.value * angleRight, "deg"];
    }
    const timeLeft = TIME_FACTORS[leftUnit];
    const timeRight = TIME_FACTORS[rightUnit];
    if (timeLeft !== undefined && timeRight !== undefined) {
        return [left.value * timeLeft, right.value * timeRight, "ms"];
    }
    const resolutionLeft = RESOLUTION_FACTORS[leftUnit];
    const resolutionRight = RESOLUTION_FACTORS[rightUnit];
    if (resolutionLeft !== undefined && resolutionRight !== undefined) {
        return [left.value * resolutionLeft, right.value * resolutionRight, "dpi"];
    }
    if (LENGTH_UNITS.has(leftUnit) && LENGTH_UNITS.has(rightUnit)) {
        return [
            convertToPixels(left.value, leftUnit, options.target, options.property),
            convertToPixels(right.value, rightUnit, options.target, options.property),
            "px",
        ];
    }
    throw new TypeError(
        `Cannot interpolate incompatible CSS units "${leftUnit}" and "${rightUnit}" for "${options.property}".`,
    );
};

const normalizedResolvedPair = (
    left: Readonly<{ value: number; unit: string }>,
    right: Readonly<{ value: number; unit: string }>,
    target: HTMLElement,
    property: string,
): readonly [number, number, string] => normalizedNumericPair(
    { type: "number", value: left.value, unit: left.unit },
    { type: "number", value: right.value, unit: right.unit },
    { colorSpace: "rgb", target, property },
);

export function createInterpSlot(
    left: CssValue,
    right: CssValue,
    options: InterpSlotOptions,
): InterpSlot {
    const leftNumber = numeric(left);
    const rightNumber = numeric(right);
    if (leftNumber !== undefined && rightNumber !== undefined) {
        if (lateResolvedNumericPair(leftNumber, rightNumber)) {
            if (leftNumber.unit === "%" || rightNumber.unit === "%") {
                throw new TypeError(
                    `Cannot interpolate mixed percentage lengths for "${options.property}" without a property-specific percentage basis.`,
                );
            }
            return computedSlot(left, right, options);
        }
        const [from, to, unit] = normalizedNumericPair(
            leftNumber,
            rightNumber,
            options,
        );
        return { kind: "number", from, to, current: from, unit };
    }

    const leftColor = color(left);
    const rightColor = color(right);
    if (leftColor !== undefined && rightColor !== undefined) {
        const slot: ColorInterpSlot = {
            kind: "color",
            from: leftColor,
            to: rightColor,
            current: leftColor,
            space: options.colorSpace,
        };
        if (options.hueMethod !== undefined) slot.hue = options.hueMethod;
        return slot;
    }

    if (browserResolvedPair(left, right)) {
        return computedSlot(left, right, options);
    }

    if (left.kind !== right.kind) {
        throw new TypeError(
            `Cannot interpolate unlike CSS value kinds "${left.kind}" and "${right.kind}" for "${options.property}".`,
        );
    }
    return { kind: "discrete", from: left, to: right, current: left };
}

export function interpolateSlot(
    slot: InterpSlot,
    progress: number,
    target?: HTMLElement,
): void {
    switch (slot.kind) {
        case "number":
            slot.current = lerp(slot.from, slot.to, progress);
            return;
        case "color": {
            const mixed = mixColors(slot.from, slot.to, progress, {
                space: slot.space,
                ...(slot.hue === undefined ? {} : { hue: slot.hue }),
            });
            if (!mixed.ok) {
                throw new TypeError(`Color interpolation failed: ${mixed.error.code}.`);
            }
            slot.current = mixed.value;
            return;
        }
        case "computed": {
            if (target !== undefined) bindInterpSlotTarget(slot, target);
            const boundTarget = slot.target;
            if (boundTarget === undefined) {
                throw new TypeError(
                    `Computed CSS interpolation for "${slot.property}" requires a browser target at sample time.`,
                );
            }
            const epoch = getLayoutEpoch();
            let cache = slot.cache;
            if (cache === undefined || cache.epoch !== epoch || cache.target !== boundTarget) {
                const from = resolveBrowserScalar(slot.from, boundTarget, slot.property);
                const to = resolveBrowserScalar(slot.to, boundTarget, slot.property);
                const [fromValue, toValue, unit] = normalizedResolvedPair(
                    from,
                    to,
                    boundTarget,
                    slot.property,
                );
                cache = Object.freeze({
                    epoch,
                    target: boundTarget,
                    from: fromValue,
                    to: toValue,
                    unit,
                });
                slot.cache = cache;
            }
            slot.current = lerp(cache.from, cache.to, progress);
            slot.unit = cache.unit;
            return;
        }
        case "discrete":
            slot.current = progress < 0.5 ? slot.from : slot.to;
    }
}

/** Rebind one computed slot to the animation's current target ownership. */
export function bindInterpSlotTarget(
    slot: InterpSlot,
    target: HTMLElement | undefined,
): void {
    if (slot.kind !== "computed" || slot.target === target) return;
    if (target === undefined) delete slot.target;
    else slot.target = target;
    slot.cache = undefined;
}

export function serializeInterpSlot(slot: InterpSlot): string {
    switch (slot.kind) {
        case "number":
            return `${slot.current}${slot.unit}`;
        case "color": {
            const serialized = serializeCssColor(slot.current as Parameters<typeof serializeCssColor>[0]);
            if (!serialized.ok) {
                throw new TypeError(`Color serialization failed: ${serialized.error.code}.`);
            }
            return serialized.value;
        }
        case "computed":
            return slot.cache === undefined
                ? serializeCssValue(slot.from)
                : `${slot.current}${slot.unit}`;
        case "discrete":
            return serializeCssValue(slot.current);
    }
}
