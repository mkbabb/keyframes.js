# R1-07 — Dead-Code + Dual-Path Census

**Lane:** R1-07 (DD- prefix) · **Date:** 2026-07-16 · **Scope:** `src/` and `demo/` — dead exports, dead files, dual paths, masking fallbacks, alias smuggling, commented-out code, unreferenced assets, Value-4 transposition residue, Glass 4/5-era demo shims.

## Verdict

The tree is **clean on the load-bearing dead-code axes**: the Value-4 transposition holds (no local CSS/keyframe-selector/animation-shorthand/easing parser, classifier, normalizer, or grammar fallback survives in `src/` or `demo/` — every parse delegates to `@mkbabb/value.js`); there are **zero orphan (unimported) files**, zero commented-out code blocks, zero alias-smuggling re-exports, zero dead flags/constant-condition branches, and all demo CSS is reachable via `@import` chains. Masking-fallback `catch` blocks are all legitimate (WAAPI detached-effect cancels + typed `CORS_SKIP`/`PARSE_ERROR` diagnostics; no silent swallow).

Two genuine defects survive: **two truly-dead exports** referenced nowhere in the repo (`isObject`, `cloneInterpSlot`), and a **broad over-export / encapsulation-leak pattern** (~32 `src` + 11 `demo` symbols `export`ed but used only inside their own file). A quality/provenance layer: **~15 demo consumers carry stale `glass-ui 4.0.x` provenance comments while the installed peer is 7.0.0**, and at least two of those comments justify remount *shims* that may now be dead against Glass 7. Separately (cross-lane but surfaced here): **`@mkbabb/glass-ui` is undeclared in `package.json`** yet imported throughout `demo/` and physically installed at 7.0.0.

No false-close claim in this lane's axis.

---

## DD-1 — `isObject` is a truly-dead export (P2)

**Family:** dead-export-truly-unused

`src/animation/internal/helpers.ts:9`
```
export const isObject = (value: unknown): value is Record<string, unknown> =>
```
Repo-wide reference count (src + demo + test + bench + scripts): the definition line only.
```
$ grep -rn "isObject" src demo test bench scripts
src/animation/internal/helpers.ts:9:export const isObject = …   ← sole hit
```
Defined, exported, imported by nothing, called by nothing — not even within its own file. Confirmed dead (static import graph; no dynamic-access surface — `helpers.ts` exports are all named static imports).

**Disposition — retire:** delete the declaration in a `V` cleanup wave; no downstream.

---

## DD-2 — `cloneInterpSlot` is a truly-dead export (P2)

**Family:** dead-export-truly-unused

`src/animation/compile/interp-slot.ts:340`
```
export const cloneInterpSlot = (slot: InterpSlot): InterpSlot => {
```
Repo-wide reference count: the definition line only.
```
$ grep -rn "cloneInterpSlot" src demo test bench scripts
src/animation/compile/interp-slot.ts:340:export const cloneInterpSlot = …   ← sole hit
```
A slot-clone helper with zero callers anywhere. Confirmed dead. (The sibling type-union members `ColorInterpSlot`/`ComputedInterpSlot`/`DiscreteInterpSlot`/`InterpSlotOptions` on lines 29/38/55/68 are used *within* the file as the `InterpSlot` union constituents — those are over-exports, not dead code; see DD-3.)

**Disposition — retire:** delete the declaration; it is a leftover of the InterpSlot decomposition.

---

## DD-3 — Broad over-export / encapsulation leak in `src/` (~32 symbols) (P2)

**Family:** dead-export-surface (over-export)

A large set of symbols carry an `export` keyword but are referenced **only inside their own defining file** (used internally, never imported by any other module, not surfaced through `public.ts` or any barrel). The `export` is dead surface — it widens the module's public shape beyond what any consumer touches and defeats the "reviewed-barrel-edit" export policy the codebase states it enforces (`presets/index.ts:11`, `orchestration/index.ts:15`).

