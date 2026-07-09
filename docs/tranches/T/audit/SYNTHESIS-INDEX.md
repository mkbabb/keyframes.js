# SYNTHESIS-INDEX — rec → wave traceability (zero-dropped)

Built by reading `T.md`, every "## T recommendations" section across all 32
`audit/lanes/*.md` reports, and every `waves/T.*.md` "## Disposition of lane
recommendations" table + wave spec body. One row per lane recommendation.
Legend: **→ Wave** = that wave's disposition table lists this rec as its own
(BORN-RED/BORN-OWNER/assigned) scope · **↳ cross-ref** = the rec is explicitly
pointed at another band, no code lands here · **SPLIT** = the rec's scope is
divided across ≥2 waves, each disposition table names its slice · **MISSING**
= no wave doc's disposition table names a real owning wave-id for this rec ·
**⚠ DOUBLE-OWNED** = ≥2 waves' disposition tables (or wave-spec bodies) both
claim non-cross-ref ownership of the identical concrete action.

## Summary

| | |
|---|---|
| **Total lane recommendations** | **206** (across 32 lanes; verified by independent grep-count of numbered/`###` items under each lane's "## T recommendations" heading) |
| **Covered** (≥1 real owning wave-id) | **206** (200 at trace time; the 6 Lane-25 gaps closed by the 2026-07-05 post-harden synthesizer ruling — dated addenda in T.B/T.E/T.F/T.H/T.M) |
| **MISSING** | **0** (was 6, all Lane 25 recs 2–7 — see the resolution table below) |
| **DOUBLE-OWNED** | **2** flagged; both now **RESOLVED** by the harden pass — #1 (`usePlayActuation`) was already self-flagged clean co-ownership (T.H6 ledger/tripwire + T.C6 dock-render), the only defect its cap-name (fixed: `dockClickIntegrity`→`dockStrandKeepalive`, H3 C2); #2 (`KfPillTabs`) resolved to single-deletion-owner T.H5 (H3 C1) |

### MISSING — RESOLVED (was 6, all Lane 25)

At trace time Lane 25 (`25-plan-vs-landed-CD.md`) was the only lane (1–32) absent from
`T.md` §1's per-band "Lanes" column, leaving recs 2–7 unowned. **Closed 2026-07-05 by the
post-harden synthesizer ruling**: owners assigned per the Lane 25 table below; each owning
wave doc (T.B/T.E/T.F/T.H/T.M) carries a dated addendum; `T.md` §1's lane columns amended
to include 25 on the owning bands.

### DOUBLE-OWNED (2 conflicts, 4 citations)

1. **`usePlayActuation` + `MbabbMenu` synthesis excision** — Lane 08 rec 6
   (`T-DOCK-6`) and Lane 20 rec 6 both name this action. `T.C6`'s own body
   ("Scaffolding excision behind the re-pin") explicitly includes "collapse
   `usePlayActuation` to a plain click handler" with its own gate clause
   (`proof:workaround-deletion` — "zero `usePlayActuation` reference"). `T.H6`
   ("Excise `usePlayActuation` + the `MbabbMenu` synthesis") claims the same
   deletion, gated on GU-4+BG-4. **Self-flagged** by `T.H` §4 conflict-note 2:
   *"`usePlayActuation` excision is co-owned (T.H6 ↔ T.C6)... This is ONE
   excision triggered by ONE gap-ledger tripwire — the impl drive must land it
   once. Flagged so nobody double-authors or half-lands it."* Not a silent
   drop — an acknowledged, clean co-ownership split (H3-conflicts CONFIRMED-2
   confirmed the partition is sound: T.H6 = ledger/tripwire + `MbabbMenu` half,
   T.C6 = dock-render half). **The one real defect was the CAP NAME:** T.C6
   keyed GU-4 on the forbidden synonym `dockClickIntegrity`; **FIXED** (H3 C2) to
   the existing `glassCaps.dockStrandKeepalive` (`proof:workaround-deletion` S2),
   matching T.H1/T.H6 and the letter §1 crosswalk.
2. **`KfPillTabs.vue` + `useKfPillTabs.ts` deletion** — Lane 10 rec 6 and Lane
   21 rec 2 both named this action, with **contradictory timing semantics**.
   `T.B6` ("glass-ui-first panel kit") listed "Delete `KfPillTabs.vue` +
   `useKfPillTabs.ts`" under *"The kit (**born-RED, mechanical**)"* with its own
   gate `grep -r "KfPillTabs" demo/` `= 0`; `T.H5` ("Excise `KfPillTabs`")
   labelled the identical deletion **"GATED-ON-PUBLISH tripwire (NOT born-RED
   today...)"**, blocked on glass-ui BG-1+BG-3. **RESOLVED (harden pass H3
   CONFIRMED-1):** the DELETION has ONE owner — **`T.H5`** (gated-on-publish, per
   charter §1 T.H); the demo-side **rename** off the `Kf`-vanity prefix +
   `useRovingTabindex` convergence is **`T.F16`** (now); **`T.B6` is a pure
   consumer** — its born-RED `grep "KfPillTabs" = 0` clause is DELETED (it was
   accidentally satisfiable by T.F16's rename, a false green), re-anchored to
   "the switcher resolves through `SegmentedTabs`/dock `Select`/`useRovingTabindex`,
   never a hand-forked roving core." Cross-referenced all three ways (T.B6 ↔ T.H5
   ↔ T.F16). No longer a live conflict.

