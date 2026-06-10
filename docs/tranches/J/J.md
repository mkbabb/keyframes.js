# Tranche J — keyframes.js: the BOUNDARY-integrity tranche · the gate-ORACLE precept extended to every boundary the product crosses (deploy · publish · docs · the human axes · the design language) · the latent defect classes closed · the estate industrialized to net-deletion · the riders terminated

J is keyframes.js' tenth tranche. I (the ninth) ended the gate-blindspot at the product
surface: it recovered nine live breakages behind ACTUATING runtime gates, installed
`proof:live-session` (the gate-of-gates), and made "green" mean *a human using the product
sees it work*. **The J audit — 32 systemic lanes + 14 design lanes, 46 evidence docs under
`audit/`, every claim tree-verified — finds that I's close HOLDS at the surface it certified
and that the SAME blindspot shape survives at every boundary BEYOND that surface:**

- **The deploy boundary.** The build a human gets is the build that was certified — but only
  because the I close deployed it BY HAND. The auto-deploy chain is armed and gated on
  `proof:scene-control-dfa`, a fixed-`settleMs` gate the I close itself recorded as
  timing-flaky and STILL OPEN; ~60 demo-smoke gates after it have NEVER executed on Linux;
  CI itself had been YAML-invalid since H (discovered only POST-close — the I FINAL's
  "merge → green CI → CF auto-deploys" was structurally impossible when written). A future
  master push can silently not deploy — the same silent-no-deploy class that froze the site.
  (`audit/wave-I.WZ-postclose.md §D`, `audit/ci-linux-open-item.md`, `audit/final-vs-tree-inv-epsilon.md` INVE-1.)
- **The publish boundary.** npm publishes `4.1.0` — which is also the tree version — while
  `src/animation/index.ts` ships a GSAP/Motion-One-class **orchestration tier of 16 public
  exports** (`SpringProgress`, `springLinearStops`, `springTimingFunction`, `RAFPlayback`,
  `stagger`, `flip`/`flipShared`, `drag`/`Draggable`, `decay`/`decayRest`, `Sequence`,
  `animate`, motion-path, draw-svg) accreted across E→I and **never published**. Two pending
  changesets both say `patch` — papering a tranche-spanning new public surface. The README
  teaches 4 of ~13 primitives; `decay.ts` is the one public module with no test.
  (`audit/scope-adversary.md §0-§1`, `audit/build-packaging-release.md`.)
- **The docs boundary.** The repo's own front door lies: root `CLAUDE.md` documents the
  DELETED `src/parsing|units|easing|math|utils` barrel architecture, four ghost demo
  directories, "15 test files / 261 tests" (the tree has 69+ files / ~685), a 10-module
  animation tree (28 exist). Stale docs are legacy code; the no-legacy precept applies.
  (`audit/legacy-sweep.md` LS-1..8, `audit/parsing-units-valuejs-seam.md` SEAM-0.)
- **The axes boundary.** `proof:live-session` is **desktop-1440-only**: mobile viewport,
  touch, `prefers-reduced-motion`, dark mode, keyboard/focus, and the playground/uncovered
  scene legs are all un-exercised; `proof:lighthouse-mobile` is in NEITHER tier (an orphan);
  the CH-3 "mobile" chronic is certified by desktop mouse gates. The exact I lesson — *the
  un-exercised axis is where the next lie lives* — re-seeded one viewport-width over.
  (`audit/final-vs-tree-inv-epsilon.md` INVE-2.)
- **The design boundary (the user's J directive).** The design audit (48 screenshots — 8
  scenes × 3 viewports × 2 panel states — read by 14 lanes) finds the design language
  PRESENT but CONCENTRATED: the audacious Instrument Serif display voice appears at exactly
  ONE moment (the home hero) and no scene echoes it; the subject palette has collapsed to a
  single green while the icon family sings a six-colour rainbow; the animation SUBJECT — the
  protagonist — is undersized or unplated on most stages; the storyboard register forks into
  three control-placement grammars with a hollow 400px ghost rail; the amiga stage is a
  hard-edged gray slab among rounded glass plates; on mobile the hero TYPE and the SUBJECT
  collide. glass-ui ships primitives kf hand-rolls (MetricBadge, SegmentedTabs, ToggleChip,
  ScrubberTimeline, FourierField, the display poster rungs) — consume-to-delete; and kf has
  authored genuinely general primitives (the curve-editor/control-point grammar, the
  rail/ball idiom, the status-badge tone recipe) that belong in glass-ui — abstract-by-handoff.
  (`audit/design/*.md` — 14 docs.)

Underneath the boundaries, the audit surfaced **latent defect classes at the seams I
repaired** — the I.W0 serialize-from-template transposition applied at ONE seam while the
sibling per-card serializer still rides the old DOM-resolving path; a latent B1-class
`templateFrames[undefined]!.transform` deref in `FrameCompiler.createFrame`; an
empty-only selector guard that still cryptic-throws on non-empty garbage; the LOAD-BEARING
value.js empty-input contract with NO kf-side pin test; two drag surfaces still bypassing
the shared seam — **and the estate debt of the regime itself**: 43 gates re-declare
`serveDist` byte-identically; `proof:all` is NOT the CI gate set; the meta-gate hardcodes
9 of 10 correctness gates; the I "collapse the lattice" thesis was not executed (the count
GREW 103→109). (`audit/engine-core.md`, `audit/parsing-units-valuejs-seam.md`,
`audit/wave-I.W4.md`, `audit/gate-census.md`, `audit/precepts.md`.)

**J's correction is one move applied everywhere: extend the gate-ORACLE precept to every
boundary.** What auto-DEPLOYS is what was certified. What `npm i` INSTALLS is what the
source declares and the README teaches. What the DOCS claim is what the tree holds. What is
CERTIFIED covers the surfaces humans actually use. What the human SEES carries the design
language everywhere, not at one doorway. And the regime that enforces all of this is
industrialized to net-deletion, with every ≥4-tranche rider terminated — probe or KILL,
nothing rides a fifth time.

