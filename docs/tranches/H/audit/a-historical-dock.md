# Tranche H — Audit Lane: `a-historical-dock`

**Lane:** the FORMERLY-WORKING dock — git archaeology across keyframes.js (TopDock /
ChromeDock / GlassDock history) AND glass-ui (the dock-component rebuild). Characterize
the working dock, what changed, the regression, and the path back.

**Repos:** keyframes.js @ `tranche-h-dev` · glass-ui @ `53c1b07` (its AW tranche, ACTIVE).
**Demo:** live at `http://localhost:5174/` — driven with Playwright MCP.

**Binding mandate carried:** no workarounds, gestalt only · NO legacy beside replacement ·
a replaced surface replaced in ONE motion · MEASURE-FIRST for perf · cite file:line or a
live observation for every claim. glass-ui is consumed PUBLISHED (`@mkbabb/glass-ui ^3.4.0`)
— dock fixes are **AUDIT + SUGGEST + glass-ui-HANDOFF**, never patched inside kf.

Maps to OBSERVED DEFECTS **D5** (dock broken/slow/laggy; @mbabb popover no longer opens) and
**D9** (@mbabb logo popover — dark-mode + about — no longer opens).

---

## TL;DR

The dock was **rebuilt twice** and the two rebuilds collided:

1. **The kf-LOCAL dock (the "many versions ago" working one)** — `TopDock.vue` over a local
   `GlassDock.vue` (148L) driven by two hand-rolled composables `useDockState` +
   `useDockTransition`. Simple, legible, CSS-transition morph. It WORKED.
2. **D.W5 / G.W12** (kf commit `1b9b05f`) **deleted the local dock wholesale** and adopted
   glass-ui's rebuilt dock — renaming `TopDock.vue → ChromeDock.vue`, deleting the local
   `dock/index.ts` barrel, and **removing the `:always-expanded` occlusion mask** on the
   stated belief that *"glass-ui's rebuilt 3.3.0 dock owns the no-occlusion contract"*
   (ChromeDock.vue:115-118 comment).
3. **glass-ui 3.3.0 shipped a dock REGRESSION** — `container-type: inline-size` on
   `.glass-dock` collapsed every horizontal dock to a ~19px sliver (glass-ui `5c0f529`,
   AW.W1). glass-ui **3.4.0** fixed THAT. But **3.4.0 was cut BEFORE the AW.W2 spring
   retune** — so the installed dock still runs the OLD bouncy `--spring-dock` (the lag/bounce
   feel, D5), and the @mbabb dropdown was never re-wired to the new glass-ui
   dock-keepOpen / teleport-portal contract (D9).

**Disposition:** D5-lag → **glass-ui-HANDOFF (bump after AW.W2 lands)** · D9-popover →
**SHIP-in-H** (kf-side wiring bug in App.vue, NOT glass-ui) · the dead local-dock costume in
ChromeDock → **SHIP-in-H** (collapse remaining single-layer dross).

---

## 1 · The arc (git archaeology)

### 1.1 The local dock era — what WORKED ("many versions ago")

The dock began as a kf-local stack and grew into a clean, dual-layer morph:

| commit | what |
|---|---|
| `3b8b468` | extract dock components — first `TopDock.vue` over local `GlassDock` + `DockPopover` |
| `28853e1` | extract `GlassDock` state → `useDockState` composable (3-state machine) |
| `e82633e` | **extract `useDockTransition`, fix dock animations** — the high-water mark |
| `940150e` | **delete local dock composables/components — import from glass-ui** (the pivot away) |

The richest local `GlassDock.vue` (read at `940150e~1:demo/@/components/custom/dock/GlassDock.vue`)
was **148 lines, self-contained**:

- **Dual-layer grid stack** — `.dock-layer--full` (expanded slot) + `.dock-layer--summary`
  (collapsed slot) both at `grid-area: 1/1`; the inactive layer is
  `position:absolute; visibility:hidden; pointer-events:none`. One pill, two contents, no
  layout reflow on swap.
- **`useDockTransition`** (`940150e~1:demo/@/composables/useDockTransition.ts`, 94L) — a
  deferred FLIP: pin width → fade out (`isTransitioning`) → swap `visualExpanded` while
  invisible → measure target with new layer in flow → re-pin old width → force recalc →
  `requestAnimationFrame` to target → on `transitionend(width)` clear inline width. Sequence
  documented in its own header: *"fade out → swap layer → animate width → fade in"*.
