# Migrating from 5.3.5 to 6.0.0

Version 6 is a clean break onto Value 4's structural CSS model. It provides no
aliases, compatibility shims, dual paths, or formatting fallback.

## Timing functions

`getTimingFunction` is removed from `@mkbabb/keyframes.js/engine` and from the
object returned by `loadAnimationEngine()`. Resolve a name or CSS timing-function
literal through the existing public Keyframes boundary instead:

```ts
import { resolveEasing } from "@mkbabb/keyframes.js";

const easing = await resolveEasing("cubic-bezier(0.2, 0, 0, 1)");
const fn = easing.fn;
```

Animation options still accept a timing-function string directly. Value-level
consumers should import canonical easing constructors from
`@mkbabb/value.js/easing` and CSS timing syntax from `@mkbabb/value.js/css`.

## Group composition

`BlendMode`, `AnimationLayerConfig.blendMode`, and the `"weighted"` operation
are removed. Use the single CSS composition axis and its orthogonal weight:

| 5.3.5 layer | 6.0.0 layer |
| --- | --- |
| `{ blendMode: "replace" }` | `{ op: "replace" }` |
| `{ blendMode: "add" }` | `{ op: "add" }` |
| `{ blendMode: "weighted", weight: 0.4 }` | `{ op: "replace", weight: 0.4 }` |

`op` is required on a complete `AnimationLayerConfig`; partial layer inputs may
omit it and receive `defaultLayerConfig.op`, which is `"replace"`.

## Structural animation values

Value 3's `ValueUnit`/`InterpolatedVar` carrier model is no longer part of the
Keyframes declarations. `TemplateAnimationFrame.start` and
`AnimationFrame.start` are Value 4 `KeyframeSelector` values. Parse authored
selectors with `parseKeyframeSelector` from `@mkbabb/value.js/css`; author CSS
values with the types from `@mkbabb/value.js/value`.

`InterpolatedVar` has no replacement export. Compiler-carrier fields on
`AnimationFrame` (`interpVars`, `allInterpVars`, `_numericPlan`, `plainVars`, and
`_plainProj`) are removed rather than aliased. Consumers should read authored
`vars` or receive authored values through their animation transform callback.

The color option now uses Value 4's `SpaceId` from
`@mkbabb/value.js/color`.

## CSS compilation output

`printWidth` is removed from `CompileOptions`, `ViewTransitionCompileOptions`,
and `EntryCompileOptions`. Keyframes emits deterministic library CSS. Presentation
formatting belongs to the consuming application; omit `printWidth` rather than
replacing it with another library option.
