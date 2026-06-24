/**
 * G.W15 — the interpolate-anything + color-fidelity corpus (Band T · TEST-ONLY).
 *
 * The library headline is "CSS keyframe animations for ANYTHING". The suite
 * exercised ~6 value types (`opacity`, single-`px` `left/top/width/height`,
 * single-arg `translateX`, `color` — for INEQUALITY only). This corpus closes
 * the breadth gap (TR-1) and adds the color value-FIDELITY twin (TR-2) the
 * re-pin's 3.96× color-channel surface ships without, plus the two HANDOFF
 * witnesses (MCI-5 fn-arity pad, MCI-1 bare-`cqw` emit).
 *
 * Tests are heavy-side: importing value.js here is the established
 * `leaves-parity.test.ts` precedent — these lock kf's CONSUMPTION of the
 * value.js seam, not value.js internals (no inv-16 breach).
 *
 * Re-run by `scripts/proof-interpolate-anything.mjs` (the source-grep half) +
 * this `vitest run` body (the behaviour half), wired as
 * `proof:interpolate-anything` / `proof:color-fidelity` / `proof:fn-arity-pad` /
 * `proof:cqw-resolution`.
 */
import { describe, expect, it } from "vitest";
import {
    lerpValue,
    normalizeValueUnits,
    parseCSSColor,
    prepareInterpVar,
} from "@mkbabb/value.js";
import type { ColorSpace, HueInterpolationMethod } from "@mkbabb/value.js";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import {
    createInterpVarValue,
    parseAndFlattenObject,
} from "../src/animation/compile/parse-flatten";

/** The midpoint of a single (sub-)property key, joined for the multi-leaf rows. */
const midpoint = (css: string, key: string): string => {
    const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(css);
    const arr = a.at(0.5)[key];
    if (!arr) {
        throw new Error(
            `no interp leaf for "${key}" — keys are [${Object.keys(a.at(0.5)).join(", ")}]`,
        );
    }
    return arr.map((v) => String(v)).join(" | ");
};

