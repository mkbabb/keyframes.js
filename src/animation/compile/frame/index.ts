/**
 * compile/frame/ — the frame-compilation kernel (V.W5 LT-04).
 *
 * The producer module for compiled animation frames: the `FrameCompiler` class
 * (template → compiled `AnimationFrame[]` with the numeric SoA plan), the shared
 * `CompiledAnimationFrame`/`NumericFoldPlan` frame contract (KEEP name — an
 * 8-consumer contract), and the `InterpSlot` interpolation-slot family. This
 * PURE barrel is the module's single cross-zone surface; consumers reach the
 * frame contract + slot binding through it (`../compile/frame`), decoupled from
 * the internal file layout. `numeric-plan.ts` is deliberately NOT re-exported —
 * it is a module-internal single-consumer fold (`compiler.ts` alone).
 */
export type { CompiledAnimationFrame, NumericFoldPlan } from "./compiled-frame";
export type { InterpSlot, NumericInterpSlot } from "./interp-slot";
export { bindInterpSlotTarget, interpolateSlot } from "./interp-slot";
export { FrameCompiler } from "./compiler";
