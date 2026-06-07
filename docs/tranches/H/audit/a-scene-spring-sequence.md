# Tranche H Deep Audit — Lane `a-scene-spring-sequence`

**Scope:** `/spring` + `/sequence` scenes. Quality, pertinence (D8), interactivity
(D11), scene-state robustness (D12), defects, the icon need.
**Branch:** `tranche-h-dev`. **Demo:** live at `http://localhost:5174/`.
**Method:** source read (`demo/spring/*`, `demo/sequence/*`, `demo/app/*`,
`src/animation/*`) + Playwright live drive (navigate / snapshot / screenshot /
evaluate / console).

---

## Verdict in one line

Both scenes are **genuine, valuable, well-built engine dogfoods** — they prove
real, well-tested engine primitives (`SpringProgress`, `springTimingFunction`,
`springLinearStops`, `Sequence`, `stagger`) and should **SURVIVE hardening**. But
they are **un-usable in the running demo** because the scene router/state machine
is **autonomously cycling scenes sub-second** (the D12 root). They cannot be
interacted with live, they bleed the wrong (cube) controls panel on top of
themselves, they have **no nav icons** (D8), and the Spring/Sequence `contractAnim`
feeds a **custom timing function into the CSS-string serializer**, throwing on every
Keyframes-tab render. Pertinence: HIGH. Finished + usable: NO.

---

## A. PERTINENCE (D8) — are these finished, valuable modes? YES.

Both scenes are the canonical dogfood of engine surfaces NOTHING else proves, and
those surfaces are real and battle-tested:

| Primitive | src | LOC | tests |
|---|---|---|---|
| `SpringProgress` | `src/animation/spring.ts` | 491 | `spring.test.ts`, `spring-adapter.test.ts`, `spring-presets.test.ts` |
| `springTimingFunction` | `src/animation/springTimingFunction.ts` | 120 | `springTimingFunction.test.ts` |
| `springLinearStops` | `src/animation/springLinearStops.ts` | 73 | `springLinearStops.test.ts` |
| `Sequence` | `src/animation/sequence.ts` | 628 | `sequence.test.ts`, `sequence-transport.test.ts` |
| `stagger` | `src/animation/stagger.ts` | 171 | `stagger.test.ts` |

- **Spring** (`SpringScene.vue` → `SpringTarget.vue` + `SpringSidebar.vue` +
  `useSpringDemo.ts`): a live interactive `SpringProgress` (drag/tap rail to
  re-seat target, `response`/`dampingFraction` sliders), 4 canonical iOS presets
  (`springPresets.ts`), a side-by-side canonical comparison row, a
  `springTimingFunction` sweep sampler fed to a `NumericAnimation`, and a live
  `springLinearStops()` → CSS Monaco editor (`SpringSidebar.vue:104`,`:130`).
  This is a complete, articulate showcase of the spring family.
- **Sequence** (`SequenceScene.vue` → `SequenceTarget.vue` + `useSequenceDemo.ts`):
  N=5 staggered child `CSSKeyframesAnimation`s (`useSequenceDemo.ts:78-95`) inserted
  at the `stagger` distribution offsets (0/260/520/780/1040ms,
  `useSequenceDemo.ts:66-70`) on a `Sequence` master clock, driven through the FULL
  F.W9 transport: play / pause / resume / reverse / timeScale (0.5×/1×/2×) / scrub
  (`useSequenceDemo.ts:152-223`). The engine paints `--ball-p` directly onto each
  row's DOM target (zero per-frame Vue work, `useSequenceDemo.ts:78-95`,
  `SequenceTarget.vue:139-146`). It is the temporal-orchestrator counterpart to the
  cube's spatial compositor.

**Disposition: KEEP both — RECORD pertinence as proven.** They are not filler; they
are the only proof of the temporal/spring engine. The D8 question "do they survive
hardening" → **yes, and therefore they NEED proper designed SVG icons** (§D below).

---

## B. CRITICAL — Autonomous scene-cycling (the D12 root for this lane) — SHIP-in-H

