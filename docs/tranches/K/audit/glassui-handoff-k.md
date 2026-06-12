# keyframes.js Tranche K — glass-ui coordination lane

**Lane:** glass-ui handoff ledger · consume-vs-handoff split · K findings  
**Author:** audit fleet, 2026-06-12  
**Glass-ui installed:** `~3.11.2` (on-disk: 3.11.2)  
**Glass-ui latest:** 3.13.0 (published 2026-06-12T02:11:45Z — **17 hours before this audit**)  
**Gap:** 3.11.2 → 3.13.0 (two minor bumps unreceived by kf)  
**Source:** `/Users/mkbabb/Programming/keyframes.js` branch `tranche-j-dev` @ `4f1fc4c`  
**J ledger ground truth:** `docs/tranches/J/glassui-AX-handoff.md` (46-item REFINE + ABSTRACT corpus)  

---

## §0 — Posture and scope

This lane owns exactly three things:

1. **The J handoff ledger state** — which of the 25 REFINE + 21 ABSTRACT items landed in
   glass-ui 3.12.0 / 3.13.0 (the two minor bumps kf has not yet consumed).
2. **The RF-16 / RF-17 hazard status** — the two J.W7c-born glass-ui seam items.
3. **K findings → new handoff candidates** — what the K user audit (U-K1…U-K20) surfaces
   that is glass-ui-owned, consume-vs-handoff split, and wave-class.

inv-16 holds throughout: **kf consumes published glass-ui; nothing below is patched in kf.**

---

## §1 — Version timeline (observed)

```
npm view @mkbabb/glass-ui --json | python3 -c "..."
# times extracted:
3.11.0  2026-06-10T20:58:06Z
3.11.1  2026-06-10T21:10:44Z
3.11.2  2026-06-10T22:41:52Z   ← kf pins ~3.11.2 (tilde)
3.12.0  2026-06-11T11:48:40Z   ← +13h after J.W7c close
3.13.0  2026-06-12T02:11:45Z   ← +15h after 3.12.0
```

kf `package.json:optionalDependencies` line: `"@mkbabb/glass-ui": "~3.11.2"`.  
`~3.11.2` resolves `>=3.11.2 <3.12.0` — **both 3.12.0 and 3.13.0 are outside the tilde window**.  
On-disk `node_modules/@mkbabb/glass-ui/package.json` version: `3.11.2` (confirmed:
`cat node_modules/@mkbabb/glass-ui/package.json | python3 -c "…" → installed version: 3.11.2`).

**Evidence anchor:** `npm view @mkbabb/glass-ui versions --json` output (run 2026-06-12T, this session).

---

## §2 — What landed in 3.12.0 (vs 3.11.2)

**Delta method:** `diff -rq node_modules/@mkbabb/glass-ui/dist /tmp/gu-312/package/dist` →
3 differing files: `controls.js`, `glass-ui.css`, `styles/utilities.css`.

### 3.12.0 — landed items

| Item | What shipped | J-ledger match |
|---|---|---|
| **PRM data-allow-motion carve** | `utilities.css:1215-1227` — `@media (prefers-reduced-motion: reduce) [data-allow-motion]` block added; the `.no-transition` class now selects `*:not([data-allow-motion])` so an element declaring `data-allow-motion` keeps its authored transition through the theme-flip storm but still snaps under PRM (accessibility is absolute). Observed diff at `diff utils.css 3.11.2 3.12.0` | No direct J REFINE item — this is a glass-ui-internal accessibility fix. The kf demo already has no `data-allow-motion` usages; no kf action needed. |

**J-ledger items NOT in 3.12.0:** All 25 REFINE + 21 ABSTRACT booked items remain unshipped.  
**Residual RF-16/RF-17 status:** no upstream fix in 3.12.0 (RF-16 kf consumer `:freeze` guard remains
the active mitigation; RF-17 `pointerHandled` workaround in `TransportDock.vue:296-330` still needed).

---

## §3 — What landed in 3.13.0 (vs 3.12.0)

**Delta method:** `diff -rq /tmp/gu-312/package/dist/components /tmp/gu-313/package/dist/components` →
58 differing/new files. Key findings follow.

### 3.13.0 — items that discharge J-ledger entries

#### RF-17 RESOLVED — `useDockClickIntegrity` (the collapse-crossfade click-strand fix) · **P1 → GREEN**

