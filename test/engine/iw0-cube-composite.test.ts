import { describe, it, expect } from "vitest";
import { CSSKeyframesAnimation } from "@src/animation/engine";
import { AnimationGroup } from "@src/animation/group";
import type { CssList } from "@mkbabb/value.js/value";

const rotationValue = (x: number, y: number, z: number): CssList => ({
    kind: "list",
    separator: "space",
    items: [
        {
            kind: "call",
            name: "rotateX",
            args: [
                {
                    kind: "scalar",
                    payload: { type: "number", value: x, unit: "deg" },
                },
            ],
        },
        {
            kind: "call",
            name: "rotateY",
            args: [
                {
                    kind: "scalar",
                    payload: { type: "number", value: y, unit: "turn" },
                },
            ],
        },
        {
            kind: "call",
            name: "rotateZ",
            args: [
                {
                    kind: "scalar",
                    payload: { type: "number", value: z, unit: "deg" },
                },
            ],
        },
    ],
});

// I.W0 diagnostic — does the cube AnimationGroup composite actually WRITE a
// transform to its target across t? Mirrors demo/scenes/cube/useCubeDemo.ts
// (Rotations rotateY 0→1turn + rotateZ 0→360deg, with an unset var(--rotationX)
// on rotateX). If the group composites a real transform, the target's
// style.transform must take ≥3 distinct values across the timeline.
describe("I.W0 cube group composite", () => {
    it("writes distinct transforms to the target across the timeline", () => {
        const el = document.createElement("div");
        document.body.appendChild(el);

        const rotation = new CSSKeyframesAnimation({
            duration: 1000,
            iterationCount: 1,
        }).fromKeyframes({
            from: { transform: rotationValue(0, 0, 0) },
            "100%": {
                transform: rotationValue(30, 1, 360),
            },
        });
        rotation.setTargets(el);

        const group = new AnimationGroup(rotation as any);

        const seen = new Set<string>();
        // Drive the group across the timeline and sample the target transform.
        for (let i = 0; i <= 10; i++) {
            const t = (i / 10) * 1000;
            // setChildTime + render composites at the child's current t.
            group.setChildTime(rotation as any, t).render();
            const transform = el.style.transform;
            if (transform && transform !== "none") seen.add(transform);
        }
        // Diagnostic dump (visible on failure).
        console.log(
            "[iw0] distinct target transforms:",
            seen.size,
            [...seen].slice(0, 3),
        );
        expect(seen.size).toBeGreaterThanOrEqual(3);
    });
});
