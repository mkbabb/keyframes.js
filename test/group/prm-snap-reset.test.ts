// SERVED MODEL: claude-opus-5-5
import { afterEach, describe, expect, it, vi } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { AnimationGroup } from "../../src/animation/group";

/**
 * Under `prefers-reduced-motion: reduce` a group's `play()` snaps every child
 * to its final frame and settles, so each child reads `started = false` and
 * `t = 0` while its target still shows the final frame. `reset()` rewound only
 * children that were started or had a moved playhead, so after a snapped Play
 * the stop / Reset left the final pose standing (daraksha's Motion: Again
 * under reduced motion kept the pose channel's skew). Reset is "every channel
 * back to its initial frame", so a snapped group is rewound too.
 */
const reduced = (matches: boolean) =>
    Object.defineProperty(window, "matchMedia", {
        writable: true,
        configurable: true,
        value: vi.fn((query: string) => ({
            matches: query.includes("prefers-reduced-motion") && matches,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })),
    });

const channel = (from: number, to: number) => {
    const a = new CSSKeyframesAnimation<{ opacity: number }>({
        duration: 1000,
        iterationCount: "infinite",
        useWAAPI: false,
    } as never).fromString(`from { opacity: ${from}; } to { opacity: ${to}; }`);
    const el = document.createElement("div");
    a.setTargets(el);
    return { a, el };
};

afterEach(() => reduced(false));

describe("reduced motion: stop() after a snapped play() rewinds to the initial frame", () => {
    it("paints every child's initial frame", async () => {
        reduced(true);
        const pose = channel(0.2, 0.9);
        const bob = channel(0.1, 0.6);
        const group = new AnimationGroup<any>(pose.a, bob.a);
        group.singleTarget = false;

        await group.play();
        expect(Number(pose.el.style.opacity)).toBeCloseTo(0.9, 6);
        expect(pose.a.started).toBe(false);

        group.stop();

        expect(Number(pose.el.style.opacity)).toBeCloseTo(0.2, 6);
        expect(Number(bob.el.style.opacity)).toBeCloseTo(0.1, 6);
    });

    it("a second stop() paints nothing new (the snap is consumed)", async () => {
        reduced(true);
        const pose = channel(0.2, 0.9);
        const group = new AnimationGroup<any>(pose.a);
        group.singleTarget = false;
        await group.play();
        group.stop();
        pose.el.style.opacity = "0.5";
        group.stop();
        expect(pose.el.style.opacity).toBe("0.5");
    });
});
