# J.W4 — THE AXES BATTERY (the boundary-ORACLE extension, viewport·input·preference·breadth · legs PARTITIONED by upstream dep — input-modality band on J.W0+J.W3 parallel to W2→W7a, appearance-certification band on J.W7a+J.W3 · the desktop-1440-only blindspot closed · CH-3 re-certified on a mobile oracle · EP-3 dispositioned)

- **Phase:** DEV — spec authored, awaits IMPL+auth · **Class:** SHIP-in-J (the AXES boundary
  of the boundary-ORACLE extension — `J.md §invariants` row "the boundary-ORACLE extension":
  *"the AXES oracle is the live-session battery exercising the viewports/input-modalities/
  preferences humans actually use. A boundary … certified at one viewport is NOT certified."*)
  · **Scope (gates + CI; NO source):** the `proof:live-session` battery — desktop-1440-mouse-
  only today (`final-vs-tree-inv-epsilon.md` INVE-2/FVT-2: `VW = 1440` at `:420`; `reducedMotion|
  emulateMedia|colorScheme|hasTouch|isMobile` grep = **0**; SWITCH-into of `sequence`/`motion-
  path`/`spring` icon-paint-only) — gains FIVE legs: **S1** the MOBILE leg (390×844 + `hasTouch`,
  real touch taps/drags), **S2** the REDUCED-MOTION leg (`emulateMedia` → the engine's live
  `respectReducedMotion` snap path), **S3** the DARK leg (`colorScheme: dark` → the `.dark` token
  surface), **S4** the KEYBOARD/FOCUS leg (Tab order, `focus-visible`, Enter/Space PLAY), **S5**
  the SCENE-SWEEP widened to EVERY routed scene (home·cube·amiga·square·easing·spring·sequence·
  motion-path — 8, `demo/app/scenes.ts:83,94-152`). **S6** `proof:lighthouse-mobile` (a tier
  ORPHAN today — INVE-2) enters a tier under its declared P6 posture. **S7** the CH-3 mobile
  chronic RE-CERTIFIED on a MOBILE oracle (`sheet.bottom ≤ menubar.top` measured ON 390×844),
  and EP-3 (flip/drag/draw-svg zero live coverage — `engine-periphery.md` EP-3) dispositioned
  into the published-surface manifest (J.W5) via a demo home OR a recorded BOOK. · **DAG-deps
  (the legs are PARTITIONED by their ACTUAL upstream dependency, NOT serialized whole — `J.md
  §WAVE MAP` lines 259-266):** the battery splits into TWO dependency bands. **The
  APPEARANCE-INDEPENDENT input-modality band** (S1's touch taps/drags + the device-INDEPENDENT
  CH-3 occlusion geometry, S2 reduced-motion, S4 keyboard/focus, S5 scene-sweep) gates ONLY on
  **J.W0** + **J.W3** and LANDS AS SOON AS THE HARNESS DOES — it RUNS PARALLEL to the W2→W7a
  chain, biting the instant W0+W3 land, decoupled from any appearance suffusion. **The
  APPEARANCE-CERTIFICATION band** (S1's mobile hero/subject overlap == 0 + dark `--ball-tone`
  contrast + ghost-rail-absent assertions, S3's dark-contrast leg, the post-suffusion overlap
  clauses) gates on **J.W7a** + **J.W3** — it asserts POST-SUFFUSION appearance facts and
  greens ONLY on the tree where J.W7a (the appearance-grammar half that re-captures the
  visual-lock baseline IN its close motion) has landed. Both bands run AFTER **J.W3** (the
  industrialized harness) so every leg reuses `withPage()`/`withBrowser()` + the single
  `serveDist`/chromium authority; both build on **J.W0**'s `navToScene(page, sceneId, expected)`
  per-expected-state primitive and **J.W3**'s shared lifecycle. The longest serial path is
  W0 → W2 → W7a → W4(appearance band), with the input-modality band running PARALLEL to it.
  The MOBILE-INPUT/REDUCED-MOTION/KEYBOARD legs and the SCENE-SWEEP are NEW correctness clauses
  of the `proof:live-session` battery; each is born-RED-able against a NAMED planted defect.

## §Provenance (the folded findings + the precept root)

- **`final-vs-tree-inv-epsilon.md` INVE-2 / P0-2** — THE axis table, with per-axis grep evidence
  (the load-bearing input). `scripts/proof-live-session.mjs` is *"hardcoded to a SINGLE desktop
  register and exercises ZERO of the following axes … each an un-exercised axis — the I-doctrine's
  'where the next lie lives.'"* Verbatim per-axis evidence (the audit's own table, re-confirmed
  first-hand against the tree):

  | Axis | Evidence it is NOT exercised (INVE-2) | Why it matters |
  |---|---|---|
  | **Mobile viewport** | `const VW = 1440` (`:420`); every `newContext` is `{ width: VW, height: 900 }` (`:438,473,542,642,648,656,722,785,871`). No 390/430-wide pass. | The demo has a whole mobile overlay (`StageMode`, the mobile sheet, `proof:mobile-single-page`) the headline never opens. CH-3 (mobile) "closed" via `perf-frame-budget`+`drag-gesture` — but those run at 1440 too. |
  | **Touch** | grep `isMobile\|hasTouch` in live-session = **0**. All gestures are `page.mouse`/trusted pointer (re-confirmed: `scripts/proof-live-session.mjs` uses `page.mouse.move/down/up` at `:314,559-578,670-673`; zero `tap`/`touchscreen`). | The dock + drag + bezier are pointer-only in the gate. A touch-only regression (`touch-action`, pointer-cancel) is invisible. |
  | **Reduced motion** | grep `reducedMotion\|emulateMedia` = **0**. | The engine has a whole `respectReducedMotion` SNAP path (`group.ts:584` → `_playReducedMotion()` "snaps every child to its final frame in a single composite — no rAF draw loop"; `smooth.ts:85,170`; `spring.ts`). The headline never sets `prefers-reduced-motion: reduce`, so that product surface is ungated at the live tier. |
  | **Dark mode** | grep `colorScheme\|\.dark\|prefers-color` in live-session = **0**. Dark is tested only by HYGIENE-tier `proof:darkmode-row-toggle`. | A dark-only visual/contrast break (the demo ships `.dark` theme vars) never reaches the human-oracle tier. |
  | **Keyboard / focus** | the only `keyboard.press` calls are `ArrowDown`/`Enter` as a *fallback* for the dock Select commit (`:352-353`); zero `:focus`/Tab-traversal/`focus-visible` assertions in ANY correctness gate (`grep ':focus\|tabindex'` = 0). | a11y/keyboard operability is entirely outside the correctness tier. |
  | **Scene SWITCH breadth** | `dockSwitch` switches to ONE "first non-Home, non-active option" (`:333-340`). The icon-paint leg sweeps a HARDCODED `SCENES = ["cube","easing","spring","sequence","motion-path"]` (`:711`) — `amiga`/`square` are covered by dedicated B3/B6 legs, but the SWITCH-into / PLAY-in of `sequence`/`motion-path`/`spring` is icon-paint-only (glyph paints), not a play+interact session. No full sweep. | INVE-2: *"live-session GREEN means a desktop human at 1440px with a mouse, no reduced-motion, light theme, switching to one scene, sees it work"* — an OVERCLAIM against §9's strong form. |

  INVE-2 disposition: **FOLD** — *"J should add a mobile/touch leg and a reduced-motion + dark-mode
  pass … and a focus/keyboard a11y correctness gate. This is the natural J runtime-coverage wave."*
  This is that wave.
