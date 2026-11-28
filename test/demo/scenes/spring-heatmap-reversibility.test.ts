/**
 * X.KF.W11.f — G-KFW11-5's witness (the spring-physics-facet packet).
 *
 * Born RED against `0e604af8` (`No test files found`). The cases are the home
 * records' own born-RED obligations (`kf-SpringHeatmap.md` L-m-5 and
 * `kf-SpringPhysicsFacet.md` SPF-3):
 *
 *   (1) L-M-1 — the REVERSIBILITY PROPERTY. The arrow path and the pointer path
 *       share ONE lattice, and every unclamped arrow step is exactly invertible
 *       from every value on the sliders' hundredths grid. The shipped step was a
 *       half-hundredth (0.055 / 0.065) re-rounded to the grid, so right-then-left
 *       failed for 84 of 111 response values and 95 of 131 damping values.
 *
 *   (2) N-SH-4 — the ONE PUBLISHED TOLERANCE. A click lands within
 *       `LATTICE.tolerance` (half a pitch) of the pointer's true value, on both
 *       axes, for every pointer position. The shipped `HALF_CELL_*` expose
 *       published 0.0275 / 0.0325 while the true worst case was 0.0325 / 0.0375.
 *
 *   (3) FIFTY-FOURTH (owner, 23 Nov 2026: "rediesng this") — the banded
 *       (response × damping) field is retired for the chart of peak overshoot
 *       against damping. Its curve is the exact analytic overshoot, one point
 *       per hundredth of damping, re-derived here from the formula; the presets
 *       sit on it where the physics puts them. (D-B2's mix table went with the
 *       ramp it described.)
 *
 *   (4) SPF-3, re-seated by X.KF.W13V.y (OA-51: "presets … with no sliders
 *       inside them") — the in-tile preset-ball painter is RETIRED with the
 *       tile's track (the four presets' live race is the stage's derby). What
 *       stands: the four analytic peaks (1.005 / 1.068 / 1.205 / 1.000), and
 *       each preset TILE states its physics as text — its name and one line of
 *       its parameters — with no rail, ball or slider inside it.
 *
 *   (5) The contract + the surface — the chart mounts on two numbers alone
 *       (L-M-7 / C-M-2 / C-M-3), is a slider over the damping that labels its
 *       own axes, writes the damping alone (the response stays on its slider),
 *       glides its ball along the curve, and the presets are radios in a
 *       labelled group (SPF-4), asserted on the REAL producer component.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick, ref } from "vue";

/**
 * THE PRODUCER REALM WALL, answered the way this suite already answers it
 * (`starting-style-artifact.test.ts`): `@mkbabb/glass-ui`'s Card chunk imports
 * `@mkbabb/keyframes.js` from inside `node_modules`, where vitest's alias does
 * not reach, so the facet's Card / LabeledSlider become slot-rendering stubs.
 * The ToggleGroup is NOT stubbed — SPF-4's semantics are asserted on the real
 * producer component. The KeyframesEditor is stubbed: it is the cube's editor,
 * not this packet's subject. `vitest.config.ts` (the durable cure) is outside
 * this unit's §Bounds and is not reached for.
 */
const stub = vi.hoisted(() => ({
    module: async (entries: Record<string, string>) => {
        const { defineComponent, h } = await import("vue");
        return Object.fromEntries(
            Object.entries(entries).map(([name, tag]) => [
                name,
                defineComponent({
                    name,
                    inheritAttrs: false,
                    setup: (_props, { slots, attrs }) =>
                        () =>
                            h(tag, { ...attrs, "data-stub": name }, slots.default?.()),
                }),
            ]),
        );
    },
}));
vi.mock("@mkbabb/glass-ui", () => stub.module({ Card: "div", CardContent: "div", Separator: "hr" }));
vi.mock("@mkbabb/glass-ui/labeled-field", () => stub.module({ LabeledSlider: "div" }));

