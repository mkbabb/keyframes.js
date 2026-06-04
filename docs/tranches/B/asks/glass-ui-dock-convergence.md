# glass-ui DOCK CONVERGENCE — the rename + the fold-into-base + leverage-THAT plan

**Authored in keyframes.js, routed outward (inv-16).** keyframes does NOT
patch glass-ui or the sibling consumers. This is the companion to
`glass-ui-dock-forward.md`: where that file ranks the glass-ui *waves* (WHAT
to fold), this one plans the two dimensions it left implicit —

1. **Re-name the constellation's dock usage** onto ONE coherent vocabulary,
   so a cross-repo reader recognizes any dock by role and so the folded
   composables have ONE canonical name (today the SAME pattern is
   `useExclusiveSelect` in keyframes and `usePopupMutex` in value.js).
2. **Fold ALL dock items into base glass-ui and leverage THAT** — drive the
   convergence to its end-state: every hand-roll and every fork moves
   upstream into the base dock, and each consumer's dock becomes a THIN
   slot-filler of the base — `~20 lines, zero hand-roll`.

The base is glass-ui-OWNED (`/Users/mkbabb/Programming/glass-ui/src/components/custom/dock/`).
keyframes proposes; glass-ui + each consumer execute on their own checkouts,
gated on their own CI. keyframes' OWN renames/migrations (the `keyframes`
column below) land in tranche C's demo waves and are the only items keyframes
writes.

---

## §1 — The current naming incoherence (cross-repo inventory)

Grounded against the four dock audits (`audit/dock/*.md`) + live source.

### Base (glass-ui, `@mkbabb/glass-ui/dock`)
`GlassDock` (the styled root) · `DockLayer` · `DockLayerGroup` ·
`DockIconButton` · `DockSelectTrigger` · `DockDropdownTrigger` ·
`DockTabButton` (**0 consumers**) · composables `useDockState` ·
`useLayerTransition` · `useTouchGate` (in `composables/dom/`, dock-only
caller) · `dockContext` · `dockLayerContext` · tokens `--dock-*` · classes
`.dock-*` / `.glass-dock`.

*Inconsistency in the base itself:* the root is `Glass`-prefixed
(`GlassDock`) while every part is `Dock`-prefixed (`DockLayer`,
`DockIconButton`) — and `useTouchGate` hides its dock role under a generic
name + a generic directory, though the dock is its only caller.

### Consumer dock INSTANCES — three naming dialects, no shared convention
| Repo | Component | What it IS (role) | Naming dialect |
|---|---|---|---|
| keyframes | `TopDock.vue` | top app-chrome: scene switcher + controls-tab select | **position** ("Top") |
| keyframes | `AnimationMenuBar.vue` | bottom transport: play/pause/reset + anim select | **type** ("MenuBar") |
| value.js | `Dock.vue` | 4-layer nav chrome: nav + view-select + profile/auth + mobile overflow | **bare** ("Dock") |
| value.js | `DockViewSelect.vue` | a view-select trigger inside the dock | part |
| fourier | `EditorControlsDock.vue` | editor tool controls | **content** ("EditorControls") |
| fourier | `CanvasControlsDock.vue` | canvas/viewport controls | content |
| fourier | `AnimationControls.vue` | playback transport (no `Dock` suffix at all) | content, no suffix |

A reader cannot tell from the names that `AnimationMenuBar` (keyframes) and
`AnimationControls` (fourier) are **the same role** (a transport dock), or
that `TopDock` (keyframes) and `Dock` (value.js) are **the same role** (the
chrome/nav dock). The dialect is position / type / bare / content — pick one.

### Folded composables — same pattern, different names
| Concern | keyframes | value.js | fourier |
|---|---|---|---|
| single-open popup mutex | `useExclusiveSelect.ts` + inline `popupModel` | `usePopupMutex.ts` | (parent `v-if`) |
| layer crossfade | (uses base) | `useLayerTransition.ts` (**fork**) | (rides base) |
| admin/app mode | — | `useDockAdminMode.ts` | — |

