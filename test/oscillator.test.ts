/**
 * oscillator.test.ts — the L.W9 S5 KF-OSCILLATOR LIGHT primitive (W128).
 *
 * Three concerns:
 *  - the PHASE RAMP: `tick(dt)` advances by `frequency × dt` and wraps modulo 1
 *    into [0, 1) (caller-driven, no rAF ownership — the SmoothProgress/
 *    SpringProgress stepper discipline);
 *  - the WAVEFORM SAMPLING: `sample(t)` is the pure `t → waveform(t × frequency)`
 *    map, and the four canonical shapes (sine/triangle/square/sawtooth) hit their
 *    known landmark values;
 *  - the LIGHT-import value.js-free check: `oscillator.ts` holds NO static
 *    `@mkbabb/value.js` specifier (the source-grep complement of proof:boundary
 *    — the primitive is a periodic phase clock, not a CSS value parser).
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Oscillator, waveformValue } from "../src/animation/oscillator";
import type { OscillatorWaveform } from "../src/animation/oscillator";

const SRC = join(
    dirname(fileURLToPath(import.meta.url)),
    "..",
    "src",
    "animation",
    "oscillator.ts",
);

describe("Oscillator — the phase ramp", () => {
    it("starts at phase 0", () => {
        const osc = new Oscillator({ frequency: 1 });
        expect(osc.phase).toBe(0);
    });

    it("tick(dt) advances the phase by frequency × dt", () => {
        const osc = new Oscillator({ frequency: 2 });
        // 2 cycles/sec × 0.1s = 0.2 of a cycle.
        const p = osc.tick(0.1);
        expect(p).toBeCloseTo(0.2, 12);
        expect(osc.phase).toBeCloseTo(0.2, 12);
    });

    it("tick returns the new phase, accumulating across calls", () => {
        const osc = new Oscillator({ frequency: 1 });
        expect(osc.tick(0.25)).toBeCloseTo(0.25, 12);
        expect(osc.tick(0.25)).toBeCloseTo(0.5, 12);
        expect(osc.tick(0.25)).toBeCloseTo(0.75, 12);
    });

    it("wraps the phase modulo 1 into [0, 1) — never reaches 1", () => {
        const osc = new Oscillator({ frequency: 1 });
        // 0.6 + 0.6 = 1.2 → 0.2 after the wrap.
        osc.tick(0.6);
        const p = osc.tick(0.6);
        expect(p).toBeCloseTo(0.2, 12);
        expect(p).toBeGreaterThanOrEqual(0);
        expect(p).toBeLessThan(1);
    });

    it("a full cycle returns to phase 0", () => {
        const osc = new Oscillator({ frequency: 1 });
        const p = osc.tick(1);
        // 1.0 wraps to 0 (the ramp is [0, 1), so a whole cycle is phase 0).
        expect(p).toBeCloseTo(0, 12);
    });

    it("frequency scales the advance rate", () => {
        const slow = new Oscillator({ frequency: 0.5 });
        const fast = new Oscillator({ frequency: 4 });
        slow.tick(0.1);
        fast.tick(0.1);
        expect(slow.phase).toBeCloseTo(0.05, 12);
        expect(fast.phase).toBeCloseTo(0.4, 12);
    });

    it("a negative dt runs the phase backward and wraps without going negative", () => {
        const osc = new Oscillator({ frequency: 1 });
        osc.tick(0.3);
        const p = osc.tick(-0.5); // 0.3 - 0.5 = -0.2 → wraps to 0.8
        expect(p).toBeCloseTo(0.8, 12);
        expect(p).toBeGreaterThanOrEqual(0);
        expect(p).toBeLessThan(1);
    });

    it("reset() returns the running phase to 0 (and wraps an out-of-range arg)", () => {
        const osc = new Oscillator({ frequency: 1 });
        osc.tick(0.4);
        osc.reset();
        expect(osc.phase).toBe(0);
        osc.reset(1.25);
        expect(osc.phase).toBeCloseTo(0.25, 12);
    });
});

describe("Oscillator — waveform sampling", () => {
    it("defaults to the sine waveform", () => {
        const osc = new Oscillator({ frequency: 1 });
        // sample(0.25) → sin(2π · 0.25) = sin(π/2) = 1.
        expect(osc.sample(0.25)).toBeCloseTo(1, 12);
        // sample(0.75) → sin(3π/2) = -1.
        expect(osc.sample(0.75)).toBeCloseTo(-1, 12);
    });

    it("sample(t) is the pure t → waveform(t × frequency) map, phase-independent", () => {
        const osc = new Oscillator({ frequency: 2 });
        osc.tick(0.3); // mutate the running phase
        const before = osc.phase;
        // sample reads NOTHING of the running phase: sin(2π · (0.5 × 2)) = sin(2π) = 0.
        expect(osc.sample(0.5)).toBeCloseTo(0, 12);
        // the running phase is untouched by sample.
        expect(osc.phase).toBe(before);
    });

    it("`value` reads the waveform of the CURRENT running phase", () => {
        const osc = new Oscillator({ frequency: 1, waveform: "sine" });
        osc.tick(0.25); // phase → 0.25
        expect(osc.value).toBeCloseTo(1, 12); // sin(π/2)
    });

    it("triangle peaks at 0.25 / troughs at 0.75, zero at 0 and 0.5", () => {
        expect(waveformValue(0, "triangle")).toBeCloseTo(-1, 12);
        expect(waveformValue(0.25, "triangle")).toBeCloseTo(0, 12);
        expect(waveformValue(0.5, "triangle")).toBeCloseTo(1, 12);
        expect(waveformValue(0.75, "triangle")).toBeCloseTo(0, 12);
    });

    it("square is +1 in the first half-cycle, -1 in the second", () => {
        expect(waveformValue(0, "square")).toBe(1);
        expect(waveformValue(0.49, "square")).toBe(1);
        expect(waveformValue(0.5, "square")).toBe(-1);
        expect(waveformValue(0.99, "square")).toBe(-1);
    });

    it("sawtooth ramps linearly -1 → +1 across the cycle", () => {
        expect(waveformValue(0, "sawtooth")).toBeCloseTo(-1, 12);
        expect(waveformValue(0.5, "sawtooth")).toBeCloseTo(0, 12);
        expect(waveformValue(0.999, "sawtooth")).toBeGreaterThan(0.99);
    });

    it("every waveform stays within [-1, 1] across the cycle", () => {
        const forms: OscillatorWaveform[] = [
            "sine",
            "triangle",
            "square",
            "sawtooth",
        ];
        for (const form of forms) {
            for (let p = 0; p < 1; p += 0.01) {
                const v = waveformValue(p, form);
                expect(v).toBeGreaterThanOrEqual(-1);
                expect(v).toBeLessThanOrEqual(1);
            }
        }
    });

    it("waveformValue reduces an out-of-range phase to its fractional cycle", () => {
        // 1.25 and 0.25 are the same cycle position → identical shape.
        for (const form of [
            "sine",
            "triangle",
            "square",
            "sawtooth",
        ] as OscillatorWaveform[]) {
            expect(waveformValue(1.25, form)).toBeCloseTo(
                waveformValue(0.25, form),
                12,
            );
            expect(waveformValue(-0.75, form)).toBeCloseTo(
                waveformValue(0.25, form),
                12,
            );
        }
    });

    it("an Oscillator carries its construction waveform into sample", () => {
        const sq = new Oscillator({ frequency: 1, waveform: "square" });
        expect(sq.sample(0.1)).toBe(1);
        expect(sq.sample(0.6)).toBe(-1);
    });
});

describe("Oscillator — the LIGHT import (value.js-free)", () => {
    it("oscillator.ts holds NO static @mkbabb/value.js import specifier", () => {
        // The source-grep complement of proof:boundary assertion 4: a periodic
        // phase clock is NOT a CSS value parser, so it must carry zero static
        // value.js edge (a light-only consumer never pulls value.js). Match the
        // IMPORT shape — `import … from "@mkbabb/value.js"` or a bare
        // `import "@mkbabb/value.js"` — not a bare mention (the module header
        // names the package in prose explaining WHY it carries no edge).
        const src = readFileSync(SRC, "utf8");
        const SPEC = String.raw`@mkbabb\/value\.js(?:\/[^"']*)?`;
        const fromEdge = new RegExp(
            String.raw`(?:^|\n)\s*(?:import|export)\b[^;'"]*from\s+["']${SPEC}["']`,
        );
        const bareEdge = new RegExp(
            String.raw`(?:^|\n)\s*import\s+["']${SPEC}["']`,
        );
        expect(fromEdge.test(src)).toBe(false);
        expect(bareEdge.test(src)).toBe(false);
    });

    it("imports nothing — a pure leaf with no module edges", () => {
        // The primitive is self-contained trig/floor math: no internal/leaves,
        // no playback, no value.js. A future import edge must be a conscious
        // choice that re-evaluates the LIGHT-leaf posture.
        const src = readFileSync(SRC, "utf8");
        expect(src).not.toMatch(/(?:^|\n)\s*import\s/);
    });
});
