# Audit — U-K20: FourierField hero removal + grid opacity

**Lane:** live-fourier-grid  
**Scope:** U-K20 — remove the FourierField from the hero background; grid lines slightly
less opaque.  
**Branch / HEAD:** `tranche-j-dev` @ `4f1fc4c`  
**Date:** 2026-06-11

---

## 1. Current wiring — the FourierField

### 1.1 The single mount point

The FourierField lives entirely in one file:

```
demo/@/components/custom/editor-shell/EditorStartScreen.vue
```

It was introduced in commit `8c7910b` (J.W7a — the "appearance-grammar suffusion") under
delta **D18**, tagged `J.W7a S4 (D18 / H1, cross-hierarchy §e, glassui-adopt A4)`.

**Template block — lines 65–86:**

```html
<!-- J.W7a S4 (D18 / H1 …) — FourierField in the home doorway's EMPTY left-half … -->
<div class="fourier-vacancy" aria-hidden="true">
    <FourierField
        variant="hero"
        seed="keyframes.js"
        color="var(--ball-tone, var(--ppmycota-primary, var(--primary)))"
        :color-resolver="defaultBlobColorResolver"
        :freeze="prefersReducedMotion"
    />
</div>
```

**Imports — lines 96–97:**

```ts
import { FourierField } from "@mkbabb/glass-ui/fourier-field";
import { defaultBlobColorResolver } from "@mkbabb/glass-ui/color";
```

Both import paths (`@mkbabb/glass-ui/fourier-field`, `@mkbabb/glass-ui/color`) are used
**only** in this file; they are not imported anywhere else in the demo.

**RF-16 freeze guard — lines 92, 115–118:**

```ts
import { usePreferredReducedMotion } from "@vueuse/core";
const reducedMotionPref = usePreferredReducedMotion();
const prefersReducedMotion = computed(
    () => reducedMotionPref.value === "reduce",
);
```

This guard (`:freeze="prefersReducedMotion"`) had a dual purpose:
1. Correct reduced-motion posture — decorative animated field must rest under PRM.
2. Dodges the glass-ui RF-16 TDZ (`Cannot access 'C' before initialization`): the
   FourierField render short-circuits at `freeze || x.reducedMotion`, so a truthy
   `freeze` prevents the forward-`const` glass-ui read that crashed the page under PRM.

Source: `docs/tranches/J/glassui-AX-handoff.md` lines 827–882; `J.W7c-impl.md` lines
195–196.

`computed` is imported from `vue` on line 91 and **used only** for this guard; the
`withDefaults(defineProps<…>())` block (lines 123–136) uses no other computed state.

**Scoped CSS — lines 178–205:**

```css
.fourier-vacancy {
    display: none;
    position: absolute;
    left: 1.5rem;
    top: 62dvh;
    width: min(30vw, 26rem);
    height: min(28dvh, 18rem);
    opacity: 0.6;
    pointer-events: none;
}
@media (min-width: 1024px) {
    .fourier-vacancy { display: block; }
}
```

Desktop-only (≥1024px). At 1440×900 the resolved box is `top: 654px, left: 24px,
width: 416px, height: 252px` — the lower-left quadrant, well below the subtitle/hint
ladder and left of the cube's centre-right orbit.

### 1.2 Live verification

Command:
```
KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/glass-ui node probe (1440×900, 3s wait)
```
Observed:
```
CANVAS_3s: {"found":true,"w":416,"h":252,"nonZeroAlpha":2197,"maxAlpha":253}
ENV: {"reducedMotion":false,"docHidden":false,"docVisibility":"visible"}
```
The canvas is actively drawing (2 197 non-zero-alpha pixels out of 104 832 total — the
field is intentionally sparse). The epicycle trace is a small violet/blue line-arc
~170px from the left edge of the crop (screenshot:
`screenshots-k/fourier-bottomleft-3s.png`).

### 1.3 Bundle footprint

The `@mkbabb/glass-ui/fourier-field` sub-entry is bundled into the **main index chunk**
(`dist/gh-pages/assets/index-hA-c7VTQ.js`, 193 KB minified) — NOT into the glass-ui
vendor chunk (`glass-ui-TcyQCdLv.js`). The FourierField component and its epicycle math
appear at offset 45 957 of 192 947; the associated code region is approximately **~8 KB
minified**. Removing the import will tree-shake this code from the index chunk on the
next build.

