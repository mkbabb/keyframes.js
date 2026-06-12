# K — Audit: glass-ui currency 3.11.2 → 3.13.0

**Lane:** live-glassui-currency
**Date:** 2026-06-11
**Auditor:** tranche-K audit fleet (subagent)
**Method:** `npm pack` both tarballs to /tmp; `tar -xzf` into /tmp/glass-ui-3.11.2/ and
/tmp/glass-ui-3.13.0/; `diff` type defs, dist chunks, CSS partials, and package.json.
All claims cite either file:line or the tarball paths below.

Tarballs (inv ε):
- `/tmp/mkbabb-glass-ui-3.11.2.tgz` (936 915 bytes, extracted to `/tmp/glass-ui-3.11.2/package/`)
- `/tmp/mkbabb-glass-ui-3.13.0.tgz` (925 352 bytes, extracted to `/tmp/glass-ui-3.13.0/package/`)
- `/tmp/mkbabb-glass-ui-3.12.0.tgz` (also extracted, used to partition 3.11→3.12 vs 3.12→3.13)

Current kf pin: `"@mkbabb/glass-ui": "~3.11.2"` — `package.json:182`, section
`optionalDependencies`. The tilde (`~`) permits `3.11.x` only; 3.12.x and 3.13.x are
blocked. Installed resolved version: `3.11.2`
(`node_modules/@mkbabb/glass-ui/package.json`, confirmed via `package-lock.json`).

---

## §1 Version ladder — what changed where

| Range | Pivotal changes |
|---|---|
| 3.11.2 → 3.12.0 | Dock API unchanged (GlassDock type defs identical); InstrumentRail still present; `variant-dock`/`variant-rail` CSS classes still emitted; typography tokens still fixed-rem (no fluid clamp). The delta is internal/hygiene. |
| 3.12.0 → 3.13.0 | **The breaking tranche**: dock taxonomy rewrite (AZ.W-DOCK-TAXONOMY), fluid typography tokens (AY.W-SCALE1), CSS god-module carve (tokens/glass/utilities each split to `*/` partials), new primitives (DockRail, GlassUnderline, GooBlob, Constellation), motion-curves export, click-integrity composable, autoLuminance default-ON, InstrumentRail removed, HandMark/DeckProgress/GlassDialogNative removed, `instrument-rail.css` dropped from index.css. |

---

## §2 Breaking changes — exact seams

### 2.1 Dock taxonomy: `variant="rail"` + `variant="instrument-strip"` removed (CSS + Props)

**Evidence:**

- `GlassDock.vue.d.ts` 3.11.2 accepts `DockVariantProps | DockRailProps` (discriminated
  union on `variant?: "dock" | "rail" | "instrument-strip"`). In 3.13.0 it accepts the
  unified `DockProps` (no `variant` prop). Source:
  `/tmp/glass-ui-3.11.2/package/dist/components/custom/dock/GlassDock.vue.d.ts:114–134`
  vs `/tmp/glass-ui-3.13.0/package/dist/components/custom/dock/GlassDock.vue.d.ts:1–21`.

- CSS class emission: In 3.11.2 the dock root emits `variant-dock` or `variant-rail`
  (among other classes). In 3.13.0 it emits only `"horizontal"` or `"vertical"`
  (orientation axis). The shell.css morph block changed from `.glass-dock.variant-dock:not(.vertical)`
  to `.glass-dock:not(.vertical)`.
  Source: `/tmp/glass-ui-3.11.2/package/dist/styles/dock/shell.css:246`
  vs `/tmp/glass-ui-3.13.0/package/dist/styles/dock/shell.css:246–260`.

- `variant-dock` count in morph.css: 4 (3.11.2) → 0 (3.13.0). `variant-rail` count in
  shell.css: 17 (3.11.2) → 4 (3.13.0). Source: `grep -c` over the two extracted packages.

**kf consume-edge exposure:** `demo/@/components/custom/dock/ChromeDock.vue` and
`demo/@/components/custom/animation-controls/TransportDock.vue` use `<GlassDock>` without
`variant=`. Neither passes `variant="rail"` or `variant="instrument-strip"`.
`grep -rn 'variant="rail"' demo/` → no hits. **This breaking change does NOT touch the
current kf consume surface.** Re-pinning is safe on this axis.

