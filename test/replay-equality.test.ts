/**
 * replay-equality.test.ts — L.W1 (the Replay-equality FLOOR · Band A).
 * proof:replay-equality (behaviour half).
 *
 * K's Band II established replay-equality for a well-defined SUBSET (structural
 * + easing + computed-unit axes). Five parity holes remain in the SHIPPED 4.3.0
 * surface — every one SILENTLY passes `proof:roundtrip-fidelity` because no
 * fixture exercises it. `inv-L-totality` elevates the honest-refusal law from
 * easing (the `serializeEasing` THROW idiom) to the full parsed surface: every
 * parsed field round-trips correctly OR refuses with a named reason — never a
 * silent drop.
 *
 * Each `it` is ONE breach-class round-trip (S1..S5 of the wave's witness
 * table). These FAIL on TODAY's uncured tree (the cures are not in yet) — that
 * is correct, born-RED. They GREEN exactly when the matching S-clause lands.
 *
 * The HEAVY surface is reached the same way `compile-roundtrip.test.ts` /
 * `roundtrip-easing.test.ts` reach it: `CSSKeyframesAnimation` from the engine
 * module + `CSSKeyframesToString` from the format module (NOT the LIGHT barrel).
 */
import { describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { CSSKeyframesToString } from "../src/animation/format";

/** Slice the `@keyframes` block off a serialized artifact (the `.class` block
 *  precedes it). The named-selector / per-stop assertions read this half. */
const keyframesBlock = (css: string): string =>
    css.slice(css.indexOf("@keyframes"));

describe("L.W1 — replay-equality FLOOR (the five Band-A breach round-trips)", () => {
    // ── S1 — `!important` honor (adapter.ts declsToVarMap, viol31/W116) ─────────
    it("S1 — !important survives parse → serialize", async () => {
        const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "@keyframes x { from { opacity: 0 !important } to { opacity: 1 } }",
        );
        const out = await CSSKeyframesToString(a, "x");
        // CORRECTED (the audit premise was factually wrong): per CSS Animations
        // §3, a keyframe declaration qualified `!important` is INVALID and the
        // whole declaration is IGNORED — value.js 0.13.0 drops it at the AST
        // level, exactly as a browser does. So kf must NEVER re-emit a keyframe
        // `!important` (that would ship invalid CSS and animate a frame a browser
        // ignores — breaking replay-equality). This is the SPEC-FAITHFULNESS
        // regression-lock: it reds if the recover-and-re-emit workaround is ever
        // re-introduced. The no-silent-drop LAW (surface the drop as a diagnostic)
        // is a value.js-Tranche-O dispatch dep — KF-TO-VALUEJS-O-ASKS.md,
        // consumed Band-B (L.W9), the same split as S5's `playState` half.
        expect(out).not.toContain("!important");
    });

    // ── S2 — `@property` backward-serialize (engine.ts propertyRegistry, viol15/W75) ─
    it("S2 — @property block survives the backward serialize", async () => {
        const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            '@property --hue { syntax: "<angle>"; inherits: false; initial-value: 0deg }\n' +
                "@keyframes x { from { rotate: 0deg } to { rotate: 360deg } }",
        );
        const out = await CSSKeyframesToString(a, "x");
        // Today: `CSSKeyframesToString` never calls `serializeStylesheetItem`
        // over `animation.propertyRegistry` — the typing block is lost on
        // re-ship and `--hue` falls back to `<universal>`.
        expect(out).toContain("@property --hue");
    });

    // ── S3 — per-stop `animation-composition` symmetry (format.ts:81-103, viol16/W76) ─
    it("S3 — per-stop animation-composition is re-emitted at its stop", async () => {
        const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            "@keyframes x { 0% { opacity: 0 } 50% { opacity: 0.5; animation-composition: add } 100% { opacity: 1 } }",
        );
        const out = await CSSKeyframesToString(a, "x");
        // Today: `declaredKeyframeBody` emits per-stop `animation-timing-function`
        // but NOT per-stop `animation-composition` — the asymmetry drops the
        // author's declared layering at the 50% stop.
        expect(keyframesBlock(out)).toContain("animation-composition: add");
    });

    // ── S4 — named-selector ingest (frame-compiler.ts:179-188, viol17/W118) ─────
    it("S4 — named scroll selectors ingest without throw and round-trip", async () => {
        const css = "@keyframes x { entry { opacity: 0 } exit { opacity: 1 } }";
        // Today: `addFrame`'s selector guard (`SELECTOR_KEYWORD_RE`) rejects
        // `entry`/`exit` (value.js `kind:"named"`) and THROWS an
        // `AnimationOptionError` — what value.js produces, the frame-compiler
        // cannot ingest.
        const a = new CSSKeyframesAnimation({ duration: 1000 });
        expect(() => a.fromString(css)).not.toThrow();
        const out = await CSSKeyframesToString(a, "x");
        const kf = keyframesBlock(out);
        expect(kf).toContain("entry");
        expect(kf).toContain("exit");
    });

    // ── S5 (Band A only) — composite on AnimationOptions (W117) ─────────────────
    it("S5 — layer-level animation-composition ingests onto options.composite and re-emits", async () => {
        const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(
            ".cls { animation: x 1s; animation-composition: add }\n" +
                "@keyframes x { from { opacity: 0 } to { opacity: 1 } }",
        );
        // Today: `AnimationOptions` carries no `composite` field, so
        // `extractAnimationOptions`'s `composition` is dropped on ingest.
        // (The `playState` half is value.js-Tranche-O dispatch-blocked and is
        // NOT asserted here.)
        expect((a.options as { composite?: string }).composite).toBe("add");
        const out = await CSSKeyframesToString(a, "x");
        expect(out).toContain("animation-composition: add");
    });
});
