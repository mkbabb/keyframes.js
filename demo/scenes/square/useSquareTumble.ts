import { SpringProgress } from "@mkbabb/keyframes.js";
import { parseCssColor, serializeCssColor, type CssColor } from "@mkbabb/value.js/css";
import { mixColors } from "@mkbabb/value.js/color";
import { clamp } from "@mkbabb/value.js/math";
import { onMounted, onScopeDispose } from "vue";

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
    const spin = new SpringProgress({ response: 0.55, dampingFraction: 0.58, initial: 0 });

    /** The sweep's stops, named as TOKENS (violet → blue → the box's own rest
     *  teal). The fallbacks beside them are the tokens' own declared values, so
     *  a stylesheet that has not loaded degrades hue-identically rather than to
     *  a literal belonging to nothing — `--rainbow-indigo`/`--rainbow-cyan` are
     *  NOT in the six-colour family the demo declares, which is how the old
     *  `#7E6BE8` came to be a hex with no token behind it. */
    const tokens = ["--rainbow-violet", "--rainbow-blue", "--subject-teal"];
    const hues = ["hsl(300 75% 60%)", "hsl(210 80% 55%)", "#52e898"];

    /** The parsed stops (MISS-4). Empty until mount; the frame path checks it. */
    let stops: CssColor[] = [];

    /** This turn's sweep window — the spin value it started from and the span it
     *  covers, so a re-tumble mid-spin sweeps its OWN turn rather than sharing a
     *  wrapped angle with the previous one. */
    let sweepFrom = 0;
    let sweepSpan = 360;

    onMounted(() => {
        const style = getComputedStyle(document.documentElement);
        const resolved = tokens.map((token, index) => {
            const value = style.getPropertyValue(token).trim();
            return value || hues[index]!;
        });
        // D-27 — the parse throws stay OUT of the frame path. A stop that will
        // not parse is reported once, at mount, and the sweep simply does not
        // arm: the tumble still rolls, it just does not recolour.
        const parsed: CssColor[] = [];
        for (const css of resolved) {
            const result = parseCssColor(css);
            if (!result.ok) {
                console.error(
                    `[square] tumble palette stop ${JSON.stringify(css)} is not a colour — the sweep stays off.`,
                );
                return;
            }
            parsed.push(result.value);
        }
        stops = parsed;
    });

    /**
     * The sweep colour for the spin's CURRENT position in this turn, or
     * `undefined` when there is nothing honest to paint (stops unresolved, or a
     * mix/serialize the library refuses). The caller simply skips the write —
     * degrade, never throw, in the frame path.
     */
    const colorAtSpin = (): string | undefined => {
        if (stops.length < 2) return undefined;
        const t = clamp((spin.value - sweepFrom) / (sweepSpan || 1), 0, 1);
        const span = stops.length - 1;
        const index = Math.min(span - 1, Math.floor(t * span));
        const mixed = mixColors(
            stops[index]!,
            stops[index + 1]!,
            t * span - index,
            { space: "oklab" },
        );
        if (!mixed.ok) return undefined;
        const serialized = serializeCssColor(mixed.value);
        return serialized.ok ? serialized.value : undefined;
    };

    /**
     * L-3 — THE ACCUMULATOR IS THE SPRING'S OWN TARGET, NOT A PRIVATE COPY.
     * A module-private `target += 360` was never told about the takeover's
     * `springSpin.reset(0, 0)` (which writes `targetValue`), so after one
     * mid-tour grab the accumulator and the spring disagreed by a full turn:
     * three gestures produced a two-turn barrel roll, and every takeover added
     * another. Deriving the next target from `spin.target` makes the two
     * un-desyncable — there is only one number now.
     */
    const tumble = () => {
        sweepFrom = spin.value;
        spin.target = spin.target + 360;
        sweepSpan = spin.target - sweepFrom;
        startLoop();
    };

    onScopeDispose(() => spin.dispose());
    return { spin, colorAtSpin, tumble };
}
