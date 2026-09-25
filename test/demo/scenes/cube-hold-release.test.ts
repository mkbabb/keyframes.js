// SERVED MODEL: claude-opus-5-5
import { describe, expect, it } from "vitest";
import { effectScope, ref, shallowRef } from "vue";
import { vec3 } from "gl-matrix";

import { useOrbitalPointer } from "../../../demo/scenes/cube/orbital-drag/composables/useOrbitalPointer";

/**
 * X.KF.W13X `.cube` · KFA-82 — the unit half of the hold-release row. The
 * served half is read by the committed probe
 * `docs/tranches/X/keyframes/evidence/W13X/cube/cube.mjs` in value.js.
 */

const at = (type: string, x: number, y: number, timeStamp: number) => {
    const e = new PointerEvent(type, { clientX: x, clientY: y, pointerId: 1, pointerType: "mouse" });
    Object.defineProperty(e, "timeStamp", { value: timeStamp });
    return e;
};

describe("KFA-82 — a held pointer releases with no fling", () => {
    const harness = () => {
        const speed = ref(0);
        const scope = effectScope();
        const pointer = scope.run(() =>
            useOrbitalPointer({
                sensitivity: 1,
                touchSensitivity: 1,
                containerRef: shallowRef<HTMLElement | null>(document.createElement("div")),
                // The fling's EMA lives in OrbitalDrag; the stub stands in for it.
                updateRotation: () => void (speed.value = 5),
                applyRotation: () => {},
                updateTranslation: () => {},
                updateScale: () => {},
                handleAxisSpecificInput: () => {},
                angularVelocityAxis: vec3.create(),
                angularVelocitySpeed: speed,
            }),
        )!;
        return { pointer, speed, dispose: () => scope.stop() };
    };

    it("release 400 ms after the last move zeroes the speed", () => {
        const { pointer, speed, dispose } = harness();
        pointer.startDrag(at("pointerdown", 0, 0, 0));
        pointer.drag(at("pointermove", 30, 10, 16));
        expect(speed.value).toBe(5);
        pointer.stopDrag(at("pointerup", 30, 10, 416));
        expect(speed.value).toBe(0);
        dispose();
    });

    it("release in the move's own frame keeps the fling", () => {
        const { pointer, speed, dispose } = harness();
        pointer.startDrag(at("pointerdown", 0, 0, 0));
        pointer.drag(at("pointermove", 30, 10, 16));
        pointer.stopDrag(at("pointerup", 30, 10, 32));
        expect(speed.value).toBe(5);
        dispose();
    });
});
