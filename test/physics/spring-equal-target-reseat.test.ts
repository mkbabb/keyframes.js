import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Draggable } from "../../src/animation/orchestration/drag";
import { SpringProgress } from "../../src/animation/physics/spring";

/**
 * K-1 (COHESION §0he.4) — a velocity reset followed by an EQUAL target must
 * still run the spring to rest and commit.
 *
 * `Draggable.handleUp` (snap branch) calls `spring.reset(release, velocity)` —
 * which seats `target = release` and stops the managed loop — and then sets
 * `spring.target = snapTarget`. When the nearest snap IS the release point the
 * two are equal; `set target`'s early return (keyed on the construction-time
 * `initialVelocity` option, not the live velocity) swallowed the write, so the
 * managed loop was never re-armed: the spring never ticked, never settled,
 * never committed. The setter's no-op is only sound when the spring carries
 * no velocity.
 */

const FRAME_MS = 1000 / 60;

function firePointer(
    el: HTMLElement,
    type: string,
    { clientX, t }: { clientX: number; t: number },
): void {
    const e = new PointerEvent(type, { pointerId: 1, clientX, clientY: 0 });
    Object.defineProperty(e, "timeStamp", { value: t, configurable: true });
    el.dispatchEvent(e);
}

describe("K-1 — equal target after a velocity reset re-seats the spring", () => {
    beforeEach(() => {
        vi.useFakeTimers({
            toFake: [
                "requestAnimationFrame",
                "cancelAnimationFrame",
                "performance",
                "setTimeout",
                "clearTimeout",
            ],
        });
    });
    afterEach(() => vi.useRealTimers());

    it("SpringProgress: reset(x, v≠0) + target = x ticks, settles at x, commits", () => {
        const spring = new SpringProgress({ response: 0.3, dampingFraction: 0.8 });
        const frames: Array<[number, number]> = [];
        spring.play((value, velocity) => frames.push([value, velocity]));

        spring.reset(0.5, 4);
        expect(spring.settled).toBe(false);
        const before = frames.length;
        spring.target = 0.5; // equal to the reset point, velocity nonzero

        vi.advanceTimersByTime(3000);

        // It ticked: the managed loop emitted frames after the equal write.
        expect(frames.length).toBeGreaterThan(before + 5);
        // It moved off the seat point (the velocity carried it) ...
        expect(Math.max(...frames.slice(before).map(([v]) => v))).toBeGreaterThan(0.5);
        // ... and it committed: settled at the target with zero velocity.
        expect(spring.settled).toBe(true);
        expect(spring.value).toBe(0.5);
        expect(spring.velocity).toBe(0);
    });

    it("SpringProgress: an equal target at rest stays a no-op", () => {
        const spring = new SpringProgress();
        const frames: number[] = [];
        spring.play((v) => frames.push(v));
        spring.reset(0.25, 0);
        const before = frames.length;
        spring.target = 0.25;
        vi.advanceTimersByTime(500);
        expect(frames.length).toBe(before);
        expect(spring.settled).toBe(true);
        expect(spring.value).toBe(0.25);
    });

    it("Draggable snap: release ON the nearest snap with velocity runs to rest and commits", () => {
        const el = document.createElement("div");
        document.body.appendChild(el);
        // The projected rest (release + v/k) stays nearest the release snap.
        const d = new Draggable({ axis: "x", snap: [100, 1000] });
        d.attach(el);
        const frames: number[] = [];
        d.spring.play((v) => frames.push(v));

        firePointer(el, "pointerdown", { clientX: 80, t: 0 });
        firePointer(el, "pointermove", { clientX: 90, t: FRAME_MS });
        firePointer(el, "pointermove", { clientX: 100, t: 2 * FRAME_MS });
        firePointer(el, "pointerup", { clientX: 100, t: 3 * FRAME_MS });

        expect(d.spring.target).toBe(100);
        expect(d.spring.velocity).not.toBe(0);
        const before = frames.length;

        vi.advanceTimersByTime(3000);

        expect(frames.length).toBeGreaterThan(before + 5);
        expect(d.spring.settled).toBe(true);
        expect(d.spring.value).toBe(100);
        expect(d.spring.velocity).toBe(0);
        d.dispose();
    });
});
