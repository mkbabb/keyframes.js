# Tranche R — ADVERSARIAL CHALLENGE: the DEMO audit lane

**Date:** 2026-06-24
**Branch:** `tranche-r-dev`
**Challenger scope:** every material claim in `gestalt-demo.md` + the eight `demo-*.md` lane audits.
**Method:** read the ACTUAL code (file:line), cross-check against the user's precepts and the
modern-web-guidance Baseline data, surface internal contradictions between the lane docs.

Verdict legend: `sound` (claim holds, proceed) · `overreach` (claim true but the proposed
remedy goes too far / loses a real behavior) · `contrived` (the "problem" is manufactured) ·
`over-engineered` (the cure is heavier than the disease) · `insufficient-evidence` (the doc
asserts more than the code supports) · `kiss-violation` (the proposal adds complexity against KISS).

---

## TL;DR of the challenge

The demo lane is, on the whole, **honest and well-grounded** — far more so than the `src/animation/`
flat-sibling pattern the prompt warned about. The scene-fusion gestalt is earned, the dead-code
excisions are real, and the brittleness migrations are mostly sound. BUT the challenge surfaced
**seven material problems** the lane docs got wrong or overstated:

1. **The scene-switcher carousel CAN be removed — the replacement path is real and verified.**
   (`ChromeDock` emits `switchScene` → `App.vue:12` → `runSceneSwitch`, no breakpoint gate.) SOUND.
2. **BUT the scene-switcher doc's Finding 5 / Finding 2 "carousel is inside the VT subject" is FACTUALLY WRONG** — the
   carousel is a *sibling* of `.scene-host`, not a child; it is never snapshotted as `scene-subject`.
3. **DT-6 (subgrid fallback "dead in 2026, excise it") CONTRADICTS the modern-web standard**, which
   explicitly recommends the same-cascade explicit-columns + subgrid pair. OVERREACH.
4. **The two lane docs CONTRADICT each other on `useSceneSwap`**: app-scenes F4 says "excise entirely",
   legacy-sweep 3a says "genuinely befitting, keep". The Baseline data sides with legacy-sweep —
   View Transitions is Baseline only since **2025-10-14** (Firefox 144, Oct 2025). app-scenes F4 OVERREACH.
5. **Styling F2/F3 ("normalise `var(--z-content, N)` fallbacks to the contract value") is itself a
   PRECEPT VIOLATION** — it perpetuates the silent-degrade fallback the precept forbids; the
   precept-correct move is to *excise the comma-default* so a missing token fails visibly.
6. **Brittleness Finding 1's stale-comment side-note is WRONG** — it claims `DemoControlPoint` has
   "NO `data-index`"; the code has both `data-demo-control-point` (wrapper) AND `:data-index` (handle).
7. **app-scenes Finding 8 ("render-fn slots fight Vue's component model") is an OVERREACH** — the
   scene and its UI projections sit in *sibling* slots; a render-fn-via-`defineExpose` bridge is the
   *idiomatic* cross-sibling teleport, not a workaround. The real defect is the `any` ref typing
   (Finding 9), which IS sound.

Everything else verified — dead components, the callback-as-props anti-pattern, the DRY triplications,
the timingFunctionsAnd duplication, the cubeTransformStore HMR point — holds up.

---

## PART A — The scene-switcher removal (the headline DEMO claim)

### A.1 — Is the carousel truly removable without breaking scene navigation? — SOUND (verified)

**Claim** (`demo-scene-switcher.md` §"What replaces…", `gestalt-demo.md` §4): the `ChromeDock`
`<Select>` is the sole, always-present switcher on every breakpoint, so deleting
`SceneSwitcherCarousel` + `useScrollSnapScene` breaks nothing.

**Verification — the replacement path EXISTS and is wired:**

- `ChromeDock.vue:124-128` declares `defineEmits<{ (e: "switchScene", id: string): void; … }>`.
- `ChromeDock.vue:269-305` — the scene `<Select>` lives **inside `GlassDock`'s default slot**, and on
  `@update:model-value` it fires `emit('switchScene', String(id))` (line 273). There is **no breakpoint
  `v-if` / media gate** on this Select — it is part of the dock that renders at every width.
- `App.vue:2` `<ChromeDock … @switch-scene="runSceneSwitch">` — line `12` binds the emit to
  `runSceneSwitch`, the SAME commit the carousel's `@pick` used (`App.vue:177`).
