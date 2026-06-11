# J.W7a — IMPL RECORD (the appearance-grammar suffusion · D1–D23 LANDED · clauses (a)–(h) witnessed at runtime · the visual-lock baseline RE-CAPTURED in this close motion)

- **Spec:** `J.W7a.md` (BINDING — §Scope six bands, §Hard gate clauses (a)–(h), the §S6 named-delta
  register + anti-goal proportion rule). **Branch:** `j-impl-w7a` (worktree off the tranche-j-dev sync
  `0a48411`). **Date:** 2026-06-11.
- **Status:** ALL SIX BANDS LANDED in two halves — the GRAMMAR half (`27e1479`: D1–D6, D20–D23 — ghost
  rail dead, storyboard register converged, stage plates, mobile collisions cured) + the VOICE half
  (this commit: D7–D19 — the display rungs carried inward, the `--ball-tone` seam, the projected
  bezier, the grid fields, the substrate depth, the colourful favicon). Every visual delta is NAMED in
  the §S6 register (re-stated below with its landing site); nothing un-enumerated changed appearance.
- **Witness env:** fresh `rm -rf dist/gh-pages && npm run gh-pages`; `KF_REQUIRE_BROWSER=1`,
  `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/glass-ui`; chromium 1440×900 (clause (c) at 390×844).
- **glass-ui:** consumed from PUBLISHED `~3.9.0` ONLY (package.json:175) — the poster display rungs,
  `MetricBadge`, `AnimatedDigit`, `FourierField` + `defaultBlobColorResolver`, `glass-wash`. The
  unpublished edges (`MetricHeader`, `GraphFrame`/`.bg-graph-paper`, the control-point primitive, the
  dock band-query, the case-preserving mono-caption) stay W7b ledger rows — ZERO sibling patches.

## §The COMPLETE named-delta register (the §S6 isomorphic exception, as landed)

### S1 — PROTAGONIST (grammar half, `27e1479`; D3 fix-round in the voice half)

| # | Delta as landed | Landing site |
|---|---|---|
| D1 | Square joins the I5 stage-card register — `<Card surface="glass" tier="resting" :shadow="false">` + `grid place-items-center` (SQ-3/SQ-1 cured; `rounded-card` resolves SQ-4 for free) | `demo/app/scenes/SquareScene.vue` |
| D2 | Amiga canvas joins the rounded-glass register: `rounded-card` frame + the 1px inset stage-boundary hairline (XH-3/A-07) | `demo/app/scenes/AmigaScene.vue` |
| D3 | Sphere reframed to protagonist scale — FOV 75°→50°, `camera.position.z = BOX_SIZE * 0.7` (A-02). **Fix-round 1 (voice half): bounce-aware framing** — the authored ±BOUNCE amplitude is scaled INTO the live frustum via per-axis fit factors (`refreshBounceFraming()` from the canonical camera fov/aspect/distance, recomputed on resize → the `getBounceScale` seam) so home ± scale·BOUNCE + r stays in frame at the simultaneous-worst corner; rest pose + framing untouched | `AmigaScene.vue` (`refreshBounceFraming`), `demo/amiga/useAmigaAnimations.ts` (`BounceScale` seam) |
| D4 | Shared framing baseline — easing hero rail anchors at the LOWER THIRD (`items-end` + pb rung, E2); sequence travellers step up from the recessive 1.4rem + the master playhead is the DOMINANT ball (SEQ-02/SEQ-12); spring subject at hero `--ball-size` (SP-1) | `EasingTarget.vue`→`EasingHeroStage.vue`, `SequenceTarget.vue`, `SpringTarget.vue` |
| D5 | Controls pane recedes via the PUBLISHED `glass-wash` on desktop `stageMode="subject"` (`'glass-wash rounded-card'`, C16/C2 — the chrome lighter, not smaller) | `ControlsPaneWrapper.vue` |
| D6 | Mobile hero/subject separated vertically — the hero parks in the top band + steps one φ tier below lg (H3/TYP-1); the amiga camera-space lift + subject-class detent tightening (A-01); the hero-backdrop recede band | `EditorStartScreen.vue`, `ControlsPaneWrapper.vue`, `AmigaScene.vue`, `demo/@/styles/style.css` |

