/**
 * resolve/spring-css.ts — the CSS `spring()` → kf-Easing helpers (S.B4 — carved
 * off the `resolve/index.ts` barrel beside the core recursion so the barrel is a
 * pure re-export surface; a02 F3/F4).
 *
 * `spring()` is genuinely an EASING, not a value-rewrite arm, so it lives at the
 * timing-function seam (NOT in `./core`'s `resolveNode`, which leaves `spring()`
 * intact as a keyframe value). kf OWNS validation + defaults-fill: value.js
 * parses `spring(...)` via its GENERIC function producer (no validation, no
 * defaults), so the algebra + the `1/100/10/0` fill live HERE.
 *
 * HEAVY (value.js `FunctionValue`/`ValueUnit`) — reached only behind
 * `loadAnimationEngine()`.
 */
import { FunctionValue, ValueUnit } from "@mkbabb/value.js";
import { springTimingFunction } from "../physics/spring";
import type { Easing } from "../constants";

/** CSS spring physics (`mass`, `stiffness`, `damping`, `velocity`) → the kf
 * `(response, dampingFraction)` surface. kf OWNS validation + defaults-fill:
 * value.js parses `spring(...)` via its GENERIC function producer (no validation,
 * no defaults), so the algebra + the `1/100/10/0` fill live HERE. */
export interface SpringCssOptions {
    response: number;
    dampingFraction: number;
    initialVelocity: number;
}

/** The CSS `spring()` defaults (WebKit-canonical: `mass 1 / stiffness 100 /
 * damping 10 / velocity 0`), filled by kf because the generic value.js producer
 * fills none. */
const SPRING_DEFAULTS = { mass: 1, stiffness: 100, damping: 10, velocity: 0 };

/**
 * `spring(mass stiffness damping velocity)` → `{ response, dampingFraction,
 * initialVelocity }` by the standard 2nd-order-ODE algebra kf already uses
 * (`spring.ts`: `x'' + 2ζω₀x' + ω₀²x = ω₀²·target`, `ω₀ = 2π/response`,
 * `ζ = dampingFraction`):
 *
 *   ω₀ = √(k/m)  ⟹  response = 2π/ω₀ = 2π·√(m/k)
 *   ζ  = c / (2·√(k·m))  =  dampingFraction
 *   v₀ passes straight through to `SpringProgress.initialVelocity`.
 *
 * kf OWNS validation + the defaults-fill: omitted positionals take
 * `SPRING_DEFAULTS`; `mass > 0` and `stiffness > 0` are required (a non-positive
 * value falls back to the default rather than producing a NaN curve), `damping ≥
 * 0`. The settle horizon is fixed at the kf default (`response·4`) — a deliberate
 * self-consistent choice, NOT WebKit native-parity (CSS `spring()` carries no
 * duration, so native parity is unattainable as a gate assertion).
 */
export const springCssToOptions = (
    args: readonly number[],
): SpringCssOptions => {
    const pos = (i: number, fallback: number): number => {
        const v = args[i];
        return typeof v === "number" && Number.isFinite(v) ? v : fallback;
    };
    let mass = pos(0, SPRING_DEFAULTS.mass);
    let stiffness = pos(1, SPRING_DEFAULTS.stiffness);
    let damping = pos(2, SPRING_DEFAULTS.damping);
    const velocity = pos(3, SPRING_DEFAULTS.velocity);

    // Defaults-fill on the physically-invalid edges (kf-owned — the generic
    // value.js producer provides none). A non-positive mass/stiffness would make
    // ω₀ NaN/∞; clamp them to the canonical defaults rather than emit a dead curve.
    if (!(mass > 0)) mass = SPRING_DEFAULTS.mass;
    if (!(stiffness > 0)) stiffness = SPRING_DEFAULTS.stiffness;
    if (!(damping >= 0)) damping = SPRING_DEFAULTS.damping;

    const response = 2 * Math.PI * Math.sqrt(mass / stiffness);
    const dampingFraction = damping / (2 * Math.sqrt(stiffness * mass));
    return { response, dampingFraction, initialVelocity: velocity };
};

/**
 * Resolve a parsed `spring(...)` `FunctionValue` to a typed {@link Easing} via
 * `springCssToOptions` → the existing `springTimingFunction` (kf already owns the
 * physics + the `linear()` twin). A `spring()` is genuinely an EASING, so the
 * natural home is timing-function resolution.
 */
export const resolveSpringTiming = (fn: FunctionValue): Easing => {
    const args = fn.values.map((v) =>
        v instanceof ValueUnit ? Number(v.value) : NaN,
    );
    const { response, dampingFraction } = springCssToOptions(args);
    return springTimingFunction({ response, dampingFraction });
};
