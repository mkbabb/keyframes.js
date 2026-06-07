# Tranche H Deep Audit — Lane `a-scene-path-discrete`

**Scope:** per-scene deep audit of `/motion-path` (Path) + `/starting-style` (Discrete).
**Charge:** pertinence (D8 — the user questioned these directly), quality, interactivity (D11), the icon need (D8). Honest KILL / KEEP / elevate.
**Method:** source read (cited file:line) + live drive on the running demo at `http://localhost:5174/` via Playwright MCP.
**Branch:** `tranche-h-dev`. Demo build: kf 4.1.0 + Tranche G.

---

## Verdict (one line each)

- **Path (`/motion-path`)** — **KEEP + ELEVATE.** Mechanically correct, conceptually pure (the browser owns the geometry, the engine sweeps one scalar — the real F.W12 value-prop). But it is **inert**: zero interaction, a static author path, no icon. Elevate to interactive (D11) + give it a designed SVG icon (D8). NOT a KILL.
- **Discrete (`/starting-style`)** — **KEEP + FIX (carries a real defect).** A genuine demonstration of `@starting-style` + `transition-behavior: allow-discrete` eased by the library's own spring `linear()` — the single best "you can paste this into your stylesheet" artifact in the demo. BUT its contract `AnimationGroup` throws a live console error on every keyframes-string serialize (root-caused below), and the bottom-bar transport it borrows drives **nothing** in this scene. Fix the throw, suppress/repurpose the meaningless transport, add an icon (D8).

Neither scene is half-baked enough to KILL. Both prove a distinct, real CSS/engine primitive that no other scene covers (Path = `offset-path`/`offset-distance`; Discrete = `@starting-style`/`allow-discrete`). Killing them would remove the demo's only coverage of two shipping CSS features the library is explicitly built to ease.

---

## LIVE EVIDENCE (reproduced this session)

### Path scene — works, proven

Navigated `#/motion-path`, sampled the traveller `.mp-traveller`:

```
offsetPath:     path("M 60 200 C 60 80 200 80 200 200 S 340 320 340 200 S 200 60 60 200 Z")
offsetRotate:   auto 0deg        (tangent-following — engine set rotate:"auto")
offsetDistance: 0px              (start; autoPlay:false — waits for the transport)
willChange:     offset-distance
--ball-size:    2.75rem   →  rect 44×44px
--ball-glow:    40%
guideStroke:    color(srgb 0.1305 0.7695 0.3648 / 0.35)   (--color-progress @ 35%)
glyph:          🙂‍↔️
```

Manually swept `offset-distance` to prove the browser resolves path geometry (the loop `d` is closed `Z`, so 0% and 100% coincide):

```
at 0%   → (550, 390)
at 50%  → (801, 447)   (moved 257px along the path)
at 100% → (550, 390)   (back to start — closed loop)
```

`fromMotionPath` (engine) is doing exactly what `MotionPathTarget.vue:61-68` + `useMotionPathDemo.ts` claim. **ALREADY-SOTA on the engine seam** — `offset-path`/`offset-rotate`/`offset-distance` are set on a live element, the scalar sweep is WAAPI-eligible, zero geometry math in JS. The primitive is exemplary.

### Discrete scene — works as a CSS demo, but the contract group throws

Navigated `#/starting-style`, sampled `.discrete-card`:

```
--spring-ease (resolved): linear(0, 0.35284 4.000%, 0.89141 8.000%, 1.17574 12.000%, 1.18331 16.000%, 1.07426 20% …)   [418 chars, overshoots to 1.18 = the "bouncy" ζ=0.45 spring]
transition:           opacity 0.45s linear(0 0%, 0.35284 4% …)  (a real spring linear())
transitionBehavior:   allow-discrete
discrete-card display: flex / opacity 1   (visible base state)
toggle button:        "Dismiss" / "Reveal"  (Eye / EyeOff)
```

The `@starting-style` entry + `allow-discrete` exit + spring `linear()` are all correct and live. The Reveal/Dismiss toggle and the 4 preset buttons (`smooth / snappy / bouncy / gentle`) work. This is a **real, faithful demo of a real CSS primitive eased by the library's `springLinearStops()`** (`StartingStyleTarget.vue:76,94-99`).

