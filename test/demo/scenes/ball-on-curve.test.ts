/**
 * X.KF.W13W.b (OA-56, COHESION §0co) — THE TRACKING BALL RIDES THE CURVE.
 *
 * The owner, verbatim (2026-09-24): "with all the easing curves and simulators,
 * the tracking ball must be on the curve itself--mark and ecoute-moi".
 *
 * The law (KF-W13.md "the tracking ball rides the curve"): on every plot of an
 * easing or a simulation the ball is a point ON the plotted curve, at
 * (x(p), y(p)) in the plot's own coordinates; one mapping places both the
 * stroke and the ball; no rail under the ball.
 *
 * The DOM cases read the geometry back from the RENDERED bytes and never from
 * the primitive: the stroke is the sibling `<path>`'s `d` over its `<svg>`'s
 * `viewBox`, the ball is its carriage's `translate(x%, y%)` over that same box,
 * and the ball's user-space point must lie on the stroke's polyline. The census
 * sites are `.c`'s L1-L4 (gallery tiles, dock easing mini, spring sweep
 * sampler, spring live ball). Born RED at kf `a939e7d6`.
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createApp, defineComponent, h, nextTick, provide } from "vue";
import { warmKfEngine } from "../../../demo/kf-engine";
import { useSceneMachine } from "../../../demo/state/useSceneMachine";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";

beforeAll(async () => {
    await warmKfEngine();
});

// ── The independent geometry oracle ────────────────────────────────────────

type Pt = [number, number];

/** `M x y L x y …` (space- or comma-separated) → the polyline's vertices. */
const polyline = (d: string): Pt[] =>
    d
        .trim()
        .split(/\s*[ML]\s*/)
        .filter(Boolean)
        .map((pair) => {
            const [x, y] = pair.split(/[\s,]+/).map(Number);
            return [x!, y!];
        });

/** Distance from `p` to the polyline (segment-wise). */
const distToPolyline = (p: Pt, pts: Pt[]): number => {
    let best = Infinity;
    for (let i = 1; i < pts.length; i++) {
        const [ax, ay] = pts[i - 1]!;
        const [bx, by] = pts[i]!;
        const dx = bx - ax;
        const dy = by - ay;
        const len2 = dx * dx + dy * dy;
        const u = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((p[0] - ax) * dx + (p[1] - ay) * dy) / len2));
        best = Math.min(best, Math.hypot(p[0] - (ax + u * dx), p[1] - (ay + u * dy)));
    }
    return best;
};

/** A carriage's `translate(a%, b%)` → its box fraction. */
const carriageFraction = (el: HTMLElement): Pt => {
    const m = /translate\(\s*([-\d.e]+)%\s*,\s*([-\d.e]+)%\s*\)/.exec(el.style.transform);
    if (!m) throw new Error(`carriage transform is not translate(x%, y%): ${JSON.stringify(el.style.transform)}`);
    return [Number(m[1]) / 100, Number(m[2]) / 100];
};

/**
 * The ball's user-space point, read from the rendered bytes: the ball's
 * carriage and the stroke's `<svg>` must share ONE box (the plot box), and the
 * carriage fraction maps through that svg's `viewBox`.
 */
const ballOnStroke = (ball: Element): { dist: number; frac: Pt; box: number[] } => {
    const carriage = ball.parentElement as HTMLElement;
    expect(carriage.classList.contains("curve-carriage")).toBe(true);
    const path = carriage.parentElement!.querySelector<SVGPathElement>(":scope > svg path");
    expect(path, "the stroke's <svg> shares the ball carriage's box").not.toBeNull();
    const box = path!.ownerSVGElement!.getAttribute("viewBox")!.split(/[\s,]+/).map(Number);
    const d = path!.getAttribute("d")!;
    const frac = carriageFraction(carriage);
    const p: Pt = [box[0]! + frac[0] * box[2]!, box[1]! + frac[1] * box[3]!];
    return { dist: distToPolyline(p, polyline(d)) / box[3]!, frac, box };
};

