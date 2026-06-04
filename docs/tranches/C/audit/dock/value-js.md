# Dock consumption audit — value.js (constellation tranche-C)

**Lane:** value.js dock CONSUMPTION. **Constraint:** read-only across the
constellation (inv-16); this report is authored in keyframes.js and routed
outward. The glass-ui dock is glass-ui-OWNED — findings are an AUDIT + refined
RECOMMENDATIONS, not patches.

**Scope read:** `value.js/demo/@/components/custom/dock/*` (Dock.vue,
DockViewSelect.vue, index.ts, composables/, layers/, menus/) +
`color-picker/controls/ActionButton.vue` + the glass-ui dock primitives,
`useTouchGate.ts`, `useLayerTransition.ts`, `dockContext.ts`, `dock.css` +
the standing asks (`keyframes.js/docs/tranches/B/asks/glass-ui-adoption-asks.md`)
+ value.js coordination Q.md ledgers. Visual state grounded in
`value.js/dock-action-bar-final.png` (view-select "Lab" + Tools toggle + an
expanded action-bar layer with a "Random color" hover-card) and
`dock-expanded.png` (the same dock, main layer, profile/login row).

value.js is the **heaviest dock consumer in the constellation** — a full
top-of-app navigation chrome (view router + action bar + profile/auth + slug
login + mobile overflow) built ON the glass-ui dock primitive. The PNG churn at
the repo root (`dock-action-bar-final`, `dock-expanded`, `dock-bare-variant`,
`dock-main-layer`, `dock-after-ghost-fix`, `dock-after-reload`,
`dock-action-bar-clipped`, `dock-expanded-highlight-check`) is the fossil record
of that iteration. This is the consumer that most stress-tests the dock API —
and therefore the one that most clearly exposes the gaps.

---

## 1. glass-ui dock primitives CONSUMED vs HAND-ROLLED

### CONSUMED (imported from `@mkbabb/glass-ui/dock`)

| Primitive | Import site | Role |
|---|---|---|
| `GlassDock` | `dock/index.ts:2` (re-exported), `Dock.vue:4,93` | The shell. `ref="dockRef"` + `:collapse-delay="5000" :start-collapsed="isDesktop" :fit-content="true" :always-expanded="!isDesktop"` |
| `DockLayerGroup` | `index.ts:2`, `Dock.vue:4,94` | Multi-layer host, `v-model:active="activeLayer"`, `:show-rail="false"` |
| `DockLayer` | `index.ts:2`, `Dock.vue:4,96/106/111/119` | The 4 layers: `mobile-edit`, `slug-edit`, `action-bar`, `main` |
| `DockIconButton` | `Dock.vue:5,101/102/112/137`; `SlugEditLayer.vue:4,88/100/108`; `ActionBarLayer.vue:8,93` | Every dock control button (uses `compact`, `:class="{'is-active'}"`, `:aria-pressed`, `:tabindex`, `type="submit"`, `:disabled`) |
| `DockSelectTrigger` | `DockViewSelect.vue:3,52` | View-select trigger, wraps a reka-ui `Select` |
| `DockDropdownTrigger` | `MobileMenuDropdown.vue:11,34` | Mobile overflow dropdown trigger |
| `useOptionalDockContext` | `ActionButton.vue:50,52` | DI handle for `keepOpen()`/`release()` from a descendant control |

The `keepOpen` / `release` / `expand` / `expanded` surface is consumed two ways:
the **imperative** template-ref path (`Dock.vue:49,72,73` call
`dockRef.value?.keepOpen()` / `.release()` / `.expand?.()`, and read
`dockRef.value?.expanded` at `:71`) and the **DI** path
(`ActionButton.vue:79,81` calls `dock?.keepOpen()` / `dock?.release()` via
`useOptionalDockContext`). Both are blessed glass-ui surface
(`GlassDock.vue:311` defineExpose; `dockContext.ts:31-33`). Healthy adoption.

### HAND-ROLLED in value.js (local, NOT from glass-ui)

