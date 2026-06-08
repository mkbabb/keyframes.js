# R3 — Design + Modern-Web Reconciliation (read-only research)

Lane: R3 (design tensions, modern-web grounding). Scope: **F8, F3+F6, F7, F9, F1**
(F2/F4/F5 are other lanes' subjects — touched only where they intersect a design tension).
Method: SOURCE reads of the landed `tranche-h-impl` tree + the consumed `@mkbabb/glass-ui@3.4.0`
(`node_modules/@mkbabb/glass-ui/src/styles/*`), git history, the existing H gate harness, and
the `modern-web-guidance` skill (citations inline). **No build run** (W5 owns dist).

The headline finding governs F3/F6/F8 jointly and must be read first:

> **glass and cartoon ALREADY coexist in glass-ui 3.4.0.** `cartoon-surface` is a
> *decoration-only* utility — it is NOT a tier; it composes ON TOP of the `glass-${tier}`
> class the Card already emits. So `surface="cartoon"` panels DO have backdrop-filter blur +
> translucency today. What the user perceives as "less glassy" (F8) is (a) the Card's default
> tier `resting` (0.65 α — fairly opaque), and (b) `surface="cartoon"` does NOT emit
> `glass-specular-track`, so the iOS catch-light shimmer that read as "glassy" is absent on the
> panels (it survives ONLY on the one composite bezier card). The whole F3/F6/F8 cluster is
> therefore one decision: **pick the resting glass tier + decide the specular's fate**, then make
> it the broad default register. Pure-prop / token moves — no new backdrop CSS owed (inv-16).

---

## The glass-ui material model (the load-bearing source facts)

`@mkbabb/glass-ui@3.4.0` — `src/styles/cards.css:33`:

```css
@utility cartoon-surface {            /* DECORATION ONLY — composes onto a glass tier */
    border-width: 2px;
    box-shadow: var(--shadow-cartoon-md);  /* offset stamp; -4px 3px → bottom-LEFT */
    translate: 0;
    transition: translate … var(--spring-bouncy), box-shadow … var(--ease-apple);
    &:hover:not(:disabled) { translate: var(--lift-sm) var(--lift-sm); box-shadow: var(--shadow-cartoon-lg); }
}
```

The doc-comment is explicit (`cards.css:22-32`): *"Composes ON TOP of a glass tier — it is NOT
itself a tier… background / backdrop-filter / border-color come from the `glass-${tier}` class the
host already applies. `cartoon-surface` carries ONLY the three real deltas over a bare tier: a 2px
border weight, an offset-stamp shadow, and a hover-lift."*

Card emits (`dist/CardFooter…js:37`, default `tier:"resting"`, `surface:"glass"`):

```
glass-${tier}                                         ← supplies bg + backdrop-filter + border + box-shadow
surface==="glass"    && "glass-specular-track"        ← the iOS catch-light ::before  (DEFAULT)
surface==="cartoon"  && "cartoon-surface"             ← the offset-stamp depth
surface==="glass"    && shadow && "shadow-card"
```

So **`surface="cartoon"` = `glass-resting` + `cartoon-surface`**: blur(12px)+saturate (`glass.css:79`,
`--glass-blur-resting`), `--glass-bg-resting` = `color-mix(card, 0.65α)` (`tokens.css:574,647`), 2px
border, the cartoon offset shadow. The glass is *present* — it's the **0.65 α** that reads solid and
the **missing specular** that reads "flat."

The five-tier ladder (`tokens.css:572-575`, `glass.css:48-106`), alpha-monotonic:

| tier | α | blur | reads as |
|------|------|------|----------|
| wash | 0.30 | 1px | barely-there |
| **quiet** | **0.50** | **10px** | translucent glass — the old `.glass-card` plate |
| **resting** (Card default) | **0.65** | 12px | current panel — "less glassy" |
| floating | 0.80 | heavier | nav/dock |
| overlay | 0.95 | heaviest | modal |

The Card exposes a `tier` prop (`dist/Card.vue.d.ts:8` default `"resting"`). **Changing the tier is
the entire F8 lever** — no CSS.

---

## F8 — glass + cartoon TOGETHER as the default panel register

**Recommendation: keep `surface="cartoon"`, drop the panel Cards down ONE tier to `tier="quiet"`
(0.50 α + 10px blur), and restore a calm specular broadly (see F6). No new backdrop CSS.**

Rationale, against the binding spine:

1. **It is already the architecture — make the tier intentional.** The user's "any way to have
   both?" is answered by glass-ui's own model: cartoon IS a decoration over a glass tier. The
   "opacity" complaint is the `resting` (0.65) default reading too solid next to the old
   `.glass-card` which was `glass-quiet` (0.50, `glass.css:182-183`). Setting `<Card surface="cartoon"
   tier="quiet">` restores the *exact* α + blur of the pre-cartoon glass plate the user remembers,
   AND keeps the cartoon offset-stamp depth. This is the literal "have both," delivered by a NAMED
   prop, not a workaround.

2. **MEASURE-FIRST / isomorphic-unless-named.** `quiet` 0.50 α is the documented "the missing rung"
   that the prior `.glass-card` used. Reverting the panel register to it is the *isomorphic* glass
   read the user had; the cartoon shadow is the *named befitting delta* W2 added. This satisfies
   "styling ISOMORPHIC unless a NAMED befitting delta."

3. **What the W2 S2-COMPOSITE proved (and how to make it the calm default).** The bezier card
   (`TimingFunctionPanel.vue:30`) co-applies `surface="cartoon"` + `glass-specular-track` +
   `.cartoon-specular` and proved glass-blur + cartoon-shadow + tracked specular can stack on one
   surface with no glass-on-glass (`glass-specular-track.css:26-30`: the `::before` is a LIGHT layer,
   not a second backdrop plate). F8 wants that *minus the drama*: the **calm, broad** version is
   `tier="quiet"` glass + cartoon shadow on EVERY panel, with the specular either consistent-and-calm
   or removed (F6). The composite recipe stops being a one-off exception and becomes the register.

4. **Reduced-transparency is already honored** (`glass.css:367-383` maps every `--glass-blur-*` to
   `none` and α to 1 under `prefers-reduced-transparency: reduce`; the cartoon shadow + border stay).
   Dropping a tier does not weaken this — the bracket keys off the tier tokens, not the surface prop.

**Modern-web grounding** (`modern-web-guidance` `css` §8 *Depth and texture*): *"Layer multiple
shadows for realistic soft depth effects"* and *"Use `mix-blend-mode` … for lighting overlays (limit
scope with `isolation: isolate`)"*. glass-ui's stack already does exactly this — the cartoon
multi-shadow (`tokens.css:546-551`, three layers) IS the layered-shadow idiom, and the specular
`::before` uses `mix-blend-mode: screen` (`glass-specular-track.css:80`). No re-authoring needed;
the recommendation is purely *which glass-ui tier + whether the light layer is present*.

> **Gate to evolve (H.W8):** `proof:cartoon-is-panel-depth` (CS-2) currently locks ≥5 panels to
> resolve `--shadow-cartoon-md`. It does NOT assert the tier, so a `tier="quiet"` flip keeps it
> GREEN (the shadow token is unchanged). A NEW born-RED clause should assert the panel Cards resolve
> a TRANSLUCENT background (`backdrop-filter ≠ none` AND background α < 1 in the
> non-reduced-transparency case) — born-RED if a future regression flips them opaque. That clause is
> the F8 "glass is back" lock. (Lane R3 flags it; the gate-regime lane authors it.)

---

## F3 + F6 — the specular: make it CONSISTENT-and-calm, or REMOVE it

**Decisive recommendation: REMOVE the specular entirely from the panel register. Keep cartoon depth
+ quiet glass (F8) as the calm material; do NOT re-introduce a tracked catch-light on the panels.**

This is the user's own lean ("perhaps we just remove it?") and it is the more defensible engineering
call. The trade-off, laid out honestly:

### Why remove wins

- **F3 says it is WAY TOO DRAMATIC even at the calmed 0.22/0.4 tune.** The existing
  `proof:specular-calm` already caps the composite at rest ≤ 0.25 / hover ≤ 0.4
  (`proof-specular-calm.mjs:76-77`), and the user STILL reads it as overpowering. The drama is not
  only opacity — it is a **moving, white-cored (`hsl(40 30% 100% / 0.55)`), `screen`-blended radial
  that tracks the cursor** (`glass-specular-track.css:63-80`). Lowering opacity further would dim it
  toward invisibility while keeping the motion; you'd pay all the complexity (pointer listener, typed
  `@property` transition, the `inherits:false` projection hack) for a glow nobody can see. That is
  the opposite of KISS.

