/**
 * J.W1 S1/S4/S5 (ENG-1 · TB-1 · SEAM-4) — ONE serialization authority.
 *
 * I.W0 S2 transposed the AGGREGATE serializer (`CSSKeyframesToString`) onto
 * the DECLARED template (`animation.parsedVars[i]` — parsed, unresolved), so
 * a `var()`/`calc()`/`matrix3d()` round-trips as the AUTHORED CSS. But the
 * sibling PER-CARD serializer (`CSSKeyframesToStrings`, the editor's
 * per-stop card source) was left on the pre-transposition path: it mapped
 * `animation.frames` (the INTERP pairs — N−1 segments, not N stops) and read
 * `frame.flatVars` (the LIVE interpolation buffers, mutated in place by every
 * `interpFrames` pass and DOM-resolved for computed units). This file pins
 * the unified contract:
 *
 *   - the AGGREGATE round-trips `var()` verbatim (the I.W0 S2 pin, TB-1);
 *   - the PER-CARD serializer emits ONE card per DECLARED stop;
 *   - each card carries its stop's AUTHORED value — never an interp-mutated
 *     or DOM-resolved number;
 *   - (SEAM-4) authored `rotate()` remains one structural transform and
 *     serializes byte-verbatim through Value 4.
 */
import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import {
    CSSKeyframesToString,
    CSSKeyframesToStrings,
} from "../../src/animation/compile/emit/format";

const VAR_CSS = `@keyframes t {
    0% { transform: translateX(var(--x)); }
    100% { transform: translateX(var(--y)); }
}`;

/** Just the `@keyframes` block of a serialized animation. */
const kfBlock = (css: string): string => css.slice(css.indexOf("@keyframes"));

const animationFrom = (css: string) =>
    new CSSKeyframesAnimation(
        { duration: 1000 },
        document.createElement("div"),
    ).fromString(css);

describe("J.W1 TB-1 — the AGGREGATE serializes from the declared template (I.W0 S2 pin)", () => {
    it("a var()-bearing animation round-trips the AUTHORED var() verbatim and re-parses clean", async () => {
        const a = animationFrom(VAR_CSS);
        const out = await CSSKeyframesToString(a);

        // The DECLARED template, never a DOM-resolved number: the authored
        // custom-property reference survives serialization byte-verbatim.
        expect(out).toContain("translateX(var(--x))");
        expect(out).toContain("translateX(var(--y))");

        // …and what the serializer emits is exactly what re-parses cleanly.
        expect(() => animationFrom(kfBlock(out))).not.toThrow();
    });
});

describe("J.W1 ENG-1 — the PER-CARD serializer rides the SAME declared-template authority", () => {
    it("emits ONE card per DECLARED stop (not one per interp segment)", async () => {
        const a = animationFrom(VAR_CSS);
        const cards = await CSSKeyframesToStrings(a);

        // BITE (born-RED pre-S1): the interp-pair mapping yields N−1 segments
        // for N stops — the 100% card simply does not exist.
        expect(cards).toHaveLength(a.templateFrames.length);
        expect(cards).toHaveLength(2);
    });

    it("each card carries its stop's AUTHORED var() verbatim", async () => {
        const a = animationFrom(VAR_CSS);
        const cards = await CSSKeyframesToStrings(a);

        expect(cards[0]).toContain("translateX(var(--x))");
        expect(cards[1]).toContain("translateX(var(--y))");
    });

    it("cards show the DECLARED values even after a live interpolation pass", async () => {
        // The pre-S1 path read `frame.flatVars` — the LIVE interp buffers,
        // mutated in place by every `interpFrames` call. After sampling the
        // midpoint, the old card showed `opacity: 0.5` (the interpolated
        // value) where the author wrote `opacity: 0`.
        const el = document.createElement("div");
        document.body.appendChild(el);
        const a = new CSSKeyframesAnimation({ duration: 1000 }, el).fromString(
            `@keyframes t { 0% { opacity: 0; } 100% { opacity: 1; } }`,
        );
        await a.interpFrames(500);

        const cards = await CSSKeyframesToStrings(a);
        expect(cards).toHaveLength(2);
        expect(cards[0]).toContain("opacity: 0");
        expect(cards[0]).not.toContain("0.5");
        expect(cards[1]).toContain("opacity: 1");
    });

    it("a matrix3d() card round-trips the authored matrix verbatim", async () => {
        const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            `@keyframes t {
                0% { transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
                100% { transform: matrix3d(2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 10, 20, 30, 1); }
            }`,
        );
        const cards = await CSSKeyframesToStrings(a);
        expect(cards).toHaveLength(2);
        expect(cards[1]).toContain(
            "matrix3d(2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 10, 20, 30, 1)",
        );
    });

    it("a per-stop easing that differs from the default rides the card (declared truth)", async () => {
        const a = new CSSKeyframesAnimation({
            duration: 1000,
            timingFunction: "linear",
        }).fromString(
            `@keyframes t {
                0% { opacity: 0; animation-timing-function: cubic-bezier(0.2, 0.65, 0.6, 1); }
                100% { opacity: 1; }
            }`,
        );
        const cards = await CSSKeyframesToStrings(a);
        expect(cards[0]).toContain(
            "animation-timing-function: cubic-bezier(0.2, 0.65, 0.6, 1)",
        );
        // The default-eased stop stays clean — uniform easing rides the
        // `.class` block, not every card.
        expect(cards[1]).not.toContain("animation-timing-function");
    });
});

describe("J.W1 SEAM-4 — authored rotate() shorthand serialization", () => {
    it("AUTHORED rotate(45deg) serializes byte-verbatim as rotate(45deg)", async () => {
        const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            `@keyframes t { from { transform: rotate(0deg); } to { transform: rotate(45deg); } }`,
        );
        const out = await CSSKeyframesToString(a);
        expect(out).toContain("rotate(45deg)");
        expect(out).not.toContain("rotateX");
    });

    it("the EXPLICIT axis form rotateZ(45deg) round-trips byte-verbatim (the conforming sibling)", async () => {
        const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            `@keyframes t { from { transform: rotateZ(0deg); } to { transform: rotateZ(45deg); } }`,
        );
        const out = await CSSKeyframesToString(a);
        expect(out).toContain("rotateZ(45deg)");
        expect(out).not.toContain("rotateX");
    });
});