### S2 — DISPLAY VOICE (voice half)

| # | Delta as landed | Landing site |
|---|---|---|
| D7 | Scene identity onto the Instrument-Serif display rungs: the four Target headers `text-heading`→`text-display` (easing/spring/sequence/motion-path); the square's "drag me" `font-mono`→`text-display` (the type IS the affordance, SQ-12); the collapsed dock pill label → the scoped `.dock-scene-title` (`--font-display` at `--type-heading`, glyph icon-sm→icon-md; the label KEEPS calm `text-foreground` — a TYPE delta only). The amiga is EXCLUDED (the binding headerless exception — clause (b) asserts it) | `EasingTarget.vue`, `SpringTarget.vue`, `SequenceTarget.vue`, `MotionPathTarget.vue`, `SquareScene.vue`, `ChromeDock.vue` |
| D8 | Live readouts promote to the PUBLISHED poster registers: spring `x` + motion-path `offset-distance` + sequence `progress` ride `MetricBadge size="xl"` (the lg siblings `v`/`tangent` quieter); the easing `f(t)=` value rides `AnimatedDigit` (damped tabular-nums) at the mono-prose rung. The header rows gain `flex-wrap` so the xl badge reflows DOWN into the card at phone widths (never starving the serif title; the XH-4 band stays one-occupant) | the four `*Target.vue` |
| D9 | Home subtitle steps ONE φ-rung (`text-title`→`text-heading`, italic kept — hero:subtitle ≥5:1, H2). The 404/empty display-mega half is **DISPOSED — surfaceless** (fix-round 1, spec row D9 annotated): the hash router's catch-all redirects unknown routes home (`router.ts:31`); no in-app 404/empty text surface exists to carry the voice; revives only if such a surface is ever born | `EditorStartScreen.vue`; spec `J.W7a.md` D9 row |

### S3 — COLOUR (voice half)

