# Lane 08 — THE DOCK SYSTEM

**VERDICT items:** #4 (both docks "blurry, broken, janky messes"; "All of the dock animations are
ruined"), #6 (tooltip ghost-duplication; the superfluous divider on home; "the play button should be
the first element"), #10 (the dock grammar context), #17 (single-option ELISION).
**Owner shots:** `../owner-review/shots/04.png`, `06.png`, `09.png`, `14.png`.
**Lane evidence (live captures + probe log, this tree @ 5180):** `08-shots/` —
`home-top-dock-rest.png` (the blob, reproduced), `home-transport-expanded.png` (orphan divider +
play-last + serif tooltip), `spring-top-dock-expanded.png` (`Spring │ Spring`),
`home-top-dock-midmorph.png` (the mid-morph sliver), `probe-log.json` (computed-style census).
Probes ran headless Chromium (playwright via `KF_PLAYWRIGHT_DIR`) against the dev server; every
number below is a live `getComputedStyle`/`getBoundingClientRect` measurement, not a read of the CSS.

The demo has TWO docks: **ChromeDock** (`demo/app/chrome/ChromeDock.vue`, 352L — panel toggle +
controls-tab select + scene select + `@mbabb`, top) and **TransportDock**
(`demo/@/components/custom/animation-transport/TransportDock.vue`, 465L — animation select + reset +
clear + play, bottom). Both consume `GlassDock` from glass-ui 4.0.1.

---

## D1 — The blur-blob: a resting collapsed dock is PERMANENTLY blurred (glass-ui defect)

**Defect.** Shot 04's "unreadable blur-blob" is the collapsed ChromeDock circle at rest. Reproduced
live and measured (`08-shots/home-top-dock-rest.png` — identical blob, light theme). Computed style
of the resting collapsed dock:

```
classes:  glass-dock … collapsed fit-content   rect: 54×54
filter:          blur(3px)          ← the blob (SELF filter, whole plate + glyph + border)
backdrop-filter: blur(9px)          ← the glass plate (correct, not the culprit)
--dock-expand-t: 0                  --dock-reveal-blur: 3px      data-morphing: false
```

**Root cause** — NOT `backdrop-filter`, NOT the VT dogfood (no dock element carries a
`view-transition-name`; the demo's only VT name is `scene-subject`, `demo/app/App.vue:328`). It is
glass-ui's BB.W-LIQUID-REVEAL "bloom" rule,
`node_modules/@mkbabb/glass-ui/dist/styles/dock/morph.css:79-84`:

```css
.glass-dock {
    --dock-reveal-blur: 3px;
    filter: blur(calc(var(--dock-reveal-blur) * (1 - var(--dock-expand-t, 1))));
}
```

The rule is NOT gated on `[data-morphing]`. At rest a collapsed dock holds `--dock-expand-t: 0`, so
the whole element — plate, border, shadow, glyph — sits under a permanent 3px self-`filter`. A
54px circle under 3px blur (×2 dpr) IS shot 04. The intended "in-flight decongest" is fine as a
morph beat; as a RESTING state it destroys the dock's legibility and forces a standing extra
compositing pass on every frame the dock overlaps animating content.

**Ruling for the target:** a resting dock — collapsed or expanded — is CRISP, always. The reveal
blur may exist only while `[data-morphing]` is set (≤ ~350ms exposure, the `DOCK_SPRING` clock), and
should blur the CONTENT, never the plate (blurring the plate smears border+shadow into the blob).
This is a **glass-ui-root fix** (MEMORY: dock fixes go in glass-ui, never patched in demo) → BG/BH
ask GU-1 below. kf carries the falsifiable acceptance gate.

## D2 — "All of the dock animations are ruined": the width morph never runs (measured)

Dense-sampled the ChromeDock hover-expand per rAF frame (probe `probe-morph.mjs` methodology; width
transitions only):

```
t=    0ms  w= 59.4   expandT=0      collapsed  blur(3px)      ← rest circle
t=  122ms  w= 58.0   expandT=0      expanded[data-morphing]   ← class flip
t=  135ms  w= 14.0   expandT=0      ← ONE-FRAME SNAP to a 14px sliver
t=  158ms  w= 14.6   expandT=0.159  blur(2.52px)
t=  246ms  w= 17.4   expandT=0.860  blur(0.42px)   ← the spring runs; only blur/colors ride it
t=  289ms  w= 18.0   expandT=0.997  ← spring settled; box still a sliver
t=  787ms  w=224.5   morph=false    ← ~500ms HOLD, then ONE-FRAME JUMP-CUT to full width
```

The `DOCK_SPRING` (response 0.32/damping 0.7) drives `--dock-morph-t` correctly — but the thing the
eye tracks, the BOX, snaps 58→14, holds as a sliver for the whole "morph" + ~500ms, then jump-cuts
14→225 with no animation. `08-shots/home-top-dock-midmorph.png` shows the dock as a barely-visible
sliver mid-"morph". That, compounded with D1's blur, is the owner's "janky mess".

**Root cause.** glass-ui's morph pins measured endpoints (`--dock-morph-from`/`--dock-morph-to`,
`dist/dock.js` ~L390/895) and interpolates `inline-size` between them; at settle it releases to
`max-content` (dock.js ~L923). Here the endpoint measurement ran while the expanded layer's content
was not yet laid out — from/to both resolved to ≈14px (padding only) — so the interpolation was a
no-op sliver and the `max-content` release became the visible jump-cut. kf consumes the documented
contract (content in the default slot — `GlassDock.vue.d.ts` declares
`default/collapsed/persistent/rail` slots; ChromeDock.vue:199-334), so this is a **glass-ui
measurement-robustness defect**: the morph must measure REAL endpoint geometry (or defer the morph a
frame until the target layer is measurable) → BG/BH ask GU-2. Once the width truly morphs, glass-ui's
own outer→in child reveal stagger (`--dock-stagger-step`, shell.css) comes back for free — that IS
the "dock animation" the owner remembers being good.

