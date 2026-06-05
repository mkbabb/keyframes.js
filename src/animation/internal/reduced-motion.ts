/**
 * One shared `prefers-reduced-motion` gate for the whole engine.
 *
 * Collapses the formerly hand-rolled `prefersReducedMotion()` copies (one
 * each in `numeric.ts`, `smooth.ts`, `spring.ts`) into a single SSR-safe
 * authority that EVERY surface consults — the light interpolators
 * (`SpringProgress`, `SmoothProgress`, `NumericAnimation` via `RAFPlayback`),
 * the heavy `Animation.play()` path, and `AnimationGroup.play()`. glass-ui
 * /motion fans the heavy-surface PRM posture out across the constellation
 * from this one detector.
 *
 * Value.js-free: only reads `window.matchMedia`, so importing it keeps a
 * light module's static graph value.js-free.
 */

const PRM_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * The ONE module-level `MediaQueryList` — held so the engine reads the live
 * preference from a single handle AND so the change listener (below) has one
 * canonical source to observe. Lazily resolved on first read: SSR/jsdom that
 * never touches reduced-motion never even constructs it.
 *
 * Keyed on the live `window.matchMedia` identity so a swapped `matchMedia`
 * (HMR, a test harness re-stubbing it) rebuilds the handle rather than serving
 * a stale one — the singleton holds for ANY given `matchMedia`, which is the
 * production guarantee, without going stale across a runtime swap.
 */
let prmQuery: MediaQueryList | null = null;
let prmSource: unknown;

function getPRMQuery(): MediaQueryList | null {
    const matchMedia =
        typeof window === "undefined" ? undefined : window.matchMedia;
    if (typeof matchMedia !== "function") {
        prmQuery = null;
        prmSource = matchMedia;
        return null;
    }
    if (prmQuery !== null && prmSource === matchMedia) return prmQuery;
    prmSource = matchMedia;
    prmQuery = matchMedia.call(window, PRM_QUERY);
    return prmQuery;
}

/**
 * Feature-detect the user's `prefers-reduced-motion: reduce` preference.
 *
 * SSR-safe: returns `false` when `window` / `matchMedia` is unavailable
 * (Node, jsdom without the media query, server render), so animations
 * proceed normally off-DOM and a consumer never has to guard the call.
 *
 * Reads the LIVE `.matches` off the one shared `MediaQueryList`, so a running
 * play loop that re-consults this per tick (via {@link withReducedMotion})
 * observes an OS toggle mid-flight — no per-call `matchMedia` re-construction.
 */
export function prefersReducedMotion(): boolean {
    return getPRMQuery()?.matches ?? false;
}

/**
 * Subscribe to OS reduced-motion flips. Attaches ONE `change` listener to the
 * shared `MediaQueryList` (feature-detected — no-op off-DOM / where the handle
 * is absent) and returns an unsubscribe. The detector's missing OBSERVATION
 * half: detection was already unified by {@link prefersReducedMotion}; this
 * lets a long-lived surface react to a flip (e.g. snap a mid-flight infinite
 * animation to rest) instead of waiting for the next `play()`.
 *
 * Idempotent unsubscribe (a doubled call is harmless). The handle itself is
 * never torn down — it is the engine-wide singleton every play path consults.
 */
export function onReducedMotionChange(
    listener: (matches: boolean) => void,
): () => void {
    const query = getPRMQuery();
    if (query == null || typeof query.addEventListener !== "function") {
        return () => {};
    }
    const handler = (event: MediaQueryListEvent): void =>
        listener(event.matches);
    query.addEventListener("change", handler);
    let removed = false;
    return () => {
        if (removed) return;
        removed = true;
        query.removeEventListener("change", handler);
    };
}

/**
 * THE reduced-motion gate — every play path in the engine routes through
 * this one contract instead of hand-writing the
 * `if (respect && prefersReducedMotion()) …` dance per surface.
 *
 * `snap` is the surface's one-line "jump to the terminal state, emit once,
 * no loop" closure; `run` is its normal animated path. Detection was
 * unified by `prefersReducedMotion()`; this unifies the *response* so the
 * seven formerly hand-written snap bodies (which had already drifted —
 * one carried a repaint bug) collapse to per-surface one-liners.
 */
export function withReducedMotion<T>(
    respect: boolean | undefined,
    snap: () => T,
    run: () => T,
): T {
    return respect && prefersReducedMotion() ? snap() : run();
}
