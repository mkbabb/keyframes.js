import { describe, expect, it, vi } from "vitest";
import { DrawSVG, fromDrawSVG } from "../../src/animation/svg/draw-svg";
import { isWAAPIEligible } from "../../src/animation/waapi";
import { CSSKeyframesAnimation } from "../../src/animation/engine";

/**
 * G.W13 — CSS-native DrawSVG gate (proof:drawsvg).
 *
 * `DrawSVG` animates `stroke-dashoffset: L → 0` over `stroke-dasharray: L` where
 * `L = target.getTotalLength()` (ONE DOM read). It is pure WAAPI-eligible CSS
 * that delegates compositor-thread through the EXISTING eligibility gate — no new
 * predicate, no `d`-parse, no value.js geometry. These tests lock: the single
 * getTotalLength read + dasharray===L + stroke-dashoffset sweep L→0 (clause 1),
 * eligibility through the one gate (clause 2), compositor-thread delegation
 * (clause 3), and the no-regression posture (clause 4).
 */

const LEN = 240;

/** An SVG geometry target with a `getTotalLength` spy + a stubbed `animate`. */
function svgTarget(len = LEN): {
    el: SVGElement & { getTotalLength(): number };
    getTotalLength: ReturnType<typeof vi.fn>;
    animate: ReturnType<typeof vi.fn>;
} {
    const el = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
    ) as unknown as SVGElement & { getTotalLength(): number };
    const getTotalLength = vi.fn(() => len);
    (el as any).getTotalLength = getTotalLength;
    const animate = vi.fn(() => ({
        finished: Promise.resolve(),
        cancel: () => {},
        pause: () => {},
        play: () => {},
        playState: "running",
        commitStyles: () => {},
    }));
    (el as any).animate = animate;
    return { el, getTotalLength, animate };
}

describe("DrawSVG — getTotalLength once + dasharray===L + stroke-dashoffset sweep (S1)", () => {
    it("reads getTotalLength() EXACTLY once at construction", () => {
        const { el, getTotalLength } = svgTarget();
        fromDrawSVG(el, { autoPlay: false });
        // The browser owns the geometry; keyframes reads L a single time.
        expect(getTotalLength).toHaveBeenCalledTimes(1);
    });

    it("sets stroke-dasharray to the full path length L", () => {
        const { el } = svgTarget();
        fromDrawSVG(el, { autoPlay: false });
        expect(el.style.strokeDasharray).toBe(`${LEN}`);
    });

    it("builds a frame set whose interpolating key is stroke-dashoffset, sweeping L → 0", () => {
        const { el } = svgTarget();
        const anim = fromDrawSVG(el, { autoPlay: false });
        const start = anim.interpFrames(0, false);
        const startKeys = Object.keys(start);
        const startOffset = start["stroke-dashoffset"];
        const stop = anim.interpFrames(anim.options.duration, false);
        const stopKeys = Object.keys(stop);
        const stopOffset = stop["stroke-dashoffset"];

        // The ONLY animated key is stroke-dashoffset.
        expect(startKeys).toEqual(["stroke-dashoffset"]);
        expect(stopKeys).toEqual(["stroke-dashoffset"]);
        // …sweeping L → 0 (the line draws in: full offset to no offset).
        expect(startOffset).toBe(LEN);
        expect(stopOffset).toBe(0);
    });

    it("honors a custom from/to sub-range (offset = L*(1-frac))", () => {
        const { el } = svgTarget();
        const anim = fromDrawSVG(el, {
            from: "25%",
            to: "75%",
            autoPlay: false,
        });
        // frac 0.25 → offset L*0.75 = 180; frac 0.75 → offset L*0.25 = 60.
        expect(anim.interpFrames(0, false)["stroke-dashoffset"]).toBe(
            LEN * 0.75,
        );
        expect(
            anim.interpFrames(anim.options.duration, false)[
                "stroke-dashoffset"
            ],
        ).toBe(LEN * 0.25);
    });

    it("accepts a 0..1 NUMBER fraction equivalently to its percent string", () => {
        const offsets = (from: string | number, to: string | number) => {
            const anim = fromDrawSVG(svgTarget().el, { from, to, autoPlay: false });
            return [
                anim.interpFrames(0, false)["stroke-dashoffset"],
                anim.interpFrames(anim.options.duration, false)[
                    "stroke-dashoffset"
                ],
            ];
        };
        // 0.25 (number) === "25%" (string); 0.75 === "75%".
        expect(offsets(0.25, 0.75)).toEqual(offsets("25%", "75%"));
    });

    it("BITE: a number outside [0, 1] throws (a percent must be a string — no 50-means-5000% footgun)", () => {
        expect(() => fromDrawSVG(svgTarget().el, { from: 50, autoPlay: false })).toThrow(
            /0\.\.1 fraction/i,
        );
        expect(() => fromDrawSVG(svgTarget().el, { to: -1, autoPlay: false })).toThrow(
            /0\.\.1 fraction/i,
        );
    });

    it("BITE: a non-SVG-geometry target throws (no getTotalLength)", () => {
        const div = document.createElement("div");
        expect(() => fromDrawSVG(div as any)).toThrow(/getTotalLength/i);
    });

    it("BITE: builds over stroke-dashoffset, NOT stroke-dasharray or some other key", () => {
        const { el } = svgTarget();
        const anim = fromDrawSVG(el, { autoPlay: false });
        const keys = new Set(Object.keys(anim.interpFrames(0, false)));
        // stroke-dasharray is STATIC (set once, never animated).
        expect(keys.has("stroke-dashoffset")).toBe(true);
        expect(keys.has("stroke-dasharray")).toBe(false);
        expect(keys.has("opacity")).toBe(false);
    });
});