**But the console carries a hard error on this scene (reproduced):**

```
AnimationOptionError: Invalid value for animation option "timingFunction":
  [function anonymous] — a custom TimingFunction has no CSS
  animation-timing-function representation — attach a faithful Easing.css twin …
  at serializeEasing (src/animation/format.ts:24)
  at CSSKeyframesToString (src/animation/format.ts:82)
  at updateCSSAnimationKeyframesStringFromAnimation
     (…/keyframes/KeyframesStringControls.vue:46)
```

---

## FINDINGS

### F1 — Discrete: the contract anim's spring loses its `.css` twin at the FRAME level → live serialize throw  **[SHIP-in-H]**

**Anchor:** `demo/app/scenes/StartingStyleScene.vue:24-33` (contract anim) + `src/animation/format.ts:30-45` (`serializeEasing`) + the per-frame serialize path `CSSKeyframesToString` (format.ts) reached from `KeyframesStringControls.vue:46`.

**Root cause.** The Discrete scene builds a contract `AnimationGroup` whose single child is:

```ts
new CSSKeyframesAnimation({
    …, timingFunction: springTimingFunction({ response: 0.5, dampingFraction: 0.45 }),
}).fromVars([{ opacity: 0 }, { opacity: 1 }]);
```

`springTimingFunction(...)` returns `{ fn, css }` (`src/animation/springTimingFunction.ts:119`) — a *correctly twinned* `Easing`. So the **options-level** easing serializes fine (`serializeEasing` returns `easing.css` at format.ts:31). The throw fires on the **per-keyframe** easing: the two `fromVars` frames carry an `Easing` whose `.fn` is the anonymous spring closure but whose `.css` twin was **dropped during frame compilation** (the option→frame easing propagation copies `fn` but not `css`). `serializeEasing` then can't find the anonymous `fn` in the value.js registry and throws (format.ts:35-43, exactly as designed for a genuinely unrepresentable curve).

This is a **real engine seam bug** (frame-level easing inheritance loses the `.css` twin), surfaced ONLY by this scene because it is the only place a spring is mounted on a `CSSKeyframesAnimation` whose *keyframes* get serialized by the string editor. The cube/spring/sequence scenes never hit it (spring scene drives `NumericAnimation`, not a serialized `CSSKeyframesAnimation`).

**Gestalt fix (two valid motions, prefer the first):**
1. **Engine fix (the true fix, DRY):** when the option-level `timingFunction` carries a `.css` twin, the compiled per-frame `AnimationFrame.timingFunction` must carry the SAME `{ fn, css }` — not just `fn`. The `.css` twin must flow through frame compilation, not be re-derived. This restores round-trip symmetry the CLAUDE.md already promises ("the round-trip symmetry the serializer lacked", format.ts:20). Locus: the frame easing default/inherit in the FrameCompiler (`src/animation/frame-compiler.ts`, the per-frame `resolveEasingOption`/default at :167).
2. **Demo fix (if the engine fix is BOOKed):** the scene's contract anim should use the **already-emitted** `springLinearStops(...)` `linear()` string as a CSS-literal timing function (the scene's own artifact computes exactly this in `StartingStyleTarget.vue:94`). A `linear()` literal IS a registry-free faithful CSS twin — it serializes verbatim (format.ts:16-17). This also makes the contract anim **DRY with the artifact** (one spring, one curve, surfaced once).

**Falsifiable instrument:** `proof:frame-css-twin` — a unit test: build a `CSSKeyframesAnimation` with a `springTimingFunction()` option, `fromVars([{opacity:0},{opacity:1}])`, then `CSSKeyframesToString(anim)` MUST resolve (emit `linear(...)` per frame) and MUST NOT throw. Plus a **visual lock**: a Playwright console-error gate asserting `#/starting-style` mounts with **zero** console errors (today: 2 errors per mount, observed compounding to 4 on re-nav).

---

### F2 — Discrete: the borrowed bottom-bar transport drives NOTHING in this scene  **[SHIP-in-H]**

**Anchor:** `demo/app/scenes/StartingStyleScene.vue:18-23, 38-40` + the comment admitting it: *"The bottom-bar transport still requires an AnimationGroup, so this is a minimal contract group whose single preview animation … drives no scene motion."*

