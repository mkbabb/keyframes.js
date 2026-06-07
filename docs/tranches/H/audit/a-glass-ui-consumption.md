# Tranche H Deep Audit — Lane A: glass-ui consumption

**Scope.** How `demo/` consumes `@mkbabb/glass-ui@3.4.0` (published, registry — NO
`file:`): the surfaces (Card / GlassPanel / dock / DarkModeToggle), the forms /
labeled-field, the hover/glow treatments. Ownership verdict for the three glass-ui
adjacent defects — **D2** (radial blur hover), **D5** (dock lag), **D9** (@mbabb
popover dead) — plus **D13** (mobile drawer not springy) and **D14** (specular
refinement). The dock is being reworked **right now** in glass-ui's AW tranche, so
dock items are **AUDIT + SUGGEST + TAG glass-ui-HANDOFF**, never patch-in-kf.

**Method.** Read `node_modules/@mkbabb/glass-ui/dist` (CSS sheets + bundled JS +
`.d.ts`) and every demo import site; reproduced live against the running demo at
`http://localhost:5174` with the playwright MCP (computed `::before` styles, trusted
clicks, route-state observation).

---

## Consumption map (what the demo pulls from glass-ui 3.4.0)

Named-import tally across 37 `.vue`/`.ts` import sites (parsed, multi-line aware):

| Surface family | Imports | Notes |
|---|---|---|
| `Button` | 19 | core glass button |
| `Card` / `CardContent` / `CardTitle` / `CardHeader` / `CardFooter` | 10+ | **every demo `<Card>` omits `surface=` → defaults to `surface="glass"`** (see D2) |
| `Select` + `SelectContent/Item/Value/Group/Trigger/Separator/Label` | 8 | dropdowns |
| `Slider` | 7 | controls |
| `Tabs*` | 5 | filing-tab panels |
| `Dialog*` / `Drawer*` / `Popover*` / `HoverCard*` / `DropdownMenu*` / `ContextMenu*` | 1–3 | overlays |
| `Switch` / `Label` / `Avatar*` / `Separator` / `TooltipProvider` | 1–5 | atoms |
| `useTouchGate` | 2 | touch composable |

Subpath entry points consumed (idiomatic — the demo uses the tree-shaken subpaths,
not just the barrel):

```
9 @mkbabb/glass-ui/forms          (Input)
6 @mkbabb/glass-ui/icon-tooltip
6 @mkbabb/glass-ui/dock           (GlassDock, DockIconButton, DockSelectTrigger,
                                   DockDropdownTrigger)
3 @mkbabb/glass-ui/keyboard
3 @mkbabb/glass-ui/controls       (DarkModeToggle)
2 @mkbabb/glass-ui/styles         (the global CSS import — style.css)
2 @mkbabb/glass-ui/status-dot
2 @mkbabb/glass-ui/motion-core    (SpringProgress lineage; dock dogfoods it)
2 @mkbabb/glass-ui/labeled-field  (LabeledSelect/Input/Slider/Switch)
2 @mkbabb/glass-ui/dark
1 @mkbabb/glass-ui/header-ribbon
1 @mkbabb/glass-ui/glass-panel    (EasingCurveCanvas.vue:107 — the ONE GlassPanel site)
```

**Verdict on consumption hygiene (ALREADY-SOTA where earned):** the labeled-field /
forms / subpath consumption is exemplary — `LabeledSelect/LabeledInput/LabeledSlider/
LabeledSwitch` (`LayerConfigPanel.vue:49`, `AnimationControlsControls.vue:179`) are the
idiomatic glass-ui form rows, not hand-rolled label+input. `design-idioms.css` already
OWNS the demo's playful vocabulary (`--rainbow-*`, `--color-gold`, `.scale-on-hover`)
instead of renting it transitively (the D.W2 idiom-ownership pass). No regression there.
The defect surface is concentrated in **surface-decoration choice** (D2/D14) and **dock
trigger composition** (D5/D9).

---

## D2 + D14 — the "radial blur" hover is glass-ui's specular catch-light, and the demo opted EVERY Card into it