## D3 — The tooltip ghost-duplication: TWO tooltip systems on one control (kf defect)

Shot 06 shows "Clear all & reload" twice: once in large Instrument Serif floating above the dock,
once as a small light box beside the trash. Diagnosis, confirmed live:

- The serif one is glass-ui's `IconTooltip` (`TransportDock.vue:130`) — probe found exactly ONE
  in-DOM instance, parent `z-tooltip … glass-floating`, `font: "Instrument Serif" …16px`, positioned
  above the dock (`08-shots/home-trash-tooltip.png`). In dark theme its glass plate reads
  near-transparent over the grid, so it presents as an unboxed serif GHOST.
- The boxed one is the **native browser `title` tooltip**: `TransportDock.vue:131` passes
  `title="Clear all & reload"` to `DockIconButton`, whose contract has NO `title` prop
  (`DockIconButton.vue.d.ts` — props are `compact/type/as/asChild/class` only), so it falls through
  onto the `<button>` (probe: `button[title="Clear all & reload"]` exists in the DOM). Hover ≥1s →
  both render simultaneously. Same doubling on "Reset animation" (L121-122) and ChromeDock's panel
  toggle (`ChromeDock.vue:204`, `:title=…`).

**Ruling for the target:** ONE tooltip system — glass-ui `IconTooltip` — and `aria-label` (never
`title`) for the accessible name. The serif tooltip face is also wrong (D6). Pure kf-side fix.

## D4 — The dock grammar is broken: orphan divider, play-last, empty regions, divider-per-item

Live DOM census of the expanded TransportDock **on home** (probe `home transport dock` +
`home transport expanded DOM`):

```
[ DIV select-region  w=0   ]  ← EMPTY (no animation on home; static-label branch renders "")
[ DIV .dock-separator w=1  ]  ← the owner's "superfluous dividing line" — an orphan
[ BUTTON Reset  w=40 ] [ BUTTON Clear-all w=44 ] [ BUTTON Play (rainbow) w=40 ]  ← play LAST
```

- **Orphan divider**: `TransportDock.vue:119` renders the divider unconditionally; on home the
  region left of it is a zero-width empty span (L111-114 renders `storedControls.selectedAnimation`
  = `""`). A divider with nothing on one side is a grammar violation by construction.
- **Play-last**: owner ruling — the play CTA is the transport's PRIMARY affordance and must lead
  (L139-157 currently renders it after reset/trash).
- **Dead chrome on home**: reset/clear-all with NO animation group are inert destructive chrome on
  the start screen (shot 06 is home). "Clear all & reload" is a settings-register action, not
  transport.