### 2.2 `instrument-rail.css` removed from `styles/index.css`

**Evidence:** `diff dist/styles/index.css` shows line `@import "./instrument-rail.css";`
deleted in 3.13.0. `/tmp/glass-ui-3.13.0/package/dist/styles/` has no `instrument-rail.css`.

**kf consume-edge exposure:** `grep -rn "instrument-rail\|InstrumentRail" demo/` → zero
hits. Not consumed. **No impact.**

### 2.3 `handmark`, `deck-progress`, `dialog-native` subpath exports removed

**Evidence:** `diff package.json` (exports block) — `./handmark`, `./deck-progress`,
`./dialog-native` entries gone from 3.13.0. The `.d.ts` stubs for these components are
absent from the 3.13.0 package.

**kf consume-edge exposure:** `grep -rn "HandMark\|DeckProgress\|GlassDialogNative" demo/`
→ zero hits. **No impact.**

### 2.4 `PAPER_WASH_GROUND` removed from aurora API

**Evidence:** `diff dist/api/index.d.ts` — `PAPER_WASH_GROUND` removed from aurora
re-export. `/tmp/glass-ui-3.13.0/package/dist/api/index.d.ts:2`.

**kf consume-edge exposure:** `grep -rn "PAPER_WASH_GROUND" .` → zero hits. **No impact.**

### 2.5 `autoLuminance` prop added to `GlassDock` — default ON

**Evidence:** `useDockShellProps.d.ts:130–138` in 3.13.0:

```ts
/**
 * …default-on adaptive luminance observer (H3 arm a); a
 * dark-substrate consumer opts out with `:auto-luminance="false"`…
 */
autoLuminance?: boolean;
```

In `dock.js:~setup`, the line `n.autoLuminance !== !1 && ve(g, { backgroundCanvas: … })`
shows it is ON unless explicitly `false`. This wires `useGlassBackdropLuminance` on the
dock root at ≤4 Hz, sampling `elementsFromPoint` under the dock's box to determine
`--glass-backdrop: light|dark`.

**kf consume-edge exposure:** kf uses `<GlassDock>` in `TransportDock.vue:23` and
`ChromeDock.vue:178`. Neither passes `:auto-luminance`. After re-pin, both docks would
run the luminance observer by default. Risk: minor rAF budget addition (≤4 Hz, gated
by IntersectionObserver + PRM). The kf demo's aurora/FourierField background is a canvas
— `backgroundCanvas` would need to be passed to the dock for accurate sampling over it.
Without `backgroundCanvas`, the observer stack-walks `elementsFromPoint` (static
approximation). **No crash risk. Subtle appearance effect possible on light backdrops.**

---

## §3 New features relevant to user findings

### 3.1 `useDockClickIntegrity` — press-scale click swallow fixed upstream (U-K3, J BLK-8)

**Evidence:** New composable `/tmp/glass-ui-3.13.0/package/dist/components/custom/dock/composables/useDockClickIntegrity.d.ts`. Exported as part of `dock.js`. The composable:

- Records the press-time element identity (`onPointerDownCapture`)
- Swallows a post-morph click if the collapse↔expand flip changed the hit element between
  pointerdown and click (`onClickCapture`)
- Opens a 320 ms settle window on expand (`markExpandFlip`)

This is the upstream fix for the press-scale/reflow click-miss that kf worked around in
J.W7c via the manual POINTERDOWN synthesize + capture-click-kill in `App.vue`. The 3.13.0
dock handles this internally — the kf workaround becomes redundant (but not harmful).

**Proof gate:** glass-ui 3.13.0 ships `proof:dock-no-scale-pop` and `proof:dock-tap-integrity`
as new gates. Evidence: `/tmp/glass-ui-3.13.0/package/package.json:579–581`.

**User finding:** U-K3 (rainbow play broken while slider progresses — clicks missing).
This composable does not directly cure U-K3 (which is a kf-side auto-binding deletion
from J.W7c), but it makes the dock's own click integrity self-managing after re-pin.

### 3.2 Fluid typography tokens — `--type-caption/small/body/prose` now `clamp()` (U-K6, U-K8, U-K10)

**Evidence:** `diff dist/styles/typography.css` — the AY.W-SCALE1 change:

```css
/* 3.11.2 */
--type-caption:  0.75rem;   /* 12px */
--type-small:    0.875rem;  /* 14px */
--type-body:     1rem;      /* 16px */
--type-prose:    1.125rem;  /* 18px */

/* 3.13.0 */
--type-caption: clamp(0.75rem, 0.71rem + 0.21vw, 1rem);
--type-small:   clamp(0.875rem, 0.8rem + 0.25vw, 1.25rem);
--type-body:    clamp(1rem, 0.92rem + 0.27vw, 1.375rem);
--type-prose:   clamp(1.125rem, 1.04rem + 0.28vw, 1.5rem);
```

Source: `/tmp/glass-ui-3.13.0/package/dist/styles/typography.css:101–134`. The floor of
each clamp is byte-identical to the 3.11.2 fixed value — no narrow/mobile reflow. On
wide displays the body register grows ~1–2 steps. Display/heading/title rungs
(`--type-subheading` / `--type-heading` / `--type-title`) remain fixed-rem (typographic
identity, not control).

**User finding:** U-K6 (fonts wrong globally), U-K8 (top dock expanded fonts wrong),
U-K10 (fonts inconsistent globally). The fluid base provides the viewport-adaptive
growth the user noted on large monitors. The dock's own control text inherits from
`--type-small`/`--type-body` through `--control-text`/`--control-text-sm` in tokens.css,
so the dock's font also grows proportionally. **Re-pin partially addresses U-K6/U-K8/U-K10
without any kf-side change** — the fluid base token change is purely upstream.

**Note:** U-K6 specifically asks for Instrument Serif on the bottom dock. The 3.13.0 font
stack is unchanged: `--font-stack-display: var(--font-stack-text)` → Plus Jakarta Sans.
There is NO Instrument Serif token in glass-ui. That font change requires kf-side CSS
that overrides `--font-display` on the dock element. **Not addressed by re-pin alone.**

### 3.3 Slider `touch-hit-area` utility on thumb (U-K15)

**Evidence:** Slider chunk diff between 3.11.2 and 3.13.0:

```js
/* 3.11.2 */
class: "slider-thumb glass-specular-track"

/* 3.13.0 */
class: "slider-thumb glass-specular-track touch-hit-area"
```

Source: `/tmp/glass-ui-3.13.0/package/dist/slider-B-JP2JlI.js:113`.

The `touch-hit-area` utility is a new `@utility` in
`/tmp/glass-ui-3.13.0/package/dist/styles/utilities/a11y-overrides.css:122`:
- `position: relative`; on `@media (pointer: coarse)` adds a `::before` overlay with
  `min-width/min-height: var(--touch-target, 2.75rem)` (44px floor), centered via
  `top:50%; left:50%; translate:-50% -50%`.
- On fine pointer: NO overlay, byte-identical to bare visual box.

**User finding:** U-K15 (spring animation slider literally steps — not smooth). The
`touch-hit-area` on the thumb improves coarse-pointer tap acquisition on mobile but
does NOT directly address the stepping. The stepping on desktop is a `step` prop issue
(kf uses `:step="0.01"` in `SpringSidebar.vue:48,58`). The slider component API is
unchanged between versions (`step` prop exists in both). **Re-pin does not cure U-K15.**
The stepping on desktop (where step=0.01 = 100 discrete stops over [0.1,1.2]) is a
design decision, not a slider bug. To make it feel smooth, kf should either reduce the
step further or display the interpolated value more continuously.

### 3.4 SegmentedTabs indicator squish + new `segmented-tabs.css` (U-K12)

**Evidence:** New `dist/styles/segmented-tabs.css` in 3.13.0 (absent in 3.11.2, absent
in 3.12.0). Contains the unified indicator body with `--stretch` travel-squish scalar
(volume-preserving liquid morph: X-stretch / Y-compress). Extracted from the SFC
`<style scoped>` into a plain-class stylesheet so the classes apply un-scoped.

Source: `/tmp/glass-ui-3.13.0/package/dist/styles/segmented-tabs.css:1–52`.

New tabs `constants.d.ts` exports: `DEFAULT_INDICATOR_MAX_STRETCH = 1.08`,
`INDICATOR_RELEASE_MS = 60`. Source:
`/tmp/glass-ui-3.13.0/package/dist/components/custom/tabs/constants.d.ts`.

