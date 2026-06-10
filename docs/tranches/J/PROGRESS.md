# Tranche J — PROGRESS (the board + the J open-deferrals chronic ledger)

**Branch:** `tranche-j-dev` (forked off `master` @ `4072af9` — the I-close tip + the adopted
post-close CI/deploy tail; clean tree; kf `4.1.0`-base; value.js `^0.11.2`, glass-ui `~3.9.0`,
parse-that `^0.9.0` consumed PUBLISHED).
**Type:** TRANCHE DEVELOPMENT. The deliverable is the docs under `docs/tranches/J/**` — the charter
(`J.md`), the wave specs (`waves/J.W*.md` — all ten on disk: J.W0/W1/W2/W3/W4/W5/W6/W7a/W7b/WZ),
`PATH-FORWARD.md`, this board, and the glass-ui handoff doc (`glassui-AX-handoff.md`, AUTHORED on
disk with J.W7b), atop the 46-doc audit corpus on disk. **No source/test/CI/demo is edited in the development
phase. No engine, gate, or library bump is written. No commit beyond docs is made.**
**Date:** 2026-06-10. **Version in tree:** `4.1.0` (two unconsumed `patch` changesets;
`release.yml` has NEVER run — `git tag -l 'v*'` tops at `v4.1.0`; the honest minor + publish are
USER-DOMAIN at J.WZ — `audit/wave-I.WZ-postclose.md §F(g)`).