Verified list (each grep-confirmed to appear only in its own file, and confirmed *not* re-exported: `engine/index.ts` re-exports only `./animation`/`./css`/adapter/constants by name; `presets/index.ts` re-exports presets by name; only `export *` in `src` are `public.ts → ./engine`, `public.ts → ./presets`, `constants/index.ts → ./types|./defaults`):

| File | Symbol(s) |
|---|---|
| `src/animation/compile/interp-slot.ts` | `ColorInterpSlot`, `ComputedInterpSlot`, `DiscreteInterpSlot`, `InterpSlotOptions` |
| `src/animation/compile/value-ast.ts` | `CompileValueOptions` |
| `src/animation/compile/emit/backward-color.ts:326` | `DensifyResult` |
| `src/animation/compile/emit/format.ts:249` | `PremultiplyResult` |
| `src/animation/engine/composition.ts` | `CompositionRuntime`, `endValueFor`, `emitCompositionFallback` |
| `src/animation/engine/play-lifecycle.ts` | `renderFrame`, `cancelWAAPI`, `snapToReducedMotion` |
| `src/animation/group/waapi.ts` | `GroupWAAPIEligibility` |
| `src/animation/internal/animation-id.ts` | `AnimationIdentity` |
| `src/animation/internal/errors.ts` | `AnimationOptionErrorCode` |
| `src/animation/internal/leaves.ts` | `FRAME_RATE` |
| `src/animation/internal/transport/core.ts` | `HeldPlayState`, `RunFlags` |
| `src/animation/orchestration/sequence/transport.ts` | `restPhase`, `isForwardMonotone`, `seedOrigin` |
| `src/animation/physics/spring/solver/sample.ts` | `NormalizedSpringSampleOptions` |
| `src/animation/physics/spring/solver/solver.ts` | `SpringSolution`, `SpringModalStep` |
| `src/animation/presets/catalog.ts` | `PresetGroup`, `PresetFactory`, `definePreset` |
| `src/animation/resolve/browser.ts` | `ResolvedBrowserScalar` |
| `src/animation/resolve/element-resolve.ts` | `resolveElementAwareValues` |
| `src/animation/svg/morph-geometry.ts` | `fmtNum` |
| `src/animation/waapi/delegation.ts` | `NativeScrollDispatchContext` |

Suspected-not-confirmed caveat: any of these *could* be intended as a tested-internal or a future-public seam; a few (e.g. `ResolvedBrowserScalar`, `CompositionRuntime`) are exported types used across function signatures within one file and may be deliberately public-typed. Treat the list as "drop `export` unless a barrel/test names it," which none currently do.

**Disposition — fold:** a single `V` encapsulation-sweep wave: demote each to a file-local (`const`/`type` without `export`), guarded by a standing lint rule (extend the `depcruise`/no-orphan gate with a `no-unused-exports` rule so the pattern cannot re-accrete). Verify with the existing `npm run check` after each demotion.

---

## DD-4 — Over-export leak in `demo/` (11 symbols) (P3)

**Family:** dead-export-surface (over-export)

Same pattern in the demo, referenced only within their own file:

| File | Symbol(s) |
|---|---|
| `demo/app/scene/scenes.ts` | `SceneDescriptor`, `homeScene` (used only at `scenes.ts:201` `allScenes`) |
| `demo/components/instrument/utils/iosTextEntry.ts:1` | `isIOSLikePlatform` (used only at lines 11/15 same file) |
| `demo/composables/scene-runtime/useSceneTransport.ts` | `TransportAction`, `TransportActionModel` |
| `demo/composables/useThrottledReadout.ts` | `ThrottledReadout` |
| `demo/scenes/cube/matrix-editor/transformMath.ts` | `MatrixScalar`, `MatrixValues` |
| `demo/state/controlSurfaces.ts:172` | `SCENE_DEFAULT_CONTROL` (used only at line 179 same file) |
| `demo/utils/reference-data/animationDescriptions.ts` | `TimingFunctionState`, `timingFunctionState` (used only at line 99 same file) |

No truly-dead symbol among them (all have ≥1 same-file use). Lower severity than DD-3 because the demo is not a published surface.

**Disposition — fold:** roll into the DD-3 encapsulation-sweep wave, demo half.

---

