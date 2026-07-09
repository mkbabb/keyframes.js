import { describe, expect, it } from "vitest";
import { decay, decayRest } from "../../src/animation/physics/decay";
import { Draggable, drag } from "../../src/animation/orchestration/drag";
import { SpringProgress } from "../../src/animation/physics/spring";

/** 60fps frame step in milliseconds. */
const FRAME_MS = 1000 / 60;

/**
 * Dispatch a PointerEvent with a DETERMINISTIC `timeStamp` (jsdom assigns a
 * real-time stamp at dispatch otherwise, which would make velocity sampling
 * non-reproducible). Coordinates default to the named axis.
 */
function firePointer(
    el: HTMLElement,
    type: string,
    {
        pointerId = 1,
        clientX = 0,
        clientY = 0,
        t,
    }: {
        pointerId?: number;
        clientX?: number;
        clientY?: number;
        t: number;
    },
): void {
    const e = new PointerEvent(type, { pointerId, clientX, clientY });
    Object.defineProperty(e, "timeStamp", { value: t, configurable: true });
    el.dispatchEvent(e);
}

describe("decay (frictional glide closed form)", () => {
    it("matches x(t) = x0 + v0/k·(1 − e^(−kt)) at sampled t", () => {
        const x0 = 3;
        const v0 = 40;
        const k = 5;
        const sample = decay({ initial: x0, velocity: v0, friction: k });

        for (const t of [0.05, 0.1, 0.25, 0.5, 1, 2]) {
            const expected = x0 + (v0 / k) * (1 - Math.exp(-k * t));
            expect(sample(t).value).toBeCloseTo(expected, 9);
        }
    });

    it("velocity bleeds off as v(t) = v0·e^(−kt)", () => {
        const v0 = 100;
        const k = 4;
        const sample = decay({ velocity: v0, friction: k });
        for (const t of [0, 0.1, 0.5, 1]) {
            const expectedV = t <= 0 ? v0 : v0 * Math.exp(-k * t);
            expect(sample(t).velocity).toBeCloseTo(expectedV, 9);
        }
    });

    it("t ≤ 0 yields the seed state (x0, v0)", () => {
        const sample = decay({ initial: 7, velocity: 25, friction: 3 });
        expect(sample(0)).toEqual({ value: 7, velocity: 25 });
        expect(sample(-1)).toEqual({ value: 7, velocity: 25 });
    });

    it("asymptotes to the projected rest point x0 + v0/k", () => {
        const x0 = 2;
        const v0 = 30;
        const k = 6;
        const sample = decay({ initial: x0, velocity: v0, friction: k });
        const rest = x0 + v0 / k;
        // Far out in time, value → rest, velocity → 0.
        expect(sample(100).value).toBeCloseTo(rest, 9);
        expect(sample(100).velocity).toBeCloseTo(0, 9);
        // decayRest gives the same endpoint without running the loop.
        expect(decayRest({ initial: x0, velocity: v0, friction: k })).toBeCloseTo(
            rest,
            12,
        );
    });

    it("higher friction → shorter glide (closer rest point for same v0)", () => {
        const near = decayRest({ velocity: 50, friction: 10 });
        const far = decayRest({ velocity: 50, friction: 2 });
        expect(Math.abs(far)).toBeGreaterThan(Math.abs(near));
    });

    it("rejects non-positive friction (no finite rest point)", () => {
        expect(() => decay({ velocity: 1, friction: 0 })).toThrow();
        expect(() => decay({ velocity: 1, friction: -1 })).toThrow();
        expect(() => decayRest({ velocity: 1, friction: 0 })).toThrow();
    });

    it("defaults: initial 0, friction 5", () => {
        const sample = decay({ velocity: 50 });
        // rest = 0 + 50/5 = 10
        expect(sample(100).value).toBeCloseTo(10, 6);
    });
});

