/**
 * K.W10 `proof:compile-replay` — the compile→replay-equality oracle (the
 * round-trip's BACKWARD half).
 *
 * `compileToCSS` emits an `AnimationGroup` / `Sequence` / child list to
 * zero-runtime CSS. This suite proves the FAITHFULNESS (the moat) by the
 * dist-level numeric-sample equality the §Hard-gate permits for the headless
 * tier (clause (a)/(b)): the compiled `@keyframes` RE-PARSES into a fresh
 * `CSSKeyframesAnimation` whose interpolation is numerically EQUAL to the JS
 * playback it emitted from. A lossy emit (a dropped stop, a wrong
 * `animation-composition`, a drifting densify) breaks the equality and reds.
 *
 * CLAUSES:
 *  (a) CC-1 a clean group compiles + replays numerically-equal (the structural
 *      replay-equality: re-parse → sample → byte-equal at sampled t).
 *  (b) the `animation-composition` layering round-trips (W7→W10 inversion).
 *  (c) the FOUR refusals RED the compile (weighted blend / custom renderer /
 *      perceptual-oklab-beyond-densify / computed-unit drift) — named reasons.
 *  (d) CC-2 the oklab densify ships under ΔE-ε (and the emitted stops track kf's
 *      perceptual lerp) or REFUSES.
 *
 * Born-RED in the FRONTIER sense: before this wave no `compileToCSS` existed
 * (`reverseAnimationShorthand` unconsumed). The behaviour body rides the real
 * `compile.ts` + `format.ts` + engine surfaces — no shim.
 */
import { describe, expect, it } from "vitest";
import {
    color2,
    COLOR_SPACE_RANGES,
    deltaEOK,
    normalizeColorUnit,
    sampleColorRamp,
    scale,
    type Color,
    type ValueUnit,
} from "@mkbabb/value.js";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { AnimationGroup } from "../src/animation/group";
import { Sequence } from "../src/animation/sequence";
import { stagger } from "../src/animation/stagger";
import {
    compileToCSS,
    DEFAULT_DELTA_E_EPSILON,
} from "../src/animation/compile";

// ── helpers ──────────────────────────────────────────────────────────────────

const mkAnim = (
    name: string,
    css: string,
    opts: Record<string, unknown> = {},
): CSSKeyframesAnimation<any> => {
    const el = document.createElement("div");
    const a = new CSSKeyframesAnimation({ duration: 600, ...opts }, el);
    a.name = name;
    a.fromString(css);
    return a;
};

/** Extract a named `@keyframes` block from a compiled artifact. */
const keyframesOf = (css: string, name: string): string => {
    const re = new RegExp(`@keyframes\\s+${name}\\s*\\{[\\s\\S]*?\\n\\}`);
    const m = re.exec(css);
    if (!m) throw new Error(`no @keyframes ${name} in:\n${css}`);
    return m[0];
};

/** Re-parse a compiled `@keyframes` block into a fresh animation for sampling. */
const reparse = (
    block: string,
    opts: Record<string, unknown> = {},
): CSSKeyframesAnimation<any> => {
    const el = document.createElement("div");
    const a = new CSSKeyframesAnimation({ duration: 600, ...opts }, el);
    a.fromString(block);
    return a;
};

/** A flat numeric snapshot of `at(progress)` — the scalar leaves only. */
const numericSnapshot = (
    a: CSSKeyframesAnimation<any>,
    progress: number,
): Record<string, number[]> => {
    const out: Record<string, number[]> = {};
    for (const [key, arr] of Object.entries(a.at(progress))) {
        const nums = (arr as ValueUnit[])
            .map((v) => (typeof v.value === "number" ? v.value : NaN))
            .filter((n) => !Number.isNaN(n));
        if (nums.length > 0) out[key] = nums.map((n) => Math.round(n * 1e4) / 1e4);
    }
    return out;
};

