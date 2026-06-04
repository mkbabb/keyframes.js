# glass-ui DOCK-FORWARD — the prioritized wave plan (keyframes proposes, glass-ui owns)

**Authored in keyframes.js, routed outward (inv-16).** keyframes does NOT
patch glass-ui — it audits the dock across the constellation and proposes the
waves glass-ui should run. The dock primitive at
`/Users/mkbabb/Programming/glass-ui/src/components/custom/dock/` +
`src/composables/dom/useTouchGate.ts` + `src/styles/dock.css` is
**glass-ui-OWNED**. Everything below is a WAVE SPEC for glass-ui's own
checkout, gated on its own CI. keyframes' only obligations are the named
enablers and the mask removals listed per wave.

**Provenance.** This refines four tranche-C dock audits + the two standing
asks (ASK-1, ASK-3), all in keyframes.js:
- `docs/tranches/C/audit/dock/glass-ui.md` — the SOURCE-OF-TRUTH audit (the API surface, the `useTouchGate` root cause, the test gaps).
- `docs/tranches/C/audit/dock/keyframes.md` — keyframes demo consumption (TopDock + AnimationMenuBar).
- `docs/tranches/C/audit/dock/value-js.md` — value.js consumption (the heaviest consumer: 4-layer dispatch, nested layer-group, popup-mutex, `useLayerTransition` fork).
- `docs/tranches/C/audit/dock/fourier.md` — fourier consumption (editor/canvas/animation triad).
- `docs/tranches/B/asks/glass-ui-adoption-asks.md` — ASK-1 (double-click), ASK-3 (LabeledField association).

**Grounded re-verification (this proposal, glass-ui working tree HEAD 2026-06-04).**
The lead wave's fix shape and the token waves' premises were re-checked
against live glass-ui source, not just the audits:
- `useTouchGate.ts:60-202` — the gate exactly as the audits quote it (`handleTouchStart` returns `false` on first contact `:138`; `handleTouchEnd` calls `activate` on the pending branch `:154-156`, never forwarding the tap).
- `GlassDock.vue:268-294` — `onTouchStart`/`onTouchEnd` `preventDefault`+`stopPropagation` BOTH touch halves and call `expand()` only (`:289-293`); the collapsed summary is a `<div … @click="onClickCollapsed">` (`:363-369`), not a button.
- `dock.css` — `grep safe-area-inset` → **0 matches** (every fixed/sticky consumer hand-rolls `env(safe-area-inset-*)`); `--dock-control-size` defaults `2.5rem` comfortable / `2rem` compact (`dock.css:92,107`) — sub-44px on coarse pointers.

---

## §0 — The constellation gestalt (why these waves, in this order)

Three independent consumers (keyframes demo, value.js, fourier) and the
glass-ui source audit converge on a small, sharply-ranked set of findings.
The signal is the **multiplicity**: a finding that one consumer hand-rolls is
a curiosity; a finding that 2–3 hand-roll the SAME shape is an upstream
mandate. Tallying the four audits by consumer-count:

| Finding | glass-ui audit | keyframes | value.js | fourier | consumers | verdict |
|---|---|---|---|---|---|---|
| **Collapsed-pill double-tap (touch-gate)** | §2 root cause | masked `always-expanded=isMobile` | masked `always-expanded=!isDesktop` | UNMASKED, more exposed | **3 + source** | **P0 correctness — lead wave** |
| **Single-open popup mutex + `isAnyOpen→keepOpen/release`** | §3.4 | `popupModel` + `useExclusiveSelect` (2 copies) | `usePopupMutex` (85 LOC) | (parent `v-if` mutex) | **3** | **P1 convergence** |
| **Safe-area / exclusion-zone placement** | §3.1, §3.2 | `calc(max(--work-area, env(safe-area-inset)))` | `pb-[max(…env(safe-area-inset-bottom))]` | (anchored, same class) | **2+** | **P1 token primitive** |
| **`expanded`→host event (`@expand`/`v-model:expanded`)** | §3.5 | template-ref `watch` | template-ref read | fourier ALREADY got `update:expanded` (F12) | **3** | **P1 — fourier proves the shape** |
| **`useLayerTransition` too low-level (forked)** | §1.3 strength | (single static layer) | FORK, drifted behind native-VT+axis | (rides it via scrubber) | **1 fork + 1 latent** | **P2 ergonomic gap** |
| **Required accessible name on controls** | §3.6 | title-only (all named) | aria-pressed→aria-selected | StatusDot/indicator slot | **3** | **P2 a11y contract** |
| **`DockSelectTrigger` label clamp / auto-pin** | (forward) | manual `keepOpen` watch | `line-clamp-none` hack (7 tranches) | — | **2** | **P2 trigger contract** |
| **In-dock free-text badge** | — | `dock-badge` copy | — | `.dock-badge` "N pts" | **2** | **P3 primitive** |
| **`.dock-separator`/`.dock-spacer` local re-def** | provided | uses provided | — | FORKED (3×) | **1 fork** | consumer-side delete (not a glass-ui wave) |

