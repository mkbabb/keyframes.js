# Tranche H Deep Audit — Lane `a-mbabb-popover` (D9)

**Charge:** The `@mbabb` logo dropdown (Share · Dark mode · ppmycota · @mbabb / GitHub)
exists in `App.vue` but no longer opens. Root-cause, reproduce live, classify
demo-owned vs glass-ui-HANDOFF, prescribe the gestalt restore.

**Branch:** `tranche-h-dev` · **Demo:** `http://localhost:5174/` (kf 4.1.0 + Tranche G)
**Deps observed:** `@mkbabb/glass-ui` **3.4.0** (registry), `reka-ui` **2.9.9**, `vue` 3.5.

---

## TL;DR — ROOT CAUSE (proven by live instrumentation)

The trigger is **double-wrapped as a reka `DropdownMenuTrigger`**. A single real
click fires the merged trigger `onClick` **twice**, calling reka's `onOpenToggle()`
**twice** (open `false→true→false`), which **cancels out** — so the menu never opens.

- `@mkbabb/glass-ui` **3.4.0** ships `DockDropdownTrigger` as a *complete* reka
  `DropdownMenuTrigger` internally (it renders `reka.DropdownMenuTrigger`, NOT a bare
  `Primitive`).
  Evidence (published package):
  `node_modules/@mkbabb/glass-ui/dist/dock.js` — `import { DropdownMenuTrigger as W … } from "reka-ui"`,
  and `DockDropdownTrigger.setup` renders `g(L(W), useForwardProps(props), { class:"dock-dropdown-trigger …" })`.
  Its `.d.ts` props type is `DropdownMenuTriggerProps & { type; class }`
  (`dist/components/custom/dock/DockDropdownTrigger.vue.d.ts`) — i.e. it is itself the trigger.
- `demo/app/App.vue:18-21` ALSO wraps it in a second reka trigger:
  ```vue
  <DropdownMenuTrigger as-child>
      <DockDropdownTrigger aria-label="@mbabb menu" …>@mbabb</DockDropdownTrigger>
  </DropdownMenuTrigger>
  ```
  → two reka `DropdownMenuTrigger`s collapse onto the same `<button>` via `as-child`,
  each binding `onClick → onOpenToggle`.

This is **demo-owned**, not a glass-ui regression. glass-ui 3.4.0 simply changed the
`DockDropdownTrigger` contract to BE the trigger (mirroring `DockSelectTrigger`, which
is reka's `SelectTrigger`); App.vue still wraps it the old "trigger-as-child" way.

---

## Live reproduction (Playwright MCP, demo @ :5174)

The dock is `start-collapsed`; the `@mbabb` item lives in the `#items` slot which only
mounts in the EXPANDED dock layer (`dock-layer--full`). Steps, all observed live:

1. Expand the dock (mouseenter/focusin) → `<button aria-label="@mbabb menu">` is
   present, **visible**, **not occluded** (`elementFromPoint` at its center returns the
   button itself), correctly reka-wired:
   `id=reka-dropdown-menu-trigger-v-2`, `aria-haspopup=menu`, `aria-expanded=false`,
   `data-state=closed`.
2. **Trusted Playwright click** on the button → event log:
   `DOC pointerdown trusted=true inDock=true` · `TRIGGER pointerdown/pointerup/click
   trusted=true btn=0` · **no `data-state` mutation, no `[role=menu]` ever appears**.
   `bubble-click defaultPrevented=false state=closed` — reka declined to
   `preventDefault`, which means its post-toggle `open.value` was **false**.
3. The button's `__vnode.props.onClick` is an **array of 2 handlers**
   (`handlerCount: 2`). Wrapping `rootContext.onOpenToggle` to count calls and invoking
   the handler array (as Vue does for one DOM click) yields
   **`onOpenToggleCalls: 2`, `finalOpen: false`, `finalState: "closed"`** — the
   smoking gun: two toggles cancel.
4. **Counter-proof the menu engine is healthy:** invoking the reka
   `DropdownMenuRootContext.onOpenToggle()` directly **once** →
   `open: true`, `data-state: "open"`, `[role=menu]` content renders.
   Likewise invoking only **one** of the two `onClick` handlers →
   `afterSingleToggle_open: true`, `state: "open"`, `menuContent: true`.
   So reka-ui works, the dock click-away does NOT slam it shut, and a SINGLE toggle
   opens it. The defect is **exclusively** the doubled toggle.
5. Component-chain scan from the button (live `__vueParentComponent` walk) shows
   **three** `DropdownMenuTrigger` instances stacked:
   - `parent=PopperRoot, asChild=true` (App's `<DropdownMenuTrigger as-child>`),
   - `parent=DropdownMenuTrigger, asChild=true`,
   - `parent=DockDropdownTrigger` (glass-ui's internal reka trigger, carries the full
     `onClick/onKeydown/aria-*` prop set), child `MenuAnchor`.
   The provider chain terminates at `MenuRoot` → `DropdownMenuRoot`
   (`Symbol(DropdownMenuRootContext)`, `modal: true`).

---

## Secondary finding (latent, will self-heal but verify) — dock-portal marking

glass-ui's `DropdownMenuContent` (the one App.vue imports from `@mkbabb/glass-ui`)
self-registers as a dock portal:
`dist/dropdown-menu-EFjl5iKo.js` sets
`"data-glass-dock-portal": dockCtx?.id ? "" : void 0` and
`"data-glass-dock-owner": dockCtx?.id` from `useOptionalDockContext()`. The dock's
click-away (`dist/dock.js` `isTeleportedTarget` = `el.closest("[data-glass-dock-portal]")`
matched against `data-glass-dock-owner === dockId`) treats such a marked portal as
"inside the dock," so click-away/hover-leave won't dismiss it.

Observed live: even when I force-opened the menu, **`document.querySelectorAll('[data-glass-dock-portal]').length === 0`** and the forced-open menu was dismissed by the
dock's `collapse-delay` timer before a screenshot could capture it (the dock recollapsed
to the "Easing" pill). Two implications:

- The content's dock-context inject (`useOptionalDockContext`) resolved to no id — most
  plausibly perturbed by the doubled-trigger nesting; expected to self-heal once the
  trigger renders as a single reka trigger inside `<DropdownMenu>`/`<GlassDock>`.
- **`keepOpen`/`release` is NOT called by `DropdownMenuContent`** — it only marks the
  portal. The dock collapse TIMER is suppressed only by an explicit `keepOpen()` token
  (see `useDockState.d.ts`: "keepOpen/release prevents TIMER-BASED collapse"). App.vue's
  `@mbabb` `<DropdownMenu>` has **no** open-state wiring to `dock.keepOpen()/release()`,
  unlike ChromeDock's two `<Select>`s which DO (`ChromeDock.vue:` `openPopup` mutex →
  `watch(isAnyOpen … dockRef.keepOpen()/release())`). So even after the open is fixed,
  the dock can auto-collapse out from under an open `@mbabb` menu after `collapse-delay`.

