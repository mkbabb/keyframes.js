# Tranche R Audit — LANE: demo-scene-switcher

**Scope:** Complete removal plan for the broken/deprecated phone scene-switcher and its CSS.

Files in scope:
- `demo/@/components/custom/SceneSwitcherCarousel.vue` — the component (178 L)
- `demo/@/composables/useScrollSnapScene.ts` — its composable (72 L)
- `demo/app/App.vue` — two import sites + the `<div class="scene-carousel-host">` mount
- `demo/app/scene-transition.css` — hosts both the VT keyframes AND the carousel visibility rules
- `demo/@/styles/design-idioms.css` — contains the `--start-hero-band` token whose comment is entangled with the "scene-switcher band" framing
- `demo/@/styles/style.css` — contains `--dock-top-band-reserve` / `--dock-top-anchor` tokens whose comments reference "scene-switcher pill" but which survive as real dock-layout tokens

---

## Executive Summary

The Q.WC3 S2 phone scene-switcher (`SceneSwitcherCarousel.vue`) is broken by design: its own `useScrollSnapScene` composable's `onScroll` handler is a **documented no-op** — `void nearestCenterId;` discards the read and writes no Vue state — meaning the "snapped card" tracking never actually does anything. The carousel renders, the scroll falloff animation plays (driven by CSS `view-timeline`), but the snap-to-scene commit on a native swipe never fires: only an explicit `@click` on a card calls `onPick`, and no swipe-settle handler is wired at all. The component is thus structurally broken as a swipe-driven switcher — it works only if the user physically taps a card after scrolling to it, which is the exact friction the feature was meant to remove.

Beyond that mechanical failure, the component introduces a **second scene-switching surface** parallel to the glass-ui dock `<Select>`. The dock Select is the authoritative switcher for all breakpoints. Introducing a phone-specific duplicate via a `max-width: 720px` visibility gate violates the single-authority principle, doubles the CSS scope for scene-switching, and makes the `scene-transition.css` file responsible for two orthogonal concerns (View Transition keyframes + phone carousel visibility).

The removal is clean: the dock `GlassDock` already renders on mobile (it collapses to an icon-forward circle) and already handles scene switching on every breakpoint. The `@switch-scene` emit on `ChromeDock` feeds `runSceneSwitch` at `App.vue:393`, which is the correct and only path for all breakpoints.

---

## Finding 1 — SceneSwitcherCarousel: onScroll is a structurally documented no-op

**Severity: high | Category: workaround**

`demo/@/composables/useScrollSnapScene.ts:56-61`:

```ts
const onScroll = (): void => {
    // The nearest-centre read is available to consumers via nearestCenterId;
    // we do not write Vue state per scroll frame (the compositor owns the
    // falloff). A consumer that needs the snapped id reads it on settle.
    void nearestCenterId;
};
```

`nearestCenterId` is discarded with `void`. No Vue reactive state is written. No scene switch is committed. The carousel wires `@scroll="onScroll"` (SceneSwitcherCarousel.vue:15) but the handler does nothing.

The only path to a scene switch is the explicit `@click="onPick(scene.id)"` on line 26. A user who swipes past cards and expects the centred card to become active gets no commit — the native scroll-snap aligns a card to the centre visually, but no scene switch fires. This is not a recoverable edge case; it is the designed-and-then-abandoned core mechanic.

**Proposal:** DELETE the component, its composable, and all references. No fix path — the swipe-settle mechanic was never implemented, and implementing it correctly (debounced `scrollend` event + Vue state write + `runSceneSwitch` emit) would reproduce the dock Select's functionality on a parallel surface with no product-truth benefit.

---

## Finding 2 — Parallel scene-switching surface violates single-authority

**Severity: high | Category: legacy**

The dock Select (`ChromeDock.vue:268-305`) is the authoritative scene switcher. It renders on every breakpoint — `GlassDock` is `position: fixed; top: var(--dock-top-anchor)` at all times; on mobile it collapses to an icon circle but the Select still opens on tap. Adding a phone-only carousel at `max-width: 720px` creates a second authority for scene navigation, neither of which owns the other.

The `scene-transition.css` S2 block (lines 61-81) makes this explicit:

```css
/* ── S2 — the phone scene-switcher carousel visibility ── */
.scene-carousel-host {
    display: none;
}
@media (max-width: 720px) {
    .scene-carousel-host {
        display: block;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: var(--z-content, 2);
        background: linear-gradient(to top, var(--background) 40%, transparent);
        pointer-events: auto;
    }
}
```

This puts the carousel inside the `#target` slot of `EditorShell`, meaning it is inside the `scene-host` div (`App.vue:149-167`) that carries `view-transition-name: scene-subject`. During a View Transition the carousel would be snapshotted as part of the scene content and morphed, which is incorrect — the switcher is chrome, not scene content.

**Proposal:** EXCISE the S2 block from `scene-transition.css` along with all other carousel CSS. The dock remains the sole switcher.

---

## Finding 3 — scene-transition.css conflates two orthogonal concerns

**Severity: medium | Category: decomposition**

`demo/app/scene-transition.css` (82 lines) contains:

1. **S3: View Transition directional keyframes** (lines 1-59) — `kf-scene-slide-out-left`, `kf-scene-slide-in-right`, `kf-scene-slide-out-right`, `kf-scene-slide-in-left` + the `html:active-view-transition-type(forward|backward)::view-transition-old/new(scene-subject)` rules + the PRM degrade. These are load-bearing and must be kept.

2. **S2: phone carousel visibility** (lines 61-81) — `.scene-carousel-host { display: none }` + the `@media (max-width: 720px)` block. These exist solely to control the `<div class="scene-carousel-host">` wrapper in App.vue and are meaningless after the carousel is removed.

The file header comment (`Q.WC3 — the scene-switcher motion`) names BOTH concerns as co-equal. After the carousel is deleted, the remaining content (only the VT keyframes) should have its comment and file name updated to reflect the single remaining responsibility, or the VT keyframes should be folded directly into `App.vue`'s `<style>` as a scoped non-scoped global (the `@import "./scene-transition.css"` is already in `App.vue:192`).

**Proposal:** Delete lines 61-81 from `scene-transition.css`. Update the file header comment (line 1-6) to remove the "phone-narrow carousel visibility" language. The file then becomes a clean VT-only partial.

---

## Finding 4 — useScrollSnapScene is a dead composable after removal

**Severity: medium | Category: dead-code**

`demo/@/composables/useScrollSnapScene.ts` is imported in exactly one place: `SceneSwitcherCarousel.vue:40`. Once the carousel component is deleted, this composable has zero consumers and becomes dead code.

The composable itself has a further internal defect beyond the no-op `onScroll`: the exported `nearestCenterId` function (line 39-50) is returned from the hook but `SceneSwitcherCarousel.vue` does not destructure or use it — `const { onScroll, scrollToScene } = useScrollSnapScene(...)` (line 57) discards it. The snapped-card read is therefore unreachable from the carousel even if a consumer wanted it.

**Proposal:** DELETE `demo/@/composables/useScrollSnapScene.ts` in full. No salvageable surface.

---

## Finding 5 — App.vue: carousel mount in wrong DOM position (inside view-transition subject)

**Severity: medium | Category: brittleness**

`App.vue:168-179`:

```html
<!-- Q.WC3 S2 — the PHONE scene-switcher: ... -->
<div class="scene-carousel-host">
    <SceneSwitcherCarousel
        :active-scene-id="currentSceneId"
        @pick="runSceneSwitch"
    />
</div>
```

This is inside the `#target` slot of `EditorShell`, which ultimately renders inside `.scene-host` — the element carrying `view-transition-name: scene-subject` (`App.vue:151`). During a View Transition, the carousel is captured as part of the scene snapshot and cross-fades with the scene content. Chrome nav chrome should never be inside a VT-named scene subject.

The `position: absolute; bottom: 0` in the `@media (max-width: 720px)` rule parks it at the visual bottom of the scene stage (within the fixed full-bleed `position: fixed` `.stage-cell`), but its DOM ancestry inside the VT subject means it participates in the transition morph.

**Proposal:** This is a non-issue after deletion. Noted for completeness as evidence that the feature was architecturally misplaced from the outset.

---

## Finding 6 — App.vue import and template wiring (complete inventory)

**Severity: low | Category: dead-code**

Lines to delete from `demo/app/App.vue`:

| Location | Line(s) | Content |
|----------|---------|---------|
| `<script setup>` import | 209 | `import SceneSwitcherCarousel from "@components/custom/SceneSwitcherCarousel.vue";` |
| `<script setup>` import | 192 | `import "./scene-transition.css";` — keep this import but the file content shrinks (the VT keyframes are still needed) |
| `<template>` | 168-179 | The `<!-- Q.WC3 S2 -->` comment + `<div class="scene-carousel-host">` wrapper + `<SceneSwitcherCarousel ...>` instance |

The `scene-transition.css` import on line 192 MUST remain because the VT directional keyframes (S3) are load-bearing — the typed `forward`/`backward` slide rides them. Only the carousel-related CSS inside that file is deleted.

---

## Finding 7 — Token comments that reference the "scene-switcher band" need audit

**Severity: low | Category: brittleness**

After removal, comments in `style.css` and `design-idioms.css` that say "the scene-switcher pill is `fixed` at an ANCHOR offset" become misleading — the "scene-switcher" IS the ChromeDock; the terminology was introduced to distinguish the top dock from the carousel, but the carousel never existed in a working state.

**`demo/@/styles/style.css` lines to update:**

- Line 272: `The scene-switcher pill is 'fixed' at an ANCHOR offset` — the "scene-switcher" here means ChromeDock; restate as "The ChromeDock pill" for clarity.
- Line 281: `top-center band has ONE occupant — the scene-switcher — by construction` — same rename.
- Line 455: `The top scene-switcher pill tethers its top edge` — restate as "The ChromeDock pill".

**`demo/@/styles/design-idioms.css` lines to update:**

- Line 253: `band ABOVE it (anchored under the scene-switcher band)` — rename to "dock band" (it refers to `--dock-top-band-reserve`, which is the ChromeDock band).