/** On the stroke within 1e-3 of the plot's height (≤ 0.1 px on a 100 px plot). */
const ON_STROKE = 1e-3;

// ── (1) the primitive ───────────────────────────────────────────────────────

describe("(1) the one curve-to-point primitive — the ball and the stroke from one function", () => {
    it("(1a) point(p) lies on d for every curve family; overshoot leaves the band; steps jump", async () => {
        const { curvePlot, unitEasingFrame } = await import("../../../demo/utils/curvePlot");
        const { namedEasing, steppedEasing } = await import(
            "../../../demo/utils/reference-data/timingCurveUtils"
        );
        const frame = unitEasingFrame();
        const curves = {
            ease: namedEasing("ease"),
            linear: namedEasing("linear"),
            "ease-in-out-back": namedEasing("ease-in-out-back"),
            "ease-out-back": namedEasing("ease-out-back"),
            "steps(4, jump-end)": steppedEasing(4, "jump-end"),
            "step-start": namedEasing("step-start"),
        };
        for (const [name, fn] of Object.entries(curves)) {
            const plot = curvePlot(fn, frame);
            const pts = polyline(plot.d);
            for (let i = 0; i <= 96; i++) {
                const p = i / 96;
                const { x, y } = plot.point(p);
                expect(distToPolyline([x, y], pts), `${name} @ ${p}`).toBeLessThan(ON_STROKE);
                expect(x).toBeCloseTo(p, 12); // x IS normalized time
            }
        }
        // Overshoot is followed, never clamped: back dips below value 0 (y > 1
        // in the unit frame) and out-back crests above value 1 (y < 0).
        const back = curvePlot(curves["ease-in-out-back"], frame);
        const outBack = curvePlot(curves["ease-out-back"], frame);
        const ys = (plot: typeof back) => Array.from({ length: 97 }, (_, i) => plot.point(i / 96).y);
        expect(Math.max(...ys(back))).toBeGreaterThan(1.02);
        expect(Math.min(...ys(outBack))).toBeLessThan(-0.05);
        // Steps: the ball jumps with the steps, and the stroke carries the riser.
        const steps = curvePlot(curves["steps(4, jump-end)"], frame);
        expect(steps.value(0.2)).toBe(0);
        expect(steps.value(0.3)).toBe(0.25);
        expect(steps.value(0.74)).toBe(0.5);
        const riser = steps.vertices.filter((v, i, all) => i > 0 && Math.abs(v.t - all[i - 1]!.t) < 1e-9);
        expect(riser.length).toBeGreaterThanOrEqual(3);
        // place(p) is the fraction of the plot box, as translate percentages.
        expect(curvePlot(curves.linear, frame).place(0.25)).toBe("translate(25%, 75%)");
    });
});

// ── (2) the easing gallery tiles (L1) ───────────────────────────────────────

class OnScreenIntersectionObserver {
    constructor(private readonly cb: (e: { target: Element; isIntersecting: boolean }[]) => void) {}
    observe(target: Element) {
        this.cb([{ target, isIntersecting: true }]);
    }
    unobserve() {}
    disconnect() {}
    takeRecords() {
        return [];
    }
}
class InertResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

const reduceMotion = (on: boolean) =>
    vi.stubGlobal("matchMedia", (query: string) => ({
        matches: on && query.includes("prefers-reduced-motion: reduce"),
        media: query,
        onchange: null,
        addEventListener() {},
        removeEventListener() {},
        addListener() {},
        removeListener() {},
        dispatchEvent: () => false,
    }));

