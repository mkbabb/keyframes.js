# T.H3 — TASTE-VERDICT (the mobile-sheet Drawer geometry disposition)

## Packet
- **The finding (batch-④ Drawer probe, VERIFIED vs the consumed glass-ui 4.0.1
  `dist/styles/drawer.css`).** glass-ui 4.0.1 ALREADY ships the exact
  `Drawer mode="live-behind"` peek/half/full bottom sheet the demo hand-rolls in
  ~350L (`ControlsPaneWrapper` host + `useSheetGesture`/`useSheetSpring`/
  `useSheetState` + `SheetGrabHandle` + the sheet half of `ControlsPaneWrapper.css`),
  and it drives `--glass-drawer-t` off kf's OWN `SpringProgress` (the dogfood is
  preserved transitively). T.H3 is the big pure-consumption win — delete the
  bespoke sheet, adopt `<Drawer>`.
- **The blocker (measured).** A DETENTED (multi-snap) Drawer is FORCED by
  `drawer.css` to fill the viewport at any snap:
  `.glass-drawer[data-glass-drawer-snap-points="true"] { height:100%; max-height:100% }`
  (`:134-137`) atop the base `.glass-drawer { bottom:0; … }` (`:50-53`). Its FULL
  detent therefore covers the whole viewport — top to bottom — overlapping the
  bottom menubar band at ANY snap. There is NO blessed prop that provides a
  bottom-inset or a max-detent cap (`mode`/`direction`/`snapPoints` — none a
  geometry lever).
- **What adopting-as-is would cost.** kf's mobile sheet carries an owner-VERIFIED
  occlusion cure: a **52dvh stage-reserve**, a sheet **≤70dvh (never full-height)**,
  and **never occludes the bottom menubar** (`useSheetState`'s peek + expanded
  detents are both ≤70dvh — VERIFIED). Adopting the detented Drawer as-is would
  REGRESS that cure (the full detent is `height:100%` over the menubar).

- **The two options for the owner:**
  1. **HOLD THE CURE (recommended).** Keep the bespoke ≤70dvh occlusion-correct
     sheet; dispatch **BG-11** (a `--drawer-inset-block-end` bottom-reserve token +
     a max-detent-height cap); execute the T.H3 swap on publish. The version
     tripwire (`glassCaps.drawerDetentInset`, `demo/glass-ui-gaps.ts`) is armed —
     it flips RED the instant the lever ships while the bespoke sheet survives,
     forcing the swap then. Net today: NO occlusion regression, the ~350L deletion
     deferred to the re-pin.
  2. **ADOPT FULL-HEIGHT DRAWER NOW.** Delete the ~350L bespoke sheet immediately
     and accept the Drawer's full-detent geometry (a sheet that can cover the
     menubar at its top detent). Net today: the deletion lands now; the occlusion
     cure is traded for the tested/focus-correct/snap-detented Drawer.
- **Deltas claimed:** the finding is recorded with measured drawer.css evidence;
  BG-11 is authored (`KF-TO-GLASSUI-BG.md` §0/§4); the tripwire arm is live and
  vacuously green; NO source swap is performed pending this ruling.

## Verdict
**Owner (___), ____-__-__: "___"**

Disposition: PENDING
Reference: T.H3 (lane 20 rec 1) + `KF-TO-GLASSUI-BG.md` BG-11 + the `drawerDetentInset`
tripwire arm (`demo/glass-ui-gaps.ts`). The geometry choice — HOLD-the-cure (keep
the ≤70dvh occlusion-correct bespoke sheet behind BG-11) vs ADOPT-full-height-Drawer
(delete ~350L now, accept the menubar overlap) — is genuinely owner-open: no VERDICT
line rules on the mobile-sheet geometry, and the choice trades a VERIFIED occlusion
cure against a pure-consumption deletion. Default per the recommendation = HOLD (no
occlusion regression; the tripwire executes the swap on the BG-11 publish). No
born-RED taste oracle is authored ahead of the token — the objective clause is the
`proof:glass-ui-gap-tripwire` `drawerDetentInset` arm; this packet records the
disposition for the owner review.
