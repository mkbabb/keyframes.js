import { parseCssValues } from "@mkbabb/value.js/css";
import type { CssValue } from "@mkbabb/value.js/value";
import { describe, expect, it } from "vitest";
import {
    buildAuthoredSink,
    compileValuePair,
    interpolateCompiledValue,
    refreshAuthoredSink,
} from "../../src/animation/compile/value";
import type {
    AnimationLayerConfig,
} from "../../src/animation/constants";
import type { CompiledAnimationFrame } from "../../src/animation/compile/frame";
import { applyComposition } from "../../src/animation/engine/composition";
import { CompositeState } from "../../src/animation/group/composite";
import { residualBlendArm } from "../../src/animation/group/composite";
import {
    buildSoAPlans,
    groupSoABlendLayer,
} from "../../src/animation/group/soa";

const parse = (source: string): CssValue => {
    const result = parseCssValues(source);
    if (!result.ok) throw new TypeError(`Fixture did not parse: ${source}`);
    return result.value;
};

const authored = (value: number | string): CssValue =>
    typeof value === "number"
        ? {
              kind: "scalar",
              payload: { type: "number", value, unit: "" },
          }
        : parse(value);

const frame = (
    from: number | string,
    to: number | string,
    composition: "add" | "accumulate",
): CompiledAnimationFrame<Record<string, number | string>> => {
    const value = compileValuePair(authored(from), authored(to), {
        colorSpace: "oklab",
        property: "opacity",
    });
    interpolateCompiledValue(value, 0.5);
    const interpVars = { opacity: value };
    const sink = buildAuthoredSink<Record<string, number | string>>(interpVars);
    refreshAuthoredSink(sink);
    return {
        id: 1,
        start: { kind: "percent", value: 0 },
        ixs: { start: 0, stop: 1 },
        time: { start: 0, stop: 1 },
        flatVars: sink.flat,
        vars: sink.root,
        interpVars,
        allInterpVars: value.slots,
        _sink: sink,
        transform: () => {},
        timingFunction: { fn: (progress) => progress },
        composition,
    };
};

const layer = (
    op: AnimationLayerConfig["op"],
    weight = 1,
): AnimationLayerConfig => ({
    zIndex: 0,
    weight,
    op,
    enabled: true,
});

describe("structural composition and group blending", () => {
    it("composites directly into numeric interpolation slots", () => {
        const compiled = frame(0, 1, "add");
        const target = document.createElement("div");
        target.style.opacity = "0.25";

        applyComposition(compiled, {
            iteration: 0,
            target,
            compositionBase: new Map(),
            compositionPose: new Map(),
            compositionFallbackSeen: new Set(),
            diagnostics: [],
        });
        refreshAuthoredSink(compiled._sink);

        expect(compiled.flatVars.opacity).toBe(0.75);
    });

    it("reports non-numeric composition and preserves the authored value", () => {
        const compiled = frame("red", "blue", "add");
        const diagnostics: { code: string }[] = [];

        applyComposition(compiled, {
            iteration: 0,
            target: undefined,
            compositionBase: new Map(),
            compositionPose: new Map(),
            compositionFallbackSeen: new Set(),
            diagnostics: diagnostics as never,
        });
        refreshAuthoredSink(compiled._sink);

        expect(compiled.flatVars.opacity).toMatch(/^oklab\(/);
        expect(diagnostics).toMatchObject([{ code: "COMPOSITION_FALLBACK" }]);
    });

    it("adds and weights authored numeric values while strings replace", () => {
        const state = new CompositeState();
        state.configure(["x", "color"]);
        state.clear();
        state.copy("x", 2);
        state.copy("color", "red");

        residualBlendArm(
            layer("add"),
            { x: 3, color: "blue" },
            state.values,
            undefined,
            undefined,
            state,
        );
        expect(state.values).toEqual({ x: 5, color: "blue" });

        residualBlendArm(
            layer("replace", 0.25),
            { x: 9 },
            state.values,
            undefined,
            undefined,
            state,
        );
        expect(state.values.x).toBe(6);
    });

    it("folds numeric authored carriers through the stable SoA plan", () => {
        const owned = { x: 1 };
        const replace = {
            animation: {} as never,
            values: { x: 1 },
            layer: layer("replace"),
        };
        const additive = {
            animation: {} as never,
            values: { x: 2 },
            layer: layer("add"),
        };
        const { plans, compositeBuf } = buildSoAPlans(
            [replace, additive],
            null,
            owned,
        );

        expect(plans).toHaveLength(1);
        expect(compositeBuf).not.toBeNull();
        groupSoABlendLayer(compositeBuf!, plans[0]!);
        expect(owned.x).toBe(3);

        owned.x = 1;
        additive.values.x = 4;
        groupSoABlendLayer(compositeBuf!, plans[0]!);
        expect(owned.x).toBe(5);
    });
});
