# Tranche H DEEP harden — lane `hd-feasibility`

**Charge:** cross-wave feasibility / reality check. For EVERY wave, enumerate every
external dependency the fix assumes (a glass-ui API/prop, a value.js feature, a kf method,
a CSS Baseline feature, a Tailwind v4 `@utility`, a vueuse helper) and VERIFY it exists by
reading `node_modules`, running `modern-web-guidance`, grepping kf source, or driving the
live demo. Produce the dependency-reality table → if a wave assumes a phantom API it is a
BLOCKER.

**Method (inv ε):** read glass-ui 3.4.0 / value.js 0.11.1 / parse-that 0.9.0 in
`node_modules`; grep kf `src/`+`demo/` on branch `tranche-h-dev`; ran `modern-web-guidance`
for the CSS-Baseline claims; drove the live demo at `http://localhost:5173` (the prompt's
`:5173`, NOT the docs' stale `:5174`) with the playwright MCP. Every row below is anchored.

**Bottom line:** NO phantom-API BLOCKER. The four highest-leverage dependencies
(`surface="cartoon"` + the cartoon-surface utility + the `--shadow-cartoon-*` tokens;
`serializeEasing`'s throw; the `glass-specular-track` seam + `--mouse-x` wire; the dock
`keepOpen`/`release`/`DockDropdownTrigger`/`HoverPopover` family; `SpringProgress`/
`NumericAnimation`/`ManualTimeline`/`fromMotionPath`; the `text-display-mega` rung) ALL
EXIST and were verified at the byte level. The two live crashes are LIVE-CONFIRMED on
:5173. The defects W2 charges are LIVE-CONFIRMED (5 specular hosts, 0 pointer-wired, 0
cartoon Cards). BUT four SUBSTANTIVE feasibility defects land (a fifth was drafted then RETRACTED on
re-grep — see HD-5): (1) a HIGH — the W1 `proof:no-route-storm` gate did NOT bite on a
passive idle load (did not reproduce → likely BORN-GREEN, not born-RED as the charter
asserts); (2) a HIGH — the W1/S5 popover prescription reaches for `keepOpen`/`release` as a
`v-model`-bindable trigger pair, but those are a DI-context function pair
(`useDockContext()`) and glass-ui's J.W3.B-idiomatic dock-keep sink is
`<HoverPopover keepDockOpen>` — though the @mbabb menu is a *click* `DropdownMenu`, not a
hover popover, so the `keepOpen` half is largely inapplicable; (3) a MED — the W6
`steppedEase` "kf engine symbol" gate clause is unsatisfiable as written (`steppedEase` is
a value.js export, NOT re-exported from the kf barrel); (4) MED/LOW anchor drift across
W0/W3/W6 (the `src/parsing/` tree does not exist on this branch; several line numbers are
stale). Plus two LOW gate-precision notes (HD-6 the W0 error count, HD-7 the W4 hero-rung
threshold).

---

## §1. THE DEPENDENCY-REALITY TABLE (the deliverable)

Legend: **EXISTS** = verified at byte level · **EXISTS (staged)** = does not exist yet but
the wave explicitly tags it author-now/RECORD · **PARTIAL** = exists but not in the shape
the wave assumes · **N/A** = not a dependency.

| Wave | Dependency the fix assumes | Kind | Verified? | Anchor |
|---|---|---|---|---|
| **W0** | `serializeEasing` throws on a custom `TimingFunction` with no `.css` twin | kf method | **EXISTS** | `src/animation/format.ts:30-43` — `throw new AnimationOptionError(...)`; LIVE-confirmed 2× on :5173 cube load |
| **W0** | the typed `Easing { fn, css? }` seam to attach a faithful `.css` twin that flows through `adoptCompiled` | kf type/method | **EXISTS** | `Easing` type in `constants.ts`; `adoptCompiled` at `engine.ts:324`; `serializeEasing` returns `easing.css` first (`format.ts:31`) |
| **W0** | a place in the engine to classify a bare non-numeric/non-color text leaf as discrete-hold so `"......"` snaps not throws | kf method (NEW) | **EXISTS (staged)** | the lerp is `lerpValue(eased, iv)` at `engine.ts:781` → value.js `iv._lerp`; the throw is value.js `_lerp` (`Parse error at offset 0: "......"`, LIVE-confirmed). The classifier must be authored — feasible, see §2-W0 |
| **W1** | `createGlobalState` + `useStorage` (the adjudicated store facility over Pinia) | vueuse | **EXISTS** | `@vueuse/core@14.3.0` installed; demo already standardizes on it (per gap-scorecard §2.1) |
| **W1** | `AnimationGroup.serialize()/hydrate()` (genuine suspend/restore seam) | kf method (NEW) | **EXISTS (staged)** | does NOT exist — only `adoptCompiled(source)` (`engine.ts:324`, a *compiled-state* adopt, not a *clock* snapshot). W1/S4 correctly tags it a "value.js/engine-RECORD — store lands first against existing imperative restore, then swaps." Honest. |
| **W1/S5** | `DockDropdownTrigger` is itself a reka `DropdownMenuTrigger` (the double-wrap root) | glass-ui prop | **EXISTS** | `DockDropdownTrigger.vue.d.ts`: `__VLS_Props = DropdownMenuTriggerProps & {...}`; live `App.vue:18-21` confirms the double-wrap |
| **W1/S5** | dock `keepOpen`/`release` to bind `v-model:open` against | glass-ui API | **PARTIAL — see HD-2** | `keepOpen`/`release` exist but as a `useDockContext(): DockContext` FUNCTION pair (`dockContext.d.ts`), NOT a `v-model`-bindable trigger surface. Idiomatic dock-keep is `<HoverPopover keepDockOpen>` (`HoverPopover.vue.d.ts:64`) — but @mbabb is a *click* DropdownMenu, so keep-open is largely moot |
| **W2** | `<Card surface="cartoon">` prop emits `.cartoon-surface` + drops `.glass-specular-track` | glass-ui prop | **EXISTS** | `CardFooter-C390imy7.js:37` — `t.surface === "glass" && "glass-specular-track"`, `t.surface === "cartoon" && "cartoon-surface"`; default `"glass"` (`:9`). Net-deletion confirmed. |
| **W2** | `@utility cartoon-surface { box-shadow: var(--shadow-cartoon-md); … hover translate }` | glass-ui CSS | **EXISTS** | `dist/styles/cards.css:33-48` — exactly `box-shadow: var(--shadow-cartoon-md)` at rest, hover `translate: var(--lift-sm)` w/ `--spring-bouncy` |
| **W2** | `--shadow-cartoon-{sm,md,lg}` tokens | glass-ui token | **EXISTS** | `dist/styles/tokens.css:543-552` |
| **W2** | `glass-specular-track::before` masked radial + `--mouse-x/--mouse-y` consumer write + intensity rest 0.35→hover 0.6 | glass-ui CSS | **EXISTS** | `dist/styles/glass-specular-track.css` — `--specular-x: var(--mouse-x,50%)`, `radial-gradient(... .55 ...)`, `mix-blend-mode:screen`, rest `.35`(dark `.22`)/hover `.6`/active `.85` — the audit's numbers are EXACT |
| **W2** | a demo `useSpecularPointer` composable to write `--mouse-x/--mouse-y` | kf/demo (NEW) | **EXISTS (staged)** | net-new demo composable; the CSS seam it feeds is verified above; LIVE: 0 hosts pointer-wired |
| **W2** | `@utility scale-on-hover` owned by glass-ui (so the demo dup can be deleted) | glass-ui CSS | **EXISTS** | `dist/styles/utilities.css:680` `@utility scale-on-hover { scale:1; … hover scale:var(--scale-hover) }` — semantically identical to the demo's local `design-idioms.css:177`. S4's "glass-ui owns it, delete the demo dup" premise is CORRECT (verified after re-grepping `dist/styles/`, not just the bundled `glass-ui.css`) |
| **W3** | the 3-track grid `lg:grid-cols-[var(--controls-pane-width)_1fr_1fr]` + the subgrid chain | demo CSS | **EXISTS** | grid is at `AnimationControlsGroup.vue:5` (NOT `AnimationControlsControls.vue:4` as the scope line says); subgrid chain at `AnimationControlsControls.vue:4,6,9,294`; `--controls-pane-width:400px` at `design-idioms.css:106` |
| **W3** | Tailwind v4 named-grid-line syntax `[rail] var(--rail-width) [stage] 1fr` | CSS / Tailwind v4 | **EXISTS** | named grid lines are CSS Grid L1 (Baseline widely available); Tailwind v4 arbitrary-value grid templates compile it; no new dep |
| **W4** | `@utility text-display-mega` (φ^(9/2), peak 177px) | glass-ui CSS | **EXISTS** | `dist/styles/typography.css:121,201-203`; `--type-display-4` peak 86.1px (`:114`) — the audit's "86→177" is exact |
| **W4** | container-query length unit `38cqi` in `block-size: clamp(160px,38cqi,280px)` + a `container-type` context | CSS Baseline | **EXISTS** | container queries + cq* units are Baseline-2023 (modern-web `fluid-scaling`/`size-aware-styling` treat as safe, no fallback). Needs the `container-type` ancestor the wave adds. ✓ |
| **W4** | `@utility icon-* { @apply size-N }` owned in `design-idioms.css`; the 61 no-op refs | demo CSS (NEW) + Tailwind v4 | **EXISTS (staged)** | 62 `icon-(sm\|md\|lg\|xs)` callsites in demo src; 0 `@utility icon-*`/`.icon-sm{}` definitions anywhere — the "no-op" claim is accurate. `@utility` + `@apply` are Tailwind v4 (the demo already uses `@utility` for the design-idioms layer) |
| **W5** | `fromMotionPath` + `getPointAtLength` + `ManualTimeline` (drag the traveller) | kf method | **EXISTS** | `motion-path.ts:105` `fromMotionPath`; `timeline.ts:181` `ManualTimeline`; `getPointAtLength` is the native SVG `SVGGeometryElement` API (Baseline) |
| **W5** | `SpringProgress` (square drag fallback) | kf method | **EXISTS** | `spring.ts:149`; barrel-exported `index.ts:34` |
| **W5** | `springLinearStops` is a kf export (collapse the 3-fork to 1 composable) | kf method | **EXISTS** | `springLinearStops.ts`; barrel `index.ts:40` |
| **W5** | `Sequence` (kept as-is, SOTA) | kf method | **EXISTS** | `sequence.ts`; barrel `index.ts:70` |
| **W5** | `SceneDescriptor.icon` field to host the SVG family | demo type (NEW) | **EXISTS (staged)** | `scenes.ts:7-14` `SceneDescriptor` has NO `icon` field today — must be added (the wave says "author ONE … family on `SceneDescriptor.icon`"). Feasible additive change |
| **W5** | the amiga `tesselateSphere` pixel-grid bug | demo bug | **EXISTS (real bug)** | `amiga/utils.ts:9,17-24` — `boardSize=1024`, loops `y/x < 1024` filling `fillRect(x*64,…)` → ~1M iters, ~500k fills, all but the 16×16 origin tile OFF-canvas. The bug is REAL; fix (loop `<16`, fill `x*tileSize`) is feasible |
| **W5/S6** | `content-visibility: auto` (off-screen inactive roots) + `contain: paint` (G1 de-stack) | CSS Baseline | **EXISTS** | `content-visibility` Baseline 2024; `contain` Baseline-2022 widely available; modern-web `defer-rendering-heavy-content` covers it. Not yet used in demo src (0 hits) — net-add. Note `content-visibility:auto` carries an INP/layout-stability caveat (see §2-W5) |
| **W5/S6** | `THREE.DataTexture` / `THREE.CanvasTexture` (the tile-loop alt path) | three.js | **EXISTS** | `amiga/utils.ts` already uses `THREE.CanvasTexture`; `DataTexture` is a stock three.js class. Feasible |
| **W6** | `NumericAnimation` (the dogfood primitive) | kf method | **EXISTS** | `numeric.ts:65`; barrel `index.ts:30` |
| **W6** | `steppedEase` as a "kf engine symbol" the dots import | kf export | **PARTIAL — see HD-3** | `steppedEase` is a VALUE.JS export (`animations.ts:1` imports it `from "@mkbabb/value.js"`); NOT re-exported from the kf barrel (`index.ts`/`easing.ts` grep = 0). The W6 gate clause "imports a kf engine symbol" is satisfied by `NumericAnimation`, NOT `steppedEase` |
| **W6** | `CSSKeyframesAnimation` dogfood template (`CopyButton`) | kf method | **EXISTS** | `CopyButton.vue:24` imports `CSSKeyframesAnimation` from `@src/animation/engine` — IS the cited chrome-dogfood template |
| **W6** | `AnimatedText.vue` `split(/\s+/)` collapses `"..."` to one span | demo behavior | **EXISTS (re-anchor)** | the split is at `AnimatedText.vue:63` (NOT `:62`); a comment block (`:57-62`) documents the word-split was a DELIBERATE `text-wrap: balance` fix — W6 must not regress it (see §2-W6) |
| **W7** | `SpringProgress` (the springy sheet) | kf method | **EXISTS** | `spring.ts:149` |
| **W7** | the bespoke drawer is `transition: grid-template-rows` (not vaul) | demo CSS | **EXISTS** | `ControlsPaneWrapper.vue:149,154` + `AnimationControlsControls.vue:295` — `transition: grid-template-rows var(--duration-panel/normal)`. The "550ms" is the resolved `--duration-panel` value (live measure), not a source literal |
| **W7** | the `rail·stage·rail` grid + `--rail-width` (re-parameterized from W3) | demo CSS (W3-authored) | **EXISTS (staged)** | rides W3's net-new grid; no external dep |
| **W7** | mobile overlay (bottom-sheet) primitives | CSS Baseline | **EXISTS** | modern-web `navigation-drawer` confirms scroll-snap/`inert`/IO are Baseline-widely-available; the demo drawer is bespoke (no Popover dep needed) |
| **W8** | `demo-driver.mjs` `SCENES` manifest knows 6, demo ships 9 | CI script + demo | **EXISTS** | `scripts/lib/demo-driver.mjs:40-59` SCENES = 6 (home,cube,amiga,square,easing,spring); `scenes.ts` = cube,amiga,square,easing,spring,sequence,motion-path,starting-style (+home) = 9. The 3 drifted (sequence/motion-path/starting-style) are EXACT |
| **W8** | a `proof:visual-lock` pixel baseline harness | CI (NEW) | **EXISTS (staged)** | playwright `browser_take_screenshot` exists; a region-diff harness is net-new tooling — feasible (the gate regime already has a π/score-floor visual pass to extend) |
| **W8** | the dock-lag HANDOFF (glass-ui `53c1b07` unpublished) + `proof:dock-morph-settled` born-RED | glass-ui (cross-repo) | **EXISTS (HANDOFF)** | installed glass-ui 3.4.0 ships the pre-AW.W2 `--spring-dock`; correctly tagged HANDOFF + born-RED gate. NOT kf-authored (inv-16 honored) |

---

## §2. SUBSTANTIVE FINDINGS (severity-ranked; each: location · defect+evidence · concrete edit)

### HD-1 (HIGH) — the W1 `proof:no-route-storm` gate did NOT bite on a passive idle load; it is likely BORN-GREEN, not born-RED as the charter asserts

- **Location:** `H.md` H.W1 §Hard gate (`:327`); `_SYNTHESIS-gap-scorecard §3 H.W1` (`:131`).
- **Defect + evidence:** the gate reads "`proof:no-route-storm` (load `#/easing`, idle 2s,
  ≤1 nav entry, resting hash unchanged — **RED: the storm today**)." I drove the live demo
  on :5173: navigated `#/easing`, idled 2.6s with a `hashchange` listener + `history.length`
  watch. Result: `hashChangedDuringIdle: 0`, `historyGrowth: 0`, resting hash UNCHANGED
  (`#/easing?anim=Easing+Preview`). The "autonomous route storm" did NOT reproduce on a
  passive idle. The audit's named oscillation chain
  (easing→motion-path→starting-style→spring→amiga) is a TRANSIENT MOUNT-TIME race (a
  multi-authority settle on first route-resolution), not a steady-state idle storm — but
  the GATE is written as an idle-2s probe. A gate that does not red TODAY cannot prove the
  fix tomorrow: it is the inverse of the born-RED discipline the charter binds.
