// SERVED MODEL: claude-opus-5-5
import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { AnimationGroup } from "../../src/animation/group";

/**
 * KFA-68 (X.KF.W13X.r4lib) — the group's `reset()` rewinds a child that was
 * only ever scrubbed.
 *
 * The Amiga rail is live at boot, so a user can scrub the stage before ever
 * pressing Play. `setChildTime(child, t).render()` paints the child at t but
 * never starts it, and `reset()` rewound only started children: dock Reset left
 * the pose where the scrub put it. Reset is "every channel back to its initial
 * frame", so a child whose playhead was moved is rewound too.
 */
const channel = (from: number, to: number) => {
    const a = new CSSKeyframesAnimation<{ opacity: number }>({
        duration: 1000,
        iterationCount: "infinite",
        useWAAPI: false,
    } as never).fromString(
        `from { opacity: ${from}; } to { opacity: ${to}; }`,
    );
    const el = document.createElement("div");
    a.setTargets(el);
    return { a, el };
};

describe("KFA-68 — Reset rewinds a scrubbed, never-started stage", () => {
    it("every scrubbed child paints its initial frame after reset()", () => {
        const spin = channel(0, 1);
        const wall = channel(0.2, 0.8);
        const group = new AnimationGroup<any>(spin.a, wall.a);

        group.setChildTime(spin.a, 600).render();
        expect(spin.a.started).toBe(false);
        expect(Number(spin.el.style.opacity)).toBeCloseTo(
            Number(spin.a.interpFrames(600, false).opacity),
            6,
        );

        group.reset();

        expect(Number(spin.el.style.opacity)).toBeCloseTo(0, 6);
        expect(spin.a.t).toBe(0);
    });
});
