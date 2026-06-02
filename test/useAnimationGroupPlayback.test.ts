import { describe, expect, it, vi } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { AnimationGroup } from "../src/animation/group";
import { useAnimationGroupPlayback } from "../demo/@/components/custom/animation-controls/composables/useAnimationGroupPlayback";

const extractNumeric = (value: unknown): number => {
    if (Array.isArray(value)) {
        return extractNumeric(value[0]);
    }
    if (typeof value === "object" && value != null && "value" in value) {
        return Number((value as { value: unknown }).value);
    }
    return Number(value);
};

function createPositionAnimation(
    name: string,
    key: "x" | "y",
    renderState: Record<"x" | "y", number>,
) {
    const animation = new CSSKeyframesAnimation({
        duration: 1000,
        timingFunction: "linear",
    }).fromVars(
        [
            { position: { [key]: 0 } },
            { position: { [key]: 100 } },
        ],
        (vars: Record<string, any>) => {
            renderState[key] = extractNumeric(vars.position[key]);
        },
    );
    animation.name = name;
    return animation;
}

describe("useAnimationGroupPlayback.sliderUpdate", () => {
    it("scrubs only the targeted animation in a single-target group", () => {
        const renderState = { x: 0, y: 0 };
        const xAnim = createPositionAnimation("X", "x", renderState);
        const yAnim = createPositionAnimation("Y", "y", renderState);
        const sharedTarget = document.createElement("div");

        xAnim.targets = [sharedTarget];
        yAnim.targets = [sharedTarget];

        const group = new AnimationGroup(xAnim as any, yAnim as any);
        const transformFramesGrouped = vi.spyOn(group, "transformFramesGrouped");
        group.transform = vi.fn();
        const emit = vi.fn();
        const storedControls = { selectedAnimation: "X", isControlsPanelOpen: true };

        const { sliderUpdate } = useAnimationGroupPlayback(
            () => group,
            storedControls,
            emit,
        );

        xAnim.startTime = 1000;
        yAnim.startTime = 1500;
        yAnim.t = 250;

        sliderUpdate({ t: 300, animation: xAnim });

        expect(xAnim.t).toBe(300);
        expect(xAnim.pausedTime).toBe(1300);
        // Sibling's t and pausedTime are untouched
        expect(yAnim.t).toBe(250);
        expect(yAnim.pausedTime).toBe(0);
        // Single-target groups go through the composed transform
        expect(transformFramesGrouped).toHaveBeenCalledOnce();
    });

    it("scrubs only the targeted animation in a multi-target group", () => {
        const renderState = { x: 0, y: 0 };
        const xAnim = createPositionAnimation("X", "x", renderState);
        const yAnim = createPositionAnimation("Y", "y", renderState);

        const group = new AnimationGroup(xAnim as any, yAnim as any);
        group.singleTarget = false;

        const transformFramesGrouped = vi.spyOn(group, "transformFramesGrouped");
        const emit = vi.fn();
        const storedControls = { selectedAnimation: "X", isControlsPanelOpen: true };

        const { sliderUpdate } = useAnimationGroupPlayback(
            () => group,
            storedControls,
            emit,
        );

        xAnim.startTime = 500;
        xAnim.t = 0;
        yAnim.t = 250;

        sliderUpdate({ t: 500, animation: xAnim });

        // Multi-target groups go through per-child transforms, not the composed path
        expect(transformFramesGrouped).not.toHaveBeenCalled();
        expect(xAnim.t).toBe(500);
        expect(xAnim.pausedTime).toBe(1000);
        // Sibling's t is untouched
        expect(yAnim.t).toBe(250);
        // Both children render at their own current t
        expect(renderState.x).toBeCloseTo(50, 4);
        expect(renderState.y).toBeCloseTo(25, 4);
    });

    it("leaves untouched siblings' durations alone when a longer animation is scrubbed", () => {
        const renderState = { x: 0, y: 0 };
        const xAnim = createPositionAnimation("X", "x", renderState);
        const yAnim = createPositionAnimation("Y", "y", renderState);
        yAnim.setDuration(2000);

        const group = new AnimationGroup(xAnim as any, yAnim as any);
        group.singleTarget = false;

        const emit = vi.fn();
        const storedControls = { selectedAnimation: "Y", isControlsPanelOpen: true };

        const { sliderUpdate } = useAnimationGroupPlayback(
            () => group,
            storedControls,
            emit,
        );

        sliderUpdate({ t: 1000, animation: yAnim });

        // Only yAnim's t moves; xAnim remains at its starting t
        expect(yAnim.t).toBe(1000);
        expect(xAnim.t).toBe(0);
        // Render reflects each child's own t (yAnim halfway, xAnim at start)
        expect(renderState.y).toBeCloseTo(50, 4);
        expect(renderState.x).toBeCloseTo(0, 4);
    });
});