- **Divider-per-item** (shots 09/14 + probe `spring top-dock expanded children`): the ChromeDock
  renders a raw `<div class="dock-separator">` between EVERY pair of items (ChromeDock.vue:217, 268,
  309) — 3 hairlines for 4 items, all items equal visual weight. glass-ui 4.0.1 SHIPS the semantic
  answer and kf uses none of it: `DockSeparator` (orientation-aware divider component),
  `DockSection` (the BA.W-DOCK-SECTIONS tripartite `rail-core | sections | nav` grammar with
  divider-demarcated zones), `DockRail` (facet chips) — all exported from
  `@mkbabb/glass-ui/dock` (`dist/components/custom/dock/index.d.ts`).

## D5 — Single-option duplication: `∿ Spring │ ∿ Spring ⌄` (kf; the K.W4 compromise is rejected)

Live spring-scene census (`08-shots/spring-top-dock-expanded.png`):

```
[⊞ toggle] │ [static label "Spring" w=90] │ [scene Select "Spring ⌄" w=108] │ [@mbabb]
```

Two adjacent "Spring"s: the sole-control-surface STATIC label (ChromeDock.vue:249-266 — the K.W4 S6
"static label instead of dead dropdown" rule) beside the scene select trigger. K.W4 solved "dead
1-item dropdown" by demoting it to a label; the owner's ruling goes further: **one option ⇒ render
NOTHING** ("the dock should not show an extra 'spring'/'easing' item — elide that intelligently").
Same for the transport: a single-animation scene currently shows the animation name as a static
label (TransportDock.vue:109-114); ruling — "not displayed if an animation only has ONE
sub-animation". The elision rule is total: `n=0 ⇒ nothing, n=1 ⇒ nothing, n>1 ⇒ Select` — and with
DockSection semantics an empty zone also drops its separator, killing D4's orphans by construction.

## D6 — The dock speaks the wrong voice: chrome in the display serif (kf)

`demo/@/styles/style.css:633` (`@layer demo-typography`) deliberately flips EVERY `.dock-label` to
`var(--font-display)` = Instrument Serif — that is why "Controls / Amiga / Spring" render serif in
shots 09/14 and the tooltip ghost reads serif. The K.W2 "dock joins the display voice" decision is
part of what the owner is rejecting ("latent red theme… fonts not right at all… properly leveraging
glass-ui components"). A dock is INSTRUMENT CHROME: glass-ui's own `dock-label` binds
`var(--font-text)` and that register is correct. The serif is the STAGE's voice (hero, scene
titles), not the chrome's.

## D7 — Consume-side scaffolding papering glass-ui gaps (kf tech-debt, paired with BG/BH)

- `ChromeDock.vue:141-185`: a hand-rolled popup MUTEX + a `watch` that re-`expand()`s the dock when
  glass-ui's own dismiss-synthetic pointerdown self-collapses it under an open popover (BLK-8/D9) —
  a workaround for the dock's hold contract not covering its own dismiss path. GU-3 below.
- `TransportDock.vue:345-359` + `usePlayActuation`: modality-pure pointerup/keydown actuation built
  to dodge the collapse-crossfade stranding the synthesized `click` (the DM-1 saga; MEMORY's
  "dock double-click" chronic is the same family, "fix in glass-ui root"). GU-4.
