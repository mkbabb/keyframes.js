# R2-01 — Visual Design Proportionality RE-FLIGHT (owner's design lens, unblocked)

**Lane:** R2-01 · **Prefix:** DP2- · **Date:** 2026-07-17 · **Tree:** audit copy (`kf-audit-copy`,
fresh Glass `e7da7b5c` = glass-ui 7.0.0, App.vue AUDIT-PROBE `TooltipProvider` patch applied) · dev
server `http://localhost:5198` (pre-live, reused; not started/killed by this lane).

## Verdict

R1-14's audit was **fully blocked** by the FAM-02 render crash (blank on all 7 routes). With the
audit copy's root-`TooltipProvider` patch the demo **renders on every route at both viewports**, so this
re-flight delivers the design pass R1 could not: 28 captures on disk (7 routes × {desktop-default,
mobile-default} + 6 desktop-controls + 6 mobile-controls + 4 desktop-dark), all nonzero. **The demo's
design system is fundamentally sound** — the spacing is genuinely tokenized (R1's one positive holds),
glass-ui primitives suffuse the UI (Select/Dock/HeaderRibbon/Slider/Card/Tabs/Aurora are all real glass),
dark mode is clean and legible, and — critically for the FAM-01 watchlist — **there is NO black slab / no
occlusion at either viewport** (`bigBlack=0` live), the HeaderRibbon is **actionable on the first frame**
(3 live triggers), and the mobile bottom-sheet keeps the subject visible with no occlusion.

The re-flight nonetheless surfaces defects R1 never reached because the app didn't run: (1) a **Glass-7
API-drift residue live in the DOM** — HeaderRibbon renders a stray `mode="persistent"` attribute (the
XR-4/FAM-01 consumer edit is unapplied, now confirmed at the DOM level, not just source); (2) **CopyButton's
copy-feedback animation is broken** on a removed easing name (`"bounceInEase"`), throwing a `pageerror` on
mount of every copy button; (3) a broader **live console/pageerror flock** (a second `AnimationOptionError`
variant, `Invalid watch source` warns, `CopyButton` mounted-hook failures, one 404) that console-error-keyed
gates partly miss — the DP-03 blind-spot, now populated with real entries. The pure-design findings are all
**P3 polish**: a select-trigger label collapses two fields into `ease-in-outslow start & end`, one card
carries a ~130px dead whitespace band, transport/play is duplicated on subject/editor scenes, and the spring
physics sliders read louder than the rest of the slider family. Nothing here is transaction-blocking on its
own; the P2s are the Glass-7 drift and the live-error hygiene.

Captures: `docs/tranches/V/audit/design-captures/` (28 PNGs, all verified nonzero, 44–592 KB).

---

## DP2-01 — HeaderRibbon renders a stray `mode="persistent"` attr; Glass-7 dropped the prop (P2)

**Severity:** P2 · **Family:** glass-root (FAM-01 RAIL) · cross-ref XR-4

**Evidence.** `demo/components/instrument/shell/EditorShell.vue:16` still passes
`<HeaderRibbon ref="headerRibbonRef" mode="persistent" placement="right">`. Under Glass-7 the `mode` prop
was removed, so it now falls through to the root element as a raw HTML attribute. Live DOM probe on
`/#/easing` (`scratchpad/dom.mjs`): `document.querySelectorAll('[mode]')` → **`["DIV.header-ribbon"]`** — the
ribbon's root `<div>` carries a literal `mode="persistent"` attribute. `placement` by contrast is consumed
cleanly (`[placement]` extraneous set → `[]`). This is the R1 XR-4 "drop `mode=`" consumer edit, **confirmed
unapplied at runtime** (R1 only cited it from source; the delta here is the live DOM attribute).

**Design consequence.** Benign at paint (an unknown attribute on a div renders nothing), but it is the
live fingerprint that the Glass-7 consume edge is incomplete: a prop the demo believes it is setting is
silently inert. `defineExpose({ headerRibbonRef })` at `EditorShell.vue:197` is the paired XR-4 item.

**Disposition — FOLD into the FAM-01 Glass-7 consume wave.** Drop `mode="persistent"` at
`EditorShell.vue:16` (and reconcile `defineExpose`) as part of the single glass-consumer reconciliation;
do not patch Glass. No standalone wave.

---

## DP2-02 — CopyButton copy-feedback animation is dead (`timingFunction:"bounceInEase"` throws on mount) (P2)

**Severity:** P2 · **Family:** live-error (demo-owned) · AFFORD (dead feedback)

**Evidence.** `demo/components/CopyButton.vue:40-43` constructs the copy-pop feedback group with
`options = { duration: 200, timingFunction: "bounceInEase" }`, then in `onMounted` (line 65-93)
`new CSSKeyframesAnimation(options).fromString(...)`. Under the current kf engine `"bounceInEase"` is an
**unknown timing function** — the library throws
`AnimationOptionError: Invalid value for animation option "timingFunction": "bounceInEase" — unknown timing
function — pass a callable TimingFunction` (`src/animation/internal/errors.ts:66`). Live console on
`/#/easing`, `/#/spring`, `/#/sequence` (`scratchpad/console.mjs`):
```
PAGEERROR: AnimationOptionError: Invalid value for animation option "timingFunction": "bounceInEase" …
[Vue warn]: Unhandled error during execution of mounted hook  at <CopyButton class="literal-copy" …>
[Vue warn]: Unhandled error during execution of mounted hook  at <CopyButton class="h-6 w-6" text="0% {…}">
   … (repeats for every @keyframes-row copy button + the cubic-bezier copy button)
```
Because the mounted hook throws before `group.value` is assigned, `handleClick`'s `group.value?.play()`
(line 62) is a permanent no-op: **the copy button's scale-pop confirmation animation never plays** — the
affordance renders but its feedback is dead — and each mount emits a `pageerror`.

**Disposition — BUILD (small, demo-owned).** Replace `"bounceInEase"` at `CopyButton.vue:42` with a live
easing name or a callable `TimingFunction` (the error message prescribes the callable form). One-line fix
restoring the feedback pop and silencing the per-button pageerror. Coordinate with R2-08 (the removed/
renamed-easing catalogue) so the same dead name isn't reintroduced elsewhere.

---

## DP2-03 — Live console/pageerror flock surfaced by the unblock; partly invisible to console-error gates (P2)

**Severity:** P2 · **Family:** live-error / gate-blindspot · cross-ref DP-03, R2-04, R2-02

**Evidence.** With the app finally running, a first-frame console/pageerror set appears on nearly every
scene (`scratchpad/console.mjs`, deduped across `/`, `/#/cube`, `/#/amiga`, `/#/easing`, `/#/spring`):
- **`AnimationOptionError` — function variant** on cube/amiga/square: `Invalid value for animation option
  "timingFunction": [function anonymous] — a custom TimingFunction has no CSS animation representation`
  (a matrix-editor easing callable routed where a CSS name is expected; source
  `demo/scenes/cube/matrix-editor/useTransformState.ts:107` `timingFunction: easeInBounce`).
- **`[Vue warn]: Invalid watch source: {id:0..4 …} A watch source can only be a getter/effect function or a
  ref`** — repeated per animation row (a raw reactive object handed to `watch`).
- **`CopyButton` mounted-hook unhandled errors** (the DP2-02 mechanism, many instances).
- **One `error: Failed to load resource: … 404 (Not Found)`** — a missing asset (not root-caused here).

The `AnimationOptionError`s surface only via `pageerror`, **not** `console.error` — exactly the DP-03
blind-spot: a demo-smoke/observe gate keyed on "zero console.errors during mount" reports green while these
throw. R1 could not see any of this (the app was blank); the delta is that the unblock reveals a live,
non-fatal error surface the gates don't fully cover.

**Disposition — FOLD:** the render-time hygiene (fix the two `AnimationOptionError` sources + the
`Invalid watch source` misuse + the 404) belongs to R2-04/R2-02's P0/P1 verify + correctness sweep; the
gate side (make one runtime assert track `pageerror`, not only `console.error`) folds into the
gate-soundness wave (R2-07). This lane contributes the *observation* and the DP-03 confirmation, not the
root-cause fixes.

---

## DP2-04 — Easing-select trigger collapses name+description to `ease-in-outslow start & end` (P3)

**Severity:** P3 · **Family:** proportionality/legibility (demo-owned)

**Evidence.** On cube, amiga, and square (the scenes using the generic Controls options panel) the "easing"
select trigger reads **`ease-in-outslow start & end`** — the curve name (`ease-in-out`) and its description
(`slow start & end`) run together with no separator. Captures: `cube-desktop-default.png`,
`amiga-desktop-default.png`, `square-desktop-default.png` (the "easing" field, left panel). The dropdown
*items* are laid out correctly — `ChannelOptions.vue:246-270` puts name and description in separate spans
with `gap-1.5` / `ml-auto` — but the trigger uses glass-ui `<SelectValue placeholder="Pick a curve" />`
(`ChannelOptions.vue:219-222`), which projects the selected item's **raw `textContent`**, concatenating both
spans and dropping the flex layout. Data source: `demo/utils/reference-data/easingGroups.ts:35`
`item("ease-in-out", "slow start & end")`.

**Disposition — BUILD (small, demo-owned).** Give the trigger an explicit display (a `SelectValue` custom
slot that renders only `curveItem.name`, or name + a separated description), so the trigger no longer relies
on textContent concatenation. Not a Glass defect — the standard pattern is consumer-supplied trigger display.

---

## DP2-05 — Intra-card whitespace disproportion: easing PRESET card dead band (P3)

**Severity:** P3 · **Family:** proportionality (demo-owned)

**Evidence.** `easing-desktop-default.png`: the left "PRESET" card holds the preset select (~y118) and the
`cubic-bezier(…)` readout (~y178), then a **~130px empty vertical band** before "duration" (~y319) and its
slider (~y343). Against the tight, even rhythm of the right easing grid (consistent card gaps ~16px) and the
dense cube/amiga options card (6 evenly-spaced fields, `square-desktop-default.png`), this single card reads
as under-filled — the proportional scale that governs the rest of the panel breaks inside it. The paired
transport card below it is also a separate floating card rather than continuing the left column's rhythm.

**Disposition — WAVE (design polish).** Tighten the PRESET card's vertical distribution (or move the
duration control up to close the band) so the left column shares one spacing scale with the grid. Low
priority; cosmetic, single-card.

