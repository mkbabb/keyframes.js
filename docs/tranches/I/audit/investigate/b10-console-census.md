# b10 — CONSOLE CENSUS (the master error ledger)

**Agent:** investigation `[b10-console-census]` · **Tranche I dev** · 2026-06-08
**Harness:** Playwright (`playwright-core` via `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js`),
serving the **pre-built** `dist/gh-pages/` on an ephemeral port, modelled on
`scripts/proof-no-orphan-specular.mjs` (`serveDist` + `chromium.launch` + fresh
context per scene). Viewport 1440×900.

**Probes (re-runnable, under `probes/`):**

| probe | purpose |
|---|---|
| `b10-console-census.mjs` | the authoritative per-route × per-interaction census (load · play · controls · switch-away · switch-back · play-after-return) |
| `b10-selectors.mjs` | enumerates the live dock/transport button selectors (how to drive the UI) |
| `b10-dock-geom.mjs` | proves WHY the Scene combobox is "not visible" (the morphing dock) |
| `b10-scene-combo.mjs` | confirms the single Scene combobox + its 8 options after dock-expand |
| `b10-fsm-switch.mjs` | drives the REAL dock Scene-combobox switch tour (the FSM suspend path) |
| `b10-easing-amiga.mjs` | the user's exact B2 repro: play `easing` → switch to `amiga` |

**Evidence:** verbatim JSON ledger at `probes/b10-census-result.json`; screenshots
under `shots/b10-*.png` (per route + the FSM tour + the easing→amiga sequence).

Run: `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js node docs/tranches/I/audit/investigate/probes/b10-console-census.mjs`

---

## 0. Reproduction steps (the interaction battery, per route)

