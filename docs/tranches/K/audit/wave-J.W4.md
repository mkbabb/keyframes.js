# J.W4 — Plan-vs-Delivery Audit (THE AXES BATTERY — both phases)

**Lane:** K/audit/wave-J.W4.md  
**Auditor:** Tranche K fleet  
**Date:** 2026-06-11  
**Scope:** plan-vs-delivery audit of J.W4's two phases against the spec
(`docs/tranches/J/waves/J.W4.md`), the impl record (`docs/tranches/J/waves/J.W4-impl.md`),
the gate code (`scripts/proof-live-session.mjs`, `scripts/proof-live-session-mobile.mjs`,
`scripts/proof-appearance-suffusion.mjs`), and the live source tree.

---

## §Delivery inventory — what the spec claimed, what landed

### Phase 1 — the INPUT-MODALITY band (gates on J.W0 + J.W3)

| Spec leg | Spec requirement | Delivered | Evidence |
|---|---|---|---|
| **S1 — Mobile leg** | `390×844 + hasTouch + isMobile` context; ALL gestures touch (`.tap()`/CDP touchEvent); battery: sheet open/scroll/close/re-open, dock switch, drag surface, play tap | YES — `scripts/proof-live-session-mobile.mjs` (1009 lines; `hasTouch: true, isMobile: true` at `:100-101`) — M1 sheet, M2 dock, M3 drag, M4 play | `proof-live-session-mobile.mjs:97-101` |
| **S7-geometry — CH-3 re-cert** | `sheet.bottom ≤ menubar.top` on 390×844 HARD gate; born-RED on a LIVE pre-cure defect | YES — gate BIT on the live pre-cure tree (menubar 32px over sheet); cure via `--menubar-measured-h` ResizeObserver + `max(token-floor, measured)` in `style.css`; RED→GREEN witnessed + planted-detent dist re-witness | impl §P1; `TransportDock.vue:WRO-publish`, `style.css:164-187` |
| **S2 — Reduced-motion leg** | `emulateMedia({reducedMotion:"reduce"})` before load; engine snaps (NOT rAF arc) for PRM-honoring consumers; sheet spring one-emit snap | YES — leg in `proof-live-session.mjs` `:1022-1135`; `controlChurn[4,4,4] → prmChurn[1,1,1]`; `sheetTrail["0","1"]` | impl §P3 born-RED: engine `withReducedMotion` always-rAF plant → churn 27/23/24 |
| **S4 — Keyboard/focus leg** | Tab reaches play `<button>` with `:focus-visible` ring; focused Enter actuates natively; global Space shortcut from anywhere | YES — leg at `:1138-1260`; `reachedAt=24`, `enterLive=58 distinct transforms`, `spaceToggled=true` | impl §P2 born-RED: `registerShortcut("Space",…)` re-keyed → `spaceToggled=false` |
| **S5 — Every-scene sweep** | ALL 8 routed scenes via auto-tracking `SCENES` export (not hardcoded); bidirectional `SWEEP_META` ⇄ `SCENES` guard; PLAY+INTERACT for playground-class scenes; covering dock-combobox walk | YES — `SWEEP_META` at `:196-221`; bidirectional guard at `:206-218`; `roster:8, visited:9, sceneFails:[]` | impl §P4; `proof-live-session.mjs:185-221` |
| **S6 — lighthouse-mobile enters a tier** | `declarePosture("observe-only", {reason})` via ONE shared ci-env.mjs helper; leaves the EXCLUDED set; enters `proof:hygiene` roster + ci.yml | YES — `proof:hygiene` roster in `package.json:160`; ci.yml `:531-532`; `gate-taxonomy.md:48` posture row | `package.json:159-160`; `gate-taxonomy.md` |
| **S7 — EP-3 PATH B** | All six exports (`flip`, `flipShared`, `drag`, `Draggable`, `DrawSVG`, `fromDrawSVG`) with PATH B row in `docs/published-surface.md`, cited test files exist on disk, machine-checked by `proof:published-surface` clause (g) | YES — `docs/published-surface.md:89-94`; clause (g) in `scripts/proof-published-surface.mjs` | impl §EP-3 register |

