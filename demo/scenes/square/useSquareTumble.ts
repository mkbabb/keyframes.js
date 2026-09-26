import { SpringProgress } from "@mkbabb/keyframes.js";
import { parseCssColor, serializeCssColor, type CssColor } from "@mkbabb/value.js/css";
import { mixColors } from "@mkbabb/value.js/color";
import { clamp } from "@mkbabb/value.js/math";
import { onMounted, onScopeDispose } from "vue";

/** Which sweep is live: the double-tap egg, or the return to rest after a
 *  takeover (X.KF.W13X · UIA-KF-199 — the same spin-keyed blend, no bloom). */
export type SweepKind = "tumble" | "return";

/** One frame of the sweep, read by the paint loop. */
export interface SweepSample {
    /** The colour to paint this frame, when there is one to paint honestly. */
    color?: string;
    /** The egg's marker (`data-palette-sweep` → the bloom) is on. */
    marker: boolean;
    /** The sweep is still running and needs another frame. */
    live: boolean;
}

/** X.KF.W13X · KFA-97 — the bloom's landing pulse: the marker outlives the
 *  sweep's arrival by this much, then clears (it used to wait for a 360°
 *  spring to settle to 1e-3°, ~1.1 s after the box was visibly still). */
const LANDING_PULSE_MS = 180;

/**
 * The square's private tumble egg: spin state plus perceptual palette sampling.
 *
 * MISS-4 — PARSE ONCE, INTERPOLATE MANY (the library's own idiom, which this
 * showcase used to demonstrate backwards). `colorAt` re-parsed two STATIC colour
 * strings on EVERY tumble frame — four Result allocations a frame, ~120 frames a
 * tumble — and the per-frame parse is what moved the D-27 throw class out of a
 * survivable init site and into the loop-bricking frame path. The stops are
 * resolved and parsed ONCE at mount; the frame path only mixes and serializes.
 *
 * L-11/C-5 — THE LANDING IS SEAMLESS BY CONSTRUCTION, AND THE SETTLE NO LONGER
 * WRAPS. (b) the terminal stop was `--rainbow-green` (hsl(130 70% 50%)) while
 * the box rests on `--subject-teal` (#52e898): the "seamless by construction"
 * landing the scene claims was a visible hue step the moment C-1 was cured. The
 * terminal stop is now the box's OWN rest token, so the landing is exact by
 * identity rather than by a coincidence of two spellings. (a) the sweep keyed
 * off the WRAPPED angle (`value mod 360`), and an underdamped spin crosses its
 * target six times before settling — six one-frame green↔violet snaps at the
 * very end of the roll. It keys off the CLAMPED progress of this turn now:
 * monotone to 1, and overshoot rests at the landing hue instead of wrapping back
 * to the first.
 */
