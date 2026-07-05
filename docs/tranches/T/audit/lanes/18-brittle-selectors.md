# Lane 18 — Brittle Selectors + Reactivity (VERDICT #28)

**Surface**: deep/brittle CSS selectors, `querySelector` couplings in composables/components,
fragile reactivity (watch-on-array-flush, manual listeners, `:deep()` abuse, data-attribute
contracts). Read against `tranche-s-impl`, dev server + static sweep, no source changes.

## Method + the governing meta-fact

Two gates already patrol this exact surface and both are GREEN on this tree:

- `scripts/proof-brittleness.mjs` (`npm run proof:brittleness`) — forbids global
  `document.querySelector*`, un-scaled `z-index`, un-guarded `dvh`/`env()`/`mask-image`,
  hand-rolled `.addEventListener`/`ResizeObserver`, callback-props, `var(--z-*, fallback)`.
- `scripts/proof-no-brittle-selector.mjs` (`npm run proof:no-brittle-selector`) — forbids
  class-string `.closest()`/`querySelector()` walks, but **only inside
  `demo/scenes/{spring,sequence,motion-path}`**.

Both gates are correctly built and correctly green. The findings below are not "the gates are
buggy" — they are the blind spots a narrowly-scoped, pattern-matched static gate leaves by
construction: (a) it only forbids the *global* `document.querySelector*` form, not an
owned-ref `.querySelector()` that still reaches through a *vendor's* generated subtree; (b) its
class-walk clause is scoped to three scene dirs, not the shared `@/` composables where most of
the actual DOM-shape coupling lives; (c) neither gate has a clause for `:deep()`, non-scoped
CSS, or a `data-*` attribute doing double duty as both a decorative hook and a CI actuation
target. This is the same "green source-shape gate, red owner verdict" pattern the tranche's
meta-fact names — recurring at the instrument level, not just the design level.

## Finding table