---

## Gestalt fix (idiomatic, single motion — SHIP-in-H)

All in `demo/app/App.vue`. No glass-ui patching; no compat shim. Two coupled moves:

**(1) Un-double the trigger — use `DockDropdownTrigger` AS the trigger.**
`DockDropdownTrigger` *is* the reka `DropdownMenuTrigger` (glass-ui 3.4.0), exactly as
`DockSelectTrigger` *is* `SelectTrigger` (ChromeDock already uses `DockSelectTrigger`
directly inside `<Select>`, never wrapped in `<SelectTrigger>` — that is the precedent).
Drop the wrapping `<DropdownMenuTrigger as-child>`:

```vue
<DropdownMenu v-model:open="mbabbOpen">
    <DockDropdownTrigger aria-label="@mbabb menu"
        class="text-mono-caption normal-case lg:text-mono-small">@mbabb</DockDropdownTrigger>
    <DropdownMenuContent align="end" :side-offset="8" …>
        … (unchanged) …
    </DropdownMenuContent>
</DropdownMenu>
```

Remove the now-unused `DropdownMenuTrigger` from the `@mkbabb/glass-ui` import on
`App.vue:152` (NO legacy import left dangling). This restores ONE reka trigger → one
`onOpenToggle` per click → opens (live-proven by the single-toggle counter-proof).

