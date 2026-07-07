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

## §0 The ask roster (thirteen asks + one retired duplicate)

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
| **BG-11** | glass-ui | A DETENTED live-behind `Drawer` needs a **bottom-reserve token** (proposed `--drawer-inset-block-end`) + a **max-detent-height cap** — a full detent must NOT force `height:100%`/`bottom:0` over the bottom menubar band (the T.H3 batch-④ Drawer finding) | `proof:glass-ui-gap-tripwire` (the `drawerDetentInset` arm: cap satisfied ∧ the bespoke peek/half/full sheet survives ⇒ RED — the T.H3 swap becomes safe + overdue) | the bespoke `ControlsPaneWrapper` sheet host + `useSheetGesture`/`useSheetSpring`/`useSheetState`/`SheetGrabHandle` (the T.H3 swap deletes ~350L on publish) | **T.H3** (disposition) / **T.H2** (letter) |
| **BG-12** | glass-ui | `ToggleGroup` **strip posture for horizontal-scroll hosts** — the vendor group CENTERS its content, so inside a scroll container an overflowing group strands its LEADING edge past the scroll origin (the first item unreachable on phones); a `justify-content: safe center` fix (or an explicit strip posture) makes the group scroller-safe without a consumer wrapper (the T.E6 family-filter finding) | delineated GAP (non-blocking; the demo sizes an owned `width: max-content` wrapper row so the overflow condition never arises) | `EasingTarget.vue` `.family-row` (the owned max-content wrapper — dies when the posture ships) | **T.E6** (consumer) / **T.H2** (letter) |
| ~~BG-2~~ | — | **RETIRED — duplicate.** Lane 20 §4's "BG-2 (re-issue GU-Q2, dock collapse-crossfade keepalive)" is the SAME defect as **GU-4** / Q's GU-Q2 (`glassCaps.dockStrandKeepalive`, already an arm in `proof:workaround-deletion` S2). Do **NOT** re-number a second ask here. | — | — | — |

**Breaking-ness.** GU-1..4, BG-1, BG-4, BG-5, BG-6, BG-7, BG-9, BG-11, BG-12 are **non-breaking** (guards
that OMIT a prohibited attribute, additive props, opt-in modes, a token default, a docs example, a
NEW token + a cap the default keeps at `100%`). **BG-3, BG-8, BG-10** are **additive** (a new opt-in
axis / an extensible catalogue / an additive preview slot on an existing component). A single BG/BH
cut can ship them. **BG-11** is the T.H3 disposition: the demo does NOT adopt `Drawer
mode="live-behind"` for the mobile sheet YET — the detented geometry regresses the occlusion cure —
so the swap is HELD behind the token (the tripwire executes it on publish). **BG-8/BG-9/BG-10 are the
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
| BG-11 drawer detent bottom-inset | — | (§2b Drawer) | — | `glassCaps.drawerDetentInset` (new cap) | the T.H3 batch-④ Drawer finding — HOLD the swap until the token ships |
| BG-12 ToggleGroup strip posture | — | — | — | (no cap — a CSS-posture ask) | the T.E6 family-filter finding (the owned max-content wrapper row is the kf band-aid) |

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

### BG-11 — a detented live-behind Drawer covers the bottom menubar band (the T.H3 finding)

**The context (T.H3, lane 20 rec 1).** glass-ui 4.0.1 ALREADY ships the exact
`Drawer mode="live-behind"` peek/half/full bottom sheet the demo hand-rolls in ~350L
(`ControlsPaneWrapper` host + `useSheetGesture`/`useSheetSpring`/`useSheetState` + `SheetGrabHandle`
+ the sheet half of `ControlsPaneWrapper.css`), and it drives `--glass-drawer-t` off kf's OWN
`SpringProgress` (the dogfood is preserved transitively). T.H3 is the big pure-consumption win —
delete the bespoke sheet, adopt `<Drawer>`.

