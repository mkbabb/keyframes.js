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
import { markRaw, onScopeDispose, ref, watch, type Ref } from "vue";
import { loadAnimationEngine, springTimingFunction } from "@mkbabb/keyframes.js";
import type { CSSKeyframesAnimation } from "@mkbabb/keyframes.js";
import { kfEngine } from "@kf-engine";
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

    // ── KF-SS-3 / N-6 — ONE DEBOUNCED, CANCELLABLE RECOMPILE SEAM ─────────────
    //
    // The banked defect, in three parts, all on one 0.01-step slider drag:
    //
    //   1. NO DEBOUNCE. The watch ran `compileToEntry` — which this file's own
    //      docblock calls HEAVY, and which is reached through a dynamically
    //      imported chunk — once per slider input event.
    //   2. LAST-COMPLETED-WINS. `css.value = out.css` was written by whichever
    //      compile RESOLVED last, not whichever STARTED last, so the artifact a
    //      designer is invited to copy could be pinned to a curve the sliders no
    //      longer show. The failure is silent and the surface is a fidelity
    //      charter.
    //   3. AN INTERLEAVED MUTATION OF SHARED STATE. `setTimingFunction` writes
    //      `entryAnim` — the facility's "Entry" CHANNEL, one markRaw object the
    //      transport and the stage both read — and it ran AFTER an await, so two
    //      in-flight recompiles could interleave a mutation with a compile over
    //      the same object.
    //
    // One generation token answers all three: it is taken before the first await
    // and checked after each one, so a superseded run neither mutates the shared
    // channel nor writes the artifact; a trailing debounce collapses a drag into
    // one compile; and scope disposal bumps the generation, which invalidates
    // every in-flight run rather than letting it land in a dead scope.
    const RECOMPILE_DEBOUNCE_MS = 80;
    let generation = 0;
    let pending: ReturnType<typeof setTimeout> | undefined;

    const recompile = async (): Promise<void> => {
        const gen = ++generation;
        const { compileToEntry } = await loadAnimationEngine();
        if (gen !== generation) return;

        const easing = springTimingFunction({
            response: response(),
            dampingFraction: dampingFraction(),
        });
        entryAnim.setTimingFunction(easing);

        const out = await compileToEntry(
            { ".discrete-card": { enter: entryAnim } },
            { openSelector: ".is-open", display: "flex" },
        );
        if (gen !== generation) return;
        css.value = out.css;
    };

    /** Collapse a drag into one compile; the first one is not made to wait. */
    const scheduleRecompile = (immediate: boolean): void => {
        if (pending !== undefined) clearTimeout(pending);
        if (immediate) {
            pending = undefined;
            void recompile();
            return;
        }
        pending = setTimeout(() => {
            pending = undefined;
            void recompile();
        }, RECOMPILE_DEBOUNCE_MS);
    };

    watch([response, dampingFraction], () => scheduleRecompile(false));
    scheduleRecompile(true);

    onScopeDispose(() => {
        if (pending !== undefined) clearTimeout(pending);
        // Invalidate anything already awaiting: a resolved compile must not write
        // an artifact ref, or mutate a channel, that belongs to a disposed scene.
        generation++;
    });

    return { css, entryAnim };
}