- **Concrete edit:** re-shape `proof:no-route-storm` to capture the MOUNT-TIME race (the
  real defect): "instrument `hashchange`/`history.pushState` from BEFORE the first scene
  mount across a cold cross-scene navigation (e.g. `#/` → `#/easing`); assert ≤1 net nav
  entry and the resting hash equals the requested route within 500ms of mount-settle (RED:
  the multi-authority settle emits the oscillation chain during mount today)." Add a note
  in §The state, verified that the storm is mount-transient, not idle-steady, so the
  instrument is correctly placed. If the storm genuinely no longer reproduces (it may have
  been quieted by a prior G-pass), DOWNGRADE D12's "live autonomous route storm" claim to a
  mount-time multi-authority race and re-verify the born-RED status before authorizing W1.

### HD-2 (HIGH) — the W1/S5 popover prescription mis-types the dock keep-open seam: `keepOpen`/`release` are a `useDockContext()` FUNCTION pair, not a `v-model`-bindable trigger surface; and @mbabb is a *click* DropdownMenu, so dock-keep is largely inapplicable

- **Location:** `H.md` H.W1 §Scope S5 (`:326`), §Design decisions (3) (`:329`);
  `_SYNTHESIS-gap-scorecard §1.1 mbabb-popover` (`:67`), §2.1 dissent.
