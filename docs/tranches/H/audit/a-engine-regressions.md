# Tranche H Deep Audit — Lane `a-engine-regressions`

**Charge:** audit the Tranche G engine + demo changes for LIVE regressions —
the blend leaf (G.W17), DrawSVG/`.finished` (G.W13), `adoptCompiled` (G.W19),
the orbital rotate3d + reverse-path (G.W18), the rAF-leak fix (G.W9), the store
singleton (G.W8), the template-ref/rename (G.W7), and G.W4 fail-explicit (in the
same engine commit). Do any correlate with the observed defects (D1–D14)?
Live-verify each in the running demo.

**Method:** live demo at `http://localhost:5174/` driven via Playwright MCP
(navigate / evaluate / console). Console error capture across every route +
scene swap. Engine proofs re-run (`proof:blend`, `proof:orbital-rotate3d`,
`proof:finished`, `proof:interpolate-anything`, `scene-raf-leak.test.ts`).
Source read at `src/animation/{engine,group,format}.ts`, `demo/app/*`,
`demo/{easing,spring}/use*Demo.ts`, `demo/@/components/.../KeyframesStringControls.vue`.
Git: the two G commits `3d352a3` (engine) + `1b9b05f` (frontend).

**Verdict in one line:** the engine *correctness* waves (W17 blend, W18 orbital,
W13 finished/drawsvg, W19 adoptCompiled, W9 rAF-leak) are sound and proof-green —
NOT regressions. But **two LIVE, reproducible, repeating uncaught engine
exceptions** ship in 4.1.0, both from G's "fail-explicit" / interpolation
surface meeting a demo consumer that was not adapted at the same altitude:
H-A1 (`serializeEasing` throws on every Cube load — G.W4) and H-A2 (the
`"......"` lerp parse-error — the D6 root cause). A third structural finding
(H-A3) is the D12 root cause: the rAF-leak fix's "no-KeepAlive + onScopeDispose"
architecture has NO state-suspend/restore path for the new scenes.

---

## H-A1 — `serializeEasing` THROWS uncaught on EVERY Cube load (G.W4 regression) — SHIP-in-H [HIGH]

**Live anchor.** Navigate `#/cube` → the console throws **4×** per load, every
load, reproducibly:

```
AnimationOptionError: Invalid value for animation option "timingFunction":
  [function anonymous] — a custom TimingFunction has no CSS animation-timing-function
  representation — attach a faithful Easing.css twin, or use a registry name /
  cubic-bezier() / linear() literal
    at serializeEasing (src/animation/format.ts:24:9)
    at CSSKeyframesToString (src/animation/format.ts:82:24)
    at updateCSSAnimationKeyframesStringFromAnimation
        (demo/@/components/custom/animation-controls/keyframes/KeyframesStringControls.vue:46)
    at KeyframesStringControls.vue:140  (a Vue post-flush watcher)
```

**Root cause.** G.W4 (commit `3d352a3`, `format.ts`) changed `serializeEasing`
from a silent "linear" degrade to a typed THROW on a custom-closure easing with
no `Easing.css` twin. Correct as an *engine policy*. But the demo's CSS-string
readout consumes it on an **always-on, unconditional** path:
`KeyframesStringControls.vue:94` —

```ts
const updateCSSAnimationKeyframesStringFromAnimation = async () => {
    cssKeyframesString.value = await CSSKeyframesToString(animation, getTmpAnimationName());
    ...
};
```

— with **no `try/catch`** (the only `try` in the file is at line 173, the editor
*apply* path, not this readout). The Cube's preset animations (`Rotations`,
`Matrix`) carry programmatic-closure timing functions with no `.css` twin, so
the watcher-driven readout throws into Vue's post-flush queue on mount. G.W4
shipped without auditing this consumer; `proof:roundtrip-easing` tested the
*engine* in isolation, not the demo's serializer consumer → the regression was
invisible to the gate.