- `runSceneSwitch` is the single nav entry: `App.vue:393` `const { runSceneSwitch } = useSceneTransition(switchScene, sceneHostEl, currentSceneId)`. The dock @switch-scene AND the SharePopover restore both route through it (`App.vue:48`).

So the dock Select and the carousel were **two surfaces feeding one commit** (`runSceneSwitch`).
Deleting the carousel leaves the dock Select as the sole producer — **navigation is unbroken.**

**The carousel really is structurally broken** (verified): `useScrollSnapScene.ts:56-61` `onScroll`
is a literal no-op (`void nearestCenterId;` — references the function, never calls it; writes no Vue
state). `SceneSwitcherCarousel.vue:57` destructures only `{ onScroll, scrollToScene }` — never
`nearestCenterId`. So the only working path was the explicit `@click="onPick(scene.id)"`
(SceneSwitcherCarousel.vue:26). The swipe-settle commit was never implemented. **The doc is right that
this is a dead parallel surface.**

**Consumer count verified:** `grep` shows `useScrollSnapScene` is imported only by
`SceneSwitcherCarousel.vue:40`; `SceneSwitcherCarousel` is referenced only at `App.vue:175` (template)
and `App.vue:209` (import). Zero other consumers — the deletion is clean.

> **VERDICT: SOUND.** The removal is well-specified and the replacement path is real, verified, and
> ungated by breakpoint. This is the cleanest single win in the demo lane, exactly as claimed.

### A.2 — "The carousel is inside the view-transition subject" — WRONG (factual error)

**Claim** (`demo-scene-switcher.md` Finding 2 line 75, Finding 5 lines 109-128): the
`<div class="scene-carousel-host">` is "inside the `.scene-host` div — the element carrying
`view-transition-name: scene-subject`", so "during a View Transition the carousel would be
snapshotted as part of the scene content and morphed, which is incorrect."

**Verification — the carousel is a SIBLING of `.scene-host`, not a child:**

```
App.vue #target slot:
  L149  <div ref="sceneHostEl" class="scene-host …" :style="sceneSwapStyle">   ← VT name lives HERE
  L155     <Suspense :key="activeSceneKey"> … the active scene … </Suspense>
  L167  </div>                                                                  ← scene-host CLOSES
  L174  <div class="scene-carousel-host">                                       ← SIBLING, not child
  L175     <SceneSwitcherCarousel … />
  L179  </div>
```

`App.vue:481-482` `.scene-host { view-transition-name: scene-subject; }` — the VT name is on
`scene-host` ONLY. The carousel host (line 174) closes AFTER `scene-host` (line 167) — it is a
following sibling, **not** a descendant. The `::view-transition` capture is per-named-element; a
sibling outside the named subtree is **not** captured as `scene-subject`.

The doc's own Finding 5 even hedges ("its DOM ancestry inside the VT subject means it participates") —
but the ancestry it asserts does not exist.

> **VERDICT: insufficient-evidence (factual error in the rationale).** The *conclusion* (delete the
> carousel) is unaffected — it dies for the no-op-onScroll + dead-parallel-surface reasons, which ARE
> sound. But Finding 2/Finding 5's "captured by the VT morph" justification is **false** and should be
> struck from the removal rationale so it doesn't propagate as a phantom constraint into the refactor.
> **Correction:** drop the VT-subject argument entirely; the removal stands on A.1 alone.

### A.3 — `scene-transition.css` decomposition (Finding 3) — SOUND, but trivially so

The file (`scene-transition.css`, 82 L) does carry two concerns: the VT directional keyframes
(lines 1-59, load-bearing) and the carousel `.scene-carousel-host` visibility block (lines 61-81,
dies with the carousel). After the carousel goes, deleting lines 61-81 leaves a clean VT-only partial.
The `@import "./scene-transition.css"` at `App.vue:192` must stay (the VT keyframes paint at the
document root, so they cannot be `<style scoped>`). Verified — the comment at App.vue:189-192 confirms
the GLOBAL-because-pseudo-tree rationale.

> **VERDICT: SOUND.** A genuine (if small) decomposition that falls out for free with the carousel
> deletion. No over-engineering — it is just a delete + a header-comment edit.

---

## PART B — The decompositions: earned or busywork?

### B.1 — The 500L oversize files — line counts VERIFIED, decompositions mostly EARNED

`wc -l` confirms every cited count to the line:

