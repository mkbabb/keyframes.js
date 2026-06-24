# Migrating to keyframes.js 5.0.0 — the `@deprecated` alias drop

**Breaking change.** 5.0.0 removes the three backward-compat `@deprecated`
aliases that the PKG-3 rename (4.x, L.W8 §S4) left on the published surface. The
canonical names shipped cleanly in 4.x; 5.0.0 is the no-legacy terminal that
drops the aliases.

## Why

The PKG-3 rename renamed the engine class `Animation` → `KeyframesAnimation` and
the scroll timeline `ScrollTimeline` → `KeyframesScrollTimeline` /
`ScrollTimelineOptions` → `KeyframesScrollTimelineOptions`. The old names
**collided with ambient DOM/Houdini globals** (`globalThis.Animation` is the
WAAPI animation; `globalThis.ScrollTimeline` is the Houdini native scroll
timeline; `ScrollTimelineOptions` is in `lib.dom`). Those collisions leaked
numeric-suffixed alias types (`Animation_2`, `ScrollTimeline_2`) into IDE hover
text. The canonical `Keyframes*` names have no ambient collision. The aliases
were kept as a one-major transition aid; 5.0.0 drops them.

A consumer's `import { Animation }` / `import { ScrollTimeline }` value import —
or `import type { Animation }` annotation — stops resolving. This is a genuine
breaking change; it is the only breaking cut in 5.0.0.

## What to change

| Old name (dropped) | New name (canonical) | Kind | Find / replace |
|--------------------|----------------------|------|----------------|
| `Animation` | `KeyframesAnimation` | runtime value + type | `Animation` → `KeyframesAnimation` |
| `ScrollTimeline` | `KeyframesScrollTimeline` | runtime value + type | `ScrollTimeline` → `KeyframesScrollTimeline` |
| `ScrollTimelineOptions` | `KeyframesScrollTimelineOptions` | type | `ScrollTimelineOptions` → `KeyframesScrollTimelineOptions` |

### `Animation` → `KeyframesAnimation`

```diff
- import type { Animation } from "@mkbabb/keyframes.js";
+ import type { KeyframesAnimation } from "@mkbabb/keyframes.js";

  // the runtime constructor is reached via loadAnimationEngine():
- const { Animation } = await loadAnimationEngine();
+ const { KeyframesAnimation } = await loadAnimationEngine();
```

`new Animation()`, `instanceof Animation`, and `Animation<V>` annotations all
become `KeyframesAnimation`. The runtime constructor is identical — only the name
changes.

### `ScrollTimeline` → `KeyframesScrollTimeline`

```diff
- import { ScrollTimeline } from "@mkbabb/keyframes.js";
+ import { KeyframesScrollTimeline } from "@mkbabb/keyframes.js";

- const timeline = new ScrollTimeline({ threshold: 0.35, easing });
+ const timeline = new KeyframesScrollTimeline({ threshold: 0.35, easing });
```

### `ScrollTimelineOptions` → `KeyframesScrollTimelineOptions`

```diff
- import type { ScrollTimelineOptions } from "@mkbabb/keyframes.js";
+ import type { KeyframesScrollTimelineOptions } from "@mkbabb/keyframes.js";
```

## ⚠️ Disambiguation — `globalThis.ScrollTimeline` is UNRELATED

`ScrollTimeline` is overloaded: the keyframes.js JS class **and** the ambient
platform **`globalThis.ScrollTimeline`** (the Houdini native scroll-driven
timeline). This rename touches **only** the keyframes.js class. A blanket
find/replace of `ScrollTimeline` → `KeyframesScrollTimeline` would corrupt code
that legitimately references the platform global — e.g. `delete
globalThis.ScrollTimeline`, `new globalThis.ScrollTimeline(...)`, native-bridge
feature detection. Rename **only** imports of the keyframes.js class
(`from "@mkbabb/keyframes.js"`); never rewrite `globalThis.ScrollTimeline` or any
ambient/native reference.

Likewise `globalThis.Animation` (the WAAPI animation) is unrelated to the
`Animation` → `KeyframesAnimation` rename — do not touch it.
