/**
 * orchestration/view-transition/ — the LIGHT View-Transitions dispatch (S.F1
 * VT-a; p09).
 *
 * `viewTransition(mutate, opts)` mutates the DOM behind a native View Transition
 * where the platform ships one, and falls back to a `flipShared` shared-element
 * morph (or a bare immediate mutation) everywhere else — behind ONE normalized
 * {@link ViewTransitionHandle} whose `backend` is queryable. LIGHT (value.js-
 * free): composes `flipShared` + the ONE `withReducedMotion` gate; feature-
 * detects `startViewTransition`. The HEAVY companion `compileToViewTransition`
 * (`compile/view-transition.ts`) rides `loadAnimationEngine()`. The barrel is the
 * zone's single public surface (what `proof:no-flat-siblings` asserts).
 */
export { viewTransition } from "./view-transition";
export type {
    ViewTransitionOptions,
    ViewTransitionHandle,
    ViewTransitionMutate,
} from "./view-transition";
