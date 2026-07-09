# Migrating to keyframes.js 5.1.0 — the `animate()` excision + the granular-loader collapse

**Breaking removals in a minor.** 5.1.0 is additive at heart (the new
`@mkbabb/keyframes.js/engine` static subpath), but it also **removes four names**
from the published surface. Both removals had been shipped in 5.1.0 without a
migration doc — this document backfills that semver debt (the C-18 changelog
gate, `proof:changelog`, now enforces that every removed published-surface row is
documented here).

Neither removed name has a silent behavioural replacement: each maps to an
idiomatic construction that was already the supported path.

## What was removed

| Removed name | Kind | Replacement |
|--------------|------|-------------|
| `animate` | HEAVY front door | `new CSSKeyframesAnimation(...)` (or `await loadAnimationEngine()`) — construct + `.setTargets(...)` + `.play()` directly |
| `loadEngine` | dynamic accessor | `await loadAnimationEngine()` |
| `loadCompiler` | dynamic accessor | `await loadAnimationEngine()` |
| `loadIngest` | dynamic accessor | `await loadAnimationEngine()` |

## `animate()` removed — construct directly

The single-call `animate(target, input, opts?)` front door is no longer exported
(it was dead-by-disuse: **zero call sites**, excluded from every published
surface). The idiomatic surface is the four-step lifecycle it wrapped —
`new CSSKeyframesAnimation` → `from*` → `setTargets` → `play`:

```diff
- import { loadAnimationEngine } from "@mkbabb/keyframes.js";
- const { animate } = await loadAnimationEngine();
- animate(box, `from { opacity: 0 } to { opacity: 1 }`, { duration: 400 });
+ import { CSSKeyframesAnimation } from "@mkbabb/keyframes.js/engine";
+ const anim = new CSSKeyframesAnimation({ duration: 400 })
+     .fromString(`from { opacity: 0 } to { opacity: 1 }`);
+ anim.setTargets(box);
+ anim.play();
```

The same construction covers every shape `animate()` used to dispatch on:

- a keyframe map → `.fromKeyframes({ "0%": {...}, "100%": {...} })`
- a vars array → `.fromVars([{ ... }, { ... }])`
- a MotionPath spec (`{ path }`) → `fromMotionPath(target, { path, ... })`
- an `AnimationGroup` / `Sequence` → call its own `.play()` (it owns its loop)

The heavy classes are reached statically via `@mkbabb/keyframes.js/engine`, or
dynamically via `await loadAnimationEngine()`. The `.` barrel's LIGHT surface is
unchanged.

## The granular load accessors (`loadEngine` / `loadCompiler` / `loadIngest`) collapsed

The separate `loadEngine` / `loadCompiler` / `loadIngest` accessors — which each
resolved a partial slice of the heavy chunk — are removed in favour of the single
`loadAnimationEngine()` (with `warmEngine()` for idle prefetch). They had **zero
real call sites**; the full loader is memoized, so the collapse costs no extra
weight in practice.

```diff
- const { compileToCSS } = await loadCompiler();
- const { fromStyleSheets } = await loadIngest();
- const { CSSKeyframesAnimation } = await loadEngine();
+ const { compileToCSS, fromStyleSheets, CSSKeyframesAnimation } =
+     await loadAnimationEngine();
```

`loadAnimationEngine()` returns the FULL heavy surface (39 keys); a light-only
consumer that never awaits it still pulls zero value.js into its graph (the
static/dynamic boundary is intact, `proof:boundary`).
