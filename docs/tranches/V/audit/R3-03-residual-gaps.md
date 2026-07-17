# Lane R3-03 — Residual live-verification gaps

**Auditor lane:** R3-03 · **Prefix:** RG- · **Model:** opus · **Date:** 2026-07-17
**Subject:** the audit copy (`…/scratchpad/kf-audit-copy`, fresh-Glass 7.0.0 linkage), dev server `:5194`
**Method:** `playwright-core` `channel:'chrome'`, headless; live scene drives + library harness
imported through the running vite graph (`/@fs/…/src/animation/index.ts` → `loadAnimationEngine()`
and the internal `group/index.ts` / `waapi/eligibility.ts` modules). Probes ran in the copy and were
deleted after; the four `closed-*.png` captures landed under `docs/tranches/V/audit/design-captures/`.

## Verdict

I closed all five named R2 coverage gaps against the live app. **Two of the five resolve as clean
negatives** (WAAPI group lowering is LANDED and functional; the multi-target blend selector is NOT
exposed — the assay's P2 premise is refuted). **One resolves as a probe-artifact negative** (the
settle-on-long-hide decay does not reproduce). **The remaining two surface a single glass-root dock
defect** (RG-1/RG-2): the controls open/close toggle is not single-tap reachable at rest — desktop
needs a two-step because the toggle's DOM box is stale/off-position and the click lands on the stage;
mobile because the toggle's host dock layer is `opacity:0; visibility:hidden; pointer-events:none` and
the button paints off-screen. The mobile controls sheet DOES open via a two-step tap (gap #4 resolved),
and a visible drawer-peek grab handle is the intended at-rest reopen affordance.

---

## Findings

### RG-1 — Desktop controls-close toggle is not single-click reachable (stale dock box → click hits stage) — P2

**Family:** glass-dock-layer-swap (glass-root echo) · **Disposition:** batch-letter glass-root row

On `#/cube` at 1280×900 the dock's `[aria-label="Close controls"]` reports a bounding box at
`{x:915,y:8,w:40,h:40}`, but the visible close icon paints at ~x744 (dock center). `elementFromPoint`
at the reported box center (935,28) returns `MAIN.grid.place-items-center` (`pointer-events:auto`) —
the stage, not the button. A direct `elementHandle.click()` therefore times out
(`Timeout 3000ms exceeded` — the actionability check never sees the button at its own box). The stale
box is the glass dock's double-layer swap (a hidden `dock-layer--full` mirror vs the painted layer).
**Two-step succeeds:** click the dock body first, then the toggle → `.controls-pane--closed` present,
`[aria-label="Open controls"]` in DOM, pane collapsed (`closed-cube-desktop.png`). Not a demo patch —
matches memory `project_dock_doubleclick` (glass-root). At 1280 the reopen toggle IS visible in the
dock at rest (see negatives), so the axis is only single-tap-broken, not invisible, on desktop.

### RG-2 — Mobile Open-controls toggle host layer hidden + button off-screen at rest — P2

**Family:** glass-dock-layer-swap (glass-root echo) · **Disposition:** batch-letter glass-root row

On `#/cube` at 390×844 the top chrome dock resolves to two layers: `dock-layer--full` at
`{x:164,y:-3,w:62,h:62}` with `pointer-events:none; opacity:0; visibility:hidden` (host of
`[aria-label="Open controls"]`), and a `dock-layer--summary is-active` 40×40 pill at `{x:175,y:8}`
that is the only interactive facet. The Open-controls button's own box lands at `{x:441,y:8}` —
**x=441 > viewport 390, off-screen** (`onScreen:false`), because it lives in the hidden full layer.
A single tap on the button is unreachable. **Two-step succeeds** (first tap the summary pill to expand
the dock, second tap Open controls → drawer opens, `[aria-label="Close controls"]` present) —
resolving R2-01's "could not confirm mobile controls-open sheet." Mitigated at rest by the drawer peek
(see negatives). Same glass-root mechanism as RG-1, mobile facet.

### RG-3 — Occasional amiga play-start race (Play click leaves spin pinned at 0) — P3

**Family:** start-race (T.A-adjacent) · **Disposition:** note / not the BV-1 settle behavior

In one of nine settle trials (`#/amiga`, 1280) the post-play pose read `preSpin=0`, `playing=false`,
`spin=0` across the whole sample window — the group never started (the `[aria-label="Play animation"]`
click did not register that run). All other trials had `preSpin≈2.1–2.3` and moved. This is a flaky
play-start, distinct from (and not evidence of) the BV-1 settle-home decay; folded here so the RG-N5
negative is not read as ignoring the one anomalous run.

---

## Negatives (the core deliverable)

### RG-N1 — WAAPI group lowering (U.C16) is LANDED and functional

**Gap #1 CLOSED.** The lowering path is wired end-to-end: `group/lifecycle.ts:87` calls
`lowerGroupWAAPI(group)` inside `play()`, sets `group._waapiDelegated = true`, and pushes the native
effects into `group._waAnimations`. Live harness on `:5194` (single-target DOM group, one
`CSSKeyframesAnimation` with `useWAAPI:true`, `timingFunction:'linear'`, shared target, then
`group.play()`):

```
document.getAnimations(): before=22 → after=23
group._waapiDelegated = true ; group._waAnimations.length = 1
the effect targeting our element: playState = "running"
isGroupWAAPIEligible(group).eligible = true ; lowerGroupWAAPI() returned 1 handle
```

So an eligible single-target group DOES delegate to native `element.animate`, adding a real entry to
`document.getAnimations()` while the shadow rAF transport keeps lifecycle/events.
**Conservative-gate nuance:** with the engine's DEFAULT easing the same group is refused —
`isWAAPIEligible` returns `{eligible:false, reason:"easing has no faithful CSS twin (would run bare
linear on the compositor)"}`, and `isGroupWAAPIEligible` propagates it. Because the demo scenes use
non-CSS-native easings, real demo groups (cube etc.) stay on the rAF compositor in every drive — a
missed optimization by design, per the module header ("a missed optimization is preferable to a
split-brain render," `group/waapi.ts:1-8`), not a dead path. **Verdict: LANDED** (mechanism reachable
and correct; demo scenes don't exercise it purely for easing reasons).

### RG-N2 — Multi-target blend selector is NOT exposed; the assay's P2 premise is refuted

**Gap #2 CLOSED — no P2.** `blend-available` is bound to `animationGroup.singleTarget`
(`AnimationControlsGroup.vue:21`). `SquareScene.vue:180` sets `animationGroup.singleTarget = false`, so
on `#/square` `blendAvailable` is false and `LayerConfigPanel.vue` renders the `v-else` branch — a
disabled `LabeledField label="blend"` reading **"independent targets"** with tooltip *"Blend modes
apply only when layers share one target"* — the op `<LabeledSelect>` is not rendered. Live text scan of
`#/square` at 1280: `"independent targets"` present, zero combobox/select carrying a blend label
(`blendControls: []`). The engine will *store* `op:'add'` if set through the private
`setLayerConfig` seam (harness: `singleTarget:false`, `setLayerConfig('extra',{op:'add'})` →
`getLayerConfig('extra').op === 'add'`), but there is **no user-facing control that offers it** on a
multi-target group — so the "control promises what the engine refuses" defect does not exist. The UI
is honest.

### RG-N3 — Settle-on-long-hide decay (BV-1) does NOT reproduce — probe artifact

**Gap #5 CLOSED.** `#/amiga`, play, synthetic `visibilitychange→hidden`, wait, `→visible`, sample
`__kfAmigaProbe.pose()` every 100 ms ×7. Nine trials (3 s ×6 across two batches, 5 s ×3):

```
3000ms: preSpin≈2.08–2.34 → post-show spin moves continuously, playing=[1111111]  (×5)
3000ms: one run preSpin=0, spin all 0, playing=[0000000]  → play never started (RG-3, not decay)
5000ms: preSpin≈2.06–2.28 → post-show spin moves continuously, playing=[1111111]  (×3)
```

BV-1's signature (post-show spin gliding `2.69→0.13→…→0.004` while `playing` reads false at longer
hides) reproduced **zero times**. Every genuine run resumed playing with continuous motion. The
decay BV-1 saw was an artifact of its synthetic-`visibilitychange` override, not a reproducible engine
behavior. The one all-zero run is a play-start race (RG-3), not a settle glide.

### RG-N4 — Mobile controls sheet opens via two-step tap; drawer peek is the at-rest reopen affordance

**Gap #4 CLOSED.** Two-step on `#/cube` @390 → `afterState {closed:false, closeBtn:true}` (sheet
opened). At rest the `Drawer` (`glass-drawer glass-overlay controls-drawer-content`) sits at
`top=743` in an 844-tall viewport — a ~100 px peek with a visible grab handle
(`closed-cube-mobile.png`), the intended reopen affordance per `ControlsPaneWrapper.vue:108-116`
(mobile mount-reset forces `isControlsPanelOpen=false` → peek). So mobile is NOT invisible-at-rest for
reopening: the peek handle is on-screen; only the *dock* Open-controls button is off-screen (RG-2).