export function useSquareTumble(startLoop: () => void) {
    /* X.KF.W13X · KFA-207 — the landing is a thunk, not a second half-turn:
       ζ 0.58 overshot a 360° throw by 38° and rocked back 4° (~650 ms under the
       bloom); ζ 0.8 overshoots by ~1.5 % (≈5°). KFA-97 — the settle thresholds
       are in DEGREES here (0.1°, 1°/s), not the library's unit-progress 1e-3. */
    const spin = new SpringProgress({
        response: 0.55,
        dampingFraction: 0.8,
        initial: 0,
        settleThreshold: 0.1,
        velocitySettleThreshold: 1,
    });

    /** The sweep's named stops (violet → blue → the box's own rest teal). The
     *  fallbacks beside them are the tokens' own declared values, so a
     *  stylesheet that has not loaded degrades hue-identically. */
    const tokens = ["--rainbow-violet", "--rainbow-blue", "--subject-teal"];
    const hues = ["hsl(300 75% 60%)", "hsl(210 80% 55%)", "#52e898"];

    /** The parsed palette (MISS-4: parse once). Absent until mount, or when a
     *  stop will not parse — then the roll still rolls, it just does not
     *  recolour. */
    let palette: { violet: CssColor; blue: CssColor; rest: CssColor } | null = null;

    onMounted(() => {
        const style = getComputedStyle(document.documentElement);
        const parsed: CssColor[] = [];
        for (const [index, token] of tokens.entries()) {
            const css = style.getPropertyValue(token).trim() || hues[index]!;
            const result = parseCssColor(css);
            if (!result.ok) {
                // D-27 — reported once, at mount, never in the frame path.
                console.error(
                    `[square] tumble palette stop ${JSON.stringify(css)} is not a colour — the sweep stays off.`,
                );
                return;
            }
            parsed.push(result.value);
        }
        palette = { violet: parsed[0]!, blue: parsed[1]!, rest: parsed[2]! };
    });

    /** A painted fill, parsed — the colour a sweep leaves FROM. */
    const parse = (css: string | undefined): CssColor | undefined => {
        if (!css) return undefined;
        const result = parseCssColor(css);
        return result.ok ? result.value : undefined;
    };

    let kind: SweepKind | null = null;
    let stops: CssColor[] = [];
    /** This sweep's window on the spin (L-11/C-5: a re-tumble mid-spin sweeps
     *  its OWN turn, keyed to its clamped progress, never a wrapped angle). */
    let sweepFrom = 0;
    let sweepSpan = 360;
    let landedAt = 0;

    const progress = (): number =>
        sweepSpan === 0 ? 1 : clamp((spin.value - sweepFrom) / sweepSpan, 0, 1);

    /** Open a sweep over the spin's leg from where it is to `target`. */
    const open = (next: SweepKind | null, target: number, from: CssColor[]) => {
        sweepFrom = spin.value;
        spin.target = target;
        sweepSpan = target - sweepFrom;
        kind = next;
        stops = from;
        landedAt = 0;
        startLoop();
    };

    /**
     * L-3 — the accumulator is the spring's own target. X.KF.W13X · KFA-98 —
     * the sweep LEAVES FROM THE BOX'S OWN COLOUR (the painted fill, else the
     * rest teal): its first stop was violet, so the roll took off with a
     * one-frame teal → magenta snap at rotation 0.
     */
    const tumble = (fromFill?: string) => {
        const from = parse(fromFill) ?? palette?.rest;
        open(
            palette && from ? "tumble" : null,
            spin.target + 360,
            palette && from ? [from, palette.violet, palette.blue, palette.rest] : [],
        );
    };

    /**
     * X.KF.W13X · KFA-94 / UIA-KF-199 — after a takeover the box goes HOME in
     * the channels the drag does not own: the spin returns to the nearest
     * upright turn (never a full unwind), and the fill blends from the tour's
     * colour to the rest teal on the same leg.
     */
    const returnHome = (fromFill?: string) => {
        const from = parse(fromFill);
        open(
            palette && from ? "return" : null,
            Math.round(spin.value / 360) * 360,
            palette && from ? [from, palette.rest] : [],
        );
    };

    /** X.KF.W13X · KFA-96 — the tour takes the box: the spin rests where it is
     *  (mod one turn) and any sweep ends, so no second writer survives Play. */
    const halt = () => {
        spin.reset(((spin.value % 360) + 360) % 360, 0);
        kind = null;
        stops = [];
    };

    /** The sweep this frame (`now` is the loop's own frame clock). */
    const sample = (now: number): SweepSample => {
        if (!kind || stops.length < 2) return { marker: false, live: false };
        const t = progress();
        if (t >= 1 && landedAt === 0) landedAt = now;
        const span = stops.length - 1;
        const index = Math.min(span - 1, Math.floor(t * span));
        const mixed = mixColors(stops[index]!, stops[index + 1]!, t * span - index, {
            space: "oklab",
        });
        const serialized = mixed.ok ? serializeCssColor(mixed.value) : undefined;
        const color = serialized?.ok ? serialized.value : undefined;
        const done =
            landedAt !== 0 && (kind === "return" || now - landedAt >= LANDING_PULSE_MS);
        const marker = kind === "tumble" && !done;
        if (done) {
            kind = null;
            stops = [];
        }
        return color === undefined ? { marker, live: !done } : { color, marker, live: !done };
    };

    onScopeDispose(() => spin.dispose());
    return { spin, tumble, returnHome, halt, sample };
}
