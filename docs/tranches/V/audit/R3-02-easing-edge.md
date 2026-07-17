# Lane R3-02 — The Masked Easing-Edge Root-Cause (FAM-14)

**Prefix:** EE- · **Family:** FAM-14 EASING-EDGE · **Date:** 2026-07-17
**Method:** source-read the full resolve/serialize path in `src`, then live-exercise the
audit-copy demo (vite dev on `:5250`, playwright-core `chrome` channel, headless) with a
per-scene `pageerror`/`console.warn` classifier, plus targeted node probes against the
built `dist` and instrumented temp-edits (all reverted; audit-copy verified byte-identical
to the real repo after revert).

## Verdict

**The FAM-14 "masked easing edge" is THREE independent demo-owned defects, not the one the
registry named.** The complete mechanism, exercised end-to-end:

- **EE-01 (P1)** — `CopyButton.vue:42` passes the **Value-3-era name `"bounceInEase"`**,
  which the Value-4 registry never had. It throws at *construction* → the copy-feedback
  `AnimationGroup` never builds → the copy animation is DEAD on every scene that mounts a
  CopyButton (observed on `/#/easing`, `/#/spring`).
- **EE-02 (P1)** — the "anonymous-fn / no CSS repr" throw on `/#/cube`, `/#/square`,
  `/#/amiga` is **NOT** `useTransformState.ts:107` (the registry's guess — **REFUTED**
  below). It is the transport timing-function editor assigning a **css-less `{ fn }`
  Easing** (a fresh `cubicBezierEasing(...)`/`steppedEasing(...)` closure) to the *live*
  animation, which the Keyframes-string readout then serializes → `serializeEasing` throws.
- **EE-03 (P2)** — the "Invalid watch source `{id…}`" flock is **ONE** call site,
  `useKeyframesParsing.ts:96` `watch(animation.templateFrames, …)` watching a `markRaw`
  (raw, non-reactive) array; Vue enumerates each raw frame as an invalid source (warn
  count == frame count, confirmed).

The **library resolve/serialize path is correct and must NOT be touched** — the
`serializeEasing` throw for a twinless closure is a **deliberate, gated** contract
(`test/compile/roundtrip-easing.test.ts:62-102`, "G.W4 fail-explicit"). All three fixes are
**demo-owned**. **No value.js gap; no outbound letter** — every curve the demo needs already
exists in the Value-4 registry under a resolvable name.

Baseline (headless chrome, per route; counts vary run-to-run as reactivity re-fires, the
*pattern* is stable):

| route | anon-fn throw | bounceInEase throw | watch warns |
|---|---|---|---|
| `/` (home) | 0 | 0 | 0 |
| `/#/cube` | **3** | 0 | 7 |
| `/#/square` | **1** | 0 | 5 |
| `/#/amiga` | **3** | 0 | 15 |
| `/#/easing` | 0 | **1** | 2 |
| `/#/spring` | 0 | **12** | 17 |
| `/#/sequence` | 0 | 0 | 0 |

---

## The resolution path (source-read, `src`)

Two distinct library entry points, two distinct throw sites:

**A. Construction / option-set** — `resolveEasingOption`
(`src/animation/compile/easing/easing-option.ts:23-66`):
- callable → `{ fn }`; typed `Easing` → passthrough; string → `resolveTimingFunction`.
- `resolveTimingFunction` (`easing-registry.ts:124-136`): try `parseTimingFunction` (CSS
  keyword / `cubic-bezier()` / `steps()` / `linear()` literal) → else
  `timingFunctionRegistry.get(name)` → else `throw`.
- On a registry miss the catch (`easing-option.ts:46-59`) rethrows
  `AnimationOptionError(…, "unknown timing function …", "UNKNOWN_TIMING_FN")`.
- The registry (`easing-registry.ts:18-50`) = **`Object.keys(bezierPresets)`** (the 31
  hyphenated presets: `linear, ease, ease-in/out(-…), ease-*-sine/quad/cubic/quart/quint/
  expo/circ/back, smooth-step-3`) **+ `"ease-in-bounce"` + `DIRECT_NAMES`** (`easeOutCubic,
  easeInOutSine, easeInOutCubic, easeInOutQuad, easeInOutExpo, easeInOutCirc, easeOutExpo,
  smoothStep3, easeInBounce`). Verified live: `Object.keys(bezierPresets)` = the 31 keys;
  `easing("bounceInEase")` → `easing_name_unknown`; `easing("easeInBounce")` /
  `easing("ease-in-bounce")` / `easing("ease-out-back")` → OK.