### Phase 2 — the APPEARANCE-CERTIFICATION band (gates on J.W7a + J.W3)

| Spec requirement | Delivered | Evidence |
|---|---|---|
| `proof:appearance-suffusion` authored + tiered (correctness + ci.yml) | YES — 580-line gate at `scripts/proof-appearance-suffusion.mjs`; in `proof:correctness` roster; ci.yml `:311-312` | `package.json:159` |
| Clause (a): `--ball-tone == icon hue per scene` | YES — computed background-color vs expected hex per scene; easing→violet, motion-path→cyan, etc. | `proof-appearance-suffusion.mjs:134-` |
| Clause (b): Instrument Serif display register at target titles; amiga headerless exception enforced | YES — `document.fonts.check` + `font-family` computed; amiga title ABSENT asserted | impl §PA-b: `system-ui` font plant → (b) reds only |
| Clause (c): 390×844 hero/subject overlap == 0 (H3/A-01 cure) | YES — separate `390×844 + hasTouch` context; hero h1 ∩ cube-subject rect area == 0 | impl §PA-c/A1: `translateY(360px)` plant → 21686px² overlap |
| Clause (d): easing projected curve PRESENT + MUTATING on real handle drag | YES — `d` attribute on `.easing-stage-curve-path`; real mouse drag mutates it in lockstep vs static stub | impl §PA-d: static literal plant → `stageMoved=false` |
| Clause (e): ghost rail ABSENT (sequence + motion-path empty-DFA) | YES — `.controls-layout--railless` present + `[rail]` 0px + no hollow side column | impl §PA-e/A3: DOM-class apply-site renamed → `railless=false` |
| Clause (f): amiga `.amiga-canvas` border-radius == `--radius-card` (≥16px) | YES — computed border-radius ≠ 0 | impl §PA-f: `border-radius:0!important` plant → `0px ≠ ≈16px` |
| Clause (g): substrate two-tier graph paper (4 gradient layers; major-opacity ≥ 10%) | YES — bgSize 4-tier + `--graph-major-opacity:12% ≥ 10%` | impl §PA-g: `08%` plant → floor miss |
| A1 (mobile): 390×844 hero/subject overlap == 0 | YES — `proof:live-session-mobile` `runAppearanceBand()` A1 | impl §§PENDING-W7a item 1+2 DISCHARGED |
| A2 (dark): `--ball-tone`/accent contrast ≥ 3.0 floor on `colorScheme:dark` context | YES — violet `#e64de6` contrast 5.98 ≥ 3.0; `html.dark` live | impl §PA-A2: `#22201e` hardcoded literal plant → contrast 1.18 |
| A3 (home sweep): ghost rail absent on home + sequence | YES — `.controls-layout--railless` + no hollow 400px column | impl §PA-A3/e shared plant |
| Born-RED plants PA-a through PA-g + PA-A1/A2/A3 | YES — 7 independent plants in impl §Phase-2 plant ledger; each reds exactly its named clause; byte-restore shasum-verified (5/5 files OK) | impl §Phase-2 plant ledger |
| Phase-2 source-scope deviation (ONE): `EditorStartScreen.vue` `:freeze="prefersReducedMotion"` | YES — W4 phase-1 `v-if` superseded by `freeze` prop; FourierField stays mounted as resting frame | `EditorStartScreen.vue:79-86`; impl §Phase-2 source-scope note |

---

## §Gate code verification — do the legs ACTUALLY touch what they claim?

### S1 mobile touch — does it use REAL touch gestures?

