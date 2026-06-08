# g-_HARDEN — H.W10 (G1–G8 scene-normalization fold) · the adversarial HARDEN-lane verdict

**Lane:** HARDEN (adversarial; fix doc defects in `docs/tranches/H/` only). **Subject:** the
H.W10 spec (`waves/H.W10.md`) + its binding synthesis (`audit/feedback/g-_PLAN.md`) + the charter
absorption (`H.md §H.W10` + the DAG) + `PROGRESS.md` Band 4.6, folding the user's G1–G8 feedback
observed live on `tranche-h-impl` AFTER W5 (`db90cbb`) landed. **Ground:** SOURCE READS against
HEAD `db90cbb` + git history; no dist build run.

## VERDICT — ACCEPT (with 4 doc-defects FIXED in place + 2 forks for the lead)

H.W10 is a **sound, idiomatic, honestly-superseding** wave. Every G1–G8 item is terminally homed
with a falsifiable born-RED→green gate citing a REAL, live-verified anchor; the supersede-map is
honest and precept-consistent; H.W10 COMPOSES with H.W9 without contradiction; the DRY spine
(G3/G6 REUSE the standard component) and the G8 layout-PRIMITIVE (zero magic numbers) hold; the
charter↔wave↔PROGRESS one-truth is intact (W0–W10 = ELEVEN; DAG `… → H.W9 → H.W10 → H.W8`).

I found **4 doc-defects** (1 over-constraint risk that would have mis-fired the G3 gate, 1
incomplete supersede-amendment, 1 under-specified gate-reversal, 1 anchor drift) — ALL FIXED IN
PLACE across `H.W10.md`, `g-_PLAN.md`, `H.md`, `PROGRESS.md`. **2 genuine USER-DECISION forks**
remain for the lead to adjudicate (both already flagged with RECOMMENDED defaults in the spec).

---

## (1) Every G1–G8 terminally homed · born-RED→green · real anchor — PASS (all live-verified)

