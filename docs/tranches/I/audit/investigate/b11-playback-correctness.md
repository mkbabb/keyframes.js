# b11 — PLAYBACK CORRECTNESS (Tranche I investigation)

**Agent:** `[b11-playback-correctness]`
**Question:** For each scene, does play/pause/reset actually animate the target correctly? Does the rainbow group-play animate? Does the timeline scrub? What ACTUALLY animates vs errors/no-ops?
**Method:** PLAYWRIGHT live against the BUILT `dist/gh-pages/` (the harness proven in `scripts/proof-no-orphan-specular.mjs`: `serveDist` on port 0 + chromium via `createRequire(KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js).require("playwright-core")` + `openSceneFresh` → `${base}/#/${scene}`). Probes capture `page.on("console")` + `page.on("pageerror")` VERBATIM, diff the target's transform/opacity/position before/after, and screenshot.
**Probes (re-runnable):**
- `docs/tranches/I/audit/investigate/probes/b11-playback-correctness.mjs` — group-play + scrub + reset + keyframes-tab, every scene
- `docs/tranches/I/audit/investigate/probes/b11-dom-inspect.mjs` — enumerate the real controls (found the rainbow group-play button)
- `docs/tranches/I/audit/investigate/probes/b11-b1-trace.mjs` — full B1 stack + offending input
- `docs/tranches/I/audit/investigate/probes/b11-scene-detail.mjs` — idle vs toggle vs reset vs keyframes per scene
**Shots:** `docs/tranches/I/audit/investigate/shots/b11-<scene>-grouplay.png`, `b11-b1-cube.png`.
**Summary JSON:** `docs/tranches/I/audit/investigate/b11-playback-summary.json`.

---

## HEADLINE: the rainbow group-play CRASHES on cube and the group never animates

Clicking the rainbow group-play button (`aria-label="Play animation"`) on the **cube** scene throws an UNCAUGHT `pageerror` on the first interpolation tick, and the cube's matrix/rotation group animation **never paints a transform** — `.cube` stays `transform: none` for the entire playback. This is **B1, REPRODUCED from the built dist** (no dev server needed).

### Verbatim console / pageerror (cube, on group-play click)

```
PAGEERROR Error: Parse error at offset 0: "......"
Error: Parse error at offset 0: "......"
    at bo (…/assets/engine-Do5bTwuK.js:19:62788)
    at cn.keyFn (…/assets/engine-Do5bTwuK.js:19:63848)
    at c (…/assets/engine-Do5bTwuK.js:19:19351)
    at …/assets/engine-Do5bTwuK.js:20:1279
    at …/assets/engine-Do5bTwuK.js:20:1742
    at c (…/assets/engine-Do5bTwuK.js:19:19351)
    at Object.zc [as _lerp] (…/assets/engine-Do5bTwuK.js:20:3491)
    at Hc (…/assets/engine-Do5bTwuK.js:20:4308)
    at pp.processFrame (…/assets/engine-Do5bTwuK.js:38:34007)
    at pp.interpFrames (…/assets/engine-Do5bTwuK.js:38:33582)
```

This stack matches the bug report EXACTLY: `interpFrames → processFrame → value.js parseState (empty input)`. The B1 report's `format.ts:86 / CSSKeyframesToString` path is a **DIFFERENT, second symptom (B5)** — see below.

### Behavioral proof the group is dead (not just noisy)

`/tmp/b11-cube-focus.mjs` sampled `.cube`'s computed transform every 200ms for 2s after clicking play:

```
+200ms…+2000ms: transform = none  (every sample)
distinct transforms: 1/10   ← the matrix NEVER applies
pageerrors during play: 1   ← thrown ONCE on the first tick; the loop then dies
```

The throw escapes `interpFrames` on the first rAF tick, killing the group draw loop before it paints. The earlier "26/39 nodes changed" reading is the **idle-hover bob** (`.idle-hover`, a separate always-on animation) — it masks the fact that the actual matrix/rotation group playback produces ZERO motion.

---

## ROOT CAUSE (decoded from the minified engine chunk)

Decoded `dist/gh-pages/assets/engine-Do5bTwuK.js`:

- **`bo(e,t)`** is the parser wrapper:
  `let n=e.parseState(t); if(n.isError){ … throw Error(\`Parse error at offset ${e}: "...${a}..."\`) }`
  With `a = t.slice(offset-8, offset+8)` and the input `t === ""`, the message renders literally `Parse error at offset 0: "......"`. **The string being parsed is EMPTY.** The six dots are the two `...` literals wrapping an empty slice — the "`......`" signature IS "empty input fed to value.js's parser."

- **`zc` (`_lerp`)** is the **computed-value** lerp. Decoded body:
  `…Cannot interpolate computed values without a target element.…let o=Mc(); let s=t._computedCache; if(s===undefined||s.target!==a||s.epoch!==o){ let e=Fc(n,a), c=Fc(r,a), … } …`
  It (re)resolves the computed endpoints `Fc(start,target)` / `Fc(stop,target)` against the DOM — reading `getComputedStyle` on the target and re-parsing the resolved string. **One endpoint resolves to `""`**, and that empty string reaches `bo` → throw.

- **`Hc`** is the lerp dispatch: numeric → `pn` (lerp); `color` → `Bc`; **computed → `zc`**; else identity. The cube's `transform` iv is a computed/matrix iv, so it dispatches to `zc`.

- The chain is therefore (mapping minified → source):
  `interpFrames (engine.ts)` → `processFrame (engine.ts:769)` → `lerpValue`/`Hc` → computed iv → `zc` → `Fc(endpoint, target)` → value.js memoized parse (`cn.keyFn` = the memoize key fn) → **`bo("")` throws**.

**Why empty?** The cube animation is built (`demo/cube/useCubeAnimations.ts`) from `transform: { matrix3d: FunctionValue }` + `transform: { rotate3d: "…" }` via `fromVars`. These are **computed/function-valued transforms** whose endpoints get DOM-resolved at interp time. When `getComputedStyle(target).transform` reads back `none` (or the sub-extraction yields an empty matrix cell), value.js is handed `""` and the parser dies at offset 0. The matrix path is the only scene whose group iv goes through the computed `zc` branch — which is why **only cube crashes**; amiga/square/sequence/motion-path animate without the parse error.

**This is the H.W0 "......" crash REGENERATED.** H.W0 guarded the `FrameCompiler` blank-selector path and the `CSSKeyframesToString` serialization path, but NOT the `processFrame → lerpValue → computed-endpoint resolve → empty-parse` path. `proof:demo-console-clean` went green by checking the HOME LOAD; it never clicked group-play on cube. **The gate certified a broken product** — the exact gate-blindspot this tranche exists to close.

---

## PER-SCENE PLAYBACK MATRIX (live, built dist)

| Scene | auto-plays? | group-play TOGGLE animates target? | scrub animates? | group-play pageerror? | verdict |
|---|---|---|---|---|---|
| **cube** | no | **NO** — `.cube` stays `transform:none`; only idle-bob moves | partial (timeline ball moves; matrix dead) | **YES — B1 `Parse error … "......"`** | **BROKEN (B1)** |
| **amiga** | no | barely (1/8 nodes; the 3D sphere is Three.js-owned, not engine-driven on the sampled DOM) | no DOM delta (canvas-internal) | no | suspect — see B3 (b03 agent owns "floats around") |
| **square** | no | 1/8 (timeline ball only; the square target shows no sampled transform delta) | timeline ball only | no | suspect — target may not be moving (see B6 drag) |
| **easing** | **yes** ("Pause animation" on load) | toggling pauses it (0/17 after) — only 2/17 idle-animate | scrub moves the ball 2/21 | no | the ball animates but WEAKLY; B4 (lost curve editor) is a control-surface loss, not a playback crash |
| **spring** | **yes** | toggling pauses (0/36) | scrub moves preset rows 11/46 (good) | no | playback OK; scrub good |
| **sequence** | no | **YES — 22/40 nodes animate** (the staggered reel sweeps) | scrub moves rows 11/50 | no | **WORKS** |
| **motion-path** | no | **YES — traveller sweeps the path** (2/40: `.mp-traveller` moves) | scrub moves traveller 2/50 | no | **WORKS** |