**Why it's a real defect (not just noise).** The throw aborts the
`cssKeyframesString` assignment, so the Keyframes-string editor tab renders
stale/empty for any custom-easing animation, and 4 uncaught errors land in
every Cube session (the default landing scene). It is a per-frame-class
brittleness bite of exactly the kind C/D/E hardened against.

**Gestalt fix (one motion, pick the higher-altitude one):**
- *Engine-faithful, preferred:* the Cube presets that use closure easings get a
  faithful `Easing.css` twin (cubic-bezier/linear literal) at construction —
  then `serializeEasing` round-trips losslessly and the fail-explicit policy is
  *satisfied*, not *swallowed*. This is the DRY answer (the curve flows through
  the type system as `{ fn, css }`, the W4 design intent).
- *Consumer-faithful, fallback:* the demo readout degrades gracefully — wrap the
  single call site so a non-serializable easing renders a
  `/* timing-function: custom */` comment placeholder in the CSS string instead
  of aborting. The readout is a *display*, not a contract surface; it must never
  throw into a render watcher.
- Do NOT re-introduce the silent "linear" degrade (that was the bug W4 fixed).

**Falsifiable instrument:** `proof:demo-usability` (Playwright) asserts **zero
console errors** on a fresh `#/cube` load (currently RED — 4 errors). Plus a
unit lock: `CSSKeyframesToString(cubeRotationsAnimation)` resolves (no throw)
once the presets carry `.css` twins.

---

## H-A2 — the `"......"` lerp parse-error: D6 root cause + an engine interpolation gap — SHIP-in-H [HIGH]

**Live anchor.** During scene transitions involving the home/start-screen (e.g.
`#/easing` → `#/spring`, captured via full-session console), the engine throws
**repeatedly**:

```
Error: Parse error at offset 0: "......"
    at _lerp (value.js)
    at CSSKeyframesAnimation.processFrame (src/animation/engine.ts:576 [running build])
    at CSSKeyframesAnimation.interpFrames (src/animation/engine.ts:516 [running build])
```

**Root cause (traced to a single literal).** The ONLY `"..."` literal in the
entire tree is `demo/@/components/custom/editor-shell/EditorStartScreen.vue:49`
— `ellipsis: "..."`, passed to `AnimatedText` with class `dot-fade`. The
`"......"` (the dots DOUBLED) is value.js's string-lerp concatenating a
start-frame `"..."` and a stop-frame `"..."`: a `CSSKeyframesAnimation` is being
fed the hero ellipsis text as a non-interpolable string leaf, and value.js's
`_lerp` tries to parse `"......"` as a CSS value and throws. The engine's
`processFrame` (`engine.ts:778-780`) trusts the compiled `iv` carriers and calls
`lerpValue(eased, iv)` with **no guard** for a leaf whose start/stop is a bare
non-numeric / non-color text string — so the textual ellipsis reaches value.js
and aborts the frame.

**The two-headed defect (both confirmed live):**
1. **D6 — the typing dots are broken.** `AnimatedText` (post-F.W16) splits on
   *whitespace* into WORDS; `"..."` is ONE word, so it renders a single span and
   `@keyframes dotFade { 0%,100%{opacity:0} 50%{opacity:1} }` blinks all three
   dots *together* as a block. The classic staggered typing cascade
   (`.` → `..` → `...`) is gone — the per-word `offset` stagger never applies
   because there is only one "word". (`AnimatedText.vue:62-64, 93-107`.)
2. **An engine interpolation hardening gap.** "Interpolate ANYTHING" is the
   library's headline, and `proof:interpolate-anything` locks multi-arg
   transform/filter/gradient/color midpoints — but a **bare non-interpolable
   text leaf is NOT in the corpus**, and the engine has no fail-soft for it
   (`engine.ts:778`). A text leaf should be a discrete/hold leaf (snap at 50%,
   the CSS discrete-animation rule), NOT routed into value.js's numeric/color
   `_lerp`.

**Gestalt fix (one motion):**
- *Demo (D6 proper):* make the typing dots a real staggered typing animation —
  three discrete dot spans (or a single `width`/`steps()` reveal over `...`),
  per-dot `animation-delay`. The hero ellipsis must NEVER enter a
  `CSSKeyframesAnimation` value position; it is decorative CSS only.