| Item | Gate | Born-RED anchor (verified live on HEAD `db90cbb`) | Verdict |
|------|------|---------------------------------------------------|---------|
| **G1** | REVISE `proof:scene-icons` | `assets/icons/easing.svg:1` `stroke="currentColor"` (+ all 7 monochrome; `grep currentColor assets/icons/*.svg` = all) — NO color token | BITES ✓ |
| **G2** | NEW `proof:scene-card-rounded` | `EasingTarget.vue:4`/`EasingSidebar.vue:2`/`SpringTarget.vue:4`/`StartingStyleTarget.vue:9`/`SpringScene.vue:8` bare `glass-resting cartoon-surface`; `cartoon-surface` sets NO `border-radius` (it lives on the Card root's `rounded-card`, verified `CardFooter*.js` exports `rounded-card`) | BITES ✓ |
| **G3+G7** | NEW `proof:scene-uses-standard-ribbon` | `EasingScene.vue:56-90,108` hand-rolled `ribbonContent` (Play/Pause `btn-playback-accent` `:63` + Reset `btn-interactive` `:79`, `RotateCcw` `:84-85`); `SpringScene.vue:95-183` (Pause/Play `:104`, Re-seat/Reset `btn-interactive` `:140,154`); NO standard `PlaybackRibbon` | BITES ✓ |
| **G4** | NEW `proof:easing-stage-is-ball` | `EasingTarget.vue:47-59` second `EasingCurveCanvas[editable]` in the stage; `viewMode=ref("singular")` `:146`; EasingCurveCanvas present in BOTH `EasingTarget.vue` (×4) AND `EasingSidebar.vue` (×3) — the duplicate is real | BITES ✓ |
| **G5+G6** | NEW `proof:easing-sidebar-normalized` | `EasingSidebar.vue:2` bare-class root + `:19,40` two inner `<Card surface="cartoon">` + `text-admin-label` `:43,54,79` + `text-mono-caption` `:23,49,59,67` + `size="sm"` `:82` | BITES ✓ |
| **G8** | NEW/AMEND `proof:stage-within-docks` | `dock-inset` at `design-idioms.css:498-500` pads bottom-only; present on `EasingTarget.vue:2`/`SpringScene.vue:2`/`SpringTarget.vue:2`/`StartingStyleTarget.vue:3`; `[stage]` track `AnimationControlsGroup.vue:364` reserves no dock band | BITES ✓ |

The standard-component reuse TARGET is live: `PlaybackRibbon.vue` (`grid-cols-2` `:24`, `.btn-playback`
`:26`, Reverse+`aria-pressed` `:39-41`, Slider `:10`), teleport-mounted from
`AnimationControlsControls.vue:163-177`; the dock already owns Reset (`AnimationControlsGroup.vue:87`
`@reset="(all)=>all?clear():reset()"`); `#rainbow-gradient` def `AnimationControlsGroup.vue:100-106`.

## (2) Supersede-map HONEST · precept-consistent — PASS (1 defect fixed)

Each revised landed decision is named with file:line + why-precept-consistent: G1→W5.S2 (the
monochrome flip + the WV-W5-MED-2 "baked-hue FAILS" clause — and W5's OWN `db90cbb` commit body
PRE-AUTHORIZED this supersede, verified); G4→W5.S4 (the curve-promote); G3/G7→the born-bespoke
`ribbonContent` (`f1d4fe6`); G5/G6→the born-bespoke `EasingSidebar` (`f1d4fe6`) + the NAMED H.W9
S1 amendment; G8→the W3 `[stage]`-track form; G2 rides G6/G8 (no landed decision). The G1
monochrome→colorful REVERSAL explicitly REVISES the gate (does NOT silently break it) — and I
STRENGTHENED that (DEFECT-C below).

**DEFECT-B (FIXED) — the H.W9 S1 supersede-amendment was INCOMPLETE for SpringSidebar.** H.W9 S1
sets `tier="quiet"` on FIVE inner Cards: `EasingSidebar.vue:19,40` (2) **AND**
`SpringSidebar.vue:4,60,81` (3, verified live). H.W10 G6 demolishes ALL FIVE ("the same
normalization extends to SpringSidebar"), but the NAMED amendment originally cited ONLY the
EasingSidebar two — leaving the three SpringSidebar `tier="quiet"` sites silently invalidated.
**Fix:** extended the amendment to name all five across `H.W10.md` (§supersede-map G6 row +
§H.W9-reconciliation S1 bullet), `g-_PLAN.md` (§2 G6 supersede + §5 reconciliation), `H.md`
(4 sites: §Folds prose, §Folds one-liner, the DAG note, the band-map line), `PROGRESS.md` (2
sites). Added an IMPL note: since H.W10 deletes all five, the IMPL may add `tier="quiet"` directly
to the surviving parents in the same motion (DRY, no churn-then-delete).

## (3) H.W10 COMPOSES with H.W9 — PASS (no contradiction)

- **G6 ⟷ F1 (row shape):** CONSISTENT. The standard `AnimationControlsControls.vue:10,18,43,55`
  uses `LabeledInput`/`LabeledSelect` rows (verified) that H.W9 F1/S3 amends to label-left
  `grid-cols-[auto_1fr]`. G6 normalizes `EasingSidebar` ONTO that same component → it INHERITS
  F1's row shape. H.W10 honestly states it EXTENDS F1 to `EasingSidebar`/`SpringSidebar` (which
  F1's site-list — `AnimationControlsControls`+`LayerConfigPanel` — did not cover). No collision.
- **G4 ⟷ F2 (bezier):** DISTINCT SURFACES, stated explicitly — "ONE editable bezier canvas per
  host (panel + sidebar), ZERO on the stage." F2 fits the `TimingFunctionPanel` rail canvas; G4
  removes the STAGE duplicate. Verified the stage `EasingCurveCanvas` (`EasingTarget.vue:47-59`)
  is genuinely a THIRD instance beyond the panel + sidebar. No conflict.
- **Ordering + gates:** H.W9 → H.W10 → H.W8 golden capture (10 occurrences across docs); H.W10
  AMENDS `proof:stage-not-clipped`→`proof:stage-within-docks` and composes with
  `proof:easing-canvas-bounded` (canvas stays in sidebar/panel, stage is the ball). Consistent.

## (4) DRY (G3/G6 REUSE) + G8 layout-PRIMITIVE — PASS (1 over-constraint risk fixed)

- **G3/G6 REUSE, no forked second component:** the spine is "surface the animation → the standard
  `PlaybackRibbon` mounts" + "EasingSidebar BECOMES the standard `AnimationControlsControls`/
  `Labeled*` sidebar." No second ribbon/sidebar authored. ✓
- **G8 is a PRIMITIVE with ZERO magic numbers:** the dock-band reserve derives from the EXISTING
  `--dock-band-reserve`/`--work-area-top-offset`/`--work-area-bottom-offset` tokens (verified
  `style.css:96-131`), `dock-inset` deleted from every scene. ✓

**DEFECT-A (FIXED) — the G3 gate (`proof:scene-uses-standard-ribbon`) was OVER-CONSTRAINED and
would have mis-fired.** The gate originally read "ZERO bespoke `ribbonContent` Reset button (the
ribbon component identity equals cube's)." But `ribbonContent` is NOT inherently bespoke — it is
the STANDARD scene-extension slot (`RibbonBar.vue:96-101` `<slot :selected-control>`), and **cube
ITSELF uses it** (`CubeScene.vue:157,217` — a Matrix Reset + a Lock/fixed toggle, ALONGSIDE the
standard `PlaybackRibbon`, not replacing it). Spring legitimately needs domain verbs the standard
ribbon does not carry: Reveal/Dismiss (the discrete sub-view from W5.S3) + Re-seat (the spring
target) at `SpringScene.vue:104-165`. A "ZERO ribbonContent" gate would either red CUBE or force
spring to drop its legitimate domain affordances — an anti-gestalt over-fit. **Fix:** re-scoped the
gate (and the S2 approach + the g-_PLAN §2/§3) to bite the PRECISE defect — the PRIMARY Play/Pause
+Reset PLAYBACK transport living INSIDE `ribbonContent` instead of in the standard `PlaybackRibbon`
— while EXPLICITLY PERMITTING `ribbonContent` DOMAIN extras (cube's Matrix controls, spring's
Reveal/Dismiss/Re-seat). The bite survives (easing/spring TODAY have NO standard ribbon, transport
is forked → reds); the over-constraint is gone.

## (5) charter↔wave↔PROGRESS one-truth — PASS

- **Wave count:** W0–W10 = ELEVEN, stated in `H.md:157-158` and `PROGRESS.md`; H.WZ is the close.
- **DAG places W10 before W8's golden baseline:** critical path `H.W0 → H.W1 → … → H.W9 → H.W10 →
  H.W8` (`H.md:639`, `PROGRESS.md:132`, the ASCII DAG `H.md:615-632`); H.W8 DEPENDS on "ALL of
  H.W0-H.W7 AND H.W9 AND H.W10" (`H.md`, `PROGRESS.md:151`). H.W10's golden state (colorful icons /
  normalized easing+spring / full-bleed stage) is what `proof:visual-lock` locks. Consistent.
- **Gate accounting:** "6 gates (5 NEW + 1 REVISE)" consistent in `H.W10.md`, `g-_PLAN.md §3`,
  `H.md:553`, `PROGRESS.md:150`; H.WZ "absorbs the H.W0–H.W10 gates" naming all six.

## (6) DEFECT-C (FIXED) — the G1 gate-REVERSAL was under-anchored

The REVISE row cited only the DOC-COMMENT line ranges of `proof-scene-icons.mjs` (`:17-23` SHAPE,
`:40-57` THEMING). A gate-author (H.W8) could leave the EXECUTABLE assertions monochrome-enforcing
while editing only the comment. I verified the real assertion sites and ADDED them to the REVISE
row: the SHAPE invert must rewrite the baked-color REJECTION at `proof-scene-icons.mjs:226-238`
(`bakedAttr`/`bakedGlobal` — today FAIL a colored icon → must become a colored-or-tokened
REQUIREMENT, `currentColor`-only now the failing case) + the shape probes `:218-225`; the THEMING
replace must rewrite the browser equality at `:540-569` (`strokeMatchesColor` `stroke===color` +
`light.stroke !== dark.stroke`), KEEPING the `<img>`-vs-inline-`<svg>` structural bite `:512-538`
(the D8 theme-blind-raster defense). This makes the non-vacuity falsifiable at the code level.

## DEFECT-D (FIXED) — anchor drift `SpringTarget.vue:3` → `:2` for `dock-inset`

`dock-inset` is on `SpringTarget.vue:2` (live), not `:3` (`:3` is a comment, `:4` is the
cartoon-surface stage). The drift appeared in `H.W10.md` (×2), `H.md` (×1), `g-_PLAN.md` (×3, one
of which mis-cited `:4`). Fixed all. `SpringTarget.vue:4` for the cartoon-surface/full-bleed (G2)
site is CORRECT and untouched.

---

## FORKS THE LEAD MUST ADJUDICATE (both already flagged in-spec with RECOMMENDED defaults)

- **FORK A — G8 surface: full-bleed-no-bg vs contained-card-with-bg.** The user offered both.
  Spec default (ADOPTED): land BOTH at their right altitude — the `[stage]`-track containment is
  the binding PRIMITIVE for ALL scenes, AND the easing/spring stage drops its card bg to full-bleed
  (matches cube/amiga, dissolves G2/G4 rounding, composes with the G4 ball). **Needs the lead's
  call ONLY if the user rejects full-bleed** (then G2 needs the Card-component route + a card edge
  that can still graze the bands under content growth). Lead should confirm full-bleed is acceptable.

- **FORK B — G1 palette: the exact per-primitive hues + Form A (`var(--rainbow-*)`) vs Form B
  (baked vivid) + whether to literally recover the killed PNG palettes** (magenta/yellow/red cube,
  red-white checker amiga, periwinkle square) vs the `--rainbow-*` token map. Spec default: Form A
  token-referenced fills + the suggested map (easing→violet, spring→green, sequence→blue,
  motion-path→cyan, cube→orange/3-face-gradient, amiga→red, square→yellow). A TUNING decision; the
  BINDING decision ("fixed-vivid-per-icon from the demo palette, inline-referenced, NOT monochrome
  `currentColor`") is decisive. Lead/IMPL finalizes the exact hues; user MAY name preferences.

**Lead-tuning calls (NOT user forks, set MEASURE-FIRST during impl):** the G4 stage-ball path
(engine-true path 1 vs the `getBallX` floor path 2); the S2 ribbon path (surface-into-group path 1
vs `PlaybackRibbon`-direct floor); the view-dropdown reduction (Singular+family+All vs Singular+All).

## Files touched by this HARDEN lane (DOCS-ONLY, all under `docs/tranches/H/`)

- `waves/H.W10.md` — DEFECT-A (G3 gate + S2 over-constraint), DEFECT-B (G6 amendment ×2),
  DEFECT-C (G1 REVISE executable anchors), DEFECT-D (`SpringTarget.vue:2`).
- `audit/feedback/g-_PLAN.md` — DEFECT-A (§2 G3 + §3 ledger), DEFECT-B (§2 G6 + §5), DEFECT-D (×3).
- `H.md` — DEFECT-B (4 sites), DEFECT-D (×1).
- `PROGRESS.md` — DEFECT-B (2 sites).
- `audit/feedback/g-_HARDEN.md` — this verdict.
