/**
 * X.KF.W13T.e2 · R-e-2 (COHESION §0ar) — a PAUSED scrub repaints the
 * `AnimationVisualizer` twin.
 *
 * MEASURED (KF.W13T.e's receipt, live `#/easing`): a paused keyboard/pointer
 * scrub moved the ribbon's thumb and the specimen dots, but the twin's ball
 * stayed where the last play left it. The twin paints from
 * `animation.effectiveT` on a frame loop GUARDED by `isPlaying || isDragging`,
 * so while paused nothing asked it to repaint; the ball only caught up on Play.
 *
 * The cure is the paused repaint TRIGGER: the ribbon hands the twin the
 * playhead it displays (`currentT`), and a change of it while the loop is idle
 * repaints the ball once from the same `effectiveT` the loop paints from. No
 * loop is forced: the witness also asserts that the paused scrub schedules no
 * animation frame.
 *
 * Drives the REAL `AnimationVisualizer.vue` over a REAL engine animation. The
 * touch gate is stubbed at its own seam (the glass-ui root barrel crosses the
 * keyframes.js-import wall; the `resize-tracks` precedent); nothing about the
 * paint path is stubbed. Born RED at the pre-cure bytes (the ball's transform
 * stays empty).
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

class NoopResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
}

const DURATION = 1000;
const STAGE_PX = 200;
const BALL_PX = 40;
const MAX_X = STAGE_PX - BALL_PX;

beforeAll(async () => {
    await warmKfEngine();
});

describe("R-e-2 — a paused scrub repaints the AnimationVisualizer twin", () => {
    const clientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "clientWidth");
    let unmount: (() => void) | undefined;

    beforeEach(() => {
        vi.stubGlobal("ResizeObserver", NoopResizeObserver);
        // jsdom lays nothing out: give the stage and the ball their widths so a
        // progress is a pixel offset.
        Object.defineProperty(HTMLElement.prototype, "clientWidth", {
            configurable: true,
            get(this: HTMLElement) {
                if (this.classList.contains("visualizer-stage")) return STAGE_PX;
                if (this.classList.contains("visualizer-ball")) return BALL_PX;
                return 0;
            },
        });
    });

    afterEach(() => {
        unmount?.();
        unmount = undefined;
        if (clientWidth) Object.defineProperty(HTMLElement.prototype, "clientWidth", clientWidth);
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("seating the playhead while paused moves the ball to the seated effective time, scheduling no frame", async () => {
        const animation = new CSSKeyframesAnimation({ duration: DURATION }).fromString(`
            from { transform: translateX(0px); }
            to { transform: translateX(100px); }
        `);
        const props = shallowRef({ animation, isPlaying: false, currentT: 0 });
        const Host = defineComponent({
            setup() {
                return () => h(AnimationVisualizer, props.value);
            },
        });
        const el = document.createElement("div");
        document.body.appendChild(el);
        const app = createApp(Host);
        app.mount(el);
        unmount = () => {
            app.unmount();
            el.remove();
        };
        await nextTick();

        const ball = el.querySelector<HTMLElement>(".visualizer-ball");
        expect(ball).not.toBeNull();

        // The scene's paused scrub: the engine clock is seated, then the ribbon
        // re-renders with the playhead it now displays.
        const raf = vi.spyOn(window, "requestAnimationFrame");
        for (const t of [700, 250]) {
            animation.t = t;
            props.value = { ...props.value, currentT: t };
            await nextTick();
            expect(ball!.style.transform).toBe(`translateX(${(t / DURATION) * MAX_X}px)`);
        }
        expect(raf).not.toHaveBeenCalled();
    });
});
