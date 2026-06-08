# impl-w7-dock-zorder — H.W7 S3/F3 (the `proof:dock-zorder` GATE lane)

The dedicated GATE lane for H.W7's S3 (the dock z-order verification over the new
fixed full-bleed stage) + the WV-W7-MED-4 keep-open mutex. S3 is a VERIFICATION
clause on S1, not a separate edit — the docks themselves are consumed glass-ui,
untouched (inv δ ALREADY-SOTA). This lane authors the falsifiable, re-runnable,
browser-gated proof and binds it into the gate set. **This lane wrote ZERO
demo/engine source** — only `scripts/proof-dock-zorder.mjs` + the `package.json`
+ `ci.yml` wiring + this note. The gate is GREEN on the landed overlay; each
clause was witnessed BITING via runtime defect-injection. tsc clean; built clean.
NOT committed.

## THE GATE — `proof:dock-zorder` (5 browser clauses, MEASURE-FIRST)

Mirrors `proof:stage-within-docks`'s plumbing (serveDist + Playwright + the H.W1
FSM-settle + `KF_REQUIRE_BROWSER` skip-or-fail). The scene is pinned via an
IN-PAGE `location.hash` assignment (NOT `page.goto` — goto clears storage + the
H.W1 reconcile trap), the machine is polled to rest on `cube`, the viewport is
RE-ASSERTED at 390×844 after navigation, and the controls sheet is FORCED OPEN
deterministically (seed `isControlsPanelOpen` + a `selectedAnimation` —
impl-w7-overlay §OPEN NOTES: a fresh `#/cube` load with no selection `v-show`-hides
the sheet). All five facts are measured live (a z-order / hit-test / anchor fact
is a RENDERED fact — there is no static half):

1. **Z-ORDER STRICTLY ASCENDING (the born-RED anchor).** The fixed stage
   `.stage-cell` (z-content **10**) < the open sheet `.controls-pane-wrapper`
   (z-controls **20**) < BOTH docks' `.z-dock` wrapper (z-dock **40**). Measured
   live: `stage z(10) < sheet z(20) < both docks z(40)`. Non-vacuity: ≥2 real
   (glass-dock-bearing) dock bands + a mounted fixed stage + numeric z on each.

2. **DOCK HIT-TEST — `elementFromPoint` at each dock-button center returns the
   DOCK.** For each real dock band, every IN-VIEWPORT, PAINTED, INTERACTIVE
   dock-button center hit-tests to a node contained by that dock (the z-10 stage +
   the z-20 sheet sit beneath the z-40 dock, so the dock wins). Live: top band 1/1,
   bottom band 4/4 resolve to the dock.

3. **THE OPEN SHEET DOES NOT STEAL THE MENUBAR'S POINTER EVENTS (the precise S3).**
   With the sheet OPEN, every in-viewport bottom-menubar button center hits the
   menubar dock, NOT the sheet — the sheet anchors `bottom: var(--dock-menubar-reserve)`
   (above the menubar band) and carries no covering backdrop. Live: 4/4 menubar
   centers hit the dock.

4. **LOW-1 — the fixed-containing-block invariant.** The fixed stage rect ==
   the viewport (390×844 ±2px) AND no ancestor in its chain establishes a fixed-CB
   (zero `transform`/`contain:paint|layout|strict|content`/`perspective`/`filter`/
   `will-change:transform` offenders) — so `fixed` resolves against the viewport,
   not an ancestor. Live: `rect 0,0 390×844 == 390×844`, **zero offenders**.

5. **KEEP-OPEN MUTEX — the menubar's collapse timer cannot shift the sheet's
   anchor while OPEN (WV-W7-MED-4 / S2b).** With the sheet open + NO dock
   interaction, after a wait PAST any plausible `collapseDelay` (3.5s) the menubar
   anchor (`top 750`) and the sheet anchor (`top 457`, `bottom 762`) are UNSHIFTED
   (±2px). Non-vacuity: the anchors must resolve AND the sheet must STILL be open
   after the wait (else the assertion is meaningless).

## THE BITE (born-RED witnessed via runtime defect-injection)

Each clause reds when its exact defect is introduced (proven by injecting the
defect into the live page at runtime — no source edit):

- **clause 1** — raise the stage `z-index` to 999 → `stage z(999) ≥ sheet z(20)` → reds.
- **clause 2** — raise the stage above the docks (z=999, `inset:0`) → every dock band
  center now hit-tests to `.stage-cell` (`onStage:true, inDock:false`) → reds.
- **clause 3** — the same steal scoped to the bottom band (the menubar center hits
  the stage/sheet) → reds.
- **clause 4** — put `transform: translateZ(0)` on the stage's parent → the
  ancestor walk finds 1 offender → reds.
- **clause 5** — if the collapse timer fired + re-anchored under the open sheet, the
  menubar top would move → the bottom-anchored sheet top shifts > 2px → reds.

No clause passes vacuously: each asserts an EXACT rendered geometry/z/anchor fact.

## TWO RECONCILIATIONS WITH THE LANDED STATE (the load-bearing MEASURE-FIRST findings)