`useExclusiveSelect` ≡ `usePopupMutex` — one concept, two names, in two
repos. This is the naming convergence's clearest win.

---

## §2 — The canonical naming scheme

### 2.1 — The consumer-instance convention: `<Role>Dock`
Every consumer dock instance is named `<Role>Dock`, where `<Role>` ∈ a
**shared, documented role vocabulary**. The role — not the position, type, or
content — is the name, so the constellation reads consistently.

| Role | Meaning | Replaces |
|---|---|---|
| **`ChromeDock`** | app navigation / global chrome (scene/view switch, profile, settings) | keyframes `TopDock`, value.js `Dock` |
| **`TransportDock`** | playback transport (play/pause/reset/scrub + selection) | keyframes `AnimationMenuBar`, fourier `AnimationControls` |
| **`CanvasDock`** | viewport / canvas controls (zoom, pan, view toggles) | fourier `CanvasControlsDock` |
| **`ToolDock`** | editor / tool controls (the editing affordances) | fourier `EditorControlsDock` |

Parts inside a dock keep the glass-ui part name (`DockSelectTrigger`,
`DockIconButton`) — value.js `DockViewSelect` becomes a *configured*
`DockSelectTrigger` (or stays a thin local if it adds real domain logic, but
named `<Role>…` not `Dock…` to avoid colliding with the base part namespace).
The role vocabulary is documented ONCE (in glass-ui's dock README, the source
of truth) so a new consumer picks a role rather than inventing a name.

### 2.2 — The base primitives (glass-ui-owned)
RESOLVED to **minimal-rename, maximal-consistency**:
- **Keep `GlassDock`** as the branded styled root (the `Glass`-prefix is the
  glass-ui house identity, consistent with `GlassPanel`/`GlassCard`); the
  `Dock*` part family stays. No breaking rename of the adopted public surface.
- **Rename `useTouchGate` → `useDockTouchGate`** and co-locate it under
  `components/custom/dock/composables/` — the dock is its only caller, and the
  generic name + generic directory hide its role (and make the WAVE-1 fix
  harder to find). A one-time export-alias keeps back-compat for one minor.
- **Retire `DockTabButton`** (0 consumers across all 3 repos, confirmed) — an
  adopt-or-delete decision; the cross-repo view says delete (it is in the same
  un-adopted cohort as `wrap` that AT.W7 already books).

### 2.3 — The folded composables (glass-ui-owned, canonical names)
Every composable the 7 dock-forward waves pull upstream gets ONE canonical
`useDock*` name in the base, so no consumer re-invents it:
| Concern (wave) | Canonical glass-ui name | Subsumes |
|---|---|---|
| single-open popup mutex + auto-pin (WAVE-2) | **`useDockPopupMutex`** + `<DockPopupGroup>` | keyframes `useExclusiveSelect`/`popupModel`, value.js `usePopupMutex` |
| safe-area + exclusion placement (WAVE-3) | **`useDockPlacement`** (+ `--dock-safe-inset-*` tokens) | the per-consumer `calc(max(…env…))` + `--work-area-*-offset` |
| expanded → host event (WAVE-4) | `v-model:expanded` on `GlassDock` (no composable) | the template-ref `watch`es |
| layer transition ergonomics (WAVE-6) | `useLayerTransition` + `layerProps(id)` | value.js's drifted fork |
| a11y name contract (WAVE-5) | `useDockA11yName` (or a build-time assert) | the per-consumer `:title`/`aria-label` discipline |

One name per concept, in the base, documented. The naming convergence is
*finished* when `grep -r "useExclusiveSelect\|usePopupMutex\|useDockLayers" `
across the constellation returns zero — all routed through the base.

---

## §3 — The rename map (per repo; current → canonical)

