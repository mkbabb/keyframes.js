# p10 — Stage-visibility contract prototype (Q10 / S.G1)

> Probe: Pass-1E prototype, Tranche S DEVELOPMENT. Worktree
> `.claude/worktrees/wf_f9faf42c-6b8-10` (throwaway). Evidence shots + metrics:
> `docs/tranches/S/audit/pass1/prototypes/p10-shots/`.

---

## 1. The question + the spec's assumption

**Q10 (SPEC-v1 §6):** Does the stage-visibility contract hold on the two worst
scenes? Prototype G1's peek-band + reserved-stage on spring (born-open sheet)
and easing (severed feedback loop) at 375×667. SUCCESS: subject + primary
control visible at rest on both; no reds outside the FROZEN set; the contract
expressible as ONE gate. FAILURE: a scene needs a bespoke layout exception →
the contract gains a per-scene declared band, not per-scene CSS forks.

**S.G1's assumption:** ONE fleet-wide contract — sheets open at peek by
default; every scene declares a reserved stage band the sheet cannot occlude —
expressible in the shared sheet host, replacing per-pixel occlusion locks with
one layout-invariant `proof:stage-visible` gate.

**The design lanes' 10/10 systemic** (design/spring.md §2-mobile,
design/easing.md §3): at 375px the bottom sheet is born-open and covers ~85–88%
of the viewport; spring's entire instrument (readout, rail, ball, sweep, plot)
and easing's hero (ball, curve name, `f(t)=` readout) are invisible — each
page's edit→motion thesis is severed on the device class where the demo is
most often first-seen.

## 2. What I actually did

The shared sheet host was located: `ControlsPaneWrapper.vue` +
`useSheetState.ts`/`useSheetSpring.ts`/`useControlsLayout.ts`
(`demo/@/components/custom/animation-controls/`). The sheet ALREADY has a
two-detent spring system (`--sheet-t` ∈ [0,1], peek→expanded, both ≤70dvh) and
a reserved-stage calc — but ONLY for the `subject` stage mode; `editor`
(easing) and `storyboard` (spring) claim a 70dvh ceiling with no reserved band,
and both scenes force `isControlsPanelOpen = true` at setup.

Commands (all exit 0 unless noted):

```
npm run gh-pages                                          # baseline build
node scripts/p10-capture.mjs before                       # 375×667 shots + metrics
# … contract edits (below) …
npm run check && npm run gh-pages                         # tsc clean, rebuild
node scripts/p10-capture.mjs after                        # rest + expanded-by-gesture
npm run proof:drawer-spring                               # PASS
npm run proof:occlusion                                   # PASS (all 9 × 3 viewports × both states)
npm run proof:live-session-mobile                         # FAIL(3) on first cut → PASS on final
npm run proof:mobile-single-page                          # PASS
npm run proof:sheet-reopen-scroll                         # FAIL(1) arming → PASS after 1-clause re-arm
npm run proof:scene-switcher-mobile                       # FAIL(2) — VERIFIED PRE-EXISTING (identical on stashed baseline)
```

(All browser gates with `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/glass-ui`.)

```
git diff --stat
 …/components/ControlsPaneWrapper.vue             | 32 +++++++++++++--------
 …/composables/useControlsLayout.ts               | 12 +++++++-
 …/composables/useSheetState.ts                   | 17 ++++++++++++
 demo/scenes/easing/EasingScene.vue                |  5 +++-
 demo/scenes/spring/SpringScene.vue                |  5 +++-
 scripts/proof-sheet-reopen-scroll.mjs             | 25 +++++++++++++---
 6 files changed, 78 insertions(+), 18 deletions(-)
```

### The contract, as landed (two axes, ONE system)

**Axis 1 — PEEK-AT-REST** (who may expand the sheet):
- `useSheetState.ts`: on the mobile layout (`max-width: 1023px`), the host
  resets `isControlsPanelOpen = false` at wrapper setup — each scene entry is
  born at peek (the wrapper remounts per scene via
  `AnimationControlsGroup :key="superKey"`). Covers both the scene pokes and
  the store's persisted/default-`true` open fact.
- `useControlsLayout.ts`: the auto-show-on-tab-switch watch is gated
  desktop-only — on mobile it also fires on the scene machine's entry-time
  `selectedControl` PROJECTION (not a user pick), which silently re-expanded
  the sheet the instant the host reset it.
