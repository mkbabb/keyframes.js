/**
 * OD19 residue-2 (COHESION §0gq.3) — the `AnimationVisualizer` ball's run is
 * read once and kept, never per paint.
 *
 * MEASURED (OD19 residue profile, real-GPU cell): `getMaxX` read the stage's
 * and the ball's `clientWidth` on every paint, every frame of a play and the
 * paused seat a swap makes inside its commit, so each paint forced a layout
 * (24.6 ms across sequence -> cube, ~4 ms of cube -> amiga's commit frame).
 *
 * The witness drives the REAL component over a REAL engine animation. Three
 * paused seats read the widths once between them; a resize report re-reads
 * them inside the observer (after layout), and the next paint lands on the new
 * run with no read of its own. Born RED at `fc1a3383` (two reads per paint).
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createApp, defineComponent, h, nextTick, ref, shallowRef } from "vue";
import { CSSKeyframesAnimation } from "../../../src/animation/engine";
import { warmKfEngine } from "../../../demo/kf-engine";

vi.mock("@mkbabb/glass-ui", () => ({
    useTouchGate: () => ({
        isActive: ref(false),
        isTouchDevice: false,
        handleScrollCheck: () => {},
        handleTouchEnd: () => {},
        handleTouchStart: () => false,
        suppressDeactivate: () => {},
    }),
}));

const { default: AnimationVisualizer } = await import(
    "@components/playback/AnimationVisualizer.vue"
);

/** A ResizeObserver whose reports the test delivers by hand (to the
 *  observers still connected: a re-bound target disconnects the old one). */
const observers: { cb: ResizeObserverCallback; self: ResizeObserver }[] = [];
class ManualResizeObserver {
    private readonly entry: { cb: ResizeObserverCallback; self: ResizeObserver };
    constructor(cb: ResizeObserverCallback) {
        this.entry = { cb, self: this as unknown as ResizeObserver };
        observers.push(this.entry);
    }
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {
        const at = observers.indexOf(this.entry);
        if (at >= 0) observers.splice(at, 1);
    }
}
const report = () => {
    for (const o of observers) o.cb([], o.self);
};

const DURATION = 1000;
const BALL_PX = 40;

beforeAll(async () => {
    await warmKfEngine();
});

describe("the visualizer ball's run is read once, not per paint", () => {
    const clientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "clientWidth");
    let stagePx = 200;
    let reads = 0;
    let unmount: (() => void) | undefined;

    beforeEach(() => {
        observers.length = 0;
        stagePx = 200;
        reads = 0;
        vi.stubGlobal("ResizeObserver", ManualResizeObserver);
        Object.defineProperty(HTMLElement.prototype, "clientWidth", {
            configurable: true,
            get(this: HTMLElement) {
                if (this.classList.contains("visualizer-stage")) {
                    reads++;
                    return stagePx;
                }
                if (this.classList.contains("visualizer-ball")) {
                    reads++;
                    return BALL_PX;
                }
                return 0;
            },
        });
    });

    afterEach(() => {
        unmount?.();
        unmount = undefined;
        if (clientWidth) Object.defineProperty(HTMLElement.prototype, "clientWidth", clientWidth);
        vi.unstubAllGlobals();
    });

    it("three paused seats read the widths once; a resize re-reads them in the observer, not in the paint", async () => {
        const animation = new CSSKeyframesAnimation({ duration: DURATION }).fromString(`
            from { transform: translateX(0px); }
            to { transform: translateX(100px); }
        `);
        const props = shallowRef({ animation, isPlaying: false, currentT: 0 });
        const el = document.createElement("div");
        document.body.appendChild(el);
        const app = createApp(defineComponent({ setup: () => () => h(AnimationVisualizer, props.value) }));
        app.mount(el);
        unmount = () => {
            app.unmount();
            el.remove();
        };
        await nextTick();
        const ball = el.querySelector<HTMLElement>(".visualizer-ball")!;

        const seat = async (t: number) => {
            animation.t = t;
            props.value = { ...props.value, currentT: t };
            await nextTick();
        };

        reads = 0;
        for (const t of [700, 250, 500]) {
            await seat(t);
            expect(ball.style.transform).toBe(`translateX(${(t / DURATION) * (stagePx - BALL_PX)}px)`);
        }
        // One measure (the stage and the ball) for three paints.
        expect(reads).toBe(2);

        // The stage grows: the observer's report re-reads after layout...
        stagePx = 300;
        reads = 0;
        report();
        expect(reads).toBe(2);
        // ...and the next paint lands on the new run without a read of its own.
        reads = 0;
        await seat(600);
        expect(ball.style.transform).toBe(`translateX(${0.6 * (300 - BALL_PX)}px)`);
        expect(reads).toBe(0);
    });
});
