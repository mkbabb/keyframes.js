# keyframes.js

CSS animation library: keyframe parsing, animation engine, preset animations.

## Build
npm run build        # library → dist/keyframes.js + keyframes.cjs + keyframes.d.ts
npm run gh-pages     # demo → dist/
npm run dev          # dev server on :8080

## Test
npm test             # vitest (jsdom)

## Structure
src/animation/       # Animation class, AnimationGroup, presets, interpolation
src/parsing/         # CSS @keyframes parser (parse-that), formatting
src/units/           # re-export barrels from @mkbabb/value.js
src/easing.ts        # re-export barrel from @mkbabb/value.js
src/math.ts          # re-export barrel from @mkbabb/value.js
demo/                # Vue 3 animation demos (cube, simple, square, amiga, balls, boxes)

## Dependencies
- @mkbabb/value.js — ValueUnit, Color, math, parsing, normalization
- @mkbabb/parse-that — parser combinators for @keyframes syntax

## Conventions
- TypeScript strict:true, verbatimModuleSyntax:true
- moduleResolution:bundler, target:ES2022
- import type for type-only imports
- Shared code lives in value.js; keyframes.js re-exports via thin barrels