- *Engine (the deeper, idiomatic fix):* the compile/interp pipeline classifies a
  leaf whose value is a non-numeric, non-color, non-unit STRING as a **discrete
  (hold-then-snap)** leaf — interpolate by snapping at the segment midpoint
  rather than handing it to value.js `_lerp`. This is the CSS-correct behaviour
  for discrete properties (`content`, keyword strings) and turns a hard crash
  into spec-faithful motion. (Confirm the leaf-class seam is value.js's
  `flattenObject`/`createInterpVarValue` — the discrete-classification may be a
  **value.js-HANDOFF** if the parse happens entirely inside value.js; the
  engine-side guard in `processFrame` is the kf-side belt-and-suspenders.)

**Falsifiable instrument:** a `proof:interpolate-anything` corpus row for a bare
text leaf (`{ label: "a" }` → `{ label: "b" }`) that asserts a discrete snap and
**no throw**; plus `proof:demo-usability` zero-console-error gate covering the
home→scene transition (currently RED).

---

## H-A3 — the D12 scene-state corruption: the rAF-leak architecture has NO suspend/restore for the new scenes — SHIP-in-H [CRITICAL, the D12 root cause]

**Anchors (source + live).**
- `demo/app/App.vue:108-137` + `:268` + `useSceneSwap.ts:18` +
  `useSceneVisibilityPause.ts:7`: the scene host is a **bare keyed `<Suspense>`,
  NO `<KeepAlive>`** — *"every swap is a full unmount/remount"*. (The
  `router.ts:12` doc comment still claims *"KeepAlive + dynamic component"* — a
  STALE comment; there is no KeepAlive anywhere. Fix the comment too.)
- G.W9 (`useSpringDemo.ts:239`, `useEasingDemo.ts:185`) correctly re-homed the
  loop cleanup from the dead `onDeactivated` to `onScopeDispose(() =>
  playback.stop())`. This is a genuine FIX (the leak is real; `scene-raf-leak.test.ts`
  passes, 2/2). **But its corollary is the bug:** on every scene swap the new
  scene is *fully disposed* — its loop stops AND all its local state evaporates.
- The only state-preservation path is `usePlaybackSnapshot.ts` +
  `useSceneGroupSync.ts`, and it snapshots ONLY
  `group.animations[*].{t, reversed, iteration}` (`usePlaybackSnapshot.ts:30-36`).

**The corruption mechanism (root-caused).** The new scenes (easing / spring /
sequence / motion-path / starting-style) drive their motion with *raw rAF loops
and local refs* (`useSpringDemo`'s `liveSpring`, `target`, per-track positions;
`useEasingDemo`'s `currentEasingName`, `bezierControlPoints`, `progress`,
`isPlaying`). Each exposes a **decorative placeholder** `contractAnim`
(`useSpringDemo.ts:252-268`, `useEasingDemo.ts:268-284`,
`StartingStyleScene.vue:24-40`) *solely* to satisfy the bottom-bar transport's
`AnimationGroup` requirement — it "drives no motion" (their own comments).

So `useSceneGroupSync`'s `watch(() => sceneRef.value?.animationGroup)` **does**
fire for these scenes and snapshots the *placeholder's* `{t,reversed,iteration}`
— never the real spring/easing/path state. On return the scene re-mounts fresh:
`liveSpring` is `new SpringProgress(...initial:0)`, `target=1`,
`currentEasingName="ease"`, `isPlaying=true`. **The actual scene state is
destroyed; only a dummy is "restored."** That is exactly D12's *"switching
easing→cube→back leaves the controls/options INVALID… the play/pause state is
not restored/suspended."*

