# Tranche F — Audit: the IMPLEMENTED demo post-E.W11 (lane `a-demo-post-e`)

**Scope.** Audit `demo/**` AFTER E.W11 landed (the demo elevation wave: VT scene
nav, a11y uniformity, idiom r3, first-paint, CWV levers). The user's explicit ask
is usability / elegance / design-cogency. This lane owns the **structural +
usability-flow** axis — component architecture, line-count ceilings, the editing
UX, mobile/responsive, the scene set, onboarding/discoverability — and DEFERS the
design-token / typography / motion-choreography frontier to the paired lane
`r-demo-design-2026` (which owns the rail/ball idiom, hero typography, VT morph,
directional VT, fluid type). Read-only; **zero source changes** (tranche dev).

**Method.** Diffed the E demo-ux baseline (`docs/tranches/E/audit/sota/a-demo-ux.md`,
13 FOLD-E items) and the E close (`FINAL.md`, `audit/DELTA.md`) against the LIVE
code to establish which of the 13 actually landed in W11 and which are still open
— then audited for NEW structural residuals the E lanes did not raise. Grounded
every code claim at `file:line` (greps scoped to source dirs — note `demo/*/dist/`
build artifacts pollute naive greps; all claims below are source-only). SOTA
claims grounded on `modern-web-guidance` (Baseline-dated) + the live glass-ui dep.

---

## Headline

**E.W11 was a real, comprehensive elevation and the bulk of the E demo-ux ledger
genuinely landed** — verified, not asserted. Of the 13 FOLD-E items, **8 closed**
(CommandPalette deleted, VT scene-swap, timeline `role="slider"` keyboard,
visualizer `aria-hidden`, CopyButton `<button>`+live-region, demo-owned
`:focus-visible`, `.is-disabled`→`aria-disabled`, timeline diamond ≥24px hit pad,
the timeline-hover `<img>` alt). The component architecture is **clean: nothing
exceeds 350L** (largest is `EasingCurveCanvas.vue` at 349L), and the E.W1
encapsulation pass left **zero orphaned legacy entrypoints** — the old per-app
dirs (`cube/`, `spring/`, …) are now pure component libraries consumed by
`app/scenes/*`, not dead apps. **The demo is ~90% SOTA on this axis too.**

What remains is a **small, honest** residual set, and it is NOT a re-litigation
of W11 — it is the **two FOLD-E items E never closed** (the `contenteditable`
labeling E-UX-13; the playground half of the `<img>`-alt + handle a11y E-UX-8),
the **two E-booked-but-unbuilt** discoverability items (the start-screen first
gesture E-UX-9; the command palette E-UX-1 booked "as a follow-up"), the
**touch-target stragglers** the W11 diamond fix did not generalize (E-UX-11), and
**one genuinely-new structural gap the E lanes did not raise** — the demo is a
destructive keyframe/CSS editor with **no undo/redo**. None is a rebuild.

---

## §1 — The demo is a destructive editor with NO undo/redo `[MED — NEW, structural]`

**This is a NEW finding the E lanes did not raise.** The demo is a full keyframe +
CSS editor whose primary surfaces perform **irreversible destructive mutations**:

- "Clear all keyframes" — `KeyframeTimeline.vue:8-16` (a one-click wipe of the
  entire keyframe set).
- Remove a keyframe — `KeyframeCard.vue:15-19` (the `X`), `KeyframeTimeline.vue:62-69`,
  and the `Delete`-key shortcut `AnimationControlsGroup.vue:277`.
- Free-form CSS edits — the `contenteditable` `<pre>` (`KeyframeCard.vue:35-41`)
  and the Monaco editor (`CSSCodeEditor.vue`) both mutate the live animation on
  every keystroke (the W8 single-compile path).

**There is no undo anywhere.** Grep over `demo/@` + `demo/app` (source-only) for
`undo` / `redo` / `useRefHistory` / `useManualRefHistory` / `Mod+Z` returns
**zero** hits — the only matches are a CSS comment and `dist/` build artifacts.
A user who clears all keyframes, deletes the wrong frame, or mangles the CSS has
**no recovery** but to rebuild by hand. For an *editor* whose explicit purpose is
iterative experimentation, the absence of undo is the single largest
usability-flow gap remaining — larger than any individual a11y straggler, because
it gates the core loop (try → undo → try again).

