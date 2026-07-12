import { EMPTY_LANES, SpringVectorLanes } from "./solver/vector";

/**
 * The public vector facet of SpringProgress, kept outside the scalar tracker.
 * The class remains the owner of its spring parameters; these functions own
 * only lane-buffer lifecycle and dispatch, preserving the LIGHT surface while
 * keeping the scalar class below its decomposition ceiling.
 */
export function armVectorLanes(
    lanes: SpringVectorLanes | null,
    targets: Float64Array,
): SpringVectorLanes {
    const next = lanes ?? new SpringVectorLanes();
    next.setTargets(targets);
    return next;
}

export function vectorValues(lanes: SpringVectorLanes | null): Float64Array {
    return lanes?.values ?? EMPTY_LANES;
}

export function vectorVelocities(
    lanes: SpringVectorLanes | null,
): Float64Array {
    return lanes?.velocities ?? EMPTY_LANES;
}

export function tickVectorLanes(
    lanes: SpringVectorLanes | null,
    dt: number,
    omega: number,
    zeta: number,
    omegaD: number,
): Float64Array {
    if (lanes === null || dt <= 0) return EMPTY_LANES;
    return lanes.tick(dt, omega, zeta, omegaD);
}