**Compounding desync (also D12).** `restoreGroupPlaybackState` sets
`group.paused = true` then conditionally `group.resume()`
(`usePlaybackSnapshot.ts:75-83`), but the new scenes ALSO bind the placeholder's
`paused` reactively to their fresh `isPlaying` ref
(`useSpringDemo.ts:270-272`, `useEasingDemo.ts:288-290`). The restore and the
fresh-`isPlaying` watcher race to own `animationGroup.paused`, so the bottom-bar
play indicator and the real preview loop can disagree — the "stuck in an
impossible routed state" symptom.

**Live corroboration.** Under repeated hash-nav between scenes the route/scene
drifted without user action (e.g. landed on `#/cube?anim=Rotations` while I had
asked for `#/easing`; a cube animation name `?anim=Rotations` appearing on the
HOME route; the contract-anim name `?anim=Easing+Preview` / `?anim=Spring+Preview`
leaking into the URL). This is the `useSceneUrl` model→URL writer
(`useSceneUrl.ts:36-55`, debounced `router.replace`) racing the
`restoreStateFromParam` `beforeEach` (`router.ts:42-54`, which also fires a
deprecated `next()` — console warns) + the localStorage active-scene redirect
(`useSceneRouter.ts:19-32`). The `?anim=` query is scene-scoped but is carried
across scene namespaces, so a stale anim name lands on the wrong scene's store.

