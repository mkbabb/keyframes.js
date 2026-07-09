import { describe, expect, it, vi } from "vitest";
import { MotionPath, fromMotionPath } from "../../src/animation/svg/motion-path";
import { isWAAPIEligible } from "../../src/animation/waapi";
import { CSSKeyframesAnimation } from "../../src/animation/engine";

/**
 * F.W12 — CSS-native MotionPath gate.
 *
 * `MotionPath` animates `offset-distance: 0% → 100%` over an author-supplied
 * `offset-path`. It is pure WAAPI-eligible CSS that delegates compositor-thread
 * through the EXISTING eligibility gate — no new predicate, no geometry math,
 * zero value.js dep. These tests lock: the offset-path set + offset-distance
 * keyframe shape (clause 1), eligibility through the one gate (clause 2),
 * compositor-thread delegation (clause 3), and the no-regression posture.
 */

const PATH = "path('M 0 0 Q 100 -100 200 0')";

/** A DOM element with a stubbed `Element.animate` (jsdom lacks WAAPI). */
function waapiTarget(): {
    el: HTMLElement;
    spy: ReturnType<typeof vi.fn>;
} {
    const el = document.createElement("div");
    const spy = vi.fn(() => ({
        finished: Promise.resolve(),
        cancel: () => {},
        pause: () => {},
        play: () => {},
        playState: "running",
        commitStyles: () => {},
    }));
    (el as any).animate = spy;
    return { el, spy };
}

describe("MotionPath — offset-path set + offset-distance keyframe shape (S1)", () => {
    it("sets the author offset-path on the target", () => {
        const { el } = waapiTarget();
        fromMotionPath(el, { path: PATH, autoPlay: false });
        expect(el.style.offsetPath).toBe(PATH);
    });

    it("sets offset-rotate when `rotate` is given (tangent-following)", () => {
        const { el } = waapiTarget();
        fromMotionPath(el, { path: PATH, rotate: "auto", autoPlay: false });
        expect(el.style.offsetRotate).toBe("auto");
    });

    it("builds a frame set whose interpolating key is offset-distance, sweeping 0%→100%", () => {
        const { el } = waapiTarget();
        const anim = fromMotionPath(el, { path: PATH, autoPlay: false });

        // Collect every interpolating key + its endpoint units across frames.
        const keys = new Set<string>();
        const endpoints: { start?: string; stop?: string }[] = [];
        for (const frame of anim.frames) {
            for (const [key, arr] of Object.entries(frame.interpVars)) {
                keys.add(key);
                for (const iv of arr as any[]) {
                    endpoints.push({
                        start: `${iv.start?.value}${iv.start?.unit}`,
                        stop: `${iv.stop?.value}${iv.stop?.unit}`,
                    });
                }
            }
        }

        // The ONLY animated key is offset-distance.
        expect([...keys]).toEqual(["offset-distance"]);
        // …sweeping 0% → 100% (the path origin to the path end).
        expect(endpoints).toContainEqual({ start: "0%", stop: "100%" });
    });

    it("honors a custom from/to sub-range", () => {
        const { el } = waapiTarget();
        const anim = fromMotionPath(el, {
            path: PATH,
            from: "25%",
            to: "75%",
            autoPlay: false,
        });
        const seen: string[] = [];
        for (const frame of anim.frames) {
            for (const arr of Object.values(frame.interpVars)) {
                for (const iv of arr as any[]) {
                    seen.push(`${iv.start?.value}${iv.start?.unit}`);
                    seen.push(`${iv.stop?.value}${iv.stop?.unit}`);
                }
            }
        }
        expect(seen).toContain("25%");
        expect(seen).toContain("75%");
    });

    it("BITE: a missing path throws (no offset-path to traverse)", () => {
        const { el } = waapiTarget();
        expect(() => fromMotionPath(el, { path: "" })).toThrow(/path/i);
    });

    it("BITE: builds over offset-distance, NOT some other key", () => {
        const { el } = waapiTarget();
        const anim = fromMotionPath(el, { path: PATH, autoPlay: false });
        const keys = new Set<string>();
        for (const frame of anim.frames)
            for (const k of Object.keys(frame.interpVars)) keys.add(k);
        // The structural lock: if the factory built over `width`/`left`/etc.,
        // this set would not be exactly {offset-distance}.
        expect(keys.has("offset-distance")).toBe(true);
        expect(keys.has("width")).toBe(false);
        expect(keys.has("left")).toBe(false);
    });
});