| Repo | Current | Canonical | Owner / when |
|---|---|---|---|
| keyframes | `TopDock.vue` | `ChromeDock.vue` | keyframes — C demo wave |
| keyframes | `AnimationMenuBar.vue` | `TransportDock.vue` | keyframes — C demo wave |
| keyframes | `useExclusiveSelect.ts` + inline `popupModel` | → base `useDockPopupMutex` | keyframes — converge to ONE now (C), route to base on landing |
| keyframes | local `dock/index.ts` re-exporting `GlassDock`/`DockLayerGroup` | delete — import from `@mkbabb/glass-ui/dock` directly | keyframes — C |
| value.js | `Dock.vue` | `ChromeDock.vue` | value.js (proposed) |
| value.js | `DockViewSelect.vue` | configured `DockSelectTrigger` (or `<Role>ViewSelect`) | value.js (proposed) |
| value.js | `usePopupMutex.ts` | → base `useDockPopupMutex` | value.js (proposed) |
| value.js | `useLayerTransition.ts` (fork) | → base `useLayerTransition` + `layerProps` | value.js (proposed, WAVE-6) |
| fourier | `EditorControlsDock.vue` | `ToolDock.vue` | fourier (proposed) |
| fourier | `CanvasControlsDock.vue` | `CanvasDock.vue` | fourier (proposed) |
| fourier | `AnimationControls.vue` | `TransportDock.vue` | fourier (proposed) |
| glass-ui | `useTouchGate.ts` (`composables/dom/`) | `useDockTouchGate.ts` (`dock/composables/`) + alias | glass-ui (proposed, WAVE-1) |
| glass-ui | `DockTabButton.vue` | retire (0 consumers) | glass-ui (proposed) |

---

## §4 — Fold completeness: every dock item → its glass-ui home ("all items")

The user's mandate is "fold ALL items into base glass-ui." The 7 dock-forward
waves cover the major seams; this table proves NOTHING dock-shaped is left
hand-rolled that the base could own (the residue is correctly per-app — §3
D-1..D-6 of the divergence map). Each row: the hand-rolled item → its base
home (wave) → the consumers that delete it.

| Hand-rolled item | Base home (wave) | Deletes from |
|---|---|---|
| collapsed double-tap masks (`always-expanded`) | `useDockTouchGate` fix (W1) | keyframes, value.js (masks); fourier (exposure) |
| popup mutex + `keepOpen/release` bridge | `useDockPopupMutex` + auto-pin (W2) | keyframes ×2, value.js |
| `env(safe-area-inset-*)` `calc()` | `useDockPlacement` + `--dock-safe-inset-*` (W3) | keyframes, value.js, fourier |
| work-area exclusion offset | `--dock-exclusion-*` opt-in (W3) | keyframes `--work-area-*-offset` → thin alias |
| `expanded` template-ref `watch` | `v-model:expanded` (W4) | keyframes, value.js (fourier already did it) |
| `useLayerTransition` fork (123 LOC) | `layerProps(id)` on base (W6) | value.js |
| layer-precedence reducer | `DockLayer :active-when` (W6) | value.js `Dock.vue:77-87` |
| `:title`-only / `aria-pressed` naming | `useDockA11yName` + role contract (W5) | all 3 |
| in-dock free-text badge | `DockBadge` (W7) | keyframes, fourier |
| `[&>span]:line-clamp-none` hack | `DockSelectTrigger clampLabel` (W7) | value.js (open 7 tranches) |
| `.dock-separator`/`.dock-spacer` re-decl | already in base `dock.css:574,582` | fourier (pure delete) |
| `.view-dot` corner indicator | `DockIconButton` `indicator` slot (W7/G-10) | fourier |
| nested sub-layer group | `DockLayerGroup` nesting (W6/G-5) | value.js `ActionBarLayer` |

What STAYS per-consumer (correctly NOT folded): the layer *topology* (0/1/N
layers is app-shaped), the `position:inline` outer wrapper, the
*exclusion-band geometry* (app chrome is app-specific — only the `env()`
boilerplate folds), the opulent identity chrome (fourier's rainbow play-btn,
keyframes' conic progress dot), and the app-domain logic (auth, scene routing,
editor ops). These are the divergence map's §3 D-1..D-6 — deliberately
consumer-owned.

---

