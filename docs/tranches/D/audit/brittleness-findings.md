# D audit — brittleness lane (selectors · z-order · feature-guards · reactivity)

The demo's fragility is concentrated, not pervasive: a handful of global DOM
selectors that couple components to document structure they don't own, a
single-sourced `--z-*` z-order scale (defined in glass-ui, consumed cleanly by
the demo) that the demo **does not document** as an ordered layer contract and
**does not gate** against raw drift, a work-area `calc/min/max` chain leaning on
`env()`/`dvh`/`-webkit-mask-image` with **zero `@supports` guards anywhere in the
demo**, and three reactivity bridges papering over `markRaw` opacity. Every site
below is `grep`-verified against the live tree — **verified, not asserted.**

Findings split: the selectors/z-order/feature-guards land in **D.W3**
(brittleness hardened); the engine-adjacent `_snapSettled` symmetry rides D.W3
per the plan but is the engine lane's item.

## Findings

| # | Finding | Evidence (file:line) | Severity | Wave |
|---|---|---|---|---|
| B1 | Global `document.querySelectorAll("pre")` — highlights **every** `<pre>` in the document, not the editor's own; couples to page-wide DOM | `keyframes/KeyframesEditor.vue:439` | High | D.W3 |
| B2 | `.closest(".easing-target")` + `.querySelector(".track-container")` — JS reaches up/down by string selector instead of owned refs | `easing/EasingTarget.vue:142` (`.closest`), `:217` (`.querySelector`) | Medium | D.W3 |
| B3 | `[data-sonner-toaster]` coupling — two dialogs guard `@interact-outside` by reaching into the toast library's private DOM contract | `CSSPasteDialog.vue:7`; `keyframes/KeyframesEditor.vue:78` | Medium | D.W3 |
| B4 | **The `--z-*` scale is single-sourced in glass-ui but UN-DOCUMENTED + UN-GATED demo-side** — the demo consumes it via 22 `z-dock`/`z-content`/`z-controls`/`z-bar`/`z-popover`/`z-modal` utility sites (zero raw `z-[N]`), but has no demo-side layer-contract doc, no drift gate, ONE orphan raw `z-index:-10`, and four raw tailwind rungs bypassing the semantic names | scale: glass-ui `tokens.css:270-280`; orphan: `cube/CubeTarget.vue:199` (`z-index:-10`); raw rungs: `cube/CubeTarget.vue:42` (`z-10`), `app/scenes/CubeScene.vue:117` (`z-20`), `matrix-editor/MatrixEditor.vue:13` (`z-10`), `keyframes/KeyframeCard.vue:23` (`z-0`); demo `style.css` (no `--z-`/`z-index` token — grep = 0, because the tokens live in glass-ui) | Low/Medium | D.W3 |
| B5 | The work-area `calc()/min()/max()` chain + `env()`/`dvh`/`-webkit-mask-image` — **zero `@supports` guards in the entire demo** | chain: `style.css:29–62,137–185`; `env()`: `style.css:54`, `AnimationMenuBar.vue:4`, `TopDock.vue:114`; `mask-image`: `AnimationControlsGroup.vue:548–549`, `AnimationControls.vue:229–235`; `@supports`: **0 found anywhere** | Medium | D.W3 |
| B6 | `useAnimationSync` rAF bridge runs **unconditionally, forever** — three ref writes per frame for every mounted sync, never gated, never stopped while mounted | `controls/composables/useAnimationSync.ts:21–29` | Medium | D.W3 |
| B7 | `useKeyframesEditor` array-watch on a `markRaw` source — `watch(animation.templateFrames)` can't see element-level mutation; correctness leans on compensating explicit calls | `keyframes/composables/useKeyframesEditor.ts:353`; mutation: `KeyframesEditor.vue:13` | Medium | D.W3 |
| B8 | `useScrollFade` listener re-attach — three duplicate attach paths (`watch(el)`, `watch(observeEl)`, `onMounted`) hand-managed; vueuse `useEventListener`/`useResizeObserver` collapse them | `composables/useScrollFade.ts:100–141,155–164` | Low | D.W3 |

