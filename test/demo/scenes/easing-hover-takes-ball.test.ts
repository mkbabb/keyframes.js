/**
 * FIFTY-FOURTH F (owner, 23 Nov 2026): "hovering, even when not playing,
 * should move the ball, and account for partial, paused, progress, and account
 * for playing when mid hover".
 *
 * The Easing stage's tiles are clocked: every ball rides the scene's one sweep
 * clock. Before this, a hover there drew the trace alone and the ball stayed
 * with the clock, so on a paused or partial sweep a hover moved nothing. Now
 * the hover takes the ball where it stands and rides it to the curve's end,
 * and leaving hands it back to the clock, still or moving.
 *
 * Read off a real mount of `EasingCatalogue` on a fake clock (the stage's
 * `CatalogueClock` seam), with the rAF loop on fake timers. The ball's place
 * is its carriage's `translate(x%, y%)`: x is the ball's time fraction.
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createApp, h, nextTick } from "vue";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";
import { warmKfEngine } from "../../../demo/kf-engine";
import { namedEasing } from "../../../demo/utils/reference-data/timingCurveUtils";

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

const GROUPS = [
    {
        family: "Standard",
        items: [
            { name: "ease-in-out", description: "ease-in-out" },
            { name: "linear", description: "linear" },
        ],
    },
];

/** The stage's clock seam, driven by hand: `at` is the sweep's live value. */
function fakeClock(start: number) {
    let paint: ((phase: number) => void) | null = null;
    const clock = {
        at: start,
        register(p: (phase: number) => void) {
            paint = p;
            p(clock.at);
            return () => {
                paint = null;
            };
        },
        repaint() {
            paint?.(clock.at);
        },
        /** The clock plays: it moves on and paints, as the sweep loop does. */
        tick(to: number) {
            clock.at = to;
            paint?.(to);
        },
    };
    return clock;
}

const xOf = (el: HTMLElement): number => {
    const m = /translate\(([-\d.]+)%/.exec(el.style.transform);
    if (!m) throw new Error(`no placement on the carriage: "${el.style.transform}"`);
    return Number(m[1]);
};

describe("FIFTY-FOURTH F — a hover takes the ball from where it stands and hands it back", () => {
    let host: HTMLElement;
    beforeAll(async () => {
        if (!("getAnimations" in Element.prototype))
            Object.defineProperty(Element.prototype, "getAnimations", {
                configurable: true,
                value: () => [],
            });
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
        vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"] });
        host = document.createElement("div");
        document.body.appendChild(host);
    });
    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
        host.remove();
    });

    const mount = async (clock: ReturnType<typeof fakeClock>) => {
        const { default: EasingCatalogue } = await import(
            "../../../demo/components/EasingCatalogue/EasingCatalogue.vue"
        );
        const app = createApp({
            render: () =>
                h(TooltipProvider, null, {
                    default: () =>
                        h(EasingCatalogue, {
                            modelValue: "linear",
                            groups: GROUPS,
                            curveFor: (name: string) => namedEasing(name),
                            label: "Easing curves",
                            clock,
                            density: "stage",
                        }),
                }),
        });
        app.mount(host);
        for (let i = 0; i < 4; i++) await nextTick();
        const tile = host.querySelector<HTMLElement>('.specimen-tile[data-state]:not([data-state="on"])')!;
        const other = host.querySelector<HTMLElement>('.specimen-tile[data-state="on"]')!;
        const ball = (t: HTMLElement) => t.querySelector<HTMLElement>(".tile-carriage")!;
        return { app, tile, other, ball };
    };
    const enter = (el: HTMLElement) => el.dispatchEvent(new MouseEvent("pointerenter"));
    const leave = (el: HTMLElement) => el.dispatchEvent(new MouseEvent("pointerleave"));

    it("paused part-way: the hover moves the ball on from there, to the end, and leaving puts it back", async () => {
        const clock = fakeClock(0.4);
        const { app, tile, ball } = await mount(clock);
        try {
            expect(xOf(ball(tile))).toBeCloseTo(40, 0);
            enter(tile);
            vi.advanceTimersByTime(16);
            // It starts where the paused sweep left it, not at the start.
            expect(xOf(ball(tile))).toBeGreaterThanOrEqual(39.9);
            vi.advanceTimersByTime(200);
            const mid = xOf(ball(tile));
            expect(mid).toBeGreaterThan(45);
            expect(mid).toBeLessThan(100);
            vi.advanceTimersByTime(1200);
            expect(xOf(ball(tile))).toBeCloseTo(100, 0);
            // Held at the end while the pointer stays.
            vi.advanceTimersByTime(500);
            expect(xOf(ball(tile))).toBeCloseTo(100, 0);
            leave(tile);
            vi.advanceTimersByTime(100);
            const back = xOf(ball(tile));
            expect(back).toBeLessThan(100);
            expect(back).toBeGreaterThan(40);
            vi.advanceTimersByTime(700);
            expect(xOf(ball(tile))).toBeCloseTo(40, 0);
        } finally {
            app.unmount();
        }
    }, 30_000);

    it("a ball paused at the end walks back to the start, then draws the curve", async () => {
        const clock = fakeClock(1);
        const { app, tile, ball } = await mount(clock);
        try {
            expect(xOf(ball(tile))).toBeCloseTo(100, 0);
            enter(tile);
            vi.advanceTimersByTime(150);
            const rewinding = xOf(ball(tile));
            expect(rewinding).toBeLessThan(90);
            vi.advanceTimersByTime(200);
            expect(xOf(ball(tile))).toBeLessThan(10);
            vi.advanceTimersByTime(1200);
            expect(xOf(ball(tile))).toBeCloseTo(100, 0);
        } finally {
            app.unmount();
        }
    }, 30_000);

    it("while the sweep plays, the hovered ball is the hover's; on leave it glides to the live sweep and rejoins it", async () => {
        const clock = fakeClock(0.2);
        const { app, tile, other, ball } = await mount(clock);
        try {
            enter(tile);
            // The sweep plays on underneath: the clock paints every frame.
            for (let i = 1; i <= 60; i++) {
                vi.advanceTimersByTime(16);
                clock.tick(0.2 + i * 0.005);
            }
            // The other tile follows the clock; the hovered one does not.
            expect(xOf(ball(other))).toBeCloseTo(50, 0);
            expect(xOf(ball(tile))).toBeGreaterThan(xOf(ball(other)));
            vi.advanceTimersByTime(1000);
            expect(xOf(ball(tile))).toBeCloseTo(100, 0);
            leave(tile);
            // Mid hand-back, between the hover's place and the moving clock.
            vi.advanceTimersByTime(80);
            clock.tick(0.55);
            const between = xOf(ball(tile));
            expect(between).toBeGreaterThan(55);
            expect(between).toBeLessThan(100);
            // Handed back whole: it rides the clock again, frame for frame.
            for (let i = 1; i <= 50; i++) {
                vi.advanceTimersByTime(16);
                clock.tick(0.55 + i * 0.004);
            }
            expect(xOf(ball(tile))).toBeCloseTo(xOf(ball(other)), 1);
            clock.tick(0.3);
            expect(xOf(ball(tile))).toBeCloseTo(30, 0);
        } finally {
            app.unmount();
        }
    }, 30_000);
});