**The defect, in the CONSUMED dist (VERIFIED — `dist/styles/drawer.css`).** A DETENTED (multi-snap)
Drawer is forced to fill the viewport at any snap:
```css
.glass-drawer {               /* :50-53 — the base sheet */
    position: fixed;
    inset-inline: 0;
    bottom: 0;                /* pinned to the viewport bottom */
    …
    max-height: 97vh;
    margin-top: 6rem;
}
.glass-drawer[data-glass-drawer-snap-points="true"] {   /* :134-137 — the detented case */
    height: 100%;
    max-height: 100%;
    margin-top: 0;
}
```
The house engine positions the sheet by translating it `(1 - --glass-drawer-t) * 100%` along its
drag axis (`DrawerContent.vue`), so a snap fraction reads as that fraction OF THE VIEWPORT ONLY when
the sheet fills height — hence the detented selector's `height:100%; max-height:100%`. Its FULL
detent therefore covers the whole viewport (`bottom:0` → top of screen), overlapping the bottom
menubar band at ANY snap. There is **NO blessed prop** that provides a bottom-inset or a max-detent
cap (the census found `mode`/`direction`/`snapPoints`, none a geometry lever).

**Why the swap is HELD (the occlusion regression).** kf's mobile sheet carries an owner-VERIFIED
occlusion cure: a **52dvh stage-reserve**, a sheet that is **≤70dvh (never full-height)** and
**never occludes the bottom menubar** (`useSheetState` detents are both ≤70dvh — VERIFIED). Adopting
the detented Drawer as-is would REGRESS that cure — the full detent is `height:100%` over the
menubar. So the T.H3 swap is **HELD** until BG-11: the bespoke sheet stays the occlusion-correct
choice, and the version tripwire (`glassCaps.drawerDetentInset`) EXECUTES the swap the instant the
lever ships.

**glass-ui deliverable.** For a detented live-behind sheet: a **bottom-reserve token** (proposed
`--drawer-inset-block-end`, default `0` so the current look is unchanged) that insets the sheet's
bottom edge, AND a **max-detent-height cap** (the full detent resolves to `calc(100% -
var(--drawer-inset-block-end))` / a `min(…)` cap rather than a bare `100%`), so a consumer can
reserve the bottom menubar band without abandoning the snap ladder or the `--glass-drawer-t` spring
dogfood.

**kf acceptance + retire.** `proof:glass-ui-gap-tripwire`'s `drawerDetentInset` arm
(`demo/glass-ui-gaps.ts`): the cap is a dist-content probe over `dist/styles/drawer.css` (the token
present ∧ the snap-points selector's `max-height` genuinely capped — not `100%`). Cap satisfied ∧
the bespoke sheet still present ⇒ RED — the T.H3 swap is now safe + overdue; kf deletes the ~350L of
bespoke gesture/spring/state + the sheet CSS and mounts `<Drawer mode="live-behind"
direction="bottom">` with the bottom reserve. **Vacuously green today** (4.0.1 ships no lever). The
geometry DECISION — HOLD-the-cure (recommended) vs ADOPT-full-height-Drawer — is owner-open:
`docs/tranches/T/verdicts/T.H3.md` (PENDING-OWNER); the owner flips it at review if they prefer the
Drawer's full-detent geometry over the reserved-inset occlusion cure.

---

## §5 The pin/version state at this dispatch

| package | declared (`package.json`) | installed | this letter |
|---|---|---|---|
| `@mkbabb/glass-ui` | `~4.0.0` (`:274`) | **4.0.1** | GU-1..4, BG-1/3/4/5/6/7 + BG-8/9/10 + **BG-11** all target the BG/BH cut |
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
glass-ui BG/BH publish (GU-1..4, BG-1/3/4/5/6/7 + BG-11; USER-DOMAIN cut)
   ─► kf re-pin (T.H2 pin-ledger TARGET → shipped)
      ─► kf S1/S2 workaround delete (proof:workaround-deletion PENDING→GREEN)
      ─► kf KfPillTabs / usePlayActuation / MbabbMenu-synthesis excision (T.H6/T.H7, GATED)
      ─► kf Drawer swap: bespoke sheet DELETED (~350L) → <Drawer mode="live-behind"> (T.H3,
         proof:glass-ui-gap-tripwire drawerDetentInset arm)
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

---

## §FORWARDING — THE OWNER'S DRAWER-ADOPTION DIRECTIVE (2026-07-06, binding on the glass-ui tranche)

> **The owner's words (verbatim):** "We shall adopt the glass-ui drawer, but ensure that we
> identify any gaps in that implementation and forward any and all glass-ui suggestions to that working agent's tranche execution (with the exhortation to research, plan, and fold into our running BG/BH wave set--no prefunctory implementation)"

**What this means for the glass-ui session:** keyframes.js is ADOPTING `Drawer
mode="live-behind"` for its mobile sheet NOW (not holding behind BG-11). Every gap the
adoption surfaces below is a REAL consumer finding from a live integration — the owner's
exhortation is that each be **researched and planned into the running BG/BH wave set as a
first-class wave** (charter → falsifiable gate → landed), **never a perfunctory patch**.

The adoption-gap set (each carries kf-side measured evidence + a kf acceptance tripwire):

1. **BG-11 (now URGENT — the adoption ships against it):** a detented live-behind Drawer
   needs a bottom-inset/safe-area reserve token (proposed `--drawer-inset-block-end`) + a
   max-detent-height cap. Measured: `.glass-drawer[data-glass-drawer-snap-points=true]`
   forces `height:100%/max-height:100%` atop `bottom:0` — the full detent covers the
   viewport and overlaps a consumer's bottom dock band at ANY snap; no blessed prop moves
   it. kf's occlusion contract (52dvh stage-reserve / ≤70dvh detents / never occlude the
   menubar — an owner-verified cure) can only be approximated via snapPoints until this
   ships; the kf gates that guard it re-derive to best-effort + a BG-11-blocked backlog
   row that discharges on your publish.
