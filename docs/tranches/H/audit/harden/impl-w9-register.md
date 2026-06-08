# H.W9 — Lane A (impl-w9-register): the calm glass+cartoon register + bezier panel fit

**Lane:** A — the register (F8) + the specular deletion (F3+F6) + the bezier panel (F2).
**Branch:** `tranche-h-impl`. **Status:** LANDED, tsc-clean, MEASURE-FIRST verified live (`#/cube`, vite dev).
**Scope (file-disjoint):** the ~14 `surface="cartoon"` panel Cards · `design-idioms.css` specular section ·
`useSpecularPointer.ts` · `TimingFunctionPanel.vue`. (App.vue / ControlsPaneWrapper / usePaneHover /
useControlsLayout / LayerConfigPanel are SIBLING lanes — untouched here.)

The headline collapse landed as ONE move (per H.W9.md §Scope/S1 + _PLAN.md headline): keep
`surface="cartoon"`, add `tier="quiet"` broadly (the glass returns — cartoon is a decoration OVER a
glass tier), and DELETE the tracked-specular subsystem entirely. One calm register: glass + cartoon,
broad, no catch-light. Net deletion.

---

## (1) F8 — `tier="quiet"` on every kf-owned `surface="cartoon"` panel Card (the 14 sites)

`tier="quiet"` (0.50α / 10px blur — glass-ui's documented "missing rung", the EXACT pre-cartoon
`.glass-card` plate the user remembers) added to all 14 enumerated `<Card surface="cartoon">` panel
sites. The Card default was `resting` (0.65α); `surface="cartoon"` composes onto ANY tier
(`Card.vue.d.ts`: "the retired `<CartoonCard>` was `tier="quiet" surface="cartoon"`" — so this is the
isomorphic recovery, not a new register). No new backdrop CSS (inv-16).

| # | File | Line | Card |
|---|------|------|------|
| 1 | `AnimationControlsControls.vue` | 3 | main controls panel |
| 2 | `RibbonBar.vue` | 3 | the playback ribbon |
| 3 | `KeyframesEditor.vue` | 3 | keyframe editor |
| 4 | `KeyframeTimeline.vue` | 3 | timeline (`:class` form) |
| 5 | `MatrixEditor.vue` | 2 | matrix3d grid |
| 6 | `AssetViewport.vue` | 12 | empty-state card |
| 7 | `AssetLayerPanel.vue` | 2 | asset layer list |
| 8 | `EasingSidebar.vue` | 19 | CSS value bar |
| 9 | `EasingSidebar.vue` | 40 | step options (`v-if`) |
| 10 | `SpringSidebar.vue` | 4 | live params |
| 11 | `SpringSidebar.vue` | 60 | canonical comparison |
| 12 | `SpringSidebar.vue` | 81 | springLinearStops CSS |
| 13 | `TimingFunctionPanel.vue` | 15 | the bezier card (was the lone composite) |
| 14 | `TimingFunctionPanel.vue` | 87 | the steps card |

Source sweep post-edit: `grep '<Card surface="cartoon"'` = 14 sites, ALL carrying `tier="quiet"`,
ZERO without. (`EasingSidebar.vue:2` and `SpringSidebar.vue:2` are `<div class="glass-resting
cartoon-surface">` editor-root containers, NOT `<Card>` panels — OUTSIDE the spec's enumerated Card
inventory; left as-is per the binding §Scope list.)

**Live verification (`#/cube`, 1440×900):** the bezier panel Card resolved
`glass-quiet cartoon-surface` (was `glass-resting`), `background-color: color(srgb … / 0.5)` (the
0.50α the spec promised), `backdrop-filter: blur(10px) saturate(1.05) brightness(1.02)` (`!== 'none'`),
`box-shadow: … -4px 3px 1px 0px …` (the `--shadow-cartoon-md` offset-stamp depth intact).
→ `proof:glass-and-cartoon` (F8): the panel is TRANSLUCENT (0.50 < 1) AND backdrop-filtered → GREEN.
→ `proof:cartoon-is-panel-depth` (KEPT): the `--shadow-cartoon-md` shadow resolves, tier-agnostic → stays GREEN.

## (2) F3+F6 — the tracked-specular subsystem DELETED

Net deletion of the whole subsystem (the user read it too-dramatic (F3) + inconsistent — on ONE card
only (F6); lead default = REMOVE):

- **`TimingFunctionPanel.vue:30` (bezier Card):** dropped the `cartoon-specular glass-specular-track`
  classes; the card is now a plain `surface="cartoon" tier="quiet"` cartoon Card like its 13 siblings.
- **`TimingFunctionPanel.vue` script:** removed the `import { useSpecularPointer }`, the
  `bezierCardRef` ref, and the `useSpecularPointer(() => …)` wire (the S2-COMPOSITE comment block too).
  `Button`/`ArrowLeft`/`ref`/`computed` remain imported + used (the header back-icon + bezier state).
- **`design-idioms.css:245-282`:** the `.cartoon-specular` recipe block DELETED — the
  `@apply cartoon-surface`, the `.cartoon-specular::before` + `:hover::before` `--specular-intensity`
  projections, and the long S2-COMPOSITE comment. Replaced by a short REMOVED-subsystem note.