- **Defect + evidence:** S5 says "bind `v-model:open` → dock `keepOpen`/`release`." Reality
  (`dist/components/custom/dock/composables/dockContext.d.ts`): `keepOpen()`/`release()` are
  members of the `DockContext` interface, acquired via `useDockContext()` (strict) /
  `useOptionalDockContext()` — an imperative DI function pair you CALL, not a prop/emit you
  `v-model`-bind. You cannot "bind `v-model:open` → keepOpen/release." Worse, that same file
  records: "**J.W3.B — `registerPopover`/`closeOtherPopovers` retired. Hover-driven dock
  popovers compose `<HoverPopover keep-dock-open>`** whose open/close cadence is owned by
  reka-ui's HoverCard." So glass-ui's IDIOMATIC dock-keep sink is the `keepDockOpen?: boolean`
  prop on `<HoverPopover>` (`HoverPopover.vue.d.ts:64`, "ref-counted so multiple keep-open
  holds compose cleanly"), which calls `keepOpen`/`release` INTERNALLY. The consumer never
  touches them. BUT — the @mbabb menu is a `<DropdownMenu>` (click-to-open), verified
  `App.vue:17-22`, NOT a `<HoverPopover>` (hover-to-open). A click dropdown does not need
  the hover keep-open ref-count at all; the dock's timer-collapse only fights HOVER
  popovers. So the `keepOpen`/`release` half of S5 is, for THIS popover, a non-fix reaching
  for the wrong (and mis-typed) seam. The PRIMARY root the lane adjudicated — the
  double-wrapped trigger (`DropdownMenuTrigger as-child` over a `DockDropdownTrigger` that
  IS a `DropdownMenuTrigger`) — is REAL and VERIFIED (`DockDropdownTrigger.vue.d.ts`:
  `DropdownMenuTriggerProps`), and dropping the outer wrapper IS the correct, sufficient
  fix (mirroring `DockSelectTrigger`). The error is ONLY the spurious `keepOpen`/`release`
  binding bolted beside it.
- **Concrete edit:** in S5 and §Design decisions (3), strike "bind `v-model:open` → dock
  `keepOpen`/`release`." Replace with: "drop the outer `<DropdownMenuTrigger as-child>`
  wrapper and place `<DockDropdownTrigger>` directly as the `DropdownMenu`'s trigger
  (`DockDropdownTrigger` IS a reka `DropdownMenuTrigger`, mirroring `DockSelectTrigger`'s
  single-trigger pattern); the reka root owns `open` state. The dock `keepOpen`/`release`
  ref-count is for HOVER popovers (`<HoverPopover keepDockOpen>`, J.W3.B) and does not
  apply to this click-`DropdownMenu` — do NOT wire it." If a keep-dock-open WHILE the menu
  is open is genuinely desired (so the dock doesn't collapse under the open menu), acquire
  it via `useOptionalDockContext()?.keepOpen()` on `@update:open` — the IMPERATIVE function,
  not a `v-model` binding.

### HD-3 (MED) — the W6 gate clause "the dots component imports a kf engine symbol" is unsatisfiable by `steppedEase` (a value.js export, not re-exported from the kf barrel)

- **Location:** `H.md` H.W6 §Scope S1 (`:391`), §Hard gate (`:392`); `_SYNTHESIS-gap-scorecard
  §3 H.W6` (`:155-156`).
- **Defect + evidence:** S1 says the dots "dogfood `steppedEase`/`NumericAnimation`," and
  the gate asserts "the dots component imports a kf engine symbol (RED: hand-rolled CSS
  today)." `steppedEase` is a VALUE.JS export: `src/animation/animations.ts:1` does
  `import { CSSCubicBezier, steppedEase } from "@mkbabb/value.js"`, and it is NOT
  re-exported from the kf package barrel (`src/animation/index.ts` and the easing module
  carry zero `steppedEase` export). So a demo importing `steppedEase` would import it from
  `@mkbabb/value.js`, which does NOT satisfy "imports a kf ENGINE symbol" — it would
  satisfy "imports a value.js symbol," weakening the inv-ζ dogfood proof. Only
  `NumericAnimation` (kf-owned, barrel `index.ts:30`) satisfies the gate. The `CopyButton`
  template the wave cites uses `CSSKeyframesAnimation` (`CopyButton.vue:24`), also kf-owned —
  reinforcing that the genuine dogfood vehicle is a kf class, with `steppedEase` (if used)
  being a curve FED into it, not the dogfood symbol.
- **Concrete edit:** in S1 reword to "dogfood `NumericAnimation` (the kf-owned staggered
  driver) — optionally shaped by a `steps()`/`step-end` curve resolved via the kf engine's
  `getTimingFunction`/`resolveEasing` (NOT a direct `@mkbabb/value.js` `steppedEase` import,
  which would not satisfy the kf-engine-symbol gate)." In the gate, pin the clause to a
  concrete kf symbol: "imports `NumericAnimation` (or `CSSKeyframesAnimation`) from the kf
  barrel — a `@mkbabb/value.js` import does NOT satisfy this clause." Alternatively, if a
  raw `steppedEase` dogfood is intended, first RECORD a kf-barrel re-export of `steppedEase`
  as a prerequisite (a one-line barrel add) — but that is a kf src edit, so it belongs as an
  explicit sub-scope, not an implicit assumption.