## DD-5 — Stale Glass 4.0.x provenance comments + suspected-dead modelValue remount shims (P3, P2-if-confirmed)

**Family:** stale-era-comment / suspected-dead-shim

Installed peer is Glass 7.0.0:
```
$ cat node_modules/@mkbabb/glass-ui/package.json | grep version → "version": "7.0.0"
```
~15 migrated demo consumers still carry `glass-ui 3.4.0 / 4.0.0 / 4.0.1` provenance comments as if describing current behavior. Representative hits:
- `demo/scenes/cube/CubeScene.vue:39,146` — "glass-ui 4.0.0 (K.W1′ BA.W-TABS)"
- `demo/components/instrument/transport/channel-controls/ChannelControls.vue:42,86,209,220,263,305` — "glass-ui 4.0.0 (BA.W-TABS)" (6 sites in one file)
- `demo/app/dock/ChromeDock.vue:348` — "on glass-ui 4.0.0 the collapsed…"
- `demo/components/instrument/transport/channel-controls/ChannelOptions.vue:142` — "glass-ui 3.4.0"
- `demo/components/instrument/transport/KfPillTabs.vue:5`, `TimingFunctionPanel.vue:26`, `EasingSidebar.vue:18`, `AnimationControlsGroup.vue:169`, `ControlsPaneWrapper.vue:7,197`, `EditorShell.vue:162`, `useTabStripScroll.ts:23,47`, `KeyframesEditor.vue:8`.

Two of these are not merely doc-nits — they justify **live workaround code**:
- `demo/scenes/easing/EasingSidebar.vue:16-26` — the `:key="pickerSeed.key"` **remount** of `<EasingPicker>` is explicitly rationalized as "glass-ui 4.0.1's modelValue is EMIT-ONLY (no external write-through / points-in prop), so a remount is the only blessed re-seat seam."
- `demo/components/instrument/transport/channel-controls/TimingFunctionPanel.vue:26` — same "glass-ui 4.0.1's modelValue is emit-only" rationale.

If Glass 7's `EasingPicker`/timing picker gained a write-through `modelValue`, the remount shim is now dead/unnecessary code. Not confirmed here — verifying requires reading the Glass 7 component API (sibling repo is read-only this cycle), so it is filed **suspected-dead**.

**Disposition — build (small):** a `V` wave that (a) re-words the ~15 provenance comments to the current Glass-7 baseline or strips the version claim, and (b) opens a paired glass-ui-side check of the `EasingPicker`/timing-picker `modelValue` contract; if write-through landed in Glass 6/7, delete the remount `:key` shims and their rationale comments (promotes to P2 dead-code on confirmation).

---

## DD-6 — `@mkbabb/glass-ui` is an undeclared (phantom) dependency (P2)

**Family:** undeclared-dependency / manifest-integrity

`package.json` declares exactly one runtime dependency (`@mkbabb/value.js: 4.0.0`) and no `glass-ui` entry in `dependencies`, `devDependencies`, `peerDependencies`, or `optionalDependencies`:
```
$ grep -niE "glass" package.json → (no output)
$ Read package.json:68-113 → dependencies:{ "@mkbabb/value.js":"4.0.0" }, devDependencies:{…no glass…}
```
Yet the demo imports `@mkbabb/glass-ui` throughout and it is physically installed at `node_modules/@mkbabb/glass-ui@7.0.0`. The build resolves it only because it happens to be on disk — an unpinned, undeclared edge. This is adjacent to alias-smuggling in effect (a dependency present at runtime but invisible to the manifest/lockfile contract). It also contradicts the auto-memory note that the demo should "consume Glass UI 6 … exact 6.0.0" — the installed core is 7.0.0.

Cross-lane note: dependency-pinning proper is R1-04's charter; surfaced here because it is the mechanism that lets the DD-5 stale shims run against an unexpected major.

**Disposition — build:** a `V` wave declares `@mkbabb/glass-ui` explicitly with the intended pin, and reconciles the intended major (6 vs the installed 7) with the memory'd consume-edge; add a manifest gate (depcruise `no-non-package-json` or equivalent) so an undeclared runtime import fails CI.

