// ─────────────────────────────────────────────────────────────────────────────
// S.F3 EN-d — the entry/exit dogfood. The @starting-style discrete card is the
// natural narrative twin for `compileToEntry`: this composable compiles the REAL
// zero-runtime artifact for that card's entry/exit (its opacity/transform
// endpoints, eased by the SAME keyframes.js spring the rail solves) via the
// published `compileToEntry`, so the demo surfaces the exact CSS a designer would
// paste to reproduce the transition — dogfooding the emitter, not re-typing its
// output by hand.
// ─────────────────────────────────────────────────────────────────────────────
import { ref, watch, type Ref } from "vue";
import { loadAnimationEngine, springTimingFunction } from "@mkbabb/keyframes.js";

/** The discrete card's entry animation, as a 2-stop `@keyframes` body. */
const ENTER_KEYFRAMES = `@keyframes kf-entry {
    from { opacity: 0; transform: translateY(20px) scale(0.9) }
    to   { opacity: 1; transform: translateY(0px) scale(1) }
}`;

/**
 * Compile the REAL `@starting-style` + `allow-discrete` artifact for the discrete
 * card, re-compiling whenever the spring params change so the emitted `linear()`
 * tracks the live rail. Returns the compiled CSS string for the copy-pasteable
 * readout (the artifact a `npm i` consumer pastes to reproduce the card).
 *
 * `compileToEntry` is HEAVY — reached through the demo's `loadAnimationEngine()`
 * dogfood accessor (the same dynamic chunk any consumer awaits); `springTiming
 * Function` is LIGHT (statically imported). The 500ms duration + `.is-open` open
 * selector + `display: flex` match the card StartingStyleTarget renders.
 */
export function useCompiledEntry(
    response: () => number,
    dampingFraction: () => number,
): { css: Ref<string> } {
    const css = ref("");

    const recompile = async (): Promise<void> => {
        const { CSSKeyframesAnimation, compileToEntry } =
            await loadAnimationEngine();
        const easing = springTimingFunction({
            response: response(),
            dampingFraction: dampingFraction(),
        });
        const enter = new CSSKeyframesAnimation({
            duration: 500,
            timingFunction: easing,
        });
        enter.fromString(ENTER_KEYFRAMES);
        const out = await compileToEntry(
            { ".discrete-card": { enter } },
            { openSelector: ".is-open", display: "flex" },
        );
        css.value = out.css;
    };

    watch([response, dampingFraction], () => void recompile(), {
        immediate: true,
    });

    return { css };
}
