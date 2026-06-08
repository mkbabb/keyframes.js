# Tranche H — keyframes.js: the demo-quality / design-language-restoration / mobile / scene-state tranche after G's correctness re-pin · the two live console crashes killed first · the one formal scene+playback state machine · the four chronics closed for the LAST time

H is keyframes.js' eighth tranche, and the FIRST since A→G whose actionable band is the
**DEMO, not the engine**. D refined the demo to the engine's encapsulation standard,
transposed the engine to its gestalt, and was the terminal home for every keyframes-owned
deferral. E made the demo fast + modern-web-aligned and opened the platform-adoption seam.
F was the narrow finisher — 16 gated waves, the value.js/parse-that/glass-ui hand-offs
DRIVEN to publication, the 4.0.0 stack released. **G was narrower still** — the dep RE-PIN
spine that consumed the published F sibling-wins kf itself drove but never consumed,
around a long, honest ALREADY-SOTA refusal: the engine, boundary, parse, color, and
φ-ladder kernels confirmed exemplary and touched by no wave.

**H is a DIFFERENT shape.** G re-pinned correctness; the engine, boundary, parse, and
color kernels are ALREADY-SOTA and **H does not touch them**
(`_SYNTHESIS-gap-scorecard §0`, binding). The 35-lane phase-1 deep assay + 6 synthesis
lanes converge on a single thesis: **the actionable band is the demo — and it is a band
G's source-and-contract gate regime was STRUCTURALLY BLIND to.** The A→G gate lattice
locks SOURCE-SHAPE and NOT-BLANK; it has no appearance axis, no interaction axis, and a
drifted SCENES manifest — so user-visible defects (a lopsided two-column layout, a radial
bloom where cartoon depth belongs, an 86px hero where a 177px poster belongs, a broken
ellipsis, a mobile stack that crushes the stage to 30px) sailed through green CI A→G
(`_SYNTHESIS-gap-scorecard §1`, `a-gate-blindspots`). **Two live console crashes ship in
4.1.0** (`serializeEasing` throws 4×/Cube-load; the `"......"` lerp parse-error) and must
die first. **The CRITICAL keystone is ONE formal scene+playback state machine** that ends
the routed-state corruption (a live autonomous route storm) and makes play/pause
suspend/restore an identity. The cross-repo dock lag, the Card-specular seam, and the
value.js/parse-that slices are HANDOFFs, each paired with a born-RED kf gate. **H proves
itself by closing the four chronics (cartoon-shadow, φ-hero, mobile, dock) for the LAST
time — repairing the P-invariant to police the PRODUCT, not the column.**

## § Phase — TRANCHE DEVELOPMENT (the audit + these docs; implementation awaits authorization)