| Hand-roll | File | What it is |
|---|---|---|
| `usePopupMutex<K>` | `composables/usePopupMutex.ts` (85 LOC) | Single-open mutex across 4 dock popups (view-select, mobile-menu, profile-menu, mbabb-menu) with a 180ms swap delay |
| `useLayerTransition` (FORK) | `composables/useLayerTransition.ts` (123 LOC) | A FORK of glass-ui's own `useLayerTransition`, re-shaped to a `layerProps(id)` convenience API |
| `useDockAdminMode` | `composables/useDockAdminMode.ts` (73 LOC) | App-domain: user/admin view lists + admin toggle. Correctly app-local — NOT a dock-upstream candidate |
| Layer dispatch state machine | `Dock.vue:77-87` | The `activeLayer` ref + the immediate watch that maps 4 boolean conditions → one of `mobile-edit`/`slug-edit`/`action-bar`/`main`. Inlined from a retired `useDockLayers` |
| `.action-bar-toggle-slot` 0fr→1fr reveal | `Dock.vue:215-234` | A CSS-grid `grid-template-columns: 0fr → 1fr` width-reveal animation for the action-bar toggle, hand-rolled (merged in from a retired `DockMainLayer.vue`) |
| `.dock-layer-grid` sub-layer stacking | `ActionBarLayer.vue:65` consumes; the grid CSS lives in style.css | A NESTED layer-group (actions ↔ input crossfade) built by re-using the forked `useLayerTransition` one level deeper than glass-ui's `DockLayerGroup` reaches |
| Profile / @mbabb / mobile-overflow menus | `menus/ProfileSection.vue`, `menus/MobileMenuDropdown.vue` | App-domain dropdown content. App-local; only the TRIGGER (`DockDropdownTrigger`) is shared |

**Not consumed at all:** `DockTabButton` (verified absent), `useDockState`
directly (verified — value.js drives the dock purely via `GlassDock` props +
the exposed methods, never the raw state composable). `DockLayerGroup`'s `rail`
is explicitly suppressed (`:show-rail="false"`, `Dock.vue:94`) — value.js drives
layer switching imperatively from its own watch, not from the built-in rail tabs.

---

## 2. The action-bar / multi-layer / view-select PATTERNS value.js built

This is the substance of value.js's dock work — the patterns the primitive does
not directly provide.

### (a) A 4-layer dispatched layer machine on top of `DockLayerGroup`

`Dock.vue:77-87` is a hand-written reducer: four reactive booleans
(`mobileEditActive`, `slugEditMode`, `actionBarLayerActive`, plus the implicit
`main` fallthrough) collapse to one `activeLayer` string driving
`DockLayerGroup`'s `v-model:active`. glass-ui's `DockLayerGroup` provides the
crossfade between layers and (suppressed here) a rail to switch them — but it
provides **no priority/precedence model** for "which layer wins when several
conditions are simultaneously true." value.js wrote that reducer by hand, and
its history shows the cost: the comment at `Dock.vue:75-76` records it was
**inlined from a now-retired `useDockLayers` composable**, and the immediate
watch is annotated "gate (c): call order does not matter" — a hazard the
consumer had to reason about itself.

### (b) A NESTED layer group glass-ui does not model

