/**
 * OD19 residue-2 (COHESION §0gq.3) — the square scene's mount reads no style.
 *
 * MEASURED (OD19 residue profile, real-GPU cell): SquareScene's mount read
 * `getComputedStyle(:root)` for the tumble egg's palette (`useSquareTumble`'s
 * onMounted), then `--square-travel` and the tour's root tokens (`paintRest`),
 * inside the warm swap's commit: a forced style recalc of the half-mounted
 * scene, ~4 ms of the amiga -> square commit frame.
 *
 * The witness drives the REAL `useSquareDemo` the way SquareScene's onMounted
 * does (bind the box, paint the rest pose): no `getComputedStyle` call. The
 * egg's palette is read once, by the first tumble, and kept; the sweep it
 * opens still recolours the box. Born RED at `fc1a3383` (three reads at mount).
 */
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { withSetup } from "../../support/withSetup";
import { useSquareDemo } from "../../../demo/scenes/square/useSquareDemo";
import { useSquareTumble } from "../../../demo/scenes/square/useSquareTumble";
import { warmKfEngine } from "../../../demo/kf-engine";

beforeAll(async () => {
    await warmKfEngine();
});

describe("the square scene's mount reads no style", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("binding the box and painting the rest pose call no getComputedStyle; the first tumble reads the palette once", () => {
        const styleReads = vi.spyOn(window, "getComputedStyle");
        const plate = document.createElement("div");
        const el = document.createElement("div");
        plate.append(el);
        document.body.append(plate);
        const [demo, app] = withSetup(() => useSquareDemo(ref(el)));
        try {
            // SquareScene's onMounted: bind the box, paint the rest pose.
            demo.anim.setTargets(el);
            demo.paintRest();
            expect(styleReads).not.toHaveBeenCalled();

            // The egg reads its palette at the first sweep, once.
            demo.tumble();
            expect(styleReads).toHaveBeenCalledTimes(1);
            demo.tumble();
            expect(styleReads).toHaveBeenCalledTimes(1);
        } finally {
            app.unmount();
            plate.remove();
        }
    });

    it("the sweep the first tumble opens recolours from the palette it read", () => {
        const [egg, app] = withSetup(() => useSquareTumble(() => {}));
        try {
            egg.tumble("#52e898");
            const frame = egg.sample(performance.now());
            expect(frame.live).toBe(true);
            expect(frame.marker).toBe(true);
            expect(frame.color).toBeTypeOf("string");
        } finally {
            app.unmount();
        }
    });
});