H is in DEVELOPMENT now, on branch `tranche-h-dev` (D+E+F IMPLEMENTED + RELEASED, G's
re-pin landed — kf `4.1.0`; value.js `0.11.1`, parse-that `0.9.0`, glass-ui `3.4.0` all
consumed PUBLISHED, demo live at `:5173` — the dev port is Vite-assigned; gates use `serveDist`'s reported port; CP-LOW-2). The deep audit is RUN — the evidence is on disk
under `docs/tranches/H/audit/` (35 phase-1 `a-*` lanes + 6 `_SYNTHESIS-*` synthesis lanes,
each `file:line`-grounded or live-anchored with a SHIP/MEASURE-FIRST/BOOK/RECORD/HANDOFF/
KILL disposition and a re-runnable instrument). This charter (`H.md`), the gap-scorecard,
the prompt-recap, and the deferred-ledger are the DEVELOPMENT artifacts. **H.W0–H.W9 are
authored-now-run-later wave specs; the implementation phase opens only on explicit user
authorization, gated on keyframes' own green CI — exactly D.W0's, E.W0's, F.W0's, and
G.W1's dev/impl boundary.** No engine, demo, library, parser, test, or bench source is
written in development. **This is TRANCHE DEVELOPMENT — docs ONLY, ZERO source/test/CI/demo
edits.** (H.W9 is the CORRECTIVE design-language refinement round added after the user
audited the running `tranche-h-impl` demo — F1–F9; it SUPERSEDES specific landed W2/W3/W4
decisions and lands BEFORE H.W8's golden baseline. Its authoritative plan is
`audit/feedback/_PLAN.md`.)

## § Mandate (binding — every wave, every fold, every hand-off · the spine)

The standing precepts, carried verbatim-in-substance from `G/G.md:46-91` (themselves from
`F/F.md:35-63`), re-confirmed HONORED A→G with the drift clustered on ONE seam — the
scene+playback state machine D12 (`_SYNTHESIS-prompt-recap §3`) — and BINDING on every H
wave (H.W0–H.W9), every gate, and every cross-repo hand-off this tranche emits
(`_SYNTHESIS-gap-scorecard §6`, the spine, verbatim-in-substance):

- **NO quick solutions, NO workarounds** — idiomatic, gestalt approaches only. A wave may
  not neutralize a symptom at the wrong seam, mask an occlusion, or offer a weaker escape
  hatch beside the real fix. The hard gates are written to pass ONLY the transposition.
  (Specifically forbidden for H: the radial dies because the surface map STOPS EMITTING
  the class via `surface="cartoon"` — **NOT** an `!important`/`display:none` neutralizer
  (`_SYNTHESIS-gap-scorecard §2.2`); the FSM is the real fix for D12 — **NOT** a patched
  `isStableFire` double-fire heuristic kept beside it; the mobile sheet is an OVERLAY —
  **NOT** an accordion that displaces the stage.)
- **NO legacy beside its replacement** — a replaced surface is replaced in ONE motion. The
  manual `.glass-card` plate dies WITH the `surface="cartoon"` swap; the `isStableFire`
  heuristic dies WITH the FSM; the orphan `-lg` PNG icons die WITH the inline-SVG family;
  the `springLinearStops` triple-fork collapses to ONE composable; the deprecated `next()`
  guard is dropped (`_SYNTHESIS-gap-scorecard §6`, `§3 H.W1/H.W2/H.W5`).
- **NO god modules** — the demo's problem is decomposed-along-the-WRONG-axis, not length;
  MEASURE-FIRST before any split. KISS · DRY · no nested imports · no test-in-src. Styling
  ISOMORPHIC unless a NAMED, befitting delta — and H carries exactly three named deltas
  (the cartoon-vs-glass surface swap, the hero mega rung, the icon differentiation;
  `_SYNTHESIS-gap-scorecard §6`).
- **MEASURE-FIRST** — every perf claim lands behind a shaped biting bench or is
  recorded-withheld WITH the measurement (the dock `collapse-delay` tune, the dpr² blur
  scaling, the `viewBox` recompute — gate before claiming a win;
  `_SYNTHESIS-gap-scorecard §6`, `a-glassmorphism-perf`). **inv-16 HOLDS for H:** kf
  consumes glass-ui PUBLISHED (currently pinned `^3.4.0`; H bumps to `^3.5.1` to consume the
  published dock-spring retune — BLK-5, a consume-leg not a fork); the dock/specular/value.js/
  parse-that items are AUDITED + HANDOFF-tagged, never authored or patched in kf (the
  dock-spring is a CONSUME of glass-ui's published token, not a kf re-author).

**ENFORCEMENT (inv ε):** every code claim in this charter cites a `file:line`/live anchor
or a named phase-1/synthesis lane; every disposition is tagged; the §ALREADY-SOTA record
(§ below) is binding — **no wave may manufacture a deficit where the post-G state is
exemplary** (the engine, parse, color, φ-ladder mechanism, design-idioms consolidations,
scene-SUBJECT dogfood, glass-ui consumption hygiene; `_SYNTHESIS-gap-scorecard §5`). An
adversarial precept sweep (`_SYNTHESIS-prompt-recap §3`, `a-precept-sweep`) found three
breaches, ALL in the actionable band and ALL repaired by an H wave: D2/D14 idiom (the
dropped cartoon-shadow → H.W2), D8 DRY (the 61 no-op icon classes + dual icon idioms →
H.W4/H.W5), D12 workaround+fail-explicit (the `isStableFire` heuristic + the silent
`serializeEasing` degrade → H.W1/H.W0).

## § The invariant set carried into H

| inv | Statement | H posture |
|---|---|---|
| **inv ε** | verify, do not assert — cite for every claim, ground every SOTA claim | HONORED — every row traces to a synthesis/phase-1 lane or a re-verified `file:line`/live anchor on `tranche-h-dev` (`_SYNTHESIS-gap-scorecard §0 Method`, `§1`). |
| **inv ζ** | the shop-window (chrome) runs on its own engine (no hand-rolled rAF/loops) | **THE H DELTA** — the scene SUBJECTS dogfood the engine (cube `AnimationGroup`, spring `SpringProgress`, `CopyButton` `CSSKeyframesAnimation` — the template) but the CHROME does not: the typing-dots are a hand-rolled CSS `dot-fade`, the mobile drawer a 550ms CSS `grid-template-rows` ease. H.W6 makes the dots dogfood `steppedEase`/`NumericAnimation`; H.W7 makes the drawer dogfood `SpringProgress` (`_SYNTHESIS-gap-scorecard §1.1 typing-dots/mobile`, `a-typing-dots`, `a-mobile-architecture`). |
| **inv δ** (drift-2) | "zero dock-over-content overlap" is a HARD gate, not advisory | HOLD — the G.W12 occlusion contract STANDS; H.W7's mobile overlay must full-bleed the stage WITHOUT re-introducing a dock occlusion; both docks stay affixed honoring `--work-area-*-offset` (`a-mobile-architecture` F3 ALREADY-SOTA; `_SYNTHESIS-gap-scorecard §3 H.W7`). |
| **inv-16** | kf consumes glass-ui/value.js/parse-that; sibling items are HAND-OFFs | HOLD — H consumes glass-ui PUBLISHED through the LabeledField/subpath idioms (currently `^3.4.0`; H BUMPS to `^3.5.1` to consume the published dock-spring retune `53c1b07` — a kf consume-leg, BLK-5, NOT a fork); the Card specular seam, the value.js next-slice, and the parse-that re-key are AUDITED as sibling surfaces and HANDOFF-tagged (§4), each paired with a born-RED kf gate (`_SYNTHESIS-gap-scorecard §4`, `§3 H.W8`). |
| **the chronic-closure meta-invariant** (NEW, H-born) | a chronic exits ONLY with (a) a passing SYSTEM-property gate, OR (b) a HANDOFF tag PAIRED with a born-RED kf gate | **THE H REPAIR.** Four user-visible chronics (cartoon-shadow D2, φ-hero D7, mobile D10, dock D5) "exited" the A→G ledger not by being SOLVED but by being RE-CLASSIFIED — issue-level close masquerading as system-level close (M1), scope-narrowing to a terminable sub-problem (M2), column-migration to HANDOFF (M3). **The P-invariant policed the COLUMN, not the PRODUCT.** H.W8 installs this meta-gate so the four cannot be re-papered (`_SYNTHESIS-gap-scorecard §0 meta-lesson / §3 H.W8`, `a-deferred-chronic §2-3`). |
| **the gate-blindspot lesson** (NEW, H-born) | the gates lock SOURCE-SHAPE + NOT-BLANK; they have NO appearance axis, NO interaction axis, a drifted SCENES manifest | **THE H STRUCTURAL ADD.** Three of nine shipped scenes (sequence/motion-path/starting-style) are NEVER gate-visited (`demo-driver.mjs:40-59` knows 6, the demo ships 9). H.W8 re-sources the manifest from `scenes.ts`, adds a `proof:visual-lock` pixel baseline (the single broadest lever — converts D1/D3/D4/D6/D7/D10 appearance defects into one re-runnable diff), and an interaction axis (`_SYNTHESIS-gap-scorecard §3 H.W8`, `a-gate-blindspots`). |

## § Thesis — H is the demo-quality / design-language-restoration / mobile / scene-state tranche G could not see

(THE THESIS, copied from `_SYNTHESIS-gap-scorecard §0`, verbatim-in-substance.)

**G re-pinned correctness (the value.js/parse-that/glass-ui consume-spine, exemplary). H
is the demo-quality / design-language-restoration / mobile / scene-state tranche that G's
source-and-contract gate regime was structurally blind to.** The engine, boundary, parse,
and color kernels are ALREADY-SOTA and H does NOT touch them. The actionable band is the
DEMO: a layout transposition (one `rail·stage·rail` grid), the restoration of
cartoon-shadow depth as the panel hover/depth idiom (the specular radial dialed to a quiet
catch-light), the φ-ladder hero bump, the easing-editor sizing, the
typing-dots/icon/popover fixes, mobile-as-overlay + a springy `SpringProgress` drawer,
per-mode interactivity — and, CRITICAL and central, **one formal scene+playback state
machine** that ends the routed-state corruption + makes play/pause suspend/restore an
identity. Two live console crashes (serializeEasing, the `"......"` lerp) ship in 4.1.0 and
must die first. The cross-repo dock lag + drawer + Card-specular-seam are
glass-ui-HANDOFFs; value.js/parse-that items ride the next re-pin.

**The meta-lesson H must internalize** (`a-deferred-chronic §2-3`, the deferred-chronic
spine): four user-visible chronics "exited" the deferred ledger A→G not by being SOLVED
but by being RE-CLASSIFIED — issue-level close masquerading as system-level close (M1),
scope-narrowing to a terminable sub-problem (M2), or column-migration to HANDOFF (M3). The
P-invariant policed the COLUMN, not the PRODUCT. H's repair: a chronic exits only with (a)
a passing SYSTEM-property gate, or (b) a HANDOFF tag PAIRED with a born-RED kf gate. This
discipline is woven into every wave's proof gate below.

**Around the keystone, H is:** (a) two live-crash kills that must precede every visual
measurement (H.W0); (b) the FSM keystone — five lanes name D12 as a blocker (H.W1); (c)
the design-language restoration — the cartoon-vs-glass surface swap + the wired catch-light
(H.W2, 5-lane consensus, root-caused); (d) the structural layout transposition — one
`rail·stage·rail` grid + one `--rail-width` token making D1/D4/D10 cohesive (H.W3); (e)
the visual-fidelity rungs — the easing canvas ceiling + the φ-hero mega bump + the icon
idiom (H.W4); (f) the new modes finished — one themable inline-SVG icon family, the
Discrete→Spring merge, per-mode interactivity (H.W5); (g) the typing-dots dogfood primitive
(H.W6); (h) the mobile overlay + springy drawer (H.W7); and (i) the gate-regime upgrade
that closes the blind spots so this is the LAST re-paper (H.W8).

**The §ALREADY-SOTA binding record (the refusal):** the engine kernel (interpolation
dispatch seam, the G.W17 blend leaf, the G.W18 quaternion-native rotate3d,
`.finished`/DrawSVG/`adoptCompiled`), the φ-ladder MECHANISM + Capsize fallback, the
design-idioms token consolidations, the scene SUBJECT dogfood, the glass-ui consumption
hygiene + the specular `::before` BUILD, the demo rAF orchestration, the affixed-dock +
safe-area scaffolding, and the deferred-ledger re-pin spine are ALREADY-SOTA and H touches
NONE of their kernels (`_SYNTHESIS-gap-scorecard §1.2/§5`). **H manufactures NO work where
D+E+F+G lead — this is binding. Re-touching exemplary work is the inverse failure.**

## § The band → wave map (the canonical structure)

(The canonical H structure from `_SYNTHESIS-gap-scorecard §3` — nine original waves H.W0–H.W8,
plus the CORRECTIVE H.W9 added after the user audited the running `tranche-h-impl` demo: TEN waves.
Each: a band/theme · the headline disposition · the folded lane(s) · the falsifiable `proof:*` gate
that BITES — born-RED today, GREEN at close. **Waves are ordered by dependency: H.W0
(crashes) and H.W1 (state machine) are PREREQUISITES** — five lanes name D12 as a blocker;
the live crashes poison every other measurement. H.W9 sits AFTER W2/W3/W4/W6 and BEFORE H.W8's
golden baseline — the row order in the table below reflects that dependency placement.)

| Band | Theme | Wave | Net-new vs folded |
|---|---|---|---|
| **H.W0 — Crashes** | kill the two live console crashes (the demo must not throw) | H.W0 | net-new (the prerequisite — blocks every clean measurement) |
| **H.W1 — Scene+playback FSM** | the CRITICAL keystone — ONE finite state machine | H.W1 | net-new (the keystone; 5 lanes name it a blocker) |
| **H.W2 — Design language** | cartoon depth restored + the specular dialed to a wired catch-light | H.W2 | net-new (5-lane consensus, root-caused) |
| **H.W3 — Controls-column layout** | the `rail·stage·rail` grid + one `--rail-width` token | H.W3 | net-new (the structural transposition; makes D1/D4/D10 cohesive) |
| **H.W4 — Easing editor + φ-hero** | the visual-fidelity rungs + the icon-size idiom | H.W4 | net-new (1 MIXED bump + 2 GAP sizings + 1 NEW idiom) |
| **H.W5 — Scene icons + mode pertinence + cube/amiga scene-quality** | one themable SVG family + the Discrete merge + interactivity + the cube/amiga scene-quality/perf budget | H.W5 | net-new (the new AND original modes finished; 8 scene/perf lanes fold) |
| **H.W6 — Typing-dots + chrome dogfood** | the staggered `.typing-dots` primitive (inv ζ) | H.W6 | net-new (root-caused; the chrome dogfood) |
| **H.W7 — Mobile overlay + springy drawer** | overlay model + the `SpringProgress` sheet | H.W7 | net-new (architectural transposition) |
| **H.W9 — Design-language refinement round 2** | the calm glass+cartoon register (F3+F6+F8 collapse: keep `surface="cartoon"`, add `tier="quiet"`, REMOVE the tracked specular) + the F1–F9 user-feedback fold | H.W9 | CORRECTIVE (the user-feedback refinement round; SUPERSEDES specific landed W2/W3/W4 decisions; net-deletion-leaning; AFTER W2/W3/W4/W6, BEFORE H.W8's golden baseline) |
| **H.W8 — Gate-regime upgrade** | the appearance axis + interaction axis + manifest + chronic meta-gate | H.W8 | net-new (closes the blind spots; the LAST re-paper; the H.W9 calm register is what its golden baseline locks) |

The finding → wave map (each D1–D14 + each `a-*` lane → its owning wave; each row → its
disposition headline; from `_SYNTHESIS-gap-scorecard §1/§3` and `_SYNTHESIS-prompt-recap
§4`):

| Finding(s) / lane(s) | Wave | Title | Disposition headline |
|---|---|---|---|
| live crashes (NEW, HIGH) · `a-engine-regressions` H-A1/H-A2 · `a-scene-state-machine §3` | **H.W0** | KILL the live crashes | SHIP-in-H (prerequisite — 0 console errors on Cube load) |
| **D12** (CRITICAL) · `a-scene-state-machine` · `a-store-architecture` · `a-demo-architecture` F3/F6/F8 · `a-engine-regressions` H-A3 | **H.W1** | the scene+playback state machine | SHIP-in-H (the keystone; ONE FSM; `createGlobalState`+reducer) |
| **D2/D14** · `a-cartoon-shadow` · `a-design-language` A1/A2/A7 · `a-glow-artifact` · `a-glass-ui-consumption` D2/D14 · `a-glassmorphism-perf` G2 | **H.W2** | restore the design language | SHIP-in-H (`surface="cartoon"`) + glass-ui-HANDOFF (the seam) |
| **D1/D4** · `a-controls-sidebar` · `a-timeline-width` · `a-demo-architecture` F1/F2/F4 | **H.W3** | the controls-column layout | SHIP-in-H (the `rail·stage·rail` grid; one `--rail-width`) |
| **D3/D7** + icon-sizing (NEW) · `a-easing-editor` · `a-hero-typography` · `a-design-language §2/§3` · `a-styling-idioms §1/§5/§6` | **H.W4** | the easing editor + hero φ-typography | SHIP-in-H (canvas ceiling + mega rung) · RECORD (ladder SOTA) |
| **D8/D11** · `a-scene-icons` · `a-icon-pipeline` · `a-modes-pertinence` · `a-scene-spring-sequence` · `a-scene-path-discrete` · `a-scene-square-easing` · `a-mode-interactivity` · `a-scene-cube-amiga` (A2/A3/A5; A7/A9 BOOK) · `a-glassmorphism-perf` G1-demo/G5 | **H.W5** | scene icons + mode pertinence + cube/amiga scene-quality | SHIP-in-H (SVG family + Discrete→Spring merge + interactivity + S6 cube/amiga scene-quality/perf budget) |
| **D6** · `a-typing-dots` · `a-animations-quality` F1 · `a-styling-idioms §4` | **H.W6** | typing-dots + chrome dogfood | SHIP-in-H (the dogfooded staggered primitive; inv ζ) |
| **D10/D13** · `a-mobile-architecture` F1/F2 · `a-demo-architecture` F5 | **H.W7** | mobile overlay + springy drawer | SHIP-in-H (overlay model + `SpringProgress` sheet) |
| **F1–F9** (the user-feedback refinement round, live-observed on `tranche-h-impl`) · `audit/feedback/r1-source-rootcause` · `r2-git-archaeology` · `r3-design-reconcile` · `audit/feedback/_PLAN` (BINDING) | **H.W9** | design-language refinement round 2 (the consolidated feedback fold) | CORRECTIVE SHIP-in-H — the F3+F6+F8 register collapse (keep `surface="cartoon"`, add `tier="quiet"`, REMOVE the tracked specular) + F1 row-split / F2 bezier-fit / F7 shadow-unclip / F4 pp-logo / F5 darkmode-row / F9 idle-fade; SUPERSEDES specific landed W2/W3/W4 decisions (the §supersede-map); 2 glass-ui HANDOFFs; the F6 USER-DECISION fork (default REMOVE) |
| **D9** · `a-mbabb-popover` · `a-glass-ui-consumption` D9 · `a-historical-dock` H-dock-1 | **H.W1 S8** (popover; FSM-coupled; OWNED, BLK-8) | the @mbabb popover re-open | SHIP-in-H (drop the double-wrapped trigger; born-RED `proof:dock-popover-opens` + `proof:single-toggle`) — **D9 IS kf-patched** (the App.vue un-double-wrap; the dock memory-rule "consumed glass-ui fixes it / do NOT patch in kf" applies to dock CHROME, NOT the @mbabb App.vue markup; CP-HIGH-4) |
| **D5** (dock LAG, cross-repo) · `a-historical-dock` · `a-perf-dock-lag` · `a-glassmorphism-perf` G4 · `a-glass-ui-consumption` D5 | **H.W8** (kf consume-leg + born-RED gate, BLK-5) | the dock lag | **kf SHIP-in-H consume-leg: bump `@mkbabb/glass-ui ^3.4.0 → ^3.5.1`** (`53c1b07` IS PUBLISHED — glass-ui 3.5.0/3.5.1/3.6.0 on npm, VERIFIED; NO wait, NO kf fork) PAIRED with born-RED `proof:dock-morph-settled` (token-peak form: `--spring-dock` ramp peak ≤ +6%; RED at the installed +16.3% today) + SHIP-in-H (`collapse-delay`, MEASURE-FIRST) |
| `a-gate-blindspots` · `a-deferred-chronic §3` · `a-changes-vs-plan` · `a-precept-sweep` | **H.W8** | the gate-regime upgrade | SHIP-in-H (appearance + interaction axes + manifest + chronic meta-gate) |
| (sibling-HANDOFFs) | **§4** | the cross-repo hand-offs | glass-ui / value.js / parse-that / deploy HAND-OFF |

The per-band one-paragraph characterizations:

- **H.W0 (crashes) — the prerequisite.** Two crash FAMILIES ship in 4.1.0 and poison every
  other measurement, so they die first. **H-A1** (RE-ROOT-CAUSED by the DEEP harden, BLK-1):
  `serializeEasing` THROWS on a load that RESTS on a route whose mounted Keyframes-string
  editor targets a `cubic-bezier`-CLOSURE animation — **NOT the Cube presets**. The Cube
  `Rotations`/`Matrix` resolve `ease-in-out` (a string/registry easing) and serialize CLEAN
  (`CSSKeyframesToString(cubeRotations)` → OK, proven in unit + live). The REAL throw
  surfaces are (a) the **easing-scene `contractAnim`** (`demo/easing/useEasingDemo.ts:268`,
  built from a bare `cubic-bezier`/`steps` closure) and (b) the **amiga scene**
  (`demo/amiga/useAmigaAnimations.ts:31,74` pass `CSSCubicBezier(0.2,0.65,0.6,1)` directly
  as `timingFunction`) + ~12 `animations.ts` presets built with `CSSCubicBezier(...)`. The
  throw is at `serializeEasing` (`src/animation/format.ts:30`, throw `:36`) ← the readout
  call (`KeyframesStringControls.vue:~95`, invoked from `onMounted :222`), no try/catch. The
  count is 0–3 on a clean cold `#/cube` (NOT "exactly 4"; the "4×" was a polluted
  multi-session capture + the route storm navigating away before the throw — CP-HIGH-2). The
  fix: pass a typed `Easing {fn, css}` twin to the easing `contractAnim`/amiga (the demo has
  the CSS twin in hand), OR a value.js-HANDOFF that makes `CSSCubicBezier` return a twinned
  `Easing`; PLUS a co-equal readout `try/catch` floor at the `CSSKeyframesToString` call
  that renders a `/* timing-function: custom */` placeholder (never a silent `linear`).
  **H-A2** (RE-ROOT-CAUSED, BLK-1): the live `"......"` lerp parse-error is REAL (fires
  through `_lerp`←`processFrame` via `interpFrames`, `src/animation/engine.ts:769`
  processFrame / `:779` lerpValue) but its TRIGGER is a value.js path tied to route-storm-
  restored cross-scene state — **NOT** the hero ellipsis reaching a `CSSKeyframesAnimation`
  lerp (`AnimatedText.vue` is pure CSS, 0 engine symbols; a bare `{label:a}→{label:b}` leaf
  proved no-throw in unit). H-A2 needs a MEASURE-FIRST isolate of the actual `"......"` leaf
  and re-classifies toward a value.js-HANDOFF (the `parseCSSValueUnit('...')` throw lives in
  value.js) PAIRED with a born-RED kf corpus row that bites the ACTUAL reproduction; the
  engine classifying a bare non-numeric/non-color text leaf as a discrete hold-snap is the
  belt (folds into H.W6; `_SYNTHESIS-gap-scorecard §1.1/§3 H.W0`, `a-engine-regressions`,
  harden BLK-1). **NOTE:** the published CLAUDE.md tree (`src/parsing/format.ts`) predates the
  single-`animation/` consolidation; on `tranche-h-dev`, `src/` = `animation/` + `env.d.ts`
  only — re-anchored to `src/animation/format.ts` + `engine.ts` (CP-MED-1).

- **H.W1 (FSM) — the CRITICAL keystone.** There is NO single source of truth for "active
  scene" — five competing authorities (route, localStorage, lagging `currentSuperKey`,
  dock Select, debounced `?anim=`) oscillate into a live autonomous route storm
  (easing→motion-path→starting-style→spring→amiga); three competing playback authorities;
  restore is an `isStableFire` double-fire heuristic (`useSceneGroupSync.ts:54`) with NO
  genuine SUSPEND; home and cube are aliased. The fix: ONE `useSceneMachine()`
  (`createGlobalState` + a pure ~40-line `transition(state,event)` reducer over states
  `idle|loading|playing|paused|suspended`) owning the active-scene fact; route/dock/`?anim=`
  /localStorage demoted to one-way projections; an engine `serialize()/hydrate()` seam
  replacing the hand-poked clock. The @mbabb popover (D9) is FSM-coupled here — its primary
  root is a double-wrapped trigger (`App.vue:18-21`), repaired by dropping the outer wrapper
  (use `<DockDropdownTrigger>` directly, mirroring `DockSelectTrigger`); D9 is OWNED by
  H.W1's S8 with a born-RED `proof:dock-popover-opens` + `proof:single-toggle` (BLK-8 —
  the charter routes D9 to H.W1 but the wave file dropped the clause). Keep-open, where it
  applies, is acquired via the IMPERATIVE `useOptionalDockContext()?.keepOpen()`/`release()`
  on `@update:open` — **NOT** a `v-model:open → keepOpen/release` binding (`keepOpen`/
  `release` are a DI function pair on `DockContext`, not `v-model`-bindable; and the @mbabb
  menu is a CLICK `DropdownMenu`, so the double-wrap DROP alone is the correct, sufficient
  fix; harden BLK-8) (`_SYNTHESIS-frontend-mobile
  VERDICT`, `_SYNTHESIS-gap-scorecard §1.1/§2.1/§3 H.W1`, `a-scene-state-machine`,
  `a-store-architecture`, `a-mbabb-popover`).

- **H.W2 (design language) — the 5-lane root-caused restoration.** The demo's identity is
  "paper-and-glass"; the language drifted because the "paper" half (cartoon-shadow) was
  dropped on the panels while the "glass" half over-extended into a mouse-tracked
  radial-specular the demo never wired — glass-ui's `<Card surface="glass">` default bolts
  `glass-specular-track` onto every panel (live ~5–13 hosts, route/state-dependent, 0 pointer-wired; CP-MED-2), so the
  catch-light degrades to a static, dead-centered, screen-blended white bloom. This is NOT
  a glass-ui regression and NOT the demo's `design-idioms.css` `.progress-dot` (a RED
  HERRING all 7 lanes dismiss) — it is a demo activation gap. The fix: panels flip to
  `surface="cartoon"` (the radial dies at source, the cartoon offset-stamp + spring
  hover-lift becomes the panel depth idiom, the manual `.glass-card` plate is deleted);
  where `surface="glass"` is deliberately kept, the pointer seam is wired
  (`useSpecularPointer`) (`_SYNTHESIS-design-language §0/§2.2`, `_SYNTHESIS-gap-scorecard
  §1.1/§2.2/§3 H.W2`, `a-cartoon-shadow`, `a-glow-artifact`).

- **H.W3 (layout) — the structural transposition.** The controls are a vestigial 3-track
  grid (`1fr 1fr` collapses to 0; a `col-end-4` stage hack) with a lopsided live
  `grid-template-columns: 212px 466px`; the timeline ribbon is a third width regime
  (1272px vs `--controls-pane-width` 400px vs a 768px sidebar cap), the token CONSUMED but
  not an effective width authority (the `1fr 1fr` siblings let it grow; CP-HIGH-5).
  The fix collapses these into a named `[rail] var(--rail-width) [stage] 1fr` grid;
  `--rail-width` single-sources the sidebar, the expanded timeline, AND the mobile sheet
  (replacing `--controls-pane-width`, the 768px cap, and `col-span-full`). The sidebar
  becomes a single-column stacked-field flow (deleting `grid-cols-[auto_1fr]` + subgrid +
  `col-span-2`). This is the transposition that makes D1/D4/D10 cohesive
  (`_SYNTHESIS-gap-scorecard §1.1/§3 H.W3`, `a-controls-sidebar`, `a-timeline-width`,
  `a-demo-architecture` F1/F2).

