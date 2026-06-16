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
 * The reduced-motion policy a surface honors (K.W11 PHYS-E). The ONE gate
 * takes a SCALE, not just a boolean — WCAG 2.3.3-aligned ("shorten the
 * travel, keep the meaning"):
 *
 * - `false` / `undefined` — do not honor reduced motion (the conservative
 *   default; the animation runs at full amplitude regardless of the OS query).
 * - `true` — the classic binary snap: under an active `prefers-reduced-motion:
 *   reduce` the surface jumps to its terminal state (amplitude scale `0`).
 * - a `number` ∈ [0, 1] — the INTENSITY: under an active query the surface
 *   scales its motion AMPLITUDE to this fraction (`0.3` → 30 % of the
 *   displacement-from-rest) while preserving the trajectory shape, settle
 *   time, and the opacity/color track. `1` ≈ full motion, `0` ≡ the binary
 *   snap. The scale comes from the CONSUMER's policy (a settings slider, a
 *   per-animation field) — the OS exposes only a binary signal; kf provides
 *   the MECHANISM, the app provides the policy.
 */
export type ReducedMotionPolicy = boolean | number | undefined;

/**
 * Resolve a {@link ReducedMotionPolicy} to the AMPLITUDE SCALE ∈ [0, 1] a
 * stepper multiplies its displacement-from-rest by (K.W11 PHYS-E).
 *
 * - When reduced motion is NOT honored / NOT active → `1` (full amplitude).
 * - `respect === true` under an active query → `0` (the binary snap — zero
 *   displacement, the classic behavior).
 * - `respect` a number under an active query → that number, clamped to
 *   [0, 1] (the intensity).
 *
 * Off-DOM / no active query → always `1`, so SSR and a user without the
 * preference set are byte-unchanged. The analytic spring scales `(originValue
 * − targetValue)` by this factor at `evaluateAt`, so amplitude scaling is
 * EXACT and free — the envelope (curve shape + settle time) is preserved by
 * construction; only the peak displacement shrinks.
 */
export function reducedMotionScale(respect: ReducedMotionPolicy): number {
    if (respect === false || respect === undefined) return 1;
    if (!prefersReducedMotion()) return 1;
    if (respect === true) return 0;
    // A numeric intensity under an active query — clamp to [0, 1].
    return respect < 0 ? 0 : respect > 1 ? 1 : respect;
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
 *
 * Widened (K.W11 PHYS-E) to accept a {@link ReducedMotionPolicy} — a
 * `boolean` OR a numeric intensity. A POSITIVE intensity (`> 0`) is NOT a
 * snap: the surface keeps animating at scaled amplitude, so `run` is chosen
 * (the amplitude scale is applied by the stepper, not by this gate). Only the
 * binary `true` (or an explicit `0`, the snap-equivalent intensity) under an
 * active query snaps. So the existing `boolean` call-sites are byte-unchanged
 * (`true` → `snap`, `false` → `run`); a number ∈ (0, 1] routes to `run` and
 * lets the amplitude scale carry the reduction.
 */
export function withReducedMotion<T>(
    respect: ReducedMotionPolicy,
    snap: () => T,
    run: () => T,
): T {
    if (!respect && respect !== 0) return run(); // false / undefined
    if (!prefersReducedMotion()) return run();
    // A positive intensity keeps animating (scaled); only true / 0 snaps.
    return respect === true || respect === 0 ? snap() : run();
}