- **`final-vs-tree-inv-epsilon.md` INVE-3 (the hash-nav entry-surface note)** — the audit's note that
  the SWITCH breadth is exercised through hash-nav and the dock combobox, NOT a uniform per-expected-
  state entry; the SCENE-SWEEP leg of THIS wave must enter EVERY routed scene through the SAME
  `navToScene` per-expected-destination-state primitive J.W0 lands (the dock-combobox path for the
  real switch, the hash for the deterministic entry), so a scene that mounts blank or lags its
  control surface REDS the sweep at entry, not only at icon-paint. (`final-vs-tree-inv-epsilon.md`
  P0-2 table row "Scene SWITCH breadth"; `J.md` J.W0 — the `navToScene` wait predicate is the
  PER-EXPECTED destination state.)
- **`final-vs-tree-inv-epsilon.md` FVT-6 / P1-4** — CH-3/CH-4 closure rests on `proof:perf-frame-
  budget`, which `I-WZ-verify.md:333-335` (post-FINAL) DEMOTED to CI-observe-only. *"The chronic is
  closed by a gate that hard-gates only on the dev machine."* The P6 posture for the felt-perf legs
  must therefore be EXPLICIT and the CH-3 OCCLUSION half (the device-INDEPENDENT geometry) must
  hard-gate on the mobile viewport, not ride the felt-timing gate that is observe-only in CI.
- **`engine-periphery.md` EP-3** — `flip.ts` (`flip`/`flipShared`), `drag.ts` (`drag`/`Draggable`),
  `draw-svg.ts` (`DrawSVG`/`fromDrawSVG`) are *"load-bearing, tested … with no current demo scene that
  exercises them at runtime … these three modules have zero `proof:live-session` runtime coverage. The
  gate-oracle precept … requires product-property proofs through the human's surface."* `proof:drawsvg`
  exists but is JSDOM-only (HYGIENE, not a live browser exercise). Disposition: **FOLD** (EP-3, P1).
- **`ci-cd.md` §4-§5 (P6 — the CI device-independence boundary)** — the THREE legitimate device-
  dependence postures (1) **observe-only** (perf-frame-budget, scene-transition-perf, visual-lock —
  record, never red); (2) **runner-calibrated** (LoAF bench — absolute threshold, stress sized to the
  runner); (3) **hard** (device-INDEPENDENT). `lighthouse-mobile` is the canonical device-DEPENDENT
  perf gate (`proof-lighthouse-mobile.mjs:1-40` self-declares: *"Lighthouse's CPU/network throttle
  assumes a CI-grade or real-device host … in a shared/contended sandbox the absolute scores are
  SYSTEMATICALLY inflated … the gate is calibrated to RUN-ENVIRONMENT FITNESS"* — `KF_REQUIRE_LH=1`
  hard on a calibrated runner, RECORDS-WITHHELD otherwise). Its tier MUST be its P6 posture, declared
  through the ONE shared `IN_CI`/`observeOnlyInCI` helper J.W3 single-sources, not a bare `IN_CI`
  re-implementation.