**This is the headline finding and it root-causes BOTH the D2 candidate misattribution
AND the "cartoon-shadow regression."**

### What the user sees
A bright circular/radial glow blooms under the pointer on hover across panels, header,
timeline. The user (D14 clarification) is precise: *the glass is good; the radial blur
is the defect; reconcile with the cartoon-shadow depth — a refined specular, not a
broken radial blur.*

### Root cause (glass-ui-owned mechanism, demo-owned activation)
The D-tranche candidate in the brief (`design-idioms.css:263-269`
`--glow-spread/--glow-blur`) is a **red herring** — that block is `.progress-dot`, the
active-PLAYING conic-ring, NOT a hover treatment (`design-idioms.css:258-270`). The demo
authors **no** radial-blur hover anywhere (`grep` of `@/styles/*.css` for
`radial|specular|backdrop-filter` returns only the progress-dot + the focus ring).

The real source is glass-ui's
`node_modules/@mkbabb/glass-ui/dist/styles/glass-specular-track.css`. It paints a
`::before` pseudo:

```css
.glass-specular-track::before {
  background: radial-gradient(circle at var(--specular-x,50%) var(--specular-y,50%),
    hsl(40 30% 100% / 0.55) 0%, hsl(40 30% 100% / 0.22) 22%, transparent 55%);
  opacity: var(--specular-intensity, 0.35);   /* rest 0.35 → hover 0.6 → active 0.85 */
  mix-blend-mode: screen;
  mask-image: radial-gradient(circle …);
}
.glass-specular-track:hover::before { --specular-intensity: 0.6; }
```

Live confirmation (computed `::before` on a demo Card, viewport 1440):
`background = radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.22)
22%, rgba(0,0,0,0) 55%)`, `opacity = 0.35`, `mix-blend-mode = screen`. A white,
screen-blended radial that brightens to 0.6 on hover — exactly the "radial blur."

### Why it's EVERYWHERE — the demo-owned activation
glass-ui's `<Card>` has a first-class surface API
(`dist/components/ui/card/Card.vue.d.ts:13-35`):

```ts
type CardSurface = "glass" | "cartoon";   // default "glass"
//  glass   → renders glass-specular-track  (the radial catch-light)
//  cartoon → overlays cartoon-surface       (2px border + offset-stamp shadow + hover-lift)
```

**Live DOM:** every demo Card renders `data-surface="glass" data-tier="resting"
class="… glass-resting glass-specular-track shadow-card"`. `grep 'surface='` over all
demo `*.vue` returns **zero** hits — no demo Card ever passes `surface=`, so all 10+
default to `glass` and inherit the specular. 12 `glass-specular-track` elements live on
the easing scene alone (Cards + DockIconButtons).