// ── S1 — the multi-channel value-type matrix (TR-1) ──────────────────────────
//
// The interp KERNEL is value-type-agnostic (it lerps any parsed numeric leaf);
// each row asserts the EXACT midpoint, so a dropped/mis-ordered channel (the
// failure mode the booked SoA pack could introduce) reds at a concrete value,
// not an inequality. The midpoints are the live-verified flattened sub-property
// keys (`transform.translate3d`, `filter.blur`, …), not the bare property name.
describe("G.W15 proof:interpolate-anything — the value-type matrix (S1/TR-1)", () => {
    it("multi-arg transform: translate3d + scale — each channel at its lerp midpoint", () => {
        const css = `@keyframes p { from { transform: translate3d(0px,0px,0px) scale(1); } to { transform: translate3d(100px,100px,0px) scale(2); } }`;
        // translate3d packs (x,y,z) into one leaf array; scale fans out to scaleX/Y/Z.
        expect(midpoint(css, "transform.translate3d")).toBe("50px | 50px | 0px");
        expect(midpoint(css, "transform.scaleX")).toBe("1.5");
        expect(midpoint(css, "transform.scaleY")).toBe("1.5");
        expect(midpoint(css, "transform.scaleZ")).toBe("1.5");
        // BITE: drop translate3d.z (a K-ordering regression) → "50px | 50px"
        // !== "50px | 50px | 0px"; drop a scale channel → its row reds at
        // "1.5 !== <wrong>".
    });

    it("rotate: 0deg → 90deg lands at 45deg", () => {
        const css = `@keyframes p { from { transform: rotate(0deg); } to { transform: rotate(90deg); } }`;
        // a bare `rotate` decomposes to the rotateZ axis; all three serialize.
        expect(midpoint(css, "transform.rotateZ")).toBe("45deg");
    });

    it("filter: blur + brightness — each function-arg at its midpoint", () => {
        const css = `@keyframes p { from { filter: blur(0px) brightness(1); } to { filter: blur(10px) brightness(2); } }`;
        expect(midpoint(css, "filter.blur")).toBe("5px");
        expect(midpoint(css, "filter.brightness")).toBe("1.5");
    });

    it("drop-shadow: each numeric channel at its midpoint", () => {
        const css = `@keyframes p { from { filter: drop-shadow(0px 0px 0px black); } to { filter: drop-shadow(10px 20px 4px black); } }`;
        // offset-x, offset-y, blur-radius, color — the achromatic color holds.
        const m = midpoint(css, "filter.drop-shadow");
        expect(m.startsWith("5px | 10px | 2px |")).toBe(true);
    });

    it("box-shadow: numeric channels + color at the midpoint", () => {
        const css = `@keyframes p { from { box-shadow: 0px 0px 0px rgb(0,0,0); } to { box-shadow: 10px 20px 4px rgb(255,255,255); } }`;
        const m = midpoint(css, "box-shadow");
        // offset-x 5px, offset-y 10px, blur 2px, then the interpolated color leaf.
        expect(m.startsWith("5px | 10px | 2px |")).toBe(true);
        expect(m).toMatch(/oklab\(/); // the color channel is a real interpolated leaf
    });

    it("gradient stop position lerps to its midpoint", () => {
        // The bare-direction gradient form crashes the value.js parser (a
        // parse-that HANDOFF); the directional form parses. The first stop
        // sweeps 0% → 40%, so its midpoint is 20%.
        const css = `@keyframes p { from { background: linear-gradient(90deg, red 0%, blue 100%); } to { background: linear-gradient(90deg, red 40%, blue 100%); } }`;
        const m = midpoint(css, "background.linear-gradient");
        // direction | color | 20% | color | 100%
        expect(m.split(" | ")).toContain("20%");
    });

    it("custom-property VALUE interpolation: --w 0px → 100px lands at 50px", () => {
        const css = `@keyframes p { from { --w: 0px; } to { --w: 100px; } }`;
        expect(midpoint(css, "--w")).toBe("50px");
    });
});

// ── S2 — color value-fidelity (TR-2) ─────────────────────────────────────────
//
// The two existing color tests assert string INEQUALITY across colorSpace /
// hueMethod switches; nothing locks a known coordinate or proves the consumed
// path is byte-same to the canonical value.js seam. (a) a known-coordinate lock
// per space; (b) a value.js color-parity gate mirroring leaves-parity.test.ts;
// (c) a hueMethod VALUE lock at the two DISTINCT coordinates.
describe("G.W15 proof:color-fidelity — color value identity (S2/TR-2)", () => {
    const FROM = "rgb(255, 0, 0)";
    const TO = "rgb(0, 0, 255)";

    /** kf's consumed color path: `at(0.5)` of the two-stop @keyframes. */
    const kfColorMidpoint = (
        space: ColorSpace,
        hueMethod?: HueInterpolationMethod,
    ): string => {
        const a = new CSSKeyframesAnimation({
            duration: 1000,
            colorSpace: space,
            ...(hueMethod ? { hueMethod } : {}),
        }).fromString(
            `@keyframes p { from { color: ${FROM}; } to { color: ${TO}; } }`,
        );
        return a
            .at(0.5)
            ["color"]!.map((v) => String(v))
            .join(" ");
    };

    /**
     * The SAME seam, replicated from value.js's own exports — the
     * `createInterpVarValue → normalizeValueUnits → prepareInterpVar → lerpValue`
     * pipeline kf consumes. If value.js drifts ANY of these exports, the parity
     * row reds (the silent re-pin color regression the frame-count round-trip
     * cannot catch).
     */
    const vjColorMidpoint = (
        from: string,
        to: string,
        space: ColorSpace,
        hueMethod?: HueInterpolationMethod,
        t = 0.5,
    ): string => {
        const l = parseCSSColor(from);
        const r = parseCSSColor(to);
        const opts: { colorSpace: ColorSpace; hueMethod?: HueInterpolationMethod } =
            { colorSpace: space };
        if (hueMethod) opts.hueMethod = hueMethod;
        const iv = prepareInterpVar(normalizeValueUnits(l, r, opts));
        return String(lerpValue(t, iv));
    };

    // (a) — the known-coordinate lock per space. NOTE: the spec names "srgb" but
    // the live value.js colorSpace name is "rgb" (the valid set rejects "srgb");
    // the genuine name is used (a spec-naming deviation, recorded in the report).
    const KNOWN: Record<string, string> = {
        oklab: "oklab(53.99845437103836% 0.09620303924921089 -0.09284094315819447 / 100%)",
        oklch: "oklch(53.99845437103836% 0.2854488436811232 326.642950142542deg / 100%)",
        lab: "lab(41.9294216918843% 74.54614638649106 -21.069372378240445 / 100%)",
        rgb: "rgb(127.5 0 127.5 / 100%)",
    };

    for (const [space, coord] of Object.entries(KNOWN)) {
        it(`known-coordinate lock — ${space} red→blue midpoint`, () => {
            // BITE: swap the colorSpace default seam to the wrong space → the
            // emitted coordinate no longer equals the locked one.
            expect(kfColorMidpoint(space as ColorSpace)).toBe(coord);
        });
    }

    for (const space of Object.keys(KNOWN)) {
        it(`value.js color-parity — kf consumes the value.js seam byte-same (${space})`, () => {
            // BITE: drift value.js's color export (the consumed seam) → kf's
            // `at()` output diverges from the replicated value.js pipeline.
            expect(kfColorMidpoint(space as ColorSpace)).toBe(
                vjColorMidpoint(FROM, TO, space as ColorSpace),
            );
        });
    }

    // (c) — the hueMethod VALUE lock (red→green on oklch): shorter vs longer land
    // at two KNOWN DISTINCT hue coordinates, not merely "not equal".
    it("hueMethod VALUE lock — oklch shorter vs longer land at distinct known hues", () => {
        const shorter = new CSSKeyframesAnimation({
            duration: 1000,
            colorSpace: "oklch",
            hueMethod: "shorter",
        }).fromString(
            `@keyframes p { from { color: rgb(255, 0, 0); } to { color: rgb(0, 255, 0); } }`,
        );
        const longer = new CSSKeyframesAnimation({
            duration: 1000,
            colorSpace: "oklch",
            hueMethod: "longer",
        }).fromString(
            `@keyframes p { from { color: rgb(255, 0, 0); } to { color: rgb(0, 255, 0); } }`,
        );
        const sh = shorter
            .at(0.5)
            ["color"]!.map((v) => String(v))
            .join(" ");
        const lo = longer
            .at(0.5)
            ["color"]!.map((v) => String(v))
            .join(" ");
        // Two KNOWN distinct coordinates (the hue differs by exactly 180°).
        expect(sh).toBe(
            "oklch(74.71974906872939% 0.27625526093847563 85.86461238826914deg / 100%)",
        );
        expect(lo).toBe(
            "oklch(74.71974906872939% 0.27625526093847563 265.86461238826917deg / 100%)",
        );
        // and they ARE distinct (the inequality the old test asserted, now value-locked).
        expect(sh).not.toBe(lo);
    });
});

// ── S3 — the fn-arity-pad witness (MCI-5) ────────────────────────────────────
//
// `createInterpVarValue` pads the shorter leaf array to `maxLength`. For
// `filter: blur(4px)` → `blur(4px) brightness(2)` the left side has ONE leaf
// and the right has TWO; the padded slot stands in for the ABSENT `brightness`.
// Before value.js's MCI-5 consume the pad inserted a numeric `ValueUnit(0)`, so
// the slot lerped `0 → 2` and at t=0 resolved to `0` (black) — silent-wrong for
// every non-`0`-identity function.
//
// MCI-5 is now CONSUMED (K.W1): the pad threads the absent function's name
// (`FN_NAME`, stamped at flatten) into value.js's `functionIdentityValue`, so
// the slot holds `brightness`'s CSS IDENTITY `1` at t=0 and lerps `1 → 2`. The
// former `it.fails` witness has FLIPPED to a normal passing `it(` (the inner
// identity-`1` assertion now PASSES), and the live-wrong positive control is
// retired with the gap it watched.
describe("G.W15 proof:fn-arity-pad — the MCI-5 identity-pad consume (S3)", () => {
    /** The padded `brightness` slot value at progress `t`, via the named seam. */
    const paddedBrightnessAt = (t: number): number => {
        const left = parseAndFlattenObject({ filter: "blur(4px)" });
        const right = parseAndFlattenObject({ filter: "blur(4px) brightness(2)" });
        const ivs = createInterpVarValue("filter", 0, 1, [left, right], "oklab");
        // The second leaf is the padded `brightness` slot.
        const slot = ivs[1];
        if (!slot) throw new Error("no padded slot — the pad shape changed");
        return Number(String(lerpValue(t, slot)));
    };

    // CONSUMED (K.W1): the identity-aware pad holds `brightness`'s CSS identity
    // `1` at t=0 (was `0` under the retired `ValueUnit(0)` pad) and lerps `1 → 2`
    // to the authored endpoint. This is the genuinely-correct interpolation; the
    // assertion REDS if the identity thread regresses to the bare-`0` pad.
    it("filter brightness pad holds the CSS identity 1 at t=0 — value.js MCI-5 consumed", () => {
        expect(paddedBrightnessAt(0)).toBe(1);
        // lerps the identity 1 → the authored 2, reaching 2 at the endpoint.
        expect(paddedBrightnessAt(1)).toBe(2);
    });
});

// ── S4 — the bare-`cqw` rAF-emit witness (MCI-1) ─────────────────────────────
//
// value.js's COMPUTED_UNITS = ["var","calc"] does NOT include the relative
// length units, so a bare `cqw → cqw` keyframe is `computed: false`, lerps raw
// numbers (10 → 90), and EMITS a `cqw` STRING — the browser owns per-frame
// resolution. This is correct-by-construction for the bare case (the positive
// control of the classification asymmetry). The mixed `cqw ↔ px` freeze is NOT
// asserted here (it is the real-DOM seam G.W16's proof:computed-real-dom owns).
describe("G.W15 proof:cqw-resolution — the bare-cqw emit witness (S4)", () => {
    it("bare cqw → cqw emits a cqw-unit string (the browser resolves per frame)", () => {
        const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            `@keyframes p { from { width: 10cqw; } to { width: 90cqw; } }`,
        );
        const m = a
            .at(0.5)
            ["width"]!.map((v) => String(v))
            .join(" ");
        // The midpoint is the raw-number lerp 10→90 = 50, carrying the cqw unit.
        expect(m).toBe("50cqw");
        // BITE: if value.js ever reclassifies `cqw` as computed (the MCI-1
        // HANDOFF), the emit becomes a frozen px through lerpComputedValue → this
        // assertion reds, witnessing the path change (it cannot land silently).
        expect(m.endsWith("cqw")).toBe(true);
    });
});
