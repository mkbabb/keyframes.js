/**
 * S.B7 · S4 — MotionPath scene composable coverage (a25 F1 · fold row 40).
 *
 * R.W5 fused the scene into `demo/scenes/motion-path/` and left its composables
 * with ZERO direct tests. This locks the two load-bearing pure seams the scene
 * relies on — `buildPathD` (the SINGLE `d` source both the guide `<path>` and the
 * traveller's `offset-path` re-read, so they can never drift) and
 * `clientToUserUnits` (the ONE square-viewBox px→user projection) — and smoke-
 * constructs the reactive demo + gesture composables (the scene-machine + gesture
 * wiring) so a construction regression reds here, mirroring scene-raf-leak.test.
 */
import { beforeAll, describe, expect, it } from "vitest";
import { effectScope, ref } from "vue";
import {
    DEFAULT_POINTS,
    PATH_D,
    VIEW,
    buildPathD,
    clientToUserUnits,
} from "../demo/scenes/motion-path/motionPathGeometry";
import { warmKfEngine } from "../demo/@/utils/kfEngine";
import { useMotionPathDemo } from "../demo/scenes/motion-path/useMotionPathDemo";
import { useMotionPathGesture } from "../demo/scenes/motion-path/useMotionPathGesture";

describe("motionPathGeometry — the single-source path compiler", () => {
    it("PATH_D is buildPathD(DEFAULT_POINTS) — one source, no drift", () => {
        expect(PATH_D).toBe(buildPathD(DEFAULT_POINTS));
    });

    it("compiles the editable net to M + three explicit C cubics, closed", () => {
        // The former `S` shorthands are expanded to explicit `C` — three cubic
        // segments for the figure loop, opened at the first anchor, closed by Z.
        expect(PATH_D.startsWith("M 60 200")).toBe(true);
        expect(PATH_D.endsWith("Z")).toBe(true);
        expect((PATH_D.match(/C /g) ?? []).length).toBe(3);
    });

    it("returns '' for a degenerate net (< 4 points)", () => {
        expect(buildPathD(DEFAULT_POINTS.slice(0, 3))).toBe("");
        expect(buildPathD([])).toBe("");
    });

    it("a dragged control point re-emits a different d", () => {
        const moved = DEFAULT_POINTS.map((p) =>
            p.id === "c0" ? { ...p, x: p.x + 40 } : p,
        );
        expect(buildPathD(moved)).not.toBe(PATH_D);
    });
});

describe("clientToUserUnits — the square-viewBox px→user projection", () => {
    const rect = { left: 0, top: 0, width: 400, height: 400 };

    it("maps a square stage uniformly on both axes", () => {
        expect(clientToUserUnits(rect, 200, 200)).toEqual({ x: 200, y: 200 });
        expect(clientToUserUnits(rect, 0, 0)).toEqual({ x: 0, y: 0 });
        // The far corner maps to (VIEW, VIEW).
        expect(clientToUserUnits(rect, 400, 400)).toEqual({ x: VIEW, y: VIEW });
    });

    it("offsets by the rect origin before scaling", () => {
        const off = { left: 50, top: 100, width: 400, height: 400 };
        expect(clientToUserUnits(off, 50, 100)).toEqual({ x: 0, y: 0 });
    });

    it("returns null for a degenerate (un-laid-out) rect", () => {
        expect(clientToUserUnits({ ...rect, width: 0 }, 10, 10)).toBeNull();
        expect(clientToUserUnits({ ...rect, height: 0 }, 10, 10)).toBeNull();
    });
});

describe("useMotionPathDemo / useMotionPathGesture construction", () => {
    beforeAll(async () => {
        await warmKfEngine();
    });

    it("constructs the demo + gesture composables without throwing", () => {
        const scope = effectScope();
        const handles = scope.run(() => {
            const demo = useMotionPathDemo();
            const gesture = useMotionPathGesture(demo, {
                stageEl: ref(null),
                guidePathEl: ref(null),
                travellerEl: ref(null),
            });
            return { demo, gesture };
        })!;
        expect(handles.demo).toBeTruthy();
        expect(handles.gesture).toBeTruthy();
        scope.stop();
    });
});