Symbols that disappear on removal: `FourierField`, `epicycleHueShift`, `epicycleRatios`,
`epicycles`, `fourier` (all currently present only in `index-hA-c7VTQ.js`).

---

## 2. The removal seam

### 2.1 What to delete from `EditorStartScreen.vue`

| Location | Lines (HEAD) | What |
|---|---|---|
| Template | 65–86 | Entire `<!-- J.W7a S4 … -->` comment + `<div class="fourier-vacancy">…</div>` block |
| Import | 96 | `import { FourierField } from "@mkbabb/glass-ui/fourier-field"` |
| Import | 97 | `import { defaultBlobColorResolver } from "@mkbabb/glass-ui/color"` |
| Import | 92 | `import { usePreferredReducedMotion } from "@vueuse/core"` (sole use was the freeze guard) |
| Import | 91 | `import { computed } from "vue"` (sole use was `prefersReducedMotion` computed) |
| Script | 101–118 | The entire RF-16 freeze guard comment block + `reducedMotionPref` + `prefersReducedMotion` |
| Style | 178–205 | `.fourier-vacancy { … }` + its `@media (min-width: 1024px)` block |

No other file requires modification: `CubeScene.vue:44` imports `EditorStartScreen` but
does not reference `FourierField`; `App.vue:115` passes only `hint` to
`EditorStartScreen`; the `EditorShell.vue:49` fallback slot likewise has no fourier
coupling.

**Nothing else in the demo imports `@mkbabb/glass-ui/fourier-field` or
`@mkbabb/glass-ui/color`.** Both sub-entries are exclusively consumed here.
`verified: grep -rn "@mkbabb/glass-ui/fourier|@mkbabb/glass-ui/color" demo/ → only
EditorStartScreen.vue:96-97`

### 2.2 Side-effects of removal

- The RF-16 TDZ guard disappears with the field. This is safe: without
  `FourierField` mounted, the TDZ code path in `glass-ui/fourier-field.js` is
  never reached. The RF-16 handoff in `docs/tranches/J/glassui-AX-handoff.md` should
  be updated to record the consumer-side cure as moot (the component is gone).
- No visual regression outside the lower-left quadrant at ≥1024px. Mobile (< 1024px)
  never rendered the field (`.fourier-vacancy { display: none }` was its default
  state). Screenshot of simulated removal: `screenshots-k/fourier-removed-bottomleft.png`
  — the vacancy area shows only the graph-paper grid substrate.

---

## 3. The vacancy after removal

### 3.1 What visually fills the gap

Without the FourierField the lower-left quadrant is pure grid paper — the
`EditorShell.vue` `.grid-background` layer (lines 202–223), a two-tier engineering
graph paper that was already the substrate beneath the field. The cube sits
centre-right; the hero title/subtitle columns occupy the upper-left. The lower-left is
genuinely empty floor (the original H1 "left-half vacancy" that the FourierField was
added to address). **Post-removal, the vacancy is honest blank grid** — no fabricated
replacement is needed.

The user's stated preference is explicit: "REMOVE the FourierField from the hero
background." The grid itself provides the mathematical texture without the animated
overhead.

### 3.2 Optional follow-on (not a gate)

The grid-paper substrate already supplies the math/engineering visual motif at much
lower presence. If any scene-flavoured background texture is desired for the vacancy,
the right vehicle is a `<GraphFrame>` promotion (booked as a W7b handoff edge,
`J.W7a.md` line 503) or a static SVG — not a canvas animation. These are out of scope
for U-K20.

---

## 4. Grid line opacity — current tokens and suggested target

### 4.1 Current values

Token definitions — `demo/@/styles/design-idioms.css` lines 180–183 (inside `:root`):

```css
--graph-pitch: 1rem;        /* fine-line repeat */
--graph-major: 5rem;        /* major-line repeat */
--graph-opacity: 5%;        /* fine lines: foreground @ 5% */
--graph-major-opacity: 12%; /* major lines: foreground @ 12% */
```

Consumption — `demo/@/components/custom/editor-shell/EditorShell.vue` lines 202–223
(the `.grid-background` rule, NOT scoped — global for all scenes):