**B. CSS emit / readout** — `serializeEasing`
(`src/animation/compile/emit/easing-serialize.ts:69-89`):
- `easing.css` present → return it verbatim.
- else reverse-lookup the callable in `timingFunctionEntries` by **reference identity**
  (`func === easing.fn`, line 71-73). Hit + native-CSS hyphenation → verbatim; hit +
  non-native → `linear()` densify twin. **Miss → THROW** "a custom TimingFunction has no
  CSS animation-timing-function representation" (line 74-82).

### Every demo easing name/callable → call site → resolution → live verdict

| # | value / callable | call site(s) | resolves against | live verdict |
|---|---|---|---|---|
| 1 | `"ease-out-back"` | `cube/useCubeDemo.ts:132`, `cube/CubeTarget.vue:210` | bezierPreset → registry singleton | **works** (serializes to `linear()` twin) |
| 2 | `"bounceInEase"` | `components/CopyButton.vue:42` | parse-miss + registry-miss | **THROWS** at construction (EE-01) |
| 3 | `easeInBounce` (callable) | `cube/matrix-editor/useTransformState.ts:107` | `{ fn }`; rAF `NumericAnimation`, never serialized; direct export **===** registry singleton (name `"g"`) | **works** (NOT the throw source — see REFUTED) |
| 4 | `"linear"` | `amiga/useAmigaDemo.ts:96,113`, `keyframes/…/useKeyframeBrushApply.ts:20`, `spring/useSpringKeyframesEditor.ts:62` | native CSS keyword | **works** (verbatim) |
| 5 | `"cubic-bezier(0.36, 0, 0.66, 1)"` | `amiga/useAmigaDemo.ts:130` | parse → `CubicBezier`; `cssTwinFor` attaches css | **works** via constructor (verbatim); would throw only if re-assigned css-less through the panel |
| 6 | `springTimingFunction(...)` (callable) | `spring/useSpringDemo.ts:173`, `spring/useCompiledEntry.ts:56,67`, `spring/useSpringKeyframesEditor.ts:44`, `sequence/useSequenceDemo.ts:122,360` | `{ fn, css }` (carries a `linear()` twin) and/or rAF `NumericAnimation` | **works** (`/#/sequence` fully clean) |
| 7 | `"easeOutCubic"` | `transport/TransportDock/useIconSpin.ts:15` | `DIRECT_NAMES` registry singleton | **works** (`linear()` twin) |
| 8 | `"steps(4, jump-none)"` | `shell/TypingDots.vue:90` | parse → `steppedEase` | **works** (verbatim) |
| 9 | `"ease-in-out"` (default) | `state/animationOptionsStore.ts:48` | native CSS keyword | **works** (verbatim) |
| 10 | `{ fn: cubicBezierEasing(...) }` / `{ fn: <closure> }` | `transport/.../TimingFunctionPanel.vue:144-145`, `transport/.../composables/useTimingFunctionEditor.ts:101-102` | **css-less `{ fn }`, fresh closure, not registry singleton** | **THROWS** at readout serialize (EE-02) |

Node-probe evidence (audit-copy `dist`, `CSSKeyframesToString`): rows 1,4,5,7,8,9 all emit a
valid `animation-timing-function` (`ease-out-back`→`linear(0 0%, 0.15369 3.125%, …)`,
`cubic-bezier(0.36, 0, 0.66, 1)`→verbatim, `linear`→verbatim, `steps(4, jump-none)`→verbatim,
`easeOutCubic`→`linear(…)`). Only `"bounceInEase"` resolve-throws; only a **fresh anonymous
closure** serialize-throws (`(t)=>t*t*t` reproduces it; `easeInBounce` does NOT).

---

## Findings

### EE-01 (P1) — `CopyButton.vue:42` `timingFunction:"bounceInEase"` → copy-feedback animation DEAD
**Family:** FAM-14 · demo→library name gap (Value-3-era name lost in the Value-4 transposition)

`components/CopyButton.vue:39-42` builds
`options = { duration: 200, timingFunction: "bounceInEase" }`, then at mount
(`CopyButton.vue:49`) `new CSSKeyframesAnimation(options)…`. Live stack:

```
AnimationOptionError: … "timingFunction": "bounceInEase" — unknown timing function …
  at resolveEasingOption   src/animation/compile/easing/easing-option.ts (UNKNOWN_TIMING_FN)
  at normalizeTimingFunction  src/animation/engine/options.ts
  at applyTimingFunction / applyOptions  src/animation/engine/option-setters.ts
  at CSSKeyframesAnimation.setOptions  src/animation/engine/animation.ts:265
  at new CSSKeyframesAnimation  src/animation/engine/css/css-animation.ts:36
  at components/CopyButton.vue:49
```