**Live observation (reproduced 4×, no user interaction):**
- Navigated to `http://localhost:5174/#/spring`. Sampled `location.hash` every
  800ms with no input: stable on `#/spring?anim=Spring+Preview` for ~4s, then at
  **ms≈4812 it self-navigated to `#/motion-path?anim=Path+traversal`** and the
  spring DOM unmounted (`.spring-rail` gone). By the sample's end the page event
  reported `#/amiga`.
- Navigated to `#/sequence`; a passive `evaluate` a fraction of a second later
  already saw `#/easing` — the scene unmounted before a single click could land
  (the Play button query returned `found:false`, `hash:#/easing`).
- A bare `localStorage.clear()` left the page at `#/square` with no navigation
  requested.
- Vue Router floods the console: 10→40 `[Vue Router warn]: The next() callback in
  navigation guards is deprecated` over the session — the guard
  (`router.ts:42-53`) is firing on a loop.

**Why it matters:** with the scene swapping every few seconds, **/spring and
/sequence cannot be used at all** — you cannot drag the spring rail, click a preset,
or play the sequence; the scene is gone before the gesture completes. This is the
single highest-severity defect in this lane and the literal manifestation of D12
("stuck in an impossible ROUTED state … play/pause not restored/suspended").

**Root-cause read (source):** there is NO intentional reel/`setInterval` cycling
(`grep` for `setInterval|cycle|reel|nextScene` over `demo/app` finds none). The loop
is a reactive feedback cascade between the URL-sync and scene-restore seams:
- `useSceneUrl.ts:36-55` debounce-writes `?anim=` to the router on every
  `selectedAnimation` change; `:61` watches `route.query.anim` back into the model.
  The `syncGen` guard (`:21,42,47`) is a single counter shared across BOTH
  directions, so a model-write and a url-write race can leave `gen===syncGen`
  falsely and re-fire (the guard does not isolate direction).
- `useSceneRouter.ts:19-32` re-reads `localStorage["keyframes-js-active-scene"]` and
  `router.replace`s on `route.name === "home"`; combined with the watch at `:46-52`
  that writes the CURRENT scene back to localStorage, a transient `home`/cube pass
  during the swap can re-trigger a replace to a *stale* stored id.
- On every `goto('#/spring')` the hash first reads `#/cube` then settles to
  `#/spring` (`evaluate` t=0 sample) — i.e. each navigation transits cube, and the
  group-sync (`useSceneGroupSync.ts:44-97`) + playback-restore
  (`usePlaybackSnapshot.ts`) reconcile fires its "double-fire" codec each time,
  re-writing controls/anim state that re-feeds `useSceneUrl`.

**Gestalt fix (NO workaround — replace the ad-hoc multi-watcher choreography in ONE
motion):** collapse `useSceneRouter` + `useSceneUrl` + `usePlaybackSnapshot` +
`useSceneGroupSync` + `useSceneSwap`/`useSceneTransition` into a **single formal
scene+playback state machine** with the route as the *single source of truth* and a
*store* for per-scene ephemeral state. This is exactly the D12 mandate. Concretely:
- One **XState-style / explicit FSM** with states `{ idle → entering(scene) →
  active(scene) → leaving(scene) }` and a per-scene sub-state `{ playing | paused |
  suspended }`. Transitions are the ONLY writers of the route; no watcher writes the
  URL as a side effect.
- A **Pinia store (or `createGlobalState` from vueuse)** keyed by `superKey` holding
  `{ selectedAnimation, controlsOpen, playback }`. SUSPEND on leave (snapshot t /
  reversed / iteration — `usePlaybackSnapshot.ts:24-42` is already the right codec,
  just orphaned of an authority), RESTORE on enter. The existing
  `scenePlayback.ts` store is the seed; promote it to the canonical store and delete
  the parallel localStorage scene-key dance in `useSceneRouter.ts:11,24,47`.
- Replace the deprecated `next(value)` guard form (`router.ts:42-53`) with the
  return-value form (kills the warn flood and the re-entrancy surface).

**Falsifiable instrument (`proof:scene-fsm-stable`):** a Playwright lock that
navigates to each of `/spring`, `/sequence` (and the other 7), waits 6s with ZERO
input, and asserts `location.hash` is byte-identical at t=0 and t=6s AND the
scene's signature element (`.spring-rail` / `.seq-ball`) stays mounted the whole
time. It MUST also assert `console` emits zero router-guard-deprecation warnings.
Today this gate is red on the first scene.

