import { afterEach, describe, expect, it, vi } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { AnimationGroup, isGroupWAAPIEligible } from "../../src/animation/group";

const makeAnimation = (target: HTMLElement, value: string) =>
    new CSSKeyframesAnimation({ duration: 100, useWAAPI: true }, target).fromString(
        `@keyframes c16 { from { opacity: ${value}; animation-timing-function: linear; } to { opacity: ${value}; } }`,
    );

describe("U.C16 delegated group lifecycle", () => {
    afterEach(() => vi.restoreAllMocks());

    it("keeps pause/resume/stop lifecycle in lockstep with native effects", async () => {
        const target = document.createElement("div");
        const frameQueue: FrameRequestCallback[] = [];
        const raf = vi
            .spyOn(window, "requestAnimationFrame")
            .mockImplementation((callback) => {
                frameQueue.push(callback);
                return frameQueue.length;
            });
        vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});

        const handles = [
            { pause: vi.fn(), play: vi.fn(), cancel: vi.fn() },
            { pause: vi.fn(), play: vi.fn(), cancel: vi.fn() },
        ];
        const allHandles = [...handles];
        Object.defineProperty(target, "animate", {
            configurable: true,
            value: vi.fn(() => handles.shift() as unknown as Animation),
        });

        const group = AnimationGroup.of(
            makeAnimation(target, "0.2"),
            makeAnimation(target, "0.3"),
        );
        expect(isGroupWAAPIEligible(group)).toEqual(expect.objectContaining({ eligible: true }));
        const pending = group.play();
        expect(group._waapiDelegated).toBe(true);
        expect(target.animate).toHaveBeenCalledTimes(2);
        expect(frameQueue).toHaveLength(1);

        frameQueue.shift()?.(0);
        group.pause();
        expect(group.paused).toBe(true);
        // The native handles are retained by the group even though the test
        // deliberately uses tiny, non-DOM Animation doubles.
        expect(group._waAnimations).toHaveLength(2);
        group.resume();
        expect(group.paused).toBe(false);

        group.stop();
        await pending;
        expect(group._waapiDelegated).toBe(false);
        expect(group._waAnimations).toHaveLength(0);
        expect(allHandles[0]!.pause).toHaveBeenCalledOnce();
        expect(allHandles[0]!.play).toHaveBeenCalledOnce();
        expect(allHandles[0]!.cancel).toHaveBeenCalledOnce();
        expect(raf).toHaveBeenCalled();
    });
});