### HD-4 (MED) — pervasive path/line anchor drift: the `src/parsing/` tree does not exist on `tranche-h-dev`; W0/W3/W6 cite stale paths and line numbers

- **Location:** `H.md` H.W0 §Scope (`:309`, "`src/parsing/format.ts:24`"), the
  `inv-16/inv ε compliance` block (`:605`); H.W3 §Scope (`:347`, the 3-track grid in
  "`AnimationControlsControls.vue:4`"); H.W6 (`AnimatedText.vue:62`); CLAUDE.md project tree.
- **Defect + evidence:** on `tranche-h-dev`, `src/` contains ONLY `animation/` + `env.d.ts`
  — there is NO `src/parsing/`, `src/units/`, `src/easing.ts`, `src/math.ts`, or `src/utils.ts`
  (the CLAUDE.md tree and these anchors are from an older layout). Verified:
  `serializeEasing` lives at `src/animation/format.ts:30` (throw at `:36`), NOT
  `src/parsing/format.ts:24`. The W0 crash sites `engine.ts:516,576` point at
  `setRespectReducedMotion` / the option-setter chain — NOT a lerp/discrete path (the real
  lerp seam is `lerpValue(eased, iv)` at `engine.ts:781`). The W3 3-track grid
  `lg:grid-cols-[var(--controls-pane-width)_1fr_1fr]` is in `AnimationControlsGroup.vue:5`,
  not `AnimationControlsControls.vue:4` (`:4` is the inner `grid-cols-[auto_1fr]` subgrid
  parent — also real, but a different node). The W6 `split(/\s+/)` is at
  `AnimatedText.vue:63`, not `:62`. NB: the LIVE :5173 stack DOES report
  `src/animation/format.ts:24` — so against the *running bundle* the `:24` is internally
  consistent, but it disagrees with the file on `tranche-h-dev` (a HEAD/running-bundle
  skew). The SUBSTANCE of every W0/W3/W6 claim holds; only the anchors are stale. Stale
  anchors are an inv-ε hazard: a green source-shape grep keyed off a wrong path silently
  no-ops.
