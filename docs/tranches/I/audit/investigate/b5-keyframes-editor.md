# B5 — the CSS keyframes editor is broken (`/* timing-function: custom — no CSS twin (see console) */`)

INVESTIGATION AGENT `[b5-keyframes-editor]` · Tranche I · live Playwright on the
pre-built `dist/gh-pages` · 2026-06-08.

> **VERDICT: B5 IS B1.** The keyframes editor placeholder is NOT an easing
> problem. It is the H.W0 `"......"` empty-CSS-parse crash, surfaced through the
> serializer's catch-block as a *mis-attributed* placeholder. The placeholder
> text blames a "custom timing-function with no CSS twin"; the real throw is
> `value.js parseCSSValueUnit("")` on an **empty string** produced while
> resolving the Rotations animation's `var(--rotationX)` / `matrix3d` endpoints
> off-DOM during serialization. **One bug, two symptoms** (B1 = the toast/crash
> path; B5 = the same throw caught by the editor's mount path).

---

## 1. Reproduction steps

Harness: `docs/tranches/I/audit/investigate/probes/b5-keyframes-editor.mjs`
(+ `b5-stack-capture.mjs`), modelled on `scripts/proof-no-orphan-specular.mjs`
(`serveDist` on port 0 + `chromium` via
`createRequire(KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js)`).

```sh
KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js \
  node docs/tranches/I/audit/investigate/probes/b5-keyframes-editor.mjs
```

1. Serve `dist/gh-pages`, open `…/#/cube` fresh, controls panel pre-opened.
2. The cube scene's default selected animation is **Rotations** (confirmed via
   the dock select trigger readout: `["Controls", "Cube", "Rotations"]`).
3. The Keyframes pane is **force-mounted** (`force-mount` + `content-visibility`
   caching, `AnimationControls.vue:69`) — so `KeyframesStringControls` mounts and
   `onMounted` → `updateCSSAnimationKeyframesStringFromAnimation()` runs **with no
   user interaction at all**. No tab-click needed to trigger the bug.
4. The Monaco editor renders, verbatim:
   `/* timing-function: custom — no CSS twin (see console) */`

