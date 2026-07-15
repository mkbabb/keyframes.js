/**
 * `viewTransition` — the LIGHT View-Transitions dispatch (S.F1 VT-a; p09).
 *
 * The consumer-facing half of kf's View-Transitions story: mutate the DOM behind
 * a native View Transition where the platform ships one, and fall back to a
 * `flipShared` shared-element morph (or a bare immediate mutation) everywhere
 * else — behind ONE normalized {@link ViewTransitionHandle} whose `backend` is
 * queryable, so a caller can branch on which path actually ran.
 *
 * LIGHT (value.js-free): it composes `flipShared` (itself light — `ElementMorph`
 * + `RAFPlayback`) and the ONE `withReducedMotion` gate (`internal/reduced-motion`),
 * reads no value.js, and feature-detects the platform `startViewTransition` /
 * its typed-`update` object overload. `proof:boundary` enrolls it off the LIGHT
 * barrel automatically.
 *
 * The HEAVY companion — `compileToViewTransition` (`compile/emit/view-transition.ts`),
 * which compiles a name-keyed role spec to zero-runtime `::view-transition-*` CSS
 * — rides `loadAnimationEngine()`; this dispatch is the runtime side.
 *
 * ```ts
 * const vt = viewTransition(() => swapScene(next), {
 *     types: ["forward"],
 *     shared: [[oldHero, newHero]], // the flipShared fallback pairs
 * });
 * await vt.finished;
 * vt.backend; // "view-transition" | "flip" | "immediate"
 * ```
 */
import type { Easing, TimingFunction } from "../../constants/types";
import { flipShared } from "../flip";
import { withReducedMotion } from "../../internal/reduced-motion";

/** A synchronous DOM mutation the transition captures (may be async). */
export type ViewTransitionMutate = () => void | Promise<void>;

/** Options for {@link viewTransition}. */
export interface ViewTransitionOptions {
    /**
     * Typed same-doc View Transitions (`:active-view-transition-type(...)`).
     * Passed through the platform's typed-`update` object overload where the
     * browser supports it; DROPPED (the untyped cross-fade) where it does not —
     * conservative-correct, never a throw.
     */
    types?: readonly string[];
    /** Fallback play duration (ms) — the `flipShared` pairs. Defaults to `300`. */
    duration?: number;
    /**
     * Fallback easing — a callable {@link TimingFunction} or typed {@link Easing}
     * (e.g. `springTimingFunction(...)` for a springy fallback).
     */
    timingFunction?: TimingFunction | Easing;
    /**
     * The shared-element pairs the `flip` fallback morphs (`[from, to]`). When
     * the platform has no `startViewTransition`, each `from` morphs onto its
     * `to`'s rect via `flipShared` — the zero-peer visual-equivalence letter.
     */
    shared?: ReadonlyArray<readonly [HTMLElement, HTMLElement]>;
    /**
     * The fallback strategy when View Transitions are unavailable: `"flip"`
     * (default — run the `shared` pairs; a bare mutate when none are given),
     * `"none"` (mutate immediately, no motion), or a custom async runner.
     */
    fallback?: "flip" | "none" | ((mutate: ViewTransitionMutate) => Promise<void>);
    /**
     * Route through the ONE `withReducedMotion` gate (default `true`): under an
     * active `prefers-reduced-motion: reduce` the transition SNAPS — `mutate()`
     * runs directly and the handle settles (`backend: "immediate"`), skipping
     * `startViewTransition` entirely. The platform's own degrade, WCAG-aligned.
     */
    respectReducedMotion?: boolean;
}

/**
 * The normalized transition handle — settles cleanly whether a native View
 * Transition, a `flipShared` fallback, or a bare immediate mutation ran. Its
 * promises NEVER reject (a skipped/aborted transition settles), so a consumer's
 * `await handle.finished` is always safe.
 */
export interface ViewTransitionHandle {
    /** Resolves once the transition's pseudo-tree is ready to animate (or immediately off-platform). */
    ready: Promise<void>;
    /** Resolves when the transition (or fallback) has fully settled. Never rejects. */
    finished: Promise<void>;
    /** Resolves once the DOM mutation callback has run. */
    updateCallbackDone: Promise<void>;
    /** Skip the running transition to its end state (no-op off-platform). */
    skip(): void;
    /**
     * Which path actually ran — set SYNCHRONOUSLY at dispatch so a caller can
     * branch immediately: `"view-transition"` (native), `"flip"` (the
     * `flipShared` fallback), `"immediate"` (bare mutate — no platform, PRM snap,
     * or `fallback: "none"`).
     */
    backend: "view-transition" | "flip" | "immediate";
}

const DEFAULT_FALLBACK_DURATION = 300;

/** The platform `startViewTransition`, feature-detected (SSR/older-browser safe). */
interface StartViewTransitionDocument {
    startViewTransition?: (
        arg: ViewTransitionMutate | { update: ViewTransitionMutate; types?: readonly string[] },
    ) => NativeViewTransition;
}

