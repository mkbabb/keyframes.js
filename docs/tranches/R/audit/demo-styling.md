# Tranche R — Lane: demo-styling

**Scope:** `demo/@/styles/` (style.css, design-idioms.css, brand.css) + `demo/app/scene-transition.css` + `demo/@/components/custom/animation-controls/controls/playback-button.css` + `demo/@/components/custom/animation-controls/controls/tab-trigger.css` + per-scene Vue `<style scoped>` blocks (z-index, calc, raw colors, easing keywords).

---

## F1 — `--spring-snappy` is a legacy workaround alias that survives the Q reconcile (medium, workaround)

**File:** `demo/@/styles/style.css:341`

```css
--spring-snappy: var(--spring-smooth);
```

The comment (lines 329–341) explains the full history: the demo once baked its own `linear()` stops for `--spring-snappy` (a `ζ=0.65` shadow of glass-ui's same-named token). The "reconcile" replaced the local stops with `var(--spring-smooth)` — but glass-ui **already ships its own `--spring-snappy`** with a distinct, overshoot-carrying curve (verified in `node_modules/@mkbabb/glass-ui/dist/styles/tokens/scheme-motion.css:221`). The demo's `:root` override **silently clobbers the glass-ui `--spring-snappy` with `--spring-smooth`**, meaning any glass-ui component that internally reads `--spring-snappy` now gets the wrong (calmer) curve without any explicit opt-out.

There is exactly **one consumer** in the demo: `AnimationControlsGroup.vue:331` (`grid-template-columns` transition). The comment says it also lives in `ControlsPaneWrapper.vue` — but a grep confirms that file no longer uses it. The single-site consumer should either:

- Delete the override entirely and use `var(--spring-smooth)` directly at the call site (KISS — the intent is already the calmer curve), OR
- Keep the alias but rename it to a demo-local token that does not shadow a live glass-ui token (e.g. `--pane-slide-spring: var(--spring-smooth)`) so the glass-ui `--spring-snappy` resolves correctly for glass-ui components.

The current state is a **silent global clobber** of a consumed token — the exact cross-repo incoherence D.W2 fought.

---

## F2 — Inconsistent `var(--z-content, N)` fallback values across scene components (medium, brittleness)

**Files:**

| File | Line | Fallback |
|---|---|---|
| `EasingHeroStage.vue` | 331 | `,2` |
| `app/scenes/SquareScene.vue` | 377 | `,2` |
| `amiga/AmigaTelemetry.vue` | 54 | `,2` |
| `amiga/AmigaCrtOverlay.vue` | 39 | `,2` |
| `spring/SpringTarget.vue` | 384 | `,3` |
| `spring/SpringHeatmap.vue` | 330 | `,3` |
| `@/components/custom/EasingCurveCanvas.vue` | 328 | `,2` |
| `AnimationControlsGroup.vue` | 418 | `,10` ✓ |
| `EditorStartScreen.vue` | 245 | `,10` ✓ |
| `playground/App.vue` | 301 | `,1` |
| `cube/CubeTarget.vue` | 438, 452, 493 | `,1` |

The style.css contract (lines 19–43) defines `--z-content: 10` in glass-ui's token file (`scheme-motion.css:373`). The two correct occurrences are `,10`. Every other file specifies a fallback of `,1`, `,2`, or `,3` — values that are meaningfully different from the token contract value and from each other. If glass-ui's token file fails to load (or if a component is used in isolation), stacking order silently degrades to sub-threshold integers.

**Proposal:** Normalise ALL `var(--z-content, N)` fallbacks to `,10` (the documented contract value). Consider the Tailwind utility `z-content` (which glass-ui already ships — confirmed in `components.css`) at all template-class sites to remove the CSS property declaration entirely. The `var(--z-content)` pattern in scoped `<style>` is a workaround for the Tailwind utility not reaching arbitrary CSS rule locations; extract to Tailwind where possible.

---

## F3 — `var(--z-behind, N)` fallback values are wrong and inconsistent (medium, brittleness)

**Files:**

| File | Line | Fallback | Contract value |
|---|---|---|---|
| `app/scenes/SquareScene.vue` | 454 | `,-1` | **-10** |
| `cube/CubeTarget.vue` | 474 | `,-1` | **-10** |
| `cube/CubeTarget.vue` | 536 | `,-10` | ✓ |
| `playground/App.vue` | 269 | `,0` | **-10** |
| `@/components/custom/EasingCurveCanvas.vue` | 318 | `,0` | **-10** |

The style.css contract (line 43) and design-idioms.css:245 define `--z-behind: -10`. Fallbacks of `0` or `-1` are **wrong** — at fallback value `0` the element is not behind the content plane at all; at `-1` it may still be in the stacking context above other below-plane elements. The `playground/App.vue:269` use of `,0` is particularly incorrect: the element is **supposed to be below the content plane** (a passive background), but falls back to the content plane itself.

**Proposal:** Normalise all fallbacks to `,-10`. Where the placement is a background element that should genuinely never stack above the content plane, no `var()` fallback inconsistency can be tolerated.

---

## F4 — `!important` overrides in `SpringSidebar.vue` indicate unresolved specificity debt (medium, workaround)

**File:** `demo/spring/SpringSidebar.vue:276,280`

```css
.preset-cell:hover {
    background: color-mix(in srgb, var(--color-progress) 8%, var(--background)) !important;
}
.preset-cell[data-state="on"] {
    background: color-mix(in srgb, var(--color-progress) 12%, var(--background)) !important;
}
```

`.preset-cell` is a reka-ui `<Button>` element (`bg-background` on the template class, line 97: `class="preset-cell rounded-pill border-none bg-background …"`). The `!important` guards indicate that the Tailwind utility class `bg-background` — resolved at a higher specificity in the cascade — wins over the scoped CSS hover/state rule.

The correct fix is not `!important` but specificity parity: move the `bg-background` default from the Tailwind template class to the `.preset-cell` rule itself, then the hover/active variants override it by normal cascade order. The `.preset-cell` selector already has a scoped `[data-v-*]` attribute, which already adds a specificity unit — the issue is that the Tailwind utility `bg-background` in the template applies at the same specificity. The proper approach is to declare `background: var(--background)` on `.preset-cell` directly (not via Tailwind `bg-background` on the template) so the hover and active variants naturally override it.

---

## F5 — Raw bare `ease` and unliteral easing in motion transitions (low, dry)

Scene components use the bare CSS `ease` keyword instead of the design token `var(--ease-standard)` in several transition declarations:

**Files:**
- `motion-path/MotionPathTarget.vue:379–380` — `r 120ms ease`, `fill 120ms ease`
- `sequence/SequenceTarget.vue:401–402` — `background 120ms ease`, `transform 120ms ease`
- `spring/SpringTarget.vue:305` — `border-color var(--duration-fast) ease`
- `spring/SpringTarget.vue:343` — `border-right-color var(--duration-fast, 160ms) ease`
- `spring/SpringTarget.vue:355` — `opacity var(--duration-fast, 160ms) ease`
- `spring/SpringSidebar.vue:272–273` — `outline-color var(--duration-fast) ease`, `background-color var(--duration-fast) ease`
- `playground/App.vue:305` — `opacity 120ms ease-out` (hardcoded 120ms, no token)

The demo uses `var(--ease-standard)` consistently everywhere else (tab-trigger.css, playback-button.css, SquareScene.vue). The bare `ease` keyword is the browser default, not the glass-ui standard. These are small micro-springs/transitions where the difference is subtle but the inconsistency is a DRY violation — if the `--ease-standard` token ever changes, these sites are silent orphans.

**Proposal:** Replace all bare `ease` with `var(--ease-standard)`. Replace hardcoded `120ms` with `var(--duration-fast)`. The `ease-out` in `playground/App.vue:305` should become `var(--ease-out)`.

---

## F6 — One raw `cubic-bezier()` literal in scene CSS (low, dry)

**File:** `demo/sequence/SequenceTarget.vue:464`

```css
animation: seq-lane-drop 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
```

Glass-ui ships named spring/ease tokens (including `--ease-out` which maps to a standard spring-out curve). This `cubic-bezier(0.22, 1, 0.36, 1)` is the iOS spring-out curve — it should resolve to `var(--ease-out)` or `var(--spring-snappy)`. There is also a companion raw `cubic-bezier(0.34, 1.56, 0.64, 1)` in `motion-path/MotionPathTarget.vue:459` (the spring-overshoot wink). Neither is named or tokenized.

**Proposal:** Map `cubic-bezier(0.22, 1, 0.36, 1)` → `var(--ease-out)` (or `var(--spring-snappy)` if overshoot is intended). Map `cubic-bezier(0.34, 1.56, 0.64, 1)` → `var(--spring-bouncy)` (it is a standard overshoot spring). If no glass-ui token matches exactly, name a demo-local token in `design-idioms.css` (the "befitting named delta" pattern).

---

## F7 — Stale green-hue fallback in `SpringHeatmap.vue` (low, legacy)

**File:** `demo/spring/SpringHeatmap.vue:117`

```ts
"hsl(142 71% 45%)"
```

This is the **old `--color-progress` green** that K.W4 S3 explicitly retired ("the disliked GREEN — `--color-progress = hsl(142 71% 45%)`"). It survives as a JS fallback string in `resolveTone()` — the third fallback in the chain `--ball-tone || --color-progress || "hsl(142 71% 45%)"`. Since `--color-progress` now resolves to `--accent-red`, the string fallback is both dead code and a zombie of the discarded identity. A correct fallback would be the literal resolved value of `--color-progress` in the red family, or omitted entirely since `--color-progress` is always defined.

**Proposal:** Replace the hardcoded `"hsl(142 71% 45%)"` with `"var(--color-progress)"` (resolve at the call site via `getPropertyValue`) or with `"hsl(0 72% 63%)"` (the light-mode `--accent-red` value). Better yet, since `--color-progress` is always defined at `:root`, remove the third fallback entirely — an empty string or `"red"` would at least fail visibly rather than silently painting the retired green.

---

## F8 — `--z-seq-handle` / `--z-seq-playhead` are scene-local z-tokens not covered by the global z-contract (low, encapsulation)

**File:** `demo/sequence/SequenceTarget.vue:285–286`

```css
.seq-storyboard {
    --z-seq-playhead: 1;
    --z-seq-handle: 2;
}
```

Consumed in `SequencePlayhead.vue:30` (`z-index: var(--z-seq-playhead)`) and `SequenceTarget.vue:384,439` (`z-index: var(--z-seq-handle)`).

These are **correctly scoped** as scene-local micro-stacking tokens (the storyboard creates its own stacking context; the playhead/handle are ordered within that context alone). However, they are raw integers (1, 2) without a named semantic, and they are not documented in the z-contract in `style.css`. If a future element is added to the storyboard it will guess `3` or copy `2`, and the ordering semantics are lost.

**Proposal:** Add a one-line comment at the declaration site (already partially present) explicitly naming the stacking semantics, or adopt a named pattern like `--z-seq-playhead: 1 /* below handle */` / `--z-seq-handle: 2 /* above playhead */`. No change to the style.css global contract is needed (these are stacking-context-relative, not global rungs), but the names should be distinguishable from a numeric literal.

---

## F9 — Multiple `@property` declarations in `<style scoped>` blocks are document-global, not scoped (medium, encapsulation)

**Files:**
- `cube/CubeTarget.vue:291–307` — `@property --lit`, `@property --spin-energy`, `@property --axis-active`
- `sequence/SequenceTarget.vue:277–281` — `@property --ball-p`
- `playground/App.vue:248–256` — `@property --mouse-x`, `@property --mouse-y`

The `@property` at-rule is a **document-global registration** — it is not scoped by `[data-v-*]` attributes. Vue's `<style scoped>` strips the `[data-v-*]` selector from `@property` blocks (Vite/Vue handles this by emitting them as global CSS). The comment in `playground/App.vue:246` correctly notes they are "document-global," but `CubeTarget.vue` and `SequenceTarget.vue` do not acknowledge this. The registrations themselves are benign (they use scene-specific names), but:

1. If two scenes register the same custom property name with different `syntax`, the second registration silently wins (or is ignored by the browser's duplicate-registration rules).
2. The `--ball-p` registration in `SequenceTarget.vue` is close enough to the global `--ball-tone` / `--dot-p` vocabulary in `design-idioms.css` that a naming collision is possible.

**Proposal:** Move `@property` registrations for scene-specific animated properties to the scene's own global CSS block or to `design-idioms.css` under a clearly namespaced section. The `playground/App.vue` ones (`--mouse-x`, `--mouse-y`) are truly playground-private and can stay — but should be moved to a global `<style>` block (not scoped) to make their document-global nature explicit and auditable. Add a comment at each `@property` in scoped blocks noting "document-global despite scoped placement."

---

## F10 — `hsl(0 0% 0% / 0.18)` raw black in ControlsPaneWrapper (low, styling)

**File:** `demo/@/components/custom/animation-controls/components/ControlsPaneWrapper.vue:312`

```css
box-shadow: 0 -0.5rem 1.5rem -0.5rem hsl(0 0% 0% / 0.18);
```

This is a raw black shadow on the mobile sheet. Glass-ui ships shadow tokens (`--shadow-*` family, confirmed in `node_modules/.../tokens/shadow.css`) and the demo already uses `var(--shadow-cartoon-lg)` elsewhere. This raw black is not dark-mode–aware (it always casts a hard black shadow even on light surfaces where a softer or colored shadow would be more appropriate). The correct token is `var(--shadow-popover)` or `var(--shadow-overlay)` if glass-ui ships one for elevated sheets, or a demo-owned `--sheet-shadow` token defined in `design-idioms.css`.

---

## F11 — `var(--z-content, 2)` used at `scene-transition.css:77` — incorrect fallback in a global stylesheet (low, brittleness)

**File:** `demo/app/scene-transition.css:77`

```css
z-index: var(--z-content, 2);
```

This is the `.scene-carousel-host` rule in the globally-loaded `scene-transition.css`. At fallback it would render at z-index 2, well below the documented `--z-content: 10` — the carousel would be partially hidden behind the transport dock (z-dock: 40). The fallback should be `,10`.

---

## F12 — style.css is 644 lines (monitoring threshold) and carries multiple distinct concerns (medium, decomposition)

**File:** `demo/@/styles/style.css` — 644 lines

The file combines:
1. CSS import cascade (lines 1–16)
2. z-index contract documentation (lines 18–44)
3. `@theme` token declarations (lines 46–82)
4. Metric-matched font fallback `@font-face` (lines 104–111)
5. `:root` layout token block (lines 113–408) — itself 295 lines
6. `.dark` overrides (lines 410–419)
7. CSS anchor-positioning progressive enhancement (lines 421–470)
8. Glass tint-strength override (lines 472–502)
9. `@media (max-width: 1023px)` mobile overrides (lines 504–568)
10. `@layer base` (lines 570–591)
11. `@layer utilities` (lines 603–619)
12. `@layer demo-typography` (lines 640–644)

The `:root` block alone is ~295 lines and contains unrelated concerns: dock layout math, φ-derivations, color tokens, 3D axis colors, face crayons, progress colors, branding tokens, graph/field tokens, and idle-fade magnitude — all in one flat declaration block. The file is not yet over the 500-line audit gate for decomposition, but the concern density is very high and the `:root` block is increasingly a catch-all.

**Proposal:** Split into three clearly-named files imported by style.css:
- `layout-tokens.css` — dock anchors, work-area math, rail-width, φ-derivations (the layout-engine sub-block)
- `color-tokens.css` — all `:root` color tokens (face crayons, axis colors, accent-red, progress, branding)
- `style.css` — retains: imports, @theme, @font-face, @layer base/utilities/demo-typography, glass tint override, anchor progressive enhancement, mobile `@media`

This is a KISS split — three files that each have a clear name and zero overlapping concerns.

---

## F13 — design-idioms.css is 874 lines and mixes token declarations with idiom classes (medium, decomposition)

**File:** `demo/@/styles/design-idioms.css` — 874 lines

The file's own stated charter is "the demo's OWNED design vocabulary" — but it has grown to contain:
1. `@property --rail-width` registration (lines 51–63)
2. `:root` token block for layout/color/scale/graph tokens (lines 68–313)
3. `.dark` gold parity (lines 315–322)
4. `.focus-ring` idiom (lines 324–343)
5. `.text-gold` utility (lines 345–352)
6. `@utility icon-{xs,sm,md,lg}` family (lines 354–399)
7. `@utility ppmycota-stroke` (lines 401–410)
8. Deleted blocks documented via comment tombstones (`.scale-on-hover` deleted, `.gold-shimmer` deleted, `.dock-inset` deleted)
9. `.cartoon-surface:has(:focus-visible)` (lines 445–457)
10. `.progress-bar`, `.progress-dot`, `.progress-rail`, `.progress-ball`, `.readout-accent` (lines 483–596)
11. `.stage-field-{x,y}` (lines 598–624)
12. `.status-badge` family (lines 626–671)
13. `.code-token` (lines 673–683)
14. `§STAGE-CARD` register documentation (comment-only)
15. `§LABEL-subgrid` — `.labeled-field-grid` and children (lines 782–805)
16. `@keyframes enter` (lines 807–826)
17. `§idle-fade` token documentation (comment-only)
18. `§gesture-in-flight` — `body.is-dragging` select suppression (lines 849–874)

The file has become a **design-utilities monolith**. The `:root` token block (246 lines) is the largest section — it should be extracted to `design-idioms.css` only containing the **idiom classes and keyframes**, with the tokens split off as described in F12.

The comment tombstones for deleted rules (`.scale-on-hover`, `.gold-shimmer`, `.dock-inset`, `§STAGE-CARD`, `§idle-fade`) are documentation artifacts — they are not rules. While they document intent, they add ~100 lines of non-CSS. Long deletion tombstones belong in the commit history or tranche docs, not in a production CSS file.

**Proposal:**
1. Extract the `:root` token declarations to `design-tokens.css` (tokens only — no idiom classes).
2. Retain in `design-idioms.css`: `@property`, `@utility`, `.class` rules, `@keyframes`.
3. Remove or shorten tombstone comment blocks to a single-line `/* deleted: [reason] [tranche ref] */`.

---

## F14 — Tombstone comment blocks inflate both CSS files (low, dead-code)

Lines in `design-idioms.css` that are pure deletion-documentation tombstones (no actual rules):
- Lines 412–431: `.scale-on-hover` deletion (~20 lines)
- Lines 433–443: tracked-specular subsystem deletion (~11 lines)
- Lines 459–481: `.gold-shimmer` deletion (~23 lines)
- Lines 685–694: `.dock-inset` deletion (~10 lines)
- Lines 695–739: `§STAGE-CARD` register (documentation only, ~45 lines)
- Lines 828–847: `§idle-fade` (documentation anchor for a rule that lives elsewhere, ~20 lines)

Total: ~130 lines of CSS that contain no parseable rules. The same pattern appears in `style.css` with inline tranche-commentary paragraphs embedded in `/* */` blocks.

**Proposal:** Replace each tombstone with a single-line reference comment:
```css
/* .scale-on-hover: deleted H.W2.S4 — consumed from glass-ui utilities.css */
```
Move extended prose to tranche docs. The CSS files should be primarily rules; audit history belongs in git.

---

## Summary table

| # | Severity | Category | One-line description |
|---|---|---|---|
| F1 | medium | workaround | `--spring-snappy: var(--spring-smooth)` silently shadows glass-ui's own `--spring-snappy` token |
| F2 | medium | brittleness | `var(--z-content, N)` fallbacks inconsistent (1/2/3 vs contract value 10) |
| F3 | medium | brittleness | `var(--z-behind, N)` fallbacks wrong (0/-1 vs contract value -10) |
| F4 | medium | workaround | `!important` in SpringSidebar.vue `.preset-cell` hover/active: unresolved Tailwind specificity debt |
| F5 | low | dry | Bare `ease` keyword and hardcoded `120ms` in scene transitions — not using `var(--ease-standard)` / `var(--duration-fast)` |
| F6 | low | dry | Raw `cubic-bezier()` literals in SequenceTarget + MotionPathTarget — should be named tokens |
| F7 | low | legacy | Stale `"hsl(142 71% 45%)"` green fallback in SpringHeatmap — the retired `--color-progress` ghost |
| F8 | low | encapsulation | `--z-seq-*` tokens unnamed/undocumented micro-stacking contract |
| F9 | medium | encapsulation | `@property` in `<style scoped>` blocks is document-global but not declared that way |
| F10 | low | styling | Raw `hsl(0 0% 0% / 0.18)` black shadow — not dark-mode–aware, should use shadow token |
| F11 | low | brittleness | `var(--z-content, 2)` in scene-transition.css (global file) — wrong fallback |
| F12 | medium | decomposition | style.css 644 lines, `:root` block 295 lines — split color vs layout token concerns |
| F13 | medium | decomposition | design-idioms.css 874 lines — token declarations and idiom classes tangled, tombstones bloat |
| F14 | low | dead-code | ~130 lines of deletion-tombstone comments in design-idioms.css |