The throw aborts the constructor → the `shallowRef` `group` stays `null` → **the copy
"checkmark" feedback animation never runs**. Value-4 has the curve under **`"easeInBounce"`**
(`DIRECT_NAMES`) and **`"ease-in-bounce"`** (a bezierPreset alias); `"bounceInEase"` is a
stale reversed spelling that the registry never carried.

**Disposition — BUILD (demo).** Rename `CopyButton.vue:42` to `"easeInBounce"` (closest curve),
or `"ease-in-bounce"`, or a `cubic-bezier(...)`/callable form. **No value.js letter** — the
curve exists; only the demo's spelling is wrong.

---

### EE-02 (P1) — css-less `{ fn }` assignment → Keyframes-string readout serialize throws (cube/square/amiga)
**Family:** FAM-14 · demo violates the library's fail-explicit CSS-twin contract

The transport timing-function editor assigns the *live* animation a bare `{ fn }` with **no
`.css` twin**, using a **freshly-built** value.js closure that is not the registry singleton:

- `useTimingFunctionEditor.ts:135-159` `updateTimingFunctionFromName` builds
  `timingFunction = cubicBezierEasing(...)` / `steppedEasing(...)` / `namedEasing(...)`, then
  → `setAnimationTimingFunction` (`:96-107`): `const easing = { fn: timingFunction };
  animation.options.timingFunction = easing; frame.timingFunction = easing` — **css dropped**.
  It separately persists a faithful *literal* to the **store** (`:166-167`), but the **live
  animation** keeps the css-less `{ fn }` — that is the gap.
- `TimingFunctionPanel.vue:144-145` (`onPickerChange`, the bezier-drag path) does the same:
  `const timingFunction = { fn: cubicBezierEasing(...pts) }; props.animation.options.timingFunction = timingFunction`.

The Keyframes-string readout then serializes that live animation. Live stack (`/#/cube`, at
mount, no interaction):

```
AnimationOptionError: … "timingFunction": [function anonymous] — a custom TimingFunction
  has no CSS animation-timing-function representation …
  at serializeEasing   src/animation/compile/emit/easing-serialize.ts (throw, ~L75)
  at CSSKeyframesToString  src/animation/compile/emit/format.ts:223
  at updateCSSAnimationKeyframesStringFromAnimation  demo/…/useKeyframesParsing.ts (~L37)
  at demo/…/keyframes/KeyframesStringControls.vue:69
```

Instrumented `serializeEasing` (temp, reverted) dumped the offending fn:
`{ name: "", hasCss: false, fnStr: "(e) => Number.isFinite(e) ? … m(h(e,n,i),r,a) : NaN" }`
— an **anonymous value.js `CubicBezier` evaluator**, no `.name`, not reference-equal to the
registry singleton → `func === easing.fn` misses → throw. Instrumenting the assign sites
confirmed **`setAnimationTimingFunction` is the mount-time trigger** (fired 3× on cube before
the serialize miss); `onPickerChange` is the interactive bezier-drag trigger — **both** need
the fix.

**The library is NOT at fault and must not change.** The throw is the deliberate G.W4
"fail-explicit on an unrepresentable closure" contract, gated by
`test/compile/roundtrip-easing.test.ts:62-71` (`serializeEasing({ fn: (t)=>t*t*t })` **must
throw**) and `:97-102`. A densify-fallback would break those tests and silently paper over
the demo bug.

**Disposition — BUILD (demo).** Attach the faithful `.css` twin at the two assign sites so
the readout serializes verbatim. The literal is already in hand:
`updateTimingFunctionFromName` computes `timingFunctionLiteralFor(key)` (`cubic-bezier(x1,y1,
x2,y2)` / `steps(n,term)` / the registry name); `onPickerChange` has `cubicBezierToString(
...pts)`. Emit `{ fn, css: <literal> }`. `cubic-bezier(...)` and `steps(...)` are valid CSS
`<easing-function>` tokens (verified: both serialize verbatim through `CSSKeyframesToString`).
Named-easing curves already reference-match the singleton, so `css` is optional there.

---

### EE-03 (P2) — "Invalid watch source `{id…}`" flock = one `markRaw`-array `watch`
**Family:** FAM-14 · Vue reactivity misuse (one mechanism, one site)

`useKeyframesParsing.ts:95-102`:

```ts
// `animation.templateFrames` is a `markRaw` array …
watch(
    animation.templateFrames,      // ← a RAW (non-reactive) array
    async () => { await nextTick(); debouncedUpdateAllStrings(); },
    { flush: "post" },
);
```

