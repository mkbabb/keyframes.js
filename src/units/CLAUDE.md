# src/units/

Value types, unit normalization, and color space handling. Almost entirely re-export barrels over `@mkbabb/value.js`; the sole local logic is `normalize.ts`.

## Files

```
units/
├── index.ts             # Re-export: ValueUnit, FunctionValue, ValueArray, InterpolatedVar
├── constants.ts         # Re-export: unit sets (LENGTH_UNITS, COMPUTED_UNITS, etc.)
├── utils.ts             # Re-export: conversion fns, flatten/unflatten, CSS name utils
├── normalize.ts         # LOCAL: DOM-aware normalization + computed value resolution
└── color/
    ├── index.ts         # Re-export: Color, RGBColor, HSLColor, OKLABColor, etc. (15 classes)
    ├── constants.ts     # Re-export: ranges, white points, transform matrices, COLOR_NAMES
    ├── normalize.ts     # Re-export: normalizeColorUnits, normalizeColor, normalizeColorUnit, normalizeColorUnitComponent, colorUnit2
    ├── utils.ts         # Re-export: ~60 color space converters/utilities, interpolateHue, mixColors
    └── colorFilter.ts   # Re-export: rgb2ColorFilter, cssFiltersToString
```

## Local Logic: `normalize.ts`

The only file with local implementation. Three exports:

### `getComputedValue(value, target)` — memoized
Resolves computed CSS values from live DOM. Handles `var()` (reads `getComputedStyle`), `calc()` (evaluates subproperties including matrix transforms). Returns coalesced `ValueUnit`.

### `normalizeNumericUnits(a, b, inplace?)`
Converts two `ValueUnit`s to a common base: length → px, angle → deg, time → ms, resolution → dpi. Optional in-place mutation.

### `normalizeValueUnits(left, right, colorSpace?, hueMethod?)`
Top-level normalizer combining color and numeric handling. Returns `InterpolatedVar` with `start`, `stop`, `value`, and `computed` flag. Integrates `normalizeColorUnits()` for color interpolation setup.

Uses `WeakMap` for element-keyed memoization. Marks computed units (`vh`, `vw`, `calc`, `var`) for deferred DOM resolution at interpolation time.

## Re-export Surface

All from `@mkbabb/value.js`:

**Core types**: `ValueUnit`, `FunctionValue`, `ValueArray`, `InterpolatedVar`

**Unit sets**: `ABSOLUTE_LENGTH_UNITS`, `RELATIVE_LENGTH_UNITS`, `LENGTH_UNITS`, `TIME_UNITS`, `ANGLE_UNITS`, `PERCENTAGE_UNITS`, `RESOLUTION_UNITS`, `COMPUTED_UNITS`, `STRING_UNITS`, `COLOR_UNITS`, `UNITS`, `STYLE_NAMES`, `BLACKLISTED_COALESCE_UNITS`

**Types**: `MatrixValues`

**Conversions**: `convertToPixels`, `convertToMs`, `convertToDegrees`, `convertToDPI`, `convertAbsoluteUnitToPixels`, `convert2`

`convertToPixels` handles: absolute (`px`, `cm`, `mm`, `Q`, `in`, `pt`, `pc`), viewport (`vh`, `vw`, `vmin`, `vmax`), font-relative (`em`, `rem`, `ch`, `ex`), percentage (`%`), and container query (`cqw`, `cqh`, `cqi`, `cqb`, `cqmin`, `cqmax`) units. Container query units require a DOM element with a `container-type: inline-size|size` ancestor.

**Object utils**: `flattenObject`, `unflattenObject`, `unflattenObjectToString`, `isCSSStyleName`, `isColorUnit`, `unpackMatrixValues`

`flattenObject` treats `calc()` expressions as atomic — they are not decomposed into sub-expressions but preserved as `ValueUnit("expression", "calc")` to maintain key alignment during animation frame pairing.

**Color classes**: `Color`, `RGBColor`, `HSLColor`, `HSVColor`, `HWBColor`, `LABColor`, `LCHColor`, `OKLABColor`, `OKLCHColor`, `XYZColor`, `KelvinColor`, `LinearSRGBColor`, `DisplayP3Color`, `AdobeRGBColor`, `ProPhotoRGBColor`, `Rec2020Color`

**Color math** (~60 exports): `hex2rgb`, `rgb2hex`, `hsl2rgb`, `rgb2hsl`, `oklab2xyz`, `xyz2oklab`, `gamutMap`, `interpolateHue`, `mixColors`, `color2`, `CYLINDRICAL_HUE_COMPONENT`, etc. Type: `HueInterpolationMethod`.

## Dependencies

- `@mkbabb/value.js` — everything above
- `../parsing/keyframes` — `parseCSSKeyframesValue` (used in normalize.ts)
- `../parsing/units` — `parseCSSValueUnit` (used in normalize.ts)
- `../utils` — `memoize` (used in normalize.ts)
