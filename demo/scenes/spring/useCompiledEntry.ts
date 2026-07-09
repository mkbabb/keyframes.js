// ─────────────────────────────────────────────────────────────────────────────
// S.F3 EN-d — the entry/exit dogfood. The @starting-style discrete card is the
// natural narrative twin for `compileToEntry`: this composable compiles the REAL
// zero-runtime artifact for that card's entry/exit (its opacity/transform
// endpoints, eased by the SAME keyframes.js spring the rail solves) via the
// published `compileToEntry`, so the demo surfaces the exact CSS a designer would
// paste to reproduce the transition — dogfooding the emitter, not re-typing its
// output by hand.
//
// T.B1-β/T.B7 — the compiled entry animation is a STABLE `CSSKeyframesAnimation`
// (`entryAnim`) now, not a per-recompile throwaway: it IS the spring facility's
// "Entry" channel (the wave-doc T.B7 second channel — "the compiled
// `@starting-style` animation from `useCompiledEntry`"), so the transport Select
// forks the stage view on real channel data. Recompiles re-seat its
// timingFunction from the live params and re-emit the artifact CSS through it.
// ─────────────────────────────────────────────────────────────────────────────
import { markRaw, ref, watch, type Ref } from "vue";
import { loadAnimationEngine, springTimingFunction } from "@mkbabb/keyframes.js";
import type { CSSKeyframesAnimation } from "@mkbabb/keyframes.js";
import { kfEngine } from "@utils/kfEngine";
import { SPRING_SCENE_ID } from "./springKeys";

/** The discrete card's entry animation, as a 2-stop `@keyframes` body. */
const ENTER_KEYFRAMES = `@keyframes kf-entry {
    from { opacity: 0; transform: translateY(20px) scale(0.9) }
    to   { opacity: 1; transform: translateY(0px) scale(1) }
}`;

/**
 * Compile the REAL `@starting-style` + `allow-discrete` artifact for the discrete
 * card, re-compiling whenever the spring params change so the emitted `linear()`
 * tracks the live rail. Returns the compiled CSS string for the copy-pasteable
 * readout (the artifact a `npm i` consumer pastes to reproduce the card) AND the
 * stable compiled entry animation itself (`entryAnim` — the facility's "Entry"
 * channel).
 *
 * `compileToEntry` is HEAVY — reached through the demo's `loadAnimationEngine()`
 * dogfood accessor (the same dynamic chunk any consumer awaits); the animation
 * itself is built synchronously off the warmed `kfEngine()` so the channel exists
 * at facility-assembly time. The 500ms duration + `.is-open` open selector +
 * `display: flex` match the card StartingStyleTarget renders.
 */
export function useCompiledEntry(
    response: () => number,
    dampingFraction: () => number,
): { css: Ref<string>; entryAnim: CSSKeyframesAnimation<any> } {
    const css = ref("");

    // The STABLE entry animation — the facility's "Entry" channel. Built
    // synchronously (kfEngine() resolves before any scene mounts); its
    // timingFunction re-seats on every recompile so the channel tracks the rail.
    const { CSSKeyframesAnimation } = kfEngine();
    const entryAnim = markRaw(
        new CSSKeyframesAnimation({
            duration: 500,
            timingFunction: springTimingFunction({
                response: response(),
                dampingFraction: dampingFraction(),
            }),
        }).fromString(ENTER_KEYFRAMES),
    );
    entryAnim.name = "Entry";
    entryAnim.superKey = SPRING_SCENE_ID;

    const recompile = async (): Promise<void> => {
        const { compileToEntry } = await loadAnimationEngine();
        const easing = springTimingFunction({
            response: response(),
            dampingFraction: dampingFraction(),
        });
        entryAnim.setTimingFunction(easing);
        const out = await compileToEntry(
            { ".discrete-card": { enter: entryAnim } },
            { openSelector: ".is-open", display: "flex" },
        );
        css.value = out.css;
    };

    watch([response, dampingFraction], () => void recompile(), {
        immediate: true,
    });

    return { css, entryAnim };
}