Routes navigated (the brief's full set): `#/` (home) · `#/easing` · `#/spring` ·
`#/sequence` · `#/motion-path` · `#/cube` · `#/amiga` · `#/square`.

On EACH route, in order, with `page.on("console")` + `page.on("pageerror")` +
`page.on("requestfailed")` bucketed BY PHASE:

1. **load** — `goto(#/<scene>)`, settle 1.4 s.
2. **play** — click the group transport play (`button[aria-label*="Play animation"]`, the rainbow pill).
3. **controls** — open the controls surface / tabs / the "Select animation" combobox.
4. **switch-away** — hover the dock to expand it, open the **Scene** combobox, pick the next scene.
5. **switch-back** — same, back to the origin scene.
6. **play-after-return** — re-click play (catches the suspend/resume FSM on return).

> **Dock mechanic (load-bearing for the whole audit).** The bottom dock MORPHS.
> Its expanded layer `.dock-layer--full` — which holds the **Scene** and
> **Controls** comboboxes — is `visibility:hidden; opacity:0; pointer-events:none`
> until the dock is **hovered** (`b10-dock-geom.mjs`). The first census naïvely
> looked for `[title*="<scene>"]` dock nav buttons; there are NONE — switching is
> a hidden `role="combobox"` reached only after a hover-expand. **Any audit that
> does not hover-expand the dock first will silently never exercise the real
> scene-switch path** — exactly the kind of interaction the H gates skipped.

---

## 1. THE MASTER ERROR LEDGER (per route × phase, verbatim)

Counts are distinct console events captured in the authoritative census run
(`b10-census-result.json`). `error` = `console.error`; `pageerror` = uncaught
exception; `warning` = `console.warn`.

| route | load | play | controls | switch-away | switch-back | play-return | verdict |
|---|---|---|---|---|---|---|---|
| **`#/` home** | clean | **2 err+warn + 1 pageerror** | clean | clean | clean | (n/a) | **BROKEN on PLAY** |
| `#/easing` | clean | clean | clean | clean | clean | clean | **clean** |
| `#/spring` | clean | clean | clean | clean | clean | clean | **clean** |
| `#/sequence` | clean | clean | clean | clean | clean | clean | **clean** |
| `#/motion-path` | clean | clean | clean | clean | clean | clean | **clean** |
| **`#/cube`** | **1 err + 1 warn** | **1 err + 1 pageerror** | clean | **2 err + 1 pageerror** | clean | (n/a) | **BROKEN — storms** |
| `#/amiga` | **4 warn (WebGL)** | clean | clean | clean | clean | clean | warnings only |
| `#/square` | clean | clean | clean | clean | clean | clean | **clean** |

### The distinct errors, verbatim with stacks

**E1 — `this.transform is not a function`** (pageerror) — *home › play*

```
TypeError: this.transform is not a function
    at e.transformFramesGrouped (engine-Do5bTwuK.js:20:21227)
    at e._frame              (engine-Do5bTwuK.js:20:22265)
```

Source (un-minified): `AnimationGroup.transformFramesGrouped` (`src/animation/group.ts:373`)
→ `this.transform(groupedValues, t)` inside `AnimationGroup._frame`.

**E2 — `Parse error at offset 0: "......"`** (pageerror) — *cube › play* and *cube › switch-away* (storms every frame)

```
Error: Parse error at offset 0: "......"
    at bo                        (engine-Do5bTwuK.js:19:62788)   ← value.js parseState (empty input)
    at cn.keyFn                  (engine-Do5bTwuK.js:19:63848)
    at c                         (engine-Do5bTwuK.js:19:19351)
    ...
    at Object.zc [as _lerp]      (engine-Do5bTwuK.js:20:3491)
    at Hc                        (engine-Do5bTwuK.js:20:4308)
    at pp.processFrame           (engine-Do5bTwuK.js:38:34007)   ← Animation.processFrame
    at pp.interpFrames           (engine-Do5bTwuK.js:38:33582)   ← Animation.interpFrames
```

Source path: `Animation.interpFrames` (`engine.ts:657`) → `processFrame` (`engine.ts:707`)
→ `_lerp` → `keyFn` → value.js `parseCSSValueUnit("")` on an **empty-string value**.

**E3 — `[KeyframesString] could not serialize the animation to CSS: Parse error at offset 0: "......"`** (warning) — *home › play*, *cube › load*, *cube › switch-away/Square*

```
[KeyframesString] could not serialize the animation to CSS: Parse error at offset 0: "......"
  → KeyframesStringControls-Fe9q5l49.js  (CSSKeyframesToString, src/animation/format.ts:124)
```

**E4 — ` Err x 0  1 |  ^^^ `** (error) — accompanies E2/E3 on the cube path. This is
value.js's pretty-printed parse-error frame (`engine-Do5bTwuK.js:18:2597`); it is
the *console.error* face of the same empty-input parse failure as E2/E3.

**E5 — `[.WebGL-…]GL Driver Message (OpenGL, Performance, GL_CLOSE_PATH_NV, High): GPU stall due to ReadPixels`** (warning ×4) — *amiga › load*

GPU readback stall on the Three.js sphere init. Self-silencing ("this message
will no longer repeat"). Performance smell on `/amiga`, NOT a functional error
— but corroborates **B3** (amiga heavy/janky) and **B8** (glass-ui/scene slow).

---

## 2. Behaviour vs intended, per surface

### B1 — the RAINBOW group-play crash (CONFIRMED, on home AND cube)

- **home › play.** The rainbow group-play pill is present on the start screen
  (`shots/b10-home.png` — bottom dock, rainbow `⏸` pill). Clicking it with **no
  animation selected** throws **E1 `this.transform is not a function`** AND emits
  **E3** the serialize warning. The page does not white-screen but the group draw
  loop dies on the first frame.
- **cube › load+play.** The cube renders and animates (`shots/b10-cube.png` shows
  it mid-rotation, Pause active) yet **E2/E3/E4** fire — on LOAD already (the
  KeyframesString panel tries to serialize an animation whose frames carry an
  empty value), and again per-frame once playing, then **storm** on every
  scene-switch (the `captureActive → suspend → render` re-tick).
- **Intended:** clicking group-play composites + plays with ZERO console output;
  the CSS-twin panel shows valid `@keyframes`.

This is **the H.W0 "......" crash, BACK** — and it is BROADER than the brief's
single path. The H.W0 fix (`src/animation/frame-compiler.ts:155-169`) guards a
blank *keyframe SELECTOR* at **compile** time (`addFrame`, the `start.trim()===""`
throw). The live crash is a blank *VALUE* parsed at **interpolation** time
(`interpFrames → processFrame → _lerp → parseCSSValueUnit("")`) and at
**serialization** time (`CSSKeyframesToString`). Neither path is the guarded
seam. `proof:demo-console-clean` went green because it checks the HOME LOAD only
(home loads clean — the crash needs the PLAY click or the cube route).

### B5 — CSS keyframes editor / `cubic-bezier` timing-function (CONFIRMED, related)

In an earlier hash-nav variant of the census, switching surfaced a SECOND engine
error on the controls re-mount:

```
AnimationOptionError: Invalid value for animation option "timingFunction":
"cubic-bezier" — unknown timing function — pass a callable TimingFunction, a
typed Easing, a registry name, or a cubic-bezier() literal
    at Jf (engine…:38:21630)  ← resolveEasingOption
    at pp.setTimingFunction (engine…:38:29804)
    at pp.setOptions / new fp / new pp   ← CSSKeyframesAnimation construction
    at vp / setup (index…:76)            ← a control component setup()
```

The bare token `"cubic-bezier"` (no `(…)` literal) is passed where a callable /
typed / registry-name / `cubic-bezier()` literal is required. This is the engine
face of **B5** ("`timing-function: custom — no CSS twin`"): a custom/bezier easing
round-trips to an un-parseable token. (Captured in `b10-console-census.mjs`'s
first hash-nav run; the dominant "......" storm displaced it in the dock-switch
run, but it is a real, distinct engine fault on the controls re-mount path.)

### B2 — DFA suspend/resume (PARTIALLY reproduced; `this._gen` is dev-only)

The built dist's group-adapter `suspend()` path did **not** throw `this._gen` on
the dock-switch tour (`b10-fsm-switch.mjs`) — instead each switch re-ticks the
broken cube animation and throws **E2 "......"** through
`captureActive → adapter.suspend → group.pause → render`
(`useSceneMachine.ts:113,146` → `scenePlaybackAdapters.ts:72` → `group.ts` render).
So **the "......" storm IS the dist face of the broken switch**. The brief's
`this._gen` stack is from the **:5174 dev server** (un-minified generator
internal) and rides the SAME adapter seam; the underlying fault — suspend/render
re-entering a malformed engine state — is reproduced here. **easing→amiga blank
controls (B4/B2):** in `b10-easing-amiga.mjs` the easing scene mounts with a live
bezier editor (`hasBezierEditor:true`, 5 comboboxes, 3 play buttons) and ZERO
console errors; the blank-controls symptom is an INTERACTION-state defect on the
switch (not a load crash) and should be re-probed via the dev server for the
source-mapped `this._gen` trace — handing off to the root-cause phase.

### B3 / B8 — amiga + dock/glass perf (corroborated)

`/amiga` emits 4× **E5** GPU-stall warnings on load (ReadPixels stall). No
functional error, but it is the only route with a load-time perf signal —
consistent with the user's "amiga floats / dock animations slow / glass-ui slow"
reports. Quantitative perf belongs to the perf-probe agents; recorded here as the
console-visible corroboration.

### Clean surfaces (the raf-adapter scenes)

`#/easing`, `#/spring`, `#/sequence`, `#/motion-path`, `#/square` produced **ZERO**
console errors/warnings/pageerrors across the full battery (load · play ·
controls · switch · return). **The crash is isolated to the AnimationGroup / cube
engine path** (cube + the home cube-backdrop), NOT the raw-rAF scenes.

---

## 3. SOURCE TRACE (file:line) — where each error originates

| err | minified frame | source (un-minified) |
|---|---|---|
| E1 | `transformFramesGrouped` / `_frame` | `src/animation/group.ts:373` (`this.transform(groupedValues, t)`); `this.transform` seeded at `group.ts:123` from `animation.frames[0].transform` — `undefined` when the child has no frames (home, empty group) |
| E2/E4 | `processFrame` ← `interpFrames` ← `_lerp` ← `keyFn` ← `bo` | `src/animation/engine.ts:707` `processFrame` ← `:657` `interpFrames`; bottoms out in value.js `parseCSSValueUnit("")` (empty VALUE) |
| E3 | `CSSKeyframesToString` | `src/animation/format.ts:124`; caller `KeyframesStringControls.vue:45/149` (`CSSKeyframesToString(animation)`) |
| E5 | WebGL driver | Three.js sphere init on `demo/amiga/*` (ReadPixels) |
| B5 | `resolveEasingOption` ← `setTimingFunction` ← `setOptions` ← `new CSSKeyframesAnimation` | `src/animation/engine.ts` option seam; control-component `setup()` constructs the animation with a bare `"cubic-bezier"` token |

The H.W0 guard that should have covered this: `src/animation/frame-compiler.ts:155-169`
— guards a blank **selector** in `addFrame`, NOT a blank **value** in
`interpFrames`/`CSSKeyframesToString`. **The W0 fix was incomplete exactly as the
brief states.**

---

## 4. ROOT-CAUSE HYPOTHESIS

**One upstream defect, three downstream faces.** A cube/group animation is built
whose keyframes carry an **empty-string value** for at least one property (most
likely the matrix3d / transform key contributing `""` when an enabled layer does
not cover `t`, or a frame seeded before its target/computed-value resolves). That
empty string then:

1. **fails to parse at interpolation** — `interpFrames → processFrame → _lerp →
   parseCSSValueUnit("")` → **E2/E4 "......"** every frame the group ticks (and on
   every suspend-render during a scene-switch — the storm);
2. **fails to serialize** — `CSSKeyframesToString` re-parses the same value →
   **E3** the `[KeyframesString]` warning (on load, because the editor panel
   serializes eagerly);
3. on **home / an empty group**, the group's `this.transform` is never seeded
   (`group.ts:123` only assigns it from `frames[0].transform`, which is absent),
   so the very first `transformFramesGrouped` throws **E1 `this.transform is not a
   function`**.

The H.W0 belt guarded the *selector* seam (`addFrame`, compile-time) but the
*value* travels a different, unguarded path (`interpFrames`/`format`, runtime).
The correct, idiomatic cure is at the engine seam (inv-16: engine src is in
scope this tranche): **(a)** seed `AnimationGroup.transform` to an identity/no-op
when no child supplies one (never call `undefined`), and **(b)** make the
value-parse path fail-explicit / skip on empty input the SAME way the selector
path does — value.js returning a typed empty-input result is the paired HANDOFF
the W0 note already names. B5's bare-`"cubic-bezier"` token is a related
fail-explicit gap on the option seam (a custom easing must round-trip to a
`cubic-bezier()` literal or a typed `Easing`, never the bare keyword).

**Gate implication (the headline).** Every clean H gate
(`proof:demo-console-clean`, `proof:browser`) certified GREEN because they assert
HOME-LOAD + source-shape — none CLICKS the rainbow play, none SWITCHES scenes via
the morphing dock, none reads the per-frame console during playback. A real
runtime gate must: load `#/cube` AND `#/` (home), **click the rainbow group-play**,
**hover-expand the dock and switch scenes**, and assert ZERO `pageerror` +
ZERO `console.error` across the whole battery — exactly this probe's contract.

---

## 5. Screenshots (evidence)

- `shots/b10-home.png` — home start screen; the rainbow group-play pill (bottom dock) that throws E1 on click.
- `shots/b10-cube.png` — `/cube` playing (renders fine) while E2/E3/E4 storm the console.
- `shots/b10-amiga.png` — `/amiga` (E5 GPU-stall warnings).
- `shots/b10-easing.png`, `b10-spring.png`, `b10-sequence.png`, `b10-motion-path.png`, `b10-square.png` — the clean raf-adapter scenes.
- `shots/b10-scene-combo-open.png` — the Scene combobox expanded (8 options: Home/Cube/Amiga/Square/Easing/Spring/Sequence/Path) — the switch mechanic.
- `shots/b10-ea-1-easing-load.png` · `b10-ea-2-amiga-after.png` · `b10-ea-3-easing-back.png` — the easing→amiga→easing FSM sequence.
- `shots/b10-fsm-*.png` — the full dock-driven scene-switch tour.

---

## 6. Hand-off to root-cause + authoring

- **Engine (inv-16, in scope):** the empty-string-value parse storm (E2/E3/E4) +
  the unseeded `this.transform` (E1) are ONE engine defect → seed a no-op
  transform + make the value-parse/serialize path fail-explicit on empty input.
- **Option seam:** B5's bare `"cubic-bezier"` token → a custom easing must
  round-trip to a `cubic-bezier()` literal / typed `Easing`.
- **FSM (B2):** re-probe easing→amiga on the **:5174 dev server** for the
  source-mapped `this._gen` suspend trace + the blank-controls state; the dist
  shows the suspend seam re-enters the malformed engine state.
- **Gate regime (the headline):** author a runtime/interaction console gate that
  drives the rainbow play + the morphing-dock scene switch and asserts a clean
  console across the battery — the permanent cure for the H gate-blindspot.