CONFIRMED. `proof-live-session-mobile.mjs:100-101` sets `hasTouch: true, isMobile: true` on
the browser context. The M1 sheet open/scroll uses `page.tap(".sheet-grab-handle")`
(`:342,405,420`) — genuine Playwright touch. M3 drag uses CDP
`Input.dispatchTouchEvent` (`:670-720` region) — a real touch-drag sequence. M4 play uses
`locator.tap({timeout:5000})` (`:747`) — asserts hit-testability. No `page.mouse.*` anywhere
in the mobile battery. Touch claim: VERIFIED.

### S2 PRM — does it ACTUALLY emulate the media query before load?

CONFIRMED. `proof-live-session.mjs:1067` issues `context.emulateMedia({ reducedMotion:
"reduce" })` BEFORE the page loads (the context is created, media emulated, THEN goto).
The PRM-control leg opens a SEPARATE non-PRM context first (`:1041-1060`) to prove dots DO
blink (churn 4,4,4) before asserting the PRM leg's churn 1,1,1 — the discriminating
anti-vacuous oracle. Claim: VERIFIED.

### S4 keyboard — does Tab actually reach the play button after U2 (collapsed dock)?

The S4 leg at `:1156-1158` queries `button[aria-label="Play animation"]` (the EXPANDED dock
button). The U2 collapsed dock shows the COLLAPSED button (`aria-label="Play animation
(collapsed dock)"`). The impl reports `reachedAt=24` and `pass:true`, meaning Tab DID reach
`"Play animation"` — implying the expanded layer's button was still Tab-reachable despite the
collapse. **Residual gap (R-S4):** the S4 leg runs AFTER `seedControlsOpen` +
`navToScene(page,"cube","Controls")` + `openControlsPanel`, which drives real dock
interactions — the dock may be hover-expanded at measurement time. A COLD Tab-walk from
`/#/` (no prior interaction) might find only the collapsed button (`"Play animation
(collapsed dock)"`), which would fail the `f === "Play animation"` check at `:1176`. The
gate GREEN on the `seedControlsOpen`-warmed tree; the COLD-entry Tab-walk is not asserted.
**Severity: P2** — the keyboard leg's Tab-ordering result is WARM-path-only; a regression
where the collapsed button becomes the ONLY Tab target would not be caught.

### S5 scene-sweep — does the bidirectional guard prevent silent omissions?

CONFIRMED. `SWEEP_META` at `:196-221` is manually maintained, but the bidirectional
`SWEEP_META ⇄ SCENES` guard at `:206-218` throws at MODULE LOAD on any unenrolled scene
(present in `scenes.ts` but absent from `SWEEP_META`) or any stale row (in `SWEEP_META`
but removed from `scenes.ts`). The anti-`:711`-brittleness proof: a `scenes.ts` addition
cannot be silently omitted. Claim: VERIFIED. The `roster:8, visited:9` oracle (wrap-to-home
included) confirms all scenes were swept in the impl run.

### Does the S5 sweep exercise PLAY+INTERACT for playground-class scenes?

CONFIRMED — with one known residual. `spring` uses the `.spring-rail` drag scrub
(`kind:"spring-rail"`, `:895-930`). `sequence` clicks the play reel
(`aria-label "Play the reel — a cascading wave replay"`, `:930-965`). `motion-path` uses a
handle drag that mutates both guide `d` and traveller `offset-path` (`:965-992`).
NOT icon-paint-only. **R2 residual (carried forward from impl §R2):** the spring-churn
oracle is broad across painters; a single-painter kill (rail painter alone) is masked by
sibling painters + the reactive target-marker. The leg still bites throwing/dead-scene
regressions. A per-painter liveness clause is a measure-first follow-up only.

### S6 — does lighthouse-mobile use the ONE shared ci-env helper (not a bare IN_CI re-impl)?

CONFIRMED. `scripts/proof-lighthouse-mobile.mjs` imports `observeOnlyInCI` from
`scripts/lib/ci-env.mjs` — the one posture authority. `scripts/lib/ci-env.mjs` is the
ONLY reader of `process.env.CI` across the 106 scripts (asserted by
`proof:ci-coverage`). The `KF_REQUIRE_LH=1` hard-assert fires BEFORE the posture routing,
so a calibrated runner is never softened by `IN_CI`. P6 claim: VERIFIED.