This board is the spine of the tranche: the boundary-integrity headline, the wave plan with its REAL
boundary-actuating gates (all ten waves J.W0/W1/W2/W3/W4/W5/W6/W7a/W7b/WZ AUTHORED on disk this
phase, per §1's board), the per-finding-cluster ledger, and the
§"Open deferrals" chronic ledger that FOLDS every chronic + deferred item the A→I lineage surfaced.
Companion documents:

- **`J.md`** — the binding charter (wave allocation, the invariant set, the DAG, the precept spine,
  the boundary-ORACLE extension, the fold bands).
- **`PATH-FORWARD.md`** — the executive summary (what every boundary still runs on trust, why the
  blindspot re-seeded one boundary out, the remediation sequence).
- **`waves/J.W0..J.WZ.md`** — the authored-now-run-later wave specs. ALL TEN ON DISK this phase: J.W0,
  J.W1, J.W2, J.W3, J.W4, J.W5, J.W6, J.W7a, J.W7b, J.WZ (`find docs/tranches/J/waves -name '*.md'`
  returns 11 files incl. `README.md`; each spec's own header reads `Phase: DEV — spec authored`).
  §1's board carries the per-wave status.
- **`glassui-AX-handoff.md`** — the 25 REFINE + 21 ABSTRACT glass-ui coordination ledger. **AUTHORED
  on disk** (J.W7b's handoff deliverable; 61 KB; self-attests its 46 = 21 ABSTRACT + 25 REFINE corpus
  COMPLETE — `glassui-AX-handoff.md:18-20`, `:867`; the 25+21 ledger band-covered in §"Open deferrals"
  is now directly verifiable against the doc).
- **`audit/deferred-ledger.md`** — THE consolidated deferred/chronic ledger A→I (this board's
  §"Open deferrals" substrate input).
- **`audit/precepts.md`** — the consolidated precept register A→I + the five resolved tensions.
- **`audit/recap-{AB,CD,EF,GH,I-session}.md`** — the honest A→I prompt reckoning (55/65 ADDRESSED,
  10 PARTIAL/GATED each owned here).
- **`audit/wave-I.WZ-postclose.md`** — the 8-commit post-close tail that NO I doc owned (the P0
  deploy hazard, folded into J.W0).
- **`audit/{engine-core,parsing-units-valuejs-seam,gate-census,ci-cd,ci-linux-open-item,legacy-sweep,
  build-packaging-release,scope-adversary,final-vs-tree-inv-epsilon}.md`** + **`audit/design/*.md`**
  (14 design lanes over the 48-screenshot corpus) — the wave design inputs.

---

## §0 — THE HEADLINE (why Tranche J exists)

Tranche I bound the gate oracle to the running product, recovered nine live breakages behind
ACTUATING runtime gates, installed `proof:live-session` + `proof:gate-is-runtime` + the two-tier
taxonomy, and made "green" mean *a human using the product at one desktop viewport sees it work* —
then **shipped it by hand**. The J audit (32 systemic lanes + 14 design lanes, 46 evidence docs,
every claim tree-verified) finds that **I's close HOLDS at the surface it certified and the SAME
blindspot shape survives at every boundary BEYOND that surface.**

- **The deploy boundary [P0].** Auto-deploy is armed (`deploy-pages.yml`, `workflow_run.conclusion
  == 'success'`) and BLOCKED by `proof:scene-control-dfa` — a fixed-`settleMs=1600` gate the I close
  itself recorded **"STILL OPEN"** (`audit/wave-I.WZ-postclose.md §C`, `I-WZ-verify.md:344-348`)
  whose underlying defect is a REAL PRODUCT LAG (the control-surface trigger renders the SOURCE
  scene's stale label until the FSM settles under load — `feb39c3` revert rationale). CI itself had
  been YAML-INVALID since H.W12 (`f93e731`; discovered only POST-close); ~60 demo-smoke gates have
  NEVER executed on Linux; one clean auto-deploy round-trip was NEVER observed. The 06-09 deploy was
  a MANUAL `wrangler` bypass using a SIBLING repo's `.env` creds (`audit/wave-I.WZ-postclose.md §F`).
- **The publish boundary [P1].** npm publishes nothing — version is still `4.1.0` (`release.yml` has
  never run) while `src/animation/index.ts` ships a 16-export orchestration tier accreted E→I and
  never published; two changesets both say `patch`, papering a tranche-spanning new public surface;
  the README teaches 4 of ~13 primitives; `decay.ts` is the one public module with no test
  (`audit/scope-adversary.md §0-§1`, `audit/build-packaging-release.md`).
- **The docs boundary [P1].** Root `CLAUDE.md` documents the DELETED barrel architecture, ghost demo
  dirs, "15 test files / 261 tests" (the tree has 69 top-level `*.test.ts`), a 10-module animation
  tree (28 exist). Stale docs are legacy code (`audit/legacy-sweep.md`, `audit/deferred-ledger.md §H`).
- **The axes boundary [P1].** `proof:live-session` is desktop-1440-only: mobile/touch/
  reduced-motion/dark/keyboard and the playground-class scenes are all un-exercised; the CH-3
  "mobile" chronic is certified by desktop mouse gates (`audit/final-vs-tree-inv-epsilon.md`
  INVE-2/P0-2 — the J INVE-N alias ≡ the lane's P0-N). The exact I lesson — *the un-exercised axis
  is where the next lie lives* — re-seeded one viewport-width over.
- **The design boundary [the user's J directive].** The design language is PRESENT but CONCENTRATED:
  the Instrument Serif display voice appears at ONE moment; the subject palette collapsed to one
  green while the icons sing a six-colour rainbow; the protagonist is undersized/unplated on most
  stages; the amiga stage is a hard gray slab among rounded glass; on mobile the hero TYPE and the
  SUBJECT collide. glass-ui ships primitives kf hand-rolls, and kf has authored genuinely general
  primitives that belong in glass-ui (`audit/design/*.md` — 14 docs).

Underneath the boundaries, the audit surfaced **latent defect classes at the seams I repaired** (the
I.W0 serialize-from-template applied at ONE seam while the sibling per-card serializer still rides
the old DOM-resolving path; a latent `templateFrames[undefined]!.transform` deref; an empty-only
selector guard; the LOAD-BEARING value.js empty-input contract with NO kf-side pin; two drag surfaces
still bypassing the shared seam) **and the estate debt of the regime itself** (43 gates re-declare
`serveDist` byte-identically; `proof:all` ≠ the CI roster; the meta-gate hardcodes 9 of 10
correctness gates; the I "collapse the lattice" thesis was NOT executed — the count GREW 103→109).
(`audit/engine-core.md`, `audit/parsing-units-valuejs-seam.md`, `audit/gate-census.md`,
`audit/precepts.md §2-F2`.)

**J's correction is one move applied everywhere: extend the gate-ORACLE precept to every boundary.**
What auto-DEPLOYS is what was certified; what `npm i` INSTALLS is what the source declares and the
README teaches; what the DOCS claim is what the tree holds; what is CERTIFIED covers the surfaces
humans use; what the human SEES carries the design language everywhere; and the regime that enforces
all of this is industrialized to NET-DELETION, with every ≥4-tranche rider terminated — probe or
KILL, nothing rides a fifth time.

---

## §1 — THE BOARD (waves × dev-status)

Status legend: **AUTHORED** (wave spec on disk this dev phase) · **PENDING** (spec to author —
in-flight or queued for a sibling lane) · **LANDS** (implementation-phase, not this tranche).
**All ten J waves are AUTHORED on disk this phase — J.W0, J.W1, J.W2, J.W3, J.W4, J.W5, J.W6, J.W7a,
J.W7b, J.WZ** (`waves/J.W*.md`, verified `find docs/tranches/J/waves -name '*.md'` → 11 files incl.
`README.md`; each spec's own header reads `Phase: DEV — spec authored` — J.W1.md:3, J.W2.md:3,
J.W7a.md:3, J.W7b.md:3, J.WZ.md:3). The board claims them AUTHORED only because the tree HOLDS them
(the inv-ε discipline: a deliverable is AUTHORED only when the tree holds it — the exact INVE-1
overclaim shape J indicts in I's FINAL, `J.md §ENFORCEMENT`; the tree holds all ten, so the board
records all ten AUTHORED).
The forward-looking charter sentence `J.W0–J.WZ are authored-now-run-later wave specs`
(`J.md §Phase`) names the INTENT for the phase; this board records the per-wave on-disk STATE.
Every wave's headline gate is a REAL boundary-actuating gate per the boundary-ORACLE extension (the
correctness oracle actuates the running product, or the named boundary oracle for boundary waves);
hygiene clauses CORROBORATE only and are labeled. No source-shape check carries correctness
authority — the I-born precept the J charter re-asserts verbatim (`J.md §invariant set`).

| Wave | Charge | Owns (cluster · decisive folds) | Headline gate (the boundary-ORACLE it proves itself with) | Dev status |
|---|---|---|---|---|
| **J.W0** | **THE DEPLOY BOUNDARY (leads — P0)** — formal adoption of the 8-commit I post-close tail (the tail gets its tranche home + terminal disposition); `navToScene(page, sceneId, expected)` lands in `scripts/lib/demo-driver.mjs` (wait predicate = PER-EXPECTED destination state, ceiling-timeout, load-independent); `scene-control-dfa` + `scene-transition-perf` migrate onto it; the PRODUCT half — the dock trigger projection made born-correct from the DFA (never the SOURCE scene's stale label); GH repo secrets verified | `scripts/lib/demo-driver.mjs` · the dock control-surface projection · the deploy chain | **One OBSERVED clean round-trip: a real master push → green CI (demo-smoke end-to-end GREEN on the Linux runner, scene-control-dfa included, ZERO escapes) → `deploy-pages.yml` auto-fires → the live site serves the pushed bytes.** Born-RED witness: red on CI run `27228309606`'s trigger='null'-under-load shape before the cure | **AUTHORED** |
| **J.W1** | **THE ENGINE TOTALITY PASS** — ENG-1 the per-card serializer unified onto serialize-from-template (the sibling DOM-resolving path dies in the same motion); ENG-2 `createFrame`'s `seekPreviousValue` made total; SEAM-1 the selector guard rejects ALL non-conforming input with the typed error; SEAM-2 the kf-side `parseCSSValueUnit("")` pin; SEAM-4 the rotate()-shorthand round-trip de-vacuoused; SEAM-3 the round-trip corpus gains the `var()`/`calc()`/`matrix3d()` fixture trio (not var() alone); the unit pyramid (var()-round-trip, bind-proof, `binarySearch`, `decay`); W0-5 clause (e) | `src/animation` (un-fenced — the permanent engine rule) · the serialize seam | New unit tests witnessed born-RED on the pre-fix tree (git-stash probe). Runtime: `proof:engine-no-throw-on-play` extended — the EDITOR per-card pane round-trips a `var()`-bearing animation (the ENG-1 oracle is the rendered card); the garbage-selector path asserts the TYPED error in the live console | **AUTHORED** |
| **J.W2** | **THE DEMO SEAM COMPLETION** — W4-3/W4-4 EasingCurveCanvas + PlaybackRibbon onto the shared drag seam (the B6 latent class to ZERO); DS-1 + S4-stretch the `selectedControl` single-writer COMPLETED (the CubeScene rogue write dies; the DFA projection is the ONLY writer); M2 `isPanelTransitionDone` off the spring settle (not CSS `transitionend`); CD-1 `AnimationMenuBar → TransportDock` executed (the D overclaim terminated); DS-2 the 17 reactive refs/frame onto the non-reactive write; `useRafLoop` → `onScopeDispose` | the shared drag composable · the controls single-authority seam | `proof:drag-gesture` extended to the two recovered surfaces (real `page.mouse` drag, no text-selection, gesture lands); the mobile sheet open→close→RE-OPEN on 390×844 scrolls to content (M2 runtime); a live scene sweep asserts the rendered control surface == the DFA projection on every entry (no stale latch), the no-rogue-writer grep as hygiene corroborator | **AUTHORED** |
| **J.W3** | **THE ESTATE INDUSTRIALIZED (net-deletion)** — `withPage()`/`withBrowser()` + the shared `serveDist`/MIME/chromium/`navToScene` exports in `scripts/lib/` (the 43/51/54 copies MIGRATE, ≈2 kLoC deleted); the ONE `IN_CI` helper + per-gate DECLARED on-device posture (P6 mechanical; the third tier named); `proof:all` == the CI roster (the 3 CI-only gates enter a tier; a two-way `proof:ci-coverage` clause); the meta-gate derives its roster FROM `proof:correctness` (T4); `proof:demo-fonts` tier-decided; KILL `proof:repin-safe`; `proof:deps-current` floors advance; W7-1/W7-2 leg-scoped; the stale-refs purge; T3 the two surviving proxies re-labeled honestly | `scripts/lib/` · the gate taxonomy · the CI roster | The bite-preservation oracle: a SAMPLED set of migrated gates re-witnessed born-RED on their recorded defect (no migration may lobotomize a gate); `proof:all` == CI proven both ways; gate COUNT and estate LoC measured strictly DOWN (the net-deletion rule, before/after recorded) | **AUTHORED** |
| **J.W4** | **THE AXES BATTERY** — `proof:live-session` gains the MOBILE (390×844, `hasTouch`, real touch taps/drags), REDUCED-MOTION (`emulateMedia`), DARK (color-scheme token surface), KEYBOARD (Tab order/focus-visible/Enter-Space) legs + the SCENE-SWEEP widened to every routed scene; CH-3 re-certified on a MOBILE oracle (`sheet.bottom ≤ menubar.top` measured ON the mobile viewport); `proof:lighthouse-mobile` enters a tier under its P6 posture; EP-3 flip/drag/draw-svg dispositioned (demo home or recorded BOOK) | the live-session battery · the W3 harness · the mobile/a11y axes | Each new leg witnessed born-RED-able against a PLANTED defect (a deliberate local mutation reds the leg); then the full battery GREEN with the accumulated budget = 0 per leg. The CH-3 mobile oracle bites on a planted occlusion | **AUTHORED** |
| **J.W5** | **THE PUBLISHED SURFACE** — `proof:published-surface` (`npm pack --dry-run` contents == declared files, no `_redirects`, d.ts complete; every public export taught or enumerated; ENG-6 interface drift-gated); README §Beyond CSS completes (all ~13 primitives); the doc-rot purge (root CLAUDE.md REWRITTEN to the tree, `src/animation/CLAUDE.md` +9 modules, `demo/CLAUDE.md` rewritten); BP-1 `_redirects` out of the tarball; the changeset consolidation (the honest MINOR, both patches consumed — version cut + publish USER-DOMAIN at WZ); the supersession annotations (pointer-only); the stray PNG relocated | the npm surface · the README · the doc tree | `proof:published-surface` witnessed born-RED on the CURRENT tree (the `_redirects` leak + the 9 untaught exports red it today); GREEN only when the tarball, the exports, and the README agree. The README examples EXECUTE against the built dist (the docs oracle is runnable truth) | **AUTHORED** |
| **J.W6** | **TERMINATIONS (P-invariant-28 — nothing rides a fifth tranche)** — FB-2 author `proof:event-ordering`, LAND-or-KILL on the numbers; SoA `lerpArray` bench on the real-K corpus, ADOPT-or-KILL; FB-5 intrinsic-size verify Baseline, BOOK-with-date or KILL; FB-6 `Mod+K` owner decided, BUILD-or-KILL; PF-1 Three.js named imports (measured bundle delta); PF-3 Monaco static-edge re-verify; EF-3 `parseLinearStops` shim retirement check; GH-6/DEP-1 CNAME confirm (OUT — verify only) | the four ≥4-tranche riders · the perf frontier | Every rider exits with a MEASUREMENT ARTIFACT (bench/probe output checked into the wave note) or a reasoned KILL record; the J close ledger carries ZERO rows tagged MEASURE-FIRST without a measurement. The PF-1 bundle delta recorded before/after | **AUTHORED** |
| **J.W7a** | **THE APPEARANCE-GRAMMAR SUFFUSION** (the design directive — the half J.W4 certifies; ON J.W4's critical path) — the protagonist made unambiguous (plated stage grammar unified, the amiga slab joins the rounded-glass register, subjects sized/centered, the controls pane recedes via `glass-wash`, mobile hero/subject collisions die); the Instrument Serif display voice suffused from the doorway to the scenes (scene-identity at the display rungs, MATH readouts promoted MetricBadge xl + AnimatedDigit PROMOTION use); the `--ball-tone` parameterization of `.progress-ball` (every subject keeps its icon's hue; the aquamarine literal dies; readouts gain the scene accent; the colorful favicon + `theme-color`); the easing stage projects its OWN bezier; designed coordinate-grid fields + FourierField where befitting; the ghost rail dies; the top-center band de-conflicted; the playback-affordance grammar converged. Every visual delta NAMED + enumerated (the isomorphic exception); CP-1/TYP-2/XH-1..4/protagonist band | the demo appearance (the named isomorphic exception) · the visual-lock baseline | The per-finding RUNTIME assertions on the live page: the subject's computed `--ball-tone` per scene == its icon hue token; the scene-title display register present; the mobile 390×844 hero/subject overlap == 0 px; the easing stage's projected curve PRESENT + MUTATING with a handle drag; the ghost rail ABSENT; the amiga stage rounded-glass computed style. `proof:live-session` budget stays 0; the visual-lock baseline re-captured WITH the wave | **AUTHORED** |
| **J.W7b** | **THE CONSUME-EDGE + glass-ui HANDOFF** (inv-16 sibling-coordination — file-disjoint from W7a; NOT on J.W4's path; parallel, AX-gated) — consume-to-delete (MetricBadge/AnimatedDigit consume-to-delete use, SegmentedTabs, ToggleChip cell, ScrubberTimeline, `.fade-slide` PRM classes, gold-shimmer dedup STY-1, the STY-2..6 token items) — each kf-hand-rolled surface deleted in the SAME motion the published glass-ui primitive is consumed (no legacy beside its replacement); the glass-ui HANDOFF ledger (25 REFINE + 21 ABSTRACT, headlined by the CurveEditorCanvas/control-point primitive, the rail/ball pair, the status-badge tone recipe) → `glassui-AX-handoff.md` (kf consumes only what AX PUBLISHES, never a kf-side patch). NO kf appearance delta is owned here; re-captures NO baseline | the glass-ui consume-edge · the AX coordination doc (no kf appearance delta) | **The boundary oracle (NOT a kf appearance gate):** `glassui-AX-handoff.md` COMPLETE (every one of the 46 REFINE/ABSTRACT items dispositioned with its evidence anchor + the consuming kf seam named); each consume-to-delete edge gated on the PUBLISHED glass-ui version arriving — deleted kf surface + consumed primitive land in ONE motion (the hand-rolled-surface-GONE grep is the hygiene corroborator). No born-RED kf-runtime witness shared with W7a — no kf delta to re-baseline | **AUTHORED** |
| **J.WZ** | **the close** — FINAL.md (held to inv ε — each boundary claim cites its observed oracle); the prompt-recap (every fold row dispositioned); **the chronic-closure SUBSTRATE TRANSITION** (the meta-gate's parse target moves from I's PROGRESS to THIS J ledger in the same motion the J ledger becomes authoritative); the changeset version cut + npm publish (USER-DOMAIN, Mike Babb, confirm-first — the honest minor); the T5 memory update; the auto-deploy round-trip RE-observed on the close merge | — | `proof:all` GREEN where `proof:all == CI`; the close merge's own CI run auto-deploys (the J.W0 oracle re-witnessed on the close itself); the published tarball passes `proof:published-surface`; the J ledger terminal (zero un-dispositioned rows) | **AUTHORED** |

> **Wave dependency note.** J.W0 LEADS (the deploy boundary is the P0 hazard; its `navToScene`
> primitive and its green-Linux CI are consumed by every later wave's verification). J.W1 ∥ J.W2 ∥
> J.W6 run parallel (file-disjoint: engine / demo-behavior / measurements). J.W3 follows J.W0
> (consumes the primitive; owns the estate). **The design suffusion SPLITS along its natural fault
> line** (`audit/scope-adversary.md`): **J.W7a** (the APPEARANCE-GRAMMAR half) follows J.W2 (shared
> demo files — behavior first, then appearance) and re-captures the visual baseline in its close
> motion; **J.W7b** (the CONSUME-EDGE + glass-ui HANDOFF half) is file-disjoint from W7a, gated ONLY
> on AX PUBLISH, runs PARALLEL to the W2→W7a chain, owns NO kf appearance delta, and is NOT on
> J.W4's critical path. **J.W4's legs are PARTITIONED by their actual upstream dependency, not
> serialized whole:** the APPEARANCE-INDEPENDENT input-modality legs (the touch battery, the
> PRM/reduced-motion snap, the keyboard actuation, the scene-sweep) gate ONLY on J.W0 + J.W3 and
> land as soon as the harness does — parallel to the W2→W7a chain; the APPEARANCE-CERTIFICATION legs
> (the mobile hero/subject overlap == 0, the dark `--ball-tone` contrast, the ghost-rail-absent
> assertion) gate on J.W7a + J.W3 and are green ONLY on the post-W7a tree. The longest serial path
> is therefore W0 → W2 → W7a → W4(appearance legs); W7b is parallel/AX-gated, NOT on W4's path. J.W5
> is parallel to all (docs/packaging), its changeset cut LAST among waves. J.WZ closes.
> (`J.md §The WAVE MAP`.) The engine is un-fenced under the PERMANENT engine rule (T2
> resolved): `src/animation` is the kf PRODUCT, in scope whenever runtime correctness or measured
> elegance requires; the fence is against SIBLING forks only.

---

## §2 — THE FINDING-CLUSTER LEDGER (cluster → decisive findings → falsified-or-latent claim → wave)

Severity counts from the structured fleet returns (`J.md §The finding-cluster → wave ledger`):
**17 P0 · 120 P1 (82 systemic + 38 design) · 95 must-fold candidates · 64 glass-ui ledger items.**
Every fold row carries its evidence anchor; no cluster is silently narrowed.

| Cluster | The decisive findings (lane § / file:line) | The falsified or LATENT claim | Wave |
|---|---|---|---|
| **Deploy integrity** | `scene-control-dfa` a LIVE product lag (trigger lags hash-nav under load — `feb39c3`) + a flaky fixed-`settleMs=1600` gate with ZERO CI escape, hard-gating `demo-smoke`→`ci`→`deploy-pages.yml`; the reverted escape-hatch waited on the SOURCE scene's stale trigger (no-op); `scene-transition-perf` carries the IDENTICAL race; `demo-driver.mjs` has NO scene-nav primitive; ~60 demo-smoke gates NEVER run on Linux; the deploy-gating gates are in NEITHER tier; GH secrets unverified; the 8-commit post-close tail has no tranche home; one clean auto-deploy round-trip NEVER observed | the I FINAL's "merge → green CI → CF auto-deploys" was STRUCTURALLY IMPOSSIBLE when written (ci.yml YAML-invalid since H; `audit/final-vs-tree-inv-epsilon.md` INVE-1) | **J.W0** |
| **Engine totality** | ENG-1 the sibling per-card serializer (`CSSKeyframesToStrings`) still on the pre-transposition DOM-resolved path, live-consumed by the editor; ENG-2 latent `templateFrames[undefined]!.transform` deref in `createFrame`; SEAM-1 the selector guard catches only `trim()===""`; SEAM-2 the LOAD-BEARING value.js empty-input contract has no kf-side pin; SEAM-4 `rotate()` shorthand round-trip vacuous; SEAM-3 the round-trip corpus lacks `var()`/`calc()`/`matrix3d()` fixtures (the I.W0 serializer round-trips them but the manifest covers none); TB-1/2/3 the I engine fixes have NO unit tests (the pyramid inverted); decay.ts untested; W0-5 clause (e) unimplemented | the I.W0 serialize-from-template transposition was applied at ONE seam only; the sibling path is still B1-class live | **J.W1** |
| **Demo seam completion** | W4-3/W4-4 EasingCurveCanvas + PlaybackRibbon still bypass the shared drag seam (the B6 latent class NOT zero); DS-1 CubeScene writes `storedControls.selectedControl` directly (bypassing the I.W2 single authority); S4-stretch spec'd, never landed, no terminal home; M2 the mobile sheet re-open scroll latch (CSS `transitionend` never fires on the spring-driven sheet); CD-1 the D FINAL OVERCLAIMED `AnimationMenuBar→TransportDock` as closed (inv-ε violation — the rename never happened); DS-2 the spring scene writes 17 reactive refs/frame; `useRafLoop` on `onUnmounted` | the I.W2 "single authority" surface is single-sourced but LAGS the route under load; the B6 drag seam was not actually closed at zero residue | **J.W2** |
| **Estate industrialization** | GC-1 43×`serveDist`/51×MIME/54×chromium duplication (~2 kLoC; the lib at 7 importers); GC-2/BP-4 `proof:all` ≠ CI (3 gates CI-only, no aggregator); GC-3 the meta-gate hardcodes 9/10 (omits `proof:demo-fonts`); GC-4 demo-fonts a load-rest gate in the CORRECTNESS tier; GC-5 `proof:repin-safe` stale-by-construction → KILL; BP-5/6 the `proof:deps-current` floors allow the B1-regression value.js + pre-B7 glass-ui; W7-2 the named-benign exclusions global not leg-scoped; W7-1 the B2 dev-server leg note-skips; WZ-5/CICD-3 the `IN_CI` triplication (3 files, 3 strategies); CICD-4/5 ci-coverage blind to raw-node gates + the version-literal clause vacuous; GC-6/W7-5/GH-3 stale retired-gate names + phantom `no-route-storm` refs; PRE-1/F2 the un-executed collapse (count GREW 103→109; 93 scripts / 35,227 LoC on disk) | the I "collapse the lattice" thesis was authority-only — the lattice was RELABELED and survives at full size (`audit/precepts.md §2-F2`) | **J.W3** |
| **The axes** | FVT-2/INVE-2 live-session desktop-1440-only (mobile/touch/reduced-motion/dark/keyboard all zero-hit; the SCENES sweep omits playground-class scenes); lighthouse-mobile an orphan in neither tier; CH-3 mobile chronic certified by desktop oracles; EP-3 flip/drag/draw-svg exported with no demo scene and zero live-session coverage; FVT-6 CH-3/CH-4 closure rests on a gate WZ demoted to CI-observe-only (P6 posture must be explicit) | `proof:live-session` certified the product at ONE viewport, one input modality, one motion preference, one color scheme — the un-exercised axis is where the next lie lives | **J.W4** |
| **The published surface** | SCOPE-1 the 16-export orchestration tier unpublished (npm = tree = 4.1.0); SCOPE-3/DL-8/FVT-4 two `patch` changesets unconsumed + the patch-vs-minor decision owed; SCOPE-5 README teaches 4/~13 primitives; LS-1..8 + SEAM-0 + DS-1/2 + EP-5 + ENG-5 + TB-4 the full doc-rot band (root CLAUDE.md "15 files/261 tests" vs 69 top-level; src/animation/CLAUDE.md; demo/CLAUDE.md; README); BP-1 `dist/_redirects` ships in the tarball; ENG-6 the hand-maintained AnimationEngine interface has no drift gate; the misplaced `b2-gen-crash-easing-visibility.png` | the docs lie: the repo's own front door documents a tree that no longer exists; npm ships a version two architectural eras stale | **J.W5** |
| **Terminations (P-invariant-28)** | DL-1 the four ≥4-tranche riders — FB-2 async sync-step, SoA `lerpArray`, FB-5 intrinsic-size, FB-6 `Mod+K` palette; PF-1 Three.js namespace→named imports (est. 100-200 KB); PF-3 Monaco static-edge re-verify; EF-3 parseLinearStops shim retirement (`linear()` Baseline 2026-06-11); GH-6 DEP-1 CNAME confirm (OUT, deploy-owned) | four riders have ridden ≥4 tranches as bare BOOK/MEASURE-FIRST with no probe authored — a fifth ride is the perpetual punt P-invariant-28 forbids | **J.W6** |
| **The design suffusion — APPEARANCE-GRAMMAR half** | The protagonist deficit (8 panes: undersized/unplated subjects, the controls pane winning hierarchy, the amiga thumbnail-in-a-gray-room, square's no-plate drift, mobile hero/subject collisions TYP-1/H3/A-01); the display-voice concentration (TYP-2; the MetricBadge/AnimatedDigit PROMOTION use of the math readouts); the two-colour-system drift (CP-1 rainbow icons vs one-green subjects — the `--ball-tone` seam; the aquamarine literal; gray readouts; the monochrome favicon); the math-made-visible band (the easing stage's invisible curve; coordinate-grid fields; FourierField adopted); the grammar unification (XH-1 ghost rail, XH-2 storyboard schism, XH-3 amiga slab, XH-4 top-center collisions) | the design language is PRESENT but worn at ONE doorway only; the rendered RESULT was never measured against the design intent | **J.W7a** |
| **The design suffusion — CONSUME-EDGE half** | consume-to-delete (MetricBadge/AnimatedDigit CONSUME-to-delete use, SegmentedTabs, ToggleChip, ScrubberTimeline, glass-wash, .fade-slide PRM, gold-shimmer dedup STY-1, STY-2..6); the glass-ui HANDOFF ledger (25 REFINE + 21 ABSTRACT → AX coordination doc, headlined by the CurveEditorCanvas/control-point primitive, the rail/ball pair, the status-badge tone recipe) | glass-ui ships primitives kf hand-rolls; kf authored genuinely general primitives that belong in glass-ui — inv-16 sibling-coordination, consumed on PUBLISH, never kf-patched; NO kf appearance delta | **J.W7b** |

**Net-new chronic the I FINAL could not enumerate** (it was born AFTER `FINAL.md` was committed, in
the post-merge CI tail): `scene-control-dfa` — the single deferral the I close's "no perpetual punt"
claim does NOT cover (`audit/deferred-ledger.md §2`). It is a CHRONIC the instant it survives J
unowned. Folded P0 into J.W0; it partially undercuts the CH-7/I.W2 single-authority VERIFY-ONLY (the
surface is single-sourced but LAGS the route under load).

---

## §3 — THE A→I PRECEPT RECKONING (which precept held, which is internally contradictory)

From `audit/precepts.md`. The source-hygiene precepts (no-legacy, boundary, dogfood,
isomorphic-as-authored, inv-16) HOLD in the tree; the gate-regime precepts I installed are real for
the correctness tier but internally contradictory at the estate/CI scope, and two precepts are
entirely UNPOLICED. The five tensions are RESOLVED in J's charter, not inherited (`J.md §invariants`).

| Precept | J verdict | The decisive anchor |
|---|---|---|
| **no-legacy** | HOLDS for marker-word legacy; two RESIDUES the keyword grep misses → fold | `grep -rniE "deprecat\|legacy\|workaround\|hack\|FIXME\|TODO(" src/` → 0 (`audit/precepts.md §2-F6`). The grep is NOT exhaustive: stale DOCS = legacy → folds J.W5; and LS-9/10/11 are dead-SOURCE no-legacy items the marker grep cannot see (`LEGACY_PATH_D` is a name not a marker; the dead alias carries no token) → fold J.W1 (`audit/legacy-sweep.md` LS-9/10/11) |
| **no-workaround** | HOLDS (the B1 floor gone) — RE-ASSERTED for J | the scene-control-dfa flake dies via the per-expected-state gate, NOT a longer settleMs/continue-on-error/IN_CI escape (`J.md §MANDATE`) |
| **idiomatic + gestalt** | HOLDS (per-wave) | bind-proof FSM, `useRafScene` consolidation; UNPOLICED as a named gate |
| **isomorphic styling** | PARTIAL / the named exception | `proof:visual-lock` re-tiered to hygiene at I.W7; the J.W7a design deltas are DELIBERATE, enumerated, re-baselined in the same motion (J.W7b owns NO appearance delta and re-captures NO baseline — inv-16 sibling-coordination only) |
| **KISS vs the gate corpus (T1)** | **CONTRADICTORY in the tree — RESOLVED in J** | the "collapse the lattice" claim was authority-only; count GREW 103→109, 93 scripts / 35,227 LoC survive (`audit/precepts.md §2-F2`); J.W3 + the net-deletion rule finish the collapse it claimed |
| **gate-ORACLE precept** | HOLDS for the correctness tier (machine-enforced) | `proof:gate-is-runtime` polices the 10 correctness gates; **scope-limited** — it does NOT police hygiene-tier honesty (T3), and the deploy-gating gates are in NEITHER tier (`audit/wave-I.WZ-postclose.md §E`) |
| **chronic-closure / no-vaporware** | HOLDS + self-guarded | `proof:specular-absent-at-rest.mjs:51-54` ASSERTS `proof:specular-handoff` is DELETED; the vaporware-target failure mode is machine-forbidden |
| **inv-16 (T2)** | HOLDS — the engine un-fencing was the discovery of the PERMANENT boundary | glass-ui `~3.9.0` + value.js `0.11.2` PUBLISHED-consumed; `src/animation` is the kf PRODUCT (T2 resolved) |
| **props-destructure (T5)** | UNPOLICED + 6 live Vue-3.5 sites — NARROWED to its true kernel in J | `audit/precepts.md §2-F3`; J.W-scope: only a destructured prop passed INTO a composable is gated; template/watchEffect destructure is platform-idiomatic post-3.5 |
| **P6 CI device-independence** | born POST-close, ad-hoc (3 strategies, triplicated `IN_CI`) — FORMALIZED in J | `audit/wave-I.WZ-postclose.md §D`; J.W3 makes it mechanical (ONE helper, per-gate DECLARED posture, the third tier named) |

**The boundary-ORACLE extension (the J headline invariant).** The gate-ORACLE precept applies at
EVERY boundary the product crosses: the DEPLOY oracle is an observed green-CI→auto-deploy round-trip
serving the certified bytes; the PUBLISH oracle is the packed tarball's surface == the source's
public exports == the README's taught API; the DOCS oracle is every structural claim verifiable
against the tree; the AXES oracle is the live-session battery exercising the viewports/input-
modalities/preferences humans use. A boundary certified by hand, by paperwork, or at one viewport is
NOT certified.

---

## Open deferrals

**THE FUTURE chronic-closure parse substrate (for `proof:chronic-closure`).** This is the
consolidated J open-deferrals ledger built from `audit/deferred-ledger.md` + `J.md §fold bands`.
Every row carries born-tranche, chronicity count, disposition, owning wave, and the gate/evidence.

> **SUBSTRATE-TRANSITION NOTE (binding — read before treating this as authoritative).** Until
> **J.WZ**, this section is the AUTHORED-but-not-yet-active substrate; **`I/PROGRESS.md §"Open
> deferrals"` remains the authoritative parse target for `proof:chronic-closure`** through the J
> development + implementation phases. The substrate TRANSITION happens at **J.WZ**: the meta-gate's
> parse target moves from I's PROGRESS to THIS J ledger in the SAME motion the J ledger becomes
> authoritative (`J.md §WAVE MAP · J.WZ`). The transition is itself gated — per the chronic-closure
> meta-invariant, every J closure cell below cites a RUNTIME/BOUNDARY gate that was (or will be at
> impl) witnessed born-RED on a defect tree, and a HANDOFF row may target ONLY a PUBLISHED version or
> a kf-owned consume-edge, never a future version number / unreleased commit (the B7 vaporware
> lesson). The narrative bands §4a–§4i carry the full live-state probe + disposition; THIS table is
> the gate's parse target at and after J.WZ.
>
> **CHRONICITY COLUMN SHAPE (binding for the parse target).** Because this table is the future
> `proof:chronic-closure` parse substrate, the Chronicity cell MUST be machine-readable: every row
> leads with an explicit INTEGER tranche-span count, with the tranche-letter provenance following in
> parentheses as prose-for-humans (e.g. `7 (C,D,E,F,G,H,I)`, `3 (D,H,I)`). Whole-lineage spans render
> as their integer (`A…I` → `9 (A…I)`; `A→H` → `8 (A…H)`); a `recurring` item that never closed
> across the lineage renders as its best-known integer with the provenance kept (`9 (pre-A…I,
> recurring)`). The gate reads the leading integer ONLY; the parenthetical is for human audit. The
> ≥4-tranche EXIT-ONLY mandate (P-invariant-28) is enforced mechanically off that integer — so no cell
> may carry a bare non-numeric token the gate cannot read. Disposition vocabulary: **FOLD** (into a J wave) ·
> **RE-AFFIRM** (genuinely closed; do not re-litigate) · **VERIFY-ONLY** (claimed-closed; J re-runs)
> · **HANDOFF** (sibling-owned, paired with a born-RED kf gate or a published consume-edge) · **BOOK**
> (net-new, terminal home named) · **RECORD** (historical, terminal) · **KILL** (permanent, reasoned)
> · **USER-DOMAIN** (version owner Mike Babb, confirm-first).

| Item (chronic / deferral) | Born | Chronicity | Disposition | Owning wave | The gate / evidence (the closure oracle) |
|---|---|---|---|---|---|
| **scene-control-dfa** deploy-block + product lag ★ | I (post-close) | 1 (net-new at I close) | **FOLD (P0)** | **J.W0** | The OBSERVED green-CI→auto-deploy round-trip; born-RED on CI run `27228309606` trigger='null'-under-load; the `navToScene` per-expected-state predicate + the dock projection born-correct from the DFA (`audit/wave-I.WZ-postclose.md §C`) |
| **The 8-commit post-close tail** (no tranche home) | I (post-close) | 1 | **FOLD (P1)** | **J.W0** | The adoption wave records each commit's terminal disposition; `git log a4b1472..master` (`audit/wave-I.WZ-postclose.md §A`) |
| **`proof:all` ≠ CI roster** (GC-2/F5/§E) ★ | I | I (1), re-found J | **FOLD (P0)** | **J.W3** | The two-way `proof:ci-coverage` equivalence clause; `proof:all`==CI proven both ways (`audit/gate-census.md` GC-2, `audit/wave-I.WZ-postclose.md §E`) |
| **`IN_CI` triplication / 3 strategies** (WZ-5/CICD-3) | I (post-close) | 1 | **FOLD (P1)** | **J.W3** | ONE `scripts/lib` `IN_CI`+`observe()` helper; the per-gate DECLARED-posture hygiene clause (`audit/wave-I.WZ-postclose.md §D`) |
| **The un-executed collapse** (PRE-1/F2) ★ | I | I (1) | **FOLD (P1)** | **J.W3** | Gate COUNT + estate LoC measured strictly DOWN (net-deletion rule); 103→109 / 93 scripts / 35,227 LoC today (`audit/precepts.md §2-F2`, `audit/gate-census.md`) |
| **ENG-1 sibling per-card serializer** (latent B1-class) ★ | I | I (1) | **FOLD (P1)** | **J.W1** | The EDITOR per-card pane round-trips a var()-bearing animation; the sibling DOM-resolving path dies in the same motion (`audit/engine-core.md` ENG-1) |
| **ENG-2 `createFrame` `[undefined]!` deref** | I | I (1) | **FOLD (P1)** | **J.W1** | `seekPreviousValue` made total (typed error or honest fallback); born-RED unit on the pre-fix tree (`audit/engine-core.md` ENG-2) |
| **SEAM-1/2/4 the seam guards + the value.js pin** | I | I (1) | **FOLD (P1)** | **J.W1** | The garbage-selector typed-error live-console assert; the kf-side `parseCSSValueUnit("")` pin reds on a value.js regression; the rotate()-round-trip de-vacuoused (`audit/parsing-units-valuejs-seam.md` SEAM-1/2/4) |
| **SEAM-3 round-trip fixture trio** (var()/calc()/matrix3d()) | I | I (1) | **FOLD (P2)** | **J.W1** | The `proof:roundtrip-fidelity` corpus (`test/fixtures/keyframes/manifest.json`) gains a `var()` + `calc()` + `matrix3d()` fixture each — serialize-from-template round-trips them verbatim but the corpus covers NONE (the de-vacuousing must be all three, not var() alone) (`audit/parsing-units-valuejs-seam.md` SEAM-3) |
| **LS-9/10/11 dead-source no-legacy sweep** (no marker word) | I | I (1) | **FOLD (P2)** | **J.W1** | Dead-source REMOVAL in the engine-totality motion (no-legacy beside replacement): LS-9 the `ScenePlaybackState` back-compat alias (`stores/sceneMachine.ts:62-64` + `stores/index.ts:42`, zero consumers outside `stores/`) deleted; LS-10 the dead `./animationStores` comment (`stores/index.ts:1-3`) deleted; LS-11 `LEGACY_PATH_D` (`demo/motion-path/motionPathGeometry.ts:76`, zero importers) UNexported — grep-confirmed dead, NOT carrying a legacy/deprecated token (`audit/legacy-sweep.md` LS-9/10/11) |
| **W4-3/W4-4 drag seam residue** (B6 latent class) ★ | I | I (1) | **FOLD (P1)** | **J.W2** | `proof:drag-gesture` extended to EasingCurveCanvas + PlaybackRibbon (real `page.mouse` drag, no text-selection) (`audit/wave-I.W4.md`) |
| **DS-1 / S4-stretch selectedControl single-writer** | I | I (1) | **FOLD (P1)** | **J.W2** | A live scene sweep asserts the rendered control surface == the DFA projection on every entry; the CubeScene rogue write dies; the no-rogue-writer grep corroborator (`audit/demo-scenes.md` DS-1) |
| **M2 mobile sheet re-open scroll latch** | I (CH-3 leg) | D→I (3, via CH-3) | **FOLD (P1)** | **J.W2** | open→close→RE-OPEN on 390×844 scrolls to content; `isPanelTransitionDone` off the spring settle, not CSS `transitionend` |
| **CD-1 `AnimationMenuBar → TransportDock`** (D overclaim) ★ | D | D→I (terminal) | **FOLD (P1)** | **J.W2** | The rename executed (the D FINAL inv-ε overclaim terminated); grep 0 for the old name (`audit/demo-scenes.md` CD-1) |
| **LS-20 `as any` casts → typed** (no-legacy type hygiene) | I | I (1) | **FOLD (P2)** | **J.W2** | The `as any` escapes replaced with the available typed alternatives in the demo-seam motion: `demo/easing/useEasingDemo.ts:89,389` + 4 `AnimationControlsGroup.vue` casts (`audit/legacy-sweep.md` LS-20) |
| **FVT-2/INVE-2 live-session axes** ★ | I | I (1) | **FOLD (P1)** | **J.W4** | The MOBILE/REDUCED-MOTION/DARK/KEYBOARD legs each born-RED-able against a PLANTED defect; the scene-sweep widened (`audit/final-vs-tree-inv-epsilon.md` INVE-2/P0-2 — the J INVE-N alias ≡ the lane's P0-N) |
| **CH-3 mobile chronic** (desktop-certified) ★ | D(D10) | D,H,I (3) | **FOLD (P1)** | **J.W4** | CH-3 re-certified on a MOBILE oracle — `sheet.bottom ≤ menubar.top` measured ON the 390×844 viewport; bites on a planted occlusion |
| **EP-3 flip/drag/draw-svg uncovered exports** | I | I (1) | **FOLD (P1)** | **J.W4** | A demo home + live-session coverage, or a recorded BOOK with the uncovered-export list in `proof:published-surface` (`audit/engine-periphery.md` EP-3) |
| **SCOPE-1 the 16-export orchestration tier** (unpublished) ★ | E→I | E,F,G,H,I (5) | **FOLD (P1)** | **J.W5** | `proof:published-surface`: the tarball surface == the source exports == the README API; born-RED on the current tree's untaught exports (`audit/scope-adversary.md §0`) |
| **The doc-rot band** (LS-1..8 / SEAM-0 / CLAUDE.md) | I | I (1) | **FOLD (P1)** | **J.W5** | root CLAUDE.md REWRITTEN to the tree (the real 28-module animation tree, the real 69-file test count); the README examples EXECUTE against the built dist (`audit/legacy-sweep.md`, `audit/deferred-ledger.md §H`) |
| **BP-1 `_redirects` in the npm tarball** | I | I (1) | **FOLD (P1)** | **J.W5** | `proof:published-surface`: `npm pack --dry-run` contents == declared files (no `_redirects` leak); reds today (`audit/build-packaging-release.md` BP-1) |
| **ENG-6 AnimationEngine interface drift** | I | I (1) | **FOLD (P2)** | **J.W5** | The hand-maintained interface drift-gated; born-RED on a planted interface drift (`audit/engine-core.md` ENG-6) |
| **The design protagonist + grammar band** (8 panes) | I | I (1) | **FOLD (P1)** | **J.W7a** | Per-finding RUNTIME asserts: subject `--ball-tone`==icon hue; mobile hero/subject overlap==0px; the ghost rail ABSENT; amiga rounded-glass computed style (`audit/design/pane-*.md`, `audit/design/cross-hierarchy.md`) |
| **CP-1 the two-colour-system drift** (`--ball-tone` seam) | I | I (1) | **FOLD (P1)** | **J.W7a** | The `.progress-ball` `--ball-tone` parameterization (NOT 8 per-scene overrides); the aquamarine literal dies; computed `--ball-tone`==icon hue per scene (`audit/design/cross-color-pops.md` CP-1) |
| **TYP-2 the display-voice concentration** | I | I (1) | **FOLD (P1)** | **J.W7a** | The Instrument Serif display register present at the named scene-identity moments (computed font-family resolves it); the math readouts at the MetricBadge/AnimatedDigit PROMOTION rungs (`audit/design/cross-typography.md` TYP-2) |
| **W6-3 / S3 substrate-depth legibility** (the glass reads as glass) | I | I (1) | **FOLD (P1)** | **J.W7a** | An un-homed FOLD-tagged P1 the harden-lane caught: S3 was a perpetual punt with NO terminal home — deferred NON-BLOCKING (M-2), never KILLed, not assigned to a J wave (`audit/wave-I.W6.md §6`, `impl/I.W6.md:36`). Its natural home is the W7a glass-identity band (adjacent the amiga slab XH-3): a legibility/glass-substrate runtime assert — the page substrate computes as refracting glass, NOT a near-white plate. The bloom-removal correctness is closed (clause a, GREEN); this folds the appearance-depth residue P-invariant-28 forbids leaving un-rowed |
| **STY-1..6 + the consume-to-delete band** | I | I (1) | **FOLD (P1/P2)** | **J.W7b** | SegmentedTabs/ToggleChip/ScrubberTimeline/.fade-slide PRM consumed-to-delete in the SAME motion the published glass-ui primitive is consumed; gold-shimmer dedup STY-1 (`audit/styling-design-system.md`, `audit/design/glassui-adopt.md`) |
| **FB-2 async sync-step half** ★ | F | F,G,H,I (4) | **FOLD — EXIT-ONLY** (probe-or-KILL) | **J.W6** | Author `proof:event-ordering`, measure the sync-step half, LAND-or-KILL on the numbers; `engine.ts:840 async advanceTo` still async (`audit/deferred-ledger.md §3`) |
| **SoA `lerpArray`** ★ | E(G-2) | E,F,G,H,I (5) | **FOLD — EXIT-ONLY** (bench-or-KILL) | **J.W6** | Bench on the real-K corpus, ADOPT-or-KILL; `lerpArray` grep=0 in `src/` (`audit/perf-frontier.md`, `audit/deferred-ledger.md §3`) |
| **FB-5 intrinsic-size `0→auto`** ★ | E/F | E,F,G,H,I (5) | **FOLD — EXIT-ONLY** (verify-Baseline-or-KILL) | **J.W6** | Verify cross-engine Baseline as of the impl date; BOOK-with-date or KILL; no `interpolate-size`/`calc-size` path (grep=0) (`audit/deferred-ledger.md §3`) |
| **FB-6 `Mod+K` palette** ★ | F | F,G,H,I (4) | **FOLD — EXIT-ONLY** (owner-or-KILL) | **J.W6** | Owner decided; BUILD-or-KILL; only a CSS ref, no `CommandPalette`/`cmdk` component (`audit/deferred-ledger.md §3`) |
| **PF-1 Three.js named imports** | I | I (1) | **FOLD (MEASURE-FIRST)** | **J.W6** | Measured before/after bundle delta across the 4 amiga consumers (est. 100-200 KB) (`audit/perf-frontier.md` PF-1) |
| **PF-3 Monaco static-edge / EF-3 parseLinearStops shim** | G/I | I (1) | **FOLD (VERIFY)** | **J.W6** | Monaco static-edge re-verified on a fresh build; `parseLinearStops` retirement vs `linear()` Baseline 2026-06-11 + value.js E1 status (`audit/perf-frontier.md`, `audit/engine-periphery.md` EF-3) |
| **CH-5/B1+B5 `"......"` crash** ★ | A(W0)→H | A,H,I (3) | **VERIFY-ONLY** (TERMINATED) | J.W1 (re-run) | `parseCSSValueUnit("")=>{value:0}` no throw (node probe, value.js 0.11.2); `proof:engine-no-throw-on-play` present — re-run on built dist (`audit/deferred-ledger.md §1-A`) |
| **CH-6/B2 `_gen` DFA suspend crash** | H | H,I (2) | **VERIFY-ONLY** (TERMINATED) | J.W2 (re-run) | bind-proof RAFPlayback + `useRafScene`; `proof:fsm-suspend-resume-live` present |
| **CH-7/B4 lost easing editor** | H | H,I (2) | **VERIFY-ONLY** (TERMINATED) | J.W2 (re-run) | unified `EasingEditor.vue` present; `proof:easing-editor-live` present — but the scene-control-dfa lag partially undercuts the single-authority claim (→ J.W0) |
| **CH-8/B3 amiga floats** | H | H,I (2) | **VERIFY-ONLY** (TERMINATED) | J.W4 (re-run) | subject=pivot geometry; content-visibility shed; `proof:amiga-subject-is-pivot` present |
| **CH-9/B6 square drag** | H | H,I (2) | **VERIFY-ONLY** (TERMINATED) | J.W2 (re-run) | shared `useDragScrub`; `proof:drag-gesture` present (extended in J.W2) |
| **CH-10/B9+K dev ENOENT + title** | H | H,I (2) | **VERIFY-ONLY** (TERMINATED) | J.W4 (re-run) | one build root, `<title>keyframes.js</title>` (`demo/app/index.html:14`); `proof:icon-paint-live` present |
| **CH-1/B7 specular sheen** ★ | D(D14)→H | D,H,I (3) | **VERIFY-ONLY** (TERMINATED) | J.W4 (re-run) | glass-ui `3.9.0` consumed; `proof:specular-absent-at-rest` present; `proof:specular-handoff` DELETED (self-guard `:51-54`) |
| **CH-2 φ-hero typography** | D(D7) | D,H,I | **RE-AFFIRM** (do not re-litigate) | — | not re-flagged; corroborated by the live-session body-typography leg (`audit/deferred-ledger.md §1-A`) |
| **CH-4 dock (D5 lag + D9 popover)** ★ | D(D5/D9) | D,H,I (3) | **RE-AFFIRM** D5/D9; felt-dock → B1+M3+perf | — | `proof:perf-frame-budget` + `proof:dock-popover-opens` present; the felt "broken dock" decomposes into B1 + M3 + RC-2 |
| **DC-8 scene-swap VT dead-CSS** ★ | A | A,C,(D),H,I (≥4) | **VERIFY-ONLY** (TERMINATED — the one A→I chronic that finally died) | — | LIVE `startViewTransition` consumer (`useSceneTransition.ts:2,32`); the fourth-defer prohibition HONORED (`audit/deferred-ledger.md §C`) |
| **value.js empty-input contract** (B1 value-half) | I | I (1) | **VERIFY-ONLY** (LANDED + PUBLISHED) | J.W1 (pin) | `@mkbabb/value.js ^0.11.2` installed; contract holds (node probe); kf-side pin AUTHORED in J.W1 |
| **glass-ui specular consume-edge** (B7) ★ | H | H,I (2) | **VERIFY-ONLY** (LANDED — published 3.9.0) | — | pin `~3.9.0`; the `::before{content:none}` workaround REJECTED |
| **C-1 value.js next-slice** (VJ-1..9; the EF-5 charter-v2 / tranche-M status) ★ | C | C,D,E,F,G,H,I (7) | **OUT / sibling-HANDOFF — BOOK-reaffirm** (chronic-by-design) | — | rides the next re-pin, ZERO kf edit; `parseLinearStops`/`getPointAtLength`=undefined in 0.11.2 → correctly OPEN (`audit/deferred-ledger.md §1-D`). NOT a J wave. **Named OUT-band follow-up (EF-5):** the value.js charter-v2 (Band V) proposals A→VJ-F4 are UNPUBLISHED; J re-confirms the value.js **tranche-M** status at re-pin and points at `valuejs-sota-handoff-v2.md` — the named verify-action is not dropped under the VJ-1..9 umbrella (`audit/recap-EF.md` EF-5, `F/FINAL.md:89-93`) |
| **VJ-4 / MCI-5 identity-pad witness** | C | — | **OUT / sibling-HANDOFF — BOOK-reaffirm** | — | `test/interpolate-anything.test.ts:256` `it.fails(` still present (GREEN = not consumed); flips RED on land |
| **PT-1 parse-that packrat re-key** | G(LD-PT) | G,H,I (3) | **OUT / sibling-HANDOFF** (gate-first BOOK) | — | parse-that `^0.9.0`; WITHHELD, zero prod consumers; author `proof:packrat-position` first |
| **FB-3 MorphSVG consumer** ★ | C(C-5) | C,F,G,H,I (5) | **OUT / sibling-HANDOFF — BOOK-reaffirm** (gated on value.js sampler) | — | `fromDrawSVG` landed; `getPointAtLength`/`fromMorphSVG` gated on value.js VJ-F1 (the one real competitor gap) |
| **GH-4/FB-4 `{types}` directional VT** | G | G,H,I (3) | **OUT / sibling-HANDOFF — BOOK** | — | glass-ui-owned; the demo VT consumer EXISTS but no `{types}` directional pass; folds only IF J elects scene interactivity |
| **G-3 LabeledField orientation** | G | G,H,I (3) | **OUT / sibling-HANDOFF** | — | glass-ui-owned; kf demo-side `grid-cols-[auto_1fr]` exists |
| **glass-ui typography opt-in ASK** | I | I (1) | **OUT / sibling-HANDOFF** (AX) | J.W7b (handoff doc) | kf reclaim LIVE at `style.css:113 --font-stack-text`; the opt-in is a glass-ui-side flag |
| **dock double-click** (memory) | pre-A (glass-ui root) | 9 (pre-A…I, recurring) | **OUT / sibling-HANDOFF — VERIFY-ONLY** | — | glass-ui root fix landed; the demo no longer carries the transition-intercept workaround (`AnimationMenuBar.vue:106`) |
| **The glass-ui REFINE+ABSTRACT ledger** (25+21) | I | I (1) | **OUT / sibling-HANDOFF** (AX, consumed on publish) | J.W7b (`glassui-AX-handoff.md`) | The curve-editor/control-point primitive, the rail/ball idiom, the status-badge tone recipe → AX; kf consumes only what AX PUBLISHES (`audit/design/glassui-abstract.md`) |
| **DEP-1 CNAME / DEP-2 template / DEP-3 roster** | G | 3 (G,H,I) | **OUT / sibling-HANDOFF** (deploy-owned) | J.W6 (DEP-1 confirm only) | sibling-owned; J.W6 confirms DEP-1 only (`audit/deferred-ledger.md §1-F`) |
| **GH-secret creds vs sibling-.env bypass** | I | I (1) | **OUT — VERIFY-ONLY** (J confirms GH secrets) | J.W0 | `deploy-pages.yml:66-67` consumes `CLOUDFLARE_API_TOKEN/ACCOUNT_ID`; J confirms they exist + match the CF account (`audit/wave-I.WZ-postclose.md §F`) |
| **INVE-1 the I FINAL deploy-claim gap** | I | I (1) | **RECORD** (cured by J.W0's observed oracle) | J.W0 | the "merge → green CI → auto-deploys" claim was impossible when written (ci.yml YAML-invalid) (`audit/final-vs-tree-inv-epsilon.md` INVE-1/P0-1 — the J INVE-N alias ≡ the lane's P0-N) |
| **INVE-4/5 stale-snapshot drift in I's FINAL** | I | I (1) | **RECORD** (terminal) | — | recorded historical drift; no re-propagation (`audit/final-vs-tree-inv-epsilon.md`; the INVE-4/5 aliases are J-level coinages — no corresponding P0-N/P1-N label in the lane) |
| **I.WZ.md DEFERRED-BY-USER vs FINAL SUPERSEDED** | I | I (1) | **RECORD** (FINAL authoritative; tree disambiguates) | J.W5 (1-line note) | `I.WZ.md:90` vs `FINAL.md:244`; the fix SHIPPED (`audit/wave-I.WZ-postclose.md §G`) |
| **I/PROGRESS.md §0 stale d469e69 revert rec** | I | I (1) | **RECORD** (FINAL discloses; do not re-propagate) | J.W5 (pointer-only annotation) | `I/PROGRESS.md:47-52`; FINAL §8 discloses it obsolete (`audit/deferred-ledger.md §H`) |
| **`d469e69` SUPERSEDED-BY-FIX-SHIP** | I | I (1) | **RECORD** (unchanged) | — | the deploy EXECUTED; revert not needed (`audit/recap-I-session.md (c)`) |
| **release.yml never run** | H | H,I (2) | **RECORD** + decide (does release gate on correctness?) | J.W0/WZ | `release.yml:21 tags: v*.*.*`; INDEPENDENT of dead ci; never fired (`audit/wave-I.WZ-postclose.md §F(g)`) |
| **`yaml` package unresolved** (ELSPROBLEMS) | I (post-close) | 1 | **BOOK/VERIFY** (declare devDep or accept regex fallback) | J.W3 | `npm ls yaml` ELSPROBLEMS; the yaml-valid clause `import("yaml")` (`audit/wave-I.WZ-postclose.md §B`) |
| **GH-3/W7-5 stale retired-gate refs + phantom no-route-storm** | I | I (1) | **FOLD (P2)** — stale docs are legacy | J.W3 | ci.yml comments name deleted gates; `no-route-storm` docstrings (`audit/gate-census.md` GC-6) |
| **C-6 engine line-ceiling watch** ★ | D | D,E,F,G,H,I (6) | **VERIFY-ONLY** (CONTAINED — gated, 25 lines headroom) | J.W1 (respects ceiling) | `engine.ts`=1375; cap 1400 (`proof-decomposition.mjs:132`); a standing gate, not a punt |
| **tryParseCache eviction** (F3/VJ-7) ★ | C(C-3)/F | C,F,G,H,I (5) | **BOOK-reaffirm** (bound lives in value.js VJ-7) | — | `utils.ts:203` unbounded Map; kf BOOK, value.js-owned bound |
| **FB-1 animation-composition HONORING** | F | F,G,H,I (4) | **BOOK-reaffirm** (SHIP-if-elected) | — | no WAAPI composite honoring; CAPTURE-only (`audit/deferred-ledger.md §1-E`) |
| **VJ-F2 / LD-DIAG diagnostics sink** | F | F,G,H,I (4) | **BOOK-reaffirm** (folds with VJ-5 sink) | — | `ResolvedKeyframes` exists, no `diagnostics` field (`adapter.ts:18`) |
| **A7 cube idle-bob CSS dogfood** | A | 9 (A…I) | **BOOK-reaffirm** (cohesion, not a defect) | — | raw `@keyframes idle-bob` at `CubeTarget.vue:214` |
| **A9 matrix `acos` Euler recovery** | A | 9 (A…I) | **BOOK-reaffirm** (latent; DECOMPOSE on touch) | — | LIVE `Math.acos` at `useTransformState.ts:61-63`; latent (cube never scales) |
| **managed-pause doc** | D | D…I | **RECORD** (resolved) | — | NOW DOCUMENTED — `src/animation/CLAUDE.md` "Managed-child lifecycle" |
| **ARCH kills** (K-1..K-9, D1, SUP-7) | A→H | 8 (A…H) | **KILL-reaffirm — RECORD permanent** (no consumer pull A→I) | — | ScrollTimeline-native, Worker/OffscreenCanvas/Houdini, WASM-parser, Typed-OM carrier, per-property easing, bit-packing, dev.sh/deploy.sh, ValueUnit monomorphization (`audit/deferred-ledger.md §G`) |
| **`proof:repin-safe` stale-by-construction** | G | G…I | **KILL** (no-legacy applies to gates) | J.W3 | one-shot G.W1 pre-stage gate targeting value.js 0.11.1/parse-that 0.9.0; the re-pin is done (`audit/gate-census.md` GC-5) |
| **The two patch changesets** ★ | H + I | H,I (2) | **USER-DOMAIN** (the honest minor, confirm-first) | J.W5/J.WZ | both `.changeset/tranche-{h,i}.md` present, both `patch`; coalesce in one `changeset version` off 4.1.0; H's subsumed (`audit/wave-I.WZ-postclose.md §F(g)`) |
| **The npm publish + close-merge deploy** | I | I (1) | **USER-DOMAIN** (Mike Babb, confirm-first) | J.WZ | the version cut + publish + deploy round-trip RE-observed on the close merge |

★ = chronically deferred (≥2 tranches) — the J fold-or-KILL mandate applies.

### 4a — The four ≥4-tranche riders (EXIT-ONLY — no fifth ride; P-invariant-28)

These four have ridden ≥4 tranches as bare BOOK/MEASURE-FIRST with NO probe authored. Per
P-invariant-28, continuing them a fifth time as "BOOK" IS the perpetual punt the invariant forbids
(`audit/deferred-ledger.md §3`). Each EXITS J via a MEASUREMENT ARTIFACT or a reasoned KILL — never a
sixth deferral. The J close ledger must carry ZERO rows tagged MEASURE-FIRST without a measurement.

| Rider | Born | Tranches | TREE state TODAY | EXIT-ONLY disposition (J.W6) |
|---|---|---|---|---|
| **FB-2 async sync-step half** | F | F,G,H,I (4) | `engine.ts:840 async advanceTo` + `group.ts:469` still async | Author `proof:event-ordering`, measure the sync-step half → **LAND-or-KILL on the numbers** |
| **SoA `lerpArray`** | E(G-2) | E,F,G,H,I (5) | absent — `lerpArray` grep=0 in `src/` | Bench on the real-K corpus → **ADOPT-or-KILL** (the bench must BITE) |
| **FB-5 intrinsic-size `0→auto`** | E/F | E,F,G,H,I (5) | no `interpolate-size`/`calc-size` path (grep=0) | Verify cross-engine Baseline as of the impl date → **BOOK-with-date or KILL** |
| **FB-6 `Mod+K` palette** | F | F,G,H,I (4) | only a CSS ref; no `CommandPalette`/`cmdk` component | Owner decided → **BUILD-or-KILL** |

### 4b — The RE-AFFIRM band (genuinely closed; do NOT re-litigate)

| Item | Why genuinely closed | Evidence |
|---|---|---|
| **CH-2 φ-hero typography (D7)** | not re-flagged; the model close (enforced 0 leaves + the hero rung) | corroborated by the live-session body-typography leg |
| **CH-4 dock spring D5 + popover D9** | D5 spring genuinely settled (120fps, widthWrites:0); D9 popover gated | `proof:perf-frame-budget` + `proof:dock-popover-opens` present; the felt "broken dock" decomposes into B1+M3+RC-2 |
| **DC-8 scene-swap VT (RESTORED)** | the LIVE `startViewTransition` consumer — NOT dead; the one A→I chronic that finally terminated | `useSceneTransition.ts:2,32`; J verifies the grep stays 0, no re-open |
| **The I crash chronics CH-5..CH-10** | their gates verified present + actuating by the inv-ε lane | the 10 correctness gate keys in `package.json proof:correctness`; J RE-RUNS, does not re-derive |

### 4c — The OUT / sibling-HANDOFF band (gate-first, never kf-patched — inv-16)

| Item | Owner | Disposition |
|---|---|---|
| **value.js next-slice (VJ-1..9)** | value.js | chronic-by-design; rides the next re-pin ZERO kf edit; the `it.fails` MCI-5 witness IS the consume signal |
| **parse-that `(id,offset)` packrat re-key (PT-1)** | parse-that | WITHHELD; author `proof:packrat-position` first |
| **The glass-ui design ledger (25 REFINE + 21 ABSTRACT)** | glass-ui (AX) | all AX-owned, consumed on PUBLISH → `glassui-AX-handoff.md`; headlined by the CurveEditorCanvas/control-point primitive, the rail/ball pair, the status-badge tone recipe |
| **glass-ui typography opt-in lever / LabeledField orientation / `{types}` VT helper / cartoon-surface radius** | glass-ui (AX) | sibling-owned; the kf demo-side edges already hold |
| **DEP-1/2/3 deploy** | deploy-repo | J.W6 confirms DEP-1 (CNAME) ONLY — verify, do not write |

### 4d — The RECORD band (historical, terminal — do not re-litigate or re-propagate)

| Item | Disposition |
|---|---|
| **INVE-1 the I FINAL deploy-claim gap** | RECORD — cured by J.W0's observed oracle (the claim was impossible when written) |
| **INVE-4/5 stale-snapshot drift in I's FINAL** | RECORD — terminal |
| **`d469e69` SUPERSEDED-BY-FIX-SHIP** | RECORD — the deploy EXECUTED; the revert was not needed (FINAL authoritative over the I.WZ spec's DEFERRED-BY-USER) |
| **I/PROGRESS.md §0 stale revert recommendation** | RECORD — FINAL §8 discloses it obsolete; J does NOT re-propagate (J.W5 adds a pointer-only annotation) |
| **release.yml never run** | RECORD + decide at J.W0/WZ whether release should ALSO gate on `proof:correctness` |
| **GH-8 / EF-1/2 historical residues** | RECORD — terminal (`J.md §RECORD band`) |

### 4e — The KILL band (permanent, reasoned)

| Item | KILL reason |
|---|---|
| **`proof:repin-safe`** | stale-by-construction — a one-shot G.W1 pre-stage gate; the re-pin it gated is long done; no-legacy applies to gates (J.W3) |
| **The ARCH kills** | ScrollTimeline-native-REPLACE, Worker/OffscreenCanvas/Houdini, WASM-parser, Typed-OM carrier, per-property easing, bit-packing, dev.sh/deploy.sh, ValueUnit monomorphization — no consumer pull A→I; carry forward un-re-litigated |

### 4f — The USER-DOMAIN band (version owner Mike Babb, confirm-first)

| Item | Disposition |
|---|---|
| **The version cut** | the honest MINOR off 4.1.0, consuming both pending changesets (H's patch subsumed — never published) |
| **The npm publish** | USER-DOMAIN at J.WZ, confirm-first |
| **The close-merge deploy** | the auto-deploy round-trip RE-observed on the close merge (the J.W0 oracle re-witnessed on the close itself) |

### 4g — The prompt recap (no drops)

The five lineage lanes (`audit/recap-{AB,CD,EF,GH,I-session}.md`) re-verified every recorded prompt
A→I against the TREE: **55 of 65 rows ADDRESSED**; the 10 PARTIAL/GATED rows each own a J home or a
sibling gate. CD-1 → J.W2; the CI-on-Linux follow-up → J.W0; the changeset/publish → J.W5/WZ; the
F.W8 composition-honoring → the FB-1 BOOK re-affirmed; the four sibling-gated rows stay HANDOFF with
their born-RED kf gates. **No prompt is dropped; every PARTIAL has a J home or a sibling gate**
(`J.md §chronic + deferred fold`). The standing development mandate + the standing orchestration
directive RE-ENTER J's charter VERBATIM (they are the project's durable spine, not I-specific).

---

## §5 — HONEST ALREADY-DONE (manufacture NO J work here — inv ε)

The honest ledger names what genuinely holds, so the waves do not re-litigate the sound parts
(`J.md §Honest already-done`, `audit/*` per-lane "what holds"):

- **The I waves delivered their specs at the gestalt seam** — all 8 plan-vs-delivery lanes record
  zero silent narrowing beyond the named residues.
- **The two-tier taxonomy + both meta-gates are REAL and machine-enforcing at desktop-1440** — the
  10 actuating correctness gates are honest; the 5 H proxy gates + the vaporware `specular-handoff`
  IOU are genuinely DELETED (`audit/gate-census.md` GC-9).
- **value.js 0.11.2 + glass-ui 3.9.0 are published-consumed (lockfile-verified)** — no `file:`
  siblings; the B1 empty-input contract + the B7 flat-default both LANDED.
- **The release pipeline (`release.yml`, tag-triggered) is structurally sound** and was never
  affected by the dead CI (it triggers on tags, independent of the `ci` workflow).
- **The engine-core decomposition (FrameCompiler/engine/playback/group) is the right seam** — `tick`
  means one thing, snap is symmetric, zero legacy re-exports (`audit/engine-core.md`).
- **The mono/φ-ladder typography system + the icon family are well-built** — the suffusion wave
  AMPLIFIES them, it does not repair them.
- **`scripts/pages-deploy.sh` + deploy-pages.yml + GH-secrets is the right deploy design** — it needs
  VERIFICATION (J.W0), not replacement.
- **The shell chrome (dock + transport + icons) is single-voiced and strong.**
- **DC-8 was RESTORED, not punted** — the twice-deferred dead-CSS terminated via a LIVE VT consumer.

---

## §6 — inv-16 / inv ε compliance + the J-tranche invariants

- **This development phase wrote ONLY docs under `docs/tranches/J/**`** — zero source/test/CI/demo
  edits, no git commit beyond docs. The deliverable is `J.md` + the wave specs (all ten on disk:
  J.W0/W1/W2/W3/W4/W5/W6/W7a/W7b/WZ) + `PATH-FORWARD.md` + this board + `glassui-AX-handoff.md`
  (AUTHORED on disk with J.W7b), atop the 46-doc audit corpus.
- **inv-16 / the permanent engine rule (T2 resolved):** `src/animation` is the kf PRODUCT — in scope
  whenever runtime correctness or measured elegance requires; the fence is against SIBLING forks
  only. glass-ui/value.js/parse-that are consumed PUBLISHED; every glass-ui design item is a HANDOFF
  to AX or a consume-edge of a published version, never a kf-side patch.
- **inv ε (the close cannot overclaim):** every claim in this board cites an audit lane doc §, a
  `file:line`, or a command + observed output recorded in the lanes — no chain-of-trust over a prior
  FINAL. The two inv-ε gaps the audit found in I's FINAL (the deploy-mechanism claim impossible when
  written — INVE-1/P0-1; the breadth-of-human-surface claim — INVE-2/P0-2; the J INVE-N alias ≡ the
  lane's P0-N in `audit/final-vs-tree-inv-epsilon.md`) are exactly what J.W0 and J.W4 exist to make
  true. J's FINAL is held to the same standard: each boundary claim cites its OBSERVED oracle.
- **The boundary-ORACLE extension (the J headline invariant):** the gate-ORACLE precept applies at
  every boundary the product crosses (DEPLOY / PUBLISH / DOCS / AXES). A boundary certified by hand,
  by paperwork, or at one viewport is NOT certified. Each J wave's headline gate ACTUATES the running
  product (or the named boundary oracle for boundary waves); hygiene clauses corroborate only and are
  labeled.
- **P6 — the CI device-independence boundary (now charter law):** CI hard-gates device-INDEPENDENT
  correctness; device-DEPENDENT measurements hard-gate ON-DEVICE and run OBSERVE-ONLY in CI, declared
  per-gate through ONE shared helper (J.W3). The taxonomy names this third state explicitly —
  "proof:correctness GREEN in CI" must never be over-read as the felt budget holding in CI.
- **The net-deletion rule for the estate (T1 resolved):** gate work may not GROW the estate; any wave
  touching `scripts/` leaves gate COUNT and estate LoC equal-or-lower, with the shared lib as the
  mechanism (J.W3). The I "collapse" claim is reckoned honestly: I ADDED the session gate and
  relabeled the lattice; J completes the collapse it claimed (the count GREW 103→109; 93 scripts /
  35,227 LoC survive today — `audit/precepts.md §2-F2`, `audit/gate-census.md`).
- **The five precept tensions are RESOLVED in the charter, not inherited** (`audit/precepts.md §3`):
  T1 (KISS) via the net-deletion rule + J.W3; T2 (inv-16 vs engine) via the permanent engine rule;
  T3 (surviving proxies) via the honest re-labeling in J.W3 (`scene-machine-irrefragable` →
  reducer-algebra unit oracle; `visual-lock` → appearance-drift tripwire); T4 (meta-gate
  one-directionality) via deriving the roster FROM `proof:correctness` membership; T5
  (props-destructure vs Vue 3.5) NARROWS to its true kernel (the composable-passed prop), with the
  memory file updated at J close (flagged USER-VISIBLE at WZ).
- **P-invariant-28 at the J level:** every carry in §"Open deferrals" exits with a J disposition; the
  four ≥4-tranche riders are EXIT-ONLY (probe-or-KILL, no fifth ride); the net-new `scene-control-dfa`
  chronic the I FINAL could not enumerate is FOLDED P0 into J.W0; zero perpetual punts.
- **The chronic-closure substrate transition is itself gated at J.WZ:** until then `I/PROGRESS.md`
  stays authoritative for the meta-gate; the J ledger becomes the parse target in the SAME motion it
  becomes authoritative, every closure cell citing a runtime/boundary gate witnessed (or to be
  witnessed at impl) born-RED on a defect tree.
- **Version owner:** Mike Babb (`mike@babb.dev`). The library bump (the honest minor off 4.1.0,
  consuming both pending changesets), the npm publish, and the close-merge deploy are USER-DOMAIN,
  confirm-first, at J.WZ — after the J.W0 deploy boundary earns its first OBSERVED green-CI→auto-deploy
  round-trip.
