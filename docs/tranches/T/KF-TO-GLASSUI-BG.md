# keyframes.js → glass-ui Tranche BG/BH — the consolidated cross-repo ask letter (ASK + INFORM)

> **Status: SHIPPED (T.H2, the impl-drive dispatch).** This is the re-issued, shipped
> ask letter. The machine-readable half landed with it: the pin-ledger TARGET `asks`
> frontier (`docs/tranches/Q/PIN-LEDGER.json` `target.pins[].asks`, a row per §0 ask),
> the two new `glassCaps` caps (`dockDismissHold` GU-3 + `dockDropdownPointerdown` BG-4)
> wired into `scripts/lib/glass-caps.mjs` + `proof:workaround-deletion` (arms S3/S4), the
> gap ledger `demo/glass-ui-gaps.ts` + its `proof:glass-ui-gap-tripwire` version tripwire
> (T.H1), and the `proof:pin-ledger-current` (c.5) doc-lint that binds every §0 ask row to
> a falsifiable kf-side gate. Per **inv-16** (kf writes only keyframes.js; every
> cross-repo need is a dispatch), keyframes.js does **not** patch glass-ui in-demo — every
> ask below is a glass-ui-root fix (MEMORY: dock/glass-ui changes go in glass-ui, never the
> demo), each carrying a **kf-side born-RED acceptance gate** that flips on the re-pin and the
> **kf-side workaround it retires**.
>
> **Lineage.** This letter SUPERSEDES `docs/tranches/Q/KF-TO-GLASSUI-Q.md`. Two of its asks
> (**BG-1** ≡ Q's GU-Q1, **GU-4** ≡ Q's GU-Q2) were dispatched at Q, **never published**, and
> are now **owner-visible** via the VERDICT (#18 "why aren't these just glass-ui components?",
> #4 "all the dock animations are ruined"). They are **ESCALATED** here, two tranches stale.
> The tree still installs **glass-ui 4.0.1** (`package.json:274` `~4.0.0`); the consumed
> `dist/tabs.js`/`dist/dock.js` still carry both defects (VERIFIED below).
>
> Evidence base: lanes 20 (glass-ui consumption census), 08 (dock system, live CDP probes),
> 09 (typography census), 11 (perf, CDP counters), 12 (cursor-light forensics), 21 (legacy
> sweep). Every claim cites its lane + the consumed-dist artifact (not glass-ui's source
> branch — a gate that grepped the source would falsely green while the dist ships the bug).

---

## §0 The ask roster (twelve asks + one retired duplicate)

| id | side | ask (one line) | kf acceptance gate (born-RED, flips on re-pin) | kf workaround retired | owning T-wave (lands the gate) |
|---|---|---|---|---|---|
| **GU-1** | glass-ui | Gate the dock reveal-blur on `[data-morphing]`, content-only — a **resting** dock (collapsed or expanded) is CRISP, always | `proof:dock-rest-crisp` (computed `filter` of every `.glass-dock` at rest = `none`/0px, both docks × states × themes) | — (glass-ui-root render defect; no kf band-aid, kf cannot self-cure) | **T.C5** |
| **GU-2** | glass-ui | Dock morph endpoint-measurement robustness — measure laid-out geometry (or defer one frame); no `max-content` release **jump-cut** | `proof:dock-morph-continuity` (rAF-sampled expand AND collapse: width monotone ±2px, per-frame Δ ≤25% of range, no >5px change after `data-morphing` clears) | — (glass-ui-root defect) | **T.C5** |
| **GU-3** | glass-ui | The dock's own dismiss-pointerdown respects `keepOpen()` holds — a dock does not self-collapse under its own open popover | `proof:workaround-deletion` new row on `glassCaps.dockDismissHold` (cap true ⇒ scaffolding GONE) | `ChromeDock.vue:141-185` re-expand `watch` + popup MUTEX | **T.C6** |
| **GU-4** | glass-ui | Actuation integrity through the collapse-crossfade — the active `.dock-layer` carrying play survives the crossfade without a swallowed pointerdown (**≡ Q's GU-Q2 ≡ lane-20 "BG-2"**) | `proof:workaround-deletion` **S2** (`glassCaps.dockStrandKeepalive`) + `proof:live-session` S5 | `TransportDock.vue:315-359` `usePlayActuation` (`pointerHandled`/`onPlayPointerDown`) | **T.C6** |
| **BG-1** | glass-ui | SegmentedTabs **pill** must NOT emit `aria-orientation` on `role=group` (WAI-ARIA 1.2 §6.3) — **PUBLISH the already-authored guard** (**≡ Q's GU-Q1**) | `proof:glassui-aria-ask` PENDING→GREEN (mounted pill `role=group` renders `aria-orientation === null`) + `proof:workaround-deletion` **S1** (`glassCaps.ariaGuard`) | the `:aria-orientation="undefined"` suppress at the two consume sites; **precondition** for the KfPillTabs excision | **T.H6** |
| **BG-3** | glass-ui | **Decouple SegmentedTabs MATERIAL from ARIA ROLE** — a pill-LOOK panel switcher with `role=tablist` + arrow-key roving-tabindex (a `role`/`as="tablist"` axis; the indicator engine already spans both materials) | `proof:glassui-aria-ask` GREEN with the switchers as `role=tablist` + zero `KfPillTabs`/`useKfPillTabs` references (the a11y probe re-derived against the SegmentedTabs `role=tablist` DOM) | **`KfPillTabs.vue` (121L) + `useKfPillTabs.ts` (90L)** in totality | **T.H6** |
| **BG-4** | glass-ui | `DockDropdownTrigger` pointerdown-open parity with `DockSelectTrigger` (or a `trigger-action="pointerdown"` prop) — survive the press-scale reflow | `proof:dock-popover-opens` + `proof:single-toggle` with the synthesis removed | `MbabbMenu.vue:180-199` pointerdown click-synthesis | **T.H7** |
| **BG-5** | glass-ui | A **static-backdrop blur mode** (`blur-source="static"` / frozen-backdrop) so the dock/pane glass does not re-rasterize the live animating stage every frame | `proof:blur-not-resampled` (per-scene `no-backdrop-filter` toggle delta < 15%; today morph +250%, motion-path +180%) | the **ineffective** `contain:paint` on `.scene-host` (`App.vue:337`, falsified by measurement) | **T.G1** |
| **BG-6** | glass-ui | Parameterize the display-rung weight as `font-weight: var(--font-display-weight, 600)` — a single-weight display face becomes ONE token away | `proof:demo-fonts` v3 weight clause (zero visible `Instrument Serif` leaves at computed weight ≠ 400) with the demo `@layer` override RETIRED | the demo-side `@layer` weight override on the `text-display-*` utilities | **T.D2** |
| **BG-7** | glass-ui | Make the **coalesced cursor-reactive writer public** (`createSpecularWriter` — internal to `Card`/`DockIconButton` today) for the "wash over ordinary DOM" register | delineated GAP (the WebGL-cursor register is served by public `aurora` in **T.D13**; a hand-copy is the forbidden 2nd occurrence) | — (a NAMED gap, NOT a workaround; do not hand-copy the internal composable) | **T.D13** (gap named) |
| **BG-8** | glass-ui | `EasingPicker` **named-catalogue coverage beyond bezier/steps** — the demo's **bounce family** is not expressible as one cubic-bezier, so it stays kf-owned (the gallery is the scene's, the bezier/steps editor is `EasingPicker`'s); an extensible named-curve catalogue closes the gap (lane 05 F6) | delineated GAP (`EasingPicker` consumed as the sole editor; the bounce family kf-owned until covered) — no born-RED flip, a forward consumption note | — (a NAMED gap; the bounce catalogue stays kf-side, not a workaround) | **T.E8** (consumer) / **T.H2** (letter) |
| **BG-9** | glass-ui docs | An **externally-driven-`progress` example** in `EasingPicker` docs — the demo drives the picker's `progress` ref from the scene sweep; a documented pattern makes the consume idiomatic (lane 05 F6) | delineated GAP (docs ask, non-blocking; the demo already drives `progress` — the example de-risks the consume) | — (docs ask, no workaround) | **T.E8** (consumer) / **T.H2** (letter) |
| **BG-10** | glass-ui | `ToggleChip variant="cell"` with a **live-animating preview slot** — preset chips that render a live curve/ball preview inside the cell (lane 05 F6; T.B6 consumes `ToggleChip variant="cell"` for presets) | delineated GAP (additive slot on an existing component; the demo consumes `ToggleChip cell` today without the preview slot) | — (additive component ask, no workaround) | **T.E8** (consumer) / **T.H2** (letter) |
| ~~BG-2~~ | — | **RETIRED — duplicate.** Lane 20 §4's "BG-2 (re-issue GU-Q2, dock collapse-crossfade keepalive)" is the SAME defect as **GU-4** / Q's GU-Q2 (`glassCaps.dockStrandKeepalive`, already an arm in `proof:workaround-deletion` S2). Do **NOT** re-number a second ask here. | — | — | — |

**Breaking-ness.** GU-1..4, BG-1, BG-4, BG-5, BG-6, BG-7, BG-9 are **non-breaking** (guards that
OMIT a prohibited attribute, additive props, opt-in modes, a token default, a docs example).
**BG-3, BG-8, BG-10** are **additive** (a new opt-in axis / an extensible catalogue / an additive
preview slot on an existing component). A single BG/BH cut can ship them. **BG-8/BG-9/BG-10 are the
easing-picker consumption asks** (lane 05 F6, routed from T.E8) — forward-looking, non-blocking; the
demo consumes `EasingPicker` today with the bounce family kf-owned.

---

## §1 The naming crosswalk (three prior schemes → this letter's canonical set)

This letter is the **single source** of the consolidated ask naming. Two audit lanes and one
prior tranche numbered overlapping asks independently; the reconciliation:

| this letter | lane 08 (dock) | lane 20 (consumption) | Q letter | glassCaps probe | note |
|---|---|---|---|---|---|
| GU-1 dock rest-crisp | GU-1 | — | — | (new) `proof:dock-rest-crisp` render check | render defect, owner-visible via #4 |
| GU-2 dock morph continuity | GU-2 | — | — | (new) `proof:dock-morph-continuity` render check | render defect |
| GU-3 dock dismiss-hold | GU-3 | — | — | `glassCaps.dockDismissHold` (new cap) | distinct from GU-4 |
| GU-4 click-integrity | GU-4 | **BG-2** | **GU-Q2** | `glassCaps.dockStrandKeepalive` (**exists**, S2) | **the ONE genuine duplicate — unified** |
| BG-1 pill aria guard | — | BG-1 | **GU-Q1** | `glassCaps.ariaGuard` (**exists**, S1) | escalated, 2 tranches stale |
| BG-3 material↔role decouple | — | BG-3 | — | (no cap — a component-shape ask) | the deeper KfPillTabs cure |
| BG-4 dropdown pointerdown parity | (D7 note) | BG-4 | — | `glassCaps.dockDropdownPointerdown` (new cap) | kills MbabbMenu synthesis |
| BG-5 static-backdrop | — | — | — | (installed-version + no-static-mode probe) | escalated from perf lane 11 |
| BG-6 `--font-display-weight` | — | — | — | (token-present dist grep) | escalated from lane 09 |
| BG-7 public specular writer | (lane 12 F6) | (§3.5 low) | — | (export-present dist grep) | escalated from lane 12 |
| BG-8 EasingPicker named-catalogue | — | — | — | (no cap — a component-catalogue ask) | from lane 05 F6 (routed via T.E8) |
| BG-9 external-`progress` docs | — | — | — | (no cap — a docs ask) | from lane 05 F6 (routed via T.E8) |
| BG-10 `ToggleChip cell` preview slot | — | — | — | (no cap — an additive-slot ask) | from lane 05 F6 (routed via T.E8) |

**Cap-name discipline (do NOT fragment the probe).** GU-4's defect already has a coded cap —
`glassCaps.dockStrandKeepalive` in `scripts/proof-workaround-deletion.mjs:255`. Lane 08/T.C6
proposed a *second* name, `dockClickIntegrity`, for the same defect. **Reuse
`dockStrandKeepalive`.** Do not mint a synonym cap; a single defect gets a single probe (else
the two gates can disagree). GU-3 (`dockDismissHold`) and BG-4 (`dockDropdownPointerdown`) are
genuinely new caps for genuinely new defects.

> **⚠ Charter-shorthand note.** Charter §1's T.H row writes "dock dismiss-hold + click-integrity
> (BG-2/4)". The downstream-anchored naming (T.C5/T.C6, lanes 08/20) supersedes it: **GU-3** =
> dismiss-hold, **GU-4** = click-integrity (= Q GU-Q2), **BG-4** = the DockDropdownTrigger
> pointerdown parity. This letter is authoritative; the charter shorthand is imprecise, not
> operative.

---

## §2 The escalated Q asks (2 tranches stale, now owner-visible)

### BG-1 — the SegmentedTabs pill `aria-orientation` guard (PUBLISH the already-authored fix)

**The defect, in the CONSUMED dist.** `node_modules/@mkbabb/glass-ui/dist/tabs.js:305-306`
emits, on the DEFAULT pill variant:
```js
role: I.value ? "tablist" : "group",                       // pill ⇒ "group"
"aria-orientation": L.value ? "vertical" : "horizontal",   // UNCONDITIONAL — on role=group too
```
i.e. the prohibited `aria-orientation` on `role=group` (WAI-ARIA 1.2 §6.3). The fix is
**already authored** on glass-ui's `prototype/liquid-dock` branch (Q verified
`SegmentedTabs.vue:406` byte-for-byte: `:aria-orientation="isUnderline ? … : undefined"`), but
**UNPUBLISHED** — 4.0.1 and 4.1.0 both ship the unconditional emit.

**kf evidence (lane 20 §1, lane 21 #1).** kf carries `KfPillTabs.vue` (121L) +
`useKfPillTabs.ts` (90L) whose own header states it exists ONLY because glass-ui's pill emits
the prohibited attribute, "forcing an undefined-suppress at the two band-aid sites
(SpringSidebar + AnimationControls) that P-invariant-28 forbids re-carrying." This is precisely
VERDICT #18's "KfPillTabs.vue?? KF? Pills? Why aren't these just glass-ui components?"

**glass-ui deliverable.** Carve a **BG/BH-only patch** shipping JUST the `SegmentedTabs.vue:406`
guard (NOT the entangled `prototype/liquid-dock` work) and publish it.

**kf acceptance + retire.** `proof:glassui-aria-ask` (the mounted-pill DOM readback) flips
PENDING→GREEN when the consumed dist's `role=group` renders `aria-orientation === null`;
`proof:workaround-deletion` **S1** (`glassCaps.ariaGuard` dist grep) flips PENDING→GREEN when
the guard's role-conditional `: void 0` else-arm is in the dist. Both **already exist** and are
born-PENDING on 4.0.1. On the re-pin, kf deletes the two `:aria-orientation="undefined"`
suppress lines. **BG-1 is a precondition for BG-3** (deleting KfPillTabs).

### GU-4 — the dock collapse-crossfade click-strand (the RF-17 / DM-1 cure)

**The defect (lane 08 D2/D7, lane 21 #2).** The dock's collapse-crossfade sets the active
`.dock-layer` to `pointer-events:none` before the browser synthesizes the trailing `click`,
**stranding a `@click`-only play toggle** (MEMORY's "dock double-click" chronic; the DM-1 saga).
The consumed `dist/dock.js` carries only the UNRELATED `useDockClickIntegrity` + a
`pointer-events-none` indicator, **not** a `.dock-layer` keepalive (`proof-workaround-deletion.mjs:255-272`
`glassCaps.dockStrandKeepalive === false`).

**kf evidence.** `TransportDock.vue:315-359` (`usePlayActuation`) re-implements native `<button>`
click semantics — press-origin dedupe, Space-on-keyup, Enter-repeat-guard — from disjoint
pointerup/keydown sources, "because the durable cure (a glass-ui dock-layer keepalive) the
consumed dist does NOT carry." Its own header records that the DM-1 KILL **reintroduced two
defects** (F2 auto-repeat, F3 press-origin) it then had to re-fix: a full re-derivation of the
platform affordance.

**glass-ui deliverable.** A dock-internal keepalive that holds the active `.dock-layer`
interactive across the collapse-crossfade (the layer-morph family; the EXACT keepalive API name
is glass-ui's to choose). GU-4's deliverable needs only to make the BEHAVIOR true + leave the
structural dist signature the existing `dockStrandKeepalive` grep already reads.

**kf acceptance + retire.** `proof:workaround-deletion` **S2** flips PENDING→GREEN
(`glassCaps.dockStrandKeepalive` dist grep) + `proof:live-session` S5 (a scene PLAY through the
dock produces motion with the band-aid removed). On the re-pin, kf collapses `usePlayActuation`
to a plain click handler (T.C6, gated on `actions.primary` landing at T.B10/T.C1).

---

## §3 The dock render + interaction asks (owner-visible via VERDICT #4/#6)

### GU-1 — resting docks are permanently blurred (a RESTING glass-ui `filter`, not backdrop-filter)

**The defect (lane 08 D1, live-measured).** Shot 04's "unreadable blur-blob" is the resting
collapsed ChromeDock. Reproduced + measured (`08-shots/home-top-dock-rest.png`): the 54×54
collapsed dock computes `filter: blur(3px)` (a SELF filter on the whole plate + glyph + border).
**Root cause** is glass-ui's BB.W-LIQUID-REVEAL bloom rule,
`dist/styles/dock/morph.css:79-84`:
```css
.glass-dock {
    --dock-reveal-blur: 3px;
    filter: blur(calc(var(--dock-reveal-blur) * (1 - var(--dock-expand-t, 1))));
}
```
The rule is **NOT gated on `[data-morphing]`** — at rest a collapsed dock holds
`--dock-expand-t: 0`, so the whole element sits under a permanent 3px self-`filter`. The
intended "in-flight decongest" is fine as a morph beat; as a RESTING state it destroys
legibility AND forces a standing extra compositing pass every frame the dock overlaps animating
content (a #19 perf sibling, cross-ref BG-5).

**glass-ui deliverable.** Gate the reveal blur on `[data-morphing]` (≤ ~350ms `DOCK_SPRING`
exposure), and blur the CONTENT, never the plate (blurring the plate smears border+shadow into
the blob). A resting dock — collapsed or expanded — is CRISP, always.

**kf acceptance.** `proof:dock-rest-crisp` (T.C5) — computed `filter` of every `.glass-dock` at
rest is `none`/`blur(0px)`, both docks × collapsed/expanded × 2 themes. **Born-RED today** by
measurement.

### GU-2 — the width morph never runs (a 14px sliver + a jump-cut)

**The defect (lane 08 D2, rAF-sampled).** The `DOCK_SPRING` drives `--dock-morph-t` correctly,
but the BOX the eye tracks snaps 58→14px, holds as a sliver for the whole "morph" + ~500ms,
then **jump-cuts 14→225px with no animation** (frame table in lane 08 D2). Root cause: glass-ui
pins measured endpoints (`dist/dock.js ~L390/895`) that resolved to ≈14px (padding only) because
the expanded layer's content was not yet laid out; the `max-content` release (`~L923`) became
the visible jump-cut.

**glass-ui deliverable.** Measure REAL laid-out endpoint geometry (or defer the morph one frame
until the target layer is measurable); no `max-content` release jump-cut. Once the width truly
morphs, glass-ui's own outer→in child-reveal stagger (`--dock-stagger-step`) returns for free —
that IS the "dock animation" the owner remembers being good.

**kf acceptance.** `proof:dock-morph-continuity` (T.C5) — rAF-sampled expand AND collapse: width
monotone ±2px, max per-frame Δ ≤25% of range, no width change >5px after `data-morphing` clears.
**Born-RED today** by the D2 frame table.

### GU-3 — the dock self-collapses under its own open popover

**The defect (lane 08 D7, lane 21).** `ChromeDock.vue:141-185` hand-rolls a popup MUTEX + a
`watch` that re-`expand()`s the dock when glass-ui's own dismiss-synthetic pointerdown
self-collapses it under an open popover — a workaround for the dock's hold contract not covering
its own dismiss path.

**glass-ui deliverable.** The dock's own dismiss-pointerdown respects `keepOpen()` holds.

**kf acceptance + retire.** `proof:workaround-deletion` new row on `glassCaps.dockDismissHold`
(new dist-content cap): cap true ⇒ ChromeDock's re-expand watch + popup mutex are GONE
(grep-clause). **GATED-ON-REPIN tripwire** (vacuously green today; flips RED the instant the cap
is true but the scaffolding survives) — T.C6.

### BG-4 — DockDropdownTrigger opens on `click`, not `pointerdown`

**The defect (lane 20 §3.4, lane 21 #3).** `DockDropdownTrigger` opens on **click** while
`DockSelectTrigger` opens on **pointerdown**; under the dock press-scale reflow (`scale:.96`) the
`pointerup` lands off the shrunken trigger and reka never synthesizes the `click`.
`MbabbMenu.vue:180-199` synthesizes reka's click on pointerdown and kills the native one — the
THIRD instance of the same glass-ui-gap band-aid shape.

**glass-ui deliverable.** `DockDropdownTrigger` pointerdown-open parity with `DockSelectTrigger`
(or a `trigger-action="pointerdown"` prop).

**kf acceptance + retire.** `proof:dock-popover-opens` + `proof:single-toggle` GREEN with the
synthesis removed (new cap `glassCaps.dockDropdownPointerdown`) — T.H7.

---

## §4 The new escalations (perf, type, cursor)

### BG-5 — a static-backdrop blur mode (the dominant systemic perf killer)

**The defect (lane 11 T1, CDP-measured over the PRODUCTION build).** `backdrop-filter` blur,
composited over a perpetually-animating stage, is a fixed CHROME cost independent of scene
content: the near-empty **morph** scene goes **33 → 116 fps (3.5×)** and **motion-path 43 → 120
fps (2.8×)** the instant `backdrop-filter` is neutralized. glass-ui ships **144
`backdrop-filter` declarations** (`dock.js`, `glass-panel.js`, `drawer.js`, `cards.css`,
`segmented-tabs.css`), including a `--glass-refract-filter` STACKED on the blur (2× the sample
cost). The GlassDock + controls pane sit permanently over the stage; every frame the subject
moves, the blur's source is invalidated → Chromium re-rasterizes the full blur footprint at up
to 60 Hz. The kf mitigation (`contain: paint` on `.scene-host`, `App.vue:337`) is **falsified by
measurement** — `contain:paint` on a *sibling* does not remove its pixels from a sibling blur
element's backdrop.

**glass-ui deliverable.** A `blur-source="static"` / frozen-backdrop mode: the dock/pane glass
reads a **static snapshot** of its backdrop rather than the live animating layer, so a moving
stage does not re-invalidate the blur. (The kf side ALSO restructures the shell so the stage
composites on a layer the chrome blur does not sample — T.G1 — but static-backdrop is the
glass-ui-owned half of the cure.)

**kf acceptance.** `proof:blur-not-resampled` (T.G1) — the `no-backdrop-filter` toggle delta for
every scene < 15% (today morph +250%, motion-path +180%, easing +76%). **Born-RED today.**

### BG-6 — a `--font-display-weight` token seam on the display rungs

**The defect (lane 09 F1, computed-style census).** glass-ui's display rungs hardcode
`font-weight: 600` (`dist/styles/typography/semantic.css:29` et seq.) — tuned for Plus Jakarta
Sans, which HAS a 600. The demo swaps `--font-display` to **single-weight Instrument Serif**
without neutralizing the weight, so the browser smears **synthetic faux-bold** onto a delicate
condensed serif (the "not right at all" hero, shots 03/18: computed `177.4px/600`). The
`style.css:63-64` comment claims "`--font-display-weight: 400` (glass-ui default) is correct" —
**that token does not exist in glass-ui 4.0.1** (grep: no hits in `dist/styles/tokens/`): a
masked consume-edge drift.

**glass-ui deliverable.** Parameterize the display-rung weight as
`font-weight: var(--font-display-weight, 600)` — the default preserves Jakarta's look; a
single-weight display face becomes ONE token override away (`--font-display-weight: 400`).

**kf acceptance.** `proof:demo-fonts` v3 weight clause (T.D2) — zero visible `Instrument Serif`
leaves at computed weight ≠ 400, with `font-synthesis: none` at `:root` and the demo-side
`@layer` override on `text-display-*` **retired** in favor of the token. Until the re-pin, kf
carries a one-`@layer` override (born-RED against the token's absence, version-tripwired).

### BG-7 — a public cursor-reactive writer (the "wash over ordinary DOM" register)

**The defect (lane 12 F6).** glass-ui already solves the pointer-tracked wash internally:
`dist/composables/glass/{useSpecularTracking,useSpecularPointer,vSpecular}.d.ts`'s
`createSpecularWriter()` is **rAF-COALESCED** (a 120–1000 Hz pointer collapses to ONE batched
layout read + ONE style write per frame), PRM-gated, and scope-disposed — the textbook fix for
the demo's hand-rolled `--mouse-x`/`--mouse-y` wash that forces a full-document synchronous
layout on **every** pointermove (measured ~1,100–2,000× the isolated cost,
`ComposeTarget.vue:74-141`). But `createSpecularWriter` is **NOT public** — none of it appears
in `package.json`'s `exports` map; it is internal to `Card.vue`/`DockIconButton.vue`.

**glass-ui deliverable.** Export the coalesced cursor-writer core (`createSpecularWriter` / a
`useSpecularTracking` composable) so a consumer can drive a wash over ordinary DOM content
through glass-ui's public surface — not hand-copy the internal composable (which recreates
exactly the "second hand-rolled occurrence" lane 12 documents).

**kf posture.** This is a **NAMED GAP, not a workaround** (VERDICT #27 "delineate our gaps, and
glass-ui's gaps"). The WebGL-cursor register — a signature cursor-reactive light on the home
hero — is served **today** by glass-ui's ALREADY-public `@mkbabb/glass-ui/aurora` (`Aurora` +
`useCursorInteraction` + `setCursor`), the T.D13/OD-2 path. BG-7 is needed ONLY for the subtler
DOM-content wash; until it publishes, kf mounts nothing that needs it and **never hand-copies the
internal composable** (`proof:cursor-light-no-sync-layout`, T.D13, is the recurrence guard).

---

## §5 The pin/version state at this dispatch

| package | declared (`package.json`) | installed | this letter |
|---|---|---|---|
| `@mkbabb/glass-ui` | `~4.0.0` (`:274`) | **4.0.1** | GU-1..4, BG-1/3/4/5/6/7 all target the BG/BH cut |
| `@mkbabb/value.js` | `^2.0.1` (`:271`) | 2.0.1 | (unaffected — value.js asks are T.S's letter) |

`docs/tranches/Q/PIN-LEDGER.json` already records the glass-ui TARGET frontier
(`^4.0.0 || ^5.0.0`, "the specular/dock consume-edge … BG/BH dev-complete, unbuilt"). **T.H2**
extends that ledger with a TARGET row per ask in §0, so the caret-pin consume is an observable,
gated edge (`proof:pin-ledger-current` (c.3)).

---

## §6 The gap ledger + version tripwire (the self-justifying-carry killer)

Three of these workarounds (`KfPillTabs`, `usePlayActuation`, `MbabbMenu` synthesis) each
independently re-declare "P-invariant-28 forbids the Nth carry" and survive anyway — **none
points at a shared ledger**, so no reviewer can see "these die when glass-ui BG/BH lands," and
no gate fails when it does (lane 21 #1-3). **T.H1** consolidates them into ONE
`demo/glass-ui-gaps.ts` registry — each entry names the consumed-dist defect, the workaround
site(s), the `glassCaps` probe, and the glass-ui version expected to fix it — and a
`proof:glass-ui-gap-tripwire` gate that reads the installed version + the `glassCaps` shape (the
SAME probe `proof:workaround-deletion` uses) and **FAILS when a ledger entry's fix is satisfied
in the dist but its workaround site still exists**. This forces excision at the moment the gap
closes, instead of N "forbids the Nth carry" comments that never fire.

Every §0 ask carries an EXISTING or new born-RED/PENDING kf gate, so the consume-and-delete is
oracle-bound in both directions.

---

## §7 INFORM (the DAG + the delete edges glass-ui must know)

```
glass-ui BG/BH publish (GU-1..4, BG-1/3/4/5/6/7; USER-DOMAIN cut)
   ─► kf re-pin (T.H2 pin-ledger TARGET → shipped)
      ─► kf S1/S2 workaround delete (proof:workaround-deletion PENDING→GREEN)
      ─► kf KfPillTabs / usePlayActuation / MbabbMenu-synthesis excision (T.H6/T.H7, GATED)
      ─► kf dock-render gates flip (proof:dock-rest-crisp / -morph-continuity, T.C5)
      ─► kf perf gate flips (proof:blur-not-resampled, T.G1)
      ─► kf type gate flips (proof:demo-fonts v3 weight, T.D2)
```

- **Carve-off (BG-1).** The aria guard is a BG/BH-ONLY patch shipping JUST the
  `SegmentedTabs.vue:406` guard — NOT the entangled `prototype/liquid-dock` BF work.
- **Non-breaking.** GU-1..4, BG-1/4/5/6/7 change no public API contract (guards, opt-in props,
  a token default). BG-3 is additive (a new opt-in role axis).
- **kf never patches these in-demo.** Every kf-side change is a DELETE gated on the publish
  (three-state `PRESENT+UNPUBLISHED → PENDING`; never a false-RED before the fix ships).

---

## §8 dev→impl boundary

- **This dev phase:** the letter CONTENT (this file's asks + acceptance gates + delete edges).
- **T.H2 (impl):** re-issue as the shipped `KF-TO-GLASSUI-BG.md`, add the pin-ledger TARGET
  rows, wire the new `glassCaps` caps (`dockDismissHold`, `dockDropdownPointerdown`) into
  `proof:workaround-deletion`, author `proof:glass-ui-gap-tripwire`.
- **On the BG/BH publish (owner-domain):** re-pin, and every gated excision (T.H6/T.H7,
  T.C5/T.C6, T.G1, T.D2) flips from born-RED/PENDING to GREEN in lockstep.