---

## §The COLD-ENTRY / HERO-CTA GAP — the confirmed unexercised axis

**Finding KW4-1 (P0): The "home rainbow play → smooth transition → cube auto-plays" path
is exercised by NO gate leg on the cold tree.**

### What the spec says this wave certifies

The spec (§S5, §S1 step 6, §goal) says the S5 sweep visits the `home` scene and the S1
mobile leg tests the play affordance. The impl record claims `proof:live-session` and
`proof:live-session-mobile` GREEN with the home scene swept and the play tap tested.

### What the gates ACTUALLY test

**B1 leg** (`proof-live-session.mjs:380-413`):
1. `seedControlsOpen(page)` — pre-seeds `localStorage["animation-groups-control-options-store"] = {isControlsPanelOpen: true}` (`proof-live-session.mjs:225-233`). This is NOT a cold entry.
2. `goto(${base}/#/, {waitUntil:"load"})` — navigates to home.
3. `clickRainbowPlay(page)` — fires `togglePlay` → `onPlayStateChange(true)` → `autoPlayNext=true` + `getRunSceneSwitch()("cube")`. The natural `useSceneTransition` + machine dispatch fire.
4. `waitForTimeout(1200)` — waits for the natural switch to proceed.
5. **Inside `page.evaluate()`:** `location.hash = "#/cube"` — a DIRECT hash assignment that BYPASSES the natural Vue-router transition. This races with or overrides the already-dispatched `switchScene("cube")` from step 3.
6. Samples `.cube/.graph/.idle-hover` transforms for 2500ms — `distinct >= 3` passes.

**The gap:** The gate does NOT wait for the natural `autoPlayNext → machine.dispatch(PLAY)` flow to complete WITHOUT the hash-override. The `location.hash = "#/cube"` in step 5 ensures the cube route is active regardless of whether `autoPlayNext` was correctly consumed. A regression where `autoPlayNext` is set but `PLAY` never fires (subjects freeze while playhead advances — the orchestrator's exact description of U-K2/U-K3) would still pass B1 because the hash nav ensures the route is correct and the cube group starts playing for some OTHER reason (a stored snapshot, or the scene's own `autoPlays=true` check).

**S5 sweep home entry** (`proof-live-session.mjs:999-1010`):
- Also uses `seedControlsOpen(page)` (`:747`).
- `playInteract(home)` returns EARLY at `:858`: `if (meta.kind === "home") return`.
- The home scene is entered (assertEntry checks `machine.activeScene === "home"`) and then the sweep immediately switches via `dockSwitchTo(cube)` — the DOCK COMBOBOX path, NOT the rainbow-play CTA path.
- The "click rainbow on home → cube auto-plays" flow is NEVER executed in the S5 sweep.

**M4 mobile play** (`proof-live-session-mobile.mjs:732-770`):
- Goes directly to `/#/cube` (`:737`), NOT from home.
- `navToScene(page,"cube","Controls")` — opens the controls panel on the already-active cube scene.
- Tests "can you tap the play button on the cube scene?" NOT "does clicking rainbow on the home hero screen transition to cube animating?"

**Conclusion:** Every gate enters home either via `seedControlsOpen` (warm path) or skips the play interaction entirely. The cold path where a first-time user (no localStorage) arrives at `/#/`, sees the "Select an animation..." hero, and clicks the rainbow play button in the (now collapsed, per U2) bottom dock — triggering `autoPlayNext = true + getRunSceneSwitch("cube")` and expecting the cube to animate via `machine.dispatch(PLAY)` after `markSceneReady()` — is UNEXERCISED at any tier.

### Why this matters (the orchestrator's U-K2/U-K3 reports)

