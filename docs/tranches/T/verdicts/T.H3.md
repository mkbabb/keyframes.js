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

Disposition: APPROVED
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


## OWNER VERDICT — FILLED 2026-07-06

> **Token (verbatim):** “Ratify all with your best judgment. We shall adopt the glass-ui drawer, but ensure that we identify any gaps in that implementation and forward any and all glass-ui suggestions to that working agent's tranche execution (with the exhortation to research, plan, and fold into our running BG/BH wave set--no prefunctory implementation)”
>
> **Disposition:** OWNER-OVERRIDDEN: **ADOPT the glass-ui Drawer** (the HOLD recommendation was not taken). Rider: identify every gap the adoption surfaces and FORWARD all glass-ui suggestions to the glass-ui working agent's tranche execution, with the exhortation to research, plan, and fold into the running BG/BH wave set — no perfunctory implementation.

## ADOPTION RECORD — LANDED (batch ⑪, T.H3-ADOPT)

**The swap.** `ControlsPaneWrapper.vue`'s bespoke mobile sheet is REPLACED by
`<Drawer mode="live-behind" direction="bottom">` + `<DrawerContent :show-overlay="false">`
(the `.controls-pane` body shared between the mobile Drawer and the desktop naked rail via
`createReusableTemplate`). DELETED in totality (~550L): `SheetGrabHandle.vue`,
`useSheetGesture.ts`, `useSheetSpring.ts`, `useSheetState.ts`, and the bespoke sheet CSS
(the `--sheet-detent-*`/`--sheet-t`/`--stage-strip`/`--stage-reserve` block + the
`@media (max-width:1023px)` fixed sheet geometry).

**The dogfood holds transitively.** `node_modules/@mkbabb/glass-ui/dist/drawer.js:6`
literally does `import { SpringProgress as A } from "@mkbabb/keyframes.js"` and `:134`
constructs `new A({ response: 0.4, dampingFraction: 0.82, respectReducedMotion: true })`
to drive `--glass-drawer-t` — so the sheet is STILL moved by kf's own `SpringProgress`,
through glass-ui's facade. `proof:drawer-spring` is re-pointed to that transitive drive.

**The occlusion contract — best-achievable under the Drawer's forced geometry.** The
Drawer's detented sheet is `bottom:0; height:100%` (drawer.css :53/:134) and its visible
fraction = the active snap fraction (`--glass-drawer-t`). kf approximates the owner-verified
cure via `snapPoints`: the expanded detent caps the visible fraction (subject `0.48` ⇒
sheet.top ≈ 52dvh reserve; editor/storyboard `0.62` ⇒ 26dvh strip). What the snap ladder
CANNOT cure — the bottom-menubar overlap (`bottom:0`, no bottom-inset lever) — is the BG-11
structural gap.

**The gap capture + forward (the owner's rider).** Every gap the adoption surfaced is
recorded with measured evidence in `KF-TO-GLASSUI-BG.md` §FORWARDING item 6 (rows 6a–6e:
the bottom-inset token [≡ BG-11, escalated URGENT], the persistent-peek/`forceMount`
affordance, the orphaned keep-open mutex, the live-behind focus/scroll interplay doc, the
snap-velocity tunability) — each with a proposed glass-ui wave shape + a kf acceptance
tripwire, carrying the owner's research/plan/fold exhortation verbatim.

**Gate re-charter (the arming-audit under the ruling).** `proof:drawer-spring` re-points to
the `.glass-drawer` / `--glass-drawer-t` / `.glass-drawer-handle` model + the transitive
`SpringProgress`. The menubar-clearance clauses the Drawer's forced `bottom:0` structurally
breaks are registered as **BG-11-BLOCKED** `T_BORNRED_BACKLOG` rows
(`scripts/gate-bands.mjs`), dischargedBy "glass-ui BG-11 publish + re-pin" — never silently
weakened. `demo/glass-ui-gaps.ts` `drawerDetentInset` flipped to the ADOPT posture (the
workaround is now the LIVE Drawer awaiting the inset token, not the deleted bespoke sheet).
