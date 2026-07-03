import { onMounted, onScopeDispose, ref } from "vue";
import { usePreferredReducedMotion } from "@vueuse/core";
import type { loadAnimationEngine as LoadAnimationEngine } from "@mkbabb/keyframes.js";

/**
 * L.W11.S1 — the live @keyframes source card (the home scene's instrument egg),
 * extracted from EditorStartScreen.vue as a colocated sub-unit (the demo
 * ≤500L-per-file decomposition; proof:demo-no-oversize). The card TYPES its own
 * @keyframes block, the REAL engine parses it (CSSKeyframesAnimation), lifts the
 * hero block to each translateY, and format.ts serializes it BACK to a CSS string
 * — the CLAUDE.md moat ("parse @keyframes, animate any object, get the CSS back")
 * as a quiet ~6s loop BESIDE the hero. Dogfood: the SAME engine the library ships
 * (loadAnimationEngine → CSSKeyframesAnimation + CSSKeyframesToString), injected by
 * the caller so the consuming SFC keeps the dogfood edge. No hand-rolled rAF — the
 * lift is an engine animation; the character typing is a plain interval (a text
 * reveal, not motion). PRM: no typing, no lift loop — the card rests on the
 * completed block (the narrative still reads: source + result both visible).
 */

// The @keyframes block the card writes — AND the literal source the engine parses
// on the hero (`fromString`, the moat's actual front door, NOT a hand-built JS
// object). The 20% stop's -22px is the lift the hero crests to. Parsing the SAME
// string the card types is the truest dogfood: source-in === what-runs. (The
// JS-object `fromKeyframes({transform:"translateY(-22px)"})` form silently drops
// the function wrapper at flatten — value.js owns that grammar gap; the CSS-parse
// path reconstructs `translateY` faithfully, so the card parses its own CSS.)
const FULL_SOURCE =
    "@keyframes hero {\n" +
    "  0%   { transform: translateY(0px);  }\n" +
    "  20%  { transform: translateY(-22px); }\n" +
    "  100% { transform: translateY(0px);  }\n" +
    "}";

export function useHeroSourceEgg(
    getHeroEl: () => HTMLElement | null,
    loadEngine: typeof LoadAnimationEngine,
) {
    const prm = usePreferredReducedMotion();
    const prefersReduced = ref(false);
    const typedSource = ref("");
    const serializedOut = ref("");
    const caretBlink = ref(false);

    let heroAnim: Awaited<ReturnType<typeof loadEngine>> extends {
        CSSKeyframesAnimation: new (...args: never[]) => infer A;
    }
        ? A | undefined
        : unknown;
    let typeTimer: ReturnType<typeof setInterval> | undefined;
    let loopTimer: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;

    const clearTimers = () => {
        if (typeTimer != null) clearInterval(typeTimer);
        if (loopTimer != null) clearTimeout(loopTimer);
        typeTimer = undefined;
        loopTimer = undefined;
    };

    // One round-trip: type the block → play the hero lift (engine) → serialize
    // back (format.ts) → pause → clear → repeat.
    const runRoundTrip = async () => {
        if (disposed) return;
        typedSource.value = "";
        serializedOut.value = "";
        caretBlink.value = false;

        const { CSSKeyframesAnimation, CSSKeyframesToString } =
            await loadEngine();
        if (disposed) return;

        // Build the REAL engine animation by PARSING the same @keyframes string
        // the card types (`fromString` — the moat's front door).
        (heroAnim as { stop?: () => void } | undefined)?.stop?.();
        const anim = new CSSKeyframesAnimation({
            duration: 1400,
            iterationCount: 1,
            fillMode: "forwards",
            timingFunction: "ease-in-out",
        }).fromString(FULL_SOURCE);
        heroAnim = anim as typeof heroAnim;
        const el = getHeroEl();
        if (el) anim.setTargets(el);

        // Type the block character by character (a text reveal — NOT a rAF).
        let i = 0;
        await new Promise<void>((resolve) => {
            typeTimer = setInterval(() => {
                if (disposed) {
                    resolve();
                    return;
                }
                i += 1;
                typedSource.value = FULL_SOURCE.slice(0, i);
                // As the caret passes the lift line, play the engine lift.
                if (i === FULL_SOURCE.indexOf("-22px") + 5) anim.play();
                if (i >= FULL_SOURCE.length) {
                    if (typeTimer != null) clearInterval(typeTimer);
                    typeTimer = undefined;
                    caretBlink.value = true;
                    resolve();
                }
            }, 28);
        });
        if (disposed) return;

        // The round-trip's second half: format.ts prints the parsed animation
        // BACK to a CSS string — a REAL engine call, not faked.
        try {
            const css = await CSSKeyframesToString(anim, "hero");
            if (!disposed)
                serializedOut.value = css
                    .replace(/\s+/g, " ")
                    .trim()
                    .slice(0, 64);
        } catch {
            /* KEEP: the serialize is a flourish; a failure leaves the block alone */
        }
    };

    const startLoop = async () => {
        if (disposed || prefersReduced.value) return;
        await runRoundTrip();
        if (disposed || prefersReduced.value) return;
        // Pause on the completed block, then clear and retype — the ~6s loop.
        loopTimer = setTimeout(() => {
            if (!disposed && !prefersReduced.value) void startLoop();
        }, 2600);
    };

    /** Hover the card → restart the compile from line 0 (scrub the compilation). */
    const recompile = () => {
        if (prefersReduced.value) return;
        clearTimers();
        void startLoop();
    };

    onMounted(() => {
        prefersReduced.value = prm.value === "reduce";
        if (prefersReduced.value) {
            // PRM: rest on the completed block; no typing, no loop.
            typedSource.value = FULL_SOURCE;
            return;
        }
        void startLoop();
    });

    onScopeDispose(() => {
        disposed = true;
        clearTimers();
        (heroAnim as { stop?: () => void } | undefined)?.stop?.();
    });

    return { typedSource, serializedOut, caretBlink, prefersReduced, recompile };
}
