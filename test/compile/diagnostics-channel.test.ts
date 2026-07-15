/**
 * diagnostics-channel.test.ts — K.W7 S4 (the ResolvedKeyframes.diagnostics
 * channel): every SILENT fallback site is mirrored by a citable, stable-coded
 * diagnostic row. This file is the value-level regression check.
 *
 * The channel CONSUMES the value.js 0.12.0 `ParseDiagnostic`/`OnParseError`
 * producer (N2 row 10) — the rows are the consumed shape widened with a stable
 * kf-side `code`, NOT a kf-local re-author of the producer.
 *
 * BORN-RED WITNESS: on the pre-cure tree `ResolvedKeyframes` has NO
 * `diagnostics` field (`grep "diagnostics" adapter.ts` = ZERO) — the
 * channel-population assert reds because the field is absent.
 *
 * Each diagnostic `code` carries its own born-RED test:
 *   - EMPTY_PARSE           — a non-empty input parsing to zero @keyframes rules
 *   - COMPOSITION_FALLBACK  — a non-numeric composite leaf's refusal
 *   - UNKNOWN_TIMING_FN     — an unrecognized per-stop timing fn (J.W1-landed,
 *                             lifted onto the structured field here)
 */
import { describe, expect, it } from "vitest";
import { resolveKeyframes } from "../../src/animation/compile/adapter";
import type { Diagnostic, DiagnosticCode } from "../../src/animation/compile/adapter";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { resolveEasingOption } from "../../src/animation/compile/easing/easing-option";

const codesOf = (diags: Diagnostic[]): DiagnosticCode[] =>
    diags.map((d) => d.code);

describe("K.W7 S4 — the diagnostics channel exists on ResolvedKeyframes", () => {
    it("a clean parse carries an EMPTY (but present) diagnostics array", () => {
        const r = resolveKeyframes(
            "@keyframes ok { 0% { opacity: 0 } 100% { opacity: 1 } }",
        );
        // The field is PRESENT (born-RED: absent on the pre-cure tree) and empty
        // on a clean parse — the honesty surface adds rows only on a fallback.
        expect(Array.isArray(r.diagnostics)).toBe(true);
        expect(r.diagnostics.length).toBe(0);
    });
});

describe("K.W7 S4 code: EMPTY_PARSE", () => {
    it("a non-empty input parsing to ZERO @keyframes rules emits EMPTY_PARSE", () => {
        // A comment-only input parses CLEANLY (value.js does not throw) but
        // surfaces zero @keyframes rules even after the bare-list re-wrap — the
        // exact SILENT empty parse the spec names (the adapter used to return a
        // frame-less Map with no signal). Now a citable row.
        const input = "/* only a comment, no keyframes */";
        const r = resolveKeyframes(input);
        expect(codesOf(r.diagnostics)).toContain("EMPTY_PARSE");
        const row = r.diagnostics.find((d) => d.code === "EMPTY_PARSE");
        // The consumed-shape `input` field carries the offending source verbatim.
        expect(row?.input).toBe(input);
    });

    it("a real @keyframes block does NOT emit EMPTY_PARSE", () => {
        const r = resolveKeyframes(
            "@keyframes ok { 0% { opacity: 0 } 100% { opacity: 1 } }",
        );
        expect(codesOf(r.diagnostics)).not.toContain("EMPTY_PARSE");
    });
});

describe("K.W7 S4 code: COMPOSITION_FALLBACK", () => {
    it("a non-numeric composite leaf surfaces COMPOSITION_FALLBACK on the engine", () => {
        const el = document.createElement("div");
        el.style.setProperty("color", "rgb(10, 20, 30)");
        const a = new CSSKeyframesAnimation({ duration: 1000 }, el);
        a.fromString(
            "@keyframes c { 0% { color: rgb(0,0,0) } 100% { color: rgb(100,100,100); animation-composition: add } }",
        );
        a.interpFrames(500, true);
        expect(codesOf(a.diagnostics)).toContain("COMPOSITION_FALLBACK");
    });

    it("a numeric composite leaf does NOT emit COMPOSITION_FALLBACK", () => {
        const el = document.createElement("div");
        el.style.setProperty("opacity", "0.3");
        const a = new CSSKeyframesAnimation({ duration: 1000 }, el);
        a.fromString(
            "@keyframes x { 0% { opacity: 0.5 } 100% { opacity: 0.5; animation-composition: add } }",
        );
        a.interpFrames(500, true);
        expect(codesOf(a.diagnostics)).not.toContain("COMPOSITION_FALLBACK");
    });
});

describe("K.W7 S4 code: UNKNOWN_TIMING_FN (J.W1-landed throw, structured-shaped)", () => {
    it("the J.W1 typed throw carries the stable UNKNOWN_TIMING_FN code", () => {
        // The engine-internal row (J.W1 S8) rides the typed AnimationOptionError;
        // W7 names the SAME stable code on the structured channel so a consumer
        // branches on the reason, not the message. The throw's `code` IS the row.
        let code: string | undefined;
        try {
            resolveEasingOption("timingFunction", "definitely-not-an-easing");
        } catch (e) {
            code = (e as { code?: string }).code;
        }
        expect(code).toBe("UNKNOWN_TIMING_FN");
    });
});

describe("K.W7 S4 — the channel is the CONSUMED value.js shape", () => {
    it("a row carries the ParseDiagnostic field shape (message + code)", () => {
        const r = resolveKeyframes("/* comment only */");
        const row = r.diagnostics.find((d) => d.code === "EMPTY_PARSE");
        // The consumed `ParseDiagnostic` shape: `message` (always) + the widened
        // stable `code`. NOT a bespoke kf logging record.
        expect(typeof row?.message).toBe("string");
        expect(row?.code).toBe("EMPTY_PARSE");
    });
});