---

## DP2-06 — Transport/play affordance duplicated on subject/editor scenes; placement inconsistent (P3)

**Severity:** P3 · **Family:** superfluous-affordance (demo-owned)

**Evidence.** On cube, amiga, square, and easing the left column shows an **in-panel transport card**
(progress bar + `Play`/`Reverse` + scrubber — e.g. `cube-desktop-default.png` y≈460-640) **at the same time**
as the **bottom-center floating transport pill** (play triangle in a rainbow ring + scene dropdown + reset —
same capture, y≈713). Two `Play` controls drive one animation. On the storyboard scenes (spring, sequence)
there is **no** in-panel transport card — only the bottom pill (`spring-desktop-default.png`,
`sequence-desktop-default.png`). So the transport is both *duplicated* on one class of scenes and *placed
inconsistently* across classes.

**Disposition — WAVE (design).** Decide one transport home per scene class (the floating pill reads as the
global transport; the in-panel `Play`/`Reverse` is the redundant one on subject/editor scenes) and either
remove the duplicate or make the split intentional and consistent. Owner-taste call; flagged, not
prescribed.

---

## DP2-07 — Spring physics sliders render as solid orange lozenges, louder than the slider family (P3)

**Severity:** P3 · **Family:** proportionality/consistency (demo-owned) · NEEDS-CONFIRM

