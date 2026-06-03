import { afterEach, describe, expect, it, vi } from "vitest";
import { easeOutCubic } from "@mkbabb/value.js";
import { EasingResolvable } from "../src/animation/internal/easing-resolvable";
import { NumericAnimation } from "../src/animation/numeric";
import { ManualTimeline } from "../src/animation/timeline";

// A macrotask flush — long enough for the dynamic `import("../engine")` + the
// `getTimingFunction` lookup to land WITHOUT any explicit `.ready()`/`.play()`,
// proving the eager-resolve-on-construct path.
const flush = (): Promise<void> => new Promise((r) => setTimeout(r, 50));

describe("EasingResolvable contract", () => {
    afterEach(() => vi.restoreAllMocks());

    it("callable easing resolves synchronously — not pending, never warns", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        const r = new EasingResolvable(easeOutCubic);
        expect(r.pending).toBe(false);
        expect(r.fn(0.5)).toBeCloseTo(easeOutCubic(0.5), 10);
        r.warnIfPending("test");
        expect(warn).not.toHaveBeenCalled();
    });

    it("omitted easing is the identity fallback — not pending", () => {
        const r = new EasingResolvable(undefined);
        expect(r.pending).toBe(false);
        expect(r.fn(0.42)).toBe(0.42);
    });

    it("string name is pending with the identity fallback until resolved", () => {
        const r = new EasingResolvable("ease-out-cubic");
        expect(r.pending).toBe(true);
        expect(r.fn(0.5)).toBeCloseTo(0.5, 10);
    });

    it("eager-resolves on construct — no explicit ready()/play() needed", async () => {
        const r = new EasingResolvable("ease-out-cubic");
        await flush();
        expect(r.pending).toBe(false);
        expect(r.fn(0.5)).toBeCloseTo(easeOutCubic(0.5), 10);
    });

    it("warnIfPending fires ONCE per instance while a name is pending", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        const r = new EasingResolvable("ease-out-cubic");
        r.warnIfPending("ctx");
        r.warnIfPending("ctx");
        r.warnIfPending("ctx");
        expect(warn).toHaveBeenCalledTimes(1);
        expect(String(warn.mock.calls[0]![0])).toContain("ease-out-cubic");
    });

    it("does not warn once the name has resolved", async () => {
        const r = new EasingResolvable("ease-out-cubic");
        await r.ready();
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        r.warnIfPending("ctx");
        expect(warn).not.toHaveBeenCalled();
    });

    it("fires the onResolved callback once when a name lands", async () => {
        const seen: Array<(t: number) => number> = [];
        const r = new EasingResolvable("ease-out-cubic", (fn) => seen.push(fn));
        await r.ready();
        expect(seen).toHaveLength(1);
        expect(seen[0]!(0.5)).toBeCloseTo(easeOutCubic(0.5), 10);
    });
});

describe("EasingResolvable integration — the silent-fallback window is closed + detectable", () => {
    afterEach(() => vi.restoreAllMocks());

    it("NumericAnimation.at() with a pending name is DETECTABLE via the dev-warn", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        const anim = new NumericAnimation([{ x: 0 }, { x: 100 }], {
            timingFunction: "ease-out-cubic",
        });
        // Synchronous `.at()` before resolution → identity fallback + ONE warn.
        expect(anim.at(0.5).x).toBeCloseTo(50);
        anim.at(0.5);
        anim.at(0.5);
        expect(warn).toHaveBeenCalledTimes(1);
        expect(String(warn.mock.calls[0]![0])).toContain(
            "NumericAnimation.at()",
        );
    });

    it("NumericAnimation eager-resolves the named curve without play()/ready()", async () => {
        const anim = new NumericAnimation([{ x: 0 }, { x: 100 }], {
            timingFunction: "ease-out-cubic",
        });
        await flush();
        // Resolved purely by the eager construct — no `.ready()`/`.play()`.
        expect(anim.at(0.5).x).toBeCloseTo(100 * easeOutCubic(0.5), 6);
    });

    it("Timeline.tick() with a pending name is DETECTABLE via the dev-warn", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        const tl = new ManualTimeline({ easing: "ease-out-cubic" });
        tl.set(0.5);
        expect(tl.tick()).toBeCloseTo(0.5, 10);
        tl.tick();
        expect(warn).toHaveBeenCalledTimes(1);
        expect(String(warn.mock.calls[0]![0])).toContain("Timeline.tick()");
    });

    it("a callable easing never warns (the value.js-free path)", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        const anim = new NumericAnimation([{ x: 0 }, { x: 100 }], {
            timingFunction: easeOutCubic,
        });
        anim.at(0.5);
        expect(warn).not.toHaveBeenCalled();
    });
});
