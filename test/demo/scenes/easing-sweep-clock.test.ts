/**
 * X.KF.W13X.easing · KFA-35 — the easing sweep resumes where it paused.
 *
 * MEASURED (served, kf `c79cb7f4`, `evidence/W13X/easing/before-r{1,2}.log`):
 * a pause → Play moved the linear tile's ball 51–132 px in 60 ms, against a
 * free-running 60 ms step of 4–15 px. The root: `onArm` re-seeded the clock
 * from `livePhaseValue` — the triangle's OUTPUT `p` — as if it were the
 * cycle's PHASE (`startTime = now - p * duration * 2`), so a ball paused at
 * p = 0.4 on the up-leg resumed at phase 0.4 (p = 0.8), and one paused on the
 * down-leg resumed on the up-leg.
 *
 * The witness drives the REAL `useEasingDemo` on a faked rAF clock through the
 * machine + the scene's own ScenePlayback adapter (the App's path), pauses on
 * each leg, resumes, and asserts the first resumed frame is continuous with
 * the paused value AND keeps the paused direction.
 *
 * KFA-100 — Reverse reaches the race. MEASURED (same logs): with the sweep
 * playing, the ribbon's Reverse left the linear tile ball moving the same way
 * (`flipped: false` ×2 at 1440 light + dark) — the scene flipped only the
 * preview animation's `reversed` flag, which the tile clock never read. The
 * case reverses mid-sweep and asserts the value turns where it stands.
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createApp, defineComponent, h } from "vue";
import { warmKfEngine } from "../../../demo/kf-engine";
import { useEasingDemo } from "../../../demo/scenes/easing/useEasingDemo";
import { useSceneMachine } from "../../../demo/state/useSceneMachine";

beforeAll(async () => {
    await warmKfEngine();
});

type Demo = ReturnType<typeof useEasingDemo>;

describe("the easing sweep clock", () => {
    let host: HTMLElement;
    let app: ReturnType<typeof createApp> | null = null;

    beforeEach(() => {
        vi.useFakeTimers({
            toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"],
        });
        host = document.createElement("div");
        document.body.appendChild(host);
    });

    afterEach(() => {
        app?.unmount();
        app = null;
        vi.useRealTimers();
        host.remove();
    });

    const mountDemo = (): Demo => {
        let demo!: Demo;
        app = createApp(
            defineComponent({
                setup() {
                    demo = useEasingDemo();
                    return () => h("div");
                },
            }),
        );
        app.mount(host);
        const machine = useSceneMachine();
        machine.dispatch({ type: "NAVIGATE", to: "easing" });
        machine.dispatch({ type: "SCENE_READY" });
        return demo;
    };

    // The App's transport path: the machine carries the intent, the scene's
    // ScenePlayback adapter drives its loop.
    const play = (demo: Demo) => {
        demo.play();
        demo.scenePlayback.resume();
    };
    const pause = (demo: Demo) => {
        demo.pause();
        demo.scenePlayback.suspend();
    };

    // One 16 ms frame of a 1500 ms sweep moves p by 2 * 16 / 3000 ≈ 0.0107;
    // a continuous resume stays within a couple of frames of that.
    const FRAME = 16;
    const CONTINUOUS = 0.03;

    it("KFA-35 · a pause on the UP-leg resumes from the paused value, still rising", () => {
        const demo = mountDemo();
        play(demo);
        vi.advanceTimersByTime(600); // phase 0.2 → p 0.4, rising
        pause(demo);
        vi.advanceTimersByTime(FRAME * 2);
        const paused = demo.liveProgress();
        expect(paused).toBeGreaterThan(0.2);
        expect(paused).toBeLessThan(0.8);

        play(demo);
        vi.advanceTimersByTime(FRAME);
        const first = demo.liveProgress();
        vi.advanceTimersByTime(FRAME * 4);
        const later = demo.liveProgress();

        expect(Math.abs(first - paused)).toBeLessThan(CONTINUOUS);
        expect(later).toBeGreaterThan(first);
    });

    it("KFA-35 · a pause on the DOWN-leg resumes from the paused value, still falling", () => {
        const demo = mountDemo();
        play(demo);
        vi.advanceTimersByTime(2100); // phase 0.7 → p 0.6, falling
        pause(demo);
        vi.advanceTimersByTime(FRAME * 2);
        const paused = demo.liveProgress();
        expect(paused).toBeGreaterThan(0.2);
        expect(paused).toBeLessThan(0.8);

        play(demo);
        vi.advanceTimersByTime(FRAME);
        const first = demo.liveProgress();
        vi.advanceTimersByTime(FRAME * 4);
        const later = demo.liveProgress();

        expect(Math.abs(first - paused)).toBeLessThan(CONTINUOUS);
        expect(later).toBeLessThan(first);
    });

    it("KFA-100 · Reverse turns the sweep where it stands, and a second Reverse turns it back", () => {
        const demo = mountDemo();
        play(demo);
        vi.advanceTimersByTime(600); // p ≈ 0.4, rising
        const before = demo.liveProgress();
        demo.setReversed(true);
        expect(demo.reversed.value).toBe(true);
        vi.advanceTimersByTime(FRAME);
        const first = demo.liveProgress();
        vi.advanceTimersByTime(FRAME * 6);
        const later = demo.liveProgress();

        expect(Math.abs(first - before)).toBeLessThan(CONTINUOUS);
        expect(later).toBeLessThan(first);

        demo.setReversed(false);
        vi.advanceTimersByTime(FRAME);
        const back = demo.liveProgress();
        vi.advanceTimersByTime(FRAME * 6);
        expect(Math.abs(back - later)).toBeLessThan(CONTINUOUS);
        expect(demo.liveProgress()).toBeGreaterThan(back);
    });
});