---

## § Phase — TRANCHE DEVELOPMENT (the audit + these docs; implementation awaits authorization)

J is in DEVELOPMENT now, on branch `tranche-j-dev` (forked off `master` @ `4072af9` — the
I-close tip + the adopted post-close tail; clean tree; kf `4.1.0`-base; value.js `^0.11.2`,
glass-ui `~3.9.0`, parse-that consumed PUBLISHED). The deep audit is RUN — the evidence is
on disk under `docs/tranches/J/audit/`:

- **32 systemic lanes** — per-wave plan-vs-delivery audits of I.W0–I.W7 (`wave-I.W*.md`),
  the post-close tail (`wave-I.WZ-postclose.md`), the inv-ε re-check of I's own FINAL
  (`final-vs-tree-inv-epsilon.md`), the current-state audits (engine core/periphery, the
  parsing/value.js seam, demo scenes/shared, styling, the gate census, CI/CD, tests/bench,
  build/packaging), the A→I lineage recaps (`recap-*.md`), the consolidated precept register
  (`precepts.md`), THE consolidated deferred/chronic ledger (`deferred-ledger.md`), the
  CI-on-Linux cure spec (`ci-linux-open-item.md`), the no-legacy sweep (`legacy-sweep.md`),
  the constellation edges, the perf frontier, and an independent scope adversary.
- **14 design lanes** — under `audit/design/`: 8 per-pane audits over the 48-screenshot
  corpus (`screenshots/`, captured by the checked-in `scripts/capture.mjs`, zero console
  errors), plus the cross-cutting hierarchy synthesis, typography, color-pops/icons,
  grid/math, glass-ui adoption, and glass-ui abstraction-gap lanes.

This charter (`J.md`), the per-wave specs (`waves/J.W*.md`), `PATH-FORWARD.md`,
`PROGRESS.md` (the board + the J open-deferrals ledger), and the glass-ui handoff doc are
the DEVELOPMENT deliverables. **J.W0–J.WZ are authored-now-run-later wave specs; the
implementation phase opens only on explicit user authorization, gated on keyframes' own
green CI — exactly the D/E/F/G/H/I dev/impl boundary.** No engine, demo, library, gate,
test, or CI source is written in development. **This is TRANCHE DEVELOPMENT — docs ONLY.**

---

## § The MANDATE (binding — every wave, every gate, every fold · the spine)

The user's verbatim-intent for Tranche J (2026-06-09/10), carried into every wave:

> DEEPLY audit (32 agents in parallel) our original plan and waves thereof, alongside all
> changes made herein. Devise a path forward: audit the hitherto made changes and the
> remaining plan; recapitulate our original prompts, plans, and precepts: NO quick
> solutions, NO workarounds: idiomatic, gestalt approaches. This is a development product,
> architectural transpositions in the sake of elegance, simplicity, and performance above
> all are both necessary and desirable. NO legacy code. Delineate any chronically deferred
> items and fold them into this new tranche. Delineate any deferred items and fold them
> into this tranche. Recap ALL of our prompts and requests hitherto and ensure they've
> been addressed. This is NOT an implementation phase. Tranche development only.

And the design directive (same session):

> Run a frontend design audit of our ui, easing ui — all UI panes. How might we better
> structure and suffuse proper design hierarchy of elements? Check for any obvious visual
> incongruences. Look for areas wherein we might better suffuse our design language of
> glass, grid, math, large and audacious typography, with colorful audacious pops, like
> those found in our icons (how might we increase this, too? within a sense of proportion),
> and our animation targets. What glass-ui idioms might we adopt — what glass-ui items, if
> totally befitting, might we smoothen, refine, hone, and abstract out — or just generally
> refine within an extant component — within glass-ui. Look for gaps.

The precept spine, BINDING on every J wave, every gate, and every cross-repo handoff:

- **NO quick solutions, NO workarounds** — idiomatic, gestalt approaches only. (Specifically
  forbidden for J: the scene-control-dfa flake dies because the gate waits on the
  PER-EXPECTED destination state AND the control-surface projection is made born-correct
  from the DFA — **NOT** a longer `settleMs`, **NOT** a `continue-on-error`, **NOT** an
  `IN_CI` escape on a correctness gate; the publish gap closes with the HONEST minor and
  the real documented surface — **NOT** a rubber-stamp patch; the subject-palette drift
  dies at the `.progress-ball` PARAMETERIZATION seam (`--ball-tone`) — **NOT** eight
  per-scene CSS overrides; the doc-rot dies by REWRITING the docs to the tree — **NOT**
  annotating the lies.)
- **NO legacy beside its replacement** — a replaced surface is replaced in ONE motion. The
  43 `serveDist` copies die WITH the lib consolidation; the stale gate names/comments and
  the phantom `proof:no-route-storm` references die WITH the estate wave; stale docs are
  legacy and die with the rewrite; `proof:repin-safe` (stale-by-construction) is KILLED,
  not kept.
- **Architectural transpositions for ELEGANCE, SIMPLICITY, PERFORMANCE** — the lib
  harness (`withPage`/`withBrowser`), the `navToScene` per-expected-state primitive, the
  `--ball-tone` tone seam, the serializer unification, the Three.js named-import
  tree-shake are all transpositions at the right seam, measure-first where perf-claimed.
- **MEASURE-FIRST** — every perf claim lands behind a biting bench or is recorded-withheld
  WITH the measurement; the four ≥4-tranche riders EXIT via probe-or-KILL (no fifth ride).
- **inv-16** — kf consumes glass-ui/value.js/parse-that PUBLISHED; every glass-ui item in
  the design fold is a HANDOFF to the AX session or a consume-edge of a published version,
  never a kf-side patch. **The permanent engine rule (T2 resolved, §invariants):**
  `src/animation` is the kf PRODUCT — always in scope when runtime correctness or measured
  elegance requires; the fence is against SIBLING forks only.
