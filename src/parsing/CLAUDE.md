# src/parsing/

CSS @keyframes parsing and serialization. Grammar defined via `@mkbabb/parse-that` combinators; value parsing delegated to `@mkbabb/value.js`.

## Files

```
parsing/
├── keyframes.ts     # @keyframes grammar: rules, selectors, bodies, values
├── format.ts        # Animation → CSS string serialization (uses Prettier)
├── units.ts         # Re-export: CSSColor, CSSValueUnit, parsers from value.js
├── utils.ts         # Re-export: parser combinators (istring, tryParse, etc.)
└── index.ts         # Barrel
```

## Parsing (`keyframes.ts`)

### Grammar Hierarchy
```
Keyframes
  ├── Rule         @keyframes <name>   [optional]
  └── Keyframe[]
       ├── TimePercentages   0%, 50%, 100%, from, to
       └── Body
            └── Variables[]
                 ├── name    CSS property
                 └── Values  CSSValueUnit | Function | JSON | string
```

### Exported Parsers
- `CSSKeyframes` — parser object: `Value`, `Values`, `FunctionArgs`, `Function`, `JSON`, `Body`, `Rule`, `Keyframe`, `Keyframes`, `TimePercentage`, `TimePercentages`, `Variables`
- `CSSAnimationKeyframes` — animation-specific: parses CSS classes with `animation-*` properties alongside keyframes

### Exported Functions (all memoized)
- `parseCSSKeyframes(css)` → `Map<string, Vars>` — parse @keyframes rule
- `parseCSSAnimationKeyframes(css)` → `{keyframes, options?, values?}`
- `parseCSSKeyframesValue(value)` → `ValueUnit | FunctionValue`
- `parseCSSPercent(input)` → `number`
- `parseCSSTime(input)` → `number` (milliseconds)
- `reverseCSSTime(ms)` → `string` (s if >=5000, else ms)
- `reverseCSSIterationCount(n)` → `string` ("infinite" or number)

### Input Sanitization
Applied before parsing: strips `/* comments */` and `!important`.

## Formatting (`format.ts`)

- `formatCSS(css, printWidth?)` — Prettier with SCSS/PostCSS (default 80-char)
- `CSSKeyframesToString(animation, name?, printWidth?)` — full @keyframes + options class
- `CSSKeyframesToStrings(animation, name?, printWidth?)` — per-frame formatting, returns `Promise<string[]>`
- `CSSKeyframeToString(frame)` — single frame body
- `animationOptionsToString(options, name?)` — `.name { animation-*: ...; }`
- `normalizeCSSKeyframeString(keyframe)` — wraps bare keyframes in @keyframes header
- `formatCSSKeyframeString(keyframe)` — strips @keyframes header/footer from a keyframe string
- `parseCSSAnimationOrKeyframes(css)` — tries animation parse, falls back to keyframes-only

Deduplicates identical frames (comma-separated selectors). Cleans Prettier artifacts.

## Re-export Barrels

**`units.ts`**: `CSSColor`, `parseCSSColor`, `CSSValueUnit`, `parseCSSValueUnit` — from `@mkbabb/value.js`

**`utils.ts`**: `istring`, `identifier`, `none`, `integer`, `number`, `succeed`, `fail`, `tryParse`, `parseResult` — from `@mkbabb/value.js`

## Dependencies

- `@mkbabb/parse-that` — `Parser`, `all`, `any`, `regex`, `string`, `whitespace`
- `@mkbabb/value.js` — `CSSFunction`, `ValueUnit`, `FunctionValue`, parser combinators
- `prettier` + `prettier/plugins/postcss` — CSS formatting (format.ts only)
- `../easing` — `timingFunctions` (reverse lookup in format.ts)
- `../utils` — `camelCaseToHyphen`, `hyphenToCamelCase`, `memoize`
- `../units` — `ValueUnit`, `FunctionValue`, `ValueArray`, `unflattenObjectToString`
