// ─────────────────────────────────────────────────────────────────────────────
// THE DEMO'S HEAVY-ENGINE ACCESSOR (L.W8 S1 — the ED-3 dogfood inversion).
//
// The demo consumes the PUBLISHED kf barrel (`@mkbabb/keyframes.js`), not the
// deep `@src/animation/*` source paths. The LIGHT surface (SpringProgress,
// RAFPlayback, stagger, decay, …) is statically imported from the barrel; the
// HEAVY surface (CSSKeyframesAnimation / AnimationGroup / presets / the compile
// + serialization helpers) is value.js-bearing and is reached ONLY through the
// barrel's `loadAnimationEngine()` dynamic accessor — the one place value.js
// enters the graph.
//
// Most demo sites await `loadAnimationEngine()` directly at their point of need
// (a click handler, an onMounted, a composable init). This module is the ONE
// extra ergonomic seam for the SCENE-MACHINE hot path: the reconcile constructs
// an empty placeholder `AnimationGroup` synchronously on every scene switch, and
// threading `async` through that reconcile (and the non-null prop contracts it
// feeds: EditorShell → AnimationControlsGroup) would ripple nullability through
// the whole control suite. Instead `main.ts` WARMS the engine before the app
// mounts (`await warmKfEngine()`), so by the time any scene switch fires the
// resolved surface is in hand and `kfEngine()` returns it synchronously.
//
// This is the dogfood: the demo boots on the same `loadAnimationEngine()` chunk
// a `npm i` consumer reaches — the heavy graph still rides the DYNAMIC boundary
// (proof:boundary stays green; value.js never lands on the LIGHT static barrel),
// it is simply awaited once at boot rather than lazily per interaction.

import { loadAnimationEngine } from "@mkbabb/keyframes.js";
import type { AnimationEngine } from "@mkbabb/keyframes.js";

let resolved: AnimationEngine | null = null;
let inflight: Promise<AnimationEngine> | null = null;

/**
 * Resolve (once) the heavy engine surface and cache it for synchronous reads.
 * Idempotent — shares the barrel's memoized `loadAnimationEngine()` promise, so
 * a later per-site `loadAnimationEngine()` reuses the SAME in-flight chunk.
 */
export const warmKfEngine = (): Promise<AnimationEngine> =>
    (inflight ??= loadAnimationEngine().then((engine) => {
        resolved = engine;
        return engine;
    }));

/**
 * The resolved heavy engine surface — SYNCHRONOUS. Throws if read before
 * `warmKfEngine()` has resolved (a programmer error: `main.ts` awaits the warm
 * before `app.mount()`, so every scene-machine read is after the resolve).
 */
export const kfEngine = (): AnimationEngine => {
    if (!resolved) {
        throw new Error(
            "kfEngine() read before warmKfEngine() resolved — await warmKfEngine() before app.mount() (demo/app/main.ts).",
        );
    }
    return resolved;
};