The waves below are the **glass-ui-runnable** clusters of this table, ordered
by (correctness > multiplicity > effort). Each wave names the consumer
findings it RETIRES across all three repos, so glass-ui can see the
blast-radius of each landing. Findings that are consumer-side cleanups
(fourier's `dock-separator` delete; keyframes' internal `useExclusiveSelect`
converge) are NOT glass-ui waves — they're noted as keyframes/fourier-owned
follow-ups under the wave that makes them possible.

**The disqualifying frame to correct.** The live AT tranche's design slice
asserts *"No lens found a SHIPPED dock bug"* (`AT.W1b-dock.md:12`, per the
glass-ui audit §5). That is **falsified by three consumers** independently
landing the identical `always-expanded` mask for the identical root cause.
WAVE-1 exists to retire that false verdict.

---

## WAVE-1 — `dock:touch-gate` — the collapsed-pill first-tap fix (P0, LEAD)

**Thesis.** A collapsed glass dock on touch swallows the first tap to expand
the pill and only dispatches the intended control on the SECOND tap. This is
a shipped correctness bug in `useTouchGate` + `GlassDock`, independently hit
by all three consumers (two mask it, fourier is unmasked and *more* exposed).
It is the single highest-value dock carry in the constellation and the lead
wave because it is the only **correctness** defect — everything downstream is
ergonomics, tokens, or a11y.

### Scope — the fix (glass-ui-owned)

The gate is correct in spirit: it must distinguish a tap from a vertical
scroll on a floating pill (the 150ms `pendingTimer` + the >10px `clientY`
scroll-check, `useTouchGate.ts:74-80,141-150`, are sound and must stay). The
defect is narrow: **when the gate resolves a real TAP on a collapsed dock,
the resolution is "expand only," never "expand AND forward the intended
action."** Trace (re-verified against source):

1. **Tap-1 touchstart** — `isActive=false` → `handleTouchStart` returns `false` (`useTouchGate.ts:138`) → `GlassDock.onTouchStart` `preventDefault`+`stopPropagation` (`GlassDock.vue:274-277`). The inner control never sees the touch.
2. **Tap-1 touchend** — `isPending=true` → `handleTouchEnd` calls `activate(controlEl)` (`:154-156`) → `GlassDock.onTouchEnd` sees `!wasActive && isActive` → runs `expand()` (`GlassDock.vue:289-293`). **The dock opens; the control under the finger fired nothing.** A prevented touch sequence emits no compatibility `click`.
3. **Tap-2** — now `isActive=true` AND `visualExpanded=true`, so both gates short-circuit; the touch finally reaches the control.

**The two idiomatic shapes (in order of preference):**

- **(A) Collapsed-pill-as-single-disclosure (PREFERRED).** Commit the
  collapsed pill to being ONE expand-only disclosure target. The summary
  `<div>` is already `@click="onClickCollapsed"` (`GlassDock.vue:363-369`) —
  promote it to a real `<button>` with the disclosure semantics (WAVE-5
  a11y), and ensure the collapsed slot renders a **summary** affordance
  (label/icon that reads as "tap to open"), NOT live controls that invite a
  direct tap-and-miss. The two taps become *intentional and legible* — tap
  the pill to open, tap the control to act — matching the disclosure mental
  model. This is the cleanest landing and dovetails with WAVE-5 (the
  collapsed summary needs a button role anyway).