- `TransportDock.vue:264-313`: the menubar ResizeObserver publishing `--menubar-measured-h(-peak)`
  onto `:root` — sheet-anchor plumbing living inside a dock component. Belongs to the layout owner
  (lane 26's demo-structure recut), not the transport.

These stay alive only as long as the glass-ui defects do; T should schedule their EXCISION behind
the BG/BH re-pin, not carry them silently.

---

# THE TARGET — "two quiet instruments"

**Aesthetic commitment** (glass-ui-consonant, owner rulings absorbed): the dock system is a pair of
crisp glass instruments floating over the paper grid. The **compass** (top) answers *where am I,
where can I go*; the **transport** (bottom) answers *play it*. Chrome speaks glass-ui's text face;
Fira Code mono is reserved for the `@mbabb` wordmark chip; Instrument Serif belongs to the stage and
NEVER appears in dock chrome or tooltips. At rest each dock necks to a perfect, CRISP circle — top:
the scene glyph (identity), bottom: the rainbow play (action) — a deliberate symmetry. Nothing
renders that has one option; a divider exists only between two inhabited zones; every motion rides
the ONE `DOCK_SPRING` clock.

**The compass (ChromeDock recut)** — built declaratively on `DockSection`:

- `rail-core`: the scene trigger — scene glyph + name + chevron (`Select`, `DockSelectTrigger`).
  Home: the home glyph + "Keyframes". This LEADS the dock (identity first).
- `section` (contextual): the controls-tab `Select` — RENDERED ONLY when the scene has ≥2 control
  surfaces. 0 or 1 ⇒ the zone does not exist (no label, no separator). The spring/easing pages show
  NO second "Spring"/"Easing" item, per the ruling.
- `nav` (trailing): the `@mbabb` chip (`DockDropdownTrigger`, mono). The panel-collapse toggle
  LEAVES the compass — it is panel chrome and moves to the panel's own edge/header (final home
  co-decided with lane 07's pane recut; if the pane redesign forecloses it, it rides the nav zone,
  never leading).
- Separators: `DockSeparator` between zones only — max 2, never leading/trailing/doubled, by
  construction of `DockSection`.
- Collapsed: the crisp scene-glyph circle (current icon-forward choice is right; D1's blur was the
  defect, not the detent).

**The transport (TransportDock recut)**:

- `rail-core`: **PLAY, FIRST** — the rainbow CTA, the dock's reason to exist. Collapsed state = the
  play circle alone (the CTA never hides).
- `section` (contextual): the animation `Select` — ONLY when the scene has ≥2 sub-animations
  (progress-ring items stay). One or zero ⇒ zone absent.
- `nav`: Reset. "Clear all & reload" MOVES to the `@mbabb` menu (a destructive storage-reset is a
  settings action, not transport chrome). The timeline-collapse chip (L160-170) moves to the
  timeline pane it controls.
- **Home renders NO transport dock.** No animation group ⇒ nothing to transport; the start screen's
  CTA lives in the start screen. This deletes shot 06's entire orphaned cluster at the root.

**Type ramp (dock scope):** labels = glass-ui `dock-label` as shipped (`var(--font-text)`, the
`@layer demo-typography` serif flip at style.css:633 DIES); `@mbabb` = `text-mono-caption`;
tooltips = glass-ui tooltip default face (text, never display). Sitewide `--font-text` identity is
lane 24's ruling; the dock simply stops overriding.

**Motion spec:** one clock — `DOCK_SPRING` (0.32/0.7). Collapse⇄expand is a TRUE width morph
between measured real endpoints (monotone, no frame jump >25% of the total range, no post-settle
snap); the reveal blur exists only inside `[data-morphing]`, content-only, ≤3px, settling to
exactly 0; child controls ride glass-ui's outer→in reveal stagger tokens; PRM zeroes both. Resting
`filter` on any `.glass-dock` is ALWAYS `none`/`blur(0px)`.

**What dies:** the resting blur; the 14px-sliver + jump-cut morph; the `title` fallthrough native
tooltips; the serif `.dock-label` flip; the static single-option labels (K.W4 S6 compromise) and the
empty select region; the leading panel toggle; raw `.dock-separator` divs; the home transport;
"Clear all & reload" as primary chrome; the mutex/re-expand/actuation scaffolding (behind the
re-pin).

## kf-side vs glass-ui-side (BG/BH handoff register)

| id | side | ask | evidence |
|---|---|---|---|
| GU-1 | glass-ui | Gate the BB.W-LIQUID-REVEAL blur on `[data-morphing]`, content-only — resting docks crisp | morph.css:79-84; D1 measurements |
| GU-2 | glass-ui | Morph endpoint measurement robustness — measure laid-out geometry or defer one frame; no `max-content` release jump-cut | dock.js ~L390/895/923; D2 frame table |
| GU-3 | glass-ui | The dock's own dismiss-pointerdown must respect `keepOpen()` holds (kills ChromeDock's re-expand watch) | ChromeDock.vue:164-178 |
| GU-4 | glass-ui | Actuation integrity through the collapse crossfade (the DM-1/double-click family) at root | MEMORY dock-doubleclick; TransportDock.vue:316-343 |

