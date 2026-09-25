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
import { markRaw, onScopeDispose, shallowRef, watch, type ShallowRef } from "vue";
import { loadAnimationEngine, springTimingFunction } from "@mkbabb/keyframes.js";
import type {
    CompiledEntryCSS,
    CSSKeyframesAnimation,
    Easing,
} from "@mkbabb/keyframes.js";
import { kfEngine } from "@kf-engine";
import { SPRING_SCENE_ID } from "./springKeys";

/** The discrete card's entry animation, as a 2-stop `@keyframes` body. */
const ENTER_KEYFRAMES = `@keyframes kf-entry {
    from { opacity: 0; transform: translateY(20px) scale(0.9) }
    to   { opacity: 1; transform: translateY(0px) scale(1) }
}`;

/** The exit: the same two endpoints, open → closed. */
const EXIT_KEYFRAMES = `@keyframes kf-exit {
    from { opacity: 1; transform: translateY(0px) scale(1) }
    to   { opacity: 0; transform: translateY(20px) scale(0.9) }
}`;

/**
 * X.KF.W13X.springd (UIA-KF-096 · KFA-45 · KFA-215) — THE CARD'S TIME IS THE
 * SPRING'S TIME.
 *
 * The banked defect: `springLinearStops` samples over `4 × response` (2000 ms for
 * Smooth), while the card and this animation played those stops in a pinned
 * 500 ms — so the spring ran 4× fast (entry opaque by ~100 ms), half the stops sat
 * at a plateau of `1.00000`, and the exit left a ~400 ms invisible, hit-testable
 * tail before `display: none`. `response` was not expressed at all, and the card
 * carried a disclaimer saying so.
 *
 * One duration, read off the spring itself: the time at which the response last
 * leaves `1 ± SETTLE_EPSILON`, sampled over the solver's own window. The
 * `linear()` is then emitted over exactly that span, so every stop is motion
 * and the duration scales with `response` (the curve is self-similar under it).
 * The exit is the same spring critically damped (ζ ≥ 1): it never overshoots
 * past its closed endpoint, and it gets its own settle span.
 *
 * `SETTLE_EPSILON` is 0.5% of the travel — 0.1 px of the 20 px translate, 0.0005
 * of the scale, 0.005 of the opacity: below what the eye can see.
 */
export const SETTLE_EPSILON = 5e-3;
/** The exit's damping floor: critically damped, so it cannot overshoot. */
const EXIT_DAMPING_FLOOR = 1;
/** The resolution of the settle read: one probe per 1/480 of the window. */
const SETTLE_PROBES = 480;

/** One direction of the transition: how long, and on which curve. */
export interface EntryLeg {
    durationMs: number;
    easing: Easing;
}

/** Both directions — the card's CSS and the artifact are written from this. */
export interface EntryTiming {
    enter: EntryLeg;
    exit: EntryLeg;
}

/** The spring's own settle span, in whole milliseconds, and its curve over it. */
function settleLeg(response: number, dampingFraction: number): EntryLeg {
    const windowS = response * 4;
    const probe = springTimingFunction({
        response,
        dampingFraction,
        sampleCount: SETTLE_PROBES,
    }).fn;
    let last = 0;
    for (let i = 0; i <= SETTLE_PROBES; i++) {
        const x = i / SETTLE_PROBES;
        if (Math.abs(probe(x) - 1) > SETTLE_EPSILON) last = x;
    }
    // The first probe past the last excursion is where the spring has settled.
    const settled = Math.min(1, last + 1 / SETTLE_PROBES);
    const durationMs = Math.max(1, Math.round(settled * windowS * 1000));
    return {
        durationMs,
        easing: springTimingFunction({
            response,
            dampingFraction,
            maxDuration: durationMs / 1000,
        }),
    };
}

/** The entry and exit legs for the live spring params. */
export function entryTiming(response: number, dampingFraction: number): EntryTiming {
    return {
        enter: settleLeg(response, dampingFraction),
        exit: settleLeg(response, Math.max(dampingFraction, EXIT_DAMPING_FLOOR)),
    };
}

/**
 * The composable's one published state: the timing the card animates on and
 * the compile result for exactly that timing, written together so the card and
 * its artifact can never be read at two different params. `result` is `null`
 * while the first compile is in flight.
 */
export interface CompiledEntry {
    timing: EntryTiming;
    result: CompiledEntryCSS | null;
}

/**
 * Compile the REAL `@starting-style` + `allow-discrete` artifact for the discrete
 * card, re-compiling whenever the spring params change so the emitted `linear()`
 * tracks the live rail. Returns the compiled entry (timing + the compile's whole
 * `{ css, eligible, refusals }` — UIA-KF-207: a refusal is a state, not an empty
 * string) AND the stable compiled entry animation itself (`entryAnim` — the
 * facility's "Entry" channel).
 *
 * `compileToEntry` is HEAVY — reached through the demo's `loadAnimationEngine()`
 * dogfood accessor (the same dynamic chunk any consumer awaits); the animation
 * itself is built synchronously off the warmed `kfEngine()` so the channel exists
 * at facility-assembly time. The `.is-open` open selector + `display: flex` match
 * the card StartingStyleTarget renders.
 */
export function useCompiledEntry(
    response: () => number,
    dampingFraction: () => number,
): { entry: ShallowRef<CompiledEntry>; entryAnim: CSSKeyframesAnimation<any> } {
    const initial = entryTiming(response(), dampingFraction());
    const entry = shallowRef<CompiledEntry>({ timing: initial, result: null });

    // The STABLE entry animation — the facility's "Entry" channel. Built
    // synchronously (kfEngine() resolves before any scene mounts); its duration
    // and timingFunction re-seat on every recompile so the channel tracks the rail.
    const { CSSKeyframesAnimation } = kfEngine();
    const entryAnim = markRaw(
        new CSSKeyframesAnimation({
            duration: initial.enter.durationMs,
            timingFunction: initial.enter.easing,
        }).fromString(ENTER_KEYFRAMES),
    );
    // The exit leg: compiled beside the entry, never a transport channel.
    const exitAnim = markRaw(
        new CSSKeyframesAnimation({
            duration: initial.exit.durationMs,
            timingFunction: initial.exit.easing,
        }).fromString(EXIT_KEYFRAMES),
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

        const timing = entryTiming(response(), dampingFraction());
        entryAnim.setDuration(timing.enter.durationMs);
        entryAnim.setTimingFunction(timing.enter.easing);
        exitAnim.setDuration(timing.exit.durationMs);
        exitAnim.setTimingFunction(timing.exit.easing);

        const out = await compileToEntry(
            { ".discrete-card": { enter: entryAnim, exit: exitAnim } },
            { openSelector: ".is-open", display: "flex" },
        );
        if (gen !== generation) return;
        entry.value = { timing, result: out };
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

    return { entry, entryAnim };
}
