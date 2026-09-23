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
 *   (3) D-B2 — the MIX-TABLE SNAPSHOT. The ramp is linear in the exact analytic
 *       overshoot, normalised to the field's own maximum, one band per damping
 *       node; the table is computed from the formula here and frozen, and the
 *       field's own `background-image` carries exactly those bands. The shipped
 *       ramp painted nine of twenty rows pixel-identical to the surface.
 *
 *   (4) SPF-3 — the PRESET-BALL PAINTER expresses the four presets' analytic
 *       peaks (1.005 / 1.068 / 1.205 / 1.000): distinct, monotone in overshoot,
 *       and unclamped, on a stated geometry (rest at 1/6 of the track, the
 *       target at 5/6, ±0.25 of headroom). The shipped painter clamped to [0, 1]
 *       and painted all four peaks at the same pixel.
 *
 *   (5) The contract + the surface — the heatmap mounts on two numbers alone
 *       (L-M-7 / C-M-2 / C-M-3), the legend labels the vertical axis it
 *       describes (D-B1), and the presets are radios in a labelled group
 *       (SPF-4), asserted on the REAL producer component.
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
vi.mock("@mkbabb/glass-ui", () => stub.module({ Card: "div", CardContent: "div" }));
vi.mock("@mkbabb/glass-ui/labeled-field", () => stub.module({ LabeledSlider: "div" }));
vi.mock("@components/instrument/keyframes/KeyframesEditor.vue", async () => ({
    default: (await stub.module({ KeyframesEditor: "div" })).KeyframesEditor,
}));

import SpringHeatmap, {
    DAMPING_AXIS,
    FIELD_RAMP,
    LATTICE,
    OVERSHOOT_MAX,
    PARAM_STEP,
    RESPONSE_AXIS,
    axisNodes,
    buildFieldRamp,
    dampingNodesTopDown,
    nodeValue,
    overshoot,
    rampMix,
    snapToAxis,
    stepOnAxis,
} from "../../../demo/scenes/spring/SpringHeatmap.vue";
import type { ParamAxis } from "../../../demo/scenes/spring/SpringHeatmap.vue";
import SpringPhysicsFacet, { BALL_HEADROOM, ballTravel } from "../../../demo/scenes/spring/SpringPhysicsFacet.vue";
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

// ─── (3) D-B2 — the mix table ─────────────────────────────────────────────────

describe("X.KF.W11.f (3) — D-B2: the ramp's mix table, one band per damping node", () => {
    it("is linear in the exact overshoot, normalised to the field's own maximum", () => {
        const nodes = dampingNodesTopDown();
        expect(nodes).toHaveLength(axisNodes(DAMPING_AXIS) + 1);
        expect(nodes[0]).toBe(DAMPING_AXIS.max);
        expect(nodes.at(-1)).toBe(DAMPING_AXIS.min);
        expect(OVERSHOOT_MAX).toBeCloseTo(Math.exp((-0.2 * Math.PI) / Math.sqrt(1 - 0.04)), 12);
        const table = nodes.map((zeta) => rampMix(zeta));
        // the formula, re-executed here rather than copied from the component
        const expected = nodes.map((zeta) =>
            Math.round(((zeta >= 1 ? 0 : Math.exp((-zeta * Math.PI) / Math.sqrt(1 - zeta * zeta))) / OVERSHOOT_MAX) * 100),
        );
        expect(table).toEqual(expected);
        // the frozen snapshot — the record's failure was a table of zeros
        expect(table).toMatchInlineSnapshot(`
          [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            3,
            5,
            9,
            13,
            18,
            24,
            31,
            39,
            48,
            59,
            71,
            84,
            100,
          ]
        `);
        expect(table.at(-1)).toBe(100);
        // strictly non-decreasing top → bottom; every underdamped band below ζ≈0.85 distinct from its neighbour
        for (let j = 1; j < table.length; j++) expect(table[j]!).toBeGreaterThanOrEqual(table[j - 1]!);
        for (let j = 15; j < table.length; j++) expect(table[j]!).toBeGreaterThan(table[j - 1]!);
    });

    it("the field's background carries exactly those bands, in the accent seam", () => {
        const nodes = dampingNodesTopDown();
        const ramp = buildFieldRamp();
        expect(FIELD_RAMP).toBe(ramp);
        expect(ramp.startsWith("linear-gradient(to bottom, ")).toBe(true);
        const stops = ramp.slice("linear-gradient(to bottom, ".length, -1).split(", color-mix");
        expect(stops).toHaveLength(nodes.length);
        for (const [j, zeta] of nodes.entries()) {
            expect(stops[j]).toContain(`var(--color-progress) ${rampMix(zeta)}%, var(--background))`);
        }
        // the first band starts at 0 %, the last ends at 100 %, and the ends are half-height
        expect(stops[0]).toMatch(/ 0\.000% 1\.923%$/);
        expect(stops.at(-1)).toMatch(/ 98\.077% 100\.000%$/);
    });

    it("the presets sit where the physics puts them: smooth ≈ gentle ≈ 0, snappy and bouncy distinct", () => {
        const [smooth, snappy, bouncy, gentle] = SPRING_PRESETS.map((p) => rampMix(p.dampingFraction));
        expect(gentle).toBe(0);
        expect(smooth).toBeLessThanOrEqual(1);
        expect(snappy).toBeGreaterThan(smooth! + 5);
        expect(bouncy).toBeGreaterThan(snappy! + 15);
    });

    it("overshoot() is total, and the field's domain never reaches its ζ ≤ 0 arm", () => {
        expect(overshoot(1)).toBe(0);
        expect(overshoot(1.5)).toBe(0);
        expect(overshoot(0)).toBe(1);
        for (const zeta of dampingNodesTopDown()) expect(zeta).toBeGreaterThan(0);
    });
});

