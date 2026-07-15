// S.B1 — the constants seam, structural (SPEC-v3 §3 S.B1; fold row 34).
//
// The RUNTIME half of the former monolithic `constants.ts`: every runtime value
// the library ships — the two value.js-bearing consts (`COLOR_SPACES`,
// `defaultOptions`) plus the value.js-free arrays/defaults (`DIRECTIONS`,
// `FILL_MODES`, `HUE_METHODS`, `NOOP_TRANSFORM`, `defaultLayerConfig`). This
// module carries a genuine `@mkbabb/value.js` runtime edge (`COLOR_SPACE_RANGES`,
// `easeInOutCubic`), so ONLY the HEAVY surface imports it (directly or through
// the back-compat barrel). LIGHT importers take TYPES from the sibling
// `constants/types.ts`, never this file. The `import type` edge back to `./types`
// (the option/config/transform TYPES the values are annotated with) is a
// type-only cycle — erased at build, no runtime edge.
import { COLOR_SPACE_RANGES } from "@mkbabb/value.js/color";
import { easeInOutCubic } from "@mkbabb/value.js/easing";
import type { ColorSpace, HueInterpolationMethod } from "@mkbabb/value.js/color";
import type {
    AnimationLayerConfig,
    AnimationOptions,
    TransformFunction,
} from "./types";

export const DIRECTIONS = [
    "normal",
    "reverse",
    "alternate",
    "alternate-reverse",
] as const;

export const FILL_MODES = ["none", "forwards", "backwards", "both"] as const;

/**
 * The valid `colorSpace` values — the runtime key-set of value.js's
 * `COLOR_SPACE_RANGES`, the SAME source the `ColorSpace` type derives from
 * (`keyof typeof COLOR_SPACE_RANGES`). Drawing it from the registry keeps the
 * fail-explicit setter's accept-list from drifting from the type.
 */
export const COLOR_SPACES = Object.keys(COLOR_SPACE_RANGES) as ColorSpace[];

/**
 * The valid `hueMethod` values — the closed CSS Color 4 union
 * `HueInterpolationMethod`. value.js exposes this only as a type (no runtime
 * array), so the spec's four members are pinned here, typed against the union
 * so a drift fails to compile.
 */
export const HUE_METHODS = [
    "shorter",
    "longer",
    "increasing",
    "decreasing",
] as const satisfies readonly HueInterpolationMethod[];

/**
 * THE total no-op transform default (I.W0 S3, hoisted shared in J.W1 S2).
 * A single shared reference so a consumer can ask "is this still the
 * default?" by identity (`transform === NOOP_TRANSFORM`) instead of a lying
 * `transform == null` on a field whose type claims it is always set. Two
 * seams carry it: `AnimationGroup.transform` (a childless group composites a
 * harmless empty frame) and `FrameCompiler.createFrame` (a transform-free
 * template — a legitimate numeric/CSS-var animation — compiles to a no-op,
 * never the `templateFrames[undefined]!.transform` TypeError).
 */
export const NOOP_TRANSFORM: TransformFunction<any> = () => {};

export const defaultOptions: AnimationOptions = {
    duration: 1000,
    delay: 0,
    iterationCount: 1,
    direction: "normal",
    fillMode: "forwards",
    timingFunction: { fn: easeInOutCubic },
    useWAAPI: true,
    respectReducedMotion: false,
    colorSpace: "oklab",
};

export const defaultLayerConfig: AnimationLayerConfig = {
    zIndex: 0,
    weight: 1,
    blendMode: "replace",
    enabled: true,
};
