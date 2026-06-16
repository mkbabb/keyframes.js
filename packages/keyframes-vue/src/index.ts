/**
 * @mkbabb/keyframes-vue — a thin Vue 3 adapter over @mkbabb/keyframes.js.
 *
 * Two exports, both on-brand:
 *   - `Keyframes`        the declarative `<Keyframes :css>` component — the one a
 *                        Motion/vueuse-motion adapter CANNOT write (no other
 *                        engine parses author CSS @keyframes as its source).
 *   - `useKfAnimation`   the ~40-line settle-and-pause kernel (the hard-won
 *                        "gate on inputs not outputs" deadlock-safe discipline).
 *
 * The adapter consumes the PUBLISHED `@mkbabb/keyframes.js` barrel (the light
 * tier statically, `loadAnimationEngine()` for the heavy `CSSKeyframesAnimation`)
 * — it does NOT vendor or `file:`-link the core (the acyclic-spine invariant
 * applied to kf's own sibling). The Vue peer lives HERE; the core library never.
 */
export { Keyframes, default as KeyframesDefault } from "./Keyframes";
export { useKfAnimation } from "./useKfAnimation";
export type { KfAnimationState } from "./useKfAnimation";