| # | Class | Site(s) | Severity |
|---|---|---|---|
| 1 | Non-scoped global selector collides with a third-party ARIA convention | `tab-trigger.css:78` (`[data-state="active"][role="tabpanel"]`) | High |
| 2 | `:deep()` reaches vendor-private DOM instead of a public prop/CSS-var, duplicated by hand across sibling files | `PlaybackRibbon.vue:191`; `EasingSidebar.vue:215,228,235-236`; `TimingFunctionPanel.vue:244,258`; `design-idioms.css:753-816` (`.labeled-field-grid`) | High |
| 3 | `data-*` contract wires CI gates directly to condemned UI | `GestureLegend.vue`; `EasingSidebar.vue:61`; `SequenceTarget.vue:63`; `scripts/gesture-manifest.mjs`; `scripts/proof-easter-egg.mjs` | High |
| 4 | Parallel, hand-rolled roving-tabindex + active-state engines (≥3) for one WAI-ARIA pattern | `KfPillTabs.vue`+`useKfPillTabs.ts`; `useToolbarKeyboard.ts`; `AnimationControls.vue` inline `data-state`; glass-ui `SegmentedTabs` (via `useTabStripScroll.ts`) | Medium |
| 5 | Owned-ref `.querySelector()` still couples to a vendor's/child's *generated* DOM shape (the gate's blind spot) | `useTabStripScroll.ts:52,72`; `useToolbarKeyboard.ts:43`; `useKfPillTabs.ts:52-56` | Medium |
| 6 | Un-refcounted singleton DOM resource removed on a per-consumer unmount | `useHighlightCSS.ts:41-44,119-122` (2 concurrent consumers: `KeyframesEditor.vue` + its always-mounted child `KeyframesAddDialog.vue`) | Low–Medium (latent) |

---

## 1. A non-scoped global selector keyed to a third-party ARIA convention

`demo/@/components/custom/animation-transport/controls/tab-trigger.css:78`:

```css
[data-state="active"][role="tabpanel"] {
    animation: enter var(--duration-fast) var(--ease-out);
    --tw-enter-opacity: 0;
    --tw-enter-translate-x: 0.5rem;
}
```

The file's own header comment explains *why* it is non-scoped: `.tab-trigger-*` and this
tabpanel rule paint reka-ui's generated `<TabsTrigger>`/`<TabsContent>` DOM, which does not
carry the SFC's `[data-v-*]` scoping hash, so a `<style scoped>` block would silently fail to
match. The fix chosen was to drop scoping entirely rather than to scope the *selector root* (a
class on the panel host). The selector `[data-state="active"][role="tabpanel"]` is the literal,
standard reka-ui/Radix `Tabs` convention — not a demo-private name. This file is imported once
(`AnimationControls.vue:212`, `import "./tab-trigger.css"`) but its effect is document-wide:
**any** `role=tabpanel][data-state=active]` element anywhere on the page — including one
rendered by an unrelated glass-ui component that also happens to use reka's `Tabs` internally
(glass-ui/reka-ui remain peers per `demo/CLAUDE.md`; glass-ui's BG/BH tranches are
"forthcoming," per VERDICT #27) — silently inherits this demo's `enter` slide-in animation, with
zero compile-time or lint signal. `AnimationControls.vue:171` shows the authors were aware of
half of this hazard: the *single-surface* panel path deliberately uses a `single-surface-panel`
**class** instead of `role=tabpanel` "so the pane probes key on" a scoped seam — but the
`v-else` multi-tab path (line ~98, ~129, ~149) still emits raw `role=tabpanel` + `data-state`
and rides the unscoped global rule.

**Root cause**: the demo needed to style reka-ui-generated DOM it doesn't own, and reached for
"drop the scope" rather than "scope the *root*, not the descendant selector" (e.g.
`.animation-controls-tabs [data-state=active][role=tabpanel]`, which would still cross the
shadow boundary but at least be namespaced to this host's subtree).

## 2. `:deep()` as a proxy for a public prop, duplicated by hand per call site

18 `:deep()` sites across 7 files. Three representative cases show the same shape:

- **`PlaybackRibbon.vue:170-193`** overrides the timeline scrubber's track height by fighting
  cascade specificity against glass-ui's own default:
  ```css
  .timeline-green :deep(.glass-slider[data-variant=timeline]) {
      --slider-track-height: 1.5rem;
  }
  ```
  The comment (`:172-181`) explains the wrapper-level CSS var lost to `[data-size=md]`'s
  higher-specificity default, so the fix reaches *through* `:deep()` to out-specify it. But
  glass-ui's `Slider` (`node_modules/@mkbabb/glass-ui/dist/components/ui/slider/Slider.vue.d.ts`)
  already ships a public `size?: "sm" | "md" | "lg"` prop for exactly this — "Track + thumb
  geometry" — and `PlaybackRibbon.vue:10-18`'s `<Slider variant="timeline" ... />` never passes
  it. The idiomatic fix (`size="lg"`) was available and unused; the `:deep()` override fights
  the same component's own public contract instead of using it.

- **`EasingSidebar.vue:215-238`** and **`TimingFunctionPanel.vue:244-258`** each independently
  hand-derive a `:deep(.easing-curve-canvas)` `block-size`/`max-block-size` clamp — the *same*
  child component (`EasingCurveCanvas`), from *two different* call sites, each with its own
  paragraph of pixel-arithmetic ("measured ≈150px of `scrollHeight − canvasBlockSize`", "8.5rem
  (136px) — exactly the measured chrome — minus a 1px sub-pixel guard") baked into the
  `:deep()` selector's value. Neither formula shares a source; a future change to
  `EasingCurveCanvas`'s own internal chrome (its wrapper padding, its title row) invalidates
  both independently, and nothing but a human eyeballing the rendered canvas would notice a
  drift between them — `proof:bezier-grown`/`proof:bezier-no-scroll` assert *one* panel's
  absolute fit, not cross-panel consistency.

- **`design-idioms.css:753-820`** (`§LABEL-subgrid`) is the *systemic* version of the same
  pattern, promoted to the demo's sanctioned idiom: a global, unscoped
  `.labeled-field-grid > .labeled-field { grid-template-columns: subgrid; }` rule keyed to
  glass-ui's private DOM shape, documented in the file itself as reverse-engineered from
  "glass-ui labeled-field.js" (`:769-770`). `AnimationControlsControls.vue:370-379`'s own
  comment confirms this *replaced* a prior per-component `:deep(.labeled-field)` rule — the
  fix for the duplication was to make the vendor-internal coupling global and singular, not to
  ask glass-ui for a public alignment contract. `scripts/proof-label-subgrid.mjs` DOES
  browser-actuate against `.labeled-field`/`.labeled-field-label` at runtime, so a glass-ui
  rename would be caught — but reactively, after the fact, and it would red every consuming
  panel simultaneously rather than surfacing at the one call site that changed.

**Root cause**: no established idiom for "ask the child/vendor component for a size or slot";
CSS combinators reach through the encapsulation boundary as the default move. This is the exact
gap VERDICT #18/#27 name ("why aren't these just glass-ui components?" / "leverage proper glass-
ui components... delineate our gaps, and glass-ui's gaps").

## 3. `data-gesture-tell` wires two CI gates to UI the owner explicitly condemned

`data-gesture-tell="<scene>:<id>"` is not decoration — it is the literal selector the
browser-actuated `proof:gesture-manifest` (`scripts/gesture-manifest.mjs`) and
`proof:easter-egg` (`scripts/proof-easter-egg.mjs`) gates click and assert against, and both
ride in `proof:hygiene-chain` → `proof:all`. Concretely:

- `scripts/gesture-manifest.mjs:42,52,62,72,82,92,102` — every entry's `tell` is a
  `[data-gesture-tell="scene:id"]` selector, and several `touch.target`s are class-string
  selectors on the *scene* itself (`".spring-rail"`, `".cube"`, `".amiga-canvas"` at
  `:43,53,63`) — a second, test-side instance of the exact class-walk shape
  `proof:no-brittle-selector` forbids in *source*, un-gated because it lives in a script, not
  `demo/`.
- The tell for `spring:derby`, `cube:roll`, `amiga:boing`, `square:tumble` is carried by
  `GestureLegend.vue`'s `.gesture-legend__row` (`:16-21`) — **the exact component VERDICT #8
  rejects wholesale** ("remove all elements like this").
- The tell for `easing:gallery` (`scripts/gesture-manifest.mjs:82-84`) is
  `EasingSidebar.vue:58-61`'s `.gallery-door` button — **the exact button VERDICT #15 rejects**
  ("remove this button"), and `scripts/proof-easter-egg.mjs:131,500` clicks that same selector
  as its trigger.
- The tell for `sequence:retime` is `SequenceTarget.vue:61-66`'s inline `.seq-gesture-tell`
  caption — the same "drafting-stamp" shape VERDICT #8 names generically.

**Root cause**: the gesture-manifest census (S.G3) was built to make "documented but
unreachable" gestures structurally impossible — a good discipline — but it welded the
falsifiability contract to the *specific presentational elements* carrying the tell, rather
than to an abstraction the elements merely implement. The owner's verdict and the gate's
selector contract are now in direct tension: implementing VERDICT #8/#15 as literally stated
("remove all elements like this," "remove this button") deletes the DOM nodes two hygiene-chain
gates click-and-assert on. Whoever executes T must retire/re-home the tell *in the same motion*
as the UI removal — treating the resulting `proof:gesture-manifest`/`proof:easter-egg` reds as
"the gate correctly enforcing condemned UI" and rewriting the census, not as a regression to
patch by resurrecting the rejected element.

## 4. Three-to-four parallel implementations of "which tab is active"

The codebase carries the identical WAI-ARIA roving-tabindex + active-state pattern in parallel,
independently:

1. **glass-ui's own `<SegmentedTabs>`** — `role=tab`/`aria-selected`, read externally via
   `useTabStripScroll.ts:52,72` (a documented "vendor-DOM contract").
2. **`KfPillTabs.vue` + `useKfPillTabs.ts`** — `role=tab`/`data-state`, explicitly built
   (`KfPillTabs.vue:2-12`, "R.W6 / DM-5 CONTINGENCY KILL") as a stopgap around a glass-ui 4.0.1
   accessibility bug (`SegmentedTabs` emitting `aria-orientation` unconditionally on its
   `role=group` pill variant). This is precisely the component VERDICT #18 singles out: "wtf
   are most of these items? KfPillTabs.vue?? KF? Pills? Why aren't these just glass-ui
   components?" — used at exactly 2 sites (`SpringSidebar.vue`, `AnimationControls.vue`).
3. **`useToolbarKeyboard.ts`** — a *third*, independently hand-written roving-tabindex core for
   the KeyframesEditor toolbar. Its `step()`/`focusIndex()` (`:58-71`) and `useKfPillTabs.ts`'s
   `onKeydown()` (`:61-87`) implement the *same* modulo-wraparound next/prev + Home/End + focus-
   follows-selection algorithm, independently, in two files, with no shared primitive — despite
   `useKfPillTabs.ts:6-8`'s own comment naming `useToolbarKeyboard` as its precedent.
4. **`AnimationControls.vue`**'s own inline `data-state="active"|"inactive"` gating on plain
   `role=tabpanel` divs (`:98,129,149`) — a fourth, non-roving variant of the same
   active/inactive contract, for panel visibility rather than tab focus.

**Root cause**: each site solved its local accessibility need in isolation (one as a glass-ui
bug workaround, one for a non-tablist toolbar, one for panel gating) without ever factoring the
shared roving-tabindex arithmetic into one composable, so the codebase pays for the same fix
three times and a future glass-ui aria fix (retiring the reason `KfPillTabs` exists) has no
single seam to retire *through*.

## 5. The owned-ref query still couples to a generated DOM shape (the gate's blind spot)

`proof:brittleness` clause 1 forbids `document.querySelector*`; `proof:no-brittle-selector`
forbids class-string walks but only inside `demo/scenes/{spring,sequence,motion-path}`. Neither
clause fires on these, all outside that scope and none using the raw `document.*` form:

- **`useTabStripScroll.ts:52,72`** — `tabsHeaderEl.value?.querySelector("[role=tab][aria-
  selected=true]")` / `querySelector("[role=tablist]")`. Documented and deliberate (the file's
  own comment calls it "a single DOCUMENTED vendor-DOM contract"), but it is exactly as
  structurally fragile as the global form the gate forbids: it assumes glass-ui's
  `<SegmentedTabs>` continues to render a bare `role=tablist` descendant with `role=tab`
  buttons carrying `aria-selected` — an implementation detail, not a public API, of a
  dependency the tranche itself flags as "in active development."
- **`useToolbarKeyboard.ts:43`** — `container.querySelectorAll("button")`, filtered by
  `disabled`/`aria-hidden`. Assumes every roving item is a *direct-or-nested* `<button>`
  descendant with no non-roving buttons mixed in; a future toolbar item that wraps its trigger
  in a child component emitting more than one internal `<button>` silently joins the roving
  cohort.
- **`useKfPillTabs.ts:49-59`** (`focusTab`) — `Array.from(list.children).find(el =>
  el.dataset.value === value)`. Walks *direct* children only; wrapping a `<button>` in even one
  layer (e.g. a tooltip wrapper) makes the tab permanently unfocusable via keyboard with no
  error, only a silent roving-tabindex regression.

**Root cause**: the two existing gates pattern-match on `document.querySelector*` /
`.closest(".class")` string shapes; an owned-ref reach into a *vendor's* or *sibling's*
generated subtree via an attribute selector, or a bare `children`/`querySelectorAll`
structural assumption, is the same brittleness class but doesn't match either regex.

## 6. An un-refcounted singleton DOM resource, torn down per-consumer

`useHighlightCSS.ts`'s `useCodeHighlight()` (`:61-125`) lazily creates ONE shared
`document.head` `<style id="highlightjs-theme">` node (module-level `THEME_STYLE_ID` constant,
`:49`) and — critically — **removes it in its own `onUnmounted`** (`:119-122`):
```ts
onUnmounted(() => {
    themeStyle.value?.remove();
    themeStyle.value = null;
});
```
It is called from **two** call sites that mount concurrently, not sequentially:
`KeyframesEditor.vue:175` and, nested inside `KeyframesEditor.vue`'s own template at line 75,
its always-rendered child `KeyframesAddDialog.vue:92` (the `<Dialog>`'s `open` prop only gates
the dialog *content* visibility — the `KeyframesAddDialog` *component* itself, and its
`<script setup>` call to `useCodeHighlight`, is unconditionally present whenever
`KeyframesEditor` is). Today both instances mount and unmount together (same parent lifecycle),
so the double-teardown is currently a harmless double-`remove()`. But the resource is a
document-global singleton being lifecycle-managed as if it were locally owned by whichever
instance unmounts first — there is no reference count. The first future consumer with an
*independent* lifetime from `KeyframesEditor` (a second, separately-toggled Monaco pane; a
scene-transition window where an old scene's editor outlives the new one's momentarily) orphans
the sibling's `themeStyle` ref at a detached node: `setCodeTheme()` keeps firing on
`watch(isDark, ...)` but writes `.textContent` to a node no longer in the document — a silent,
errorless stale-theme regression, not a crash, so it would not surface in any current gate.

---

## T recommendations

1. **Scope every cross-component tab-panel selector to its own root, not the document.**
   Scope sketch: `tab-trigger.css`'s `[data-state=active][role=tabpanel]` and
   `.tab-trigger-*` rules gain a namespacing ancestor class on the panel HOST (e.g.
   `.animation-controls-tabs [data-state=active][role=tabpanel]`), so the rule only ever
   matches this host's own generated panels, never a coincidental match elsewhere in the page.
   Falsifiable gate: a static check that every non-scoped selector rooted on
   `[role=tabpanel]`/`[role=tablist]`/a bare vendor class name in demo CSS is prefixed by at
   least one demo-owned ancestor class (extend `proof:brittleness` clause 2's shape: a named-
   root requirement, not a named-token requirement). Size: **S**.

2. **Prefer the vendor's public prop over `:deep()`; when `:deep()` is unavoidable, centralize
   it per vendor component, not per call site.** Scope sketch: swap `PlaybackRibbon.vue`'s
   `:deep(.glass-slider[data-variant=timeline]){--slider-track-height:1.5rem}` for
   `<Slider size="lg" .../>`; collapse `EasingSidebar.vue`'s and `TimingFunctionPanel.vue`'s
   independently-derived `:deep(.easing-curve-canvas)` clamps into ONE sizing contract owned by
   `EasingCurveCanvas` itself (a `size="sidebar"|"detail"` prop, or an exported `--easing-
   canvas-block-size` CSS var the two hosts merely *set*, no `:deep()` needed). Falsifiable
   gate: extend `proof:no-brittle-selector`'s shape — zero `:deep()` targeting the SAME child
   selector string from more than one file (a duplicate-target census), and a `size`/`variant`-
   prop-exists check before a `:deep()` override of a glass-ui component's own sizing var is
   permitted. Size: **M**.

3. **Decouple the gesture-manifest census's `tell` from the specific element being removed.**
   Scope sketch: retire `GestureLegend.vue` and the `.gallery-door` button per VERDICT #8/#15
   in the SAME wave that rewrites `scripts/gesture-manifest.mjs`'s affected entries (`spring:
   derby`, `cube:roll`, `amiga:boing`, `square:tumble`, `easing:gallery`) to point at whatever
   T's replacement affordance is — never leave a manifest entry pointing at a deleted tell (a
   silent gate-red misdiagnosed as a regression). Falsifiable gate: `proof:gesture-manifest`
   passes post-removal because every entry's `tell`/`touch.target` resolves against the NEW
   affordance, not because the check was loosened. Size: **S** (paired with whatever wave
   removes the legend/gallery-door — sequencing, not new code).

4. **Converge the tab/roving-tabindex implementations onto one primitive.** Scope sketch:
   extract the shared modulo-wraparound + Home/End + focus-follows-selection core out of
   `useKfPillTabs.ts` and `useToolbarKeyboard.ts` into one `useRovingTabindex` composable both
   consume; resolve the glass-ui `aria-orientation` bug upstream (file/track against BG/BH) so
   `KfPillTabs.vue` can be deleted in favor of `<SegmentedTabs>` once fixed, per VERDICT #18.
   Falsifiable gate: a grep-shaped census counting roving-tabindex keydown handlers in `demo/`
   — must be 1 (the shared composable), not N call sites re-deriving the arithmetic. Size: **M**.

5. **Widen the brittle-selector gate's clause 1 to any owned-ref reach into a vendor's
   generated subtree, and its class-walk clause to all of `demo/`, not three scene dirs.**
   Scope sketch: `proof-brittleness.mjs` clause 1 currently only matches bare
   `document.querySelector*`; add a second pattern for `<ref>.value?.querySelector(...)` /
   `<ref>.value?.querySelectorAll(...)` targeting an attribute selector that names a THIRD-PARTY
   component's role/data convention (an explicit allowlist of documented vendor-DOM contracts,
   mirroring the existing `LISTENER_ALLOWLIST` shape, so `useTabStripScroll.ts` stays green by
   explicit entry, not by clause blindness); widen `proof-no-brittle-selector.mjs`'s
   `SCENE_TARGET_DIRS` to the whole `demo/` tree. Falsifiable gate: the widened
   `proof:brittleness`/`proof:no-brittle-selector` both still pass (documented sites join the
   allowlist) and a fresh, undocumented owned-ref vendor-subtree reach reds it. Size: **S**.

6. **Refcount (or hoist) the shared `#highlightjs-theme` singleton.** Scope sketch: move the
   style-element lifecycle to a module-level refcount (`acquire()`/`release()` pair, the
   established `createGlobalState` shape `@/state/` already uses elsewhere in this codebase) so
   the DOM node is created on the first consumer's mount and removed only when the LAST
   consumer unmounts — never removed out from under a still-mounted sibling. Falsifiable gate:
   a unit test mounting two `useCodeHighlight()` consumers, unmounting one, and asserting the
   shared `<style>` node is still present and still updates on a subsequent `isDark` toggle.
   Size: **S**.