**The seam is idiomatic and cheap.** The state is already centralized and
reactive: the timeline keyframes live in `useTimeline.ts` state, the CSS strings
in `useKeyframesEditor.ts`, both driving a single `buildAnimationFromTimeline` /
recompile. vueuse's `useRefHistory` / `useManualRefHistory` (already a dependency
— the demo uses `@vueuse/core` throughout, e.g. `AnimatedText.vue:21`) is the
idiomatic Vue-reactivity undo primitive: wrap the keyframe-state ref, capture on
commit (not per-keystroke — debounced, mirroring the existing
`useKeyframesEditor` debounce), and bind `Mod+Z`/`Mod+Shift+Z` through the
existing `registerShortcut` registry (`AnimationControlsGroup.vue:262-277`,
which already owns 19 shortcuts and has a free `Mod+Z` slot). This is additive,
not a rewrite.

- **Disposition.** **SHIP-in-F.** A scoped, debounced `useRefHistory` over the
  timeline-keyframe + CSS-string state, surfaced via `Mod+Z`/`Mod+Shift+Z` in the
  registry and (optionally) a visible undo/redo pair in the timeline toolbar
  (`KeyframeTimeline.vue:8-27`, next to clear/expand). Bound by the existing
  debounce so it captures commits, not keystrokes.
- **Isomorphism.** Purely additive — new shortcuts + new state-history ref; no
  change to any existing render or behavior path. The reactivity is already
  centralized, so this is a composable bind, not a refactor.
- **inv ε note.** Grounded: no `undo` token in source; the destructive ops cited
  at `file:line`; the state-centralization verified in `useTimeline.ts` /
  `useKeyframesEditor.ts` (per `demo/CLAUDE.md` and the timeline composable set).

---

## §2 — The contenteditable CSS pane is still unlabeled (E-UX-13 — booked, NEVER landed) `[MED]`

**E flagged this as FOLD-E and the E close did NOT land it.** `a-demo-ux.md`
E-UX-13 prescribed `role="textbox"` + `aria-multiline="true"` + `aria-label` for
the per-frame `contenteditable` CSS editor. Verified against the live code: the
`<pre contenteditable="true">` at **`KeyframeCard.vue:35-41`** STILL carries
**none** of these — it has `ref`, `@input`, `@keydown`, and class only:

```
35  <pre
36      ref="preEl"
37      @input="(e) => emit('updateCSS', (e.target as HTMLElement).innerText)"
38      @keydown="(e) => emit('keydown', e)"
39      class="hljs css p-2 min-h-32 cursor-text ... outline-none border-none relative"
40      contenteditable="true"
41  ><code>{{ formattedCSS }}</code></pre>
```

A screen reader announces this primary CSS-editing surface as generic editable
text with **no accessible name** — "CSS for keyframe N" is nowhere. The
`outline-none border-none` (line 39) compounds it: combined with the absence of a
`.focus-ring` class (the W11 keystone idiom at `design-idioms.css:141`, which this
pane does NOT consume), the keyboard-focused state of the editing surface is
**invisible**. The W11 a11y-uniformity pass reached the timeline and CopyButton
but **did not reach this `<pre>`** — confirmed: `FINAL.md` / `DELTA.md` never
mention `contenteditable`, `aria-multiline`, or the keyframe-card pane.

- **Disposition.** **SHIP-in-F.** Add `role="textbox"` `aria-multiline="true"`
  `:aria-label="`CSS for keyframe ${index}`"` to the `<pre>`, and apply the
  `.focus-ring` idiom (or restore a `:focus-visible` ring) so its focus state is
  visible. The `insertTabAtCursor` editing logic is already sound — this is
  semantics + focus-visibility only.
- **Isomorphism.** Pixel-isomorphic for the unfocused state; adds the AT name and
  a keyboard-focus ring (the latter a deliberate visibility improvement).
- **Forward note.** `demo/CLAUDE.md`'s own E-UX-13 longer-term suggestion —
  routing all CSS editing through the single Monaco wrapper — remains a valid
  consolidation BOOK, but the cheap correct fix is the three attributes above.

---

## §3 — The playground (asset-manager) a11y did NOT receive the W11 pass `[MED]`

**A11y consistency gap: W11 elevated `app/scenes` but the playground lagged.**
The W11 a11y-uniformity pass reached the timeline/visualizer/copy surfaces in the
main app, but the **playground asset-manager** (`demo/playground/` + the shared
`asset-manager/` components) shows the same patterns W11 fixed elsewhere, still
un-fixed:

1. **The asset `<img>` has no `alt` — the un-landed half of E-UX-8.** W11 added
   `alt` to the timeline hover preview (`TimelineHoverPreview.vue:8`, verified
   present) but the **user-content asset image at `AssetViewport.vue:58-63`** has
   **no `alt`** (grep for `alt=` in `AssetViewport.vue` returns nothing). User
   content should carry a meaningful name (`:alt="asset.name"` or the asset
   label). E-UX-8 was thus only half-closed.
2. **The transform handles are pointer-only interactive `<div>`s** —
   `AssetViewport.vue:73-93`: the 8 resize handles (`w-2.5 h-2.5` = 10px) and the
   rotation handle (`w-3.5 h-3.5` = 14px) are bare `<div>`s with `@pointerdown`
   only — **no `role`, no `tabindex`, no keyboard**, and **far below** the WCAG
   2.2 24×24 target floor. This is the exact `<div>`-as-control pattern E-UX-3/4
   named, surviving in the playground because W11's sweep did not reach it. The
   asset itself (`AssetViewport.vue:39-46`) is also a drag-only `<div>`.

- **Disposition.** **SHIP-in-F** (the `<img>` alt — trivial, completes E-UX-8) +
  **BOOK** (the handle keyboard/role + ≥24px hit pad — the richer, lower-urgency
  part, mirroring the timeline-diamond `::before` pad recipe W11 already proved at
  `TimelineTrack.vue:228-238`). The handles are a secondary editing surface, so
  the alt is the SHIP and the keyboard path is the book.
- **Isomorphism.** Both additive / AT-only (the `::before` hit-pad is visually
  isomorphic, glyph unchanged — the same technique W11 used for the diamonds).
- **inv ε note.** The asymmetry is verified: `TimelineHoverPreview.vue:8` has
  `alt`; `AssetViewport.vue:58-63` does not — the W11 sweep landed in one and not
  the other. Recording so F's ledger reflects that E-UX-8 is half-open.

---

## §4 — The keyboard-shortcut system has NO visible discovery affordance `[MED — onboarding]`

**The demo has a rich 19-shortcut registry that a new user cannot find.** The
shortcuts are registered (`AnimationControlsGroup.vue:262-277`, plus the `?`
binding at `EditorShell.vue:117`) and surfaced through a real
`KeyboardShortcutsModal` (a reka `Dialog`, `KeyboardShortcutsModal.vue:2-5`). But
the **only** way to open that modal is the `?` keyboard shortcut
(`EditorShell.vue:117`) — there is **no visible button** anywhere that opens it
(grep confirms `shortcutsOpen` is toggled only by the `?` shortcut; no UI control
sets it). A first-time visitor has no way to learn that 19 shortcuts OR the help
modal exist: the discovery of the shortcut system is itself gated behind a
shortcut. This is the classic discoverability paradox.

This is **adjacent to E-UX-1** (the dead `CommandPalette` E correctly deleted, and
"booked a *real* palette as a follow-up E item" — which was never built; grep for
`Cmd+K`/`Mod+K`/`commandPalette` in source returns zero). The two together leave
the demo's deep keyboard surface effectively invisible.

- **Disposition.** **SHIP-in-F** (the minimal, high-value half): add a **visible
  affordance** that opens the shortcuts modal — e.g. a small `⌘?` / keyboard-icon
  button in the editor header (`EditorHeader` left/right slot) or the dock, wired
  to `shortcutsOpen`. The **SOTA idiom** for "a button declaratively opens a
  dialog" is now the **Invoker Commands API** (`modern-web-guidance`:
  `declarative-button-actions` — `commandfor` + `command="show-modal"`; Baseline
  Newly Available), but the demo already uses reka `Dialog` so a plain
  `@click="shortcutsOpen = true"` trigger button is the pragmatic landing; note
  the Invoker path as the forward feature-detected idiom. **BOOK** the full
  command-palette rebuild (E-UX-1's booked follow-up — `Mod+K` over the existing
  `useRegisteredShortcuts()` registry, which `KeyboardShortcutsModal.vue:55`
  already reads) — it is high-value but more than a button.
- **Isomorphism.** Additive — one new trigger control; no existing behavior
  changes. The `?` shortcut continues to work.

---

