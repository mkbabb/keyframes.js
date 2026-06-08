# Tranche H — THE PROMPT-RECAP (the H-CLOSE ask→disposition ledger)

**Lane:** H.WZ Lane B — the H prompt-recap. **Branch:** `tranche-h-impl` (19 commits ahead of
`master`; W8 the close keystone at `1f506b2`). **Scope:** EVERY user request across Tranche H →
its disposition (**ADDRESSED** + where, or **HANDOFF** born-RED). This is the H-specific recap;
the whole-engagement A→G chain is carried by `audit/_SYNTHESIS-prompt-recap.md` (which this lane
does NOT re-derive — it is the authoritative A→G half). This file is the HONEST H ledger:
**no drops**, every deferral with a real disposition (CLOSED via SYSTEM gate / born-RED HANDOFF /
ARCH-kill), and the two genuine forks (F6 remove-specular; the W8R glass-stage-sheen) recorded as
USER-DECISIONS.

**Status legend.** ADDRESSED (landed + committed, cites the wave/commit) · HANDOFF (a sibling
repo owns it under inv-16 — kf consumes published, never forks/patches; PAIRED with a born-RED kf
gate so it can't become a silent punt) · USER-DECISION (a genuine fork the user adjudicated) ·
GATE (the falsifiable instrument that locks it).

**The H shape.** H is a USER-AUDITED-DEFECT tranche driven across FIVE feedback rounds on the
LIVE demo: the original charter audit (D1–D14, the 13 implementation waves), then four live
refinement rounds the user observed AFTER waves landed — round-2 **F1–F9** (W9), round-3
**G1–G8** (W10) + the icon **RE-INSTANTIATION** correction, round-3 **I1–I12** (W11/W12),
round-4 **J1–J6** easing-minimalism (W12) — plus the W8R **SPECULAR DECISION** ("keep glass +
handoff the sheen"). The LIBRARY engine stayed FENCED (inv ζ) save one W0 crash-fix; the bulk of
H is the unpublished DEMO. **No request is dropped.**

---

## §0 — The grounded close facts (the spine every row rests on)

- **13 implementation waves landed + committed** (the charter mandate): W0 (console crashes) · W1
  (the scene+playback FSM keystone) · W2 (cartoon design language) · W3 (rail·stage·rail) · W4
  (easing/hero/icon) · W5 (scene icons + Discrete→Spring merge + perf) · W6 (typing-dots) · W7
  (mobile overlay + drawer) · W9 (round-2 F1–9) · W10 (round-3 G1–8 + icon re-instantiation) ·
  W11 (round-3 I1–12: glass-card stages + control-surface DFA) · W12 (I3/I8–12 + J1–6
  easing-minimal + enrichment + eggs) · W8 (the gate-regime close — the durability keystone).
- **The four chronics — final state** (the H repair = the chronic-closure meta-gate, so none can
  re-paper): **cartoon-shadow D2** → CLOSED via SYSTEM gates (`proof:no-orphan-specular`
  partitioned + `proof:cartoon-is-panel-depth` + `proof:glass-and-cartoon`); **φ-hero D7** →
  CLOSED via `proof:phi-leaf-zero` + `proof:hero-rung` SYSTEM gates; **mobile D10** → CLOSED via
  `proof:mobile-single-page` + `proof:drawer-spring`; **dock D5** → CLOSED via
  `proof:dock-morph-settled` GREEN (the consumed glass-ui `~3.5.1` retune). **`proof:chronic-closure`
  (the meta-gate) is GREEN** (`scripts/proof-chronic-closure.mjs`).
- **The cross-repo HANDOFFs** (born-RED, inv-16): (1) the glass-ui Card-specular SHEEN on the
  sanctioned glass stages — the W8R decision "keep glass + handoff the sheen"; rides
  `proof:specular-handoff` born-RED; resolves at glass-ui 3.8.0 `specular="off"` (kf's W34
  consumer-adoption leg; cosmetic). (2) value.js / parse-that slices (standing). (3) the deploy
  leg (CF Pages keyframes.babb.dev — user-domain).
- **SEMVER.** The LIBRARY public API (`src/animation/index.ts`) is UNCHANGED vs master; the only
  library-touching change is the W0 `frame-compiler.ts` blank-selector hardening (a cryptic
  value.js crash → a typed `AnimationOptionError` — a BUGFIX) → npm **PATCH (4.1.0 → 4.1.1)**. The
  DEMO (the bulk of H, unpublished, `files:["dist"]`) deploys to CF Pages separately, NOT an npm
  bump. `env.d.ts` is demo-only.

---

## §1 — THE ORIGINAL H CHARTER MANDATE (D1–D14 → the 13 waves)

The user drove the live demo at kf 4.1.0 and reported 14 concrete observed defects (the prompt
named "D1–D11"; the live audit reported the full **D1–D14** — D1–D11 ⊂ D1–D14, a low-water
reference, NOT a scope cut). Each maps to its owning wave + a falsifiable gate.

| # | The observed defect (charter) | Wave | How addressed | GATE |
|---|---|---|---|---|
| **D0** | Two live console crashes (`serializeEasing`; the `"......"` lerp) ship in 4.1.0 — must die first | **W0** | killed both; `frame-compiler.ts` blank-selector → typed `AnimationOptionError` (the one LIBRARY-touching change, a BUGFIX → PATCH 4.1.1) | `proof:demo-console-clean` |
| **D1** | Controls sidebar TWO columns — should be ONE | **W3** | rail·stage·rail one-grid one-`--rail-width`; one self-contained row per field, single-column stack | `proof:single-column-pack` |
| **D2** | RADIAL BLUR on hover everywhere — should be CARTOON SHADOWS (cartoon-shadow CLOSED in C, regressed) | **W2** | panels flip to `surface="cartoon"`; the radial dies at source; manual `.glass-card` plate deleted (no legacy beside replacement). **CHRONIC — CLOSED via SYSTEM gate** | `proof:cartoon-is-panel-depth` + `proof:no-orphan-specular` |
| **D3** | Cubic-bézier / easing editor too MASSIVE; inner border touches header; header too small | **W4** | canvas capped + container-queried (680² → bounded square); header rung to `text-title`; nested-panel touch fixed | `proof:easing-canvas-bounded` |
| **D4** | Timeline scrubber / PlaybackRibbon FULL-WIDTH — should match the controls sidebar | **W3** | ribbon bound to the `--rail-width` token; the stage grid-track tightened | `proof:timeline-rail-width` |
| **D5** | DOCK animations broken/slow/LAGGY | **W8 (consume) + W2/W3** | the dock-spring retune (`53c1b07`) CONSUMED at glass-ui `~3.5.1` (installed 3.5.1); `--spring-dock` ramp peak +16.3% → +4.5%. **CHRONIC — CLOSED via passing SYSTEM gate** (reads `node_modules`; inv-16, kf cannot fork-to-green) | `proof:dock-morph-settled` (≤+6%, GREEN) |
| **D6** | TYPING DOTS ("...", dot-fade) totally broken | **W6** | hero splits by WORD ("..." one token); single 2.6s pulse; dogfoods the engine `steppedEase`/`SpringProgress` (inv ζ — the hand-rolled CSS dies) | `proof:typing-dots` |
| **D7** | HERO ("Select an animation") larger + GOLDEN (φ-ladder); audit φ across demo | **W4** | `text-display-4 → text-display-mega` (86px → ≥140px @1440); φ-spaced rhythm; raw `text-*` rungs swept. **CHRONIC — CLOSED via SYSTEM gate** | `proof:hero-rung` + `proof:phi-leaf-zero` (hero rung AND 0 raw rungs) |
| **D8** | Scene-nav Spring/Sequence/Path/Discrete have NO icons; audit pertinence | **W5** | `icon` moved onto `SceneDescriptor` (DRY — the dock split-identity map deleted); SVG family via `vite-svg-loader ?component`; **Discrete→Spring MERGED**; all four modes KEPT | `proof:scene-contract-identity` + `proof:scene-icons` |
| **D9** | @mbabb logo popover (dark-mode + about) no longer opens — RESTORE (tied to D5) | **W1** | kf-side WIRING regression (NOT glass-ui): the `DropdownMenu` folded into `ChromeDock`'s `openPopup` mutex; the un-double-wrap | `proof:dock-popover-opens` + `proof:single-toggle` |
| **D10** | MOBILE perfected — SINGLE PAGE, affixed top+bottom docks, page contextual by mode, bg = the animation area | **W7** | full-bleed animation background as the mobile backdrop; OVERLAY controls; the dock occlusion stays glass-ui-HANDOFF (never re-masked — drift-2 lock). **CHRONIC — CLOSED via SYSTEM gate** | `proof:mobile-single-page` + `proof:dock-zorder` |
| **D11** | Surviving modes MORE INTERACTIVE (clickable/draggable, like the cube orbital drag) | **W5 + W12** | per-mode interactivity (W5); grab bézier/path/sequence on the shared `useDragScrub` seam (W12 I3/I8). Gated DOWNSTREAM of the D12 FSM | `proof:scene-control-dfa` + the I3 interaction gates |
| **D12** | SCENE-STATE CORRUPTION + state machine (**CRITICAL**) — easing→cube→back leaves controls invalid; play/pause not restored/suspended; want a ROBUST FSM + store | **W1** | the keystone: a formal `useSceneMachine` (`@vueuse/core` `createGlobalState` + pure `transition(state,event)` reducer; `idle\|loading\|playing\|paused\|suspended`); the heuristic double-fire codec + bare `Map` store DELETED; fail-explicit per transition; suspend-on-leave / full-resume on `SCENE_READY` | `proof:scene-machine-irrefragable` + `proof:single-writer` + `proof:scene-perf-budget` + `proof:scene-raf-leak` |
| **D13** | MOBILE DRAWER collapse/expand NOT springy + too SLOW | **W7** | the drawer dogfoods `SpringProgress` (inv ζ — not the CSS `linear()` token); the snappier curve | `proof:drawer-spring` |
| **D14** | The "SPECULAR RADIAL" hover needs TOTAL REFINEMENT (glass is GOOD; refine the specular, reconcile with cartoon-shadow) | **W2 → W9 → W8R** | W2 wired a calmed catch-light; F3/F6/F8 (W9) then REMOVED the tracked specular (the calm register); the resting catch-light on the sanctioned glass stages is the W8R glass-ui-HANDOFF | `proof:specular-handoff` (born-RED, glass-ui-owned) |

**The standing-mandate items of the H charter ask:**

| Item | Disposition |
|---|---|
| **H-recap** (recap ALL prompts A→H) | **ADDRESSED** — `audit/_SYNTHESIS-prompt-recap.md` (A→G chain) + THIS file (the H ask→disposition ledger). No drop. |
| **H-precept** (confirm precepts honored, flag drift) | **ADDRESSED** — §6. The spine held; the one prior-tranche drift (the D12 heuristic state machine) is repaired by W1. |
| **H-deferred** (fold the whole-history deferred ledger; honest closure) | **ADDRESSED** — `PROGRESS.md §"Open deferrals"` (the canonical chronic table); the four chronics get PRODUCT-level terminals; `proof:chronic-closure` polices the PRODUCT, not the column. |
| **H-dock-note** (glass-ui's AW tranche owns the dock — AUDIT + TAG glass-ui-HANDOFF, do NOT patch glass-ui in kf) | **HONORED** — D5-lag consumed via the published `~3.5.1` bump (no kf-side spring fork); the ONLY kf-side dock fix is D9 (genuinely kf-domain wiring). |
| **H-version-owner** (name the version owner for the stacked changeset) | **Mike Babb** — the npm changeset PATCH (4.1.0 → 4.1.1) stacks atop the clean 4.1.0 base (USER-DOMAIN; the LEAD cuts it). |

---

## §2 — ROUND-2 FEEDBACK F1–F9 (W9 — the design-language refinement round 2)

The user's 9 live-observed feedback items on the landed demo. Folded as the corrective wave H.W9
(SUPERSEDES the specific W2/W3/W4 decisions it revises, each supersede CITED). **The headline:
F3+F6+F8 collapse into ONE register decision** — keep `surface="cartoon"`, drop panels to
`tier="quiet"` (recover the 0.50 α glass), and REMOVE the tracked specular. Net-deletion + a
NAMED prop.

| # | Request | Wave | How addressed (supersedes) | GATE |
|---|---|---|---|---|
| **F1** | Controls row: label-LEFT / value-RIGHT, ONE column | W9 | intra-row `grid-cols-[auto_1fr]` at the ROW level, one-column stack preserved (supersedes W3.S1's accidental flatten); HANDOFF: `LabeledField orientation="horizontal"` | `proof:single-column-pack` AMENDED (`labelRect.right ≤ controlRect.left`) |
| **F2** | Cubic-bézier panel must NOT scroll + bake the back into the header right | W9 | fit the panel (no scroll); back baked into the CardHeader right (supersedes the W4.S1/S2 sizing band) | `proof:bezier-no-scroll` NEW |
| **F3** | Specular WAY too dramatic | W9 | **REMOVE the tracked specular** (collapses into F6 — the user's own lean) (supersedes W2.S3) | (see F6) |
| **F4** | ppmycota: lead with the proper pp logo SVG, drop the emoji | W9 | dropped the emoji `<p>`; the existing `.ppmycota-logo-sm` SVG is the identity (no asset hunt — it already renders) | `proof:pp-logo-svg` NEW (static) |
| **F5** | Dark-mode dock item: the WHOLE row toggles | W9 | row-level `@click="toggleDark()"` + `<DarkModeToggle passive>` indicator (mirrors the ppmycota row; no glass-ui change) | `proof:darkmode-row-toggle` NEW |
| **F6** | Specular only on the bezier card → CONSISTENT or REMOVE | W9 | **REMOVE the tracked specular entirely** (supersedes W2.S2-COMPOSITE); cartoon + quiet glass is the calm material. **USER-DECISION — the one genuine fork (see §5)** | `proof:no-orphan-specular` INVERTED (exception `{bezier}` → ∅); `proof:cartoon-specular-coexist` + `proof:specular-calm` RETIRED |
| **F7** | Cartoon hover box-shadow SHARP + cut off bottom-LEFT | W9 | symmetric `.controls-content` left clearance (keep the load-bearing `overflow:hidden` rail-collapse clip; give the shadow room inside) | `proof:cartoon-shadow-unclipped` NEW |
| **F8** | Cards not as glassy as before the box-shadow: glass + cartoon TOGETHER | W9 | `tier="quiet"` on every panel Card (recover the 0.50 α plate) + cartoon depth (supersedes W2.S1's implicit `resting` tier) | `proof:glass-and-cartoon` NEW; `proof:cartoon-is-panel-depth` stays GREEN (tier-agnostic) |
| **F9** | Restore the controls idle-fade (~10s no-engagement → much more transparent) | W9 | re-authored via `@vueuse/core` `useIdle(10_000)` consuming the still-wired `usePaneHover`; `:focus-within` + PRM guard (a NAMED a11y improvement over the historical form) | `proof:idle-fade` NEW |

**F-round glass-ui HANDOFFs (inv-16, born-RED kf gate paired):** F1 `LabeledField
orientation="horizontal"` (the durable label-left home); F8 OPTIONAL `surface="cartoon"
tier="quiet"` preset/alias. (Tracked in `glass-ui-AX-handoff.md` G-3 / G-6.)

---

## §3 — ROUND-3 FEEDBACK G1–G8 (W10 — scene normalization + the icon RE-INSTANTIATION)

The user's 8 live items. **The through-line:** G2/G3/G4/G5/G6/G7/G8 are ONE root cause wearing
six faces — the easing/spring scenes DIVERGED from the standard cube/amiga controls component +
the rail·stage·rail layout. NORMALIZATION onto the standard component is the gestalt fix (REUSE,
do not fork). G1 is the separate icon axis — and carries the binding RE-INSTANTIATION correction.

| # | Request | Wave | How addressed (supersedes) | GATE |
|---|---|---|---|---|
| **G1** | Recover the EXPRESSIVE, COLORFUL icons; new ones for the other primitives in the same way | W10 | the **ICON RE-INSTANTIATION correction** (below) — re-instantiate the 4 originals 1:1, author 3 NEW colorful SVGs for the lacking primitives (reverses W5.S2 monochrome) | `proof:scene-icons` REVISED (monochrome→expressive-colorful + re-instantiation faithfulness) |
| **G2** | A card is NOT rounded | W10 | dissolves into G8's full-bleed stage (no card to round) / the Card-component sidebar (inherits `rounded-card`) — REUSE the glass-ui `<Card>` primitive, no ad-hoc `rounded-*` | `proof:scene-card-rounded` NEW |
| **G3** | Playback buttons bespoke + don't match the standard controls → match EXACTLY + RE-USE that component | W10 | surface the easing animation into the group → the standard `PlaybackRibbon` mounts (byte-identical to cube); the hand-rolled `ribbonContent` PLAYBACK transport deleted; Play/Reverse (Reset owned by the dock) | `proof:scene-uses-standard-ribbon` NEW |
| **G4** | "Singular" duplicates the curve; the stage = ONE large engine ball | W10 | the `singular` stage = one large engine-driven ball under the selected easing (inv ζ dogfood); the duplicate stage `EasingCurveCanvas` deleted (supersedes W5.S4) | `proof:easing-stage-is-ball` NEW |
| **G5** | The easing sidebar controls should be LARGER | W10 | closed by G6 — adopting the standard rows lifts the sizing to the standard rung automatically (DRY) | folds into `proof:easing-sidebar-normalized` |
| **G6** | Too many inner-containers; FLATTEN + use a NORMALIZED component | W10 | ONE `Card surface="cartoon" tier="quiet"` + `Labeled*` rows; the ×3 inner sub-Cards deleted (NAMED amendment to W9 S1) | `proof:easing-sidebar-normalized` NEW |
| **G7** | Pause/Reset (and Reverse) buttons same width + height | W10 | dissolves into G3 — the standard ribbon's `grid-cols-2` + shared `.btn-playback` skin makes them equal by the layout idiom (no per-button magic number) | folds into `proof:scene-uses-standard-ribbon` (equal-dims clause) |
| **G8** | The easing area CLIPS INTO THE DOCKS — a LAYOUT-PRIMITIVE change, no overfit | W10 | the `[stage]` track becomes the SINGLE dock-safe containment primitive (reserve the bands via the EXISTING tokens, delete the per-scene `dock-inset`); easing/spring stage → full-bleed like cube/amiga (supersedes the W3 stage-track form). **NOTE: G8's full-bleed SURFACE is immediately superseded by I5 (W11) — the `.stage-cell` PRIMITIVE survives** | `proof:stage-within-docks` NEW/AMEND |

### The ICON RE-INSTANTIATION correction (G1, the binding clarification)

The user's exact direction: *"I don't want the icons re-created. I want them re-instantiated. The
only new icons should be for those that lack them. If they are to be converted to SVG, they should
be done so 1-1."*

- **RE-INSTANTIATE the 4 originals 1:1 (verbatim from `084feb9`):** `cube`/`amiga`/`square` (the
  colorful `-icon-sm.png` rasters) + `easing` (the original `hsl(248,88%,71%)` violet
  `easing-icon-sm.svg`, NOT W5's `currentColor` monochrome flip). The W5 hand-authored monochrome
  stroke geometry is DISCARDED for these four — they return EXACTLY, not re-drawn.
- **NEW icons ONLY for the 3 that LACKED one** (wore `<Home>` pre-W5): `spring`, `sequence`,
  `motion-path` (`starting-style` merged into `spring`). Drawn to MATCH the re-instantiated four
  (expressive/colorful, not monochrome).
- **Raster→SVG only if 1:1-faithful** (a verified pixel-equivalent embed/trace, never a
  hand-redrawn approximation). The W5 `SceneDescriptor.icon` + `vite-svg-loader ?component`
  substrate is KEPT. **GATE:** `proof:scene-icons` carries (1) re-instantiation faithfulness (the
  4 originals byte/pixel-match `084feb9`), (2) the monochrome inversion (a `currentColor`-only icon
  now FAILS), (3) coverage, (4) the no-raster allow-list for the named re-instantiated rasters.

---

## §4 — ROUND-3 FEEDBACK I1–I12 (W11 + W12) + ROUND-4 J1–J6 (W12)

### I1–I12 — the round-3 fold (W11 the stage-card register + DFA; W12 the audit + enrichment)

| # | Request | Wave | How addressed (supersedes/extends) | GATE |
|---|---|---|---|---|
| **I1** | Labels uniform width via a CLEAN GRID + SUB-GRID | W11 | parent CSS `subgrid` → ONE uniform label column across rows; the `w-20` magic literal dies (REFINES W9 F1) | `proof:label-subgrid` NEW |
| **I2** | Fully map every scene's valid states + which controls it shows via a DFA; NO undefined nav; suspend+resume; monitor perf | W11 | a per-scene control-VISIBILITY DFA as a 3rd orthogonal axis on the W1 FSM (table-driven; the reka-fallback hacks die); a NAMED transition perf budget (EXTENDS W1) | `proof:scene-control-dfa` + `proof:scene-transition-perf` NEW |
| **I3** | Sequence + path GREATLY refined; frontend-design usability pass; a few easter eggs per scene | W12 | sequence draggable storyboard rows + swept playhead; editable motion-path control-points + copy `offset-path` artifact + tangent readout; per-scene easter eggs (EE-SEQ-1 reel, EE-MP-2 emoji winks, + one per scene) — dogfood `useDragScrub`+the engine | `proof:sequence-rows-draggable` + `proof:motion-path-editable` + `proof:motion-path-copy` + `proof:easter-egg` NEW |
| **I4** | Card rounding baked into the PRIMITIVE — leaving a card square should be impossible | W11 (+glass-ui HANDOFF) | the I5 `<Card>` swap rounds sequence/path with zero ad-hoc `rounded-*`; the deeper primitive default is a glass-ui HANDOFF (born-RED-paired) | `proof:card-rounded-primitive` NEW |
| **I5** | The four stage scenes get a STANDARD non-cartoon GLASS card (REVERSES W10 G8 full-bleed) | W11 | all four stage scenes → ONE standard glass `<Card>` (rounded by construction); **reverses ONLY G8's full-bleed SURFACE — the `.stage-cell` PRIMITIVE survives**, `dock-inset` stays deleted. **The headline; resolves W10 FORK A toward the contained card** | `proof:stage-glass-card` NEW (SUPERSEDES the W10 `proof:scene-card-rounded` full-bleed disjunct) |
| **I6** | Cubic-bézier double card — remove the inner-most card | W11 | drop the inner `<Card>`; the header/back flow into the parent controls Card (REFINES W9 F2) | `proof:bezier-single-card` NEW |
| **I7** | The easing panel is too small — make the bezier controls BIG + TALLER; remove the "editing:" subtitle | W11 | grow the in-panel canvas within the fit-without-scroll constraint; delete the "editing:" subtitle (REFINES W9 F2) | `proof:bezier-grown` NEW (the i-_PLAN's "bezier-panel-taller" clause, authored under this name) |
| **I8** | Standardize components — share more between scenes | W12 | extract `useDragScrub` (the shared pointer-drag seam; RE-OPENS the W5-BOOKed extraction now over its 3-consumer threshold); share the `.btn-playback` skin (EXTENDS W10 G3/G6) | `proof:dragscrub-single` NEW |
| **I9** | Encapsulation audit (composables / useX's / state-store) | W12 | the motion-path gesture engine moves Target→`useMotionPathDemo`; pure store getters (single-writer / pure-reads consistency tail on W1) | `proof:composable-encapsulation` NEW |
| **I10** | Decomposition — break large components; colocate; modern Vue; KISS | W12 | VERIFY + colocate (the demo is already D-tranche-decomposed; the only >500L files are the FENCED engine — untouched); a 500L regression guard | `proof:demo-no-oversize` NEW |
| **I11** | Brittleness audit (deeply-nested / brittle selectors in CSS OR reactivity) | W12 | named `SAMPLE_STEP` + a documented square-viewBox invariant; class-string DOM walks → owned refs | `proof:no-brittle-selector` NEW |
| **I12** | Styling audit (isomorphic unless befitting; localize idioms; idiomatic Tailwind) | W12 | EXTEND the OWNED-IDIOMS contract membership to the full referenced-idiom set (the W4 `icon-*` four already resolve — the "61 no-op" finding was W4-CLOSED, not re-litigated); no new magic-number/brittle-calc regressions | `proof:styling-idioms` NEW (EXTENDS `proof:icon-idiom`) |

### J1–J6 — the round-4 easing-minimalism fold (W12)

The user's exact direction: *"within easing, we should just have the dropdown — no text input;
duration slider should be the full length of the card, too; and remove the 'value' label; remove
the double container therein, and remove the 'ease' title — more like controls — and make the
bezier visualizer bigger as such."*

| # | Request | Wave | How addressed | GATE |
|---|---|---|---|---|
| **J1** | Remove the easing "value" TEXT INPUT (+ its copy button) — the dropdown is the sole selector | W12 | the text input + copy removed; the dropdown is the lone easing selector | `proof:easing-sidebar-minimal` |
| **J2** | Remove the "value" LABEL | W12 | removed (it labeled the deleted input) | `proof:easing-sidebar-minimal` |
| **J3** | The DURATION slider spans the FULL WIDTH of the card | W12 | full-width track (not the short track) | `proof:easing-sidebar-minimal` |
| **J4** | Remove the DOUBLE CONTAINER in the easing sidebar | W12 | one flat container (continues the W11/W10 normalization; no nested wrapper survives) | `proof:easing-sidebar-minimal` |
| **J5** | Remove the "ease" scene TITLE — read like the standard controls | W12 | the per-scene title removed (controls carry no big per-scene title) | `proof:easing-sidebar-minimal` |
| **J6** | Make the bezier visualizer BIGGER (using the freed vertical space) | W12 | grown further on the space freed by J1/J5 (composes with I7's bezier-grow) | `proof:easing-sidebar-minimal` + the bezier-grow clause |

---

## §5 — THE TWO GENUINE FORKS (recorded as USER-DECISIONS)

**FORK 1 — F6: REMOVE vs CONSISTENT specular.** The user phrased F6 as "consistent OR remove,"
and leaned remove ("perhaps we just remove it?"). The triumvirate recommended REMOVE decisively
(it collapses F3+F6+F8 into one coherent calm register, is net-deletion, and avoids the per-pane
`pointermove` listener tax). **USER-DECISION: REMOVE adopted.** The CONSISTENT alternative (a
glass-ui HANDOFF emitting the track on ALL panels + per-panel `useSpecularPointer` at rest
~0.12–0.15) was the documented fallback only if the user rejected REMOVE — they did not. The W2
specular gates (`proof:cartoon-specular-coexist`, `proof:specular-calm`) RETIRED;
`proof:no-orphan-specular` INVERTED to exception=∅ (STRONGER). The cartoon chronic stays CLOSED
via a STRONGER system property — a re-paper caught BEFORE the H.W8 golden baseline locked it, NOT
a re-open.

**FORK 2 — W8R: the GLASS-STAGE SHEEN ("keep glass + handoff the sheen").** When the W11 I5 glass
stages were observed live, glass-ui's mild inert `.glass-specular-track` catch-light remained on
the five sanctioned `<Card>` stages. The fork: REVERT the glass stages to cartoon (kill the
sheen demo-side) vs KEEP the glass + HANDOFF the sheen-removal to glass-ui. **USER-DECISION (W8R):
keep the glass stages, hand off the sheen.** Rationale:
- The visible specular bloom is already DEAD at the consumed `~3.5.1` (glass-ui 3.5.0 killed the
  hover-radial); only an INERT class remains (no visible bloom).
- The internal gate contradiction (`proof:no-orphan-specular` exception=∅ vs
  `proof:stage-glass-card` requiring the I5 stages glass) was reconciled by PARTITIONING
  `proof:no-orphan-specular` (it EXCLUDES the `proof:stage-glass-card` subjects while STILL biting
  a kf-re-introduced `surface="glass"` PANEL regression — stays falsifiable, no `!important`, no
  fork, inv-16).
- The cosmetic removal of the inert class is the glass-ui **3.8.0** `specular="off"` consume-edge
  — a forward nicety, NOT a blocker. **HANDOFF — `proof:specular-handoff` born-RED**; resolves
  when kf bumps to glass-ui 3.8.0 (the W34 consumer-adoption leg). Coordination filed at
  `glass-ui/docs/tranches/AX/coordination/from-keyframes-W8-specular-consume-edge.md` + the kf-side
  `docs/tranches/H/glass-ui-AX-handoff.md` (G-1).

Both forks are recorded honestly: the latest authoritative direction (the spine) is followed, and
the deferred half is a born-RED HANDOFF (never a silent punt).

---

## §6 — THE RECURRING PRECEPTS — verified HELD across H

| Precept | Verdict | Anchor |
|---|---|---|
| **no-legacy / no codepath beside its replacement** | **HELD** | the manual `.glass-card` plate dies WITH the `surface="cartoon"` swap (W2); the heuristic double-fire codec + bare `Map` store die WITH the FSM (W1); the PNG-blind raster registry dies WITH the SVG family (W5); the bespoke `ribbonContent`/duplicate curve/`dock-inset` delete in one motion (W10); the inner card / "editing:" subtitle / text-input delete (W11/W12) — every supersede CITED |
| **no quick solutions / no workarounds — idiomatic gestalt** | **HELD** | the D12 heuristic state machine (the one prior-tranche drift) is REPLACED by a formal FSM (W1), not patched; G8 is a layout PRIMITIVE whose every term resolves to an existing token, not a per-scene patch; no gate passes by `display:none`/`!important` (subtrees DELETED, components ARE the standard) |
| **gestalt (the whole, not the column)** | **HELD** | the chronic-closure repair polices the PRODUCT not the column (`proof:chronic-closure`); the F/G/I clusters collapse to ONE register / ONE normalization / ONE card register decision each |
| **isomorphic (pixels unchanged unless a NAMED befitting delta)** | **HELD** | the cartoon-vs-glass swap, the hero mega rung, the icon differentiation, `tier="quiet"` 0.50 α, the subgrid uniform label, the glass-card stage register — each a NAMED, user-reported-as-wrong correction, not gratuitous restyle |
| **KISS · DRY** | **HELD** | net-deletion-leaning (F3/F6 remove the specular subsystem; the J easing-minimalism strip); the `icon` field DRY'd onto `SceneDescriptor`; `useDragScrub` extracted (one drag seam); the four stage scenes converge to ONE register |
| **inv ζ (the chrome dogfoods the engine)** | **HELD** | typing-dots → `steppedEase`/`SpringProgress` (W6); the drawer → `SpringProgress` (W7/D13); the easing stage ball → `AnimationVisualizer`/`NumericAnimation` (W10/G4); the sequence/path affordances → `Sequence.add`/`ManualTimeline` (W12/I3) — no hand-rolled rAF. The engine kernel stayed FENCED (only the W0 crash-fix touched the library) |
| **inv-16 (consume glass-ui published; sibling items are HANDOFFs, never patched in kf)** | **HELD** | D5-lag consumed via the published `~3.5.1` bump (no kf spring fork); the dock D9 fix is genuinely kf-domain wiring; the specular sheen, `LabeledField orientation`, the rounded-primitive default, value.js/parse-that slices are all born-RED HANDOFFs — none patched in kf |
| **inv ε (every claim anchored)** | **HELD** | every D-row cites its wave/commit; every gate is a falsifiable instrument under `scripts/proof-*.mjs`; the feedback rounds cite the binding research lanes (R1/R2/R3, g-r*, i-r5, j-easing-minimalism) |
| **fail-explicit / measure-first / no-god-modules / no-nested-imports / no-test-in-src** | **HELD** | the FSM throws on out-of-order transitions (W1); the I2 perf budget is a NAMED bench, not an assertion; no demo file >500L (`proof:demo-no-oversize`); the `dock/index.ts` pass-through barrel stays deleted; zero `*.test.ts` under `src/` (H is demo-only) |

**The precept verdict.** The binding mandate held across all 13 waves + the five feedback rounds.
The single prior-tranche drift the H charter flagged — the D12 heuristic scene-state machine — is
the ONE seam W1 repairs with a formal FSM. The chronic-closure discipline is itself a precept H
internalizes into a gate (`proof:chronic-closure`): no chronic exits except via a passing SYSTEM
gate or a born-RED HANDOFF — and all four chronics close that way.

---

## §7 — VERDICT (no drops)

**Every H request resolves.** The original charter D0–D14 + the standing-mandate items → 13
committed waves, each with a falsifiable gate. The round-2 F1–F9, round-3 G1–G8 (+ the icon
RE-INSTANTIATION correction), round-3 I1–I12, and round-4 J1–J6 → folded as corrective waves
W9/W10/W11/W12, each SUPERSEDE CITED, each gate born-RED-then-green. The two genuine forks (F6
remove-specular; the W8R glass-stage-sheen) are USER-DECISIONS recorded honestly — the deferred
halves are born-RED HANDOFFs, never silent punts.

**The four chronics** (cartoon-shadow D2, φ-hero D7, mobile D10, dock D5) each close with a
PRODUCT-level terminal — a passing SYSTEM gate (D2/D7/D10, and D5 via the consumed `~3.5.1` bump)
— and `proof:chronic-closure` (the meta-gate) is GREEN, so none can re-paper.

**The cross-repo HANDOFFs** are born-RED and inv-16-clean: the glass-ui Card-specular sheen
(`proof:specular-handoff`, resolves at glass-ui 3.8.0 — kf's W34 leg), the value.js / parse-that
slices (standing), and the deploy leg (CF Pages keyframes.babb.dev — user-domain). **SEMVER:** the
library PATCH (4.1.0 → 4.1.1, the W0 BUGFIX); the demo deploys to CF Pages separately. **Version
owner: Mike Babb.** The recurring precepts — no-legacy, no-workaround, gestalt, isomorphic, KISS,
DRY, inv ζ, inv-16, inv ε, fail-explicit, measure-first — each verified HELD.
