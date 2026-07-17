import type {
    AnimationFrame,
    Vars,
} from "../../constants";
import type { InterpSlot, NumericInterpSlot } from "./interp-slot";
import type {
    AuthoredSink,
    CompiledVarMap,
} from "../value-ast";

/** Internal numeric fold storage built once for a compiled frame. */
export interface NumericFoldPlan {
    numeric: NumericInterpSlot[];
    from: Float64Array;
    to: Float64Array;
    out: Float64Array;
    residual: InterpSlot[];
}

/**
 * Engine-owned extension of the consumer-observable frame shape.
 *
 * This type is deliberately absent from package barrels: interpolation slots,
 * sinks, and numeric plans are mutable kernel state, not author data.
 */
export interface CompiledAnimationFrame<V extends Vars = Vars>
    extends AnimationFrame<V> {
    interpVars: CompiledVarMap;
    allInterpVars: InterpSlot[];
    _numericPlan?: NumericFoldPlan;
    _sink: AuthoredSink<V>;
}
