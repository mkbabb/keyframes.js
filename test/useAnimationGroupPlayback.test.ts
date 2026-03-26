import { describe, expect, it, vi } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation";
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
    it("uses grouped composition for single-target animation groups", () => {
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
        sliderUpdate({ t: 300, animation: xAnim });

        expect(transformFramesGrouped).toHaveBeenCalledOnce();
        expect(transformFramesGrouped).toHaveBeenCalledWith(300);
        expect(xAnim.pausedTime).toBe(1300);
        expect(yAnim.t).toBeCloseTo(300, 4);
        expect(yAnim.pausedTime).toBe(1800);
    });

    it("re-renders per-animation transforms for non-single-target groups", () => {
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

        expect(transformFramesGrouped).not.toHaveBeenCalled();
        expect(renderState.x).toBeCloseTo(50, 4);
        expect(renderState.y).toBeCloseTo(50, 4);
        expect(xAnim.pausedTime).toBe(1000);
    });

    it("maps selected progress onto child durations across the whole group", () => {
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

        expect(xAnim.t).toBeCloseTo(500, 4);
        expect(yAnim.t).toBeCloseTo(1000, 4);
        expect(renderState.x).toBeCloseTo(50, 4);
        expect(renderState.y).toBeCloseTo(50, 4);
    });
});
