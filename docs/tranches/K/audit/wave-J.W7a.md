# J.W7a — PLAN-VS-DELIVERY AUDIT (the appearance-grammar suffusion · D1–D23 · the display-voice verdict · font gaps vs user U-K findings)

- **Lane:** K audit fleet — plan-vs-delivery, DOCS ONLY (no source edits, no gate edits, no CI)
- **Spec:** `docs/tranches/J/waves/J.W7a.md` (§S1–§S6, §Hard gate clauses (a)–(h), the §S6 named-delta register)
- **Impl record:** `docs/tranches/J/waves/J.W7a-impl.md` (32/32 GREEN clauses, visual-lock re-captured)
- **Branch at close:** `tranche-j-dev` == `master` @ `4f1fc4c` (J closed 2026-06-11 · 4.2.0 published)
- **Audit date:** 2026-06-11
- **Witness env:** dist/gh-pages (built at master · `4f1fc4c`); chromium 1440×900; `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/glass-ui`; screenshots under `docs/tranches/K/audit/screenshots-k/`

---

## §1 — Delta delivery: D1–D23 verified present

Every delta in the §S6 register was verified against the LIVE tree (`dist/gh-pages` at `4f1fc4c`). The verification method is listed for each row.

### S1 — PROTAGONIST

| # | Delta | Live-tree status | Evidence |
|---|---|---|---|
| D1 | Square joins glass stage plate + centers | PRESENT | `demo/app/scenes/SquareScene.vue:10-12` — `<Card surface="glass" tier="resting" :shadow="false">` + `place-items-center`; screenshot `w7a-square-loaded.png` shows centered teal box in a glass-plate stage region |
| D2 | Amiga canvas: rounded-card + 1px hairline | PRESENT (partial gap — see §3) | `demo/app/scenes/AmigaScene.vue:14` — `class="amiga-canvas h-full w-full rounded-card"`; runtime: `borderRadius: "16px"` confirmed (canvas probe); screenshot `w7a-amiga-full.png`; **design gap noted** |
| D3 | Amiga sphere reframed + bounce-aware frustum | PRESENT | `AmigaScene.vue refreshBounceFraming()`, `demo/amiga/useAmigaAnimations.ts getBounceScale`; sphere visually fills ~20% FOV in `w7a-amiga-full.png` |
| D4 | Subject framing baselines (seq/spring/easing lower-third / master-playhead dominance) | PRESENT | `EasingHeroStage.vue items-end + pb-*`; `SequenceTarget.vue` — master ball `--ball-size` dominant; `SpringTarget.vue` hero rung; visible in `w7a-easing-loaded.png` / `w7a-sequence-loaded.png` / `w7a-spring-loaded.png` |
| D5 | ControlsPaneWrapper glass-wash on desktop stageMode=subject | PRESENT | `.controls-pane` runtime: `backdropFilter: "blur(1px) saturate(1.05)"`, class `glass-wash rounded-card` confirmed via controls probe on 1440×900 desktop; screenshot `w7a-cube-controls-open2.png` |
| D6 | Mobile hero/subject separated (home + amiga) | PRESENT | `EditorStartScreen.vue:11` — `pt-[var(--dock-top-band-reserve)]`; `ControlsPaneWrapper.vue:244+` detent tightening; post-W7a screenshot `home-mobile.png` shows zero overlap |

### S2 — DISPLAY VOICE