| File | Doc claim | Actual | Genuine over-gate? |
|---|---|---|---|
| `CubeTarget.vue` | 560 | **560** | YES (only true over-limit Target) |
| `AmigaScene.vue` | 538 | **538** | YES |
| `useEasingDemo.ts` | 511 | **511** | YES (only over-gate composable) |
| `SquareScene.vue` | 504 | **504** | YES |
| `useSpringDemo.ts` | 499 | **499** | borderline |
| `useSequenceDemo.ts` | 499 | **499** | borderline |
| `SequenceTarget.vue` | 499 | **499** | borderline |
| `App.vue` | 499 | **499** | borderline |
| `ControlsPaneWrapper.vue` | 499 | **499** | borderline |
| `EasingCurveCanvas.vue` | 499 | **499** | borderline |
| `AnimationControlsGroup.vue` | 498 | **498** | borderline |

**The 499-cluster is a real signal, not coincidence.** Seven files land at *exactly* 499 and one at
498 — clustering one line under the 500 gate is statistically implausible without comment-inflation
keeping them there. The gestalt's own §9 calls this "comment-inflation hiding structure", which the
challenge confirms: the suspicious cluster vindicates the decomposition pressure rather than refuting
it. The genuine over-gate files (560/538/511/504) carry real separable concerns:

- **CubeTarget (560):** 271L of scoped 3D-material CSS (verified `wc`-by-section in demo-targets §1).
  Extracting `cube-3d.css` is a clean, low-risk style move. **EARNED.**
- **AmigaScene (538):** the `onMounted` Three.js scene-graph construction (`THREE.Scene`/`Camera`/
  `Renderer`/`OrbitControls`/lights/box-mesh + render loop) is a genuine renderer concern with no Vue
  reactivity. `useAmigaScene` extraction is **EARNED** (matches the existing `useAmigaAnimations`/
  `useAmigaBoot`/`useSphereSpin` split — consistent, not contrived).
- **useEasingDemo (511):** `parseCSSValue` (a regex `cubic-bezier`/`steps` parser) IS a standalone
  testable unit; the contractAnim boilerplate IS triplicated (see B.2). **EARNED.**

> **VERDICT: SOUND / EARNED.** The decompositions target real cohesive seams (renderer, parser,
> style block), not arbitrary line-count slicing. They do NOT replicate the `src/animation/` flat-
> hyphenated-sibling anti-pattern — they extract into composables/CSS colocated with their scene.

### B.2 — The cross-cutting extractions (`useContractAnimGroup`, `useSceneTransport`, `rafConstants`) — SOUND (real triplication)

**Claim** (`demo-composables-state.md` F2/F3/F4): the contractAnim host, the play/pause/togglePlay
triad, and `PROGRESS_READOUT_HZ = 6` are copy-pasted across easing/spring/sequence.

**Verification:** all three patterns confirmed present at the cited line ranges. These are the
highest-leverage moves — each kills a triplication AND shrinks multiple files toward sub-500. The
extraction targets (`demo/app/useContractAnimGroup.ts`, a `useSceneTransport` in the machine barrel,
`rafConstants.ts`) are honest shared-service boundaries, not contrivance.

> **VERDICT: SOUND.** This is textbook DRY, and the extraction homes are sensible (app-level shared,
> not flat siblings). KISS-respecting: each helper has ONE clear job.

### B.3 — The scene-fusion gestalt (`demo/scenes/<name>/`) — EARNED, with one caution

**Claim** (`gestalt-demo.md` §0, §2): each scene is split across THREE roots (`app/scenes/*Scene.vue`
shell + `demo/<name>/` domain + `@/components/.../animation-controls`), stitched by a `../../<name>/`
relative climb. Fuse the shell + domain into one `demo/scenes/<name>/` directory.

