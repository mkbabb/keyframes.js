# B1 — the rainbow GROUP-PLAY "......" parse crash

INVESTIGATION AGENT [b1-group-play] · Tranche I audit · 2026-06-08
Harness: Playwright (playwright-core via `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js`)
against BOTH the built `dist/gh-pages/` (port-0 serveDist) AND the source-mapped dev
server (`:5174`, `/@fs/...src/animation/*.ts`). Reproduced live, not theorized.

---

## TL;DR

Clicking the rainbow group-play button on **home (`#/`)** fires **TWO distinct,
independent failures**:

1. **`TypeError: this.transform is not a function`** — a hard `pageerror` that
   crashes the AnimationGroup draw loop. Root cause: **home binds an EMPTY
   `new AnimationGroup()`** (zero children), whose `this.transform` field is
   NEVER assigned, then `play()` → `_frame` → `transformFramesGrouped` calls
   `this.transform(...)`. The constructor comment PROMISES lazy resolution that
   does not exist.

2. **`Parse error at offset 0: "......"`** — the user's headline B1 crash. Root
   cause: the **Rotations** animation's `100%` keyframe uses
   `transform.rotateX = var(--rotationX)`. When `CSSKeyframesToString` samples
   `animation.at(progress)` while the target's `--rotationX` CSS variable is
   **UNSET** (`getComputedStyle → ""`), value.js parses the **empty computed
   value** and throws its cryptic `Parse error at offset 0: "......"`. This is
   the SAME class of value.js error H.W0 named, but from a structurally
   DIFFERENT seam (computed-VALUE resolution, not the keyframe-SELECTOR the W0
   guard covered).

Both reproduce in the built dist. The play click also navigates home→cube (the
`onPlayStateChange` intercept), so the crash and the navigation interleave.

---

## 1. Reproduction steps (live)

1. Serve `dist/gh-pages/` (or use dev `:5174`). Open `http://…/#/`.
2. Wait for home (the cube backdrop + start screen) to settle.
3. Click the rainbow play button — selector
   `button[aria-label^="Play animation"]` (also class `.rainbow-pastel`).
4. Observe: the console emits the `transform` pageerror immediately, then (as the
   route swaps to cube and `KeyframesStringControls` mounts for the **Rotations**
   selection) the `Err x 0 … ^^^` value.js parse-error block + the
   `[KeyframesString] could not serialize … "......"` warning.

Screenshots:
- `shots/b1-dev-02-after-play.png` — post-click: navigated to cube, controls
  open, dock shows **Rotations** selected, rainbow play button. The cube is
  frozen (draw loop dead).
- `shots/b1-01-home-loaded.png` / `shots/b1-dev-01-home.png` — pre-click home.

Probes (re-runnable):
- `probes/b1-group-play.mjs` — built dist, the canonical repro.
- `probes/b1-group-play-dev.mjs` — dev server, SOURCE-MAPPED stacks.
- `probes/b1-serialize-repro.mjs`, `probes/b1-live-editor.mjs`,
  `probes/b1-dots-source.mjs`, `probes/b1-dots-string.mjs` — the root-cause
  isolation series (which value produces `"......"`).
Console captures: `b1-*.console.json` alongside this file.

---

## 2. Captured console errors (verbatim)

### Built dist (`dist/gh-pages`, minified)
```
[pageerror] this.transform is not a function
TypeError: this.transform is not a function
    at e.transformFramesGrouped (…/assets/engine-Do5bTwuK.js:20:21227)
    at e._frame (…/assets/engine-Do5bTwuK.js:20:22265)
[console.error]  Err x     0
 1 |
     ^^^
[console.warning] [KeyframesString] could not serialize the animation to CSS: Parse error at offset 0: "......"
```

### Dev server (`:5174`, SOURCE-MAPPED)
```
[pageerror] this.transform is not a function
TypeError: this.transform is not a function
    at AnimationGroup.transformFramesGrouped (…/src/animation/group.ts:286:8)
    at AnimationGroup._frame (…/src/animation/group.ts:382:9)
[console.error]  Err x     0
 1 |
     ^^^
[console.warning] [KeyframesString] could not serialize the animation to CSS: Parse error at offset 0: "......"
```