**User finding:** U-K12 (top tabs look awful — pills if tabs at all). The improved
indicator animation is an aesthetic win but does not change the tabs component's
fundamental appearance. Switching to pills or dock-dropdown items is a kf-side
architectural choice. **Re-pin provides better animation; structural change still needed
for U-K12.**

### 3.5 `GlassUnderline` — new primitive (U-K12, U-K16)

**Evidence:** New `./underline` subpath export in 3.13.0. Component API:
- `clock: "load" | "scroll" | "static"` — load (once, via Sequence), scroll (native
  `view()` keyframes, bidirectional), or static (always drawn).
- `variant: "pen" | "pencil" | "crayon" | "boil"` — pen is shipped; others are API stubs.
- `drawMs`, `easing`, `color`, `paths` (full geometry escape).
- Exposes `play(): Promise<void>` + `snap()`.

Source: `/tmp/glass-ui-3.13.0/package/dist/components/custom/underline/GlassUnderline.vue.d.ts`.

**User finding:** U-K12 (tabs look awful). GlassUnderline provides a hand-drawn pen
underline decoration — usable on text labels in the top dock header as a stylistic accent
instead of tab underline indicators. Not a direct substitute for tab navigation but
relevant to K's design refinement work.

### 3.6 `motion-curves` + `springPresets` export (U-K11, U-K16)

**Evidence:** New `./motion-curves` subpath. Exports:
- `SPRING_PRESETS: readonly SpringPresetRow[]` — 5 named presets (smooth/snappy/bouncy/
  gentle/dock) with `(response, dampingFraction)` pairs.
- `springPreset(name)` lookup.
- `useLiquidFlex` composable — velocity-driven squish scalar (tanh law or linear law),
  the same curve as the metaball shader.
- Motion curve types: `MotionCurve`, `MotionCurveKind`, `CurveFn`.

Source: `/tmp/glass-ui-3.13.0/package/dist/composables/motion/springPresets.d.ts`.

**User finding:** U-K11 (spring UI inadequate, no keyframes editor), U-K16 (spring viz
needs real options). The `SPRING_PRESETS` constant gives kf a canonical registry to
populate a spring-preset picker with proper labels and physics parameters, rather than
maintaining a local copy. **Re-pin enables this improvement; kf must consume it.**

### 3.7 `DockRail` — new facet-strip component

**Evidence:** New `DockRail.vue` component (in the `./dock` subpath). Takes `items:
readonly DockRailItem[]`, `v-model:context`, emits `@advance`. Renders a hairline-borne
chip strip OUTSIDE the dock's clipping aperture (the `glass-dock-frame` escape), so it
never changes the dock's inline/block size. The prior `DockLayerGroup` in-pane switcher
is gone from 3.13.0 via the taxonomy rewrite.

Source: `/tmp/glass-ui-3.13.0/package/dist/components/custom/dock/DockRail.vue.d.ts`.

**User finding:** U-K7 (dock/stage/controls layout needs wild refinement). DockRail is
the upstream answer for multi-context navigation on the top dock without inflating the
dock box. Not used by kf yet; relevant to K layout work.

### 3.8 `useGlassBackdropLuminance` — adaptive glass composable

**Evidence:** New `dist/composables/glass/useGlassBackdropLuminance.d.ts`. Samples the
backdrop luminance under a glass surface at ≤4 Hz (IntersectionObserver-gated), writes
`--glass-backdrop: light|dark` to trigger the AZ.W-ADAPTIVE-AUTO oklab tint arm.

**User finding:** U-K2 (hero rainbow-play → no smooth immediate transition to cube). The
adaptive glass machinery is orthogonal to the U-K2 cold-path breakage (which is a kf-side
auto-binding issue from J.W7c). The luminance observer would make the dock auto-darken
when floating over the hero's FourierField canvas (light background), which is a visual
improvement, but it does not cure the animation breakage.

### 3.9 Constellation new primitives (U-K20)

**Evidence:** New `dist/components/custom/constellation/` types in 3.13.0 (5 new `.d.ts`
files): `ConstellationField`, `createConstellationField`, `useConstellationPointer`,
`constants`, `constellationDraw`, `constellationInteraction`.

