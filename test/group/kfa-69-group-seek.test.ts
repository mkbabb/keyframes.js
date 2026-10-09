// SERVED MODEL: claude-opus-5-5
import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { AnimationGroup } from "../../src/animation/group";

/**
 * KFA-69 (X.KF.W13X.r4transport) — a scrub of one channel keeps phase-locked
 * siblings in phase.
 *
 * The Amiga ball's X/Y/Spin and the cube's spin/bob are children started
 * together: one master clock, each child at its own phase of it. The scrubber
 * moved ONE child (`setChildTime`), so X and Y held while Spin moved and the
 * lock was lost for the session. The group-level seek seats every child at one
 * master elapsed time, each modulo its own duration, and `elapsedOf` reads a
 * child's position back as that master time.
 */
const channel = (duration: number, direction = "normal") => {
    const a = new CSSKeyframesAnimation<{ opacity: number }>({
        duration,
        iterationCount: "infinite",
        direction,
        useWAAPI: false,
    } as never).fromString(`from { opacity: 0; } to { opacity: 1; }`);
    const el = document.createElement("div");
    a.setTargets(el);
    return { a, el };
};

describe("KFA-69 — the group-level seek", () => {
    it("seats every child at one master time, each modulo its own duration", () => {
        const spin = channel(1550);
        const px = channel(2400, "alternate");
        const py = channel(3367, "alternate");
        const group = new AnimationGroup<any>(spin.a, px.a, py.a);

        group.seek(3000).render();

        expect(spin.a.t).toBeCloseTo(3000 - 1550, 6);
        expect(spin.a.iteration).toBe(1);
        expect(px.a.t).toBeCloseTo(3000 - 2400, 6);
        expect(px.a.iteration).toBe(1);
        expect(px.a.reversed).toBe(true); // alternate: iteration 1 runs backwards
        expect(py.a.t).toBeCloseTo(3000, 6);
        expect(py.a.iteration).toBe(0);
        expect(py.a.reversed).toBe(false);
        for (const c of [spin, px, py]) expect(group.elapsedOf(c.a)).toBeCloseTo(3000, 6);
    });

    it("a scrub of the selected channel moves its siblings by the same master delta", () => {
        const spin = channel(1550);
        const bob = channel(2400);
        const group = new AnimationGroup<any>(spin.a, bob.a);
        group.seek(1000).render();
        const bobBefore = bob.el.style.opacity;

        // The ribbon seats the spin at t = 300 within its current iteration.
        group.seek(group.elapsedOf(spin.a) - spin.a.t + 300).render();

        expect(spin.a.t).toBeCloseTo(300, 6);
        expect(bob.a.t).toBeCloseTo(1000 + (300 - 1000), 6);
        expect(bob.el.style.opacity).not.toBe(bobBefore);
        expect(group.elapsedOf(bob.a)).toBeCloseTo(group.elapsedOf(spin.a), 6);
    });

    it("a finite child holds its last frame past its run", () => {
        const once = new CSSKeyframesAnimation<{ opacity: number }>({
            duration: 500,
            iterationCount: 2,
            useWAAPI: false,
        } as never).fromString(`from { opacity: 0; } to { opacity: 1; }`);
        once.setTargets(document.createElement("div"));
        const group = new AnimationGroup<any>(once, channel(1000).a);
        group.seek(5000);
        expect(once.iteration).toBe(1);
        expect(once.t).toBe(500);
    });
});