(The `Err x 0 … ^^^` block is value.js's own pretty-printed parse-error render of
empty input — `offset 0`, blank source line, caret under nothing. It logs from
value.js BEFORE the `KeyframesStringControls` try/catch downgrades the throw to
the `[KeyframesString]` warning + placeholder — which is exactly the
`/* timing-function: custom — no CSS twin */` placeholder the user reports in
B5.)

---

## 3. Behavior vs. intended

| | Intended | Actual |
|---|---|---|
| Home rainbow play | A user gesture: navigate home→cube + auto-play the cube group (`onPlayStateChange` line 154-157). NO group is played on home. | `toggleAnimationGroup` calls `play()` on the EMPTY home group FIRST (crash), THEN the navigate intercept runs downstream. |
| Group draw loop | Composite children's vars → `this.transform(...)` paints the cube. | `this.transform` is `undefined` on the empty group → `TypeError` → draw loop dead, cube frozen. |
| Keyframes CSS readout | Serialize the selected (Rotations) animation to faithful CSS for the editor. | `at()` resolves `var(--rotationX)` against an unset var → empty computed string → value.js `"......"` throw → caught → placeholder shown, curve LOST. |

---

## 4. Source trace (file:line)

### 4a. The `this.transform is not a function` crash (the pageerror)

- **Trigger UI** — `AnimationMenuBar.vue:106` (`@click="emit('togglePlay')"`) on the
  rainbow `<Button :class="… isPlaying ? 'rainbow-vivid' : 'rainbow-pastel'">`
  (line 98-110).
- **`useAnimationGroupPlayback.ts:47` `toggleAnimationGroup`** → line 55
  `animationGroup.play()` — called DIRECTLY on `getAnimationGroup()`, which on
  home is the **empty App-level group**, BEFORE the navigate intercept.
- **`group.ts:103`** `_boundFrame = this._frame.bind(this)` → the rAF loop calls
  `_frame` → **`group.ts:382/491` `transformFramesGrouped(t)`** →
  **`group.ts:373` `this.transform(groupedValues as V, t)`**.
  (Dev map reports the throwing call at `group.ts:286:8`/`382:9` — the same
  `this.transform(...)` invocation under source-map line attribution.)
- **`group.ts:38`** declares `transform!: TransformFunction<V>` — a TS
  **definite-assignment assertion (`!`)** that LIES: the field is only assigned
  in the constructor IF a child has compiled frames:
  - **`group.ts:123-124`**:
    ```ts
    if (this.transform == null && animation.frames[0] != null) {
        this.transform = animation.frames[0].transform;
    }
    ```
  - **The empty `new AnimationGroup()` has NO `inputs`** → the loop body never
    runs → `this.transform` stays `undefined`.
  - The comment at **`group.ts:118-122`** claims it "is resolved lazily on the
    first `transformFramesGrouped` call." **There is NO such lazy resolution** in
    `transformFramesGrouped` (lines 238-376) — it calls `this.transform(...)`
    unguarded at line 373. The promised fallback was never implemented (or was
    deleted). This is a dangling-comment / missing-code defect.