describe("(2) the easing gallery — every tile's ball on its own sparkline", () => {
    let host: HTMLElement;
    beforeEach(() => {
        vi.stubGlobal("ResizeObserver", InertResizeObserver);
        vi.stubGlobal("IntersectionObserver", OnScreenIntersectionObserver);
        vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"] });
        host = document.createElement("div");
        document.body.appendChild(host);
    });
    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
        host.remove();
    });

    const mountGallery = async () => {
        const { default: EasingTarget } = await import("../../../demo/scenes/easing/EasingTarget.vue");
        const { useEasingDemo } = await import("../../../demo/scenes/easing/useEasingDemo");
        const { EASING_DEMO_KEY } = await import("../../../demo/scenes/easing/easingKeys");
        let demo!: ReturnType<typeof useEasingDemo>;
        const app = createApp(
            defineComponent({
                setup() {
                    demo = useEasingDemo();
                    provide(EASING_DEMO_KEY, demo);
                    return () => h(TooltipProvider, null, { default: () => h(EasingTarget) });
                },
            }),
        );
        app.mount(host);
        await nextTick();
        await nextTick();
        return { app, demo: () => demo };
    };

    it("(2a) playing: 0 rails in the drawer, and every ball sits on its tile's stroke", async () => {
        reduceMotion(false);
        const { app, demo } = await mountGallery();
        try {
            const machine = useSceneMachine();
            machine.dispatch({ type: "NAVIGATE", to: "easing" });
            machine.dispatch({ type: "SCENE_READY" });
            machine.dispatch({ type: "PLAY" });
            demo().play();
            vi.advanceTimersByTime(700);
            expect(demo().liveProgress()).toBeGreaterThan(0);
            expect(host.querySelectorAll(".specimen-drawer .progress-rail, .tile-rail")).toHaveLength(0);
            const balls = [...host.querySelectorAll<HTMLElement>(".tile-ball")];
            expect(balls.length).toBeGreaterThan(20);
            for (const ball of balls) {
                const { dist, frac } = ballOnStroke(ball);
                expect(dist, ball.dataset.curve).toBeLessThan(ON_STROKE);
                // x IS the shared sweep's time: every runner departs together.
                expect(frac[0]).toBeCloseTo(demo().liveProgress(), 3);
            }
        } finally {
            app.unmount();
        }
    }, 30_000);

    it("(2b) reduced motion: every ball rests ON its curve at the end state (t = 1)", async () => {
        reduceMotion(true);
        const { app } = await mountGallery();
        try {
            const balls = [...host.querySelectorAll<HTMLElement>(".tile-ball")];
            expect(balls.length).toBeGreaterThan(20);
            for (const ball of balls) {
                const { dist, frac } = ballOnStroke(ball);
                expect(dist, ball.dataset.curve).toBeLessThan(ON_STROKE);
                expect(frac[0]).toBeCloseTo(1, 6);
            }
        } finally {
            app.unmount();
        }
    }, 30_000);
});

// ── (3) the dock easing mini (L2) ───────────────────────────────────────────

describe("(3) the dock easing mini — curve and ball, no rail", () => {
    it("(3a) the ball rests on the curve's start; no rail; the played keyframes walk the stroke's own vertices", async () => {
        const { mount } = await import("@vue/test-utils");
        const { default: EasingMini } = await import("../../../demo/scenes/easing/EasingMini.vue");
        const mini = mount(EasingMini, { props: { live: false }, attachTo: document.body });
        try {
            expect(mini.find(".rail").exists()).toBe(false);
            const ball = mini.find(".ball").element;
            const carriage = ball.parentElement as HTMLElement;
            // At rest the carriage's CSS default is the curve's own start point.
            const rest = carriage.style.getPropertyValue("--curve-rest");
            carriage.style.transform = rest;
            const { dist, frac } = ballOnStroke(ball);
            expect(dist).toBeLessThan(ON_STROKE);
            expect(frac[0]).toBeGreaterThanOrEqual(0);
            // The live motion: every keyframe is a stroke vertex at its own time
            // offset (linear between them = along the drawn segment).
            const { EASING_MINI_KEYFRAMES } = await import("../../../demo/scenes/easing/easingMotion");
            const frames = [...EASING_MINI_KEYFRAMES.matchAll(/([\d.]+)%\s*\{\s*transform:\s*(translate\([^)]*\))/g)];
            expect(frames.length).toBeGreaterThan(16);
            for (const [, offset, transform] of frames) {
                carriage.style.transform = transform!;
                const at = ballOnStroke(ball);
                expect(at.dist, `${offset}%`).toBeLessThan(ON_STROKE);
                const viewX = at.box[0]! + at.frac[0] * at.box[2]!;
                expect(viewX).toBeCloseTo(Number(offset) / 100, 3); // x = time
            }
        } finally {
            mini.unmount();
        }
    });
});