// ΔE-OK domain (the perceptual distance the densify proof reads).
const A_MIN = COLOR_SPACE_RANGES.oklab.a.number.min;
const A_MAX = COLOR_SPACE_RANGES.oklab.a.number.max;
const B_MIN = COLOR_SPACE_RANGES.oklab.b.number.min;
const B_MAX = COLOR_SPACE_RANGES.oklab.b.number.max;
const rawOklab = (c: Color): [number, number, number] => {
    const ok = color2(c, "oklab") as unknown as { l: number; a: number; b: number };
    return [ok.l, scale(ok.a, 0, 1, A_MIN, A_MAX), scale(ok.b, 0, 1, B_MIN, B_MAX)];
};
const dE = (c1: Color, c2: Color): number => {
    const [L1, a1, b1] = rawOklab(c1);
    const [L2, a2, b2] = rawOklab(c2);
    return deltaEOK(L1, a1, b1, L2, a2, b2);
};
/** A CSS color string → a value.js Color (via the engine's own parse path). */
const parseColor = (cssColor: string): Color => {
    const el = document.createElement("div");
    const a = new CSSKeyframesAnimation({ duration: 1 }, el);
    a.fromString(`@keyframes z { 0% { color: ${cssColor} } 100% { color: ${cssColor} } }`);
    const vu = (a.parsedVars[0]!["color"] as ValueUnit[]).find(
        (v) => v.unit === "color",
    )!;
    return normalizeColorUnit(vu as never).value as unknown as Color;
};

// ── clause (a) — CC-1 a clean group compiles + replays numerically-equal ──────

