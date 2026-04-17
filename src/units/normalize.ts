// Single source of truth lives in @mkbabb/value.js. This file is a
// thin re-export so consumers that imported from `keyframes.js/units`
// continue to work; new code should import directly from value.js.

export {
    getComputedValue,
    normalizeNumericUnits,
    normalizeValueUnits,
    type NormalizeValueUnitsOptions,
} from "@mkbabb/value.js";
