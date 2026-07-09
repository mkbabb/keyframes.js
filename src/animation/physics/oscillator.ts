/**
 * Oscillator — a LIGHT periodic phase clock (L.W9 S5 · W128 KF-OSCILLATOR).
 *
 * A frequency-driven phase ramp ∈ [0, 1) with a pure waveform shaper over it.
 * The boundary law places "playback/phase = kf", so the primitive belongs here
 * beside `SmoothProgress` / `SpringProgress` / `RAFPlayback`: it is a periodic
 * phase clock, NOT a CSS value parser, so it carries ZERO static edge to
 * `@mkbabb/value.js` (proof:boundary gates it as a value.js-free LIGHT entry).
 *
 * ── C-13 (S.G2 S12, fold row 56) — INTENTIONAL PUBLIC LEAF ─────────────────────
 * `Oscillator` is an intentional public LIGHT leaf: the phase math IS the product,
 * consumed EXTERNALLY (glass-ui BB's `W-EASING-PRIMITIVE` wave — its speedtest
 * idle-breath reads the phase to drive a looping motion; glass-ui co-schedules, kf
 * owns the phase math — `docs/tranches/L/waves/L.W9.md §S5`). It carries NO internal
 * demo scene: the former header claim of a "demo `KF-OSCILLATOR` scene" was fictional
 * (no such scene exists on disk), so the C-13 decision STRIPPED the claim rather than
 * build a scene disproportionate to a periodic phase clock — a published primitive
 * that stands on its own beside `SmoothProgress`/`SpringProgress`, gated LIGHT by
 * proof:boundary, needs no in-repo demo to justify its export.
 *
 * NO rAF ownership — the caller drives the loop. `tick(dt)` advances the phase
 * by `frequency × dt` (with `dt` in SECONDS from the caller's `RAFPlayback`
 * loop or `ScrollTimeline`), mirroring the `SmoothProgress` / `SpringProgress`
 * stepper discipline (a pure step, the consumer owns the clock). `sample(t)` is
 * a stateless pure mapping `t → waveform(t × frequency)` — it never touches the
 * running phase, so the two surfaces are independent on the one primitive.
 */

/** The four canonical periodic waveforms the phase clock shapes a phase into. */
export type OscillatorWaveform = "sine" | "triangle" | "square" | "sawtooth";

/**
 * Construction options for {@link Oscillator}.
 *
 * Named `OscillatorConfig` (NOT `OscillatorOptions`, the `…Options` convention
 * of the sibling steppers) deliberately: the Web Audio API declares a GLOBAL
 * `interface OscillatorOptions` (`lib.dom.d.ts`), so an `OscillatorOptions`
 * source type collides with `globalThis.OscillatorOptions` in the API-Extractor
 * d.ts roll-up — it renames to `OscillatorOptions_2`, which leaks into every IDE
 * hover (the PKG-3 defect `proof:published-surface` clause (h) gates, the same
 * `globalThis.Animation`/`ScrollTimeline` collision L.W8 S4 renamed away). The
 * non-colliding `OscillatorConfig` keeps the surface clean.
 */
export interface OscillatorConfig {
    /**
     * Cycles per unit of `dt` — the phase advances `frequency × dt` per
     * {@link Oscillator.tick}. With `dt` in seconds a `frequency` of `1` is one
     * full cycle per second (1 Hz). Required; no implicit default rate.
     */
    frequency: number;
    /**
     * The periodic shape `phase ∈ [0, 1) → value ∈ [-1, 1]` that
     * {@link Oscillator.sample} (and a consumer reading {@link Oscillator.phase}
     * through {@link waveformValue}) applies. Default `"sine"`.
     */
    waveform?: OscillatorWaveform;
}

const TWO_PI = 2 * Math.PI;

/**
 * Map a phase ∈ ℝ to its waveform value ∈ [-1, 1]. Pure — the phase is reduced
 * to its fractional cycle position internally, so a phase outside [0, 1) (e.g. a
 * raw `t × frequency` from {@link Oscillator.sample}) shapes the same as its
 * wrapped equivalent. Exported as a value.js-free leaf a consumer can apply to
 * its own phase without constructing an `Oscillator`.
 *
 * - `sine`     — `sin(2π·p)`, smooth.
 * - `triangle` — linear up then down, peaks at `p = 0.25` / `0.75`.
 * - `square`   — `+1` for the first half-cycle, `-1` for the second.
 * - `sawtooth` — linear ramp `-1 → +1` across the cycle.
 */
export function waveformValue(phase: number, waveform: OscillatorWaveform): number {
    // Reduce to the fractional cycle position ∈ [0, 1) — `phase - floor(phase)`
    // is always in [0, 1) for finite input (handles negatives correctly).
    const p = phase - Math.floor(phase);
    switch (waveform) {
        case "sine":
            return Math.sin(TWO_PI * p);
        case "triangle":
            // Up [0, 0.5): -1 → +1; down [0.5, 1): +1 → -1.
            return p < 0.5 ? 4 * p - 1 : 3 - 4 * p;
        case "square":
            return p < 0.5 ? 1 : -1;
        case "sawtooth":
            return 2 * p - 1;
    }
}

/**
 * A periodic phase clock: a linear phase ramp ∈ [0, 1) advanced by
 * `frequency × dt` per {@link tick}, plus a pure {@link sample} that maps a raw
 * time to its waveform value WITHOUT touching the running phase.
 *
 * LIGHT (value.js-free) — plain trig/floor math, no CSS parsing, no rAF
 * ownership. The caller drives the loop (mirrors `SmoothProgress` /
 * `SpringProgress`): feed `dt` (seconds) from a `RAFPlayback` loop or a
 * `ScrollTimeline`, read {@link phase} (or {@link value}) per frame.
 */
export class Oscillator {
    private readonly frequency: number;
    private readonly waveform: OscillatorWaveform;

    /** The current phase ∈ [0, 1) — a linear ramp modulo 1 driven by {@link tick}. */
    phase = 0;

    constructor(opts: OscillatorConfig) {
        this.frequency = opts.frequency;
        this.waveform = opts.waveform ?? "sine";
    }

    /**
     * Advance the phase by `frequency × dt` and wrap into [0, 1). Returns the
     * new phase. `dt` is in the caller's units (seconds for a `RAFPlayback`
     * frame, a normalized scroll delta for a `ScrollTimeline`); the consumer
     * owns the clock, so a negative `dt` runs the phase backward (and wraps
     * correctly, never going negative). No rAF — a pure stepper.
     */
    tick(dt: number): number {
        const next = this.phase + this.frequency * dt;
        // `next - floor(next)` ∈ [0, 1) for any finite `next` (negative too).
        this.phase = next - Math.floor(next);
        return this.phase;
    }

    /**
     * The waveform value of the CURRENT running phase ∈ [-1, 1]. A pure read
     * over {@link phase} — does not advance the clock. Pair with {@link tick}:
     * `osc.tick(dt); const v = osc.value;`.
     */
    get value(): number {
        return waveformValue(this.phase, this.waveform);
    }

    /**
     * Pure stateless sample: `t → waveform(t × frequency)`. Independent of the
     * running {@link phase} — it never reads or mutates it, so a consumer can
     * sample an absolute clock (`osc.sample(elapsedSeconds)`) without disturbing
     * a concurrently-`tick`ed phase. `t` is in the same units as `dt`.
     */
    sample(t: number): number {
        return waveformValue(t * this.frequency, this.waveform);
    }

    /** Reset the running phase (default 0). Does not change frequency/waveform. */
    reset(phase = 0): void {
        this.phase = phase - Math.floor(phase);
    }
}