// ── (4) the spring (L3 sweep sampler · L4 live simulator ball) ─────────────

describe("(4) the spring — both balls ride the plotted trace; the rail holds no ball", () => {
    let host: HTMLElement;
    beforeEach(() => {
        vi.stubGlobal("ResizeObserver", InertResizeObserver);
        vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"] });
        host = document.createElement("div");
        document.body.appendChild(host);
    });
    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
        host.remove();
    });

    const mountSpring = async () => {
        const { default: SpringTarget } = await import("../../../demo/scenes/spring/SpringTarget.vue");
        const { useSpringDemo } = await import("../../../demo/scenes/spring/useSpringDemo");
        const { SPRING_DEMO_KEY } = await import("../../../demo/scenes/spring/springKeys");
        let demo!: ReturnType<typeof useSpringDemo>;
        const app = createApp(
            defineComponent({
                setup() {
                    demo = useSpringDemo();
                    provide(SPRING_DEMO_KEY, demo);
                    return () => h(SpringTarget);
                },
            }),
        );
        app.mount(host);
        await nextTick();
        return { app, demo: () => demo };
    };

    it("(4a) the live ball and the sweep sampler sit on .plot-trace through a chase; 0 balls on the rail", async () => {
        reduceMotion(false);
        const { app, demo } = await mountSpring();
        try {
            const rail = host.querySelector(".spring-rail")!;
            expect(rail.querySelectorAll(".progress-ball, .curve-ball, .spring-ball")).toHaveLength(0);
            expect(host.querySelector(".sampler-track")).toBeNull();
            const live = host.querySelector(".spring-ball")!;
            const sampler = host.querySelector(".sampler-ball")!;
            expect(live.closest(".plot-frame")).not.toBeNull();
            expect(sampler.closest(".plot-frame")).not.toBeNull();
            const machine = useSceneMachine();
            machine.dispatch({ type: "NAVIGATE", to: "spring" });
            machine.dispatch({ type: "SCENE_READY" });
            machine.dispatch({ type: "PLAY" });
            demo().reseat(0.25);
            const xs: number[] = [];
            for (let i = 0; i < 12; i++) {
                vi.advanceTimersByTime(90);
                for (const ball of [live, sampler]) {
                    expect(ballOnStroke(ball).dist, `${ball.className} @ ${i}`).toBeLessThan(ON_STROKE);
                }
                xs.push(ballOnStroke(live).frac[0]);
            }
            // The simulator's ball advances along the trace at sim time.
            expect(xs[xs.length - 1]!).toBeGreaterThan(xs[0]!);
        } finally {
            app.unmount();
        }
    }, 30_000);

    it("(4b) reduced motion: the snapped, settled spring's ball rests ON the trace at its end", async () => {
        reduceMotion(true);
        const { app, demo } = await mountSpring();
        try {
            demo().reseat(0.4);
            vi.advanceTimersByTime(100);
            const live = host.querySelector(".spring-ball")!;
            const { dist, frac } = ballOnStroke(live);
            expect(dist).toBeLessThan(ON_STROKE);
            expect(frac[0]).toBeCloseTo(1, 6);
        } finally {
            app.unmount();
        }
    }, 30_000);
});