| # | Delta | Live-tree status | Evidence |
|---|---|---|---|
| D7 | Seven scene titles → Instrument-Serif display rungs (amiga EXCLUDED) | PRESENT (with font gap — see §3) | Runtime: `dock-scene-title` computed `"Instrument Serif", "Instrument Serif Fallback", Georgia, serif` (collapsed pill probe); `text-display` spans confirmed in `EasingTarget.vue:36`, `SpringTarget.vue:28`, `SequenceTarget.vue:14`, `MotionPathTarget.vue:27`, `SquareScene.vue:21` (`text-display` drag-me), `ChromeDock.vue:299-304` (`.dock-scene-title` font-family: `var(--font-display)`); amiga headerless — zero `[class*=text-display]` in stage region (runtime confirmed) |
| D8 | Live readouts → MetricBadge xl + AnimatedDigit | PRESENT | `SequenceTarget.vue:18`, `SpringTarget.vue:31,39`, `MotionPathTarget.vue:28,37` use `MetricBadge`; `EasingTarget.vue:41` uses `AnimatedDigit`; visible in `w7a-easing-loaded.png` (the `= 0.954` animated digit in violet) |
| D9 | Home subtitle steps φ-rung; 404 half DISPOSED | PRESENT | `EditorStartScreen.vue:54` — `class="start-screen-prose text-heading w-full italic"` (was `text-title`); the 404/empty-state half is disposed as surfaceless (`router.ts:31` catch-all confirmed) |

### S3 — COLOUR

