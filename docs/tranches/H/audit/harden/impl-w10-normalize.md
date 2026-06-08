# impl-w10-normalize — Lane B (scene normalization + stage + layout-primitive)

**Wave:** H.W10 (SHIP-in-H, corrective — the second user-feedback fold G1–G8).
**Lane:** B — the normalization gestalt (G2/G3/G4/G5/G6/G7/G8). File-disjoint from
Lane A (icons/G1: `demo/app/scenes.ts`, `assets/icons/*`). NO git commit. tsc-clean,
build-clean, console-clean.

## Files touched (all disjoint from Lane A's icon set)

| File | Items | Change |
|------|-------|--------|
| `demo/@/components/custom/animation-controls/AnimationControlsGroup.vue` | G8 | the `[stage]`-track containment PRIMITIVE — `.stage-cell` reserves the dock band |
| `demo/@/styles/design-idioms.css` | G8 | DELETE the `.dock-inset` utility (superseded by the primitive) |
| `demo/@/components/custom/animation-controls/controls/PlaybackRibbon.vue` | G7 | equalize the Reverse cell height (`h-8`→`h-10`) to match the Play cell |
| `demo/app/scenes/EasingScene.vue` | G3/G7 | mount the STANDARD `PlaybackRibbon` in the `ribbonContent` slot; delete the bespoke Play/Pause+Reset fork; deterministic easing-tab default |
| `demo/app/scenes/SpringScene.vue` | G3/G7 | STANDARD ribbon + KEEP the Re-seat / Reveal-Dismiss domain verbs; drop `dock-inset`; deterministic spring-tab default |
| `demo/easing/EasingTarget.vue` | G4/G8/G2 | the singular stage = ONE engine-driven hero ball; delete the duplicate `EasingCurveCanvas`; full-bleed (drop the bare cartoon card) |
| `demo/easing/EasingSidebar.vue` | G6/G5/G2 | flatten onto ONE `Card surface="cartoon" tier="quiet"` + `Labeled*` rows |
| `demo/easing/useEasingDemo.ts` | G3 | expose `contractAnim`; mirror the sweep onto its clock (the ribbon's time-twin) |
| `demo/spring/SpringTarget.vue` | G8/G2 | full-bleed (drop the bare cartoon card; drop `dock-inset`/`max-w-3xl` wrapper) |
| `demo/spring/StartingStyleTarget.vue` | G8/G2 | full-bleed |
| `demo/spring/SpringSidebar.vue` | G6/G5/G2 | flatten onto ONE quiet-cartoon Card + `LabeledSlider` rows; delete the ×3 inner Cards |
| `demo/spring/useSpringDemo.ts` | G3 | expose `contractAnim`; mirror the sweep onto its clock |
| `demo/motion-path/MotionPathTarget.vue`, `demo/sequence/SequenceTarget.vue` | G8 | remove the now-dangling `dock-inset` class (consequence of the deleted utility; they inherit the primitive's symmetric reserve) |

## G3 + G7 — the standard PlaybackRibbon (the spine)

**The architecture seam (verified MEASURE-FIRST).** The standard ribbon mounts via
two routes: (1) `AnimationControlsControls` teleports it into `#controls-ribbon-target`
when `selectedControl === 'controls'`; (2) the `ribbonContent` slot (the cube-extension
seam `RibbonBar.vue:96-101`) when `selectedControl !== 'controls'`. The easing/spring
scenes use a CUSTOM tab (`easing`/`spring`), so route (1) is unavailable — they consume
the FLOOR path the contract names: **mount `PlaybackRibbon` directly in the
`ribbonContent` slot.** This keeps the easing/spring DOMAIN sidebar (curve editor /
spring params) while making the PRIMARY transport byte-identical to cube's (it IS cube's
component).

**The time-twin.** The easing/spring motion is a light `NumericAnimation`/`SpringProgress`
sweep driving `demo.progress` — NOT the `contractAnim` (a transport-host
`CSSKeyframesAnimation` with no DOM target). `PlaybackRibbon`'s scrubber binds
`animation.options.duration`/`currentT` and its `AnimationVisualizer` reads
`animation.effectiveT/duration`. So a `watch(progress, p => contractAnim.t = p*duration)`
mirrors the sweep onto the contract clock — the visualizer ball + scrubber now track the
real sweep. The watch (not the rAF frame) avoids the `contractAnim` TDZ (the loop arms at
mount, before the `const` is declared). Transport emits route to the machine-backed
`demo.togglePlay`/`pause`/`play`; `toggleReverse` flips `contractAnim.reversed` so the
visualizer's `effectiveT` mirrors. **Reset is NOT a ribbon button** — the dock owns it
(de-duplicated per the contract); the ribbon is Play/**Reverse** (matches cube).

**Harden caveat honored.** `ribbonContent` is the standard scene-extension slot, NOT the
defect. Only the PRIMARY playback transport (Play/Pause+Reset) moved to the standard
ribbon. Spring's legitimate DOMAIN verbs REMAIN: solver view keeps **Re-seat** beside the
standard ribbon (the cube model — domain verb + standard transport); discrete view keeps
**Reveal/Dismiss** (a CSS-transition toggle, not a sweep — the standard sweep transport
doesn't apply there, so the domain verb is its primary control).

**G7 (equal dims) — fixed in the SHARED component (DRY).** Measured live: the standard
ribbon itself had a latent height mismatch — Play=`h-10` (40px, reka's default
out-specifies the unlayered `.btn-playback {height:2rem}`) vs Reverse=`h-8` (32px). This
is the standard component's defect, inherited by ALL scenes that mount it. Fixed ONCE in
`PlaybackRibbon.vue` (Reverse `h-8`→`h-10`) so both cells are 40px — equal width (the
`grid-cols-2` track) AND height (matched `h-10`), for cube/amiga/easing/spring alike. No
`!important`, no per-button magic number — the layout idiom + a matched height utility.
Verified live: both cells 148×40.

## G4 — the singular stage = ONE engine-driven hero ball

Deleted the duplicate stage `EasingCurveCanvas` (`EasingTarget.vue:47-59`). The `singular`
stage is now ONE large `.progress-ball` (the shared `.progress-rail`/`.progress-ball`
idiom, hero size 56px) whose x = `currentEasingFn(progress) * maxX` — the FLOOR path
(reusing the existing `getBallX` math at hero size; the curve in MOTION, the inv ζ
dogfood). The editable curve lives in the SIDEBAR only. Verified live: the ball traverses
(`translateX` 58→287px over 500ms tracking the eased curve), and ZERO `canvas`/
`EasingCurveCanvas` in the `.stage-cell` subtree. The comparison views (family/All) STAY
(genuinely additive — many curves at once).

## G6 + G5 — flatten the sidebars onto the normalized component

`EasingSidebar`/`SpringSidebar` are now ONE `Card surface="cartoon" tier="quiet"` (the H.W9
quiet register; the Card primitive carries `rounded-card` by construction — dissolves G2's
square corner) with `Labeled*` label-left rows (the H.W9 F1 row idiom, re-declared in the
component's scoped `:deep(.labeled-field)` grid since these sidebars are standalone, not
inside `AnimationControlsControls`). DELETED: the ×2 easing + ×3 spring inner sub-Cards,
the ad-hoc `grid grid-cols-2`/`grid gap-1` row containers, the `text-admin-label` labels,
the `size="sm"` sliders (→ `LabeledSlider`, default size — G5 lifts automatically). The
easing curve canvas stays the lone HERO; the spring preset CHIPS keep `size="sm"` (a
compact button cluster, not the control rung the G5 clause targets). Verified live:
easing card radius 16px, 2 labeled-fields, 0 `text-admin-label`, 0 inner sub-Cards; spring
card radius 16px, response + damping(ζ) `LabeledSlider` rows, 0 `text-admin-label`, 0 inner
sub-Cards. **NAMED H.W9 S1 amendment honored:** `tier="quiet"` set directly on the ONE
surviving parent Card per sidebar (the 5 doomed inner Cards demolished in the same motion —
no churn-then-delete).

## G8 + G2 — the stage layout-primitive + full-bleed (FORK A default: BOTH)

**The PRIMITIVE (no magic numbers).** `.stage-cell` (the `[stage]` grid track's cell, the
single dock-safe envelope for EVERY scene) now carries `box-sizing:border-box` +
`padding-block: var(--dock-band-reserve)` — the existing cycle-free token
(`dock-icon-height + dock-margin + safe-area-inset-bottom`). The top `ChromeDock` and
bottom `AnimationMenuBar` are `fixed` and overlay the work-area's centered top/bottom
edges; the stage subject is now inset clear of BOTH bands. Sits on `.stage-cell` (not the
`[top]`/`[bottom]` grid rows) so the expanded-timeline `[bottom]` row keeps its `auto`
growth. cube/amiga are unaffected (they center; no edge to clip). The per-scene
`.dock-inset` (bottom-only — so the top clipped) is DELETED from `design-idioms.css` + all
six callsites. Verified live: `.stage-cell` padding-block 52px; the easing hero ball / the
spring rail / the discrete card all sit BELOW the top dock's bottom edge (subj top
414/344 vs dock bottom 102) at 1440×900.

**FULL-BLEED (the surface consequence).** The easing/spring stage cards (the bare-class
`glass-resting cartoon-surface` div WITHOUT `rounded-card` — the literal G2 defect) are
DROPPED → the subject floats full-bleed like cube/amiga. Verified live: the only
`.cartoon-surface` left in the spring stage is the `spring-view-switch` segmented PILL
(`rounded-full`, radius non-zero — a legitimate rounded control, NOT the un-rounded card
defect). The easing stage has zero cards (full-bleed ball).

## The one regression caught + fixed (the tab-init race)

The heavier normalized sidebar (`Card` + `Labeled*` vs the former bare `<div>`) shifted the
slot-mount timing: reka's `<Tabs :model-value="selectedControl">` registers its built-in
`controls`/`keyframes`/`timeline` children before the slotted `easing`/`spring` TabsContent,
so when `selectedControl="easing"` is read at reka init BEFORE the slot registers, reka
falls back to its first tab (`controls`) and does not re-evaluate. At HEAD the bare div won
the race; the normalized sidebar lost it. Fixed deterministically: re-assert
`storedControls.selectedControl` in `onMounted` + `nextTick` (the "always default to the
Easing/Spring tab" intent, made order-independent — not a workaround, the scene's stated
default). Verified live (hard reload): the easing/spring tab is the sole active panel; the
normalized sidebar renders.

## Verification

- `npx tsc --noEmit` — clean (exit 0).
- `npm run gh-pages` — clean (`✓ built in 2.06s`, 4075 modules, no errors; pre-existing
  vueuse `#__PURE__` + chunk-size warnings only).
- Live (Playwright, 1440×900): easing — normalized sidebar (curve hero + value/ease/
  duration label-left rows, 16px radius), standard ribbon (scrubber + equal 148×40
  Pause/Reverse + visualizer), full-bleed moving hero ball, no stage canvas, contained.
  spring — both views; solver = standard ribbon + Re-seat, discrete = Dismiss; normalized
  sidebar (response/damping `LabeledSlider`, 16px radius, 0 inner Cards); full-bleed;
  contained. Console: 0 errors / 0 warnings across both scenes.

## Notes for the gate lane (H.W8 authors the born-RED gates)

- `proof:scene-uses-standard-ribbon` (G3/G7): the standard `PlaybackRibbon` lives in the
  `ribbonContent` slot (NOT `#controls-ribbon-target`) for easing/spring — measure inside
  `.controls-pane-wrapper`/`.controls-pane`, look for the `.timeline-green` scrubber +
  `.btn-playback` + `.bg-accent-red` visualizer. The two transport cells are 148×40 each
  (equal w AND h). Spring's Re-seat / Reveal-Dismiss domain verbs are PERMITTED in the slot
  (the cube model).
- `proof:easing-stage-is-ball` (G4): `.stage-cell .hero-ball` present, x tracks
  `fn(progress)` (sample two frames), ZERO `EasingCurveCanvas`/`canvas` in the `.stage-cell`
  subtree.
- `proof:scene-card-rounded` (G2): the only `cartoon-surface` in easing/spring stages is
  the spring view-switch pill (`rounded-full`); the stage subjects are full-bleed bg-less.
  The sidebars are glass-ui `<Card>` (16px `rounded-card`). NB the GENERAL clause would
  also bite `motion-path`/`sequence` (still bare-class cards) — those are OUT of the G8
  named scope; Lane B only removed their dangling `dock-inset`, it did NOT make them
  full-bleed (left for a follow-on if the gate generalizes).
- `proof:easing-sidebar-normalized` (G5/G6): label rung `text-mono-small` (0
  `text-admin-label`), 0 inner sub-Cards, every param row a `Labeled*`. The spring preset
  CHIPS keep `size="sm"` (a button cluster, not the control rung).
- `proof:stage-within-docks` (G8): subject `getBoundingClientRect().top` > top-dock bottom
  AND bottom < bottom-dock top; ZERO `dock-inset` class in the markup; the reserve is on
  `.stage-cell` (`padding-block: var(--dock-band-reserve)`).