**`demo/app/scenes/SpringScene.vue` line 4:** `the SAME band the scene-switcher dock occupies` — this comment is inside the SpringScene component explaining why the view toggle was relocated. After the carousel is gone the "scene-switcher dock" refers unambiguously to ChromeDock; the comment can stand but the parenthetical `spring-mobile.png` reference is still valid context.

**`demo/@/components/custom/animation-controls/AnimationControlsGroup.vue` lines 420-426:** The block comment references "the scene-switcher pill is anchored at --dock-top-anchor below the viewport top (ChromeDock consumes the SAME token)". This is accurate — ChromeDock IS the scene-switcher — so it requires no change beyond possibly dropping "scene-switcher" in favour of "ChromeDock" for consistency.

**`demo/@/components/custom/editor-shell/EditorStartScreen.vue` lines 5-6:** "SAME token the scene-switcher band + the mobile stage inset resolve" — same rename: "dock band" or "ChromeDock band".

These are comment-only edits; zero runtime impact.

---

## Removal + Migration Plan (Ordered Steps)

### Step 1: Delete the carousel component and composable

DELETE in full:
- `demo/@/components/custom/SceneSwitcherCarousel.vue`
- `demo/@/composables/useScrollSnapScene.ts`

### Step 2: Excise carousel references from App.vue

In `demo/app/App.vue`:
- Delete line 209: `import SceneSwitcherCarousel from "@components/custom/SceneSwitcherCarousel.vue";`
- Delete lines 168-179: the `<div class="scene-carousel-host">` wrapper + its comment
- Keep line 192: `import "./scene-transition.css";` — the VT keyframes remain

### Step 3: Trim scene-transition.css

In `demo/app/scene-transition.css`:
- Delete lines 61-81 (the S2 carousel visibility block — `.scene-carousel-host { display: none }` + the `@media (max-width: 720px)` block)
- Update lines 1-6 (the file header comment) to remove "phone-narrow carousel visibility" language
- The remaining content (lines 1-59) is the VT directional keyframes — keep as-is

### Step 4: Update stale "scene-switcher" comments (optional polish)

Comment-only renames in:
- `demo/@/styles/style.css` lines 272, 281, 455
- `demo/@/styles/design-idioms.css` line 253
- `demo/@/components/custom/editor-shell/EditorStartScreen.vue` line 5-6

These are non-functional. Defer to the polish pass if desired.

### What replaces the scene switcher on mobile?

Nothing needs to be added. The `ChromeDock` (`GlassDock`) is `position: fixed; top: var(--dock-top-anchor)` on ALL breakpoints. On mobile (`max-width: 1023px`) it renders as a collapsed icon circle (the K.W4 F6 "icon-forward circle"); a tap expands it and the Scene `<Select>` opens. This is the authoritative, fully-working, always-present switcher. The carousel was an additive mobile convenience that was never wired up to actually do its job.

---

## CSS to Delete (annotated)

### From `demo/app/scene-transition.css` — lines 61-81

```css
/* ── S2 — the phone scene-switcher carousel visibility ──
   Shown ONLY on the phone-narrow breakpoint (the 720px cut …). */
.scene-carousel-host {
    display: none;
}
@media (max-width: 720px) {
    .scene-carousel-host {
        display: block;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: var(--z-content, 2);
        background: linear-gradient(to top, var(--background) 40%, transparent);
        pointer-events: auto;
    }
}
```

### From `SceneSwitcherCarousel.vue` `<style scoped>` — the entire scoped style block (lines 71-177)

All `.scene-carousel`, `.scene-carousel-card`, `.scene-carousel-icon`, `.scene-carousel-label`, `.scene-carousel-card--active`, `@keyframes kf-carousel-falloff`, the `@supports ((animation-timeline: view()) and (animation-range: entry))` block, and the PRM guards are eliminated with the file deletion.

---

## Summary Table: Every Reference Site

| File | Lines | Action |
|------|-------|--------|
| `demo/@/components/custom/SceneSwitcherCarousel.vue` | 1-177 | DELETE entire file |
| `demo/@/composables/useScrollSnapScene.ts` | 1-72 | DELETE entire file |
| `demo/app/App.vue` | 168-179 | DELETE `<div class="scene-carousel-host">` block |
| `demo/app/App.vue` | 209 | DELETE import line |
| `demo/app/App.vue` | 192 | KEEP import (VT keyframes in same file) |
| `demo/app/scene-transition.css` | 61-81 | DELETE S2 carousel block |
| `demo/app/scene-transition.css` | 1-6 | UPDATE comment (remove carousel mention) |
| `demo/@/styles/style.css` | 272, 281, 455 | RENAME "scene-switcher" → "ChromeDock" in comments |
| `demo/@/styles/design-idioms.css` | 253 | RENAME "scene-switcher band" → "dock band" in comment |
| `demo/@/components/custom/editor-shell/EditorStartScreen.vue` | 5-6 | RENAME in comment |
| `demo/app/scenes/SpringScene.vue` | 4 | No change required |
| `demo/@/components/custom/animation-controls/AnimationControlsGroup.vue` | 420-426 | Optional rename in comment |