- **H.W4 (visual-fidelity rungs) — MIXED + GAP + NEW.** The φ-ladder MECHANISM is
  ALREADY-SOTA (genuine √φ-derived rungs, Capsize metric-matched fallback, 0 CLS) — only
  the hero RUNG is too low (live 86.1px, a mid φ rung; glass-ui ships the audacious
  177px `text-display-mega` tier built for poster heroes). The easing canvas is a 680×680px
  monster (77% of an 883px panel) off an uncapped width with no container context. And 61
  silent no-op `icon-*` classes (34/13/11/3) compute identical 24px, defined NOWHERE. The
  fix: a one-class hero bump (`text-display-4`→`text-display-mega`, keep `text-wrap:
  balance`); the canvas gets a container-query ceiling (`block-size: clamp(160px, 38cqi,
  280px)`, modern-web Baseline-2023); `TimingFunctionPanel` header `text-heading`→
  `text-title` with the double-chrome collapsed; ONE owned `icon-*` idiom in
  `design-idioms.css`. RECORD: the ladder mechanism is SOTA (`_SYNTHESIS-gap-scorecard
  §1.1/§3 H.W4`, `a-hero-typography`, `a-easing-editor`, `a-styling-idioms §1/§5/§6`).

- **H.W5 (new modes finished) — the survivors get icons + interactivity.** Four new modes
  wear `<Home>`; `ChromeDock.vue:25-30` maps only cube/amiga/square/easing; 3 PNG + 1 SVG
  are two unreconciled idioms and `<img :src>` is theme-blind by construction (even the
  SVG). Each new mode is the ONLY demo of a public primitive (`SpringProgress`/`Sequence`/
  `fromMotionPath`/`@starting-style`) so all four are KEPT — but Discrete merges into a
  Spring sub-view (4 nav → 3) and the triple-forked `springLinearStops` collapses to one
  composable. The fix authors ONE inline-`<svg>` `currentColor` family on
  `SceneDescriptor.icon` (`<component :is>`, not `<img>`) for the survivors AFTER the
  pertinence verdict; KILLS the orphan PNGs; promotes `EasingCurveCanvas` to the stage,
  drags the motion-path traveller (`getPointAtLength`+`ManualTimeline`); square is a
  KILL-candidate else drag + `SpringProgress`. **And S6 finishes the TWO ORIGINAL stage
  scenes the icon set must also cover** — the cube/amiga scene-quality + demo-perf band the
  gap-scorecard's first draft dropped: the amiga `tesselateSphere` ~500k off-canvas
  `fillRect` bug (A3, SHIP), the `setPixelRatio(dpr*2)` retina over-render (A2,
  MEASURE-FIRST), the amiga sphere-drive-or-KILL pertinence call (A5), and the demo-side
  glassmorphism perf (G1 de-stack/`contain: paint`, G5 `will-change`/`content-visibility`)
  H.W2 routed "elsewhere" with no owner; the cube `idle-bob` dogfood (A7) and the
  matrix-editor `acos` decompose (A9) are BOOKed (`_SYNTHESIS-dock-perf-modes §0/PF-6`,
  `_SYNTHESIS-gap-scorecard §1.1/§3 H.W5`, `a-scene-icons`, `a-icon-pipeline`,
  `a-modes-pertinence`, `a-mode-interactivity`, `a-scene-cube-amiga`, `a-glassmorphism-perf`
  G1/G5).

- **H.W6 (typing-dots) — root-caused, the chrome dogfood (inv ζ).** `AnimatedText.vue:62`
  `split(/\s+/)` makes `"..."` ONE word → ONE span; the whole ellipsis fades as a unit
  (43% of the cycle below 0.3 opacity, 0 cadence); the `.lift-down`+`.dot-fade` dual
  `animation` shorthand collides; the dots are NOT dogfooded. The fix owns a `.typing-dots`
  3-span staggered primitive dogfooding `steppedEase`/`NumericAnimation` per the
  `CopyButton.vue:52` template (rest opacity ~0.2 — never vanishes), decoupled from
  `lift-down` (`_SYNTHESIS-gap-scorecard §1.1/§3 H.W6`, `a-typing-dots`,
  `a-animations-quality` F1).