Passing a `markRaw` (raw, non-reactive) **array** to `watch` makes Vue treat the array as a
multi-source list and validate **each element**; every raw frame
(`{ id, start, vars, transform, timingFunction }`) is neither a getter, ref, nor reactive →
Vue emits **one** `[Vue warn]: Invalid watch source` per frame. Confirmed: warn IDs run
`0..N-1` and the count tracks frame count (cube 3, square/amiga 5, easing 2, spring 5).
Fires on every scene that mounts the KeyframesEditor with frames (cube/square/amiga/easing/
spring); `/` and `/#/sequence` mount no such frame editor → clean.

**Disposition — BUILD (demo).** Watch a **getter** that expresses the stated structural
intent: `watch(() => animation.templateFrames.length, …)` (or `() => animation.templateFrames`
for reference-identity). This preserves the "fires on structural changes only" contract the
comment already describes and eliminates the per-frame enumeration.

---

## Fix table (one-pass wave)

| defect | owning side | exact change | born-RED probe (wave gate) |
|---|---|---|---|
| EE-01 | **demo** (`CopyButton.vue:42`) | `timingFunction: "bounceInEase"` → `"easeInBounce"` (or `"ease-in-bounce"` / `cubic-bezier(...)`) | `/#/easing` & `/#/spring`: `bounceInEase` pageerror count → **0** |
| EE-02 | **demo** (`useTimingFunctionEditor.ts:101-102` + `TimingFunctionPanel.vue:144-145`) | assign `{ fn, css: <literal> }` — reuse `timingFunctionLiteralFor(key)` / `cubicBezierToString(...pts)`; leave the library throw untouched | `/#/cube`, `/#/square`, `/#/amiga`: anon-fn pageerror count → **0** |
| EE-03 | **demo** (`useKeyframesParsing.ts:96`) | `watch(() => animation.templateFrames.length, …)` | all scenes: `Invalid watch source` warn count → **0** |

**Wave gate (born-RED probe, ready to reuse):** the headless classifier used here —
per route, `pageerror` bucketed into `anon` / `bounceInEase` / `other` and
`Invalid watch source` warn count. Gate = **anon==0 && bounceInEase==0 on all 7 routes**
(the P1 bar), warns==0 as the P2 sweep. Current RED baseline is the table above. No library
source, test, or gate needs to change; the constellation `dist`/registry is correct as-is.

---

## Negatives (deliverables)

- **REFUTED — the registry's FAM-14 attribution `useTransformState.ts:107` (`easeInBounce`)
  is NOT the anon-fn throw source.** `easeInBounce` is imported from `@mkbabb/value.js/easing`
  and is **reference-equal to the registry singleton** (`easing("easeInBounce").value ===
  easeInBounce`, both `.name === "g"`) — it serializes to a `linear()` twin without throwing.
  Moreover it is fed to a `NumericAnimation` (rAF), which is never CSS-serialized at all. The
  real source is the transport panel css-less `{ fn }` assignment (EE-02).
- **The library resolve/serialize path is sound.** All ten demo easing inputs resolve
  correctly except `"bounceInEase"`; no other Value-3→Value-4 name was lost. `"ease-out-back"`,
  `"linear"`, `"cubic-bezier(...)"`, `"steps(...)"`, `"easeOutCubic"`, `"ease-in-out"` all
  emit valid CSS (node-probed).
- **The `serializeEasing` throw is a feature, not a bug.** It is the gated G.W4 fail-explicit
  contract (`roundtrip-easing.test.ts:62-102`). No case for a library densify-fallback; it
  would break those tests and mask the demo defect.
- **No value.js gap → no outbound letter.** Every curve the demo needs exists in the Value-4
  registry under a resolvable name.
- **`springTimingFunction` callables are clean.** `/#/sequence` (two `springTimingFunction`
  uses + `rowGlideEase`) throws nothing — the returned Easing carries a `linear()` css twin
  and/or runs on rAF.
- **`/` (home) is easing-clean.** Its only console.error is a `404` for a missing resource,
  unrelated to timing functions and out of lane scope.

## Coverage gaps

- I confirmed `setAnimationTimingFunction` as the **mount-time** EE-02 trigger and
  `onPickerChange` as the **bezier-drag** trigger; I did not click through every interactive
  emission (dropdown pick / steps editor / advanced panel) to enumerate all callers of
  `updateTimingFunctionFromName`. The fix is caller-independent (fix the two assign seams),
  but a wave should re-run the classifier **after** driving each editor control to confirm
  no third css-less path exists.
- Reference-equality dedup (`easeInBounce === registry singleton`) was verified against the
  audit-copy `node_modules`. A production build with a different value.js dedup could
  theoretically break named-easing reference matching; not observed, and the EE-02 css-twin
  fix makes the demo robust to it regardless.
- The home-route `404` was not root-caused (non-easing, out of lane).
- Run-to-run pageerror counts vary (reactivity re-fires re-throw); the fix gate keys on
  **==0**, which is stable, not on the exact RED count.