2. **BG-5 (the single highest-leverage perf ask):** the static-backdrop blur mode.
   Measured on kf: the live backdrop-filter re-samples the moving stage structurally
   (26→66fps when neutralized); kf proved NO consumer-side CSS decoupling exists
   (isolation/z-index/radius/geometry all neutral) AND that the cost is compositor-side
   (invisible to main-thread CDP counters — measure on the GPU side when you research).
3. **GU-1/GU-2 (dock render):** rest-crisp (the resting collapsed dock computes
   blur(3px) both themes) + width-morph continuity (the max-content jump-cut) — kf's
   measured acceptance gates (`proof:dock-rest-crisp`, `proof:dock-morph-continuity`)
   are born-RED on the consumer side awaiting these.
4. **BG-1/BG-3/BG-4/GU-3/GU-4:** the tabs-aria + material↔role axis + dock interaction
   set (unchanged; the kf tripwires arm the excisions on publish).
5. **BG-6..BG-10:** the token/aurora/easing-picker asks (unchanged).
6. **The NEW findings the T.H3-ADOPT live integration surfaced** (each row = measured
   evidence + a proposed glass-ui wave shape + the kf acceptance tripwire; treat each with
   the same research/plan/fold mandate — no perfunctory patch):

   | # | Gap (measured on the LIVE adoption) | Evidence | Proposed glass-ui wave shape | kf acceptance tripwire |
   |---|---|---|---|---|
   | **6a** | **Bottom-inset / safe-area reserve token (≡ BG-11, now URGENT — the adoption ships against it).** A detented live-behind `Drawer` has no lever to reserve a bottom band, so the sheet rides OVER a consumer's fixed bottom-dock/menubar at ANY snap. | `dist/styles/drawer.css`: `.glass-drawer { position:fixed; bottom:0 }` (:52-53) + `.glass-drawer[data-glass-drawer-snap-points="true"] { height:100%; max-height:100% }` (:134-137). `DrawerContent.vue`'s inline `translateY(calc((1 - var(--glass-drawer-t)) * 100%))` means the visible fraction = the snap fraction, bottom-anchored — so kf's owner-verified 52dvh-stage-reserve / ≤70dvh / never-occlude-menubar cure can only be APPROXIMATED (cap the max detent at 0.48/0.62) but the menubar band is unreservable. | A **`--drawer-inset-block-end`** token (default `0`, no look change) that insets the sheet's bottom edge, PLUS a **max-detent-height cap** so the full detent resolves to `min(…, calc(100% - var(--drawer-inset-block-end)))` rather than a bare `100%`. Non-breaking; opt-in. | `proof:glass-ui-gap-tripwire` `drawerDetentInset` arm (ADOPT posture): cap satisfied ∧ the Drawer consumer present ⇒ RED (wire the token). kf backlog rows discharge on the publish + re-pin. |
   | **6b** | **`forceMount` / persistent-peek affordance for a non-modal sheet.** reka `DialogContent` UNMOUNTS on `open=false`, so a bottom sheet cannot present a persistent PEEK rung (the always-visible re-open grab handle the demo's UX needs). kf's workaround: hold the Drawer `:open="true"` PERMANENTLY and drive peek↔expanded through `activeSnapPoint` alone, never `open` — closing = snap to the 0.12 peek detent, not `open=false`. | `drawer.js` root: `<DialogRoot :open>` with no `forceMount`; `useDrawerSnap` `T` (pointerup) sets `open.value=false` only when a drag lands `≤0` — so a floored peek ladder (min 0.12) never closes, but the model is "always open" which is semantically off (the sheet is conceptually closed at peek). | A **`peek`/`persistent` mode** (or a `DrawerContent forceMount` honored in live-behind) where `open=false` collapses to the lowest detent + keeps the handle mounted, rather than unmounting — so "closed" is an honest state with a live re-open affordance. | delineated GAP (kf's permanent-open workaround is functional; a first-class peek state removes the semantic contortion). Non-blocking forward note. |
   | **6c** | **The keep-open dock mutex is now orphaned.** The bespoke sheet held `dockContext.keepOpen()` while open (WV-W7-MED-4) so the bottom menubar's collapse-timer could not shift the sheet's anchor mid-interaction. The Drawer is `bottom:0`-fixed (anchor-independent), so the mutex is moot AND was DELETED with `useSheetGesture` — but the dock can now visually collapse UNDER the open sheet (compounding 6a's overlap). | `useSheetGesture.ts` (deleted) held the mutex; the Drawer exposes no equivalent "hold the sibling dock open while I'm expanded" hook. | Pair with 6a: once the sheet reserves the menubar band, a **`Drawer`↔`Dock` coordination note** (or a shared `keepOpen` context the Drawer participates in when live-behind + expanded) keeps the reserved band's dock alive. | delineated GAP (subsumed by 6a — no reserved band ⇒ no coordination needed yet). |
   | **6d** | **Live-behind focus/scroll interplay is under-documented.** With `modal:false` + `:show-overlay="false"`, the page-behind stage stays interactive (correct), but the sheet body's own scroll vs. the stage's `touch-action` gesture landlords need a documented contract — kf scopes `.controls-pane { touch-action: pan-y }` inside the sheet and relies on the glass handle's `touch-action:none` for the drag, but the interplay with a subject stage that owns `touch-action:none` (cube orbit) is the consumer's to arbitrate with no guidance. | `drawer.css` `.glass-drawer-handle { touch-action:none }`; no documented pattern for "a live-behind sheet over a gesture-owning stage." kf's cube/amiga stages own `setPointerCapture` orbit surfaces disjoint from the portaled sheet — it works, but by luck of the portal, not a documented contract. | A **live-behind interplay doc** (the `touch-action` / pointer-capture contract between the portaled sheet, its handle, and a gesture-owning page-behind) + optionally a `body-scroll-lock="false"` explicit prop for the live-behind case. | delineated GAP (docs ask; the demo works today). Non-blocking. |
   | **6e** | **Snap-velocity fling threshold is a hardcoded constant.** `DRAWER_FLING_VELOCITY = 450` px/s and `DRAWER_SNAP = {response:0.4, dampingFraction:0.82}` are fixed in `constants.ts`; a consumer with a short 2-detent ladder (kf's peek/expanded) may want a lower fling threshold or a snappier settle without re-pinning. | `dist/components/ui/drawer/constants.d.ts`: `DRAWER_FLING_VELOCITY = 450`; `DRAWER_SNAP` frozen. kf's bespoke sheet used `response:0.3` (≈176ms) to stay under a 350ms settle budget; the Drawer's `response:0.4` (≈264ms) is looser — acceptable but not tunable. | Expose the fling threshold + the snap spring params as **props/tokens** (`fling-velocity`, `snap-response`/`snap-damping`) so a consumer tunes the detent feel without a fork. Additive. | delineated GAP (the defaults are fine; tunability de-risks the consume). Non-blocking. |

   Rows 6a–6e were captured against the live consumed `@mkbabb/glass-ui` 4.0.1 dist during the
   T.H3-ADOPT integration (ControlsPaneWrapper.vue). 6a is BG-11 escalated to URGENT (the
   adoption ships against it); 6b–6e are forward consumption notes. All carry the owner's
   research/plan/fold exhortation.