- **F6 is the consistency complaint: it's on ONE surface and looks arbitrary.** It exists only on the
  bezier card because that template alone manually adds `glass-specular-track` (line 30) on top of a
  `surface="cartoon"` Card. Every other panel is cartoon-only (no track). So the choice is binary:
  put the tracked light on *every* panel, or on *none*. Putting it everywhere multiplies a
  per-surface `pointermove` listener (`useSpecularPointer.ts:62`) across N panels and re-introduces
  the very "radial blur on hover everywhere" the W2 `proof:no-orphan-specular` gate was built to KILL
  (its docblock: *"the strange circular/radial blur on hover everywhere"*). Removing is the coherent
  gestalt; spreading it re-opens the chronic.

- **The composite was a W2 *concession*, not a north star.** `proof:cartoon-specular-coexist`'s
  docblock frames the bezier card as "the glassy panel I LIKE" — a single deliberately-glassy
  direct-manipulation surface. F3+F6 are the user retracting that: the catch-light, even calmed, is
  unwanted. Honoring the latest authoritative direction (the spine: "treat them as the user's
  authoritative direction") means the W2 composite exception should be RETIRED, not propagated.

- **No-legacy / DRY dividend.** Removing it deletes: the manual `glass-specular-track` class on the
  bezier card, the `.cartoon-specular ::before` projection rules in `design-idioms.css:262-282`, the
  `useSpecularPointer` wire in `TimingFunctionPanel.vue:197-198`, and — if no other consumer remains
  — `useSpecularPointer.ts` itself. The `.cartoon-specular` *name* can stay as a pure
  `@apply cartoon-surface` alias for the bezier card's standalone depth, or fold to plain
  `surface="cartoon"`. Net: less code, one register.

### What "consistent-and-calm" (the rejected alternative) would cost

If the triumvirate instead wants the light KEPT, the only coherent form is: emit
`glass-specular-track` on ALL panel Cards (a glass-ui Card change — a HANDOFF, since the prop API is
cartoon-XOR-specular today, `CardFooter:37`) + wire `useSpecularPointer` per panel + dial rest toward
~0.12–0.15. The trade: more moving parts on every surface, a per-pane pointer listener tax, and it
fights F3's "too dramatic" instinct. Not recommended. If chosen, `proof:specular-calm`'s ceiling must
drop and `proof:no-orphan-specular` must be re-scoped (it currently *requires* the absence of the
track on cartoon panels).

> **Gates to evolve (H.W8) — REMOVE path:** the three W2 specular gates are now born-RED *against the
> new direction* and must be retired/inverted, paired with a born-RED replacement that BITES on the
> new invariant:
> - `proof:no-orphan-specular` — its CLAUSE 1 enumerated-exception set `{TimingFunctionPanel bezier}`
>   becomes the EMPTY set; the new invariant: **zero** `.glass-specular-track` on any kf-owned `<Card>`
>   (the bezier exception is gone). This is *stronger* and still bites a re-introduced `surface="glass"`.
> - `proof:cartoon-specular-coexist` and `proof:specular-calm` — RETIRE (their subject, the composite,
>   no longer exists). Chronic-closure discipline: a chronic exits via a SYSTEM-property gate; the
>   replacement system property is "no panel paints a tracked catch-light" (the new no-orphan clause).
> - `proof:specular-handoff` (the glass-ui-owned Button/dock tracks) — UNCHANGED; those are glass-ui's,
>   not in scope.

---

## F7 — the cartoon hover box-shadow is "sharp / cut off in the bottom-left"

**Root cause (confirmed from source): the cartoon shadow projects into the bottom-LEFT, and the
controls-pane ancestor clips that quadrant.**

The cartoon shadow offsets are **negative-x, positive-y** (`tokens.css:546-551`):
`--shadow-cartoon-md: -4px 3px …` → `--shadow-cartoon-lg: -6px 4px …` (hover). Negative x = the
shadow falls to the **left**; positive y = **down**. So the catch is the **bottom-left** corner —
exactly where the user sees the cut.

The clipping ancestor is `ControlsPaneWrapper.vue`:

- Desktop wrapper: `overflow: hidden` (`:182`) — required for the [rail]-track collapse animation
  (the named `rail·stage·rail` grid track shrinks `--rail-width ↔ 0`).
- The inner pane becomes `overflow-y-auto` once open (`:21`) — a scroll container also clips its box.
- `.controls-content` adds shadow-clearance padding **only on the right + bottom**
  (`:207-208`: `padding-right: 12px; padding-bottom: 12px`). There is **NO `padding-left`** — but the
  cartoon shadow goes LEFT. The clearance is on the wrong side. The bottom-left shadow lands outside
  the padded box and is sliced by the `overflow:hidden`/scroll clip.

The panel Cards themselves correctly set `overflow-visible` (AnimationControlsControls `:3`, RibbonBar
`:3`, KeyframeTimeline `:3`) — but a child `overflow:visible` cannot escape an *ancestor*
`overflow:hidden`. The clip is the wrapper's, not the card's.

**Idiomatic fix (in priority order):**

1. **Add symmetric shadow-clearance to `.controls-content` — `padding-left` + `padding-bottom`** to
   match the shadow's actual bottom-left throw (and keep right for the rare positive-x layer of the
   3-shadow stack). Cheapest, no behavior change. The shadow then renders inside the padded box and
   the wrapper's clip never reaches it. (This is the demo's own existing idiom — it already does this
   for the right/bottom; it just chose the wrong sides.)