**(2) Bind the dropdown open-state to the dock hold (parity with the dock's Selects).**
Add a `mbabbOpen` ref and `watch(mbabbOpen, o => o ? dock.keepOpen() : dock.release())`.
Two options for the dock handle, prefer the cohesive one:
- *Cleanest:* the `@mbabb` `<DropdownMenu>` is a descendant of `<GlassDock>`, so it can
  `useOptionalDockContext()` (exported from `@mkbabb/glass-ui/dock`) and call
  `ctx.keepOpen()/release()` directly — no prop drilling, no new ChromeDock surface.
- *Alternatively:* fold the `@mbabb` open-state into ChromeDock's existing `openPopup`
  mutex (`"scene" | "controls" | "mbabb"`) so all three dock popovers share ONE
  keep-open/mutex authority (DRY). This is the more gestalt option if the `#items` slot
  is restructured to expose open-state upward; otherwise the `useOptionalDockContext`
  route is the smaller, equally-idiomatic motion.

This also closes the secondary dock-portal concern: with a single correctly-nested
trigger, `DropdownMenuContent`'s `useOptionalDockContext()` resolves the dock id, the
portal gets `data-glass-dock-portal`/`-owner`, click-away treats it as inside, and the
`keepOpen` hold defeats the collapse timer while open.

---

## Falsifiable instruments (so H can gate it)

- **proof:popover-opens (visual lock / e2e):** expand dock → trusted-click
  `button[aria-label="@mbabb menu"]` → assert within 200ms:
  `[role="menu"]` exists AND trigger `data-state="open"` AND the menu lists
  Share / Dark mode / ppmycota / @mbabb. (Today: FAILS — `data-state` stays `closed`,
  no `[role=menu]`.)
- **proof:single-toggle (unit-level invariant):** mount the dock `@mbabb`
  `DropdownMenu`; assert `button[aria-label="@mbabb menu"].__vnode.props.onClick`
  resolves to **exactly one** reka toggle handler (no doubled trigger). Equivalent:
  spy `DropdownMenuRootContext.onOpenToggle` → one trusted click yields **exactly 1**
  call. (Today: 2 calls.)
- **proof:dock-hold-while-open:** open the `@mbabb` menu, advance past `collapse-delay`
  (2500ms) without pointer movement → assert the dock stays expanded
  (`.glass-dock.expanded`) and `[role=menu]` is still present, and `[data-glass-dock-portal]`
  count ≥ 1 with `data-glass-dock-owner` === the dock id. (Today: dock auto-collapses,
  portal-count 0.)
- **proof:dark-mode-toggle:** with the menu open, activate `DarkModeToggle` → assert
  `document.documentElement` gains/loses `.dark` and the menu remains open
  (`@select.prevent` already set on the item, `App.vue:33`).

---

## Disposition

- **D9 root cause (double-wrapped trigger): SHIP-in-H.** Pure demo edit in
  `demo/app/App.vue` (remove the `<DropdownMenuTrigger as-child>` wrapper + its import;
  add `v-model:open` + dock keep-open hold). Validated live: single toggle opens the
  menu and renders all four items.
- **Secondary dock keep-open wiring: SHIP-in-H** (same edit; parity with the dock's
  existing `Select` keep-open mutex — `ChromeDock.vue` `isAnyOpen` watcher).
- **glass-ui-HANDOFF (RECORD only, do NOT patch in kf):** glass-ui 3.4.0 changed the
  `DockDropdownTrigger` contract to *be* the reka trigger. This is correct and matches
  `DockSelectTrigger`, but it is **undocumented** in the shipped `.d.ts` (the doc-comment
  still says "variable-width DropdownMenu trigger for use inside GlassDock" without
  stating it must NOT be wrapped in `<DropdownMenuTrigger as-child>`). Recommend glass-ui
  add an explicit usage note + a dev-time warning when a `DockDropdownTrigger` detects a
  parent reka trigger (double-trigger guard). Relevant to the active glass-ui dock work
  (D5). Tag: **glass-ui-HANDOFF**.

## Cross-references to sibling lanes
- **D5 (dock lag / DockDropdownTrigger popover):** this lane confirms the `@mbabb`
  non-open is NOT the dock click-away nor a glass-ui DockDropdownTrigger runtime
  regression — it is the demo's double-wrap. The dock click-away handler behaved
  correctly (`inDock=true`, no spurious collapse on the trigger pointerdown). The dock
  collapse TIMER dismissing an open menu IS shared with D5's keep-open hygiene.
- The dock collapse interfering with the forced-open menu corroborates the keep-open
  gap; resolved by instrument **proof:dock-hold-while-open** above.

---

### Evidence index (file:line / live)
- `demo/app/App.vue:18-21` — the double-wrap (`<DropdownMenuTrigger as-child>` over `<DockDropdownTrigger>`).
- `demo/app/App.vue:152` — `DropdownMenuTrigger` imported from `@mkbabb/glass-ui` (to be removed).
- `demo/app/App.vue:22-71` — `DropdownMenuContent` + the four items (Share / Dark mode / ppmycota / @mbabb) — content markup is correct, untouched.
- `demo/@/components/custom/dock/ChromeDock.vue` — precedent: `DockSelectTrigger` used directly inside `<Select>`; `openPopup` mutex + `watch(isAnyOpen … keepOpen/release)`.
- `node_modules/@mkbabb/glass-ui/dist/dock.js` — `DropdownMenuTrigger as W` import; `DockDropdownTrigger` renders `g(L(W), useForwardProps(props), …)`.
- `node_modules/@mkbabb/glass-ui/dist/components/custom/dock/DockDropdownTrigger.vue.d.ts` — props `DropdownMenuTriggerProps & { type; class }`.
- `node_modules/@mkbabb/glass-ui/dist/dropdown-menu-EFjl5iKo.js` — `data-glass-dock-portal`/`-owner` from `useOptionalDockContext()`.
- `node_modules/@mkbabb/glass-ui/dist/components/custom/dock/composables/useDockState.d.ts` — keepOpen/release semantics (timer-collapse suppression only).
- `node_modules/reka-ui/dist/DropdownMenu/DropdownMenuTrigger.js` — `onClick: onOpenToggle(); await nextTick(); if (open.value) preventDefault()` — toggles per handler instance.
- LIVE: `handlerCount: 2`, `onOpenToggleCalls: 2`, `finalOpen: false`; single-toggle → `open: true / state: open / menuContent: true`; `dockPortalCount: 0` while open.
