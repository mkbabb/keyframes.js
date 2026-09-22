// SERVED MODEL: claude-fable-5-1
/**
 * X.KF.W11.e — G-KFW11-4: spring-plot INSTRUMENT TRUTH (kf-SpringTrace.md:140).
 *
 * The plot's derivations are exported from a plain `<script>` block of
 * `SpringTrace.vue` (L-10's extraction) and are tested here against the ENGINE'S
 * OWN samples and resolver — never against numbers written by hand:
 *
 *   (1) the resolved stops ARE `sampleNormalizedSpring`'s samples, at the horizon
 *       the axis names (`4 × response` s) — which binds N-1's axis unit to the
 *       emitter's default `maxDuration`;
 *   (2) the first/last plotted x is 0/100 (D-1 ≡ kf-SpringTarget M-3 — gate case
 *       (b) `.c` declared absent), and the CSS rule the component implements
 *       matches the engine's `resolveLinearStops` on anchors, two-position
 *       stops and the monotone clamp;
 *   (3) the parser is FAIL-EXPLICIT (D-12/L-6/C-4 + the filter cell);
 *   (4) L-14's coupling — the ceiling admits the drawn maximum at the ζ floor,
 *       and the floor the heatmap declares is not below the one the plot pins;
 *   (5) the mount: the axis is labelled in ms and moves with `response` while the
 *       trace does not (the N-1 decision), the ζ readout is lowercase ζ in the
 *       case-preserving register (D-2/N-4), the reference lines are bound to the
 *       same constants the mapping uses (L-5), and the figure carries its
 *       quantity as text (D-6's a11y posture).
 *
 * WHY THE SFC MODULE IS NARROWED AT RUNTIME. `check`'s second leg is plain `tsc`
 * over `tsconfig.test.json`, whose only knowledge of a `.vue` module is
 * `demo/env.d.ts`'s ambient shim — a default export and nothing else — so a named
 * import of an SFC export is a TS2339 in that program (the existing
 * `aurora-opacity-ceiling.test.ts` carries exactly that diagnostic). This file
 * imports the module as `unknown` and CHECKS the exports it needs at runtime,
 * failing loudly if one is missing: no cast, no shim edit (out of set), no
 * suppression. The root — an SFC's named exports invisible to plain `tsc` — is
 * named in the unit's receipt.
 */

import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

// The component itself, through the ambient shim (a default export is all plain
// `tsc` can know of an SFC — and all the mount needs).
import SpringTraceComponent from "../../../demo/scenes/spring/SpringTrace.vue";
import { DAMPING_AXIS } from "../../../demo/scenes/spring/SpringHeatmap.vue";

import { springLinearStops } from "../../../src/animation/physics/spring";
import { sampleNormalizedSpring } from "../../../src/animation/physics/spring/solver/sample";
import { resolveTimingFunction } from "../../../src/animation/compile/easing/registry";

// ─── The SFC's exports, narrowed by runtime check ─────────────────────────────

interface LinearStopPoint {
    t: number;
    v: number;
}

interface SpringTraceExports {
    resolveLinearStopPoints: (css: string) => LinearStopPoint[];
    tracePathOf: (points: readonly LinearStopPoint[]) => string;
    plotY: (v: number) => number;
    springHorizonMs: (response: number) => number;
    PLOT: { width: number; height: number; yTarget: number; yZero: number };
    PLOT_CEILING: number;
    PLOT_DAMPING_FLOOR: number;
}

const isStopPoints = (value: unknown): value is LinearStopPoint[] =>
    Array.isArray(value) &&
    value.every(
        (p: unknown) =>
            typeof p === "object" &&
            p !== null &&
            "t" in p &&
            "v" in p &&
            typeof p.t === "number" &&
            typeof p.v === "number",
    );

/** A named export of the module, proven present and of the given `typeof`. */
function member(module: object, name: string, kind: "function" | "number" | "object"): unknown {
    if (!(name in module)) throw new Error(`SpringTrace.vue exports no \`${name}\``);
    const value: unknown = Reflect.get(module, name);
    if (typeof value !== kind || value === null) {
        throw new Error(`SpringTrace.vue's \`${name}\` is not a ${kind}`);
    }
    return value;
}

function fn(module: object, name: string): (...args: unknown[]) => unknown {
    const value = member(module, name, "function");
    if (typeof value !== "function") throw new Error(`SpringTrace.vue's \`${name}\` is not callable`);
    return (...args: unknown[]): unknown => Reflect.apply(value, undefined, args);
}

