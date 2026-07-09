# keyframes.js

CSS keyframe animations for anything in JavaScript. Parse `@keyframes`, animate any object or DOM element.

## Build

```sh
npm run build           # library (ESM) → dist/keyframes.js + dist/keyframes.d.ts
npm run gh-pages        # demo (demo/app multi-scene SPA) → dist/gh-pages/
npm run dev             # vite dev server — demo/app SPA (HMR)
npm run check           # tsc --noEmit (repo); check:lib for the library tsconfig
npm test                # vitest (jsdom)
npm run bench           # vitest bench
npm run proof:all       # full proof:* gate roster (correctness + hygiene)
```

## Project Tree

The library is partitioned into eleven cohesive zone directories (R.W1), each with
an `index.ts` barrel — the LIGHT (value.js-free) zones (`physics/`,
`orchestration/`) and the HEAVY (value.js-bearing) zones (`engine/`, `group/`,
`compile/`, `resolve/`, `ingest/`, `scroll/`, `waapi/`) + `presets/` + `svg/`.
`internal/` is the value.js-free leaf tier, NOT a zone (C-5: no barrel, excluded from
`ZONE_DIRS` by design). The two package "in"s are the barrel `index.ts` (the LIGHT
`.` surface + the dynamic `loadAnimationEngine()`) with its dynamic half
`load-engine.ts`, and `public.ts` (the static heavy mirror behind the `./engine`
subpath). See `src/animation/CLAUDE.md` for the authoritative per-file inventory.