- **H.W7 (mobile) — the architectural transposition.** Mobile STACKS — controls displace
  the stage to 30px behind a 710px drawer; D13's drawer is a 550ms CSS `grid-template-rows`
  ease, not a spring. The fix re-parameterizes the same `rail·stage·rail` grid (H.W3) for
  mobile: the stage becomes the full-bleed background (the live animation IS the
  background), controls become a bottom-SHEET overlaying it (NOT a top accordion), docks
  stay affixed. The drawer dogfoods `SpringProgress` (snappy preset, <350ms, PRM-snap)
  replacing the CSS ease. **RESOLVED design-decision (BLK-6 — gesture arbitration, NOT a
  "free win"):** the sheet swipe and the cube orbit are a COLLISION, not a free win — the
  cube's `touch-action:none` (`OrbitalDrag.vue:332`) + `setPointerCapture`/`preventDefault`
  (`useOrbitalPointer.ts:220-222`) over the full stage SWALLOWS any sheet swipe on the
  overlap; the amiga's Three.js `OrbitControls` is a THIRD gesture landlord. The two surfaces
  are made spatially DISJOINT: the sheet open/close is driven by a DEDICATED grab handle (a
  fixed-height drag rail at the sheet's top edge) whose own `pointerdown`/`setPointerCapture`
  owns the swipe; the stage region below keeps `touch-action:none` and remains the orbit
  surface. "Cube-drag unlocked for free" is RE-SCOPED: stage-drag mutates the quaternion; a
  separate handle-drag moves the sheet — mutually exclusive on disjoint regions, not the
  same gesture
  (`_SYNTHESIS-frontend-mobile`, `_SYNTHESIS-gap-scorecard §1.1/§3 H.W7`,
  `a-mobile-architecture` F1/F2, `a-demo-architecture` F5).

- **H.W9 (design-language refinement round 2) — the user-feedback fold, the chronic-closure
  discipline in ACTION.** After W2/W3/W4 landed, the user AUDITED the running demo and named
  nine refinements (F1–F9) — exactly the appearance/interaction audit H.W8 institutionalizes,
  arriving by hand BEFORE the golden baseline locked it. The headline collapses F3+F6+F8 into
  ONE register move: glass and cartoon ALREADY coexist (`cartoon-surface` decorates a
  `glass-${tier}`, `cards.css:22-48`), so keep `surface="cartoon"`, add `tier="quiet"`
  broadly (the glass returns at the exact 0.50 α/10px of the pre-cartoon plate — F8), and
  REMOVE the tracked specular entirely (F3 too-dramatic + F6 inconsistency → the user's own
  "perhaps we just remove it"; the lead adopts REMOVE as the default per R3, the CONSISTENT
  alternative documented as the §USER-DECISION fork). Around it: F1 restores label-LEFT/
  value-RIGHT rows while keeping ONE column (revises W3.S1's accidental collapse); F2 fits the
  bezier panel + bakes the back into the header right (revises W4.S2); F7 gives the cartoon
  shadow symmetric clearance inside W3's load-bearing `overflow:hidden` (a structural tension
  neither wave owned); F4 leads the ppmycota menu with the existing SVG mark + drops the emoji;
  F5 makes the whole dark-mode row the click target; F9 re-authors the idle-fade dogfooding
  `@vueuse/core useIdle`. H.W9 is a CORRECTIVE wave that SUPERSEDES specific landed W2/W3/W4
  decisions (the §supersede-map is the honest ledger), sits AFTER W2/W3/W4/W6 and BEFORE
  H.W8's golden baseline, carries 10 gates that each BITE born-RED, two glass-ui HANDOFFs, and
  the one F6 USER-DECISION fork; F6's invert keeps the D2 cartoon chronic CLOSED via a STRONGER
  system property (`proof:no-orphan-specular` exception=∅). Pure demo CSS/markup + one
  composable deletion + one `useIdle` wire — NO engine source, NO glass-ui patch in kf (inv-16),
  NO dist build (`audit/feedback/_PLAN`, `r1-source-rootcause`, `r2-git-archaeology`,
  `r3-design-reconcile`; `waves/H.W9.md`).

- **H.W8 (gate-regime upgrade) — so this is the LAST re-paper.** The A→G gate lattice locks
  SOURCE-SHAPE + NOT-BLANK; it has NO appearance axis, NO interaction axis, and a drifted
  SCENES manifest (`demo-driver.mjs:40-59` knows 6, the demo ships 9 — sequence/
  motion-path/starting-style NEVER gate-visited). Three structural additions: (I-1)
  re-source the `SCENES` manifest from `scenes.ts`; (I-2) a `proof:visual-lock` pixel
  baseline (the single broadest lever — converts D1/D3/D4/D6/D7/D10 appearance defects into
  one re-runnable named-region diff); (I-3) the chronic-closure meta-gate (a chronic exits
  ONLY with a SYSTEM-property gate OR a HANDOFF paired with a born-RED kf gate). Plus the
  φ-hero size floor, motion-liveness, scene-parity, and the dock-lag kf consume-leg's
  born-RED `proof:dock-morph-settled` (the canonical SPRING-gate name, BLK-3; D9's popover
  is split OUT to H.W1's `proof:dock-popover-opens`, BLK-8) (`_SYNTHESIS-gap-scorecard §3 H.W8`,
  `a-gate-blindspots`, `a-deferred-chronic §3`).

---

## H.W0 — KILL THE LIVE CRASHES (prerequisite; the demo must not throw; LEADS the DAG)

- **Phase:** IMPL — spec authored in DEV, awaits auth · **Class:** SHIP-in-H (the prerequisite) · **Scope:** the easing `contractAnim` (`demo/easing/useEasingDemo.ts:268`) + amiga (`demo/amiga/useAmigaAnimations.ts:31,74`) `Easing {fn, css}` twins, the readout `try/catch` floor (`KeyframesStringControls.vue:~95`, `onMounted :222`), `src/animation/format.ts:30` (throw `:36`), `src/animation/engine.ts:769` processFrame / `:779` lerpValue (the bare-text leaf classifier) · **DAG-deps:** none (LEADS — the live crashes poison every other measurement).
- **§Provenance (the folded lanes):** `a-engine-regressions` H-A1/H-A2, `a-scene-state-machine §3`. Synthesis home: `_SYNTHESIS-gap-scorecard §3 H.W0` (`:122-125`), `§1.1 live console crashes`. **Re-root-caused by the DEEP harden — BLK-1.**
- **§The state, verified (file:line / live anchors):** **H-A1** — `serializeEasing` THROWS (`src/animation/format.ts:30`, throw `:36`) ← the readout call (`KeyframesStringControls.vue:~95`, invoked from `onMounted :222`), no try/catch. The throw is NOT on the Cube presets: Cube `Rotations`/`Matrix` resolve `ease-in-out` (string/registry easing) and serialize CLEAN (`CSSKeyframesToString(cubeRotations)` → OK, unit + live). The REAL throw seams are the easing `contractAnim` (`useEasingDemo.ts:268`, a bare `cubic-bezier`/`steps` closure) + amiga (`useAmigaAnimations.ts:31,74` pass `CSSCubicBezier(0.2,0.65,0.6,1)` as `timingFunction`) + ~12 `animations.ts` presets built with `CSSCubicBezier(...)`. Count is **0–3 on a clean cold `#/cube`** (NOT "exactly 4" — the route storm may navigate away before the throw on an un-pinned load; CP-HIGH-2). **H-A2** — the live `"......"` lerp parse-error IS real (fires through `_lerp`←`processFrame`, `engine.ts:769`/`:779` via `:657 interpFrames`) but its TRIGGER is a value.js path tied to route-storm-restored cross-scene state — **NOT** the hero ellipsis reaching a `CSSKeyframesAnimation` lerp (`AnimatedText.vue` is pure CSS, 0 engine symbols; `{label:a}→{label:b}` proved no-throw in unit). Both ship in 4.1.0 (`_SYNTHESIS-gap-scorecard §1.1`). **NOTE (CP-MED-1):** the published CLAUDE.md `src/parsing/format.ts` tree predates the single-`animation/` consolidation; on `tranche-h-dev` `src/` = `animation/` + `env.d.ts` only.
- **§Goal:** zero console throws before any visual lane can measure a clean console; the readout never silently degrades to `linear`; the `"......"` leaf never aborts a frame.
- **§Scope:** **S1 (re-targeted, BLK-1)** — the easing `contractAnim` (`useEasingDemo.ts:268`) + amiga (`useAmigaAnimations.ts:31,74`) get a typed `Easing {fn, css}` twin (the demo has the CSS twin in hand — `useEasingDemo.ts` `cssValue`; amiga already passes the `"cubic-bezier(0.2,0.65,0.6,1)"` STRING which twins), OR a value.js-HANDOFF that makes `CSSCubicBezier` return a twinned `Easing` (WHAT: the round-trip-honest easing; WHY: the readout never throws and the curve is not lost). **The Cube-preset edit is DELETED — it edits a file that does not throw.** **S2 (PROMOTED to co-equal primary, BLK-1)** — a readout `try/catch` floor at the `CSSKeyframesToString` call (`KeyframesStringControls.vue:~95`, from `onMounted :222`) renders a `/* timing-function: custom */` placeholder, NEVER a silent `linear`. **S3 (two distinguished seams)** — the engine classifies a bare non-numeric/non-color text leaf as a discrete hold-snap (the kf compile-time `discrete`-flag stamp in `createInterpVarValue`, honors zero-alloc — NOT a per-frame `typeof` sniff at `engine.ts:779`, the wrong altitude for the hot loop), the BELT to a value.js-HANDOFF (the `parseCSSValueUnit('...')`/`_lerp` throw lives in value.js); H-A2 needs a MEASURE-FIRST isolate of the actual `"......"` leaf before this is specified (WHY: the bare-text leaf must snap, not throw — folds into H.W6).
- **§Hard gate — `proof:demo-console-clean` (BORN-RED TODAY, GREEN ON FIX):** a load that RESTS on a route whose mounted Keyframes-string editor targets a `cubic-bezier`-closure animation (amiga / the easing `contractAnim`) = 0 console errors (RED: 0–3 today, state-dependent — pin the route to reproduce; the route storm may navigate away before the throw on an un-pinned load; CP-HIGH-2); home→scene transition = 0 errors (RED: H-A2 today — DEMOTED from "reds TODAY on a bare leaf"; the trigger is route-storm-restored state, not `{label:a}→{label:b}`). Plus a unit `serializeEasing`/`CSSKeyframesToString` over an amiga/`contractAnim` `cubic-bezier` preset resolves without throw (NOTE: `CSSKeyframesToString(cubeRotationsAnimation)` is born-GREEN — it does not throw today; re-pointed to a preset that actually throws), and a `proof:interpolate-anything` corpus row that bites the ACTUAL `"......"` reproduction (NOT `{label:a}→{label:b}`, which proved no-throw — gate (c)'s "reds TODAY on a bare leaf" claim is DEMOTED). **BITE:** revert the `Easing {fn,css}` twin (or stub the readout to re-throw) → the pinned-route clause reds; revert the readout try/catch → a silent `linear`/`custom`-placeholder regression; revert the bare-text classifier → the discrete-snap row reds. **Two of the original four gate clauses were born-GREEN (the Cube-preset throw + the bare-leaf lerp) and are re-pointed/demoted per BLK-1.**
- **§Folds:** `a-engine-regressions` H-A1 (S1+S2) / H-A2 (S3 — the engine guard, the belt to H.W6's suspenders + a value.js-HANDOFF).
- **§Design decisions RESOLVED:** **(1)** the fix is round-trip-honest (the typed `Easing {fn,css}` twin flowing through `adoptCompiled`), with a readout `try/catch` placeholder as the co-equal floor — NOT a silent `linear` degrade (the Mandate forbids it). **(2, BLK-1 RESOLVED)** S1 is RE-TARGETED off the Cube presets (which do NOT throw) onto the easing `contractAnim` + amiga; gate clauses (c)+(d) are demoted/re-pointed because they were born-GREEN. **(3)** H-A2's primary fix re-classifies toward a value.js-HANDOFF (the throw lives in value.js) PAIRED with a born-RED kf corpus row biting the actual reproduction; the engine compile-time discrete-hold stamp is the belt, CSS-correct, not an ellipsis special-case.

---

## H.W1 — THE SCENE + PLAYBACK STATE MACHINE (CRITICAL; the keystone; the second prerequisite)

- **Phase:** IMPL — spec authored in DEV, awaits auth · **Class:** SHIP-in-H (CRITICAL; the keystone) · **Scope:** a new `useSceneMachine()` (`createGlobalState` + a pure reducer), the 5 demoted authorities (route/dock/`?anim=`/localStorage), `useSceneGroupSync.ts:54` (the `isStableFire` heuristic), the engine `serialize()/hydrate()` seam, `App.vue:18-21` (the @mbabb popover trigger) · **DAG-deps:** H.W0 (a clean console is a precondition to measure the FSM round-trip).
- **§Provenance (the folded lanes):** `a-scene-state-machine`, `a-store-architecture`, `a-demo-architecture` F3/F6/F8, `a-engine-regressions` H-A3, `a-mbabb-popover` (the FSM-coupled popover). Synthesis home: `_SYNTHESIS-gap-scorecard §1.1/§2.1/§3 H.W1` (`:127-130`), `_SYNTHESIS-frontend-mobile §0 VERDICT`.
- **§The state, verified (file:line / live anchors):** NO single source of truth for "active scene" — 5 competing authorities (route, localStorage, lagging `currentSuperKey`, dock Select, debounced `?anim=`) oscillate into a live autonomous route storm (easing→motion-path→starting-style→spring→amiga); 3 competing playback authorities; restore = the `isStableFire` double-fire heuristic (`useSceneGroupSync.ts:54`); NO genuine SUSPEND; home↔cube alias. The @mbabb popover primary root = a double-wrapped trigger (`App.vue:18-21` `<DropdownMenuTrigger as-child>` over `<DockDropdownTrigger>` which is itself a reka trigger → 2 toggles cancel; live `handlerCount:2`, `onOpenToggleCalls:2`, `finalOpen:false`) (`_SYNTHESIS-gap-scorecard §1.1`).
- **§Goal:** ONE finite scene+playback FSM owning the active-scene fact; suspend→restore an identity; the route storm ended; home and cube distinct; the popover re-opens. **NB — TWO orthogonal axes, not one flat enum (CP-LOW-4, matching `a-demo-architecture F3`):** the SCENE axis (∈ 9 scenes: home/cube/amiga/square/easing/spring/sequence/motion-path/starting-style) and the PLAYBACK-status axis (∈ 5: `idle|loading|playing|paused|suspended`) are independent — the FSM is their product, NOT a single flattened enum.
- **§Scope:** **S1** — author `useSceneMachine()` (`createGlobalState` + a pure ~40-line `transition(state,event)` reducer over the playback-status axis `idle|loading|playing|paused|suspended`, keyed by the orthogonal scene axis), collapsing the 6 state homes + 3 playback authorities + the `isStableFire` heuristic in ONE motion (WHAT: the FSM; WHY: the single source of truth — §2.1's adjudicated `createGlobalState`+reducer over Pinia). **S2** — demote route/dock/`?anim=`/localStorage to one-way projections; `?anim=` becomes scene-keyed; deep-link wins over localStorage (WHAT: the projections; WHY: kills the route storm + the cross-scene leak). **S3** — make home and cube DISTINCT states (WHY: kill the alias). **S4** — add the engine `AnimationGroup.serialize()/hydrate()` seam; the store lands first against the existing imperative restore, then swaps (WHAT: the genuine SUSPEND; WHY: replaces the hand-poked clock — the engine half is a value.js/engine-RECORD). **S5/S8** — drop the outer popover wrapper (`App.vue:18-21` — use `<DockDropdownTrigger>` directly inside `<DropdownMenu>`, mirroring `DockSelectTrigger`; remove the now-unused `DropdownMenuTrigger` import at `App.vue:152`) — the double-wrap DROP alone is the correct, sufficient fix for D9; keep-open, WHERE it applies, is acquired via the IMPERATIVE `useOptionalDockContext()?.keepOpen()`/`release()` on `@update:open`, **NOT** a `v-model:open → keepOpen/release` binding (`keepOpen`/`release` are a DI function pair on `DockContext`, not `v-model`-bindable; the @mbabb menu is a CLICK `DropdownMenu`, so the hover-popover keep-open is largely inapplicable; BLK-8/CP-HIGH-4); drop the deprecated `next()` guard. Add born-RED `proof:dock-popover-opens` (`finalOpen:true` after a trusted click; RED `false` today) + `proof:single-toggle` (`handlerCount===1`; RED `handlerCount:2` live). **This S8 is the D9 OWNER (BLK-8 — the charter routes D9 here; the wave file H.W1.md dropped the clause and it must be re-added).** (WHY: the double-toggle cancellation D9.)
- **§Hard gate — `proof:scene-machine-irrefragable` (BORN-RED TODAY):** the (scenes² × {playing,paused}) matrix — every A→B→A round-trip preserves route/superKey/component/group consistency AND byte-identical playback (suspend→restore is an identity); plus `proof:no-route-storm` (load `#/easing`, idle 2s, ≤1 nav entry, resting hash unchanged — RED: the storm today), `proof:scene-isolation` (easing route shows only easing controls, no cube blend/z-index leak), `proof:deep-link-wins`, `proof:suspend-no-orphan-raf`, and a popover `proof:dock-popover-opens` (`finalOpen:true` — RED: `false` today). **BITE:** revert to the `isStableFire` heuristic → the suspend-identity clause reds (restore double-fires); re-add the outer popover wrapper → `proof:dock-popover-opens` reds (`finalOpen:false`); leave `#/easing` idling → `proof:no-route-storm` reds at >1 nav entry.
- **§Folds:** `a-scene-state-machine` (S1-S4), `a-store-architecture` (S1-S2 — the 3-authority collapse + the `isStableFire` kill + the persisted snapshot + GC'd superKeys), `a-demo-architecture` F3/F6/F8, `a-engine-regressions` H-A3, `a-mbabb-popover` (S5).
- **§Design decisions RESOLVED:** **(1)** the STORE FACILITY is adjudicated `createGlobalState`+reducer, NOT Pinia (`_SYNTHESIS-gap-scorecard §2.1`, `_SYNTHESIS-frontend-mobile VERDICT` — 2-of-3 lanes; the demo already standardizes on `createGlobalState`; Pinia is a second reactive-store paradigm = the no-legacy violation; its only unique wins — devtools/persist — are met by `@vueuse/useStorage`; the user's named choice is honored in SPIRIT, a formal store + FSM, without the heavier facility swap). **(2)** the engine `serialize()/hydrate()` seam is a value.js/engine-RECORD — the store lands first against the existing imperative restore, then swaps (no engine edit gated to the store). **(3)** the popover root is the double-wrapped trigger (ADJUDICATED primary over the `keepOpen`/`portal` secondaries; `_SYNTHESIS-gap-scorecard §1.1 mbabb-popover`).

---

## H.W2 — RESTORE THE DESIGN LANGUAGE (cartoon depth + a wired catch-light specular)

- **Phase:** IMPL — spec authored in DEV, awaits auth · **Class:** SHIP-in-H (the surface swap; a NAMED isomorphic delta) + glass-ui-HANDOFF (the seam) · **Scope:** the panel `<Card surface>` props (→ `cartoon`), the manual `.glass-card` plate (deleted), a new `useSpecularPointer` composable (for retained glass), the duplicate demo `.scale-on-hover` (deleted) · **DAG-deps:** sequenced after H.W0+H.W1 (the surface swap's source surface is FSM-orthogonal, but the live crashes + route storm poison the visual measurement — the hover-screenshot lock needs a stable scene); independent of H.W3's layout grid (they compose cleanly); MUST NOT re-introduce an occlusion (inv δ).
- **§Provenance (the folded lanes):** `a-cartoon-shadow`, `a-design-language` A1/A2/A7, `a-glow-artifact`, `a-glass-ui-consumption` D2/D14, `a-glassmorphism-perf` G2. Synthesis home: `_SYNTHESIS-design-language §0/§2.2`, `_SYNTHESIS-gap-scorecard §1.1/§2.2/§3 H.W2` (`:132-135`).
- **§The state, verified (file:line / live anchors):** glass-ui's `glass-specular-track::before` (mouse-tracked radial, .55 white core, `screen` blend, .35→.6 hover) ships on every `<Card surface="glass">` default; live **~5–13 orphan tracks (route/state-dependent — the count moves with route + dock-expansion + mounted panels; CP-MED-2)**, **0 pointer-wired** → a static centered bloom; `surface=` props in the demo = 0 (grep — all Cards default glass+specular); `cartoon-surface` on EXACTLY 1 site (`CSSCodeEditor.vue:6`). The INVARIANT is `anyPointerWrite:false` on every track (stable across routes — the gate asserts the invariant, not a count). glass-ui ships the FULL cartoon family (`cards.css:33-48` `@utility cartoon-surface`, `tokens.css:543-549` `--shadow-cartoon-{sm,md,lg}`). The D2 candidate in the demo's `design-idioms.css:263-269` is the benign `.progress-dot` playing-ring — a RED HERRING all 7 lanes dismiss (`_SYNTHESIS-design-language §0`).
- **§Goal:** the radial dies at SOURCE, the cartoon offset-stamp + spring hover-lift becomes the panel depth/hover idiom, the manual plate is deleted, and any retained glass wires its catch-light.
- **§Scope:** **S1** — panel Cards flip to `surface="cartoon"` (WHAT: ONE prop; WHY: it simultaneously DROPS `glass-specular-track` at its source — `CardFooter:37` gates the class on `surface==="glass"` — and APPLIES `.cartoon-surface`; net-deletion, pure glass-ui consumption). **S2** — delete the now-redundant manual `.glass-card` plate (WHY: no legacy beside its replacement — it dies WITH the swap). **S3** — where `surface="glass"` is DELIBERATELY kept, wire the pointer seam (`useSpecularPointer` writing `--mouse-x/--mouse-y`) (WHY: D14's refined-specular-where-kept — a deliberately retained glass MUST wire the seam). **S4** — delete the duplicate demo `.scale-on-hover` (WHY: glass-ui owns the `@utility`).
- **§Hard gate — `proof:cartoon-is-panel-depth` + `proof:no-orphan-specular` (BORN-RED TODAY):** ≥4 panel Cards resolve `box-shadow: var(--shadow-cartoon-md)` at rest (RED: 0 today — all glass); ZERO `.glass-specular-track` on panels OR (if retained) a `--mouse-x` writer present (RED: ~5–13 orphan tracks today, route/state-dependent — the gate asserts the `anyPointerWrite:false` INVARIANT, not the count; CP-MED-2); a hover-screenshot lock = an offset cartoon stamp, NOT a centered radial bloom. **BITE:** revert a panel to `surface="glass"` with no pointer wire → `proof:no-orphan-specular` reds (an orphan track returns); neutralize the radial with `display:none` instead of the surface swap → `proof:cartoon-is-panel-depth` reds (no cartoon shadow resolves).
- **§Folds:** `a-cartoon-shadow` (S1-S2, the gestalt move), `a-glow-artifact` (S3 — the `useSpecularPointer` seam F3), `a-design-language` A1/A2/A7 (the paper-and-glass restoration), `a-glass-ui-consumption` D2/D14, `a-glassmorphism-perf` G2.
- **§Design decisions RESOLVED:** **(1)** the CARTOON DEPTH MECHANISM is adjudicated `surface="cartoon"`, NOT a `.shadow-cartoon-*` class or a demo neutralizer (`_SYNTHESIS-gap-scorecard §2.2` — net-deletion, no new CSS, the radial dies because the surface map stops emitting the class, not via `!important`/`display:none`; the class/neutralizer are fallbacks only if the Card API forced glass+specular coupling, which it does not). **(2)** glass-ui-HANDOFF: the Card should wire-or-omit its specular seam + ship a calmer default intensity (rest ≤0.25, radius ≤40%) — AUDITED, never patched in kf (§4).

---

## H.W3 — THE CONTROLS-COLUMN LAYOUT (one-column · ribbon-width · the `rail·stage·rail` grid)

- **Phase:** IMPL — spec authored in DEV, awaits auth · **Class:** SHIP-in-H (the structural transposition) · **Scope:** `AnimationControlsControls.vue:4/6/9/294` (the 3-track grid + subgrid chain), `ControlsPaneWrapper.vue:206`, `AnimationControls.vue:4` (the 768px cap), the `--controls-pane-width` token (→ `--rail-width`), the expanded timeline · **DAG-deps:** depends on H.W1 (the FSM is the substrate the layout sits on, and the autonomous route storm makes width/layout measurement flaky — the layout gates settle-gate on the FSM resting; `a-timeline-width §4`, `a-demo-architecture` F4); shares the `--rail-width` token with H.W7 (mobile).
- **§Provenance (the folded lanes):** `a-controls-sidebar` D1, `a-timeline-width` D4, `a-demo-architecture` F1/F2/F4. Synthesis home: `_SYNTHESIS-frontend-mobile`, `_SYNTHESIS-gap-scorecard §1.1/§3 H.W3` (`:137-140`).
- **§The state, verified (file:line / live anchors):** `AnimationControlsControls.vue:4` `grid-cols-[auto_1fr]` + `:6,9,294` subgrid; live `grid-template-columns: 212px 466px` (two real cols, lopsided); the timeline ribbon is a THIRD width regime — live 1272px vs `--controls-pane-width` 400px vs an `AnimationControls.vue:4 lg:max-w-screen-md` 768px cap; `ControlsPaneWrapper.vue:206` `min-width` is a floor, not a cap; the `--controls-pane-width` token is CONSUMED (`design-idioms.css:106` def; `AnimationControlsGroup.vue:5` grid left track + `ControlsPaneWrapper.vue:206` min-width) but NOT an effective width authority — the `1fr 1fr` siblings let it grow, so it is "nominal, not effective" (NOT "decorative"; CP-HIGH-5 — corrects the gap-scorecard §1.1 mislabel). **Adjudication of A7:** `a-design-language A7` prescribed HONORING this token on the ribbon; H supersedes A7's honor-the-token direction via the single-motion rename `--controls-pane-width`→`--rail-width` (S2 below), which satisfies A7's DRY intent without the grow-prone `1fr 1fr` grid (`_SYNTHESIS-gap-scorecard §1.1 controls-layout/timeline-width`).
- **§Goal:** ONE named `[rail] var(--rail-width) [stage] 1fr` grid; one `--rail-width` width authority; a single-column stacked-field sidebar; the timeline aligned to the rail track.
- **§Scope:** **S1** — collapse the vestigial 3-track grid + the `col-end-4` stage hack to the named `rail·stage·rail` grid (WHAT: the demo-shell grid; WHY: the structural transposition that makes D1/D4/D10 cohesive). **S2** — `--rail-width` single-sources the sidebar, the expanded timeline, AND the mobile sheet, replacing `--controls-pane-width` + the 768px cap + `col-span-full` (WHAT: the single width authority; WHY: three width regimes collapse to one). **S3** — the sidebar becomes a single-column stacked `LabeledField` flow (delete `grid-cols-[auto_1fr]` + subgrid + `col-span-2`; WHY: D1 — one column, not two lopsided tracks). **S4** — the expanded timeline aligns to the rail track (WHY: D4 — ribbon width === sidebar width).
- **§Hard gate — `proof:single-column-pack` + `proof:timeline-rail-width` + `proof:demo-shell-grid` (BORN-RED TODAY):** all field rows share one left-edge `x` (RED: today `{76,300}` — two edges); ribbon width === sidebar width === `--rail-width` (±2px) (RED: 1272 vs 400 vs 768 today); a grep-gate — zero `grid-cols-[auto_1fr]`/`grid-cols-[subgrid]`/`col-span-2`/`col-end-4`/`--controls-pane-width` survive. **BITE:** re-introduce the subgrid chain → the grep-gate reds; revert the timeline to full-bleed → `proof:timeline-rail-width` reds (the widths diverge).
- **§Folds:** `a-controls-sidebar` D1 (S1/S3), `a-timeline-width` D4 (S2/S4), `a-demo-architecture` F1/F2/F4.
- **§Design decisions RESOLVED:** `--rail-width` is the single width authority replacing the CONSUMED-but-not-effective `--controls-pane-width` (CP-HIGH-5 — it is a grid track + min-width consumer, not "decorative") + the 768px cap (no token beside its replacement); this single-motion rename supersedes `a-design-language A7`'s honor-the-token direction while satisfying its DRY intent; the grid is named (`rail`/`stage`) so H.W7 can re-parameterize the SAME grid for mobile — the layout is authored ONCE.

---

## H.W4 — THE EASING EDITOR + HERO φ-TYPOGRAPHY (the visual-fidelity rungs)

- **Phase:** IMPL — spec authored in DEV, awaits auth · **Class:** SHIP-in-H (canvas ceiling + 1 named-delta mega bump + 1 NEW idiom) · RECORD (the ladder mechanism SOTA) · **Scope:** `EasingCurveCanvas.vue:269-273`, `TimingFunctionPanel.vue:17-19`, the hero `text-display-4` class, the 2 residual raw rungs (L1/L2), a new `icon-*` `@utility` in `design-idioms.css` · **DAG-deps:** independent (runs in parallel after H.W0).
- **§Provenance (the folded lanes):** `a-easing-editor` D3, `a-hero-typography` D7, `a-design-language §2/§3`, `a-styling-idioms §1/§5/§6`. Synthesis home: `_SYNTHESIS-design-language §2`, `_SYNTHESIS-gap-scorecard §1.1/§3 H.W4` (`:142-145`).
- **§The state, verified (file:line / live anchors):** live 680×680px canvas (77% of an 883px panel); `EasingCurveCanvas.vue:269-273` `aspect-ratio:1` off an uncapped width, no container context; `TimingFunctionPanel.vue:17-19` `text-heading` header + `gap-0` flush border. The hero is `text-display-4` = 86.1px live, a MID φ rung; glass-ui ships the audacious `text-display-mega` 177px tier (`typography.css:114,121,122` `--type-display-{4,mega,hero}`) built for poster heroes; the ladder mechanism + Capsize fallback are exemplary. The orphaned `...` is NOT a flex-wrap to a second line — the `<h1>` computes `display:grid` even at `lg` (live `gridTemplateRows: 94.72px 94.72px` at 1440 — `.grid` beats `lg:flex` in v4 source order), so the `...` sits on its own grid ROW (CP-HIGH-6; a gate author chasing a flex wrap would do nothing — the S3 fix lands because it removes BOTH the grid stack AND the second item). 61 silent no-op `icon-*` classes (icon-sm×34/icon-md×13/icon-lg×11/icon-xs×3) compute identical 24px (Lucide default), `anyIconRuleInStylesheets:false`, defined NOWHERE (`_SYNTHESIS-gap-scorecard §1.1 easing-editor/hero-typography/icon-sizing`).
- **§Goal:** the easing canvas bounded (680px → ≤280px square), the hero in the audacious tier (86→177px), and the icon-size idiom owned ONCE.
- **§Scope:** **S1** — the easing canvas gets a container context + `block-size: clamp(160px, 38cqi, 280px)` (WHAT: the container-query ceiling; WHY: modern-web Baseline-2023, no fallback owed). **S2** — `TimingFunctionPanel` header `text-heading`→`text-title`, the double-chrome collapsed, a φ-spaced gap; the EasingSidebar gains a parity header (WHY: D3 — header too small, the inner border flush). **S3** — the hero `text-display-4`→`text-display-mega` (keep `text-wrap: balance`, opt. scoped `line-height:0.92`); REMOVE the grid-row stacking (`display:grid` collapsing to a single plain-block run — the orphaned `...` is a grid ROW, not a flex wrap; CP-HIGH-6) keeping the `...` a SEPARATE inline `<AnimatedText>`/`<span>` host inside the now-plain-block `<h1>` (do NOT merge it into the title `AnimatedText` `:text` run — that would fade the title or leave H.W6's typing-dots no mount point; if W4 lands before W6 the ellipsis keeps `dot-fade`, RED-on-mechanism is W6's gate); sweep the 2 residual raw rungs L1/L2 (WHY: D7 — LARGER, golden). **S4** — own ONE `icon-*` idiom in `design-idioms.css` (`@utility icon-* { @apply size-N }`) (WHY: 61 silent no-op classes resolve to a real definition).
- **§Hard gate — `proof:easing-canvas-bounded` + `proof:hero-rung` + `proof:phi-leaf-zero` + `proof:icon-idiom` (BORN-RED TODAY):** canvas `block-size ≤ 280` AND square (RED: 680px today); `proof:hero-rung` pins BOTH (a) the resolved class is `text-display-mega` (a static source-shape check — flake-free) AND (b) a px floor at a FIXED named viewport (`font-size ≥ 140px` at 1440×900) — **NOT** a `font-size ≥ --type-display-mega` comparison across an unpinned viewport (both are viewport-dependent `clamp()` tokens whose ordering can flap at narrow widths; CP-HIGH-3) (RED: `text-display-4` = 86px today); `proof:phi-leaf-zero` (the φ-hero chronic CH-2/M1 SYSTEM-property gate the H.W8 meta-gate cites) — BOTH the hero rung AND 0 raw `text-*` rungs across the demo, where the residual is **2 raw rungs (L1 `AnimationMenuBar.vue:102` + L2 `MotionPathTarget.vue:119`)** under the gate's `ui/` exclusion, NOT "37" (37 materializes only by counting vendored `ui/` shadcn — if `ui/` is excluded the "37 survivors" claim is phantom, if `ui/` is counted W4 sweeps only L1+L2 and the gate can never green; WV-W4-HIGH-1/HS-HIGH-3) (RED: 86px hero + 2 raw rungs today); every `icon-(xs|sm|md|lg)` reference resolves to a real definition (RED: 61 no-ops today). **BITE:** revert the canvas clamp → `proof:easing-canvas-bounded` reds (>280px); revert the hero class → `proof:hero-rung`/`proof:phi-leaf-zero` red; re-introduce a raw `text-*` rung → `proof:phi-leaf-zero` reds (the M1-escape lock — the issue cannot close while raw rungs linger); delete the `icon-*` `@utility` → `proof:icon-idiom` reds (the references go no-op again).
- **§Folds:** `a-easing-editor` D3 (S1/S2), `a-hero-typography` D7 (S3), `a-styling-idioms §1` (S4 the icon idiom) / `§5` (the φ rung) / `§6` (the easing chrome). RECORD: the φ-ladder MECHANISM + Capsize fallback are ALREADY-SOTA (only the hero RUNG and 2 leaf rungs are GAP).
- **§Design decisions RESOLVED:** the hero bump is a ONE-CLASS change (a NAMED befitting delta, not isomorphic — bigger is the point); the canvas ceiling is a Baseline-2023 container query (no fallback owed); the icon idiom is OWNED in `design-idioms.css` (the layer that already single-sources the rest), not scattered.

---

## H.W5 — SCENE ICONS + MODE PERTINENCE + CUBE/AMIGA SCENE-QUALITY (the new AND original modes finished)

- **Phase:** IMPL — spec authored in DEV, awaits auth · **Class:** SHIP-in-H (the SVG family + the Discrete merge + interactivity + the cube/amiga scene-quality/perf budget) · **Scope:** `SceneDescriptor.icon` (an inline-`<svg>` `currentColor` family), `ChromeDock.vue:25-30` (`<component :is>` not `<img>`), the orphan `-lg` PNGs (KILLED), the Discrete sub-view merge, the triple-forked `springLinearStops` (→ 1 composable), `EasingCurveCanvas` (→ stage), the motion-path traveller, the square scene, `demo/amiga/utils.ts:9,17-24` (the tessellate tile-loop), `AmigaScene.vue:47` (the dpr cap + the sphere-drive-or-KILL), the `scene-host` `contain: paint` + inactive-root `content-visibility` · **DAG-deps:** rides H.W1 (the SceneDescriptor/route are FSM-projected; G5's `content-visibility` reads the FSM active-scene fact); independent of H.W2; S6's G1 de-stack composes with H.W3's column separation.
- **§Provenance (the folded lanes):** `a-scene-icons` F1-F6, `a-icon-pipeline` P1-P8, `a-modes-pertinence` D8, `a-scene-spring-sequence`, `a-scene-path-discrete`, `a-scene-square-easing`, `a-mode-interactivity` D11, `a-scene-cube-amiga` A2/A3/A5 (A7/A9 BOOK), `a-glassmorphism-perf` G1-demo/G5 (the dropped cube/amiga scene-quality band, re-homed in S6). Synthesis home: `_SYNTHESIS-dock-perf-modes §0/PF-6`, `_SYNTHESIS-gap-scorecard §1.1/§3 H.W5` (`:147-151`).
- **§The state, verified (file:line / live anchors):** `ChromeDock.vue:25-30` `sceneIcons` maps only cube/amiga/square/easing → 4 new modes wear `<Home>`; 3 PNG + 1 SVG = two unreconciled idioms; `<Home>` is overloaded as scene + no-icon sentinel; 60.6KB orphan `-lg` PNGs; `<img :src>` is theme-blind by construction (even the SVG). Each new mode is the ONLY demo of a public primitive (`SpringProgress`/`Sequence`/`fromMotionPath`/`@starting-style`) but `springLinearStops` surfaced 3× (Spring scene + SpringSidebar + StartingStyleTarget); cube orbital-drag is the gold standard; the easing curve is shown-not-grabbed; the motion-path traveller un-draggable; square is a DEAD non-interactive `<div>heyyyy` (`_SYNTHESIS-gap-scorecard §1.1 scene-icons/modes-pertinence/mode-interactivity`).
- **§Goal:** one themable inline-SVG icon family on the descriptor, the orphan PNGs killed, Discrete merged into Spring (4 nav → 3), the survivors interactive, and the cube/amiga scene-quality/perf budget met (S6 — the amiga tile-loop bug fixed, the dpr cap, the de-stack).
- **§Scope:** **S1** — author ONE inline-`<svg>` `currentColor` family on `SceneDescriptor.icon` (`<component :is>`, not `<img :src>` — the theming fix), ONLY for survivors AFTER the pertinence verdict (WHY: D8 — the new modes need themable icons). **S2** — KILL the orphan `-lg` PNGs (WHY: no legacy beside the SVG family — they die WITH it). **S3** — MERGE Discrete → a Spring sub-view (4 nav → 3); de-dup `springLinearStops` to ONE composable (WHY: D11/D8 DRY — Discrete is a sub-aspect of Spring, the artifact forked 3×). **S4** — promote `EasingCurveCanvas` to the easing stage; drag the motion-path traveller (`getPointAtLength`+`ManualTimeline`); square = KILL-candidate else drag + `SpringProgress` (WHY: D11 — each surviving mode exposes ≥1 pointer-interactive affordance). **S6** (the dropped cube/amiga scene-quality band, re-homed) — fix the amiga `tesselateSphere` tile-loop bug (A3, SHIP — iterate the 16×16 tile grid, not the 1024² pixel grid) + cap `setPixelRatio(min(dpr,2))` (A2, MEASURE-FIRST) + the amiga sphere-drive-or-KILL pertinence call (A5) + the demo-side de-stack `contain: paint` (G1) + transient `will-change`/off-screen `content-visibility:auto` on inactive scene roots (G5) (WHY: the cube/amiga scene-quality + demo-perf budget the §1.1 map's first draft dropped; A7 cube idle-bob + A9 matrix-decompose BOOK to deferred-ledger §3.3).
- **§Hard gate — `proof:scene-icons` + `proof:scene-parity` + `proof:scene-perf-budget` (BORN-RED TODAY):** every non-home `SceneDescriptor` has an `icon` (RED: 4 wear `<Home>` today); every `.svg` is `fill=none`+`currentColor`+`viewBox="0 0 32 32"` with stroke == host `currentColor` in dark AND light (an `<img>` icon FAILS by construction — RED today); each surviving mode exposes ≥1 pointer-interactive affordance (RED: easing/path/square today); AND `proof:scene-perf-budget` — `proof:amiga-tessellate-tilecount` (≤256 `fillRect`, isomorphic checkerboard — RED: ~500k off-canvas `fillRect` today) + `proof:amiga-pixel-cap` (`getPixelRatio()≤2`) + `proof:scene-host-contained` (G1) + `proof:offscreen-cv` (G5) + (if amiga survives) `proof:amiga-engine-drives-mesh` else amiga absent. **BITE:** keep an `<img :src>` icon → the theming clause reds (the stroke does not track `currentColor` in light mode); leave square a dead `<div>` → the interaction-affordance clause reds; revert the amiga tile-loop → `proof:amiga-tessellate-tilecount` reds.
- **§Folds:** `a-scene-icons` F1-F6 (S1/S2), `a-icon-pipeline` P1-P8 (S1/S2), `a-modes-pertinence` D8 (S3, KEEP-all-4-MERGE-Discrete), `a-scene-spring-sequence` (S3 — the de-dup; Sequence kept as-is, SOTA), `a-scene-path-discrete` (S3/S4), `a-scene-square-easing` (S4 — square KILL-candidate), `a-mode-interactivity` D11 (S4), `a-scene-cube-amiga` A2/A3/A5 + `a-glassmorphism-perf` G1-demo/G5 (S6 — the cube/amiga scene-quality/perf budget; A7/A9 BOOK to deferred-ledger §3.3).
- **§Design decisions RESOLVED:** all four new modes are KEPT (each is the ONLY demo of a public primitive); icons are authored ONLY for survivors AFTER the pertinence verdict (no icon for a KILLed scene); the icon idiom is `<component :is>` over inline SVG (theming is impossible with `<img :src>`, even the SVG); Discrete merges INTO Spring (a sub-aspect, not a peer); Sequence is untouched (SOTA).

---

## H.W6 — TYPING-DOTS + CHROME DOGFOOD (inv ζ)

- **Phase:** IMPL — spec authored in DEV, awaits auth · **Class:** SHIP-in-H (the dogfooded staggered primitive) · **Scope:** a new `.typing-dots` component (3 spans, staggered `animation-delay`), `AnimatedText.vue:62` (the `split(/\s+/)` collapse), the `.lift-down`+`.dot-fade` dual-shorthand collision · **DAG-deps:** rides H.W0 (the H-A2 engine guard is the belt to this wave's suspenders); independent of the rest.
- **§Provenance (the folded lanes):** `a-typing-dots` D6, `a-animations-quality` F1, `a-styling-idioms §4`. Synthesis home: `_SYNTHESIS-gap-scorecard §1.1/§3 H.W6` (`:152-155`).
- **§The state, verified (file:line / live anchors):** `AnimatedText.vue:62` `split(/\s+/)` → `"..."` is ONE word → ONE span; the whole ellipsis fades as a unit (43% of the cycle below 0.3 opacity, 0 cadence); the `.lift-down`+`.dot-fade` dual `animation` shorthand collides; the dots are NOT dogfooded (inv ζ). The dogfood template is `CopyButton.vue:52` (`CSSKeyframesAnimation`) (`_SYNTHESIS-gap-scorecard §1.1 typing-dots`).
- **§Goal:** the ellipsis becomes its own `.typing-dots` primitive — 3 spans, staggered, dogfooding the engine, never vanishing, decoupled from `lift-down`.
- **§Scope:** **S1** — own a `.typing-dots` primitive (3 spans with staggered `animation-delay`, dogfooding `steppedEase`/`NumericAnimation` per the `CopyButton` template; rest opacity ~0.2) (WHAT: the staggered primitive; WHY: D6 + inv ζ — the chrome dogfoods the engine). **S2** — decouple from `lift-down` (WHY: ends the dual-`animation`-shorthand collision). **S3** — the hero ellipsis never enters a `CSSKeyframesAnimation` value position (the H.W0 H-A2 engine guard is the belt-and-suspenders) (WHY: defense in depth — the dots are chrome, not a keyframe value).
- **§Hard gate — `proof:typing-dots` + `proof:dogfood-hero` (BORN-RED TODAY):** ≥3 dot spans with monotonically increasing `animation-delay` (RED: 1 span today); min opacity over the cycle ≥0.15 (RED: 43% below 0.3 today, the dots vanish); total cycle ≤1.6s; the dots component imports a kf engine symbol (RED: hand-rolled CSS today); no element carries two `animation` shorthands (RED: `.lift-down`+`.dot-fade` collide today). **BITE:** revert to the single-span `split(/\s+/)` → the ≥3-spans clause reds; re-couple to `lift-down` → the dual-shorthand clause reds; min opacity dropping below 0.15 → the never-vanishes clause reds.
- **§Folds:** `a-typing-dots` D6 (S1/S2), `a-animations-quality` F1 (S1 — the dogfood), `a-styling-idioms §4` (S2 — the shorthand collision).
- **§Design decisions RESOLVED:** the dots dogfood the engine per the `CopyButton` template (inv ζ — the chrome runs on its own engine), NOT a hand-rolled CSS `dot-fade`; the 3-span stagger is the cadence (one span fading as a unit has no cadence); the engine guard (H.W0) is the belt to this wave's suspenders, not the primary fix.

---

## H.W7 — MOBILE OVERLAY + SPRINGY DRAWER (D10/D13)

- **Phase:** IMPL — spec authored in DEV, awaits auth · **Class:** SHIP-in-H (the architectural transposition) · **Scope:** the mobile parameterization of the `rail·stage·rail` grid (H.W3), the stage (→ full-bleed background), the controls (→ bottom-SHEET overlay), the 550ms CSS `grid-template-rows` drawer (→ `SpringProgress`) · **DAG-deps:** H.W3 (re-parameterizes the SAME `--rail-width` grid); MUST NOT re-introduce an occlusion (inv δ).
- **§Provenance (the folded lanes):** `a-mobile-architecture` F1/F2, `a-demo-architecture` F5. Synthesis home: `_SYNTHESIS-frontend-mobile`, `_SYNTHESIS-gap-scorecard §1.1/§3 H.W7` (`:157-160`).
- **§The state, verified (file:line / live anchors):** mobile STACKS — controls displace the stage to **30px** behind a 710px drawer; D13's drawer is a 550ms CSS `grid-template-rows` ease (not a spring); the demo drawer is BESPOKE (not vaul/Sheet — so the glass-ui `DrawerContent` `spring` prop is a BOOK, not this wave's dep); both docks are `position:fixed` honoring `--work-area-*-offset` with `@supports not (dvh)` fallbacks (ALREADY-SOTA — the SKELETON is correct, only the COMPOSITION is GAP) (`_SYNTHESIS-gap-scorecard §1.1 mobile + springy drawer / §5.7`, `a-mobile-architecture` F3).
- **§Goal:** the overlay model — stage full-bleed background, controls a bottom-SHEET, the drawer a snappy `SpringProgress` (not a 550ms CSS ease), with mobile interactivity unlocked for free.
- **§Scope:** **S1** — re-parameterize the `rail·stage·rail` grid (H.W3) for mobile: the stage becomes the full-bleed `[stage]` background (the live animation IS the background) (WHY: D10 — not an accordion that crushes the cube to 30px). **S2** — controls become a bottom-SHEET overlaying the stage (NOT a top accordion that displaces it) (WHY: the overlay model). **S3** — the drawer dogfoods `SpringProgress` (snappy preset, <350ms, PRM-snap) replacing the 550ms CSS `grid-template-rows` ease (WHY: D13 — a spring, not a CSS ease; inv ζ). **S4** — the docks stay affixed top/bottom tracks (WHY: inv δ — no occlusion; the SOTA skeleton preserved).
- **§Hard gate — `proof:mobile-single-page` + `proof:drawer-spring` (BORN-RED TODAY):** at 390×844 the scene host ≈ viewport (full-bleed) (RED: 30px today); opening controls OVERLAYS (does not shift ±0px) the stage (RED: displaces today); both docks affixed; the sheet motion is a `SpringProgress` subscription (no `transition: grid-template-rows`), settle <350ms, a spring-shaped trace, a single-frame PRM snap (RED: a 550ms CSS ease today). **BITE:** revert to the accordion → `proof:mobile-single-page` reds (the stage shifts, not overlays); revert to the CSS `grid-template-rows` ease → `proof:drawer-spring` reds (no spring trace, the `transition` returns).
- **§Folds:** `a-mobile-architecture` F1/F2 (S1-S4), `a-demo-architecture` F5.
- **§Design decisions RESOLVED:** the mobile layout re-parameterizes the SAME H.W3 grid (authored ONCE, not a forked mobile layout); the drawer is BESPOKE so the spring is a SHIP-in-H `SpringProgress` (the glass-ui `DrawerContent` `spring` prop is a BOOK — a different code path; §4); the overlay model unlocks cube-drag interactivity (D11) for free.

---

## H.W9 — DESIGN-LANGUAGE REFINEMENT ROUND 2 (the consolidated user-feedback fold · F1–F9; SUPERSEDES specific landed W2/W3/W4 decisions)

- **Phase:** IMPL — spec authored in DEV, awaits auth · **Class:** CORRECTIVE SHIP-in-H (the user-feedback refinement round; net-deletion-leaning — F3/F6 remove the specular subsystem; pure demo CSS/markup + one composable deletion + one `useIdle` wire + two glass-ui HANDOFFs; NO engine source, NO glass-ui patch in kf — inv-16, NO dist build) · **Scope:** the ~14 `surface="cartoon"` panel Card sites (→ add `tier="quiet"`) + the tracked-specular subsystem DELETED (`TimingFunctionPanel.vue:17-30,175,198`, `useSpecularPointer.ts`, `design-idioms.css:245-282`) + the controls rows (`AnimationControlsControls.vue:4,9,133`, `LayerConfigPanel.vue:3,19,46`) + the bezier panel fit + header bake (`AnimationControlsControls.vue:331-334`, `TimingFunctionPanel.vue:5-12,30-32,51-58`) + the controls-content shadow clearance (`ControlsPaneWrapper.vue:182,207-208`) + the dock menu (`App.vue:38-44,48-61`) + the idle-fade restoration (`usePaneHover.ts`, `useControlsLayout.ts:50`, `ControlsPaneWrapper.vue:11,16-17,159-161,190-193`) + the gate set · **DAG-deps:** AFTER **W2** (the surface flip it refines), **W3** (the row shape + the load-bearing clip it reconciles), **W4** (the bezier panel it re-fits), **W6** (no collision — the `EditorStartScreen` hero lane is untouched); every browser gate settle-gates on **H.W1**'s FSM resting. Sequenced **BEFORE H.W8's GOLDEN `proof:visual-lock` baseline** (the H.W9 calm register / one-column row / un-clipped shadow MUST be what H.W8 locks). The FULL spec is `waves/H.W9.md`.
- **§Provenance (the folded lanes):** `audit/feedback/r1-source-rootcause` (the per-item `file:line` root-cause), `r2-git-archaeology` (the "previous correct" forms — F1's `cfea657`, F9's `11550cd`/`3b8b468`, F4's `ppmycota-logo-3.svg`), `r3-design-reconcile` (the design + modern-web reconcile — the F3+F6+F8 collapse, REMOVE decisively). Synthesis home: `audit/feedback/_PLAN.md` (the COMPLETE, authoritative H.W9 plan — BINDING).
- **§The state, verified (file:line / live anchors):** glass and cartoon ALREADY coexist — `cartoon-surface` decorates the `glass-${tier}` the Card emits (`cards.css:22-48`), so the W2 panels ARE glassy on the more-opaque `resting` default (0.65 α) vs the old `.glass-card` plate's `quiet` (0.50 α) — F8 is a tier flip, not lost glass; the catch-light survives only on the W2 composite bezier card (`TimingFunctionPanel.vue:30,175,198`; magnitude `useSpecularPointer.ts:42`; projection `design-idioms.css:266-282`). W3.S1 (`ece4743`) collapsed the per-row `[auto_1fr]` by accident (the surviving precedent `AssetPropertiesPanel.vue:6`). The bezier panel overflows the `min(50vh,480px)` cap (`AnimationControlsControls.vue:331-334`) + the back is an external top-LEFT `<Button>` (`TimingFunctionPanel.vue:5-12`). The cartoon shadow casts bottom-LEFT (`--shadow-cartoon-md: -4px 3px`, `tokens.css:543-551`) into W3's load-bearing `overflow:hidden` (`ControlsPaneWrapper.vue:182`) with clearance only right/bottom (`:207-208`) → a sliced lobe. The pp logo SVG already renders (`App.vue:50`→`assets/ppmycota-logo-3.svg`); the defect is the emoji `<p>` at `:58`. The dark-mode row (`App.vue:38-44`) has no row `@click` (only the icon toggles). The idle-fade CSS is gone (the `.controls-pane--hovered` class dead; `git show 11550cd` proves it was extant); `@vueuse/core useIdle` installed.
- **§Goal:** land the calm glass+cartoon register the user's nine feedback items ask for. The headline is ONE register move (F3+F6+F8): keep `surface="cartoon"`, add `tier="quiet"` broadly (the glass returns at 0.50 α/10px), REMOVE the tracked specular entirely (default per the user's lean + R3). Around it: restore label-LEFT/value-RIGHT rows while keeping ONE column (F1); fit the bezier panel + bake the back into the header right (F2); give the cartoon shadow symmetric clearance inside the load-bearing clip (F7); lead the ppmycota menu with the SVG mark + drop the emoji (F4); make the whole dark-mode row the click target (F5); re-author the idle-fade dogfooding `useIdle` (F9). Net-deletion-leaning, one register, every fix idiomatic + gestalt — the chronic-closure discipline in ACTION (the user caught a re-paper before H.W8's golden baseline locked it).
- **§Scope:** **S1 (F8+F3+F6 — the register)** — add `tier="quiet"` to every kf-owned `surface="cartoon"` panel Card (0.50 α — F8) + DELETE the tracked-specular subsystem (the manual `glass-specular-track`, the `.cartoon-specular ::before` projection, the `useSpecularPointer` wire + file — F3/F6); MUST land together. **S2 (F7)** — symmetric `.controls-content` left clearance so the cartoon stamp clears the load-bearing clip (keep `overflow:hidden`). **S3 (F1)** — intra-row `[auto_1fr]` (label-left/value-right) at the ROW level, one-column STACK preserved (revises W3.S1); demo-side wrapper born-GREEN today, the glass-ui `LabeledField orientation` HANDOFF is the durable home. **S4 (F2)** — fit the bezier panel (no scroll) + bake the back into the CardHeader right (revises W4.S2); the in-panel canvas ceiling is a NAMED panel-context clamp tighter than W4's full-rail 280 (square law preserved). **S5 (F4+F5)** — drop the emoji `<p>`, lead with the existing pp SVG mark (F4); row-level `@click="toggleDark()"` + `<DarkModeToggle passive>` (F5). **S6 (F9)** — `useIdle(10_000)` driving one class off `idle && !isPaneHovered`; CSS owns opacity + transition (token `--controls-idle-opacity` ~0.35) + a `:focus-within` a11y improvement + a MANDATORY PRM guard.
- **§Hard gate — the 10 gates, each BITES born-RED today:** **AMEND** `proof:single-column-pack` (add `labelRect.right ≤ controlRect.left`; reds on the label-ABOVE stack); **NEW** `proof:bezier-no-scroll` (reds: content overflows the cap + external top-LEFT back); **INVERT** `proof:no-orphan-specular` (exception set `{bezier}` → ∅; ZERO `.glass-specular-track` on any kf-owned `<Card>`; reds on the composite today — STRONGER than the W2 form); **RETIRE** `proof:cartoon-specular-coexist` + `proof:specular-calm` (subject deleted — drop from `proof:all`); **NEW** `proof:glass-and-cartoon` (reds if a panel resolves an OPAQUE background in the non-PRM case; greens on `tier="quiet"`; `proof:cartoon-is-panel-depth` stays GREEN, tier-agnostic); **NEW** `proof:pp-logo-svg` (static — reds: the emoji `<p>` present); **NEW** `proof:darkmode-row-toggle` (reds: clicking the label/gutter does nothing); **NEW** `proof:cartoon-shadow-unclipped` (reds: the bottom-LEFT lobe outside the padded box); **NEW** `proof:idle-fade` (reds: the dead class rests at opacity 1). Gate-shape authored where H.W8 owns it; H.W9 wires the born-RED clauses into `proof:*`. **BITE:** revert any fix → its gate reds; the specular dies because the subsystem is DELETED (not `display:none`); the glass returns because the tier is `quiet`.
- **§Folds (the supersede-map — the honest ledger):** F1 supersedes W3.S1; F2 supersedes W4.S2; F3 supersedes W2.S3; F6 supersedes W2.S2-COMPOSITE; F8 supersedes W2.S1; F7 is a STRUCTURAL TENSION (W3 clip × W2 shadow, no wrong decision); F4/F5 are new; F9 is a restoration. Full table + per-item precept-consistency in `waves/H.W9.md §supersede-map`.
- **§Design decisions RESOLVED:** F3+F6+F8 collapse into ONE register move (the headline); REMOVE the tracked specular (default; the CONSISTENT alternative is the §USER-DECISION fork — only if the user rejects REMOVE); F1 reverts ONLY the inner row split (the one-column-pack invariant preserved); F2's in-panel ceiling is a NAMED clamp, not a W4 contradiction; F7 keeps the load-bearing clip; F9 dogfoods `useIdle` + a `:focus-within` a11y improvement. **H.W9 SUPERSEDES, it does not REWRITE** — the supersede-map is the honest ledger; F6's invert keeps the D2 cartoon chronic CLOSED via a STRONGER system property (`proof:no-orphan-specular` exception=∅ — a chronic exits via a SYSTEM-property gate, the chronic-closure discipline). TWO glass-ui HANDOFFs (F1 `LabeledField orientation`; F8 OPTIONAL `cartoon`+`quiet` preset), each paired with a born-RED kf gate.

---

## H.W8 — THE GATE-REGIME UPGRADE (close the blind spots; the LAST re-paper; CLOSES the DAG)

- **Phase:** IMPL — spec authored in DEV, awaits auth · **Class:** SHIP-in-H (the appearance + interaction axes + the manifest + the chronic meta-gate) · **Scope:** `demo-driver.mjs:40-59` (the drifted SCENES manifest), a new `proof:visual-lock` pixel baseline (needs `pixelmatch`+`pngjs` as CI-only devDeps — see H.W8.md S2), the chronic-closure meta-gate (parse substrate = `PROGRESS.md`, NOT the not-yet-authored `FINAL.md` — BLK-2), the dock-lag kf consume-leg (bump `^3.4.0 → ^3.5.1`, BLK-5) + its born-RED `proof:dock-morph-settled` (BLK-3) · **DAG-deps:** ALL of H.W0-H.W7 (the gate locks the LANDED appearance/interaction; the chronic meta-gate audits the closures).
- **§Provenance (the folded lanes):** `a-gate-blindspots` (the master deficit map), `a-deferred-chronic §3` (the chronic-closure discipline), `a-changes-vs-plan`, `a-precept-sweep`, plus the dock-lag handoff (`a-historical-dock`, `a-perf-dock-lag`, `a-glassmorphism-perf` G4). Synthesis home: `_SYNTHESIS-dock-perf-modes`, `_SYNTHESIS-deferred-ledger`, `_SYNTHESIS-gap-scorecard §0/§3 H.W8/§4` (`:162-165`).
- **§The state, verified (file:line / live anchors):** the A→G gate lattice locks SOURCE-SHAPE + NOT-BLANK; it has NO appearance axis, NO interaction axis, and a drifted SCENES manifest (`demo-driver.mjs:40-59` knows 6, the demo ships 9 — sequence/motion-path/starting-style NEVER gate-visited). Four user-visible chronics (D2/D7/D10/D5) "exited" the A→G ledger by RE-CLASSIFICATION (M1/M2/M3), not by being SOLVED — the P-invariant policed the COLUMN, not the PRODUCT (`a-deferred-chronic §2-3`). The dock LAG: installed (pinned `^3.4.0`) glass-ui ships the pre-AW.W2 `--spring-dock` (live `0.10932…`, ramp peak +16.3% — the analytic spring overshoot for (0.5,0.5) is ~+18.5%; the GATE parses the sampled +16.3%, CP-MED-3); the AW.W2 retune in glass-ui `53c1b07` is **PUBLISHED** (glass-ui 3.5.0/3.5.1/3.6.0 on npm, VERIFIED — `git merge-base --is-ancestor 53c1b07 v3.5.0` → YES; BLK-5), so the fix is a kf consume-leg BUMP `^3.4.0 → ^3.5.1`, NOT a wait (`_SYNTHESIS-gap-scorecard §1.1 dock LAG / §4`).
- **§Goal:** the gate regime gains an appearance axis, an interaction axis, a re-sourced manifest, and the chronic-closure meta-gate — so this is the LAST tranche the four chronics can be re-papered; the dock lag is a HANDOFF paired with a born-RED gate.
- **§Scope:** **S1 (I-1)** — re-source the `SCENES` manifest from `scenes.ts` (WHAT: the manifest sync; WHY: 3 of 9 scenes are never gate-visited — adding a scene without a manifest entry must red). **S2 (I-2)** — a `proof:visual-lock` pixel baseline (named-region diff) (WHAT: the appearance axis; WHY: the single broadest lever — converts D1/D3/D4/D6/D7/D10 appearance defects into one re-runnable diff). **S3 (I-3)** — the chronic-closure meta-gate: a chronic exits ONLY with a SYSTEM-property gate OR a HANDOFF paired with a born-RED kf gate (WHAT: the meta-gate; WHY: a bare HANDOFF tag with no born-RED gate must red the ledger). **S4** — the dock-lag fix is a **kf SHIP-in-H consume-leg: bump `@mkbabb/glass-ui ^3.4.0 → ^3.5.1`** (`53c1b07` IS PUBLISHED — glass-ui 3.5.0/3.5.1/3.6.0 on npm; NO wait, NO kf fork; BLK-5) PAIRED with a born-RED **`proof:dock-morph-settled`** (the canonical SPRING/settle gate name across H.W8/PROGRESS.md/gap-scorecard/handoff — NOT `proof:dock-live`, which dangled against the meta-gate substrate; BLK-3) in its **token-peak form** (`--spring-dock` ramp peak ≤ +6%, trivially measurable, RED at the installed +16.3%, greens on the bump — the morph is NOT reliably driveable live, 181 samples, no morph captured; BLK-5). MEASURE-FIRST blast-radius note: the 3.5.0+ bump crosses dock-layering polish — re-run `proof:dock-dropdown-opens` + a slot-shape check post-bump; confirm whether `:5173` reads `node_modules` or the `vite.config.ts:142-146` aliased checkout (live evidence: the demo reads the OLD register, so the package path is effective). The demo `collapse-delay` 2500→~1000 is MEASURE-FIRST (WHY: D5 — the chronic exits via a kf consume-leg + born-RED gate, the discipline of S3). **S5** — the φ-hero size floor, motion-liveness, scene-parity, mobile-architecture gate extensions (folded into H.W4/H.W6/H.W5/H.W7's gates, audited complete here).
- **§Hard gate — `proof:manifest-sourced` + `proof:visual-lock` + the chronic meta-gate (BORN-RED TODAY):** adding a scene to `scenes.ts` without a manifest entry reds (RED: 3 scenes drifted today); reverting any D1/D3/D4/D6/D7 trips the region diff; a bare HANDOFF tag with no born-RED gate reds the ledger; `proof:dock-morph-settled` (token-peak form) is born-RED (the pre-AW.W2 `--spring-dock` ramp peaks +16.3% today, > the ≤+6% budget; analytic overshoot ~+18.5%; CP-MED-3/BLK-5). **BITE:** add a scene to `scenes.ts` and skip the manifest → `proof:manifest-sourced` reds; revert the hero mega rung → `proof:visual-lock` reds at the hero region; bump glass-ui without the published dock-spring retune (or leave `^3.4.0`) → `proof:dock-morph-settled` reds (ramp peak >+6%); tag the dock consume-leg with no born-RED gate → the chronic meta-gate reds.
- **§Folds:** `a-gate-blindspots` (S1/S2/S5), `a-deferred-chronic §3` (S3), `a-changes-vs-plan` (S3 — the gate-genus root-cause), `a-precept-sweep` (S5), the dock-lag handoff (S4 — `a-historical-dock`/`a-perf-dock-lag`/`a-glassmorphism-perf` G4).
- **§Design decisions RESOLVED:** the dock lag is now a kf CONSUME-LEG (glass-ui owns `--spring-dock`; the retune `53c1b07` IS published in 3.5.0+, so kf bumps `^3.4.0 → ^3.5.1` to consume it; NO kf fork — inv-16; BLK-5 corrected the stale "await release" disposition) PAIRED with a born-RED `proof:dock-morph-settled` (token-peak form; the chronic-closure discipline); the demo `collapse-delay` tune is MEASURE-FIRST; the chronic-closure meta-gate is the P-invariant repaired to police the PRODUCT, not the column (the H-born meta-invariant). **RESOLVED-design (carried from BLK-2):** the meta-gate's CANONICAL parse substrate is `H/PROGRESS.md §"Open deferrals"` chronic table (verified present) — `H/FINAL.md` does NOT exist yet (authored at H.WZ) and is parsed ADDITIONALLY only behind an `fs.existsSync` guard (or dropped); PROGRESS.md is the SINGLE parseable substrate.

---

## § The DAG (inter-wave dependencies)

```
                         ┌──────────────────────────────────────────────┐
                         │  H.W0 — KILL THE CRASHES (LEADS)             │
                         │  serializeEasing throw + the "......" lerp    │
                         │  (proof:demo-console-clean) — the live        │
                         │  crashes poison every other measurement       │
                         └──────────────────────┬───────────────────────┘
                                                │ (clean console precondition)
                         ┌──────────────────────▼───────────────────────┐
                         │  H.W1 — THE SCENE+PLAYBACK FSM (KEYSTONE)     │
                         │  ONE useSceneMachine() (createGlobalState +   │
                         │  reducer); route storm dies; suspend=identity;│
                         │  + the @mbabb popover (D9, FSM-coupled)       │
                         └──────────────────────┬───────────────────────┘
                                                │ (the active-scene fact;
                                                │  SceneDescriptor projected)
       ┌──────────────────┬────────────────────┼──────────────┬─────────────────┐
       │ (parallel)       │                    │              │                 │
┌──────▼──────┐  ┌────────▼───────┐  ┌─────────▼────┐  ┌──────▼──────┐  ┌───────▼──────┐
│ H.W2 design │  │ H.W3 layout    │  │ H.W4 easing  │  │ H.W5 icons  │  │ H.W6 typing  │
│  language   │  │  rail·stage·   │  │  + φ-hero    │  │  + modes    │  │  dots        │
│ surface=    │  │  rail grid;    │  │  + icon idiom│  │  (rides W1) │  │  (rides W0   │
│  cartoon    │  │  --rail-width  │  │              │  │             │  │  H-A2 guard) │
└─────────────┘  └────────┬───────┘  └──────────────┘  └─────────────┘  └──────────────┘
                          │ (--rail-width grid authored once)
                 ┌────────▼────────────────────────────────┐
                 │  H.W7 — MOBILE OVERLAY + SPRINGY DRAWER  │
                 │  re-parameterize the SAME grid; stage    │
                 │  full-bleed; SpringProgress sheet        │
                 └────────────────────┬─────────────────────┘
                                      │ (W2/W3/W4/W6 landed — the user audits
                                      │  the running demo; F1–F9 refinement)
                 ┌────────────────────▼─────────────────────────────────────┐
                 │  H.W9 — DESIGN-LANGUAGE REFINEMENT ROUND 2 (CORRECTIVE)   │
                 │  F3+F6+F8 collapse: surface="cartoon" + tier="quiet" +    │
                 │  REMOVE the tracked specular; F1 rows; F2 bezier-fit;     │
                 │  F7 shadow-unclip; F4 pp-logo; F5 darkmode-row; F9 idle.  │
                 │  SUPERSEDES specific landed W2/W3/W4 decisions.           │
                 └────────────────────┬─────────────────────────────────────┘
                                      │ (the calm register / one-column row /
                                      │  un-clipped shadow — the state to lock)
       ┌───────────────────────────────▼──────────────────────────────────────┐
       │  H.W8 — THE GATE-REGIME UPGRADE (CLOSES; depends on ALL W0-W7+W9)     │
       │  proof:visual-lock (appearance — locks the H.W9 GOLDEN render) +      │
       │  interaction axis + manifest re-source + the chronic-closure          │
       │  meta-gate + the dock-lag HANDOFF paired with born-RED                 │
       │  proof:dock-morph-settled                                              │
       └───────────────────────────────────────────────────────────────────────┘
```

**Critical path:** `H.W0 → H.W1 → {visual/mobile waves} → H.W9 → H.W8`. H.W0 (crashes) and H.W1
(state machine) are the two PREREQUISITES — five lanes name D12 as a blocker and the live
crashes poison every clean measurement (`_SYNTHESIS-gap-scorecard §3`). **Parallelizable
(with a FILE-OWNERSHIP discipline — CP-HIGH-1):** H.W2 (design language), H.W3 (layout),
H.W4 (easing/hero), H.W5 (icons/modes), and H.W6 (typing-dots) are dependency-parallel once
H.W0+H.W1 land — except H.W5 rides H.W1 (the SceneDescriptor is FSM-projected) and H.W6
rides H.W0's H-A2 guard. **They do NOT all share no source surface, however** — the deep
harden found 5 shared-file collisions + 2 same-line write-races, so impl-time concurrency
needs partition rules. **HARD partition rules (the two same-line write-races):** (1)
**W6→W4 on `EditorStartScreen.vue:15-21`** — W6 deletes the ellipsis node, then W4 sizes the
survivor (same lines, same band); (2) **W1 `<script>` → W3 `<template>` → W7 `<template>` on
`AnimationControlsGroup.vue` (line `:5` the most-contended grid track).** **SOFT rules:**
W2/W3 rebase-sequence on `AnimationControlsControls.vue` (W2:3 ∥ W3:4,6,9); a dashed
`W3⇢W4` edge (`TimingFunctionPanel.vue:17-19` is shared); land W3's `--controls-pane-width`
→`--rail-width` rename FIRST so W4/W5 appends never reference the dead token; W2/W3/W4/W5 all
append to `design-idioms.css`. The other shared file is `AssetPropertiesPanel.vue` (separate
tree). **Cross-wave coupling:** H.W7 (mobile) re-parameterizes the SAME `--rail-width`
`rail·stage·rail` grid H.W3 authors (the layout is written ONCE), so H.W7 depends on H.W3.
**H.W9 — the CORRECTIVE refinement round — sits AFTER the visual waves, BEFORE H.W8.** It
is NOT dependency-parallel with W2/W3/W4: it SUPERSEDES specific landed W2/W3/W4 decisions
(the user audited the running demo after they landed), so it depends on W2 (the surface flip
it refines), W3 (the row shape + the load-bearing clip it reconciles), W4 (the bezier panel
it re-fits), and W6 (no collision — the `EditorStartScreen` hero lane is untouched); its
browser gates settle-gate on H.W1. **H.W9 MUST land before H.W8** so the calm glass+cartoon
register / the one-column label-left row / the un-clipped cartoon shadow are the render
H.W8's `proof:visual-lock` golden baseline locks — a re-paper caught BEFORE the baseline
fixed it. **H.W8 closes** — it locks the LANDED appearance (the `proof:visual-lock`
baseline) + interaction + manifest of all of H.W0-H.W7 **AND H.W9** and installs the
chronic-closure meta-gate, so it depends on every prior wave. **inv δ** (no dock occlusion)
is a standing constraint on H.W2, H.W7, and H.W9 (the mobile overlay + the surface swap +
the refinement must not re-introduce an occlusion).

---

## § The cross-repo HAND-OFFs (tagged, NOT patched in kf — inv-16)

This is the inv-16 band: kf consumes glass-ui/value.js/parse-that PUBLISHED, and every
sibling item is AUDITED as its own surface and HANDOFF-tagged + sequenced. **The
chronic-closure discipline (H.W8) binds here:** each HANDOFF is PAIRED with a born-RED kf
gate so the chronic exits via (b) — a HANDOFF tag is never a bare column-migration
(`_SYNTHESIS-gap-scorecard §0/§4`).

| Item | Owner | Anchor | Disposition (PAIRED born-RED gate) |
|---|---|---|---|
| **Dock LAG** (D5-b) — the pre-AW.W2 `--spring-dock` | glass-ui (AW tranche — `53c1b07` PUBLISHED) | installed (pinned `^3.4.0`) `--spring-dock: 0.10932…` (ramp peak +16.3%); the retune `53c1b07` IS PUBLISHED (glass-ui 3.5.0/3.5.1/3.6.0 on npm, VERIFIED) | **kf CONSUME-LEG (BLK-5 — no longer an await-release HANDOFF)** — bump `@mkbabb/glass-ui ^3.4.0 → ^3.5.1` to consume the published retune; NO kf fork; PAIRED with born-RED `proof:dock-morph-settled` (token-peak form: `--spring-dock` ramp peak ≤ +6%; RED at +16.3% today, greens on the bump). Re-run `proof:dock-dropdown-opens` + slot-shape post-bump (the 3.5.0+ bump crosses dock-layering polish, MEASURE-FIRST) |
| **Card specular SEAM** (D2/D14 root) | glass-ui | `CardFooter-C390imy7.js:37` emits `glass-specular-track` on `surface="glass"` with no `--mouse-*` wire | **glass-ui-HANDOFF** — Card wire-or-omit the seam; calmer default (rest ≤0.25, radius ≤40%); kf's H.W2 `surface="cartoon"` swap is the kf-side close, the calmer default is the glass-ui-side |
| **Mobile drawer `spring` prop** (BOOK) | glass-ui / vaul-vue | `drawer.css:30` vaul sets 500ms `cubic-bezier(.32,.72,0,1)` | NOTE: `a-mobile-architecture` proves the demo drawer is BESPOKE → SHIP-in-H (H.W7, `SpringProgress`). The glass-ui `DrawerContent` `spring` prop ask is a BOOK (a different code path) |
| **`{types}` directional VT helper** | glass-ui | GG-3/H-1; `useSceneTransition.ts` waits on it | **glass-ui-HANDOFF (AW)** — the demo VT consumer lands when the helper publishes |
| **value.js next-slice** (E1/E2 linear parser · VJ-F1 path sampler · F2 color sentinels · MCI-5 identity pad · VJ-F2 error sink · VJ-F4 buffer overload · F3 LRU) | value.js (CHRONIC-by-design) | `a-deferred-ledger §2` | **value.js-HANDOFF** — all ride the next re-pin, ZERO kf edit; the `it.fails` MCI-5 witness IS the consume signal |
| **parse-that `(id,offset)` packrat re-key** (PT-4) | parse-that | `a-deferred-ledger §3 LD-PT-1` | **parse-that-HANDOFF** — author `proof:packrat-position`, then re-key |
| **deploy: `dns-cf-sync.sh` CNAME (P0)** | deploy | `a-deferred-ledger §7 G-HANDOFF-3` | **deploy-HANDOFF (P0)** |

---

## § ALREADY-SOTA — the binding refusal; manufacture NO work (binding per the §Mandate)

(Copied from `_SYNTHESIS-gap-scorecard §5`, corroborated by `§1.2` and the per-lane
§ALREADY-SOTA records.) H must NOT re-touch these — **re-touching exemplary work is the
inverse failure:**

1. **The engine kernel** — the `lerpValue → iv._lerp` single-dispatch seam, the G.W17
   blend leaf (proof-green), the G.W18 quaternion-native rotate3d, `.finished`/DrawSVG/
   `adoptCompiled` (G.W13/W19), the re-pin that consumed `0.11.1`/`0.9.0`/`3.4.0` with ZERO
   kf src edit. `engine.ts` at its cohesive gestalt — H must not grow it without a measured
   cohesive split (`_SYNTHESIS-gap-scorecard §1.2/§5.1`, `a-engine-regressions` H-A4..A10).
2. **The φ-ladder MECHANISM + Capsize fallback** — genuine √φ-derived rungs, Instrument
   Serif metric-matched fallback (0 CLS), leaf-tail clean. Only the hero RUNG SELECTION and
   2 leaf rungs are GAP (H.W4) — the mechanism is golden (`§5.2`, `a-hero-typography`).
3. **The design-idioms token consolidations** — `--rainbow-*`/`--color-gold`
   localization, `.progress-rail/-ball/-badge/-token` single-sourcing with AA lineage, the
   z-contract, the work-area token algebra, 0 `!important`, 0 SFC `@apply` (`§5.3`,
   `a-design-language §7.4-7.6`, `a-styling-idioms §7`).
4. **The scene SUBJECT dogfood** — cube `AnimationGroup`, spring `SpringProgress` rail
   (D11 SOTA), the sequence transport (SOTA), `useSceneSwap` VT+SpringProgress dissolve,
   `CopyButton` `CSSKeyframesAnimation` (the chrome dogfood template). **The GAP is the
   CHROME, not the subjects** (`§5.4`, `a-animations-quality`, `a-modes-pertinence`).
5. **glass-ui CONSUMPTION hygiene + the specular `::before` BUILD** — idiomatic subpath
   imports, LabeledField forms; the specular `::before` is GPU-cheap + SOTA-built (its
   defect is TUNING/SEAM, not perf or authoring) (`§5.5`, `a-glass-ui-consumption`,
   `a-glassmorphism-perf` G3).
6. **The demo rAF orchestration** — `useRafLoop({guard})` + settle-window idling; blur is
   FREE at dpr=1 (the dpr² scaling is the unguarded RISK, MEASURE-FIRST, not a present
   defect) (`§5.6`, `a-perf-dock-lag`, `a-glassmorphism-perf` G1).
7. **The affixed-dock scaffolding + safe-area** — both docks `position:fixed` honoring
   `--work-area-*-offset` + `@supports not (dvh)` fallbacks. **The mobile SKELETON is
   correct; only the COMPOSITION (stack vs overlay) is GAP** (H.W7) (`§5.7`,
   `a-mobile-architecture` F3).
8. **The deferred ledger / re-pin spine** — the whole A→G open ledger collapsed in G; the
   residual is small + well-homed (the sibling-HANDOFFs riding the next re-pin) (`§5.8`,
   `a-deferred-ledger §0-1`).
9. **The gate lattice AT WHAT IT COVERS** — source-shape (`proof:idioms`/
   `proof:brittleness`), not-blank/not-occluded/score-floor. Exemplary; the GAP is the
   MISSING appearance + interaction axes (H.W8), not the existing gates (`§5.9`).

**The §ALREADY-SOTA record is BINDING: manufacture NO work where D+E+F+G lead.**

---

## § Honest provenance — net-new vs folded vs already-SOTA

**Net-new (the H content):** every SHIP/HANDOFF above is a phase-1/synthesis assay finding
— the two live-crash kills (H.W0), the FSM keystone (H.W1, 5 lanes name it a blocker), the
5-lane design-language restoration (H.W2), the `rail·stage·rail` layout transposition
(H.W3), the visual-fidelity rungs + the icon idiom (H.W4), the new modes finished (H.W5),
the typing-dots dogfood primitive (H.W6), the mobile overlay + springy drawer (H.W7), the
design-language refinement round 2 (H.W9), and the gate-regime upgrade (H.W8). The GAP
column is exactly: TWO crashes, ONE FSM, the design-language restoration, the layout
transposition, the easing/hero rungs, the icons/modes finish, the typing-dots, the mobile
overlay, the F1–F9 refinement, and the gate-regime upgrade.

**The user-feedback refinement round (H.W9) — the gate-blindspot lesson in ACTION.** H.W9
is NOT a phase-1 assay finding; it is the user's authoritative direction after AUDITING the
running demo — nine refinements (F1–F9) that course-correct specific landed W2/W3/W4
decisions (the headline: F3+F6+F8 collapse to keep `surface="cartoon"`, add `tier="quiet"`,
REMOVE the tracked specular). This is precisely the appearance/interaction audit the
gate-blindspot lesson names and H.W8 institutionalizes — arriving by HAND before the golden
baseline locked it. It is the chronic-closure discipline catching a re-paper BEFORE the
`proof:visual-lock` baseline fixed it: the W2 composite is RETIRED and the cartoon chronic
(D2) stays closed via a STRONGER inverted system property (`proof:no-orphan-specular`
exception=∅), not a re-opening. H.W9 SUPERSEDES the specific landed decisions it corrects
(the §supersede-map is the honest ledger — never a rewrite of the landed §Goal), and it
carries TWO glass-ui HANDOFFs + the one F6 USER-DECISION fork (default REMOVE). Net-deletion-
leaning, pure demo + the gate deltas, NO engine source, NO glass-ui patch in kf (inv-16).

**Folded chronic debt: FOUR, and CLOSED for the first time honestly.** Unlike G's vacuous
ledger, H carries four user-visible chronics (cartoon-shadow D2 → H.W2, φ-hero D7 → H.W4,
mobile D10 → H.W7, dock D5 → H.W8) that "exited" the A→G ledger by RE-CLASSIFICATION, not
by being SOLVED (`a-deferred-chronic §2-3`). H closes each with a SYSTEM-property gate
(D2/D7/D10) or a HANDOFF paired with a born-RED kf gate (D5) — the chronic-closure
discipline, installed as a standing meta-gate (H.W8) so the four cannot be re-papered. **No
chronic exits via a bare column-migration in H.**

**Already-SOTA — H refuses to touch (§ above).** Stated plainly so no wave manufactures a
deficit where D+E+F+G lead.

---

## § The honest bottom line

H is **the demo-quality / design-language-restoration / mobile / scene-state tranche that
finishes what G's correctness re-pin could not see**. Two live console crashes
(serializeEasing, the `"......"` lerp) ship in 4.1.0 and die first (H.W0). The CRITICAL
keystone is ONE formal scene+playback state machine on `createGlobalState` + a hand-rolled
reducer (adjudicated over Pinia — 2-of-3 lanes, the spine's no-parallel-system rule) that
ends the autonomous route storm and makes suspend/restore an identity (H.W1). The
design-language restoration flips panels to `surface="cartoon"` (adjudicated over the
class/neutralizer approaches — net-deletion, the radial dies at source) and dials the
specular to a wired catch-light (H.W2). A single named `rail·stage·rail` grid with one
`--rail-width` token makes the one-column controls (D1), the rail-width timeline (D4), and
the mobile overlay (D10) cohesive (H.W3, H.W7). The hero bumps one φ rung into the
audacious tier and the easing canvas gets a container ceiling (H.W4); the scene icons
become one themable inline-SVG family on the descriptor, Discrete merges into Spring, and
the survivors get interactivity (H.W5); the typing dots become a dogfooded staggered
primitive (H.W6). Then the user audits the running demo and names nine refinements (F1–F9):
the CORRECTIVE round H.W9 collapses F3+F6+F8 into ONE register move — keep `surface="cartoon"`,
add `tier="quiet"` (the glass returns), REMOVE the tracked specular entirely — and lands the
label-left rows, the bezier fit, the un-clipped shadow, the pp-logo mark, the dark-mode row,
and the `useIdle` idle-fade; it SUPERSEDES specific landed W2/W3/W4 decisions (the honest
supersede-map) and lands BEFORE H.W8's golden baseline so the calm register is what gets
locked — the chronic-closure discipline catching a re-paper before the baseline fixed it.
The cross-repo dock lag, Card-specular seam, and value.js/parse-that
slices are HANDOFFs, each paired with a born-RED kf gate. And the gate regime gains an
appearance axis (a pixel visual-lock), an interaction axis, a re-sourced SCENES manifest,
and the chronic-closure meta-gate (H.W8) — so this is the LAST tranche these four chronics
can be re-papered.

Everything else — the engine kernel, the interpolation dispatch seam, the FrameCompiler,
the boundary, the color science, the parse grammar, the parse-that leaf tier, the φ-ladder
MECHANISM + Capsize fallback, the design-idioms consolidations, the scene-SUBJECT dogfood,
the glass-ui consumption hygiene + the specular `::before` build, the demo rAF
orchestration, the affixed-dock + safe-area scaffolding — is **ALREADY-SOTA and left
alone**. **H proves itself by closing the four chronics for the LAST time — repairing the
P-invariant to police the PRODUCT, not the column.**

---

## inv-16 / inv ε compliance

This charter wrote ONLY docs under `docs/tranches/H/` — ZERO source edits to keyframes.js,
value.js, parse-that, or glass-ui. Every claim traces to a named phase-1/synthesis lane
(cited inline) or a `file:line`/live anchor against the live `tranche-h-dev` tree, verified
not asserted: the two live crashes (`serializeEasing` at `src/animation/format.ts:30`/throw
`:36` ← the readout `KeyframesStringControls.vue:~95`/`onMounted :222`, re-targeted off the
Cube presets onto the easing `contractAnim`/amiga per BLK-1; the `"......"` lerp at
`engine.ts:769`/`:779` via `:657` — `_SYNTHESIS-gap-scorecard §1.1`), the 5-authority route storm + the
`isStableFire` heuristic (`useSceneGroupSync.ts:54`), the double-wrapped popover trigger
(`App.vue:18-21`, live `finalOpen:false`), the ~5–13 specular hosts (route/state-dependent) 0-pointer-wired + the
single `cartoon-surface` site (`CSSCodeEditor.vue:6`), the lopsided two-column controls
(live `grid-template-columns: 212px 466px`) + the three width regimes (1272/400/768), the
86.1px hero rung + the 61 no-op `icon-*` classes, the 4 modes wearing `<Home>`
(`ChromeDock.vue:25-30`), the single-span `split(/\s+/)` (`AnimatedText.vue:62`), the
30px-crushed mobile stage, and the drifted SCENES manifest (`demo-driver.mjs:40-59` knows
6, the demo ships 9); plus the user-feedback refinement round (F1–F9 on `tranche-h-impl`):
the ~14 `surface="cartoon"` panels reading opaque on the `resting` tier (the F8 quiet-glass
recovery), the lone tracked-specular composite (`TimingFunctionPanel.vue:30,175,198` — F3/F6
REMOVE), the accidentally-collapsed per-row split (`ece4743`/W3.S1 — F1), the scrolling bezier
panel + external back button (W4.S2 — F2), the sliced bottom-LEFT cartoon shadow
(`ControlsPaneWrapper.vue:182,207-208` — F7), the emoji-garnished pp logo (`App.vue:58` — F4),
the icon-only dark-mode toggle (`App.vue:38-44` — F5), and the dead idle-fade class
(`11550cd` extant — F9). The band→wave map proposes 10 waves (`H.W0..H.W9`) ordered by the
crash+FSM-prerequisite DAG, with H.W9 the CORRECTIVE refinement round AFTER W2/W3/W4/W6 and
BEFORE H.W8's golden baseline; each carries a falsifiable `proof:*` gate that BITES (born-RED
today, GREEN on fix), the four chronics each exit via a SYSTEM-property gate or a
HANDOFF-paired born-RED gate (the chronic-closure meta-invariant), and H.W9's F6-invert keeps
the D2 cartoon chronic closed via a STRONGER inverted `proof:no-orphan-specular` (exception=∅).
inv-16 HOLDS for H (kf consumes glass-ui/value.js/parse-that PUBLISHED; the dock/specular/
value.js/parse-that items are AUDITED + HANDOFF-tagged, never authored or patched in kf;
H.W9 emits TWO glass-ui HANDOFFs, never a kf patch). **H.W0..H.W9 IMPLEMENTATION awaits
explicit authorization — this is the canonical charter, authored in TRANCHE DEVELOPMENT.**