| # | Delta | Live-tree status | Evidence |
|---|---|---|---|
| D10 | `.progress-ball` parameterized with `--ball-tone` | PRESENT | `design-idioms.css:465` — `background: var(--ball-tone, var(--color-progress))`; `design-idioms.css:434-436` comment confirms the seam |
| D11 | Per-scene hue = icon hue | PRESENT | Runtime probe: easing ball `bgColor: "rgb(230, 77, 230)"` == `--rainbow-violet` (#e64de6); `EasingTarget.vue:374` — `--ball-tone: var(--rainbow-violet)`; `MotionPathTarget.vue:268` — `--ball-tone: var(--rainbow-cyan)`; `SpringTarget.vue:185` — `--ball-tone: var(--color-progress)` |
| D12 | Sequence rows → violet→green spectrum | PRESENT | `SequenceTarget.vue:163-168` — `ROW_TONES = ["var(--rainbow-violet)", "var(--rainbow-blue)", "var(--rainbow-cyan)", "color-mix(in oklab, …cyan 45%, …green)", "var(--rainbow-green)"]`; visible in `w7a-sequence-loaded.png` (pink/blue/teal/teal-green/green row spectrum) |
| D13 | `aquamarine` literal DIES | PRESENT | `SquareScene.vue:187` — `background-color: var(--subject-teal)`; no `aquamarine` in tree (`grep -r "aquamarine" demo/` = 0 hits in sources) |
| D14 | Readout values wear scene accent | PRESENT | `design-idioms.css:477` — `.readout-accent { color: var(--ball-tone, …) }`; easing readout visible in violet in `w7a-easing-loaded.png` |
| D15 | Colourful cube favicon + theme-color + apple-touch-icon | PRESENT | `demo/app/index.html:31-33` — `favicon.svg` (magenta/yellow/red 3-face flat-colour cube) + `<meta name="theme-color" content="#ff00ff">` + `apple-touch-icon.png`; `demo/app/public/apple-touch-icon.png` confirmed on disk |

### S4 — MATH

| # | Delta | Live-tree status | Evidence |
|---|---|---|---|
| D16 | Easing stage projects its live bezier | PRESENT | `EasingHeroStage.vue:46` — `<path class="easing-stage-curve-path" :d="demo.svgPath.value" />`; ghost curve visible in `w7a-easing-loaded.png` (faint diagonal behind the violet ball) |
| D17 | Coordinate-grid stage fields (kf-local token-clean) + mp clean plate | PRESENT | `design-idioms.css:168-183` — `--graph-*` tokens, `.stage-field-*` utilities; `EasingHeroStage.vue` `.stage-field-y`, `SpringTarget.vue` `.stage-field-x`, `MotionPathTarget.vue` `color-mix(… --ball-tone …)` plate; visible as faint grid lines in screenshots |
| D18 | FourierField in empty home left-half (published consume) | PRESENT | `EditorStartScreen.vue:78-83` — `<FourierField variant="hero" seed="keyframes.js" :color-resolver="defaultBlobColorResolver">`; runtime: `class="fourier-vacancy", visible: true, opacity: "0.6"` confirmed; **U-K20 is a post-wave user preference reversal — see §4** |
| D19 | Substrate two-tier graph-paper depth (W6-3 discharged) | PRESENT | `EditorShell.vue:202-222` — four `linear-gradient` layers at `80px 80px` (major) + `16px 16px` (fine); runtime: `backgroundSize: "80px 80px, 80px 80px, 16px 16px, 16px 16px"` confirmed; `--graph-major-opacity: 12%` > former 0.10α floor (`design-idioms.css:183`) |

### S5 — GRAMMAR

| # | Delta | Live-tree status | Evidence |
|---|---|---|---|
| D20 | Ghost rail DIES | PRESENT | `AnimationControlsGroup.vue:457-458` — `.controls-layout--railless { --rail-track: 0px }`; runtime: sequence `gridTemplateColumns: "[rail] 0px [stage] 1353.59px"`, `hasRailless: true` confirmed; screenshots `w7a-sequence-loaded.png` / `w7a-motion-path-loaded.png` show no rail column |
| D21 | Storyboard playback register converges | PRESENT (later superseded by W7c U5 — see §2) | `SpringSidebar.vue` created at W7a (spring panel into rail); **W7c completely redesigned SpringSidebar from first principles (U5, commit `377eb3e`)** — the D21 grammar convergence was subsumed and extended |
| D22 | Stage chrome OUT of top-center band | PRESENT | `AnimationControlsGroup.vue` — `--dock-top-band-reserve` token; `SpringSidebar.vue:182+` comment references `J.W7a S5 / XH-4 (D22)`; spring view switcher relocated to rail sidebar |
| D23 | Playback forks converge to canonical pair | PRESENT | `SequenceTarget.vue` — in-stage flat text-row transport absent; `playback-button.css` import retired; sequence shows dock rainbow group-play button + rail playback card in `w7a-sequence-loaded.png` |

---

## §2 — Post-W7a modifications on the delivery surface

Three items in the §S6 register were subsequently modified by later J waves before the close. These are NOT regressions; they are forward improvements that superseded the W7a delivery. Recorded here for completeness:

**D21 — Spring storyboard grammar (W7a → W7c U5):** W7a's `SpringSidebar.vue` created a rail playback panel (D21 storyboard convergence). J.W7c LANE B (commit `377eb3e`) completely redesigned `SpringSidebar.vue` from first principles onto the cube/amiga main control grammar, replacing the W7a delivery with `SegmentedTabs`, a uniform `labeled-field-grid`, and a new keyframes-variant artifact section. The current `SpringSidebar.vue:2` explicitly marks itself `J.W7c LANE B (U5 + U8)`. The W7a intent (storyboard convergence) was achieved and then improved; W7c's result is what ships.

**glass-ui 3.9.0 → ~3.11.2 (the pin upgrade, commit `56aa00f`):** W7a's impl record states "consumed from PUBLISHED `~3.9.0` ONLY" (`J.W7a-impl.md:14`). Between W7a merge and the glass-ui upgrade commit, `package.json:182` was updated to `"@mkbabb/glass-ui": "~3.11.2"`. The upgrade brought restyled slider controls (the documented 8 visual-lock diffs). The visual-lock golden was honestly RE-CAPTURED on the post-upgrade tree at commit `1274b3b` ("8 reds, all attributed" to the slider-region changes). The W7a §Hard gate clauses (a)–(h) ran at 32/32 GREEN on 3.9.0; the post-merge re-pin with attributed diffs is correctly recorded — there is no unattributed gate delta.

**W7c easing/sequence/motion-path refinements (U3/U6/U7):** J.W7c also refined the easing card (U3), sequence card (U6), and motion-path stage (U7). These refinements are ATOP the W7a D7/D8/D11/D17 foundations — the W7a display rungs, `--ball-tone` consumers, and stage fields are still present, with additional W7c geometry and chrome adjustments. The D-items are still present in the merged tree; they were extended, not reverted.

---

## §3 — Gaps: where delivery diverges from spec intent (the U-K font verdict + D2 glass-plate)

### GAP-1 (P2) — D2 DELIVERY FORM: canvas directly gets `rounded-card`, not a wrapping `<Card surface="glass">` component

**Spec intent (§S1 / D2):** *"a glass-plate frame around the canvas"* — the amiga canvas gains the rounded-glass register: *"a glass-plate frame around the canvas (the `.amiga-canvas` gains the `rounded-card` + a 1px inset stage-boundary hairline per A-07)"* (spec, D2 table row). The cross-hierarchy finding XH-3 called for the amiga to *"join the rounded-glass register"* like other contained stages — implying a `<Card surface="glass" tier="resting">` wrapping component as every other stage uses.

**Delivery (AmigaScene.vue:14):** The `rounded-card` class and `box-shadow: inset 0 0 0 1px var(--border)` are applied DIRECTLY to the `<canvas>` element. There is no wrapping `<Card surface="glass" tier="resting">` component. The canvas background is a themed gradient (`linear-gradient(to bottom, var(--muted), var(--background))` — a gray-to-white CSS gradient, not a glass surface.

**Visual consequence (confirmed, `w7a-amiga-full.png`):** The amiga stage reads as a large gray opaque slab with rounded corners — identical in appearance to the pre-W7a state except for the radius. The spec's *"glass-plate frame"* effect (the translucent glass surface that lets the substrate refract through) is NOT present. The clause (f) gate only asserts `border-radius == 16px` — it does NOT assert that a glass surface is present; thus the gate passes while the design intent is partially unmet.

**Evidence:** `AmigaScene.vue:14` + runtime `borderRadius: "16px"` probe + `w7a-amiga-full.png` (gray opaque background, no glass translucency); contrast with `SquareScene.vue:10-12` (`<Card surface="glass" tier="resting">` wrapping component, true glass surface).

**Severity:** P2 — the amiga is rounded and bordered (a clear improvement over the pre-W7a hard-edged slab), but the glass-plate visual (the opaque-to-translucent register jump other stages use) was not fully landed. The gray slab character persists. U-K4 (*"amiga floats and flashes"*) is a separate behavior defect; U-K4 is not caused by this gap.

---

### GAP-2 (P2) — D7 FONT COVERAGE: expanded dock item labels are NOT Instrument Serif; style.css comment at :42 is factually inaccurate

**Spec intent (§S2 / D7):** *"the display voice carried from the doorway inward"* — the six surface moments named in D7 are: the four `*Target.vue` headers, the square "drag me" affordance text, and the collapsed dock pill label (`.dock-scene-title`).

**Delivery form:** The collapsed dock pill label (`.dock-scene-title`) correctly uses `font-family: var(--font-display)` (`ChromeDock.vue:300`) — Instrument Serif confirmed at runtime. The four `*Target.vue` headers all use `class="text-display text-foreground truncate"` — Instrument Serif confirmed at runtime.

**Gap:** The EXPANDED dock state's scene-selector item labels (`SelectItem` spans in the scene/controls pickers) use the `dock-label` CSS utility, which resolves `font-family: var(--font-text)` (`glass-ui/dist/styles/typography.css:283`). Since the demo overrides `--font-stack-text` to `ui-sans-serif, system-ui` (`style.css:113`), the expanded dock item labels render in native system-ui, NOT Instrument Serif. This is the *"expanded dock"* font gap that U-K6 (*"the bottom dock should carry the display voice"*) and U-K8 (*"top dock expanded fonts wrong"*) both observe.

**Factual inaccuracy in style.css:** `style.css:42` states: *"text-heading, text-subheading and dock-label all resolve `var(--font-display)`"*. This is INCORRECT:
- `text-heading` → `font-family: var(--font-text)` (`glass-ui typography.css:260`) — system-ui
- `text-subheading` → `font-family: var(--font-text)` (`glass-ui typography.css:268`) — system-ui  
- `dock-label` → `font-family: var(--font-text)` (`glass-ui typography.css:283`) — system-ui

Only the `text-display*` family uses `var(--font-display)`. The spec comment at :42 conflates the display-register rungs with the text/heading registers. This inaccuracy is both a documentation error AND the root cause of the U-K6/K8 finding: the W7a spec INTENDED to suffuse the display voice through these registers but the glass-ui utilities do not route them through `--font-display`.

**Scope of U-K6/K8:** The user's complaint is specifically about the expanded dock items. W7a correctly addressed the COLLAPSED pill (D7 dock-scene-title). The EXPANDED state was not part of the D7 named surface set — but the style.css comment falsely claimed these registers *"resolve var(--font-display)"*, suggesting the intent was broader than the delivery. The gap is real and observable; the fix requires either overriding `dock-label` to use `var(--font-display)` at the kf root, or changing the expand-state SelectItem spans to use a display-rung class.

**Evidence:** `glass-ui/dist/styles/typography.css:283` (`dock-label { font-family: var(--font-text) }`); `style.css:42` (the inaccurate comment); `ChromeDock.vue:206,212,232,238` (`dock-label` on DockSelectTrigger + SelectGroup); runtime probe: expanded dock labels render system-ui at 1440×900 desktop.

**Severity:** P2 — a real typography inconsistency observable in the expanded dock (U-K6/K8). The collapsed state is correct. Fix lives at the glass-ui root (a dock-label override on `[class*="glass-dock"]`) or in the W7b/K promotion of the display voice through the expand-state chrome.

---

### GAP-3 (P2) — D18 FourierField: U-K20 preference reversal is a post-W7a new finding, not a delivery failure

**D18 was delivered as spec:** `EditorStartScreen.vue:78-83` — `FourierField` with `variant="hero"`, opacity 0.6, desktop-only (`@media (min-width: 1024px)`), in the empty home left-half vacancy. Runtime: `class="fourier-vacancy", visible: true, opacity: "0.6"` confirmed.

**U-K20:** *"REMOVE the FourierField from the hero background; grid lines slightly less opaque"* — this is a user observation from the 2026-06-11 live audit, AFTER J was closed. The FourierField was a DELIBERATE W7a delta (D18, §S4 FourierField adoption — published consume, documented rationale: the empty calm field needed a mathematical motif). U-K20 is a new preference reversal, not evidence that D18 was wrong at wave-time.

**Status:** D18 is DELIVERED per spec. U-K20 is a K-wave finding (new directive, not a J.W7a delivery failure). The FourierField must be REMOVED and the grid opacity reduced as directed by U-K20.

---

### GAP-4 (P1, behavioral — not a W7a appearance gap but affecting suffusion perception) — The cold navigation path renders blank white

**Observed:** Direct URL navigation to any non-home scene (`/#/easing`, `/#/spring`, `/#/cube`, etc.) via `page.goto(url + '#/easing')` + `waitForSelector('.glass-dock')` + `waitForTimeout(1500)` produced a pure-white screenshot for every scene. The home scene renders correctly via `navToScene`. The W7a impl's clause (a)–(h) tests all ran via `navToScene()` (which uses the scene machine's `activeScene` localStorage key and the pilot route) rather than direct hash navigation — the cold path was unexercised.

**Evidence:** `docs/tranches/K/audit/screenshots-k/easing-desktop.png`, `spring-desktop.png`, `sequence-desktop.png`, `square-desktop.png`, `cube-desktop.png`, `amiga-desktop.png` (all 1440×900, all pure white after 1500ms from direct goto). The `body font: Times` probe (browser fallback serif) confirmed the CSS was not loading at all on the cold path — the app is NOT rendered, not merely not-playing.

**Root cause locus:** The orchestrator's U-K2/K3/K5 findings point to the J.W7c U4 conditional-select deletion as a possible broken auto-binding side-effect. This is a BEHAVIOR defect on the cold path, not a W7a appearance delta. However it directly undermines the suffusion: all W7a appearance improvements (D1–D23) are invisible on the cold path because the app itself does not mount. The W7a `proof:live-session` clause (h) ran on the `navToScene`-reached state (the WARM path) and returned budget == 0 — the cold path was never in W7a's gate scope, confirming the unexercised-axis blindspot the orchestrator names.

**Severity:** P0 — product broken for a human arriving at any non-home URL directly. ALL W7a appearance work is invisible in this state. This is not a W7a delivery failure but a critical interaction defect that surfaces on the suffused tree.

---

## §4 — Font verdict: was the display-voice suffusion partial by design or by drift?

**The orchestrator asks:** Do U-K6/K8/K10 indict the W7a suffusion as partial-by-design or as drift?

**Answer: Partial by design at the EXPANDED DOCK surface, compounded by a misleading comment.**

The W7a spec named EXACTLY six display-voice surfaces for D7:
1. EasingTarget header — DELIVERED ✓
2. SpringTarget header — DELIVERED ✓  
3. SequenceTarget header — DELIVERED ✓
4. MotionPathTarget header — DELIVERED ✓
5. SquareScene "drag me" affordance — DELIVERED ✓
6. ChromeDock collapsed pill (dock-scene-title) — DELIVERED ✓

The EXPANDED dock item labels (the SelectItem text inside the scene-picker and controls-tab selectors) were NOT named in the D7 register. The W7a spec focused on *"scene identity"* moments (the stage title, the collapsed pill announcing the scene) — not the NAVIGATION AFFORDANCE labels inside the expanded picker. This was a design-scoping choice, not drift.

However, `style.css:42` inaccurately states *"text-heading, text-subheading and dock-label all resolve `var(--font-display)`"* — which is false (all three resolve `--font-text`). This comment implies the display voice was intended to reach these registers but was either not implemented or never worked. The actual situation is: the glass-ui utilities NEVER routed these to `--font-display`; the comment's author may have believed they did. This is a spec/implementation-comment error that creates the appearance of drift where the delivery was actually within the named scope.

**U-K10 ("fonts inconsistent globally")** is a broader observation that extends beyond D7's six surfaces. The W7a suffusion carries Instrument Serif to the six named moments; the rest of the UI (controls labels, dock select items, rail field labels, metadata captions) intentionally uses system-ui (the clean native sans the demo reclaims from Plus Jakarta). Whether this residual system-ui is "inconsistent" or "proportionate" is a design judgment — the spec's proportion rule and anti-goals explicitly KEPT chrome calm (`--muted-foreground`, system-ui). U-K10 likely points to additional display-voice surfaces K should address, particularly the expanded dock state.

**Verdict:** D7 is DELIVERED within its defined scope. The U-K6/K8 gap is real but falls outside D7's named surfaces. It is a K-wave design EXTENSION of the suffusion, not a J.W7a delivery regression. The style.css:42 comment should be corrected. The fix for U-K6/K8 is a K-wave dock-voice extension: override `dock-label` to use `--font-display` at the `[class*="glass-dock"]` root in `style.css` (a 2-line kf-side change, no glass-ui ask), or promote the expanded dock items to a display rung class.

---

## §5 — Glass-ui version integrity

**At W7a impl:** glass-ui `~3.9.0` (verified, `J.W7a-impl.md:14`).

**At close:** glass-ui `~3.11.2` installed (`package.json:182`; `node_modules/@mkbabb/glass-ui/package.json: "version": "3.11.2"`).

**Gap from orchestrator (U-K14):** *"upgrade to LATEST glass-ui (sliders etc.)"* — the orchestrator notes glass-ui latest is `3.13.0`; kf pins `~3.11.2`. The delta is 3.11.2 → 3.13.0 (two minor versions). All W7a-consumed published primitives (FourierField, MetricBadge, AnimatedDigit, glass-wash, display poster rungs) are still present and functional at 3.11.2 (runtime-confirmed). The 3.11.2 → 3.13.0 gap is a K-wave currency task.

**W7a consumed primitives — verified present at 3.11.2:**
- `FourierField` — `dist/fourier-field.js:11` present ✓
- `MetricBadge` — `dist/metric-badge.d.ts` present ✓  
- `AnimatedDigit` — `dist/animated-digit.d.ts` present ✓
- Display poster rungs (`text-display*`) — `typography.css:141-247` present ✓
- `glass-wash` surface — present (confirmed via backdrop-filter probe) ✓

The W7b handoff edges (`MetricHeader`, `GraphFrame`/`.bg-graph-paper`, `CurveEditorCanvas`/`GlassControlPoint`, `GlassDock` band-query) remain absent from 3.11.2 (consistent with the W7b ledger). They were also absent at 3.9.0 as documented.

---

## §6 — §Hard gate (clauses (a)–(h)) — retrospective review

The W7a impl record claims 32/32 GREEN on the `j-impl-w7a` worktree at glass-ui 3.9.0. The gate results are not re-run here (this is an audit lane, not a gate lane). However two retrospective observations:

**(a)–(g) scope:** All seven runtime clauses assert COMPUTED STYLE properties on the live page (ball-tone hue, font-family, overlap area, projected-curve `d` mutation, rail width, border-radius, substrate gradient layers). These are product-facing appearance facts. The audit's live probes confirm the same facts at 3.11.2:
- Clause (a): easing ball `rgb(230, 77, 230)` == `--rainbow-violet` ✓
- Clause (b): `dock-scene-title` computed `"Instrument Serif"` ✓; amiga stage zero display-title elements ✓
- Clause (e): sequence `[rail] 0px` + `controls-layout--railless` ✓
- Clause (f): `.amiga-canvas` `borderRadius: "16px"` ✓
- Clause (g): substrate 4-layer gradient at 80px + 16px, `--graph-major-opacity` 12% ✓

**(h) cold-path gap:** Clause (h) ran `proof:live-session` (the WARM path via `navToScene`). The cold navigation path (direct hash URL → blank white) was NOT in any clause's scope. This is the unexercised-axis blindspot the orchestrator names: the hero CTA (rainbow play → cube animating) is a cold-path interaction that no clause in (a)–(h) drives. The P0 finding in §3 GAP-4 lives in this blind spot.

**Clause (b) caveat (triage in impl record):** The impl record notes that glass-ui 3.9.0's `.labeled-field-label { font-family: var(--font-display) }` paints field labels in the display face on every scene's chrome. This is a PUBLISHED 3.9.0 register that kf inherits — not a W7a delta. At 3.11.2 this persists: field labels in the controls pane use Instrument Serif (via the glass-ui utility). This is consistent with U-K10's *"fonts inconsistent globally"* — the display face appears in both intentional moments (D7 scene titles) AND inherited chrome moments (field labels), creating a mixed-register chrome.

---

## §FOLD — finding × severity × seam × wave-class

| Finding | Severity | Seam | Suggested wave-class |
|---|---|---|---|
| GAP-1: D2 amiga glass-plate — canvas gets rounded-card directly, not a wrapping `<Card surface="glass">` component; gray opaque slab persists | P2 | `demo/app/scenes/AmigaScene.vue` + `<Card>` wrapping | K appearance-refinement (S1 amiga; add the glass wrapper component around the canvas, or accept the gradient-backdrop approach as the design) |
| GAP-2a: D7 expanded dock item labels use dock-label → font-text (system-ui), NOT Instrument Serif; U-K6/K8 | P2 | `demo/@/components/custom/dock/ChromeDock.vue` + `style.css` (override dock-label at glass-dock root) | K display-voice extension — override `dock-label { font-family: var(--font-display) }` at `[class*="glass-dock"]` in `style.css` (2-line kf-side, no glass-ui ask) |
| GAP-2b: style.css:42 comment inaccurate — claims "dock-label, text-heading, text-subheading resolve --font-display" (all three resolve --font-text) | P2 (doc error) | `demo/@/styles/style.css:42` | K housekeeping — correct the comment in the same motion as the dock-label override |
| GAP-3: D18 FourierField present in hero; U-K20 wants it REMOVED + grid lines less opaque | P2 (post-wave preference reversal) | `demo/@/components/custom/editor-shell/EditorStartScreen.vue:78-83`, `EditorShell.vue` `--graph-opacity` | K appearance refinement — remove FourierField from EditorStartScreen; reduce `--graph-opacity` slightly in design-idioms.css |
| GAP-4: Cold navigation path renders blank white (direct `/#/easing` etc.); the entire suffusion is invisible on the cold path; body font = Times (CSS not loading) | P0 | Cold-path scene mount / auto-binding (suspect: J.W7c U4 conditional-select deletion side-effect per orchestrator) | K behavior fix — the unexercised-axis hero CTA path must be the FIRST K behavior gate |
| glass-ui 3.11.2 → latest 3.13.0 currency (U-K14) | P2 | `package.json:182` | K chore — pin to ~3.13.0, re-verify W7a consumed primitives |
| W7a clause (h) unexercised cold path — `proof:live-session` only tests the warm (`navToScene`) path; hero rainbow-play CTA is unexercised by any gate | P1 (gate blindspot) | `scripts/lib/demo-driver.mjs` + `proof:live-session` scope | K gate extension — add a cold-path hero-CTA clause to proof:live-session |

---

## §7 — Screenshot index (audit witnesses)

All screenshots taken at 1440×900, built `dist/gh-pages` @ `4f1fc4c`:

- `screenshots-k/w7a-home-loaded.png` — home scene fully loaded; D7 hero display-mega ✓, D18 FourierField vacancy (subtle at this scale), substrate grid visible ✓
- `screenshots-k/w7a-easing-loaded.png` — D7 "ease" in display serif ✓, D8 AnimatedDigit "= 0.954" in violet ✓, D11 violet ball ✓, D14 readout accent ✓, D16 projected bezier ghost curve ✓, D17 grid field lines ✓
- `screenshots-k/w7a-spring-loaded.png` — D7 "SpringProgress" in display serif ✓, D8 MetricBadge xl readout ✓, D11 green ball ✓ (via W7c redesign; D21 grammar now W7c's SpringSidebar)
- `screenshots-k/w7a-sequence-loaded.png` — D7 "Sequence" in serif ✓, D12 row spectrum (pink/blue/teal/cyan-green/green) ✓, D20 ghost rail absent ✓, master playhead green ball dominant ✓
- `screenshots-k/w7a-motion-path-loaded.png` — D7 "MotionPath" in serif ✓, D11 cyan traveller ✓, D17 clean cyan-tinted plate ✓, D20 ghost rail absent ✓
- `screenshots-k/w7a-square-loaded.png` — D1 glass plate + center ✓, D7 "drag me" in serif ✓, D13 green square (--subject-teal) ✓
- `screenshots-k/w7a-amiga-full.png` — D2 rounded canvas ✓ but gray opaque slab persists (GAP-1); D3 sphere present at protagonist scale ✓; headerless (D7 amiga exception) ✓
- `screenshots-k/w7a-cube-controls-open2.png` — D5 glass-wash on controls pane (backdrop-filter confirmed) ✓; cube animating (warm path) ✓
- `docs/tranches/J/audit/design/screenshots-post-w7a/` — the W7a impl's OWN witness corpus (the post-suffusion golden, re-baselined as W7a's close motion)

---

*Audit lane: K · wave-J.W7a · 2026-06-11*
