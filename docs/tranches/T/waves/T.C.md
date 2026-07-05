# Tranche T · Band C — THE CHROME (the docks)

> **The band thesis (root cause #3, `T.md` §0).** The owner rejected both docks on sight —
> "blurry, broken, janky messes … All of the dock animations are ruined" (#4), the ghost
> tooltip + "superfluous dividing line" + play-not-first (#6), the `∿ Spring │ ∿ Spring`
> duplication (#17). Every one of these sat under a green roster (the meta-fact: 85/85 gates
> passed; **no S gate ever looked at a dock's pixels or motion** — lane 08). Two of the four
> visible defects are *measured glass-ui* rendering bugs (the resting `blur(3px)`, the
> width-morph jump-cut); two are *kf grammar* debt (the tooltip doubling, the serif chrome
> flip, the divider-per-item, play-last). This band recuts both docks as **two quiet
> instruments** on glass-ui's own `DockSection`/`DockSeparator`/`DockRail` grammar, lands the
> two glass-ui defects as **kf-side born-RED acceptance gates NOW** (the fix a glass-ui
> handoff — the letter is T.H's file), and enrolls the dock's appearance + motion in the
> roster so a re-introduction turns CI red.
>
> **Lanes owned:** 08 (dock system — **ALL**; the band spine, T-DOCK-1…7), 30 (machine +
> transport suite — recs **3 & 4**, the elision selector; **the MODEL half cross-refs T.B5**,
> this band renders it), 06 (spring — rec **1**, T-SPR-1, the spring proof-surface of the
> elision render).
>
> **The kf/glass-ui line (MEMORY, binding).** "All glass-ui/dock changes must go in glass-ui
> repo, never patched in demo" and "dock double-click is glass-ui-root, NOT
> transition-related." So T.C **never patches `node_modules`**: the two rendering defects
> (D1/D2) and the two interaction gaps (D7's dismiss-hold / click-integrity) land as **asks
> in T.H's `KF-TO-GLASSUI-BG.md`** with **kf-side born-RED acceptance gates that flip green on
> the re-pin**. This is the honest handoff shape the S close already used for glass-stage
> sheen (MEMORY: glass-ui specular consume-edge).
>
> **Read against** `tranche-s-impl` @ `929ef0e`; every file:line below re-verified live this
> pass (`ChromeDock.vue`, `TransportDock.vue`, `style.css:633`, `morph.css:79-84`,
> `node_modules/@mkbabb/glass-ui/dist/components/custom/dock/index.d.ts`, `package.json:274`).

---

## The band DAG (intra-band ordering + the two upstream models it renders)

```
        (T.B5 elision model)   (T.B10 ordered-action model)      ← the two MODELS T.C consumes, not authors
              │                        │
T.C1 (the grammar recut — compass + transport on DockSection) ── renders both models + the elision zones
  ├── T.C2 (home = compass only; transport does not mount)        [extends T.C1's census gate onto /home]
  ├── T.C3 (ONE tooltip system — IconTooltip + aria-label)        [parallel, pure kf]
  └── T.C4 (kill the serif chrome flip — dock speaks glass-ui text) [parallel; font census → T.D]
T.C5 (rest-crisp + morph-continuity acceptance gates)  [BORN-RED by measurement] ──ask→ T.H (GU-1/GU-2)
T.C6 (scaffolding excision behind the re-pin)          [GATED-ON-REPIN tripwire] ──ask→ T.H (GU-3/GU-4)
T.C7 (the dock oracles join the roster — the meta-fact cure)   [rides T.M6 authority axis]
```

**Two models, not authored here.** Single-option elision is **ONE model-cardinality rule**
authored in **T.B5** (lane 23 `T-PA-5` / lane 10 rec 5 / lane 30 recs 3,4 / lane 06 rec 1);
play-first-as-data is **T.B10**'s ordered transport-action model (lane 30 rec 5). T.C1's
`DockSection` grammar is the **host that renders** both — per the band-guidance rule "lane 08's
`DockSection` host consumes it" (T.B doc §thesis). This band supplies **zero** cardinality
arithmetic and **zero** action-order truth; it draws the zones the model declares inhabited.

**T.M consumption.** Every wave-close rides **T.M1** (`proof:owner-verdict-recorded`). The
docks are an owner-rejected *appearance* surface (#4/#6/#17), but the band's own gates are
**structural** (DOM census, computed `filter`/`font-family`, rAF width sampling), not taste
verdicts — so they are BORN-RED and falsifiable, exactly like T.A's stage-correctness gates.
The residual **aesthetic** slice (the "two quiet instruments" composition, the crisp-circle
detents, the compass↔transport symmetry) **rides T.M's capture sign-off** — it gets **no
standalone born-RED oracle** (the T.A2 precedent: a taste tweak rides the capture, not a gate).
There is **no §3 OD row for dock chrome**, and per T.A's precedent none is needed (see
**Charter conflicts** note 1).

---

## Wave index

| id | title | size | born | lanes |
|---|---|---|---|---|
| T.C1 | The dock grammar recut — compass + transport on `DockSection` | L | RED (structural) | 08 T-DOCK-1 · 30 recs 3,4 (render) · 06 rec 1 (render) |
| T.C2 | Home = compass only (the transport does not mount) | S | RED | 08 T-DOCK-2 |
| T.C3 | ONE tooltip system — `IconTooltip` + `aria-label`, kill the `title` fallthrough | S | RED | 08 T-DOCK-3 |
| T.C4 | The dock voice — kill the serif chrome flip | S | RED (source-grep) + appearance→T.D/T.M | 08 T-DOCK-4 |
| T.C5 | Rest-crisp + morph-continuity — the GU-1/GU-2 acceptance gates | M | RED (by measurement) | 08 T-DOCK-5 |
| T.C6 | Scaffolding excision behind the re-pin (GU-3/GU-4) | M | GATED-ON-REPIN tripwire | 08 T-DOCK-6 |
| T.C7 | The dock oracles join the roster — the meta-fact cure | S | RED (roster-absence) | 08 T-DOCK-7 |

---

## T.C1 — The dock grammar recut: compass + transport on `DockSection`

**id** T.C1 · **size** L · **BORN-RED** (structural)
**lanes** 08 rec 1 (T-DOCK-1) · 30 recs 3,4 (the elision RENDER; MODEL → T.B5) · 06 rec 1 (T-SPR-1, spring proof-surface)

**Scope.** Rebuild both docks declaratively on glass-ui 4.0.1's shipped dock grammar
(`@mkbabb/glass-ui/dock` exports `DockSection`, `DockSeparator`, `DockRail`, `DockSelectTrigger`,
`DockDropdownTrigger` — verified in `dock/index.d.ts`), replacing the hand-cut markup the owner
rejected. Two instruments, one grammar (lane 08 D4, "THE TARGET"):

- **The compass** (`demo/app/chrome/ChromeDock.vue`, 352L → `DockSection` recut):
  - `rail-core` **LEADS** — the scene trigger (scene glyph + name + chevron via
    `DockSelectTrigger`). Identity first. On home: the home glyph + "Keyframes".
  - `section` (contextual) — the controls-tab `Select`, **rendered only when the scene has ≥2
    control surfaces** (the elision render, below). 0 or 1 ⇒ **the zone does not exist** — no
    label, no separator.
  - `nav` (trailing) — the `@mbabb` chip (`DockDropdownTrigger`, mono). **The panel-collapse
    toggle LEAVES the compass** — it is panel chrome, not identity chrome; its home is the
    panel's own edge/header, co-decided with **T.B4**'s pane recut (edge). If the pane redesign
    forecloses that home, it rides the `nav` zone, **never leading** (lane 08 removes the
    "leading panel toggle", #6).
  - **Separators = `DockSeparator` between inhabited zones only** — max 2, never
    leading/trailing/doubled, by construction of `DockSection`. The three raw
    `<div class="dock-separator">` at `ChromeDock.vue:217,268,309` (verified) die.
  - Collapsed detent = the crisp scene-glyph circle (the icon-forward choice is right; D1's blur
    was the defect, not the detent).
- **The transport** (`demo/@/components/custom/animation-transport/TransportDock.vue`, 465L →
  `DockSection` recut):
  - `rail-core` = **PLAY, FIRST** — the rainbow CTA rendered from **T.B10's `actions.primary`**
    (not markup position). Today Play is markup-**last** (`TransportDock.vue:139-157`, verified,
    after Reset/Clear); the recut renders `actions.primary` in `rail-core`. Collapsed = the play
    circle alone (the CTA never hides).
  - `section` (contextual) = the animation `Select`, **only when the scene has ≥2 channels**
    (progress-ring items stay). One or zero ⇒ zone absent.
  - `nav` = Reset. **"Clear all & reload" MOVES to the `@mbabb` menu** (a destructive storage
    reset is a settings action, not transport) — the action relocation is **T.C2**; the
    timeline-collapse chip (`TransportDock.vue:160-170`) moves to the timeline pane it controls
    (edge → **T.B/T.F** pane owner).
  - The two raw `<div class="dock-separator">` at `TransportDock.vue:119,161` (verified) die;
    the unconditional divider at `:119` sitting next to an empty span on home (lane 30 F4,
    VERDICT #6) is deleted by construction (an absent zone has nothing to separate).

**The elision RENDER (lane 30 recs 3,4 + lane 06 rec 1 — MODEL is T.B5, cross-ref).** T.B5
exposes ONE cardinality model, single-sourced on the DFA/machine projection:
`controlZone = {kind:"select"|"inline"|"absent"}`, `channelZone = {kind:"select"|"absent"}`,
plus the **cross-axis** predicate "is the control-surface identity a strict subset of the scene
identity already shown?" (lane 30 rec 4). T.C1 **renders** it: `kind:"absent"` ⇒ **no node and
no flanking separator**; `kind:"inline"` ⇒ the tab body with zero dock chrome; the K.W4 S6
**static label is not resurrected** — `ChromeDock.vue:249-266` (the `soleControlTab` label, owner
shot 14's second "Spring") and `TransportDock.vue`'s single-animation static name span die. On a
1-surface scene the compass reads `[⊞] │ ∿ Spring ⌄ │ @mbabb` — **one Spring, ever** (lane 06 F1).
**This band authors NO `.length` arithmetic** — it consumes `controlZone`/`channelZone` from T.B5.

**Gate.** `proof:dock-grammar` (born-RED — new). A per-scene DOM census over both docks:
1. **No leading/trailing/adjacent `DockSeparator`** on any scene; **max 2 per dock**.
2. **1-surface scenes render zero control-tab nodes**; **1-animation scenes render zero
   animation-select nodes** (the elision render — spring/easing show no second Spring/Easing item).
3. The transport's **first interactive element is the play button** (renders `actions.primary`).
4. **grep-clause (source):** zero `class="dock-separator"` divs in `demo/`; zero
   `soleControlTab`/`.dock-static-label` static-label branches in either dock.
**Reds today:** ChromeDock renders 3 hairlines for 4 items (D4, all items equal weight);
TransportDock renders the orphan divider next to the empty home span (D4/F4); Play is markup-last
(`:139-157`); spring renders the static control label (D5, the `∿ Spring │ ∿ Spring` dup); five
raw `dock-separator` divs resolve in-tree (verified: `ChromeDock:217,268,309` +
`TransportDock:119,161`).

**Edges.**
- **← T.B5** (MODEL): `controlZone`/`channelZone` + the cross-axis redundancy predicate. The
  band-guidance rule "lane 08's `DockSection` host renders it" is the seam — **do NOT duplicate
  the cardinality selector here** (T.B5 owns `hasSingleControlSurface`/`soleControlSurfaceTab`/
  `hasSingleAnimation` in `controlSurfaceDFA.ts`).
- **← T.B10** (MODEL): `actions.primary`/`actions.secondary` drives play-first; the ordered
  model is the single source of order truth (`proof:transport-action-order` snapshot must agree
  with this gate's "play first" clause — T.B10 lockstep).
- **← T.B1** (`SceneFacility`): `TransportDock`/`AnimationControlsGroup` take `channels`, not
  `AnimationGroup` (T.B1 §3); `channelZone` reads `channels.length`. T.C1 renders after T.B1's
  contract lands.
- **→ T.B4**: the panel-toggle's new home is co-decided with the surrounding-pane removal (the
  compass and the panel settle their seam together).
- **T.H**: the `DockSeparator`/`DockSelectTrigger`/`DockDropdownTrigger` adoption IS lane 20 rec
  2's pure-consumption swap (`<div class="dock-separator">` → `DockSeparator`); the recut
  **subsumes** it (see Charter conflicts note 3) — one motion, not two.

**Lockstep (arming-audit — charter §5 clause 1).** The dock DOM is re-cut and Play moves to
`rail-core`, an **actuation-semantic change** to *where the play control lives*: `pressPlayToggle`
(`scripts/lib/demo-driver.mjs`) locates the play control, `proof:live-session` per-scene
expected-states, `proof:single-toggle`, and `proof:dock-popover-opens` all assume the current
markup. Re-derive every driver's dock-locator + expected-state in the **same motion** (never
leave a driver pressing a control that moved). **`proof:no-single-option-select` currently
ENFORCES the rejected state** — it asserts the single-item case renders a **STATIC label**
(verified: the gate is live in `proof:hygiene-chain`, `package.json:249`, its script header
asserts "the single-item case renders a STATIC label"). Its re-charter (single ⇒ **NOTHING**, no
static-label node) is **owned by T.B5's lockstep**, but T.C1's render is what makes it pass — the
elision cannot render "nothing" until the model says absent **and** the grammar draws no node
**and** the gate stops asserting the label: **one joint motion, T.B5 + T.C1** (flagged, not
silently split — a `T.md` §0.1 "gate enforces the rejected UI" instance).

---

## T.C2 — Home = compass only (the transport does not mount)

**id** T.C2 · **size** S · **BORN-RED**
**lanes** 08 rec 2 (T-DOCK-2)

**Scope.** VERDICT #6 (shot 06 — the entire orphaned home transport cluster). **Home renders
NO transport dock:** with no animation group there is nothing to transport, so the transport
does not mount at all (lane 08 "THE TARGET": "Home renders NO transport dock … This deletes
shot 06's entire orphaned cluster at the root"). The start screen's CTA lives in the start
screen. Concretely:
- The transport dock mounts **iff** the scene exposes ≥1 painting channel (`channels.length > 0`
  from T.B1); home derives `channels = []` (T.B2, `home → []`), so it does not render.
- **"Clear all & reload" MOVES into the `@mbabb` menu** (`MbabbMenu`), confirm-guarded — a
  destructive storage-reset is a settings action, not transport chrome. The `emit('reset', true)`
  wiring at `TransportDock.vue:131` (verified) relocates to a `MbabbMenu` item.
- The reset/clear/play buttons that render inert on home today (shot 06 — destructive chrome on
  the start screen with no group) vanish with the un-mounted transport.

**Gate.** Extends `proof:dock-grammar` with a **/home-route census clause** (no new key — T.M8
ceiling economy): on `#/` (home) exactly **ONE** `.glass-dock` node (the compass); **zero**
reset/trash/play buttons outside a scene; the `MbabbMenu` DOM carries the clear action. **Reds
today:** home mounts **both** docks — the TransportDock with its orphan reset/clear/play cluster
(shot 06); `MbabbMenu` carries no clear action.

**Edges.**
- **← T.B1/T.B2**: the mount condition reads `channels.length` and `home → []`.
- **→ T.H** (lane 20): the `MbabbMenu` pointerdown-synthesis workaround (`MbabbMenu.vue:180-199`,
  BG-4) is **not touched here** — T.C2 only ADDS the clear action to the menu; the synthesis
  excision is gated on the glass-ui `DockDropdownTrigger` pointerdown parity (T.C6 / T.H).

**Lockstep (arming-audit).** Un-mounting the home transport re-arms any driver that presses play
**on home** or asserts a transport-present home DOM: `proof:live-session` home expected-state,
`pressPlayToggle` on the home route, `proof:single-toggle`. Re-derive them in the same motion
(home now has no play control — a driver that presses it there must be re-pointed at a scene
route). Coordinate with **T.A15** (autoplay) — home is not a subject scene, so the autoplay
contract does not apply, but the two DOM-recut re-arms must not double-touch the same driver.

---

## T.C3 — ONE tooltip system: `IconTooltip` + `aria-label`, kill the `title` fallthrough

**id** T.C3 · **size** S · **BORN-RED** · pure kf
**lanes** 08 rec 3 (T-DOCK-3)

**Scope.** VERDICT #6 (shot 06 — "Clear all & reload" rendered **twice**). Lane 08 D3 root-caused
it: TWO tooltip systems fire on one control.
- The serif one is glass-ui's `IconTooltip` (`TransportDock.vue:130`) — one in-DOM instance,
  `font: "Instrument Serif" 16px`, floating above the dock (its serif face is D6/T.C4's defect;
  in dark theme its plate reads near-transparent → an unboxed serif GHOST).
- The boxed one is the **native browser `title` tooltip**: `DockIconButton` has **no `title` prop**
  (`DockIconButton.vue.d.ts` props are `compact/type/as/asChild/class` only), so a passed `title`
  falls through onto the `<button>`. Verified live — `title=` passthroughs at
  `TransportDock.vue:122` ("Reset animation"), `:131` ("Clear all & reload"), `:164` ("Collapse
  timeline"), and `ChromeDock.vue:204` (`:title="…Controls"`). Hover ≥1s → **both render**.

**Fix.** Drop **every** `title=` passthrough on dock controls; use `aria-label` for the accessible
name; `IconTooltip` is the single visible renderer. (The `IconTooltip` face is corrected to the
text register by T.C4.)

**Gate.** `proof:dock-single-tooltip` (born-RED — new): hover each dock control 1.2s → **exactly
one** visible element matches the label text; **grep-clause:** zero `title=` on
`DockIconButton`/dock `Button`/`DockSelectTrigger`/`DockDropdownTrigger` call sites in `demo/`.
**Reds today:** four `title=` passthroughs resolve (verified above); the probe finds two
label-matching nodes (the serif `IconTooltip` + the native `title` box) on Reset/Clear/panel-toggle.

**Edges.** **← T.C4** (the surviving `IconTooltip`'s face must be the text register, not serif —
D6). None cross-band beyond that; this is a pure kf-side fix (lane 08 D3).

**Lockstep.** None removed (no gate asserts the doubling); the new oracle joins the roster via
**T.C7**. `aria-label` replacing `title` must keep the accessible name identical (axe/a11y
unchanged — coordinate the a11y probe touched by `proof:lighthouse-a11y`).

---

## T.C4 — The dock voice: kill the serif chrome flip

**id** T.C4 · **size** S · **BORN-RED** (source-grep) · appearance slice → **T.D/T.M**
**lanes** 08 rec 4 (T-DOCK-4)

**Scope.** VERDICT #24 ("Most of the fonts on the site are not right … properly leveraging
glass-ui components") + #16 ("latent red theme"). Lane 08 D6: `demo/@/styles/style.css:633`
(`@layer demo-typography`) deliberately flips **every** `.dock-label` to `var(--font-display)` =
Instrument Serif (verified — the `@layer demo-typography { .dock-label { font-family:
var(--font-display) } }` block), which is why "Controls / Amiga / Spring" render serif (shots
09/14) and the tooltip ghost reads serif (D3). A dock is **instrument CHROME**: glass-ui's own
`dock-label` binds `var(--font-text)` and that register is correct. **The serif is the STAGE's
voice** (hero, scene titles), never the chrome's (lane 08 D6).

**Fix.** Delete the `@layer demo-typography .dock-label` override (`style.css:633`). Audit and
remove the paired **scoped** `.dock-scene-title { font-family: var(--font-display) }` binding in
`ChromeDock.vue`'s scoped block (the same-motion companion the style.css comment names: "`.dock-
scene-title` already binds --font-display … the whole dock band now agrees") — the scene-trigger
label is chrome too, so it also rides `--font-text`. Dock labels ride glass-ui's shipped
`dock-label` (`var(--font-text)`); mono (`text-mono-caption`) only on the `@mbabb` chip;
tooltips ride the glass-ui tooltip default face (text, never display).

**Gate.** The **falsifiable born-RED teeth** are the **source-shape grep** folded into
`proof:dock-grammar`: zero `@layer demo-typography` `.dock-label` serif override; zero
`.dock-scene-title` display-font scoped binding — **both resolve in-tree today** (verified). The
**computed-font census** (every `.dock-label`, `.dock-scene-title`, and dock tooltip resolves a
`font-family` that **excludes `Instrument Serif`**, both themes) **rides T.D's role-bound style-
TUPLE font gate** (charter T.D: "role-bound style-TUPLE font gate (family+size+weight+style)") —
the dock chrome is a **role** in that gate, not a fifth standalone dock key (T.M8 ceiling
economy). **Reds today:** the serif overrides resolve (source grep) and the computed `.dock-label`
font-family is `Instrument Serif` (T.D gate).

**Edges.** **→ T.D** owns the sitewide type authority (the mono-demoted-to-data / Jakarta-body /
serif-stage-only ramp) + the role-bound font-tuple gate; T.C4 contributes the **dock-chrome
role rows** and executes the two deletions. **→ T.M** — the visual result rides the capture
sign-off (no standalone born-RED on the exact face; the *removal* is the born-RED source fact).

**Lockstep.** Deleting `style.css:633` re-anchors any gate reading the dock's font register onto
the text face — coordinate with T.D's `proof:demo-fonts`/`proof:font-census` so they green on the
**new** text register, not the old serif (never let a font gate certify the rejected serif).

---

## T.C5 — Rest-crisp + morph-continuity: the GU-1/GU-2 acceptance gates

**id** T.C5 · **size** M (kf side; the fix is glass-ui's) · **BORN-RED by measurement**
**lanes** 08 rec 5 (T-DOCK-5)

**Scope.** The two **measured glass-ui rendering defects** the owner named "blurry, broken,
janky" (#4). Per MEMORY (dock fixes go in glass-ui root, never patched in demo), the fix is a
glass-ui handoff; **T.C lands the kf-side born-RED acceptance gates NOW** so they flip green on
the re-pin (the honest handoff shape).

- **D1 — the blur-blob (GU-1).** A resting collapsed dock holds `--dock-expand-t: 0`, and glass-
  ui's BB.W-LIQUID-REVEAL rule
  (`node_modules/@mkbabb/glass-ui/dist/styles/dock/morph.css:79-84`, verified:
  `.glass-dock { --dock-reveal-blur: 3px; filter: blur(calc(--dock-reveal-blur * (1 -
  --dock-expand-t))) }`) is **NOT gated on `[data-morphing]`** — so a resting 54px circle sits
  under a permanent 3px **self-`filter`** over plate + border + shadow + glyph. That IS shot 04
  (measured: resting collapsed dock `filter: blur(3px)`, lane 08 D1). **The ask (GU-1):** gate
  the reveal blur on `[data-morphing]`, content-only (never the plate — blurring the plate smears
  border+shadow into the blob); a resting dock — collapsed or expanded — is **CRISP, always**.
- **D2 — the width morph never runs (GU-2).** Dense rAF sampling (lane 08 D2 frame table): the
  box snaps `58→14` in one frame, holds a **14px sliver** for the whole "morph" + ~500ms, then
  **jump-cuts `14→225`** with no animation. Root: glass-ui measures endpoint geometry
  (`--dock-morph-from/to`, `dist/dock.js ~L390/895`) while the expanded layer is not yet laid out
  (both resolve ≈14px padding-only) → the interpolation is a no-op sliver and the `max-content`
  release (`dock.js ~L923`) becomes the visible jump-cut. **The ask (GU-2):** measure REAL
  laid-out endpoint geometry (or defer the morph one frame until the target layer is measurable);
  no `max-content` release jump-cut. Once the width truly morphs, glass-ui's own outer→in child
  reveal stagger (`--dock-stagger-step`) returns for free — **that IS the "dock animation" the
  owner remembers being good** (lane 08 D2).

**Gate (BORN-RED by measurement, RED today AND until the re-pin).**
- `proof:dock-rest-crisp` — computed `filter` of every `.glass-dock` **at rest = `none`/`blur(0px)`**,
  both docks × {collapsed, expanded} × {light, dark}. **Reds today:** the resting collapsed dock
  measures `blur(3px)` (D1, `morph.css:79-84`).
- `proof:dock-morph-continuity` — rAF-sampled **expand AND collapse**: width **monotone ±2px**,
  **max per-frame Δ ≤ 25% of the total range**, **no width change > 5px after `[data-morphing]`
  clears**; PRM zeroes the reveal blur (`--dock-reveal-blur → 0`). **Reds today:** the 58→14 snap
  (Δ ≫ 25%), the sliver hold, and the post-settle 14→225 jump-cut (Δ ≫ 5px after morphing clears)
  (D2 frame table).

**Edges.** **→ T.H** owns the letter — GU-1/GU-2 are two rows in `KF-TO-GLASSUI-BG.md` (the
`KF-TO-GLASSUI-BG.md` is another author's file; T.C supplies the *acceptance-gate* half).
**→ T.G** — the resting `blur(3px)` is also a standing extra compositing pass on every frame the
dock overlaps animating content (lane 08 D1: "forces a standing extra compositing pass"), feeding
the perf de-blur (#19); T.G owns the de-layer, T.C owns the dock-rest-crisp oracle. **→ T.M6** —
both gates declare **OWNER authority** and are **blocking, not OBSERVE** (the meta-gate axis).

**Lockstep.** These are the two gates the roster **never had** (the meta-fact); they enroll via
**T.C7**. They stay RED until the glass-ui re-pin lands the fix — that is the point (a version
tripwire in T.H's ledger, `T.md` §1 T.H: "fails when the fix version is satisfied but the
workaround survives"). Do **not** green them by patching `morph.css`/`dock.js` in `node_modules`
(MEMORY ruling) or by masking the dock in a visual-lock subject list.

---

## T.C6 — Scaffolding excision behind the re-pin (GU-3/GU-4)

**id** T.C6 · **size** M · **GATED-ON-REPIN tripwire** (NOT born-RED today — see gate)
**lanes** 08 rec 6 (T-DOCK-6)

**Scope.** The consume-side scaffolding that papers glass-ui's dock-interaction gaps (lane 08 D7).
It stays alive **only as long as the glass-ui defects do**; T schedules its EXCISION **behind the
BG/BH re-pin**, not as a silent carry:
- **`ChromeDock.vue:141-185`** — a hand-rolled popup MUTEX + a `watch` that re-`expand()`s the
  dock when glass-ui's own dismiss-synthetic pointerdown self-collapses it under an open popover
  (a workaround for the dock's hold contract not covering its own dismiss path). **Ask GU-3:** the
  dock's own dismiss-pointerdown respects `keepOpen()` holds.
- **`TransportDock.vue` + `usePlayActuation`** — modality-pure pointerup/keydown actuation built
  to dodge the collapse-crossfade stranding the synthesized `click` (the DM-1 saga; MEMORY's "dock
  double-click" chronic, "fix in glass-ui root"). **Ask GU-4:** actuation integrity through the
  collapse crossfade.
- **`TransportDock.vue:264-313`** — the menubar `ResizeObserver` publishing
  `--menubar-measured-h(-peak)` onto `:root` (sheet-anchor plumbing living inside a dock
  component). This is **layout-owner** work, **not a re-pin excision** → **cross-ref T.F** (lane
  26's demo-structure recut); T.C6 does not touch it.

Once the re-pinned dock holds popovers open through its own dismiss path (`glassCaps.dockDismissHold
=== true`) and actuates single-click through the crossfade (`glassCaps.dockStrandKeepalive === true`),
**delete** ChromeDock's re-expand watch + popup mutex, and **collapse `usePlayActuation` to a plain
click handler**.

**Gate.** `proof:workaround-deletion` (the gate EXISTS — verified live in `proof:hygiene-chain`,
`package.json:249`) keyed on the glassCaps probe: GU-3 is a **new row** on `dockDismissHold`
(genuinely new cap); **GU-4's excision row IS `proof:workaround-deletion` S2, keyed on the EXISTING
`glassCaps.dockStrandKeepalive`** (`proof-workaround-deletion.mjs:255`, already coded — do NOT mint
a second `dockClickIntegrity` synonym cap for the one defect; a single defect gets a single probe,
else the two gates disagree — `KF-TO-GLASSUI-BG.md` §1, matching T.H1/T.H6). Each row: **cap ===
true ⇒ the scaffolding files/branches are GONE**
(grep-clauses: zero re-expand `watch` / popup-mutex in `ChromeDock.vue`; zero `usePlayActuation`
reference). **This is a GATED-ON-REPIN tripwire, NOT born-RED on today's tree:** the caps are
**false** today (glass-ui 4.0.1 pinned `~4.0.0`, `package.json:274`, GU-3/GU-4 unpublished), so
the implication is **vacuously green** — the row **FLIPS RED the instant the re-pinned cap is
`true` but the scaffolding survives** (the self-justifying-carry killer, `T.md` §1 T.H's version
tripwire). It is specified NOW, **terminal-on-publish** (lane 20 recs 5,6 shape).

**Edges.** **→ T.H** owns the GU-3/GU-4 asks in `KF-TO-GLASSUI-BG.md` + the re-pin + the gap
ledger's version tripwire. **→ T.F** owns the menubar-ResizeObserver relocation (structure, not
re-pin). **→ T.C1** — the `usePlayActuation` collapse is only safe once T.B10/T.C1 render play
from `actions.primary` (a plain click handler on the primary CTA).

**Lockstep.** When a cap flips true and the scaffolding is deleted, re-verify `proof:live-session`
S5 (the dock-strand actuation leg) and `proof:dock-popover-opens` / `proof:single-toggle` against
the **native** (un-scaffolded) path — never leave a gate certifying the workaround's behavior
after the workaround is gone (charter §5 lockstep). Grep `scripts/` for `usePlayActuation` /
`dockDismissHold` / `dockStrandKeepalive` before the excision commit lands (gates anchor literal
paths).

---

## T.C7 — The dock oracles join the roster (the meta-fact cure)

**id** T.C7 · **size** S · **BORN-RED** (roster-absence)
**lanes** 08 rec 7 (T-DOCK-7)

**Scope.** THE meta-fact this band exists to cure: **the S roster (85/85 green) never looked at
the dock's pixels or motion** — the owner rejected both docks on sight. Enroll the four dock
oracles in `proof:all` + CI, with the frame-sampling probe checked in under `scripts/`:
- `proof:dock-grammar` (T.C1 — structural + home census T.C2 + serif-deletion grep T.C4)
- `proof:dock-single-tooltip` (T.C3)
- `proof:dock-rest-crisp` (T.C5)
- `proof:dock-morph-continuity` (T.C5)

Check in the **rAF width-sampling probe** (lane 08's `probe-morph.mjs` methodology — the same one
that produced the D2 frame table) under `scripts/` so `dock-morph-continuity` runs headless in CI.
Each key wires into the roster aggregators (`package.json` `proof:all`, `scripts/run-all.mjs`,
`demo-roster.mjs`, `proof:ci-coverage`) in the **same motion** it is authored (T.M8's no-orphan-key
discipline).

**Gate.** The roster **runs all four**; a **deliberate re-introduction of any D1–D5 defect turns
CI red** (the falsifiable meta-assertion: plant the resting `blur(3px)` back → `dock-rest-crisp`
reds; plant a `title=` passthrough back → `dock-single-tooltip` reds; plant a raw `dock-separator`
div back → `dock-grammar` reds). **Reds today:** the four keys are **absent** from the roster
(verified: only `proof:dock-popover-opens` and `proof:dock-zorder` exist in `package.json`; the
four new keys do not), so a green run today provably ignores every D1–D5 defect.

**Edges.** **→ T.M6** — each dock oracle must carry an **AUTHORITY declaration** (INSTRUMENT vs
OWNER) per the meta-gate axis, and the appearance-touching ones (`dock-rest-crisp`,
`dock-morph-continuity`) declare **OWNER + blocking-not-OBSERVE** (a "blurry janky dock" must not
ride non-blocking, the #19-family lesson). **→ T.M8** — the four new keys count against the roster
ceiling; T.C7 lands them; T.M8 re-shrinks the total (the net is +4 dock keys, offset by T.M7's
feature-coupled retirements). **→ T.M3** — `dock-rest-crisp`'s capture can feed the owner-golden
oracle's dock frame.

**Lockstep.** Wire all four keys into every roster aggregator in the same commit (grep
`package.json` + `run-all.mjs` + `demo-roster.mjs` + `proof:ci-coverage` for the basenames — the
drive lesson: gates anchor literal paths; a dangling CI reference reds `proof:ci-coverage`). The
`probe-morph.mjs` check-in path must match the gate's invocation literal.

---

## Cross-band edges (summary)

| From | To | What crosses |
|---|---|---|
| T.C1 (elision render) | **T.B5** | The cardinality model (`controlZone`/`channelZone` + cross-axis redundancy predicate) — T.C **renders**, T.B **authors**. `proof:no-single-option-select` re-charter is a **joint T.B5+T.C1 motion** (must-land-together) |
| T.C1 (play-first render) | **T.B10** | `actions.primary`/`secondary` — T.C draws it in `rail-core`; `proof:transport-action-order` and `proof:dock-grammar`'s "play first" clause are ONE source of order truth |
| T.C1, T.C2 (mount + channels) | **T.B1** | `SceneFacility.channels` replaces `AnimationGroup` in the transport; home derives `channels=[]` (mount condition) |
| T.C1 (panel-toggle new home) | **T.B4** | The compass↔panel seam (surrounding-pane removal) is co-decided — the toggle leaves the compass |
| T.C2 (clear→MbabbMenu), T.C6 (GU-3/GU-4 excision) | **T.H** | The `KF-TO-GLASSUI-BG.md` letter (GU-1..GU-4) + the `MbabbMenu` pointerdown-synthesis (BG-4) + the version tripwire; T.C supplies the acceptance-gate/consume-edge half |
| T.C1 (DockSeparator adoption) | **T.H** | Lane 20 rec 2's `<div class="dock-separator">` → `DockSeparator` pure-consumption swap is **subsumed** by the grammar recut (one motion) |
| T.C4 (font census), the serif-flip deletion | **T.D** | The role-bound style-TUPLE font gate (dock chrome = a role); the sitewide type authority (serif→stage-only) |
| T.C5 (rest-crisp compositing), T.C6 | **T.G** | The resting `blur(3px)` standing compositing pass feeds the perf de-blur (#19); T.G owns the de-layer |
| T.C4, T.C1 (appearance slices) | **T.M** | Owner-token capture sign-off for the "two quiet instruments" composition + the dock voice (no standalone born-RED on the aesthetic) |
| T.C5, T.C7 | **T.M6** | Every dock oracle declares INSTRUMENT/OWNER authority; the appearance ones declare OWNER + blocking-not-OBSERVE |
| T.C6 (menubar ResizeObserver) | **T.F** | The `--menubar-measured-h` sheet-anchor plumbing relocates to the layout owner (structure, not re-pin) |
| T.C7 (roster) | **T.M8 / T.M7** | +4 dock keys land; the ceiling re-shrink offsets them with feature-coupled retirements |

---

## Disposition of lane recommendations (zero silent drops)

Legend: **→ T.C#** = owned by a wave above · **↳ cross-ref** = owned by another band per the
charter (one line, no duplication). My assignment scopes me to lane 08 (ALL), lane 30 recs 3&4,
lane 06 rec 1; non-assigned recs of the two partially-owned lanes are listed for completeness with
their owning band.

### Lane 08 — dock system (ALL 7 recs assigned)

| Rec | Disposition |
|---|---|
| 1 · T-DOCK-1 (grammar recut on `DockSection`; total elision render; separators inhabited-zones-only; play-first) | **→ T.C1** (renders T.B5's elision model + T.B10's action model) |
| 2 · T-DOCK-2 (home = compass only; clear→MbabbMenu) | **→ T.C2** |
| 3 · T-DOCK-3 (ONE tooltip system; drop `title` for `aria-label`) | **→ T.C3** |
| 4 · T-DOCK-4 (kill the serif chrome flip) | **→ T.C4** (font census clause → T.D's type-tuple gate) |
| 5 · T-DOCK-5 (rest-crisp + morph-continuity acceptance gates, GU-1/GU-2) | **→ T.C5** (letter → T.H) |
| 6 · T-DOCK-6 (scaffolding excision behind the re-pin, GU-3/GU-4) | **→ T.C6** (menubar ResizeObserver slice ↳ T.F; asks ↳ T.H) |
| 7 · T-DOCK-7 (dock appearance oracles join the roster) | **→ T.C7** (authority axis ↳ T.M6; ceiling ↳ T.M8) |

### Lane 30 — machine + transport suite (recs 3,4 assigned — the elision RENDER; MODEL → T.B5)

| Rec | Disposition |
|---|---|
| 3 · single-source the elision predicate in `controlSurfaceDFA.ts` | **MODEL ↳ cross-ref T.B5** (authors `hasSingleControlSurface`/`soleControlSurfaceTab`/`hasSingleAnimation`); **RENDER → T.C1** (the grammar draws the derived zones — `proof:dock-grammar` structural census). Split per band-guidance "cross-ref the model half to T.B" |
| 4 · cross-axis "is this label redundant with the scene identity" selector | **MODEL ↳ cross-ref T.B5** (the cross-axis clause — resolves scene-label + control-label from ONE DFA projection); **RENDER → T.C1** (single-surface scene renders NO control item, not a demoted label) |
| *(1 · finish the D12 sweep — not assigned)* | ↳ **T.B8** (machine single-writer) |
| *(2 · collapse superKey→SceneId — not assigned)* | ↳ **T.B9** (one keyspace) |
| *(5 · ordered transport-action model — not assigned)* | ↳ **T.B10** (play-first as data; **T.C1 renders `actions.primary`**) |

### Lane 06 — spring (rec 1 assigned — the dock-elision RENDER; MODEL/census → T.B5)

| Rec | Disposition |
|---|---|
| 1 · T-SPR-1 (dock single-option elision, both docks; `>1 ⇒ Select, 1 ⇒ nothing, 0 ⇒ no affordance`) | **RENDER → T.C1** (spring is the proof-surface: the compass reads `[⊞] │ ∿ Spring ⌄ │ @mbabb`, one Spring; `ChromeDock` static-label branch + `TransportDock` single-animation name die). **The "exactly one Spring" innerText census gate is `proof:dock-elision`, MODEL-side ↳ T.B5**; T.C1's `proof:dock-grammar` asserts the *structural* zero-node absence |
| *(2 · restore panel triad for spring — not assigned)* | ↳ **T.B7** (spring/easing sidebars dissolve → channels + one facet) |
| *(3 · discrete transition → second channel; pill fork dies — not assigned)* | ↳ **T.B7** |
| *(4 · KfPillTabs → SegmentedTabs, aria handoff — not assigned)* | ↳ **T.B6** (kf deletion) + **T.H** (glass-ui aria fix / BG-1/BG-3 / ledger) |
| *(5 · un-red the motion accent — not assigned)* | ↳ **T.D** (sitewide `--color-progress`/`--accent-red` token authority) |
| *(6 · ONE parameter-field instrument — not assigned)* | ↳ **T.B7** (the Physics scene facet; OD-6) |
| *(7 · strip stage to instrument; readouts ride glass-ui registers — not assigned)* | ↳ **T.B7** (readout/register half) + **T.E** (gesture-legend/caption/stage-verbiage prune) + **T.D** (registers) |

---

## Charter conflicts / coordination notes spotted

1. **No §3 OD row for dock chrome, yet the docks are an owner-rejected appearance surface
   (#4/#6/#17).** T.M2 requires an owner token before authoring a born-RED oracle for **any
   taste/appearance disposition**, and charter §3 registers OD-1..OD-6 (morph-prune, cursor,
   ppMode, hero, panel-pane, theme) — **none is dock chrome**. **Resolved by the T.A precedent
   (not a conflict):** T.C's own gates are **structural/correctness** (DOM census, computed
   `filter`/`font-family`, rAF width sampling) — falsifiable born-RED, no taste verdict — exactly
   as T.A treats its restaged stages (T.A2: "a taste tweak rides T.M's capture sign-off, no
   standalone born-RED"). The residual **aesthetic** slice (the "two quiet instruments"
   composition, the crisp-circle detents) rides **T.M's general capture sign-off**, which needs no
   new §3 row. **Flagged** so the impl drive does not (a) mint a spurious dock OD row, nor (b)
   author a born-RED oracle on the dock *aesthetic* (only on its *structure*).

2. **The elision is double-homed: lane 30 recs 3,4 + lane 06 rec 1 are assigned to BOTH T.B
   (which authored the MODEL as T.B5) and T.C (my assignment).** This is the band-guidance seam,
   not a drop. **Resolution (encoded in T.C1):** **T.B5 authors the cardinality MODEL + the
   cross-axis predicate + the innerText census gate (`proof:dock-elision`) + re-charters
   `proof:no-single-option-select`; T.C1 RENDERS the zones the model declares** and asserts the
   *structural* absence (`proof:dock-grammar`). The two gates AGREE but assert different things
   (text-census vs DOM-structure). **The `proof:no-single-option-select` re-charter (single ⇒
   NOTHING) is a must-land-together T.B5 + T.C1 motion** — the elision cannot render "nothing"
   until the model says absent, the grammar draws no node, and the gate stops asserting the static
   label. Flagged so the impl drive schedules them in the same batch and neither author
   re-authors the cardinality selector.

3. **Charter §1 T.C row lists lane 20, but my assignment substitutes lane 06 rec 1; lane 20 is a
   T.H lane.** The charter T.C row cites "Lanes 08, 30, 20"; my brief assigns "08 (ALL), 30 (recs
   3,4), 06 (rec 1)". Lane 20 (glass-ui consumption) **authors `KF-TO-GLASSUI-BG.md`** (lane 20
   §4) — that letter is charter §6's T.H deliverable, and charter §1 T.H lists lane 20. **The
   intersection with T.C is the dock:** lane 20 rec 2 (`<div class="dock-separator">` →
   `DockSeparator`) is **subsumed by T.C1's grammar recut** (one motion — the recut builds on
   `DockSeparator` by construction); lane 20's GU-Q1/GU-Q2/BG-1..BG-4 dock asks are the **letter
   content** (T.H) whose **kf-side acceptance/discharge gates** are T.C5 (GU-1/GU-2) and T.C6
   (GU-3/GU-4). **Flagged** so: (a) the impl drive does not double-author the DockSeparator swap
   (T.C1 owns the render; T.H's lane-20 rec 2 is the consumption-discipline framing of the same
   removal); (b) the letter itself is written once, by T.H, not duplicated in T.C.

4. **The two dock rendering fixes (D1/D2) cannot land in the dev/impl phase — they are glass-ui-
   root (MEMORY).** T.C5's gates are **BORN-RED and stay RED until the re-pin**; T.C6 is a
   **GATED-ON-REPIN tripwire** (vacuously green today). This is deliberate (the born-RED handoff
   shape the S close used for glass-stage sheen), **not** a wave that can be "closed green" inside
   T's own tree. Flagged so `proof:board-live` (T.M9) does not expect these two to flip green at
   T-close, and so no impl agent "greens" them by patching `node_modules/@mkbabb/glass-ui`
   (the MEMORY ruling: never patch the consumed dist).