function num(module: object, name: string): number {
    const value = member(module, name, "number");
    if (typeof value !== "number") throw new Error(`SpringTrace.vue's \`${name}\` is not a number`);
    return value;
}

function narrowSpringTraceModule(candidate: unknown): SpringTraceExports {
    if (typeof candidate !== "object" || candidate === null) {
        throw new Error("SpringTrace.vue did not resolve to a module object");
    }
    const resolver = fn(candidate, "resolveLinearStopPoints");
    const pathOf = fn(candidate, "tracePathOf");
    const y = fn(candidate, "plotY");
    const horizon = fn(candidate, "springHorizonMs");
    const plot = member(candidate, "PLOT", "object");
    if (typeof plot !== "object" || plot === null) throw new Error("SpringTrace.vue's `PLOT` is not an object");
    const expectNumber = (value: unknown, what: string): number => {
        if (typeof value !== "number") throw new Error(`SpringTrace.vue's ${what} did not return a number`);
        return value;
    };
    const expectString = (value: unknown, what: string): string => {
        if (typeof value !== "string") throw new Error(`SpringTrace.vue's ${what} did not return a string`);
        return value;
    };
    return {
        resolveLinearStopPoints: (css) => {
            const out = resolver(css);
            if (!isStopPoints(out)) throw new Error("resolveLinearStopPoints did not return {t, v}[]");
            return out;
        },
        tracePathOf: (points) => expectString(pathOf(points), "tracePathOf"),
        plotY: (v) => expectNumber(y(v), "plotY"),
        springHorizonMs: (response) => expectNumber(horizon(response), "springHorizonMs"),
        PLOT: {
            width: num(plot, "width"),
            height: num(plot, "height"),
            yTarget: num(plot, "yTarget"),
            yZero: num(plot, "yZero"),
        },
        PLOT_CEILING: num(candidate, "PLOT_CEILING"),
        PLOT_DAMPING_FLOOR: num(candidate, "PLOT_DAMPING_FLOOR"),
    };
}

const sfcModule: unknown = await import("../../../demo/scenes/spring/SpringTrace.vue");
const {
    resolveLinearStopPoints,
    tracePathOf,
    plotY,
    springHorizonMs,
    PLOT,
    PLOT_CEILING,
    PLOT_DAMPING_FLOOR,
} = narrowSpringTraceModule(sfcModule);

// ─── The engine's own emission grid ───────────────────────────────────────────

/** `springLinearStops`' defaults, as its source states them. */
const SAMPLE_COUNT = 24;
const SETTLE_THRESHOLD = 1e-3;
const STOP_COUNT = SAMPLE_COUNT + 2;

const ZETAS = [0.2, 0.45, 0.65, 0.86, 1.0, 1.5];
const RESPONSES = [0.1, 0.5, 1.2];

/** Evaluate a resolved stop list as the polyline CSS `linear()` draws. */
function polyline(points: readonly LinearStopPoint[], t: number): number {
    const first = points[0]!;
    const last = points[points.length - 1]!;
    if (t <= first.t) return first.v;
    if (t >= last.t) return last.v;
    for (let i = 0; i < points.length - 1; i++) {
        const a = points[i]!;
        const b = points[i + 1]!;
        if (t >= a.t && t <= b.t) {
            if (b.t === a.t) return b.v;
            return a.v + ((b.v - a.v) * (t - a.t)) / (b.t - a.t);
        }
    }
    throw new Error(`polyline: ${t} fell through the stop list`);
}