import SpringHeatmap, {
    AREA_D,
    CURVE_D,
    DAMPING_AXIS,
    LATTICE,
    OVERSHOOT_CEILING,
    OVERSHOOT_MAX,
    PARAM_STEP,
    PRESET_PIPS,
    RESPONSE_AXIS,
    axisNodes,
    chartX,
    chartY,
    nodeValue,
    overshoot,
    overshootCurve,
    snapToAxis,
    stepOnAxis,
} from "../../../demo/scenes/spring/SpringHeatmap.vue";
import type { ParamAxis } from "../../../demo/scenes/spring/SpringHeatmap.vue";
import SpringPhysicsFacet from "../../../demo/scenes/spring/SpringPhysicsFacet.vue";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";
import { SPRING_PRESETS } from "../../../demo/scenes/spring/springPresets";
import { useSpringDemo } from "../../../demo/scenes/spring/useSpringDemo";
import { warmKfEngine } from "../../../demo/kf-engine";
import { withSetup } from "../../support/withSetup";

/** Every value on the sliders' hundredths grid across `axis`, inclusive. */
function gridValues(axis: ParamAxis): number[] {
    const lo = Math.round(axis.min * 100);
    const hi = Math.round(axis.max * 100);
    return Array.from({ length: hi - lo + 1 }, (_, i) => (lo + i) / 100);
}

// ─── (1) L-M-1 — reversibility on one lattice ─────────────────────────────────

describe("X.KF.W11.f (1) — L-M-1: every unclamped arrow step is exactly invertible", () => {
    it.each([
        ["response", RESPONSE_AXIS, 111],
        ["damping", DAMPING_AXIS, 131],
    ] as const)("%s — from all %i grid values, in both directions", (_name, axis, count) => {
        const values = gridValues(axis);
        expect(values).toHaveLength(count);
        let unclamped = 0;
        for (const v of values) {
            for (const dir of [1, -1] as const) {
                const there = stepOnAxis(v, dir, axis);
                const moved = Math.abs(there - v) > 0;
                if (!moved) continue; // a refused step at the range end
                if (Math.abs(Math.abs(there - v) - axis.pitch) < 1e-12) {
                    unclamped++;
                    const back = stepOnAxis(there, dir === 1 ? -1 : 1, axis);
                    expect(back).toBe(v);
                } else {
                    // a clamped step lands on the range end — itself a node
                    expect(there === axis.min || there === axis.max).toBe(true);
                }
            }
        }
        // the banked failures (84/111 · 95/131) cannot recur: nearly every step is a full pitch
        expect(unclamped).toBeGreaterThan(count * 2 - 12);
    });

    it("the pointer path and the arrow path walk the SAME nodes", () => {
        for (const axis of [RESPONSE_AXIS, DAMPING_AXIS]) {
            const n = axisNodes(axis);
            for (let k = 0; k < n; k++) {
                const here = nodeValue(k, axis);
                expect(snapToAxis(k / n, axis)).toBe(here);
                expect(stepOnAxis(here, 1, axis)).toBe(nodeValue(k + 1, axis));
                expect(stepOnAxis(nodeValue(k + 1, axis), -1, axis)).toBe(here);
            }
            expect(nodeValue(0, axis)).toBe(axis.min);
            expect(nodeValue(n, axis)).toBe(axis.max);
        }
    });

    it("every node lies on the sliders' hundredths grid (no re-quantisation exists)", () => {
        for (const axis of [RESPONSE_AXIS, DAMPING_AXIS]) {
            for (let k = 0; k <= axisNodes(axis); k++) {
                const v = nodeValue(k, axis);
                expect(Math.round(v / PARAM_STEP) * PARAM_STEP).toBeCloseTo(v, 12);
            }
        }
    });
});

// ─── (2) N-SH-4 — the one honest published tolerance ──────────────────────────

describe("X.KF.W11.f (2) — N-SH-4: a click lands within the published tolerance", () => {
    it.each([
        ["response", RESPONSE_AXIS],
        ["damping", DAMPING_AXIS],
    ] as const)("%s — |snap(f) − true(f)| ≤ LATTICE.tolerance for a dense sweep", (_name, axis) => {
        expect(LATTICE.tolerance).toBe(LATTICE.pitch / 2);
        expect(axis.pitch).toBe(LATTICE.pitch);
        let worst = 0;
        const steps = 10007; // a prime: the sweep never lands only on nodes
        for (let i = 0; i <= steps; i++) {
            const f = i / steps;
            const truth = axis.min + f * (axis.max - axis.min);
            worst = Math.max(worst, Math.abs(snapToAxis(f, axis) - truth));
        }
        expect(worst).toBeLessThanOrEqual(LATTICE.tolerance + 1e-12);
        // and the bound is TIGHT — the worst case is reached, not padded
        expect(worst).toBeGreaterThan(LATTICE.tolerance - 1e-3);
    });
});