### RG-N5 — Desktop reopen toggle IS visible at rest at 1280

Contra the R2-01 "invisible-at-rest" worry read at desktop width: after closing controls at 1280 the
dock renders `PanelLeftOpen` at ~x744 with `[aria-label="Open controls"]` present in DOM
(`closed-cube-desktop.png` shows "Cube | Controls | ▷| @mbabb"). The invisible-at-rest condition is a
*collapsed-dock* (narrow / mobile) phenomenon (RG-2), not a desktop-width one. The single-tap *close*
is still intercepted (RG-1) — visibility and single-tap-reachability are separate axes.

### Other checked-sound negatives
- **Home has no controls panel** — `closed-{home}-{desktop,mobile}.png`: home landing renders with no
  control pane (`hasControlPanel:false`); "closed" is its trivial resting state. Fresh `/` load shows
  genuine home ("Select an animation…"), not the R2-01 Sequence-mislabel (that was hash-route carryover).
- **WAAPI gate rejects weight/spring/masked/disabled/mixed-target/non-CSS-easing children** —
  `isGroupWAAPIEligible` (`group/waapi.ts:27-58`) verified to short-circuit on each, matching its
  charter.

## Captures

`docs/tranches/V/audit/design-captures/closed-cube-desktop.png` (controls closed via two-step; dock
shows Open toggle) · `closed-cube-mobile.png` (peek + grab handle at rest, dock summary pill top-right)
· `closed-home-desktop.png` · `closed-home-mobile.png` (home, no controls panel).

## Coverage gaps (out of this lane)

- **WAAPI in-scene proof** — no demo scene uses a CSS-native easing, so native group lowering never
  triggers in the shipped scenes; a scene (or bench) with a `linear`/`ease` group would give an
  in-product `document.getAnimations()` witness. Verified only via the library harness here.
- **Weighted/`accumulate` numeric golden** (still open from BV-2) — untouched by this lane.
- **RG-3 play-start race** — 1/9 incidence; a dedicated start-race soak (repeat play clicks) would
  quantify it. Not the settle behavior, so parked.