```
src/                            # animation/ + env.d.ts — nothing else
├── animation/                  # The entire library (see animation/CLAUDE.md)
│   ├── index.ts                # Package barrel — LIGHT static exports + loadAnimationEngine() (the static/dynamic boundary)
│   ├── load-engine.ts          # HEAVY dynamic loader — loadAnimationEngine() + warmEngine() (the dynamic half of the boundary)
│   ├── public.ts               # HEAVY static mirror — the ./engine subpath's composition barrel (mirrors the AnimationEngine keys)
│   ├── easing.ts               # resolveEasing(name) async factory + toEasing normalizer
│   ├── validate.ts             # validate()/explain() — the agent-authoring projection over the compile surface (HEAVY)
│   ├── constants/              # Types + defaults (Easing, AnimationOptions, Vars, …) — LIGHT-pure types.ts + defaults.ts + back-compat barrel (S.B1)
│   ├── physics/                # LIGHT: clock-driven value steppers + the rAF driver
│   │   ├── numeric.ts / smooth.ts / oscillator.ts / decay.ts / morph.ts / playback.ts
│   │   └── spring/             # SpringProgress family (progress, duration, reseat, linear-stops, timing-function, types — the ring-break)
│   ├── orchestration/          # LIGHT: temporal/multi-target helpers (stagger, flip, drag/, timeline/, sequence/)
│   ├── engine/                 # HEAVY core: KeyframesAnimation (animation.ts) + the css/ sub-zone (CSSKeyframesAnimation + metadata) + playback-state/play-lifecycle/interpolate/option-setters/options/compile-bridge/composition
│   ├── group/                  # HEAVY compositor: AnimationGroup (group.ts) + lifecycle.ts + soa.ts/compositor.ts/springs.ts (the zero-alloc SoA blend fold)
│   ├── compile/                # HEAVY pipeline — FORWARD (root): frame-compiler, parse-flatten, easing-registry (getTimingFunction), easing-option, selector, numeric-plan + adapter.ts (resolveKeyframes, C-9); BACKWARD (backward/ sub-zone, S.B3): backward, backward-walk, backward-color, format
│   ├── resolve/                # HEAVY emerging-CSS resolver (if()/@function/env)
│   ├── ingest/                 # HEAVY CSSOM walk (cssom.ts) + temporal takeover (adopt.ts)
│   ├── scroll/                 # HEAVY scroll grammar (grammar.ts) + the JS ScrollScene driver (scene.ts)
│   ├── waapi/                  # HEAVY WAAPI eligibility (eligibility.ts) + delegation/emission/densify/waapi-options
│   ├── presets/                # HEAVY preset catalog (classic, classic-data, spring, taxonomy) — rides the engine surface as `presets`
│   ├── svg/                    # HEAVY SVG factories: MotionPath, DrawSVG, MorphSVG (over the shared handle.ts base)
│   └── internal/               # value.js-free LEAF tier (NOT a zone, no barrel — C-5): leaves, binarySearch, animation-id, errors, reduced-motion, scheduler, scroll-phases
└── env.d.ts                    # *.vue module declaration (dev-only shim; not shipped)

demo/                # Vue 3 demo (see demo/CLAUDE.md)
├── @/               # Shared library (S.D2): state, animation-transport suite, keyframes-editor, keyframe-timeline, easing-editor, editor-shell, composables, styles, utils
├── app/             # THE multi-scene SPA (npm run dev / gh-pages): router + scene machine + App shell + chrome/ dock
└── scenes/          # Fused per-scene dirs (R.W5) — scenes/<name>/ for amiga · cube · easing · sequence · spring · square (6 scenes; compose · morph · motion-path PRUNED at T.E1/T.E3, OD-1 = PRUNE): each holds <Name>Scene.vue + Target + composables + keys, colocated

test/                # Vitest (jsdom), regrouped into test/<zone>/ mirroring src/animation/<zone>/ (S.B7). Count: `find test -name '*.test.ts' | wc -l` files, `npx vitest list | wc -l` tests
                     # (113 files / 1052 tests at the T.E easing terminal — the trace-smear suite died with the hero (T.E6) and the control-surface-DFA fixture grew the item-7a scene-default clauses — derive, don't trust a frozen number)
bench/               # Vitest bench. Count: `ls bench/*.bench.ts | wc -l` (9 at the O+P impl-drive)
scripts/             # proof-*.mjs runtime gates (wired to npm run proof:*) + shared lib/ + deploy/capture helpers
docs/                # Tranche records + audit lanes
```

## Library Entry Point — the static/dynamic boundary

`src/animation/index.ts` builds to `dist/keyframes.js` (ESM-only — no CJS artifact is emitted) + `dist/keyframes.d.ts` (API Extractor roll-up).

**The two package "in"s (stated once — the honest API "in", R's DEVELOPED lesson).** `package.json` `exports` declares exactly two entry points. The `.` entry — the package name @mkbabb/keyframes.js, `src/animation/index.ts` → `dist/keyframes.js` — is the LIGHT static surface plus the dynamic `loadAnimationEngine()` accessor (a light-only consumer never pulls value.js in). The `./engine` subpath entry — @mkbabb/keyframes.js/engine, `src/animation/public.ts` → `dist/engine/index.js` — is the WHOLE heavy engine as a STATIC, synchronous import, for a consumer who wants `new CSSKeyframesAnimation(...)` without the dynamic dance (it carries value.js by construction). The README Quick Start uses the subpath — the resolved honest "in"; the single-call declarative front door it once competed with was EXCISED at S.C1 (no front door survives).

Two export surfaces meet at the barrel:

- **LIGHT (static named exports, value.js-free):** `NumericAnimation`, `SmoothProgress`, `SpringProgress`, `springLinearStops`, `springTimingFunction`, `ElementMorph`, `Timeline`, `KeyframesScrollTimeline`, `ManualTimeline`, `createNativeTimeline`, `RAFPlayback`, `stagger`, `flip`/`flipShared`, `drag`/`Draggable`/`drag2D` (the single-call 2-D drag sugar — two one-axis `Draggable`s behind a 2-D handle; returns a `Drag2DHandle`), `decay`/`decayRest`, `Sequence`, `resolveEasing`, `toEasing`, `AnimationOptionError`, `UnknownEasingError`. A consumer importing only these never pulls `@mkbabb/value.js` into its graph.
- **HEAVY (dynamic — reached ONLY via `await loadAnimationEngine()`):** `KeyframesAnimation`, `CSSKeyframesAnimation`, `AnimationGroup`, `getAnimationId`, `getTimingFunction`, `resolveKeyframes`, `MotionPath`/`fromMotionPath`, `DrawSVG`/`fromDrawSVG`, `MorphSVG`/`fromMorphSVG`, `presets`, `DIRECTIONS`, `FILL_MODES`, `defaultOptions`, `defaultLayerConfig`, `fromStyleSheets`, `fromLiveAnimations`, `resolveLiveKeyframes`, `adoptRunning`, `ScrollScene`, `createScrollScene`, `parseScrollCSS`, `parseScrollTimeline`, `parseScrollRange`, `serializeScrollOptions`, `roundTripScrollCSS`, `dispatchScrollBackend`, `resolveRange`, `pinCSS`, `TriggerScene`, `createTriggerScene`, `supportsNativeTrigger`, `compileToCSS`, `compileToViewTransition`, `compileToEntry`, `validate`, `explain`, `CSSKeyframesToString`, `CSSKeyframesToStrings`, `formatCSSKeyframeString`, `transformTargetsStyle`, `yieldToMain`. This is the full AnimationEngine key set (the engine core, the SVG factories, the option constants, the ingest/scroll/compile round-trip, the validation verbs, the dogfood serialization/paint/yield helpers) mirrored key-for-key by the ./engine subpath — derived from the d.ts, not hand-curated, so it cannot drift (gated by proof:claude-paths-live clause (c): the HEAVY list ⊆ AnimationEngine keys).

```ts
const { CSSKeyframesAnimation } = await loadAnimationEngine();
const anim = new CSSKeyframesAnimation(opts).fromString(css);
```

The heavy classes are NOT static named exports — only their TYPES are (`import type` is erased under `verbatimModuleSyntax`). The hash-named dist chunks (`engine-*`, `motion-path-*`, `draw-svg-*`, …) are the `loadAnimationEngine()` lazy splits, not leakage. The boundary is gated in CI by `proof:boundary`; the published surface by `proof:published-surface`.

## Dependencies

| Package | Role |
|---------|------|
| `@mkbabb/value.js` | ValueUnit, Color, the CSS `@keyframes` grammar/parser, easing registry, math, normalization — statically imported by the HEAVY surface only |

The `@keyframes` grammar itself lives in value.js; keyframes.js owns the animation engine over it.
(The former parse-that package dependency row is struck, not merely stale: kf
used to hand-compose a cross-realm `any(CSSFunction.FunctionArgs,
CSSValues.Value)` combinator directly against it in the old `utils.ts`;
value.js's own `parseCSSSubValue` now internalizes that exact composition, so
`compile/parse-flatten.ts` reaches it through value.js instead — see that
file's `tryParseLeaves` comment.)

## Conventions

- TypeScript `strict: true`, `verbatimModuleSyntax: true`, `exactOptionalPropertyTypes: true`, `noUncheckedIndexedAccess: true`
- `moduleResolution: bundler`, `target: ES2022`
- `import type` for type-only imports
- Path aliases: `@src/`, `@components/`, `@composables/`, `@styles/`, `@utils/`, `@assets/`
- Prettier: 4-space indent, 80-char width, plugins: tailwind, organize-imports, classnames, merge
- Node >=22

## Architecture Notes

- **Frame pipeline** (`compile/frame-compiler.ts`): `addFrame()` → `parse()` (reconcile vars, compute times) → `AnimationFrame[]` with `interpVars`
- **Playback modes**: rAF (default — every loop rides `RAFPlayback`), WAAPI (opt-in compositor-thread), managed (AnimationGroup owns the loop), reduced-motion snap
- **Interpolation dispatch**: numeric → `lerp`; color → perceptual (`oklab` default); computed units (`vh`, `calc`, `var`, `cq*`) → DOM resolution
- **Layer blending** (AnimationGroup): `replace` (z-order), `add` (accumulate), `weighted` (lerp by weight)
- **WAAPI eligibility** (`waapi/eligibility.ts`): DOM targets, default DOM-style renderer, uniform timing, no computed units, no color interpolation — else rAF fallback with a queryable `waapiIneligibleReason`. A **multi-segment CSS-twin easing** IS eligible (S.F5c): the densify bakes the composite per-segment curve into keyframes fed a single bare `linear` (the "densify → single `linear()`" collapse), so the compositor tracks the true curve with no per-segment restart
- **General primitives**: `NumericAnimation` (zero-alloc keyframe interp), `SmoothProgress`/`SpringProgress` (progress trackers), `ElementMorph` (rect-to-rect transform), `Timeline` (progress driver)
- **Orchestration tier** (all LIGHT): `stagger` (delay distribution), `flip` (layout FLIP over ElementMorph), `drag`/`decay` (gesture physics over SpringProgress), `Sequence` (temporal orchestration beside `AnimationGroup`'s spatial blending)
- **Timeline pipeline**: `sample() → clamp → easing → boundary snap → smoothing → progress`. No rAF ownership — caller drives the loop.
- **KeyframesScrollTimeline**: injectable `getScrollY`/`getViewportHeight` callbacks for testing without DOM
- **ManualTimeline**: smoothing off by default; set raw value, get immediate result