---

## C. HIGH — Spring/Sequence `contractAnim` throws in the CSS-string serializer — SHIP-in-H

**Live observation:** console error, fired on the Spring scene and again on the
Sequence scene:
```
AnimationOptionError: Invalid value for animation option "timingFunction":
[function anonymous] — a custom TimingFunction has no CSS animation-timing-function
representation … at serializeEasing (src/animation/format.ts:24)
  at CSSKeyframesToString (src/animation/format.ts:82)
  at updateCSSAnimationKeyframesStringFromAnimation
     (…/animation-controls/keyframes/KeyframesStringControls.vue:46)
```

**Root cause (source):** both scenes build a placeholder `contractAnim` whose
`timingFunction` is a **custom JS function** with no CSS twin:
- `useSpringDemo.ts:252-261` — `springTimingFunction({response:0.5,
  dampingFraction:0.45})`, name `"Spring Preview"`.
- `useSequenceDemo.ts:112-121` — `springTimingFunction({response:0.5,
  dampingFraction:0.7})`, name `"Sequence Preview"`.
This contract animation IS the bottom-bar's selected animation (`?anim=Spring
Preview` / `?anim=Sequence Preview` confirmed in the live hash). The editor's
Keyframes tab (`KeyframesStringControls.vue:46`) calls `CSSKeyframesToString` →
`serializeEasing` (`format.ts:24`) which rejects a raw custom function — by design,
since a custom `TimingFunction` has no `animation-timing-function` literal.

**Gestalt fix (idiomatic, not a try/catch swallow):** the contract animation exists
ONLY to satisfy the bottom-bar `AnimationGroup` handle; it drives no scene motion
(both files say so: `useSpringDemo.ts:247-251`, `useSequenceDemo.ts:107-111`). The
engine ALREADY ships the faithful CSS twin path the error message names: feed the
contract anim a `springLinearStops()` **`linear()` literal** as its
`animation-timing-function` (the very token the Spring sidebar surfaces,
`SpringSidebar.vue:130`) instead of the opaque `springTimingFunction` closure.
That is the engine's own "attach a faithful Easing twin" idiom and makes the preview
serializable, copy-pasteable, AND honest (the spring sampler showcased IS the spring
linear() — DRY with the sidebar). Alternatively, give `springTimingFunction` a `.css`
twin so any custom-fn contract serializes — but that is a **value.js-HANDOFF**
(`springTimingFunction` lives in `src/animation` here, but the `Easing.css` twin
contract is the value.js easing surface). Prefer the `linear()`-literal contract in
the demo — it is a one-motion replacement, no engine change.

**Falsifiable instrument (`proof:contract-serializable`):** unit/integration test —
for each scene's contract `CSSKeyframesAnimation`, `CSSKeyframesToString(anim)`
returns a string and does NOT throw; a live console-lock asserting zero
`AnimationOptionError` on `/spring` and `/sequence` mount.

---

## D. HIGH — No nav icons for Spring / Sequence (D8) — SHIP-in-H

**Source anchor:** `demo/@/components/custom/dock/ChromeDock.vue:20-30` —
`sceneIcons` maps ONLY `{cube, amiga, square, easing}`; assets present are
`assets/icons/{cube,amiga,square}-icon-{sm,lg}.png` + `easing-icon-sm.svg`. Spring,
Sequence, Path, Discrete fall to the `Home` lucide fallback (`ChromeDock.vue:172,
180, 211`) — live-confirmed: the dock shows a generic Home glyph beside "Spring" and
"Sequence". This is the literal D8 gap.

**Gestalt fix:** since these scenes survive (§A), they need first-class designed,
screenshotted SVG icons matching the lineage of `easing-icon-sm.svg`
(the SVG, not PNG, path — vector, dark-mode-safe, isomorphic with the easing icon):
- **Spring** — an underdamped overshoot curve / a coil compressing-and-settling
  (mirrors the `springTimingFunction` overshoot the scene shows).
- **Sequence** — a staircase of staggered dots/bars (mirrors the
  0/260/520/780/1040ms `stagger` storyboard rows).
Author them as SVG (screenshot the live scene for fidelity like the other thumbs),
add to `assets/icons/`, register in the `sceneIcons` map. (Path + Discrete are
sibling lanes' calls; flag the same gap exists for them.)

**Falsifiable instrument (`proof:scene-icons-complete`):** a test asserting every
`scenes[]` id has a `sceneIcons[id]` entry (no `Home` fallback for a real scene) +
a visual lock screenshotting the dock scene-select with all icons present.

---

## E. MEDIUM — Sequence scene exposes no controls/ribbon → wrong cube panel bleeds — SHIP-in-H

**Live observation (`sequence-clean.png`, captured mid-swap):** the dock reads
"Sequence" and the sequence's own UI (master playhead 0.000, Play/Reverse/1×/Reset,
"READY" badge) renders — but the LEFT controls panel shows the **generic cube editor
controls** (duration / delay / iterations / direction / fill / easing) overlaid on
top of the staggered rows, and the full-width PlaybackRibbon overlaps the sequence's
own scrubber.

**Root cause (source):** `SequenceScene.vue:28-33` exposes only `animationGroup` /
`superKey` / `isPlaying` / `isStarted` — it does NOT expose `tabsTrigger` /
`tabsContent` / `ribbonContent` the way `SpringScene.vue:103-112` does. So App's
`#tabs-content` / `#ribbon-content` slots (`App.vue:96-106`) fall back to the default
editor surface (the cube-style controls), which is meaningless for Sequence (the
sequence has NO `@keyframes` to edit — its motion is the engine `Sequence`).
`SequenceScene.vue:26` sets `isControlsPanelOpen = false`, but `useSceneGroupSync.ts:
70-72` force-reopens the panel on any desktop scene mount, overriding it — so the
empty/wrong panel shows anyway (a second face of the D12 state-machine sprawl, §B).