Notes:
- **cube** is the only HARD crash. Its group playback is fully dead behind the B1 throw.
- **easing/spring** auto-play on mount (raw-rAF scenes); the rainbow button reads "Pause animation" at load. They animate but thinly on the sampled set — the easing ball moves only ~2 nodes; this aligns with B4 (the easing curve/timing editor was over-removed) and the user's "blank controls" reports, though B11's scope is the *playback*, which does run.
- **amiga/square** show almost no engine-driven DOM transform delta. amiga is Three.js (canvas-internal, so the DOM fingerprint can't see it — defer the "floats around" B3 to that agent). square's target not moving on group-play is worth a cross-check with the B6 drag-persistence agent.
- **`Reset animation`** (dock button, `aria-label="Reset animation"`) was present in DOM-inspect but my headless click resolved `clicked=false` across scenes — it sits in the bottom dock which collapses/teleports when the controls panel is open; this is a probe-targeting limitation, NOT evidence the reset is broken. Recorded as an open verification item, not a finding.

---

## B5 (the second, SEPARATE symptom on cube) — load-time, NOT the crash

On cube LOAD (before any click) the console already shows:

```
[warning] [KeyframesString] could not serialize the animation to CSS: Parse error at offset 0: "......"
[error]  Err x     0
 1 |
     ^^^
```

This is `KeyframesStringControls.vue:94 updateCSSAnimationKeyframesStringFromAnimation` → `CSSKeyframesToString` (format.ts) throwing because the cube's matrix/function-valued transform has **no CSS twin** to serialize — caught and degraded to the `/* timing-function: custom — no CSS twin (see console) */` placeholder (B5). This is the SAME empty-parse `"......"` failure mode, but on the *serialization* path, caught (a `console.warn`), not the *interpolation* path (uncaught `pageerror`, B1). **Both share one root flaw: the cube's computed/function-valued transform produces an empty string that value.js's parser rejects.** A real fix must address the empty-string-to-parser at the engine seam, which heals B1 (interp) and B5 (serialize) together. (inv-16: engine `src/animation` is in-scope this tranche.)

---

## B9 — source-map 404s are DEV-ONLY (not reproduced in dist)

The built dist emits NO `.map` references; the probe recorded **0 failed/404 requests** across all scenes. The B9 `ENOENT easing-icon-sm.svg` + 47 source-map errors are a **dev-server-only** (`:5174`) artifact (a dev-vs-build icon-resolution + sourcemap discrepancy). Out of B11's playback scope; flagged for the build/asset agent.

---

## ROOT-CAUSE HYPOTHESIS (for the authoring + root-cause phases)

1. **B1 (primary):** The animation engine's computed-value lerp (`lerpComputedValue` / `getComputedValue` in value.js, reached from `processFrame`) feeds value.js's CSS parser an **empty string** when a target's computed transform resolves to `none`/empty (the cube's `matrix3d(FunctionValue)` + `rotate3d` transforms). value.js throws `Parse error at offset 0: "......"` instead of treating an empty/`none` resolution as a no-op or identity. The throw escapes `interpFrames` and kills the group draw loop on tick 1 → **cube group-play paints nothing**.
2. **The gate blindspot:** `proof:demo-console-clean` asserted on HOME LOAD only and never clicked group-play on cube — so the H.W0 fix (which guarded the FrameCompiler/serialize paths) left the interp path uncovered and the gate stayed green. **The cure is a runtime gate that CLICKS the rainbow group-play on every scene and asserts (a) zero pageerrors and (b) the target actually moves (a transform delta), not a source-shape check.**
3. **Engine transposition (gestalt, not workaround):** the empty/`none` computed resolution should be handled at the engine seam — either the engine must not emit an empty endpoint into the computed lerp, or value.js's parser must treat empty/`none` as identity. A `try/catch` swallow would be a workaround; the idiomatic fix is to make an empty computed resolution a well-typed identity (the transform is simply `none` → no contribution), so B1 (interp) and B5 (serialize) heal at one source.

---

## EVIDENCE INDEX
- B1 verbatim stack + empty-input root cause → `b11-b1-trace.mjs` output (above)
- cube matrix never paints (10×200ms `transform:none`) → `/tmp/b11-cube-focus.mjs` output (above)
- per-scene matrix → `b11-scene-detail.mjs` + `b11-playback-summary.json`
- control enumeration (rainbow button identity) → `b11-dom-inspect.mjs`
- screenshots → `docs/tranches/I/audit/investigate/shots/b11-cube-grouplay.png`, `b11-b1-cube.png`, and per-scene `b11-<scene>-grouplay.png`