`ActionBarLayer.vue:54-58` runs a **second** crossfade transition INSIDE the
`action-bar` `DockLayer` — the actions-toolbar ↔ color-input ↔ propose sub-modes
(`activeSubLayer`, `Dock.vue`'s child). It does this by re-using the **forked**
`useLayerTransition` against a hand-marked `.dock-layer-grid` container
(`ActionBarLayer.vue:65`). glass-ui's `DockLayerGroup` is single-level: it owns
the OUTER pane stack but exposes no way to nest a second managed pane-stack
inside one layer. value.js reached for the lower-level transition composable to
get there — which is exactly why it forked it (see §4).

### (c) The view-select pattern (reka-ui Select inside a dock trigger)

`DockViewSelect.vue` is the canonical "dropdown-as-dock-control" pattern:
glass-ui's `DockSelectTrigger` (the dock-shaped trigger) wrapping a full reka-ui
`Select`/`SelectContent`/`SelectItem` tree, with rich per-item content (status
dot + icon + label, an admin-toggle row, rainbow text). The `open` state is NOT
owned locally — it is injected as `v-model:open` from the parent's single mutex
(`DockViewSelect.vue:33,37`; `Dock.vue:61,121-131`). This is the cleanest part
of the consumption: a deliberate inversion so the dropdown participates in the
dock-wide single-open discipline.

### (d) The action-bar toggle reveal animation

`Dock.vue:135-157` + the `.action-bar-toggle-slot` CSS (`:215-234`): a control
that animates in/out via the `grid-template-columns: 0fr → 1fr` trick (chosen,
per the comment, to avoid `max-width` clipping). This is a generic
"dock-control-appears-with-a-width-reveal" motion that has nothing
value.js-specific in it.

### (e) The popup-mutex pattern (§1, §4)

Four independent dock popups (view-select, mobile-menu, profile-menu,
mbabb-menu) are arbitrated so only one is open at a time, with a swap delay, and
the aggregate `isAnyOpen` is wired back to `keepOpen()`/`release()`
(`Dock.vue:60-73`). This keeps the dock pinned-open whenever any descendant
popup is open — a pattern any multi-popup dock needs.

---

## 3. The double-click encounter

value.js **does not call** any `dblclick` handler on the dock — the encounter is
the known glass-ui touch-gate bug, and value.js's relationship to it is two
parts: a workaround it ships, and a fix it has filed and is waiting on.

**Mechanism (glass-ui-internal, confirmed at file:line).**
`GlassDock.vue:285-294` `onTouchEnd`: when the dock is collapsed and the
`useTouchGate` first-tap activates the gate, glass-ui calls
`event.preventDefault()` + `event.stopPropagation()` + `expand()` — **swallowing
that first tap**. The intended control inside the pill therefore only receives
the SECOND tap. `useTouchGate.ts:123-139` is the source: `handleTouchStart`
returns `false` and starts a 150ms pending timer on the first touch of an
inactive gate; the control is not dispatched, only the dock expands. This is the
"collapsed dock needs two taps" bug verbatim, and it lives entirely in glass-ui
(`useTouchGate` + `GlassDock`), not in value.js.

**value.js's workaround.** `Dock.vue:93` mounts the dock
`:always-expanded="!isDesktop"`. On touch/mobile (`isDesktop` false via
`useMediaQuery("(min-width: 1024px)")`, `Dock.vue:66`) the dock is **never
collapsed**, so the collapsed-pill first-tap is never the live state and the
two-tap path is never reached. This is identical in shape to the workaround the
standing ask documents for keyframes' own docks
(`B/asks/glass-ui-adoption-asks.md` ASK-1: TopDock.vue / AnimationMenuBar.vue
mount `:always-expanded="isMobile"`). value.js is the **second independent
consumer** to land the exact same `always-expanded`-on-mobile mask for the exact
same root cause — strong corroboration that the fix belongs upstream, not in
either consumer.

**The filed ask.** ASK-1 in `B/asks/glass-ui-adoption-asks.md` already captures
this precisely: *"make a collapsed-dock control's FIRST tap both expand the dock
AND dispatch the intended action (or make the collapsed pill a single full-pill
button that expands-then-acts in one gesture)."* Owner: glass-ui
`useTouchGate`/`GlassDock`. The keyframes-side enabler is "none — purely
glass-ui-internal," and the masks (keyframes' AND value.js's) stay until
glass-ui ships. **This audit corroborates ASK-1 from a second consumer; it adds
no new ask, it raises the priority.** Project memory
(`project_dock_doubleclick.md`) confirms the diagnosis: "glass-ui dock buttons
require double-click; NOT transition-related; fix in glass-ui root."

---

## 4. What value.js FORKS that belongs UPSTREAM

### FORK 1 — `useLayerTransition` (the clearest convergence target)

`value.js/demo/.../composables/useLayerTransition.ts` is a near-verbatim FORK of
glass-ui's own `dock/composables/useLayerTransition.ts`. The two share the same
FLIP algorithm (capture width → pin → swap classes → nextTick re-measure → rAF
animate → transitionend cleanup) almost line-for-line
(value.js `:66-95` ≈ glass-ui `:139-185`).

**Why value.js forked it (its own comment, `useLayerTransition.ts:1-5`):**
upstream exposes only `currentLayer` / `leavingLayer` refs + `onTransitionEnd`;
value.js wanted the **`layerProps(id)` convenience** (returns `{ class, inert }`
per id) so the consumer template stays declarative. So the fork is a thin
ergonomic shim — but it carries a real cost: it has **drifted behind upstream**.
glass-ui's version has since gained:
- a **native View-Transitions fast path** (`startViewTransition`, glass-ui
  `:121-133`) that does the size morph + crossfade with ZERO
  `getBoundingClientRect` — value.js's fork is stuck on the JS-FLIP fallback only;
- an **axis parameter** (`"horizontal" | "vertical"`, glass-ui `:14,59-62`) —
  value.js's fork is width-only (`:66-87`);
- a **computed cleanup delay** read from the real transition duration
  (`cleanupDelayMs`, glass-ui `:77-88`) — value.js hard-codes `setTimeout(…,
  400)` (`:89`).

This is a textbook upstream-convergence opportunity: glass-ui should add a
`layerProps(id)` (or a `layerClass(id)` + `layerInert(id)`) convenience to its
`UseLayerTransitionReturn`, value.js drops its fork, and value.js's nested
sub-layer (§2b) inherits the native VT path and axis support for free. The fork
exists ONLY because glass-ui's return shape is too low-level for a template that
wants per-id classes — closing that ergonomic gap retires the fork.

### FORK 2 — `usePopupMutex` (a generic dock pattern with no upstream home)

`value.js/.../composables/usePopupMutex.ts` (85 LOC). Its header comment claims
it "was retired upstream from glass-ui at the D-II tranche" — but a grep of the
**current** glass-ui source finds NO `PopupMutex` / `popupModel` / mutex
primitive anywhere (verified empty). So whatever the D-II history, there is no
upstream equivalent today, and value.js is carrying this alone.

The pattern itself is **not value.js-specific**: "a set of dock popups/dropdowns,
only one open at a time, with a swap delay, surfacing an `isAnyOpen` that pins
the dock open." Any dock with ≥2 sibling dropdowns needs it. Today value.js wires
`isAnyOpen` → `keepOpen()`/`release()` by hand at `Dock.vue:73`. This is a strong
candidate to live in glass-ui as a small composable (e.g. `useDockPopupMutex`)
that BOTH arbitrates the single-open and auto-wires the hold against the dock
context — so consumers don't re-derive the `isAnyOpen → keepOpen/release` bridge.
**Cross-consumer check is warranted:** confirm against the other dock consumers
(fourier, keyframes) whether they re-implement single-open arbitration; 2+
re-implementations = upstream.

### FORK 3 — the 4-layer dispatch reducer (a precedence model gap)

`Dock.vue:77-87` is not a named fork, but it is logic the primitive forces every
multi-layer consumer to re-author: a precedence reducer over N boolean layer
conditions → one active layer id. glass-ui's `DockLayerGroup` provides the
visual stack + crossfade but no declarative precedence. A small upstream
affordance — e.g. `DockLayer` accepting an `:active-when` predicate or a priority
order so the group resolves the winner — would let value.js delete its reducer +
its "call order does not matter" reasoning (`Dock.vue:75-76`). Lower-confidence
than FORKS 1–2 (it may be deliberately consumer-owned), flagged for upstream
discussion.

---

## 5. Dock bugs value.js worked around

### WORKAROUND A — the double-click / two-tap (covered in §3)

`:always-expanded="!isDesktop"` (`Dock.vue:93`). Masks glass-ui's
`useTouchGate`/`GlassDock` collapsed-first-tap swallow. Filed as ASK-1; stays
until glass-ui ships.

### WORKAROUND B — `DockSelectTrigger` label line-clamp (filed, long-standing)

`DockViewSelect.vue:49-64`: the trigger carries
`class="… [&>span]:line-clamp-none"` with an explicit "Ad-18 marker" comment.
**Confirmed root cause:** glass-ui's `SelectTrigger.vue:36` applies
`[&>span]:line-clamp-1` to the trigger's label span; value.js's longer
view-option labels get clipped, so it cancels the clamp with a child-selector
override. The comment files the proper fix — *"a `clampLabel` prop on glass-ui
`DockSelectTrigger`"* — and the value.js coordination ledger tracks it as an OPEN
glass-ui-authorship ask across **seven tranches** (A→G coordination/Q.md;
"STANDS — a `[&>span]:line-clamp-none` child-selector hack", never retired
because glass-ui has not shipped the prop). This is a genuine API gap glass-ui
should close: `DockSelectTrigger` (or the underlying `SelectTrigger`) should
expose a `clampLabel`/`noClamp` prop so consumers stop reaching into glass-ui's
internal span with a child-combinator hack.

### WORKAROUND C — `SelectContent` min-width override (minor, marker-documented)

`DockViewSelect.vue:65-66`: `SelectContent class="min-w-[12rem]"` with a "B.W1"
marker — *"kept wider than `--menu-min-w` — long view-option labels need the
space."* A token-vs-content tension, not a bug; documented intentional override.
Borderline: signals the dock's menu-width token (`--menu-min-w`) is undersized
for content-heavy dropdowns, but value.js correctly overrides locally rather than
forking the token. Noted, not escalated.

### NOT a workaround — `DockPopover` drop

`index.ts:1` comments that `DockPopover` "was retired upstream in glass-ui D-II
tranche — drop." value.js correctly dropped the import. Clean adoption of an
upstream removal, not a workaround. Listed for completeness.

---

## Convergence summary (routed outward to glass-ui)

| # | Finding | Type | Owner | Status |
|---|---|---|---|---|
| C1 | Collapsed-dock first-tap swallowed on touch (`GlassDock.vue:285-294` + `useTouchGate.ts:123-139`); value.js masks via `:always-expanded="!isDesktop"` | BUG → upstream fix | glass-ui | **Corroborates ASK-1 from a 2nd consumer.** Raises priority |
| C2 | `useLayerTransition` forked for a `layerProps(id)` shim; fork has drifted behind upstream's native-VT + axis + computed-cleanup | FORK → API gap | glass-ui | Add `layerProps`/`layerClass`+`layerInert` to upstream return; value.js drops fork |
| C3 | `usePopupMutex` (single-open + swap-delay + `isAnyOpen→keepOpen/release`) carried alone; no upstream equivalent exists today | FORK → convergence | glass-ui | Candidate `useDockPopupMutex`; cross-check fourier/keyframes for 2+ re-impls |
| C4 | 4-condition layer-precedence reducer re-authored per consumer (`Dock.vue:77-87`); `DockLayerGroup` has no precedence model | API gap (lower conf) | glass-ui | Consider `:active-when` / priority on `DockLayer` |
| C5 | `DockSelectTrigger` label clamp: `[&>span]:line-clamp-none` hack cancels glass-ui `SelectTrigger.vue:36` `line-clamp-1`; open across 7 value.js tranches | WORKAROUND → API gap | glass-ui | Ship `clampLabel` prop (already filed in value.js coordination/Q.md §3) |
| C6 | `SelectContent min-w-[12rem]` override of `--menu-min-w` for long labels | token tension (minor) | — | Documented local override; not escalated |

**Adoption verdict.** value.js is a model dock consumer on the imperative/DI
surface (`keepOpen`/`release`/`expand`/`useOptionalDockContext` all used as
intended, no string-key inject anti-patterns, `DockPopover` removal absorbed
cleanly). Its forks are not laziness — each is a documented response to a real
glass-ui API gap (too-low-level transition return; no single-open mutex; no label
clamp prop; no layer precedence). The highest-value upstream moves are **C2**
(retire a drifting fork by closing the ergonomic gap) and **C5** (a one-prop fix
that has been open for seven tranches). **C1** is not a new ask — it is a second
consumer independently landing the identical `always-expanded` mask, which is the
strongest possible evidence that the touch-gate fix must land upstream.