- **Where the empty group comes from**:
  - `App.vue:228` `currentAnimationGroup = shallowRef(markRaw(new AnimationGroup()))`.
  - `useSceneMachineApp.ts:60-63` `bindSceneAdapter`: `if (!group || isHome.value)
    { currentAnimationGroup.value = markRaw(new AnimationGroup()); return; }` —
    **home deliberately binds an empty group** (the "cube backdrop drives no
    playback" design). The rainbow play button is bound to that empty group.

### 4b. The `"......"` parse crash (the headline B1)

- **`KeyframesStringControls.vue:96`** (`updateCSSAnimationKeyframesStringFromAnimation`)
  → **`CSSKeyframesToString`** (`src/animation/format.ts:124`).
  (The user's report cites `KeyframesStringControls.vue:47/149` + `format.ts:86`
  from the H-era dev build line-numbering; the current source equivalent is the
  `import` at line 45 + the `onMounted` call + `format.ts`'s `at()` sample loop.)
- **`format.ts:148`** `const vars = animation.at(progress, false)` — samples the
  animation at each template-frame stop to build the CSS body.
- **`engine.ts:632` `at(progress)`** → **`engine.ts:636/657` `interpFrames`** →
  **`engine.ts:707/769 `processFrame`** → **`engine.ts:779` `lerpValue(eased, iv)`**.
  (User stack: `engine.ts:460 → interpFrames :516 → processFrame :576` — the same
  `at → interpFrames → processFrame` spine under the H dev build numbering.)
- **`lerpValue` → the computed-unit path** (`lerpComputedValue` → `getComputedValue`,
  `src/units/normalize.ts` + value.js): reads
  `getComputedStyle(target).getPropertyValue("--rotationX")`, which returns **`""`**
  when the var is unset, and feeds `""` to value.js **`parseState`/`parseCSSValueUnit`**
  → the **`Parse error at offset 0: "......"`** throw.
- **The animation**: `useCubeAnimations.ts:45-66`, the **Rotations** child:
  ```ts
  "100%": { transform: { rotateX: new ValueUnit("--rotationX", "var"), … } }
  ```
  `var(--rotationX)` is the empty-resolving unit.

---

## 5. Root-cause isolation evidence (the `"......"` producer, pinned)

`probes/b1-dots-source.mjs` reconstructed each cube child and serialized it
(`b1-dots-source.console.json`):

| Case | Result |
|---|---|
| Rotations, **no target** | throws `Cannot interpolate computed values without a target element` |
| Rotations, **target with `--rotationX` UNSET** | **`Parse error at offset 0: "......"`** ← THE BUG |
| Rotations, target WITH `--rotationX: 45deg` (`b1-live-editor`) | serializes PERFECTLY to valid CSS |
| Matrix (`matrix3d`), no target | serializes fine |
| Hover preset (`translateY`) | serializes fine |

`probes/b1-dots-string.mjs` confirmed the mechanism exactly
(`b1-dots-string.console.json`):
```json
{ "computedVarEmpty": "\"\"",
  "at_0_err": "Parse error at offset 0: \"......\"",
  "at_1_err": "Parse error at offset 0: \"......\"" }
```
`getComputedStyle(el).getPropertyValue("--rotationX") === ""` → `at()` throws the
`"......"`. **Only** the `var(--rotationX)`-bearing Rotations animation, **only**
when the var is unset on the target, produces it.

---

## 6. WHY H.W0's frame-compiler guard did NOT cover this path

H.W0 added a guard at **`frame-compiler.ts:163-169`**:
```ts
// Fail-explicit belt (H.W0 H-A2): a blank/whitespace keyframe selector
// reaches value.js parseCSSValueUnit(""), which throws the cryptic
// `Parse error at offset 0: "......"` …
if (typeof start === "string" && start.trim() === "") {
    throw new AnimationOptionError("start", start, "a keyframe selector must be …");
}
```

This guards the keyframe **SELECTOR** (`start`, e.g. `"0%"`/`"from"`) at
COMPILE time — a malformed `@keyframes` STOP. The W0 fix correctly killed the
ROUTE-STORM blank-selector reproduction.

But the LIVE `"......"` the user reports is a **different seam entirely**:

- It is not a blank **selector** — it is an **empty computed VALUE**
  (`var(--rotationX)` → `getComputedStyle → ""`) resolved at **INTERPOLATION**
  time (`interpFrames → processFrame → lerpValue → getComputedValue →
  parseCSSValueUnit("")`), inside `at()`, called by `CSSKeyframesToString`.
- The selector guard is upstream of compilation; the value resolution is in the
  hot interp path, long after compilation. The two never touch.
- `proof:demo-console-clean` went green because it checks the **HOME LOAD**
  console — and on home the editor is not mounted with a `var()` animation whose
  target lacks the var, so the throw is not provoked. The crash is **interaction-
  + state-conditioned** (click play → navigate to cube → mount editor for a
  `var()` animation while `--rotationX` is unset) — exactly the runtime/
  interaction blind-spot the gate regime misses.

So H.W0 was **scoped to one of two structurally distinct `"......"` sources** and
named only the selector one; the computed-empty-value source was never covered.

---

## 7. Root-cause HYPOTHESIS (for the root-cause + authoring phases)

Two faults, one button:

**H1 (the pageerror, HIGH).** `AnimationGroup.transform` is declared with a
definite-assignment assertion (`group.ts:38 transform!`) but is only conditionally
assigned (constructor line 123). An **empty group** — which the home route binds
on purpose (`useSceneMachineApp.ts:61`, `App.vue:228`) — has `transform ===
undefined`, and `transformFramesGrouped` (line 373) calls it unguarded. The
constructor comment promises a lazy fallback that does not exist. The IDIOMATIC
fix is a real default: `AnimationGroup.transform` should default to a no-op (or
to `transformTargetsStyle` over the group's own target set, mirroring
`Animation.transform` at `engine.ts:1354`), assigned at the FIELD, not
conditionally — so a childless or pre-`parse` group renders a harmless empty
composite instead of throwing. Separately, **playing an empty group is itself
meaningless** — `play()`/`toggleAnimationGroup` (or the home gesture path) should
short-circuit when `Object.keys(animations).length === 0` and let the
home→cube navigate intercept own the gesture (the intercept already exists at
`onPlayStateChange:154` but runs DOWNSTREAM of the crashing `play()`; the order
must invert).

**H2 (the `"......"`, HIGH — the headline).** Resolving a computed unit whose
`getComputedStyle` value is the **empty string** must not reach value.js's
untyped `"......"` throw. The empty-computed-value case is a legitimate transient
(a `var(--rotationX)` whose custom property is not yet set on the target — the
mount-before-wire window, or simply an undefined CSS var). The fix belongs at the
computed-value seam (`src/units/normalize.ts` `getComputedValue`, the inv-16
engine-transposition surface): an empty/whitespace `getPropertyValue` result must
fail EXPLICITLY-or-skip — either resolve to the unit's declared fallback / the
start endpoint, or throw a typed `AnimationOptionError` NAMING the missing custom
property — never feed `""` to `parseCSSValueUnit`. The H.W0 selector guard is the
PRECEDENT for the shape of this fix; it simply needs a TWIN at the value seam.
(Demo-side, the cube should also DEFINE `--rotationX` on the target before the
editor serializes — but the LIBRARY must be robust to an unset var regardless;
that is the inv-16 runtime-correctness transposition.)

The gate-regime lesson (the tranche headline): a wave gate for B1 must
PLAYWRIGHT-CLICK the home rainbow play AND assert (a) ZERO `pageerror`, (b) ZERO
`"......"`/value.js parse-error console lines through the home→cube→editor-mount
interaction — a RUNTIME gate, not a home-load console scan.

---

## 8. Artifact index

- `probes/b1-group-play.mjs` · `b1-group-play.console.json` — dist repro
- `probes/b1-group-play-dev.mjs` · `b1-group-play-dev.console.json` — dev, mapped
- `probes/b1-serialize-repro.mjs` · `b1-serialize-repro.console.json`
- `probes/b1-live-editor.mjs` · `b1-live-editor.console.json` — `--rotationX` SET ⇒ valid CSS
- `probes/b1-dots-source.mjs` · `b1-dots-source.console.json` — producer matrix
- `probes/b1-dots-string.mjs` · `b1-dots-string.console.json` — `""` ⇒ `"......"` proof
- `shots/b1-01-home-loaded.png`, `shots/b1-02-after-play.png`,
  `shots/b1-dev-01-home.png`, `shots/b1-dev-02-after-play.png`,
  `shots/b1-live-01-cube.png`, `shots/b1-serialize-cube.png`