describe("Draggable — pointer follow + release-velocity fling", () => {
    function makeEl(): HTMLElement {
        const el = document.createElement("div");
        document.body.appendChild(el);
        return el;
    }

    it("attaches and tracks dragging state across down/up", () => {
        const el = makeEl();
        const d = new Draggable();
        d.attach(el);
        expect(d.dragging).toBe(false);

        firePointer(el, "pointerdown", { clientX: 0, t: 0 });
        expect(d.dragging).toBe(true);

        firePointer(el, "pointerup", { clientX: 0, t: 16 });
        expect(d.dragging).toBe(false);
        d.dispose();
    });

    it("pointermove sets the live spring target to the mapped coordinate", () => {
        const el = makeEl();
        const d = new Draggable({ axis: "x" });
        d.attach(el);

        firePointer(el, "pointerdown", { clientX: 0, t: 0 });
        firePointer(el, "pointermove", { clientX: 120, t: 16 });
        // The target follows the pointer (the spring re-seats toward it).
        expect(d.spring.target).toBe(120);
        d.dispose();
    });

    it("release velocity is handed to the spring re-seat (C¹ continuity)", () => {
        const el = makeEl();
        const d = new Draggable({ axis: "x" });
        d.attach(el);

        // A flick: 0 → 100px over 100ms = 1000 px/s = 1000 units/s.
        firePointer(el, "pointerdown", { clientX: 0, t: 0 });
        firePointer(el, "pointermove", { clientX: 50, t: 50 });
        firePointer(el, "pointermove", { clientX: 100, t: 100 });
        firePointer(el, "pointerup", { clientX: 100, t: 100 });

        // The spring left the release point at exactly the flick speed:
        // value == release position, velocity == release velocity.
        expect(d.spring.value).toBe(100);
        expect(d.spring.velocity).toBeCloseTo(1000, 6);
        expect(d.spring.settled).toBe(false);
        d.dispose();
    });

    it("a zeroed release velocity makes the handoff settled (no fling)", () => {
        const el = makeEl();
        const d = new Draggable({ axis: "x" });
        d.attach(el);

        // Down then up at the SAME point and time → zero velocity.
        firePointer(el, "pointerdown", { clientX: 40, t: 0 });
        firePointer(el, "pointerup", { clientX: 40, t: 0 });
        expect(d.spring.velocity).toBe(0);
        // With zero handoff velocity there is no fling — the continuity
        // BITE: a non-zero v here would mean a discontinuous handoff.
        expect(d.spring.settled).toBe(true);
        d.dispose();
    });

    it("fling trajectory continues to integrate after release", () => {
        const el = makeEl();
        const spring = new SpringProgress({
            response: 0.5,
            dampingFraction: 0.7,
        });
        const d = new Draggable({ axis: "x", spring });
        d.attach(el);

        firePointer(el, "pointerdown", { clientX: 0, t: 0 });
        firePointer(el, "pointermove", { clientX: 60, t: 60 });
        firePointer(el, "pointerup", { clientX: 60, t: 60 });

        const v0 = d.spring.velocity;
        expect(Math.abs(v0)).toBeGreaterThan(0);

        // Step the spring forward — it moves under its own physics.
        d.spring.tickDt(FRAME_MS);
        // It coasts PAST the release point in the flick direction.
        expect(d.spring.value).toBeGreaterThan(60);
        d.dispose();
    });

    it("transform maps client coords into the value domain", () => {
        const el = makeEl();
        const d = new Draggable({ axis: "x", transform: (px) => px / 100 });
        d.attach(el);

        firePointer(el, "pointerdown", { clientX: 0, t: 0 });
        firePointer(el, "pointermove", { clientX: 250, t: 16 });
        expect(d.spring.target).toBeCloseTo(2.5, 9);
        d.dispose();
    });

    it("axis 'y' tracks clientY", () => {
        const el = makeEl();
        const d = new Draggable({ axis: "y" });
        d.attach(el);

        firePointer(el, "pointerdown", { clientY: 0, t: 0 });
        firePointer(el, "pointermove", { clientX: 999, clientY: 80, t: 16 });
        // clientX ignored; target follows clientY.
        expect(d.spring.target).toBe(80);
        d.dispose();
    });

    it("subscribe bridges spring emissions; detach removes listeners", () => {
        const el = makeEl();
        const d = new Draggable({ axis: "x" });
        d.attach(el);

        const seen: Array<[number, number]> = [];
        const unsub = d.subscribe((v, vel) => seen.push([v, vel]));

        firePointer(el, "pointerdown", { clientX: 0, t: 0 });
        firePointer(el, "pointermove", { clientX: 30, t: 16 });
        expect(seen.length).toBeGreaterThan(0);

        unsub();
        d.detach();
        // After detach, a down on the element is no longer handled.
        firePointer(el, "pointerdown", { clientX: 100, t: 32 });
        expect(d.dragging).toBe(false);
        d.dispose();
    });

    it("drag() functional sugar attaches and returns the instance", () => {
        const el = makeEl();
        const d = drag(el, { axis: "x" });
        expect(d).toBeInstanceOf(Draggable);
        firePointer(el, "pointerdown", { clientX: 5, t: 0 });
        expect(d.dragging).toBe(true);
        d.dispose();
    });

    it("ignores pointer events from a different pointerId mid-gesture", () => {
        const el = makeEl();
        const d = new Draggable({ axis: "x" });
        d.attach(el);

        firePointer(el, "pointerdown", { pointerId: 1, clientX: 0, t: 0 });
        // A second pointer's move must not hijack the active gesture.
        firePointer(el, "pointermove", { pointerId: 2, clientX: 500, t: 16 });
        expect(d.spring.target).not.toBe(500);
        d.dispose();
    });
});