---

## Negatives (checked, found sound)

- **Value-4 transposition residue — NONE.** No local parser/classifier/normalizer/grammar fallback survives for CSS / keyframe-selector / animation-shorthand / easing in `src/` or `demo/`. Every parse delegates to `@mkbabb/value.js`: `src/animation/validate.ts:47` (`collectKeyframes`, `parseStylesheet`), `resolve/browser.ts:3` (`parseCssScalar`), `compile/adapter` `resolveKeyframes`, and in the demo `parseAnimationCSS.ts:1-4` (`collectAnimationOptions`, `collectStyleRules`), `keyframeSelector.ts:1` (`parseKeyframeSelector`), `useSquareTumble.ts:2` (`parseCssColor`), `useSquareDemo.ts:4`/`KeyframesEditor.vue:123` (`parseCssScalar`). `parseAnimationCSS.ts:20-23` explicitly documents "no regex pre-detection or second parse." **`src/animation/scroll/grammar.ts` is the library's OWN scroll-timeline grammar feature (a first-class product surface), NOT CSS-animation parsing residue** — do not mistake it for Value-4 leakage.
- **Orphan (unimported) files — NONE** in `src` (0) or `demo` (only `demo/env.d.ts`, an ambient `.d.ts` referenced by tsconfig, not a runtime module). File-level import-graph built by basename-specifier match across src+demo+test+bench+html.
- **Commented-out code blocks — NONE** in `src`. All `//` lines matching a code-shaped prefix are prose/rationale comments (verified sample of 15).
- **Alias-smuggling re-exports — NONE.** No `export { X as Y }` renaming re-exports anywhere in `src` barrels; the only `export * as` are the legitimate `presets` namespace and the engine/constants barrels.
- **Dead flags / constant-condition branches — NONE.** No `if (true|false)`, no `LIBRARY_CEILING_OVERRIDE` (only a historical doc mention at `presets/classic-data.ts:8`), no `@ts-ignore`/`@ts-nocheck`, no `__DEV__`/`process.env` dead gates, no `animate.ts` zombie (excised).
- **Masking fallbacks — NONE (all catch blocks legitimate).** `group/lifecycle.ts:38/50/60` cancel/pause/play detached native effects (documented "KEEP: already inert"); `ingest/cssom.ts:279/366` emit typed `PARSE_ERROR`/`CORS_SKIP` diagnostics (honesty surface, never silent drop); `resolve/browser.ts:160-173` `numericScalar` **throws** `BrowserScalarResolutionError` rather than returning a masked default; `easing-option.ts:46-59` rethrows a typed `AnimationOptionError` with a structured code.
- **Unreferenced assets/styles/workers — NONE.** No worker files exist. All demo CSS is reachable: `tab-idiom.css` and `playback-idiom.css` are `@import`ed by `design-idioms.css:6-7`; `layout.css` by `style.css:15`; the 0-grep-in-TS results were false positives resolved by the CSS `@import` chain.

## Coverage gaps

- **Dynamic-access dead code:** the import graph is static-specifier based. Symbols reached only via string-keyed dynamic access (`obj[name]`, `import(variable)`) could be mis-flagged live-or-dead. The confirmed-dead pair (DD-1/DD-2) has no such surface; the over-export lists (DD-3/DD-4) were each individually grep-verified to appear only in their own file, so dynamic re-export is not in play for them.
- **Glass 7 `modelValue` contract (DD-5):** not verifiable this cycle — the `glass-ui` sibling repo is read-only and hosts active agents. The remount-shim dead/live determination is deferred to a paired glass-ui check.
- **`.vue` `<script setup>` internal dead symbols:** the demo dead-export scan covered `.ts` exports; unused refs/computeds *inside* SFC `<script setup>` blocks were not exhaustively swept (out of the export-graph axis; belongs to a Vue-lint lane).
- **Test/bench-only exports:** symbols exported from `src` solely for `test/` or `bench/` consumption were counted as live (corpus includes test+bench). A stricter "production-dead but test-live" axis (symbols kept alive only by tests) was not separated out.