// ─── (5a) the contract and the vertical legend — the heatmap mounts on two numbers ─

describe("X.KF.W11.f (5a) — the heatmap mounts on two models and labels its own axes", () => {
    afterEach(() => {
        vi.restoreAllMocks();
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

    it("instantiates with nothing but two numbers and reads them back in the readout", () => {
        const wrapper = mount(SpringHeatmap, { props: { response: 0.35, dampingFraction: 0.65 } });
        try {
            const field = wrapper.get('[role="application"]');
            const readout = wrapper.get(`#${field.attributes("aria-describedby")}`);
            expect(readout.text()).toBe("0.35 s / ζ 0.65");
            expect(field.attributes("aria-label")).toContain("damping ζ 1.5 at the top to 0.2 at the bottom");
            expect(field.attributes("aria-label")).toContain(`move by ${LATTICE.pitch}`);
            expect(field.attributes("style")).toContain("linear-gradient(to bottom");
        } finally {
            wrapper.unmount();
        }
    });

    it("D-B1 — the regimes are labelled on the vertical axis, either side of the ζ = 1 line", () => {
        const wrapper = mount(SpringHeatmap, { props: { response: 0.5, dampingFraction: 0.86 } });
        try {
            const critical = wrapper.get(".spring-heatmap-critical");
            const y = (1 - (1 - DAMPING_AXIS.min) / (DAMPING_AXIS.max - DAMPING_AXIS.min)) * 100;
            expect(critical.attributes("style")).toContain(`top: ${y.toFixed(3)}%`);
            expect(wrapper.get(".spring-heatmap-regime--over").text()).toContain("overdamped");
            const under = wrapper.get(".spring-heatmap-regime--under");
            expect(under.text()).toContain("underdamped");
            expect(under.attributes("style")).toContain(`top: ${y.toFixed(3)}%`);
            // the horizontal legend row that mis-labelled the axes is gone
            expect(wrapper.text()).not.toContain("← underdamped");
            expect(wrapper.text()).not.toContain("overdamped →");
            // the ζ ticks read top → bottom 1.5 · 1.0 · 0.2; the x axis reads 0.1 s … 1.2 s
            expect(wrapper.findAll(".spring-heatmap-zeta > span").map((s) => s.text())).toEqual(["1.5", "1.0", "0.2"]);
            expect(wrapper.get(".spring-heatmap-x").text()).toContain("0.1 s");
            expect(wrapper.get(".spring-heatmap-x").text()).toContain("1.2 s");
            // the legend states the scale and what varies with what
            expect(wrapper.text()).toContain("peak overshoot 0 → 53 %");
            expect(wrapper.text()).toContain("varies with ζ only");
            // N-SH-5 — the four presets are plotted and named
            const pips = wrapper.findAll(".spring-heatmap-pip");
            expect(pips.map((p) => p.text())).toEqual(SPRING_PRESETS.map((p) => p.name));
        } finally {
            wrapper.unmount();
        }
    });

    it("a bare arrow steps one pitch and is claimed; a modified arrow is left alone", async () => {
        const wrapper = mountField(0.5, 0.86);
        try {
            const field = wrapper.get('[role="application"]');
            const right = new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true });
            const stop = vi.spyOn(right, "stopPropagation");
            field.element.dispatchEvent(right);
            await nextTick();
            expect(wrapper.vm.r).toBe(0.55);
            expect(right.defaultPrevented).toBe(true);
            expect(stop).toHaveBeenCalledTimes(1);

            const left = new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true, cancelable: true });
            field.element.dispatchEvent(left);
            await nextTick();
            expect(wrapper.vm.r).toBe(0.5); // reversible

            const altLeft = new KeyboardEvent("keydown", { key: "ArrowLeft", altKey: true, bubbles: true, cancelable: true });
            field.element.dispatchEvent(altLeft);
            await nextTick();
            expect(wrapper.vm.r).toBe(0.5);
            expect(altLeft.defaultPrevented).toBe(false);

            const up = new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true, cancelable: true });
            field.element.dispatchEvent(up);
            await nextTick();
            expect(wrapper.vm.d).toBe(0.91);
            expect(wrapper.get('[aria-live="polite"]').text()).toBe("0.50 s, ζ 0.91");
        } finally {
            wrapper.unmount();
        }
    });

    it("a primary pointer writes the nearest node; a second pointer and a secondary button are refused", async () => {
        const wrapper = mountField(0.5, 0.86);
        try {
            const field = wrapper.get('[role="application"]');
            const el = field.element as HTMLElement;
            // jsdom lays nothing out: give the field a 220 × 260 content box at (0, 0)
            vi.spyOn(el, "clientWidth", "get").mockReturnValue(220);
            vi.spyOn(el, "clientHeight", "get").mockReturnValue(260);
            vi.spyOn(el, "getBoundingClientRect").mockReturnValue({ left: 0, top: 0, width: 222, height: 262 } as DOMRect);
            el.setPointerCapture = () => {};
            el.releasePointerCapture = () => {};

            const down = (init: PointerEventInit) =>
                el.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, isPrimary: true, button: 0, ...init }));

            // x = 110 px of 220 → f 0.5 → node 11 of 22 → 0.65 s; y = 130 of 260 → f 0.5 → ζ node 13 → 0.85
            down({ pointerId: 1, clientX: 110, clientY: 130 });
            await nextTick();
            expect(wrapper.vm.r).toBe(0.65);
            expect(wrapper.vm.d).toBe(0.85);
            expect(wrapper.find(".spring-heatmap-cell").exists()).toBe(true);

            // a second pointer during the gesture is refused
            down({ pointerId: 2, clientX: 0, clientY: 0 });
            await nextTick();
            expect(wrapper.vm.r).toBe(0.65);

            // the latched pointer sweeps
            el.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, pointerId: 1, clientX: 220, clientY: 260 }));
            await nextTick();
            expect(wrapper.vm.r).toBe(RESPONSE_AXIS.max);
            expect(wrapper.vm.d).toBe(DAMPING_AXIS.min);

            el.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerId: 1 }));
            // a secondary button never writes
            down({ pointerId: 3, button: 2, clientX: 0, clientY: 0 });
            await nextTick();
            expect(wrapper.vm.r).toBe(RESPONSE_AXIS.max);
        } finally {
            wrapper.unmount();
        }
    });
});

