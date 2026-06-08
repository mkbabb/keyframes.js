# Tranche H — PROGRESS

Status board for keyframes.js' eighth tranche. The plan is `H.md` (the canonical
charter); the close report is `FINAL.md` (authored at H.WZ). Audit evidence is under
`audit/` — 35 phase-1 lanes (`a-*.md`) + 6 `_SYNTHESIS-` docs, each `file:line`-grounded
or live-anchored with a SHIP/glass-ui-HANDOFF/value.js-HANDOFF/parse-that-HANDOFF/BOOK/
RECORD/KILL disposition and a re-runnable instrument. The wave specs are authored under
`waves/` at implementation-open. The LOAD-BEARING blueprint is
`audit/_SYNTHESIS-gap-scorecard.md` (the THESIS §0 + the §1 honest gap map + the §2 two
adjudicated divergences + the §3 band→wave map H.W0..H.W8 + the §4 handoffs + the §5
ALREADY-SOTA record + the §6 spine) — read it first.

H's single duty, inherited from G's honest close: **finish the demo-quality /
design-language-restoration / mobile / scene-state band that G's source-and-contract gate
regime was structurally blind to** (`audit/_SYNTHESIS-gap-scorecard.md §0`, binding). G
re-pinned correctness (the value.js/parse-that/glass-ui consume-spine, exemplary); the
engine, boundary, parse, and color kernels are **ALREADY-SOTA and H does NOT touch them**
(`§5`, binding — re-touching exemplary work is the inverse failure). The actionable band
is the DEMO: a layout transposition (one `rail·stage·rail` grid), the restoration of
cartoon-shadow depth as the panel hover/depth idiom (the specular radial dialed to a quiet
catch-light), the φ-ladder hero bump, the easing-editor sizing, the typing-dots/icon/
popover fixes, mobile-as-overlay + a springy drawer, per-mode interactivity — and,
CRITICAL and central, **one formal scene+playback state machine** that ends the
routed-state corruption + makes play/pause suspend/restore an identity. **Two live console
crashes** (`serializeEasing`, the `"......"` lerp) ship in 4.1.0 and must die first — they
poison every other measurement (`§0`, `a-engine-regressions` H-A1/H-A2).

**H's content is NET-NEW, stated honestly — and it repairs a CHRONIC-CLOSURE failure.**
The meta-lesson H must internalize (`a-deferred-chronic §2-3`, woven into every wave gate):
four user-visible chronics — cartoon-shadow (D2), φ-hero (D7), mobile (D10), dock (D5) —
"exited" the deferred ledger A→G **not by being SOLVED but by being re-classified**:
issue-level close masquerading as system-level close (M1), scope-narrowing to a terminable
sub-problem (M2), or column-migration to HANDOFF (M3). **The P-invariant policed the
COLUMN, not the PRODUCT.** H's repair is binding: *a chronic exits only with (a) a passing
SYSTEM-property gate, or (b) a HANDOFF tag PAIRED with a born-RED kf gate* (`§0`, `§6`,
H.W8). This discipline is the spine of the gate-regime upgrade.

**H is the demo tranche, but the spine is unbroken.** NO quick fixes / NO workarounds —
idiomatic gestalt only. NO legacy beside its replacement (the manual `.glass-card` plate
dies WITH the `surface="cartoon"` swap; the `isStableFire` heuristic dies WITH the FSM;
the PNG icons die WITH the SVG family — each replaced surface replaced in ONE motion). NO
god modules (MEASURE-FIRST; the demo's problem is decomposed-along-the-wrong-axis, not
length). KISS · DRY · no nested imports · no test-in-src. Styling ISOMORPHIC unless a
NAMED befitting delta (the cartoon-vs-glass swap, the hero mega rung, the icon
differentiation). **inv ε** (every claim anchored). **inv ζ** (the chrome must dogfood the
engine — the typing-dots and the mobile drawer become dogfooded primitives). **inv-16**
(consume glass-ui, do NOT re-author — HANDOFF the dock/specular/value.js/parse-that
items). The full binding record is `audit/_SYNTHESIS-gap-scorecard.md §6`.

## Phase