**Defect.** The scene's actual motion is a CSS `@starting-style` transition fired by the Reveal/Dismiss toggle — it is NOT engine-driven. The contract `AnimationGroup` (started + paused) exists ONLY to satisfy the editor shell's transport contract. So the user sees the global play/pause/scrub ribbon at the bottom, which, when used, scrubs an invisible "Discrete Preview" opacity animation that paints nothing on screen. This is **dishonest UI** (a transport that controls nothing) and is the proximate cause of F1 (the un-mountable contract anim exists only to feed this dead transport).

**Gestalt fix.** Make the scene's transport contract HONEST. Two idiomatic routes:
- **Preferred:** the editor shell should treat a scene as **transport-less** when it exposes no real engine animation — i.e. the shell renders the bottom transport conditionally on the active scene having a real, scene-driving `AnimationGroup`. The Discrete scene then declares no transport and the contract anim **disappears entirely** (this also dissolves F1's demo half). This is the gestalt move: the scene's interaction model is "toggle + presets", so the chrome should reflect that, not borrow an alien transport.
- If the shell genuinely cannot host a transport-less scene, the contract anim's transport should at minimum drive the **real** discrete toggle (play = Reveal, pause = Dismiss) so the visible motion and the transport are the same object.

**Falsifiable instrument:** `proof:scene-transport-honesty` — a registry assertion that every scene's `defineExpose().animationGroup` either (a) drives visible motion, or (b) the scene opts out of the transport chrome. Visual lock: snapshot `#/starting-style` and assert the bottom playback ribbon is absent (or wired to Reveal/Dismiss), not the dead "Discrete Preview" slider.

---

### F3 — D8: BOTH scenes have NO dock icon — they fall back to the generic Home glyph  **[SHIP-in-H]**

**Anchor:** `demo/@/components/custom/dock/ChromeDock.vue:25-30` — `sceneIcons` maps ONLY `cube / amiga / square / easing`. `spring`, `sequence`, `motion-path`, `starting-style` are absent, so ChromeDock.vue:171-172 / :180-181 / :193-194 render the generic `Home` lucide icon (or just a `StatusDot`) for them.

**Live proof.** On `#/motion-path` the dock Scene trigger `[aria-label="Scene"]` has **no `<img>`** (`triggerHasImg: false`) — only the text "Path". The existing scenes ship designed, screenshotted PNG/SVG thumbnails in `assets/icons/` (`cube-icon-sm.png`, `amiga-icon-sm.png`, `square-icon-sm.png`, `easing-icon-sm.svg` — `lg` variants too). The four new modes have none.

**Gestalt fix (only IF the scene survives hardening — and both do per this lane's verdict):**
- **Path:** a designed SVG icon of the figure-loop track with a traveller dot on it — literally a scaled-down `PATH_D` (`motionPathGeometry.ts:23`) rendered as the icon, so the icon IS the demo. This is the most DRY, on-brand icon possible (one geometry source for icon + guide + traversal).
- **Discrete:** an SVG icon expressing the discrete entry/exit — e.g. a card "popping in" with a spring overshoot ghost, or a fade-fragment glyph. Match the existing `easing-icon-sm.svg` weight/treatment (the only existing SVG icon — use it as the styling template so the set stays isomorphic).
- Register both in `sceneIcons` (and `lg` twins wherever the demo uses them, e.g. start-screen).

**Falsifiable instrument:** `proof:scene-icons-complete` — assert `Object.keys(sceneIcons)` is a superset of `scenes.map(s => s.id)` (every registered, surviving scene has an icon). Visual lock: snapshot the dock Scene trigger on each scene and assert a non-Home `<img>` is present.

---

### F4 — D11: Path is INERT — zero interactivity (the user wants the new modes draggable/clickable)  **[SHIP-in-H]**

**Anchor:** grep of `demo/motion-path/` for `pointer|drag|@click|@pointer|cursor|OrbitalDrag` → **zero matches**. The traveller only moves under the global transport scrub; the path itself is a fixed author `d` string.

**Defect.** D11 asks the surviving new modes to become MORE interactive "like the cube orbital drag". Path is the most static scene in the demo — the user watches a ball traverse a fixed loop. It demonstrates the primitive but invites no exploration.

**Gestalt fix (elevate Path into a hands-on tool):**
- **Draggable path control points.** The author path is a cubic with control points (`motionPathGeometry.ts:23`). Surface them as draggable SVG handles (Pointer Events + `setPointerCapture`, the established demo idiom per `demo/CLAUDE.md` — orbital-drag, AnimationVisualizer). Dragging a handle re-emits `PATH_D`, which updates BOTH the guide `<path>` and the traveller's `offset-path` in lockstep (the geometry is already single-sourced — `motionPathGeometry.ts` docstring guarantees guide+traversal can't drift, so a draggable control point is a natural extension of that invariant). This turns Path into "design a motion path, watch the engine sweep it, copy the `offset-path`" — a genuine tool, and a second copy-paste artifact alongside Discrete's.
- **Scrub-by-drag on the traveller.** Dragging the traveller directly sets `offset-distance` (the inverse of the transport), giving the same tactile feel as the cube's orbital drag.

**Falsifiable instrument:** `proof:motion-path-interactive` — a Playwright test that drags a control-point handle and asserts (a) the guide `<path>` `d` changed AND (b) the traveller's computed `offset-path` changed to the SAME `d` (the single-source invariant holds under interaction). Visual lock: before/after screenshots of a dragged handle.

> **Discrete note:** the Discrete scene IS already interactive (Reveal/Dismiss toggle + 4 preset buttons — `StartingStyleTarget.vue:35,62`). It satisfies D11 as-is; no elevation REQUIRED there beyond F1/F2. RECORD this as the interactivity bar the Path scene should reach.

---

### F5 — D7-adjacent: both scenes use `text-heading`/`text-title`, NOT the φ-ladder display tier  **[MEASURE-FIRST → likely RECORD]**

**Anchor:** `MotionPathTarget.vue:6` (`text-heading`), `StartingStyleTarget.vue:11` (`text-heading`), `:25` (`text-title`). D7 calls for the GOLDEN (φ-ladder) typography (`text-display`/`text-title`) on the HERO. These scenes use the mid tiers.

**Assessment.** This is correct as-is for the *card headers* — they are panel labels, not heroes; `text-heading` is the right rung. The φ-display tier belongs to the start-screen hero ("Select an animation"), not to in-scene panel chrome. Both scenes already consume the glass-ui phi-ladder utility classes (`text-heading`/`text-title`/`text-small`/`text-mono-caption`) idiomatically. **This is likely ALREADY-CORRECT for these two scenes** — flagged only so the D7 hero-typography lane doesn't accidentally pull these panel labels up to display size. MEASURE-FIRST against the D7 lane's hero spec; absent a named delta, RECORD as conformant.

**Falsifiable instrument:** the D7 φ-typography lane's `proof:phi-ladder` should assert the per-tier mapping (hero=display, card-header=heading) holds across scenes; these two scenes are conformant fixtures for it.

---

### F6 — Router `beforeEach` uses the deprecated `next(value)` callback (gates entry to BOTH lane scenes)  **[SHIP-in-H]**

**Anchor:** `demo/app/router.ts:42-53` — `router.beforeEach((to,_from,next) => { … next({ name … }); … next(); })`.

**Live proof.** Every navigation logs `[Vue Router warn]: The next() callback in navigation guards is deprecated. Return the value instead of calling next(value).` (observed 8+ times, compounding per nav this session). Per the **binding mandate (NO legacy code)** this deprecated path must be replaced in one motion: return the route object / `true` instead of calling `next(...)`.

**Gestalt fix.** Rewrite the guard to `return { name: targetName, query: cleanQuery }` on the restore branch and `return true` on the pass-through branch (drop the `next` param). Pure idiom swap, no behavior change.

**Falsifiable instrument:** `proof:no-router-deprecation` — a Playwright console gate asserting zero `[Vue Router warn]` messages across a scene-switch sweep (home → path → discrete → cube → back).

---

### F7 — Pertinence ruling (D8 directly) — KEEP both, with the rationale  **[RECORD]**

The user questioned whether Spring/Sequence/Path/Discrete deserve to survive. For this lane's two:

- **Path KEEPS** because it is the demo's ONLY coverage of CSS Motion Path (`offset-path`/`offset-distance`/`offset-rotate`) — a shipping CSS feature the engine explicitly supports via `fromMotionPath` (`MotionPathTarget.vue:45`). It is the cleanest possible proof of the engine's "sweep a scalar, let the browser own geometry" thesis. Killing it would orphan a whole engine factory. Its weakness is inertness (F4) + missing icon (F3), both fixable — not a reason to KILL.
- **Discrete KEEPS** because it is the demo's ONLY coverage of `@starting-style` + `transition-behavior: allow-discrete`, AND it is the most directly useful artifact in the entire demo: a copy-pasteable `transition-timing-function: linear(...)` produced by the library's own spring solver (`StartingStyleTarget.vue:48,102`). It teaches a real, hard-to-author CSS pattern and hands the user the exact string to use. Its weaknesses are F1 (the throw) + F2 (the dead transport), both fixable — not a reason to KILL.

**Distinct-coverage instrument:** `proof:scene-primitive-coverage` — assert each scene maps to a DISTINCT CSS/engine primitive (no two scenes demo the same feature). Path = motion-path; Discrete = starting-style/allow-discrete. (Caveat for the cross-lane synthesizer: Discrete and Spring BOTH surface `springLinearStops`/`springTimingFunction` — see F8 — but they demonstrate it on DIFFERENT primitives, so coverage is distinct; the redundancy is in the *solver surfacing*, not the *primitive*.)

---

### F8 — Cross-lane note: Discrete and Spring both surface the spring `linear()` artifact  **[RECORD → hand to scene-synthesis lane]**

**Anchor:** `StartingStyleTarget.vue:94` and `SpringSidebar.vue:130` both call `springLinearStops(...)` and surface the emitted CSS. Discrete frames it as "paste this into a `@starting-style` transition"; Spring frames it as the interactive solver playground.

**Assessment.** This is NOT duplication to KILL — the two scenes apply the SAME library output to DIFFERENT ends (Discrete = a concrete `@starting-style` application; Spring = the parametric solver). But the synthesis lane should confirm the framing reads as complementary, not repetitive, after F1/F2 land. RECORD for the cross-scene cohesion pass; no action in THIS lane.

---

## Disposition summary

| # | Finding | Scene | Disposition |
|---|---------|-------|-------------|
| F1 | Spring `.css` twin dropped at frame level → live serialize throw | Discrete | **SHIP-in-H** (engine fix preferred; demo `linear()` fallback) |
| F2 | Borrowed bottom transport drives nothing (dishonest chrome) | Discrete | **SHIP-in-H** |
| F3 | No dock icon — generic Home fallback (D8) | Both | **SHIP-in-H** |
| F4 | Path is inert — zero interactivity (D11) | Path | **SHIP-in-H** (elevate to draggable path) |
| F5 | Panel headers use `text-heading`/`text-title`, not display tier | Both | **MEASURE-FIRST → RECORD** (likely conformant) |
| F6 | Router `beforeEach` uses deprecated `next(value)` | (gates both) | **SHIP-in-H** |
| F7 | Pertinence ruling: KEEP both, rationale recorded | Both | **RECORD** |
| F8 | Discrete + Spring both surface spring `linear()` (complementary) | Discrete | **RECORD → scene-synthesis lane** |

**ALREADY-SOTA (honest credit):** the `fromMotionPath` engine seam (offset-path + auto rotate + scalar sweep, all set on a live element, WAAPI-eligible, zero JS geometry) is exemplary and verified live. The Discrete scene's `@starting-style` + `allow-discrete` + spring-`linear()` mechanism is faithful and correct CSS — the bug is in the *contract-group plumbing around it*, not the demonstration itself.

**Environmental note (not a finding):** during live drive the shared browser session repeatedly drifted scenes between calls (e.g. `#/motion-path` → `#/spring` within ~600ms of a clean navigate). This is concurrent-lane interference on the shared dev-server/browser session, not a demo bug — verified by re-navigating atomically (navigate+evaluate in one pair), which reproduced every scene correctly. NOT attributed to D12.
