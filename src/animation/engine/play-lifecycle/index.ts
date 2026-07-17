/**
 * engine/play-lifecycle/ — the STANDALONE-play lifecycle machine (the play/
 * advance/transport FREE FUNCTIONS), lifted off the `KeyframesAnimation`
 * god-object (Q.WF1 / R.W2 — the engine carve; renamed from `engine/playback.ts`
 * at S.B4). V.W5 LT-07 carved the 24 free functions of the former flat
 * `play-lifecycle.ts` into the four concern legs under the ONE library grammar
 * (kind-named siblings + pure barrel — no single primary member):
 *   events.ts      — dispatchAnimationEvent / shouldReverse / reverse
 *   frame.ts       — onStart / onEnd / advanceTo / playFrame / renderFrame
 *   strategies.ts  — playRAF / playViaWAAPI / playReducedMotion /
 *                    snapToReducedMotion / play
 *   transport.ts   — pause / resume / toggle / stop / playing / effectiveT /
 *                    settle / reset (+ the cancelWAAPI/resolvePlay teardown leaves)
 *
 * A colocated INTERNAL engine module: statically imported by `engine/animation.ts`
 * (`import * as playback`) + `engine/option-setters.ts` (`shouldReverse`), never
 * re-exported beyond the engine barrel, riding the SAME heavy chunk behind
 * `loadAnimationEngine()`.
 *
 * This PURE barrel is the module's single surface. It re-exports exactly the
 * external-consumer surface (what `engine/animation.ts` reaches via `playback.*`
 * plus `shouldReverse`). The module-internal cross-file exports —
 * `renderFrame`/`cancelWAAPI`/`snapToReducedMotion` (DD-3) and the file-local /
 * teardown members `resolvePlay`/`playRAF`/`playViaWAAPI`/`playReducedMotion` —
 * KEEP their `export` (for the cross-file wiring) but are EXCLUDED from this
 * barrel; the LT-13 encapsulation sweep (V.W6) recomputes their demotions on the
 * settled tree.
 */
export { dispatchAnimationEvent, shouldReverse, reverse } from "./events";
export { onStart, onEnd, advanceTo, playFrame } from "./frame";
export { play } from "./strategies";
export {
    pause,
    resume,
    toggle,
    stop,
    playing,
    effectiveT,
    settle,
    reset,
} from "./transport";