- **`design/pane-amiga.md` A-01 + `design/pane-home.md` H3/H6 (the mobile occlusion evidence)** —
  the mobile leg's assertions feed off the design corpus' measured occlusion. **A-01 (P1):**
  `amiga-mobile-open.png` — *"only the top hemisphere is visible above the sheet … the subject loses
  protagonist status at the exact moment the user is interacting with its controls"* (the sheet rises
  to `--sheet-detent-expanded` and the sphere sits at the sheet boundary). **H3 (P1):** `home-mobile.png`
  — *"the hero text 'Select an animation' is overprinted by the cube face at 375px width, the 'animation'
  word is physically behind the yellow/red cube."* **H6 (P2):** `home-mobile.png` — TypingDots read as
  glitch artifacts on overlapping absolute layers. These are the *appearance* defects the mobile leg's
  post-suffusion overlap assertions (J.W7a's `TYP-1/H3` "mobile hero/subject overlap == 0px") certify
  ON the 390×844 viewport — these APPEARANCE-CERTIFICATION clauses gate on J.W7a + J.W3 and green only
  on the post-W7a tree, precisely so these collisions are already cured and the leg certifies the cure,
  not the defect. (The CH-3 occlusion-GEOMETRY oracle is a SEPARATE, device-INDEPENDENT clause in the
  input-modality band — it gates on J.W0 + J.W3 and bites the instant the harness lands; see §S1.)
- **The precept root (`J.md §invariants` boundary-ORACLE extension + the AXES cluster in §finding-
  cluster→wave ledger, "The axes" row → J.W4):** *"FVT-2/INVE-2 live-session desktop-1440-only
  (mobile/touch/reduced-motion/dark/keyboard all zero-hit; the SCENES sweep omits playground-class
  scenes); lighthouse-mobile an orphan in neither tier; CH-3 mobile chronic certified by desktop
  oracles; EP-3 flip/drag/draw-svg exported with no demo scene and zero live-session coverage;
  FVT-6 CH-3/CH-4 closure rests on a gate WZ demoted to CI-observe-only (P6 posture must be explicit)."*

## §The state, verified (file:line / command anchors)

- **`scripts/proof-live-session.mjs`** — the desktop-only battery. `:420` `const VW = 1440`. Touch
  absent (`page.mouse.*` at `:314,559-578,670-673`; no `tap`/`touchscreen`). `:711` `const SCENES =
  ["cube","easing","spring","sequence","motion-path"]` (icon-paint sweep — note: `amiga`/`square` are
  dedicated B3/B6 legs; `home` is NEVER swept). `:212` `REQUIRE_BROWSER`; `:213` `USE_DEV_SERVER`
  (the B2 leg's `KF_DEV_SERVER=1` named exception). The B2 synthetic-visibility leg (`:377-399`) is the
  one persistent-context leg today.
- **The routed-scene set** (`demo/app/scenes.ts`): `HOME_SCENE_ID = "home"` (`:83`, no component —
  the start screen); `id: "cube"` (`:94`), `"amiga"` (`:101`), `"square"` (`:108`), `"easing"`
  (`:115`), `"spring"` (`:122`), `"sequence"` (`:133`), `"motion-path"` (`:147`). `allScenes =
  [homeScene, ...scenes]` (`:165`) — **8 routed scenes**; the live-session SCENE-SWEEP omits `home`
  entirely and play-in-tests only 5 of 7 non-home scenes.
- **The engine reduced-motion path is LIVE and demo-wired.** `group.ts:584` `withReducedMotion(this.
  respectReducedMotion, () => this._playReducedMotion(), () => …rAF loop…)` — under PRM the group SNAPS
  to the final frame with NO rAF draw loop. `smooth.ts:85,170`; `spring.ts:46`. Demo consumers set
  `respectReducedMotion: true`: `AnimationVisualizer.vue:146`, `useSceneSwap.ts:45`, `useSheetSpring.ts:43`,
  `TypingDots.vue:89`, `animationOptionsStore.ts:40`. So a live `emulateMedia({ reducedMotion: "reduce" })`
  pass DOES reach a product behavior change (snap-not-rAF) — there is a real property to assert.
- **`occlusion-gate.mjs`** — the existing occlusion authority runs `{375,1280,1440}` (`:57-59`) over a
  **desktop browser context** (no `hasTouch`); its sheet/menubar geometry collects `.glass-dock,
  [class*=menubar], [class*=top-dock]` (`:121`) and the subject rect. It is the geometry primitive the
  CH-3 mobile oracle reuses — but the CH-3 RE-CERTIFICATION must run on a REAL `390×844 + hasTouch`
  context (a touch device, sheet spring-driven, not the desktop occlusion sweep), measuring
  `sheet.bottom ≤ menubar.top` after a real touch sheet-open. (`occlusion-gate.mjs:57-59,121`;
  `final-vs-tree-inv-epsilon.md` INVE-2 mobile row.)
- **`proof:lighthouse-mobile`** — exists as a package script (`package.json:51`) but is in NEITHER tier:
  `proof:ci-coverage` explicitly EXCLUDES it (`ci-cd.md §6`: the 7-gate exclusion set names
  `proof:lighthouse-mobile`), so it is an ORPHAN — not in `proof:correctness`, not in `proof:hygiene`,
  not run by `demo-smoke`. (`package.json:51`; `ci-cd.md §6`; `final-vs-tree-inv-epsilon.md` INVE-2.)
- **`demo-driver.mjs` has NO `navToScene` today** — it exports `serveDist` (`:293`), `resolveChromium`
  (`:261`), `openControlsPanel` (`:335`), `subjectRect` (`:419`), the auto-tracking `SCENES` (`:244`);
  J.W0 lands `navToScene(page, sceneId, expected)` and J.W3 lands `withPage()`/`withBrowser()`. THIS
  wave consumes both — it authors NO new harness primitive, only new LEGS over them.
- **CH-3 / CH-4 chronic posture** (`deferred-ledger.md:68-69,171`): CH-3 (mobile, D→I, 3 rides) folded
  into `proof:perf-frame-budget`+`proof:drag-gesture`, status **VERIFY-ONLY**; CH-4 (dock) likewise.
  But FVT-6 establishes `perf-frame-budget` is CI-observe-only on Linux — so the CH-3 closure's
  device-INDEPENDENT half (the mobile occlusion geometry) is currently certified by NO hard CI gate
  at the mobile viewport. THIS wave gives CH-3 a hard mobile occlusion oracle (S7).

## §Goal

Bind the AXES boundary to the boundary-ORACLE precept: the live-session battery — the human-oracle tier
— must exercise the VIEWPORTS, INPUT MODALITIES, MOTION/COLOR PREFERENCES, and SCENE BREADTH that humans
actually use, so "live-session GREEN" stops meaning *"a desktop human at 1440px with a mouse, light theme,
no reduced motion, switching to one scene, sees it work"* (INVE-2's exact narrowing) and comes to mean
*"a human anywhere — on a phone with touch, with motion reduced, in the dark, with a keyboard, on EVERY
routed scene — sees the same true product."* The cure is not a new lattice of per-axis proxy gates; it is
FIVE new actuating LEGS of the SAME battery (S1 mobile/touch, S2 reduced-motion, S3 dark, S4 keyboard/
focus, S5 every-scene sweep), each accumulating into the SAME zero error budget (the `proof:live-session`
structured allowlist, inherited by reference — NEVER re-stated per leg), each born-RED-able against a
NAMED planted defect, all running on J.W3's industrialized harness over J.W0's `navToScene` primitive.
The legs are PARTITIONED by their upstream dependency (J.md §WAVE MAP): the input-modality legs
(S1-touch, S2, S4, S5) gate on J.W0 + J.W3 and land as soon as the harness does, PARALLEL to the W2→W7a
chain; only the APPEARANCE-CERTIFICATION clauses (S1's mobile hero/subject overlap == 0, S3 dark
`--ball-tone` contrast, the ghost-rail-absent assertion) gate on J.W7a + J.W3 and certify the POST-W7a
appearance. CH-3's mobile chronic is RE-CERTIFIED on a mobile oracle that finally
matches its axis (S7); `proof:lighthouse-mobile` enters a tier under its honest P6 posture (S6); EP-3's
three uncovered exports get a demo home or a recorded BOOK wired into the published-surface manifest (S7).
This is the AXES half of the same single move J applies everywhere — the gate-ORACLE precept pointed at the
boundary humans cross with their hands, their eyes, their keyboards, and their phones.

## §Scope

**The two dependency bands (J.md §WAVE MAP lines 259-266 — the legs are PARTITIONED by ACTUAL upstream, NOT serialized whole):**

| Band | Legs / clauses | Gates on | Schedule |
|---|---|---|---|
| **INPUT-MODALITY** (appearance-INDEPENDENT) | S1 touch taps/drags (sheet open/scroll/close/re-open, dock switch, touch-drag persist, play-tap); the device-INDEPENDENT CH-3 **occlusion geometry** (`sheet.bottom ≤ menubar.top`); S2 reduced-motion snap; S4 keyboard/focus; S5 every-scene sweep | **J.W0 + J.W3** | LANDS AS SOON AS THE HARNESS DOES — runs PARALLEL to the W2→W7a chain, bites the instant W0+W3 land |
| **APPEARANCE-CERTIFICATION** | S1's mobile hero/subject **overlap == 0** (the H3/A-01 cure); S3's dark `--ball-tone`/accent **contrast**; the **ghost-rail-absent** assertion in S5's `home` sweep | **J.W7a + J.W3** | greens ONLY on the post-W7a tree (J.W7a re-captures the visual-lock baseline IN its close motion) |

The longest serial path is **W0 → W2 → W7a → W4(appearance band)**; the input-modality band is decoupled from it. No leg is serialized behind J.W7a except the appearance-certification clauses that assert post-suffusion facts.

### S1 — THE MOBILE LEG (390×844 + `hasTouch: true` + real touch taps/drags) [CORRECTNESS · STRADDLES BOTH BANDS]

**Locus:** a NEW leg of `proof:live-session` (or a sibling `proof:live-session-mobile` battery on the
J.W3 harness — the IMPL chooses the file shape; the CONTENT is fixed here). A `browser.newContext({
viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })` — a REAL touch context, not a
narrowed desktop viewport. Every gesture in this leg is a TOUCH gesture: `page.touchscreen.tap(x,y)` /
`page.locator(sel).tap()` and touch-drag (`page.touchscreen` down/move/up or a `dispatchEvent` of
`touchstart`/`touchmove`/`touchend`), NEVER `page.mouse`. The leg accumulates the SAME zero error budget
(the `proof:live-session` structured allowlist, inherited by reference).

**The mobile battery — enumerated (the exact sequence, per `J.md` J.W4 "the sheet, the dock, a scene
switch, a drag surface, the play affordance"):**

1. **Sheet OPEN.** `navToScene(page, "amiga", expected)` (J.W0's per-expected-state entry); TOUCH-tap
   the sheet grab pill → assert the controls sheet rises to its expanded detent (the `--sheet-detent-
   expanded` spring settle — observe `--sheet-t` reaches its expanded value, driven off J.W2's
   `useSheetSpring` settled signal, NOT a fixed wait).
2. **Sheet SCROLL.** TOUCH-drag (a vertical touch swipe) inside the open sheet → assert the sheet content
   scrolls to a field below the fold (the M2 latch class from `J.md` J.W2: the re-open scroll latch where
   CSS `transitionend` never fires on the spring-driven sheet — J.W2 cures M2; THIS leg certifies the cure
   on a real touch context).
3. **Sheet CLOSE → RE-OPEN.** TOUCH-tap the close/grab → assert collapsed; TOUCH-tap to RE-OPEN → assert
   it scrolls to its content on the SECOND open (the M2 re-open-scroll oracle, on touch). This is the
   mobile half of J.W2's `proof:drag-gesture` "open → close → RE-OPEN" leg — here on a 390×844 + touch
   context (J.W2 runs it; THIS battery folds it into the axes certification).
4. **The DOCK switch.** TOUCH-tap to hover-expand the morphing dock → TOUCH-tap a different scene in the
   reka combobox → assert the destination scene mounts via `navToScene`'s per-expected-destination-state
   predicate (the destination control-tab trigger TEXT == the destination's expected label; trigger-ABSENT
   for panel-less scenes — J.W0's predicate, on touch). NOT a hash assignment — the REAL touch combobox path.
5. **ONE drag surface.** On `/square` (or the easing bezier handles) a TOUCH-drag → assert the transform
   PERSISTS and `getSelection()` is empty (no text selection on touch-drag; the `touch-action` regression
   class is exactly the touch-only break INVE-2 names as invisible to the pointer-only gate). Routes through
   J.W2's shared drag seam (`useDragScrub`/`useDragCapture`).
6. **The PLAY affordance.** TOUCH-tap the rainbow group-play button → assert PLAY begins (the subject
   animates: ≥3 distinct subject transforms over the next frames — the B1 play oracle, on touch) AND zero
   budget. The play button must be hit-testable at touch-tap time (the dock-stability dependency, already
   cured upstream).

**S1's §Hard correctness oracle (the named axis property):** the FULL mobile battery completes with
budget == 0 AND every product-facing assertion holds (sheet rises, scrolls, re-opens-and-scrolls, dock
switches to the right destination, the touch-drag persists with no selection, play animates). **The CH-3
re-certification oracle (S7, run inside this leg's context):** at the moment the sheet is OPEN on the
390×844 viewport, measure `sheet.bottom ≤ menubar.top` (the bottom dock menubar's top edge is never
occluded by the open sheet) AND the subject's bounding rect is not wholly behind the sheet (the A-01
occlusion class — the sphere keeps protagonist visibility above the open sheet; J.W7a A-01/A-02 cure the
sphere sizing/position, THIS leg certifies the cure on the mobile viewport). **Band note:** the
`sheet.bottom ≤ menubar.top` occlusion GEOMETRY is a device-INDEPENDENT fact in the INPUT-MODALITY
band — it gates on J.W0 + J.W3 and bites the instant the harness lands; the "subject keeps protagonist
visibility / overlap == 0" half that depends on J.W7a's sphere-sizing/position cure is the
APPEARANCE-CERTIFICATION clause and greens only on the post-W7a tree. The geometry reuses
`occlusion-gate.mjs`'s rect primitives but on the real touch context, NOT the desktop `{375}` sweep.

**Born-RED witness plan (the plantable mutation — SELF-CONTAINED, not a sibling-cure revert).** The
witness MUST red on the cured tree REGARDLESS of *how* J.W2 cured M2 or J.W7a cured A-01 (the
appearance-certification clauses additionally green only on the post-W7a tree) —
a witness that only reds by reverting an un-authored sibling cure is vacuous-green-prone (the I lesson:
a witness that cannot actually red bites nothing). So each clause of this leg names a DIRECT local
mutation against a tree fact present TODAY, not a revert of a cure that does not yet exist as authored
spec (J.W2 and J.W7a are ABSENT from `docs/tranches/J/waves/` — only W0/W3/W4/W5/W6 are authored):

- **The scroll-latch clause (step 3, the M2 axis).** DIRECT mutation: force the mobile sheet's open
  detent so the below-fold field the leg scrolls to is NEVER in view on the second open — pin
  `--sheet-detent-expanded` (the sheet-spring's expanded settle target, `useSheetSpring.ts:43` /
  `ControlsPaneWrapper.vue:349,448`) to a collapsed-equivalent literal, so the re-open never exposes the
  asserted below-fold content. This reds step 3 on the cured tree independent of whether M2 was cured by
  the `isPanelTransitionDone ← spring-settle` re-bind or by some other seam. (`J.md` J.W2 names the M2
  cure as the spring-settled signal; if J.W2 lands the cure at a DIFFERENT locus, the BINDING re-pin
  clause below applies.)
- **The occlusion clause (the CH-3/A-01 axis).** DIRECT mutation: force the mobile sheet
  `--sheet-detent-expanded` to a value that rises the sheet OVER the subject's rect (occluding it) on
  390×844 — `sheet.bottom > menubar.top` and the subject wholly behind the sheet — independent of whether
  J.W7a cured A-01 by sphere-position, sphere-sizing, or stage reflow. This reds the `sheet.bottom ≤
  menubar.top` + subject-visibility oracle on the cured tree directly, with no dependence on the A-01 seam.

EITHER mutation reds exactly one named clause of the mobile leg; the leg greens only on the cured tree.

**BINDING re-pin clause (the coupling made falsifiable, not assumed).** This leg's clauses CERTIFY the
J.W2 (M2) and J.W7a (A-01/A-02) cures, but its born-RED witnesses do NOT *depend* on those cures' exact
seams. If J.W2 cures M2, or J.W7a cures A-01, at a seam OTHER than the one named here, this wave's witness
plan is RE-PINNED to the actual cure locus at IMPL and each affected clause is RE-WITNESSED born-RED
against the actual cured tree before the leg is admitted GREEN. The `§spine` bar's "Revert any S1–S5 cure …
and the matching clause reds (load-bearing)" is satisfied for S1 by the DIRECT `--sheet-detent-expanded`
mutations above — verifiable on the cured tree TODAY's-shape, not contingent on J.W2/J.W7a existing as
authored spec.

### S2 — THE REDUCED-MOTION LEG (`emulateMedia({ reducedMotion: "reduce" })` → the engine's live PRM path) [CORRECTNESS]

**Locus:** a NEW leg of the battery. `context.emulateMedia({ reducedMotion: "reduce" })` BEFORE the scene
loads (so the `matchMedia("(prefers-reduced-motion: reduce)").matches` the engine reads is `true`).

**What "honored" asserts (the named product-behavior change — NOT a tautology).** The engine's
`respectReducedMotion` path is a real, observable behavior fork (`group.ts:584` → `_playReducedMotion()`
"snaps every child to its final frame in a single composite — no rAF draw loop"). The leg asserts the
SNAP-not-animate behavior is honored at the live tier:

1. On a PRM context, `navToScene` into a scene whose subject is driven by a `respectReducedMotion: true`
   composable (`AnimationVisualizer.vue:146`, `useSceneSwap.ts:45`, `useSheetSpring.ts:43`,
   `TypingDots.vue:89`) → tap/click PLAY → assert the subject reaches its FINAL frame IMMEDIATELY (within
   one settle, NOT over a multi-frame rAF arc): sample the subject transform at t≈0 and t≈settle and assert
   it is at its terminal value with NO intermediate distinct-transform sequence (the inverse of the B1
   "≥3 distinct transforms" liveness oracle — under PRM there must be NO multi-frame draw loop for the
   PRM-honoring subjects). This is the *positive* assertion that the snap path RAN.
2. **The sheet under PRM** — `useSheetSpring.ts:43` sets `respectReducedMotion: true`; on a PRM context,
   tap the sheet grab → assert `--sheet-t` reaches its expanded value in ONE emit (the spring's own
   `withReducedMotion` snap — `ControlsPaneWrapper.vue:349,448` "the spring's own respectReducedMotion
   snaps `--sheet-t` in one emit"), not a spring arc.
3. **Zero budget** across the PRM battery (no throw when the snap path replaces the loop — the engine
   must not assume an rAF tick when reduced motion is active).

**Care:** the leg must distinguish PRM-honoring subjects (which snap) from any always-animated decoration;
the assertion is scoped to the named `respectReducedMotion: true` consumers above, so a leg failure means
the SNAP path regressed, not that some unrelated motion exists. (`final-vs-tree-inv-epsilon.md` INVE-2
reduced-motion row; `group.ts:584-600`; the demo wiring above.)

**Born-RED witness plan (the plantable mutation):** flip `respectReducedMotion: true → false` in the
`animationOptionsStore.ts:40` default (or revert the `withReducedMotion` call in `group.ts:584` to always
take the rAF branch) — under the PRM context the subject now ANIMATES over a multi-frame rAF arc instead of
snapping; the leg's "reaches final frame immediately, no intermediate sequence" assertion REDS. The leg
greens only when the engine honors PRM live.

### S3 — THE DARK LEG (`colorScheme: dark` → the `.dark` token surface) [CORRECTNESS]

**Band:** the dark CONTRAST clause is in the APPEARANCE-CERTIFICATION band — it gates on **J.W7a + J.W3**
(J.md §WAVE MAP names "the dark `--ball-tone` contrast" as a J.W7a-gated leg) and greens only on the
post-W7a tree, because it certifies J.W7a's colour suffusion. (The bare `.dark`-token-resolution check of
clause 1 is device-INDEPENDENT and could land earlier, but the leg as a whole is admitted GREEN with the
appearance band so its contrast oracle runs against the suffused accents.)

**Locus:** a NEW leg. `context.emulateMedia({ colorScheme: "dark" })` (and/or the app's `.dark` class
toggle, whichever the demo's theme switch resolves to — the leg asserts the dark token surface is LIVE,
not the OS-media alone). The dark leg accumulates the SAME zero budget AND asserts the dark-mode product
surface renders without a contrast/visibility break that desktop-light certification cannot see (the INVE-2
dark row: *"a dark-only visual/contrast break (the demo ships `.dark` theme vars) never reaches the
human-oracle tier"*).

**What the dark leg asserts (the named product property):**

1. **The dark token surface resolves.** On a dark context, `navToScene` into each of a representative set
   (home + one stage scene + one storyboard scene), assert the computed `background-color` / `color` of the
   shell chrome resolves to the `.dark` token values (NOT the light defaults) — the dark theme is actually
   applied at the live tier, not just declared.
2. **No invisible-on-dark subject (the APPEARANCE-CERTIFICATION clause — gates on J.W7a + J.W3).** The
   subject and the readouts have a computed contrast against their
   dark backdrop above a legibility floor (the post-J.W7a readout/accent tokens — J.W7a promotes the math
   readouts and parameterizes `--ball-tone`; the dark leg asserts those accents remain legible on dark,
   the post-suffusion certification). Because it certifies J.W7a's `--ball-tone`/accent colour suffusion,
   this clause greens ONLY on the post-W7a tree (J.md §WAVE MAP: "the dark `--ball-tone` contrast" leg gates
   on J.W7a + J.W3). The exact floor is a device-INDEPENDENT computed-contrast ratio
   (WCAG-style luminance contrast), so this clause HARD-gates per P6.
3. **Zero budget** across the dark battery.

**Note (the boundary the dark leg does NOT cross):** absolute pixel appearance on dark is a device-DEPENDENT
quantity (cross-OS render) owned by `proof:visual-lock` (observe-only in CI per P6); the dark CORRECTNESS
leg asserts the device-INDEPENDENT facts (token resolves to `.dark` values; computed contrast ≥ floor),
NOT a pixel baseline. The two are partitioned by the P6 boundary, not duplicated.

**Born-RED witness plan (the plantable mutation):** force a single chrome surface (e.g. a readout or the
dock background) to a hardcoded light-token literal that does NOT retheme on `.dark` (the H5/H11 class from
`pane-home.md` — raw literals opaque to the token system) — on the dark context its computed contrast
against the dark backdrop drops below the floor; the dark leg's contrast clause REDS. The leg greens only
when the dark token surface is complete.

### S4 — THE KEYBOARD / FOCUS LEG (Tab order, `focus-visible`, Enter/Space PLAY) [CORRECTNESS]

**Locus:** a NEW leg. A keyboard-only session (no `page.mouse`, no `tap` — only `page.keyboard.press`).
This is the a11y/keyboard-operability axis INVE-2 names as *"entirely outside the correctness tier."*

**What the keyboard leg asserts (the named product property):**

1. **Tab ORDER is sane and reaches the play affordance.** From a fresh scene load, repeated `Tab` walks
   the focusable set in DOM/visual order and the rainbow group-play button is REACHABLE via Tab (it is in
   the tab order, not `tabindex=-1`/`pointer-only`). The leg asserts the focus lands on the dock scene
   selector, the transport controls, and the play button in a coherent order (no focus trap, no skipped
   primary control).
2. **`focus-visible` is RENDERED.** When the play button (and a representative control) holds keyboard
   focus, its computed `outline`/`box-shadow` (the `:focus-visible` ring) is non-empty — a keyboard user
   can SEE where focus is. (Device-INDEPENDENT: the computed focus-ring style is present, not a pixel diff.)
3. **Keyboard ACTUATES PLAY (scoped to the ACTUAL mechanism — verified, not assumed).** The play
   affordance is a glass-ui `<Button>` (`AnimationMenuBar.vue:98-110,181`, `import { Button } from
   "@mkbabb/glass-ui"`) wired `@click="emit('togglePlay')"` — a NATIVE `<button>`, so the browser
   synthesizes a `click` from a focused **Enter** keydown and from a focused **Space** keyup FOR FREE
   (native button semantics, no kf-side `@keyup`/`@keydown` handler — grep on `AnimationMenuBar.vue` for
   `keyup|keydown|keypress` returns ZERO on the play button). SEPARATELY, **Space** is also a GLOBAL
   `registerShortcut("Space", () => toggleAnimationGroup(), …)` (`AnimationControlsGroup.vue:284`) that
   fires regardless of focus. The leg asserts the TWO distinct actuation facts: (a) with keyboard focus
   ON the play `<button>`, `page.keyboard.press("Enter")` synthesizes the native click and starts playback
   (the subject animates — the B1 liveness oracle ≥3 distinct transforms, driven by KEYBOARD actuation not
   a mouse click); (b) `page.keyboard.press("Space")` starts playback via the global shortcut (the leg does
   NOT scope this to "focus on the play button" — Space works from anywhere; the focused-button-Space native
   path also exists but the global shortcut is the load-bearing affordance). The play affordance is operable
   by keyboard. (`AnimationMenuBar.vue:98-110,181`; `AnimationControlsGroup.vue:284`.)
4. **Zero budget** across the keyboard battery.

**Born-RED witness plan (the plantable mutation — targets affordances that EXIST).** The play button is a
native `<button>` (glass-ui `<Button>`) with NO kf-side keyup handler, so "strip the keyup handler" targets
nothing; the mutations below target affordances actually present in the tree:

- **Reachability + native-Enter actuation.** Replace the native `<button>` actuation with a non-button
  (e.g. render the play affordance as a `<div role="button" @click>` WITHOUT `tabindex="0"` and without a
  keydown handler, OR add `tabindex="-1"` to the existing `<Button>`) — Tab no longer reaches it AND a
  focused `page.keyboard.press("Enter")` no longer synthesizes a click (the lost native-button semantics);
  the leg's "reachable via Tab" + "focused-Enter starts play" clauses RED.
- **Global-Space actuation.** Remove or rename the `registerShortcut("Space", …)` registration
  (`AnimationControlsGroup.vue:284`) → `page.keyboard.press("Space")` no longer toggles playback; the
  leg's Space-actuation clause REDS. (This is the load-bearing Space path — a global shortcut, not a
  focused-button keyup handler.)
- **Focus-ring.** Suppress the `:focus-visible` ring (set `outline: none` with no replacement) — the
  focus-ring-present clause REDS.

The leg greens only when keyboard operability is complete: the play `<button>` is Tab-reachable with a
visible focus ring, focused-Enter actuates it natively, and the global Space shortcut toggles playback.

### S5 — THE SCENE-SWEEP WIDENED TO EVERY ROUTED SCENE [CORRECTNESS]

**Locus:** the SWEEP leg of the battery, widened from the hardcoded `["cube","easing","spring","sequence",
"motion-path"]` (`:711`, icon-paint-only for 3 of them) + the dedicated `amiga`/`square` legs, to the FULL
routed set — and crucially, every scene gets a PLAY+INTERACT pass, not glyph-paint-only for the playground-
class scenes.

**The widened sweep — every routed scene** (`demo/app/scenes.ts:165` `allScenes` = **home, cube, amiga,
square, easing, spring, sequence, motion-path**). The sweep MUST be driven off the auto-tracking `SCENES`
export (`demo-driver.mjs:244`) so a scene add/remove reaches the sweep automatically — NEVER a hardcoded
literal (the `:711` literal is exactly the brittleness that let `home` fall out of the sweep). For EACH
scene:

1. **Enter via `navToScene`** (J.W0's per-expected-destination-state predicate — the trigger TEXT matches
   the expected label, or trigger-ABSENT for panel-less scenes like `home`). The entry itself is the INVE-3
   oracle: a scene that mounts blank or lags its control surface REDS at entry (not only at icon-paint).
2. **`home` is SWEPT** (it is omitted entirely today): the INPUT-BAND facts — the hero start screen mounts,
   the cube backdrop paints, the entry predicate is trigger-ABSENT (`home` has no controls panel) — gate on
   W0+W3 and bite the instant the harness lands. The APPEARANCE-CERTIFICATION facts — POST-J.W7a the
   hero/subject overlap is 0 on the mobile leg (the H3 cure) and the ghost-rail is absent (J.W7a XH-1) —
   gate on J.W7a + J.W3 and green ONLY on the post-W7a tree (they certify J.W7a's suffusion, not the defect).
3. **PLAY+INTERACT for the playground-class scenes** (`spring`, `sequence`, `motion-path` — icon-paint-only
   today): tap/click PLAY → assert the subject animates (≥3 distinct transforms) AND the storyboard rows /
   editable path (`sequence`/`motion-path`) respond to one interaction. NOT glyph-paint-only.
4. **The N×1 SWITCH matrix:** from each scene, switch via the dock combobox to the NEXT scene (the real
   path, `navToScene`) — so every adjacency is exercised at least once, closing the INVE-2 "no full switch
   matrix" gap to a covering walk (not the full N×N — a Hamiltonian-ish covering sweep over `allScenes` is
   the KISS sufficient form; N×N is recorded as a measure-first follow-up if a switch-pair regression ever
   surfaces).
5. **Zero budget** accumulated across the whole sweep.

**S5's §Hard oracle:** the sweep visits EVERY scene in `allScenes` (count-checked against the auto-tracking
SCENES export — a scene present in `scenes.ts` but absent from the sweep REDS the leg, the anti-`:711`-
brittleness clause), each enters clean via `navToScene`, each non-home scene plays+interacts, and the
covering switch-walk lands every destination — all at budget == 0.

**Born-RED witness plan (the plantable mutation):** add a new scene descriptor to `scenes.ts` (a throwaway
`id: "probe"` with a deliberately blank mount) WITHOUT adding it to any sweep literal — because the sweep is
driven off the auto-tracking SCENES export, the new scene IS swept, its blank mount REDS the entry predicate
(the anti-brittleness proof: the sweep cannot silently omit a scene). ALTERNATE: revert `spring` to
icon-paint-only coverage (skip its PLAY) and plant a play-time throw in `spring` — the widened sweep's
PLAY+INTERACT pass catches the throw that the old glyph-paint-only sweep would miss. The leg greens only when
every routed scene is entered, played, and switched-through clean.

### S6 — `proof:lighthouse-mobile` ENTERS A TIER UNDER ITS DECLARED P6 POSTURE [HYGIENE/observe-only-in-CI; correctness-on-device]

**Locus:** `package.json` (`proof:lighthouse-mobile` at `:51`) + the tier rosters + the `proof:ci-coverage`
exclusion set. Today it is an ORPHAN (in NEITHER tier; explicitly excluded from coverage — `ci-cd.md §6`).
It must enter a tier under its HONEST P6 posture — it measures a DEVICE-DEPENDENT quantity (mobile
Lighthouse Performance, throttled), the canonical observe-only-in-CI / hard-on-device gate
(`proof-lighthouse-mobile.mjs:1-40`: `KF_REQUIRE_LH=1` hard on a calibrated runner, RECORDS-WITHHELD on an
untrusted host).

**The disposition (no workaround — the honest tier per P6):**

1. **The posture is DECLARED through the ONE shared `IN_CI`/`observeOnlyInCI(label, reason)` helper J.W3
   single-sources** — NOT a per-script `KF_REQUIRE_LH`/`IN_CI` re-implementation. The `lighthouse-mobile`
   gate registers its device-dependence reason ("mobile Lighthouse throttle assumes a calibrated host") in
   the J.W3 observe-only MANIFEST.
2. **It enters the TAXONOMY** (it is no longer an orphan): per the gate-ORACLE/two-tier taxonomy, a
   throttle-dependent perf gate is a HYGIENE-tier corroborator whose CI run is observational and whose
   on-device run hard-gates — exactly the third state P6 names. It is wired so `proof:ci-coverage` SEES it
   (the CICD-4 raw-script / orphan blind-spot J.W3 closes), removed from the bare exclusion set, and
   labeled with its on-device annotation.
3. **The correctness owner of MOBILE perf remains explicit:** `lighthouse-mobile` corroborates; it is NOT
   the correctness oracle for "mobile works" (that is the S1 mobile leg's device-INDEPENDENT battery). The
   spec records this so a green observe-only `lighthouse-mobile` in CI is never over-read as "mobile perf
   held in CI" (the P6 over-read prohibition).

**No workaround prohibition:** `lighthouse-mobile` is NOT made a bare-`IN_CI`-escape hard gate (that would
violate P6's "declared through ONE helper" rule), and its observe-only posture is NOT a `continue-on-error`
or a settleMs bump — it is the honest device-DEPENDENT third tier, registered in the manifest, run hard on
device, observed in CI.

### S7 — EP-3 DISPOSITION (flip/drag/draw-svg) + the CH-3 mobile re-certification wired in

**EP-3 — the three uncovered exports** (`engine-periphery.md` EP-3: `flip.ts`/`flipShared`, `drag.ts`/
`Draggable`, `draw-svg.ts`/`DrawSVG`/`fromDrawSVG` — load-bearing, tested, ZERO `proof:live-session`
runtime coverage; `proof:drawsvg` is JSDOM-only HYGIENE). The gate-ORACLE precept requires product-property
proof through the human's surface. The disposition is ONE of two, decided in this wave's spec, NOT left
ambiguous:

- **PATH A — a demo home** (the preferred disposition where a befitting scene exists): if J.W7a's design
  suffusion or a small demo addition gives any of `flip`/`drag`/`draw-svg` a live scene (e.g. a `flip`
  layout-transition surface, a `Draggable` demo, a `DrawSVG` stroke reveal), that scene JOINS the S5
  scene-sweep and gains a live correctness leg — the export is then covered through the human's surface.
  (A PATH A scene authored by J.W7a gates that scene's live leg on J.W7a + J.W3.)
- **PATH B — a recorded BOOK wired into the published-surface manifest** (the honest disposition for any
  export that gets NO demo home in J): the uncovered export is RECORDED as a BOOK in J.W5's
  `proof:published-surface` documented-surface manifest — an export TAUGHT in the README and enumerated in
  the manifest, with an explicit "no live-session scene; covered by `*.test.ts` unit + JSDOM gate" annotation.
  This is NOT a punt: per P-invariant-28 the BOOK names the terminal disposition (the export ships,
  documented, with its unit-coverage cited and its no-live-scene status disclosed) and the published-surface
  gate (J.W5) carries the uncovered-export list as a first-class manifest row.

**The binding decision for THIS spec:** EP-3's three exports take PATH B (the recorded BOOK in the J.W5
published-surface manifest) UNLESS J.W7a lands a befitting demo scene for one of them, in which case THAT
export takes PATH A and joins the S5 sweep. Either way, every EP-3 export has a terminal home — a live
correctness leg (PATH A) or a documented manifest BOOK with cited unit coverage (PATH B). No export rides
into J's close with "exported, tested, but silently un-dispositioned." (`engine-periphery.md` EP-3, P1;
`J.md` J.W5 `proof:published-surface` — the documented-surface manifest; `J.md` J.W4 "EP-3 dispositioned:
flip/drag/draw-svg get a demo home or a recorded BOOK with the uncovered-export list in the published-
surface gate.")

**CH-3 re-certification wired in** (the chronic's closure gate finally matches its axis — `J.md` J.W4 "CH-3
re-certified on a MOBILE oracle (`sheet.bottom ≤ menubar.top` measured ON the mobile viewport)"). The CH-3
mobile occlusion oracle is the geometry clause embedded in the S1 mobile leg (a `390×844 + hasTouch` context,
sheet OPEN, `sheet.bottom ≤ menubar.top` AND subject not wholly occluded). This REPLACES the desktop-oracle
closure (CH-3 was VERIFY-ONLY via `perf-frame-budget`+`drag-gesture` at 1440 — `deferred-ledger.md:68`)
with a hard, device-INDEPENDENT mobile-viewport geometry gate. Per FVT-6, the device-INDEPENDENT occlusion
geometry HARD-gates (it is not a felt-timing quantity), so CH-3's closure no longer rides a CI-observe-only
gate; the felt-perf half stays observe-only-in-CI per P6, but the chronic's CORRECTNESS half (the human-
visible occlusion) hard-gates on the mobile viewport. The `proof:chronic-closure` row for CH-3 is updated to
cite THIS mobile occlusion clause (a runtime gate that BIT on a planted occlusion — the S1 born-RED witness).

## §Hard gate (falsifiable · re-runnable · MUST bite · RUNTIME/INTERACTION · the AXES oracle)

**The §Hard gate is the AXES BATTERY: every new leg (S1–S5) GREEN with the accumulated error budget == 0
PER LEG, each leg born-RED-able against its NAMED planted defect.** Per the gate-ORACLE precept (and J's
boundary-ORACLE extension), the correctness oracle ACTUATES the running product through the human's surface
— touch taps/drags (S1), the live PRM snap path (S2), the dark token surface (S3), keyboard actuation (S4),
the every-scene play+interact sweep (S5); the hygiene/config clauses (the `proof:ci-coverage` wiring of
S6, the manifest rows of S7) are CORROBORATORS ONLY and are LABELED hygiene. The battery's bite is the
union of the per-leg bites:

- **born-RED witnessing (per leg — the leg can BITE).** Each leg is witnessed born-RED against a deliberate
  local mutation that reds EXACTLY that leg, then GREEN on the cured tree:
  - **S1 mobile** (SELF-CONTAINED, not a sibling-cure revert) — pin `--sheet-detent-expanded` to a
    collapsed-equivalent literal so the re-open never exposes the below-fold field → the sheet re-open
    scroll never reaches the asserted content (step 3 reds); OR force `--sheet-detent-expanded` to rise
    the sheet OVER the subject rect on 390×844 → `sheet.bottom > menubar.top` and the subject is wholly
    occluded (the CH-3 `sheet.bottom ≤ menubar.top` + subject-visibility oracle reds). Both mutations are
    DIRECT against TODAY's tree (`useSheetSpring.ts:43`, `ControlsPaneWrapper.vue:349,448`), not a revert
    of J.W2 M2 / J.W7a A-01 (both absent from `waves/`); the BINDING re-pin clause (§S1) re-pins + re-
    witnesses if J.W2/J.W7a cure at a different seam.
  - **S2 reduced-motion** — flip `respectReducedMotion: true → false` (store default or `group.ts:584`) →
    the subject animates over a multi-frame rAF arc under PRM instead of snapping (the "reaches final frame
    immediately, no intermediate sequence" clause reds).
  - **S3 dark** — force one chrome surface to a hardcoded light literal opaque to `.dark` → its computed
    contrast on dark drops below the legibility floor (the contrast clause reds).
  - **S4 keyboard** (targets affordances that EXIST — the play `<button>` has NO kf-side keyup handler to
    strip) — `tabindex="-1"` on the native play `<button>` (or render it as a non-button) → Tab does not
    reach it AND focused-Enter no longer synthesizes a native click (the reachability + native-Enter
    clauses red); OR remove the `registerShortcut("Space", …)` (`AnimationControlsGroup.vue:284`) → Space
    no longer toggles play (the global-Space clause reds); OR `outline: none` with no replacement → the
    `focus-visible` ring clause reds.
  - **S5 scene-sweep** — add a blank-mount scene to `scenes.ts` WITHOUT touching any sweep literal → the
    auto-tracking SCENES sweep visits it and its blank mount reds the entry predicate (the anti-`:711`-
    brittleness proof); OR plant a play-time throw in `spring` → the widened PLAY+INTERACT pass catches the
    throw the old glyph-paint-only sweep would miss.
- **GREEN per BAND, not serialized whole (the partition is load-bearing on the gate):** the
  INPUT-MODALITY band greens on the **W0+W3** tree the INSTANT the harness lands — the mobile touch
  battery completes (sheet open/scroll/close/re-open, dock switch, touch-drag persists no-selection,
  play animates; the device-INDEPENDENT CH-3 `sheet.bottom ≤ menubar.top` occlusion geometry holds);
  the PRM path snaps; the keyboard reaches and actuates play with a visible focus ring; every routed
  scene enters clean, plays, and switches through — all at budget == 0 per leg, with NO dependence on
  J.W7a. These legs run PARALLEL to the W2→W7a chain and MUST NOT be stalled behind it. The
  APPEARANCE-CERTIFICATION band greens only on the **post-J.W7a** tree — the mobile hero/subject
  overlap == 0, the dark `--ball-tone`/accent contrast above floor, the ghost rail absent — because
  these certify the SUFFUSED appearance (the H3/A-01 collisions cured, the ghost rail removed, the
  `--ball-tone` accents legible on dark) that J.W7a authors and re-baselines, NOT the pre-suffusion
  defect. Pinning the whole battery behind J.W7a would be the exact serialization J.md §WAVE MAP
  forbids (it would stall the input-modality legs that bite the instant W0+W3 land).
- **CH-3 re-certified (S7) as the chronic-bite:** the mobile occlusion oracle (`sheet.bottom ≤ menubar.top`
  on 390×844) is a runtime gate that BIT on the planted occlusion — `proof:chronic-closure` (J.W3-rewired)
  cites THIS clause for CH-3, replacing the desktop `perf-frame-budget`+`drag-gesture` closure. The chronic
  exits via a gate that drives the live mobile interaction it lives in.
- **EP-3 dispositioned (S7) as a published-surface row:** every EP-3 export has a live correctness leg
  (PATH A — joined the S5 sweep) or a documented BOOK in the J.W5 manifest (PATH B — cited unit coverage,
  disclosed no-live-scene); `proof:published-surface` carries the uncovered-export list. No silently
  un-dispositioned export.
- **`proof:lighthouse-mobile` (S6) in a tier:** it is no longer an orphan — `proof:ci-coverage` SEES it,
  it is labeled HYGIENE-tier observe-only-in-CI / hard-on-device through the ONE shared helper, with its
  on-device annotation declared. A green observe-only run in CI is never over-read as the felt mobile perf
  holding in CI (the P6 over-read prohibition).

**The §spine bar — the AXES battery's GREEN hangs on its RUNTIME/INTERACTION clauses, the hygiene clauses
corroborate.** Each of S1–S5 closes on its actuating leg ALONE (the touch battery, the live PRM snap, the
dark token resolution + computed contrast, the keyboard actuation, the every-scene play+interact sweep);
the S6 `proof:ci-coverage` wiring and the S7 manifest rows are hygiene corroborators and may NEVER substitute
for a red runtime leg. The battery is born-RED-able per leg against a named planted defect; the
input-modality band greens on the W0+W3 tree and the appearance-certification band greens on the
post-J.W7a tree (NOT serialized whole — the partition above). **No workaround escape hatch:** no
`continue-on-error`, no bare settleMs bump (the
mobile/PRM/sheet legs wait on the J.W2 spring-settled signal and J.W0's per-expected-state predicate, never a
fixed timer), no `IN_CI` escape on a device-INDEPENDENT correctness leg (the occlusion geometry, the dark
contrast, the focus ring, the keyboard actuation all HARD-gate; only the device-DEPENDENT `lighthouse-mobile`
runs observe-only-in-CI under its declared P6 posture). Revert any S1–S5 cure (or J.W7a's appearance fix the
appearance-certification clause certifies) and the matching clause reds (load-bearing).

## §Folds (every J.md-assigned fold item, with its evidence citation)

- **FVT-2 / INVE-2 — live-session desktop-1440-only (mobile/touch/reduced-motion/dark/keyboard all
  zero-hit; the SCENES sweep omits playground-class scenes)** → S1 (mobile/touch) + S2 (reduced-motion) +
  S3 (dark) + S4 (keyboard/focus) + S5 (every-scene play+interact sweep). (`final-vs-tree-inv-epsilon.md`
  INVE-2/P0-2 axis table; `:420,:438,:711,:333-353`; grep `reducedMotion|emulateMedia|colorScheme|hasTouch`
  = 0.)
- **INVE-3 — the hash-nav entry-surface note** → S5 enters EVERY routed scene through J.W0's `navToScene`
  per-expected-destination-state predicate (the dock combobox for the real switch; a scene mounting blank/
  lagging its control surface reds at entry). (`final-vs-tree-inv-epsilon.md` P0-2 "Scene SWITCH breadth";
  `J.md` J.W0 navToScene predicate.)
- **lighthouse-mobile an orphan in neither tier** → S6 (enters a tier under its declared P6 posture, seen
  by `proof:ci-coverage`, labeled hygiene observe-only-in-CI / hard-on-device through the ONE shared helper).
  (`package.json:51`; `ci-cd.md §6`; `final-vs-tree-inv-epsilon.md` INVE-2.)
- **CH-3 mobile chronic certified by desktop oracles** → S7 (CH-3 RE-CERTIFIED on the S1 mobile occlusion
  oracle `sheet.bottom ≤ menubar.top` on 390×844; `proof:chronic-closure` cites the mobile clause).
  (`deferred-ledger.md:68,171`; `final-vs-tree-inv-epsilon.md` INVE-2 mobile row; `design/pane-amiga.md`
  A-01; `design/pane-home.md` H3.)
- **EP-3 — flip/drag/draw-svg exported with no demo scene and zero live-session coverage** → S7 (PATH A
  demo home → S5 sweep, OR PATH B recorded BOOK in the J.W5 published-surface manifest with cited unit
  coverage). (`engine-periphery.md` EP-3, P1.)
- **FVT-6 — CH-3/CH-4 closure rests on a gate WZ demoted to CI-observe-only (P6 posture must be explicit)**
  → S6 + S7 (the device-INDEPENDENT CH-3 occlusion geometry HARD-gates on the mobile viewport; the felt-perf
  half stays observe-only-in-CI under the DECLARED P6 posture through the one shared helper; the P6 over-read
  prohibition is recorded). (`final-vs-tree-inv-epsilon.md` FVT-6/P1-4; `ci-cd.md §4-§5; I-WZ-verify.md:333-335`.)

## §Design decisions (trade-offs RESOLVED)

- **Five LEGS of one battery, not five new gates — RESOLVED.** The KISS inversion the AXES cluster demands
  is the SAME shape as I.W7's "one driven session, not N rest-probes": the axes are new actuating LEGS that
  accumulate into the SAME zero error budget (the `proof:live-session` structured allowlist, inherited BY
  REFERENCE — never re-stated per leg, the anti-`demo-console-clean`-narrowing rule). The IMPL MAY house the
  mobile/touch matrix in a sibling `proof:live-session-mobile` (a real touch context is a separate
  `newContext` shape), but it is the SAME battery's budget and the SAME harness — not a new proxy lattice.
- **The legs are PARTITIONED by their ACTUAL upstream dependency — NOT serialized whole — RESOLVED.** The
  DAG does NOT place the whole battery after the suffusion. Per J.md §WAVE MAP, only the
  APPEARANCE-CERTIFICATION clauses — those that assert post-suffusion facts (the H3/A-01 mobile hero/subject
  overlap == 0; the dark `--ball-tone`/accent contrast above floor; the ghost rail absent) — gate on
  **J.W7a + J.W3** and green only on the post-W7a tree (running them before J.W7a would certify the defect;
  running after certifies the cure). The APPEARANCE-INDEPENDENT input-modality legs (the touch battery, the
  PRM/reduced-motion snap, the keyboard actuation, the scene-sweep, and the device-INDEPENDENT CH-3
  occlusion geometry) gate ONLY on **J.W0 + J.W3** and LAND AS SOON AS THE HARNESS DOES — they run PARALLEL
  to the W2→W7a chain and MUST NOT be stalled behind it. The longest serial path is therefore
  **W0 → W2 → W7a → W4(appearance legs)**, with W4's input-modality legs running parallel to it. The legs
  are AUTHORED now (this spec), RUN later — the input legs green on W0+W3, the appearance legs only on the
  suffused W7a tree. (`J.md §WAVE MAP` lines 259-266: *"J.W4's legs are partitioned by their ACTUAL upstream
  dependency, not serialized whole … the APPEARANCE-CERTIFICATION legs … are gated on J.W7a + J.W3; the
  APPEARANCE-INDEPENDENT input-modality legs … gate ONLY on J.W0 + J.W3 and land as soon as the harness does
  — decoupled from the W2→W7a chain. The longest serial path is therefore W0 → W2 → W7a → W4(appearance
  legs), with W4's input-modality legs running parallel to it."*)
- **Reuses J.W0's `navToScene` + J.W3's harness, authors NO new primitive — RESOLVED.** Every leg enters
  scenes through J.W0's per-expected-destination-state `navToScene` (so an entry never rests on a fixed
  timer or the SOURCE scene's stale trigger) and runs over J.W3's `withPage()`/`withBrowser()` + the single
  `serveDist`/chromium authority. This wave adds LEGS, not infrastructure — the net-deletion rule is not
  violated (no new `serveDist`/chromium copy; the legs consume the lib). (`J.md` J.W0, J.W3.)
- **The device-dependence boundary is honored per-leg — RESOLVED (P6).** Each leg's clauses are partitioned
  by P6: device-INDEPENDENT facts HARD-gate (the touch battery completing, the PRM snap behavior, the dark
  token resolution + computed contrast ratio, the focus ring presence, the keyboard actuation, the occlusion
  geometry); device-DEPENDENT measurements (mobile Lighthouse perf, cross-OS pixel appearance) run
  observe-only-in-CI / hard-on-device under the DECLARED posture through the ONE shared helper J.W3
  single-sources. The dark CORRECTNESS leg asserts computed contrast (device-INDEPENDENT), NOT a pixel
  baseline (that stays with observe-only `visual-lock`) — partitioned, not duplicated. (`ci-cd.md §5`;
  `J.md §invariants` P6.)
- **CH-3's closure replaces the desktop oracle, does not stack a second — RESOLVED.** CH-3 was VERIFY-ONLY
  via `perf-frame-budget`+`drag-gesture` at 1440 (the desktop oracles INVE-2 names as the mismatch). The
  re-certification REPLACES that closure citation with the mobile occlusion clause (`sheet.bottom ≤
  menubar.top` on 390×844) — the chronic's closure gate finally matches its axis. The felt-perf half stays
  observe-only-in-CI per P6; the human-visible occlusion half hard-gates on the mobile viewport. No
  workaround: the device-INDEPENDENT occlusion geometry is NOT demoted to observe-only to dodge a flake
  (per `ci-cd.md §5`, a device-INDEPENDENT gate is made DETERMINISTIC, never silenced). (`deferred-ledger.md:68`;
  `final-vs-tree-inv-epsilon.md` FVT-6.)
- **EP-3 takes a TERMINAL disposition in this spec, not a punt — RESOLVED (P-invariant-28).** Each EP-3
  export gets PATH A (a demo home → the S5 sweep) or PATH B (a recorded BOOK in the J.W5 published-surface
  manifest, with cited unit coverage and disclosed no-live-scene status). The binding default is PATH B
  unless J.W7a lands a befitting scene. No export rides into J's close un-dispositioned. (`engine-periphery.md`
  EP-3; `J.md §invariants` P-invariant-28.)