## §5 — Start-screen onboarding: the first gesture is still under-signposted (E-UX-9 — booked, NOT landed) `[LOW–MED]`

**E flagged this and W11 did not address it.** The Home overlay
(`EditorStartScreen.vue`) still reads **"Select an animation … from the list
below, then press Play."** (`EditorStartScreen.vue:48-52`) and is still
**`pointer-events-none`** (`EditorShell.vue:27`). Verified unchanged: the copy,
the non-interactivity, and the `<List>` icon cue (line 24) are as E-UX-9
described. The actual highest-value first action — per `app/App.vue` the Play
button navigates Home→a scene and auto-plays — is the **least** signposted; the
copy points at a "list below" the newcomer has not yet located.

This is **distinct** from the paired lane's hero finding (`r-demo-design-2026 §2`,
which owns the AnimatedText typographic + AT-name substrate). My axis is the
**onboarding flow**: the overlay points at a secondary affordance, not the primary
one, and offers no cue toward the Play control or the dock scene-picker.

- **Disposition.** **BOOK** (a UX-copy + cue pass — low code, high first-impression
  value). Point the copy/cue at the primary affordance (Play, or the cube-as-hero),
  not the secondary list. Pairs naturally with §4's visible help affordance as a
  combined "onboarding cogency" fold.
- **Isomorphism.** Copy/cue change — befitting, not a behavior change.

---

## §6 — Touch-target stragglers the W11 diamond fix did not generalize (E-UX-11 — partial) `[LOW]`

**W11 fixed the most-impactful target but not the family.** The W11 sweep added a
≥24px invisible `::before` hit pad to the collapsed timeline diamonds
(`TimelineTrack.vue:228-238`, verified — the highest-impact E-UX-11 item, landed).
But the **icon-button stragglers E-UX-11 also named are unchanged**: the timeline
clear/expand buttons are still **`h-7 w-7`** (28px — `KeyframeTimeline.vue:11,22`)
and the remove-keyframe button **`h-6 w-6`** (24px — `KeyframeTimeline.vue:64`),
the keyframe-card remove `X` and CopyButton are **`w-6 h-6`** (24px —
`KeyframeCard.vue:17,20`). 24px sits exactly on the WCAG 2.2 SC 2.5.8 floor but
well below the comfortable 44×44 (AAA 2.5.5); 28px is fine.

- **Disposition.** **BOOK** (low urgency — the diamonds, the primary mobile drag
  handles, are fixed; these are secondary icon buttons at-or-above the minimum
  floor). If folded: enlarge the interactive box via transparent padding (glyph
  unchanged) on the `h-6 w-6` buttons toward ≥44px, reusing the proven `::before`
  technique. Not a SHIP — it is polish on already-conformant controls.
- **Isomorphism.** Hit-area enlargement via transparent padding is visually
  isomorphic.

---

## §7 — Where the post-E demo structure is ALREADY-SOTA (verified — manufacture NO work)

These are confirmed exemplary on the structural/usability axis; calling them gaps
would be manufactured work:

- **The component architecture is clean and under ceiling.** Largest unit is
  `EasingCurveCanvas.vue` at **349L**; nothing exceeds 350L. The W4-raised 950L
  ceiling (engine) is irrelevant here — no demo component approaches it. The
  brief's "any new >350L units post-E?" answer is **NO**. The control suite is
  decomposed by concern (`animation-controls/{controls,keyframes,timeline}/`,
  `animationStores/` as a barrel split, the composable-per-surface pattern) — the
  E.W1 encapsulation discipline holds.
- **No legacy orphans.** The old per-app dirs (`cube/`, `square/`, `spring/`,
  `easing/`, `amiga/`) carry **zero** `App.vue`/`main.ts`/`index.html` entrypoints
  (verified) — they are now pure component/composable libraries imported by
  `app/scenes/*Scene.vue` (e.g. `CubeScene.vue:37,41` imports `CubeTarget.vue` +
  `useCubeAnimations` from `../../cube/`). The unified host is `demo/app/` + the
  standalone `demo/playground/`; only those two have `index.html` and only those
  two are vite roots (`vite.config.ts:235,352`). The E.W1 unification was clean —
  no `no-legacy` debt.
