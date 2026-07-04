/**
 * Vitest-only stub for `@mkbabb/glass-ui/motion-core`.
 *
 * The library gate (ci.yml `gates` job) is glass-ui-FREE by design (inv β) — the
 * optional `file:../glass-ui` link dangled, so a demo composable that imports
 * glass-ui (`demo/app/transition/useSceneSwap.ts` / `useSceneTransition.ts` →
 * `supportsViewTransitions` / `startViewTransition`) cannot RESOLVE there, which
 * reds the demo-encapsulation tests transitively pulled into the test pool.
 * vitest runs ONLY in that gate (demo-smoke builds the demo but runs no vitest),
 * so aliasing the glass-ui motion-core subpath to this shim lets the encapsulation
 * tests transform glass-ui-free. The REAL module is used in the demo build
 * (gh-pages / demo-smoke), which this never touches. No test exercises View
 * Transitions behaviour (jsdom has no `document.startViewTransition`), so the
 * feature-detect returning `false` is the faithful jsdom posture.
 *
 * G.W12.S3 — the stub FOLLOWS the real helper, never leads it. Each export is
 * typed against the published `@mkbabb/glass-ui/motion-core` (resolved from the
 * real `^3.3.0` typings, NOT the vitest runtime alias), so a drift between the
 * stub and the real contract reds the type check. The former drift — a phantom
 * `_options?: { types }` param (anticipating the H-1/GG-3 `{types}` helper that
 * NEVER shipped) and the NATIVE `ViewTransition` return shape
 * (`ready`/`updateCallbackDone`/`skipTransition`) instead of glass-ui's real
 * `ViewTransitionResult` (`{ finished, transitioned }`) — is stripped. If GG-3
 * ever lands the `{types}` overload, this stub follows it in one motion.
 */
import type {
    startViewTransition as RealStartViewTransition,
    supportsViewTransitions as RealSupportsViewTransitions,
} from "@mkbabb/glass-ui/motion-core";

export const supportsViewTransitions: typeof RealSupportsViewTransitions =
    () => false;

export const startViewTransition: typeof RealStartViewTransition = (mutate) => {
    // No View-Transitions engine under jsdom — run the mutation synchronously
    // (the faithful fallback `supportsViewTransitions() === false` already steers
    // the consumers down) and resolve the lifecycle promise. The return mirrors
    // glass-ui's real ViewTransitionResult: `{ finished, transitioned }`, with
    // `transitioned: false` (the instant fallback ran, not the native API).
    const finished = Promise.resolve(mutate()).then(() => undefined);
    return { finished, transitioned: false };
};
