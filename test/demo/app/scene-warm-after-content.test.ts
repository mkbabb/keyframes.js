/**
 * KF-RES-1 (OD19 residue-2, COHESION §0gq.3) — the idle warm of every scene
 * chunk starts after the first scene's content has painted, never at the
 * shell's mount.
 *
 * MEASURED (OD19 residue, `route-load.mjs` run 2): cold `#/amiga` fetched
 * 1707 KB before its content against HEAD's 1427, Aurora included. The warm
 * was a `requestIdleCallback` armed at mount with no deadline; while the deep
 * link's three.js chunk was in flight the main thread idled, so the warm
 * fetched every other scene (and Home's backdrop) ahead of the route's own
 * content.
 *
 * The witness drives the REAL `useSceneTransition`: mounting it arms no idle
 * callback; the scene host's first <Suspense> resolve (`onSceneContent`) arms
 * one in the next frame, after that frame's paint; a later resolve (a swap)
 * arms nothing more. Born RED at `fc1a3383` (the warm armed at mount).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, ref } from "vue";
import { mount, type VueWrapper } from "@vue/test-utils";
import { useSceneTransition } from "../../../demo/app/transition/useSceneTransition";

describe("KF-RES-1 — the idle scene warm waits for the first scene's content", () => {
    let wrapper: VueWrapper | undefined;
    let frames: FrameRequestCallback[];
    let idle: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        frames = [];
        idle = vi.fn(() => 1);
        vi.stubGlobal("requestIdleCallback", idle);
        vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => frames.push(cb));
    });
    afterEach(() => {
        wrapper?.unmount();
        wrapper = undefined;
        vi.unstubAllGlobals();
    });

    const runFrames = () => {
        const due = frames.splice(0);
        for (const cb of due) cb(performance.now());
    };

    it("arms no warm at mount, one in the frame after the first content, none after a later one", () => {
        let onSceneContent!: () => void;
        wrapper = mount(
            defineComponent({
                setup() {
                    ({ onSceneContent } = useSceneTransition({
                        mutate: () => {},
                        sceneHost: ref<HTMLElement | null>(null),
                        whenSceneReady: () => Promise.resolve(),
                    }));
                    return () => h("div");
                },
            }),
        );
        runFrames();
        // The deep link's chunk is in flight: no warm may be armed yet.
        expect(idle).not.toHaveBeenCalled();

        onSceneContent();
        // Armed in the next frame, so the idle period follows that frame's paint.
        expect(idle).not.toHaveBeenCalled();
        runFrames();
        expect(idle).toHaveBeenCalledTimes(1);

        // A swap's resolve is not a first paint: nothing more is armed.
        onSceneContent();
        runFrames();
        expect(idle).toHaveBeenCalledTimes(1);
    });
});