2. **`overflow: clip` + `overflow-clip-margin` on the wrapper** — the modern "scalpel" replacement for
   `overflow: hidden`. `modern-web-guidance` `overflow-clipping-control`: *"`overflow: clip` combined
   with `overflow-clip-margin` provides the scalpel… establishes a visible safety zone allowing child
   element shadows to render safely outside without altering layout geometry."* Caveat from the
   guide: **`overflow-clip-margin` has limited availability** (Firefox 148+ only as of 2026; not yet
   Chrome/Edge/Safari), so it is a *progressive-enhancement* layer, NOT the base — and `overflow:
   clip` "completely disables scrolling," which is a problem here because the inner pane scrolls. So
   `overflow-clip-margin` is the *nice-to-have* on the non-scrolling outer wrapper only; the **base
   fix must be option 1** (padding), which works everywhere.

3. **DO NOT** "fix" it by removing the wrapper's `overflow:hidden` — that clip is load-bearing for the
   [rail]-track collapse (`ControlsPaneWrapper.vue:171-173` documents why). Option 1 keeps the clip
   and just gives the shadow room inside it.

> **Gate (H.W8):** a born-RED browser clause: at #/cube desktop, the active panel Card's rendered
> bounding box + its resolved cartoon shadow extent (left edge minus the shadow's |x| offset) is
> within the `.controls-pane` content box (i.e. the shadow's leftmost pixel ≥ pane left edge). Bites
> the current tree (shadow left of the padded box); greens once `.controls-content` clears the left.
> Mirrors `proof-stage-not-clipped.mjs`'s viewport-containment plumbing.

---

## F9 — restore the controls idle-fade (was extant)

**Recommendation: re-introduce the pane resting-dim, driven by `@vueuse/core`'s `useIdle` rather than
a hand-rolled `setTimeout`. On desktop the controls pane rests at a low opacity, lifts to full on
hover/interaction, and dims again after the idle timeout.**

### It WAS extant — the precedent (git `3b8b468`, *"controls pane hover"*)

`AnimationControlsGroup.vue` (that era) had, on desktop only:
- `.controls-pane--open { opacity: 0.75; transition: opacity 0.4s ease-in-out; }` — the **resting
  dim**.
- `.controls-pane--hovered.controls-pane--open { opacity: 1; }` — full on hover.
- a JS "linger" timer (`:312-316`): on `mouseleave`, a `setTimeout(…, 2000)` kept it at full for 2s
  before settling back.

The user's F9 ("after ~10s of no engagement → MUCH MORE transparent") is the SAME idiom with (a) a
longer idle window and (b) a lower resting opacity. The mechanism already exists in the landed tree:
`ControlsPaneWrapper.vue` consumes `isPaneHovered` + `onPaneMouseEnter/Leave` from a
`useControlsLayout` composable and applies a `controls-pane--hovered` class (`:11,16-17`). F9 is a
small, idiomatic extension of that wiring — not a new subsystem.

### The modern idiom: `@vueuse/core` `useIdle`

`useIdle` IS installed (`@vueuse/core@^14.3.0`, `package.json`) and exported
(`index.d.ts:2930`): `useIdle(timeout?: number, options?: UseIdleOptions): UseIdleReturn`.

```ts
import { useIdle } from "@vueuse/core";
const { idle } = useIdle(10_000); // 10s — F9's window
// idle: ShallowRef<boolean> — true after 10s with no tracked activity, false on any.
```

Key facts for the implementer (lane W-impl):
- Default tracked events (`index.d.ts:2902`): `['mousemove','mousedown','resize','keydown','touchstart','wheel']`
  + document `visibilitychange` (`:2910`). So scrubbing a slider, typing in a field, or scrolling the
  pane all RESET idle — "engagement" is correctly broad.
- Returns `idle`, `lastActive`, `reset()`, `stop()` (`UseIdleReturn`, `:2918-2922`).
- **Scoping note (important):** `useIdle` listens on the **window**, so it measures *global* page
  inactivity, not pane-local. For F9 that is the correct read ("no engagement anywhere → the controls
  recede"). If pane-local idle is wanted instead, pass `options.events: []` and drive `reset()` from
  the pane's own `pointermove`/`focusin` (or keep the existing `isPaneHovered` as the override). The
  recommendation: **global `useIdle(10_000)` for the dim, AND the existing `isPaneHovered`/`:focus-within`
  as the immediate full-opacity override** — so hovering the pane lifts it instantly even mid-idle.

### The opacity binding (idiomatic, compositor-friendly)

Drive ONE class off `idle && !isPaneHovered` and let CSS own the opacity + transition:

```css
@media (min-width: 1024px) {
  .controls-pane-wrapper { transition: opacity var(--duration-normal) var(--ease-standard); }
  .controls-pane--idle:not(.controls-pane--hovered) { opacity: var(--controls-idle-opacity, 0.35); }
  .controls-pane-wrapper:hover,
  .controls-pane-wrapper:focus-within { opacity: 1; }   /* :focus-within keeps it up for keyboard */
}
```

- `opacity` is a **compositor-thread** property (`modern-web-guidance` `css` §9 *Performance*: *"Prefer
  to animate `opacity` and `transform`… to ensure animations stay on the compositor thread"*) — the
  fade is cheap.
- **A11y (mandatory).** Guard with `@media (prefers-reduced-motion: reduce) { …{ transition: none } }`
  so the dim snaps rather than animates for motion-sensitive users (`css` §9 *Accessibility*). Also
  ensure the idle dim is never so low it fails contrast while the pane still captures pointer/focus —
  ~0.35 keeps controls legible; do not go below ~0.25. `:focus-within` in the override is essential so
  a keyboard user tabbing into the pane is never left interacting with a ghosted surface (the old
  precedent had no focus override — this is a NAMED a11y improvement over the historical idle-fade).
- Token the magnitude (`--controls-idle-opacity`) in `design-idioms.css` so the "how dim is idle" is
  one demo-owned decision (matches the file's existing token discipline, e.g. `--mask-fade`).

> **Gate (H.W8):** browser clause — at #/cube desktop, pane open, fire no events for >10s (advance via
> `useIdle`'s own clock / a Playwright wait), assert the pane's computed `opacity` drops to
> `--controls-idle-opacity`; then `page.hover` the pane and assert it returns to 1. Born-RED today
> (no idle dim exists in the landed tree); greens on the restore. Non-vacuity: the resting (active)
> opacity must be 1 so the dim is a real delta.

---

## F1 — controls row: label-LEFT / value-RIGHT, while staying ONE column

**Recommendation: make each field row an internal `grid-cols-[auto_1fr] items-center` (label cell |
control cell), WITHOUT changing the outer single-column stack. The reconcile is trivial because the
`proof:single-column-pack` gate measures the `.labeled-field` ROW box, not its children.**

### The reconcile with `proof:single-column-pack` (the key insight)

`proof-single-column-pack.mjs:207-221` measures `getBoundingClientRect()` of each
`.controls-content .labeled-field` element and asserts: (a) all visible rows share ONE left-edge x
(`:233`), (b) all rows are one width ±2px (`:248-249`). **It measures the ROW element, not the
label/control inside it.** An internal `grid-cols-[auto_1fr]` split changes only the *intra-row*
layout (where the label vs control sit *inside* the row box); the `.labeled-field` element keeps the
SAME left edge and SAME width. **So F1 and proof:single-column-pack are fully compatible** — the gate
stays GREEN. (Confirm during impl: the split must be applied to a wrapper the gate's selector still
matches as `.labeled-field`, or to the `.labeled-field` element's own display. Per the W3 docblock,
the two-track grid that was BANNED was at the *sidebar container* level — two fields side-by-side; an
*intra-row* label|control split is a different axis and not what the gate forbids.)

### Where label-LEFT/value-RIGHT already lives idiomatically (the in-tree precedent)

`AssetPropertiesPanel.vue:6` already does exactly this and is the model to copy:

```html
<div class="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1.5">
  <label …>name</label>  <Input … />
  <label …>x</label>     <Input … />
  …
</div>
```

ONE grid, `auto` label column + `1fr` value column, rows stacked — label-left, value-right, single
column of rows. This is the "OLD correct layout" the user remembers (it survived in the asset panel;
W3 collapsed it in the *animation* sidebar). It is the same `grid-cols-[auto_1fr]` token-shape the
W3 docblock named as the thing it *removed at the sidebar level* — the resolution is to put it back
**at the row level**, not the sidebar level.

### How to apply it to the glass-ui LabeledField family (the idiomatic seam)

The advanced panel uses glass-ui's `LabeledField`/`LabeledSelect`/`LabeledSlider`/`LabeledSwitch`
(`LayerConfigPanel.vue:59`). In glass-ui 3.4.0, `LabeledField` renders a **block stack** — `<label>`
then slotted control then error (`glass-ui/src/components/custom/labeled-field/LabeledField.vue:2-26`);
the `.labeled-field` utility owns only `--field-label-color` (`utilities.css:62`), NOT a flex/grid —
so the natural flow is **label-above-control**. There is **no `orientation` prop** in 3.4.0 (verified:
no `orientation` in the dist `.d.ts` props `{label,tooltip,labelClass,required}` nor in the sibling
`/Users/mkbabb/Programming/glass-ui` source).

Two idiomatic paths — recommend **(A) as a glass-ui HANDOFF**, with **(B) as the demo-side born-GREEN
pairing** so the chronic closes today:

- **(A) glass-ui HANDOFF — add `orientation="horizontal"` to `LabeledField`.** The first-class fix: a
  prop that toggles `.labeled-field` to `display:grid; grid-template-columns:auto 1fr; align-items:center;
  column-gap:var(...)` (the error region spans both columns via `grid-column:1/-1`). This is the
  reusable, DRY home — every consumer of the family (the demo's sidebar, asset panel, and other repos)
  gets label-left/value-right by one prop, instead of each re-authoring a grid. Per inv-16, glass-ui
  items are consumed PUBLISHED, so this lands as a glass-ui ask + a born-RED kf gate (chronic-closure
  discipline: HANDOFF paired with a born-RED gate).
- **(B) demo-side, today.** Until (A) ships, the demo can wrap the panel's fields in
  `grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1` and rely on `.labeled-field` being a
  *block* (so its `<label>` + control become the grid's auto-flow cells) — OR override `.labeled-field`
  within the panel scope to the grid shape. Mirrors `AssetPropertiesPanel.vue` exactly. This is the
  born-GREEN demo pairing; (A) is the durable home.

### Modern-web nuance (don't misapply the "labels above" guidance)

`modern-web-guidance` `forms` §2 says *"place labels above form controls to enable faster scanning"*
and *"use single-column layouts."* **That guidance targets data-entry FORMS** (sign-up, address,
payment — long typed inputs scanned top-to-bottom). The F1 surface is a compact **settings / property
panel** (blend / z-index / weight / enabled — short labels paired with small controls), where
**label-left / value-right is the established settings-row idiom** (macOS/iOS Settings, the in-tree
`AssetPropertiesPanel`). The `forms` §2 *Gestalt Proximity* rule still applies and the grid honors it:
`gap-y` (between rows) > `gap-x` (label↔control within a row) keeps each label visually bound to its
control. And `single-column` is preserved — it is ONE column of rows; the label|value split is
intra-row, not a second column of fields. So F1 satisfies the forms guidance correctly read; the
"labels above" line is for a different surface class.

> **Gate:** `proof:single-column-pack` stays the F1 gate — it already proves the ONE-column / ONE-width
> invariant and remains GREEN under the intra-row split (it measures the row box). Optionally add a
> born-RED clause asserting each row's label cell `right` < its control cell `left` (label is to the
> LEFT of the value) to lock the orientation — born-RED on the current label-above stack.

---

## Summary — the decisions & the gate deltas (for H.W8)

| F# | Decision | Mechanism (no new backdrop CSS) | Gate |
|----|----------|----------------------------------|------|
| **F8** | glass+cartoon = default register | `surface="cartoon" tier="quiet"` (0.50 α + 10px blur) on panel Cards | NEW born-RED: panels resolve translucent bg + `backdrop-filter≠none` (CS-2 stays GREEN — tier-agnostic) |
| **F3+F6** | **REMOVE** the specular from panels | delete the bezier `glass-specular-track` + `.cartoon-specular ::before` projection + `useSpecularPointer` wire; cartoon depth + quiet glass is the calm material | RETIRE `proof:specular-calm` + `proof:cartoon-specular-coexist`; INVERT `proof:no-orphan-specular` to exception=∅ |
| **F7** | un-clip the bottom-left shadow | `.controls-content` add `padding-left` (+ keep bottom) to clear the `-Npx +Npx` cartoon throw; keep the wrapper's load-bearing `overflow:hidden` | NEW born-RED: panel shadow left edge ≥ pane content-box left |
| **F9** | restore the idle resting-dim | `useIdle(10_000)` (@vueuse/core 14.3, installed) → `controls-pane--idle:not(--hovered)` opacity ~0.35; `:hover`/`:focus-within` → 1; PRM guard | NEW born-RED: pane opacity drops on idle, returns on hover |
| **F1** | label-LEFT / value-RIGHT, one column | intra-row `grid-cols-[auto_1fr] items-center` (copy `AssetPropertiesPanel`); HANDOFF: glass-ui `LabeledField orientation="horizontal"` | `proof:single-column-pack` (unchanged — measures row box, stays GREEN); opt. add label-left-of-value clause |

### Modern-web citations used
- `modern-web-guidance` **`css`** §8 *Depth and texture* (layered shadows, `mix-blend-mode` + `isolation`) → F8.
- `modern-web-guidance` **`css`** §9 *Performance* (animate `opacity`/`transform` on the compositor) + §9 *Accessibility* (`prefers-reduced-motion` per-case, not a global `0.01ms`) → F9.
- `modern-web-guidance` **`overflow-clipping-control`** (`overflow: clip` + `overflow-clip-margin` "scalpel"; the child-shadow-bleed safety zone; clip disables scroll; `overflow-clip-margin` limited availability → PE-only) → F7.
- `modern-web-guidance` **`forms`** §2 *Accessible Labeling* ("labels above" targets data-entry forms; single-column; Gestalt proximity gap rule) → F1 nuance.
- `modern-web-guidance` **`soft-edge-content-fade`** (mask-image edge fade — already the demo's `--mask-fade` idiom; cross-ref, not a new need) → context for F9's pane.

### Source anchors (file:line)
- glass-ui material model: `cards.css:22-48` (cartoon = decoration over tier), `glass.css:48-106,367-383` (5-tier ladder + reduced-transparency), `tokens.css:546-551` (cartoon shadow offsets), `:572-575,645-648` (tier α), `glass-specular-track.css:26-105` (the `::before` catch-light), `CardFooter…js:37` + `Card.vue.d.ts:8` (surface/tier emit + defaults).
- demo landed: `design-idioms.css:262-296` (`.cartoon-specular` recipe), `useSpecularPointer.ts` (the pointer seam + tune), `TimingFunctionPanel.vue:30,197-198` (the composite + back-nav F2), `ControlsPaneWrapper.vue:21,182,199-209` (F7 clip + F9 hover wiring), `AnimationControlsControls.vue:296-334` (the panel-row single-column flow + F2 detail cap), `LayerConfigPanel.vue:59` (the F1 LabeledField family), `AssetPropertiesPanel.vue:6` (the F1 label-left precedent).
- gates: `proof-single-column-pack.mjs:207-249` (F1 reconcile — measures row box), `proof-specular-calm.mjs:76-77,151-237` (F3 ceiling + witness), `proof-no-orphan-specular.mjs` docblock (F6 exception set), `proof-cartoon-is-panel-depth.mjs` docblock (F8 CS-2), `proof-stage-not-clipped.mjs` (F7 gate plumbing template).
- F9 history: git `3b8b468:demo/@/components/custom/animation-controls/AnimationControlsGroup.vue:299-316,415-461` (the extant `opacity:0.75` resting dim + 2s linger). `useIdle`: `@vueuse/core@14.3.0 dist/index.d.ts:2897-2930`.