`useSceneMachineApp.ts:155-165`: on `isHome + playing + isHomeEmptyGroup`, the handler sets
`autoPlayNext = true` and fires `getRunSceneSwitch()("cube")`. In `markSceneReady()` (`:100-132`):
`bindSceneAdapter()` + `machine.dispatch(SCENE_READY)` + if `autoPlayNext → machine.dispatch(PLAY)`.
On the home→cube NO-REMOUNT path (same Suspense key `"cube"` — `App.vue:310`), the transition
is driven by `watch(currentSceneId, …)` (`:143-147`) which calls `markSceneReady()` synchronously
when `id` changes to "cube" AND both `id` and `prev` are in the shared set `{home, cube}`.

A timing or state issue in this chain — for example, `autoPlayNext` being consumed before the
adapter registers, or the `sceneRef.value?.superKey === currentSuperKey.value` pre-condition
not being met mid-transition — would produce the "playhead advances while subject freezes"
symptom. The gate's hash-override in B1 sidesteps this chain entirely.

**J.W7c U4 side-effect concern (the orchestrator's named suspect):** Before U4, the animation
`<Select>` rendered for ALL scenes including single-animation ones. A cold first visit to a
scene could trigger `onSelectAnimation` (via a user click on the Select item), which calls
`animationGroup.play() + syncPlayState(true)` directly — a SECONDARY auto-play path that
bypasses the machine's `PLAY` event. U4 (`TransportDock.vue:39`) hides the Select for
`animationNames.length ≤ 1`. For CUBE specifically (3 animations), the Select is still
present, so `onSelectAnimation` still fires — the direct play path survives for cube.
**However:** the SELECT is NOT shown when `selectedAnimation` is already set (the EXPANDED
dock shows the Select unconditionally for multi-animation scenes — it always renders when
`animationNames.length > 1`, regardless of `selectedAnimation`). The U4 change's impact on
the auto-binding side-effect is NARROW: it only removes the Select UI for single-animation
scenes, but for cube the Select is still present and functional. The orchestrator's suspicion
about U4 killing an auto-binding side-effect is likely NOT the root cause for cube — but the
gate's warm-path bypass means this claim cannot be confirmed or refuted by any current gate.

**Seeding detail:** `seedControlsOpen` writes `{isControlsPanelOpen:true}` to the
`"animation-groups-control-options-store"` key (`proof-live-session.mjs:182-233`). This
pre-opens the controls panel globally, which also causes `bindSceneAdapter` (at
`useSceneMachineApp.ts:67-81`) to find an already-set panel-open state. A cold user has no
`isControlsPanelOpen` in localStorage — the panel is closed, the force-open at line 80 (`if
window.innerWidth >= 1024 && machine.controlSurfaces.value.length > 0`) fires, but only
AFTER `markSceneReady()` which may race the `autoPlayNext` chain.

---

## §Born-RED plant ledger — credibility assessment

### Phase 1 plants (P1–P4)

All four phase-1 plants are assessed credible:

| Plant | Credible? | Reasoning |
|---|---|---|
| **P1** (S1/S7 occlusion) — detent/band CSS plant | YES | `--dock-band-reserve` token stripped of its `max(…, measured)` arm → `sheet.bottom 762 > menubar.top 724`; this is the SAME defect class as the live pre-cure observation (762 > 730). The failure message is exact and specific. |
| **P2** (S4 keyboard) — global Space re-keyed to `KeyQQ` | YES | `registerShortcut("Space",…)` → `registerShortcut("KeyQQ",…)` in built dist; `spaceToggled=false` while `enterToggled=true` — the two actuation paths are asserted SEPARATELY, so the plant discriminates cleanly. |
| **P3** (S2 reduced-motion) — `withReducedMotion` always-rAF | YES | `function re(e,t,n){return n()}` — drops the PRM branch entirely; dots churn 27/23/24 multi-frame states under PRM (vs 1,1,1 on the cured tree). The `sheetTrail` emits a spring arc. |
| **P4** (S5 scene-sweep) — spring play-time throw | YES (with honesty note) | Two absorbed attempts recorded honestly (R2: oracle too broad for single-painter kills). Final plant (play-time `throw`) targets what the widened sweep uniquely exercises. The `[HARD|S5:every-scene-sweep]` attribution is the correct one. |

**One credibility note on P4:** The two absorbed plant attempts (`onScrub:e=>e` and
`registerSpringPainter` body emptied) both stayed GREEN. This is documented as R2 in the
impl record. The gate passes because its churn oracle is BROAD — a dead-solver kill is
masked if any sibling painter still churns. For the S5 spec's anti-icon-paint-only
requirement, the play-time-throw plant is the correct discriminator. R2 is a known
witness-strength limitation, not a gate fabrication.

### Phase 2 plants (PA-a through PA-g + PA-A1/A2/A3)

All phase-2 plants are assessed credible. Three specific checks:

- **PA-d (projected curve static stub):** the mutation (`d: "M0,100 L300,0"` literal in place
  of `d:u(t).svgPath.value`) targets the LIVE reactive binding, not just the computed result.
  `stageMoved=false, sidebarMoved=true` discriminates the live-projection requirement from the
  static-presence requirement. The "presence alone is not enough" principle is upheld.
- **PA-A2 (dark contrast):** the plant (`#22201e` hardcoded → opaque to `.dark` retheme) is
  the H5/H11 raw-literal class the spec named. Contrast 1.18 vs floor 3.0 is a real numeric
  failure, not a pixel diff.
- **Absorbed A3 plant:** the CSS-rule rename (`.controls-layout--railless{…}` → `--XXXXXXXX`)
  stayed GREEN because A3 checks a DOM-class query (the class is still SET by the template).
  Re-pinned to the DOM-class APPLICATION site in `index-D8HUhZks.js` — the correct locus per
  the spec's "target where the class is BORN, not where it is styled." The absorption is
  documented honestly and the re-pin is principled.

**WIRE credibility note:** The born-RED witnesses use `/tmp/kf-w4-witness/baseline.sha256`
and per-file backup paths, which are ephemeral (gone after the session). This is EXPECTED —
the witness session is a one-time impl-time proof. The credibility rests on:
(a) the described mutations are semantically correct (length-preserving, correct locus,
correct minified symbol);
(b) the failure messages are the exact defect signatures the mutations would produce;
(c) the byte-restore mechanism (file backup + `shasum -a 256 -c`) is mechanically sound.
The `/tmp` paths cannot be re-verified, but the impl record's verbatim RED/GREEN output is
consistent and specific. Assessed: CREDIBLE.

---

## §Uncovered axes — beyond the cold-entry gap

### KW4-2 (P1): The cold-entry Tab-walk reaches only the COLLAPSED dock play button

With U2 (`:always-expanded=false`), a freshly-loaded page shows the collapsed dock. The
collapsed button has `aria-label="Play animation (collapsed dock)"`. The S4 keyboard leg's
focus-walk check (`f === "Play animation"` at `proof-live-session.mjs:1176`) would MISS this
button and report `playReachable=false`. The leg ran GREEN (`reachedAt=24`) because it was
executed on a context warmed by `seedControlsOpen` + `openControlsPanel` interactions that
likely left the dock hover-expanded. A cold Tab-walk from `/#/` would exercise the collapsed
button path and might fail the Tab-reachability assertion. `proof-live-session.mjs:1157` also
queries `button[aria-label="Play animation"]` (the EXPANDED button) for the rest-paint check
— this query would return `null` on a cold collapsed dock, and the focus-ring assertion would
be vacuously skipped (`focusRing = null`, `:1188`). The gate is warm-path-only for S4.

### KW4-3 (P2): S5 sweep uses `seedControlsOpen` — the open-panel COLD-ENTRY is never swept

Every S5 sweep context calls `seedControlsOpen(page)` (`:747`). A cold user (no localStorage)
arriving at any scene sees the controls panel CLOSED until the force-open fires in
`bindSceneAdapter()` (`useSceneMachineApp.ts:79-81`). The S5 sweep never exercises the
panel-open transition from cold. If the force-open logic regresses (e.g., the
`machine.controlSurfaces.value.length > 0` check is wrong for a scene), the sweep would not
catch it — `seedControlsOpen` pre-seeds `isControlsPanelOpen:true` regardless.

### KW4-4 (P2): S5 home-entry playInteract is a no-op — the home START SCREEN is never actioned

`playInteract(home)` at `proof-live-session.mjs:858` returns EARLY with no play. The home
scene's ONLY interactive affordance — the rainbow play button that triggers the CTA navigation
to cube — is not exercised in the S5 sweep. The sweep verifies home ENTERS (machine state,
trigger-ABSENT, subject visible) but does NOT verify the hero CTA works. This is the same gap
as KW4-1 from a different angle: the spec says "8 routed scenes … each non-home scene plays"
(§S5 step 2/3), but the HOME-specific CTA is explicitly excluded from the play+interact
pass. The spec's wording is technically honored (home is "swept" — entered), but the UNIQUE
interaction the home scene exists for (the rainbow CTA → cube navigate → cube plays) is not
tested.

### KW4-5 (P2): R2 — S5 spring churn oracle absorbed two single-painter kills

Documented in impl §R2 and carried as a residual. Two distinct spring plants stayed GREEN
because the churn sampler is broad across painters (the rail painter + sidebar painter +
reactive target-marker all contribute). A frozen solver with a live marker is invisible to
the current oracle. The spec records this as a measure-first follow-up; the P4 final plant
(play-time throw) is the correct discriminator for the anti-icon-paint-only requirement. This
is a known oracle-broadness limitation, not a fabricated green.

### KW4-6 (P2): EP-3 PATH B — no live-scene coverage for `drag`/`Draggable` despite the DRAG scene (U-K19)

The EP-3 disposition is PATH B for all six exports. The orchestrator's U-K19 ("a demo where
dragging resizes the container instead of dragging") is a K-tranche request that would give
`Draggable` a live demo scene. If U-K19 lands, the `drag`/`Draggable` PATH B row must flip
to PATH A and join the S5 sweep — the `proof:published-surface` clause (g) enforces the row
exists but does NOT enforce PATH A over PATH B. The machine check is present; the PATH
upgrade is a human decision at K.

### KW4-7 (P1): glass-ui gap from ~3.11.2 to 3.13.0 opens RF-16/RF-17 coverage holes

J pins `"@mkbabb/glass-ui": "~3.11.2"` (`package.json:182`). The orchestrator states latest
is 3.13.0 (U-K14). RF-16 (PRM ResizeObserver → render TDZ crash — a glass-ui bug kf-side
mitigated by `:freeze="prefersReducedMotion"`) and RF-17 (GlassDock collapse-crossfade click
strand — mitigated by the pointerdown actuation cure in `TransportDock.vue:277-318`) are
OPEN glass-ui handoffs (`glassui-AX-handoff.md`). If 3.13.0 contains fixes for either, the
kf-side mitigations become belt-and-suspenders redundancy; if it contains regressions, the
appearance-certification and live-session gates would catch them — but only if the pin is
bumped. The U-K14 gap is a K-tranche consume item.

---

## §Fold summary (the §FOLD table)

| # | Finding | Severity | Seam | Suggested wave-class |
|---|---|---|---|---|
| **KW4-1** | Cold hero CTA (home `/#/` → rainbow play → cube auto-plays) is NEVER exercised; B1 bypasses the natural `autoPlayNext` chain via a direct `location.hash` override; M4 starts on `/#/cube` directly; S5 home `playInteract` is a no-op — the U-K2/U-K3 live defect cannot be caught by any current gate | **P0** | `proof-live-session.mjs:386-412` (`seedControlsOpen` + `location.hash="#/cube"`); `proof-live-session-mobile.mjs:737`; `scripts/proof-live-session.mjs:858` | K.W0 (gate + cold-entry leg — the B1 leg must be re-authored without seedControlsOpen and without the hash override, waiting on the natural `autoPlayNext` → `machine.dispatch(PLAY)` chain; add a new `home-CTA` assertion class) |
| **KW4-2** | S4 keyboard Tab-walk is warm-path-only: the collapsed dock's play button (`aria-label="Play animation (collapsed dock)"`) is NOT matched by the `f === "Play animation"` check; the ring query also returns null on a cold collapsed dock | **P1** | `proof-live-session.mjs:1157,1176`; `TransportDock.vue:162-180` | K.W0 (fix the Tab-walk to accept the collapsed button's aria-label; or assert the COLD Tab-walk separately) |
| **KW4-3** | S5 sweep seeds `isControlsPanelOpen:true` universally — the cold-entry panel-open transition (force-open via `machine.controlSurfaces.value.length > 0` in `useSceneMachineApp.ts:79-81`) is never verified | **P2** | `proof-live-session.mjs:747` (`seedControlsOpen`) | K.W1 or K hygiene pass |
| **KW4-4** | Home start-screen is "swept" (entered) but its ONLY interactive affordance (the hero CTA rainbow play) is explicitly skipped in `playInteract`; the spec claims home is swept, and it is, but the play axis is not exercised | **P1** | `proof-live-session.mjs:858` | K.W0 (same fix as KW4-1 — the new `home-CTA` leg closes this) |
| **KW4-5** | S5 spring churn oracle absorbed two single-painter kills (R2); a frozen-solver-with-live-marker regression is invisible | **P2** | `proof-live-session.mjs:895-930`; `demo/spring/SpringScene.vue` rail painter seam | K measure-first (add per-painter liveness only if a real frozen-solver-with-live-marker regression surfaces) |
| **KW4-6** | EP-3 PATH B for `drag`/`Draggable` — a K-tranche `Draggable` demo (U-K19) would flip these to PATH A; the machine check enforces the row exists but not PATH A | **P2** | `docs/published-surface.md:91-92`; `scripts/proof-published-surface.mjs` clause (g) | K.W1 (if U-K19 demo lands, flip the row to PATH A and add to S5 sweep) |
| **KW4-7** | glass-ui pinned ~3.11.2 vs current 3.13.0; RF-16/RF-17 kf-side mitigations are in place but the upstream fixes (if any) are unverified at the kf pin | **P2** | `package.json:182`; `glassui-AX-handoff.md`; `EditorStartScreen.vue:79-86`; `TransportDock.vue:289-340` | K.W0 (consume 3.13.0 per U-K14; verify RF-16/RF-17 glass-ui status at the new pin) |

