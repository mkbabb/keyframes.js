/**
 * OD19 residue (value.js COHESION §0gp) — the warm swap into Easing builds no
 * tile plot. On the real-GPU cell (headless real Chrome, ANGLE-Metal) the
 * square→easing commit frame was the longest of the warm swaps (100–118 ms),
 * and its largest consumer script was the catalogue's 28 tile plots: ~24,000
 * calls of the curves inside the mount. A plot is a pure function of its
 * curve, so the specimen table builds each one ONCE, when the scene's chunk
 * evaluates (the idle warm), and every catalogue mount draws from it.
 *
 * (1) Mounting the Easing scene's gallery calls the tile curves 0 times
 *     (born RED at kf `f8d6077b`: every mount re-plots every tile).
 * (2) A second mount (a revisit) calls them 0 times too.
 * (3) The strokes are the plots of the same functions (nothing is drawn from
 *     a stale or foreign plot).
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createApp, defineComponent, h, nextTick, provide } from "vue";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";
import { warmKfEngine } from "../../../demo/kf-engine";

const tally = vi.hoisted(() => ({ calls: 0, made: [] as { name: string; fn: (t: number) => number }[] }));
vi.mock("../../../demo/utils/reference-data/timingCurveUtils", async (importOriginal) => {
    const orig = await importOriginal<typeof import("../../../demo/utils/reference-data/timingCurveUtils")>();
    const counted = (name: string, fn: (t: number) => number) => {
        const w = (t: number) => (tally.calls++, fn(t));
        tally.made.push({ name, fn });
        return w;
    };
    return {
        ...orig,
        namedEasing: (name: string) => counted(name, orig.namedEasing(name)),
        steppedEasing: (n: number, p?: Parameters<typeof orig.steppedEasing>[1]) =>
            counted(`steps(${n})`, orig.steppedEasing(n, p)),
    };
});

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
const settle = async () => {
    for (let i = 0; i < 4; i++) await nextTick();
};

describe("OD19 residue: the swap into Easing builds no tile plot", () => {
    let host: HTMLElement;
    beforeAll(async () => {
        if (!("getAnimations" in Element.prototype))
            Object.defineProperty(Element.prototype, "getAnimations", { configurable: true, value: () => [] });
        await warmKfEngine();
    });
    beforeEach(() => {
        vi.stubGlobal("ResizeObserver", InertResizeObserver);
        vi.stubGlobal("IntersectionObserver", OnScreenIntersectionObserver);
        vi.stubGlobal("matchMedia", (query: string) => ({
            matches: /min-width/.test(query),
            media: query,
            onchange: null,
            addEventListener() {},
            removeEventListener() {},
            addListener() {},
            removeListener() {},
            dispatchEvent: () => false,
        }));
        host = document.createElement("div");
        document.body.appendChild(host);
    });
    afterEach(() => {
        vi.unstubAllGlobals();
        host.remove();
    });

    // The scene's chunk evaluates first (the idle warm); the demo state is the
    // scene's own, created outside the measured window.
    const load = async () => {
        const { default: EasingTarget } = await import("../../../demo/scenes/easing/EasingTarget.vue");
        const { useEasingDemo } = await import("../../../demo/scenes/easing/useEasingDemo");
        const { EASING_DEMO_KEY } = await import("../../../demo/scenes/easing/easingKeys");
        return { EasingTarget, useEasingDemo, EASING_DEMO_KEY };
    };
    const mountTarget = async (m: Awaited<ReturnType<typeof load>>) => {
        let tileCalls = -1;
        const app = createApp(
            defineComponent({
                setup() {
                    provide(m.EASING_DEMO_KEY, m.useEasingDemo());
                    return () => h(TooltipProvider, null, { default: () => h(m.EasingTarget) });
                },
            }),
        );
        // The measured window is the whole mount: the demo's state and the
        // gallery (the commit a swap into Easing runs).
        const before = tally.calls;
        app.mount(host);
        await settle();
        tileCalls = tally.calls - before;
        return { app, tileCalls };
    };

    it("(1)(2) a mount, and a revisit, call the tile curves 0 times", async () => {
        const m = await load();
        const first = await mountTarget(m);
        try {
            expect(host.querySelectorAll("[data-easing-catalogue] .tile-plot path").length).toBeGreaterThan(20);
        } finally {
            first.app.unmount();
        }
        const second = await mountTarget(m);
        second.app.unmount();
        // A tile re-plot is thousands of calls (24,426 for the 28 tiles at HEAD).
        expect(first.tileCalls).toBe(0);
        expect(second.tileCalls).toBe(0);
    });

    it("(3) each tile's stroke is its own function's plot", async () => {
        const m = await load();
        const { curvePlot, unitEasingFrame } = await import("../../../demo/utils/curvePlot");
        const { EASING_GROUPS } = await import("../../../demo/utils/reference-data/easingGroups");
        const { namedEasing, steppedEasing } = await vi.importActual<
            typeof import("../../../demo/utils/reference-data/timingCurveUtils")
        >("../../../demo/utils/reference-data/timingCurveUtils");
        const { app } = await mountTarget(m);
        try {
            const names = EASING_GROUPS.filter((g) => g.family !== "Custom").flatMap((g) => g.items.map((i) => i.name));
            expect(names.length).toBeGreaterThan(20);
            for (const name of names) {
                const carriage = host.querySelector(`[data-easing-catalogue] .tile-carriage[data-curve="${name}"]`);
                const d = carriage?.closest(".tile-plot")?.querySelector("path")?.getAttribute("d");
                const fn = name === "steps" ? steppedEasing(4, "jump-end") : namedEasing(name);
                expect(d, name).toBe(curvePlot(fn, unitEasingFrame()).d);
            }
        } finally {
            app.unmount();
        }
    });
});