describe("K.W10 clause (a) — CC-1 clean compile replays numerically-equal", () => {
    it("a clean replace/add group → @keyframes + animation longhands", async () => {
        const move = mkAnim(
            "move",
            `@keyframes m { 0% { transform: translateX(0px) } 100% { transform: translateX(120px) } }`,
            { timingFunction: "ease-out" },
        );
        const fade = mkAnim(
            "fade",
            `@keyframes f { 0% { opacity: 0 } 100% { opacity: 1 } }`,
            { duration: 800 },
        );
        const group = new AnimationGroup(
            { animation: move },
            { animation: fade, layer: { blendMode: "add" } },
        );
        const out = await compileToCSS(group);

        expect(out.eligible).toBe(true);
        expect(out.refusals).toHaveLength(0);
        // The artifact carries one @keyframes + one animation rule per child.
        expect(out.css).toContain("@keyframes move");
        expect(out.css).toContain("@keyframes fade");
        expect(out.css).toMatch(/\.move\s*\{[\s\S]*animation:\s*600ms[\s\S]*move/);
        expect(out.css).toMatch(/\.fade\s*\{[\s\S]*animation:\s*800ms[\s\S]*fade/);
    });

    it("REPLAY-EQUALITY — re-parse the compiled @keyframes, sample byte-equal at every t", async () => {
        const a = mkAnim(
            "rep",
            `@keyframes m {
                0% { transform: translateX(0px); opacity: 0 }
                50% { transform: translateX(30px); opacity: 0.8 }
                100% { transform: translateX(100px); opacity: 1 }
            }`,
            { timingFunction: "ease-out" },
        );
        const out = await compileToCSS([a]);
        expect(out.eligible).toBe(true);

        const replay = reparse(keyframesOf(out.css, "rep"), {
            timingFunction: "ease-out",
        });

        // The compiled CSS is the parser run BACKWARD: its re-parse samples
        // IDENTICALLY to the JS playback it emitted from, at every sampled t.
        for (const t of [0, 0.2, 0.4, 0.5, 0.6, 0.8, 1]) {
            expect(numericSnapshot(replay, t)).toEqual(numericSnapshot(a, t));
        }
    });

    it("a Sequence compiles each segment with its `at` offset as animation-delay", async () => {
        const first = mkAnim(
            "seq-a",
            `@keyframes a { 0% { opacity: 0 } 100% { opacity: 1 } }`,
            { duration: 400 },
        );
        const second = mkAnim(
            "seq-b",
            `@keyframes b { 0% { transform: scale(1) } 100% { transform: scale(2) } }`,
            { duration: 400 },
        );
        const seq = new Sequence().add(first).add(second, 500);
        const out = await compileToCSS(seq);

        expect(out.eligible).toBe(true);
        // The second segment's 500ms master-clock offset materializes as a delay.
        expect(out.css).toMatch(/\.seq-b\s*\{[\s\S]*animation-delay:\s*500ms/);
    });

    it("a stagger cohort materializes per-child literal animation-delay", async () => {
        const items = [0, 1, 2, 3].map((i) =>
            mkAnim(
                `s${i}`,
                `@keyframes s${i} { 0% { opacity: 0 } 100% { opacity: 1 } }`,
            ),
        );
        const delay = stagger(items.length, { each: 50, from: "first" });
        const out = await compileToCSS(items, {
            staggerDelays: delay.delays(items.length),
        });

        expect(out.eligible).toBe(true);
        // The eased origin-aware distribution → literal per-child delays
        // (0, 50ms, 100ms, 150ms) — the universal default sibling-index() cannot
        // express. Child 0 (delay 0) emits no delay; the rest do.
        expect(out.css).toMatch(/\.s1\s*\{[\s\S]*animation-delay:\s*50ms/);
        expect(out.css).toMatch(/\.s2\s*\{[\s\S]*animation-delay:\s*100ms/);
        expect(out.css).toMatch(/\.s3\s*\{[\s\S]*animation-delay:\s*150ms/);
    });
});

// ── clause (b) — the animation-composition layering round-trips (W7 inversion) ─

describe("K.W10 clause (b) — animation-composition round-trips (inverts W7)", () => {
    it("an `add`-layered group compiles `animation-composition: add` as a SEPARATE longhand", async () => {
        const base = mkAnim(
            "base",
            `@keyframes b { 0% { transform: translateY(0px) } 100% { transform: translateY(10px) } }`,
        );
        const wobble = mkAnim(
            "wobble",
            `@keyframes w { 0% { transform: translateY(0px) } 100% { transform: translateY(5px) } }`,
        );
        const group = new AnimationGroup(
            { animation: base },
            { animation: wobble, layer: { blendMode: "add" } },
        );
        const out = await compileToCSS(group);

        expect(out.eligible).toBe(true);
        // `add` is a SEPARATE longhand, NOT folded into the shorthand (it is not
        // a shorthand sub-property — a browser would not parse it there). Scope
        // to the `.wobble` rule body (up to its closing brace) so the assertion
        // does not bleed into a sibling rule.
        const wobbleRule = /\.wobble\s*\{([^}]*)\}/.exec(out.css)?.[1] ?? "";
        expect(wobbleRule).toMatch(/animation:[^;]*wobble/);
        expect(wobbleRule).toMatch(/animation-composition:\s*add/);
        // The default `replace` layer emits NO composition longhand (byte-minimal).
        const baseRule = /\.base\s*\{([^}]*)\}/.exec(out.css)?.[1] ?? "";
        expect(baseRule).not.toMatch(/animation-composition/);
    });
});

// ── clause (c) — the FOUR refusals RED the compile (CC-3) ─────────────────────

describe("K.W10 clause (c) — the four refusals RED the compile (CC-3)", () => {
    it("REFUSES a weighted-blend layer (no animation-composition twin — axis-3)", async () => {
        const a = mkAnim(
            "wa",
            `@keyframes w { 0% { opacity: 0 } 100% { opacity: 1 } }`,
        );
        const group = new AnimationGroup({
            animation: a,
            layer: { blendMode: "weighted", weight: 0.5 },
        });
        const out = await compileToCSS(group);

        expect(out.eligible).toBe(false);
        expect(out.refusals).toHaveLength(1);
        expect(out.refusals[0]!.reason).toBe("weighted-blend");
        expect(out.refusals[0]!.message).toMatch(/animation-composition/);
        // The weighted child emits NO CSS (refused, not silently approximated).
        expect(out.css).not.toContain("@keyframes wa");
    });

    it("REFUSES a spring-driven weightSpring crossfade (also weighted)", async () => {
        const a = mkAnim(
            "xa",
            `@keyframes x { 0% { opacity: 0 } 100% { opacity: 1 } }`,
        );
        const b = mkAnim(
            "xb",
            `@keyframes y { 0% { opacity: 1 } 100% { opacity: 0 } }`,
        );
        const group = new AnimationGroup(
            { animation: a },
            { animation: b },
        );
        group.crossfade("xa", "xb");
        const out = await compileToCSS(group);

        expect(out.eligible).toBe(false);
        expect(out.refusals.every((r) => r.reason === "weighted-blend")).toBe(true);
    });

    it("REFUSES a custom renderer (a transform closure cannot be CSS)", async () => {
        const el = document.createElement("div");
        const a = new CSSKeyframesAnimation({ duration: 600 }, el);
        a.name = "cr";
        a.fromString(`@keyframes c { 0% { opacity: 0 } 100% { opacity: 1 } }`);
        // Plant a custom renderer on every compiled frame (NOT the default).
        const custom = () => {};
        for (const frame of a.frames) frame.transform = custom as never;
        const out = await compileToCSS([a]);

        expect(out.eligible).toBe(false);
        expect(out.refusals[0]!.reason).toBe("custom-renderer");
    });

    it("REFUSES a perceptual-oklab track that cannot densify under ΔE-ε (tight ε)", async () => {
        const a = mkAnim(
            "tight",
            `@keyframes t { 0% { background-color: rgb(255 0 0) } 100% { background-color: rgb(0 255 0) } }`,
            { duration: 1000, colorSpace: "oklab" },
        );
        // An impossibly tight ΔE-ε forces the refusal (the densify cannot hold a
        // band below the gamut-map/quantization residual) — the named fallback.
        const out = await compileToCSS([a], {
            densifyStops: 8,
            deltaEEpsilon: 1e-9,
        });
        expect(out.eligible).toBe(false);
        expect(out.refusals[0]!.reason).toBe("perceptual-oklab");
        expect(out.refusals[0]!.message).toMatch(/ΔE/);
    });
});

// ── clause (d) — CC-2 the oklab densify ships-or-refuses on the ΔE proof ──────

describe("K.W10 clause (d) — CC-2 the oklab densify (consuming sampleColorRamp)", () => {
    it("a color track densifies into perceptual oklab() stops under the default ΔE-ε", async () => {
        const a = mkAnim(
            "col",
            `@keyframes c { 0% { background-color: rgb(255 0 0) } 100% { background-color: rgb(0 0 255) } }`,
            { duration: 1000, colorSpace: "oklab" },
        );
        const out = await compileToCSS([a], { densifyStops: 12 });

        expect(out.eligible).toBe(true);
        // The densify emits intermediate oklab() stops — the perceptual curve
        // bare two-stop sRGB @keyframes cannot encode.
        const block = keyframesOf(out.css, "col");
        const oklabStops = block.match(/oklab\(/g) ?? [];
        expect(oklabStops.length).toBeGreaterThanOrEqual(12);
        // Interior stops at evenly-spaced percentages (the densification).
        expect(block).toMatch(/\d+\.?\d*%\s*\{[\s\S]*?background-color:\s*oklab\(/);
    });

    it("the emitted oklab() stops TRACK kf's perceptual lerp under ΔE-ε (the proof)", async () => {
        const from = parseColor("rgb(255 0 0)");
        const to = parseColor("rgb(0 0 255)");
        const a = mkAnim(
            "track",
            `@keyframes c { 0% { background-color: rgb(255 0 0) } 100% { background-color: rgb(0 0 255) } }`,
            { duration: 1000, colorSpace: "oklab" },
        );
        const N = 10;
        const out = await compileToCSS([a], { densifyStops: N });
        expect(out.eligible).toBe(true);

        // Re-parse each emitted oklab() stop and assert it sits within ΔE-ε of
        // kf's JS perceptual lerp (sampleColorRamp) at the same t.
        const block = keyframesOf(out.css, "track");
        const stopRe = /(\d+\.?\d*)%\s*\{\s*background-color:\s*(oklab\([^)]*\))/g;
        const reference = sampleColorRamp(from, to, N, { space: "oklab" });
        let matched = 0;
        let m: RegExpExecArray | null;
        while ((m = stopRe.exec(block))) {
            const pct = parseFloat(m[1]!);
            const idx = Math.round((pct / 100) * (N - 1));
            const emitted = parseColor(m[2]!);
            const ref = reference[idx]!;
            expect(dE(emitted, ref)).toBeLessThan(DEFAULT_DELTA_E_EPSILON);
            matched++;
        }
        expect(matched).toBeGreaterThanOrEqual(N);
    });

    it("an animation with NO color track emits the verbatim two-stop block (no densify)", async () => {
        const a = mkAnim(
            "plain",
            `@keyframes p { 0% { transform: translateX(0px) } 100% { transform: translateX(50px) } }`,
        );
        const out = await compileToCSS([a]);
        expect(out.eligible).toBe(true);
        expect(out.css).not.toContain("oklab(");
    });
});

// ── computed-unit VERBATIM (the compiler is STRICTLY BETTER than WAAPI) ────────

describe("K.W10 — computed units emit VERBATIM (not refused — strictly better than WAAPI)", () => {
    it("a vh/cqw/calc()/var() track round-trips verbatim (NOT a refusal)", async () => {
        const a = mkAnim(
            "comp",
            `@keyframes c {
                0% { width: 10vh; height: calc(100cqw - 10px) }
                100% { width: 90vh; height: calc(100cqw - 50px) }
            }`,
        );
        const out = await compileToCSS([a]);
        expect(out.eligible).toBe(true);
        // The unit STRINGS survive — CSS re-resolves natively (WAAPI freezes to px).
        expect(out.css).toContain("10vh");
        expect(out.css).toContain("90vh");
        expect(out.css).toMatch(/calc\(/);
    });
});