| # | Delta as landed | Landing site |
|---|---|---|
| D10 | `.progress-ball`/`.progress-rail` parameterized by ONE hue var — `var(--ball-tone, var(--color-progress))` on fill + glow + rail tint (the `--badge-tone` twin, finally cut). Fallback form, NOT self-declaration: consumers set the token on an ANCESTOR (stage root / row) and a self-declaration would shadow the cascade | `design-idioms.css` §rail-ball |
| D11 | Per-scene hue = icon hue, ONE token per scene: easing `--ball-tone: var(--rainbow-violet)` (`.easing-target`, cascades to ball + muted comparison tint + active track label); motion-path `var(--rainbow-cyan)` (`.mp-target` — traveller + guide + tethers + handles + readout, one cyan voice); spring binds EXPLICITLY to `var(--color-progress)` (the icon's rest dot IS green — the identity declared, not accidental) | `EasingTarget.vue`, `MotionPathTarget.vue`, `SpringTarget.vue` scoped styles |
| D12 | Sequence five rows onto the icon's ascending spectrum — `ROW_TONES` violet/blue/cyan/`color-mix(in oklab, cyan 45%, green)`/green (the bridge stop token-derived, never a new literal); each row sets the ONE `--ball-tone`; rail + traveller + start-handle wear the row stop; the MASTER (scrub ball, swept playhead, header readout) stays canonical clock green | `SequenceTarget.vue` (`ROW_TONES`, `.seq-target`) |
| D13 | `aquamarine` DIES → the owned `--subject-teal: #52e898` token (the EGG_HUES terminal stop — the tumble egg settles INTO the box's own rest hue by construction); the ink derives from the same token (`color-mix(in oklab, … 25%, black)` — AA on the fill in both themes) | `design-idioms.css`, `SquareScene.vue`, `demo/square/useSquareAnimations.ts` |
| D14 | The live readout VALUE wears the scene accent — `.readout-accent { color: var(--ball-tone, …) }`; labels stay `--muted-foreground` (easing eased value, spring sweep sample, sequence playhead value) | `design-idioms.css`, the `*Target.vue` readout spans |
| D15 | The COLOURFUL cube reaches browser chrome: favicon.svg re-authored as the 3-face flat-colour cube (magenta/yellow/red, the nav glyph's own hexagon — survives 16px, no prefers-color-scheme stroke swap needed); `<meta name="theme-color" content="#ff00ff">`; checked-in 180px `apple-touch-icon.png` (PNG — iOS ignores SVG) | `assets/icons/favicon.svg`, `demo/app/index.html`, `demo/app/public/apple-touch-icon.png` |

### S4 — MATH (voice half; W6-3 discharged)

| # | Delta as landed | Landing site |
|---|---|---|
| D16 | The easing stage projects its OWN bezier across the floor — a low-opacity (8%, `--ppmycota-primary`) scaled SVG of the SAME single-source `demo.svgPath` the sidebar canvas renders, spanning frame-top to the rail line; a handle drag re-emits the computed and the projected `d` mutates in lockstep (clause (d)) | `demo/easing/EasingHeroStage.vue` (colocated extraction — markup + painter + curve CSS travel together; the proof:demo-no-oversize seam, zero appearance delta from the split itself) |
| D17 | Coordinate-grid stage fields, kf-LOCAL token-clean: `.stage-field-y` (value gridlines at the 0.25/0.5/0.75 quarter marks + t-axis baseline, the curve canvas's own `--border` hairline language) under the easing floor; `.stage-field-x` (time/position quarter ticks) on the spring rail + sampler + the sequence playhead track; the motion-path stage trades the raw global crosshatch for the clean scene-tinted plate (`color-mix(… var(--ball-tone) var(--stage-field-tint, 4%), var(--background))`, OPAQUE, rounded on `--radius-card`) — MP-I1/MP-OPP1 | `design-idioms.css` (`.stage-field-*`, `--stage-field-tint`), `EasingHeroStage.vue`, `SpringTarget.vue`, `SequenceTarget.vue`, `MotionPathTarget.vue` |
| D18 | `FourierField` (PUBLISHED 3.9.0 consume) in the home doorway's empty left-half vacancy — `variant="hero"`, seed `"keyframes.js"`, colour through the `--ball-tone` seam via the REQUIRED `defaultBlobColorResolver`; low presence (opacity 0.6), desktop-only (`@media (min-width: 1024px)` — at phone widths the band belongs to the D6 split), parked below the hero ladder, never over the subject | `EditorStartScreen.vue` (`.fourier-vacancy`) |
| D19 | **W6-3 DISCHARGED** — the substrate's 0.10α corner-tick data-URI (+ its duplicated dark twin) REPLACED by two-tier engineering graph paper: fine `--graph-pitch` (1rem) + major `--graph-major` (5rem) lines, mixed over `--foreground` (dark retints from the SAME rules — the dark data-URI dies with its twin); `--graph-major-opacity` 12% deliberately above the former 0.10α floor (clause (g)) | `EditorShell.vue` `.grid-background`, `design-idioms.css` `--graph-*` tokens |

### S5 — GRAMMAR (grammar half, `27e1479`)

| # | Delta as landed | Landing site |
|---|---|---|
| D20 | The ghost rail DIES — `hasControlSurfaces` threaded from the App's machine projection; the empty-DFA scenes (sequence/motion-path, `CONTROL_SURFACES = []`) take `controls-layout--railless` → `--rail-track: 0px` regardless of the stored open flag (the COLLAPSE arm); the mobile sheet axis untouched; the playground (non-App host) defaults TRUE | `AnimationControlsGroup.vue`, `useSceneMachineApp.ts`, `App.vue` |
| D21 | The storyboard register CONVERGES — the spring's full left-rail playback panel grammar dies; the rail panel content moves to `SpringSidebar.vue` (the rail playback card); spring/sequence/motion-path share ONE storyboard control grammar | `SpringScene.vue` (−60L), `demo/spring/SpringSidebar.vue` (new) |
| D22 | The top-center band contract — the mobile stage cell reserves the REAL scene-switcher band (`padding-block: var(--dock-top-band-reserve)`, anchor + depth, symmetric per the G8 one-envelope contract); the spring view switcher RELOCATES out of the band into the sidebar; the D8 header strips wrap DOWN into the card, never up | `AnimationControlsGroup.vue`, `style.css` (band tokens), `SpringSidebar.vue` |
| D23 | The playback affordance converges to the canonical pair (rail playback card + bottom-dock rainbow group-play) — the sequence in-stage flat text-row transport retired; the `playback-button.css` import retired WITH it | `SequenceTarget.vue` |

**Anti-goals held (the proportion rule):** the amiga stage carries ZERO display type (clause (b)
witnessed); the chrome (two-card rail, dock/menubar, collapsed-pill LABEL, glass borders) stays calm
`--muted-foreground` (the D7 pill delta is type-only); GOLD spent nowhere new; no watermark behind the
motion-path/easing live geometry (the D16 ghost sits BEHIND its own subject at 8%, the lane-named
presence); FourierField in the EMPTY field only; the group-play rainbow disc remains the loudest note.

## §Runtime-assertion results (clauses (a)–(h), computed on the live built dist)

Probe: chromium 1440×900 over `dist/gh-pages` via `serveDist`/`navToScene` (J.W3 harness); clause (c)
at 390×844. **32/32 GREEN** (clause-mapped; exact computed values):

- **(a) `--ball-tone` == icon hue per routed scene** — easing hero ball bg `rgb(230, 77, 230)` ==
  resolved `--rainbow-violet` AND != default green `rgb(33, 196, 93)` (tone `#e64de6`); motion-path
  traveller `rgb(26, 230, 230)` == `--rainbow-cyan`; spring ball `rgb(33, 196, 93)` ==
  `--color-progress` (the declared bind); sequence master scrub ball canonical green with the five
  rows computing EXACTLY `rgb(230,77,230)` / `rgb(48,140,232)` / `rgb(26,230,230)` /
  `oklab(0.802491 -0.166069 0.0579804)` (the token-derived bridge mix) / `rgb(38,217,68)` per
  ROW_TONES; square box `rgb(82, 232, 152)` == `--subject-teal` (aquamarine `rgb(127,255,212)` DEAD);
  cube/amiga ball census: zero off-default tones (no stray accent). Readout accents wear the scene
  tone (easing `.readout-accent` color `rgb(230, 77, 230)`).
- **(b) the display register at the named moments** — computed font-family resolves
  `"Instrument Serif", "Instrument Serif Fallback", Georgia, serif` AND
  `document.fonts.check('16px "Instrument Serif"') == true` at ALL SIX moments: the four Target
  headers, the square's "drag me", the cube collapsed dock pill `.dock-scene-title` (text "Cube").
  **The amiga headerless exception HOLDS**: zero visible `[class*=text-display]` elements + zero
  Instrument-Serif leaf elements in the STAGE region on the amiga route. *Caveat triaged:* glass-ui
  3.9.0's PUBLISHED `.labeled-field-label { font-family: var(--font-display) }` (utilities.css:45-46)
  paints the controls-pane field labels in the display face on EVERY scene — a sibling-published
  chrome register, not a W7a delta; likewise the pre-W7a tranche-D `.btn-playback` serif
  (playback-button.css:22, `905a8c3`) on the rail playback card. Both are CHROME, not stage titles;
  the clause's product-facing region (the stage) is clean.
- **(c) 390×844 hero/subject overlap == 0** — home hero h1 rect y 75.8–178.1 vs cube subject rect y
  405–696: intersection area == 0 (both render). The amiga mobile-open path captured
  (`amiga-mobile-open.png` — sphere clear above the sheet boundary).
- **(d) the projected curve PRESENT + MUTATING** — `.easing-stage-curve-path` non-empty `d`
  (461 chars, distinct element from the sidebar `.bezier-path`); a REAL pointer drag on sidebar
  handle[data-index=0] mutated BOTH the sidebar `d` and the projected stage `d` (stageMoved=true,
  sidebarMoved=true — the single-source `demo.svgPath` binding witnessed).
- **(e) the ghost rail ABSENT** — sequence + motion-path: `gridTemplateColumns` computes
  `[rail] 0px [stage] 1353.59px`, `.controls-layout--railless` present, `.controls-pane-wrapper`
  measured width 0.
- **(f) amiga rounded-glass** — `.amiga-canvas` computed border-radius `16px` == resolved
  `--radius-card` (16px), != 0.
- **(g) substrate-depth legibility (W6-3)** — `.grid-background` computes FOUR gradient layers at
  sizes `80px 80px, 80px 80px, 16px 16px, 16px 16px`; `--graph-major-opacity` 12% > the former 0.10α
  floor; `--graph-opacity` 5%. W6-3 exits J on this runtime fact — never deferred again.
- **(h) `proof:live-session` budget == 0** — the full battery on the post-W7a tree: ERROR BUDGET = 0
  across PLAY + SWITCH + DRAG (zero pageerror/`_gen`/`"......"`/console.error; zero promoted charges);
  B1 cube draw loop live (101 distinct transforms), B2 zero `_gen` throws, B4 easing canvas
  handle-drag mutates, B3 amiga centre-drag moves the SUBJECT (centreMAD 47.8 / peripheryMAD 0),
  B6 square drag selects no text + persists, B7 zero rest bloom (23 glass surfaces), B9 5/5 glyphs
  paint, body font not Plus Jakarta. Desktop + mobile probe sessions: pageerror count 0.

**Adjacent gates re-witnessed on the suffused tree:** `proof:demo-no-oversize` PASS (the
EasingHeroStage + DemoGlobalChrome colocated extractions — the fix-round seam; the keyboard-scrub
helpers consolidated into `useAnimationGroupPlayback`, the registerShortcut BINDINGS staying in the
host); `proof:idioms` PASS (see §gate-evolutions), `proof:styling-idioms` / `proof:icon-idiom` /
`proof:phi-leaf-zero` / `proof:hero-rung` / `proof:easing-stage-is-ball` / `proof:dogfood-hero` /
`proof:demo-elevate` PASS; vitest 77 files, 751 passed (+3 expected-fail).

## §The visual-lock RE-CAPTURE (the close motion — T3 honest by construction)

`node scripts/proof-visual-lock.mjs --update-baseline` on the post-suffusion `dist/gh-pages` → **47
baseline PNGs** re-captured to `scripts/baselines/visual-lock/` (13 region×state cells genuinely
absent, the writer-symmetric skip set). `npm run proof:visual-lock` then **PASS against the fresh
baseline — twice consecutively** (47 regions diffed, worst in-budget mismatch 0.03%). The re-captured
corpus COMMITS WITH this wave; J.W7b re-baselines nothing.

**Baseline-reconciliation deltas (each a consequence of a NAMED register row):**

- `sequence-desktop-open-controls.png` + `motion-path-desktop-open-controls.png` **DELETED** — D20
  killed the region itself (the empty-DFA desktop rail no longer renders a controls pane); a stale
  baseline for a by-design-absent region would red the gate's no-capture quadrant forever.
- **MASK_SUBJECTS + `.demo-box`** — the square's engine-SPRING-positioned subject was the one live
  engine subject the original list missed; its rest pose lands at a run-dependent few-px offset on the
  mobile-open re-seat (measured 11.9% same-tree flap). Container-level doctrine, same as
  `.cube`/`.hero-track`; the teal/serif FACTS stay runtime-asserted by clauses (a)/(b).
- **MASK_SUBJECTS + `.preset-track`** — the canonical-spring preview balls sweep an unmasked row
  track; the ball-only mask leaves the header-documented edge halo (measured 0.5009% — at the budget
  boundary).
- **`TOLERANCE_MIN_PX` 40 → 500 (measure-first re-bind)** — the in-process noise floor measures
  0.2399% (under the 0.5% fraction budget), but CROSS-PROCESS runs (fresh browser per run — how
  baseline + gate actually execute) carry 1px full-width reflow lines + the transport's Play/Pause
  mount-race label on the SMALL ribbon region: measured 453px = 1.05% of ~43k px, where 0.5% ≈ 217px —
  LESS than one 1px line. The absolute floor (the gate's own anti-flap term) moves to 500px; a real
  small-region regression moves thousands of px AND tens of percent — both ANDed terms still red hard;
  large regions remain fraction-bound.

## §Gate-evolutions (stale predicates evolved to the spec-mandated grammar — bites preserved)

- **`proof-idioms.mjs` [rail-ball]** — the clause read the PRE-seam literal
  `background: var(--color-progress)`; D10 (the BINDING J.md §MANDATE seam) is
  `background: var(--ball-tone, var(--color-progress))`. The predicate now reads the SEAM form —
  still a solid single-var fill anchored on `--color-progress`; dropping the canonical default or
  re-promoting the conic playing-ring still reds.
- **`proof-visual-lock.mjs`** — the two mask rows + the measured `TOLERANCE_MIN_PX` re-bind above
  (all at the gate's own documented seams: the MASK list + the measure-first budget).

## §Screenshots (the post-suffusion witness corpus, committed)

- `docs/tranches/J/audit/design/screenshots-post-w7a/easing-desktop.png` — D7 serif title, D8
  AnimatedDigit readout, D11 violet ball, D14 accent, D16 projected bezier, D17 field
- `docs/tranches/J/audit/design/screenshots-post-w7a/motion-path-desktop.png` — D7/D8 xl badge,
  D11 cyan voice, D17 clean plate, D20 railless reflow
- `docs/tranches/J/audit/design/screenshots-post-w7a/sequence-desktop.png` — D7/D8, D12 row spectrum
  vs green master, D20, D23 converged transport
- `docs/tranches/J/audit/design/screenshots-post-w7a/square-desktop.png` — D1 plate + center, D7
  "drag me", D13 `--subject-teal`
- `docs/tranches/J/audit/design/screenshots-post-w7a/amiga-desktop.png` — D2 rounded glass + hairline,
  D3 protagonist sphere, the headerless silence
- `docs/tranches/J/audit/design/screenshots-post-w7a/home-mobile.png` — D6 hero/subject separation
  (clause (c) geometry)
- `docs/tranches/J/audit/design/screenshots-post-w7a/amiga-mobile-open.png` — D6/A-01 sphere above
  the sheet
- `scripts/baselines/visual-lock/*.png` (47) — the re-captured golden corpus itself (every scene ×
  {375, 1440} × {closed, open} × named region, PRM + masked)

## §W7b boundary honesty (inv-16)

W7a consumed ONLY published 3.9.0 primitives. The unpublished edges remain booked in
`glassui-AX-handoff.md` for W7b: `MetricHeader` (the four byte-similar stage headers → one
primitive), `GraphFrame`/`.bg-graph-paper` (the kf-local `--graph-*`/`.stage-field-*` promotion),
the `CurveEditorCanvas`/`GlassControlPoint` primitive, the `GlassDock` reserved-band query, the
case-preserving mono-caption. One OBSERVED sibling fact recorded for the W7b ledger (not patched
here): glass-ui's published `.labeled-field-label` paints field labels in the display face — flagged
under clause (b)'s triage above as a 3.9.0-published register kf inherits on every scene's chrome.