**Evidence.** `spring-desktop-default.png`: the "response" and "damping (ζ)" controls (top-left) paint as
**solid orange rounded bars**, visually heavier and off-palette against the purple/tan slider treatment used
everywhere else (the easing "duration" slider `easing-desktop-default.png`, and every transport scrubber
`cube`/`amiga`/`square`). Whether this is an intentional heatmap-linked accent (the panel is the spring
overshoot heatmap) or an inconsistent slider fill was not source-confirmed this pass.

**Disposition — WAVE (design polish), confirm first.** If not deliberately tied to the overshoot heatmap
semantics, bring these sliders onto the shared slider token so the physics panel matches the family. Verify
the source (`demo/scenes/spring/*`) before acting.

---

## Negatives (checked and found sound)

- **NO black slab / NO occlusion at either viewport.** Live DOM probe (`scratchpad/dom.mjs`) on `/#/easing`:
  zero elements >600×400 with near-opaque black background (`bigBlack=0`). Confirmed visually at 390×844 on
  every scene — the mobile bottom-sheet peeks with the subject/content visible above it
  (`cube-mobile-default.png`, `easing-mobile-default.png`). The FAM-01 occlusion watchlist item is clean.
- **HeaderRibbon actionable on first frame.** 3 live interactive triggers in the ribbon subtree
  (`ribbonTriggers=3`); the top-center ribbon pill (`Easing ⌄ | Curve ⌄ | @mbabb`, etc.) renders and is
  operable in every scene capture. `placement` prop consumed cleanly (no stray attr).
