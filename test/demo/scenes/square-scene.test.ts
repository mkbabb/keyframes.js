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
    const { onKeydown, tourEnvelope, notifySettled, cancelTour } =
        useSquareKeyboard({
            springX,
            springY,
            reseat,
            onTakeOver,
            onTarget,
        });
    return {
        springX,
        springY,
        reseat,
        onTarget,
        onTakeOver,
        onKeydown,
        tourEnvelope,
        notifySettled,
        cancelTour,
    };
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

    // D-19 — End is the MAXIMUM (APG), not a second Home; Shift is the fine
    // grain the fixed 0.25 ladder never had; the Page keys move a half step.
    it("End sends both axes to the far corner", () => {
        const h = harness();
        h.onKeydown(key("End"));
        expect(h.reseat).toHaveBeenCalledWith(1, 1);
        expect(h.onTarget).toHaveBeenCalledWith(1, 1);
    });

    it("Shift+Arrow is a fine nudge", () => {
        const h = harness();
        h.onKeydown(new KeyboardEvent("keydown", { key: "ArrowRight", shiftKey: true }));
        expect(h.reseat).toHaveBeenCalledWith(0.05, 0);
    });

    it("PageDown/PageUp move a half step on the vertical axis", () => {
        const h = harness();
        // `reseat` is a spy, so the spring's own target never moves between the
        // two presses — each is measured from rest, in its own direction.
        h.onKeydown(key("PageDown"));
        expect(h.reseat).toHaveBeenCalledWith(0, 0.5);
        h.onKeydown(key("PageUp"));
        expect(h.reseat).toHaveBeenLastCalledWith(0, -0.5);
    });

    // D-6/L-6 — a command is not a nudge. The branch matched on e.key alone and
    // called preventDefault() unconditionally, so the focused box swallowed
    // ⌘←/⌘↑ (and ⌘C, before the egg moved to the shortcut registry).
    it.each([["metaKey"], ["ctrlKey"], ["altKey"]])(
        "declines an arrow held with %s and does not preventDefault it",
        (modifier) => {
            const h = harness();
            const e = new KeyboardEvent("keydown", {
                key: "ArrowRight",
                cancelable: true,
                [modifier]: true,
            });
            h.onKeydown(e);
            expect(h.reseat).not.toHaveBeenCalled();
            expect(e.defaultPrevented).toBe(false);
        },
    );

    it("the envelope tour opens at the top-right corner", () => {
        const h = harness();
        // D-4 — `c` is a registry binding now, scoped to a focused box; the
        // tour verb itself is what this layer exports.
        h.tourEnvelope();
        // The first leg re-seats synchronously to [1, -1] (top-right).
        expect(h.reseat).toHaveBeenCalledWith(1, -1);
        expect(h.onTarget).toHaveBeenCalledWith(1, -1);
    });

    // MISS-3 / N-SQ-9 — THE DOCBLOCK'S INVARIANT IS AN ASSERTION. "The legs are
    // paced by the spring's own settle, not a fixed timer: each corner waits for
    // the chase to arrive" sat 46 lines above `setTimeout(step, 520)`. This is
    // the assertion that keeps it true, and it fails on any re-introduced timer.
    it("paces the envelope tour by the spring's own settle, not a fixed timer", () => {
        vi.useFakeTimers();
        try {
            const h = harness();
            h.tourEnvelope();
            expect(h.reseat).toHaveBeenLastCalledWith(1, -1);

            // No clock in the world advances it — only an arrival does.
            vi.advanceTimersByTime(10_000);
            expect(h.reseat).toHaveBeenCalledTimes(1);

            // Each settle opens exactly one leg, in ENVELOPE_LEGS order.
            const legs: [number, number][] = [
                [1, 1],
                [-1, 1],
                [-1, -1],
                [0, 0],
            ];
            for (const [nx, ny] of legs) {
                h.notifySettled();
                expect(h.reseat).toHaveBeenLastCalledWith(nx, ny);
            }

            // The tour is over: a further settle re-seats nothing.
            const after = h.reseat.mock.calls.length;
            h.notifySettled();
            h.notifySettled();
            expect(h.reseat).toHaveBeenCalledTimes(after);
        } finally {
            vi.useRealTimers();
        }
    });

    it("yields the springs when another authority takes the box over", () => {
        const h = harness();
        h.tourEnvelope();
        expect(h.reseat).toHaveBeenCalledTimes(1);
        h.cancelTour();
        h.notifySettled();
        expect(h.reseat).toHaveBeenCalledTimes(1);
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
    it.each([
        ["ArrowRight"],
        ["ArrowLeft"],
        ["ArrowUp"],
        ["ArrowDown"],
        ["PageUp"],
        ["PageDown"],
        ["Home"],
        ["End"],
    ])(
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
