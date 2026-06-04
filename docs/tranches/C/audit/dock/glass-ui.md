# Tranche-C audit — glass-ui dock SOURCE-OF-TRUTH

**Lane.** glass-ui dock primitive (`@mkbabb/glass-ui/dock`). Read-only
constellation audit authored in keyframes.js (the lead's repo) and routed
outward per inv-16: keyframes does NOT patch glass-ui — it audits the dock and
refines the standing asks. The dock is **glass-ui-OWNED**; this is an AUDIT +
RECOMMENDATIONS, not an edit.

**Surface read at HEAD** (glass-ui working tree, 2026-06-04):
`src/components/custom/dock/{GlassDock,DockLayer,DockLayerGroup,DockIconButton,DockTabButton,DockSelectTrigger,DockDropdownTrigger}.vue`
+ `composables/{useDockState,dockContext,dockLayerContext,useLayerTransition,isTeleportedTarget}.ts`
+ `src/composables/dom/useTouchGate.ts` + `src/composables/reactive/useTimer.ts`
+ `src/styles/dock.css` (1154 lines) + `__tests__/*` (3 files) +
`src/dock.ts` (subpath barrel) + `src/components/custom/dock/index.ts`.

**Headline.** The dock is well-built and the live AT tranche is already
perfecting it (W6/W7, PLANNED) — BUT **ASK-1 (the collapsed-pill double-tap)
is a real, currently-UNAUDITED gap.** The two AT dock audit lenses that should
own it (B4 interaction+a11y, B6 state-audit-adversarial) cover focus,
click-away, FLIP edges, and aria, but NEITHER diagnoses the `useTouchGate`
two-tap. The AT.W1b design slice's §0 verdict — *"No lens found a SHIPPED dock
bug"* — is wrong by one bug, and that bug is exactly ASK-1. §2 below grounds
the root cause in `useTouchGate.ts:123-162` + `GlassDock.vue:268-294`.

---

## §1 — The full dock API surface

### 1.1 — Subpath + barrel

| Export path | Surface |
|---|---|
| `@mkbabb/glass-ui/dock` | `src/dock.ts` → `export * from "./components/custom/dock"` (`dock.ts:1`) |
| `src/components/custom/dock/index.ts` | 7 components + 2 composable-type cohorts + the dock-context DI primitives (`index.ts:1-32`) |

### 1.2 — Components (7)

**`<GlassDock>`** — the chassis (`GlassDock.vue`). The only stateful component;
everything else is presentational or a reka-ui forward.

*Props* (`GlassDock.vue:10-98`, all with defaults):

| Prop | Type | Default | Contract |
|---|---|---|---|
| `collapseDelay` | `number` | `2000` | ms before auto-collapse after mouseleave |
| `startCollapsed` | `boolean` | `true` | initial state when not `alwaysExpanded` |
| `fitContent` | `boolean` | `false` | shrink-wrap; forced true for `rail`/`instrument-strip` (`:129-133`) |
| `position` | `"fixed"\|"inline"\|"sticky"` | `"inline"` | placement class; `fixed` adds `bottom-[var(--dock-pos)]` (`:324`) |
| `alwaysExpanded` | `boolean` | `false` | disables collapse; OR'd with `orientation==="vertical"` (`:128`) |
| `wrap` | `boolean` | `false` | multi-line expanded content (**0 consumers — AT.W7 deletes it**) |
| `variant` | `"dock"\|"rail"\|"instrument-strip"` | `"dock"` | silhouette + surface vocabulary |
| `shape` | `"pill"\|"rounded"` | `"pill"` | corner treatment for vertical rails |
| `orientation` | `"horizontal"\|"vertical"` | `"horizontal"` | layout axis; animates width vs height |
| `density` | `"compact"\|"comfortable"\|"spacious"\|"audacious"` | `"comfortable"` | padding/gap/control-size token set (`dock.css:89-145`) |
| `overflow` | `"grow"\|"scroll"` | `"grow"` | overflow strategy; `scroll` → `.dock-scroll-x/y` (`:124-127`) |
| `containerName` | `string` | — | establishes inline-size container subject + lifts the clip (`:100-107`) |

*Slots*: default (full/expanded body), `#collapsed` (summary pill — horizontal
only; vertical renders the single default slot, `:350-374`).

*Exposed* (`defineExpose`, `:311`): `expanded`, `isPinned`, `isHeld`,
`isTransitioning`, `expand()`, `collapse()`, `keepOpen()`, `release()`.

*Events*: none declared — interaction is internal (mouse/focus/touch handlers
on the root). The consumer drives via the exposed imperative handle + the
provided context.

*Provides*: `DOCK_CONTEXT_KEY` via `provideDockContext({ id, orientation,
keepOpen, release, held })` (`:167-173`).

**`<DockLayerGroup>`** (`DockLayerGroup.vue`) — a stack of `<DockLayer>` panes
with a switcher rail + crossfade. Props: `orientation?`, `showRail?` (default
true, hidden at ≤1 layer), `railPosition?` (`"start"|"end"`, default `start`).
`v-model:active` (required string, `:38`). Provides `DOCK_LAYER_GROUP_KEY`.
Mints its own `view-transition-name` from `useId()` (`:69-77`).

**`<DockLayer>`** (`DockLayer.vue`) — a named pane. Props: `id` (required),
`label?`, `icon?` (`Component|string`). Registers with the parent group on
mount, unregisters on unmount (`:29-39`). The inert+pointer-events triad on
inactive layers (`:48-50`).

**`<DockIconButton>`** (`DockIconButton.vue`) — fixed-square icon button.
Props: `compact?`, `type?` (default `"button"`), `as?`/`asChild?` (reka-ui
`Primitive` idiom), `class?`. Styling owned by `dock.css`.

**`<DockTabButton>`** (`DockTabButton.vue`) — auto-sized text-tab. Props:
`as?`, `asChild?`, `class?`. `data-tier="primary"` composes `btn-audacious`
(`:32-37`).

**`<DockSelectTrigger>`** (`DockSelectTrigger.vue`) — forwards reka-ui
`SelectTriggerProps` + `class?`. Built-in chevron via `#icon` slot. Does NOT
hover-scale (so dropdown content anchors smoothly, `:11-13`).

**`<DockDropdownTrigger>`** (`DockDropdownTrigger.vue`) — forwards reka-ui
`DropdownMenuTriggerProps` + `type?` + `class?`. DOES hover-scale (unlike
SelectTrigger).

### 1.3 — Composables + DI (exported)

| Export | From | Contract |
|---|---|---|
| `useDockState(options)` | `composables/useDockState.ts:76` | three-state machine `"collapsed"\|"hover"\|"pinned"` + ref-counted child holds; returns `UseDockStateReturn` (`:29-56`) |
| `useLayerTransition(options)` | `composables/useLayerTransition.ts:49` | VT-or-FLIP crossfade + size morph between grid-stacked panes; `UseLayerTransitionReturn` |
| `isTeleportedTarget(target, ownerId?)` | `composables/isTeleportedTarget.ts:9` | detects dock-owned portals via `data-glass-dock-portal` / `data-glass-dock-owner` |
| `DOCK_CONTEXT_KEY` / `provideDockContext` / `useDockContext` (strict) / `useOptionalDockContext` (silent) | `composables/dockContext.ts` | typed-key DI: `{ id, orientation, keepOpen, release, held }` (`:27-58`) |
| `DOCK_LAYER_GROUP_KEY` / `provideDockLayerGroupContext` / `useDockLayerGroupContext` / `useOptionalDockLayerGroupContext` | `composables/dockLayerContext.ts` | layer-registration DI (`:20-49`) |
| types: `UseDockStateOptions`, `UseDockStateReturn`, `DockState`, `DockContext`, `DockOrientation`, `DockLayerDescriptor`, `DockLayerGroupContext`, `UseLayerTransitionOptions`, `UseLayerTransitionReturn` | `composables/index.ts` | re-exported through the `/dock` subpath (`index.ts:16,25-32`) |

`useTouchGate` is **NOT** exported from `/dock` — it lives at
`src/composables/dom/useTouchGate.ts` and is exported from the `dom`
composables barrel (it is also consumed by `<Slider>` per the N tranche wire,
`docs/tranches/N/FINAL.md:23`). `GlassDock` is its primary dock consumer
(`GlassDock.vue:3,136`).

### 1.4 — State-machine contract (the load-bearing detail)

`useDockState` (`useDockState.ts:58-353`):
- States: `collapsed` (closed) → `hover` (mouse/focus-driven, timer-collapses)
  → `pinned` (click-locked, only click-away dismisses). `alwaysExpanded` forces
  `pinned` (`:79-85,316-330`).
- `keepOpen()`/`release()` ref-count (`keepOpenCount`, `:92`) suppresses
  TIMER-based collapse but NOT explicit click-away (`:282-284`). `release()` has
  an 800ms grace window (`:251-263`).
- Click-away is a capture-phase `pointerdown` on `document`, installed one rAF
  after expand to dodge the opening event (`:287-314`), suppressed during
  transitions (`:278`) and for teleported targets (`:280`).
- `dismissOpenOverlays()` dispatches a synthetic body `pointerdown` so portals
  self-dismiss without the dock querying library internals (`:141-148`).

`useTouchGate` (`useTouchGate.ts:60-202`) is a SEPARATE per-control
tap-to-activate guard with a module-level shared `touchstart` registry
(`:21-52`) for outside-tap deactivation. Two timers: a 150ms `pendingTimer`
(`:74-80`) and a `deactivateDelayMs` auto-deactivate (`:70-72`).

---

## §2 — The double-click bug (ASK-1) — root cause

**Symptom (ASK-1).** A collapsed glass dock requires TWO taps on touch: tap 1
expands the pill; tap 2 dispatches the intended control. The demo masks it with
`:always-expanded="isMobile"` (`demo/@/components/custom/dock/TopDock.vue:117`).

### 2.1 — The gate logic, quoted

The collapsed-dock first-tap path runs entirely through `GlassDock`'s touch
handlers delegating to `useTouchGate`. The decisive lines:

`GlassDock.vue:268-294` (the three handlers; gating only when collapsed +
horizontal, `:264-266`):

```ts
function onTouchStart(event: TouchEvent): void {
    if (!shouldGateTouch() || visualExpanded.value) return;
    const root = dockEl.value;
    const touch = event.touches[0];
    if (!root || !touch) return;
    if (!touchGate.handleTouchStart(root, touch.clientY)) {
        event.preventDefault();
        event.stopPropagation();          // ← swallows the tap that should also ACT
    }
}
...
function onTouchEnd(event: TouchEvent): void {
    if (!shouldGateTouch()) return;
    const wasActive = touchGate.isActive.value;
    touchGate.handleTouchEnd();
    if (!wasActive && touchGate.isActive.value && !visualExpanded.value) {
        event.preventDefault();
        event.stopPropagation();          // ← swallows it again on the end half
        expand();                          // ← FIRST tap does ONLY expand
    }
}
```

`useTouchGate.ts:123-162` (the gate the above delegates to):

```ts
function handleTouchStart(el: HTMLElement, clientY: number): boolean {
    if (!isTouchDevice) return true;
    controlEl = el;
    if (isActive.value) {            // already-activated control → pass through
        resetTimer();
        return true;
    }
    clearPendingTimer();
    isPending = true;                // first contact → PENDING, not active
    initialTouchY = clientY;
    pendingTimer.start(150);
    return false;                    // ← returns false → caller preventDefaults
}
...
function handleTouchEnd(): void {
    if (!isTouchDevice) return;
    if (isPending && controlEl) {
        clearPendingTimer();
        activate(controlEl);         // ← end of FIRST tap merely flips isActive
        return;
    }
    if (isActive.value) {
        resetTimer();
    }
}
```

### 2.2 — Why the first tap expands-but-does-not-act

The gate's whole contract is *"the first tap activates the control unless it
turns into a vertical scroll"* (`useTouchGate.ts:55-58`). Trace the collapsed
dock:

1. **Tap 1, touchstart.** `isActive` is `false`, so `handleTouchStart` returns
   `false` (`:138`). `GlassDock.onTouchStart` reads that false and
   `preventDefault()` + `stopPropagation()` the event (`GlassDock.vue:274-277`)
   — the touch never reaches the inner control.
2. **Tap 1, touchend.** `isPending` is still true, so `handleTouchEnd` calls
   `activate(controlEl)` (`:154-156`) → `isActive` flips to `true`.
   `GlassDock.onTouchEnd` sees `!wasActive && isActive` and runs `expand()`
   (`GlassDock.vue:289-293`) — **but the control underneath never received a
   click. The dock is now open; nothing fired.**
3. **Tap 2, touchstart.** Now `isActive` is `true`, so `handleTouchStart`
   returns `true` (`:128-131`); `onTouchStart` ALSO early-returns because
   `visualExpanded.value` is now true (`:269`). The touch passes through to the
   inner `DockIconButton`/`DockSelectTrigger`, which finally fires.

So the gate's "first tap activates the control" is true only for a STANDALONE
control (Slider) where activation IS the action. For the DOCK, the gate's
"activate" means "expand the chassis," and the chassis intentionally **decouples
expansion from the inner control's click** — `preventDefault`+`stopPropagation`
on both touch halves guarantees the inner control never sees tap 1. The control
binds a `@click`, and a prevented touch sequence emits no compatibility click.
That is the structural two-tap: tap 1 is spent entirely on the chassis;
the control is only reachable on tap 2.

The 150ms `pendingTimer` (`:74-80,136`) is a scroll-vs-tap disambiguation
window, not the bug — it correctly cancels on a >10px `clientY` delta
(`handleScrollCheck`, `:141-150`). The bug is that even when the window resolves
to a TAP, the resolution is "expand only," never "expand AND forward."

### 2.3 — The idiomatic fix shape (recommendation, glass-ui-owned)

The fix is NOT to drop the gate (it correctly distinguishes scroll from tap on a
floating pill) — it is to make tap 1's resolved-tap branch **expand AND replay
the intended action** in one gesture. Two idiomatic shapes, in order of
preference:

- **(A) Collapsed-pill-as-single-button (cleanest, matches the disclosure
  mental model).** When collapsed, the dock IS one full-pill disclosure button
  (`#collapsed` already wires `@click="onClickCollapsed"` →
  pinned, `GlassDock.vue:366`). On a coarse pointer, treat the collapsed pill as
  a single target whose only job is "expand"; the user then taps the now-visible
  control. This makes the two-tap *intentional and legible* (tap the pill to
  open, tap the control to act) rather than a silent swallow — and it is exactly
  the AT.W1b §0 "the collapsed↔expanded dock is a disclosure" framing
  (`W0b-B4:52`). The current bug is that the collapsed dock LOOKS like it
  presents live controls (the summary slot can render an icon/label that invites
  a direct tap) but swallows the first tap on them. Either commit to
  "pill = expand-only, controls appear after" *visually* (so the first tap has
  no apparent target to miss), or do (B).

- **(B) Capture-and-replay the target on tap-1 resolve.** In `onTouchEnd`, when
  the gate resolves a real tap on a collapsed dock, after `expand()` resolve the
  `document.elementFromPoint(touch.clientX, touch.clientY)` of the touch, walk to
  the nearest dock control, and dispatch a synthetic `click` on it on the next
  frame (after the layer swap settles and the control is hit-testable —
  `dock.css:405-407` notes inactive layers leave the hit-test tree, so the replay
  must wait for `layer-active`). This is the "first tap both expands AND
  dispatches" literal reading of ASK-1. It is heavier (synthetic-click replay)
  and racier (must sequence after the expand transition), which is why (A) is
  preferred unless a consumer needs the controls live on the collapsed pill.

Either fix belongs in `useTouchGate`/`GlassDock` (glass-ui), gated by a
**touch-gate behavioural test** — which today does not exist (§4). The
keyframes-side enabler is none (ASK-1 is purely glass-ui-internal); the demo's
`:always-expanded="isMobile"` mask (`TopDock.vue:117`) stays until glass-ui
ships the fix, then is removed.

---

## §3 — What the API LACKS that consumers hand-roll

Grounded against the keyframes demo's one dock consumer
(`demo/@/components/custom/dock/TopDock.vue` + the local `index.ts` re-barrel).

1. **Safe-area insets — HAND-ROLLED in EVERY consumer.** `dock.css` contains
   ZERO `env(safe-area-inset-*)` (grep: 0 matches). The fixed-dock vertical
   offset is computed by the consumer:
   `TopDock.vue:114` —
   `top: calc(max(var(--work-area-top-offset, 0px), env(safe-area-inset-top, 0px)) + var(--dock-margin) / 4)`.
   `GlassDock position="fixed"` only emits `bottom-[var(--dock-pos)]`
   (`GlassDock.vue:324`) with no safe-area math. **Convergence:** glass-ui should
   own a `--dock-safe-inset-*` token (or a `safeArea?: boolean` prop) folding
   `env(safe-area-inset-*)` into the fixed/sticky placement — every fixed-dock
   consumer re-derives this `calc()`.

2. **Exclusion zones / work-area offset — HAND-ROLLED.** The
   `--work-area-top-offset` indirection in `TopDock.vue:114` is the consumer
   teaching the dock to avoid the app chrome. The dock has no notion of an
   exclusion zone or a host-chrome offset; consumers wrap the `<GlassDock>` in a
   `position:fixed` div and do the math themselves (`TopDock.vue:112-116`).
   **Convergence:** a `--dock-exclusion-*` / `offset` contract on the primitive.

3. **"always-expanded on mobile" — HAND-ROLLED, and it is ASK-1's scar tissue.**
   `TopDock.vue:65` (`const isMobile = useMediaQuery("(max-width: 1023px)")`) +
   `:117` (`:always-expanded="isMobile"`) exists ONLY to mask the §2 touch-gate
   bug. The breakpoint, the media-query composable, and the binding are all
   consumer-side. When ASK-1 ships, this whole stanza is deleted.
   **Convergence:** once the gate fix lands, the dock needs no `isMobile` prop —
   the gate works at any width. (Note: the AT.W7 overflow audit already flags a
   `640px` magic MQ in `dock.css` for tokenization, `AT.W1b-dock.md:75` — the
   same class of consumer-magic the dock should absorb.)

4. **Popup mutex (exclusive-open) — HAND-ROLLED.** `TopDock.vue:81-103` builds a
   `PopupKey` union + `openPopup` ref + `popupModel()` getter/setter +
   `watch(isAnyOpen)` → `keepOpen()`/`release()`. This is the
   "only one dropdown open at a time, and hold the dock open while any is open"
   pattern. The keyframes demo ALSO has a standalone `useExclusiveSelect.ts`
   composable for the same job (`demo/CLAUDE.md` §Composables). **Two+ consumers
   re-implement single-open mutex.** glass-ui already ships the half it needs
   (`keepOpen`/`release` via the dock context) — but the *mutex* + the
   *open↔keepOpen binding* are re-rolled. **Convergence:** a
   `useDockExclusivePopups()` (or a `<DockPopupGroup>` wrapper) in glass-ui that
   owns the single-open invariant AND auto-binds open→`keepOpen`/`release`,
   killing the `TopDock.vue:81-103` boilerplate.

5. **expanded→host-state sync — HAND-ROLLED.** `TopDock.vue:74-79` reads the
   exposed `dockRef.value?.expanded` and pushes it into a
   `CONTROLS_PANE_HOVER_KEY` inject. The dock exposes `expanded` (good) but emits
   no `update:expanded` / `@expand` / `@collapse` event, so the consumer must
   `watch` the exposed ref through a template ref. **Convergence:** declare
   `@expand` / `@collapse` (or `v-model:expanded`) events on `<GlassDock>` so the
   sync is declarative, not a template-ref `watch`.

6. **A11y names on triggers — PARTIALLY hand-rolled, with a known gap.** The
   consumer supplies `aria-label` on every `DockSelectTrigger`
   (`TopDock.vue:146,172`) and `:title` on `DockIconButton` (`:123`). The dock
   primitives do NOT require or default an accessible name — they forward
   `$attrs`, so a consumer that forgets `aria-label` ships a nameless control.
   The AT B4 lens already books the presentational-root aria contract
   (no `aria-expanded` on root) as doc-only/un-gated (`W0b-B4:28`), and the
   rail's `aria-pressed` → should-be-`aria-selected`+tablist
   (`AT.W1b-dock.md:38-41`). **Convergence:** the AT W6 a11y contract test
   (PLANNED) should also assert "every dock control has an accessible name,"
   and the icon-button could accept a required `label`/`aria-label` when no text
   child is present. This dovetails with **ASK-3** (LabeledField `<label>`
   association) — same a11y-naming class, different component.

7. **View-transition names — glass-ui-PROVIDED (NOT hand-rolled — note as a
   strength).** `GlassDock.vue:205-214` + `DockLayerGroup.vue:67-77` mint
   per-instance `view-transition-name` from `useId()` with a `gl-dock-layer`
   group class, only on a supporting engine. The consumer does nothing. This is
   the right shape; the AR inv-η test (`__tests__/GlassDock.vt-names.test.ts`)
   guards pairwise-distinctness. **No gap here.**

8. **Density override tokens — glass-ui-PROVIDED.** `dock.css:89-145` exposes a
   full `--dock-density-{compact,comfortable,spacious,audacious}-*` override
   ladder. Consumers theme without forking. **No gap.**

**API gaps glass-ui should close (priority order):** (a) the touch-gate fix
(ASK-1, §2) — the only correctness bug; (b) safe-area/exclusion tokens (#1, #2)
— every fixed consumer re-derives the `calc()`; (c) the exclusive-popup
primitive (#4) — 2+ consumers re-roll it; (d) `@expand`/`@collapse` events (#5);
(e) the required-accessible-name contract (#6, folds into AT W6).

---

## §4 — Dock tests: coverage + gaps

Three test files, ALL structural (class-hook / id assertions; ZERO behavioural):

| File | Asserts | Kind |
|---|---|---|
| `GlassDock.instrument-strip.test.ts` | the `variant-instrument-strip` class hook + the `orientation`/`fitContent` computed branches (`:19-64`) | structural |
| `GlassDock.scroll-overflow.test.ts` | the `dock-scroll-x`/`dock-scroll-y` axis class derives from `orientation`/`variant` (`:19-63`) | structural |
| `GlassDock.vt-names.test.ts` | `dockId` is pairwise-distinct across two docks (AR inv-η, `:37-65`) | structural (id) |

**Coverage gaps (every behaviour is untested):**

- **The touch-gate (ASK-1) — ZERO coverage.** No test mounts a collapsed dock,
  simulates `touchstart`/`touchend`, and asserts the inner control fired. This
  is precisely WHY the §2 bug shipped and why the AT lenses missed it — there is
  no fabric that would catch it. **This is the single highest-value test to
  add.** (And it must be added alongside the fix, or the fix can regress.)
- **The state machine — ZERO behavioural coverage.** The AT B6 lens flags this
  directly: *"the 3 dock tests cover class-hooks + ids only, never the state
  machine ... `useDockState` (0% behavioural)"* (`W0b-B6:38`). Untested:
  hover→collapse timer, click→pinned, keepOpen/release ref-counting + the 800ms
  grace, click-away, the `isTeleportedTarget` ownership branch (the
  fourier-class no-op origin, `W0b-B6:38`), `alwaysExpanded` forcing.
- **`useLayerTransition` FLIP — UNTESTED.** The B6 lens notes a real FLIP edge
  (unguarded `transition="none"` during a `ResizeObserver`-driven resize,
  `W0b-B6:36` / `useLayerTransition.ts:150-185`) with no coverage.
- **A11y contract — UNTESTED (asserted in prose only).** No test guards
  "no `aria-expanded` on root" (`W0b-B4:28`), the rail tablist role, or
  accessible names.
- **Strict-templates / silent-no-op binding — NO GUARD.** The `overflow="scroll"`
  kebab-prop silently no-op'd until declared (the W7 `00bd5f9` bug,
  `W0b-B6:29`); no `strictTemplates` enforcement.

The AT tranche (§5) PLANS exactly these gates (W6-dock-a strict-templates,
W6-dock-b state-machine spec, the a11y contract test) — but **none of the four
planned gates is the touch-gate behavioural test.** ASK-1 has no booked gate.
**Recommendation:** the AT W6 dock state-machine spec should be extended (or a
W6-dock-d added) to cover the touch path: collapsed dock + simulated tap →
assert inner control fired in ONE gesture (post-fix).

---

## §5 — glass-ui dock-forward wave / tranche state

The live dock-forward tranche is **AT** (glass-ui@3.3.0, post-AS). The dock is a
co-headline ("Perfect the dock," `AT.md` §intro). State (`AT/PROGRESS.md`):

- **AT.W0 / W0b — DONE.** A 24-lens audit; six dock lenses (W0b-B1..B6: three
  frontend-design — icon, layer+rail, animation+slide; three SOTA-research —
  interaction+a11y, orientation+overflow, state-audit-adversarial). The dock
  design slice `AT/design/AT.W1b-dock.md` synthesizes them.
- **AT.W1 — DONE (authored).** Design slices, incl. `AT.W1b-dock.md`. END OF DEV
  BOUNDARY.
- **AT.W6 — PLANNED (IMPL).** Four dock slices:
  - W6-dock-a: `proof:strict-templates` — `strictTemplates`/`checkUnknownProps`
    in all three tsconfigs, making `<GlassDock bogus-prop>` a RED typecheck
    (closes the silent-no-op class library-wide). **Lands first.**
  - W6-dock-b: the a11y + state-machine contract test — rail `role="tablist"` via
    reka-ui `Tabs`, single-`tabindex=0` roving, `:focus-visible` on every
    control, no `aria-expanded` on root, keep-dock-open contract, the
    inert+pointer-events triad no-regression.
  - W6-dock-c: the VT-fork motion-parity reconcile — mint
    `--dock-resize-spring: var(--spring-snappy)` so the native VT path and the
    FLIP fallback feel identical (AQ.W6 left them divergent); `isTransitioning`
    must track the actual morph (≥2-dock rapid A→B→A concurrency).
- **AT.W7 — PLANNED (IMPL).** The overflow clean break (`wrap`/`overflow`/
  `containerName` 3-prop accretion → one `overflow: "grow"|"wrap"|"scroll"`
  enum; **`wrap` boolean DELETED — 0 consumers**, no alias) + design refinements
  (press canon 0.92→0.96, glass icon-hover → `--glass-highlight`, scoped spring
  micro-feedback, the travelling rail-indicator on reka-ui Tabs) + the
  `proof:doc-consistency` doc-rot sweep.
- **BOOKed (no bar yet):** dock magnification (`useDockMagnify` ready, 0 firm
  consumers, `AT.W1b-dock.md:105,128-133`), expand-stagger, pane-VT directional
  slide, `overflow:"clip"`, typed `tier` prop.

**Critical cross-reference for the lead.** The AT.W1b §0 verdict —
*"No lens found a SHIPPED dock bug"* (`AT.W1b-dock.md:12`) — is **falsified by
ASK-1**. The collapsed-pill double-tap (§2, `useTouchGate.ts:123-162` +
`GlassDock.vue:268-294`) is a shipped touch-interaction bug that NEITHER the B4
interaction+a11y lens NOR the B6 adversarial-state lens diagnosed (verified:
grepping both lenses for `touch`/`tap`/`double`/`collapsed.*click` surfaces
focus, click-away, FLIP, and aria findings — but never the touch-gate two-tap).
**The AT dock perfection wave should ABSORB ASK-1** as a W6/W7 slice
(touch-gate fix + the touch behavioural test) before AT closes — it is exactly
in scope ("perfect the dock"), file-disjoint from the blob graph, and the only
correctness defect the lenses missed. Routed outward to the constellation ledger
(`HUB/docs/constellation/ADOPTION-ASKS.md`, fourier-owned per inv-16) by the
lead; keyframes authors this audit + the standing ASK-1, removes the
`always-expanded` mask once glass-ui ships.

---

## §6 — Refined recommendations (routed to glass-ui, inv-16)

1. **[ASK-1, correctness, P0]** Fix the collapsed-pill double-tap in
   `useTouchGate`/`GlassDock`. Preferred shape (A): make the collapsed pill a
   single expand-only disclosure target (visually no live controls to mis-tap),
   committing to the §2.3-(A) disclosure model; fallback (B): capture-and-replay
   the touched control after expand. Gate with a NEW touch behavioural test.
   **Fold into AT.W6/W7** (the dock perfection wave) — it is in scope and the
   lenses missed it.
2. **[token, P1]** Add `--dock-safe-inset-*` (or `safeArea?` prop) folding
   `env(safe-area-inset-*)` into fixed/sticky placement — kills the
   `TopDock.vue:114` consumer `calc()`.
3. **[primitive, P1]** Ship `useDockExclusivePopups()` / `<DockPopupGroup>`
   owning the single-open mutex + auto-binding open→`keepOpen`/`release` — kills
   the `TopDock.vue:81-103` boilerplate; 2+ consumers re-roll it.
4. **[events, P2]** Declare `@expand`/`@collapse` (or `v-model:expanded`) on
   `<GlassDock>` — replaces the `TopDock.vue:77` template-ref `watch`.
5. **[a11y, P2]** In the AT.W6 a11y contract test, assert every dock control has
   an accessible name; consider a required `label` on `DockIconButton` lacking a
   text child. (Sibling to ASK-3's `LabeledField` association.)
6. **[token, P2]** Token-ize the consumer work-area/exclusion offset
   (`--work-area-top-offset` shape) into a dock-owned contract.

keyframes-side obligations: NONE beyond authoring this audit + ASK-1 and
removing the `:always-expanded="isMobile"` mask (`TopDock.vue:117`) once
glass-ui ships the gate fix. All edits land in glass-ui on its own clean
checkout, gated on its own CI (inv-16).