- **Dock collapsed = single icon-forward circle face; expanded = single bar.** Every collapsed capture shows
  one clean circular pill carrying only the scene glyph (`cube-mobile-default.png` top-center); the expanded
  ribbon shows one active face. No double-face / no clipped label.
- **Dark mode sound.** `easing-desktop-default-dark.png`, `spring/sequence` dark: translucent dark glass,
  legible text, purple accents intact, no black slab, no contrast collapse.
- **Glass-ui suffusion strong.** The audited surfaces use real glass primitives — `Select`/`SelectContent`,
  `GlassDock`/`DockControl`/`DockSeparator`, `HeaderRibbon`, `Slider`, `Card`/`Surface`, `Tabs`, `Aurora`,
  `StatusDot`, `Tooltip`, `DarkModeToggle` — enumerated against the fresh build's 65-export barrel
  (`node_modules/@mkbabb/glass-ui/package.json`). No ad-hoc reimplementation of an existing glass primitive
  found in the audited chrome.
- **Tokenized spacing (R1 negative holds).** R1-14's source finding — 1 ad-hoc px hit total, 0 arbitrary
  Tailwind px brackets — is unchanged; the live render corroborates an even, token-driven rhythm across the
  grid and cards.
- **Capture integrity.** All 28 declared PNGs exist nonzero (44–592 KB); no declared-but-missing capture.

## Coverage gaps

- **Controls-CLOSED state not cleanly captured.** `isControlsPanelOpen` **defaults `true`**
  (`demo/state/controlOptionsStore.ts:45`), so "default" captures already show the panel open (the
  controls-open requirement is satisfied). The *closed* state was not obtained: on desktop the collapsed dock
  does not render the "Open/Close controls" toggle at rest (it appears only on dock expand), so the toggle is
  an **invisible-at-rest control** (mild AFFORD note) and my automated toggle returned `no-open-btn`.
- **Mobile controls-open actuation via the dock failed.** Clicking `[aria-label="Open controls"]` at 390px
  timed out — the `dock-layer--summary is-active` collapsed layer intercepts pointer events until the dock
  fully expands (playwright: "…subtree intercepts pointer events"). This echoes the known glass dock
  double-click / collapsed-layer issue (memory `project_dock_doubleclick`, glass-root); could not confirm the
  mobile controls-open sheet this pass.
- **`home-desktop-default-dark.png` is mislabeled** — it shows the Sequence scene: navigating to bare `/`
  from a page already at `#/sequence` did not reset the hash route (hash-router behavior, not a demo defect).
  Dark mode is nonetheless verified on easing/spring/sequence dark captures.
- **Live-error root-causing handed off.** The two `AnimationOptionError` sources, the `Invalid watch source`
  warns, and the 404 are documented (DP2-02/DP2-03) but their fixes belong to R2-04 (P0/P1 verify) and
  R2-02 (amiga/compositor live verify); this lane owns the observation, not the repair.