describe("SpringTrace — the resolved stops are the engine's own samples (L-10 · N-1)", () => {
    it("(1) every emitted stop resolves to sampleNormalizedSpring's value at the axis's horizon", () => {
        for (const dampingFraction of ZETAS) {
            for (const response of RESPONSES) {
                const css = springLinearStops({ response, dampingFraction });
                const points = resolveLinearStopPoints(css);
                expect(points).toHaveLength(STOP_COUNT);

                // The horizon the axis names is the horizon the emitter sampled at.
                const horizonSeconds = springHorizonMs(response) / 1000;
                const samples = sampleNormalizedSpring({
                    response,
                    dampingFraction,
                    sampleCount: SAMPLE_COUNT,
                    settleThreshold: SETTLE_THRESHOLD,
                    dt: horizonSeconds / (SAMPLE_COUNT + 1),
                });
                for (let i = 1; i <= SAMPLE_COUNT; i++) {
                    const point = points[i]!;
                    expect(point.t).toBeCloseTo(i / (SAMPLE_COUNT + 1), 9);
                    // The emitter prints 5 dp; the resolver must read exactly that.
                    expect(point.v).toBe(Number(samples[i - 1]!.toFixed(5)));
                }
            }
        }
    });

    it("(2a) the first and last plotted x are 0 and 100 — the anchors are hoisted before the fill (D-1 ≡ M-3)", () => {
        for (const dampingFraction of ZETAS) {
            const css = springLinearStops({ response: 0.5, dampingFraction });
            const points = resolveLinearStopPoints(css);
            expect(points[0]).toEqual({ t: 0, v: 0 });
            expect(points[points.length - 1]).toEqual({ t: 1, v: 1 });
            const d = tracePathOf(points);
            expect(d.startsWith(`M 0.00 ${plotY(0).toFixed(2)}`)).toBe(true);
            expect(d.endsWith(`L 100.00 ${plotY(1).toFixed(2)}`)).toBe(true);
            // The halved end-gaps reader-B named: the second stop sits at 4 %, not 2 %.
            expect(points[1]!.t).toBeCloseTo(0.04, 9);
        }
    });

    it("(2b) the resolver IS the CSS rule the engine runs — anchors, two-position stops, the monotone clamp, even runs", () => {
        const authored = [
            "linear(0.1, 0.9)", // implicit anchors only
            "linear(0, 0.25, 0.75, 1)", // one implicit interior run
            "linear(0, 0.5 25% 75%, 1)", // a two-position stop (L-11)
            "linear(0 0%, 0.2 60%, 0.4 40%, 1 100%)", // an out-of-order position → clamped
            "linear(0, 0.3 10%, 0.4, 0.5, 0.6 20%, 0.8, 1)", // mixed runs
        ];
        for (const css of authored) {
            const points = resolveLinearStopPoints(css);
            const engine = resolveTimingFunction(css);
            // Midpoints avoid sampling exactly ON a clamped (coincident) position,
            // where a polyline is discontinuous by definition.
            for (let k = 0; k < 100; k++) {
                const t = (k + 0.5) / 100;
                expect(polyline(points, t), `${css} @ t=${t}`).toBeCloseTo(engine(t), 9);
            }
        }
    });
});

describe("SpringTrace — the parser refuses what it cannot read (D-12 / L-6 / C-4)", () => {
    it("(3a) an unparseable stop is a SyntaxError naming its index — never a silent 0", () => {
        expect(() => resolveLinearStopPoints("linear(0, abc 50%, 1)")).toThrow(SyntaxError);
        expect(() => resolveLinearStopPoints("linear(0, abc 50%, 1)")).toThrow(/stop 1 "abc 50%"/);
        expect(() => resolveLinearStopPoints("linear(0, 0.5 50% 60% 70%, 1)")).toThrow(SyntaxError);
    });

    it("(3b) an EMPTY token is an error, not a dropped stop that renumbers the axis (the filter cell)", () => {
        expect(() => resolveLinearStopPoints("linear(0, , 1)")).toThrow(/stop 1 ""/);
        expect(() => resolveLinearStopPoints("linear(0, 0.5,)")).toThrow(SyntaxError);
    });

    it("(3c) a non-linear() string and a one-stop linear() are refused", () => {
        expect(() => resolveLinearStopPoints("ease-in-out")).toThrow(/expected a CSS linear\(\)/);
        expect(() => resolveLinearStopPoints("linear(1)")).toThrow(/at least two stops/);
        expect(() => resolveLinearStopPoints("")).toThrow(SyntaxError);
    });
});

describe("SpringTrace — the ceiling's coupling to the ζ floor (L-14, documented AND enforced)", () => {
    it("(4a) at the pinned floor, across the response range, the drawn maximum stays inside the frame", () => {
        expect(PLOT_CEILING).toBeCloseTo(PLOT.yZero / (PLOT.yZero - PLOT.yTarget), 12);
        for (const response of [0.1, 0.3, 0.5, 0.8, 1.2]) {
            const css = springLinearStops({ response, dampingFraction: PLOT_DAMPING_FLOOR });
            const points = resolveLinearStopPoints(css);
            const peak = Math.max(...points.map((p) => p.v));
            expect(peak).toBeLessThan(PLOT_CEILING);
            expect(plotY(peak)).toBeGreaterThan(0);
        }
    });

    it("(4b) the floor the heatmap declares is not below the one the plot pins", () => {
        // Bound to the heatmap's shipped export, not a regex over its source:
        // the ζ axis floor the heatmap lets a user reach is `DAMPING_AXIS.min`.
        expect(DAMPING_AXIS.min).toBeGreaterThanOrEqual(PLOT_DAMPING_FLOOR);
    });
});