- **Concrete edit:** re-anchor the W0 scope to `src/animation/format.ts:30-43` (the
  `serializeEasing` throw) and the lerp seam to `engine.ts` `processFrame`/`lerpValue`
  (`engine.ts:781`) → value.js `iv._lerp` (cite the value.js `_lerp` parse-throw as the
  origin); drop the spurious `engine.ts:516,576`. Re-anchor the W3 3-track grid to
  `AnimationControlsGroup.vue:5` (keep the `AnimationControlsControls.vue:4,6,9,294` subgrid
  chain). Re-anchor W6 to `AnimatedText.vue:63`. Add a one-line note that the published
  CLAUDE.md tree predates the single-`animation/` consolidation so future anchors resolve
  against `src/animation/`.

### HD-5 (RETRACTED → verification PASSED) — W2/S4's `scale-on-hover` premise is CORRECT

- **Location:** `H.md` H.W2 §Scope S4 (`:339`); `_SYNTHESIS-gap-scorecard §3 H.W2` (`:135`).
- **Status:** an initial grep of only the bundled `glass-ui.css` found no `scale-on-hover`
  and I drafted this as a MED defect. Re-grepping `dist/styles/` corrected it: glass-ui 3.4.0
  DOES own `@utility scale-on-hover` (`dist/styles/utilities.css:680` — `scale:1;
  transition: scale var(--duration-fast) …; &:hover { scale: var(--scale-hover) }`),
  semantically identical to the demo's local `.scale-on-hover` (`design-idioms.css:177`,
  with a PRM bracket). So S4's premise — "glass-ui owns the `@utility`, delete the duplicate
  demo `.scale-on-hover`" — is CORRECT and delete-safe. **No defect. Logged here for
  inv-ε honesty (the finding was manufactured by an incomplete grep and is withdrawn).** One
  LOW carry-along: the demo's local copy carries a `prefers-reduced-motion` bracket; confirm
  glass-ui's `@utility` version preserves PRM behavior (it transitions `scale` via tokens
  but shows no explicit PRM guard in the utility body) before deleting, else the demo loses
  its reduced-motion suppression.