- `SpringScene.vue:47` / `EasingScene.vue:36`: the born-open pokes DELETED
  (dead writes — the desktop rail is already force-opened by the app shell at
  `useSceneMachineApp.ts:84`, which is ALREADY `window.innerWidth >= 1024`
  gated + DFA-non-empty gated).

**Axis 2 — THE RESERVED STAGE BAND** (how far expansion may go), tokens not
magic numbers, in `ControlsPaneWrapper.vue`:

```css
--stage-strip: 52dvh;                    /* subject default — behavior-IDENTICAL
                                            to the former 0.48·100dvh calc */
--stage-reserve: calc(var(--dock-band-reserve) + var(--stage-strip));
--sheet-detent-expanded: max(
    var(--sheet-detent-peek),
    calc(100dvh - var(--dock-menubar-reserve) - var(--stage-reserve))
);
/* editor/storyboard: the stage IS the content — leave a LIVE STRIP */
.controls-pane--stage-editor, .controls-pane--stage-storyboard {
    --stage-strip: 26dvh;                /* replaces the former 70dvh ceiling */
}
```

Every mode now DECLARES its unoccludable band; the detent DERIVES from the
declaration. ≤70dvh (WV-W7-HIGH-5) holds by construction. Zero scene-specific
CSS; the two scene edits are DELETIONS of per-scene hacks.

## 3. Findings (file:line evidence)

**F1 — The before state, quantified** (`p10-shots/before-*.png`,
`before-metrics.json`): both scenes born-expanded (`--sheet-t: 1`), sheet top
at y=81/667 → **12.1% of the viewport is stage**. Spring's subject rect below
the fold entirely (top 714 > 667); easing's ball at y 455–511, fully under the
sheet. The design lanes' claim is exact.

**F2 — The after state**: at REST both scenes sit at peek (`--sheet-t: 0`,
sheet = 64px sliver, **72% stage visible**); spring shows the complete
instrument (SpringProgress ×1.000 readout, SETTLED badge, rail + ball, the
teach-sentence, the sweep sampler) and easing shows the full oscilloscope
(`ease f(t)=` live readout, curve, handles, ball). Expanded-BY-GESTURE (a real
handle tap): sheet 298px, top at y=246 → **36.9% stage visible** — spring's
readout+rail band and easing's `f(t)=` readout + curve top stay LIVE while
editing. Metrics: `p10-shots/after-metrics.json`; shots
`after-{spring,easing}-375[-expanded].png`.

**F3 — ONE open axis is load-bearing (the probe's hardest lesson).** The first
cut added a mobile-only `mobileExpanded` ref beside the store fact
(`useSheetState.ts`). `proof:live-session-mobile` REDded 3 clauses: the touch
battery opens the sheet via the store-writing dock toggle, so the two axes
inverted its open→scroll→close→re-open state machine (the "close" tap
TOGGLED the un-synced axis open). The final cut keeps `sheetOpen` as the ONE
writable model over the store fact (`useSheetState.ts:33`) and moves the
contract to mount-reset + writer-gating. **Any real-wave implementation that
forks the open intent per layout will red the touch battery.**

**F4 — The re-opener chain is three-headed.** Deleting the scene pokes alone
is insufficient: (a) the store DEFAULT is `isControlsPanelOpen: true`
(`stores/controlOptionsStore.ts:35`) so a fresh visitor is born-open anyway;
(b) `useControlsLayout.ts:64` auto-opens on `selectedControl` change, which
fires on the machine's entry-time projection. All three writers (pokes,
default, projection-watch) had to be handled; the host mount-reset covers (a)
and the pokes, the desktop-gate covers (b).

**F5 — Gate posture**: `proof:drawer-spring`, `proof:occlusion` (all 9 scenes
× 3 viewports × open/closed), `proof:live-session-mobile` (incl. CH-3
sheet.bottom ≤ menubar.top at BOTH detents), `proof:mobile-single-page` (incl.
the ≤70dvh detent clause and the 0.45 subject floor) — **all GREEN** on the
final contract. `proof:sheet-reopen-scroll` REDded on its ARMING assumption
("the scene auto-opens" — `scripts/proof-sheet-reopen-scroll.mjs:185`), i.e. a
gate that ENCODES the born-open behavior the contract deletes; re-armed with a
handle tap (the same gesture its own close/re-open legs already drive) → PASS.
`proof:scene-switcher-mobile` FAIL(2) is **pre-existing** — verified identical
on the stashed baseline build (FROZEN set).

