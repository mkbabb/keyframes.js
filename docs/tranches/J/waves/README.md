# Tranche J — THE WAVES (the boundary-integrity extension + the latent-seam closure)

**Branch:** `tranche-j-dev` (forked off `master` @ `4072af9` = the I-close tip + the adopted
post-close CI/deploy tail; clean tree; kf `4.1.0`-base; value.js `^0.11.2`, glass-ui `~3.9.0`,
parse-that `^0.9.0` consumed PUBLISHED).
**Type:** TRANCHE DEVELOPMENT — these are the wave SPECS. No source/test/CI/demo is fixed
here; no commit beyond docs is made. The deliverable is `docs/tranches/J/**`.
**Charter inputs (read FIRST, in this order):** `J.md` (the BINDING charter — wave
allocation, the invariant set, the DAG, the precept spine, the boundary-ORACLE extension,
the fold bands; `J.md §The WAVE MAP` is the only authority for this index's wave set + DAG),
then the audit corpus — the 32 systemic lanes (`audit/*.md`) + the 14 design lanes
(`audit/design/*.md`) over the checked-in 48-screenshot corpus (`audit/design/screenshots/`,
captured by `scripts/capture.mjs`, zero console errors). The spine companions: `PATH-FORWARD.md`
(the executive summary), `PROGRESS.md` (the board + the J open-deferrals chronic ledger).

---

## §0 — WHY THIS TRANCHE EXISTS (the boundary blindspot, in one paragraph)

Tranche I bound the gate oracle to the running product, recovered nine live breakages
(B1–B9 + K) behind ACTUATING runtime gates, installed `proof:live-session` +
`proof:gate-is-runtime` + the two-tier taxonomy, and made "green" mean *a human using the
product at one desktop viewport sees it work* — then **shipped it BY HAND**. The J audit (32
systemic + 14 design lanes, 46 evidence docs, every claim tree-verified) finds that **I's
close HOLDS at the surface it certified and the SAME blindspot shape — the oracle pointed one
step short of where a human meets the product — survives at EVERY boundary BEYOND that
surface.** The deploy chain runs on a flaky gate that has never been green end-to-end on
Linux (CI itself was YAML-invalid since H; the I FINAL's "merge → green CI → CF auto-deploys"
was structurally impossible when written — `audit/final-vs-tree-inv-epsilon.md` INVE-1). npm
publishes a version two architectural eras stale, over a 16-export orchestration tier never
published. The docs lie — root `CLAUDE.md` documents a deleted barrel architecture and "15
files / 261 tests" when the tree holds 69 top-level `*.test.ts`. `proof:live-session` is
desktop-1440-only — mobile, touch, reduced-motion, dark, keyboard, and the playground-class
scenes all un-exercised. And the design language is PRESENT but worn at ONE doorway: the
Instrument Serif display voice appears once, the subject palette collapsed to one green while
the icons sing a six-colour rainbow. **J's correction is ONE move applied everywhere: extend
the gate-ORACLE precept to every boundary the product crosses — the boundary-ORACLE
extension (`J.md §invariants`, the J headline).** This is the gate-blindspot the user has
warned about, re-seeded one boundary out: *the un-exercised axis is where the next lie lives.*

---

## §1 — THE FINDING-CLUSTER → WAVE MAP (every cluster folded, no drops)

Severity counts from the structured fleet returns (`J.md §The finding-cluster → wave
ledger`): **17 P0 · 120 P1 (82 systemic + 38 design) · 95 must-fold candidates · 64 glass-ui
ledger items.** Each cluster names the falsified-or-latent claim and its owning wave; full
per-finding tables live in `PROGRESS.md §2` and the lane docs.

| Cluster | The decisive findings (lane § / file:line) | The falsified or LATENT claim | Wave |
|---|---|---|---|
| **Deploy integrity** | `scene-control-dfa` a LIVE product lag (the dock trigger TEXT renders the SOURCE scene's stale label under load — `feb39c3`) + a flaky fixed-`settleMs=1600` gate with ZERO CI escape, hard-gating `demo-smoke`→`ci`→`deploy-pages.yml`; the reverted escape-hatch waited on the SOURCE scene's stale trigger (a structural no-op); `scene-transition-perf` carries the IDENTICAL race; `demo-driver.mjs` has NO scene-nav primitive; ~60 demo-smoke gates NEVER run on Linux; one clean auto-deploy round-trip NEVER observed | the I FINAL's "merge → green CI → CF auto-deploys" was STRUCTURALLY IMPOSSIBLE when written (ci.yml YAML-invalid since H) — `audit/wave-I.WZ-postclose.md §C/§F`, `audit/final-vs-tree-inv-epsilon.md` INVE-1 | **J.W0** |
| **Engine totality** | ENG-1 the sibling per-card serializer (`CSSKeyframesToStrings`) still on the pre-transposition DOM-resolved path; ENG-2 latent `templateFrames[undefined]!.transform` deref in `createFrame`; SEAM-1 the selector guard catches only `trim()===""`; SEAM-2 the value.js empty-input contract has no kf-side pin; SEAM-4 the `rotate()` round-trip vacuous; TB-1/2/3 the I engine fixes have NO unit tests; decay.ts untested | the I.W0 serialize-from-template transposition was applied at ONE seam only; the sibling path is still B1-class live — `audit/engine-core.md`, `audit/parsing-units-valuejs-seam.md` | **J.W1** |
| **Demo seam completion** | W4-3/W4-4 EasingCurveCanvas + PlaybackRibbon still bypass the shared drag seam (B6 latent class NOT zero); DS-1 CubeScene writes `selectedControl` directly; M2 the mobile-sheet re-open scroll latch (CSS `transitionend` never fires on the spring-driven sheet); CD-1 the D FINAL OVERCLAIMED `AnimationMenuBar→TransportDock` (inv-ε violation — the rename never happened); DS-2 17 reactive refs/frame | the I.W2 "single authority" surface is single-sourced but LAGS the route under load; the B6 drag seam was not closed at zero residue — `audit/wave-I.W4.md`, `audit/demo-scenes.md` | **J.W2** |
| **Estate industrialization** | GC-1 43×`serveDist`/51×MIME/54×chromium duplication (~2 kLoC); GC-2/BP-4 `proof:all` ≠ CI; GC-3 the meta-gate hardcodes 9/10; GC-5 `proof:repin-safe` stale-by-construction → KILL; WZ-5/CICD-3 the `IN_CI` triplication; PRE-1/F2 the un-executed collapse (count GREW 103→109) | the I "collapse the lattice" thesis was authority-only — the lattice was RELABELED and survives at full size — `audit/precepts.md §2-F2`, `audit/gate-census.md` | **J.W3** |
| **The axes** | FVT-2/INVE-2 live-session desktop-1440-only (mobile/touch/reduced-motion/dark/keyboard all zero-hit; the SCENES sweep omits playground-class scenes); lighthouse-mobile an orphan in neither tier; CH-3 mobile chronic certified by desktop oracles; EP-3 flip/drag/draw-svg exported with zero live-session coverage | `proof:live-session` certified the product at ONE viewport, one input modality, one motion preference, one color scheme — `audit/final-vs-tree-inv-epsilon.md` INVE-2 | **J.W4** |
| **The published surface** | SCOPE-1 the 16-export orchestration tier unpublished (npm = tree = 4.1.0); SCOPE-3/DL-8 two `patch` changesets unconsumed + the patch-vs-minor decision owed; SCOPE-5 README teaches 4/~13 primitives; LS-1..8 + SEAM-0 the full doc-rot band (root CLAUDE.md "15 files/261 tests" vs 69 top-level); BP-1 `dist/_redirects` ships in the tarball; ENG-6 the AnimationEngine interface has no drift gate | the docs lie: the repo's own front door documents a tree that no longer exists; npm ships a version two architectural eras stale — `audit/scope-adversary.md §0-§1`, `audit/legacy-sweep.md` | **J.W5** |
| **Terminations (P-invariant-28)** | DL-1 the four ≥4-tranche riders — FB-2 async sync-step, SoA `lerpArray`, FB-5 intrinsic-size, FB-6 `Mod+K`; PF-1 Three.js namespace→named imports (est. 100-200 KB); PF-3 Monaco static-edge re-verify; EF-3 `parseLinearStops` shim retirement; GH-6/DEP-1 CNAME confirm (OUT) | four riders have ridden ≥4 tranches as bare BOOK/MEASURE-FIRST with no probe authored — a fifth ride is the perpetual punt P-invariant-28 forbids — `audit/deferred-ledger.md §3`, `audit/perf-frontier.md` | **J.W6** |
| **The design suffusion** (the user's directive) | The protagonist deficit (8 panes — undersized/unplated subjects, the controls pane winning hierarchy, the amiga gray slab, mobile hero/subject collisions TYP-1/H3/A-01); the display-voice concentration (TYP-2); the two-colour-system drift (CP-1 — the `--ball-tone` seam; the aquamarine literal); the math-made-visible band; the grammar unification (XH-1 ghost rail, XH-2 storyboard schism, XH-3 amiga slab, XH-4 top-center collisions) → the APPEARANCE-GRAMMAR half | the design language is PRESENT but worn at ONE doorway only; the rendered RESULT was never measured against the design intent — `audit/design/cross-hierarchy.md`, `audit/design/cross-color-pops.md`, `audit/design/cross-typography.md` | **J.W7a** |
| **The consume-edge + glass-ui handoff** | Consume-to-delete (MetricBadge/AnimatedDigit, SegmentedTabs, ToggleChip, ScrubberTimeline, glass-wash, `.fade-slide` PRM classes, gold-shimmer dedup STY-1, STY-2..6) + the glass-ui HANDOFF ledger (25 REFINE + 21 ABSTRACT items → `glassui-AX-handoff.md`, headlined by the CurveEditorCanvas/control-point primitive, the rail/ball idiom, the status-badge tone recipe) | glass-ui ships primitives kf hand-rolls; kf authored genuinely general primitives that belong in glass-ui — inv-16 sibling-coordination, consumed on PUBLISH, never kf-patched — `audit/design/glassui-adopt.md`, `audit/design/glassui-abstract.md`, `audit/styling-design-system.md` | **J.W7b** |

---

## §2 — THE WAVES (the gestalt grouping + the boundary-ORACLE each proves itself with)

Each wave fixes a coherent boundary or latent-defect class and carries a **born-RED gate
whose oracle ACTUATES the running product** (correctness budget 0), or — for the boundary
waves — the named **boundary oracle** per J.md's boundary-ORACLE extension. Hygiene clauses
CORROBORATE only and are labeled. **No source-shape check carries correctness authority** —
the I-born gate-ORACLE precept the J charter re-asserts verbatim (`J.md §invariant set`).
**All ten J wave specs are AUTHORED on disk this phase — J.W0, J.W1, J.W2, J.W3, J.W4,
J.W5, J.W6, J.W7a, J.W7b, J.WZ** (`find docs/tranches/J/waves -name '*.md'` = W0,W1,W2,W3,W4,
W5,W6,W7a,W7b,WZ,README), and the `glassui-AX-handoff.md` deliverable is on disk
(`docs/tranches/J/glassui-AX-handoff.md`); `PROGRESS.md §1` carries per-wave dev status. The wave set
is **W0..W6 + W7a ∥ W7b + WZ** — `J.md §The WAVE MAP` is the sole authority for the set and
the DAG.

| Wave | Title | Charge (the cluster · the decisive folds) | The REAL gate it proves itself with |
|---|---|---|---|
| **J.W0** | **THE DEPLOY BOUNDARY** (leads · P0) | Formal adoption of the 8-commit I post-close tail (terminal disposition recorded). `navToScene(page, sceneId, expected)` lands in `scripts/lib/demo-driver.mjs` — wait predicate = the PER-EXPECTED destination state (the destination trigger TEXT == its expected label; trigger-ABSENT for panel-less scenes), ceiling-timeout, load-independent. `scene-control-dfa` + `scene-transition-perf` migrate onto it. PRODUCT half: the dock trigger projection made born-correct from the DFA (never the SOURCE scene's stale label mid-transition). GH repo secrets verified. | **One OBSERVED clean round-trip: a real master push → green CI (demo-smoke end-to-end GREEN on the Linux runner, scene-control-dfa included, ZERO escapes) → `deploy-pages.yml` auto-fires → the live site serves the pushed bytes.** Born-RED: red on CI run `27228309606`'s trigger='null'-under-load shape. |
| **J.W1** | **THE ENGINE TOTALITY PASS** | ENG-1 the per-card serializer unified onto serialize-from-template (the sibling DOM-resolving path dies in the same motion); ENG-2 `createFrame`'s `seekPreviousValue` made total; SEAM-1 the selector guard rejects ALL non-conforming input with the typed error; SEAM-2 the kf-side `parseCSSValueUnit("")` pin; SEAM-4 the rotate()-shorthand round-trip de-vacuoused; the unit pyramid (var()-round-trip, bind-proof, `binarySearch`, `decay`); W0-5 clause (e). | New unit tests witnessed born-RED on the pre-fix tree (git-stash probe). Runtime: `proof:engine-no-throw-on-play` extended — the EDITOR per-card pane round-trips a `var()`-bearing animation (the ENG-1 oracle is the rendered card); the garbage-selector path asserts the TYPED error in the live console. |
| **J.W2** | **THE DEMO SEAM COMPLETION** | W4-3/W4-4 EasingCurveCanvas + PlaybackRibbon onto the shared drag seam (the B6 latent class to ZERO); DS-1 + S4-stretch the `selectedControl` single-writer COMPLETED (the CubeScene rogue write dies; the DFA projection is the ONLY writer); M2 `isPanelTransitionDone` off the spring settle; CD-1 `AnimationMenuBar → TransportDock` executed; DS-2 the 17 reactive refs/frame onto the non-reactive write; `useRafLoop` → `onScopeDispose`. | `proof:drag-gesture` extended to the two recovered surfaces (real `page.mouse` drag, no text-selection, gesture lands); the mobile sheet open→close→RE-OPEN on 390×844 scrolls to content (M2 runtime); a live scene sweep asserts the rendered control surface == the DFA projection on every entry (no stale latch), the no-rogue-writer grep as the hygiene corroborator. |
| **J.W3** | **THE ESTATE INDUSTRIALIZED** (net-deletion) | `withPage()`/`withBrowser()` + the shared `serveDist`/MIME/chromium/`navToScene` exports in `scripts/lib/` (the 43/51/54 copies MIGRATE, ≈2 kLoC deleted); the ONE `IN_CI` helper + per-gate DECLARED P6 on-device posture (the third tier named); `proof:all` == the CI roster (a two-way `proof:ci-coverage` clause); the meta-gate derives its roster FROM `proof:correctness` (T4); KILL `proof:repin-safe`; `proof:deps-current` floors advance; T3 the two surviving proxies re-labeled honestly. | The bite-preservation oracle: a SAMPLED set of migrated gates re-witnessed born-RED on their recorded defect (no migration may lobotomize a gate); `proof:all` == CI proven both ways; gate COUNT and estate LoC measured strictly DOWN (the net-deletion rule, before/after recorded). |
| **J.W4** | **THE AXES BATTERY** (legs PARTITIONED by upstream dep) | The INPUT-MODALITY legs (gate on W0+W3 only): the MOBILE-INPUT battery (390×844, `hasTouch`, real touch taps/drags), the REDUCED-MOTION snap leg (`emulateMedia`), the KEYBOARD leg (Tab/focus-visible/Enter-Space), the SCENE-SWEEP widened. The APPEARANCE-CERTIFICATION legs (gate on W7a+W3): the mobile hero/subject overlap == 0, the DARK `--ball-tone` contrast, the ghost-rail-absent assertion. CH-3 re-certified on a MOBILE oracle; `proof:lighthouse-mobile` enters a tier under its P6 posture; EP-3 dispositioned. | Each new leg witnessed born-RED-able against a PLANTED defect; then the full battery GREEN at budget == 0 per leg. The CH-3 mobile oracle bites on a planted occlusion. The appearance-certification legs are green ONLY on the post-W7a tree; the input-modality legs bite the instant W0+W3 land, independent of the W2→W7a chain. |
| **J.W5** | **THE PUBLISHED SURFACE** | `proof:published-surface` (`npm pack --dry-run` contents == declared files, no `_redirects`, d.ts complete; every public export taught or enumerated; ENG-6 interface drift-gated); README §Beyond CSS completes (all ~13 primitives); the doc-rot purge (root CLAUDE.md REWRITTEN to the tree, `src/animation/CLAUDE.md` +9 modules, `demo/CLAUDE.md` rewritten); BP-1 `_redirects` out of the tarball; the changeset consolidation (the honest MINOR, both patches consumed — version cut + publish USER-DOMAIN at WZ); the stray PNG relocated. | `proof:published-surface` witnessed born-RED on the CURRENT tree (the `_redirects` leak + the untaught exports red it today); GREEN only when the tarball, the exports, and the README agree. The README examples EXECUTE against the built dist (the docs oracle is runnable truth). |
| **J.W6** | **TERMINATIONS** (P-invariant-28) | FB-2 author `proof:event-ordering`, LAND-or-KILL on the numbers; SoA `lerpArray` bench on the real-K corpus, ADOPT-or-KILL; FB-5 intrinsic-size verify Baseline, BOOK-with-date or KILL; FB-6 `Mod+K` owner decided, BUILD-or-KILL; PF-1 Three.js named imports (measured bundle delta); PF-3 Monaco static-edge re-verify; EF-3 `parseLinearStops` shim retirement; GH-6/DEP-1 CNAME confirm (OUT — verify only). | Every rider exits with a MEASUREMENT ARTIFACT (bench/probe output checked into the wave note) or a reasoned KILL record; the J close ledger carries ZERO rows tagged MEASURE-FIRST without a measurement. The PF-1 bundle delta recorded before/after. |
| **J.W7a** | **THE APPEARANCE-GRAMMAR SUFFUSION** (on J.W4's critical path) | Protagonist: every stage subject made the unambiguous protagonist (the plated stage grammar unified; the amiga slab joins the rounded-glass register; the controls pane recedes via `glass-wash`; the mobile collisions die). Display voice: Instrument Serif suffused from the doorway to the scenes; the math readouts promoted to confident mono displays. Colour: the `--ball-tone` parameterization of `.progress-ball` (every subject keeps its icon's hue; the aquamarine literal dies). Math: the easing stage projects its OWN bezier; FourierField adopted where befitting. Grammar: the ghost rail dies; the top-center band de-conflicted. Every visual delta NAMED + enumerated (the isomorphic exception); the visual-lock baseline re-captured IN this wave's close motion. | The per-finding RUNTIME asserts on the live page: the subject's computed `--ball-tone` per scene == its icon hue token; the scene-title display register present; the mobile 390×844 hero/subject overlap == 0 px; the easing stage's projected curve PRESENT + MUTATING on a handle drag; the ghost rail ABSENT; the amiga rounded-glass computed style. `proof:live-session` budget stays 0 across the re-skinned tree; the re-captured baseline lands WITH the wave. |
| **J.W7b** | **THE CONSUME-EDGE + glass-ui HANDOFF** (NOT on J.W4's path; parallel · AX-gated) | Consume-to-delete PARTITIONED by publish state (inv-16's published-only rule). **(i) consume-on-3.9.0 (lands THIS tranche)** — the on-disk glass-ui 3.9.0 ALREADY ships the primitive: ToggleChip `variant="cell"` for the Spring preset grid (glassui-abstract.md B2), `.fade-slide`/`metric-swap` PRM transition classes over the `kf-editor`/per-frame-snap recipes (glassui-adopt.md A5/A2), `MetricBadge`/`StatusDot` for the hand-rolled readouts + SETTLED/READY/TRACKING chips (B1/A3), the `ScrubberTimeline` BASE slider for PlaybackRibbon (B4), `.gold-shimmer` once glass-ui's `@utility` is the stable surface (STY-1/B1). **(ii) consume-on-FUTURE-AX-publish (BOOK-with-published-version; NO kf deletion until it ships)** — the primitive does NOT exist in 3.9.0 and is a REFINE/ABSTRACT handoff: the `SegmentedControl`/segmented `SegmentedTabs` posture (glassui-abstract.md B3 — "the existing primitives don't have that posture"), the inertia-enriched `ScrubberTimeline` that absorbs AnimationVisualizer (C5 REFINE), cartoon-surface default radius (C1 — "Verified STILL TRUE in glass-ui 3.9.0 … no `border-radius`"), the headless-typography lever (C2). The glass-ui HANDOFF ledger (25 REFINE + 21 ABSTRACT) → `glassui-AX-handoff.md`; kf consumes only what AX PUBLISHES (inv-16). NO kf appearance change is owned here — file-disjoint from W7a; the visual-lock baseline is W7a's. | **The boundary oracle (NOT a kf appearance gate):** the `glassui-AX-handoff.md` ledger is COMPLETE (every one of the 46 REFINE/ABSTRACT items dispositioned with its evidence anchor + the consuming kf seam named). **The "one motion" deletion clause is SCOPED to set (i):** each consume-on-3.9.0 edge lands the deleted kf surface and the consumed 3.9.0 primitive in ONE motion (a grep proves the hand-rolled surface is GONE the instant the consume lands; hygiene corroborator). Set (ii) over-promises if claimed this tranche — those edges exit as a BOOK-with-target-version against the FUTURE AX publish and carry NO kf deletion in J (the kf surface survives BESIDE its booked replacement only because the replacement does not yet exist — the honest exception to no-legacy, gated on PUBLISH per the vaporware lesson). No born-RED kf-runtime witness is shared with W7a. |
| **J.WZ** | **CLOSE** | FINAL.md (held to inv ε — each boundary claim cites its observed oracle); the prompt-recap (every fold row dispositioned); the chronic-closure SUBSTRATE TRANSITION (the meta-gate's parse target moves from I's PROGRESS to J's ledger in the same motion the J ledger becomes authoritative); the changeset version cut + npm publish (USER-DOMAIN, Mike Babb, confirm-first — the honest minor); the T5 memory update; the auto-deploy round-trip RE-observed on the close merge. | `proof:all` GREEN where `proof:all == CI`; the close merge's own CI run auto-deploys (the J.W0 oracle, re-witnessed on the close itself); the published tarball passes `proof:published-surface`; the J ledger terminal (zero un-dispositioned rows). |

---

## §3 — THE DEPENDENCY DAG (order by file-overlap + upstream dependency)

```
                       ┌──────────────────────────────────────────────────┐
                       │ J.W0  THE DEPLOY BOUNDARY (P0)                    │  ← LEADS
                       │  · navToScene per-EXPECTED-state primitive        │     (its
                       │  · the dock projection born-correct from the DFA  │     primitive +
                       │  · ONE observed green-CI → auto-deploy round-trip │     green-Linux
                       └───────────────┬──────────────────────────────────┘     CI gate every
                                       │ (navToScene + green-Linux CI are        later wave's
                                       │  the precondition for every later       verification
                                       │  wave's gate to RUN on Linux at all)     consumes)
        ┌──────────────────┬───────────┼─────────────────────────────────┐
        ▼                  ▼           ▼                                  ▼
  ┌───────────┐     ┌───────────┐ ┌───────────┐                    ┌───────────┐
  │ J.W1      │     │ J.W2      │ │ J.W3      │  (after W0:         │ J.W6      │
  │ engine    │     │ demo seam │ │ estate    │   consumes the      │ termina-  │
  │ totality  │     │ complete  │ │ industri- │   primitive; owns   │ tions     │
  │           │     │           │ │ alized    │   the estate)       │ (riders)  │
  └───────────┘     └─────┬─────┘ └─────┬─────┘                    └───────────┘
   ∥ (engine)             │ (shared      │ (the industrialized
                          │  demo files: │  harness + the net-
                          │  behavior    │  deletion lib feed
                          │  FIRST)      │  the W4 battery)
                          ▼              │
                    ┌───────────┐        │
                    │ J.W7a     │        │      ┌───────────┐
                    │ appear-   │        │      │ J.W7b     │  ∥  (file-disjoint
                    │ ance-     │        │      │ consume-  │      from W7a; AX-
                    │ grammar   │        │      │ edge +    │      gated; NO kf
                    │ suffusion │        │      │ glass-ui  │      appearance delta;
                    │  (re-caps │        │      │ HANDOFF   │      NOT on W4's path)
                    │  baseline)│        │      └───────────┘
                    └─────┬─────┘        │
        ┌─────────────────┤              │
        │ (appearance-    │ (input-modality legs gate
        │  certification  │  on W0+W3 ONLY — bite the
        │  legs gate on   │  instant the harness lands,
        │  W7a+W3)        │  parallel to the W2→W7a chain)
        ▼                 ▼              ▼
                    ┌───────────────────────────────┐
                    │ J.W4  THE AXES BATTERY        │
                    │  legs PARTITIONED, not        │
                    │  serialized whole             │
                    └───────────────┬───────────────┘
                                    │
   ┌───────────┐                    │
   │ J.W5      │ ∥ (docs/packaging — parallel to ALL;
   │ published │    changeset cut LAST among waves)
   │ surface   │                    │
   └─────┬─────┘                    │
         └──────────────┬───────────┘
                        ▼
            ┌───────────────────────────────┐
            │ J.WZ  CLOSE                   │  ← CLOSES
            │  proof:all==CI · the close    │     (re-observes
            │  merge auto-deploys · the     │      the J.W0 oracle
            │  published tarball passes     │      on the close
            │  proof:published-surface      │      merge itself)
            └───────────────────────────────┘
```

**The longest serial path is `W0 → W2 → W7a → W4(appearance-certification legs)`**, with
W4's input-modality legs running PARALLEL to it (they gate on W0+W3 only). W7b runs parallel
to the whole W2→W7a chain and is NOT on the critical path.

**Scheduling risk (sizing, not structure — recorded honestly for the impl phase).** This DAG
wastes none of I's parallel pattern (W1∥W2∥W6 after W0; W3 parallel; W7b parallel and
off-path; W4's input-modality legs decoupled; W5 parallel feeding only WZ), but it is one hop
DEEPER than I's: I delivered 8 impl waves (W0–W7) + WZ committed wave-by-wave in a single
2026-06-09 session (`audit/recap-I-session.md` — "Maximal-parallel wave board I.W0–I.W7
committed wave-by-wave `107236d`→`1a708cf`"), whereas J authors **10 impl waves** (W0..W6 +
W7a∥W7b + WZ) with a **4-deep serial critical path** `W0→W2→W7a→W4(appearance legs)`. Two
concrete consequences the impl phase must hold: **(1)** W4's appearance-certification legs
cannot bite until W7a fully lands, so a W7a slip cascades straight to the close — and W7a (the
appearance suffusion across 8 panes + the in-motion visual-lock re-capture) is materially
heavier than any single I wave; **(2)** the per-pane delta register of W7a and the 46-item
W7b ledger could not be hardness-verified until those specs landed on disk — and they now
HAVE: all five formerly-pending specs (J.W1/J.W2/J.W7a/J.W7b/J.WZ) and the
`glassui-AX-handoff.md` deliverable are AUTHORED (`find docs/tranches/J/waves -name '*.md'`
= W0,W1,W2,W3,W4,W5,W6,W7a,W7b,WZ,README; `docs/tranches/J/glassui-AX-handoff.md` present at
61 KB), as §2 and `PROGRESS.md §1` now tag them. **The conditional this paragraph set — the
impl phase opens against this DAG only once W7a is authored to the same concreteness as the
on-disk specs (the per-pane delta register enumerated, the §Hard gate's born-RED witness plan
named) — is SATISFIED:** `J.W7a.md` is 53 KB with a per-pane §S-band register
(`§Scope — the six bands` S1..S6; the eight per-pane lanes carried at `J.W7a.md:58`), a
§Hard gate at `J.W7a.md:392` whose per-finding appearance oracles name their born-RED witness
on the pre-suffusion tree, and W6-3 homed to a terminal FOLD verdict (`J.W7a.md:23/63`, §S4
folds at `:289-295`). The sizing risk is RECORDED, not pending: the deeper-than-I 4-deep
critical path stands, but the thin-spec hazard it warned of is retired — W7a is authored to
the on-disk concreteness, so the close-schedule risk is now purely the heaviness of W7a's
8-pane execution, not any gap in its hardness.

---

## §4 — ORDERING RATIONALE (why this DAG, clause by clause)

The DAG below is `J.md §The WAVE MAP`'s DAG paragraphs, verbatim in intent; every ordering
edge is a FILE-OVERLAP or an UPSTREAM-DEPENDENCY fact, never authorial preference.

0. **THE PRECEPT LEADS — as a CHARTER INVARIANT bound at t=0, NOT as a wave.** The
   gate-ORACLE precept, the boundary-ORACLE extension, the error-budget allowlist, the
   two-tier (now three-tier, +on-device) taxonomy, and the net-deletion rule are bound the
   moment J opens, mechanically prior to every wave's §Hard gate. `proof:gate-is-runtime`
   REDS any wave that registers a source-shape-only oracle as its correctness gate; J.W3
   re-points it to derive its roster FROM `proof:correctness` membership (T4) so a new
   correctness gate can never escape the enforcer. The precept is enforced from t=0 by
   machine, not inherited backward by the last wave's authorial fiat — the I-discipline,
   carried verbatim (`J.md §invariant set`, `I/waves/README.md §0`).

1. **J.W0 LEADS (the P0 deploy hazard + the primitive every later wave consumes).** The
   deploy boundary is the P0 hazard — a future master push can silently NOT deploy, the same
   silent-no-deploy class that froze the site H→I (`audit/wave-I.WZ-postclose.md §F`). Two
   things J.W0 produces are CONSUMED by every later wave's verification: (a) the
   `navToScene(page, sceneId, expected)` per-expected-state primitive in
   `scripts/lib/demo-driver.mjs` — every later wave's interaction gate navigates scenes
   through it, load-independent by construction; and (b) a GREEN-on-LINUX CI — until the
   `scene-control-dfa` flake dies and the ~60 never-run-on-Linux demo-smoke gates pass, NO
   later wave's gate can be RUN on the Linux runner at all (`audit/ci-linux-open-item.md §5`,
   `J.md §WAVE MAP DAG`). J.W0 leads for the identical reason I.W0 led: the poison removal is
   the precondition for every downstream measurement to be readable.

2. **J.W1 ∥ J.W2 ∥ J.W6 run parallel after J.W0 — file-disjoint.** Engine (`src/animation`,
   un-fenced under the permanent engine rule), demo-behavior (`demo/**` composables/scenes),
   and measurements (the bench/probe riders) touch disjoint file sets. J.W3 follows J.W0
   (consumes the `navToScene` primitive; owns the estate — `scripts/lib/`). The engine is in
   scope this tranche whenever runtime correctness or measured elegance requires; the fence
   is against SIBLING forks only (T2 resolved — `J.md §MANDATE`, the permanent engine rule).

3. **The design suffusion SPLITS along its natural fault line — W7a ∥ W7b**
   (`audit/scope-adversary.md`, the over-scope finding). **J.W7a (the APPEARANCE-GRAMMAR
   half) follows J.W2.** This is the load-bearing file-overlap edge: W7a and W2 both touch
   the SHARED demo files (the scene components, the controls surface, the dock projection),
   so behavior must land FIRST and appearance SECOND — re-skinning a stage whose drag seam or
   single-writer is still mid-repair would force W7a to re-baseline twice. W7a re-captures the
   `proof:visual-lock` baseline IN its close motion — **never after**: the re-capture is the
   last act of the same wave that authors the deltas, so the appearance-drift tripwire's
   self-baseline is acknowledged in its own header and is honest by construction (T3 — the
   `visual-lock` re-label). A baseline captured by a SEPARATE later motion would certify drift
   it did not author. **J.W7b (the CONSUME-EDGE + glass-ui HANDOFF half) is file-disjoint
   from W7a**, owns NO kf appearance delta, re-captures NO baseline, is gated ONLY on AX
   PUBLISH (inv-16 sibling-coordination), and runs PARALLEL to the W2→W7a chain. **W7b is NOT
   on J.W4's critical path** — its oracle is the COMPLETE handoff ledger + the consume-to-
   delete grep, not a kf-runtime appearance witness, so nothing in W4 waits on it. **The
   consume-to-delete edges PARTITION by publish state, and only the first set lands in J:** the
   consume-on-**3.9.0** edges (ToggleChip cell, `.fade-slide`/`metric-swap`, MetricBadge/StatusDot,
   the ScrubberTimeline base slider, the gold-shimmer `@utility` — glass-ui 3.9.0 already ships
   these, `audit/design/glassui-abstract.md:7`) delete the hand-rolled twin in ONE motion THIS
   tranche; the consume-on-**FUTURE-AX-publish** edges (SegmentedControl, the inertia-enriched
   ScrubberTimeline C5, cartoon-surface radius C1, the headless-typography lever C2 — none in
   3.9.0) exit as a BOOK-with-target-version and carry NO kf deletion in J. Claiming the
   "one motion" deletion for set (ii) would over-promise a landing that cannot occur until AX
   publishes — so the no-legacy clause is honestly suspended for the booked set, gated on PUBLISH
   per inv-16's published-only rule (the vaporware lesson — a HANDOFF may target only a published
   version).

4. **J.W4's legs are PARTITIONED by their ACTUAL upstream dependency — not serialized
   whole.** This is the hardened correction (`J.md §WAVE MAP DAG`): the
   APPEARANCE-INDEPENDENT input-modality legs (the touch battery, the PRM/reduced-motion
   snap, the keyboard actuation, the widened scene sweep) gate ONLY on **J.W0 + J.W3** — they
   exercise input modalities and the device-independent occlusion geometry, none of which
   depend on the suffusion — and land as soon as the harness does, in parallel to the W2→W7a
   chain. The APPEARANCE-CERTIFICATION legs (mobile hero/subject overlap == 0, the dark
   `--ball-tone` computed-contrast, the ghost-rail-absent assertion) gate on **J.W7a + J.W3**
   because they assert POST-suffusion appearance facts — they are GREEN only on the post-W7a
   tree (a leg asserting the ghost rail is ABSENT cannot certify against the tree where W7a
   has not yet removed it). The CH-3 mobile occlusion oracle (`sheet.bottom ≤ menubar.top`
   measured ON the 390×844 viewport) is device-INDEPENDENT geometry and HARD-gates with the
   input-modality band. Hence the longest serial path is `W0 → W2 → W7a → W4(appearance
   legs)`, with the input-modality legs decoupled and parallel.

5. **J.W5 is parallel to ALL (docs/packaging), its changeset cut LAST among waves.** It
   touches the README, the doc tree, and the packaging manifest — disjoint from engine,
   demo, and gates. Its changeset is the HONEST minor that names the E→I orchestration tier
   export-by-export and CONSUMES both pending patches; it is cut last so the minor enumerates
   every public-surface delta the other waves may have touched (the version cut + publish
   remain USER-DOMAIN at WZ — `J.md §USER-DOMAIN`).

6. **J.WZ CLOSES — and re-witnesses the J.W0 oracle on the close merge itself.** The close
   assembles `proof:all == CI`, transitions the chronic-closure parse substrate from I's
   PROGRESS to J's ledger in the same motion the J ledger becomes authoritative, and the
   close merge's OWN CI run auto-deploys — the J.W0 deploy oracle re-witnessed on the close,
   so the boundary is certified by an observed round-trip, not by paperwork. The published
   tarball passes `proof:published-surface`; the J ledger is terminal (zero un-dispositioned
   rows). The version cut, the npm publish, and the close-merge deploy are USER-DOMAIN (Mike
   Babb, `mike@babb.dev`, confirm-first).

---

## §5 — THE GATE PRECEPT INHERITANCE (the boundary-ORACLE extension binds every §Hard gate)

> **The gate-ORACLE precept** (I-born, carried verbatim): a gate's ORACLE must be the PRODUCT
> PROPERTY a human would check, exercised through the SAME surface the human uses, error
> budget 0 across PLAY + SWITCH + DRAG. **The boundary-ORACLE extension** (the J headline):
> the same applies at EVERY boundary the product crosses — the DEPLOY oracle is an observed
> green-CI → auto-deploy round-trip serving the certified bytes; the PUBLISH oracle is the
> packed tarball's surface == the source's public exports == the README's taught API
> (`proof:published-surface`); the DOCS oracle is every structural claim verifiable against
> the tree; the AXES oracle is the live-session battery exercising the viewports / input-
> modalities / preferences humans actually use. **A boundary certified by hand, by paperwork,
> or at one viewport is NOT certified.**

This precept and its extension are **BOUND AT J-OPEN (t=0) as CHARTER INVARIANTS**, not
asserted by the last wave (`J.md §invariant set`). Three companion invariants, also bound at
t=0 and inherited by every §Hard gate below:

- **the error-budget ALLOWLIST** — ONE structured budget definition (HARD-zero on
  `pageerror` / `unhandledrejection` / `console.error` / the value.js `"......"` line;
  PROMOTED-zero on the named GPU-stall lines; MINUS the named-benign dev source-map noise);
  J.W3 makes it leg-scoped, not global, and consolidates the triplicated `IN_CI` into one
  `scripts/lib` helper.
- **the THREE-tier taxonomy** — every wave's GREEN depends on its RUNTIME clause; HYGIENE
  clauses strictly CORROBORATE and may NEVER substitute for a red runtime clause; and the
  **on-device** posture is named explicitly as the third state (P6 — a correctness gate's CI
  run is observational; "proof:correctness GREEN in CI" must never be over-read as the felt
  budget holding in CI). J.W3 makes the posture per-gate DECLARED through the shared helper.
- **the boundary-ORACLE for boundary waves** — J.W0's deploy round-trip and J.W7b's complete
  handoff ledger + consume-to-delete grep are the NAMED boundary oracles per J.md's
  boundary-ORACLE extension; their hygiene clauses (the no-rogue-writer grep, the
  hand-rolled-surface-GONE grep) corroborate only and are labeled as such.

Every wave's §Hard gate obeys this. The harness is the proven
`scripts/proof-no-orphan-specular.mjs` pattern — `serveDist` on port 0 + chromium via
`createRequire` + a fresh-scene open — extended from PASSIVE to ACTUATING, and consolidated
into `scripts/lib/` by J.W3 (the net-deletion mechanism). J.W4 ASSEMBLES the per-axis legs
into the widened session battery; J.WZ re-witnesses the J.W0 deploy oracle on the close merge.

---

## §6 — WHAT IS NOT IN THESE WAVES (the honest fence)

- **CLOSED-for-real → do NOT re-litigate** (`PROGRESS.md §4b`): CH-2 φ-hero typography; the
  dock spring (D5) + popover (D9); DC-8 scene-swap VT (RESTORED via the live
  `startViewTransition` consumer — the one A→I chronic that finally terminated; J verifies the
  grep stays 0, no re-open); the I crash chronics CH-5..CH-10 (their gates verified present +
  actuating by the inv-ε lane — J RE-RUNS, does not re-derive).
- **OUT / sibling-HANDOFF → gate-first, never kf-patched** (inv-16; `PROGRESS.md §4c`): the
  value.js next-slice (VJ-1..9, chronic-by-design, rides the next re-pin); the parse-that
  packrat re-key (PT-1); the glass-ui REFINE+ABSTRACT ledger (the 25+21 design items → AX,
  consumed on PUBLISH via `glassui-AX-handoff.md`, J.W7b's deliverable); the typography opt-in
  lever, LabeledField orientation, the `{types}` VT helper, cartoon-surface radius (all
  AX-owned); DEP-1/2/3 (deploy-repo-owned; J.W6 confirms DEP-1 / CNAME ONLY — verify, do not
  write).
- **RECORD (historical, terminal)** (`PROGRESS.md §4d`): INVE-1 (the I FINAL's deploy-claim
  gap — cured by J.W0's observed oracle); INVE-4/5 (stale-snapshot drift in I's FINAL); the
  `d469e69` SUPERSEDED-BY-FIX-SHIP disposition.
- **KILL (permanent, reasoned)** (`PROGRESS.md §4e`): `proof:repin-safe`
  (stale-by-construction — no-legacy applies to gates; J.W3); the ARCH kills carry forward
  un-re-litigated (ScrollTimeline-native, Worker/OffscreenCanvas/Houdini, WASM-parser,
  Typed-OM carrier, per-property easing, bit-packing, dev.sh/deploy.sh, ValueUnit
  monomorphization).
- **USER-DOMAIN** (`PROGRESS.md §4f`): the version cut (the honest minor off 4.1.0, consuming
  both pending changesets — H's patch subsumed), the npm publish, the close-merge deploy.
  Version owner **Mike Babb** (`mike@babb.dev`), confirm-first, at J.WZ.

**Honest already-done — manufacture NO J work** (inv ε; `J.md §Honest already-done`,
`PROGRESS.md §5`): the I waves delivered their specs at the gestalt seam (zero silent
narrowing beyond the named residues); the two-tier taxonomy + both meta-gates are REAL and
machine-enforcing at desktop-1440; the 5 H proxy gates + the vaporware IOU are genuinely
DELETED; value.js 0.11.2 + glass-ui 3.9.0 are published-consumed (lockfile-verified); the
engine-core decomposition is the right seam; the mono/φ-ladder typography + the icon family
are well-built (the suffusion AMPLIFIES, it does not repair); the deploy DESIGN
(`pages-deploy.sh` + `deploy-pages.yml` + GH-secrets) is right (it needs VERIFICATION, not
replacement); the shell chrome is single-voiced and strong.

---

## §7 — THE VERSION + CLOSE

The stacked changeset version owner is **Mike Babb** (`mike@babb.dev`). The version cut (the
honest MINOR off 4.1.0, consuming both pending `patch` changesets), the npm publish, and the
close-merge auto-deploy round-trip are USER-DOMAIN, confirm-first, at **J.WZ** — after the
J.W0 deploy boundary earns its first OBSERVED green-CI → auto-deploy round-trip. The J close
(FINAL.md · the prompt-recap · the J ledger · the changeset · the deploy · the T5 memory
update) is the WZ lane, authored after the waves land — NOT part of this dev-only authoring.

**The terminal reading.** I bound the gate oracle to the running product and proved the
product true at one desktop viewport — then shipped it by hand, on a version npm has never
seen, under docs describing a tree that no longer exists, certified on no axis a phone or a
motion-sensitive or a keyboard user touches, wearing its design language at one doorway only.
**J's correction is singular: the same oracle discipline, extended to every boundary the
product crosses** — the deploy chain earns an OBSERVED green-CI → auto-deploy round-trip on a
cured, per-expected-state gate (J.W0); the npm surface earns the honest minor with a
`proof:published-surface` oracle and a README that teaches what actually ships (J.W5); the
docs are rewritten to the tree because stale docs are legacy code (J.W5); the live-session
battery learns the human axes — touch, reduced motion, dark, keyboard, every scene (J.W4);
the seams I repaired are made TOTAL (J.W1/J.W2); the estate collapses onto the lib it already
half-owns under a net-deletion rule (J.W3); every rider that has outlived four tranches exits,
probe or KILL (J.W6); and the design language suffuses from the doorway through every pane via
the tone seam, the display rungs, and the consume-to-delete glass-ui edges (J.W7a ∥ J.W7b).
When J closes, "green" means: **a human anywhere — on the live site, from `npm i`, in the
README, on a phone, in the dark, with motion stilled — meets the same true, whole, beautiful
product.**