// ─── (4) SPF-3 — the painter expresses the presets' analytic peaks ────────────

/** The four presets' analytic first-peak amplitudes, re-derived from `overshoot()`. */
const PRESET_PEAKS = SPRING_PRESETS.map((p) => 1 + overshoot(p.dampingFraction));

describe("X.KF.W11.f (4) — SPF-3: the preset-ball painter expresses the overshoot", () => {
    it("the four analytic peaks are 1.005 / 1.068 / 1.205 / 1.000 and map to distinct, unclamped travel", () => {
        expect(PRESET_PEAKS.map((v) => Number(v.toFixed(3)))).toEqual([1.005, 1.068, 1.205, 1.0]);
        // the stated geometry: rest at 1/6, the target at 5/6, ±0.25 of headroom
        expect(BALL_HEADROOM).toBe(0.25);
        expect(ballTravel(0)).toBeCloseTo(1 / 6, 12);
        expect(ballTravel(1)).toBeCloseTo(5 / 6, 12);
        expect(ballTravel(-BALL_HEADROOM)).toBe(0);
        expect(ballTravel(1 + BALL_HEADROOM)).toBe(1);
        const travel = PRESET_PEAKS.map(ballTravel);
        // monotone in overshoot, every preset distinct from every other except the two that share a peak
        const byPeak = [...PRESET_PEAKS.keys()].sort((a, b) => PRESET_PEAKS[a]! - PRESET_PEAKS[b]!);
        for (let i = 1; i < byPeak.length; i++) {
            expect(travel[byPeak[i]!]).toBeGreaterThanOrEqual(travel[byPeak[i - 1]!]!);
        }
        expect(travel[2]).toBeGreaterThan(travel[1]!);
        expect(travel[1]).toBeGreaterThan(travel[0]!);
        expect(travel[0]).toBeGreaterThan(travel[3]!);
        // and NONE of the four reaches the headroom bound — the clamp is geometric, never hit
        for (const t of travel) expect(t).toBeLessThan(1);
        for (const t of travel) expect(t).toBeGreaterThanOrEqual(5 / 6 - 1e-12);
        // the symmetric undershoot on a downward retarget is expressed too
        expect(ballTravel(-0.205)).toBeLessThan(ballTravel(0));
        expect(ballTravel(-0.205)).toBeGreaterThan(0);
    });
});