## §5 — Leverage-the-base: the consumer end-state (thin slot-fillers)

After the fold, each consumer's dock is a THIN configuration of the base —
the test of "leverage THAT" is: a consumer dock file imports from
`@mkbabb/glass-ui/dock`, fills slots, binds the base composables, and carries
zero forked logic. The target shape:

```vue
<!-- e.g. keyframes ChromeDock.vue — the END STATE -->
<GlassDock v-model:expanded="expanded" :placement="{ safeArea: true }">
  <DockLayerGroup :active="layer">
    <DockLayer id="main">
      <DockSelectTrigger v-bind="sceneSelect" />   <!-- via useDockPopupMutex -->
      <DockIconButton v-for="… " :label="…" />     <!-- required a11y name -->
    </DockLayer>
  </DockLayerGroup>
</GlassDock>
<script setup>
const { expanded } = useGlassDock()
const sceneSelect = useDockPopupMutex(['scene','controls']).proxy('scene')
</script>
```

- **keyframes** `ChromeDock` + `TransportDock`: delete the `always-expanded`
  mask + `useMediaQuery`/`isMobile`, the `useExclusiveSelect`/`popupModel`
  pair, the `top: calc(max(…env…))`, the `watch(dockRef.expanded)`, the local
  `dock/index.ts` re-export. End: two thin `<Role>Dock` files leveraging the
  base. (keyframes-owned — tranche C.)
- **value.js** `ChromeDock`: delete `usePopupMutex` (85 LOC), the
  `useLayerTransition` fork (123 LOC), the precedence reducer, the
  `line-clamp-none` hack, the `always-expanded` mask. The heaviest consumer
  loses the most. (value.js-owned — proposed.)
- **fourier** `ToolDock`/`CanvasDock`/`TransportDock`: delete the local
  `.dock-separator`/`.dock-spacer` re-decls, the `.view-dot` bespoke dot, the
  `.dock-badge` widget; keep the identity chrome. (fourier-owned — proposed.)

The convergence is COMPLETE when each consumer's dock is `<Role>Dock` over the
base, no `useDock*` re-implemented locally, and the role vocabulary is the
only dock naming in the constellation.

---

## §6 — Sequencing + the inv-16 boundary

1. **glass-ui lands the base** (the 7 dock-forward waves, `useDock*` canonical
   names, the `useTouchGate→useDockTouchGate` rename + alias, `DockTabButton`
   retire) on its own checkout, gated on its own CI. This is the precondition
   — consumers cannot "leverage THAT" until the base is complete.
2. **Consumers migrate per wave landing**: as each base capability ships, each
   consumer deletes its hand-roll and renames its instance to `<Role>Dock`.
   The migration is mechanical (the §4 table is the checklist) and verified by
   the dock-forward waves' hard gates.
3. **keyframes' obligations** (the only items keyframes writes): converge its
   two mutex copies onto one NOW; rename `TopDock→ChromeDock`,
   `AnimationMenuBar→TransportDock`; delete the local `dock/index.ts`; on each
   base landing, swap the hand-roll for the base. These fold into tranche C's
   demo waves (C.W2/C.W3 touch the demo + the dock) and are tracked there.
4. **The constellation ledger** (`HUB/docs/constellation/ADOPTION-ASKS.md`,
   fourier-owned) is where the orchestration lead binds the role vocabulary +
   the rename map as the cross-repo convention; keyframes proposes it here, the
   lead routes it. **keyframes writes nothing into glass-ui, value.js, or
   fourier** — every rename outside keyframes is a proposal that lands on the
   target's own clean checkout (inv-16′).

**One-line summary.** Adopt ONE role vocabulary (`ChromeDock` /
`TransportDock` / `CanvasDock` / `ToolDock`), give every folded composable ONE
canonical `useDock*` name in the base, drive the 7 dock-forward waves so ALL
dock logic lives in glass-ui, and reduce each consumer's dock to a thin
`<Role>Dock` slot-filler over the base — the constellation stops re-inventing
the dock and starts leveraging it.