### HD-6 (LOW) — W0 console-error COUNT is imprecise vs the live :5173 reality (3, not "4")

- **Location:** `H.md` H.W0 §Hard gate (`:314`, "RED: 4 today"); `_SYNTHESIS-gap-scorecard
  §3 H.W0` (`:126`, "RED: 4 today").
- **Defect + evidence:** a fresh cold load of `#/cube` on :5173 yields exactly **3** console
  errors: 2× `AnimationOptionError`/`serializeEasing` (H-A1) + 1× `Parse error at offset 0:
  "......"` (H-A2). The charter's "`serializeEasing` THROWS 4×/Cube-load" and "RED: 4 today"
  overstate by one. (The `getComputedStyle` TypeErrors that appear in the cross-session log
  were stale :5174 entries — NOT live on :5173, so the W0 scope of exactly two crash
  families is CORRECT; only the integer is off.) A gate asserting "RED: 4" while the live
  state is 3 would pass an "errors ≤ 3" naive read.
- **Concrete edit:** change "RED: 4 today" → "RED: 3 today (2× serializeEasing + 1× the
  `"......"` lerp; the exact serializeEasing count tracks the cube-preset count with a custom
  easing)." Keep the GREEN target at "0 console errors" — that is correct and count-robust.

### HD-7 (LOW) — W4 `proof:hero-rung` ("font-size ≥ --type-display-mega") under-bites at narrow viewports because both rungs are `clamp()`-fluid