// ─── (3) FIFTY-FOURTH — the chart is the exact overshoot over damping ────────
// The field's banded ramp (D-B2) is retired with the field: the owner asked
// for the "Peak overshoot" chart to be redesigned (23 Nov 2026), and it is now
// the curve itself. What D-B2 held of the ramp (exact, analytic, one value per
// damping node, normalised, presets where the physics puts them) is held here
// of the curve, re-derived from the formula rather than copied.

/** The formula, re-executed here rather than imported from the component. */
const analytic = (zeta: number): number =>
    zeta >= 1 ? 0 : Math.exp((-zeta * Math.PI) / Math.sqrt(1 - zeta * zeta));

describe("FIFTY-FOURTH (3) — the chart draws the exact peak overshoot over damping", () => {
    it("one point per hundredth of damping, each at the analytic overshoot under a 60 % ceiling", () => {
        const pts = overshootCurve();
        expect(pts).toHaveLength(131);
        expect(pts[0]!.zeta).toBe(DAMPING_AXIS.min);
        expect(pts.at(-1)!.zeta).toBe(DAMPING_AXIS.max);
        expect(OVERSHOOT_CEILING).toBe(0.6);
        expect(OVERSHOOT_MAX).toBeCloseTo(analytic(0.2), 12);
        expect(OVERSHOOT_MAX).toBeLessThan(OVERSHOOT_CEILING);
        for (const p of pts) {
            const x = ((p.zeta - DAMPING_AXIS.min) / (DAMPING_AXIS.max - DAMPING_AXIS.min)) * 1000;
            const y = (1 - analytic(p.zeta) / 0.6) * 1000;
            expect(p.x).toBeCloseTo(x, 9);
            expect(p.y).toBeCloseTo(y, 9);
            expect(chartX(p.zeta)).toBeCloseTo(x / 1000, 12);
            expect(chartY(analytic(p.zeta))).toBeCloseTo(y / 1000, 12);
        }
        // Falling while it rings, on the baseline from ζ = 1 on.
        for (let i = 1; i < pts.length; i++) {
            expect(pts[i]!.y).toBeGreaterThanOrEqual(pts[i - 1]!.y);
            if (pts[i]!.zeta < 1) expect(pts[i]!.y).toBeGreaterThan(pts[i - 1]!.y);
            else expect(pts[i]!.y).toBe(1000);
        }
    });

    it("the path is that polyline, and its area closes on the baseline", () => {
        const pts = overshootCurve();
        const verts = CURVE_D.split(/[ML]/).map((s) => s.trim()).filter(Boolean);
        expect(verts).toHaveLength(pts.length);
        for (const [i, v] of verts.entries()) {
            const [x, y] = v.split(" ").map(Number);
            expect(x).toBeCloseTo(pts[i]!.x, 1);
            expect(y).toBeCloseTo(pts[i]!.y, 1);
        }
        expect(AREA_D.startsWith(CURVE_D)).toBe(true);
        expect(AREA_D.endsWith("L 1000 1000 L 0 1000 Z")).toBe(true);
    });

    it("the presets sit on the curve where the physics puts them: gentle and smooth at the baseline, snappy and bouncy above", () => {
        expect(PRESET_PIPS.map((p) => p.name)).toEqual(
            [...SPRING_PRESETS].sort((a, b) => a.dampingFraction - b.dampingFraction).map((p) => p.name),
        );
        for (const pip of PRESET_PIPS) {
            expect(pip.left).toBe(`${(((pip.zeta - 0.2) / 1.3) * 100).toFixed(3)}%`);
            expect(pip.top).toBe(`${((1 - analytic(pip.zeta) / 0.6) * 100).toFixed(3)}%`);
        }
        const peak = Object.fromEntries(SPRING_PRESETS.map((p) => [p.name, analytic(p.dampingFraction) * 100]));
        expect(peak.gentle).toBe(0);
        expect(peak.smooth).toBeLessThanOrEqual(1);
        expect(peak.snappy).toBeGreaterThan(peak.smooth! + 5);
        expect(peak.bouncy).toBeGreaterThan(peak.snappy! + 10);
        // smooth's name does not take the side gentle's needs (0.14 apart on the baseline).
        expect(PRESET_PIPS.find((p) => p.name === "smooth")!.side).toBe("above");
        expect(PRESET_PIPS.filter((p) => p.name !== "smooth").every((p) => p.side === "after")).toBe(true);
    });

    it("overshoot() is total, and the chart's domain never reaches its ζ ≤ 0 arm", () => {
        expect(overshoot(1)).toBe(0);
        expect(overshoot(1.5)).toBe(0);
        expect(overshoot(0)).toBe(1);
        for (const { zeta } of overshootCurve()) expect(zeta).toBeGreaterThan(0);
    });
});