/** The native `ViewTransition` shape (a structural read — no lib.dom dependency). */
interface NativeViewTransition {
    ready: Promise<void>;
    finished: Promise<void>;
    updateCallbackDone: Promise<void>;
    skipTransition?: () => void;
}

const hasStartViewTransition = (): boolean =>
    typeof document !== "undefined" &&
    typeof (document as StartViewTransitionDocument).startViewTransition ===
        "function";

/** A never-rejecting settle over a native promise (a skip/abort resolves void). */
const settle = (p: Promise<unknown>): Promise<void> =>
    p.then(
        () => undefined,
        () => undefined,
    );

/** The immediate (no-motion) handle: run `mutate`, settle. `backend: "immediate"`. */
function immediateHandle(mutate: ViewTransitionMutate): ViewTransitionHandle {
    const done = Promise.resolve(mutate()).then(
        () => undefined,
        () => undefined,
    );
    return {
        ready: done,
        finished: done,
        updateCallbackDone: done,
        skip: () => {},
        backend: "immediate",
    };
}

/**
 * The `flipShared` fallback handle: run `mutate`, then morph each `[from, to]`
 * pair via `flipShared`. `backend: "flip"` when pairs are given, else it degrades
 * to `immediate` (no pairs → nothing to morph).
 */
function flipHandle(
    mutate: ViewTransitionMutate,
    shared: ReadonlyArray<readonly [HTMLElement, HTMLElement]>,
    duration: number,
    timingFunction: TimingFunction | Easing | undefined,
): ViewTransitionHandle {
    if (shared.length === 0) return immediateHandle(mutate);
    const flipOpts = {
        duration,
        ...(timingFunction !== undefined ? { timingFunction } : {}),
    };
    const updateCallbackDone = Promise.resolve(mutate()).then(
        () => undefined,
        () => undefined,
    );
    const finished = updateCallbackDone
        .then(() =>
            Promise.all(shared.map(([from, to]) => flipShared(from, to, flipOpts))),
        )
        .then(
            () => undefined,
            () => undefined,
        );
    return {
        ready: updateCallbackDone,
        finished,
        updateCallbackDone,
        skip: () => {},
        backend: "flip",
    };
}

/**
 * Mutate the DOM behind a View Transition where the platform supports one, else
 * fall back to a `flipShared` shared-element morph (or a bare immediate
 * mutation). Returns a normalized {@link ViewTransitionHandle} whose `backend`
 * is queryable and whose promises never reject.
 *
 * @param mutate — the synchronous (or async) DOM mutation the transition captures.
 * @param opts — `{ types, duration, timingFunction, shared, fallback, respectReducedMotion }`.
 */
export function viewTransition(
    mutate: ViewTransitionMutate,
    opts: ViewTransitionOptions = {},
): ViewTransitionHandle {
    const {
        types,
        duration = DEFAULT_FALLBACK_DURATION,
        timingFunction,
        shared = [],
        fallback = "flip",
        respectReducedMotion = true,
    } = opts;

    // The fallback path (no native VT, PRM snap, or an explicit strategy). A
    // custom async runner takes over entirely; `"none"` mutates immediately;
    // `"flip"` runs the shared-element morph.
    const runFallback = (): ViewTransitionHandle => {
        if (typeof fallback === "function") {
            const finished = fallback(mutate).then(
                () => undefined,
                () => undefined,
            );
            return {
                ready: finished,
                finished,
                updateCallbackDone: finished,
                skip: () => {},
                backend: "flip",
            };
        }
        if (fallback === "none") return immediateHandle(mutate);
        return flipHandle(mutate, shared, duration, timingFunction);
    };

    // PRM routes through the ONE withReducedMotion gate — under an active
    // `reduce` query the transition SNAPS (mutate directly, settle), else it
    // runs the normal path. `respectReducedMotion` defaults true.
    return withReducedMotion(
        respectReducedMotion,
        () => immediateHandle(mutate),
        () => {
            if (!hasStartViewTransition()) return runFallback();

            const start = (document as StartViewTransitionDocument)
                .startViewTransition!;
            let vt: NativeViewTransition;
            try {
                // The typed-`update` object overload where the browser supports
                // it (Chrome 125+); DROP `types` (the untyped cross-fade) on a
                // callback-only engine that rejects the object form.
                vt =
                    types && types.length > 0
                        ? start({ update: mutate, types })
                        : start(mutate);
            } catch {
                try {
                    vt = start(mutate);
                } catch {
                    // startViewTransition present but threw for both shapes —
                    // degrade to the fallback rather than surface the throw.
                    return runFallback();
                }
            }

            return {
                ready: settle(vt.ready),
                finished: settle(vt.finished),
                updateCallbackDone: settle(vt.updateCallbackDone),
                skip: () => vt.skipTransition?.(),
                backend: "view-transition",
            };
        },
    );
}