describe("SpringTrace — the mount (N-1 · D-2/N-4 · L-5 · D-6)", () => {
    // `Math.max(...)` over the resolved points — the K-5-correct form.
    const peakOf = (response: number, dampingFraction: number) =>
        Math.max(...resolveLinearStopPoints(springLinearStops({ response, dampingFraction })).map((p) => p.v));

    it("(5a) the time axis is labelled in ms and follows response; the trace does not", async () => {
        const wrapper = mount(SpringTraceComponent, {
            props: { response: 0.5, dampingFraction: 0.2 },
        });
        try {
            const ticks = wrapper.findAll(".plot-tick");
            const horizon = () => ticks[ticks.length - 1]!.text();
            expect(horizon()).toBe("2000 ms");
            const before = wrapper.find(".plot-trace").attributes("d");
            expect(before?.startsWith("M 0.00")).toBe(true);
            expect(before?.includes("L 100.00")).toBe(true);

            await wrapper.setProps({ response: 1.2 });
            expect(horizon()).toBe("4800 ms");
            // The record's own dist run: byte-identical emission at ζ = 0.2 across
            // response 0.1 ↔ 1.2 — the axis moved, the shape did not.
            expect(wrapper.find(".plot-trace").attributes("d")).toBe(before);
        } finally {
            wrapper.unmount();
        }
    });

    it("(5b) the readout is lowercase ζ in the case-preserving mono register, wearing the live accent", () => {
        const wrapper = mount(SpringTraceComponent, {
            props: { response: 0.5, dampingFraction: 0.86 },
        });
        try {
            const readout = wrapper.find(".readout-accent.code-token");
            expect(readout.exists()).toBe(true);
            expect(readout.classes()).toContain("tabular-nums");
            expect(readout.classes()).not.toContain("text-mono-caption");
            // No ELEMENT wears the uppercasing utility (the template's own comment
            // names it, so this is a query, not a substring search).
            expect(wrapper.findAll(".text-mono-caption")).toHaveLength(0);
            expect(readout.text()).toContain("ζ 0.86");
            expect(readout.text()).toContain(`peak ${peakOf(0.5, 0.86).toFixed(3)}`);
        } finally {
            wrapper.unmount();
        }
    });

    it("(5c) the reference lines and the value ticks are bound to the plot's own constants", () => {
        const wrapper = mount(SpringTraceComponent, {
            props: { response: 0.5, dampingFraction: 0.65 },
        });
        try {
            const target = wrapper.find(".plot-target-line");
            const baseline = wrapper.find(".plot-baseline");
            expect(Number(target.attributes("y1"))).toBe(PLOT.yTarget);
            expect(Number(target.attributes("y2"))).toBe(PLOT.yTarget);
            expect(Number(baseline.attributes("y1"))).toBe(PLOT.yZero);
            expect(Number(target.attributes("x2"))).toBe(PLOT.width);
            for (const svg of wrapper.findAll("svg")) {
                expect(svg.attributes("viewBox")).toBe(`0 0 ${PLOT.width} ${PLOT.height}`);
            }
            const ticks = wrapper.findAll(".plot-tick--value");
            expect(ticks.map((tick) => tick.text())).toEqual(["1", "0"]);
            expect(ticks[0]!.attributes("style")).toContain(`top: ${(PLOT.yTarget / PLOT.height) * 100}%`);
            expect(ticks[1]!.attributes("style")).toContain(`top: ${(PLOT.yZero / PLOT.height) * 100}%`);
        } finally {
            wrapper.unmount();
        }
    });

    it("(5d) the figure carries its quantity as text; the marks beneath it are presentational", () => {
        const wrapper = mount(SpringTraceComponent, {
            props: { response: 0.5, dampingFraction: 0.45 },
        });
        try {
            const figure = wrapper.find("[role='img']");
            expect(figure.exists()).toBe(true);
            const label = figure.attributes("aria-label") ?? "";
            expect(label).toContain(`${STOP_COUNT} linear() stops`);
            expect(label).toContain("2000 ms");
            expect(label).toContain(`peaking at ${peakOf(0.5, 0.45).toFixed(3)}`);
            for (const svg of wrapper.findAll("svg")) {
                expect(svg.attributes("aria-hidden")).toBe("true");
            }
        } finally {
            wrapper.unmount();
        }
    });
});