// ─── (5a) the contract and the axes — the chart mounts on two numbers ────────

describe("FIFTY-FOURTH (5a) — the chart mounts on two models, labels its axes and sets the damping alone", () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    /** A real parent: two refs bound through the two models, the way the facet binds them. */
    function mountField(response = 0.5, dampingFraction = 0.86) {
        const Host = defineComponent({
            setup() {
                const r = ref(response);
                const d = ref(dampingFraction);
                return { r, d };
            },
            render() {
                return h(SpringHeatmap, {
                    response: this.r,
                    dampingFraction: this.d,
                    "onUpdate:response": (v: number) => {
                        this.r = v;
                    },
                    "onUpdate:dampingFraction": (v: number) => {
                        this.d = v;
                    },
                });
            },
        });
        return mount(Host, { attachTo: document.body });
    }

    it("instantiates with nothing but two numbers: a damping slider that reads them back", () => {
        const wrapper = mount(SpringHeatmap, { props: { response: 0.35, dampingFraction: 0.65 } });
        try {
            const field = wrapper.get('[role="slider"]');
            const readout = wrapper.get(`#${field.attributes("aria-describedby")}`);
            expect(readout.text()).toBe("0.35 s / ζ 0.65");
            expect(field.attributes("aria-valuemin")).toBe("0.2");
            expect(field.attributes("aria-valuemax")).toBe("1.5");
            expect(field.attributes("aria-valuenow")).toBe("0.65");
            expect(field.attributes("aria-valuetext")).toBe(
                `damping 0.65, ${Math.round(analytic(0.65) * 100)} % overshoot`,
            );
            expect(field.attributes("aria-label")).toContain("damping ζ 0.2 to 1.5 across");
            expect(field.attributes("aria-label")).toContain(`move by ${LATTICE.pitch}`);
            // No banded field any more: the chart paints no gradient of its own.
            expect(field.attributes("style") ?? "").not.toContain("linear-gradient");
        } finally {
            wrapper.unmount();
        }
    });

    it("labels its axes and marks ζ = 1; the four presets are plotted on the curve and named; the reading names the live spring", () => {
        const wrapper = mount(SpringHeatmap, { props: { response: 0.5, dampingFraction: 0.86 } });
        try {
            const critical = wrapper.get(".spring-heatmap-critical");
            expect(critical.attributes("style")).toContain(`left: ${(((1 - 0.2) / 1.3) * 100).toFixed(3)}%`);
            expect(wrapper.findAll(".spring-heatmap-y > span").map((s) => s.text())).toEqual(["50 %", "0"]);
            expect(wrapper.findAll(".spring-heatmap-x > span").map((s) => s.text())).toEqual([
                "0.2",
                "damping ζ",
                "1",
                "1.5",
            ]);
            expect(wrapper.get(".spring-heatmap-curve").attributes("d")).toBe(CURVE_D);
            const pips = wrapper.findAll(".spring-heatmap-pip");
            expect(pips.map((p) => p.text())).toEqual(PRESET_PIPS.map((p) => p.name));
            for (const [i, pip] of pips.entries()) {
                const top = /top: ([\d.]+)%/.exec(pip.attributes("style") ?? "")?.[1];
                expect(Number(top)).toBeCloseTo(Number.parseFloat(PRESET_PIPS[i]!.top), 3);
            }
            // the live spring sits on smooth: its mark is the current one, and the reading names it
            expect(wrapper.findAll(".spring-heatmap-pip.is-current").map((p) => p.text())).toEqual(["smooth"]);
            expect(wrapper.get("[data-figure-legend]").text()).toBe(
                `smooth · ζ 0.86 → ${Math.round(analytic(0.86) * 100)} %`,
            );
            // the ball stands on the curve at the live damping
            const ball = wrapper.get(".spring-heatmap-marker").attributes("style") ?? "";
            expect(ball).toContain(`translate(${(chartX(0.86) * 100).toFixed(3)}cqw, ${(chartY(analytic(0.86)) * 100).toFixed(3)}cqh)`);
        } finally {
            wrapper.unmount();
        }
    });

    it("the slider's keys step the damping and are claimed; a modified arrow is left alone; the response never moves", async () => {
        const wrapper = mountField(0.5, 0.86);
        const key = async (k: string, init: KeyboardEventInit = {}) => {
            const e = new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true, ...init });
            const stop = vi.spyOn(e, "stopPropagation");
            wrapper.get('[role="slider"]').element.dispatchEvent(e);
            await nextTick();
            return { e, stop };
        };
        try {
            const right = await key("ArrowRight");
            expect(wrapper.vm.d).toBe(0.91);
            expect(right.e.defaultPrevented).toBe(true);
            expect(right.stop).toHaveBeenCalledTimes(1);
            await key("ArrowLeft");
            expect(wrapper.vm.d).toBe(0.86); // reversible

            const alt = await key("ArrowLeft", { altKey: true });
            expect(wrapper.vm.d).toBe(0.86);
            expect(alt.e.defaultPrevented).toBe(false);

            await key("ArrowUp");
            expect(wrapper.vm.d).toBe(0.91);
            await key("ArrowDown");
            expect(wrapper.vm.d).toBe(0.86);
            await key("Home");
            expect(wrapper.vm.d).toBe(DAMPING_AXIS.min);
            await key("End");
            expect(wrapper.vm.d).toBe(DAMPING_AXIS.max);
            await key("PageDown");
            expect(wrapper.vm.d).toBe(1.25);
            expect(wrapper.get('[aria-live="polite"]').text()).toBe("damping 1.25, 0 % overshoot");
            expect(wrapper.vm.r).toBe(0.5);
        } finally {
            wrapper.unmount();
        }
    });

    it("a primary pointer writes the nearest damping and sweeps it; the response stays; a second pointer and a secondary button are refused", async () => {
        const wrapper = mountField(0.5, 0.86);
        try {
            const el = wrapper.get('[role="slider"]').element as HTMLElement;
            // jsdom lays nothing out: give the chart a 260 px content box at x 0
            vi.spyOn(el, "clientWidth", "get").mockReturnValue(260);
            vi.spyOn(el, "clientHeight", "get").mockReturnValue(160);
            vi.spyOn(el, "getBoundingClientRect").mockReturnValue({ left: 0, top: 0, width: 260, height: 160 } as DOMRect);
            el.setPointerCapture = () => {};
            el.releasePointerCapture = () => {};
            const down = (init: PointerEventInit) =>
                el.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, isPrimary: true, button: 0, ...init }));

            // x = 130 of 260 → f 0.5 → node 13 of 26 → ζ 0.85; y plays no part
            down({ pointerId: 1, clientX: 130, clientY: 150 });
            await nextTick();
            expect(wrapper.vm.d).toBe(0.85);
            expect(wrapper.vm.r).toBe(0.5);

            down({ pointerId: 2, clientX: 0, clientY: 0 });
            await nextTick();
            expect(wrapper.vm.d).toBe(0.85);

            el.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, pointerId: 1, clientX: 260, clientY: 0 }));
            await nextTick();
            expect(wrapper.vm.d).toBe(DAMPING_AXIS.max);
            expect(wrapper.vm.r).toBe(0.5);

            el.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerId: 1 }));
            down({ pointerId: 3, button: 2, clientX: 0, clientY: 0 });
            await nextTick();
            expect(wrapper.vm.d).toBe(DAMPING_AXIS.max);
        } finally {
            wrapper.unmount();
        }
    });

    it("a change glides the ball ALONG the curve: every frame of the move stands on it", async () => {
        vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"] });
        const wrapper = mountField(0.5, 0.86);
        try {
            const ball = () => {
                const m = /translate\(([-\d.]+)cqw, ([-\d.]+)cqh\)/.exec(
                    wrapper.get(".spring-heatmap-marker").attributes("style") ?? "",
                );
                return { x: Number(m![1]) / 100, y: Number(m![2]) / 100 };
            };
            wrapper.vm.d = 0.45; // an isolated write (a preset pick)
            await nextTick();
            const seen: { x: number; y: number }[] = [];
            for (let i = 0; i < 24; i++) {
                vi.advanceTimersByTime(16);
                await nextTick();
                seen.push(ball());
            }
            const between = seen.filter((p) => p.x > chartX(0.45) + 0.01 && p.x < chartX(0.86) - 0.01);
            expect(between.length).toBeGreaterThanOrEqual(3);
            for (const p of seen) {
                const zeta = 0.2 + p.x * 1.3;
                expect(p.y).toBeCloseTo(1 - analytic(zeta) / 0.6, 2);
            }
            expect(seen.at(-1)!.x).toBeCloseTo(chartX(0.45), 3);
        } finally {
            wrapper.unmount();
        }
    });
});