Source: `/tmp/glass-ui-3.13.0/package/dist/components/custom/constellation/`.

**User finding:** U-K20 (remove FourierField from hero background). Constellation is the
candidate replacement for FourierField as a lighter, more legible hero background. It is
a canvas-based particle field (not a Fourier/WebGL shader). The kf codebase currently
imports `fourier-field` subpath (`grep -rn "fourier-field" demo/` hits). Constellation
is available in the 3.13.0 package under the existing `fourier-field` subpath's
`presets.d.ts` new sibling — but as a SEPARATE export, not a drop-in replacement for
`FourierField`.

---

## §4 CSS architecture changes (affect kf prove gates)

### 4.1 tokens.css split into `tokens/*.css` partials

**Evidence:** 3.11.2 `tokens.css` = 2372 lines (monolith). 3.13.0 `tokens.css` = 34
lines (thin `@import` root over 9 partials). The compiled output is cascade-isomorphic
— same CSS, same `:root` context, same cascade order. Source:
`/tmp/glass-ui-3.13.0/package/dist/styles/tokens.css`.

**Proof gate risk:** `proof:no-brittle-selector` and `proof:styling-idioms` inspect the
kf source (not glass-ui's own dist), so this carve is invisible to kf's gates. The
`proof:glass-and-cartoon` gate measures computed styles from the live rendered tree —
unaffected by the file-split. **Low risk.**

### 4.2 `instrument-rail.css` removed from `index.css` load order

**Evidence:** `diff dist/styles/index.css` — `@import "./instrument-rail.css"` deleted.

Kf does not import or use `instrument-rail.css` directly. The kf Vite config imports
`@mkbabb/glass-ui/styles/index.css`. After re-pin, the instrument-rail styles are simply
absent from the cascade — no negative effect since kf does not use InstrumentRail.
**No impact.**

### 4.3 Adaptive glass tinting wired unconditionally on `.glass-dock`

**Evidence:** `dist/styles/dock/morph.css` (3.13.0) adds `color-mix(in oklab, …,
var(--glass-tint-source) var(--glass-tint-strength))` to BOTH morph endpoints. At
rest (default `--glass-tint-strength: 0%`) the mix is a no-op. The `autoLuminance=true`
default (§2.5) will set the strength to a non-zero value when the backdrop is light.

**Proof gate risk:** `proof:glass-and-cartoon` measures computed background-color α. The
`color-mix()` is a no-op at `0%` strength → α unchanged → gate stays green. If
`autoLuminance` fires on the demo's FourierField canvas backdrop, the dock may tint
slightly darker, but the α ceiling check is permissive (≤0.55 for cartoon panels, not
the dock). **Low risk; the gate should remain green.**

### 4.4 Dock padding-block now PINNED (no longer morphed)

**Evidence:** `diff dist/styles/dock/morph.css` for the horizontal dock padding:

```css
/* 3.11.2 */
padding-block: calc(
    var(--dock-pad-collapsed) +
        (var(--dock-padding-block, 0.375rem) - var(--dock-pad-collapsed)) *
        var(--dock-expand-t, 1)
);

/* 3.13.0 */
/* block padding is INVARIANT — the expanded value, both states */
padding-block: var(--dock-padding-block, 0.375rem);
```

Source: `/tmp/glass-ui-3.13.0/package/dist/styles/dock/morph.css:134–138`.

This is the AY.W-DOCK-CHROME §1 layout-isolation fix: the dock height no longer
shrinks ~4px on collapse, eliminating a sibling reflow. **This directly addresses the
`proof:mobile-single-page` stage-band-reserve jitter that was worked around in J.W7c
S1/#6.** After re-pin, the `--menubar-measured-h` should be more stable.

---

## §5 Re-pin mechanics

### 5.1 What the pin change must be

| From | To | Reason |
|---|---|---|
| `~3.11.2` | `~3.13.0` | The tilde `~` permits only the patch band; `~3.13.0` allows `3.13.x` while staying below `3.14`. A `^3.13.0` (minor-range) pin is also acceptable (glass-ui follows semver in the `3.x` line). |

The `proof:deps-current` floor at `scripts/proof-deps-current.mjs:80` reads:

```js
"@mkbabb/glass-ui": "3.11.2",
```

This floor must be **advanced to `3.13.0`** in the same wave that updates `package.json`.
Source: `scripts/proof-deps-current.mjs:80`.

### 5.2 Subpath exports — no breakage

All 18 subpath imports used by the kf demo resolve in 3.13.0 (verified by cross-checking
`package.json#exports` against the `grep` output of `from "@mkbabb/glass-ui..."`):
`animated-digit`, `color`, `controls`, `dark`, `dock`, `forms`, `fourier-field`,
`glass-panel`, `header-ribbon`, `icon-tooltip`, `keyboard`, `labeled-field`,
`metric-badge`, `motion-core`, `status-dot`, `tabs`, `toggle-chip`. All present. Source:
verified by Python cross-check of exports vs imports (inv ε).

### 5.3 Peer dependency change

3.11.2 peer: `@mkbabb/keyframes.js: "^2.2.0 || ^3.0.0 || ^4.0.0"` (multi-range).
3.13.0 peer: same (unchanged in `peerDependencies`). Confirmed by `python3` diff of both
`package.json` peer blocks. kf is at 4.2.0 which satisfies `^4.0.0`. **No peer issue.**

The 3.13.0 `devDependencies` bumped its own kf reference from `^2.2.0` to `^4.1.0` —
this is glass-ui's internal dev dep, not kf's peer requirement. kf's `peerDependencies`
in its own `package.json` are unaffected.

Optional deps `@mkbabb/pencil-boil` and `perfect-freehand` removed from 3.13.0 peer
(handmark component removed). kf never declared these; no impact.

### 5.4 The press-scale hazard path after re-pin

J.FINAL.md §P0 lesson: the `--scale-press-dock .96` press scale reflows the pill on
pointerdown, causing click misses. kf worked around this in J.W7c by synthesizing reka's
click on POINTERDOWN in `App.vue`.

After re-pin to 3.13.0, the dock ships `useDockClickIntegrity` which guards this
internally (§3.1). The kf workaround (`App.vue` pointerdown-synthesize + capture-kill)
remains behaviorally correct even with the upstream guard active — the two guards are
NOT exclusive (the upstream guard on the DOCK root, the kf guard on the TRIGGER). In
the worst case, a click that the upstream guard swallows would also have been handled by
the kf guard. There is no double-dispatch risk because the upstream guard
(`e.stopPropagation(); e.preventDefault()`) prevents the click from reaching the
trigger at all — the kf pointerdown synthesize has already run.

**Net:** The kf `App.vue` click workaround can remain through K's initial waves without
causing bugs. It should be removed in a dedicated cleanup wave that verifies
`proof:dock-popover-opens` still passes after removing it.

---

## §6 Findings not cured by re-pin alone

| Finding | Why re-pin is insufficient | What K must do |
|---|---|---|
| U-K1 (dock not shrunken by default) | `startCollapsed: true` is still the default in 3.13.0 (confirmed: `useDockShellProps.d.ts:113`). The dock starts collapsed by construction. User finds it too small by default. | Add an idle-expand grace period or adjust `--dock-collapsed-summary-min-size` token. Glass-ui side knob, not a re-pin fix. |
| U-K2 (hero → cube transition broken) | The cold-path breakage is from J.W7c's conditional-select deletion killing an auto-binding side-effect. Re-pin does not touch `src/animation/`. | Restore the missing scene-enter binding (separate K wave, `k-cold-path-probe.mjs` evidence). |
| U-K3 (rainbow play broken while slider advances) | Same root cause as U-K2. | Same wave as U-K2. |
| U-K6 (Instrument Serif missing on bottom dock) | glass-ui 3.13.0 font stack: `--font-stack-display: var(--font-stack-text)` = Plus Jakarta Sans. Instrument Serif is NOT in the glass-ui token system. | kf-side CSS override on the dock element: `--font-display: "Instrument Serif", serif`. This is NOT a glass-ui root change — it's kf's consumer override. |
| U-K15 (slider literally steps) | Slider API unchanged. kf's `:step="0.01"` on `LabeledSlider` in `SpringSidebar.vue:48,58` produces 110 stops over [0.1,1.2] — perceptible on pointer drag. | Reduce step to `0.001` or implement a continuous-drag pointer handler that interpolates between steps. |
| U-K20 (remove FourierField from hero) | FourierField is kf's own component choice. Constellation is available in 3.13.0 but is not a drop-in. | Replace `FourierField` with `Constellation` or a simpler CSS background in the hero scene. |

---

## §7 Risk surface summary

| Risk | Severity | Notes |
|---|---|---|
| `variant-dock`/`variant-rail` CSS class gone | None for kf | kf does not pass `variant="rail"`. |
| Adaptive glass default-on `autoLuminance` | Very low | 0% strength at rest = no-op. Possible subtle dock darkening over FourierField canvas — can be suppressed with `:auto-luminance="false"` |
| `proof:glass-and-cartoon` α ceiling | Low | `color-mix(…, 0%)` is a no-op; gate measures computed α. |
| `proof:dock-zorder` | Low | Still uses `.glass-dock` selector (unchanged), not `variant-dock`. |
| `proof:specular-absent-at-rest` | Low | `--specular-intensity` defaults unchanged. `glass-specular-track` class still emitted. |
| `proof:deps-current` FLOOR | **Must update** | Floor `"@mkbabb/glass-ui": "3.11.2"` must advance to `"3.13.0"` before the re-pin lands. `scripts/proof-deps-current.mjs:80`. |
| Dock `padding-block` now pinned | Beneficial | The J.W7c `--menubar-measured-h` jitter workaround may become redundant. Verify `proof:mobile-single-page` still green. |
| kf `App.vue` click workaround | Redundant but harmless | `useDockClickIntegrity` now handles it upstream; kf workaround can coexist safely. |

---

## §FOLD

| Finding | Severity | Seam | Suggested wave-class |
|---|---|---|---|
| glass-ui pin `~3.11.2` blocks fluid typography (U-K6/K8/K10 partial fix), slider touch-hit-area (U-K15 mobile), segmented-tabs liquid indicator (U-K12 polish), click integrity upstream fix (BLK-8 durable cure) | P1 | `package.json:182` + `scripts/proof-deps-current.mjs:80` | K.W-REPIN (infra/housekeeping wave; single package.json + floor update + npm install + proof:all green) |
| Instrument Serif not in glass-ui 3.13.0; U-K6 dock font requires kf-side `--font-display` override | P1 | Demo CSS / `ChromeDock.vue` | K.W-TYPOGRAPHY (same wave as the dock/layout refinement) |
| `autoLuminance` default-ON may subtly darken dock over FourierField canvas; kf should pass `:backgroundCanvas` or opt-out | P2 | `TransportDock.vue:23`, `ChromeDock.vue:178` | K.W-REPIN (one prop addition alongside the re-pin) |
| `proof:deps-current` floor hard-coded to `3.11.2` will RED after re-pin to `3.13.0` | P1 | `scripts/proof-deps-current.mjs:80` | K.W-REPIN (must land atomically with pin change) |
| `SPRING_PRESETS` now exported from `./motion-curves`; kf spring scene should consume for canonical preset picker (U-K11/K16) | P2 | `demo/spring/SpringSidebar.vue` | K.W-SPRING-UI (spring UI wave) |
| `DockRail` available for multi-context navigation (U-K7 layout refinement) | P2 | `demo/@/components/custom/dock/ChromeDock.vue` | K.W-LAYOUT (dock layout redesign wave) |
| kf `App.vue` POINTERDOWN-synthesize workaround now redundant; should be removed | P2 | `demo/app/App.vue` (J.W7c fix seam) | K.W-REPIN or K.W-CLEANUP (after verifying `proof:dock-popover-opens` still green) |
| `GlassUnderline` now available for hand-drawn text accents (U-K12 top dock aesthetic) | P2 | `demo/@/components/custom/dock/ChromeDock.vue` | K.W-TYPOGRAPHY |
| Constellation available as FourierField replacement (U-K20); not a drop-in, needs integration | P2 | `demo/app/HeroScene.vue` (or equivalent hero scene) | K.W-HERO |
| Dock `padding-block` now PINNED; J.W7c `--menubar-measured-h-peak` workaround may be obsolete | P2 | `demo/app/style.css` (`--dock-top-band-reserve-stable`) | K.W-REPIN (verify `proof:mobile-single-page` after pin, remove if redundant) |