**TRANCHE DEVELOPMENT** on branch `tranche-h-dev` (D+E+F+G IMPLEMENTED + RELEASED — kf
`4.1.0`; value.js `0.11.1`, parse-that `0.9.0`, glass-ui `3.4.0` consumed on the G re-pin,
the demo live at `:5173` carrying all of Tranche G — the dev port is Vite-assigned, gates use `serveDist`'s reported port; CP-LOW-2). The deep audit is RUN — the evidence
is on disk under `docs/tranches/H/audit/` (35 phase-1 lanes + 6 `_SYNTHESIS-` docs, each
`file:line`-grounded or live-anchored with a disposition + a re-runnable instrument). This
board, `H.md` (the charter), the gap-scorecard, and the five sibling synthesis docs are
the DEVELOPMENT artifacts. **H.W0–H.W10 (and the close H.WZ) are authored-now-run-later
wave specs; the implementation phase opens only on explicit user authorization, gated on
keyframes' own green CI — exactly the D.W0 / E.W0 / F.W0 / G.W0 dev/impl boundary.** No
engine, demo, library, parser, test, CI, or bench source is written in development.
**This is TRANCHE DEVELOPMENT — docs ONLY, ZERO source/test/CI/demo edits.** (H.W9 + H.W10
are the TWO CORRECTIVE refinement rounds added after the user audited the running
`tranche-h-impl` demo — H.W9 = the F1–F9 design-language fold; H.W10 = the G1–G8
scene-normalization + expressive-icon + stage-layout-primitive fold (the SECOND round,
observed after W5 landed — it COMPOSES with H.W9). Both SUPERSEDE specific landed
W2/W3/W4/W5 decisions and land BEFORE H.W8's golden baseline (H.W9 → H.W10 → H.W8). Their
authoritative plans are `audit/feedback/_PLAN.md` (H.W9) + `audit/feedback/g-_PLAN.md` (H.W10).)

The wave specs (`waves/H.W0..H.W10.md`) are authored under `waves/`, each in the F/G
wave-spec SHAPE: a header line (Phase: IMPL spec-authored-in-DEV-awaits-auth · Class ·
Scope `file:lines` · DAG-deps) · §Provenance (the folded lanes) · §The state, verified
(`file:line` / live anchors from the lanes) · §Goal · §Scope (S1..Sn, each WHAT + WHY) ·
§Hard gate (the `proof:*` that BITES — born-RED-today, GREEN-on-fix, with the explicit
BITE) · §Folds · §Design decisions RESOLVED.

## Planned DAG (run-later)

**H.W0 (crashes) and H.W1 (state machine) are PREREQUISITES** — five lanes name D12 (the
scene-state machine) as a blocker, and the two live crashes poison every other
measurement, so the visual lanes cannot read a clean console until H.W0 lands
(`_SYNTHESIS-gap-scorecard.md §3`):

- **Band 0 — `H.W0`** (KILL THE LIVE CRASHES) leads: `serializeEasing` (H-A1) + the
  `"......"` lerp (H-A2) must die before any visual lane can measure a clean console;
  H-A2's engine discrete-hold guard folds forward into H.W6's typing-dots.
- **Band 1 — `H.W1`** (THE SCENE + PLAYBACK STATE MACHINE, the keystone) lands second:
  the FSM is the substrate the layout (H.W3), mode-interactivity (H.W5), and mobile
  (H.W7) waves build on; it ends the route storm + makes suspend/restore an identity.
- **Band 2 — `H.W2`** (RESTORE THE DESIGN LANGUAGE: `surface="cartoon"` + refined
  specular) ∥ **`H.W3`** (THE CONTROLS-COLUMN LAYOUT: one `rail·stage·rail` grid, one
  `--rail-width`) — both demo-visual, sequenced after H.W0's clean console; H.W3's
  `--rail-width` is the token H.W7 re-parameterizes.
- **Band 3 — `H.W4`** (EASING EDITOR + HERO φ-TYPOGRAPHY + the icon-size idiom) ∥
  **`H.W5`** (SCENE ICONS + MODE PERTINENCE — DEPENDS on H.W1 for the descriptor-keyed
  scene fact) ∥ **`H.W6`** (TYPING-DOTS + CHROME DOGFOOD, inv ζ — pairs H.W0's H-A2
  engine guard as belt-and-suspenders).
- **Band 4 — `H.W7`** (MOBILE OVERLAY + SPRINGY DRAWER — DEPENDS on H.W3's `rail·stage·
  rail` grid + H.W1's FSM; dogfoods `SpringProgress`).
- **Band 4.5 — `H.W9`** (DESIGN-LANGUAGE REFINEMENT ROUND 2, the CORRECTIVE user-feedback
  fold) — the user audited the running demo after W2/W3/W4 landed and named nine refinements
  (F1–F9); H.W9 SUPERSEDES specific landed W2/W3/W4 decisions (the headline F3+F6+F8 register
  collapse: keep `surface="cartoon"`, add `tier="quiet"`, REMOVE the tracked specular). It
  DEPENDS on H.W2 (the surface flip it refines), H.W3 (the row shape + the load-bearing clip),
  H.W4 (the bezier panel), H.W6 (no collision); its browser gates settle-gate on H.W1. It
  sits AFTER the visual waves and BEFORE H.W8's golden baseline so the calm register / one-
  column row / un-clipped shadow are what H.W8 locks — the chronic-closure discipline catching
  a re-paper before the baseline fixed it.
- **Band 4.6 — `H.W10`** (SCENE NORMALIZATION + EXPRESSIVE ICONS + the STAGE LAYOUT-PRIMITIVE,
  the SECOND CORRECTIVE user-feedback fold) — the user audited the running demo AFTER W5 landed
  and named eight items (G1–G8); H.W10 SUPERSEDES specific landed W5/W3/W2 decisions (the
  through-line: the easing/spring scenes DIVERGED from the standard controls component + the
  rail·stage·rail layout — G3+G6+G7+G5 collapse to ONE normalization: the easing/spring scenes
  REUSE the standard `PlaybackRibbon` + `AnimationControlsControls`/`Labeled*` sidebar; G4 the
  easing stage = ONE engine ball (revises W5.S4); G8+G2 the `[stage]`-track dock-safe
  containment PRIMITIVE + full-bleed stage (revises W3 stage track); G1 the COLORFUL icon
  reversal (revises W5.S2 + `proof:scene-icons`)). It DEPENDS on H.W9 (the normalized rows G6
  consumes + the `tier="quiet"` register G6/G2 inherit — H.W10 COMPOSES with H.W9, carrying a
  NAMED amendment to its S1 EasingSidebar+SpringSidebar site-lists), W5 (the `SceneDescriptor.icon`/
  vite-svg-loader substrate G1 reuses; the stage-curve-promote G4 reverses), W3 (the
  rail·stage·rail grid + the `[stage]` track G8 reconciles); its browser gates settle-gate on
  H.W1. It sits AFTER H.W9 and BEFORE H.W8's golden baseline so the colorful icons / normalized
  easing+spring / full-bleed contained stage are what H.W8 locks — the gate-blindspot lesson in
  ACTION AGAIN (the original W5 gates never asserted the new scenes REUSE the standard component).
- **Band 4.7 — `H.W11`** (THE STAGE-CARD REGISTER + the CONTROL-SURFACE DFA + the LAYOUT
  REFINEMENTS, the THIRD CORRECTIVE user-feedback fold, first of its two waves) — the user
  audited the running demo while W10 is LANDING CONCURRENTLY and named twelve refinements
  (I1–I12, split across H.W11 + H.W12); H.W11 SUPERSEDES W10 G8's full-bleed SURFACE
  consequence (the headline I5 reversal: the FOUR stage scenes — easing/spring/sequence/path —
  converge from THREE states (full-bleed / cartoon-square / target) to ONE standard non-cartoon
  glass `<Card>`; the `.stage-cell` LAYOUT PRIMITIVE half of G8 SURVIVES; the user resolved W10
  FORK A toward the contained card), EXTENDS the W1 FSM with a per-scene control-VISIBILITY DFA
  (I2 — a 3rd orthogonal axis `controlSurfaces: Record<SceneId, ControlSurface[]>`; the
  reka-fallback hacks die) + a transition perf budget (the NAMED `bench:scene-transition`,
  MEASURE-FIRST), and REFINES W9 F1/F2 (I1 the uniform label subgrid; I6/I7 the bezier panel
  de-nest + grow + the "editing:" subtitle drop). It DEPENDS on H.W1 (I2 extends its
  `useSceneMachine`), H.W9 (I1/I6/I7 refine F1/F2), H.W10 (I5 supersedes G8's full-bleed; the
  `.stage-cell` primitive survives); its browser gates settle-gate on H.W1. It sits AFTER H.W10
  and BEFORE H.W12 + H.W8's golden baseline so the glass-card stage / uniform subgrid /
  de-nested-grown bezier are what H.W8 locks — the chronic-closure discipline catching the W10
  full-bleed before the baseline locked it.
- **Band 4.8 — `H.W12`** (COMPONENT STANDARDIZATION · DECOMPOSITION · ENCAPSULATION ·
  BRITTLENESS/STYLING AUDIT · SEQUENCE+PATH ENRICHMENT + EASTER EGGS, the second of the round-3
  pair) — fills the structure H.W11 lands: extract `useDragScrub` (I8, RE-OPENS the W5 BOOK now
  at 3–5 consumers) + share the `.btn-playback` skin to sequence (extends W10 G3/G6) + lift the
  motion-path gesture engine into `useMotionPathDemo` + the W1-store pure-getter audit (I9) +
  VERIFY the decomposition + colocate (I10 — the engine is FENCED; no demo file >500L) + name
  `SAMPLE_STEP` + document the square-viewBox invariant + kill class-string DOM walks (I11) +
  localize the styling idioms + extend the OWNED-IDIOMS contract (I12) + GREATLY REFINE
  sequence/path (I3 — draggable rows re-authoring `at:` + editable motion-path control points +
  copy-`offset-path` artifact + tangent readout + a swept master-playhead) + ONE easter egg per
  scene. It DOGFOODS public engine primitives (inv ζ); it DEPENDS on H.W11 (the I5 glass-card is
  the container the enrichments live inside; the I2 DFA enumerates sequence/path as
  `{stage-only}` first), H.W5 (re-opens the W5-BOOKed `useDragScrub`/H-MI-4/F4-elevation),
  H.W10 (extends G3/G6 to sequence/path); its browser gates settle-gate on H.W1. It sits AFTER
  H.W11 and BEFORE H.W8's golden baseline so the enriched sequence/path + the localized idioms
  are the FINAL state H.W8 locks.
- **Band 5 — `H.W8`** (THE GATE-REGIME UPGRADE — the appearance axis `proof:visual-lock`,
  the interaction axis, the re-sourced SCENES manifest, the chronic-closure meta-gate)
  closes the blind spots so this is the LAST re-paper; it DEPENDS on the visual waves
  **AND H.W9 AND H.W10 AND H.W11 AND H.W12** having landed (it locks their pixels — the H.W9
  calm register + the H.W10 colorful-icon / normalized-easing state + the H.W11
  glass-card-stage / control-DFA + the H.W12 enriched-sequence/path / localized-idioms GOLDEN
  render) and on the HANDOFFs being tagged (it pairs each with a born-RED kf gate).

**Critical path:** `H.W0 → H.W1 → {H.W2 ∥ H.W3} → {H.W4 ∥ H.W5 ∥ H.W6} → H.W7 → H.W9 → H.W10 → H.W11 → H.W12 → H.W8`.
The cross-repo dock lag, the Card-specular seam, and the value.js/parse-that slices are
HANDOFFs (`§4`), each paired with a born-RED kf gate per the chronic-closure discipline.

## Wave status

| Wave | Title | Phase | Status | Hard gate (falsifiable instrument) |
|---|---|---|---|---|
| **H.W0** | Deep audit confirmation (this board + the synthesis) | DEV | **DONE** | The 35-lane + 6-synthesis assay is on disk under `audit/` + re-runnable (each lane cites a grep/`wc`/live-Playwright instrument that re-executes from the repo); `_SYNTHESIS-gap-scorecard.md` (load-bearing), this board, and the five sibling synthesis docs are present; every H.W1..H.W8 finding carries its own falsifiable hard gate; the §5 ALREADY-SOTA record fixes the no-touch surface. |
| **H.W0** | KILL THE LIVE CRASHES (prerequisite) | IMPL (Band 0) | **authored — awaits auth** | `proof:demo-console-clean` — a load RESTING on a route whose mounted Keyframes-string editor targets a `cubic-bezier`-closure animation (amiga / the easing `contractAnim`) = **0 console errors** (RED: 0–3 today, state-dependent — NOT "4× on every Cube load"; the throw is at `serializeEasing` `src/animation/format.ts:30`/`:36` ← the readout `KeyframesStringControls.vue:~95`, re-targeted off the Cube presets per BLK-1; CP-HIGH-2); home→scene transition = 0 errors (RED: H-A2 `"......"` lerp, `engine.ts:769`/`:779`). Plus unit `serializeEasing` over an amiga/`contractAnim` `cubic-bezier` preset resolves without throw (`CSSKeyframesToString(cubeRotationsAnimation)` is born-GREEN — re-pointed), and a `proof:interpolate-anything` row biting the ACTUAL `"......"` reproduction (NOT `{label:"a"}→{label:"b"}`, which proved no-throw). Folds `a-engine-regressions` H-A1/H-A2, `a-scene-state-machine §3`. |
| **H.W1** | THE SCENE + PLAYBACK STATE MACHINE (CRITICAL, the keystone) | IMPL (Band 1) | **authored — awaits auth (DEPENDS on H.W0)** | `proof:scene-machine-irrefragable` — the (scenes² × {playing,paused}) matrix: every A→B→A round-trip preserves route/superKey/component/group consistency AND byte-identical playback (suspend→restore is an identity); plus `proof:no-route-storm` (load `#/easing`, idle 2s, ≤1 nav entry, resting hash unchanged — RED: live autonomous storm easing→motion-path→starting-style→spring→amiga), `proof:scene-isolation`, `proof:deep-link-wins`, `proof:suspend-no-orphan-raf`, and (S8, the D9 owner per BLK-8) `proof:dock-popover-opens` (`finalOpen:true` after a trusted click — RED `false` today) + `proof:single-toggle` (`handlerCount===1` — RED `handlerCount:2` live; the App.vue un-double-wrap, imperative `keepOpen`/`release` NOT a `v-model` binding). ONE `useSceneMachine()` (`createGlobalState`+pure reducer, §2.1) collapses 5 authorities + 3 playback authorities + `isStableFire`. **NB: two orthogonal axes — scene ∈ 9, playback-status ∈ 5 — not a flat enum (CP-LOW-4).** Folds `a-scene-state-machine`, `a-store-architecture`, `a-demo-architecture` F3/F6/F8, `a-mbabb-popover` (D9). |
| **H.W2** | RESTORE THE DESIGN LANGUAGE (cartoon depth + refined specular) | IMPL (Band 2) | **authored — awaits auth (DEPENDS on H.W0+H.W1)** | `proof:cartoon-is-panel-depth` + `proof:no-orphan-specular` — ≥4 panel Cards resolve `box-shadow: var(--shadow-cartoon-md)` at rest; ZERO `.glass-specular-track` on panels OR (if retained) a `--mouse-x` writer present (RED: live ~5–13 hosts route/state-dependent, **0 pointer-wired** — the gate asserts the `anyPointerWrite:false` INVARIANT, not the count; CP-MED-2); hover-screenshot lock = offset cartoon stamp, no centered radial bloom. Panels flip to `surface="cartoon"` (§2.2 adjudicated — radial dies at source, manual `.glass-card` plate deleted). **glass-ui-HANDOFF:** Card wire-or-omit the seam. Folds `a-cartoon-shadow`, `a-design-language` A1/A2/A7, `a-glow-artifact`, `a-glass-ui-consumption` D2/D14, `a-glassmorphism-perf` G2. |
| **H.W3** | THE CONTROLS-COLUMN LAYOUT (one-column · ribbon-width · `rail·stage·rail`) | IMPL (Band 2) | **authored — awaits auth (DEPENDS on H.W1)** | `proof:single-column-pack` + `proof:timeline-rail-width` + `proof:demo-shell-grid` — all field rows share one left-edge `x` (RED: today `{76,300}`); ribbon width === sidebar width === `--rail-width` (±2px; RED: live 1272px ribbon vs 400px token vs 768px cap); grep-gate: zero `grid-cols-[auto_1fr]`/`grid-cols-[subgrid]`/`col-span-2`/`col-end-4`/`--controls-pane-width` survive. One named `[rail] var(--rail-width) [stage] 1fr` grid; `--rail-width` single-sources sidebar + timeline + mobile sheet. Folds `a-controls-sidebar` D1, `a-timeline-width` D4, `a-demo-architecture` F1/F2/F4. |
| **H.W4** | THE EASING EDITOR + HERO φ-TYPOGRAPHY (the visual-fidelity rungs) | IMPL (Band 3) | **authored — awaits auth (DEPENDS on H.W0)** | `proof:easing-canvas-bounded` + `proof:hero-rung` + `proof:phi-leaf-zero` + `proof:icon-idiom` — canvas `block-size ≤ 280` AND square (RED: live 680×680px, 77% of an 883px panel, `EasingCurveCanvas.vue:269-273`); hero resolves the `text-display-mega` CLASS AND a px floor at a fixed named viewport (`font-size ≥ 140px` at 1440×900, NOT a `≥ --type-display-mega` clamp-vs-clamp comparison across an unpinned viewport; CP-HIGH-3) (RED: live `text-display-4` = 86.1px); `proof:phi-leaf-zero` (the φ-hero chronic CH-2/M1 SYSTEM-property gate the H.W8 meta-gate cites) — BOTH the hero rung AND 0 raw `text-*` rungs across the demo, residual **2 (L1+L2)** under the `ui/` exclusion (NOT 37 — 37 only by counting vendored `ui/` shadcn; WV-W4-HIGH-1/HS-HIGH-3) (RED: 86px hero + 2 raw rungs today); every `icon-(xs|sm|md|lg)` reference resolves to a real definition (RED: **61 silent no-op** classes today, `anyIconRuleInStylesheets:false`). `block-size: clamp(160px,38cqi,280px)` + container context; hero `text-display-4`→`text-display-mega`; own ONE `@utility icon-*`. Folds `a-easing-editor` D3, `a-hero-typography` D7, `a-design-language` §2/§3, `a-styling-idioms` §1/§5/§6. |
| **H.W5** | SCENE ICONS + MODE PERTINENCE + CUBE/AMIGA SCENE-QUALITY (the new AND original modes finished) | IMPL (Band 3) | **authored — awaits auth (DEPENDS on H.W1)** | `proof:scene-icons` + `proof:scene-parity` + `proof:scene-perf-budget` — every non-home `SceneDescriptor` has an `icon` (RED: `ChromeDock.vue:25-30` maps only cube/amiga/square/easing); every `.svg` is `fill=none`+`currentColor`+`viewBox="0 0 32 32"` with stroke == host `currentColor` in dark AND light (an `<img>` icon FAILS by construction — theme-blind); each surviving mode exposes ≥1 pointer-interactive affordance (RED: square is a DEAD `<div>heyyyy`); AND `proof:amiga-tessellate-tilecount` (≤256 `fillRect` — RED: ~500k off-canvas today, `amiga/utils.ts:9,17-24`) + `proof:amiga-pixel-cap` + `proof:scene-host-contained` (G1) + `proof:offscreen-cv` (G5). One inline-`<svg>` `currentColor` family via `<component :is>`; KILL the orphan PNGs; MERGE Discrete → Spring sub-view (4 nav → 3); de-dup `springLinearStops`; S6 the cube/amiga scene-quality/perf budget. Folds `a-scene-icons`, `a-icon-pipeline`, `a-modes-pertinence`, `a-scene-spring-sequence`, `a-scene-path-discrete`, `a-scene-square-easing`, `a-scene-cube-amiga` A2/A3/A5 (A7/A9 BOOK), `a-glassmorphism-perf` G1-demo/G5. |
| **H.W6** | TYPING-DOTS + CHROME DOGFOOD (inv ζ) | IMPL (Band 3) | **authored — awaits auth (pairs H.W0 H-A2)** | `proof:typing-dots` + `proof:dogfood-hero` — ≥3 dot spans with monotonically increasing `animation-delay` (RED: `AnimatedText.vue:62` `split(/\s+/)` → `"..."` is ONE span, fades as a unit); min opacity over cycle ≥0.15 (RED: 43% of cycle <0.3 opacity); total cycle ≤1.6s; the dots component imports a kf engine symbol; no element carries two `animation` shorthands (RED: `.lift-down`+`.dot-fade` collision). Own `.typing-dots` 3-span staggered primitive dogfooding `steppedEase`/`NumericAnimation` per `CopyButton.vue:52`; decouple from `lift-down`. Folds `a-typing-dots` D6, `a-animations-quality` F1, `a-styling-idioms` §4. |
| **H.W7** | MOBILE OVERLAY + SPRINGY DRAWER (D10/D13) | IMPL (Band 4) | **authored — awaits auth (DEPENDS on H.W3 + H.W1)** | `proof:mobile-single-page` + `proof:drawer-spring` — at 390×844 the scene host ≈ viewport (full-bleed; RED: mobile STACKS, controls displace stage to **30px** behind a 710px drawer); opening controls OVERLAYS (shifts ±0px) the stage; both docks affixed; the sheet motion is a `SpringProgress` subscription (no `transition: grid-template-rows`; RED: live 550ms CSS `grid-template-rows` ease), settle <350ms, spring-shaped trace, single-frame PRM snap. The `rail·stage·rail` grid (H.W3) re-parameterized: stage full-bleed `[stage]` background + controls bottom-SHEET. Folds `a-mobile-architecture` F1/F2, `a-demo-architecture` F5. |
| **H.W9** | DESIGN-LANGUAGE REFINEMENT ROUND 2 (the consolidated user-feedback fold · F1–F9) | IMPL (CORRECTIVE — Band 4.5: AFTER W2/W3/W4/W6, BEFORE H.W8's golden baseline) | **authored — awaits auth (DEPENDS on H.W2 + H.W3 + H.W4 + H.W6; browser gates settle-gate on H.W1)** | The 10 gates each BITE born-RED: **AMEND** `proof:single-column-pack` (+ `labelRect.right ≤ controlRect.left`; RED on the label-ABOVE stack); **NEW** `proof:bezier-no-scroll` (RED: content overflows the `min(50vh,480px)` cap + external top-LEFT back); **INVERT** `proof:no-orphan-specular` (exception `{bezier}` → ∅; ZERO `.glass-specular-track` on any kf-owned `<Card>`; RED on the W2 composite today — STRONGER than the W2 form); **RETIRE** `proof:cartoon-specular-coexist` + `proof:specular-calm` (the composite subject deleted — drop from `proof:all`); **NEW** `proof:glass-and-cartoon` (RED if a panel resolves an OPAQUE bg in the non-PRM case; greens on `tier="quiet"`; `proof:cartoon-is-panel-depth` stays GREEN tier-agnostic); **NEW** `proof:pp-logo-svg` (static — RED: the emoji `<p>` at `App.vue:58`); **NEW** `proof:darkmode-row-toggle` (RED: the dark-mode label/gutter click does nothing); **NEW** `proof:cartoon-shadow-unclipped` (RED: the bottom-LEFT lobe sliced by `ControlsPaneWrapper.vue:182` `overflow:hidden`); **NEW** `proof:idle-fade` (RED: the dead `.controls-pane--hovered` class rests at opacity 1). The HEADLINE: F3+F6+F8 collapse — keep `surface="cartoon"`, add `tier="quiet"`, REMOVE the tracked specular (default; the §USER-DECISION fork's CONSISTENT alternative only if the user rejects REMOVE). SUPERSEDES W3.S1 (F1), the W4.S1/S2 bezier-panel sizing band (F2), W2.S3 (F3), W2.S2-COMPOSITE (F6), W2.S1 (F8). TWO glass-ui HANDOFFs (F1 `LabeledField orientation`; F8 OPTIONAL `cartoon`+`quiet` preset). Folds `audit/feedback/r1-source-rootcause`, `r2-git-archaeology`, `r3-design-reconcile`, `audit/feedback/_PLAN` (BINDING). |
| **H.W10** | SCENE NORMALIZATION + EXPRESSIVE ICONS + the STAGE LAYOUT-PRIMITIVE (the consolidated user-feedback fold · G1–G8) | IMPL (CORRECTIVE — Band 4.6: AFTER H.W9, BEFORE H.W8's golden baseline) | **authored — awaits auth (DEPENDS on H.W9 + W5 + W3; browser gates settle-gate on H.W1)** | The 6 gates (5 NEW + 1 REVISE) each BITE born-RED: **REVISE** `proof:scene-icons` (G1-SHAPE invert: drop the no-baked-hue clause → assert expressive color; G4-THEMING replace: drop "stroke==host color"/dark≠light → assert SVG+inline+expressive+legible-on-both; KEEP coverage/no-raster/favicon-404; RED on the monochrome `currentColor`-only family today — `assets/icons/easing.svg` et al. carry NO color token; greens on the colorful re-author); **NEW** `proof:scene-card-rounded` (RED: bare-class `glass-resting cartoon-surface` stages compute `border-radius: 0` — `EasingTarget.vue:4`, `EasingSidebar.vue:2`, `SpringTarget.vue:4`, `StartingStyleTarget.vue:9`, `SpringScene.vue:8`; greens on the full-bleed stage + the Card-component sidebar); **NEW** `proof:scene-uses-standard-ribbon` (G3+G7 — RED: `EasingScene.vue:56-90`/`SpringScene.vue:95-…` have no `PlaybackRibbon`/scrubber/`AnimationVisualizer`, Play/Reset not Play/Reverse, divergent class strings → unequal box metrics; greens on the standard ribbon: scrubber + EQUAL `grid-cols-2 .btn-playback` cells + visualizer + same component identity as cube); **NEW** `proof:easing-stage-is-ball` (G4 — RED: a second `EasingCurveCanvas` in the stage subtree `EasingTarget.vue:47-59`; greens when the stage's primary element is a `.progress-ball`/`AnimationVisualizer` whose x tracks `fn(progress)` over time AND no `EasingCurveCanvas` in the stage subtree); **NEW** `proof:easing-sidebar-normalized` (G5+G6 — RED: `text-admin-label`/`text-mono-caption`/`size="sm"`/`p-2`/×3 `<Card>` + ad-hoc grids in `EasingSidebar.vue`; greens on the standard rung `text-mono-small`/`px-4 py-3`/default controls/bounded depth/`Labeled*` rows); **NEW/AMEND** `proof:stage-within-docks` (G8 — amends `proof:stage-not-clipped` to bite the CARD not just `.stage-cell`; RED: the `flex-1` stage card top runs under the top `ChromeDock` + `dock-inset` present bottom-only — `design-idioms.css:498-500`; greens when the stage SUBJECT is bounded between the dock bands at 1280/1440 + mobile AND ZERO `dock-inset` class remains). The HEADLINE: G3+G6+G7+G5 → ONE normalization decision (REUSE the standard component, do NOT fork a second sidebar/ribbon). SUPERSEDES W5.S2 (G1), W5.S4 (G4), the born-bespoke `ribbonContent` fork (G3/G7), the born-bespoke `EasingSidebar` assembly (G5/G6 — + a NAMED H.W9 S1 amendment), the W3 `[stage]`-track form (G8). TWO USER-DECISION forks (G8 full-bleed-vs-contained, default BOTH-altitudes; G1 the palette, default the `--rainbow-*` token map). NO glass-ui patch in kf — it CONSUMES public `NumericAnimation`/`SmoothProgress`/`AnimationVisualizer` (inv ζ) + the in-tree glass-ui `<Card>`/`PlaybackRibbon`. Folds `audit/feedback/g-r1-source-rootcause`, `g-r2-git-archaeology`, `g-r3-reconcile`, `audit/feedback/g-_PLAN` (BINDING). |
| **H.W11** | THE STAGE-CARD REGISTER + the CONTROL-SURFACE DFA + the LAYOUT REFINEMENTS (the consolidated round-3 user-feedback fold · I1/I2/I4/I5/I6/I7) | IMPL (CORRECTIVE — Band 4.7: AFTER H.W10, BEFORE H.W12 + H.W8's golden baseline) | **authored — awaits auth (DEPENDS on H.W1 + H.W9 + H.W10; browser gates settle-gate on H.W1)** | The 7 NEW gates each BITE born-RED (W10's full-bleed the immediately-superseded baseline): **NEW** `proof:stage-glass-card` (I5 — RED on easing/spring full-bleed (no card → no radius/backdrop — `EasingTarget.vue:2-10`, `SpringTarget.vue:2-8`, `StartingStyleTarget.vue`) AND sequence/path bare `cartoon-surface` (`border-radius:0` — `SequenceTarget.vue:3`, `MotionPathTarget.vue:3`); greens when all four resolve a standard non-cartoon glass `<Card>`; SUPERSEDES the W10 `proof:scene-card-rounded` full-bleed disjunct); **NEW** `proof:card-rounded-primitive` (I4 — kf half: ZERO bare-class `cartoon-surface` stage roots, every stage card non-zero radius — greens on the I5 swap; glass-ui HANDOFF half: born-RED until the primitive ships a default radius); **NEW** `proof:label-subgrid` (I1 — RED: per-row `auto` widths `EasingSidebar.vue:144-150` + the `w-20` magic literal `SequenceTarget.vue:25-27`; greens on the parent `subgrid`; ≥3 differing-text rows for non-vacuity; REFINES W9 F1 — `proof:single-column-pack` stays GREEN); **NEW** `proof:scene-control-dfa` (I2 — RED: the hard-coded 3-tab list `AnimationControls.vue:20-22` + the reka-fallback hacks `EasingScene.vue:26-32`/`SpringScene.vue:62-74`/`MotionPathScene.vue:25` in `demo/app/scenes/`; greens on the table-driven render; the (scene→scene) navigation matrix is TOTAL); **NEW** `proof:scene-transition-perf` (I2 — the NAMED `bench:scene-transition` budget MEASURE-FIRST; state suspends-and-fully-resumes across a round-trip — EXTENDS the W1 `proof:scene-machine-irrefragable` field set with `control-surfaces`); **NEW** `proof:bezier-single-card` (I6 — RED: the inner `TimingFunctionPanel.vue:15` Card nested in the `AnimationControlsControls.vue:119` host card; greens on the inner-card removal); **NEW** `proof:bezier-panel-taller` (I7 — RED: the 220px canvas cap `TimingFunctionPanel.vue:251-252` + the "editing:" subtitle `:33`; greens on the grow + subtitle removal; REUSES W9 `proof:bezier-no-scroll`). The HEADLINE: I5 REVERSES W10 G8's full-bleed — the FOUR stage scenes converge to ONE standard glass `<Card>`; the control PANELS keep cartoon+quiet (W2/W9 untouched). SUPERSEDES W10 G8's full-bleed SURFACE (the `.stage-cell` PRIMITIVE half SURVIVES); EXTENDS the W1 FSM with a 3rd orthogonal axis; REFINES W9 F1/F2. The I5-shadow NAMED-delta fork (default MEASURE-FIRST). I4 deeper primitive default is a glass-ui HANDOFF (born-RED-paired). Folds `audit/feedback/i-_PLAN` (BINDING) · `audit/feedback/i-r5-sequence-path` · direct source reads + git history. |
| **H.W12** | COMPONENT STANDARDIZATION · DECOMPOSITION · ENCAPSULATION · BRITTLENESS/STYLING AUDIT · SEQUENCE+PATH ENRICHMENT + EASTER EGGS (the consolidated round-3 user-feedback fold · I3/I8/I9/I10/I11/I12) | IMPL (CORRECTIVE — Band 4.8: AFTER H.W11, BEFORE H.W8's golden baseline) | **authored — awaits auth (DEPENDS on H.W11 + H.W5 + H.W10; browser gates settle-gate on H.W1)** | The 9 NEW gates each BITE born-RED (except `proof:demo-no-oversize`'s 500L clause, born-GREEN as a regression guard): **NEW** `proof:dragscrub-single` (I8 — RED: 3–4 hand-rolled rect-ratio+pointer-capture+window-listener drag copies — `SpringTarget.vue:88-93`, `SequenceTarget.vue` master-scrub, `MotionPathTarget.vue:124-147`; greens on the single `useDragScrub` extraction); **NEW** `proof:composable-encapsulation` (I9 — RED: the gesture engine in `MotionPathTarget.vue:79-220`; greens on the lift into `useMotionPathDemo`; pure store getters); **NEW** `proof:demo-no-oversize` (I10 — every demo file ≤500L (born-GREEN today, the bite is a future over-split) + coherent colocation; the engine FENCED); **NEW** `proof:no-brittle-selector` (I11 — RED: the `SAMPLE_STEP=5` magic + implicit-square-viewBox scale coupling `MotionPathTarget.vue:118-147`; greens on the named constant + documented invariant + ZERO class-string DOM walks); **NEW** `proof:styling-idioms` (I12 — EXTENDS the W4 `proof:icon-idiom` resolve-or-red plumbing to the full referenced-idiom set; the OWNED-IDIOMS contract covers every referenced idiom-shaped class; NB — the 4 `icon-(xs\|sm\|md\|lg)` utilities ALREADY resolve via `design-idioms.css:209-232` (W4 `084feb9`), so the I12 bite is the CONTRACT-MEMBERSHIP extension + the magic-number/brittle-calc cleanup, NOT the already-closed icon-no-op — see `i-_HARDEN.md` FORK-I12); **NEW** `proof:sequence-rows-draggable` (I3 — RED: read-only rows `SequenceTarget.vue:19-38`; greens on the draggable rows re-authoring `at:` + the `Sequence` re-sort, dogfooding `useDragScrub` + `Sequence.add`); **NEW** `proof:motion-path-editable` (I3 — RED: fixed `PATH_D`; greens on draggable control points re-emitting `PATH_D`, the single-source invariant `motionPathGeometry.ts:1-11`); **NEW** `proof:motion-path-copy` (I3 — RED: no copy affordance; greens on the `offset-path: path(…)` artifact); **NEW** `proof:easter-egg` (I3 — RED: no eggs; greens when each scene's hidden trigger fires its effect — EE-SEQ-1 "the reel"; EE-MP-2 "the emoji winks"; one per other scene). The HEADLINE: the DRY/encapsulation/de-brittle sweep + the affordance enrichment that DOGFOODS it (inv ζ); the affordances are BORN on the shared `useDragScrub` seam (no churn-then-delete). RE-OPENS the W5-BOOKed `useDragScrub`/H-MI-4/F4-elevation (now over their MEASURE-FIRST thresholds); EXTENDS W10 G3/G6; the engine is FENCED (inv ζ); the only sibling HANDOFF it composes with is W11's glass-ui LabeledField-subgrid. The I3-rung FLOOR fork (default FULL). Folds `audit/feedback/i-_PLAN` (BINDING) · `audit/feedback/i-r5-sequence-path` (BINDING for I3) · `a-styling-idioms §43-87` · `a-scene-spring-sequence §273-277` · `a-scene-path-discrete §135-137`. |
| **H.W8** | THE GATE-REGIME UPGRADE (close the blind spots — the LAST re-paper) | IMPL (Band 5) | **authored — awaits auth (DEPENDS on the visual waves + H.W9 + H.W10 + H.W11 + H.W12)** | `proof:manifest-sourced` + `proof:visual-lock` + the chronic meta-gate — adding a scene to `scenes.ts` without a manifest entry reds (RED: `demo-driver.mjs:40-59` knows 6, the demo ships 9 — sequence/motion-path/starting-style NEVER gate-visited); reverting any D1/D3/D4/D6/D7 trips the named-region pixel diff (needs `pixelmatch`+`pngjs` CI-only devDeps, BLK-4); a bare HANDOFF tag with no born-RED gate reds the ledger (`proof:dock-morph-settled` token-peak born-RED for the dock consume-leg — the canonical SPRING-gate name, NOT `proof:dock-live`; BLK-3; the meta-gate parses `PROGRESS.md`, not the un-authored `FINAL.md`, BLK-2). Three structural additions (I-1 re-source SCENES, I-2 the pixel baseline, I-3 the chronic-closure meta-gate) + the φ-hero floor, motion-liveness, scene-parity, mobile extensions. Folds `a-gate-blindspots`, `a-deferred-chronic` §3, `a-changes-vs-plan`, `a-precept-sweep`. |
| **H.WZ** | The H FINAL + the changeset + provenance | IMPL (LAST) | **authored — awaits auth** | `H/FINAL.md` reconciles the consolidated ledger (every SHIP regression-checked; every chronic closed with a SYSTEM-property gate OR a HANDOFF-with-born-RED gate per §6; every glass-ui/value.js/parse-that HANDOFF tagged + paired); the prompt-recap confirms every A→H ask ADDRESSED / PENDING (sibling-owned) / H-SCOPE; the changeset cut (version owner **Mike Babb**); **absorbs the H.W0–H.W12 gates** (incl. the H.W9 register-collapse gates: the INVERTED `proof:no-orphan-specular` exception=∅, the RETIRED `proof:cartoon-specular-coexist`/`proof:specular-calm`, and the NEW `proof:glass-and-cartoon`/`proof:bezier-no-scroll`/`proof:pp-logo-svg`/`proof:darkmode-row-toggle`/`proof:cartoon-shadow-unclipped`/`proof:idle-fade` + the AMENDED `proof:single-column-pack`; AND the H.W10 scene-normalization gates: the REVISED `proof:scene-icons` (monochrome→expressive-colorful), the NEW `proof:scene-card-rounded`/`proof:scene-uses-standard-ribbon`/`proof:easing-stage-is-ball`/`proof:easing-sidebar-normalized` + the AMENDED `proof:stage-within-docks`; AND the H.W11 round-3 gates: the NEW `proof:stage-glass-card` (which SUPERSEDES the W10 `proof:scene-card-rounded` full-bleed disjunct)/`proof:card-rounded-primitive`/`proof:label-subgrid`/`proof:scene-control-dfa`/`proof:scene-transition-perf`/`proof:bezier-single-card`/`proof:bezier-panel-taller`; AND the H.W12 round-3 gates: the NEW `proof:dragscrub-single`/`proof:composable-encapsulation`/`proof:demo-no-oversize`/`proof:no-brittle-selector`/`proof:styling-idioms`/`proof:sequence-rows-draggable`/`proof:motion-path-editable`/`proof:motion-path-copy`/`proof:easter-egg`); the full `proof:*` suite green; no unintended regression. **NB (BLK-2): the chronic-closure meta-gate's CANONICAL parse substrate is this `PROGRESS.md §"Open deferrals"` chronic table (the single parseable substrate, present today); `H/FINAL.md` does NOT exist until H.WZ and is parsed ADDITIONALLY only behind an `fs.existsSync` guard.** |

## W0 audit evidence (on disk)

The deep audit lands under `audit/` — **35 phase-1 lanes** (`a-*.md`) + **6 `_SYNTHESIS-`
docs**, each `file:line`-grounded or live-anchored with a SHIP/glass-ui-HANDOFF/value.js-
HANDOFF/parse-that-HANDOFF/BOOK/RECORD/KILL disposition and a re-runnable instrument. The
six synthesis docs are the load-bearing reconciliation:

- **`_SYNTHESIS-gap-scorecard.md`** (**LOAD-BEARING — read first**) — the honest post-G
  GAP MAP (`§1`: ALREADY-SOTA vs GAP per axis, each row → owning lane + `file:line`/
  live-anchor + a disposition), the two adjudicated cross-lane divergences (`§2`: the D12
  store facility → `createGlobalState` + hand-rolled FSM reducer over Pinia, 2-of-3 lanes;
  the cartoon depth mechanism → `surface="cartoon"` prop over `.shadow-cartoon-*` class,
  net-deletion), the canonical band→wave map (`§3`: H.W0..H.W8, each wave's headline +
  folded lanes + the biting `proof:*` gate), the cross-repo handoffs (`§4`), the binding
  §ALREADY-SOTA record (`§5`), and the spine (`§6`). The THESIS (`§0`) + the one-paragraph
  H synthesis (`§7`) are here.
- **`_SYNTHESIS-design-language.md`** — the cartoon-shadow / specular / glassmorphism-perf
  reconciliation (folds into H.W2): the 5-lane consensus root-cause (the glass-ui
  `glass-specular-track::before` radial on every `surface="glass"` default), DL-3 (specular
  is opt-in and where kept MUST be pointer-wired via one DRY `useSpecularPointer`), and the
  hero/typography rungs (folds into H.W4).
- **`_SYNTHESIS-frontend-mobile.md`** — the controls-layout / timeline-width / mobile-
  architecture / mode-interactivity reconciliation (folds into H.W3/H.W5/H.W7): the
  `rail·stage·rail` transposition, the single `--rail-width` authority, the overlay
  mobile model + the springy drawer.
- **`_SYNTHESIS-dock-perf-modes.md`** — the dock-lag / glassmorphism-perf / modes-
  pertinence reconciliation (folds into the H.W5 pertinence verdict + the glass-ui dock
  HANDOFF): the pre-AW.W2 `--spring-dock`, the MEASURE-FIRST blur posture (free at dpr=1),
  the KEEP-all-4-MERGE-Discrete verdict.
- **`_SYNTHESIS-deferred-ledger.md`** — the whole-history A→H ledger + the chronic-closure
  audit: the four re-classified chronics (cartoon-shadow, φ-hero, mobile, dock) and the
  P-invariant-policed-the-column failure (folds into the H.W8 meta-gate).
- **`_SYNTHESIS-prompt-recap.md`** — the full A→B→C→constellation→D→E→F→G→H recap; confirms
  the recurring precepts (no-legacy, no-workaround, idiomatic+gestalt, isomorphic,
  measure-first, KISS, inv ε/ζ/16) and the demo-quality asks the gate regime missed. **The
  four recap-extra asks are homed (their §P10 user-phrasing aliases, CP-MED-4):
  "easing modern-web sizing"→D3 (H.W4), "refine the specular"→D14 (H.W2), "scene corruption /
  route storm"→D12 (H.W1), "springy drawer"→D13 (H.W7)** — discoverable by the user's literal
  phrasing, not only the D-number.

The 35 phase-1 lanes under `audit/` — `a-animations-quality`, `a-cartoon-shadow`,
`a-changes-vs-plan`, `a-controls-sidebar`, `a-deferred-chronic`, `a-deferred-ledger`,
`a-demo-architecture`, `a-design-language`, `a-easing-editor`, `a-engine-regressions`,
`a-g-session-audit`, `a-gate-blindspots`, `a-glass-ui-consumption`, `a-glassmorphism-perf`,
`a-glow-artifact`, `a-hero-typography`, `a-historical-dock`, `a-icon-pipeline`,
`a-mbabb-popover`, `a-mobile-architecture`, `a-mode-interactivity`, `a-modes-pertinence`,
`a-perf-dock-lag`, `a-precept-sweep`, `a-prompt-recap`, `a-scene-cube-amiga`,
`a-scene-icons`, `a-scene-path-discrete`, `a-scene-spring-sequence`, `a-scene-square-easing`,
`a-scene-state-machine`, `a-store-architecture`, `a-styling-idioms`, `a-timeline-width`,
`a-typing-dots` — each carries its own `file:line`/live-anchor evidence; `H.md` cites them
per-wave, and the gap-scorecard `§1`/`§3` dedups + adjudicates + dispositions them.

## Verified facts at H-open

Every figure below is a re-runnable `wc`/`grep`/`cat` measurement or a live Playwright
observation against the demo on `tranche-h-dev` (kf 4.1.0 + all of Tranche G, `:5173`),
not the plan's prose — **verified, not asserted** (each cites its owning lane, inv ε).

- **The 2 live console crash FAMILIES ship in 4.1.0 (re-root-caused by the DEEP harden,
  BLK-1).** **H-A1:** `serializeEasing` THROWS **0–3× on a clean cold `#/cube`** (NOT "4× on
  every load" — the "4×" was a polluted multi-session capture + the route storm navigating
  away before the throw; CP-HIGH-2). The throw is at `serializeEasing` (`src/animation/
  format.ts:30`, throw `:36`) ← the readout call (`KeyframesStringControls.vue:~95`, from
  `onMounted :222`), no try/catch. It is NOT the Cube presets (`Rotations`/`Matrix` resolve
  `ease-in-out` and serialize CLEAN); the REAL seams are the easing `contractAnim`
  (`useEasingDemo.ts:268`, a bare `cubic-bezier`/`steps` closure) + amiga
  (`useAmigaAnimations.ts:31,74` pass `CSSCubicBezier(...)` as `timingFunction`) + ~12
  `animations.ts` presets. The G.W4 commit `3d352a3` made `serializeEasing` throw on a bare
  closure with no `.css` twin. **H-A2:** the `"......"` lerp parse-error (`engine.ts:769`
  processFrame / `:779` lerpValue via `:657 interpFrames`) — its TRIGGER is a value.js path
  on route-storm-restored cross-scene state, NOT the hero ellipsis reaching a
  `CSSKeyframesAnimation` lerp (`AnimatedText.vue` is pure CSS, 0 engine symbols).
  (`a-engine-regressions` H-A1/H-A2 — live console observation; CP-MED-1: `src/` =
  `animation/` + `env.d.ts` only on `tranche-h-dev`, the published `src/parsing/format.ts`
  tree predates the consolidation)
- **The 5-authority route storm is LIVE.** NO single source of truth for "active scene" —
  5 competing authorities (route, localStorage, lagging `currentSuperKey`, dock Select,
  debounced `?anim=`) oscillate into an **autonomous route storm**
  (easing→motion-path→starting-style→spring→amiga); 3 competing playback authorities;
  restore = the `isStableFire` double-fire heuristic (`useSceneGroupSync.ts:54`); NO
  genuine SUSPEND; a home↔cube alias. (`a-scene-state-machine §1`, `a-store-architecture`)
- **The specular radial is on ~5–13 panel hosts (route/state-dependent), 0 pointer-wired.**
  glass-ui `glass-specular-track::before` (mouse-tracked radial, .55 white core, `screen`
  blend, .35→.6 hover) on every `<Card surface="glass">` default; live **~5–13 hosts (the
  count moves with route + dock-expansion + mounted panels; CP-MED-2),
  `anyPointerWrite:false`** → a static centered bloom (the radial has no `--mouse-*`
  writer). The INVARIANT (`anyPointerWrite:false` on every track) is stable — the gate
  asserts the invariant, not a count. Cartoon-surface is on EXACTLY 1 site
  (`CSSCodeEditor.vue:6`). (`a-cartoon-shadow` CS-1 — live Playwright)
- **The easing canvas is a 680×680px square** (77% of an 883px panel) — `EasingCurveCanvas
  .vue:269-273` `aspect-ratio:1` off an uncapped `width:100%` with no container context;
  `TimingFunctionPanel.vue:17-19` `text-heading` header + `gap-0` flush double-chrome.
  (`a-easing-editor` — live measurement)
- **The dock runs the pre-AW.W2 bouncy spring.** Installed (pinned `^3.4.0`) glass-ui ships
  `--spring-dock: …0.10932…` = the OLD (0.5, 0.5) register, **sampled ramp peak +16.3%**
  (the analytic spring overshoot is ~+18.5%; the gate parses the sampled +16.3%; CP-MED-3);
  the AW.W2 retune (response 0.32, ζ 0.7, ~167ms settle) is in glass-ui `53c1b07` —
  **PUBLISHED** (glass-ui 3.5.0/3.5.1/3.6.0 on npm, VERIFIED; BLK-5), so the fix is a kf
  consume-leg BUMP `^3.4.0 → ^3.5.1`, NOT a wait.
  (`a-historical-dock` H-dock-2 — measured token — kf CONSUME-LEG, not an await-release handoff)
- **The 61 icon-size classes are silent no-ops.** `icon-sm`×34 / `icon-md`×13 /
  `icon-lg`×11 / `icon-xs`×3 = **61 callsites**; live `anyIconRuleInStylesheets:false`, all
  compute the identical 24px (Lucide default); defined NOWHERE (demo, glass-ui, or git
  history). (`a-styling-idioms §1` — the only lane that found it)
- **The SCENES manifest has drifted 6-of-9.** `scripts/lib/demo-driver.mjs:40-59` declares
  a hand-maintained 6-scene `SCENES` array while the demo ships 9
  (`scenes.ts`) — sequence / motion-path / starting-style are NEVER gate-visited (no gate
  can even probe them). (`a-gate-blindspots` ROOT-B — `cat`)
- **The hero is at a MID φ rung.** `text-display-4` = **86.1px** (live), while glass-ui
  ships the audacious tier (`text-display-mega` 177px, `-hero`, `-audacious`) built for
  poster heroes; the ladder mechanism + Capsize fallback are exemplary (`§5` ALREADY-SOTA —
  the rung selection, not the ladder, is the GAP). (`a-hero-typography` — live)

## § ALREADY-SOTA record (binding — manufacture NO work)

The engine, boundary, parse, and color kernels are **ALREADY-SOTA and H does NOT touch
them** (`audit/_SYNTHESIS-gap-scorecard.md §5`, binding — re-touching exemplary work is the
inverse failure). H must NOT re-touch: (1) the engine kernel — the `lerpValue → iv._lerp`
single-dispatch seam, the G.W17 blend leaf, the G.W18 quaternion-native `rotate3d`, the
`.finished`/DrawSVG/`adoptCompiled` API, the zero-kf-edit re-pin; `engine.ts` at 1375/1400
(25L headroom — H must not grow it without a measured cohesive split); (2) the φ-ladder
MECHANISM + Capsize fallback (only the hero RUNG and 2 leaf rungs are GAP); (3) the
design-idioms token consolidations (rainbow/gold/rail/ball/badge/code-token single-
sourcing, z-contract, 0 `!important`, 0 SFC `@apply`); (4) the scene SUBJECT dogfood
(cube `AnimationGroup`, spring `SpringProgress` rail, sequence transport, `useSceneSwap`,
`CopyButton` — the GAP is the CHROME, not the subjects); (5) glass-ui consumption hygiene +
the specular `::before` BUILD (its defect is tuning/seam, not perf); (6) demo rAF
orchestration + blur-free-at-dpr=1; (7) the affixed-dock + safe-area scaffolding (the
mobile SKELETON is correct; only the COMPOSITION is GAP); (8) the deferred-ledger / re-pin
spine; (9) the gate lattice at what it covers (the GAP is the missing appearance +
interaction axes, H.W8, not the existing gates). **Per the spine (KISS), no wave may
manufacture a deficit where the post-G state leads.**

## Cross-repo / USER-DOMAIN perimeter (inv-16 — consume, HANDOFF, do NOT re-author)

H is keyframes-internal in its demo waves; the cross-repo items are HANDOFF-tagged and the
sibling owner sequences them. Per the chronic-closure discipline (`§6`), **each HANDOFF is
PAIRED with a born-RED kf gate** so a bare column-migration cannot masquerade as closure
(`audit/_SYNTHESIS-gap-scorecard.md §4`):

1. **kf CONSUME-LEG — the dock LAG (D5-b) — CONSUMED + GREEN (no longer pending).** The
   retune `53c1b07` is PUBLISHED in glass-ui 3.5.0/3.5.1/3.6.0 (npm, VERIFIED), so kf bumped
   `@mkbabb/glass-ui ^3.4.0 → ~3.5.1` to consume it (installed 3.5.1; NO kf fork). The
   `~`-cap is DELIBERATE: 3.6/3.7 re-regress (the cartoon-surface `::before` re-emits the
   specular catch-light on hover → `proof:no-orphan-specular` FAIL went 2→3 at 3.7.0), so
   ~3.5.1 is the MINIMUM published 3.x carrying the dock retune WITHOUT the 3.6/3.7 surface
   regression. The kf-side pairing `proof:dock-morph-settled` (token-peak form, `--spring-dock`
   ramp peak ≤ +6%) is **GREEN** — installed peak +4.5% ≤ +6% (down from the 3.4.0 +16.3%
   born-RED witness; the gate reads `node_modules`, inv-16). So D5 closes via this passing
   SYSTEM gate, NOT a born-RED HANDOFF still pending a release. Reconciling the demo to 3.6/3.7
   is a FOLLOW-ON glass-ui-reconciliation HANDOFF, not this close.
2. **glass-ui consume-edge — the Card specular SEAM (D2/D14 root) — VISIBLE BLOOM DEAD at
   ~3.5.1; the residual inert track is a COSMETIC opt-out, NOT a blocker.** The 3.4.0 Card
   painted a VISIBLE dead-centered white specular bloom on glass surfaces; **glass-ui 3.5.0
   KILLED that visible bloom** (the hover-radial is dead), so at the consumed ~3.5.1 the glass
   stages are VISUALLY CLEAN (no bloom). The W11 I5 SANCTIONED glass STAGES (easing/spring/
   starting-style/sequence/motion-path `<Card>`, `surface=glass`) still carry glass-ui's
   `.glass-specular-track` class, but it is **INERT** (no visible bloom at 3.5.1) — glass-ui-
   owned, not a kf defect (inv-16: kf does NOT own the Card surface map). The glass-ui **3.8.0
   opt-out** (`specular="off"` default — removes the inert class) is a COSMETIC consume-edge: a
   forward nicety to take on a future reconciliation, **NOT a blocker, NOT a born-RED gate**.
   H.W2 shipped the kf-demo half (`surface="cartoon"` flip on PANELS); the cartoon panels are
   bloom-free at source on ~3.5.1.
3. **glass-ui-HANDOFF — the `{types}` directional VT helper + the mobile drawer `spring`
   prop BOOK.** `a-mobile-architecture` proves the demo drawer is BESPOKE (not vaul/Sheet) →
   the drawer SHIPs in H.W7; the glass-ui `DrawerContent` `spring` prop ask is a BOOK.
4. **value.js-HANDOFF (CHRONIC-by-design).** The next-slice (E1/E2 linear parser, VJ-F1
   path sampler, F2 color sentinels, MCI-5 identity pad, VJ-F2 error sink, VJ-F4 buffer
   overload, F3 LRU) rides the next re-pin, ZERO kf edit; the `it.fails` MCI-5 witness IS
   the consume signal.
5. **parse-that-HANDOFF.** The `(id,offset)` packrat re-key (PT-4) — author
   `proof:packrat-position`, then re-key.
6. **deploy-HANDOFF (P0).** The `dns-cf-sync.sh` CNAME (G-HANDOFF-3).

## Open deferrals

**Zero perpetual punts** — and H's defining repair is that a chronic can no longer be
re-papered. The chronic-closure discipline (`audit/_SYNTHESIS-gap-scorecard.md §0/§6`,
`a-deferred-chronic §2-3`, H.W8) is BINDING: **a chronic exits ONLY with (a) a passing
SYSTEM-property gate, or (b) a HANDOFF tag PAIRED with a born-RED kf gate.** The four
chronics that "exited" the A→G ledger by re-classification (not solution) are re-opened and
each lands against this discipline:

| Chronic | Prior false-close mode | H closure (the SYSTEM-property gate or paired born-RED HANDOFF) |
|---|---|---|
| **cartoon-shadow depth (D2) / specular (D14)** | M1 — issue-level close masquerading as system close | **SYSTEM gate** — `proof:cartoon-is-panel-depth` + `proof:no-orphan-specular` (H.W2); the glass-ui Card-seam HANDOFF is PAIRED. **H.W9 REFINEMENT (user-feedback F3/F6/F8):** the W2 S2-COMPOSITE (the lone tracked-specular bezier card) is **RETIRED** — `proof:cartoon-specular-coexist` + `proof:specular-calm` retire (their subject deleted) — and the cartoon chronic STAYS CLOSED via a **STRONGER** inverted `proof:no-orphan-specular` (exception set `{bezier}` → ∅: ZERO `.glass-specular-track` on ANY kf-owned `<Card>`); the glass returns via `tier="quiet"` (the NEW `proof:glass-and-cartoon` locks it). The chronic exit STILL satisfies the discipline (a SYSTEM-property gate) — a re-paper caught BEFORE H.W8's golden baseline locked it, NOT a re-open. Nothing falsely closed: `proof:cartoon-is-panel-depth` stays GREEN (tier-agnostic); the glass-ui Card-seam HANDOFF stays PAIRED (`proof:specular-handoff` unchanged). **Meta-gate (H.W8 S3) parse contract:** this row's LOAD-BEARING gate set is `proof:cartoon-is-panel-depth` + `proof:no-orphan-specular` (inverted to exception=∅) + `proof:glass-and-cartoon` + the paired `proof:specular-handoff` — all RESOLVE + green; the RETIRED `proof:cartoon-specular-coexist`/`proof:specular-calm` are NARRATIVE references to deleted gates (required ABSENT from `proof:all`, NOT required to resolve), so H.W9's retire does not red the row. |
| **φ-hero typography (D7)** | M1 — issue-level close masquerading as system close (C.W2 closed the CSSCodeEditor/display-tier site; the hero never reached a hero rung; raw body rungs lingered) | **SYSTEM gate** — `proof:phi-leaf-zero` (BOTH halves: the hero resolves the `text-display-mega` CLASS AND a px floor at a fixed named viewport — `font-size ≥ 140px` at 1440×900, NOT a `≥ --type-display-mega` clamp-vs-clamp comparison; CP-HIGH-3 — AND **0 raw `text-*` rungs** across the demo, where the residual is **2 (L1 `AnimationMenuBar.vue:102` + L2 `MotionPathTarget.vue:119`)** under the gate's `ui/` exclusion, NOT 37 — 37 materializes only by counting vendored `ui/` shadcn; WV-W4-HIGH-1/HS-HIGH-3) (H.W4); `proof:hero-rung` alone is the rung half — insufficient for M1 (it leaves the lingering raw rungs un-policed) |
| **mobile architecture (D10)** | M2 — scope-narrowing (stack "fits", not overlay) | **SYSTEM gate** — `proof:mobile-single-page` + `proof:drawer-spring` (H.W7) |
| **dock LAG (D5)** + **@mbabb popover (D9)** | D5: M3 — column-migration to HANDOFF with NO paired kf gate; D9: dropped from the chronic table entirely (CP-MED-5) | **D5 — CLOSED via a passing SYSTEM gate (NOT a born-RED HANDOFF).** The dock retune (`53c1b07`) is CONSUMED: kf pins `@mkbabb/glass-ui ~3.5.1` (installed 3.5.1; BLK-5; `~`-capped below 3.6/3.7 which re-regress) and `proof:dock-morph-settled` (token-peak ≤+6%) is **GREEN** — the installed `--spring-dock` ramp peak is **+4.5% ≤ +6%** (down from the 3.4.0 +16.3% born-RED witness). The gate reads `node_modules/@mkbabb/glass-ui` (inv-16 — kf CANNOT fork the token to green it; only the consumed bump does), so D5's closure IS a passing SYSTEM gate, NOT a column-migration-to-HANDOFF. **D9 — SYSTEM gate (kf SHIP)** — `proof:dock-popover-opens` + `proof:single-toggle` (the App.vue un-double-wrap; H.W1 S8, BLK-8/CP-MED-5) — D9 IS kf-patched, distinct from the D5 dock-CHROME consume-leg |

The full whole-history A→H ledger + the chronic-closure audit is in
`audit/_SYNTHESIS-deferred-ledger.md`. The cross-repo items are HANDOFFs (each its own
surface, each PAIRED with a born-RED kf gate, `§4`) — **not kf-owned debt, and not
perpetual punts.** No item is named-forward to a ninth tranche; the H.W8 gate-regime
upgrade (the appearance axis, the interaction axis, the re-sourced manifest, the
chronic-closure meta-gate) is the structural close that makes H the LAST tranche these
four chronics can be re-papered. **Two formerly-unhomed "DECIDE" items are now owned
(CP-MED-6): DC-8 (scene-swap dead CSS) → H.W5 (it touches `useSceneSwap`) with a `grep=0`
gate; FB-6 (the `Mod+K` palette) → an owner-decision at H.WZ's BOOK ledger — neither is a
latent perpetual punt.**

**Landed-decision SUPERSEDES (the honest ledger — H.W9 + H.W10 course-correct specific
landed wave decisions, observed by the user on the running `tranche-h-impl` demo).** These
are NOT chronics (no false-close history) — they are corrective supersedes of decisions the
W2/W3/W4/W5 waves DID land, caught by the user's two feedback rounds BEFORE H.W8's golden
baseline locked them. Each is cited in the owning wave's §supersede-map (`waves/H.W9.md`,
`waves/H.W10.md`), never a rewrite of the landed §Goal:

- **H.W9 (F1–F9)** supersedes W3.S1 (the per-row split — F1), the W4.S1/S2 bezier-panel
  sizing band (F2), W2.S3 (the tracked specular — F3), W2.S2-COMPOSITE (F6), W2.S1 (the
  resting tier — F8). The cartoon chronic (D2) STAYS CLOSED via the STRONGER inverted
  `proof:no-orphan-specular` (exception=∅) — see the chronic table above.
- **H.W10 (G1–G8)** supersedes **W5.S2** (the survivor-SVG icon family authored monochrome
  `fill="none" stroke="currentColor"` — **the SECOND feedback round REVERSES this to
  expressive/colorful**: the user named the previous COLORFUL icons as correct; W5 INFRA is
  KEPT — the inline-`<svg>` `SceneDescriptor.icon` family + the `vite-svg-loader` `?component`
  seam + `convertColors:false` are the SUBSTRATE, only the icon ASSETS re-color (from the
  demo's `--rainbow-*`/`--accent-*`/`--color-progress` palette) AND the `proof:scene-icons`
  gate REVISES (the no-baked-hue / "stroke==host color" / dark≠light clauses INVERT to assert
  expressive color + legible-on-both; coverage/no-raster/favicon-404 KEPT) — W5's own commit
  body PRE-AUTHORIZED this supersede; G1), **W5.S4** (the easing curve PROMOTED to the stage —
  the duplicate-curve-on-stage; G4 reverses it to ONE engine-driven ball, the inv ζ dogfood),
  the born-bespoke `ribbonContent` fork (`f1d4fe6`; G3/G7 — the easing/spring scenes REUSE the
  standard `PlaybackRibbon`), the born-bespoke `EasingSidebar`+`SpringSidebar` nested assemblies (`f1d4fe6`; G5/G6
  — flatten each onto the standard `Card surface="cartoon" tier="quiet"` + `Labeled*` rows, a NAMED
  amendment to the pending H.W9 S1 EasingSidebar+SpringSidebar site-lists), and the W3 `[stage]`-track form
  (G8 — the dock bands are reserved on the grid via existing tokens, the per-scene `dock-inset`
  deletes, the stage goes full-bleed). H.W10 COMPOSES with H.W9 (G6 INHERITS F1's row idiom +
  the quiet register), lands AFTER it (H.W9 → H.W10 → H.W8), and emits NO glass-ui patch (it
  CONSUMES public engine primitives + the in-tree glass-ui `<Card>`/`PlaybackRibbon`).

## Release tier (reconciled)

H stacks atop the RELEASED `4.1.0` (D `major` + E + F + G landed + published). H is the
**demo-quality tranche** — the bulk of its content is demo-local (layout, design-language,
mobile, scene-state, icons, typing-dots) + the gate-regime upgrade + two engine
correctness fixes (H-A1 the `serializeEasing` throw/`.css`-twin, H-A2 the engine
discrete-hold guard for a bare text leaf). The two engine fixes correct WRONG behaviour
(a throw on every Cube load; a parse-error abort) — a *shipped-product-correctness* fix.
The version owner (**Mike Babb**) names H's tier definitively at H.WZ; the re-publish leg
is USER-DOMAIN, confirm-first, atop the clean `4.1.0` base.