- **Location:** `H.md` H.W4 §Hard gate (`:366`); `_SYNTHESIS-gap-scorecard §3 H.W4` (`:146`).
- **Defect + evidence:** `--type-display-4 = clamp(3.33rem, 2.5rem+4vw, 5.382rem)` (peak
  86.1px) and `--type-display-mega = clamp(5.382rem, 4rem+9vw, 11.089rem)` (peak 177px)
  (`typography.css:114,121`). The two clamps only diverge at WIDE viewports; at a narrow
  width both can resolve near their floors (display-4 floor 53px vs mega floor 86px — still
  distinct, but the gate's "font-size ≥ --type-display-mega" compares two viewport-dependent
  computed values). Asserting a raw px floor (e.g. "≥ 120px at ≥1280px viewport") is more
  robust than comparing two fluid clamps whose ordering is width-dependent.
- **Concrete edit:** pin `proof:hero-rung` to BOTH (a) the resolved class is
  `text-display-mega` (a source-shape grep — robust) AND (b) a px floor at a fixed gate
  viewport (e.g. "computed `font-size ≥ 140px` at 1440×900"), instead of comparing
  `font-size ≥ --type-display-mega` across an unpinned viewport.

---

## §3. WHAT IS SOUND (honest credit — inv ε; do NOT manufacture findings here)

