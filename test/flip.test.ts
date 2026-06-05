import { describe, expect, it } from "vitest";
import { flip, flipShared } from "../src/animation/flip";

/**
 * jsdom returns an all-zero rect from `getBoundingClientRect` and never lays
 * out, so we stub the method to return a controlled rect. `stubRect` lets a
 * test drive what each measurement returns (and flip the value mid-`mutate`).
 */
interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

const stubRect = (el: HTMLElement, get: () => Rect): void => {
    el.getBoundingClientRect = () => {
        const r = get();
        return {
            x: r.x,
            y: r.y,
            width: r.width,
            height: r.height,
            top: r.y,
            left: r.x,
            right: r.x + r.width,
            bottom: r.y + r.height,
            toJSON() {},
        } as DOMRect;
    };
};

/** Parse `translate(Xpx, Ypx) scale(SX, SY)` into numbers. */
const parseTransform = (transform: string) => {
    const t = /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(transform);
    const s = /scale\(([-\d.]+),\s*([-\d.]+)\)/.exec(transform);
    return {
        tx: t ? parseFloat(t[1]!) : NaN,
        ty: t ? parseFloat(t[2]!) : NaN,
        sx: s ? parseFloat(s[1]!) : NaN,
        sy: s ? parseFloat(s[2]!) : NaN,
    };
};

describe("flip", () => {
    it("inverts to the BEFORE rect at t=0 (the FLIP identity)", () => {
        const el = document.createElement("div");
        const before: Rect = { x: 0, y: 0, width: 100, height: 50 };
        const after: Rect = { x: 200, y: 100, width: 200, height: 100 };

        let current = before;
        stubRect(el, () => current);

        // duration 0 short-circuits to the final paint, but we want to inspect
        // the t=0 inversion, so we run with a duration and read the transform
        // synchronously right after construction (before the rAF fires).
        flip(
            el,
            () => {
                current = after;
            },
            { duration: 100 },
        );

        // The element is physically at `after`; the t=0 transform must place it
        // back at `before` — translate by (before − after), scale by
        // (before.size / after.size).
        const { tx, ty, sx, sy } = parseTransform(el.style.transform);
        expect(tx).toBeCloseTo(before.x - after.x); // -200
        expect(ty).toBeCloseTo(before.y - after.y); // -100
        expect(sx).toBeCloseTo(before.width / after.width); // 0.5
        expect(sy).toBeCloseTo(before.height / after.height); // 0.5
    });

    it("lands at identity (the AFTER rect) at t=1", async () => {
        const el = document.createElement("div");
        const before: Rect = { x: 0, y: 0, width: 100, height: 50 };
        const after: Rect = { x: 200, y: 100, width: 200, height: 100 };

        let current = before;
        stubRect(el, () => current);

        await flip(
            el,
            () => {
                current = after;
            },
            { duration: 30 },
        );

        const { tx, ty, sx, sy } = parseTransform(el.style.transform);
        expect(tx).toBeCloseTo(0);
        expect(ty).toBeCloseTo(0);
        expect(sx).toBeCloseTo(1);
        expect(sy).toBeCloseTo(1);
    });

    it("BITE: a no-op mutate (before == after) yields the identity transform at t=0", () => {
        const el = document.createElement("div");
        const rect: Rect = { x: 10, y: 20, width: 100, height: 50 };
        stubRect(el, () => rect);

        // mutate does nothing — before and after rects are identical.
        flip(el, () => {}, { duration: 100 });

        const { tx, ty, sx, sy } = parseTransform(el.style.transform);
        // Identity: zero translate, unit scale. A non-identity here reds.
        expect(tx).toBeCloseTo(0);
        expect(ty).toBeCloseTo(0);
        expect(sx).toBeCloseTo(1);
        expect(sy).toBeCloseTo(1);
    });

    it("calls mutate exactly once, between the two measurements (batched reads)", () => {
        const el = document.createElement("div");
        const measurements: Rect[] = [];
        let current: Rect = { x: 0, y: 0, width: 100, height: 100 };
        let mutateCalls = 0;

        stubRect(el, () => {
            measurements.push({ ...current });
            return current;
        });

        flip(
            el,
            () => {
                mutateCalls++;
                current = { x: 50, y: 50, width: 100, height: 100 };
            },
            { duration: 30 },
        );

        // Exactly one mutate; exactly two measurements (read-mutate-read). The
        // morph caches the rects at construction, so the play loop never
        // re-reads — no layout thrash.
        expect(mutateCalls).toBe(1);
        expect(measurements.length).toBe(2);
        expect(measurements[0]).toEqual({ x: 0, y: 0, width: 100, height: 100 });
        expect(measurements[1]).toEqual({
            x: 50,
            y: 50,
            width: 100,
            height: 100,
        });
    });

    it("duration: 0 paints the final (identity) transform immediately", async () => {
        const el = document.createElement("div");
        let current: Rect = { x: 0, y: 0, width: 100, height: 100 };
        stubRect(el, () => current);

        await flip(
            el,
            () => {
                current = { x: 80, y: 0, width: 100, height: 100 };
            },
            { duration: 0 },
        );

        const { tx, ty, sx, sy } = parseTransform(el.style.transform);
        expect(tx).toBeCloseTo(0);
        expect(ty).toBeCloseTo(0);
        expect(sx).toBeCloseTo(1);
        expect(sy).toBeCloseTo(1);
    });

    it("applies the transformOrigin", () => {
        const el = document.createElement("div");
        const rect: Rect = { x: 0, y: 0, width: 100, height: 100 };
        stubRect(el, () => rect);
        flip(el, () => {}, { duration: 50, transformOrigin: "center center" });
        expect(el.style.transformOrigin).toBe("center center");
    });
});

describe("flipShared", () => {
    it("starts a at identity (its own rect) at t=0 — a does not move in the DOM", () => {
        const a = document.createElement("div");
        const b = document.createElement("div");
        const aRect: Rect = { x: 0, y: 0, width: 100, height: 100 };
        const bRect: Rect = { x: 300, y: 200, width: 50, height: 50 };
        stubRect(a, () => aRect);
        stubRect(b, () => bRect);

        flipShared(a, b, { duration: 100 });

        // `a` is physically at its own rect; the forward morph starts at
        // identity (t=0, a visually at its own rect) and walks toward b's rect.
        const { tx, ty, sx, sy } = parseTransform(a.style.transform);
        expect(tx).toBeCloseTo(0);
        expect(ty).toBeCloseTo(0);
        expect(sx).toBeCloseTo(1);
        expect(sy).toBeCloseTo(1);
    });

    it("lands a on b's rect (the full delta) at t=1", async () => {
        const a = document.createElement("div");
        const b = document.createElement("div");
        const aRect: Rect = { x: 0, y: 0, width: 100, height: 100 };
        const bRect: Rect = { x: 300, y: 200, width: 50, height: 50 };
        stubRect(a, () => aRect);
        stubRect(b, () => bRect);

        await flipShared(a, b, { duration: 30 });

        // At t=1, `a` is translated/scaled onto b's rect: delta = after − before.
        const { tx, ty, sx, sy } = parseTransform(a.style.transform);
        expect(tx).toBeCloseTo(bRect.x - aRect.x); // 300
        expect(ty).toBeCloseTo(bRect.y - aRect.y); // 200
        expect(sx).toBeCloseTo(bRect.width / aRect.width); // 0.5
        expect(sy).toBeCloseTo(bRect.height / aRect.height); // 0.5
    });
});