**Verification:** `EasingScene.vue:13-16` confirms the `../../easing/…` climb (read directly). Every
scene does this. This is genuinely the *opposite* of the `src/animation/` flat-sibling anti-pattern:
there, ONE concept is scattered into hyphenated siblings; here, ONE concept (a scene) is scattered
across THREE directory roots. Fusing into `demo/scenes/<name>/` makes imports local and gives each
scene exactly one folder. **The gestalt explicitly resists over-nesting** (§3: "do NOT introduce
`components/`/`composables/` sub-dirs inside a scene folder" — flat-per-scene is correct at 4-13 files).

**CAUTION (not a refutation):** the fusion is the highest-churn move and touches every import in the
demo. The gestalt correctly sequences it LAST (§11 step 6, atomic per-scene). The one thing the
challenge would add: the `demo/@/` → `demo/shared/` rename (§2) is explicitly marked "cosmetic / optional"
by the gestalt itself — good, because renaming the alias root is pure churn with zero structural payoff
and risks the vite/tsconfig path aliases. **Keep it optional; do the fusion, skip the rename unless
trivially clean.**

> **VERDICT: SOUND / EARNED.** The fusion cures a real three-way scatter and is the load-bearing
> structural move. The KISS guardrails (no intra-scene sub-dirs, rename-is-optional) are correctly stated.

### B.4 — The `animation-controls/` "is it over-engineered?" self-challenge — SOUND (correctly answered NO)

`gestalt-demo.md` §5 already adversarially asks whether the five-dir split
(`components/composables/controls/keyframes/timeline`) is contrivance, and answers NO with verified
file-counts-per-dir (no empty/single-file dirs). The challenge concurs: this subtree is the *model*
directory decomposition, and the real debt is component-boundary (callbacks-as-props, see C.1), not
directory shape. **The doc challenged itself correctly.** One nit: `controls/composables/` co-existing
with the top-level `composables/` is flagged as "borderline over-nesting" but resolved to a one-line
boundary comment (not a move) — that restraint is correct (KISS).

> **VERDICT: SOUND.** A model of an audit interrogating its own decomposition and landing on
> "fix the boundary, keep the tree." No busywork proposed.

---

## PART C — Is any "brittleness" finding actually idiomatic post-Vue-3.5?

Per project memory: *template/`watchEffect` destructure is idiomatic post-Vue-3.5; only a destructured
prop passed INTO a composable is gated.* I checked every brittleness/encapsulation finding against this.

### C.1 — Callbacks-as-props (anim-controls F1) — SOUND (genuine anti-pattern, NOT props-destructure)

This is NOT a props-destructuring question — it is the *inverse* data-flow anti-pattern. Verified:
`AnimationControlsGroup.vue:26-30` passes five callbacks as props
(`:on-panel-transition-end`, `:on-sheet-settled`, `:on-pane-mouse-enter/leave`, `:set-pane-el`), and
`ControlsPaneWrapper.vue:156-165` declares them as `defineProps` function-typed props. The SAME file
(`AnimationControlsGroup.vue:31-36`) uses `@`-events (`@slider-update`, `@scrub-start`…) — proving the
codebase knows the emit idiom and these five are an inconsistent reverse-flow. Worst offender:
`ControlsPaneWrapper.vue:39` `:ref="(el) => setPaneEl(el)"` — an upward ref-teleport disguised as a
prop. The `defineEmits` + `defineExpose({ paneEl })` fix is the correct Vue idiom and is claimed to
drop both ~499L files under 400L.

> **VERDICT: SOUND.** Genuine encapsulation defect, not a Vue-3.5 false-positive. Memory's
> props-destructure carve-out does not apply (this is callbacks-as-props, an orthogonal issue).

### C.2 — `inject(KEY)!` non-null assertion (demo-targets DT-7) — SOUND (befits the precept)

All five inject-Targets do `const demo = inject(KEY)!`. The `!` silently proceeds with `undefined`
if the key is missing, throwing later with no context. Per the precept ("make it fail EXPLICITLY"),
replacing with an explicit `if (!demo) throw new Error("…must be mounted under <Scene>")` is exactly
right. This is a one-liner per file, no over-engineering. The doc correctly declines to build a shared
`useTargetBase` (the inject keys/shapes differ) — that restraint is KISS-correct.

> **VERDICT: SOUND.** Precept-aligned, minimal, non-contrived.

### C.3 — Render-fn slots via `defineExpose` (app-scenes F8) — OVERREACH on the framing

**Claim:** scenes exposing `tabsContent = () => h(EasingSidebar, {demo})` / `ribbonContent = (slotProps) => h(…)`
via `defineExpose` is "effusive dynamicism… a workaround because the slot hierarchy doesn't naturally
surface these injection points… fights Vue's component model."

**Verification of the ARCHITECTURE (this is the crux):** the active scene mounts DOWN inside
`<Suspense>` in `App.vue`'s `#target` slot (App.vue:155-166), while its UI projections must appear in
`EditorShell`'s `#tabs-content` / `#ribbon-content` named slots — which are SIBLING slot positions
(App.vue:126-136 vs 138-167). The scene component is **not an ancestor** of those slot outlets, so a
Vue named slot *structurally cannot* flow scene content up to them. The `defineExpose({tabsContent,
ribbonContent})` + `<component :is="sceneRef?.tabsContent">` bridge (App.vue:120/127/132) is the
**idiomatic cross-sibling render teleport** — it is how you project render output across a
non-parent-child boundary without a `<Teleport>`/portal. Calling it "a workaround because the slot
hierarchy doesn't naturally surface these points" is backwards: the hierarchy *can't* surface them
(siblings), so a render-fn bridge is the correct tool, not a code smell.

The `ribbonContent = (slotProps) => slotProps.selectedControl === "easing" ? h(PlaybackRibbon, …) : null`
(EasingScene.vue:90-104) is a legitimate scoped-slot-equivalent expressed imperatively — render
functions are a first-class, documented Vue 3 API, not an anti-pattern.

**What IS sound:** the *typing* defect. `App.vue:267` `const sceneRef = shallowRef<any>(null)` —
verified — is a real `any` hole, and Finding 9's `useSceneMachineApp.ts` duck-typed `"isPlaying" in
sceneRef.value` writes against `any` are genuinely fragile. The fix is a typed `SceneExposedApi`
interface (Finding 9), NOT replacing render functions with `defineComponent` mini-SFCs.

> **VERDICT: OVERREACH.** The "fights Vue's component model" framing is wrong — render-fn-via-expose
> is the *idiomatic* fix for cross-sibling projection here, not a workaround. **Correction:** keep the
> render-fn slot protocol; the only fix needed is to TYPE the bridge (`SceneExposedApi` per Finding 9,
> which is itself SOUND). The proposal to convert each render fn to a static `defineComponent` is
> optional tooling polish at best, over-engineering at worst (it adds N tiny SFC files for marginal
> template-tooling gain on content that is already trivial `h()` trees).

### C.4 — `DemoControlPoint` raw window listeners (brittleness F1) — SOUND, but the side-note is WRONG

The core finding is sound: `DemoControlPoint.vue` is the one un-migrated component with raw
`window.addEventListener("pointermove"/"pointerup"/"pointercancel")` (the leak-on-mid-drag-unmount
risk is real — no `onScopeDispose` backstop) and raw `handleEl.addEventListener("pointerdown")`.
Routing through `useEventListener` is the correct vueuse migration.

**BUT the stale-comment side-note (lines 73-75) is FACTUALLY WRONG.** It claims "the actual rendered
root (line 15) is `<g data-demo-control-point>` with NO `data-index`… Either the gate selector changed
and the comment is legacy, or the gate is now broken." Verified against the code:
`DemoControlPoint.vue:15` is `<g data-demo-control-point>` (the wrapper) AND
`DemoControlPoint.vue:31-32` is `<circle class="control-point handle" :data-index="index">` (the
handle). **Both markers are present** — the comment at line 9 ("KEEPS the `.control-point.handle` +
`data-index` markup the live gate selects") is **accurate**, not legacy. The auditor read line 15 (the
wrapper) as if it were the only marker and missed the `:data-index` on the inner circle.

> **VERDICT on the core finding: SOUND.** **VERDICT on the side-note: insufficient-evidence (misread).**
> **Correction:** strike the "either legacy or the gate is broken" side-note — the `data-index` markup
> exists and the comment is correct. Do NOT spend a cycle "verifying the gate selector against missing
> markup"; the markup is there.

### C.5 — `SpringHeatmap` raw RO + MutationObserver (brittleness F2) — SOUND

Verified `SpringHeatmap.vue:260-283`: raw `new ResizeObserver` + raw `new MutationObserver` on
`document.documentElement` class with `typeof … !== "undefined"` guards. The `MutationObserver`
re-paints on ANY `<html>` class mutation (over-broad) to discover dark-mode the demo already exposes
reactively via `useGlobalDark()` (already used in `useHighlightCSS.ts`). Replacing RO with
`useResizeObserver(fieldEl, paint)` and the MutationObserver with `watch(isDark, paint)` is a clean
de-brittling AND a precept-aligned removal of the `typeof` fallback guards. This is NOT a Vue-3.5
false-positive — it is raw imperative observer code, exactly the kind the rest of the demo retired.

> **VERDICT: SOUND.** Genuine brittleness, idiomatic vueuse cure, no over-engineering.

### C.6 — EasingTarget per-frame `el.dataset.curve ?? ""` (brittleness F4c) — SOUND

Verified `EasingTarget.vue:304`: the hot per-frame painter reads `el.dataset.curve ?? ""` and the
`?? ""` silently maps a missing attr to the empty (identity-fn) curve. The component already owns
`trackBallEls` (v-for ref array) and re-wires on `viewMode`/`visibleCurves` (lines 347-348), so it can
build an owned `{el, fn, isActiveName}[]` snapshot at re-wire time and iterate that — no per-frame DOM
string-parse, no silent `?? ""`. The doc correctly notes the imperative `el.style.transform` write
must STAY (it is the intended off-render-graph hot-path optimization, NOT brittleness). That nuance is
exactly right.

> **VERDICT: SOUND.** Precise diagnosis, preserves the load-bearing optimization, removes the silent
> fallback. Aligns with the precept.

---

## PART D — Precept-conformance challenges (the docs vs the user's own rules)

### D.1 — Styling F2/F3 "normalise `var(--z-content, N)` fallbacks" — KISS/PRECEPT VIOLATION

**Claim** (`demo-styling.md` F2/F3): scene components use inconsistent `var(--z-content, 2)` /
`var(--z-behind, -1)` fallback defaults; "Normalise ALL fallbacks to `,10`" / "Normalise all to `,-10`".

**The precept says:** *"NO fallback/fall-through behavior. Every instance must be EXCISED entirely OR
made to fail EXPLICITLY. NO silent or graceful handling unless genuinely befitting."*

**Verification:** `--z-content: 10` and `--z-behind: -10` are defined in glass-ui's
`scheme-motion.css` (a HARD dependency, always loaded) AND `--z-behind: -10` is *also* defined locally
in `design-idioms.css:245`. The tokens are **reliably present** — the only scenario where the comma-
default fires is the token file failing to load, in which case the entire app is already broken. So
the `var(--z-content, N)` comma-default is a **silent graceful-degrade guarding a never-occurring
condition** — precisely what the precept forbids.

**Normalising the fallback value to `,10` PERPETUATES the silent fallback** (just with a less-wrong
default). The precept-correct disposition is to **excise the comma-default entirely** — write
`var(--z-content)` / `var(--z-behind)` with NO fallback — so a genuinely-missing token resolves to the
CSS `initial`/invalid value and the layout breaks *visibly* (fail-explicit), surfacing the real
problem instead of papering it with a magic integer. (Even better per the doc's own aside: use the
glass-ui `z-content` Tailwind utility at template sites, dropping the CSS `var()` call entirely.)

> **VERDICT: KISS-VIOLATION / precept-violation.** "Normalise the fallback to the contract value" is
> the WRONG remedy under the user's own precepts — it keeps the silent degrade. **Correction:** EXCISE
> the comma-defaults (`var(--z-content)` no fallback) so a missing token fails visibly; or move to the
> `z-content` Tailwind utility. The *consistency* observation is valid; the proposed cure is not.

### D.2 — DT-6 subgrid fallback "dead in 2026, excise it" — OVERREACH (contradicts modern-web standard)

**Claim** (`demo-targets.md` DT-6): `SequenceTarget.vue:325-327,333-334` has
`grid-template-columns: var(--label-col) 1fr; grid-template-columns: subgrid;` — "CSS subgrid is
Baseline 2023… there is no supported browser that would need the fallback… this is exactly the
'fallback/fall-through behavior' the precepts require to be excised."

**Verification against modern-web-guidance (the project's own standard, `css-layout` guide):**
> "Subgrid: Widely available. Baseline since 2023-09-15… **Do: Pair a subgrid declaration with a
> preceding explicit `grid-template-columns`/`-rows` declaration as a same-cascade fallback for older
> browsers.**"

The guide's own code example uses *exactly* this two-line pattern with the comment "Same-cascade
fallback: ignored when subgrid is supported." So the SequenceTarget pattern (whose comment literally
says "Same-cascade fallback (Baseline 2023) then subgrid") is the **recommended idiom**, not dead code.
Unlike the `var(--z-content, N)` case (D.1), this fallback costs nothing at runtime (the second
declaration overrides in supporting browsers via normal cascade) AND is the documented best practice.

The precept's "NO fallback unless genuinely befitting" — a *zero-cost, standard-recommended,
same-cascade* progressive-enhancement pair IS genuinely befitting; it is categorically different from a
silent error-swallow.

> **VERDICT: OVERREACH.** DT-6 misapplies the no-fallback precept to a standard-recommended
> same-cascade enhancement. **Correction:** KEEP the subgrid fallback pair (it is the modern-web
> idiom). If anything, the precept-conformant note is to ensure it stays a *cascade* fallback (not a
> `@supports` branch). Do not excise it.

### D.3 — `useSceneSwap` "excise entirely" (app-scenes F4) vs "genuinely befitting" (legacy 3a) — INTERNAL CONTRADICTION; app-scenes OVERREACHES

**The two lane docs directly contradict each other on the same file:**
- `demo-app-scenes.md` F4: "Native View Transitions have ≥95% browser support as of 2026… **excise
  `useSceneSwap` entirely**, remove `:style="sceneSwapStyle"`."
- `demo-legacy-sweep.md` 3a: "A 3% engine-dogfooding graceful-degrade is **genuinely befitting**… [only]
  Proposal (low): conditional binding… **Not a correctness bug.**"

**Verification against the Baseline data (modern-web `same-document-transitions` guide):**
> "View transitions: **Newly available. Baseline since 2025-10-14.** Chrome 111 (Mar 2023), Edge 111,
> **Firefox 144 (Oct 2025)**, Safari 18 (Sep 2024)."

View Transitions became Baseline only **eight months ago** (2025-10-14), with Firefox support landing
in **Firefox 144 (Oct 2025)**. Any Firefox ESR before 140, any Safari before 18 (Sep 2024), and the
long tail of un-updated browsers do NOT have VT. The "≥95% as of 2026" figure in app-scenes F4 is
**unsourced and optimistic** for a feature this recently-Baselined — and even at 95%, the 5% gap is a
real coverage hole that the `useSceneSwap` SpringProgress dogfood correctly fills
(`supportsViewTransitions()` feature-gate verified at `useSceneSwap.ts:35`).

**Read of the actual code** (`useSceneSwap.ts`, full file): the `if (!vtOwnsMotion)` guard (line 44)
means the spring + watch are **only constructed on non-VT engines**. On VT browsers `sceneOpacity`
stays `1`, so `sceneSwapStyle` is the constant `{opacity:1, transform:'scale(1)'}` — a computed that
**never recomputes** (its only dep never changes). app-scenes F4's claim that it "adds overhead to
every reactive update of the scene host" is overstated: a never-recomputing computed bound as `:style`
is a single static style object, negligible.

> **VERDICT: app-scenes F4 = OVERREACH** (and the two docs must be reconciled). The legacy-sweep 3a
> disposition is correct: the fallback is **genuinely befitting** (real, recent coverage gap + it
> dogfoods the engine's own `SpringProgress`, which is the demo's whole point). **Correction:** do NOT
> excise `useSceneSwap`. The only legitimate tweak is legacy-sweep's "low" optimization — return
> `null`/skip the `:style` bind on VT engines so the constant style object isn't applied at all. Strike
> app-scenes F4's "excise entirely". This is THE most important contradiction for the R plan to resolve
> before any IMPL, because one doc says delete and the other says keep.

### D.4 — Dead components `Animated.vue` / `ResponsiveSelect.vue` (legacy 1a/1b) — SOUND

Verified by grep: `Animated.vue` has ZERO importers (the `AnimatedText` matches are a different
component). `ResponsiveSelect.vue` has zero importers — its only tree reference is a stale *comment* in
`usePaneRegister.ts:27`. Both files exist on disk. **Excision is clean and correct.** This is exactly
the legacy/dead-code the precept demands be excised.

> **VERDICT: SOUND.** Real dead code, verified zero-consumer, mandatory excision.

### D.5 — `cubeTransformStore` bare `ref` vs `createGlobalState` (state F9) — SOUND

Verified `cubeTransformStore.ts`: `export const sharedCubeTransform = ref<TransformState>({…})` — a
bare module-level `ref`, the lone store not using `createGlobalState`. The HMR argument is correct: a
module-level `ref` resets on Vite module re-eval, whereas `createGlobalState` survives via the accept
hook. Wrapping it for uniformity with every other store is a small, honest consistency fix.

> **VERDICT: SOUND.** Minor but correct; aligns the store layer to one idiom (the doc's own
> "what works well" § B confirms the rest of the store layer is uniform).

### D.6 — `navigator.platform` deprecation (legacy 5a) — SOUND

Verified `iosTextEntry.ts:14` reads `navigator.platform` (deprecated; macOS always reports
`"MacIntel"` regardless of Apple Silicon, and the spec removed it). The `"MacIntel" + maxTouchPoints
> 1` iPadOS heuristic is the legacy pre-iPadOS-13 workaround. The proposed UA + `CSS.supports
("(-webkit-touch-callout: none)")` replacement is the modern idiom. This is a legitimate deprecated-API
excision per the precept.

> **VERDICT: SOUND.** Real deprecated API, correct modern replacement.

---

## PART E — Findings the challenge UPGRADES or adds

### E.1 — The styling docs propagate a "normalise the silent fallback" anti-pattern (see D.1) — escalate

D.1 is not isolated: any "normalise the `var(--x, default)` fallback" proposal across the styling lane
should be re-examined under the precept. The *consistency* concern is valid, but the precept-correct
cure is **excise the comma-default**, not harmonize it. The R plan should adopt one rule: in this
codebase, a `var(--token, fallback)` where `--token` is a guaranteed-present design token is a
precept violation — drop the fallback so a missing token fails visibly.

### E.2 — `useSceneSwap` and the subgrid pair establish a precept-nuance the R plan must encode

D.2 + D.3 both show the no-fallback precept being misapplied to **genuinely-befitting progressive
enhancement** (a same-cascade subgrid pair; a feature-gated dogfood fallback for a recently-Baselined
API). The R plan needs an explicit rubric so IMPL doesn't over-excise:
- **EXCISE:** silent error-swallows, fallbacks guarding never-occurring conditions (D.1 z-index),
  dead no-op handlers (onScroll), deprecated APIs (navigator.platform).
- **KEEP (genuinely befitting):** feature-gated graceful-degrade for a real coverage gap
  (useSceneSwap on non-VT engines), zero-cost same-cascade progressive enhancement that IS the
  documented standard (subgrid), narrow named third-party-error suppression (Monaco `Canceled`,
  warmScene prefetch, html2canvas preview).

---

## Appendix — Verification log (file:line read directly)

- `useScrollSnapScene.ts:56-61` — onScroll no-op confirmed; `:32,:47` dataset.sceneId reads confirmed.
- `SceneSwitcherCarousel.vue:40,57` — sole consumer of useScrollSnapScene; destructures only
  `{onScroll, scrollToScene}` (nearestCenterId unused).
- `ChromeDock.vue:124-128,269-305` — `switchScene` emit + ungated scene Select confirmed.
- `App.vue:12,48,149-179,192,267,393,481-482` — @switch-scene wiring, carousel SIBLING-not-child of
  scene-host, VT name on scene-host only, `sceneRef = shallowRef<any>`, runSceneSwitch single entry.
- `EasingScene.vue:13-16,53,90-122` — `../../easing` climb; render-fn slots via defineExpose.
- `DemoControlPoint.vue:9,15,31-32,68` — BOTH `data-demo-control-point` AND `:data-index` present
  (side-note refuted).
- `SequenceTarget.vue:306,325-327,333-334` — subgrid same-cascade fallback pair confirmed.
- `EasingTarget.vue:161,217,290-306` — resolvedFunctions rebuilt vs demo.timingFunctionsAnd; per-frame
  `el.dataset.curve ?? ""` confirmed.
- `useEasingDemo.ts:30,55,323` — `_timingFunctionsAnd` mutable singleton; exports `timingFunctionsAnd`.
- `useSceneSwap.ts` (full) — `if (!vtOwnsMotion)` gate; constant style on VT engines.
- `cubeTransformStore.ts` (full) — bare module ref confirmed.
- `AnimationControlsGroup.vue:26-36` + `ControlsPaneWrapper.vue:39,156-165` — callbacks-as-props +
  `:ref` ref-teleport confirmed; `@`-events used in same file.
- `wc -l` — all oversize counts confirmed exact (560/538/511/504; 499×7; 498).
- modern-web-guidance `css-layout`: subgrid Baseline 2023-09-15, same-cascade fallback RECOMMENDED.
- modern-web-guidance `same-document-transitions`: View Transitions Baseline 2025-10-14, Firefox 144.
