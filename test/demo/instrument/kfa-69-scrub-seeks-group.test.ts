// SERVED MODEL: claude-opus-5-5
/**
 * X.KF.W13X.r4transport · KFA-69 (the demo binding) — the transport's group
 * scrub is a seek of the group: the selected child lands at the scrubbed time
 * and its phase-locked sibling moves to the same master time (the per-child
 * `setChildTime` left it behind). The library seek is test/group/kfa-69.
 */
import { describe, expect, it, vi } from "vitest";
import { reactive } from "vue";
import type { StoredAnimationGroupControlOptions } from "@state";
import { useAnimationGroupPlayback } from "../../../demo/components/instrument/transport/AnimationControlsGroup/useAnimationGroupPlayback";
import { CSSKeyframesAnimation } from "../../../src/animation/engine";
import { AnimationGroup } from "../../../src/animation/group";

const stored = (): StoredAnimationGroupControlOptions =>
    reactive({ selectedControl: "controls", selectedAnimation: "spin" }) as unknown as StoredAnimationGroupControlOptions;

describe("X.KF.W13X.r4transport — the group playback seam", () => {
    it("(5) KFA-69 — a scrub of the selected child seeks its phase-locked sibling to the same master time", () => {
        const make = (duration: number, name: string) => {
            const a = new CSSKeyframesAnimation({ duration, iterationCount: "infinite" } as never).fromString(
                "from { opacity: 0; } to { opacity: 1; }",
            );
            a.name = name;
            return a;
        };
        const spin = make(1000, "spin");
        const bob = make(1500, "bob");
        const group = new AnimationGroup(spin as never, bob as never);
        group.setChildTime(spin as never, 400).setChildTime(bob as never, 400);
        const { sliderUpdate } = useAnimationGroupPlayback(() => group as never, stored(), vi.fn());
        sliderUpdate({ t: 700, animation: spin as never });
        expect(spin.t).toBeCloseTo(700, 6);
        expect(bob.t).toBeCloseTo(700, 6);
    });
});