describe("DrawSVG — passes the EXISTING WAAPI eligibility gate (S1, no new predicate)", () => {
    it("isWAAPIEligible returns { eligible: true } for an SVG DOM target + uniform CSS-twin easing", () => {
        const { el } = svgTarget();
        const anim = fromDrawSVG(el, {
            useWAAPI: true,
            timingFunction: "linear", // a CSS-twin easing
            autoPlay: false,
        });
        // stroke-dashoffset is a bare <length> — the SIMPLEST eligible shape,
        // no percent-exemption needed (unlike offset-distance).
        expect(isWAAPIEligible(anim)).toEqual({ eligible: true });
    });
});

describe("DrawSVG — delegates compositor-thread (S1)", () => {
    it("an eligible DrawSVG calls target.animate with stroke-dashoffset keyframes + a CSS-twin easing", async () => {
        const { el, animate } = svgTarget();
        const anim = fromDrawSVG(el, {
            duration: 100,
            useWAAPI: true,
            timingFunction: "linear",
            autoPlay: false,
        });
        await anim.play();

        expect(animate).toHaveBeenCalled();
        const [keyframes, options] = animate.mock.calls[0]!;
        const hasOffset = (keyframes as any[]).some(
            (kf) => "stroke-dashoffset" in kf || "strokeDashoffset" in kf,
        );
        expect(hasOffset).toBe(true);
        expect((options as any).easing).toBe("linear");
    });

    it("BITE: forcing the rAF path (useWAAPI false) records ZERO target.animate calls", async () => {
        const { el, animate } = svgTarget();
        const anim = fromDrawSVG(el, {
            duration: 60,
            useWAAPI: false, // force rAF
            timingFunction: "linear",
            autoPlay: false,
        });
        await anim.play();
        expect(animate).not.toHaveBeenCalled();
    });
});

describe("DrawSVG — class wrapper + control handle", () => {
    it("the class exposes the underlying animation as the control handle", () => {
        const { el } = svgTarget();
        const draw = new DrawSVG(el, { autoPlay: false });
        expect(draw.animation).toBeInstanceOf(CSSKeyframesAnimation);
        expect(el.style.strokeDasharray).toBe(`${LEN}`);
    });

    it("the class exposes .finished over the underlying animation", () => {
        const { el } = svgTarget();
        const draw = new DrawSVG(el, { autoPlay: false });
        // Never played → settled → resolves immediately.
        return expect(draw.finished).resolves.toBeUndefined();
    });
});
