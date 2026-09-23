/**
 * KF.W13U.w (OA-27, COHESION §0be) — the cube's three channels COMPOSE.
 *
 * The owner: "The cube doesn't animate, none of the animations are wired up."
 * Measured on the served page (headed, real GPU): after Play the only engine
 * write on `.cube` was `translateY(…)` — the Hover channel. Each of the cube
 * group's channels (Rotations · Matrix · Hover) authors a WHOLE `transform`, and
 * a group layer's default `replace` op keeps one writer per property per
 * element (README `AnimationGroup`), so on one shared `.cube` the spin and the
 * pose were overwritten every frame. The cure gives each channel its own nested
 * element (CubeTarget: `.cube-bob` › `.cube-pose` › `.cube`) and declares the
 * group's per-animation path.
 *
 * This witness drives the REAL `useCubeDemo` group across its timeline and reads
 * each element's written transform: the spin lands on `.cube` (≥3 distinct
 * rotate lists), the bob on `.cube-bob`, the pose on `.cube-pose` — no channel
 * erases another. At the pre-cure bytes every channel painted `.cube` and the
 * spin assertion reads the bob (`translateY(…)`) instead.
 */
import { beforeAll, describe, expect, it } from "vitest";
import { ref } from "vue";
import { withSetup } from "../../support/withSetup";
import { warmKfEngine } from "../../../demo/kf-engine";
import { useCubeDemo } from "../../../demo/scenes/cube/useCubeDemo";
import { createMatrix } from "../../../demo/scenes/cube/matrix-editor/transformMath";

const el = (parent: HTMLElement, cls: string): HTMLElement => {
    const node = document.createElement("div");
    node.className = cls;
    parent.appendChild(node);
    return node;
};

describe("KF.W13U.w — the cube's channels compose on their own elements", () => {
    beforeAll(async () => {
        await warmKfEngine();
    });

    it("spin, pose and bob each write their own element across the timeline", () => {
        const [demo] = withSetup(() =>
            useCubeDemo(ref(createMatrix()), ref(createMatrix())),
        );
        const graphEl = el(document.body, "graph");
        const bobEl = el(graphEl, "cube-bob");
        const poseEl = el(bobEl, "cube-pose");
        const cubeEl = el(poseEl, "cube");
        cubeEl.style.setProperty("--rotationX", "360deg");

        demo.setTargets({ cubeEl, bobEl, poseEl, graphEl });
        const group = demo.animationGroup.value;
        expect(group.singleTarget).toBe(false);

        const spins = new Set<string>();
        const bobs = new Set<string>();
        for (const t of [0, 400, 800, 1200, 1600]) {
            for (const anim of [
                demo.rotationAnim.value,
                demo.matrixAnim.value,
                demo.hoverAnim.value,
            ]) {
                group.setChildTime(anim, t);
            }
            group.render();
            spins.add(cubeEl.style.transform);
            bobs.add(bobEl.style.transform);
            expect(poseEl.style.transform).toMatch(/^matrix3d\(/);
        }

        expect([...spins].every((s) => /rotateY\(/.test(s))).toBe(true);
        expect(spins.size).toBeGreaterThanOrEqual(3);
        expect([...bobs].every((s) => /^translateY\(/.test(s))).toBe(true);
        expect(bobs.size).toBeGreaterThanOrEqual(2);

        group.stop();
    });
});