describe("MotionPath — passes the EXISTING WAAPI eligibility gate (S1, no new predicate)", () => {
    it("isWAAPIEligible returns { eligible: true } for a DOM target + uniform CSS-twin easing", () => {
        const { el } = waapiTarget();
        const anim = fromMotionPath(el, {
            path: PATH,
            useWAAPI: true,
            timingFunction: "linear", // a CSS-twin easing
            autoPlay: false,
        });
        expect(isWAAPIEligible(anim)).toEqual({ eligible: true });
    });

    it("the offset-distance % is path-relative — NOT caught by the layout-% rejection (MEASURE-FIRST)", () => {
        const { el } = waapiTarget();
        const anim = fromMotionPath(el, {
            path: PATH,
            useWAAPI: true,
            timingFunction: "linear",
            autoPlay: false,
        });
        const elig = isWAAPIEligible(anim);
        expect(elig.eligible).toBe(true);
        if (!elig.eligible) {
            // Make the failure mode loud if the exemption regresses.
            expect(elig.reason).not.toMatch(/layout-dependent unit/);
        }
    });

    it("BITE: a width:% animation (a real layout box) STAYS ineligible — the exemption is property-keyed", () => {
        const { el } = waapiTarget();
        const width = new CSSKeyframesAnimation({
            useWAAPI: true,
            timingFunction: "linear",
        }).fromKeyframes({ "0%": { width: "0%" }, "100%": { width: "100%" } });
        width.setTargets(el);
        const elig = isWAAPIEligible(width);
        expect(elig.eligible).toBe(false);
        if (!elig.eligible) {
            expect(elig.reason).toMatch(/layout-dependent unit \(%\)/);
        }
    });
});

describe("MotionPath — delegates compositor-thread (S1)", () => {
    it("an eligible MotionPath calls target.animate with offset-distance keyframes + a CSS-twin easing", async () => {
        const { el, spy } = waapiTarget();
        const anim = fromMotionPath(el, {
            path: PATH,
            duration: 100,
            useWAAPI: true,
            timingFunction: "linear",
            autoPlay: false,
        });
        await anim.play();

        // The compositor path was taken: target.animate was called.
        expect(spy).toHaveBeenCalled();
        const [keyframes, options] = spy.mock.calls[0]!;
        // Keyframes carry the offset-distance key (the animated scalar).
        const hasOffsetDistance = (keyframes as any[]).some(
            (kf) => "offset-distance" in kf || "offsetDistance" in kf,
        );
        expect(hasOffsetDistance).toBe(true);
        // The CSS-twin easing flows through toWAAPIOptions (linear here).
        expect((options as any).easing).toBe("linear");
    });

    it("BITE: forcing the rAF path (useWAAPI false) records ZERO target.animate calls", async () => {
        const { el, spy } = waapiTarget();
        const anim = fromMotionPath(el, {
            path: PATH,
            duration: 60,
            useWAAPI: false, // force rAF
            timingFunction: "linear",
            autoPlay: false,
        });
        await anim.play();
        expect(spy).not.toHaveBeenCalled();
    });
});

describe("MotionPath — class wrapper + control handle", () => {
    it("the class exposes the underlying animation as the control handle", () => {
        const { el } = waapiTarget();
        const mp = new MotionPath(el, { path: PATH, autoPlay: false });
        expect(mp.animation).toBeInstanceOf(CSSKeyframesAnimation);
        expect(el.style.offsetPath).toBe(PATH);
    });

    it("supports multiple targets (sets offset-path on each)", () => {
        const a = waapiTarget();
        const b = waapiTarget();
        fromMotionPath([a.el, b.el], { path: PATH, autoPlay: false });
        expect(a.el.style.offsetPath).toBe(PATH);
        expect(b.el.style.offsetPath).toBe(PATH);
    });
});