**Gestalt fix:** Sequence's transport already lives self-contained ON the target
(`SequenceTarget.vue:65-107`, the comment at `SequenceScene.vue:21-24` says so). So
the scene should either (a) declare itself "no editor panel" via a first-class scene
descriptor flag (e.g. `SceneDescriptor.hasEditorPanel:false` in `scenes.ts:7-14`)
that App + `useSceneGroupSync` honor — NOT a per-scene `isControlsPanelOpen` race —
or (b) expose a `tabsContent` that mirrors the spring rail's pattern. Option (a) is
the gestalt move: it teaches the shell that some scenes are self-contained, removing
the cube-panel bleed for Sequence (and is the same seam Path/Discrete want). This
also resolves D4 indirectly for Sequence: with no generic ribbon, the sequence's own
scrubber (already correctly sized inside its card) is the only playhead.

**Falsifiable instrument (`proof:sequence-no-cube-panel`):** Playwright on
`/sequence` asserts the controls panel does NOT contain the strings
"duration"/"iterations"/"direction" (the cube editor signature) while the sequence's
`.seq-scrub` + transport buttons ARE present.

---

## F. MEDIUM — `StartingStyleTarget.vue` mis-homed under `demo/spring/` — RECORD / BOOK

**Source anchor:** `demo/spring/StartingStyleTarget.vue` is consumed by the
**Discrete** (`starting-style`) scene, not Spring (`StartingStyleScene.vue` imports
it; the spring dir also holds `springKeys.ts`, `springPresets.ts`,
`useSpringDemo.ts`). It is co-located in `spring/` because it dogfoods
`springLinearStops()` (`StartingStyleTarget.vue:76,91-95`), but the directory name
implies it belongs to the `/spring` scene. During the §B scene-bleed I saw its
"EASED BY SPRINGLINEARSTOPS()" + "transition-timing-function LINEAR(...)" ghost text
stacked over the Spring scene — a co-location that makes the bleed more confusing.

**Gestalt fix:** when the Discrete lane hardens, move `StartingStyleTarget.vue` to a
`demo/starting-style/` (or `demo/discrete/`) home; share `springLinearStops` via the
engine import both already use (`@src/animation/springLinearStops`), not via dir
adjacency. Cross-lane — **BOOK for the Discrete lane**, RECORD here as the cause of
one ghost-text source in the §B bleed screenshots.