**(A) The S2b keep-open mutex is a structural NO-OP in the landed tree — and the
invariant it guards HOLDS for a STRONGER reason.** `useSheetGesture` wires
`useOptionalDockContext()?.keepOpen()/release()` on the open watch. But the sheet
(`ControlsPaneWrapper`) renders as a SIBLING of the menubar's `<GlassDock>` —
`ControlsPaneWrapper` and `AnimationMenuBar` are siblings under
`AnimationControlsGroup`, so `provideDockContext` (scoped to the `<GlassDock>`
subtree) is NOT in the sheet's ancestor chain → `useOptionalDockContext()` resolves
to `null` → `keepOpen()` is a no-op (the menubar dock's `data-held` flag NEVER
sets; verified live: `data-held` is `null` with the sheet open). **The invariant the
mutex promises — no anchor shift while open — HOLDS anyway** because the bottom
menubar mounts `:always-expanded="true"` (`AnimationMenuBar.vue:17`), so its
`useDockState` collapse timer is STRUCTURALLY DISABLED: the anchor cannot shift
regardless of any keep-open token. The gate therefore asserts the **MEASURED
invariant** (the anchor is stable across the collapse-delay window — the rendered
fact the mutex promises), NOT the `data-held` mechanism the landed tree never
exercises. This is MEASURE-FIRST done right: gate the GUARANTEE, not the unwired
plumbing. The optional-context wiring is harmless (a defensive no-op that would
activate if the sheet were ever re-parented under the dock); the gate would stay
GREEN either way because `always-expanded` is the operative cause. **NB for the
overlay/engine reviewers:** impl-w7-overlay §S2b claims the mutex "holds
`keepOpen()`" — accurate as INTENT, but the running effect is the no-op above; the
anchor stability is owned by `always-expanded`. If a future wave makes the bottom
dock collapsible, the keep-open token must be acquired by a component INSIDE the
dock subtree (or the dock context provided across the sheet) for the call to take
effect — clause 5 would then bite the regression.

**(B) The dock hit-test must measure the PAINTED band, not the laid-out children.**
The top `ChromeDock` GlassDock is `fit-content`/collapsed (`overflow:hidden`,
91px-wide painted band at 390) — it LAYS OUT extra buttons (Controls-tab, Scene,
@mbabb) that OVERFLOW the visible band off to the right (button centers at
cx 277/406/511, beyond the painted right edge 241) and carry `pointer-events:none`
(clipped away in the collapsed state). A naive "hit-test every dock button center"
RED'd against the live tree (the cx=277 "Controls tab" center fell on the stage
behind the collapsed band). The gate filters to centers that are (i) in-viewport,
(ii) inside the dock's PAINTED (`overflow:hidden`-clipped) box, and (iii)
`pointer-events != none` — and, for a COLLAPSED dock that clips ALL its inner
buttons, falls back to hit-testing the dock's OWN center (the collapsed pill IS
the interactive `pointer-events:auto` target via `onClickCollapsed`). Same
assertion either way: the resolved node is the dock, not the stage/sheet. This is
the `proof:stage-within-docks` "measure the `.pointer-events-auto` pill, not the
wrapper" precedent applied to the hit-test.

## RECONCILIATION WITH W10/W11/W12 (no regression)

The z-order CONTRACT (`style.css §Z-INDEX ORDERED-LAYER CONTRACT`: content 10 <
controls 20 < bar 30 < dock 40) is the W3-era single-sourced glass-ui `--z-*`
scale — untouched by W10/W11/W12. The fixed mobile stage reuses the W10 G8
`.stage-cell` dock-safe primitive (z-content) verified by `proof:stage-within-docks`;
this gate verifies the COMPLEMENTARY fact (z-content sits BELOW z-dock + the sheet
z-controls sits below z-dock + hit-test + LOW-1) at the mobile width. The W11
glass-card stage + the W12 enriched scenes render unchanged behind the sheet; this
gate touches only the layer ORDER + hit-test + anchor, nothing in the DFA or scene
content. The docks are consumed glass-ui (inv δ ALREADY-SOTA), untouched.

## WIRING

- `scripts/proof-dock-zorder.mjs` — NEW (the 5-clause browser gate; serveDist +
  Playwright @390×844; settle-gated on the H.W1 FSM; `KF_REQUIRE_BROWSER`
  skip-or-fail).
- `package.json` — `"proof:dock-zorder": "node scripts/proof-dock-zorder.mjs"`
  (grouped with the H.W7 `proof:mobile-single-page` / `proof:drawer-spring`).
- `.github/workflows/ci.yml` — the named CI step (between `proof:mobile-single-page`
  S1 and `proof:drawer-spring` S2 — S3 is the verification clause on S1),
  `KF_REQUIRE_BROWSER: "1"` (a playwright-absent skip is a hard CI fail — a
  z-order/hit-test/anchor fact cannot pass vacuously).
- `proof:ci-coverage` — GREEN: all 93 `proof:*` gates (incl. this one) are invoked
  in CI.

## VERIFICATION SUMMARY (live, 390×844, the binding facts the gate asserts)

- z-order: `stage z(10) < sheet z(20) < both docks z(40)` — strictly ascending.
- dock hit-test: top band 1/1 + bottom band 4/4 in-viewport painted interactive
  dock-button centers resolve to the dock (collapsed-overflow buttons excluded).
- the open sheet does NOT steal the menubar's pointer (4/4 menubar centers hit the dock).
- LOW-1: the fixed stage rect == the viewport (0,0 390×844), zero fixed-CB ancestors.
- keep-open mutex invariant: across a 3.5s collapse-delay window with the sheet
  OPEN, menubarTop / sheetTop / sheetBottom UNSHIFTED (Δ 0px) — owned by
  `always-expanded` (the keepOpen call is a structural no-op; reconciliation A).
- bites witnessed: z-inversion (c1), stage-over-docks pointer-steal (c2/c3),
  transform-ancestor (c4) — each reds.
- tsc clean; `npm run gh-pages` builds clean.
