/**
 * Vitest-only stub for `@mkbabb/glass-ui/motion-core`.
 *
 * The library gate (ci.yml `gates` job) is glass-ui-FREE by design (inv β) — the
 * optional `file:../glass-ui` link dangles, so a demo composable that imports
 * glass-ui (`demo/app/useSceneSwap.ts` / `useSceneTransition.ts` →
 * `supportsViewTransitions` / `startViewTransition`) cannot RESOLVE there, which
 * reds the demo-encapsulation tests transitively pulled into the test pool.
 * vitest runs ONLY in that gate (demo-smoke builds the demo but runs no vitest),
 * so aliasing the glass-ui motion-core subpath to this shim lets the encapsulation
 * tests transform glass-ui-free. The REAL module is used in the demo build
 * (gh-pages / demo-smoke), which this never touches. No test exercises View
 * Transitions behaviour (jsdom has no `document.startViewTransition`), so the
 * feature-detect returning `false` is the faithful jsdom posture.
 */
export const supportsViewTransitions = (): boolean => false;

export const startViewTransition = (
    update: () => void | Promise<void>,
    _options?: { types?: string[] },
): {
    finished: Promise<void>;
    ready: Promise<void>;
    updateCallbackDone: Promise<void>;
    skipTransition: () => void;
} => {
    // No View-Transitions engine under jsdom — run the mutation synchronously
    // (the faithful fallback `supportsViewTransitions() === false` already steers
    // the consumers down) and resolve the lifecycle promises.
    const done = Promise.resolve(update()).then(() => undefined);
    return {
        finished: done,
        ready: done,
        updateCallbackDone: done,
        skipTransition: () => {},
    };
};
