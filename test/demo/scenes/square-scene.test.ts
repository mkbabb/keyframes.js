/**
 * S.B7 · S4 — Square scene composable coverage (a25 F1 · fold row 40).
 *
 * Locks `useSquareKeyboard` — the arrow/Home nudge + the "envelope tour" egg that
 * re-seats the SAME per-axis springs the drag uses (one authority, no second
 * rAF). The keydown → reseat/onTarget contract is asserted against real
 * `SpringProgress` springs. Smoke-constructs `useSquareDemo` (the spring
 * loop owner; warmed-engine wiring) and references the scene's transport key.
 */
import { beforeAll, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { withSetup } from "../../support/withSetup";
import { SpringProgress } from "../../../src/animation/physics/spring";
import { useSquareKeyboard } from "../../../demo/scenes/square/useSquareKeyboard";
import { useSquareDemo } from "../../../demo/scenes/square/useSquareDemo";
import { SQUARE_SCENE_ID } from "../../../demo/scenes/square/squareKeys";
import { warmKfEngine } from "../../../demo/kf-engine";

function harness() {
    const springX = new SpringProgress({
        response: 0.32,
        dampingFraction: 0.62,
        initial: 0,
    });
    const springY = new SpringProgress({
        response: 0.32,
        dampingFraction: 0.62,
        initial: 0,
    });
    const reseat = vi.fn();
    const onTarget = vi.fn();
    const onTakeOver = vi.fn();
    const { onKeydown } = useSquareKeyboard({
        springX,
        springY,
        reseat,
        onTakeOver,
        onTarget,
    });
    return { springX, springY, reseat, onTarget, onTakeOver, onKeydown };
}

const key = (k: string) => new KeyboardEvent("keydown", { key: k });

describe("useSquareKeyboard — the arrow/Home nudge", () => {
    it("ArrowRight nudges the x target by +0.25 and reports it", () => {
        const h = harness();
        h.onKeydown(key("ArrowRight"));
        expect(h.reseat).toHaveBeenCalledWith(0.25, 0);
        expect(h.onTarget).toHaveBeenCalledWith(0.25, 0);
    });

    it("ArrowUp nudges the y target negative (screen-up)", () => {
        const h = harness();
        h.onKeydown(key("ArrowUp"));
        expect(h.reseat).toHaveBeenCalledWith(0, -0.25);
    });

    it("clamps the nudge to the [-1, 1] travel field", () => {
        const h = harness();
        h.springX.target = 1;
        h.onKeydown(key("ArrowRight"));
        expect(h.reseat).toHaveBeenCalledWith(1, 0);
    });

    it("Home re-centres both axes", () => {
        const h = harness();
        h.onKeydown(key("Home"));
        expect(h.reseat).toHaveBeenCalledWith(0, 0);
        expect(h.onTarget).toHaveBeenCalledWith(0, 0);
    });

    it("'c' launches the envelope tour at the top-right corner", () => {
        const h = harness();
        h.onKeydown(key("c"));
        // The first leg re-seats synchronously to [1, -1] (top-right).
        expect(h.reseat).toHaveBeenCalledWith(1, -1);
        expect(h.onTarget).toHaveBeenCalledWith(1, -1);
    });

    it("ignores unrelated keys", () => {
        const h = harness();
        h.onKeydown(key("a"));
        expect(h.reseat).not.toHaveBeenCalled();
        expect(h.onTakeOver).not.toHaveBeenCalled();
    });

    // C-4 — the two-writer guarantee belongs to the FSM edge, not to the pointer
    // handler. EVERY keyboard branch that re-seats a spring must first enter the
    // takeover (pause the engine tour), and it must do so BEFORE the re-seat.
    it.each([["ArrowRight"], ["ArrowLeft"], ["ArrowUp"], ["ArrowDown"], ["Home"], ["End"], ["c"]])(
        "%s takes the box over from playback before it re-seats a spring",
        (k) => {
            const h = harness();
            const order: string[] = [];
            h.onTakeOver.mockImplementation(() => order.push("takeover"));
            h.reseat.mockImplementation(() => order.push("reseat"));
            h.onKeydown(key(k));
            expect(order).toEqual(["takeover", "reseat"]);
        },
    );
});

describe("useSquareDemo construction", () => {
    beforeAll(async () => {
        await warmKfEngine();
    });

    it("owns two per-axis springs; transport superKey stable", () => {
        const [anim, app] = withSetup(() => useSquareDemo(ref(null)));
        try {
            expect(anim.springX).toBeInstanceOf(SpringProgress);
            expect(anim.springY).toBeInstanceOf(SpringProgress);
            expect(SQUARE_SCENE_ID).toBe("square");
        } finally {
            // TC-5: mount teardown runs the composable's real disposal
            // (rAF/listener) — a bare effectScope().stop() never fired onUnmounted.
            app.unmount();
        }
    });
});