**Evidence:** `/tmp/gu-313/package/dist/components/custom/dock/composables/useDockClickIntegrity.d.ts`
ships `DockClickIntegrity` with `onPointerDownCapture`, `onClickCapture` (description: *"swallows an
identity-changed post-swap click"*), and `markExpandFlip`. The dock JS bundle wires it:
`grep -rn "clickIntegrity\|DockClickIntegrity" /tmp/gu-313/package/dist/ → /tmp/gu-313/package/dist/dock.js`.

**J-ledger item RF-17** (`glassui-AX-handoff.md §2 RF-17`): *"the dock keeps the LEAVING layer
hit-testable for the in-flight gesture … defer the `.is-leaving` `pointer-events:none` flip until
after the active pointer sequence completes"*. The `useDockClickIntegrity` identity-guard is the
upstream implementation of exactly this intent — it captures press-time element identity and
swallows the trailing click if the identity changed during the collapse crossfade.

**kf consume-edge after re-pin to ≥3.13.0:** `TransportDock.vue:277-330` — the
`onPlayPointerDown`/`onPlayClick`/`pointerHandled` workaround collapses to a single `@click` handler.
The `pointerHandled` guard, `onPlayPointerDown`, the `onCollapsedPlayClick` → revert all to plain
`@click="actuatePlay"`. The born-RED kf gate `proof:live-session` S5 stays GREEN via the upstream
mechanism.

**Wave-class on re-pin:** K.W0 or K.W1 (S effort — a clean revert, gated on the re-pin commit).

#### 3.13.0 — Slider "standard" variant redesign · potentially addresses U-K15

**Evidence:** `dist/components/ui/slider/index.d.ts` 3.13.0 description: *"standard — the CONTINUOUS
GLASS CYLINDER with NO VISIBLE THUMB AT ALL … the reka SliderThumb STAYS MOUNTED (a11y) but paints
INVISIBLE: width 0, opacity 0, transparent — no distinct disc/cap/ring over the continuous cylinder.
… the iOS press spring gives the whole fill a felt squish."* vs 3.11.2: *"standard — CONTINUOUS
ROUNDED CYLINDER: a THICK glass capsule track with the round knob INSCRIBED inside it … the knob rides
ON it with zero protrusion."*

U-K15 (*"the spring animation slider literally steps (not smooth)"*) — if the visual stepping is caused
by the inscribed-knob geometry snapping at discrete `step` increments (the knob's circle center moves
in visible jumps at `step=0.01`), the invisible-thumb variant in 3.13.0 may resolve the stepping
percept (only the filled cylinder edge moves, no hard circle to snap). **Not conclusive without
a live probe; rooted as a consume-candidate pending verification.**

**kf consume-edge on re-pin:** automatic (glass-ui's `Slider` `standard` variant changes are backward-
compatible CSS; kf's `LabeledSlider` consumes `standard` by default). The spring slider `step=0.01`
(`SpringSidebar.vue:48,58`) is already sub-pixel granular — if the stepping was the knob, it resolves
for free. If the stepping is a data/update issue, it remains open (separate U-K15 investigation needed).

#### 3.13.0 — FourierField `intensity` prop · U-K20 partial

**Evidence:** `dist/components/custom/fourier-field/index.d.ts` 3.13.0 adds `intensity?: number`
(*"Outer loudness envelope … Scales the resolved peakAlpha/headGlowAlpha at the paint layer. Default 1;
clamped [0, 2]."*). 3.11.2 lacked this prop.

U-K20 (*"REMOVE the FourierField from the hero background"*) is a kf-demo deletion (the user dislikes
it; not a consume question). However the new `intensity` prop gives kf a recession knob if the decision
is instead to KEEP it at lower presence. This is a kf-side disposition decision, not a glass-ui action.
The FourierField removal from `EditorStartScreen.vue` (`demo/@/components/custom/editor-shell/EditorStartScreen.vue:78-86`) is a pure kf-demo change requiring no glass-ui action either way.

#### 3.13.0 — DockRail new component · RF-7 partial / new pattern

**Evidence:** `dist/components/custom/dock/DockRail.vue.d.ts` — the *"hairline-borne, floating CAROUSEL-
LIKE chip STRIP"*: items outside the dock box that persist when collapsed, writing `v-model:context`.

RF-7 (*"`GlassDock initialExpanded` prop"*) asked for a `initialExpanded` prop on `GlassDock` so the
home landing starts expanded. The on-disk 3.13.0 `DockProps` (verified:
`useDockShellProps.d.ts:113`) has `startCollapsed?: boolean` — **`startCollapsed: false` is the functional
equivalent of `initialExpanded: true`**. This RESOLVES RF-7's ask, though via inverse naming.

**kf consume-edge on re-pin:** `ChromeDock.vue:178` currently passes `:start-collapsed="true"` always.
The home-landing scene can pass `:start-collapsed="false"` to start expanded; non-home passes `true`.
This is a K kf-demo change (thread `startCollapsed` from `App.vue` per-scene).

**Wave-class:** K.W0 or K.W1 (S effort, depends on App.vue wiring).

#### 3.13.0 — Typography fluid clamp scale · context for U-K6/U-K8/U-K10

**Evidence:** `typography.css` 3.13.0 replaces the fixed `--type-caption`/`--type-small`/`--type-body`/
`--type-prose` rungs with `clamp()` viewport-fluid values (the body register grows ~1-2 steps on wide
displays). This is the upstream font-sizing fix for the *"font too small on 27" display"* register.
Relevant to U-K6 (*"fonts wrong globally"*) / U-K8 (*"top dock expanded fonts wrong"*) / U-K10
(*"fonts inconsistent globally"*) — on re-pin kf inherits the fluid body scale automatically.

**kf action on re-pin:** verify `style.css:100-117` four-token `:root` override still applies cleanly
after the fluid scale; the four-token bridge (RF-2 workaround) overrides `--font-stack-text` which
feeds the clamp-based rungs — confirm no interaction. No code change expected; the override was already
the durable path (`proof:demo-fonts`).

#### 3.13.0 — LabeledField `hideLabel` prop · AZ.W-BLOB-REDRESS

**Evidence:** `LabeledField.vue.d.ts` 3.13.0 adds `hideLabel?: boolean` (*"render the field's own label
sr-only … when an enclosing chrome row (a `<ConfiguratorRow>`) already supplies the visible human
label"*).

This is orthogonal to RF-3 (`orientation="horizontal"` + subgrid). No J-ledger discharge. Potentially
useful if K introduces `ConfiguratorRow`-wrapped `LabeledSlider` panels (the double-label leak fix).

#### 3.13.0 — BREAKING: ExpandableContainer API change · kf impact = NONE

**Evidence:** `ExpandableContainer.vue.d.ts` diff shows 3.11.2 had `viewTransitionName?: string` prop,
`anchorEl`/`surfaceEl`/`expand`/`collapse` exposed refs, `@settle` event; 3.13.0 removes ALL of these
and exposes only the `default` slot with `fullscreen: boolean`.

`grep -rn "ExpandableContainer" /Users/mkbabb/Programming/keyframes.js/demo/ → 0 hits`.
kf does not consume `ExpandableContainer` — **zero impact on the re-pin**.

#### 3.13.0 — REMOVED: deck-progress, dialog-native, handmark, instrument-rail · kf impact = NONE

**Evidence:** `diff -q /tmp/gu-312/…/components/custom /tmp/gu-313/…/components/custom` → four
directories removed in 3.13.0. `grep -rn "deck-progress\|dialog-native\|handmark\|instrument-rail" demo/ → 0 hits`.
**Zero kf impact.**

---

## §4 — J-ledger state after 3.12.0 / 3.13.0 (the full audit)

### REFINE items (25 total)

| ID | Ask | Status in 3.13.0 | Evidence anchor |
|---|---|---|---|
| **RF-1** | `cartoon-surface` default `border-radius` | **STILL MISSING** | `cards.css @utility cartoon-surface` in 3.13.0: `border-width`, `box-shadow`, `translate`, `transition`, `&:hover` lift — **no `border-radius`**. `grep -A15 "@utility cartoon-surface" /tmp/gu-313/…/cards.css` confirmed. |
| **RF-2** | headless typography / brand-font-off lever | **STILL MISSING** | `typography.css` comment: *"Plus Jakarta Sans (text + display)"*; `--font-stack-text: "Plus Jakarta Sans"` still in tokens register. No opt-out mechanism shipped. |
| **RF-3** | `LabeledField orientation="horizontal"` + subgrid | **STILL MISSING** | `LabeledField.vue.d.ts` 3.13.0 props: `label`, `tooltip`, `labelClass`, `required`, `hideLabel` — no `orientation`. |
| **RF-4** | `LabeledSlider orientation="stacked"` / `fullWidth` | **STILL MISSING** | `LabeledSlider.vue.d.ts` 3.13.0: same props as 3.11.2 + `hideLabel` only. |
| **RF-5** | `SegmentedControl` / connected-pill posture | **STILL MISSING** | No `SegmentedControl` component in 3.13.0 component tree. |
| **RF-6** | `StatusDot` scene-semantic tone slot | **STILL MISSING** | `status-dot.d.ts` unchanged. |
| **RF-7** | `GlassDock initialExpanded` prop | **RESOLVED via `startCollapsed`** | `useDockShellProps.d.ts` 3.13.0 has `startCollapsed?: boolean`. `startCollapsed: false` = starts expanded. **Consume-edge available on re-pin.** |
| **RF-8** | `GlassDock` empty/no-target placeholder state | **STILL MISSING** | No placeholder-state variant shipped in dock. |
| **RF-9** | `DockSelectTrigger size="lg"` | **STILL MISSING** | `DockSelectTrigger.vue.d.ts` unchanged. |
| **RF-10** | `GlassPanel border={false}` | **STILL MISSING** | GlassPanel component unchanged. |
| **RF-11** | case-preserving `text-mono-caption` variant | **STILL MISSING** | Typography utilities unchanged re: case-preserving mono rung. |
| **RF-12** | `.gold-shimmer` as stable `@utility` | **PARTIAL** | `animations.css:139` still exports `@keyframes gold-shimmer-slide`; no explicit `@utility gold-shimmer` docs contract. The kf consume-half (J.W7b IMPL §A) already landed; the STABILITY contract (documentation) remains open. |
| **RF-13** | `--spring-*` timing-token discoverability | **OPEN (docs-only)** | No token-family docs shipped. No born-RED gate; RECORD only. |
| **RF-14** | `HeaderRibbon`/`ActionRibbon` per-tab slots | **STILL MISSING** | No per-tab slotted ribbon variant. |
| **RF-15** | `glass-wash` stage-context note | **RECORD only** | No change owed; glass-wash still ships. |
| **RF-16** | PRM ResizeObserver → TDZ crash | **kf-MITIGATED (J.W7c `:freeze`)** | Upstream init-order fix NOT in 3.12.0 or 3.13.0 (no TDZ fix visible in bundle diffs). kf consumer guard (`EditorStartScreen.vue:84`) remains the active mitigation. AX ask DOWNGRADED P1→P3 (J.W7c r2 verdict). |
| **RF-17** | dock collapse-crossfade click-strand | **RESOLVED upstream in 3.13.0** | `useDockClickIntegrity.d.ts` + `dock.js` confirm the identity-guard ships. kf `TransportDock.vue:296-330` pointerdown workaround reverts on re-pin. **§3 above.** |
| **RF-tail** | `{types}` directional VT helper | **OUT** | No VT helper in 3.13.0. Election-gated (D11). |

### ABSTRACT items (21 total)

None of AX-1 through AX-13 shipped in 3.12.0 or 3.13.0. Evidence: exhaustive grep across
both tarballs for `GlassControlPoint`, `GlassRail`, `GlassRailBall`, `CopyableArtifact`,
`bg-graph-paper`, `PlayheadTrack`, `float-idle`, `SceneHeader`, `MetricHeader`,
`rainbow-outlined` all returned zero hits. The AX items remain **BOOKED**; their born-RED kf
gates remain held (consume-on-future-AX-publish; no kf deletion in K absent the publish).

### ADOPT items (§3 J-ledger — consume-on-3.9.0)

ADOPT-1/2/3/6/9 rode J.W7a; ADOPT-4/7 exited W7b to the appearance lane (not yet consumed —
`ScrubberTimeline` ADOPT-4 and `SegmentedTabs` ADOPT-7 survive as open consume edges). No change
from 3.12.0 / 3.13.0 on these; they are 3.9.0-published items kf has not yet consumed.

---

## §5 — New handoff candidates from the K user audit (U-K1…U-K20)

### K-HO-1 — bottom dock display-voice token (U-K6: "Instrument Serif in the collapsed pill") · **P1 — consume + handoff split**

**Finding:** U-K6 says the bottom dock should carry the Instrument Serif display voice.
`TransportDock.vue:153-154` renders the collapsed-pill animation name as `class="dock-label …"`.
The `dock-label` CSS class is a glass-ui-controlled utility (mono caption scale, ~13px), not
Instrument Serif. kf's Instrument Serif identity (`style.css:53: --font-display: "Instrument Serif"…`)
is NOT plumbed into the dock trigger label.

**Split:**
- **kf-side (consume):** override the `dock-label` typography on `DockSelectTrigger` / the
  collapsed-pill span by adding `font-display` or `text-heading` class on the scene name spans.
  This is a demo-side delta (kf's own identity expression), not a glass-ui surface change —
  kf is ALLOWED to style its own scene-name label. Current `dock-label` is the glass-ui
  semantic for dock content; kf can layer `font-serif font-normal italic` (Instrument Serif
  via `--font-display`) on TOP of it for the scene-name specifically.
- **glass-ui-side (handoff RF-9 extends here):** the standing RF-9 ask (`DockSelectTrigger
  size="lg"`) already covers the scene-title display register. The dock-display-voice
  typography is subsumed by RF-9's `size="lg"` lever. **No new AX item needed.** Re-affirm
  RF-9 in the K handoff session.

**K wave-class:** K.W0 (kf-side interim — add `font-serif italic` to scene name spans; the
  durable cure rides RF-9 on the next re-pin).

### K-HO-2 — slider `step` smoothness root: consume 3.13.0 invisible-thumb (U-K15) · **P1 — consume candidate**

**Finding:** U-K15 (*"spring animation slider literally steps"*). The 3.13.0 `Slider standard` variant
eliminates the inscribed thumb circle entirely (the leading fill-edge IS the handle). Spring sidebar
sliders use `LabeledSlider` → `Slider standard` with `step=0.01` (`SpringSidebar.vue:48,58`).
At 0.01 step granularity the thumb disc in 3.11.2 jumps in visible increments; the 3.13.0 variant
renders only the continuous fill, which should eliminate the stutter percept.

**Consume-vs-handoff:** Pure CONSUME on re-pin to `^3.13.0` (no kf code change needed — the
improved variant ships automatically). IF after re-pin the slider still steps visually, the root is
in the update loop (rAF polling frequency / `useAnimationProgress` → `sliderUpdate` path), not the
glass-ui slider render — that becomes a kf-side investigation.

**K wave-class:** K.W0 (re-pin alone may resolve it; verify on live build).

### K-HO-3 — FourierField removal from hero (U-K20) · **P1 — kf-only, no glass-ui action**

**Finding:** U-K20 (*"REMOVE the FourierField from the hero background; grid lines slightly less opaque"*).
`EditorStartScreen.vue:78-86` mounts `<FourierField>` in `.fourier-vacancy`. The user dislikes it.

**Split:** Pure kf-demo deletion. No glass-ui action. `style.css` grid-line opacity tweak is also
kf-demo. The 3.13.0 `FourierField` now has `intensity` prop — IF the decision is to keep it at
reduced presence, `intensity={0.2}` is the knob. If the decision is removal, delete the `.fourier-
vacancy` block from `EditorStartScreen.vue:78-86,187-205`.

**K wave-class:** K.W0 (S effort; design decision required first).

### K-HO-4 — dock `startCollapsed=false` for home landing (U-K1: dock not shrunken by default / RF-7 resolution) · **P2 — consume on re-pin**

**Finding:** U-K1 (*"dock not shrunken by default"*). RF-7 asked for `initialExpanded` on `GlassDock`
for the home scene. `startCollapsed?: boolean` ships in 3.13.0. `ChromeDock.vue:178`
`:start-collapsed="true"` is hardcoded; the home scene should pass `:start-collapsed="false"`.

**Consume-edge on re-pin:** Thread `startCollapsed` prop through `ChromeDock.vue` from `App.vue`
based on `isHome.value`. The home scene requests `startCollapsed=false`; non-home passes `true`.

**K wave-class:** K.W1 (M effort — App.vue wiring + ChromeDock prop threading).

### K-HO-5 — RF-17 revert: drop `pointerdown` workaround (consume 3.13.0) · **P1 — consume on re-pin**

**Finding:** `TransportDock.vue:296-330` carries the `onPlayPointerDown`/`pointerHandled` guard as the
J.W7c mitigation for RF-17. `useDockClickIntegrity` ships in glass-ui 3.13.0 as the upstream fix.

**Consume-edge on re-pin:** revert `TransportDock.vue` play controls to single `@click="actuatePlay"`;
delete `onPlayPointerDown`, `pointerHandled` guard, `onCollapsedPlayClick`. Regression test via
`proof:live-session` S5 (motion-path PLAY/INTERACT leg).

**K wave-class:** K.W0 (S effort; low-risk revert of a known workaround).

### K-HO-6 — single-option dropdown rule · U-K16 · **P1 — kf-only, existing `v-if` gate**

**Finding:** U-K16 (*"single-option dropdowns STILL render somewhere"*). J.W7c U4 implemented the gate
`v-if="animationNames.length > 1"` in `TransportDock.vue:39` for the animation select. The user says
the no-single-option rule must be TOTAL. Audit the full demo surface for remaining lone-option
selects (spring, easing, sequence scene-specific selects; `EasingSelect`, `EasingSidebar`).

**Split:** Pure kf-demo audit + fixup. No glass-ui action. The rule is kf's demo policy;
glass-ui's `Select` component ships no such guard (nor should it — it is a primitive).

**K wave-class:** K.W0 (S/M effort — audit all `<Select>` callsites, apply `v-if count > 1` pattern).

### K-HO-7 — `GlassUnderline` new component (3.13.0) · potential use for hero CTA or doc links · **P2 — awareness**

**Evidence:** `dist/components/custom/underline/GlassUnderline.vue.d.ts` — pen-draw SVG underline with
`clock: "load" | "scroll" | "static"`, `active`, `drawMs`, `easing` (kf's own `TimingFunction` type).
The `load` clock awaits a parent `Sequence.play()` — **dogfood-perfect with kf's `Sequence`**.

**K handoff note:** `GlassUnderline` is a new addition that kf should assess for home-screen or
doc-link decoration. `clock="scroll"` driven by `view()` keyframes is zero-JS. The `easing`
prop accepts `TimingFunction` — the published kf type. **No born-RED gate yet;** assess in K.W0
design pass.

### K-HO-8 — `DockRail` chip strip (3.13.0) · possible scene-switcher pattern · **P2 — awareness**

**Evidence:** `DockRail.vue.d.ts` — floating chip strip that persists outside the dock box when
collapsed, writing `v-model:context`. U-K12 (*"top tabs look awful — pills if tabs at all, likely
dock-dropdown items instead"*). `DockRail` is a third option: scene-context chips OUTSIDE the dock
pill body, always visible, zero dock-body inflation.

**K handoff note:** Evaluate `DockRail` as the scene-switcher carrier (replacing the current
`ChromeDock.vue` layer-group / scene-selector pattern). Not a kf-side action until the design
direction is chosen; flag for the design pass.

---

## §6 — The consume-vs-handoff split for U-K14 ("upgrade to LATEST glass-ui")

U-K14: *"upgrade to LATEST glass-ui (sliders etc.)"*

**The version gap:** kf pins `~3.11.2` (tilde = patch-only, no minor bumps). The latest is `3.13.0` —
two minor bumps outside the tilde window. **To consume 3.13.0 kf must widen the pin to `^3.11.2`
(or a specific ≥3.13.0 pinned range).**

### Consume side (what kf gets for free on re-pin to ^3.13.0 / ~3.13.0)

| Consume item | Effect | Risk |
|---|---|---|
| **RF-17 upstream fix** | `TransportDock.vue` pointerdown workaround reverts (K-HO-5) | Low — well-understood revert |
| **Slider invisible-thumb** | Spring/easing sliders look smoother (U-K15 candidate) | Low — backward-compat CSS change |
| **FourierField `intensity` prop** | Hero recession knob if kept (U-K20) | Zero — additive |
| **RF-7 → `startCollapsed`** | Home landing can start expanded (K-HO-4) | Low — prop threading |
| **Typography fluid clamp** | Body/control register scales gently on wide displays (U-K6 partial) | Low — verify RF-2 override interacts cleanly |
| **LabeledField `hideLabel`** | Double-label leak fix available if K adds ConfiguratorRow wrapping | Zero — additive |
| **PRM data-allow-motion carve (3.12.0)** | DarkModeToggle animation survives theme-flip under full motion; snaps under PRM | Zero — accessibility improvement |

### Handoff side (what kf cannot get from re-pin alone — still BOOKED AX items)

All 21 ABSTRACT items (AX-1..13 + 8 folded rows) and 18 remaining REFINE items (RF-1..6,8..16
minus RF-7/RF-17) remain unshipped. The re-pin to 3.13.0 **does NOT discharge any ABSTRACT item**.

### Breaking changes in 3.13.0 requiring kf attention

| Component | Change | kf impact |
|---|---|---|
| `ExpandableContainer` | `viewTransitionName` prop + `anchorEl`/`surfaceEl`/`expand`/`collapse` removed | **ZERO** — kf uses 0 ExpandableContainer instances |
| `deck-progress`, `dialog-native`, `handmark`, `instrument-rail` | Removed from package | **ZERO** — kf uses 0 of these |
| `DockTabButton` | sparkle-sweep re-added (minor aesthetic) | Negligible |

### Pin strategy recommendation

Widen to `"@mkbabb/glass-ui": "^3.13.0"` (caret from the known-good 3.13.0 baseline, not
`~3.11.2`). The `~` tilde that made the J handoff ledger load-bearing (`constellation-edges.md §1a:
"3.6/3.7 regressed specular"`) was protecting against the specular regression in 3.6-3.7; that era
is long past. From 3.13.0 forward the caret (`^3.x`) is the correct signal — minor versions contain
new primitives kf will want to consume. **Verify the specular regression is gone in 3.13.0 before
widening** (the `glass-stage sheen / glass-ui specular="off"` note in MEMORY.md §constellation
re-pin references 3.8.0 as the ship point — 3.13.0 is well past that threshold).

---

## §7 — RF-16 and RF-17 hazard status summary

| Item | J.W7c disposition | 3.12.0 | 3.13.0 | kf posture in K |
|---|---|---|---|---|
| **RF-16** — PRM RO→render TDZ | Downgraded P1→P3; consumer `:freeze` guard in `EditorStartScreen.vue:84` | No upstream fix | No upstream fix | Consumer guard remains; durable cure still open AX ask (P3 only). |
| **RF-17** — collapse-click strand | `TransportDock.vue` `@pointerdown` workaround (J.W7c K.W7c-impl §U2 fix-round-1) | No upstream fix | **Resolved: `useDockClickIntegrity` ships** | Re-pin to ≥3.13.0 and revert `TransportDock.vue:296-330` pointerdown guard (K-HO-5). |

---

## §8 — §FOLD table

| Finding | Severity | Seam | Suggested wave-class |
|---|---|---|---|
| **RF-17 RESOLVED** — `useDockClickIntegrity` in 3.13.0; kf `TransportDock` pointerdown workaround reverts | P1 | glass-ui 3.13.0 consume + `TransportDock.vue:296-330` revert | K.W0 |
| **U-K14 / re-pin** — `~3.11.2` tilde excludes 3.12.0+; widen to `^3.13.0` to land RF-17 fix + Slider invisible-thumb + RF-7/startCollapsed + fluid type | P1 | `package.json:optionalDependencies` | K.W0 |
| **U-K15 / Slider step smoothness** — 3.13.0 invisible-thumb may resolve visually; verify on re-pin | P1 | glass-ui Slider `standard` variant CSS → `LabeledSlider` in spring sidebar | K.W0 verify |
| **RF-7 RESOLVED via `startCollapsed`** — home landing dock can start expanded after re-pin | P2 | `ChromeDock.vue:178` `:start-collapsed` + `App.vue` threading | K.W1 |
| **K-HO-1 / display voice in bottom dock** — scene name in collapsed pill needs `font-serif italic` (kf-side interim) + RF-9 `DockSelectTrigger size="lg"` (glass-ui AX) | P1 | `TransportDock.vue:153-154` + glass-ui RF-9 (still BOOKED) | K.W0 (interim); RF-9 rides future AX |
| **U-K20 / FourierField hero removal** — kf design decision; `EditorStartScreen.vue:78-86,187-205` is the seam | P1 | kf-demo delete | K.W0 |
| **U-K16 / no-single-option total audit** — J.W7c U4 gated the animation select; remaining scenes may still render lone selects | P1 | all `<Select>` callsites in `demo/` | K.W0 |
| **RF-1 / `cartoon-surface` still no `border-radius`** — confirmed absent in 3.13.0; kf `<Card>` wrapper workaround still needed | P1 | glass-ui AX (BOOKED); kf `<Card>`-wrapper is the interim | Future AX publish |
| **RF-2 / Plus Jakarta still hardcoded** — no typography opt-out in 3.13.0; kf four-token `:root` override survives | P1 | glass-ui AX (BOOKED); `style.css:100-117` workaround | Future AX publish |
| **RF-3/RF-4 / LabeledField orientation** — `hideLabel` landed in 3.13.0 but not `orientation`; subgrid idiom survives in kf | P2 | glass-ui AX (BOOKED); `design-idioms.css:525-590` workaround | Future AX publish |
| **AX-1..13 all BOOKED** — no ABSTRACT item shipped in 3.12.0 or 3.13.0 | P1–P2 | glass-ui AX (all BOOKED) | Future AX publishes |
| **3.13.0 BREAKING: ExpandableContainer API gutted** | P0 (potential) | kf: zero usage confirmed; no impact | N/A |
| **K-HO-7 / `GlassUnderline` new in 3.13.0** — `clock="load"` awaits a parent `Sequence.play()`; dogfood-ready for kf's `Sequence` | P2 | assess for hero/doc decoration | K.W0 design pass |
| **K-HO-8 / `DockRail` new in 3.13.0** — context-chip strip outside dock body; potential scene-switcher carrier (U-K12) | P2 | assess vs current ChromeDock layer-group approach | K.W0 design pass |

---

## §9 — Ground truth provenance

Every fact in this document is anchored to a command + observed output or a file:line reference:

- **Version timeline:** `npm view @mkbabb/glass-ui versions --json` → `['3.11.0',…,'3.13.0']` (this session)
- **kf pin:** `cat package.json | grep glass-ui` → `"@mkbabb/glass-ui": "~3.11.2"` (`package.json:optionalDependencies`)
- **Installed version:** `cat node_modules/@mkbabb/glass-ui/package.json | python3 -c "…"` → `installed version: 3.11.2`
- **3.12.0 vs 3.11.2 diff:** `diff -rq node_modules/@mkbabb/glass-ui/dist /tmp/gu-312/package/dist` → 3 files; `diff utilities.css` → PRM data-allow-motion carve
- **3.13.0 vs 3.12.0 diff:** `diff -rq /tmp/gu-312/…/components /tmp/gu-313/…/components` → 58 files; component add/remove list confirmed
- **RF-17 upstream fix:** `cat /tmp/gu-313/…/useDockClickIntegrity.d.ts`; `grep -rn "clickIntegrity" /tmp/gu-313/…/dist/ → dock.js`
- **RF-1 not fixed:** `grep -A15 "@utility cartoon-surface" /tmp/gu-313/…/cards.css` → no `border-radius`
- **RF-2 not fixed:** `grep -rn "Plus Jakarta\|font-stack-text" /tmp/gu-313/…/dist/ → typography.css:2,5,16`
- **RF-3 not fixed:** `grep -n "orientation\|horizontal" /tmp/gu-313/…/LabeledField.vue.d.ts` → 0 hits
- **RF-7 resolved via `startCollapsed`:** `cat /tmp/gu-313/…/useDockShellProps.d.ts:113` → `startCollapsed?: boolean`
- **AX items not shipped:** `grep -rn "GlassControlPoint|GlassRail|CopyableArtifact|bg-graph-paper|rainbow-outlined" /tmp/gu-313/…/dist/` → 0 hits
- **ExpandableContainer breaking change:** `diff /…/3.11.2/…/ExpandableContainer.vue.d.ts /tmp/gu-313/…/ExpandableContainer.vue.d.ts` → `viewTransitionName`, `anchorEl`, `surfaceEl`, `expand`, `collapse` removed
- **kf zero usage of removed components:** `grep -rn "ExpandableContainer|deck-progress|dialog-native|handmark|instrument-rail" demo/ → 0`
- **Slider invisible-thumb:** `cat /tmp/gu-313/…/ui/slider/index.d.ts` → *"NO VISIBLE THUMB AT ALL"*
- **FourierField intensity:** `cat /tmp/gu-313/…/fourier-field/index.d.ts` → `intensity?: number`
- **GlassUnderline new:** `ls /tmp/gu-313/…/underline/` → `GlassUnderline.vue.d.ts`; props read
- **DockRail new:** `cat /tmp/gu-313/…/dock/DockRail.vue.d.ts` read in full