- **isomorphic styling** — EXCEPT the named J.W7a design deltas, which are DELIBERATE,
  enumerated, befitting appearance changes (the user's design directive); each is named in
  the wave spec and re-baselined in the same motion. (J.W7b — the consume-edge/HANDOFF half
  — owns NO appearance delta and re-captures NO baseline; it is inv-16 sibling-coordination
  only.)

**ENFORCEMENT (inv ε).** Every claim in this charter cites an audit lane doc, a
`file:line`, or a command + observed output recorded in the lanes. The close cannot
overclaim; J's FINAL is held to the same standard I's was — and the two inv-ε gaps the
audit found in I's FINAL (the deploy-mechanism claim that could not be true when written;
the breadth-of-human-surface claim) are exactly what J.W0 and J.W4 exist to make true.

---

## § The invariant set carried into J

All I-born invariants carry VERBATIM: **the gate-ORACLE precept** (a correctness gate's
oracle is the product property a human would check, exercised through the human's surface,
error budget 0 across PLAY+SWITCH+DRAG), **the structured error-budget allowlist** (one
definition, inherited), **the two-tier taxonomy** (hygiene may never substitute for a red
runtime clause), **the chronic-closure meta-invariant** (closure cites a runtime gate that
BIT; no vaporware handoffs), **inv ε**, **inv ζ** (dogfood), **inv δ** (occlusion),
**P-invariant-28** (no perpetual punts), **born-RED discipline**, **the dev/impl
boundary**, **version-owner/user-domain publish**, and the standing memory rules
(glass-ui fixes in glass-ui; chrome-devtools-mcp for live debugging, headless
playwright-core for CI gates; design tokens not ad-hoc CSS).

**NEW J-born invariants:**

| inv | Statement |
|---|---|
| **the boundary-ORACLE extension** (the J headline) | The gate-ORACLE precept applies at every boundary the product crosses: the DEPLOY oracle is an observed green-CI → auto-deploy round-trip serving the certified bytes; the PUBLISH oracle is the packed tarball's surface == the source's public exports == the README's taught API (`proof:published-surface`); the DOCS oracle is every structural claim in CLAUDE.md/README verifiable against the tree; the AXES oracle is the live-session battery exercising the viewports/input-modalities/preferences humans actually use. A boundary certified by hand, by paperwork, or at one viewport is NOT certified. |
| **P6 — the CI device-independence boundary** (born in the I post-close tail, now charter law) | CI hard-gates device-INDEPENDENT correctness; device-DEPENDENT measurements (felt timing, exact pixels, host fonts) hard-gate ON-DEVICE and run OBSERVE-ONLY in CI. The posture is DECLARED per-gate through ONE shared helper (no per-script `IN_CI` re-implementation), and the taxonomy names this third state explicitly: an **on-device** annotation on a correctness gate means its CI run is observational — "proof:correctness GREEN in CI" must never be over-read as the felt budget holding in CI. |
| **the net-deletion rule for the estate** (T1 resolved) | Gate work may not grow the estate: any wave touching `scripts/` must leave gate COUNT and estate LoC equal-or-lower, with consolidation (the shared lib) as the mechanism. The I "collapse" claim is reckoned honestly: I ADDED the session gate and relabeled the lattice — J completes the collapse it claimed. |

**The five precept tensions — RESOLVED here, not inherited** (`audit/precepts.md §3`):

- **T1 (KISS vs the gate corpus):** resolved by the net-deletion rule above + J.W3.
- **T2 (inv-16 vs the engine):** resolved by the permanent engine rule in the MANDATE —
  the I un-fencing was not an exception but the discovery of the correct permanent boundary.
- **T3 (the surviving proxies):** hygiene gates are legitimate strictly as CORROBORATION.
  The two named survivors are re-scoped honestly in J.W3: `proof:scene-machine-irrefragable`
  is re-labeled a reducer-algebra unit oracle (its localStorage round-trip polices the pure
  reducer, which IS its competence); `proof:visual-lock` is re-labeled an appearance-drift
  tripwire whose self-baseline is acknowledged in its own header (and re-captured at J.W7a,
  the appearance-grammar half — J.W7b changes no kf appearance and re-captures nothing).
- **T4 (meta-gate one-directionality):** `proof:gate-is-runtime` derives its roster FROM
  the `proof:correctness` membership (J.W3) — a new correctness gate can never escape the
  precept-enforcer again.
- **T5 (props-destructuring vs Vue 3.5):** the rule NARROWS to its true kernel — a
  destructured prop passed INTO a composable loses reactivity; THAT is gated. Template/
  watchEffect destructure is platform-idiomatic post-Vue-3.5 and is no longer policed. The
  memory file is updated at J close (user-visible memory change, flagged at WZ).

---

## § Thesis — J is the tranche that makes every boundary tell the truth

I bound the gate oracle to the running product and proved the product at one desktop
viewport, then shipped it by hand. **Each boundary between that certified product and a
human still ran on trust:** the deploy chain on a flaky gate that has never been green
end-to-end on Linux; the npm surface on a version two architectural eras stale; the docs on
a tree that no longer exists; the certification on one viewport, one input modality, one
motion preference, one color scheme; the design language on one doorway moment. The J
correction is not nine new gates — it is the SAME oracle discipline, pointed outward, plus
the completion of what I started inward: the latent seam defects closed, the estate
collapsed to the lib it already half-owns, the riders terminated, and the design language
suffused from the doorway through every pane — **so that "green" comes to mean: a human
anywhere — on the live site, from `npm i`, in the README, on a phone, with motion reduced,
in the dark — sees the same true, beautiful, working product.**

---

## § The finding-cluster → wave ledger (the design input)

Severity counts from the structured fleet returns: **17 P0 · 120 P1 (82 systemic + 38
design) · 95 must-fold candidates · 64 glass-ui ledger items.** Full tables live in the
lane docs; the clusters:

| Cluster | The decisive findings | Wave |
|---|---|---|
| **Deploy integrity** | scene-control-dfa: a LIVE product lag (the dock trigger TEXT lags the destination scene's mount — the control-surface projection is not born-correct from the DFA) + a flaky fixed-`settleMs=1600` gate with ZERO CI escape, hard-gating `demo-smoke` → `ci` → `deploy-pages.yml`; the reverted escape-hatch waited on the SOURCE scene's stale trigger (structural no-op); `proof:scene-transition-perf` carries the IDENTICAL race; `demo-driver.mjs` has NO scene-nav primitive (every gate copy-pastes `navByHash`); ~60 demo-smoke gates NEVER run on Linux; the deploy-gating gates are in NEITHER taxonomy tier; GH repo secrets unverified; the 8-commit post-close tail has no tranche home; one clean auto-deploy round-trip never observed (CI-1..6, WZ-1..7, CICD-1..7, SCOPE-2/7) | **J.W0** |
| **Engine totality** | ENG-1 the sibling per-card serializer (`CSSKeyframesToStrings`/`CSSKeyframeToString`) still on the pre-transposition DOM-resolved path, live-consumed by the editor; ENG-2 latent `templateFrames[undefined]!.transform` deref in `createFrame`; SEAM-1 the selector guard catches only `trim()===""` — non-empty garbage still cryptic-throws; SEAM-2 the LOAD-BEARING value.js empty-input contract has no kf-side pin; SEAM-4 `transform: rotate()` shorthand round-trip vacuous; TB-1/2/3 the I engine fixes have NO unit tests (browser-gate-only — the pyramid inverted); decay.ts untested; W0-5 gate clause (e) unimplemented | **J.W1** |
| **Demo seam completion** | W4-3/W4-4 EasingCurveCanvas + PlaybackRibbon still bypass the shared drag seam (the B6 latent class is NOT zero); DS-1 CubeScene writes `storedControls.selectedControl` directly, bypassing the I.W2 single authority; S4-stretch (single-surface scenes mount flat; the selectedControl half-migration completed) spec'd, never landed, no terminal home; M2 the mobile sheet re-open scroll latch (CSS `transitionend` never fires on the spring-driven sheet); CD-1 the D FINAL OVERCLAIMED `AnimationMenuBar→TransportDock` as closed (inv-ε violation — the rename never happened); DS-2 spring writes 17 reactive refs/frame; `useRafLoop` on `onUnmounted` not `onScopeDispose` | **J.W2** |
| **Estate industrialization** | GC-1 43×`serveDist`/51×MIME/54×chromium duplication (~2 kLoC; the lib at 7 importers); GC-2/BP-4 `proof:all` ≠ CI (3 gates in CI, no aggregator); GC-3 the meta-gate hardcodes 9/10; GC-4 demo-fonts is load-rest in the correctness tier (+ W7-3 exempted from the meta-gate); GC-5 `proof:repin-safe` stale-by-construction → KILL; BP-5/6 `proof:deps-current` floors allow the B1-regression value.js + pre-B7 glass-ui; W7-2 the named-benign exclusions applied globally not leg-scoped; W7-1 the B2 dev-server leg note-skips under `KF_REQUIRE_BROWSER`; WZ-5/CICD-3 the `IN_CI` triplication; CICD-4/5 ci-coverage blind to raw `node scripts/` gates + the version-literal clause vacuous; W7-5/GH-3 stale retired-gate names + phantom `no-route-storm` refs; PRE-1 the un-executed collapse | **J.W3** |
| **The axes** | FVT-2/INVE-2 live-session desktop-1440-only (mobile/touch/reduced-motion/dark/keyboard all zero-hit; the SCENES sweep omits playground-class scenes); lighthouse-mobile an orphan in neither tier; CH-3 mobile chronic certified by desktop oracles; EP-3 flip/drag/draw-svg exported with no demo scene and zero live-session coverage; FVT-6 CH-3/CH-4 closure rests on a gate WZ demoted to CI-observe-only (P6 posture must be explicit) | **J.W4** |
| **The published surface** | SCOPE-1 the 16-export orchestration tier unpublished (npm = tree = 4.1.0); SCOPE-3/DL-8/FVT-4 two `patch` changesets unconsumed + the patch-vs-minor decision owed; SCOPE-5 README teaches 4/~13 primitives; LS-1..8 + SEAM-0 + DS-1/2 + EP-5 + ENG-5 + TB-4 the full doc-rot band (root CLAUDE.md, src/animation/CLAUDE.md, demo/CLAUDE.md, README); BP-1 `dist/_redirects` ships in the npm tarball; ENG-6 the hand-maintained AnimationEngine interface has no drift gate; PROGRESS/FINAL supersession annotations (pointer-only); the misplaced `b2-gen-crash-easing-visibility.png` | **J.W5** |
| **Terminations (P-invariant-28)** | DL-1 the four ≥4-tranche riders — FB-2 async sync-step (probe `proof:event-ordering` or KILL), SoA `lerpArray` (bench on the real-K corpus or KILL), FB-5 intrinsic-size (verify Baseline or KILL), FB-6 `Mod+K` palette (owner or KILL); PF-1 Three.js namespace→named imports (measured, est. 100-200 KB); PF-3 Monaco static-edge re-verify; EF-3 parseLinearStops shim retirement check (`linear()` Baseline 2026-06-11); GH-6 DEP-1 CNAME confirm (OUT, deploy-owned — verify only) | **J.W6** |
| **The design suffusion** | The protagonist deficit (8 panes: undersized/unplated subjects, the controls pane winning hierarchy, the amiga thumbnail-in-a-gray-room, square's no-plate + off-center drift, mobile hero/subject collisions TYP-1/H3/A-01); the display-voice concentration (TYP-2: Instrument Serif at ONE moment; every scene name timid native sans; glass-ui's display rungs unused); the two-colour-system drift (CP-1: rainbow icons vs one-green subjects — the `--ball-tone` parameterization seam; the aquamarine literal; gray readouts; the monochrome favicon); the math-made-visible band (the easing stage's invisible curve; checkerboard non-stages; FourierField unconsumed; readouts at caption scale); the grammar unification (XH-1 the ghost rail, XH-2 the storyboard schism, XH-3 the amiga slab, XH-4 the top-center band collisions) — the APPEARANCE-GRAMMAR half → **J.W7a**; consume-to-delete (MetricBadge/AnimatedDigit, SegmentedTabs, ToggleChip, ScrubberTimeline, glass-wash, .fade-slide PRM classes, gold-shimmer dedup STY-1, the STY-2..6 token items) + the glass-ui HANDOFF ledger (25 REFINE + 21 ABSTRACT items → the AX coordination doc) — the CONSUME-EDGE half → **J.W7b** | **J.W7a ∥ J.W7b** |

---

## § The WAVE MAP

**DAG.** J.W0 LEADS (the deploy boundary is the P0 hazard; its `navToScene` primitive and
its green-Linux CI are consumed by every later wave's verification). J.W1 ∥ J.W2 ∥ J.W6
run parallel (file-disjoint: engine / demo-behavior / measurements). J.W3 follows J.W0
(consumes the primitive; owns the estate). **The design suffusion SPLITS along its natural
fault line** (`audit/scope-adversary.md`; the over-scope finding): **J.W7a** (the
APPEARANCE-GRAMMAR half — protagonist/display/colour/math/grammar, the named isomorphic
exceptions that re-capture the visual-lock baseline) follows J.W2 (shared demo files —
behavior first, then appearance) and re-captures the visual baseline in its close motion;
**J.W7b** (the CONSUME-EDGE + glass-ui HANDOFF half — consume-to-delete + the 46-item
glass-ui ledger → `glassui-AX-handoff.md`, inv-16 sibling-coordination, no kf appearance
change) is file-disjoint from W7a, gated only on AX PUBLISH, and runs PARALLEL to the
W2→W7a chain — it is NOT on J.W4's critical path. **J.W4's legs are partitioned by their
ACTUAL upstream dependency, not serialized whole:** the APPEARANCE-CERTIFICATION legs
(mobile hero/subject overlap == 0, the dark `--ball-tone` contrast, the ghost-rail-absent
assertion) are gated on **J.W7a** + J.W3; the APPEARANCE-INDEPENDENT input-modality legs
(the touch battery, the PRM/reduced-motion snap, the keyboard actuation) gate ONLY on
J.W0 + J.W3 and land as soon as the harness does — decoupled from the W2→W7a chain. The
longest serial path is therefore W0 → W2 → W7a → W4(appearance legs), with W4's
input-modality legs running parallel to it. J.W5 is parallel to all (docs/packaging) with
its changeset cut LAST among waves. J.WZ closes.

| Wave | Title | Owns (the cluster · the decisive folds) | The REAL gate it proves itself with |
|---|---|---|---|
| **J.W0** | **THE DEPLOY BOUNDARY** (leads — P0) | Formal adoption of the I post-close tail (the 8 commits get their tranche home — this wave's spec records their terminal disposition). The `navToScene(page, sceneId, expected)` primitive lands in `scripts/lib/demo-driver.mjs`: the wait predicate is the PER-EXPECTED destination state (the destination control-tab trigger TEXT == the destination's expected label; trigger-ABSENT for panel-less scenes), ceiling-timeout, load-independent by construction — `proof:scene-control-dfa` + `proof:scene-transition-perf` migrate onto it. The PRODUCT half: the dock trigger projection is made born-correct from the DFA (the I.W2 single-authority principle extended to the dock's control-surface projection — the trigger must never render the SOURCE scene's stale label during a transition). GH repo secrets verified (`gh secret list` — names only). The never-run Linux tail triaged under P6 as it surfaces. | **One OBSERVED clean round-trip: a real master push → green CI (demo-smoke end-to-end GREEN on the Linux runner, scene-control-dfa included, zero escapes) → `deploy-pages.yml` auto-fires → the live site serves the pushed bytes.** Born-RED witness: the gate red on the recorded CI run `27228309606` failure shape (trigger='null' under load) before the cure. |
| **J.W1** | **THE ENGINE TOTALITY PASS** | ENG-1: the per-card serializer unified onto serialize-from-template (ONE serialization authority; the sibling DOM-resolving path dies in the same motion). ENG-2: `createFrame`'s `seekPreviousValue` made total (typed error or honest fallback — never `[undefined]!`). SEAM-1: the selector guard rejects ALL non-conforming selectors with the typed `AnimationOptionError`. SEAM-2: the kf-side pin test for `parseCSSValueUnit("")` (a value.js regression reds HERE). SEAM-4: the rotate()-shorthand round-trip test de-vacuoused. The unit pyramid: serialize-from-template var() round-trip, the bind-proof contract (`const s = pb.stop; s()`), `binarySearch`, `decay`. W0-5: gate clause (e) implemented or formally re-scoped. | The new unit tests witnessed born-RED on the pre-fix tree (git-stash probe). The runtime half: `proof:engine-no-throw-on-play` extended — the EDITOR per-card pane round-trips a `var()`-bearing animation (the ENG-1 oracle is the rendered card, not the source); the garbage-selector path asserts the TYPED error name in the live console. |
| **J.W2** | **THE DEMO SEAM COMPLETION** | W4-3/W4-4: EasingCurveCanvas + PlaybackRibbon onto the shared drag seam (the B6 latent class to ZERO — every pointer-capture surface routes through `useDragScrub`/`useDragCapture`). DS-1 + S4-stretch: the `selectedControl` single-writer COMPLETED — the CubeScene rogue write dies, single-surface scenes mount flat (the Tabs/v-show double-gate bypassed), the DFA projection is the ONLY writer. M2: `isPanelTransitionDone` driven off the spring settle signal (the `useSheetSpring` settled event), not CSS `transitionend`. CD-1: `AnimationMenuBar → TransportDock` executed (the D overclaim terminated). DS-2: the spring scene's 17 reactive refs/frame onto the non-reactive write idiom. `useRafLoop` → `onScopeDispose`. | `proof:drag-gesture` DRAG_SURFACES extended to the two recovered surfaces (a real `page.mouse` drag over each: no text selection + the gesture lands); the mobile sheet leg: open → close → RE-OPEN on a 390×844 context scrolls to its content (the M2 oracle, runtime); the single-writer clause: a live scene sweep asserts the rendered control surface equals the DFA projection on every entry (no stale latch), with the no-writer-outside-the-DFA grep as the hygiene corroborator. |
| **J.W3** | **THE ESTATE INDUSTRIALIZED** (net-deletion) | `withPage()`/`withBrowser()` lifecycle + the shared `serveDist`/MIME/chromium/`navToScene` exports in `scripts/lib/` — the 43/51/54 copies MIGRATE (≈2 kLoC deleted; the lib becomes the single harness authority). The ONE `IN_CI` helper + per-gate DECLARED on-device posture (P6 made mechanical; the third tier named in the taxonomy doc). `proof:all` == the CI roster (the 3 CI-only gates enter the taxonomy; a `proof:ci-coverage` clause asserts the equivalence both ways). The meta-gate derives its roster from `proof:correctness` membership (T4). `proof:demo-fonts` tier-decided: gains a scene-SWITCH actuation leg (the cheap honest fix) or demotes to hygiene with live-session's font leg as the correctness owner. KILL `proof:repin-safe`. `proof:deps-current` floors advance (0.11.2 / 3.9.0). W7-2: the named-benign exclusions leg-scoped. W7-1: the B2 dev-server leg FAILS (not note-skips) under `KF_REQUIRE_BROWSER`. The stale-refs purge: retired-gate names in ci.yml comments, `proof-browser.mjs` CANDIDATE_GATES, the phantom `no-route-storm` docstrings. ci-coverage's raw-node-script + version-literal blind spots closed. T3: the two surviving proxies re-labeled honestly. | The bite-preservation oracle: a SAMPLED set of migrated gates re-witnessed born-RED on their recorded defect (the migration may not lobotomize a gate); `proof:all` == CI proven by the two-way coverage clause; gate COUNT and estate LoC measured strictly DOWN (the net-deletion rule, recorded in the wave note with the before/after numbers). |
| **J.W4** | **THE AXES BATTERY** (legs PARTITIONED by upstream dep — not serialized whole) | `proof:live-session` (or a sibling battery on the W3 harness) gains, in TWO dependency bands. **The APPEARANCE-INDEPENDENT input-modality legs (gate ONLY on J.W0 + J.W3 — land as soon as the harness does, parallel to the W2→W7a chain):** the MOBILE-INPUT battery (390×844, `hasTouch`, real touch taps + touch drags — the sheet, the dock, a scene switch, a drag surface COMPLETING); the REDUCED-MOTION snap leg (`emulateMedia` — the engine's `respectReducedMotion` path finally exercised live); the KEYBOARD leg (Tab order, focus-visible, Enter/Space actuation of the play affordance); the SCENE-SWEEP leg widened to every routed scene. **The APPEARANCE-CERTIFICATION legs (gate on J.W7a + J.W3 — they assert post-suffusion appearance facts):** the mobile hero/subject overlap == 0 (the H3/A-01 cure); the DARK `--ball-tone`/accent computed-contrast leg (the dark-mode token surface, post-W7a colour); the ghost-rail-absent assertion. CH-3 re-certified on a MOBILE oracle (`sheet.bottom ≤ menubar.top` measured ON the mobile viewport — the chronic's closure gate finally matches its axis; the device-INDEPENDENT occlusion geometry HARD-gates). `proof:lighthouse-mobile` enters a tier under its P6 posture. EP-3 dispositioned: flip/drag/draw-svg get a demo home or a recorded BOOK with the uncovered-export list in the published-surface gate. | Each new leg witnessed born-RED-able against a PLANTED defect (a deliberate local mutation reds the leg — the leg can bite); then the full battery GREEN with the accumulated budget = 0 per leg. The CH-3 mobile oracle bites on a planted occlusion. The appearance-certification legs are green ONLY on the post-W7a tree; the input-modality legs bite the instant W0+W3 land, independent of the W2→W7a chain. |
| **J.W5** | **THE PUBLISHED SURFACE** | `proof:published-surface` (the boundary-ORACLE's publish oracle): `npm pack --dry-run` contents == the declared files (no `_redirects`, no leakage, the d.ts complete); every `index.ts` public export either taught in README or enumerated in a documented-surface manifest; the AnimationEngine interface drift-gated (ENG-6). README §Beyond CSS completes — all ~13 primitives taught with the care of the existing 4. The doc-rot purge: root CLAUDE.md REWRITTEN to the tree (the real src/animation (28), the real demo dirs, the real test counts, the static/dynamic boundary + `loadAnimationEngine`); `src/animation/CLAUDE.md` +9 modules; `demo/CLAUDE.md` rewritten. BP-1: `_redirects` out of the tarball. The changeset consolidation: the `tranche-j` changeset authored as the HONEST **minor** (the E→I orchestration tier named export-by-export), the two pending patches consumed into it; the version cut + publish remain USER-DOMAIN at WZ. The supersession annotations (pointer-only) on I's PROGRESS §0; the stray investigation PNG relocated. | `proof:published-surface` witnessed born-RED on the CURRENT tree (the `_redirects` leak + the 9 untaught exports red it today); GREEN only when the tarball, the exports, and the README agree. The README examples EXECUTE (each taught snippet runs against the built dist — the docs oracle is runnable truth, not prose). |
| **J.W6** | **TERMINATIONS** (P-invariant-28 — nothing rides a fifth tranche) | FB-2: author `proof:event-ordering`, measure the sync-step half, LAND-or-KILL on the numbers. SoA `lerpArray`: bench on the real-K corpus, ADOPT-or-KILL. FB-5 intrinsic-size: verify cross-engine Baseline as of the impl date; BOOK-with-date or KILL. FB-6 `Mod+K`: owner decided; BUILD-or-KILL. PF-1: Three.js named imports across the four amiga consumers (measured before/after bundle delta). PF-3: Monaco static-edge isolation re-verified on a fresh build. EF-3: `parseLinearStops` shim retirement check against `linear()` Baseline + the value.js E1 status. GH-6/DEP-1: the CNAME drift confirmed with the deploy owner (OUT — verify only). | Every rider exits with a MEASUREMENT ARTIFACT (the bench/probe output checked into the wave note) or a reasoned KILL record; the J close ledger carries ZERO rows tagged MEASURE-FIRST without a measurement. The bundle delta for PF-1 recorded before/after. |
| **J.W7a** | **THE APPEARANCE-GRAMMAR SUFFUSION** (the design directive — the half J.W4 certifies; on J.W4's critical path) | **Protagonist:** every stage subject becomes the unambiguous protagonist — the plated stage grammar unified (square gains its plate; the amiga slab joins the rounded-glass register; subjects sized/centered to their stage; the controls pane recedes via `glass-wash` so the stage bleeds through; the mobile hero/subject collisions die). **Display voice:** the Instrument Serif display register suffused from the doorway to the scenes — scene identity moments at the display rungs (glass-ui's unused poster tiers), the live MATH readouts promoted from 12px captions to confident mono displays (MetricBadge xl + AnimatedDigit). **Colour:** the `--ball-tone` parameterization of `.progress-ball` (the tone seam, mirroring `--badge-tone`) — every subject keeps its icon's hue; the Sequence rows onto the spectrum; the aquamarine literal dies; the readouts gain the scene accent; the colorful cube favicon + `theme-color`; gold stays reserved. **Math:** the easing stage projects its OWN bezier across the floor (the ball traverses its visible curve); designed coordinate-grid stage fields replace checkerboard defaults; FourierField adopted for the empty calm fields where befitting. **Grammar:** the ghost rail dies (storyboard register unified); the top-center band de-conflicted; the playback affordance grammar converged. Every visual delta NAMED + enumerated (the isomorphic exception); the visual-lock baseline re-captured in this wave's close motion (never after). | The per-finding RUNTIME assertions on the live page: the subject's computed `--ball-tone` per scene == its icon hue token; the scene-title display register present (computed font-family resolves Instrument Serif at the named moments); the mobile 390×844 hero/subject overlap == 0 px (the TYP-1/H3 oracle); the easing stage's projected curve PRESENT and MUTATING with a handle drag; the ghost rail ABSENT; the amiga stage rounded-glass computed style. Plus: `proof:live-session` budget stays 0 across the re-skinned tree, and the re-captured baseline lands WITH the wave. |
| **J.W7b** | **THE CONSUME-EDGE + glass-ui HANDOFF** (inv-16 sibling-coordination — file-disjoint from W7a; NOT on J.W4's path; parallel, AX-gated) | **Consume-to-delete — PARTITIONED by publish state (inv-16's published-only rule):** **(i) consume-on-3.9.0 (deletes THIS tranche)** — the primitive ALREADY ships in the on-disk glass-ui 3.9.0: ToggleChip cell, `.fade-slide`/`metric-swap` PRM classes, MetricBadge/AnimatedDigit + StatusDot, the ScrubberTimeline base slider, the gold-shimmer `@utility` (STY-1), STY-2..6 — each kf-hand-rolled twin deleted in the SAME motion the 3.9.0 primitive is consumed (no legacy beside its replacement); **(ii) consume-on-FUTURE-AX-publish (BOOK-with-target-version; NO kf deletion in J)** — the primitive is ABSENT from 3.9.0 and is a REFINE/ABSTRACT handoff: the SegmentedControl posture, the inertia-enriched ScrubberTimeline (C5), cartoon-surface default radius (C1), the headless-typography lever (C2) — the kf surface survives BESIDE its booked replacement until AX publishes (the narrow no-legacy suspension, gated on PUBLISH per the B7 vaporware lesson). **The glass-ui HANDOFF ledger** (25 REFINE + 21 ABSTRACT, headlined by the CurveEditorCanvas/control-point primitive, the rail/ball pair, the status-badge tone recipe, cartoon-surface default radius, the headless-typography lever) → `glassui-AX-handoff.md`; kf consumes only what AX PUBLISHES, never a kf-side patch (inv-16). No kf APPEARANCE change is owned here — the visual-lock baseline is W7a's; W7b touches no kf design delta. | **The boundary oracle (NOT a kf appearance gate):** the `glassui-AX-handoff.md` ledger is COMPLETE (every one of the 46 REFINE/ABSTRACT items dispositioned with its evidence anchor + the consuming kf seam named). **The "one motion" deletion clause is SCOPED to set (i):** each consume-on-3.9.0 edge lands the deleted kf surface and the consumed 3.9.0 primitive in ONE motion (a grep proves the hand-rolled surface is GONE the instant the consume lands; hygiene corroborator). Set (ii) over-promises if claimed this tranche — those edges exit as a BOOK-with-target-version against the FUTURE AX publish and carry NO kf deletion in J (the no-block/published-only rule — a HANDOFF targets only a published version, never a future version number). No born-RED kf-runtime witness is shared with W7a — this half has no kf appearance delta to re-baseline. |
| **J.WZ** | **CLOSE** | FINAL.md (held to inv ε — the boundary claims must each cite their observed oracle); the prompt-recap (this charter's MANDATE + every fold row dispositioned); the chronic-closure SUBSTRATE TRANSITION (the meta-gate's parse target moves from I's PROGRESS to J's ledger in the same motion the J ledger becomes authoritative); the changeset version cut + npm publish (USER-DOMAIN, Mike Babb, confirm-first — the honest minor); the T5 memory update; the auto-deploy round-trip RE-observed on the close merge. | `proof:all` GREEN where proof:all == CI; the close merge's own CI run auto-deploys (the J.W0 oracle, re-witnessed on the close itself); the published tarball passes `proof:published-surface`; the J ledger terminal (zero un-dispositioned rows). |

---

## § The DEV / IMPL boundary

This DEV phase AUTHORS. The IMPL phase AWAITS authorization — exactly the D→I boundary.
Authored now: this charter, `PATH-FORWARD.md`, `PROGRESS.md` (the board + the J ledger),
the per-wave specs, the glass-ui handoff doc, atop the 46-doc audit corpus already on
disk. Run later, only on explicit user authorization: every source/demo/engine/gate/test/
CI edit; the glass-ui coordination asks; the changeset + publish + deploy legs
(USER-DOMAIN, confirm-first).

**Honest already-done — manufacture NO J work** (inv ε; `audit/` per-lane "what holds"):
the I waves delivered their specs at the gestalt seam (all 8 plan-vs-delivery lanes:
zero silent narrowing beyond the named residues); the two-tier taxonomy + both meta-gates
are REAL and machine-enforcing at desktop-1440; the 5 H proxy gates + the vaporware IOU
are genuinely DELETED; value.js 0.11.2 + glass-ui 3.9.0 are published-consumed
(lockfile-verified); the release pipeline (`release.yml`, tag-triggered) is structurally
sound and was never affected by the dead CI; the engine core decomposition
(FrameCompiler/engine/playback/group) is the right seam — `tick` means one thing, snap is
symmetric, zero legacy re-exports; the mono/φ-ladder typography system and the icon family
are well-built (the suffusion wave AMPLIFIES them, it does not repair them); the
`NAMED_BENIGN` allowlist is genuinely single-source; `scripts/pages-deploy.sh` +
deploy-pages.yml + GH-secrets is the right deploy design (it needs verification, not
replacement); the shell chrome (dock + transport + icons) is single-voiced and strong.

---

## § The chronic + deferred fold (P-invariant-28 — the complete disposition)

The full consolidated ledger A→I is `audit/deferred-ledger.md`; `PROGRESS.md` carries the
J board + the parse-substrate tables. The bands:

- **FOLDED into J waves** — every row in the finding-cluster table above (the 17 P0s and
  the fold-tagged P1s each name their wave). The four ≥4-tranche riders fold into J.W6
  with EXIT-ONLY dispositions.
- **RE-AFFIRM (genuinely closed; do not re-litigate)** — CH-2 φ-hero; the dock spring
  (D5); DC-8 (RESTORED via the live `startViewTransition` consumer — J verifies the grep
  stays 0, no re-open); the I crash chronics CH-5..CH-10 (their gates verified present +
  actuating by the inv-ε lane).
- **OUT / sibling-HANDOFF (gate-first, never kf-patched)** — the value.js next-slice
  (VJ-1..9, chronic-by-design, rides the next re-pin); parse-that packrat re-key; the
  glass-ui ledger (the 25 REFINE + 21 ABSTRACT design items, the typography opt-in lever,
  LabeledField orientation, the `{types}` VT helper, cartoon-surface radius) — all AX-owned,
  consumed on publish; DEP-1/2/3 (deploy-repo-owned; J.W6 confirms DEP-1 only).
- **RECORD (historical, terminal)** — INVE-1 (the I FINAL's deploy-claim gap — recorded,
  cured by J.W0's observed oracle); INVE-4/5 (stale-snapshot drift in I's FINAL); GH-8;
  EF-1/2; the `d469e69` SUPERSEDED-BY-FIX-SHIP disposition (unchanged).
- **KILL (permanent, reasoned)** — `proof:repin-safe` (stale-by-construction); the ARCH
  kills carry forward un-re-litigated (ScrollTimeline-native, Worker/OffscreenCanvas,
  WASM-parser, Typed-OM, per-property easing, bit-packing, dev.sh/deploy.sh, ValueUnit
  monomorphization).
- **USER-DOMAIN** — the version cut (the honest minor off 4.1.0, consuming both pending
  changesets), the npm publish, the close-merge deploy. Version owner **Mike Babb**
  (`mike@babb.dev`), confirm-first.

**The prompt recap.** The five lineage lanes (`audit/recap-*.md`) re-verified every
recorded prompt A→I against the TREE: 55 of 65 rows ADDRESSED; the 10 PARTIAL/GATED rows
are each owned above (CD-1 → J.W2; the CI-on-Linux follow-up → J.W0; the changeset/publish
→ J.W5/WZ; F.W8 composition-honoring → the FB-1 BOOK re-affirmed; the four sibling-gated
rows stay HANDOFF with their born-RED kf gates). **No prompt is dropped; every PARTIAL has
a J home or a sibling gate.**

---

## § The terminal reading (the one paragraph for the impl phase)

I made the gate oracle the running product and proved the product true at one desktop
viewport — then shipped it by hand, on a version npm has never seen, under docs describing
a tree that no longer exists, certified on no axis a phone or a motion-sensitive or a
keyboard user touches, wearing its design language at one doorway only. **J's correction is
singular: the same oracle discipline, extended to every boundary the product crosses.** The
deploy chain earns an OBSERVED green-CI→auto-deploy round-trip on a cured, per-expected-state
gate; the npm surface earns the honest minor with a `proof:published-surface` oracle and a
README that teaches what actually ships; the docs are rewritten to the tree because stale
docs are legacy code; the live-session battery learns the human axes (touch, reduced
motion, dark, keyboard, every scene); the design language — glass, grid, math, audacious
serif, the rainbow the icons already promised — suffuses from the doorway through every
pane via the tone seam, the display rungs, and the consume-to-delete glass-ui edges, with
every general primitive kf invented handed off to glass-ui where it belongs. Underneath,
the seams I repaired are made TOTAL (the one serialization authority, the total guards,
the unit pyramid, the drag seam at zero residue), the estate collapses onto the lib it
already half-owns under a net-deletion rule, and every rider that has outlived four
tranches exits — probe or KILL. When J closes, "green" means: **a human anywhere — on the
live site, from `npm i`, in the README, on a phone, in the dark, with motion stilled —
meets the same true, whole, beautiful product.**