- **(B) Capture-and-replay (fallback, only if a consumer needs live
  collapsed controls).** In `onTouchEnd`, when the gate resolves a real tap
  on a collapsed dock, after `expand()`: resolve
  `document.elementFromPoint(touch.clientX, touch.clientY)`, walk to the
  nearest dock control, and dispatch a synthetic `click` on the NEXT frame
  AFTER the layer swap settles (inactive layers leave the hit-test tree —
  `dock.css` `.dock-layer` inert+pointer-events triad, and the audit's
  `dock.css:405-407` note — so the replay must wait for `layer-active`).
  Heavier and racier (must sequence after the expand transition); use only
  when (A)'s "controls appear after expand" is unacceptable.

**The reference implementation already exists in a consumer.** keyframes'
`AnimationMenuBar.vue:181-184` hand-wrote `onCollapsedPlayClick()` =
`dockRef.expand()` THEN `emit('togglePlay')` — the exact "expand-then-act in
one gesture" shape. glass-ui should generalize that hand-roll into the
primitive (keyframes audit §2 "point glass-ui at it"). Prefer shape (A) as
the general form; the consumer's handler is the shape (B) special-case for a
single known control.

**Why NOT the consumer masks.** `always-expanded` on mobile is the wrong fix:
it deletes the collapse/hover affordance entirely on touch (the very
viewport where the compact pill matters most), and it forces every consumer
to import a media-query composable + thread a breakpoint (`useMediaQuery` +
`isMobile`/`isDesktop` in keyframes AND value.js). The gate works at any
width once fixed; the masks then DELETE.

### Hard gate — a touch behavioural test (does not exist today)

This is the crux: **zero behavioural coverage exists for the touch path.**
All three dock tests are structural (class-hook / id assertions —
`GlassDock.instrument-strip.test.ts`, `GlassDock.scroll-overflow.test.ts`,
`GlassDock.vt-names.test.ts`; glass-ui audit §4). The bug shipped *because
there is no fabric that would catch it.* The gate for WAVE-1:

> Mount a collapsed horizontal `<GlassDock>` with a `DockIconButton` whose
> `@click` sets a spy. Simulate `touchstart`→`touchend` on the collapsed
> pill (jsdom touch events, `ontouchstart` shimmed so `isTouchDevice` is
> true). Assert in ONE gesture: (a) the dock is now expanded, AND (b) for
> shape (A) — the intended control becomes reachable and a second tap fires
> it with NO further expand; for shape (B) — the control's `@click` spy
> fired exactly once. Plus the scroll-cancel test: `touchstart` →
> `touchmove` >10px `clientY` → `touchend` does NOT expand (scroll
> preserved). **The fix MUST ship with this test or it can silently
> regress.**

### Retires (across all 3 repos)

- keyframes: deletes `TopDock.vue:117` `:always-expanded="isMobile"` + the `isMobile`/`useMediaQuery` stanza (`:65`); the `AnimationMenuBar.vue:181-184` `onCollapsedPlayClick` workaround becomes redundant (glass-ui audit §6, keyframes audit C2).
- value.js: deletes `Dock.vue:93` `:always-expanded="!isDesktop"` + the `isDesktop`/`useMediaQuery` (`:66`) (value.js audit C1, WORKAROUND A).
- fourier: removes the standing exposure on all three collapse-on-load docks (`EditorControlsDock.vue:56`, `CanvasControlsDock.vue:41`, `AnimationControls.vue:58-63`) — fourier never masked, so this is pure UX repair (fourier audit C-F3).
- the false AT.W1b §0 "no shipped dock bug" verdict is retired.

