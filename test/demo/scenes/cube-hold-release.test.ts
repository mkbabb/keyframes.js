// SERVED MODEL: claude-opus-5-5
import { describe, expect, it } from "vitest";
import { effectScope } from "vue";

import { useOrbitalGesture } from "../../../demo/scenes/cube/orbital-drag/composables/useOrbitalGesture";
import type { OrbitState } from "../../../demo/scenes/cube/orbital-drag/composables/useOrbitalGesture";
import type { Vec3 } from "../../../demo/scenes/cube/orbital-drag/arcball";
import { attitudeQuat } from "../../../demo/scenes/cube/graphAttitude";

/**
 * X.KF.W13X `.cube` · KFA-82 — a HELD pointer releases with no fling, now
 * against the ONE reader (KF-M2): the release ω is read off the last 80 ms of
 * attitude samples, and a release more than 64 ms after the last move is a
 * hold. The served half is read by the committed probe
 * `scripts/probe/kf-stage-and-orbit.mjs`.
 */

const at = (type: string, x: number, y: number, timeStamp: number) => {
    const e = new PointerEvent(type, { clientX: x, clientY: y, pointerId: 1, pointerType: "mouse" });
    Object.defineProperty(e, "timeStamp", { value: timeStamp });
    return e;
};

describe("KFA-82 — a held pointer releases with no fling", () => {
    const harness = () => {
        const released: Vec3[] = [];
        const container = document.createElement("div");
        document.body.append(container);
        const state: OrbitState = { q: [0, 0, 0, 1], t: { x: 0, y: 0 }, s: 1 };
        const scope = effectScope();
        const gesture = scope.run(() =>
            useOrbitalGesture({
                surfaceRef: () => container,
                scrollOwner: () => "stage",
                G: attitudeQuat(),
                state,
                frame: () => ({ centre: { x: 0, y: 0 }, side: 200, fit: 1, stage: null }),
                scaleRange: [0.4, 3],
                requestCommit: () => {},
                onGestureStart: () => {},
                onGestureEnd: (release) => void released.push(release.omega),
                onGlide: () => {},
            }),
        )!;
        return {
            gesture,
            released,
            dispose: () => {
                scope.stop();
                container.remove();
            },
        };
    };

    it("release 400 ms after the last move reads ω = 0", () => {
        const { gesture, released, dispose } = harness();
        gesture.onPointerDown(at("pointerdown", 0, 0, 0));
        document.dispatchEvent(at("pointermove", 30, 10, 16));
        document.dispatchEvent(at("pointermove", 60, 20, 32));
        document.dispatchEvent(at("pointerup", 60, 20, 432));
        expect(released).toEqual([[0, 0, 0]]);
        dispose();
    });

    it("release in the move's own frame keeps the fling", () => {
        const { gesture, released, dispose } = harness();
        gesture.onPointerDown(at("pointerdown", 0, 0, 0));
        document.dispatchEvent(at("pointermove", 30, 10, 16));
        document.dispatchEvent(at("pointermove", 60, 20, 32));
        document.dispatchEvent(at("pointerup", 60, 20, 40));
        expect(released).toHaveLength(1);
        expect(Math.hypot(...released[0]!)).toBeGreaterThan(1);
        dispose();
    });
});