// ─── (5b) the facet — the painter on real elements, the group on the real producer ─

describe("X.KF.W11.f (5b) — the facet: the painter paints the peaks; the presets are one labelled exclusive group", () => {
    beforeAll(async () => {
        await warmKfEngine();
    });

    /** The real scene context; `prepare` runs between its creation and the facet's
     *  mount, because the painter registry paints ONCE at registration with the
     *  live values (`usePainterRegistry`) and the demo exposes no repaint verb
     *  (KF-SS-33 excised it as unconsumed). */
    function mountFacet(prepare?: (demo: ReturnType<typeof useSpringDemo>) => void) {
        const [demo, app] = withSetup(() => useSpringDemo());
        prepare?.(demo);
        const wrapper = mount(SpringPhysicsFacet, { props: { demo }, attachTo: document.body });
        return {
            demo,
            wrapper,
            teardown: () => {
                wrapper.unmount();
                app.unmount();
            },
        };
    }

    it("SPF-3 on the DOM — the registered painter writes each preset's peak past the target", async () => {
        const { wrapper, teardown } = mountFacet((demo) => {
            PRESET_PEAKS.forEach((v, i) => {
                demo.springLive.trackValues[i] = v;
            });
        });
        try {
            await nextTick();
            const balls = wrapper.findAll(".preset-ball");
            expect(balls).toHaveLength(4);
            const xs = balls.map((b) => Number(/translateX\(([\d.]+)cqw\)/.exec((b.element as HTMLElement).style.transform)![1]));
            expect(xs.map((x) => Number(x.toFixed(1)))).toEqual(PRESET_PEAKS.map((v) => Number((ballTravel(v) * 100).toFixed(1))));
            // every peak sits PAST the target's 5/6 and inside the track
            for (const x of xs) {
                expect(x).toBeGreaterThan((5 / 6) * 100 - 1e-9);
                expect(x).toBeLessThan(100);
            }
            expect(new Set(xs.map((x) => x.toFixed(1))).size).toBe(4);
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
            expect(cells().map((c) => c.attributes("title"))).toEqual(SPRING_PRESETS.map((p) => p.blurb));

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
        expect(style).toMatch(/\.preset-cell\[data-state="on"\]\s*\{[^}]*var\(--color-progress\) 8%/);
        expect(src).not.toContain("spring-pane");
    });
});