---

## G. LOW — Live interactivity (D11): the rails ARE interactive; deepen if hardened — RECORD

When the scene stays mounted (before §B swaps it out), interactivity is genuinely
present and idiomatic:
- **Spring** `SpringTarget.vue:84-124`: pointer drag + tap to re-seat the target
  (`setPointerCapture`, window `pointermove`/`pointerup` via `useEventListener`),
  full keyboard slider (`ArrowL/R/U/D`, `Home`/`End`), `role="slider"` + aria. The
  ghost target marker + spring ball + sampler sweep are all live.
- **Sequence** `SequenceTarget.vue:148-189`: the master playhead is drag- AND
  keyboard-scrubbable with the same pointer-capture idiom + full F.W9 transport
  buttons. Live snapshot confirmed 5 rows / 5 balls / scrub present / 4 transport
  buttons wired.

This already matches the "like the cube orbital drag" bar (D11) at the rail level.
**Once §B is fixed**, the natural D11 deepening (RECORD, not required for H): make
the Sequence ROWS individually draggable (drag a row's start offset to re-author its
`stagger` `at:` live — the GSAP-timeline gesture), and let the Spring presets be
drag-reorderable / the rail support fling velocity. Not defects; enhancement once
the scene is usable.

---

## H. ALREADY-SOTA (honest credit)

- **φ-typography (D7 lens):** both scenes use the glass-ui φ-ladder tokens
  idiomatically — `text-heading` for card titles (`SpringTarget.vue:7`,
  `SequenceTarget.vue:7`), `text-title` (`StartingStyleTarget.vue:25`), `text-small`
  / `text-mono-caption` for sub-labels. No ad-hoc font sizing. Exemplary; no change.
- **Engine-loop hygiene (inv ζ):** both demos run on the engine's OWN `RAFPlayback`
  (`useSpringDemo.ts:124,142-162`; `useSequenceDemo.ts:142-149`) — no hand-rolled
  rAF, with generation-guarded loops, `onScopeDispose` stop seams
  (`useSpringDemo.ts:239`, `useSequenceDemo.ts:235-238`), and
  `useSceneVisibilityPause` battery idling (`useSpringDemo.ts:245`,
  `useSequenceDemo.ts:226-230`). The zero-per-frame-Vue ball painting in Sequence
  (engine writes `--ball-p` directly) is textbook. This is exemplary dogfood.
- **Shared `.progress-rail`/`.progress-ball` idiom:** both scenes consume the
  design-idioms primitives with only per-site scoped deltas, each documented as a
  named befitting motion-cohesion delta (`SpringTarget.vue:127-170`,
  `SequenceTarget.vue:192-226`, `SpringSidebar.vue:162-176`). DRY, idiomatic.

---

## Dispositions summary

| # | Finding | Severity | Disposition | Instrument |
|---|---|---|---|---|
| B | Autonomous scene-cycling / D12 router-FSM sprawl | CRITICAL | SHIP-in-H | `proof:scene-fsm-stable` |
| C | contractAnim custom-fn throws in CSS serializer | HIGH | SHIP-in-H (or value.js-HANDOFF for the `.css` twin) | `proof:contract-serializable` |
| D | No Spring/Sequence nav icons (D8) | HIGH | SHIP-in-H | `proof:scene-icons-complete` |
| E | Sequence bleeds the cube controls panel | MEDIUM | SHIP-in-H | `proof:sequence-no-cube-panel` |
| F | `StartingStyleTarget` mis-homed in `spring/` | MEDIUM | BOOK (Discrete lane) / RECORD | grep co-location lock |
| A | Pertinence — both scenes valuable | — | KEEP / RECORD | pertinence noted |
| G | Interactivity present; deepen post-fix | LOW | RECORD | — |
| H | φ-typography, rAF hygiene, idiom reuse | — | ALREADY-SOTA | — |

**Cross-lane note:** the §B router/state-machine fix is the SAME D12 spine other
scene lanes will hit — it must be one shared FSM+store, not per-scene patches. The
§D icon gap and §E self-contained-scene flag also apply to Path/Discrete.