## B1 — the global `<pre>` query

`KeyframesEditor.vue:439`:

```js
const pres = document.querySelectorAll("pre");
pres.forEach(highlight);
```

`highlightCSS()` highlights the editor's two owned `<pre>` refs (lines 436–437,
correct) and then **re-highlights every `<pre>` in the document** — any code
block in any sibling component, dialog, or scene. It is a document-global write
from a leaf component's update path: fragile (highlights things it doesn't own,
on every keyframe change), and a latent correctness/perf hazard as the demo
grows more `<pre>` surfaces. Fix → scope to the editor's own container via
`useTemplateRef` and iterate `containerRef.value.querySelectorAll("pre")`, or
better, drive only the two known refs (the global sweep is the bug, not a
feature).

## B2 — string-selector reach in EasingTarget

`easing/EasingTarget.vue` couples its JS to its own template's class names:

- `:142` — `const root = container.closest<HTMLElement>(".easing-target") ?? container;`
- `:217` — `const trackEl = container.querySelector<HTMLElement>(".track-container");`

The scoped CSS (`:269` `.easing-target`, `:287` `.track-container`) and the JS
read the same magic strings; rename the class and the JS silently degrades to the
fallback (line 142's `?? container`). The component owns both the template and
the script — these should be `useTemplateRef("easingTarget")` /
`useTemplateRef("trackContainer")` (or provide/inject for the cross-child case),
so the binding is the ref, not a string the linter can't follow. The comment at
`:267–268` even documents the coupling as intentional — D.W3 makes it a ref so
the contract is type-checked, not commented.

## B3 — the `[data-sonner-toaster]` coupling

Two dialogs (`CSSPasteDialog.vue:7`, `KeyframesEditor.vue:78`) guard
`@interact-outside` by reaching into the toast library's private attribute:

```js
if (target?.closest('[data-sonner-toaster]')) return event.preventDefault();
```

This prevents the dialog closing when the user clicks a toast — correct intent,
but it hard-codes `vue-sonner`'s internal DOM contract (`data-sonner-toaster`) in
two places. If the toast lib renames the attribute, both dialogs silently
mis-behave. Fix → a single documented constant
(`TOAST_ROOT_SELECTOR = "[data-sonner-toaster]"`) in one shared module, with a
comment naming it as the vue-sonner contract — so the coupling is explicit,
single-sourced, and greppable when the dep upgrades.

## B4 — the un-documented, un-gated z-index scale

The `--z-*` ordered scale is ALREADY single-sourced — in glass-ui, not the demo
(`--z-content:10 / --z-controls:20 / --z-bar:30 / --z-dock:40 / --z-overlay:50 /
--z-popover:130 / --z-modal:140`, `node_modules/@mkbabb/glass-ui/dist/styles/tokens.css:270-280`).
The demo CONSUMES it cleanly: 22 `z-dock`/`z-content`/`z-controls`/`z-bar`/
`z-popover`/`z-modal` utility sites, ZERO raw `z-[N]` bracket-arbitrary values.
The grep for `--z-`/`z-index:` in the demo's `style.css` returns nothing — true
only because the tokens live in glass-ui, NOT because the scale is missing.

The gap is therefore NOT a missing scale; it is three demo-side omissions:

- **(a) no demo-side documentation** of the ordered layer contract — no single
  place that records "dock above content, popover above dock, modal above all,"
  so a new component guesses where to stack;
- **(b) no gate against future raw `z-[N]` drift** — the clean state is
  unlocked;
- **(c) one orphan raw `z-index: -10`** (`cube/CubeTarget.vue:199`, the axis-line
  layer), plus four raw tailwind rungs that consume the scale numerically but
  bypass the semantic `z-dock`/`z-content` names: `cube/CubeTarget.vue:42`
  `z-10`, `app/scenes/CubeScene.vue:117` `z-20`, `matrix-editor/MatrixEditor.vue:13`
  `z-10`, `keyframes/KeyframeCard.vue:23` `z-0`.

Fix → **DOCUMENT** the existing glass-ui `--z-*` contract as an ordered demo
layer ladder, **GATE** against raw `z-[N]` drift, **reconcile** the one orphan
`z-index: -10` to a named `--z-behind`, and either reconcile the four raw rungs
to their semantic `z-*` names where they map to a documented rung or record them
as deliberate local stacking. Document + gate; do NOT invent a scale the demo
already consumes.

## B5 — the unguarded modern-feature chain

The work-area layout (`style.css:29–62` base, `:137–185` the mobile cap) is a
dense `clamp()/min()/max()/calc()` chain over `dvh` and `env(safe-area-inset-*)`:

- `:29` `clamp(44rem, 88dvh, 66rem)`, `:30` `min(100dvh, …)`, `:40–42` the
  vertical-bias `calc()` triplet, `:52–55` the `--dock-band-reserve` with
  `env(safe-area-inset-bottom, 0px)`, `:155` `min(64rem, calc(100dvh - …))`.
- Component-level: `AnimationMenuBar.vue:4`
  `pb-[max(calc(var(--dock-margin)/2),env(safe-area-inset-bottom))]`,
  `TopDock.vue:114` `top: calc(max(var(--work-area-top-offset,0px),
  env(safe-area-inset-top,0px)) + …)`, `AnimationControlsGroup.vue:449,461`
  `min(100dvh, …)` / `calc(100dvh - …)`.
- `-webkit-mask-image` fade gradients: `AnimationControlsGroup.vue:548–549`
  (both `mask-image` + `-webkit-mask-image` — good, prefixed), `AnimationControls.vue:229–235`
  (`mask-image` only — **no `-webkit-` fallback**).

Verified: **`@supports` appears ZERO times in the entire demo.** The `env()` calls
carry inline fallbacks (`, 0px`) — that is the right defense for `env()` — but the
`dvh`/`-webkit-mask-image`/the `mask-image`-without-prefix at
`AnimationControls.vue:229` have **no** feature guard. On a browser lacking
`dvh` the work-area chain silently collapses (no `100vh` fallback in the
saturating `min()`); the unprefixed `mask-image` fade no-ops on older WebKit.
Fix → targeted `@supports` guards (a `100vh` fallback before the `dvh` chain; the
`-webkit-mask-image` prefix added at `AnimationControls.vue:229–235`), plus the
viewport-trap audit (the plan's term) confirming no scene over-reserves.

## B6–B8 — the reactivity hazards

Animation objects are `markRaw` (verified: `useTimeline.ts:51`, `App.vue:193`,
`SquareScene.vue:19`, `useCubeAnimations.ts` — the engine state is deliberately
untracked so Vue doesn't deep-proxy a hot object). Three bridges paper over the
opacity, each with a sharp edge:

- **B6 — `useAnimationSync` (`:21–29`)** — the rAF loop starts immediately and
  unconditionally (`start()` at `:29`, no guard) and writes `currentT`/`isStarted`/
  `isReversed` every frame for the lifetime of the component. The in-file comment
  (`:9–11`) justifies it ("three ref assignments per frame is negligible … gating
  creates chicken-and-egg") — defensible, but it means *every mounted controls
  panel* spins a permanent rAF, even when nothing is playing and the panel is
  off-screen. The hazard is N permanent loops, not one. Fix → gate on a
  cheap `isStarted || isPlaying` *or* drive the sync from the single group-level
  progress poll (`useAnimationProgress`) so there is one loop, not one-per-panel.
- **B7 — `useKeyframesEditor` array-watch (`:353`)** —
  `watch(animation.templateFrames, async () => debouncedUpdateAllStrings())`
  watches a `markRaw` array's *reference* surface. Element-level mutation
  (`KeyframesEditor.vue:13`: `animation.templateFrames[i].start = parseCSSValueUnit(val)`)
  does **not** reliably fire this watch — `markRaw` means the array elements are
  un-proxied. Correctness today is held by the explicit
  `updateAllStringsAndAnimation()` call right after each mutation site (line 14) —
  i.e. the watch is partly vestigial / fires only on length changes. Fix →
  make the data-flow honest: either drop the array-watch and rely on the explicit
  update calls (single source of truth), or use `watch(..., { deep, flush: 'post' })`
  on a tracked projection — not a half-working watch on a raw array. The hazard is
  a watch that *looks* like it covers mutation but doesn't.
- **B8 — `useScrollFade` re-attach (`:100–141,155–164`)** — listeners are
  detach-before-attach-safe (no leak: `attachScrollListener` calls
  `detachScrollListener` first, `:100–101`), but the attach logic is hand-managed
  across **three** paths: `watch(el)` (`:136`, re-attaches scroll + conditionally
  resize), `watch(observeEl)` (`:144`, the resize case), and `onMounted` (`:155`).
  The `if (!observeEl)` branch at `:139` is exactly the kind of conditional that
  rots. vueuse's `useEventListener(el, "scroll", …)` and `useResizeObserver(el, …)`
  auto-rebind on ref change and auto-cleanup on unmount — collapsing all three
  manual paths + the `onUnmounted` (`:161–164`) to zero bookkeeping. **Low** —
  correct today, brittle to edit.

## Verification (re-runnable)

```sh
cd demo
# B1 — the global pre query:
grep -n 'document.querySelectorAll("pre")' @/components/custom/animation-controls/keyframes/KeyframesEditor.vue
# B2 — string-selector reach:
grep -n '.closest(".easing-target")\|.querySelector<HTMLElement>(".track-container")' easing/EasingTarget.vue
# B3 — sonner coupling (two sites):
grep -rn 'data-sonner-toaster' --include="*.vue" @/ | grep -v "/dist/"
# B4 — no z scale (token grep = 0; literals scattered):
grep -n '\-\-z-\|z-index:' @/styles/style.css   # → (nothing)
grep -rEn '\bz-[0-9]+\b|z-index:' --include="*.vue" @/ app/ cube/ | grep -v "/dist/"
# B5 — zero @supports; env/dvh/mask sites:
grep -rn "@supports" --include="*.css" --include="*.vue" @/ app/ cube/ square/ simple/ amiga/ playground/ easing/ | grep -v "/dist/"   # → (nothing)
grep -rn "env(\|dvh\|-webkit-mask\|mask-image" --include="*.css" --include="*.vue" @/ app/ | grep -v "/dist/"
# B6–B8 — markRaw bridges:
grep -n "start()" @/components/custom/animation-controls/controls/composables/useAnimationSync.ts
grep -n "watch(animation.templateFrames" @/components/custom/animation-controls/keyframes/composables/useKeyframesEditor.ts
grep -n "attachScrollListener\|watch(el\|watch(observeEl" @/components/custom/animation-controls/composables/useScrollFade.ts
```

**Hard gate for D.W3** — `proof:brittleness`: a checked-in instrument that
(a) greps the source and asserts ZERO `document.querySelectorAll`/global
`document.querySelector` calls outside an allowlist (B1 closed); (b) asserts the
existing glass-ui `--z-*` contract is DOCUMENTED as an ordered demo layer ladder,
ZERO raw `z-[N]` bracket-arbitrary values survive (locks the clean state against
drift), and every raw `z-index:` value resolves to a named `--z-*` token (the one
orphan `z-index: -10` → `--z-behind`) — document + gate, NOT invent (B4); (c)
asserts `@supports`/`vh`-fallback coverage for every `dvh` and unprefixed
`mask-image` site (B5 guarded); (d) a mounted-then-idle controls panel spins
**one** rAF, not one-per-panel (B6 gated, measured via a loop-count probe). The
gate reddens on a re-introduced global selector, a raw `z-[N]` drift, an
unguarded `dvh`, or an ungated permanent rAF.