**keyframes enabler:** NONE (purely glass-ui-internal). The masks stay until
glass-ui ships, then DELETE. **Fold into AT.W6/W7** (the live "perfect the
dock" tranche) — it is in scope, file-disjoint, and the only correctness
miss.

---

## WAVE-2 — `dock:popup-mutex` — the single-open primitive + auto-pin (P1)

**Thesis.** "A set of dock dropdowns, only one open at a time, with a swap
delay, and the aggregate `isAnyOpen` pins the dock open via
`keepOpen`/`release`" is re-implemented by THREE consumers in three different
shapes. glass-ui ships the *half* it needs (`keepOpen`/`release` on the dock
context) but not the mutex nor the `open↔keepOpen` bridge — so every consumer
re-derives the bridge by hand. This is the highest-multiplicity convergence.

### Scope — `useDockPopupMutex()` + auto-pinning trigger (glass-ui-owned)

Two-part landing:

1. **`useDockPopupMutex<K>()` composable** owning the single-open invariant
   AND the swap delay AND the auto-bind of `isAnyOpen → keepOpen()/release()`
   against the dock context (`useOptionalDockContext`, `dockContext.ts:31-33`).
   Consumers register popup keys and get back per-key `v-model:open` proxies;
   the composable arbitrates exclusivity and pins the dock. This is the
   union of all three consumer implementations.
2. **Auto-pinning `DockSelectTrigger`/`DockDropdownTrigger`** (the value.js
   D4 gap): the trigger should `keepOpen()` while its own dropdown is open
   and `release()` on close, so the SIMPLE single-dropdown case needs no
   consumer wiring at all. The mutex composable is for the MULTI-popup case;
   auto-pinning is for the single-popup case. Both kill `watch(isAnyOpen)`
   boilerplate.

The three consumer shapes to unify:
- keyframes `TopDock.vue:82-103` — `openPopup` ref + `popupModel(key)` get/set computed + `watch(isAnyOpen) → keepOpen/release`. PLUS a second copy: `demo/@/composables/useExclusiveSelect.ts` (the convergence test fires WITHIN keyframes — 2 copies in one repo).
- value.js `composables/usePopupMutex.ts` (85 LOC) — single-open across 4 popups + a **180ms swap delay** + `isAnyOpen → keepOpen/release` at `Dock.vue:73`. The header comment claims it "was retired upstream at the D-II tranche" but `grep` of current glass-ui finds NO equivalent — value.js carries it alone.
- fourier — coordinates its multi-dock-at-one-anchor by parent `v-if` mutual exclusion (a degenerate mutex), not a composable; would adopt the primitive for the dropdown case.

**The swap delay is load-bearing** (value.js's 180ms) — it prevents a flash
of "all closed" when switching directly from popup A to popup B. The
primitive must expose it (default to the value.js-proven 180ms).

### Hard gate

> A state test mounting a dock with ≥2 popups via `useDockPopupMutex`:
> opening B while A is open closes A (single-open); the dock's
> `keepOpenCount` stays ≥1 across the A→B swap (the swap delay holds the
> pin — no collapse flash); closing the last popup releases the pin after
> the grace window; auto-pinning trigger holds the dock open for its own
> dropdown's lifetime with zero consumer `keepOpen` calls.

### Retires

- keyframes: `TopDock.vue:82-103` (the inline `popupModel` + watch) AND collapses the `useExclusiveSelect.ts`/`popupModel` duplication (keyframes audit C1, glass-ui audit §3.4). *Note: keyframes should ALSO converge its two internal copies onto `useExclusiveSelect` NOW (keyframes-owned, pre-glass-ui) — a bookable C cleanup independent of this wave.*
- value.js: deletes `usePopupMutex.ts` (85 LOC) + the `Dock.vue:73` `isAnyOpen→keepOpen/release` wire (value.js audit C3).
- value.js + keyframes: the manual `keepOpen`/`release` watch (value.js `Dock.vue:60-73`, keyframes `TopDock.vue:100-103`, the D4 gap).

**keyframes enabler:** internal converge of the two mutex copies onto one
(keyframes-owned, lands in C); then route to the glass-ui primitive when it
ships.

---

## WAVE-3 — `dock:placement` — safe-area + exclusion-zone primitives (P1)

**Thesis.** `dock.css` contains ZERO `env(safe-area-inset-*)` (verified:
`grep safe-area-inset dock.css` → 0). Every fixed/sticky dock consumer
re-derives the safe-area `calc()` AND the host-chrome exclusion offset by
hand. `GlassDock position="fixed"` emits only `bottom-[var(--dock-pos)]`
(`GlassDock.vue:324`) with no safe-area math and no notion of an app-chrome
exclusion band.

### Scope — placement tokens + a `safeArea`/`offset` contract (glass-ui-owned)

1. **Safe-area insets.** Add `--dock-safe-inset-{top,right,bottom,left}`
   tokens (or a `safeArea?: boolean` prop, default `true` for `fixed`/`sticky`)
   that fold `env(safe-area-inset-*)` into the fixed/sticky placement. The
   primitive should own the `max(margin, env(safe-area-inset-*))` pattern that
   every consumer writes.
2. **Exclusion / work-area offset.** A `--dock-exclusion-*` (or an `offset`
   prop) contract so a consumer can tell the dock to avoid the app chrome
   WITHOUT wrapping it in a hand-positioned `fixed` div. The dock should also
   PUBLISH its own reserved band (its size tokens, `--dock-icon-height`
   shape) so callers can derive a symmetric exclusion from one source.

The consumer hand-rolls this wave retires:
- keyframes `TopDock.vue:114` — `top: calc(max(var(--work-area-top-offset, 0px), env(safe-area-inset-top, 0px)) + var(--dock-margin) / 4)`; AND `AnimationMenuBar.vue:4,7` — `pb-[max(calc(var(--dock-margin)/2),env(safe-area-inset-bottom))]` + `bottom: var(--work-area-bottom-offset)`.
- value.js — the symmetric inline-in-fixed-wrapper pattern (`Dock.vue` placement, value.js audit D2).
- fourier — anchors its docks at fixed points (the same placement class).

**Nuance (the keyframes audit is right here).** When `position="inline"`, the
consumer LEGITIMATELY owns placement — that's the intended escape hatch (the
demo wants top-center, not glass-ui's bottom-center default). This wave does
NOT take placement away from inline docks. It closes the gap for
`fixed`/`sticky` docks (where glass-ui already owns the anchor but omits the
safe-area math) AND offers the exclusion-token contract as an OPT-IN so
inline consumers can derive their offset from a dock-owned token instead of a
demo-local `--work-area-*-offset`.

### Hard gate

> A computed-style test: `<GlassDock position="fixed">` in a viewport with a
> simulated safe-area inset resolves its bottom offset to
> `max(--dock-margin-derived, env(safe-area-inset-bottom))` (jsdom can't
> evaluate `env()` — assert the emitted `calc()`/custom-prop expression
> contains the safe-area term, the structural analogue of the existing
> `scroll-overflow` class test). Plus: `safeArea={false}` omits the term.

### Retires

- keyframes: the `TopDock.vue:114` `calc(max(…env…))`; the `AnimationMenuBar.vue:4,7` `pb-[max(…)]` (glass-ui audit §3.1; keyframes audit 1.2-d). The demo-owned `--work-area-{top,bottom}-offset` tokens (`style.css:19-26`) become a thin alias over the dock-published exclusion band.
- value.js: the inline-in-fixed-wrapper safe-area math (value.js audit D2).
- consolidates the AT.W7 `640px` magic-MQ tokenization concern (same "consumer-magic the dock should absorb" class, glass-ui audit §3.3 note).

**keyframes enabler:** NONE (glass-ui-internal). On landing, keyframes
rewrites `--work-area-*-offset` as a derived alias.

---

## WAVE-4 — `dock:expand-events` — declarative `@expand`/`v-model:expanded` (P1)

**Thesis.** The dock exposes `expanded` via `defineExpose`
(`GlassDock.vue:311`) but declares NO `@expand`/`@collapse`/`update:expanded`
event, so consumers that need to react to expansion must reach through a
template ref and `watch` the exposed ref — out-of-band coupling.
**fourier ALREADY proved the fix** by getting `update:expanded` landed for
its canvas dock (fourier audit F12: `CanvasControlsDock.vue:26,34-37` →
parent `v-model:expanded`). This wave generalizes fourier's proven shape to
the base `<GlassDock>` so keyframes and value.js stop using template-ref
watches.

### Scope (glass-ui-owned)

Declare `@expand` / `@collapse` and `update:expanded` on `<GlassDock>` (enabling
`v-model:expanded`). This is the smallest wave — fourier's `CanvasControlsDock`
wrapper already does it one level up; pull it into the primitive. The
`update:expanded` event must fire on the SAME transitions that flip
`visualExpanded` (`GlassDock.vue:302` watch), so the host stays in lockstep
with the visual state, not the raw `expanded` ref.

### Hard gate

> A test asserting `update:expanded` (and `@expand`/`@collapse`) emit exactly
> once per state transition, in sync with `visualExpanded`, including the
> `alwaysExpanded` forced-open mount and the collapse-timer path.

### Retires

- keyframes: `TopDock.vue:74-79` template-ref `watch(dockRef.expanded)` → declarative `v-model:expanded` driving the `CONTROLS_PANE_HOVER_KEY` bridge (glass-ui audit §3.5; keyframes audit 1.2-c).
- value.js: the imperative `dockRef.value?.expanded` read at `Dock.vue:71` → declarative binding (value.js audit §1).
- fourier: the `CanvasControlsDock.vue` wrapper's hand-rolled `update:expanded` re-emit (F12) collapses into the primitive — fourier deletes its wrapper-level event plumbing.

**keyframes enabler:** NONE. On landing, keyframes swaps the watch for
`v-model:expanded`.

---

## WAVE-5 — `dock:a11y-contract` — required accessible names + roles (P2)

**Thesis.** The dock primitives forward `$attrs` but do NOT require or default
an accessible name — a consumer that forgets `aria-label` ships a nameless
control. There is NO a11y contract test. This is the a11y-naming class that
ASK-3 (LabeledField `<label>` association) also lives in — same defect family,
different component. WAVE-1 shape (A) ALSO needs this wave (the collapsed
summary must become a named disclosure button).

### Scope (glass-ui-owned)

1. **Required accessible name on every dock control.** `DockIconButton`
   should require a `label`/`aria-label` when it has no text child (a
   build/type-time or runtime-dev assert), so an unnamed icon button is
   impossible. (The "11 unnamed DockIconButton" inventory figure in the
   keyframes grounding is STALE — keyframes audit §5 verified all 6 demo sites
   are named — but the figure being wrong is exactly *because* nothing
   ENFORCES it; the contract closes the gap permanently.)
2. **Correct roles.** Promote the collapsed summary `<div … @click>`
   (`GlassDock.vue:363-369`) to a `<button>` with disclosure semantics
   (`aria-expanded`) — this is the WAVE-1 shape-(A) enabler. The switcher rail
   should be `role="tablist"` with `aria-selected` (not the current
   `aria-pressed`, glass-ui audit §3.6) via reka-ui `Tabs`, single-`tabindex=0`
   roving — the AT.W6 a11y slice already plans this; this wave makes it a
   gated contract.
3. **No `aria-expanded` on the presentational root** (the AT B4 booking,
   currently doc-only) — the disclosure `aria-expanded` belongs on the
   collapsed button (point 2), not the root.
4. **`IconTooltip text → wrapped-control `aria-label`** (the cross-consumer
   §10 refinement): thread the tooltip's `text` onto the wrapped control's
   accessible name so the tooltip is the SINGLE source of truth — kills the
   `title`-only naming (invisible to touch / unreliable for SR) that all three
   consumers fall back to.
5. **44px control default under `@media (pointer: coarse)`.** `--dock-control-size`
   defaults `2.5rem`/`2rem` (`dock.css:92,107`) — below WCAG 2.5.5 / Apple HIG
   44px on touch. Bump the coarse-pointer default token.

### Hard gate

> The AT.W6 a11y contract test (PLANNED), EXTENDED to assert: every rendered
> dock control has a non-empty accessible name (axe-core `button-name` /
> computed-name check); the collapsed summary is a `button[aria-expanded]`;
> the rail is `role="tablist"` with one `tabindex=0` and `aria-selected`;
> the coarse-pointer control size resolves ≥44px. No `aria-expanded` on the
> root.

### Retires

- keyframes: the `title`-only naming on all 6 `DockIconButton` sites (keyframes audit §5.§10) → `IconTooltip`-sourced name; the sub-44px touch targets (`dock.css:716`, §5.§7); STRIKES the stale "11 unnamed" inventory (`grounding.txt:31`, `PROGRESS.md:42`).
- value.js: the `aria-pressed`-as-selection on the view buttons → `aria-selected` tablist (value.js audit §1).
- fourier: the `.view-dot` "active overlay" indicator could ride a `DockIconButton` corner-`indicator` slot instead of a bespoke `position:absolute` dot (fourier audit HR6/§5.2).
- SIBLING to ASK-3 (LabeledField association) — same a11y-naming family; both belong in glass-ui's next a11y/forms tranche.

**keyframes enabler:** demo `alt=""` on the decorative collapsed-pill scene
`<img>` (`TopDock.vue:212`, keyframes audit §5.§5) — keyframes-owned, lands in
C; verify glass-ui's `DockSelectTrigger` forwards slotted-img `alt`.

---

## WAVE-6 — `dock:layer-transition` — close the ergonomic gap that forced a fork (P2)

**Thesis.** glass-ui's `useLayerTransition` exposes only low-level
`currentLayer`/`leavingLayer` refs + `onTransitionEnd`. value.js needed
per-id `{ class, inert }` for a declarative template, so it FORKED the whole
FLIP machine into a `layerProps(id)` shim — and the fork has since DRIFTED
behind upstream (it lacks the native View-Transitions fast path, the axis
param, and the computed cleanup delay that glass-ui's own version gained).
The fork exists ONLY because the return shape is too low-level. Close the
ergonomic gap and the fork retires — inheriting native-VT + axis for free.

### Scope (glass-ui-owned)

Add a `layerProps(id)` (or `layerClass(id)` + `layerInert(id)`) convenience to
`UseLayerTransitionReturn` so a template can bind per-id classes/inert
declaratively. Secondary (lower-confidence): a `DockLayer` `:active-when`
predicate / priority order so multi-layer consumers stop hand-writing the
"which layer wins when N conditions are true" precedence reducer.

The fork + the gap:
- value.js `composables/useLayerTransition.ts` (123 LOC) — near-verbatim FLIP fork (value.js `:66-95` ≈ glass-ui `:139-185`) for the `layerProps(id)` shim. DRIFTED: no native-VT (glass-ui `:121-133`), no axis (glass-ui `:14,59-62`), hard-codes `setTimeout(…, 400)` vs glass-ui's computed `cleanupDelayMs` (`:77-88`). value.js's NESTED sub-layer-group (`ActionBarLayer.vue:54-58` — a 2nd crossfade INSIDE one layer, which `DockLayerGroup` cannot model) rides this fork.
- value.js `Dock.vue:77-87` — the 4-condition layer-precedence reducer, inlined from a retired `useDockLayers`, annotated "call order does not matter" (a hazard the consumer had to reason about). The `:active-when` affordance retires it.

### Hard gate

> A FLIP test (the currently-UNTESTED edge, glass-ui audit §4 / value.js B6):
> `layerProps(id)` returns the correct `{ class, inert }` across an A→B→A
> rapid swap; the native-VT path and the JS-FLIP fallback produce the same
> end state; the `ResizeObserver`-driven resize does NOT strand a
> `transition:none` (the unguarded edge at `useLayerTransition.ts:150-185`).

### Retires

- value.js: deletes the `useLayerTransition` fork (123 LOC) — inherits native-VT + axis + computed-cleanup; the nested sub-layer group rides the upstream return (value.js audit C2). With `:active-when`, also deletes the `Dock.vue:77-87` precedence reducer (value.js audit C4).

**keyframes enabler:** NONE (keyframes uses a single static layer — value.js
is the forking consumer). keyframes' single-layer `DockLayerGroup` overhead
(keyframes audit D1) is a keyframes-side cleanup (drop the wrapper, use the
default slot), independent of this wave.

---

## WAVE-7 — `dock:trigger-contract` + `DockBadge` — the small-API closers (P3)

**Thesis.** Two low-effort, ≥2-consumer closers that don't fit the larger
waves: the `DockSelectTrigger` label-clamp escape hatch (open across SEVEN
value.js tranches), and the in-dock free-text badge that 2 consumers
hand-roll.

### Scope (glass-ui-owned)

1. **`DockSelectTrigger` `clampLabel`/`noClamp` prop.** `SelectTrigger.vue:36`
   applies `[&>span]:line-clamp-1`; value.js cancels it with a child-selector
   hack (`DockViewSelect.vue:49-64`, the "Ad-18 marker", OPEN across 7
   value.js tranches per its coordination ledger). Ship the prop so consumers
   stop reaching into glass-ui's internal span with a child-combinator. ALSO
   consider `--menu-min-w` sizing for content-heavy dropdowns (value.js
   `SelectContent min-w-[12rem]` override, WORKAROUND C — minor, RECORD).
2. **`DockBadge` / `MetricBadge` text mode.** An in-dock free-text count pill
   (`tabular-nums`, foreground-tinted, density-keyed) that 2 consumers
   hand-roll: fourier `.dock-badge` "N pts" (`EditorControlsDock.vue:190-196`)
   and the keyframes demo's own `dock-badge` copy. `MetricBadge` covers
   numeric+unit only. Low effort, removes a 3-property duplication.

### Hard gate

> Structural: `<DockSelectTrigger :clamp-label="false">` omits the
> `line-clamp-1` hook (no child-selector hack needed); `<DockBadge>` renders
> the density-keyed text pill and the consumer copies delete.

### Retires

- value.js: the `DockViewSelect.vue:49-64` `[&>span]:line-clamp-none` hack (C5, OPEN 7 tranches) — the single oldest standing dock ask.
- fourier: the `.dock-badge` local widget (fourier audit HR3/C-F4).
- keyframes: its `dock-badge` copy (fourier audit §5.1 cross-ref).

**keyframes enabler:** NONE. On landing, both demos swap their `dock-badge`
copies for `<DockBadge>`.

---

## §9 — Wave ledger (the glass-ui run order)

| Wave | Name | Pri | Thesis (one line) | Gate | Consumers retired |
|---|---|---|---|---|---|
| **1** | `dock:touch-gate` | **P0** | Collapsed-pill first tap must expand AND act (one gesture) | NEW touch behavioural test | 3 masks/exposures + false AT verdict |
| **2** | `dock:popup-mutex` | P1 | `useDockPopupMutex` + auto-pin trigger (single-open + `isAnyOpen→keepOpen/release`) | mutex+pin state test | 3 mutex re-impls + 2 manual pins |
| **3** | `dock:placement` | P1 | Safe-area + exclusion tokens fold `env(safe-area-inset)` + chrome offset | computed-style placement test | 2+ hand-rolled `calc(max(…env…))` |
| **4** | `dock:expand-events` | P1 | `@expand`/`@collapse`/`v-model:expanded` (fourier proved it) | event-sync test | 3 template-ref watches |
| **5** | `dock:a11y-contract` | P2 | Required accessible name + roles + 44px coarse + IconTooltip→aria | extended AT.W6 a11y test | title-only naming, aria-pressed, sub-44px (sibling: ASK-3) |
| **6** | `dock:layer-transition` | P2 | `layerProps(id)` + `:active-when` retire the value.js fork | FLIP A→B→A + VT-parity test | 123-LOC fork + precedence reducer |
| **7** | `dock:trigger-contract` + `DockBadge` | P3 | `clampLabel` prop (7 tranches) + free-text badge | structural | oldest standing ask + 2 badge copies |

**The single most important sentence for glass-ui.** Run **WAVE-1 first and
fold it into the live AT "perfect the dock" tranche (W6/W7)** — it is the only
correctness defect, it is file-disjoint from the planned AT slices, three
consumers independently masked or are exposed to it, the AT lenses missed it,
and the AT design slice's "no shipped dock bug" verdict is false precisely
because of it. The remaining six waves are ergonomics/tokens/a11y that the
multiplicity table ranks by consumer-count — but WAVE-1 is the one that
retires a shipped bug and a false verdict in the same landing.

---

## §10 — keyframes-side obligations (inv-16 boundary)

keyframes WRITES nothing into glass-ui. Per wave, keyframes' only obligations:
- **WAVE-1:** remove the `:always-expanded="isMobile"` mask + `isMobile` stanza once glass-ui ships (NONE before).
- **WAVE-2:** converge the two internal mutex copies (`popupModel` inline vs `useExclusiveSelect`) onto one NOW (keyframes-owned C cleanup); route to the glass-ui primitive on landing.
- **WAVE-3/4/6/7:** NONE before landing; rewrite the consumer hand-rolls (work-area tokens, expand watch, badge copy) as thin aliases/bindings on landing.
- **WAVE-5:** demo `alt=""` on the decorative collapsed-pill scene `<img>` (`TopDock.vue:212`); STRIKE the stale "11 unnamed DockIconButton" figure (`grounding.txt:31`, `PROGRESS.md:42`); verify `DockSelectTrigger` `alt` forwarding.

All seven waves land in glass-ui on its own clean checkout, gated on its own
CI. This file is the proposal; the constellation ledger binding
(`HUB/docs/constellation/ADOPTION-ASKS.md`, fourier-owned) is the
orchestration lead's to route.