- **`useDockState`** (`940150e~1:demo/@/composables/useDockState.ts`, ~210L) — the
  `collapsed | hover | pinned` machine with: ref-counted `keepOpen`/`release`
  (`provide("dockKeepOpen"/"dockRelease")`), `isMouseInside` guard against collapse during
  dropdown focus, a 600ms mount-suppression window against phantom triggers, and a deferred
  `pointerdown` click-away listener (`nextTick` so the opening click doesn't self-close).

**Why it worked:** the morph was a plain CSS `width` transition on ONE element
(`transition: width var(--duration-normal) var(--ease-dock)`, GlassDock.vue style block) —
no spring solver, no View-Transitions, no `container-type`. The collapse mutex (`keepOpen`)
was `provide`/`inject` so EVERY dock child (Selects, popovers) participated automatically.
The @mbabb menu (then `DockPopover`, deleted in `940150e`) was a dock-native primitive that
held the dock open by construction.

### 1.2 The migration to glass-ui's dock

| commit | what |
|---|---|
| `940150e` | delete local dock; import `GlassDock`/`DockPopover` from glass-ui |
| `1b007ab` | adapt `TopDock` to glass-ui dock public API |
| `089126a` / `6f5a421` | import from `glass-ui/dock` subpath; adopt dock icon tokens |
| `1b9b05f` (**D.W5 / G.W12**) | **`TopDock.vue → ChromeDock.vue`**, delete `dock/index.ts`, **remove `:always-expanded` occlusion mask** |

The decisive event is **`1b9b05f`** (kf). Its own message:

> *G.W12 (D.W5 close, rides glass-ui 3.3.0) — TopDock→ChromeDock; dock/index.ts barrel
> DELETED (glass-ui dock primitives imported directly); the `:always-expanded` occlusion
> mask REMOVED*

and the in-file note (ChromeDock.vue:115-118):

> *"glass-ui's rebuilt 3.3.0 dock owns the no-occlusion contract; the occlusion gate re-runs
> mask-free as the lock."*

This bet on glass-ui 3.3.0. **3.3.0 was broken.**

### 1.3 glass-ui's own dock rebuild + the regression

glass-ui replaced its CSS-transition morph with a **`SpringProgress`-driven** engine that
dogfoods keyframes.js:

- `useLayerTransition.ts` (glass-ui, 397L) — *forks per swap*: a **native
  `document.startViewTransition` path** (zero `getBoundingClientRect`, browser snapshots +
  morphs the VT-named container/panes) and a **FLIP fallback** that drives the container size
  off ONE `SpringProgress` clock in pixel space, with velocity-continuity on retarget
  (re-seats the live solver instead of dispose+reconstruct — the iOS interruptible-spring
  contract, AV.W9.2). `DOCK_SPRING = { response: 0.32, dampingFraction: 0.7 }`
  (useLayerTransition.ts:20).
- The morph spring is mirrored to a build-time CSS token `--spring-dock` (a `linear()` ramp,
  glass-ui tokens.css:163) so the CSS-token and JS-driven curves cannot drift
  (`proof:spring-tokens-synced`).

Then the **3.3.0 regression** (glass-ui `5c0f529`, AW.W1):

> *`.glass-dock` carried `container-type: inline-size` (AV.W16 TW3), which applies
> `contain: inline-size` — the element's inline size becomes INDEPENDENT of its contents. A
> shrink-to-fit inline-flex pill under it cannot size to its content and collapses to its
> ~19px padding floor with the active layer overflowing. This broke EVERY horizontal dock.*

3.4.0 (`7306fa2`) shipped that fix as *"the constellation-unblocking cut … restores
horizontal dock content-sizing (the 3.3.0 container-type:inline-size regression that
collapsed every dock to a 19px sliver)."*

---

## 2 · What is INSTALLED + LIVE right now (MEASURED)

kf consumes **glass-ui 3.4.0** (`node_modules/@mkbabb/glass-ui/package.json` → `3.4.0`;
range `^3.4.0` in `package.json`).

**Live probe (Playwright, `http://localhost:5174/#/cube`):**

```
.glass-dock containerType: "normal"   contain: "none"      ← AW.W1 fix IS present (no sliver)
collapsed dock rect:        106 × 55 px (content-sized)     ← healthy, NOT the 19px regression
--spring-dock:  linear(0, 0.10932 2.041%, 0.35412 4.082% …) ← the OLD bouncy register
--dock-resize-spring: (same)                                ← unretuned
```

**Two facts collide:**

- The **container-type sliver (3.3.0) is NOT reproducible** in the running demo — the dock
  is 106px and shrink-wraps content. The 3.4.0 fix is in. So the "dock broken" half of D5 as
  *layout collapse* is already healed by the published bump.
- The **`--spring-dock` token is still `0.10932…`** = the OLD **(0.5, 0.5) ~+18.5% overshoot
  "too playful for a system dock"** register. The **AW.W2 retune** (glass-ui `53c1b07`,
  dated Jun 7 **13:48**) to **(0.32, 0.7), ~+4.6% overshoot, settling ~167ms / 11 rising
  frames** landed **AFTER the 3.4.0 cut** (`7306fa2`, Jun 7 **04:07**). **It is not in the
  published package kf installs.** → This is the **D5 "slow/laggy/bouncy"** root: kf runs
  pre-retune dock motion.

**Morph measurement caveat (MEASURE-FIRST honesty):** a rAF `getBoundingClientRect` loop on
`.glass-dock` during a `mouseenter` expand saw width jump to ~423px and settle at 427px
within the first sampled frame, overshoot ~+0.2%. This UNDER-reads the motion: on the native
View-Transitions path the morph runs on browser VT *snapshots*, invisible to live-element
geometry reads. A faithful lag instrument must sample the VT pseudo-elements or the
`SpringProgress` clock, not the live element. (Recorded so H doesn't false-GREEN the lag.)

---

## 3 · D9 — the @mbabb popover no longer opens (ROOT-CAUSED, kf-side)

**Live reproduction (Playwright):** with the dock expanded, programmatically `.click()` on
`.dock-dropdown-trigger`:

```
triggerExpandedAfter: "false"     ← aria-expanded never flips
menuOpen:             false       ← no [role="menu"] appears
```

The dropdown does **not** open. (Compounding: the page URL drifted `#/cube → #/easing`
mid-test — the D12 scene-state churn re-renders App.vue and can tear down the reka portal
root underneath the click; D9 and D12 interact.)

**Root cause — a MISSING wiring contract, not a glass-ui bug.** glass-ui's rebuilt dock
scopes click-away with an explicit teleport contract:

- `isTeleportedTarget.ts` (glass-ui): dock-owned popovers mark their teleported content with
  `data-glass-dock-portal` (+ `data-glass-dock-owner`); `useDockState`'s `onPointerDownOutside`
  treats those as "inside the dock" so opening a dropdown does NOT trigger click-away
  collapse. The contract docstring is explicit: *"keeps click-away logic scoped to the owning
  dock instead of depending on Reka internals, ARIA roles, or broad class names."*
- glass-ui `useDockState` exposes `keepOpen`/`release` (ref-counted, `isHeld` reactive). The
  ChromeDock scene/controls `<Select>`s ARE wired: `ChromeDock.vue:80-101` runs an
  `openPopup` mutex that calls `dockRef.value?.keepOpen()` / `.release()` on
  `@update:open`.

**The @mbabb `DropdownMenu` is NOT wired to EITHER half.** In `App.vue:18-72` the entire
`<DropdownMenu>` (DockDropdownTrigger + DropdownMenuContent) is passed via ChromeDock's
`#items` slot but:

1. has **no `@update:open` → `keepOpen()` bridge** (grep of App.vue:18-72 finds zero
   `keepOpen` / `:open` / `@update:open` on it), so opening it does NOT suppress the
   timer-based collapse; and
2. its `<DropdownMenuContent>` (App.vue:22) carries **no `data-glass-dock-portal` /
   `data-glass-dock-owner`** marker, so `isTeleportedTarget` returns `false` and the
   trigger-click → portal is seen as click-away → the dock collapses → the trigger unmounts
   → the menu is torn down before it paints. That is the `aria-expanded:false` we measure.

In the LOCAL-dock era this could not happen: the menu was a dock-native `DockPopover`
(`provide`/`inject` `dockKeepOpen`) and held the dock open by construction. The migration
dropped the @mbabb menu OUT of the dock's hold/teleport contract and never re-attached it.

**Gestalt fix (SHIP-in-H, kf-side, in ONE motion — no workaround):** make the @mbabb menu a
first-class dock-held popover. Either (a) the clean idiom — relocate the `<DropdownMenu>`
INTO `ChromeDock.vue` alongside the scene/controls Selects and fold it into the SAME
`openPopup` mutex (one `PopupKey` per dropdown, one `keepOpen`/`release` source of truth — DRY,
matches the existing pattern), OR (b) if it must stay in App.vue, bind
`@update:open="(o) => o ? dock.keepOpen() : dock.release()"` AND tag
`<DropdownMenuContent data-glass-dock-portal :data-glass-dock-owner="dockId">`. **(a) is the
gestalt choice** — it kills the cross-file split that caused the regression and gives every
dock dropdown ONE collapse-suppression authority. The `togglePpMode`/`DarkModeToggle`/Share
items move with it (they are dock-chrome, not app-chrome).

**Falsifiable instrument (so H can gate it):** `proof:dock-dropdown-opens` — Playwright:
expand dock → click `.dock-dropdown-trigger` → assert `aria-expanded==="true"` AND a
`[role="menu"]` with text matching `/Dark mode/` is visible AND the dock stays `expanded` for
≥500ms (no collapse-teardown). Born-RED today (measured false above), GREEN after the fix.

---

## 4 · D5 — broken / slow / laggy (the lag, glass-ui domain)

Two distinct sub-defects under D5; separate them:

- **D5-a (popover doesn't open)** = D9 = §3 = **kf-side, SHIP-in-H.**
- **D5-b (slow/laggy/bouncy motion)** = the dock morph FEEL = **glass-ui domain.** Root: kf's
  installed 3.4.0 predates the AW.W2 `--spring-dock` retune (measured `0.10932…` = the
  +18.5% bouncy register; §2). The "too playful for a system dock" overshoot reads as
  sloppy/laggy on a chrome dock.

**Path back / fix:** glass-ui has ALREADY done the work (`53c1b07`: response 0.32, ζ 0.7,
~+4.6% overshoot, ~167ms settle). It is unpublished. **glass-ui-HANDOFF:** cut a glass-ui
release that includes `53c1b07` (≥ 3.4.1 / 3.5.0), then kf bumps `@mkbabb/glass-ui`. **NO
kf-side patching of the spring** — the token + the JS `DOCK_SPRING` are paired and
gate-locked (`proof:spring-tokens-synced`); kf must not fork them.

**Secondary lag suspect to hand off for verification:** the native View-Transitions morph
path. VT snapshots the whole container; if the dock's siblings or a heavy backdrop-filter
are captured, the morph can jank on first expand. The FLIP/spring fallback is the cleaner
animator. glass-ui should MEASURE-FIRST whether the VT path actually beats the spring-FLIP on
this dock (the `dock-animation-live` detector exists: glass-ui
`tests/components/custom/dock/dock-animation-live.detect.test.ts`).

**Falsifiable instrument:** `proof:dock-morph-settled` (glass-ui-owned, kf re-asserts post-bump)
— sample the morph (VT pseudo or `SpringProgress` clock, NOT live `getBoundingClientRect` per
§2 caveat); assert peak overshoot ≤ ~6% and settle ≤ ~200ms. Born-RED on the +18.5% token.

---

## 5 · Residual dross from the migration (SHIP-in-H, kf-side)

The `:always-expanded` occlusion mask removal (`1b9b05f`) left a half-collapsed costume.
ChromeDock.vue:107-217 still mounts items directly in `GlassDock`'s default slot with a
`#collapsed` template — correct — but the comment at 113-118 narrates a *"dead single-layer
DockLayerGroup/DockLayer costume … collapsed."* Verify nothing of the deleted local
`DockLayerGroup`/`DockLayer`/`DockPopover` lineage lingers and that the collapsed/expanded
slot pair is the single source. **Disposition: RECORD → confirm clean; SHIP any leftover
removal in ONE motion (no compat alias).** This is bookkeeping, low risk.

Also note: ChromeDock.vue:80-101's `openPopup` mutex is the RIGHT pattern and should ABSORB
the @mbabb dropdown (§3 fix (a)) — do not add a parallel hold mechanism (DRY).

---

## 6 · Dispositions (summary)

| # | finding | anchor | disposition |
|---|---|---|---|
| H-dock-1 | @mbabb dropdown never opens — no `keepOpen` + no `data-glass-dock-portal` on its content | App.vue:18-72; live `aria-expanded:false` | **SHIP-in-H** (kf): fold @mbabb menu into ChromeDock `openPopup` mutex + dock teleport contract |
| H-dock-2 | dock motion bouncy/laggy — installed `--spring-dock` is the pre-AW.W2 +18.5% register | live `--spring-dock: …0.10932…`; glass-ui `53c1b07` unpublished | **glass-ui-HANDOFF** — release `53c1b07` then bump; NO kf fork |
| H-dock-3 | 3.3.0 container-type sliver | glass-ui `5c0f529` | **already fixed** in installed 3.4.0 (live `contain:none`) — RECORD only |
| H-dock-4 | morph lag mis-measurable via live `getBoundingClientRect` (VT snapshots) | §2 measurement caveat | **MEASURE-FIRST** — instrument must sample VT/spring clock |
| H-dock-5 | dead single-layer costume residue from `:always-expanded` removal | ChromeDock.vue:113-118 | **RECORD → SHIP** any leftover in one motion |
| H-dock-6 | VT-path vs spring-FLIP — is VT actually faster here? | useLayerTransition.ts (glass-ui) | **glass-ui-HANDOFF MEASURE-FIRST** |

**The path back, in one sentence:** the dock isn't "broken many versions ago and lost" — its
LOCAL animation engine was deliberately replaced by glass-ui's superior spring/VT engine; the
two regressions are (1) kf never re-wired the @mbabb menu into glass-ui's new dock-hold +
teleport-portal contract (**fix in kf, H**), and (2) kf installs a glass-ui build cut hours
before the spring retune (**fix by glass-ui release + bump, HANDOFF**). No re-introduction of
the old local dock; finish the migration cleanly.