## Full traceability table

### Lane 01 — home-hero (7 recs) — ALL → T.D

| Rec | Disposition |
|---|---|
| T-HOME-1 (φ-band hero re-seat) | **→ T.D9** (BORN-OWNER OD-4) |
| T-HOME-2 (per-char uplift rebirth) | **→ T.D10** (RULED, born-RED) |
| T-HOME-3 (hero ink correction) | **→ T.D10** (weight half shared w/ T.D2) |
| T-HOME-4 (serif-italic deck ramp) | **→ T.D11** (BORN-OWNER OD-4) |
| T-HOME-5 (typing-card excision) | **→ T.D12** (RULED removal) |
| T-HOME-6 (transport play-first/divider/tooltip) | **↳ cross-ref T.C** (dock/transport grammar; T.D9 depends on it) |
| T-HOME-7 (home two-focal composition gate) | **→ T.D9** (standing capture gate; a T.M4 instance) |

### Lane 02 — cube (6 recs) — ALL → T.A

| Rec | Disposition |
|---|---|
| T-CUBE-1 (delete spin-energy bloom) | **→ T.A1** |
| T-CUBE-2 (strip stage telemetry) | **→ T.A2** (gate-rewire → T.E edge) |
| T-CUBE-3 (one settle-motion) | **→ T.A3** |
| T-CUBE-4 (panel facility exemplary) | **↳ cross-ref T.B** (cube is T.B's reference scene) |
| T-CUBE-5 (recomposition + geometry) | **SPLIT:** geometry → **T.A4**; `h()`→SFC → **↳ T.F**; matrix panel → **↳ T.B** |
| T-CUBE-6 (re-light write quantization) | **→ T.A5** (T.G perf-measurement edge) |

### Lane 03 — amiga (8 recs) — ALL → T.A

| Rec | Disposition |
|---|---|
| T-AM1 (plain-vars transform, LIBRARY) | **→ T.A6** |
| T-AM2 (rides group compositor) | **→ T.A7** |
| T-AM3 (Boing is the scene) | **→ T.A8** |
| T-AM4 (honest arc / fit-solver delete) | **→ T.A9** |
| T-AM5 (stage strip-down + grid-room) | **→ T.A10** (T.E/T.D edges) |
| T-AM6 (transient MetricBadge) | **→ T.A11** (T.H edge) |
| T-AM7 (render-on-demand) | **→ T.A12** (T.G edge) |
| T-AM8 (panel-truth for fromVars scenes) | **↳ cross-ref T.B** (controls-lane handoff) |

### Lane 04 — square (5 recs) — split T.A / T.B

| Rec | Disposition |
|---|---|
| SQ-T1 (honest Play triad, the G2 inversion) | **SPLIT:** normalizer + 4-corner keyframes + FSM core → **T.A13**; DFA-flip + triad + oracle-inversion → **T.B3** (joint arming-audit motion — must land in the SAME batch, both docs flag this explicitly) |
| SQ-T2 (de-annotate the stage) | **↳ cross-ref T.E** (ruled removals #5/#8/#11/#16) |
| SQ-T3 (no chrome without content) | **→ T.B4** |
| SQ-T4 (glass-ui-first panel) | **→ T.B6** (square is the proving scene) |
| SQ-T5 (de-Vue the hot path) | **↳ cross-ref T.G / T.F** (perf hot-path) |

### Lane 05 — easing (5 recs) — ALL → T.E

| Rec | Disposition |
|---|---|
| T-E1 (specimen-drawer gallery) | **→ T.E6** (BORN-OWNER; design via T.M2 prototype) |
| T-E2 (execute removals #13/#15) | **→ T.E7** (lockstep → T.E11) |
| T-E3 (EasingPicker replaces cluster) | **→ T.E8** (BG/BH asks → T.H) |
| T-E4 (de-red + violet authority) | **→ T.E9** (easing-scoped); sitewide token/OD-6 hue **↳ T.D** |
| T-E5 (type honesty) | **→ T.E10** (easing-scoped); sitewide font kit/tuple gate **↳ T.D** |

### Lane 06 — spring (7 recs) — split T.B / T.C

| Rec | Disposition |
|---|---|
| T-SPR-1 (dock single-option elision) | **SPLIT:** MODEL → **T.B5**; RENDER → **T.C1** |
| T-SPR-2 (restore panel triad) | **→ T.B7** |
| T-SPR-3 (discrete transition → 2nd channel) | **→ T.B7** |
| T-SPR-4 (KfPillTabs → SegmentedTabs, aria handoff) | **↳ cross-ref T.F16** (rename) **+ T.H5** (deletion) — DOUBLE-OWNED RESOLVED (H3 C1; T.B6 pure consumer) |
| T-SPR-5 (un-red the motion accent) | **↳ cross-ref T.D** (sitewide token authority) |
| T-SPR-6 (ONE parameter-field instrument) | **→ T.B7** |
| T-SPR-7 (strip stage to instrument) | **→ T.B7** (readout/register half) **+ ↳ T.E** (furniture prune) **+ ↳ T.D** (registers) |

### Lane 07 — prune-triage (6 recs) — split T.A / T.E

| Rec | Disposition |
|---|---|
| T-PRUNE-COMPOSE | **→ T.E1** |
| T-SVG-FUSION | **→ T.E2** (OD-1 FUSE) **+ T.E3** (OD-1 PRUNE-alt) — OD-1 ruling selects |
| T-MORPH-ATTRIBUTE-FIRST (LIBRARY) | **→ T.A14** |
| T-AUTOPLAY-CONTRACT | **→ T.A15** |
| T-NO-UTILITY-KEYED-LAYOUT | **→ T.E4** |
| T-READOUT-TRUTH | **→ T.E5** |

### Lane 08 — dock-system (7 recs) — split T.C / T.H

| Rec | Disposition |
|---|---|
| T-DOCK-1 (grammar recut) | **→ T.C1** |
| T-DOCK-2 (home = compass only) | **→ T.C2** |
| T-DOCK-3 (one tooltip system) | **→ T.C3** |
| T-DOCK-4 (kill serif chrome flip) | **→ T.C4** (font-census clause → T.D tuple gate) |
| T-DOCK-5 (morph+crispness handoff, GU-1/2) | **→ T.C5** (letter → T.H2) |
| T-DOCK-6 (scaffolding excision, GU-3/4) | **→ T.C6** (menubar slice → T.F; asks → T.H2) — ⚠ **DOUBLE-OWNED**: `usePlayActuation` half also claimed by **T.H6** (self-flagged, T.H §4 note 2) |
| T-DOCK-7 (dock appearance oracle joins roster) | **→ T.C7** (authority axis → T.M6; ceiling → T.M8) |

### Lane 09 — theme-typography (6 recs) — ALL → T.D

| Rec | Disposition |
|---|---|
| T-TY1 (honest display weight + serif floor) | **→ T.D2** (glass-ui `--font-display-weight` half → T.H2 BG-6) |
| T-TY2 (re-adopt Jakarta body register) | **→ T.D3** (home sub-header carve-out → T.D11/OD-4) |
| T-TY3 (demote mono to data register) | **→ T.D4** |
| T-TH1 (violet accent authority, latent-red kill) | **→ T.D7** (BORN-OWNER OD-6) |
| T-TH2 (signal proportion + functional contrast) | **→ T.D8** |
| T-TY4 (ramp totality) | **→ T.D5** |

### Lane 10 — panel-facility (7 recs) — ALL → T.B

| Rec | Disposition |
|---|---|
| 1 · THE HONEST GROUP | **→ T.B1** |
| 2 · UNIFORM FACILITY GRAMMAR | **→ T.B2** |
| 3 · SPRING/EASING RESHAPED AS CHANNELS | **→ T.B7** |
| 4 · REMOVE THE SURROUNDING PANE | **→ T.B4** |
| 5 · SINGLE-OPTION ELISION | **→ T.B5** |
| 6 · GLASS-UI-FIRST PANEL KIT (KfPillTabs dies) | **→ T.B6** (glass-ui-first kit — pure CONSUMER, no deletion clause); the fork's rename → **T.F16**, its terminal DELETION → **T.H5** — DOUBLE-OWNED RESOLVED (H3 C1) |
| 7 · PANEL REGISTER CURE | **→ T.B6** (panel-local); token authority **↳ T.D** |

### Lane 11 — performance (6 recs) — ALL → T.G

| Rec | Disposition |
|---|---|
| T1 (de-layer the blur) | **→ T.G1** (keystone; glass-ui static-backdrop half → T.H2 BG-5) |
| T2 (one master rAF clock) | **→ T.G2** |
| T3 (scenes reach true rest) | **→ T.G3** (amiga instance → T.A12 edge) |
| T4 (transform, not left/top) | **→ T.G4** |
| T5 (amiga WebGL budget) | **→ T.G5** (scene cures → T.A9/10/11/12 edges) |
| T6 (re-home perf gates) | **→ T.G6** (subsumes T1–T4 clauses) |

### Lane 12 — cursor-light (3 recs) — ALL → T.D

| Rec | Disposition |
|---|---|
| T-CL-1 (DO-IT-RIGHT: Aurora-on-hero) | **→ T.D13** (BORN-OWNER OD-2 option A); glass-ui gap half (public `createSpecularWriter`) → T.H2 BG-7 |
| T-CL-2 (REMOVE outright) | **→ T.D13** (BORN-OWNER OD-2 option B; compose-wash kill unconditional, rides T.E) |
| T-CL-3 (standing recurrence gate) | **→ T.D14** (born-RED) |

### Lane 13 — demo-structure (10 recs) — ALL → T.F

| Rec | Disposition |
|---|---|
| 1 · rename `demo/@/` → `demo/shared/` | **→ T.F1** |
| 2 · dissolve `components/custom/` | **→ T.F2** (merged w/ lane14 rec1) |
| 3 · cohere 4 editor peers → `instrument/` | **→ T.F5** (merged w/ lane14 rec4) |
| 4 · break up `styles/` | **↳ cross-ref T.D15** (charter-conflict note 6) |
| 5 · empty `app/` of scene-shared recipes | **→ T.F4** |
| 6 · rename `app/chrome/` → `app/dock/` | **→ T.F3** (merged w/ lane15 rec3, lane14 rec3) |
| 7 · de-vanity `KfPillTabs` → `AriaSafeTabs` | **→ T.F16** (merged w/ lane18 rec4, lane14 rec5) |
| 8 · introduce a `skeletons/` tier | **→ T.F8** (merged w/ lane16 rec6) |
| 9 · normalize to recursive module shape | **→ T.F6** (merged w/ lane14 F8) |
| 10 · split heavy scoped `<style>` (advisory) | **→ T.F20** |

### Lane 14 — at-structure (8 recs) — ALL → T.F

| Rec | Disposition |
|---|---|
| 1 · collapse `components/custom/` → `components/` | **→ T.F2** |
| 2 · close the `.css`-extension gate-dodge | **→ T.F7** (rides w/ lane25 rec1) |
| 3 · relocate `DemoGlobalChrome.vue` | **→ T.F3** |
| 4 · uniform peer shape (barrel + composables/) | **→ T.F5** |
| 5 · rename `KfPillTabs`; file upstream aria fix | **→ T.F16** |
| 6 · move `gestureSelectSuppression.ts` → `utils/` | **→ T.F13** |
| 7 · promote `kfEngine.ts` → `state/` | **→ T.F13** |
| 8 · split `styles/`; delete tombstones | **↳ cross-ref T.D15** (dock-band anchor chain → T.D18) |

### Lane 15 — app-prune (5 recs) — split T.F / OD-3

| Rec | Disposition |
|---|---|
| T-APP-PROVENANCE-SWEEP | **→ T.F19** |
| T-APP-CONST-TRIM | **→ T.F19** (exemplar instance) |
| T-APP-CHROME-RENAME | **→ T.F3** |
| T-APP-SCENES-SHRINK | **↳ cross-ref T.E1/T.E2/T.E3/T.E11** (consequence of scene prunes, not standalone) |
| T-APP-PPMODE-CALL | **→ OD-3** (`OWNER-DECISIONS.md` register row — cited consistently by both T.F and T.H as a decision record, not a code wave) |

### Lane 16 — scenes-composition (6 recs) — ALL → T.F

| Rec | Disposition |
|---|---|
| 1 · extract `useSequenceReel`/`useSequenceRows` | **→ T.F10** |
| 2 · split `useMotionPathGesture.ts` | **→ T.F10** (CONDITIONAL on OD-1=FUSE; MOOT if PRUNE) |
| 3 · extract `useSpringPresets.ts` | **→ T.F10** |
| 4 · split `EasingTarget.vue`'s comparison-track | **→ T.F10** (CONDITIONAL — likely superseded by T.E6) |
| 5 · shared `createPainterRegistry()` | **→ T.F9** |
| 6 · per-scene shaped skeletons | **→ T.F8** |

### Lane 17 — styles-idioms (10 recs) — ALL → T.D

| Rec | Disposition |
|---|---|
| 1 · de-archaeologize the stylesheets | **→ T.D15** |
| 2 · split & de-tombstone `design-idioms.css` | **→ T.D15** |
| 3 · one tiered token authority | **→ T.D15** |
| 4 · declare cascade-layer order; kill `*` reset | **→ T.D16** |
| 5 · consume glass-ui primitives; delete pills/rail | **SPLIT:** CSS-recipe census/progress-rail/status-badge → **T.D15**; KfPillTabs deletion → **↳ T.H5** (gated-on-publish) / rename → **↳ T.F16** / **↳ T.B** (sidebars dissolve, consumer) — DOUBLE-OWNED RESOLVED (H3 C1) |
| 6 · purge off-token color literals | **→ T.D17** |
| 7 · collapse dock-anchor calc labyrinth | **→ T.D18** (+ chain-depth cap from lane19 rec6) |
| 8 · lift scene-telemetry idioms to one recipe | **DEFERRED → T.D15** (most telemetry removed by T.A/T.E first; residual folds after) |
| 9 · typography & dark-mode single-sourcing | **SPLIT:** no-bare-font-family → **T.D3**; raw sizes → **T.D5**; one-`.dark` → **T.D15**; palette look → **T.D7** (OD-6) |
| 10 · token-route raw viewport literals | **→ T.D19** |

### Lane 18 — brittle-selectors (6 recs) — split T.E / T.F

| Rec | Disposition |
|---|---|
| 1 · scope tab-panel selectors to their own root | **→ T.F14** |
| 2 · prefer vendor public prop over `:deep()` | **→ T.F15** (easing half executed by T.E8) |
| 3 · decouple gesture-manifest `tell` from removed element | **→ T.E11** (the lockstep exemplar) |
| 4 · converge tab/roving-tabindex; de-vanity KfPillTabs | **→ T.F16** (upstream aria ask + deletion → T.H) |
| 5 · widen brittle-selector gates | **→ T.F14** |
| 6 · refcount `#highlightjs-theme` singleton | **→ T.F17** |

### Lane 19 — fragile-css (7 recs) — split T.D / T.F

| Rec | Disposition |
|---|---|
| 1 · single-source the 1023/1024px breakpoint | **→ T.F18** (coordinate batch w/ T.D19) |
| 2 · finish `vh`→`dvh` (cube + EasingSidebar) | **→ T.D19** |
| 3 · delete `--z-behind` duplicate | **→ T.D15** |
| 4 · tokenize `EasingCurveCanvas` glow/stroke registry | **→ T.D20** |
| 5 · consolidate `calc(50%±0.5px)` crosshair idiom | **→ T.D21** |
| 6 · publish one JS geometry value (anchor diamond) | **→ T.D18** (additive to lane17 rec7) |
| 7 · do not blanket-strip `-webkit-`/`@supports` | **PROCESS CONSTRAINT** — folded as guardrail into T.D16/18/19/20; no standalone wave |

### Lane 20 — glassui-consumption (6 recs) — ALL → T.H

| Rec | Disposition |
|---|---|
| 1 · consume `Drawer mode="live-behind"` | **→ T.H3** |
| 2 · swap `dock-separator` div → `DockSeparator` | **→ T.H4** (SUBSUMED by T.C1's grammar recut — explicitly "do NOT double-author") |
| 3 · delete `GestureLegend.vue` + gate | **↳ cross-ref T.E** (charter routes it to the prune band) |
| 4 · author `KF-TO-GLASSUI-BG.md` | **→ T.H2** (expanded to GU-1..4 + BG-1/3/4/5/6/7) |
| 5 · GATED: kill `KfPillTabs`+`useKfPillTabs` | **→ T.H5** (gated on BG-1+BG-3 — the SINGLE deletion owner; T.F16 renames, T.B6 consumes) — DOUBLE-OWNED RESOLVED (H3 C1) |
| 6 · GATED: delete `usePlayActuation`+MbabbMenu synthesis | **→ T.H6** (gated on GU-4+BG-4) — ⚠ **DOUBLE-OWNED**, self-flagged co-owned w/ T.C6 |

### Lane 21 — legacy-sweep (7 recs) — split T.B / T.H / T.S

| Rec | Disposition |
|---|---|
| 1 · consolidate 3 band-aids into ONE gap ledger + tripwire | **→ T.H1** |
| 2 · retire `KfPillTabs` onto glass-ui SegmentedTabs | **→ T.H5** (SINGLE deletion owner; T.F16 renames, T.B6 consumes) — DOUBLE-OWNED RESOLVED (H3 C1) |
| 3 · `TransportSource` interface replaces `useContractAnimGroup` | **↳ cross-ref T.B** (VERDICT #25, SceneFacility) |
| 4 · DRY the hot/cold readout throttle | **→ T.F23(c)** (OWNED — the `useThrottledReadout` extraction, per the 2026-07-05 GRAND COLOCATION EDICT; also folds w/ T.G3) |
| 5 · sweep `demo` `any` to a bounded ceiling | **→ T.F23(b)** (OWNED — the `any`-ceiling ratchet) |
| 6 · `proof:no-dead-export` + excise dead symbols | **→ T.F23(a)** (OWNED — `proof:no-dead-export`; + T.M8 hygiene-chain wiring) |
| 7 · de-defer/build the DM-22 named-selector resolution | **→ T.S4** |

### Lane 22 — state-stores (6 recs) — ALL → T.F

| Rec | Disposition |
|---|---|
| 1 · ONE global-store registry | **→ T.F11** |
| 2 · normalize `use*Store`/`use*Machine` naming | **→ T.F12** |
| 3 · `markRaw` as construction-time invariant | **→ T.F12** |
| 4 · fix amiga `SUPER_KEY` duplicate-literal | **→ T.F12** |
| 5 · `useSceneMachine` live-ref reset | **→ T.F11** |
| 6 · correct stale `selectedKeyframesControl` default | **→ T.F11** |

### Lane 23 — panel-architecture (6 recs) — ALL → T.B

| Rec | Disposition |
|---|---|
| T-PA-1 (SceneFacility unification seam) | **→ T.B1** (keystone) |
| T-PA-2 (delete `useContractAnimGroup`+square decoy) | **→ T.B1** (merged into keystone) |
| T-PA-3 (invert DFA table→derivation) | **→ T.B2** |
| T-PA-4 (restore square's panel honestly) | **→ T.B3** |
| T-PA-5 (elision as single model-cardinality rule) | **→ T.B5** |
| T-PA-6 (collapse adapter dual-family) | **→ T.B8** |

### Lane 24 — plan-vs-landed-AB (7 recs) — ALL → T.M

| Rec | Disposition |
|---|---|
| 1 · taste-inclusive wave-close contract | **→ T.M1** + **T.M2** (the two halves) |
| 2 · execute FROZEN→fold, re-shrink roster | **→ T.M8** |
| 3 · cold-load-visible harness contract | **↳ cross-ref T.A** (autoplay) / **T.E** (prune) |
| 4 · delete KfPillTabs; adopt glass-ui tabs | **↳ cross-ref T.B / T.C / T.H** |
| 5 · excise contract-group synthetic-`started` hack | **↳ cross-ref T.B** (SceneFacility, arming-audit cure) |
| 6 · treat S board untrusted; gate the T board | **→ T.M9** |
| 7 · ring-fence Band B's library carve as stable | **↳ cross-ref charter §4 non-goals** |

### Lane 25 — plan-vs-landed-CD (7 recs) — **RESOLVED 2026-07-05** (post-harden synthesizer ruling; dated addenda in the owning wave docs)

| Rec | Disposition |
|---|---|
| 1 · uniform module-skeleton + composition-depth gate | **→ T.F7** (cross-cited) |
| 2 · glass-ui-consumption gate on primitive replacement | **→ T.H1** (the gap-ledger/tripwire gains the replacement-imports-glass-ui-OR-ledgered-gap clause) + T.F23 census co-cite |
| 3 · scene disposition gate before fold-investment; prune compose | **→ T.E1** (gate clause: SceneId roster == the owner-ratified kept set; OD-1/OD-7 feed it) · mechanism T.M2 |
| 4 · demo-footprint budget; dissolve `app/chrome/` | **→ T.F3** (dissolve) + **T.F23** (footprint clause: every `app/` file resolves a named shell-role) |
| 5 · flatten `ControlsPaneWrapper` to a single glass-ui Card | **→ T.B4** (identical scope; lane 25 joins its citations) |
| 6 · gate the styles consolidation | **→ T.D styles waves** (lane 17's home) + **T.F21** shared-tier-purity clause |
| 7 · ring-fence Band C's legacy purge as stable | **→ charter §4 non-goals**, explicit T.M addendum row (same shape as lane24-rec7/lane26-rec8) |

### Lane 26 — plan-vs-landed-FGH (8 recs) — split T.E / T.G / T.M

| Rec | Disposition |
|---|---|
| 1 · owner-taste sign-off as design-gate precondition | **→ T.M2** |
| 2 · re-wire hero to per-char uplift + a11y | **↳ cross-ref T.D** (OD-4) |
| 3 · demo-scoped absolute perceived-perf oracle | **→ T.G6**; OWNER/blocking status enforced by **T.M6** |
| 4 · delete GestureLegend layer + gate | **→ T.E11** |
| 5 · restore square's full panel; honest Play | **↳ cross-ref T.B** (SceneFacility triad) / **T.A** |
| 6 · strip telemetry/readout/caption furniture | **SPLIT:** easing `EasingCurvePhysics` → **T.E7**; fleet gate-rewire → **T.E11**; cube/square/amiga DOM removal → **↳ T.A/T.B**; at-rest enforcement → **T.M4** |
| 7 · prune morph/motion-path/compose | **→ T.E1** (compose) **+ T.E2/T.E3** (morph/motion-path, OD-1) |
| 8 · ring-fence Band H + F primitives; board-live | **SPLIT:** board-live half → **T.M9**; ring-fence → **↳ charter §4 non-goals** |

### Lane 27 — ledger-sweep (4 recs) — split T.S / T.M

| Rec | Disposition |
|---|---|
| 1 · re-verify ledger from clean; fix tier-check bug | **→ T.S1** (F9 gate-wiring + F10 roster count → T.M8) |
| 2 · root-cause & close `drag-gesture` for real | **→ T.S2** |
| 3 · close cross-repo dispatch loop (KF-7 + self-dep) | **→ T.S3** |
| 4 · backfill S session log + amendment discipline | **SPLIT:** backfill CONTENT → **T.S5**; amendment discipline + `proof:board-live` freshness → **T.M9** |

### Lane 28 — prompt-recap (3 recs) — split T.S / T.M

| Rec | Disposition |
|---|---|
| 1 · born-at-entry, owner-token-bound recap ledger | **SPLIT:** ledger ARTIFACT → **T.S7**; gate teeth (`proof:prompt-recap-t`) → **T.M10** |
| 2 · owner-review as wave-closure precondition | **→ T.M2** (asserted again by T.M10 clause iii) |
| 3 · re-issuance census + recurring-correction class | **→ T.M10** (clauses iv + row class) |

### Lane 29 — gate-oracle-gap (7 recs) — ALL → T.M

| Rec | Disposition |
|---|---|
| 1 · T-GATE-OWNER (owner-verdict-recorded) | **→ T.M1** |
| 2 · T-GATE-GOLDEN (perceptual reference oracle) | **→ T.M3** |
| 3 · T-GATE-INVENTORY (on-stage element manifest) | **→ T.M4** |
| 4 · T-GATE-LEGIBLE (legibility + fullness) | **→ T.M5** |
| 5 · T-GATE-PERF (whole-roster blocking perf) | **↳ cross-ref T.G** (the gate); **T.M6** enforces OWNER/blocking status |
| 6 · T-GATE-RETIRE (feature-coupled retirement) | **→ T.M7** (execution list → T.E11) |
| 7 · T-GATE-META (taste-authority axis) | **→ T.M6** |

### Lane 30 — machine-adapters (5 recs) — split T.B / T.C

| Rec | Disposition |
|---|---|
| 1 · finish D12 sweep onto `useAnimationGroupPlayback` | **→ T.B8** |
| 2 · collapse `superKey` into `SceneId` | **→ T.B9** |
| 3 · single-source the elision predicate | **SPLIT:** MODEL → **T.B5**; RENDER → **T.C1** |
| 4 · cross-axis "label redundant with scene identity" | **SPLIT:** MODEL → **T.B5**; RENDER → **T.C1** |
| 5 · ordered transport-action model | **→ T.B10** |

### Lane 31 — font-census (10 recs) — ALL → T.D

| Rec | Disposition |
|---|---|
| T-TY-CENSUS1 (role-bound style-tuple gate) | **→ T.D1** (keystone) |
| T-TY1 (kill synthesized-bold at token root) | **→ T.D2** |
| T-TY2 (retire bold-italic sub-header) | **→ T.D3** (+ T.D11 for home deck) |
| T-TY3 (draw mono/display/body line) | **→ T.D4** |
| T-TY4 (collapse two "big label" tokens) | **→ T.D5** (mostly subsumed by KfPillTabs deletion → T.H) |
| T-TY5 (EasingSelect descriptor → LabeledSelect) | **→ T.D6** (tuple gate); adoption **↳ T.H** |
| T-TY6 (one shared watermark-title primitive) | **→ T.D6** (tuple gate); extraction **↳ T.F** |
| T-TY7 (delete `font-weight: 650` magic number) | **→ T.D2** |
| T-TY8 (dock "selected" bold declarative) | **↳ cross-ref T.C** (dock recut owns dock-label state rules) |
| T-TY9 (drop unused Instrument Serif italic axis) | **DEFERRED → T.D11** (conditional on OD-4) |

### Lane 32 — perf-instrumentation (5 recs) — ALL → T.G

*(Note: `T.md` §1 lists lane 32 under both T.G's and T.S's charter "Lanes" column,
but `T.S`'s own disposition table contains no Lane 32 section — a charter/wave-doc
inconsistency. No rec is actually MISSING: `T.G`'s table independently and fully
disposes all 5 with real wave-ids, so this is a documentation redundancy, not a
coverage gap.)*

| Rec | Disposition |
|---|---|
| T-PERF-A (fix LoAF gate's stale path) | **→ T.G8** |
| T-PERF-B (CDP-counter methodology) | **→ T.G7** |
| T-PERF-C (promote `lighthouse-mobile` off unexercised path) | **→ T.G9** |
| T-PERF-D (un-silence `lighthouse-gate` a11y regression) | **→ T.G10** |
| T-PERF-E (route probes through `portable-perf.mjs`) | **→ T.G6** |

---

## Method notes

- Rec counts per lane were independently verified by grep-counting numbered
  (`N.`) and `###`-headed items under each lane's `## T recommendations`
  section — total **206**, matching the manual read.
- A rec is **covered** if at least one wave doc's disposition table names a
  real wave-id (`T.<band><N>`) as an owner (not merely a cross-ref target).
- Charter-conflict / coordination notes explicitly written into the wave docs
  themselves (e.g. T.A's amiga cold-entry reconciliation, T.C's dock-elision
  model/render split, T.B's de-red dual-ownership note) were read and, where
  they resolve a rec into a clean non-overlapping split (MODEL vs RENDER,
  ARTIFACT vs GATE-TEETH, etc.), are recorded here as **SPLIT**, not
  DOUBLE-OWNED — both halves are traceable to exactly one wave each. Only
  cases where ≥2 waves claim the identical concrete action with no such
  partition (or with contradictory gating semantics) are flagged
  ⚠ DOUBLE-OWNED.
- Lane 15 rec 5 (`ppMode`/ppmycota) and lane 15's OD-3 resolution are cited by
  both `T.F` and `T.H`'s disposition tables, but both agree on the same
  non-wave destination (`OWNER-DECISIONS.md` OD-3) — this is dual citation of
  one decision row, not a double-owned code claim, and is not flagged.