// ─── (4) SPF-3 (re-seated X.KF.W13V.y) — the presets' analytic peaks ────────

/** The four presets' analytic first-peak amplitudes, re-derived from `overshoot()`. */
const PRESET_PEAKS = SPRING_PRESETS.map((p) => 1 + overshoot(p.dampingFraction));

describe("X.KF.W11.f (4) — SPF-3 (re-seated X.KF.W13V.y): the presets' analytic peaks", () => {
    it("the four analytic peaks are 1.005 / 1.068 / 1.205 / 1.000, ordered by overshoot", () => {
        expect(PRESET_PEAKS.map((v) => Number(v.toFixed(3)))).toEqual([1.005, 1.068, 1.205, 1.0]);
        expect(PRESET_PEAKS[2]).toBeGreaterThan(PRESET_PEAKS[1]!);
        expect(PRESET_PEAKS[1]).toBeGreaterThan(PRESET_PEAKS[0]!);
        expect(PRESET_PEAKS[0]).toBeGreaterThan(PRESET_PEAKS[3]!);
    });
});

// ─── (5b) the facet — the painter on real elements, the group on the real producer ─

describe("X.KF.W11.f (5b) — the facet: trackless preset tiles; the presets are one labelled exclusive group", () => {
    beforeAll(async () => {
        await warmKfEngine();
    });

    /** The real scene context; `prepare` runs between its creation and the
     *  facet's mount (the tiles are static text since X.KF.W13V.y retired the
     *  in-tile painter, so no caller needs it to seed live values). */
    function mountFacet(prepare?: (demo: ReturnType<typeof useSpringDemo>) => void) {
        const [demo, app] = withSetup(() => useSpringDemo());
        prepare?.(demo);
        // The app mounts every surface under glass's TooltipProvider; the facet's
        // header action carries a Tooltip (X.KF.W13X.spring A2-KE-L3-9).
        const wrapper = mount(
            { render: () => h(TooltipProvider, null, { default: () => h(SpringPhysicsFacet, { demo }) }) },
            { attachTo: document.body },
        );
        return {
            demo,
            wrapper,
            teardown: () => {
                wrapper.unmount();
                app.unmount();
            },
        };
    }

    it("OA-51 + owner-1112 [45] on the DOM — a preset tile holds its name alone, and no rail, ball or slider", async () => {
        const { wrapper, teardown } = mountFacet();
        try {
            await nextTick();
            const cells = wrapper.findAll(".preset-cell");
            expect(cells).toHaveLength(4);
            cells.forEach((cell, i) => {
                const p = SPRING_PRESETS[i]!;
                expect(cell.text().trim()).toBe(p.name);
                expect(cell.findAll(".preset-values, .tabular-nums")).toHaveLength(0);
                expect(cell.findAll('.progress-rail, .progress-ball, [role="slider"]')).toHaveLength(0);
            });
        } finally {
            teardown();
        }
    });

    it("SPF-4 — a labelled group of exactly-one-pressed items that cannot be emptied", async () => {
        const { demo, wrapper, teardown } = mountFacet();
        try {
            const group = wrapper.get(".preset-grid");
            // [X.KF.W13R.m, glass 10.0.1] the producer's selection engine
            // (BK #84 W-TOGGLE-ROW, 60a64339) speaks role-per-mode ARIA: a
            // one-of-N chooser is a `radiogroup` of `radio`s carrying
            // `aria-checked` (it was reka's `group` + `aria-pressed`). The
            // property is unchanged: labelled, exclusive, never emptied by a
            // click, emptied honestly by an off-preset write.
            expect(group.attributes("role")).toBe("radiogroup");
            expect(group.attributes("aria-label")).toBe("Spring presets");
            const cells = () => wrapper.findAll(".preset-cell");
            expect(cells()).toHaveLength(4);
            expect(cells().map((c) => c.attributes("role"))).toEqual(["radio", "radio", "radio", "radio"]);
            const pressed = () => cells().map((c) => c.attributes("aria-checked"));
            // the scene opens on the smooth preset (0.5 / 0.86)
            expect(pressed()).toEqual(["true", "false", "false", "false"]);
            // owner-1112 [45] — the blurb is a glass tooltip, never a native title.
            expect(cells().map((c) => c.attributes("title"))).toEqual([undefined, undefined, undefined, undefined]);

            await cells()[2]!.trigger("click"); // bouncy
            await nextTick();
            expect(demo.response.value).toBe(SPRING_PRESETS[2]!.response);
            expect(demo.dampingFraction.value).toBe(SPRING_PRESETS[2]!.dampingFraction);
            expect(pressed()).toEqual(["false", "false", "true", "false"]);

            await cells()[2]!.trigger("click"); // the active cell again — a deselect, refused
            await nextTick();
            expect(pressed()).toEqual(["false", "false", "true", "false"]);
            expect(demo.dampingFraction.value).toBe(SPRING_PRESETS[2]!.dampingFraction);

            // a slider-side write off every preset empties the selection honestly
            demo.dampingFraction.value = 0.7;
            await nextTick();
            expect(pressed()).toEqual(["false", "false", "false", "false"]);
        } finally {
            teardown();
        }
    });

    it("SPF-7 / SPF-5 — the facet's scoped paint carries no importance flag and washes at 6 % / 8 %", async () => {
        const { readFileSync } = await import("node:fs");
        const { resolve } = await import("node:path");
        const src = readFileSync(resolve(process.cwd(), "demo/scenes/spring/SpringPhysicsFacet.vue"), "utf8");
        const style = src.slice(src.indexOf("<style scoped>"));
        expect(style).not.toContain("!important");
        expect(style).toMatch(/\.preset-cell:hover\s*\{[^}]*var\(--color-progress\) 6%/);
        expect(style).toMatch(/\.preset-cell\[aria-checked="true"\]\s*\{[^}]*var\(--color-progress\) 8%/);
        expect(src).not.toContain("spring-pane");
    });

    it("KF-C15-01 — selection is a solid ring; the dashed stroke stays the final-state / target ghost's alone", async () => {
        const { readFileSync } = await import("node:fs");
        const { resolve } = await import("node:path");
        const src = readFileSync(resolve(process.cwd(), "demo/scenes/spring/SpringPhysicsFacet.vue"), "utf8");
        const style = src.slice(src.indexOf("<style scoped>")).replace(/\/\*[\s\S]*?\*\//g, "");
        expect(style).toMatch(/\.preset-cell\s*\{[^}]*outline:\s*1px solid transparent/);
        expect(style).not.toMatch(/dashed/);
    });
});