**The bug is on FIRST LOAD of any cube/amiga/square scene** (the three scenes
whose surface set includes `keyframes` — `controlSurfaceDFA.ts:78-80`). It does
NOT require clicking the rainbow group-play button (that is B1's path); the
editor self-serializes on mount and self-breaks.

---

## 2. Captured console (VERBATIM)

```
[error]    Err x     0
         1 |
             ^^^
[warning]  [KeyframesString] could not serialize the animation to CSS: Parse error at offset 0: "......"
```

Monaco model content (NBSP-rendered):
```
/* timing-function: custom — no CSS twin (see console) */
```

- The `[error]` block (` Err x     0 / 1 | / ^^^`) is value.js's parser error
  frame printed on **empty input** (caret at offset 0, blank source line).
- The `[warning]` is `KeyframesStringControls.vue:105` (`console.warn`) inside the
  mount-path `catch`.
- **No `pageerror`** — the component swallows the throw in its `try/catch`, which
  is exactly why `proof:demo-console-clean` (a HOME-LOAD console check) went GREEN
  while the product was broken: the error is a caught `console.warn`, not an
  uncaught page error, and it fires on the cube/amiga/square scenes, not home.

---

## 3. Behavior — observed vs. intended

| | |
|---|---|
| **Observed** | The Keyframes tab shows `/* timing-function: custom — no CSS twin (see console) */`. No real `@keyframes` CSS. Copy/Apply/Format act on the placeholder. The message is a **lie**: there is no custom timing-function involved — the default Rotations easing is the registry `easeInBounce` (CSS-twinnable) and the store easing is `ease-in-out` (a native CSS keyword). |
| **Intended** | The editor shows the serialized `@keyframes` of the selected animation — the round-trippable CSS the user can edit/copy/apply (the whole point of the pane). |

---

## 4. Source trace (file:line)

The throw chain (source-side; the user's B1 report gives the matching bundled
`engine.ts:460/516/576` frames):

1. `KeyframesStringControls.vue:96` — `onMounted` →
   `updateCSSAnimationKeyframesStringFromAnimation()` calls
   `CSSKeyframesToString(animation, …)`.
2. `src/animation/format.ts:148` — `CSSKeyframesToString` loops `templateFrames`
   and calls **`animation.at(progress, false)`** to resolve each stop's values.
3. `src/animation/engine.ts:632` — `at()` → **`interpFrames(t, false)`** →
4. `src/animation/engine.ts:707/769` — `interpFrames` → **`processFrame`** →
   `engine.ts:779` — `lerpValue(eased, iv)` for each `iv` in `frame.allInterpVars`.
5. `lerpValue` (from `@mkbabb/value.js`) resolves the Rotations 100% stop's
   `transform.rotateX = var(--rotationX)` (and the `matrix3d` cells) against the
   DOM: it writes the CSS onto the target, reads `getComputedStyle`, and re-parses
   the read-back via **`parseCSSValueUnit(<read-back>)`**.
6. On a fresh / detached / unstyled target, `--rotationX` is **undefined**, so the
   computed read-back is the **empty string `""`**. `parseCSSValueUnit("")`
   throws → `Parse error at offset 0: "......"`.
7. `KeyframesStringControls.vue:100-110` `catch` → `console.warn(...)` →
   `cssKeyframesString.value = "/* timing-function: custom — no CSS twin … */"`.

The serializer entry the user's stack names as `format.ts:86` /
`CSSKeyframesToString` is the bundled offset of this same `at()` call
(`format.ts:148` in source). The user's `engine.ts` frames (`460 at → 516
interpFrames → 576 processFrame`) line up 1:1 with source
`at()`/`interpFrames`/`processFrame`.

### The proof that `"......"` == empty input

```
$ node -e 'import("@mkbabb/value.js").then(m=>{try{m.parseCSSValueUnit("")}catch(e){console.log(e.message.split("\n").pop())}})'
Parse error at offset 0: "......"
```

`""` is the ONLY input that yields the bare `"......"` context — every non-empty
input embeds its own text in the dots (e.g. `"...var(--ro..."` for
`var(--rotationX)`, `"...matrix3d..."` for `matrix3d()`). So the `"......"`
signature is a **proven, unambiguous fingerprint of an empty-string parse**.

---

## 5. Root-cause HYPOTHESIS

**Primary (high confidence).** `CSSKeyframesToString` builds its keyframe CSS by
**sampling the LIVE animation** — `animation.at(progress, false)` — which runs the
full interpolation/DOM-resolution pipeline (`interpFrames → processFrame →
lerpValue → getComputedValue`). For an animation carrying a `var()`/computed
endpoint (the cube **Rotations**' `var(--rotationX)`, and its `matrix3d` cells),
that DOM resolution reads back an **empty computed value** when the custom
property is unset on the (fresh/detached) target. value.js then re-parses `""`
and throws `Parse error at offset 0: "......"`. The serializer is **not supposed
to need a live, fully-styled DOM** to emit CSS text — using `at()` (a runtime
interpolation query) as the source of serialization text is the architectural
defect. A serializer should emit from the **declared template values**, not from
a DOM-resolved interpolation sample.

**Why H.W0's fix did not cover this.** The W0 `"......"` guard hardened the
**FrameCompiler blank-selector** path (an empty `@keyframes` selector). It never
touched the **`CSSKeyframesToString → at() → processFrame`** serialization path.
The W0 console-clean gate then certified the HOME load (no keyframes pane there),
so the regression sailed through GREEN. This is the gate-blindspot in miniature:
a load-time, source-shape gate that never **clicks into a scene with a `var()`
animation and reads the keyframes pane**.

**The mis-attributing placeholder is a second defect.** Even granting an honest
"can't serialize" floor, the message hard-codes *"timing-function: custom — no CSS
twin"* — which is **wrong for this failure** (the easing here is perfectly
CSS-twinnable). The catch-block conflates *every* serializer throw with the one
narrow `serializeEasing` custom-closure case (`format.ts:36`). It should report
the **actual** error, or — better — the serializer should not throw here at all.

### Path-forward seeds (for the root-cause + authoring phases — NOT a fix here)

- **Serialize from template, not from `at()`.** Emit each stop's CSS from the
  declared `templateFrame` values (the user-authored `var(--rotationX)`,
  `matrix3d(…)` strings) directly via `unflattenObjectToString`, bypassing the
  DOM-resolving interpolation sample. A `var()`/`matrix3d` is *already* valid CSS
  text — it should round-trip **verbatim**, never be DOM-resolved to a number to
  be re-serialized. This is the idiomatic, gestalt move (the editor's purpose is
  to show the *authored* CSS, which is also what re-parses cleanly).
- **Harden value.js / the resolution seam against empty read-back** (defense in
  depth): an empty computed read-back during interpolation must not throw a raw
  parser error up through the hot path — `processFrame`/`lerpValue` is the rAF hot
  loop, so a `var()` animation that mounts before its custom property is set would
  also crash *playback*, not just serialization (this is the B1 surface).
- **Kill the mis-attributing placeholder** — it actively misdirected this entire
  triage toward easing.

---

## 6. Screenshots

- `docs/tranches/I/audit/investigate/shots/b5-keyframes-editor.png` — the cube
  scene with the controls panel open and the keyframes placeholder visible.
- `docs/tranches/I/audit/investigate/shots/b5-keyframes-pane.png` — the Monaco
  pane region (placeholder text close-up).

## 7. Probes

- `docs/tranches/I/audit/investigate/probes/b5-keyframes-editor.mjs`
- `docs/tranches/I/audit/investigate/probes/b5-stack-capture.mjs`