```css
.grid-background {
    --graph-line-fine:  color-mix(in srgb, var(--foreground) var(--graph-opacity, 5%),  transparent);
    --graph-line-major: color-mix(in srgb, var(--foreground) var(--graph-major-opacity, 12%), transparent);
    background-image:
        linear-gradient(to right, var(--graph-line-major) 1px, transparent 1px),
        linear-gradient(to bottom, var(--graph-line-major) 1px, transparent 1px),
        linear-gradient(to right, var(--graph-line-fine)  1px, transparent 1px),
        linear-gradient(to bottom, var(--graph-line-fine)  1px, transparent 1px);
    background-size: var(--graph-major) var(--graph-major), …, var(--graph-pitch) var(--graph-pitch), …;
}
```

Live-probe (1440×900, light mode):
```
--graph-opacity: "5%"
--graph-major-opacity: "12%"
--graph-line-fine:  color-mix(in srgb, light-dark(#1c1917,#e8e7e3) 5%, transparent)
--graph-line-major: color-mix(in srgb, light-dark(#1c1917,#e8e7e3) 12%, transparent)
```
`verified: KF_PLAYWRIGHT_DIR=… node probe → GRID output`

The 12% major layer was deliberately set ABOVE the former near-invisible 0.10α
corner-tick floor (comment in design-idioms.css lines 175–177: "the §Hard-gate
substrate-legibility clause g"). That design rationale still holds.

### 4.2 The "slightly less opaque" target

The user's request (U-K20): "grid lines slightly less opaque." No explicit numeric
target was given. The suggested landing:

| Token | Current | Suggested | Rationale |
|---|---|---|---|
| `--graph-opacity` | `5%` | `3%` | Fine lines are already near-invisible; drop to near-zero whisper |
| `--graph-major-opacity` | `12%` | `8%` | Visible structure but less assertive; stays well above the old 5% floor |

This preserves the two-tier engineering paper hierarchy (fine < major) while softening
both layers. The change is **one file, two token values** in `design-idioms.css` lines
182–183. Dark mode retints automatically (the `light-dark()` colour already handles it).

The `--graph-opacity` fallback in the consuming rule (`EditorShell.vue:205,210`) uses
`var(--graph-opacity, 5%)` and `var(--graph-major-opacity, 12%)` — updating the token
definition in `design-idioms.css` propagates without touching the consuming rule.

---

## 5. §FOLD table

| # | Finding | Severity | Seam | Suggested wave-class |
|---|---|---|---|---|
| K20-A | FourierField actively renders at hero (2 197 non-zero pixels confirmed); user wants it removed; single mount point in `EditorStartScreen.vue` lines 65–86 + 7 removal hunks total | **P1** | `demo/@/components/custom/editor-shell/EditorStartScreen.vue` | K.W1 (appearance / hero composition) |
| K20-B | Removal eliminates the RF-16 consumer-side freeze guard; the TDZ path is moot once the component is gone; the AX handoff record should be annotated | **P2** | `docs/tranches/J/glassui-AX-handoff.md` lines 868–882 | K.W1 (docs cleanup, same wave) |
| K20-C | FourierField is bundled into the main index chunk (~8 KB minified); removal yields a measurable first-load size win | **P2** | `dist/gh-pages/assets/index-*` (build output) | K.W1 (implicit — rebuild after removal) |
| K20-D | Grid fine-line opacity `--graph-opacity: 5%` and major-line `--graph-major-opacity: 12%` are the sole token definition in `design-idioms.css:182–183`; user wants "slightly less opaque"; suggested landing `3% / 8%` | **P2** | `demo/@/styles/design-idioms.css:182–183` | K.W1 (appearance / grid token) |
| K20-E | After FourierField removal the lower-left hero vacancy is pure grid paper — the H1 "left-half vacancy" is openly blank; no replacement is designed for K; the user's intent is clearance, not substitution | **P2** (design note, not a defect) | `EditorStartScreen.vue` composition | K.Wfuture (optional — `<GraphFrame>` or static motif; booked W7b handoff edge) |

---

## Screenshots

| File | What it shows |
|---|---|
| `screenshots-k/fourier-bottomleft-3s.png` | FourierField PRESENT at 3s — small violet epicycle trace in lower-left at 1440×900 |
| `screenshots-k/fourier-removed-bottomleft.png` | FourierField REMOVED (simulated) — same crop shows pure graph-paper grid only |
| `screenshots-k/fourier-hero-desktop.png` | Full 1440×900 hero for reference |