### The cartoon-shadow "regression" — it was NEVER removed from glass-ui
D2 says cartoon-shadow was CLOSED in Tranche C and is now regressed. The truth:
`cards.css` STILL ships `cartoon-surface` (`@utility cartoon-surface`, `cards.css:33`)
with `border-width:2px; box-shadow: var(--shadow-cartoon-md)` and a
`&:hover { translate: var(--lift-sm); box-shadow: var(--shadow-cartoon-lg) }` lift, and
the Card prop `surface="cartoon"` is the documented opt-in
(`Card.vue.d.ts:18-22`, *"the retired `<CartoonCard>` was `tier='quiet'
surface='cartoon'`"*). Live: 3 demo elements DO carry `cartoon-surface` (the easing /
spring / sequence scene targets apply the class directly). **The demo stopped opting its
Cards into the cartoon surface; the depth treatment is alive in glass-ui 3.4.0, just
unrequested.** This is a demo-side regression, not a glass-ui one.

### Gestalt fix (the elegant single motion — NOT a workaround)
Two complementary moves, both demo-side, no glass-ui patch:

1. **D2 — restore cartoon depth on the panel/card surfaces** that should read as
   sticker-depth (the controls panels, header, timeline cards): pass
   `surface="cartoon"` on those `<Card>`s. This is the idiomatic, gestalt knob glass-ui
   purpose-built — flip the surface register, get the `--shadow-cartoon-*` offset-stamp
   + hover-lift, lose the radial. ONE prop per surface, no CSS authored.

2. **D14 — refine the specular for the surfaces that KEEP glass.** The user wants the
   glass + a refined specular, not the harsh white bloom. Two sub-options, pick by
   measure:
   - **Demo-side knob (SHIP-in-H):** the intensity is a typed custom property
     (`--specular-intensity`, registered `inherits:false`). The demo can tame it on the
     glass surfaces by setting `--specular-intensity` lower at rest/hover in
     `design-idioms.css` (e.g. rest 0.18, hover 0.32) — owned, gate-able, no glass-ui
     change. This is the "refined specular" with zero cross-repo coupling.
   - **glass-ui-HANDOFF (BOOK):** if the harsh 0.55 white stop + `screen` blend reads
     as broken in MANY consumers, the default rest/hover floor (0.35→0.6, `cards.css`
     tier) is too hot for `resting` glass panels — propose glass-ui soften the DEFAULT
     specular curve and/or expose a `specular` Card prop (`off | subtle | full`) so the
     opt-in is explicit rather than always-on. Hand off to glass-ui; do not patch in kf.

**Disposition:** D2 = **SHIP-in-H** (demo passes `surface="cartoon"`). D14 = **SHIP-in-H**
(demo `--specular-intensity` tune) **+ glass-ui-HANDOFF** (default-intensity / explicit
`specular` prop ask, BOOK).

**Instrument (proof gate):** `proof:no-stray-radial` — a visual-lock test that hovers
each panel/header/timeline Card and asserts the computed `::before background` does NOT
contain a `radial-gradient` with an alpha-stop ≥ 0.4 (catches both "specular too hot"
and "specular present where cartoon expected"); paired with a DOM assertion that the
panel Cards carry `data-surface="cartoon"`.

---

## D9 — @mbabb popover dead: a demo-side DOUBLE-TRIGGER nesting (NOT glass-ui)

### Reproduced live
Trusted playwright click on `[aria-label="@mbabb menu"]` → `aria-expanded` stays
`"false"`, `data-state="closed"`, no `[role="menu"]` mounts. The dropdown does not open.

### Root cause
`App.vue:18-21`:

```vue
<DropdownMenu>
  <DropdownMenuTrigger as-child>
    <DockDropdownTrigger aria-label="@mbabb menu">@mbabb</DockDropdownTrigger>
  </DropdownMenuTrigger>
  …
```

`DockDropdownTrigger` **is itself a `DropdownMenuTrigger`**. Proof from glass-ui:
- `DockDropdownTrigger.vue.d.ts:` `type __VLS_Props = DropdownMenuTriggerProps & {…}`
  (*"variable-width DropdownMenu trigger for use inside GlassDock"*).
- `dock.js` setup renders `g(L(W), C(L(r), …))` where the import map resolves
  `W = DropdownMenuTrigger` from reka-ui (`dock.js` top: `import { DropdownMenuTrigger
  as W, … } from "reka-ui"`).

So App wraps a `DropdownMenuTrigger` **inside another `DropdownMenuTrigger`**. The outer
`as-child` merges its trigger bindings onto the inner trigger element, producing two
competing trigger controllers on one node — the click cancels and the menu never opens.
This mirrors exactly how `DockSelectTrigger` (the working dock dropdowns) is consumed:
`ChromeDock.vue:144` uses `<DockSelectTrigger>` **directly** inside `<Select>` with **no**
outer `SelectTrigger` wrapper — and those open fine. The dropdown trigger broke because
it got the wrapper the select trigger correctly does without.

### Gestalt fix (demo-side, one deletion)
Drop the redundant outer wrapper — use `DockDropdownTrigger` AS the trigger, exactly like
`DockSelectTrigger`:

```vue
<DropdownMenu>
  <DockDropdownTrigger aria-label="@mbabb menu">@mbabb</DockDropdownTrigger>
  <DropdownMenuContent …>…</DropdownMenuContent>
</DropdownMenu>
```

(`DockDropdownTrigger` already inherits the `DropdownMenu` context provided by App's
`<DropdownMenu>`, since it renders the real reka trigger internally.) NO glass-ui change.

**Disposition:** **SHIP-in-H** (demo-owned). Note: D9 is tied to D5 in the brief, but the
mechanism is independent — D9 is pure composition, not dock animation.

**Instrument:** `proof:mbabb-popover-opens` — playwright click the @mbabb trigger, assert
`aria-expanded === "true"` and a `[role="menu"]` with the Share / Dark-mode / About items
mounts. Lock it so the wrapper can't creep back.

---

## D5 — dock lag: glass-ui AW-domain mechanism; demo passes a long `collapse-delay`

### Observed
The dock animations feel slow/laggy on collapse↔expand. Live: the dock motion is a
`SpringProgress` FLIP (glass-ui imports `SpringProgress` from `@mkbabb/keyframes.js` —
the dock dogfoods kf!), driven by `--dock-motion-resize = 0.3s linear(spring…)`
(`dock.css:26`, computed `--duration-normal = 0.3s`). The layer crossfade rides the SAME
`--dock-motion-resize` lockstep (`dock.css` AU.W2 fold). 0.3s spring is reasonable — the
*lag* the user feels is most plausibly two demo-side knobs compounding the perceived
sluggishness, not the spring duration itself:

1. **`ChromeDock.vue:116`** passes `:collapse-delay="2500"` — the dock waits 2.5s before
   auto-collapsing after pointer-leave. Combined with `:start-collapsed="true"`, the
   collapsed→expanded entry on first hover, then a long hold-open, reads as "laggy /
   stuck open." This is a demo prop, tunable now.
2. **`:fit-content="true"`** + the FLIP width measurement means each expand re-measures
   intrinsic width; with the controls-tab + scene-select + @mbabb items all mounting,
   the morph distance is large.

The CSS spring machinery itself is glass-ui AW-in-flight (`dock.css` carries the
AV.W9/AU.W8b "one driver owns the morph" rework — they retired the native container-morph
arm that raced the spring). **Do not touch the dock CSS in kf.**

### Suggest
- **Demo-side (SHIP-in-H, MEASURE-FIRST):** drop `collapse-delay` to ~800–1200ms so the
  dock settles back promptly; the 2500ms hold is the dominant "feels laggy" contributor.
  Measure with a before/after timing of pointerleave→collapsed.
- **glass-ui-HANDOFF (AW tranche):** if the FLIP+spring settle itself janks under load
  (re-measure cost per expand), that is glass-ui's `useLayerTransition` to optimize. Tag
  the AW tranche: *audit the FLIP re-measure cost when `fit-content` + many items; the
  0.3s spring + 0.3s lockstep crossfade may compound to a perceived >0.5s settle.*

**Disposition:** **SHIP-in-H** (demo `collapse-delay` tune, MEASURE-FIRST) +
**glass-ui-HANDOFF** (FLIP settle perf, AW).

**Instrument:** `proof:dock-settle-budget` — playwright drives expand→pointerleave→
collapsed and asserts the collapse completes within a budget (e.g. < delay + 350ms);
plus an FPS/long-task probe during the morph (MEASURE-FIRST gate).

---

## D13 — mobile drawer not springy + too slow: glass-ui/vaul-vue domain

The demo's mobile drawer is `ResponsiveSelect.vue:41` (`<Drawer>` from
`@mkbabb/glass-ui`). Its open/close transition is **not** the demo's to set:
`drawer.css:30` documents *"vaul-vue sets `transition: transform .5s
cubic-bezier(.32,.72,0,1)` … we do NOT override `transition`"*. So the drawer rides a
**500ms non-springy** curve (the vaul drag-resistance ease), exactly the "too slow, not
springy" the user reports. glass-ui already exports a `SpringProgress`-backed mount
helper (`useSpringMount`, `dist/useSpringMount-CnizvZGm.js`; `motion-core` subpath the
demo already imports) and dogfoods SpringProgress in the dock — the same engine the demo
ships.

**Disposition:** **glass-ui-HANDOFF** (the drawer transition lives behind
vaul-vue inside glass-ui's `DrawerContent`; a demo-side `transition` override fights
vaul's internal write — not idiomatic). Ask glass-ui to (a) speed the open/close to a
springy `SpringProgress`/`linear(spring)` curve at ~240–300ms, OR (b) expose a
`transition`/`spring` prop on `DrawerContent` so consumers opt into the springy register.
Tag it alongside the AW dock work since both are glass-ui motion. **RECORD** the demo-side
fallback (if glass-ui can't land it in H): the demo could replace the mobile
`ResponsiveSelect` Drawer leg with its OWN `SpringProgress`-driven sheet (dogfooding kf,
which D13 explicitly wants) rather than vaul — a larger move, BOOK it.

**Instrument:** `proof:drawer-springy` — measure the drawer open transition's settle time
(< 350ms) and assert the timing function is a `linear(spring)`/spring curve, not the
500ms `cubic-bezier(.32,.72,0,1)`.

---

## D12 corroboration (cross-lane note — scene-state corruption is LIVE and severe)

Not this lane's charge, but observed repeatedly and load-bearing for the dock/popover
audit: navigating to `#/cube` rendered the **easing** scene; the URL drifted
unprompted across calls (`#/spring` on first load, `cube#/easing`, `cube#/starting-style?
anim=Discrete+Preview`, `#/easing?anim=Easing+Preview`). Console shows a **Vue Router**
with deprecated `next()` guards firing on every nav
(8× `[Vue Router warn]: The next() callback … is deprecated`). The malformed
`cube#/easing` (path `cube`, hash `#/easing`) is a router/state-machine corruption. This
is the **scene-state-machine lane's** territory (D12); flagged here because a corrupted
route changes which surfaces mount, which can mask/unmask the D2/D9 repros. **RECORD** for
the D12 lane: the `next()`-deprecation + the path/hash mixing are concrete anchors.

---

## Summary of dispositions (this lane)

| Defect | Owner | Disposition | One-line fix |
|---|---|---|---|
| **D2** radial-blur hover | demo activation of glass-ui specular | **SHIP-in-H** | `<Card surface="cartoon">` on panel/header/timeline cards (restore cartoon depth) |
| **D14** specular refinement | glass-ui mechanism / demo knob | **SHIP-in-H** + **glass-ui-HANDOFF** | demo tunes `--specular-intensity` on glass surfaces; ask glass-ui to soften default / add `specular` prop (BOOK) |
| **D9** @mbabb popover dead | **demo** double-trigger nest | **SHIP-in-H** | delete the outer `<DropdownMenuTrigger as-child>` — use `<DockDropdownTrigger>` directly (mirror `DockSelectTrigger`) |
| **D5** dock lag | glass-ui AW + demo prop | **SHIP-in-H** (MEASURE-FIRST) + **glass-ui-HANDOFF** | lower `collapse-delay` 2500→~1000; hand FLIP settle perf to AW |
| **D13** drawer slow/non-springy | glass-ui/vaul-vue | **glass-ui-HANDOFF** | ask glass-ui for springy DrawerContent transition / `spring` prop; demo-own SpringProgress sheet is BOOK |
| consumption hygiene (forms/labeled-field/subpaths/idiom-ownership) | demo | **ALREADY-SOTA** | no change — exemplary |

**Net:** of the three glass-ui-adjacent defects, **D9 is demo-owned** (composition bug),
**D2 is demo-owned activation** of a glass-ui mechanism (cartoon never left glass-ui),
**D5 is shared** (demo prop + glass-ui AW FLIP), and **D13/D14's deeper knobs are
glass-ui-HANDOFF**. The biggest single win is two demo-side edits — `surface="cartoon"`
(D2) and dropping the trigger wrapper (D9) — neither of which touches glass-ui.