**Gestalt fix (the user explicitly asked for "the most modern/robust facility —
a formal state machine + a store: vueuse / Pinia / createGlobalState").** The
*architectural* answer, not a patch:
- **One scene+playback state machine** (a small XState-style finite machine, or a
  typed `createGlobalState` reducer) that owns the explicit states
  `{ idle | playing | paused | suspended }` per scene and the transitions
  `switchScene(suspend current → restore target)`. Make suspend/restore a
  *scene contract method* (`captureState()/restoreState()`), so EACH scene —
  AnimationGroup-based AND raw-rAF — round-trips its OWN full state (spring
  value/velocity/target, easing name/points/progress, sequence transport
  position), not a dummy contract anim. The placeholder-`contractAnim` pattern is
  the smell: it makes `useSceneGroupSync` think it is preserving state when it is
  preserving nothing.
- The `?anim=` URL sync must be **scene-keyed** (one writer, one source of truth,
  gen-guarded across the scene-id too) so a stale anim name can never cross a
  scene boundary. Drop the deprecated `next()` (`router.ts:49`) for a returned
  value.
- KeepAlive-vs-remount is NOT the lever to flip back (it broke the async loader,
  per `App.vue:110` — keep the bare `<Suspense>`); the lever is an EXPLICIT
  capture/restore contract that does not depend on component instance survival.

**Falsifiable instrument:** `proof:scene-state` — mount easing, set
`bezierControlPoints` + pause, `switchScene("cube")`, `switchScene("easing")`,
assert the points + paused state are restored byte-identically; and a spring
variant asserting `liveSpring.value/velocity/target` round-trip. Plus a
URL-namespacing lock: a `?anim=` belonging to scene A never appears on scene B.

---

## H-A4 — G.W17 blend leaf (add / weighted) — ALREADY-SOTA (a fix, not a regression) — RECORD

`group.ts:295-355` (commit `3d352a3`). The pre-G guard tested a *bare* `ValueUnit`
but the composited leaf is a `ValueUnit[]`, so `add` + `weighted` both silently
collapsed to `replace` — DEAD CODE. G.W17 corrects it to an element-wise blend
over `Math.min(existing.length, incoming.length)` with a per-element
`isNumericUnit` guard, in place (zero-alloc intact), un-clamped (GL-6).
`node scripts/proof-blend.mjs` → PASS (5 clauses); `test/blend.test.ts` 4 locks.
**Live:** the Cube renders one composited `rotate3d(-1, 1, 0, 30deg)` (live
probe) and its multi-layer group composites without error. No regression; this
is exemplary correctness recovery. RECORD as a closed win.

---

## H-A5 — G.W18 orbital rotate3d + reverse-path — ALREADY-SOTA — RECORD

`OrbitalDrag.vue` (commit `1b9b05f`). The gratuitous quaternion→Euler→`Rx·Ry·Rz`
re-apply round-trip (~33 lines + gimbal risk) was removed; the render now reads
ONE native `rotate3d()` off the quaternion's `quat.getAxisAngle` into a reused
`vec3` out-param (zero-alloc), with the Euler triple kept ONLY for the
slider/share v-model (the reverse path re-seeds the quaternion via a `watch` on
`model.value.rotate`). `node scripts/proof-orbital-rotate3d.mjs` → PASS (6
clauses incl. gimbal-pole parity + reverse-path). **Live:** the Cube container's
inline transform is `rotate3d(-1, 1, 0, 30deg)` — native, single-clause, exactly
as designed. No regression. (Note for D11/interactivity: the orbital drag is the
*reference* interaction the new scenes should emulate — see the D11 lane.)

---

## H-A6 — G.W13 `.finished` + DrawSVG — sound, additive — RECORD

`group.ts:529-541` `get finished()` returns the single held `_playingPromise ??
Promise.resolve()` (no second completion lifecycle); mirrored on
Animation/CSSKeyframesAnimation/Sequence. `draw-svg.ts` is a clean, additive,
value.js-free module behind `loadAnimationEngine()`. `node
scripts/proof-finished.mjs` → PASS (incl. the "one-lifecycle, no parallel
completion field" clause); `proof:drawsvg` exists. No regression, no demo
consumer broken. RECORD.

---

## H-A7 — G.W19 `adoptCompiled()` — sound, the seam tightened — RECORD

`engine.ts` `adoptCompiled(source)` transplants `{options, compiler, unflatten}`
atomically and re-binds `this.options === this.compiler.options` (the `6e29236`
live-options invariant), recomputing the stable key-set; the demo's three-field
reach-in collapsed to one verb (`useKeyframeOps.ts`). `proof:adopt-compiled`
exists. No live error observed referencing `adoptCompiled`. The live errors
(H-A1/H-A2) are in `format.ts`/`processFrame`, NOT this seam. RECORD — but it is
the *correct* place for the H-A1 fix to land: if the Cube presets are given
`.css` twins, they flow through `adoptCompiled`'s atomic transplant intact.

---

## H-A8 — G.W9 rAF-leak fix — sound; the architecture is the D12 problem (see H-A3) — RECORD + cross-link

The fix itself (`onScopeDispose(stop)` replacing the dead `onDeactivated`) is
correct and tested (`scene-raf-leak.test.ts` 2/2 PASS; `useSceneVisibilityPause`
honesty contract is clean). It is NOT a regression. Its *consequence* — full
dispose on every swap with no state-restore for raw-rAF scenes — is the D12 root
cause, fully treated in **H-A3**. Cross-linked here so the two are never split.

---

## H-A9 — G.W8 store singleton (`createGlobalState`) — sound — RECORD

`useAssetManager` wrapped in `createGlobalState` (one ref per key), `resetAllStores`
symmetrized, dead `stateVersion` deleted (`useAssetManager.ts`, commit `1b9b05f`).
`proof:asset-store-singleton` exists. The asset-manager / playground is a separate
surface from the scene shell; no live error correlates. Note: the
`scenePlayback.ts` map is a *plain module-level `Map`* (not a `createGlobalState`)
— acceptable as ephemeral in-memory CRUD, but if H-A3's state machine subsumes it,
fold it into the same store facility (DRY). RECORD.

---

## H-A10 — G.W7 template-ref / file renames — sound — RECORD

8 template-bound `ref<…>(null)` → `useTemplateRef`; `useToastGuard→toastGuard`,
`timelineTypes`/`timingCurveUtils` re-homed out of `composables/`; `TopDock→
ChromeDock` (commit `1b9b05f`/`3d352a3`). Mechanical, idiomatic. **Live:** the
scene host `useTemplateRef("sceneHostEl")` (`App.vue:183`) resolves and receives
focus on transition; no null-ref error observed. No regression. RECORD.

---

## Cross-lane correlation (engine-lane findings that DIRECTLY ground other Ds)

- **D6 (typing dots broken)** → root-caused here as **H-A2** (the `"......"`
  engine parse-error + the word-granular `AnimatedText` collapse). The D6 lane
  (`a-typing-dots.md`) owns the visual fix; this lane owns the engine
  hardening + the live crash anchor.
- **D12 (scene-state corruption + state machine)** → root-caused here as
  **H-A3**. CRITICAL. The architectural prescription (formal state machine +
  per-scene capture/restore contract, scene-keyed URL) is the gestalt answer the
  user asked for.
- **D9 / D5 (@mbabb popover no longer opens / dock lag)** → reproduced live:
  the `@mbabb menu` `DockDropdownTrigger` (`App.vue:18-21`) does NOT open on a
  synthetic click OR double-click (`aria-expanded` stays `false`, no
  `[role=menu]`). This matches MEMORY.md's "glass-ui dock buttons require
  double-click; fix in glass-ui root." It is **glass-ui-HANDOFF** (the
  `DockDropdownTrigger` + reka-ui `DropdownMenuTrigger as-child` pointer-event
  forwarding), NOT a kf engine regression — but the kf-side composition
  (`App.vue:17-72`) is the integration point H must verify once glass-ui's AW
  tranche lands. TAG: glass-ui-HANDOFF.
- **value.js string-leaf discrete classification** (the deeper half of H-A2)
  may be a **value.js-HANDOFF** if the parse happens entirely inside value.js's
  `_lerp`/`flattenObject`; the engine-side `processFrame` guard is the kf-side
  fix that lands in H regardless.

---

## Dispositions

| # | Finding | Disposition |
|---|---------|-------------|
| H-A1 | `serializeEasing` throws 4× on every Cube load (G.W4) | **SHIP-in-H** (give Cube presets `.css` twins; readout never throws) |
| H-A2 | `"......"` lerp parse-error = D6 root cause + interp gap | **SHIP-in-H** (demo: real typing dots; engine: discrete string-leaf) + **value.js-HANDOFF** (string discrete-classification if it lives in `_lerp`) |
| H-A3 | D12 scene-state corruption (no suspend/restore for raw-rAF scenes) | **SHIP-in-H** (formal scene+playback state machine + per-scene capture/restore contract + scene-keyed URL) |
| H-A4 | G.W17 blend leaf | **RECORD** (a fix; proof-green; ALREADY-SOTA) |
| H-A5 | G.W18 orbital rotate3d + reverse-path | **RECORD** (proof-green; live-verified; ALREADY-SOTA) |
| H-A6 | G.W13 `.finished` / DrawSVG | **RECORD** (sound, additive) |
| H-A7 | G.W19 `adoptCompiled` | **RECORD** (sound; the correct landing for H-A1's `.css` twins) |
| H-A8 | G.W9 rAF-leak fix | **RECORD** (sound) — cross-links to H-A3 |
| H-A9 | G.W8 store singleton | **RECORD** (sound; fold `scenePlayback` Map into the H-A3 store) |
| H-A10 | G.W7 template-ref / renames | **RECORD** (sound) |
| (D9/D5) | @mbabb `DockDropdownTrigger` won't open | **glass-ui-HANDOFF** (verify kf composition post-AW) |
| (router) | deprecated `next()` warn (`router.ts:49`) | **SHIP-in-H** (return the value) — folds into H-A3's URL rework |

## Falsifiable gates H should add/turn red→green

1. `proof:demo-usability` — **zero console errors** on `#/cube` load (RED: H-A1, 4 errors).
2. `proof:demo-usability` — zero console errors across home→scene transition (RED: H-A2).
3. `proof:interpolate-anything` — a bare text-leaf row asserting discrete snap + no throw (H-A2 engine guard).
4. unit: `CSSKeyframesToString(cubeRotationsAnimation)` resolves without throw (H-A1).
5. `proof:scene-state` — easing→cube→easing restores `bezierControlPoints` + paused state; spring restores value/velocity/target (H-A3).
6. URL-namespacing lock: a `?anim=` of scene A never appears on scene B (H-A3).