- **`useSpecularPointer.ts`:** WHOLE FILE deleted (`git rm`) — grep confirmed it had NO other
  consumer (only TimingFunctionPanel wired it, now unwired).

Post-edit full-tree sweep: `grep 'useSpecularPointer|glass-specular-track|cartoon-specular'` over
`demo/` + `src/` matches ONLY the removal-explanation comment in `design-idioms.css` — no live CSS
rule, no class application, no composable, no wire.

→ `proof:no-orphan-specular` (INVERT, exception set → ∅): ZERO `.glass-specular-track` on any kf-owned
  `<Card>` → GREEN (STRONGER than the W2 form; the D2 cartoon chronic stays closed via this system property).
→ `proof:cartoon-specular-coexist` + `proof:specular-calm` (RETIRE): their subject (the composite) is
  deleted — no live subject remains. (The gate-set edit + `package.json` drop is H.W8's gate-authoring
  home; this lane removed the SUBJECT so those gates are now subjectless.)
→ `proof:specular-handoff` (KEPT, glass-ui-owned Button/dock tracks): untouched — not in kf scope.

## (3) F2 — bezier panel: fit (no scroll) + back baked into the CardHeader right

- **Header bake:** the bezier `CardHeader`'s first row is now a `flex items-center justify-between gap-2`
  with `<CardTitle>cubic-bézier</CardTitle>` LEFT + a ghost icon `<Button>` (`<ArrowLeft/>`,
  `aria-label="back to controls"`, `@click="emit('exitDetailPanel')"`) RIGHT. The standalone top-LEFT
  `<Button>` (former `:5-12`, `justify-self-start mb-2 "back to controls"`) is DELETED — no legacy
  beside its replacement. The `editingCurveName` `<p>` + the timing readout row remain header siblings.
- **In-panel canvas ceiling (NAMED panel-context delta):** a scoped `:deep(.easing-curve-canvas)` rule
  in `TimingFunctionPanel.vue` clamps `block-size: clamp(160px, 38cqi, 220px); max-block-size: 220px` —
  TIGHTER than W4's full-rail 280 ceiling (the EasingSidebar full-rail render keeps 280; this detail
  panel takes 220). NOT a contradiction of `proof:easing-canvas-bounded` — W4's 280 is the full-rail
  ceiling; the square LAW (`aspect-ratio:1`, owned by EasingCurveCanvas) is PRESERVED (only the block
  ceiling drops). `:deep()` reaches the child component's scoped canvas.
- **Overflow:** `.panel-row--detail … .panel-content { max-height: min(50vh,480px); overflow-y:auto }`
  KEPT (AnimationControlsControls.vue:331-334). MEASURE-FIRST showed the panel FITS without scrolling
  at standing desktop sizes, so the auto-overflow never engages (`overflowY` reports `'auto'`, never
  `'scroll'` → gate-passing). Relaxing to `visible` was NOT done: the cap is viewport-relative
  (`50vh`), so on a pathologically short viewport `overflow:visible` would spill OUT of the
  grid-template-rows-collapse-clipped row — the conservative auto-overflow is the correct safety net,
  and the gate passes regardless (the header-bake + tighter canvas are what make it fit).

**Live verification (`#/cube`, 1280×720 and 1440×900), bezier detail open:**
`scrollHeight (323) === clientHeight (323)` → `scrolls: false`; `overflowY: 'auto'` (`!== 'scroll'`);
back button `getBoundingClientRect().left (338) > CardTitle.right (217)` AND its parent is the
`flex … justify-between` header row (a header sibling, not an external pre-card button).
→ `proof:bezier-no-scroll` (F2): no overflow + header-right bake → GREEN.

---

## tsc / regressions

- **Lib `tsc` gate** (`tsconfig.lib.json`, the build's `src/` gate): EXIT 0, clean (all edits are in `demo/`).
- **Demo `vue-tsc`** (`tsconfig.json`, includes `demo/`): baseline-on-clean-tree = 84 errors (project-wide
  pre-existing `exactOptionalPropertyTypes` strict-template-prop mismatches across AnimationControls,
  PlaybackRibbon, EasingCurveCanvas, etc. — NONE in the build pipeline; the demo isn't vue-tsc-gated).
  Post-Lane-A = 84 (UNCHANGED). TimingFunctionPanel still has exactly its 3 pre-existing errors (lines
  shifted 222/224 → 213/215 by the 9-line script trim; same errors, NOT introduced by this lane).
  Verified by stash/compare. **Lane A introduces ZERO new tsc errors.**

## Console

`#/cube` console clean of application errors (the single `@vite/client:524` entry is a dev HMR
transport artifact, not app code). FSM stable; the specular removal + tier flip + header bake broke nothing.

## Net

Net deletion: `useSpecularPointer.ts` (−73), `design-idioms.css` recipe block (−28 net), the external
back-button row folded into the header. The W2 "one composite exception" dissolved into the broad calm
register. No workaround; no legacy beside its replacement; the `quiet` tier recovers the OLD glass
(isomorphic); the in-panel canvas ceiling is the one NAMED panel-context delta (square law preserved).