These dependencies were each verified to EXIST in the exact shape the wave assumes — the
authoring is correct:

- **W2 is the strongest-grounded wave.** `surface="cartoon"` (CardFooter:37), the
  `@utility cartoon-surface` body (cards.css:33-48, exact `--shadow-cartoon-md` rest +
  spring hover-lift), the `--shadow-cartoon-*` tokens (tokens.css:543-552), and the
  `glass-specular-track` seam with rest 0.35 / hover 0.6 / `--mouse-x` write
  (glass-specular-track.css) are ALL byte-verified and the audit's numbers are EXACT. The
  "net-deletion, the radial dies at source" adjudication is mechanically correct
  (`CardFooter:37` gates the class on `surface==="glass"`). LIVE-confirmed: 5 specular hosts,
  0 pointer-wired, 0 cartoon Cards → the `proof:cartoon-is-panel-depth`/`proof:no-orphan-specular`
  gates are genuinely born-RED.
- **W0's two crash families are LIVE-CONFIRMED** on :5173 (the serializeEasing throw and the
  `"......"` lerp parse-error), and the fixes align with the engine's typed `Easing { fn,
  css? }` design (W0/S1) and a real value.js `_lerp` throw seam (W0/S2). The "discrete
  hold-snap is CSS-correct, not a try/catch swallow" framing honors the no-workaround spine.
- **W5's amiga `tesselateSphere` bug is REAL** (the 1024² pixel-grid loop, ~500k off-canvas
  fills) and the tile-loop fix is feasible. All five W5 kf primitives
  (`fromMotionPath`, `ManualTimeline`, `SpringProgress`, `springLinearStops`, `Sequence`)
  EXIST and are barrel-exported. The manifest drift (W8: 6 known, 9 shipped) is EXACT.
- **W1's store-facility adjudication is feasible** (`createGlobalState`+`useStorage` via
  vueuse 14.3.0), and W1/S4 HONESTLY tags the missing `serialize()/hydrate()` engine seam as
  a staged RECORD (store-first against the existing imperative restore) rather than
  assuming a phantom method.
- **The CSS-Baseline claims hold**: container-query units (W4 canvas), masks (W2 specular),
  `content-visibility`/`contain` (W5 perf), named grid lines (W3/W7) are all Baseline-safe
  for an evergreen Vue demo per modern-web-guidance. The ONE nuance: `@property` (the
  specular's smooth position interpolation) is Baseline **Newly available (2024-07-09)**,
  NOT "Baseline-2023" — but glass-ui already ships the documented `var()` static fallback,
  so W2 consuming it is safe; only the charter's loose "Baseline-2023" labeling of the
  specular interpolation is imprecise (the CANVAS container-query at W4 IS Baseline-2023).
- **inv-16 is honored**: every cross-repo item (dock `53c1b07`, the Card specular seam, the
  value.js/parse-that slices) is HANDOFF-tagged with a born-RED kf gate, never kf-authored.

---

## §4. VERDICT

NO phantom-API BLOCKER — every load-bearing external dependency across W0–W8 EXISTS (or is
honestly staged as net-new with the wave acknowledging it). H is feasible as architected.
Four substantive corrections are owed before authorization: **HD-1 (HIGH)** the
`proof:no-route-storm` gate must be re-shaped to the mount-time race it actually targets
(it did not bite on idle — verify born-RED before W1 authorization); **HD-2 (HIGH)** the
W1/S5 popover fix must drop the mis-typed `keepOpen`/`release` `v-model` binding (the
double-wrap drop alone is the correct, verified fix; dock-keep is for hover popovers, not
this click-DropdownMenu); **HD-3 (MED)** the W6 dogfood gate must name `NumericAnimation`,
not the non-barrel-exported `steppedEase`; **HD-4 (MED)** re-anchor the stale `src/parsing/`
+ line numbers to the consolidated `src/animation/` tree. HD-5 was DRAFTED then RETRACTED
(glass-ui DOES ship `@utility scale-on-hover` — W2/S4 is sound). HD-6/HD-7 are LOW
gate-precision tightenings. None of these blocks implementation; all are doc edits that
make the gates bite truthfully and stop a green-but-no-op grep from masking a chronic.
