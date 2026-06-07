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
consumed PUBLISHED, demo live at `:5174`). The deep audit is RUN — the evidence is on disk
under `docs/tranches/H/audit/` (35 phase-1 `a-*` lanes + 6 `_SYNTHESIS-*` synthesis lanes,
each `file:line`-grounded or live-anchored with a SHIP/MEASURE-FIRST/BOOK/RECORD/HANDOFF/
KILL disposition and a re-runnable instrument). This charter (`H.md`), the gap-scorecard,
the prompt-recap, and the deferred-ledger are the DEVELOPMENT artifacts. **H.W0–H.W8 are
authored-now-run-later wave specs; the implementation phase opens only on explicit user
authorization, gated on keyframes' own green CI — exactly D.W0's, E.W0's, F.W0's, and
G.W1's dev/impl boundary.** No engine, demo, library, parser, test, or bench source is
written in development. **This is TRANCHE DEVELOPMENT — docs ONLY, ZERO source/test/CI/demo
edits.**

## § Mandate (binding — every wave, every fold, every hand-off · the spine)

The standing precepts, carried verbatim-in-substance from `G/G.md:46-91` (themselves from
`F/F.md:35-63`), re-confirmed HONORED A→G with the drift clustered on ONE seam — the
scene+playback state machine D12 (`_SYNTHESIS-prompt-recap §3`) — and BINDING on every H
wave (H.W0–H.W8), every gate, and every cross-repo hand-off this tranche emits
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
  consumes glass-ui PUBLISHED (`^3.4.0`); the dock/specular/value.js/parse-that items are
  AUDITED + HANDOFF-tagged, never authored or patched in kf.

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
| **inv-16** | kf consumes glass-ui/value.js/parse-that; sibling items are HAND-OFFs | HOLD — H consumes glass-ui `^3.4.0` PUBLISHED through the LabeledField/subpath idioms; the dock lag, the Card specular seam, the value.js next-slice, and the parse-that re-key are AUDITED as sibling surfaces and HANDOFF-tagged (§4), each paired with a born-RED kf gate (`_SYNTHESIS-gap-scorecard §4`, `§3 H.W8`). |
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

(The canonical H structure from `_SYNTHESIS-gap-scorecard §3`. Nine waves. Each: a band/
theme · the headline disposition · the folded lane(s) · the falsifiable `proof:*` gate
that BITES — born-RED today, GREEN at close. **Waves are ordered by dependency: H.W0
(crashes) and H.W1 (state machine) are PREREQUISITES** — five lanes name D12 as a blocker;
the live crashes poison every other measurement.)

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
| **H.W8 — Gate-regime upgrade** | the appearance axis + interaction axis + manifest + chronic meta-gate | H.W8 | net-new (closes the blind spots; the LAST re-paper) |

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
| **D9** · `a-mbabb-popover` · `a-glass-ui-consumption` D9 · `a-historical-dock` H-dock-1 | **H.W1** (popover; FSM-coupled) | the @mbabb popover re-open | SHIP-in-H (drop the double-wrapped trigger; `keepOpen`/`release`) |
| **D5** (dock LAG, cross-repo) · `a-historical-dock` · `a-perf-dock-lag` · `a-glassmorphism-perf` G4 · `a-glass-ui-consumption` D5 | **H.W8** (HANDOFF + born-RED gate) | the dock lag | glass-ui-HANDOFF (release `53c1b07`) + SHIP-in-H (`collapse-delay`, MEASURE-FIRST) |
| `a-gate-blindspots` · `a-deferred-chronic §3` · `a-changes-vs-plan` · `a-precept-sweep` | **H.W8** | the gate-regime upgrade | SHIP-in-H (appearance + interaction axes + manifest + chronic meta-gate) |
| (sibling-HANDOFFs) | **§4** | the cross-repo hand-offs | glass-ui / value.js / parse-that / deploy HAND-OFF |

The per-band one-paragraph characterizations:

- **H.W0 (crashes) — the prerequisite.** Two crashes ship in 4.1.0 and poison every other
  measurement, so they die first. **H-A1:** `serializeEasing` THROWS 4× on EVERY Cube load
  (`format.ts:24` ← `KeyframesStringControls.vue:46`, no try/catch; cube presets carry
  closure easings with no `.css` twin). **H-A2:** the `"......"` lerp parse-error
  (`engine.ts:516,576` — the hero ellipsis reaching a CSS-value lerp path). The fix: Cube
  presets get faithful `.css` easing twins flowing through `adoptCompiled` intact, and the
  engine classifies a bare non-numeric/non-color text leaf as a discrete hold-snap
  (CSS-correct), so the hero ellipsis never aborts a frame (folds into H.W6;
  `_SYNTHESIS-gap-scorecard §1.1/§3 H.W0`, `a-engine-regressions`).

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
  and binding `v-model:open` to the dock's `keepOpen`/`release` (`_SYNTHESIS-frontend-mobile
  VERDICT`, `_SYNTHESIS-gap-scorecard §1.1/§2.1/§3 H.W1`, `a-scene-state-machine`,
  `a-store-architecture`, `a-mbabb-popover`).

- **H.W2 (design language) — the 5-lane root-caused restoration.** The demo's identity is
  "paper-and-glass"; the language drifted because the "paper" half (cartoon-shadow) was
  dropped on the panels while the "glass" half over-extended into a mouse-tracked
  radial-specular the demo never wired — glass-ui's `<Card surface="glass">` default bolts
  `glass-specular-track` onto every panel (live 13 hosts, 0 pointer-wired), so the
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
  (1272px vs `--controls-pane-width` 400px vs a 768px sidebar cap), the token decorative.
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
  replacing the CSS ease, unlocking mobile interactivity (cube drag) for free
  (`_SYNTHESIS-frontend-mobile`, `_SYNTHESIS-gap-scorecard §1.1/§3 H.W7`,
  `a-mobile-architecture` F1/F2, `a-demo-architecture` F5).

- **H.W8 (gate-regime upgrade) — so this is the LAST re-paper.** The A→G gate lattice locks
  SOURCE-SHAPE + NOT-BLANK; it has NO appearance axis, NO interaction axis, and a drifted
  SCENES manifest (`demo-driver.mjs:40-59` knows 6, the demo ships 9 — sequence/
  motion-path/starting-style NEVER gate-visited). Three structural additions: (I-1)
  re-source the `SCENES` manifest from `scenes.ts`; (I-2) a `proof:visual-lock` pixel
  baseline (the single broadest lever — converts D1/D3/D4/D6/D7/D10 appearance defects into
  one re-runnable named-region diff); (I-3) the chronic-closure meta-gate (a chronic exits
  ONLY with a SYSTEM-property gate OR a HANDOFF paired with a born-RED kf gate). Plus the
  φ-hero size floor, motion-liveness, scene-parity, and the dock-lag glass-ui-HANDOFF's
  born-RED `proof:dock-live` (`_SYNTHESIS-gap-scorecard §3 H.W8`, `a-gate-blindspots`,
  `a-deferred-chronic §3`).

---

## H.W0 — KILL THE LIVE CRASHES (prerequisite; the demo must not throw; LEADS the DAG)

- **Phase:** IMPL — spec authored in DEV, awaits auth · **Class:** SHIP-in-H (the prerequisite) · **Scope:** Cube presets `.css` easing twins, `src/parsing/format.ts:24`, `src/animation/engine.ts:516,576` (the bare-text leaf classifier) · **DAG-deps:** none (LEADS — the live crashes poison every other measurement).
- **§Provenance (the folded lanes):** `a-engine-regressions` H-A1/H-A2, `a-scene-state-machine §3`. Synthesis home: `_SYNTHESIS-gap-scorecard §3 H.W0` (`:122-125`), `§1.1 live console crashes`.
- **§The state, verified (file:line / live anchors):** **H-A1** — `serializeEasing` THROWS 4× on EVERY fresh `#/cube` load (`format.ts:24` ← `KeyframesStringControls.vue:46`, no try/catch; cube presets carry closure easings with no `.css` twin). **H-A2** — the `"......"` lerp parse-error on home→scene transition (`engine.ts:516,576` — the hero ellipsis reaching a CSS-value lerp path). Both ship in 4.1.0 (`_SYNTHESIS-gap-scorecard §1.1`).
- **§Goal:** zero console throws before any visual lane can measure a clean console; the hero ellipsis never aborts a frame.
- **§Scope:** **S1** — Cube presets get faithful `.css` easing twins flowing through `adoptCompiled` intact (WHAT: the round-trip-honest preset; WHY: the readout never throws and the curve is not lost). **S2** — the engine classifies a bare non-numeric/non-color text leaf as a discrete hold-snap, CSS-correct (WHAT: the bare-text leaf classifier at `engine.ts:516,576`; WHY: the hero ellipsis reaching a lerp path must snap, not throw — folds into H.W6).
- **§Hard gate — `proof:demo-console-clean` (BORN-RED TODAY, GREEN ON FIX):** a fresh `#/cube` load = 0 console errors (RED: 4 today); home→scene transition = 0 errors (RED: H-A2 today). Plus a unit `CSSKeyframesToString(cubeRotationsAnimation)` resolves without throw, and a `proof:interpolate-anything` corpus row: `{label:"a"}→{label:"b"}` snaps discretely, no throw. **BITE:** revert the `.css` twin (or stub the readout to re-throw) → the Cube-load clause reds at 4 errors; revert the bare-text classifier → the discrete-snap row reds (the lerp throws on `"a"`).
- **§Folds:** `a-engine-regressions` H-A1 (S1) / H-A2 (S2 — the engine guard, the belt to H.W6's suspenders).
- **§Design decisions RESOLVED:** the fix is round-trip-honest (`.css` twins flowing through `adoptCompiled`), NOT a try/catch swallow (the silent-degrade the Mandate forbids); the bare-text discrete-hold is CSS-correct, not a special-case for the ellipsis.

---

## H.W1 — THE SCENE + PLAYBACK STATE MACHINE (CRITICAL; the keystone; the second prerequisite)

- **Phase:** IMPL — spec authored in DEV, awaits auth · **Class:** SHIP-in-H (CRITICAL; the keystone) · **Scope:** a new `useSceneMachine()` (`createGlobalState` + a pure reducer), the 5 demoted authorities (route/dock/`?anim=`/localStorage), `useSceneGroupSync.ts:54` (the `isStableFire` heuristic), the engine `serialize()/hydrate()` seam, `App.vue:18-21` (the @mbabb popover trigger) · **DAG-deps:** H.W0 (a clean console is a precondition to measure the FSM round-trip).
- **§Provenance (the folded lanes):** `a-scene-state-machine`, `a-store-architecture`, `a-demo-architecture` F3/F6/F8, `a-engine-regressions` H-A3, `a-mbabb-popover` (the FSM-coupled popover). Synthesis home: `_SYNTHESIS-gap-scorecard §1.1/§2.1/§3 H.W1` (`:127-130`), `_SYNTHESIS-frontend-mobile §0 VERDICT`.
- **§The state, verified (file:line / live anchors):** NO single source of truth for "active scene" — 5 competing authorities (route, localStorage, lagging `currentSuperKey`, dock Select, debounced `?anim=`) oscillate into a live autonomous route storm (easing→motion-path→starting-style→spring→amiga); 3 competing playback authorities; restore = the `isStableFire` double-fire heuristic (`useSceneGroupSync.ts:54`); NO genuine SUSPEND; home↔cube alias. The @mbabb popover primary root = a double-wrapped trigger (`App.vue:18-21` `<DropdownMenuTrigger as-child>` over `<DockDropdownTrigger>` which is itself a reka trigger → 2 toggles cancel; live `handlerCount:2`, `onOpenToggleCalls:2`, `finalOpen:false`) (`_SYNTHESIS-gap-scorecard §1.1`).
- **§Goal:** ONE finite scene+playback FSM owning the active-scene fact; suspend→restore an identity; the route storm ended; home and cube distinct; the popover re-opens.
- **§Scope:** **S1** — author `useSceneMachine()` (`createGlobalState` + a pure ~40-line `transition(state,event)` reducer over `idle|loading|playing|paused|suspended`), collapsing the 6 state homes + 3 playback authorities + the `isStableFire` heuristic in ONE motion (WHAT: the FSM; WHY: the single source of truth — §2.1's adjudicated `createGlobalState`+reducer over Pinia). **S2** — demote route/dock/`?anim=`/localStorage to one-way projections; `?anim=` becomes scene-keyed; deep-link wins over localStorage (WHAT: the projections; WHY: kills the route storm + the cross-scene leak). **S3** — make home and cube DISTINCT states (WHY: kill the alias). **S4** — add the engine `AnimationGroup.serialize()/hydrate()` seam; the store lands first against the existing imperative restore, then swaps (WHAT: the genuine SUSPEND; WHY: replaces the hand-poked clock — the engine half is a value.js/engine-RECORD). **S5** — drop the outer popover wrapper (use `DockDropdownTrigger` directly, mirroring `DockSelectTrigger`) + bind `v-model:open` → dock `keepOpen`/`release`; drop the deprecated `next()` guard (WHY: the double-toggle cancellation D9).
- **§Hard gate — `proof:scene-machine-irrefragable` (BORN-RED TODAY):** the (scenes² × {playing,paused}) matrix — every A→B→A round-trip preserves route/superKey/component/group consistency AND byte-identical playback (suspend→restore is an identity); plus `proof:no-route-storm` (load `#/easing`, idle 2s, ≤1 nav entry, resting hash unchanged — RED: the storm today), `proof:scene-isolation` (easing route shows only easing controls, no cube blend/z-index leak), `proof:deep-link-wins`, `proof:suspend-no-orphan-raf`, and a popover `proof:dock-popover-opens` (`finalOpen:true` — RED: `false` today). **BITE:** revert to the `isStableFire` heuristic → the suspend-identity clause reds (restore double-fires); re-add the outer popover wrapper → `proof:dock-popover-opens` reds (`finalOpen:false`); leave `#/easing` idling → `proof:no-route-storm` reds at >1 nav entry.
- **§Folds:** `a-scene-state-machine` (S1-S4), `a-store-architecture` (S1-S2 — the 3-authority collapse + the `isStableFire` kill + the persisted snapshot + GC'd superKeys), `a-demo-architecture` F3/F6/F8, `a-engine-regressions` H-A3, `a-mbabb-popover` (S5).
- **§Design decisions RESOLVED:** **(1)** the STORE FACILITY is adjudicated `createGlobalState`+reducer, NOT Pinia (`_SYNTHESIS-gap-scorecard §2.1`, `_SYNTHESIS-frontend-mobile VERDICT` — 2-of-3 lanes; the demo already standardizes on `createGlobalState`; Pinia is a second reactive-store paradigm = the no-legacy violation; its only unique wins — devtools/persist — are met by `@vueuse/useStorage`; the user's named choice is honored in SPIRIT, a formal store + FSM, without the heavier facility swap). **(2)** the engine `serialize()/hydrate()` seam is a value.js/engine-RECORD — the store lands first against the existing imperative restore, then swaps (no engine edit gated to the store). **(3)** the popover root is the double-wrapped trigger (ADJUDICATED primary over the `keepOpen`/`portal` secondaries; `_SYNTHESIS-gap-scorecard §1.1 mbabb-popover`).

---

## H.W2 — RESTORE THE DESIGN LANGUAGE (cartoon depth + a wired catch-light specular)

- **Phase:** IMPL — spec authored in DEV, awaits auth · **Class:** SHIP-in-H (the surface swap; a NAMED isomorphic delta) + glass-ui-HANDOFF (the seam) · **Scope:** the panel `<Card surface>` props (→ `cartoon`), the manual `.glass-card` plate (deleted), a new `useSpecularPointer` composable (for retained glass), the duplicate demo `.scale-on-hover` (deleted) · **DAG-deps:** sequenced after H.W0+H.W1 (the surface swap's source surface is FSM-orthogonal, but the live crashes + route storm poison the visual measurement — the hover-screenshot lock needs a stable scene); independent of H.W3's layout grid (they compose cleanly); MUST NOT re-introduce an occlusion (inv δ).
- **§Provenance (the folded lanes):** `a-cartoon-shadow`, `a-design-language` A1/A2/A7, `a-glow-artifact`, `a-glass-ui-consumption` D2/D14, `a-glassmorphism-perf` G2. Synthesis home: `_SYNTHESIS-design-language §0/§2.2`, `_SYNTHESIS-gap-scorecard §1.1/§2.2/§3 H.W2` (`:132-135`).
- **§The state, verified (file:line / live anchors):** glass-ui's `glass-specular-track::before` (mouse-tracked radial, .55 white core, `screen` blend, .35→.6 hover) ships on every `<Card surface="glass">` default; live 13 hosts, **0 pointer-wired** → a static centered bloom; `surface=` props in the demo = 0 (grep — all Cards default glass+specular); `cartoon-surface` on EXACTLY 1 site (`CSSCodeEditor.vue:6`). glass-ui ships the FULL cartoon family (`cards.css:33-48` `@utility cartoon-surface`, `tokens.css:543-549` `--shadow-cartoon-{sm,md,lg}`). The D2 candidate in the demo's `design-idioms.css:263-269` is the benign `.progress-dot` playing-ring — a RED HERRING all 7 lanes dismiss (`_SYNTHESIS-design-language §0`).
- **§Goal:** the radial dies at SOURCE, the cartoon offset-stamp + spring hover-lift becomes the panel depth/hover idiom, the manual plate is deleted, and any retained glass wires its catch-light.
- **§Scope:** **S1** — panel Cards flip to `surface="cartoon"` (WHAT: ONE prop; WHY: it simultaneously DROPS `glass-specular-track` at its source — `CardFooter:37` gates the class on `surface==="glass"` — and APPLIES `.cartoon-surface`; net-deletion, pure glass-ui consumption). **S2** — delete the now-redundant manual `.glass-card` plate (WHY: no legacy beside its replacement — it dies WITH the swap). **S3** — where `surface="glass"` is DELIBERATELY kept, wire the pointer seam (`useSpecularPointer` writing `--mouse-x/--mouse-y`) (WHY: D14's refined-specular-where-kept — a deliberately retained glass MUST wire the seam). **S4** — delete the duplicate demo `.scale-on-hover` (WHY: glass-ui owns the `@utility`).
- **§Hard gate — `proof:cartoon-is-panel-depth` + `proof:no-orphan-specular` (BORN-RED TODAY):** ≥4 panel Cards resolve `box-shadow: var(--shadow-cartoon-md)` at rest (RED: 0 today — all glass); ZERO `.glass-specular-track` on panels OR (if retained) a `--mouse-x` writer present (RED: 13 orphan tracks today); a hover-screenshot lock = an offset cartoon stamp, NOT a centered radial bloom. **BITE:** revert a panel to `surface="glass"` with no pointer wire → `proof:no-orphan-specular` reds (an orphan track returns); neutralize the radial with `display:none` instead of the surface swap → `proof:cartoon-is-panel-depth` reds (no cartoon shadow resolves).
- **§Folds:** `a-cartoon-shadow` (S1-S2, the gestalt move), `a-glow-artifact` (S3 — the `useSpecularPointer` seam F3), `a-design-language` A1/A2/A7 (the paper-and-glass restoration), `a-glass-ui-consumption` D2/D14, `a-glassmorphism-perf` G2.
- **§Design decisions RESOLVED:** **(1)** the CARTOON DEPTH MECHANISM is adjudicated `surface="cartoon"`, NOT a `.shadow-cartoon-*` class or a demo neutralizer (`_SYNTHESIS-gap-scorecard §2.2` — net-deletion, no new CSS, the radial dies because the surface map stops emitting the class, not via `!important`/`display:none`; the class/neutralizer are fallbacks only if the Card API forced glass+specular coupling, which it does not). **(2)** glass-ui-HANDOFF: the Card should wire-or-omit its specular seam + ship a calmer default intensity (rest ≤0.25, radius ≤40%) — AUDITED, never patched in kf (§4).

---

## H.W3 — THE CONTROLS-COLUMN LAYOUT (one-column · ribbon-width · the `rail·stage·rail` grid)

- **Phase:** IMPL — spec authored in DEV, awaits auth · **Class:** SHIP-in-H (the structural transposition) · **Scope:** `AnimationControlsControls.vue:4/6/9/294` (the 3-track grid + subgrid chain), `ControlsPaneWrapper.vue:206`, `AnimationControls.vue:4` (the 768px cap), the `--controls-pane-width` token (→ `--rail-width`), the expanded timeline · **DAG-deps:** depends on H.W1 (the FSM is the substrate the layout sits on, and the autonomous route storm makes width/layout measurement flaky — the layout gates settle-gate on the FSM resting; `a-timeline-width §4`, `a-demo-architecture` F4); shares the `--rail-width` token with H.W7 (mobile).
- **§Provenance (the folded lanes):** `a-controls-sidebar` D1, `a-timeline-width` D4, `a-demo-architecture` F1/F2/F4. Synthesis home: `_SYNTHESIS-frontend-mobile`, `_SYNTHESIS-gap-scorecard §1.1/§3 H.W3` (`:137-140`).
- **§The state, verified (file:line / live anchors):** `AnimationControlsControls.vue:4` `grid-cols-[auto_1fr]` + `:6,9,294` subgrid; live `grid-template-columns: 212px 466px` (two real cols, lopsided); the timeline ribbon is a THIRD width regime — live 1272px vs `--controls-pane-width` 400px vs an `AnimationControls.vue:4 lg:max-w-screen-md` 768px cap; `ControlsPaneWrapper.vue:206` `min-width` is a floor, not a cap; the token is decorative (`_SYNTHESIS-gap-scorecard §1.1 controls-layout/timeline-width`).
- **§Goal:** ONE named `[rail] var(--rail-width) [stage] 1fr` grid; one `--rail-width` width authority; a single-column stacked-field sidebar; the timeline aligned to the rail track.
- **§Scope:** **S1** — collapse the vestigial 3-track grid + the `col-end-4` stage hack to the named `rail·stage·rail` grid (WHAT: the demo-shell grid; WHY: the structural transposition that makes D1/D4/D10 cohesive). **S2** — `--rail-width` single-sources the sidebar, the expanded timeline, AND the mobile sheet, replacing `--controls-pane-width` + the 768px cap + `col-span-full` (WHAT: the single width authority; WHY: three width regimes collapse to one). **S3** — the sidebar becomes a single-column stacked `LabeledField` flow (delete `grid-cols-[auto_1fr]` + subgrid + `col-span-2`; WHY: D1 — one column, not two lopsided tracks). **S4** — the expanded timeline aligns to the rail track (WHY: D4 — ribbon width === sidebar width).
- **§Hard gate — `proof:single-column-pack` + `proof:timeline-rail-width` + `proof:demo-shell-grid` (BORN-RED TODAY):** all field rows share one left-edge `x` (RED: today `{76,300}` — two edges); ribbon width === sidebar width === `--rail-width` (±2px) (RED: 1272 vs 400 vs 768 today); a grep-gate — zero `grid-cols-[auto_1fr]`/`grid-cols-[subgrid]`/`col-span-2`/`col-end-4`/`--controls-pane-width` survive. **BITE:** re-introduce the subgrid chain → the grep-gate reds; revert the timeline to full-bleed → `proof:timeline-rail-width` reds (the widths diverge).
- **§Folds:** `a-controls-sidebar` D1 (S1/S3), `a-timeline-width` D4 (S2/S4), `a-demo-architecture` F1/F2/F4.
- **§Design decisions RESOLVED:** `--rail-width` is the single width authority replacing the decorative `--controls-pane-width` + the 768px cap (no token beside its replacement); the grid is named (`rail`/`stage`) so H.W7 can re-parameterize the SAME grid for mobile — the layout is authored ONCE.

---

## H.W4 — THE EASING EDITOR + HERO φ-TYPOGRAPHY (the visual-fidelity rungs)

- **Phase:** IMPL — spec authored in DEV, awaits auth · **Class:** SHIP-in-H (canvas ceiling + 1 named-delta mega bump + 1 NEW idiom) · RECORD (the ladder mechanism SOTA) · **Scope:** `EasingCurveCanvas.vue:269-273`, `TimingFunctionPanel.vue:17-19`, the hero `text-display-4` class, the 2 residual raw rungs (L1/L2), a new `icon-*` `@utility` in `design-idioms.css` · **DAG-deps:** independent (runs in parallel after H.W0).
- **§Provenance (the folded lanes):** `a-easing-editor` D3, `a-hero-typography` D7, `a-design-language §2/§3`, `a-styling-idioms §1/§5/§6`. Synthesis home: `_SYNTHESIS-design-language §2`, `_SYNTHESIS-gap-scorecard §1.1/§3 H.W4` (`:142-145`).
- **§The state, verified (file:line / live anchors):** live 680×680px canvas (77% of an 883px panel); `EasingCurveCanvas.vue:269-273` `aspect-ratio:1` off an uncapped width, no container context; `TimingFunctionPanel.vue:17-19` `text-heading` header + `gap-0` flush border. The hero is `text-display-4` = 86.1px live, a MID φ rung; glass-ui ships the audacious `text-display-mega` 177px tier (`typography.css:114,121,122` `--type-display-{4,mega,hero}`) built for poster heroes; the ladder mechanism + Capsize fallback are exemplary. 61 silent no-op `icon-*` classes (icon-sm×34/icon-md×13/icon-lg×11/icon-xs×3) compute identical 24px (Lucide default), `anyIconRuleInStylesheets:false`, defined NOWHERE (`_SYNTHESIS-gap-scorecard §1.1 easing-editor/hero-typography/icon-sizing`).
- **§Goal:** the easing canvas bounded (680px → ≤280px square), the hero in the audacious tier (86→177px), and the icon-size idiom owned ONCE.
- **§Scope:** **S1** — the easing canvas gets a container context + `block-size: clamp(160px, 38cqi, 280px)` (WHAT: the container-query ceiling; WHY: modern-web Baseline-2023, no fallback owed). **S2** — `TimingFunctionPanel` header `text-heading`→`text-title`, the double-chrome collapsed, a φ-spaced gap; the EasingSidebar gains a parity header (WHY: D3 — header too small, the inner border flush). **S3** — the hero `text-display-4`→`text-display-mega` (keep `text-wrap: balance`, opt. scoped `line-height:0.92`); fold the orphaned `...` into one balanced run; sweep the 2 residual raw rungs L1/L2 (WHY: D7 — LARGER, golden). **S4** — own ONE `icon-*` idiom in `design-idioms.css` (`@utility icon-* { @apply size-N }`) (WHY: 61 silent no-op classes resolve to a real definition).
- **§Hard gate — `proof:easing-canvas-bounded` + `proof:hero-rung` + `proof:phi-leaf-zero` + `proof:icon-idiom` (BORN-RED TODAY):** canvas `block-size ≤ 280` AND square (RED: 680px today); hero `font-size ≥ --type-display-mega` AND a φ `text-display-*` class (RED: 86px today); `proof:phi-leaf-zero` (the φ-hero chronic CH-2/M1 SYSTEM-property gate the H.W8 meta-gate cites) — BOTH the hero rung AND 0 raw `text-*` rungs across the demo (RED: 86px hero + 37 raw rungs today); every `icon-(xs|sm|md|lg)` reference resolves to a real definition (RED: 61 no-ops today). **BITE:** revert the canvas clamp → `proof:easing-canvas-bounded` reds (>280px); revert the hero class → `proof:hero-rung`/`proof:phi-leaf-zero` red; re-introduce a raw `text-*` rung → `proof:phi-leaf-zero` reds (the M1-escape lock — the issue cannot close while raw rungs linger); delete the `icon-*` `@utility` → `proof:icon-idiom` reds (the references go no-op again).
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

## H.W8 — THE GATE-REGIME UPGRADE (close the blind spots; the LAST re-paper; CLOSES the DAG)

- **Phase:** IMPL — spec authored in DEV, awaits auth · **Class:** SHIP-in-H (the appearance + interaction axes + the manifest + the chronic meta-gate) · **Scope:** `demo-driver.mjs:40-59` (the drifted SCENES manifest), a new `proof:visual-lock` pixel baseline, the chronic-closure meta-gate, the dock-lag glass-ui-HANDOFF + its born-RED `proof:dock-live` · **DAG-deps:** ALL of H.W0-H.W7 (the gate locks the LANDED appearance/interaction; the chronic meta-gate audits the closures).
- **§Provenance (the folded lanes):** `a-gate-blindspots` (the master deficit map), `a-deferred-chronic §3` (the chronic-closure discipline), `a-changes-vs-plan`, `a-precept-sweep`, plus the dock-lag handoff (`a-historical-dock`, `a-perf-dock-lag`, `a-glassmorphism-perf` G4). Synthesis home: `_SYNTHESIS-dock-perf-modes`, `_SYNTHESIS-deferred-ledger`, `_SYNTHESIS-gap-scorecard §0/§3 H.W8/§4` (`:162-165`).
- **§The state, verified (file:line / live anchors):** the A→G gate lattice locks SOURCE-SHAPE + NOT-BLANK; it has NO appearance axis, NO interaction axis, and a drifted SCENES manifest (`demo-driver.mjs:40-59` knows 6, the demo ships 9 — sequence/motion-path/starting-style NEVER gate-visited). Four user-visible chronics (D2/D7/D10/D5) "exited" the A→G ledger by RE-CLASSIFICATION (M1/M2/M3), not by being SOLVED — the P-invariant policed the COLUMN, not the PRODUCT (`a-deferred-chronic §2-3`). The dock LAG: installed glass-ui 3.4.0 ships the pre-AW.W2 `--spring-dock` (live `0.10932…` = +18.5% bouncy register); the AW.W2 retune is in glass-ui `53c1b07` UNPUBLISHED (`_SYNTHESIS-gap-scorecard §1.1 dock LAG / §4`).
- **§Goal:** the gate regime gains an appearance axis, an interaction axis, a re-sourced manifest, and the chronic-closure meta-gate — so this is the LAST tranche the four chronics can be re-papered; the dock lag is a HANDOFF paired with a born-RED gate.
- **§Scope:** **S1 (I-1)** — re-source the `SCENES` manifest from `scenes.ts` (WHAT: the manifest sync; WHY: 3 of 9 scenes are never gate-visited — adding a scene without a manifest entry must red). **S2 (I-2)** — a `proof:visual-lock` pixel baseline (named-region diff) (WHAT: the appearance axis; WHY: the single broadest lever — converts D1/D3/D4/D6/D7/D10 appearance defects into one re-runnable diff). **S3 (I-3)** — the chronic-closure meta-gate: a chronic exits ONLY with a SYSTEM-property gate OR a HANDOFF paired with a born-RED kf gate (WHAT: the meta-gate; WHY: a bare HANDOFF tag with no born-RED gate must red the ledger). **S4** — the dock-lag glass-ui-HANDOFF (release `53c1b07` ≥3.4.1 then kf bumps; NO kf fork) PAIRED with a born-RED `proof:dock-live`/`proof:dock-morph-settled` (≤6% overshoot, ≤200ms); the demo `collapse-delay` 2500→~1000 is MEASURE-FIRST (WHY: D5 — the chronic exits via HANDOFF + born-RED gate, the discipline of S3). **S5** — the φ-hero size floor, motion-liveness, scene-parity, mobile-architecture gate extensions (folded into H.W4/H.W6/H.W5/H.W7's gates, audited complete here).
- **§Hard gate — `proof:manifest-sourced` + `proof:visual-lock` + the chronic meta-gate (BORN-RED TODAY):** adding a scene to `scenes.ts` without a manifest entry reds (RED: 3 scenes drifted today); reverting any D1/D3/D4/D6/D7 trips the region diff; a bare HANDOFF tag with no born-RED gate reds the ledger; `proof:dock-morph-settled` is born-RED (the pre-AW.W2 spring overshoots +18.5% today). **BITE:** add a scene to `scenes.ts` and skip the manifest → `proof:manifest-sourced` reds; revert the hero mega rung → `proof:visual-lock` reds at the hero region; tag the dock HANDOFF with no born-RED gate → the chronic meta-gate reds.
- **§Folds:** `a-gate-blindspots` (S1/S2/S5), `a-deferred-chronic §3` (S3), `a-changes-vs-plan` (S3 — the gate-genus root-cause), `a-precept-sweep` (S5), the dock-lag handoff (S4 — `a-historical-dock`/`a-perf-dock-lag`/`a-glassmorphism-perf` G4).
- **§Design decisions RESOLVED:** the dock lag is a HANDOFF (glass-ui owns `--spring-dock`; NO kf fork — inv-16) PAIRED with a born-RED kf gate (the chronic-closure discipline); the demo `collapse-delay` tune is MEASURE-FIRST; the chronic-closure meta-gate is the P-invariant repaired to police the PRODUCT, not the column (the H-born meta-invariant).

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
                                      │ (all visual/mobile landed)
       ┌───────────────────────────────▼──────────────────────────────────────┐
       │  H.W8 — THE GATE-REGIME UPGRADE (CLOSES; depends on ALL W0-W7)        │
       │  proof:visual-lock (appearance) + interaction axis + manifest re-     │
       │  source + the chronic-closure meta-gate + the dock-lag HANDOFF        │
       │  paired with born-RED proof:dock-morph-settled                        │
       └───────────────────────────────────────────────────────────────────────┘
```

**Critical path:** `H.W0 → H.W1 → {visual/mobile waves} → H.W8`. H.W0 (crashes) and H.W1
(state machine) are the two PREREQUISITES — five lanes name D12 as a blocker and the live
crashes poison every clean measurement (`_SYNTHESIS-gap-scorecard §3`). **Parallelizable:**
H.W2 (design language), H.W3 (layout), H.W4 (easing/hero), H.W5 (icons/modes), and H.W6
(typing-dots) share no source surface and run concurrently once H.W0+H.W1 land — except
H.W5 rides H.W1 (the SceneDescriptor is FSM-projected) and H.W6 rides H.W0's H-A2 guard.
**Cross-wave coupling:** H.W7 (mobile) re-parameterizes the SAME `--rail-width`
`rail·stage·rail` grid H.W3 authors (the layout is written ONCE), so H.W7 depends on H.W3.
**H.W8 closes** — it locks the LANDED appearance (the `proof:visual-lock` baseline) +
interaction + manifest of all of H.W0-H.W7 and installs the chronic-closure meta-gate, so
it depends on every prior wave. **inv δ** (no dock occlusion) is a standing constraint on
H.W2 and H.W7 (the mobile overlay + the surface swap must not re-introduce an occlusion).

---

## § The cross-repo HAND-OFFs (tagged, NOT patched in kf — inv-16)

This is the inv-16 band: kf consumes glass-ui/value.js/parse-that PUBLISHED, and every
sibling item is AUDITED as its own surface and HANDOFF-tagged + sequenced. **The
chronic-closure discipline (H.W8) binds here:** each HANDOFF is PAIRED with a born-RED kf
gate so the chronic exits via (b) — a HANDOFF tag is never a bare column-migration
(`_SYNTHESIS-gap-scorecard §0/§4`).

| Item | Owner | Anchor | Disposition (PAIRED born-RED gate) |
|---|---|---|---|
| **Dock LAG** (D5-b) — the pre-AW.W2 `--spring-dock` | glass-ui (AW tranche, ACTIVE) | live `--spring-dock: 0.10932…`; the retune is in unpublished `53c1b07` | **glass-ui-HANDOFF** — release `53c1b07` (≥3.4.1) then kf bumps; `proof:dock-morph-settled` (≤6% overshoot, ≤200ms) BORN-RED (the chronic exits via HANDOFF + born-RED gate, H.W8) |
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
the typing-dots dogfood primitive (H.W6), the mobile overlay + springy drawer (H.W7), and
the gate-regime upgrade (H.W8). The GAP column is exactly: TWO crashes, ONE FSM, the
design-language restoration, the layout transposition, the easing/hero rungs, the
icons/modes finish, the typing-dots, the mobile overlay, and the gate-regime upgrade.

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
primitive (H.W6). The cross-repo dock lag, Card-specular seam, and value.js/parse-that
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
not asserted: the two live crashes (`format.ts:24` ← `KeyframesStringControls.vue:46`;
`engine.ts:516,576` — `_SYNTHESIS-gap-scorecard §1.1`), the 5-authority route storm + the
`isStableFire` heuristic (`useSceneGroupSync.ts:54`), the double-wrapped popover trigger
(`App.vue:18-21`, live `finalOpen:false`), the 13 specular hosts 0-pointer-wired + the
single `cartoon-surface` site (`CSSCodeEditor.vue:6`), the lopsided two-column controls
(live `grid-template-columns: 212px 466px`) + the three width regimes (1272/400/768), the
86.1px hero rung + the 61 no-op `icon-*` classes, the 4 modes wearing `<Home>`
(`ChromeDock.vue:25-30`), the single-span `split(/\s+/)` (`AnimatedText.vue:62`), the
30px-crushed mobile stage, and the drifted SCENES manifest (`demo-driver.mjs:40-59` knows
6, the demo ships 9). The band→wave map proposes 9 waves (`H.W0..H.W8`) ordered by the
crash+FSM-prerequisite DAG; each carries a falsifiable `proof:*` gate that BITES (born-RED
today, GREEN on fix), and the four chronics each exit via a SYSTEM-property gate or a
HANDOFF-paired born-RED gate (the chronic-closure meta-invariant). inv-16 HOLDS for H (kf
consumes glass-ui/value.js/parse-that PUBLISHED; the dock/specular/value.js/parse-that
items are AUDITED + HANDOFF-tagged, never authored or patched in kf). **H.W0..H.W8
IMPLEMENTATION awaits explicit authorization — this is the canonical charter, authored in
TRANCHE DEVELOPMENT.**
