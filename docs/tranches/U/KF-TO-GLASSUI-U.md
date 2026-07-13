# KF → glass-ui — Tranche U consolidated BG/BH handoff

> **Status: RELEASE-HELD / DRAFT.** This is one coordination letter for the
> active glass-ui BG/BH work. It is not a claim that glass-ui 5.0.0 ships, and
> it authorizes no source edit, dependency-pin change, or consume motion in
> keyframes.js. Handoff target: the active sibling repository root
> `/Users/mkbabb/Programming/glass-ui`, branch `tranche/BI`; place the inbound
> copy in its coordination inbox, `docs/tranches/BI/coordination/`, for the
> BG/BH owner to reconcile.

## 0. Witnessed consume state

The current keyframes declaration is derived directly from `package.json`:

```text
@mkbabb/glass-ui: ~4.0.0
```

That range resolves the installed `@mkbabb/glass-ui@4.0.1`. Registry evidence
is separate: `dist-tags.latest` is 4.2.0, while
`npm view @mkbabb/glass-ui@5.0.0 version` returns E404. No `v5.0.0` tag is
witnessed in the sibling repository. The local sibling work is active, but
these facts mean the U consume edge remains held. The pin must not move before
both a `v5.0.0` tag and a successful registry publication are independently
witnessed.

The 4.2.0 dist is not treated as 5.0.0 evidence. Likewise, a local package
version or an untagged sibling commit is not a release signal.

## 1. Consolidated ask roster

The following asks consolidate the former BG and BH letters and the current U
gap census. BG/BH may absorb, decline, or re-deadline each row, but no row may
silently disappear.

| ID | Requested glass-ui posture | Keyframes acceptance / retirement |
|---|---|---|
| **GU-1** | Gate dock reveal blur on `[data-morphing]`; resting collapsed and expanded docks are crisp. | `proof:dock-rest-crisp`; no kf band-aid exists to retire. |
| **GU-2** | Measure laid-out dock geometry (or defer one frame) so expand/collapse has no max-content jump-cut. | `proof:dock-morph-continuity`; no kf band-aid. |
| **GU-3** | Dock dismiss-pointerdown honors `keepOpen()` while its own popover is open. | `dockDismissHold` cap; then remove ChromeDock re-expand watch and popup mutex. |
| **GU-4** | Preserve the active dock layer through collapse crossfade so the originating play press is not stranded. | `dockStrandKeepalive` cap + live-session proof; then retire `usePlayActuation` workaround. |
| **BG-1** | SegmentedTabs pill omits `aria-orientation` when its role is `group`. | `ariaGuard` cap + mounted DOM proof; prerequisite for retiring local pill suppression. |
| **BG-3** | Decouple SegmentedTabs material from ARIA role; support pill appearance with `role=tablist` and roving tabindex. | A11y proof; then remove KfPillTabs and its composable. |
| **BG-4** | DockDropdownTrigger opens on pointerdown, or exposes an equivalent trigger-action prop, matching DockSelectTrigger. | `dockDropdownPointerdown` cap + popover/toggle proofs; remove pointerdown click synthesis. |
| **BG-5** | Provide a static/frozen backdrop mode (`blur-source="static"` or equivalent) so dock/pane blur does not re-rasterize an animating stage. | `proof:blur-not-resampled`; no false green from installed 4.0.1. |
| **BG-6** | Parameterize display-rung weight through `--font-display-weight`. | Font proof; remove the kf-side utility override when consumed. |
| **BG-7** | Publish the coalesced specular writer for ordinary-DOM use, or explicitly decline and document the boundary. | Public-export evidence or an owner disposition; no hand-copy is permitted. |
| **BG-8** | Extend EasingPicker's named catalogue beyond cubic-bezier/steps, or explicitly keep bounce kf-owned. | Reconciled consume note; no silent assumption of coverage. |
| **BG-9** | Add an EasingPicker documentation example driven by an external progress ref. | Documentation evidence; non-blocking but named. |
| **BG-10** | Add an optional live-preview slot to `ToggleChip variant="cell"`, or explicitly decline. | Additive API evidence or owner disposition. |
| **BG-11** | Add a detented Drawer bottom-reserve token (e.g. `--drawer-inset-block-end`) and max-detent cap so the sheet cannot cover the bottom menubar. | `drawerDetentInset` cap; then remove the bespoke sheet host/gesture stack. |
| **BG-12** | Make ToggleGroup safe for horizontally scrolling strips (safe-start/explicit strip posture). | Consumption note; retire the owned max-content wrapper when absorbed. |
| **Dock-z** | Preserve dock-layer z-order/inversion through morph and rest states; no active layer may fall beneath the stage or become visually/interaction-inert. | Re-probe dock z-order and actuation on the published dist; record shipped/declined. |

GU-4 is the canonical name for the former BG-2/Q-GU-Q2 click-integrity row.
Do not create a duplicate cap or letter row.

## 2. Release-held protocol

Before keyframes consumes any BG/BH result, the sibling handoff must provide:

1. a tagged `v5.0.0` release on the active glass-ui line;
2. a successful registry publication, with `npm view
   @mkbabb/glass-ui@5.0.0 version` returning `5.0.0`;
3. the exact export-map and break-shape note (including any `./api` removal,
   per-component subpath moves, and `goo-blob` → `blob` rename);
4. a built-dist probe report for every row above, including explicit negative
   dispositions; and
5. owner disposition for each absorb-or-expire row.

Only after those facts are present may keyframes derive a deliberate pin/lockfile
motion, re-run the caps against the fetched 5.0.0 dist, remove a named
workaround, or update this letter from DRAFT to reconciled.

## 3. Absorb-or-expire deadlines

Each row has one terminal path at the next tagged glass-ui U/BG/BH release review:

| Covenant | Producer | Deadline / terminal action |
|---|---|---|
| GU-1/GU-2/Dock-z | glass-ui dock/morph owners | At the first tagged 5.0.0 review: ship and keyframes re-probes, or owner-decline with a dated re-deadline and retain the born-red consumer posture. |
| GU-3/GU-4/BG-1/BG-4/BG-11 | glass-ui interaction/accessibility/drawer owners | At the same tagged review: publish the cap-visible cure, or explicitly decline/re-deadline; no kf workaround may be deleted on prose alone. |
| BG-5 | glass-ui backdrop/compositor owner | At the 5.0.0 review: publish a measurable static-backdrop posture or record a dated owner disposition with the performance evidence. |
| BG-3/BG-6/BG-7/BG-8/BG-9/BG-10/BG-12 | respective component/docs owners | At the sibling release review: mark shipped, declined, or re-deadlined with a named producer. |

An absent tag or absent registry package is not a decline and does not discharge
the covenant; it keeps the consume edge release-held.

## 4. Handoff and current posture

This letter is handed to `/Users/mkbabb/Programming/glass-ui`, branch
`tranche/BI`, coordination inbox `docs/tranches/BI/coordination/`. The active
sibling may fold it into its BG/BH register and return a tagged release note.
Keyframes will independently verify the tag, registry package, export map,
installed tarball, and built-dist probes before any consume commit.

Until then, the keyframes package remains on `~4.0.0`, glass-ui 5.0.0 remains
unpublished (`npm` E404), and this U letter is an honest release-held handoff,
not a close claim.
