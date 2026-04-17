import type { Vars } from "./constants";
import { transformTargetsStyle } from "./utils";

/**
 * Maps interpolated values onto targets each frame. The default
 * renderer writes inline styles via `transformTargetsStyle`; custom
 * renderers (e.g. canvas, WebGL) replace it by passing a custom
 * `transform` to the Animation constructor.
 */
export type Renderer<V extends Vars> = (vars: V, t: number) => void;

/**
 * Symbol used to tag the default DOM-style renderer. WAAPI eligibility
 * inspects this marker to detect whether the user supplied a custom
 * transform — function-identity comparison is fragile under bundling
 * and re-imports, so we use a globally-shared Symbol.
 */
export const DEFAULT_RENDERER = Symbol.for("keyframes.defaultRenderer");

/**
 * Create the default DOM-style renderer for `targets`. Tagged with
 * `DEFAULT_RENDERER` so the WAAPI driver can recognise it.
 */
export const createDOMStyleRenderer = <V extends Vars>(
    targets: HTMLElement[],
): Renderer<V> => {
    const fn: Renderer<V> = (vars, _t) =>
        transformTargetsStyle(vars, targets);
    (fn as any)[DEFAULT_RENDERER] = true;
    return fn;
};

/** Type guard: is this the default DOM-style renderer? */
export const isDefaultRenderer = (fn: unknown): boolean =>
    typeof fn === "function" && (fn as any)[DEFAULT_RENDERER] === true;