- **The scene set is complete and self-documenting.** Six scenes (`Cube`,
  `Square`, `Easing`, `Spring`, `Amiga`, `StartingStyle` —
  `demo/app/scenes/`), each a focused teaching artifact; the W11-added
  `StartingStyle` scene dog-foods the `@starting-style`/`allow-discrete` platform
  frontier driven by a keyframes.js spring (verified by the paired lane). No scene
  is redundant; the set spans CSS-3D, custom-transform, easing, spring, WebGL, and
  discrete-transition — a genuinely broad capability map.
- **The W11 a11y bulk genuinely landed** — re-verified at `file:line`:
  `CommandPalette` deleted (E-UX-1 base); VT scene-swap correct
  (`useSceneTransition.ts`, wraps only the sync mutation); timeline `role="slider"`
  + keyboard (`TimelineTrack.vue:74-82`, E-UX-3); visualizer `aria-hidden`
  (`AnimationVisualizer.vue:7`, E-UX-4); CopyButton `<button>` + `role="status"`
  live region (`CopyButton.vue:2-15`, E-UX-5); demo-owned `:focus-visible`
  (`design-idioms.css:125-142`, E-UX-7); timeline-hover `<img>` alt
  (`TimelineHoverPreview.vue:8`, E-UX-8 half); the ≥24px diamond hit pad
  (`TimelineTrack.vue:228-238`, E-UX-11 primary). The E demo-ux ledger is **~62%
  discharged** (8 of 13), and the demo is structurally sound.
- **The shortcut registry itself is SOTA** — a singleton `createGlobalState`
  registry, single window listener, `Mod`-alias, editable-target skip, grouped +
  labeled (`AnimationControlsGroup.vue:262-277`). The gap (§4) is *discovery*, not
  the registry.

---

## Disposition summary

| # | Finding | Sev | Disposition | E-baseline status |
|---|---------|-----|-------------|-------------------|
| 1 | Destructive editor with NO undo/redo (`useRefHistory` seam open) | MED | **SHIP-in-F** | NEW (E lanes did not raise) |
| 2 | `contenteditable` CSS pane unlabeled + no focus ring (`KeyframeCard.vue:35-41`) | MED | **SHIP-in-F** | E-UX-13 booked, **never landed** |
| 3a | Playground asset `<img>` no `alt` (`AssetViewport.vue:58-63`) | MED | **SHIP-in-F** | E-UX-8 **half-open** |
| 3b | Playground transform handles pointer-only `<div>`s, <24px | MED | **BOOK** | E-UX-3/4 pattern, W11 didn't reach playground |
| 4 | Shortcut system has NO visible discovery affordance (`?`-only) | MED | **SHIP-in-F** (visible trigger) + **BOOK** (`Mod+K` palette) | E-UX-1 palette booked, **never built** |
| 5 | Start-screen first gesture under-signposted (`EditorStartScreen.vue:48-52`) | LOW–MED | **BOOK** (copy/cue pass) | E-UX-9 booked, **not landed** |
| 6 | Icon-button touch targets at-floor not comfortable (`KeyframeTimeline.vue`) | LOW | **BOOK** | E-UX-11 **partial** (diamonds fixed) |
| 7 | Architecture clean / no-legacy / scenes complete / W11 bulk landed | — | **RECORD** (already-SOTA) | verified exemplary |

**value.js hand-offs: NONE in this lane.** The demo's structural/usability gaps
are demo-DOM / demo-composable / demo-CSS concerns; no value.js touchpoint surfaced
a value.js-side issue from this read (the same null result the E demo-ux lane
reached). The §1 undo seam consumes **vueuse** (`useRefHistory`), already a demo
dep — not value.js.

**The one-paragraph thesis.** E.W11 was the real elevation it claimed: the
component architecture is clean (nothing >350L, no legacy orphans), the scene set
is complete, and 8 of the 13 E demo-ux items genuinely landed. F's demo
structural/usability residual is small and honest — **add undo/redo to the
destructive editor** (§1, the one NEW structural SHIP that gates the core
try-edit-undo loop), **finish the two FOLD-E items E never landed** (the
`contenteditable` labeling §2 and the playground `<img>` alt §3a — the two real
correctness SHIPs), and **make the rich shortcut system discoverable** (§4, a
visible trigger SHIP + the booked `Mod+K` palette). The rest is books on
already-conformant surfaces. Paired with `r-demo-design-2026`'s design-token
residual (rail/ball idiom, hero typography), the combined F demo band is a focused
finishing pass — the same disciplined system extended to the surfaces W11 reached
only partway, NOT a rebuild.