**F6 — The contract is expressible as ONE layout-invariant gate.** The
measured invariants are exactly the gate's clauses, per scene at 375×667:
(a) at rest `--sheet-t == 0` and `sheet.top/viewportH ≥ 0.65`;
(b) after a handle tap, `sheet.top ≥ (--stage-reserve resolved)` — i.e. the
declared band is unoccluded at the expanded detent;
(c) the subject's live rect intersects the band (liveness via the existing
transform-sampling oracle). No per-pixel locks; the tokens are the spec.

**F7 — The residual is G2's, not G1's.** With the sheet EXPANDED on easing,
the live strip carries the `f(t)=` readout + curve top but the hero BALL's
rest position (y 455–511) sits below the strip — the lane's full ask ("mini
rail + ball + f(t)") needs the scene to anchor its primary telemetry INTO the
band (the G1 spec's own "scene-critical telemetry anchored above the fold"
item, landing per-scene in G2). The system band makes that per-scene work
possible and gate-able (`--stage-reserve` is readable by scene CSS); it does
not do it for them. Not a bespoke-exception failure: no per-scene CSS fork was
needed for EITHER worst scene.

## 4. VERDICT: **adjusts-spec**

The contract HOLDS on both worst scenes — subject + primary control visible at
rest, no reds outside the FROZEN set (after one gate re-arm), ONE gate shape —
but G1's wording needs four adjustments:

1. **"Sheets open at peek by default" is a three-writer cure, not a
   sheet-host-only CSS change**: (a) host mobile mount-reset in
   `useSheetState`; (b) the `useControlsLayout` auto-open watch desktop-gated;
   (c) the two scene born-open pokes DELETED (SpringScene.vue:47,
   EasingScene.vue:36). The store default `isControlsPanelOpen: true` stays
   (desktop relies on the shell force-open, which is already ≥1024px-gated).
2. **MANDATE one open axis.** The open intent stays ONE writable model over
   the store fact; a per-layout fork of the intent reds
   `proof:live-session-mobile`'s touch battery (observed, 3 clauses). Write
   this into the G1 gate's spec as a guard clause.
3. **"Every scene declares a band" → every stage MODE declares a band**, as
   the derived token pair `--stage-strip`/`--stage-reserve` in the shared host
   (subject 52dvh ≡ today's 0.48 calc, behavior-identical; editor/storyboard
   26dvh replacing the 70dvh ceiling). Both worst scenes passed with mode-level
   defaults — per-scene declaration (SceneDescriptor field → style binding)
   stays the DECLARED-band escape hatch Q10's failure clause names, unneeded
   so far.
4. **Add a gate-arming audit to the wave**: existing runtime gates that ARM by
   waiting for the born-open sheet encode the deleted behavior
   (`proof:sheet-reopen-scroll` was one; the fix is a one-clause handle-tap
   re-arm). Grep the gate roster for `.controls-pane--open` arming waits.

## 5. Implementation cost (the real wave, S.G1)

- **Files (~8):** `useSheetState.ts`, `useControlsLayout.ts`,
  `ControlsPaneWrapper.vue` (the contract, done here and portable);
  `SpringScene.vue` + `EasingScene.vue` (poke deletions);
  `scripts/proof-sheet-reopen-scroll.mjs` (re-arm); NEW
  `scripts/proof-stage-visible.mjs` + `package.json` wiring (+ the S.B
  gate-tiers manifest row per Q8). The prototype diff is 78+/18− over 6 files.
- **Gates:** 5 sheet-coupled gates verified GREEN (drawer-spring, occlusion,
  live-session-mobile, mobile-single-page, sheet-reopen-scroll-after-re-arm);
  scene-switcher-mobile pre-existing FROZEN red (untouched); the born-RED
  `proof:stage-visible` to author across all 9 scenes (clauses per F6).
  Expect the born-RED to red on scenes whose primary control is dock/on-stage
  vs in-sheet — that triage IS G2's worklist, as the spec intends.
- **Risk: LOW-MEDIUM.** The mechanics are proven end-to-end here. Residual
  risks: (a) the 26dvh strip may want per-mode tuning once all 9 scenes are
  gated (the token makes that a one-line change); (b) the mobile mount-reset
  discards a returning user's expanded preference per scene entry — accepted
  as the G1 "peek by default" reading, worth a sentence in the wave record;
  (c) scenes whose sheet content assumed ~467px of height now get ~298px on
  editor/storyboard — the sheet body scrolls (verified: 280px scroll on
  easing post-change), but dense panes (spring heatmap) will be
  scroll-reached; G2's per-scene batch should sanity-check each pane.