Everything else above is kf-side. The kf waves must NOT patch these four in-demo (MEMORY ruling);
they land behind the BG/BH re-pin with kf-side acceptance gates (below) that are born-RED until the
re-pin — the honest handoff shape the S close already used for glass-stage sheen.

## T recommendations

1. **T-DOCK-1 · The dock grammar recut (compass + transport on DockSection).** Rebuild ChromeDock +
   TransportDock declaratively on glass-ui `DockSection`/`DockSeparator`/`DockRail`: compass =
   scene-trigger rail-core / conditional tabs section / `@mbabb` nav; transport = play-FIRST
   rail-core / conditional animation-select section / reset nav; panel toggle exits the compass
   (home co-decided with lane 07); total elision rule `n≤1 ⇒ zone absent` replacing the K.W4 static
   labels; separators only between inhabited zones. — *Gate:* `proof:dock-grammar` — per scene DOM
   census: no leading/trailing/adjacent separators; 1-surface scenes render zero control-tab nodes;
   1-animation scenes render zero animation-select nodes; transport's first interactive element is
   the play button; grep-clause: zero raw `class="dock-separator"` divs in demo/. — **Size: L**
2. **T-DOCK-2 · Home = compass only.** The transport does not mount without an animation group;
   "Clear all & reload" moves into the MbabbMenu (confirm-guarded); the timeline-collapse chip moves
   to the timeline pane. — *Gate:* home DOM census: exactly ONE `.glass-dock`; no reset/trash/play
   buttons outside a scene; MbabbMenu carries the clear action. — **Size: S**
3. **T-DOCK-3 · One tooltip system.** Drop every `title` passthrough on dock controls for
   `aria-label`; `IconTooltip` is the single renderer; tooltip face = text register. — *Gate:*
   `proof:dock-single-tooltip` — hover each dock control 1.2s: exactly one visible element matches
   the label text; grep-clause: zero `title=` on `DockIconButton`/dock `Button` call sites. —
   **Size: S**
4. **T-DOCK-4 · The dock voice: kill the serif chrome flip.** Delete the `@layer demo-typography
   .dock-label` override (style.css:633); dock rides glass-ui's `dock-label` text face; mono only on
   the `@mbabb` chip. — *Gate:* computed `font-family` of every `.dock-label` and tooltip excludes
   `Instrument Serif`; a visual capture rides lane 24's sitewide type gate. — **Size: S**
5. **T-DOCK-5 · The morph + crispness handoff (GU-1/GU-2, born-RED).** Book the glass-ui BG/BH asks;
   land the kf acceptance gates NOW so they flip green on the re-pin. — *Gate:*
   `proof:dock-rest-crisp` (computed `filter` of every `.glass-dock` at rest = none/0px, both docks
   × collapsed/expanded × 2 themes) + `proof:dock-morph-continuity` (rAF-sampled expand AND
   collapse: width monotone ±2px, max per-frame Δ ≤25% of range, no width change >5px after
   `data-morphing` clears). Both RED today by measurement (D1/D2). — **Size: M** (kf side; the fix
   itself is glass-ui's)
6. **T-DOCK-6 · Scaffolding excision behind the re-pin (GU-3/GU-4).** Once the re-pinned dock holds
   popovers open through its own dismiss path and actuates single-click through the crossfade,
   delete ChromeDock's re-expand watch + popup mutex plumbing and collapse `usePlayActuation` to a
   plain click handler. — *Gate:* `proof:workaround-deletion` rows keyed on the glassCaps probe
   (dockDismissHold, dockClickIntegrity): cap=true ⇒ the scaffolding files/branches are GONE
   (grep-clauses). — **Size: M**
7. **T-DOCK-7 · The dock appearance oracle joins the roster.** The S gates never looked at the dock's
   pixels or motion (the meta-fact: 85/85 green, owner rejected on sight) — enroll
   `proof:dock-rest-crisp`, `proof:dock-morph-continuity`, `proof:dock-grammar`,
   `proof:dock-single-tooltip` in `proof:all` + CI, with the frame-sampling probe (this lane's
   `probe-morph.mjs` methodology) checked in under `scripts/`. — *Gate:* the roster runs them; a
   deliberate re-introduction of any D1–D5 defect turns CI red. — **Size: S**