---

## §10-line summary

J.W4 delivered all five spec legs (S1–S5) plus S6/S7 hygiene, and both phases landed on
schedule: the input-modality band (S1 mobile touch, S2 PRM snap, S4 keyboard, S5 scene-sweep)
on the W0+W3 harness, and the appearance-certification band (A1/A2/A3 mobile, clauses (a)–(g)
in `proof:appearance-suffusion`) on the suffused W7a tree. The born-RED plant ledger is
credible across all nine phase-1 and phase-2 plants; the one absorbed-attempts disclosure (R2)
is honest and the final plant is correct. CH-3 is re-certified on its own mobile axis;
EP-3's six exports are PATH B in `docs/published-surface.md` with machine-checked citations.
**The confirmed gap is KW4-1/KW4-4 (P0/P1):** the cold hero CTA — a first-time user on
`/#/` clicking the rainbow play and expecting the cube to animate — is NOT exercised by any
gate leg; B1 bypasses the natural `autoPlayNext→machine.dispatch(PLAY)` chain with a direct
`location.hash` override, and M4 enters cube directly. This is the axis of the orchestrator's
U-K2/U-K3 live defect; the K.W0 gate work must add a true cold-entry hero-CTA leg without
seedControlsOpen and without a hash override. A secondary gap (KW4-2, P1) is that the S4
keyboard Tab-walk is warm-path-only and would not catch a collapsed-dock Tab-reachability
regression.
