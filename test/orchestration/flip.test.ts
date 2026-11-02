import { describe, expect, it } from "vitest";
import { flip, flipShared } from "../../src/animation/orchestration/flip";

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

/**
 * KF-4 (COHESION §0he.4; consumer Gregg, a second filter click waited out a
 * running 680 ms re-sort). A real browser's `getBoundingClientRect` reports the
 * VISUAL rect — the layout box with the inline `transform` applied. This stub
 * models exactly that (top-left origin: translate, then scale about the box's
 * top-left corner), so a mid-flight read sees the current interpolated rect.
 */
const stubLiveRect = (el: HTMLElement, layout: () => Rect): void => {
    stubRect(el, () => {
        const l = layout();
        if (!el.style.transform) return l;
        const { tx, ty, sx, sy } = parseTransform(el.style.transform);
        return {
            x: l.x + tx,
            y: l.y + ty,
            width: l.width * sx,
            height: l.height * sy,
        };
    });
};

const nextFrame = (): Promise<void> =>
    new Promise((r) => requestAnimationFrame(() => r()));

/** Wait (bounded) until the element's inline transform changes. */
const waitForMotion = async (el: HTMLElement): Promise<void> => {
    const start = el.style.transform;
    for (let i = 0; i < 60 && el.style.transform === start; i++) {
        await nextFrame();
    }
    await nextFrame();
    expect(el.style.transform).not.toBe(start);
};

const expectRectNear = (actual: Rect, expected: Rect, tol = 0.5): void => {
    expect(Math.abs(actual.x - expected.x)).toBeLessThanOrEqual(tol);
    expect(Math.abs(actual.y - expected.y)).toBeLessThanOrEqual(tol);
    expect(Math.abs(actual.width - expected.width)).toBeLessThanOrEqual(tol);
    expect(Math.abs(actual.height - expected.height)).toBeLessThanOrEqual(tol);
};

const visualOf = (el: HTMLElement): Rect => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
};

describe("KF-4: flip is cancellable and re-targets from the live rect", () => {
    const A: Rect = { x: 0, y: 0, width: 100, height: 50 };
    const B: Rect = { x: 400, y: 200, width: 200, height: 100 };
    const C: Rect = { x: 0, y: 300, width: 100, height: 50 };

    it("a two-target interrupt's first post-retarget frame equals the interrupted frame (<= 0.5 px), and the first flip stops (no queue)", async () => {
        const el = document.createElement("div");
        let layout = A;
        stubLiveRect(el, () => layout);

        const first = flip(el, () => (layout = B), { duration: 680 });
        await waitForMotion(el);
        const interrupted = visualOf(el);

        const second = flip(el, () => (layout = C), { duration: 680 });
        // The synchronous t=0 paint IS the first post-retarget frame.
        expectRectNear(visualOf(el), interrupted);

        // No queue: the interrupted flip settles now, not 680 ms later.
        const raced = await Promise.race([
            first.then(() => "settled"),
            nextFrame().then(() => "pending"),
        ]);
        expect(raced).toBe("settled");

        await second;
        expectRectNear(visualOf(el), C);
    });

    it("flip returns a Promise-like handle whose cancel() halts the play at the current frame", async () => {
        const el = document.createElement("div");
        let layout = A;
        stubLiveRect(el, () => layout);

        const handle = flip(el, () => (layout = B), { duration: 680 });
        expect(handle).toBeInstanceOf(Promise);
        await waitForMotion(el);
        handle.cancel();
        const frozen = el.style.transform;
        await handle;
        await nextFrame();
        await nextFrame();
        expect(el.style.transform).toBe(frozen);
    });

    it("flipShared: a re-target onto a new b starts from a's current interpolated rect", async () => {
        const a = document.createElement("div");
        const b1 = document.createElement("div");
        const b2 = document.createElement("div");
        stubLiveRect(a, () => A);
        stubRect(b1, () => B);
        stubRect(b2, () => C);

        const first = flipShared(a, b1, { duration: 680 });
        await waitForMotion(a);
        const interrupted = visualOf(a);

        const second = flipShared(a, b2, { duration: 680 });
        expectRectNear(visualOf(a), interrupted);

        const raced = await Promise.race([
            first.then(() => "settled"),
            nextFrame().then(() => "pending"),
        ]);
        expect(raced).toBe("settled");

        await second;
        expectRectNear(visualOf(a), C);
    });
});
