/**
 * H.W0 — the two live console crashes (4.1.0), killed at their seams.
 *
 * H-A1 (serializeEasing throw): a bare custom `TimingFunction` (a value.js
 *   `CSSCubicBezier(...)` / `steppedEase(...)` closure) has no CSS
 *   `animation-timing-function` representation, so the bottom-bar Keyframes-
 *   string readout (`CSSKeyframesToString` → `serializeEasing`) THREW. The demo
 *   fix passes the CSS-string twin instead (the easing `contractAnim` +
 *   amiga) — which the engine resolves to a twinned `Easing {fn, css}`, so the
 *   readout round-trips. The readout also gains a try/catch floor (a custom
 *   placeholder, never a silent `linear`).
 *
 * H-A2 (the "......" lerp parse-error): a blank keyframe SELECTOR reached
 *   value.js `parseCSSValueUnit("")`, which throws the cryptic, un-typed
 *   `Parse error at offset 0: "......"`. The compile-seam belt
 *   (`frame-compiler.ts addFrame`) turns that into a clear, typed
 *   `AnimationOptionError`. (The route-storm that produced the blank state dies
 *   in H.W1; value.js returning a typed empty-input result is the HANDOFF.)
 */
import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { CSSKeyframesToString, serializeEasing } from "../src/animation/format";
import { AnimationOptionError } from "../src/animation/internal/errors";
import { CSSCubicBezier, steppedEase } from "@mkbabb/value.js";

describe("H.W0 H-A1 — the easing serializer round-trips on the demo's fix shape", () => {
    it("a bare CSSCubicBezier closure has no CSS twin → serializeEasing throws (the contract the demo must honor)", () => {
        expect(() => serializeEasing({ fn: CSSCubicBezier(0.2, 0.65, 0.6, 1) })).toThrow(
            AnimationOptionError,
        );
    });

    it("a cubic-bezier() STRING twin (the amiga + easing contractAnim fix) serializes CLEAN", async () => {
        const a = new CSSKeyframesAnimation({
            duration: 1000,
            timingFunction: "cubic-bezier(0.2, 0.65, 0.6, 1)",
        }).fromVars([{ opacity: 0 }, { opacity: 1 }]);
        const out = await CSSKeyframesToString(a, "amigaRotation");
        expect(out).toContain("animation-timing-function: cubic-bezier");
    });

    it("a steps() STRING twin (the easing contractAnim steps selection) serializes CLEAN", async () => {
        const a = new CSSKeyframesAnimation({
            duration: 1000,
            timingFunction: "steps(4, jump-end)",
        }).fromVars([{ opacity: 0 }, { opacity: 1 }]);
        const out = await CSSKeyframesToString(a, "easingPreview");
        expect(out).toMatch(/animation-timing-function:\s*steps\(\s*4/);
    });

    it("BLK-1: a string/registry easing (the Cube presets — the WRONG seam) was always clean", async () => {
        const a = new CSSKeyframesAnimation({
            duration: 1000,
            timingFunction: "ease-in-out",
        }).fromVars([{ opacity: 0 }, { opacity: 1 }]);
        const out = await CSSKeyframesToString(a, "cubeRotations");
        expect(out).toContain("animation-timing-function: ease-in-out");
    });

    // The steppedEase closure is also a bare custom fn with no twin — the demo's
    // steps selection passes the "steps(...)" string twin instead.
    it("a bare steppedEase closure throws (the demo passes the steps() string twin instead)", () => {
        expect(() => serializeEasing({ fn: steppedEase(4, "jump-end") })).toThrow(
            AnimationOptionError,
        );
    });
});

describe("H.W0 H-A2 — a blank keyframe selector is a typed error, not the cryptic '......'", () => {
    it("an empty '' selector throws a TYPED AnimationOptionError (not value.js 'Parse error … ......')", () => {
        let caught: unknown;
        try {
            new CSSKeyframesAnimation({ duration: 1000 }).fromKeyframes({
                "": { opacity: 0 } as any,
                "100%": { opacity: 1 },
            } as any);
        } catch (e) {
            caught = e;
        }
        expect(caught).toBeInstanceOf(AnimationOptionError);
        // The cryptic value.js template must NOT be what the consumer sees.
        expect((caught as Error).message).not.toContain('"......"');
        expect((caught as Error).message).toContain("keyframe selector");
    });

    it("a whitespace-only '   ' selector likewise throws the typed error", () => {
        expect(() =>
            new CSSKeyframesAnimation({ duration: 1000 }).fromKeyframes({
                "   ": { opacity: 0 } as any,
                "100%": { opacity: 1 },
            } as any),
        ).toThrow(AnimationOptionError);
    });

    it("a valid keyframe map still compiles + interpolates (no false positive)", () => {
        const a = new CSSKeyframesAnimation({ duration: 1000 }).fromKeyframes({
            "0%": { opacity: 0 },
            "100%": { opacity: 1 },
        });
        expect(() => a.interpFrames(500)).not.toThrow();
    });
});
