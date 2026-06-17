# Tranche L — prompt-recap-L · THE TOTAL PROMPT RECAP (A→K inclusive · extended through the L close · this-session ledger · L-scope intake · L-impl terminal)

**Lane:** `prompt-recap-L` (L audit, DOCS-ONLY). **Read-only on source/tests/gates/CI** — this
lane wrote exactly ONE file: this doc. **Tree at the L-close extension:** branch `tranche-l-dev`
tip `4686aa4` (Band-A waves W1–W11 + the engine decomposition + the W9/W10 Band-B dispatches ALL
COMMITTED; the K substrate is `master` at tip `9bbc227`, `4.3.0` released at `4737ab3`, live).
**Method (inv ε):** every coverage status verified against the TREE / the audit corpus on disk —
NOT chain-trusted over a prior FINAL. Each row reaches a TERMINAL verdict and names its evidence
oracle (the gate name + its re-run exit code, the commit sha, the measured fact). The un-consumed
Band-B edges are NAMED with their tripwire, NOT asserted closed; the RED-by-design gates are stated
as RED-by-design (not green); the deploy round-trip is HANDOFF (not observed); the version `5.0.0`
is RECOMMENDED (not cut); the TASTE verdict is USER-DOMAIN-PENDING (not self-certified). **Zero
drops.**

**The L-impl terminal extension (§8–§11 below)** carries every dev-phase L-SCOPE verdict to its
impl-phase terminal — each cited by a gate RE-RUN at this close. The L-SCOPE rows in §1–§7 were the
dev-phase plan; §8 onward is their landed reality, gate-by-gate. The authoritative close reading is
`docs/tranches/L/FINAL.md` (held to inv ε, S1–S9); this recap is its prompt-ledger instrument.

**Substrate read in full:** `docs/tranches/K/audit/prompt-recap-k.md` (the A→K ledger, the spine);
the L charter (`docs/tranches/L/L.md`); the L audit corpus (`audit/audit-32-skeleton.txt` — 31
lanes / 129 W-proposals / 34 ⚠ precept violations / the CROSS-REPO-ASK·KILL·CHRONIC-FOLD banks;
`audit/completion-lanes-32-36.txt` — the 5 completion lanes 32/33/34/35/36). This doc EXTENDS the
`prompt-recap-k.md` substrate through the K close, the THIS-SESSION events, and the L intake.

The recap is held to inv ε. Every row carries one terminal verdict:
**ADDRESSED** (closed, cited with wave/commit/gate) / **RECORD** (named + dispositioned, not folded)
/ **OUT/HANDOFF** (sibling-owned, consume-edge shaped) / **L-SCOPE** (net-new or re-opened, folded
into a named L wave with its born-RED gate). **Zero drops.**

**The L-impl terminal vocabulary (§8+).** Where §1–§7 carried an L-SCOPE plan-verdict, §8 onward
carries the landed-impl terminal: **ADDRESSED-with-gate** (the cure landed; the named gate RE-RUN
GREEN at this close — exit 0) / **HANDOFF-with-tripwire** (sibling-owned; the named sibling publish
is the tripwire; a born-RED kf gate RE-RUN RED-by-design at this close — exit 1) / **RECORD**
(measured/declared, not a hard-gated action) / **USER-DOMAIN** (Mike Babb — the version cut, the
npm publishes, the TASTE verdict, the glass-ui BB consume + deploy) / **OUT** (permanently
off-charter — the KILL anti-charter). Every gate citation below is a re-run exit code on
`tranche-l-dev` tip `4686aa4`, not a re-assertion of intent.

---

## 0. The reckoning in one paragraph

A→J was a chain of partial closes corrected by the next tranche's live audit (the canonical
I-born/J-hardened lesson: *a green source-shape gate is not a working product*). K answered the
J-crossed blind axes — drove the COLD hero CTA at its adapter root, totaled the design language,
folded the entire CSS-@keyframes round-trip frontier (Band II), and **closed honestly** (inv ε; the
36-lane re-certify). **THIS SESSION shipped K in totality** — 4.3.0 cut/merged/deployed/published,
live; the K Band-I live findings (F1–F6) DEPLOYED on the TASTE PASS; the CI greened after a
~6-round epic. Then a **36-lane deep audit** (the 31-lane `audit-32-skeleton.txt` + the 5 completion lanes 32-36) produced 129 wave
candidates, 34 precept-violation findings, the re-confirmed 12-KILL anti-charter, and **this
ledger**. The audit's headline: K proved round-trip *existence* for a SUBSET — **L is its TOTALITY**
(every CSS feature round-trips OR honestly refuses), the SOTA push, the publish/dogfood completion,
and the constellation coordination. This recap dispositionins every A→K lineage row (chain-trusted
to `prompt-recap-k.md`'s zero-drops close), every THIS-SESSION edict, and every L-intake directive
to a terminal verdict.

---

## 1. THE STANDING SPINE — re-asserted A→L, the development mandate carried verbatim

### 1a — the development mandate (verbatim, the recurring parallel-audit charter — realized this session as the 36-lane audit, `J/J.md:111-119`)

> *DEEPLY audit (32 agents in parallel) our original plan and waves thereof, alongside all changes
> made herein. Devise a path forward… recapitulate our original prompts, plans, and precepts: NO
> quick solutions, NO workarounds: idiomatic, gestalt approaches. This is a development product,
> architectural transpositions in the sake of elegance, simplicity, and performance above all are
> both necessary and desirable. NO legacy code. Delineate any chronically deferred items and fold
> them… Recap ALL of our prompts and requests hitherto and ensure they've been addressed. This is
> NOT an implementation phase. Tranche development only.*

| Clause | Status at L-open | Evidence |
|---|---|---|
| DEEPLY audit (32 agents in parallel) | **ADDRESSED — THIS SESSION** — 31 deep lanes + 5 completion lanes (32/33/34/35/36) = 36 lanes; every claim file:line- or probe-rooted | `audit/audit-32-skeleton.txt` (31 lane 1-liners + 34 ⚠ + 129 W + the CROSS-REPO-ASK/KILL/CHRONIC banks); `audit/completion-lanes-32-36.txt` |
| NO quick solutions / NO workarounds — idiomatic gestalt | **ADDRESSED → L-SCOPE the residuals** — the audit found ZERO new violations in the K-shipped *engine/perf* surface (⚠32/⚠34), but 34 ⚠ rows naming the CI-greenify-era *consumer-side band-aids* (the aria-suppress ⚠1-3/⚠7, linear()-regex ⚠19-20, FN_NAME ⚠18, parse-that-dep ⚠24) + the silent-drops (!important ⚠31, @property ⚠15, multi-color ⚠28-29); each is a NAMED L cure, none carried forward | `audit-32-skeleton.txt §PRECEPT VIOLATIONS` ⚠1-34; `L.md §"The deferred fold + the precept scorecard"` |
| Architectural transpositions for ELEGANCE/SIMPLICITY/PERFORMANCE | **L-SCOPE** — the L wave map proposes: the replay-equality FLOOR at the adapter/format seam (L.W1), the compiler scroll-emit (L.W2), the gate-suite device-honesty transposition (L.W4 — the settle primitive over 259 sleeps), the granular dynamic boundary (L.W7), the ONE-CSS-grammar unification spike (L.W10) | `L.md §"The wave map"` rows L.W1/W2/W4/W7/W10 |
| NO legacy beside its replacement | **ADDRESSED + L-SCOPE the tails** — K `proof:no-deprecated-guard` GREEN; L names the legacy/dead-tier removals: PKG-3 d.ts collision-aliases (⚠ W126), parse-that packrat unsound tier (⚠27), value.js stale typesVersions (⚠21), the `reverseMs` re-author (⚠30) | `prompt-recap-k.md §13 P1`; `L.md §L.W8` (PKG-3); `audit-32-skeleton.txt` ⚠21/⚠27/⚠30 |
| Fold ALL chronic + deferred to terminal home or KILL (P-inv-28) | **ADDRESSED** — K's DL-K ledger TERMINAL (`proof:chronic-closure` 44 rows, all ten ≥4-tranche riders EXITED); L inherits the OUT/HANDOFF items as Band-B gated consume-edges (RF-17/DL-K9, GlassControlPoint/DL-K7, MorphSVG/FB-3, parse-that-packrat/PT-2), each tripwire-named, none re-BOOKed | `prompt-recap-k.md §16/§17/§18`; `L.md §"The deferred fold"` |
| Recap ALL prompts + ensure addressed | **ADDRESSED — THIS DOC** — the no-drops ledger A→K + this-session + L-intake | this document |
| NOT an implementation phase / dev only | **HONORED** — L is DEVELOPMENT-PHASE-ONLY (`L.md:3-6`); L.W1–L.WZ impl opens only on explicit authorization (the D.W0/E.W0/H.W0 boundary); inv-16 holds throughout | `L.md §header`; `L.WZ` is dev-authored, impl-gated |

### 1b — the design directive (verbatim, `J/J.md:123-130`) · THE RECURRING DESIGN-AUDIT DIRECTIVE

> *Run a frontend design audit of our ui, easing ui — all UI panes. How might we better structure
> and suffuse proper design hierarchy… our design language of glass, grid, math, large and
> audacious typography, with colorful audacious pops… What glass-ui idioms might we adopt… Look for
> gaps.*

| Status at L-open | Evidence |
|---|---|
| **ADDRESSED through K + DEPLOYED THIS SESSION** — the K 33-lane design fleet + U-K1..K20 + the TASTE PASS ("Meets the bar — close Band I", 2026-06-16) closed the design band; the F1–F6 live findings DEPLOYED on the deploy round-trip. L carries the design directive forward as the **demo-UX completion** (Lane 34: the dogfood inversion + the README prose) and the **usability waves** (L.W5 gesture/transport DX, L.W8 ED-3) — not a re-open of taste, which the TASTE boundary settled | `prompt-recap-k.md §6/§14`; `completion-lanes-32-36.txt §Lane 34`; `L.md §L.W5/L.W8` |

---

## 2. THE A→K LINEAGE — chain-trusted to prompt-recap-k.md's zero-drops close

The A→K per-tranche lineage, the J.W7c U1–U8 edicts, the cold-path P0 seeds, the U-K1..K20 live
register, and the F1–F6 findings are EACH dispositioned to a terminal verdict in
`prompt-recap-k.md` (§2 — 10 tranches ALL ADDRESSED; §3 — U1–U8 ALL ADDRESSED; §4 — 5 P0 seeds ALL
ADDRESSED; §5 — 19 ADDRESSED / 1 RECORD; §6 — F1–F6 ALL ADDRESSED). This doc does NOT re-litigate
them — it verifies the close held (the THIS-SESSION 4.3.0 ship + deploy is the proof every K
ADDRESSED row reached the live product) and carries forward only the rows the L audit RE-OPENED or
NET-NEW raised. The A→K totals stand: **zero drops** (`prompt-recap-k.md §TOTALS`).

**The one re-opened A→K row:** U-K19 (the playground drag-resizes-container defect) was RECORD in K
(playground-only, not a deployed-SPA defect). The L audit RE-RAISES it as a gesture-DX gap
candidate (`completion-lanes-32-36.txt §Lane 32`: no Draggable bounds/snap/rubber-band). **L-SCOPE
— L.W5** (the GSAP-Draggable/Motion-dragConstraints parity hole; the W-GESTURE-BOUNDS proposal).
NOT a drop — re-scoped from RECORD to a named L wave.

---

## 3. THIS SESSION — the K-totality ship, the live audit, the CI epic, the L development

This is the binding THIS-SESSION ledger. Every distinct user directive issued this session reaches
a terminal verdict. **Zero drops.**

### 3a — "implement + ship K in totality" (the 4.3.0 cut/merge/deploy/publish)

> *implement + ship K in totality — cut, merge, deploy, publish 4.3.0.*

| Sub-directive | Terminal verdict | Evidence |
|---|---|---|
| K Band-I + Band-II implementation in totality | **ADDRESSED** — the full K tranche on master: K.W1 `c427e39`, W2 `9e55b4d`, W3 `8e55c03`, W1′ `e293ce2`, W4 `358def4`, W5 `e82977d`, W6 `315f018`, W7+W11 `c0482cb`, W8+W9+W10 `2784e46`, value.js re-pin `a34b298`, the close `138be67` | `git log` (the named K commits on master) |
| Version cut 4.3.0 (USER-DOMAIN) | **ADDRESSED** — `4737ab3 release: 4.3.0 — Tranche K`; `package.json` reads `4.3.0` | `4737ab3`; `package.json:version` |
| Merge K → master | **ADDRESSED** — master carries the full K tranche; tip `9bbc227` | `prompt-recap-k.md §16` (master `9bbc227`); `L.md §Provenance` |
| Publish 4.3.0 to npm | **ADDRESSED** — `dist-tags.latest = 4.3.0`; release.yml run `27640592021` SUCCESS (the audit's Lane-19 K.WZ verify) | `audit-32-skeleton.txt §LANE SUMMARIES` ("4.3.0 is PUBLISHED and verified on npm… release.yml run 27640592021 SUCCESS") |
| Deploy round-trip (close-merge → CI green → auto-deploy → live) | **ADDRESSED** — master `9bbc227` green → `deploy-pages.yml` arm → live serves `index-43okVJtx.js`; the round-trip OBSERVED | `L.md §Provenance` ("master `9bbc227` green → deploy → live serves `index-43okVJtx.js`") |

**ALL DONE, live.** The K close boundary battery (`prompt-recap-k.md §19`, clauses a/c/d/f/g/h/i —
pending at the K-recap authoring) all DISCHARGED this session: the version cut fired, the publish
verified, the deploy round-trip observed, the substrate transitioned J→K.

### 3b — the live-audit F1–F6 (K Band I, TASTE-approved, DEPLOYED)

> *the 2026-06-16 live-drive findings — rail width, wrapping border, red-accent hover, thicker
> scrubber, scrub-while-idle, icon-fit collapsed dock.*

| Finding | Terminal verdict | Evidence |
|---|---|---|
| F1 rail ~25% wider | **ADDRESSED — K.W4 + DEPLOYED** | `358def4`; `prompt-recap-k.md §6 F1` |
| F2 one subtle wrapping border | **ADDRESSED — K.W4 + DEPLOYED** | `358def4`; `prompt-recap-k.md §6 F2` |
| F3 red-accent hover | **ADDRESSED — K.W4 + DEPLOYED** | `358def4`; `prompt-recap-k.md §6 F3` |
| F4 thicker scrubber | **ADDRESSED — K.W4 + DEPLOYED** | `358def4`; `prompt-recap-k.md §6 F4` |
| F5 scrub-while-idle | **ADDRESSED — K.W4 + DEPLOYED** | `358def4`; `prompt-recap-k.md §6 F5` |
| F6 icon-fit collapsed dock | **ADDRESSED — K.W1′ + DEPLOYED** | `e293ce2`; `prompt-recap-k.md §6 F6` |

All six were TASTE-approved ("Meets the bar — close Band I") and rode the 4.3.0 deploy to the live
site. **L.W0 verifies the deployed build shows them** (`L.md:148-151`); the lone residual — the
**dock-flicker** — L.W9 dispatches to the in-flight glass-ui BB tranche (`L.md:151`).

### 3c — "green the CI" (the ~6-round greenify epic)

> *green the CI.*

| Sub-directive | Terminal verdict | Evidence |
|---|---|---|
| Green the master CI (engine/group split + SFC splits + visual-lock re-baseline) | **ADDRESSED** — `5a906a7 green the master CI` | `5a906a7` |
| Green the COMPLETE master demo-smoke set (the fail-fast-hidden tail enumerated, one pass) | **ADDRESSED** — `4492ab1` | `4492ab1` |
| Green the Linux demo-smoke tail (device-dependent fail-fast successors hardened, P6) | **ADDRESSED** — `495ae68` | `495ae68` |
| Harden demo-smoke against slow-Linux-runner render races (one-pass sweep) | **ADDRESSED** — `9390196` | `9390196` |
| Cure the spring-scene a11y regression (proof:lighthouse-a11y, two consume-seam fixes) | **ADDRESSED** — `c176bd0` (this is also the ⚠1/⚠7 aria-suppress band-aid — RE-OPENED in L, see §5) | `c176bd0` |
| Swallow Monaco's benign "Canceled" CancellationError at app root | **ADDRESSED (interim)** — `3e77189`; relocated/homed in a vueuse composable `9bbc227` (the ⚠ W26 relocation) | `3e77189`; `9bbc227` |

**DONE after the 6-round epic.** The greenify session's three architectural roots — fail-fast
everywhere, 259 fixed-ms sleeps, the Monaco-flake — were each cured *symptomatically* this session
to ship K; **L makes them terminal at their root** (`L.md:14-16` + L.W4): report-all posture
(W27), the waitForRender/settle primitive over the 259 sleeps (W28/⚠inv-L-device-honesty),
Linux-container local-repro (W29), single-source thresholds (W30). The new **inv-L-device-honesty**
gate-suite law is born from exactly this lesson (`L.md:71-75`).

### 3d — "the 32-to-36-lane audit + L development" (THIS lane's parent directive)

> *DEEPLY audit (32 agents) + 5 completion lanes; devise the path forward; recap; dev only.*

| Sub-directive | Terminal verdict | Evidence |
|---|---|---|
| The parallel deep audit + 5 completion lanes (the 36-lane realization) | **ADDRESSED** — 31 lanes (`audit-32-skeleton.txt`) + lanes 32/33/34/35/36 = 36 lanes on disk | `audit/audit-32-skeleton.txt`; `audit/completion-lanes-32-36.txt` |
| Devise the path forward (the L charter + wave map) | **ADDRESSED** — `L.md` (the two bands, the 12-wave map L.W0–L.WZ, the gate-first/born-RED discipline, the inv set, the 12-KILL anti-charter) | `docs/tranches/L/L.md` |
| The wave specs (executable depth) | **ADDRESSED** — `waves/L.W0.md`..`L.W10.md` on disk | `docs/tranches/L/waves/` |
| The consolidated prompt-recap (this) | **ADDRESSED — THIS DOC** | this document |
| Dev-only (no engine/demo/library source) | **HONORED** — L is DEVELOPMENT-PHASE-ONLY; this lane wrote ONLY this file | `L.md:3-6`; inv ε footer |

### 3e — "100+ prompts / BB-in-flight / no-half-baked / FULL lanes" (the standing directives)

> *recap 100+ prompts hitherto; glass-ui's BB tranche is in flight; no half-baked work — FULL lanes.*

| Directive | Terminal verdict | Evidence |
|---|---|---|
| Recap ALL prompts hitherto (the 100+ register, zero drops) | **ADDRESSED — THIS DOC** — the A→K ledger chain-trusts to `prompt-recap-k.md` (zero drops); this-session + L-intake added; every distinct request to a terminal verdict | this document §1–§7 |
| glass-ui BB tranche is IN FLIGHT — the asks land into a LIVE tranche | **ADDRESSED — L-SCOPE Band B** — `L.md:88-92`: glass-ui BB IN EXECUTION; the Band-B asks (aria fix W24/W50, dock-morph-family W18/W43, the LIVE F-2 peer-cycle ⚠8, GlassControlPoint W34, KF-OSCILLATOR W128) dispatch into the live tranche, born-RED-gated kf-side | `L.md §"The two bands" Band B`; `L.md §L.W9`; `audit-32-skeleton.txt §CROSS-REPO-ASK` |
| No half-baked work — FULL lanes | **HONORED** — each Band-A wave authors its born-RED gate FIRST over the REAL breach inputs (Lane 33 — the load-bearing gate-first law); a wave with no born-RED gate is not started (`L.md:96-105`); the workaround-deletion gates BITE on consume (`L.md:118`) | `L.md §"The wave map" gate-first discipline`; `completion-lanes-32-36.txt §Lane 33` |

---

## 4. THE L-INTAKE — the charter's three questions (every breach + frontier to a named L wave)

The L charter (`L.md:29-57`) frames three questions K's subset-status leaves open. Each is folded
into a named L wave with its born-RED gate. **No breach is dropped; no frontier un-homed.**

### 4a — Q1: Is the round-trip TOTAL? (the replay-equality breaches in the SHIPPED surface)

| Breach (audit ⚠ · source) | Terminal verdict | L wave · born-RED gate |
|---|---|---|
| `!important` silently dropped (⚠31; `adapter.ts` `declsToVarMap` reads only name/value) | **L-SCOPE — L.W1** DECLARATION-FLOOR (W116) | `proof:replay-equality` (NEW, W89) — RED today over an `opacity:0 !important` keyframe |
| `@property` registrations never re-emitted backward (⚠15; `engine.ts:1225`, neither CSSKeyframesToString nor compileToCSS calls serializeStylesheetItem) | **L-SCOPE — L.W1** (W75) | `proof:replay-equality` — RED over a registered `--prop` @property block |
| per-stop `animation-composition` asymmetric (⚠16; `format.ts:81-103` emits per-stop easing, NOT per-stop composition) | **L-SCOPE — L.W1** (W76) | `proof:replay-equality` — RED over a per-stop `add` |
| named keyframe selectors (entry/exit/cover/contain) ingested-then-THROWN (⚠17; `frame-compiler.ts:179-188` total selector guard throws) | **L-SCOPE — L.W1** SELECTOR-FLOOR (W118) | `proof:replay-equality` — RED over an `entry/exit` named selector |
| OPERATOR-floor composite/iteration-composite/play-state absent on AnimationOptions (W117) | **L-SCOPE — L.W1** | `proof:replay-equality` |
| compiler is scroll-BLIND — W9+W10 do not compose (★ headline; `compile.ts` zero timeline emit) | **L-SCOPE — L.W2** CC-6 (W12) | `proof:compile-replay` + NEW scroll-driven fixture (W114) |
| multi-color densify ships non-faithful sRGB with `eligible:true` while single-color HARD-REFUSES (⚠28-29; `compile-color.ts:188-190` — the honest-refusal clause violated) | **L-SCOPE — L.W2** CC-3.5 (W113) | NEW multi-color fixture (W114) — the gate bites the case it currently SKIPS |
| static-weight pre-multiply not in the compiler (CC-5, W36) | **L-SCOPE — L.W2** | `proof:compile-replay` |
| animation-timeline/range not emitted from compileToCSS (W119) | **L-SCOPE — L.W2** | `proof:compile-replay` |
| `reverseMs` re-authors value.js's reverseCSSTime — two divergent time serializers (⚠30; W115) | **L-SCOPE — L.W2** unify on reverseCSSTime | `proof:compile-replay` |
| seedAtTime delay-paused bug — adoptRunning FREEZES on delay>0 (★; `ingest.ts:258-272`, W8) | **L-SCOPE — L.W3** | `proof:ingest-replay` NEW delay arm |
| nested @keyframes not walked (recursive group-rule, W7) | **L-SCOPE — L.W3** | `proof:ingest-replay` NEW nested arm |
| ADOPT_REFUSE diagnostics missing (W9) | **L-SCOPE — L.W3** | `proof:ingest-replay` NEW refuse arm |
| adoptedStyleSheets/Shadow-DOM not walked (W10) | **L-SCOPE — L.W3** | `proof:ingest-replay` NEW shadow arm |
| scroll-time currentTime resolution in adoptRunning (W11) | **L-SCOPE — L.W3** | `proof:ingest-replay` |
| the 5 breaches ALL silently pass — NO fixture exercises them; `proof:replay-equality` does NOT exist (Lane 33 headline) | **L-SCOPE — L.W1** gate-first | `proof:replay-equality` born-RED FIRST |

### 4b — Q2: Is it SOTA? (the perf frontier — kf-internal + value.js dispatch)

| Frontier item (audit · source) | Terminal verdict | L wave · gate |
|---|---|---|
| warmEngine() idle-warmer (W121) | **L-SCOPE — L.W7** | `proof:zero-alloc` extended |
| lerpArray consume on the LIGHT tier — published, un-consumed (⚠34 latent gap; W122) | **L-SCOPE — L.W7** | LIGHT-tier `proof:zero-alloc` (NumericAnimation/SpringProgress) |
| scheduler.postTask priority bands (W123) | **L-SCOPE — L.W7** born-RED probe | budgeted bench taxonomy |
| granular loadAnimationEngine — Promise.all's ALL 8 chunks (★; `index.ts:334-363`, W124) | **L-SCOPE — L.W7** per-capability accessors | the proof:boundary fix (W96 — catch parse-that imports too) |
| EPF-1 read/write phase separation (W40, measure-first) | **L-SCOPE — L.W7** | measured-first |
| value.js color-math hot paths allocate per-call (★×4; transformMat3/oklab2xyz/mixColors/gamutMapToRgbSpace; VJ.L1–L8 W78-85) | **OUT/HANDOFF — L.W9 Band B** value.js Tranche O | each ask dispatched; consume born-RED kf-side |
| NO kf bench covers the value.js color-math alloc claims (Lane 33) | **L-SCOPE — L.W7** budgeted bench taxonomy | the perf frontier instrumented |

### 4c — Q3: Is the constellation complete? (the dogfood + publish + cross-repo seam)

| Item (audit · source) | Terminal verdict | L wave |
|---|---|---|
| ED-3 dogfood-inversion STAGED not landed — demo still `@src/animation/*`, 0 barrel imports (★; W125) | **L-SCOPE — L.W8** the barrel flip (63 files) | `proof:demo-on-published-surface` GREEN |
| keyframes-vue 0.1.0 UNPUBLISHED (★; W56/W15) | **L-SCOPE — L.W8** publish under release discipline | keyframes-vue published-surface gate |
| extend animate() to dispatch the orchestration tier (W127) | **L-SCOPE — L.W8** | — |
| PKG-3 d.ts collision-aliases (`Animation_2 as Animation`, W126) | **L-SCOPE — L.W8** retire at API-Extractor root | — |
| keyframes-react BOOK (W129) — no React demo to dogfood-invert against (CROSS-REPO-ASK) | **L-SCOPE — L.W8 candidate** (tripwire: Vue proves the pattern first) | — |
| aria-orientation consume-suppress band-aid — incomplete (⚠1-3/⚠7; SpringSidebar.vue:43 only; AnimationControls.vue:66 still leaks fleet-wide) | **OUT/HANDOFF — L.W9 Band B** glass-ui fix + DELETE the suppression (W24/W50) | the aria-suppress-deletion gate BITES on consume |
| RF-17/BLK-8 click-strand kf workaround (⚠5; the 3rd interim forbidden) | **OUT/HANDOFF — L.W9 Band B** glass-ui 4.1.0 (W18/W43) | the workaround-deletion gate |
| the LIVE F-2 peer-cycle (glass-ui ^0.10.0‖^0.11.0 rejects value.js 0.13.0 — ELSPROBLEMS today; ⚠8) | **OUT/HANDOFF — L.W9 Band B** glass-ui BB obligation + **NEW proof:peer-satisfied** (L.W4) | the gate stays RED until glass-ui publishes the admitting peer |
| FN_NAME Symbol stamp on value.js ValueUnit (⚠18; `utils.ts:45-57`) | **OUT/HANDOFF — L.W9 Band B** value.js VJ-L1 (FlatLeaf/flattenDeclaration); kf workaround deleted on consume | FN_NAME-deletion gate |
| linear() serialize/parse asymmetry — kf carries the regex fix (⚠19-20; `utils.ts:193-196`) | **OUT/HANDOFF — L.W9 Band B** value.js VJ-L2 (linearStopsToCSS); the regex deleted on consume | linear-regex-deletion gate |
| kf's direct parse-that dep solely for the `any` combinator (⚠24; the composition belongs in value.js) | **OUT/HANDOFF — L.W9 Band B** value.js parseCSSSubValue (W94); kf drops the dep | parse-that-dep-deletion gate (W96) |
| FunctionValue.toString() comma/space round-trip break (⚠23; scroll() known-limitation) | **OUT/HANDOFF — L.W9 Band B** value.js W95 | — |

### 4d — the TRUE-CSS-PARITY frontier (the grammar gaps + the two-grammar architecture)

| Item (audit · source) | Terminal verdict | L wave |
|---|---|---|
| value.js comma-list forward-leg truncation — multi-value declarations silently drop the tail at PARSE (⚠13/⚠10/⚠14; `stylesheet.ts:212-232`; box-shadow/transition/font-family/background) | **OUT/HANDOFF — L.W10 Band B** value.js comma-list grammar (W74/W69) | a research-and-challenge spike FIRST |
| transform rotate()/scale()/skew() axis-expansion semantically WRONG (⚠12; `index.ts:61-105`; rotate≢rotateZ) | **OUT/HANDOFF — L.W10 Band B** value.js transform-grammar (W72) | — |
| color() not replay-equal — `color(` wrapper dropped (CROSS-REPO-ASK; `color.ts:508-543`, W71) | **OUT/HANDOFF — L.W10 Band B** value.js | — |
| var() inside color function THROWS (CROSS-REPO-ASK; `color.ts:257-269`) | **OUT/HANDOFF — L.W10 Band B** value.js | — |
| @property `<syntax>` string opaque, initial-value untyped (CROSS-REPO-ASK; W73/W103) | **OUT/HANDOFF — L.W10 Band B** value.js | — |
| CSS Nesting (Baseline-2023) silently DROPPED; url-token mis-tokenized; modern at-rules (@container/@layer/@scope/@property/@page) degrade to genericAtRule (★×3; W98/W101-110) | **OUT/HANDOFF — L.W10 Band B** value.js+parse-that coordinated | `proof:css-parity` capability matrix |
| env()/attr()/system-colors declared in .bbnf but parser omits — nothing gates reference vs impl (⚠11; W107/W108) | **OUT/HANDOFF — L.W10 Band B** value.js | — |
| TWO divergent CSS grammars in the spine — parse-that/parsers/css/ (no constellation consumer) AND value.js stylesheet.ts (⚠25/⚠26; the architectural decision) | **L-SCOPE — L.W10 research spike FIRST** (W97) — unify on ONE grammar: delete parse-that/parsers/css OR promote it to the tokenizer value.js consumes | the spike (no code) then coordinated publish |
| NO serializer in parse-that's CSS module — round-trip structurally absent (⚠26; W99) | **OUT/HANDOFF — L.W10 Band B** parse-that | — |
| incremental/streaming parse as the SOTA-perf differentiator (W100) | **L-SCOPE — L.W10 research-and-challenge wave FIRST** (no code) | — |
| parse-that packrat unsound tier (id-only key; ⚠27/W93) | **OUT/HANDOFF — L.W9 Band B** parse-that (id,offset) re-key (PT-2 tripwire) | `proof:packrat-position` first |
| parse-that typesVersions points to nonexistent path (⚠21/W91) | **OUT/HANDOFF — L.W9 Band B** parse-that PT-WAVE-4 | — |

### 4e — the GATE-SUITE blind-spots (Lane 33 — the load-bearing L law)

| Blind-spot (audit · source) | Terminal verdict | L wave |
|---|---|---|
| the 5 replay-equality breaches ALL silently pass; round-trip gates are SOURCE-SHAPE (grep anchors, not enumerate input) | **L-SCOPE — L.W1** `proof:replay-equality` born-RED FIRST | — |
| proof:ingest-replay has NO arm for the W3 ingest cures | **L-SCOPE — L.W3** NEW arms | — |
| scroll-BLIND has NO compose gate | **L-SCOPE — L.W2** NEW scroll fixture | — |
| proof:color-fidelity is single-pair midpoint ΔE — cannot catch multi-color densify | **L-SCOPE — L.W2** NEW multi-color fixture | — |
| 259 fixed-ms waitForTimeout sleeps = the macOS-pass/Linux-fail render-race root (★) | **L-SCOPE — L.W4** the settle primitive (W28) | inv-L-device-honesty |
| CI demo-smoke + proof:all serial-AND fail-fast — no report-all (★) | **L-SCOPE — L.W4** report-all posture (W27) | — |
| no Linux-container local-repro (★) | **L-SCOPE — L.W4** (W29) | — |
| device-dependent thresholds not single-sourced (W30) | **L-SCOPE — L.W4** | inv-L-device-honesty |
| proof:no-single-option-select missing CI gate — product fix in place (W2) | **L-SCOPE — L.W4** | gate-only |
| proof:live-session-mobile M2 touch path missing (W19) | **L-SCOPE — L.W4** | gate-only |
| proof:zero-alloc covers ONLY the compositor — LIGHT tier ungated (Lane 33) | **L-SCOPE — L.W7** | — |
| release.yml runs a thinner gate roster than ci.yml (no proof:published-surface/proof:deps-current) (Lane 36) | **L-SCOPE — L.W4** publish-path hardening | — |
| no proof:peer-satisfied gate catches the F-2 ELSPROBLEMS class (Lane 36) | **L-SCOPE — L.W4** NEW proof:peer-satisfied | the gate stays RED until glass-ui fixes the peer |

### 4f — the COMPLETION-LANE net-new (Lanes 32/35 — gesture/transport DX + the validate verb)

| Net-new (lane) | Terminal verdict | L wave |
|---|---|---|
| Draggable bounds + snap + rubber-band — GSAP-Draggable/Motion-dragConstraints hole (Lane 32 GAP) | **L-SCOPE — L.W5** W-GESTURE-BOUNDS | `proof:drag-gesture` extended (bounds/snap) |
| Sequence segment-lifecycle + label-callback channel + LIGHT subscribe hook (Lane 32 GAP) | **L-SCOPE — L.W5** W-TRANSPORT-EVENTS | `proof:transport-events` born-RED (segment callbacks fire) |
| 2-D drag single-call sugar (Lane 32) | **L-SCOPE — L.W5** | — |
| the agent-authoring `validate(css)`/`explain(css)` verb — net-new, NOT in W127 (Lane 35) | **L-SCOPE — L.W6** W-AGENT-VALIDATE — read-only projection over DiagnosticCode+CompileRefusal+WAAPIEligibility → one `{parseable,eligible,refusals,diagnostics,waapi}`; the llms.txt validate→fix→compile LOOP | `proof:agent-validate` born-RED; gated on L.W1+L.W2 so the refusal surface it projects is TOTAL |
| `generate()` from-intent verb (Lane 35 GEN-1) | **KILL** — off-axis (KISS/inv-16/moat-gestalt; the LLM generates, kf validates+compiles); added to L's anti-charter | `L.md §L.W6` ("generate() is KILLed") |
| README prose for the six undocumented 4.3.0 exports (reseatToSpring, probeVelocity, reducedMotionScale, resolveRange, parseScrollTimeline, parseScrollRange) (Lane 34) | **L-SCOPE — L.W8** (pairs with the publish/dogfood wave) | — |

---

## 5. THE PRECEPT VIOLATIONS — all 34 ⚠ to a terminal verdict (zero drops)

The audit's 34 ⚠ rows. Each is ADDRESSED (already held), L-SCOPE (a named L cure), or OUT/HANDOFF
(fix-at-sibling). **None carried forward bare.**

| ⚠ | Class · site | Terminal verdict |
|---|---|---|
| ⚠1 | aria-orientation consume-suppress band-aid (SpringSidebar.vue:43, one of two strips) | **OUT/HANDOFF — L.W9** glass-ui BB (W24/W50); delete on consume |
| ⚠2 | inv-16 spirit — override-at-consume is the anti-pattern | **OUT/HANDOFF — L.W9** consume a FIXED glass-ui |
| ⚠3 | incomplete-fix — AnimationControls strip unaddressed (fleet-wide leak) | **OUT/HANDOFF — L.W9** root fix at glass-ui |
| ⚠4 | P-inv-28 H→J mis-termination of DL-K1/K2/K3/K4/K10 via source-shape gates | **ADDRESSED** — K.W0 rebuilt the oracle + terminated at product level (`239da4a`); `prompt-recap-k.md §16` |
| ⚠5 | no-workaround — BLK-8/RF-17 click-strand kf interim (no 3rd interim) | **OUT/HANDOFF — L.W9** retire on the glass-ui 4.1.0 consume-edge |
| ⚠6 | acyclic-spine — the G-era file: symlink | **ADDRESSED** — corrected G.W2/RP-5; no recurrence (package.json tilde-pinned) |
| ⚠7 | inv-16 — the aria-orientation consume workaround | **OUT/HANDOFF — L.W9** glass-ui BB + delete the line |
| ⚠8 | glass-ui F-2 peer-cycle (^0.10.0‖^0.11.0 rejects value.js 0.13.0) | **OUT/HANDOFF — L.W9** BB obligation + **L.W4 proof:peer-satisfied** |
| ⚠9 | T1 inv-ε overclaim — K.WZ claims T1 RESOLVED without naming the option | **L-SCOPE — L.W4** T1 formal resolution (W62) — own the corpus, kill the "collapse the lattice" language |
| ⚠10 | near-workaround — parseDeclarationValue treats PARTIAL parse as success (value.js stylesheet.ts:221-232) | **OUT/HANDOFF — L.W10** value.js comma-list grammar |
| ⚠11 | parity-claim drift — .bbnf overstates real coverage, no equivalence test (value.js) | **OUT/HANDOFF — L.W10** value.js + `proof:css-parity` |
| ⚠12 | semantic incorrectness — transform axis-expansion non-isomorphic (value.js index.ts:61-105) | **OUT/HANDOFF — L.W10** value.js transform grammar (W72) |
| ⚠13 | no-silent-degrade — CSSValues.Values truncates at first comma, status=true (value.js) | **OUT/HANDOFF — L.W10** value.js comma-list grammar (the forward-leg loss) |
| ⚠14 | no-legacy/dead-code — parseDeclarationValue fallback never fires (value.js) | **OUT/HANDOFF — L.W10** value.js |
| ⚠15 | replay-equality — @property never re-emits backward (engine.ts:1225) | **L-SCOPE — L.W1** wire serializeStylesheetItem (W75) |
| ⚠16 | replay-equality — per-stop animation-composition asymmetric (format.ts:81-103) | **L-SCOPE — L.W1** (W76) |
| ⚠17 | forward asymmetry — named keyframe selectors ingested-then-THROWN (frame-compiler.ts:179-188) | **L-SCOPE — L.W1** SELECTOR-FLOOR (W118) |
| ⚠18 | inv-16 soft — FN_NAME Symbol stamped on value.js ValueUnit (utils.ts) | **OUT/HANDOFF — L.W9** value.js VJ-L1; kf workaround deleted |
| ⚠19 | replay-equality — value.js serializeDeclaration emits linear() in a form parseLinearStops rejects | **OUT/HANDOFF — L.W9** value.js VJ-L2 (linearStopsToCSS) |
| ⚠20 | no-workarounds — the linear() regex normalize (utils.ts:193-196) | **OUT/HANDOFF — L.W9** delete once VJ-L2 lands |
| ⚠21 | typesVersions — parse-that points to nonexistent path | **OUT/HANDOFF — L.W9** parse-that PT-WAVE-4 (W91) |
| ⚠22 | §1.5 expose — parseSingleValue/parseFunctionArgs primitive without a current consumer (parse-that) | **OUT/HANDOFF — L.W9** value.js adoption (W92) |
| ⚠23 | replay-equality — FunctionValue.toString() comma/space break (value.js) | **OUT/HANDOFF — L.W9** value.js W95 |
| ⚠24 | acyclic-spine/KISS — kf's direct parse-that dep for the `any` combinator | **OUT/HANDOFF — L.W9** value.js parseCSSSubValue (W94); kf drops the dep |
| ⚠25 | no-duplication — two CSS grammars in the spine | **L-SCOPE — L.W10** the ONE-grammar spike (W97) |
| ⚠26 | replay-equality by absence — parse-that CSS AST carries no Span/loc, no serializer | **OUT/HANDOFF — L.W10** parse-that (W99) |
| ⚠27 | no-legacy/dead-tier — packrat unsound memoization tier (parse-that) | **OUT/HANDOFF — L.W9** parse-that (id,offset) re-key (PT-2/W93) |
| ⚠28 | honest-refusal — multi-color drift ships silently with eligible:true (compile-color.ts:190) | **L-SCOPE — L.W2** CC-3.5 refuse-or-densify (W113) |
| ⚠29 | no-BOOK-the-lossy-default — multi-color densify is a SILENTLY LOSSY emit (compile-color.ts:188-189) | **L-SCOPE — L.W2** the safe deferral is a REFUSAL |
| ⚠30 | consume-published-siblings/DRY — reverseMs re-authors reverseCSSTime (compile.ts:241) | **L-SCOPE — L.W2** unify on reverseCSSTime (W115) |
| ⚠31 | replay-equality BREACH (active) — !important round-trips WITHOUT the flag (adapter.ts declsToVarMap) | **L-SCOPE — L.W1** DECLARATION-FLOOR (W116) |
| ⚠32 | NONE found — the implemented K surface is idiomatic | **ADDRESSED** — the named-selector inert pass-through is an honest commented deferral, not a workaround |
| ⚠33 | inv-16 HELD — kf consumes value.js 0.13.0 via ^0.13.0 (no file:/vendored); acyclic spine intact | **ADDRESSED** |
| ⚠34 | NO precept violations in the perf surface — the K-shipped perf code is clean; the ONLY gap is a missed-OPPORTUNITY (lerpArray un-consumed on the LIGHT tier) | **ADDRESSED + L-SCOPE the opportunity** — L.W7 L-PERF-2 (W122) |

**Net:** 5 ADDRESSED (already held: ⚠4/⚠6/⚠32/⚠33/⚠34) · 12 L-SCOPE (Band-A engine-internal cures:
⚠9/⚠15/⚠16/⚠17/⚠25/⚠28/⚠29/⚠30/⚠31 + the ⚠34 opportunity) · 17 OUT/HANDOFF (fix-at-sibling Band B:
⚠1/⚠2/⚠3/⚠5/⚠7/⚠8/⚠10/⚠11/⚠12/⚠13/⚠14/⚠18/⚠19/⚠20/⚠21/⚠22/⚠23/⚠24/⚠26/⚠27). **Zero carried bare.**

---

## 6. THE KILL ANTI-CHARTER — 12, re-confirmed at L (non-re-litigable)

The audit re-confirmed all 12 K-SEED KILLs valid; NONE revived as L waves (`audit-32-skeleton.txt
§KILL findings`; L.md:124-135). The L-born GEN-1 (generate-from-intent verb) is the 13th
re-confirmation. **RECORD permanent; non-re-litigable.**

| KILL | Status at L |
|---|---|
| VT-A (flipShared→VT dispatcher) | **KILL** — inv-16/kf-owns-time; structural, permanent |
| VT-B (parse ::view-transition @keyframes) | **KILL** — architectural boundary, permanent |
| CE-2 (@property for compositing) | **KILL** — platform physics unchanged (Chromium bug unshipped) |
| CE-3 (compositor-offloaded oklab ramp) | **KILL** — fundamental rendering architecture |
| EPF-2 (interpolation JIT) | **KILL** — dispatch already monomorphic; CSP/KISS-hostile for sub-25% |
| EPF-5 (LoAF adaptive-quality) | **KILL** — sheds author-declared intent; the weighted-blend axis IS the product |
| K-T1 (kf splitText) | **KILL** — a11y hazard, off all three axes |
| K-T3 (Custom-Highlight animation) | **KILL** — paint mask, not motion substrate |
| CC-7 (blanket @starting-style) | **KILL** — platform-incorrect framing, structural |
| ED-6 (JSR publish) | **KILL** — loses the static/dynamic boundary |
| PHYS-A (coupled vector springs) | **KILL** — equivalent to N independent springs |
| Worker/OffscreenCanvas/AnimationWorklet + GPU/WebGPU compute | **KILL** — re-examined 2026, STILL-KILL: no DOM-style write path off-main-thread |
| **GEN-1** (generate-from-intent verb) — L-BORN | **KILL** — KISS/inv-16/moat-gestalt; the LLM generates, kf validates+compiles (`L.md §L.W6`) |

**L.W-KILL-GUARD** (W120) re-confirms the anti-charter; a value.js AST extension would gate any
future re-look (e.g. @starting-style INGEST, which the CC-7 KILL covered only on the emit side).

---

## 7. THE CHRONIC / OUT / HANDOFF BAND — terminal, named, consume-edge shaped

The K ledger closed terminal (`proof:chronic-closure` 44 rows; all ten ≥4-tranche riders EXITED;
`prompt-recap-k.md §16`). L inherits the OUT/HANDOFF items as **Band-B gated consume-edges**, each
with a named tripwire, **none re-BOOKed** (P-invariant-28; `L.md:138-143`).

| Item (chronicity) | Disposition at L | Tripwire / consume-edge |
|---|---|---|
| RF-17/DL-K9 BLK-8 click-strand | **OUT/HANDOFF — L.W9** glass-ui-owned | glass-ui 4.1.0 collapse-crossfade strand fix (W1/W18/W43); kf workaround net-deletes on consume |
| GlassControlPoint/DL-K7 (5-tranche; keyframes-editor enabler) | **OUT/HANDOFF — L.W9** | gate-first BOOK `proof:control-point-live` FIRST; glass-ui BB scope reconcile (W34/W45/W54) |
| MorphSVG/FB-3 remainder | **OUT/HANDOFF — L.W9** | value.js VJ.W4 arc-length/getPointAtLength publish (W35/W44/W51); a new MorphSVG primitive candidate |
| parse-that packrat/PT-2 (id,offset) re-key | **OUT/HANDOFF — L.W9** | parse-that ^0.9.0 packrat publish; `proof:packrat-position` first (W47/W93) |
| `<color-interpolation-method>`/`in <space>` outside color-mix | **OUT/HANDOFF — L.W10** value.js | coordinated grammar publish |
| oklab color-string serialize→parse float drift (~1e-13) | **ADDRESSED — RECORD (epsilon row)** — a known gated value.js HANDOFF; round-trip stays falsifiable via number-count + 1e-9 closeness | `test/roundtrip-fidelity.test.ts:21-27` |
| EPF-1 engine read/write phase separation | **L-SCOPE — L.W7** (measure-first; the workload now real post-K.W8 ingest) | W40 |
| DL-K31 K-SEED BOOKs (CC-5/CC-6/VT-D/K4/K5/EPF-1/EPF-4) | **L-SCOPE / OUT split** — CC-5/CC-6 → L.W2; EPF-1 → L.W7; K4(LoAF)/K5(embeddable inspector)/EPF-4 → tripwire-gated L candidates (W38/W41/W46) | platform Baseline verification at L-open |
| DEP-1/2/3 deploy (CNAME/template/roster) | **ADDRESSED — THIS SESSION** — Cloudflare Pages `keyframes.babb.dev`; the close-merge round-trip OBSERVED (live serves `index-43okVJtx.js`) | `L.md §Provenance`; L.W0 re-observes |
| fourier-web pins value.js ^0.10.0 (excludes 0.11.x-0.13.0) | **OUT/HANDOFF** — fourier-owned bump ask, NOT value.js's nor kf's write | CROSS-REPO-ASK record |

---

## 8. THE L-IMPL TERMINAL — every dev-phase L-SCOPE row carried to its landed reality (gate-by-gate)

§1–§7 were the **dev-phase plan** (the L-SCOPE verdicts naming each wave + its born-RED gate). §8 is
that plan's **landed impl**, each row re-graded to its terminal at this close and cited by a gate
RE-RUN on `tranche-l-dev` tip `4686aa4`. The L-impl terminal vocabulary: **ADDRESSED-with-gate**
(GREEN, exit 0) / **HANDOFF-with-tripwire** (RED-by-design, exit 1, named tripwire) / **RECORD** /
**USER-DOMAIN** / **OUT**. Every exit code below was observed at the close, not asserted.

### 8a — Band A · the replay-equality TOTAL (Q1 §4a → L.W1/W2/W3 LANDED)

| L-SCOPE plan row (§4a) | L-impl terminal | Observed oracle |
|---|---|---|
| `!important` silently dropped (⚠31) | **ADDRESSED-with-gate (spec-corrected) + RECORD** — the W1 fixture was CORRECTED to the spec-faithful verdict: a keyframe-level `!important` is **invalid/ignored** per CSS Animations §3; value.js drops it, kf mirrors, the test LOCKs `not.toContain("!important")`. The verify-lane workaround was REVERTED. The missing no-silent-drop *diagnostic* is a NAMED value.js-O dispatch (`KF-TO-VALUEJS-O-ASKS.md #12`), Band-B consumed at L.W9 | `proof:replay-equality` GREEN — `node scripts/proof-replay-equality.mjs` → **exit 0** (commit `8e386a7`) |
| `@property --x <number>` never re-emitted backward (⚠15; `engine.ts:1225`) | **ADDRESSED-with-gate** — `serializeStylesheetItem` wired; the @property block serializes backward | `proof:replay-equality` → **exit 0** (`8e386a7`) |
| per-stop `animation-composition` asymmetric (⚠16; `format.ts:81-103`) | **ADDRESSED-with-gate** — per-stop composition survives the round-trip | `proof:replay-equality` → **exit 0** (`8e386a7`) |
| named selectors (entry/exit/cover/contain) ingested-then-THROWN (⚠17) | **ADDRESSED-with-gate** — named selectors ingest without throwing (`frame-compiler.ts` cure) | `proof:replay-equality` → **exit 0** (`8e386a7`) |
| OPERATOR-floor composite/iteration-composite/play-state (W117) | **ADDRESSED-with-gate** — the OPERATOR floor lands on `AnimationOptions` | `proof:replay-equality` → **exit 0** (`8e386a7`) |
| compiler scroll-BLIND — W9+W10 do not compose (W12) | **ADDRESSED-with-gate** — the scroll-driven compile fixture emits `animation-timeline`/`animation-range` | `proof:compile-replay` GREEN — `node scripts/proof-compile-replay.mjs` → **exit 0** (`8e386a7`+`4863446`) |
| multi-color densify ships non-faithful sRGB with `eligible:true` (⚠28/⚠29) | **ADDRESSED-with-gate** — multi-color per-key ships-or-refuses on the ΔE-ε proof (the honest-refusal clause restored) | `proof:compile-replay` → **exit 0** (`4863446`) |
| static-weight pre-multiply not in the compiler (CC-5, W36) | **ADDRESSED-with-gate** — static-weight pre-multiply lands | `proof:compile-replay` → **exit 0** (`4863446`) |
| animation-timeline/range not emitted from compileToCSS (W119) | **ADDRESSED-with-gate** — emitted from `compileToCSS` | `proof:compile-replay` → **exit 0** (`4863446`) |
| `reverseMs` re-authors reverseCSSTime — two serializers (⚠30; W115) | **ADDRESSED-with-gate** — time-serialize unified on `reverseCSSTime`; the bespoke `reverseMs` deleted | `proof:compile-replay` → **exit 0** (`4863446`) |
| seedAtTime delay-paused freeze — adoptRunning FREEZES on delay>0 (W8) | **ADDRESSED-with-gate** — the delay-reset arm seeds the takeover at captured `currentTime` (the freeze cured) | `proof:ingest-replay` GREEN — `node scripts/proof-ingest-replay.mjs` → **exit 0** (`4863446`) |
| nested @keyframes not walked (W7) | **ADDRESSED-with-gate** — the nested group-rule walk lands | `proof:ingest-replay` → **exit 0** (`4863446`) |
| ADOPT_REFUSE diagnostics missing (W9) | **ADDRESSED-with-gate** — the `ADOPT_REFUSE` diagnostics arm lands | `proof:ingest-replay` → **exit 0** (`4863446`) |
| adoptedStyleSheets/Shadow-DOM not walked (W10) | **ADDRESSED-with-gate** — the shadow-walk arm lands; cross-origin is a typed `CORS_SKIP`, never a silent drop | `proof:ingest-replay` → **exit 0** (`4863446`) |
| scroll-time currentTime resolution in adoptRunning (W11) | **ADDRESSED-with-gate** — the scroll-time arm lands | `proof:ingest-replay` → **exit 0** (`4863446`) |
| the 5 breaches ALL silently pass — `proof:replay-equality` does NOT exist (Lane 33 headline) | **ADDRESSED-with-gate** — the gate was authored born-RED FIRST, REDs on the unfixed tree, GREENs on the cure (the gate-first law honoured) | `proof:replay-equality` born-RED→GREEN (`8e386a7`) |

**§4a net: 16 L-SCOPE → 16 ADDRESSED-with-gate** (1 carries a RECORD rider — the spec-corrected
`!important` drop + its NAMED value.js-O diagnostic handoff). The three replay gates RE-RAN GREEN at
this close.

### 8b — Band A · SOTA-perf (Q2 §4b → L.W7 LANDED)

| L-SCOPE plan row (§4b) | L-impl terminal | Observed oracle |
|---|---|---|
| warmEngine() idle-warmer (W121) | **ADDRESSED-with-gate (measure-first) + RECORD** — `warmEngine()` landed measure-first; the `scheduler.postTask` idle-warmer is DEFERRED (the probe only SKIPs in jsdom — NOT asserted a win) | `npx vitest run test/zero-alloc.test.ts` → 7/7 (commit `d858044`) |
| lerpArray un-consumed on the LIGHT tier (⚠34; W122) | **ADDRESSED-with-gate** — `lerpArray` inlined to `leaves.ts` on the LIGHT tier (value.js has no math subpath); NumericAnimation/SpringProgress interp paths zero-alloc | `proof:zero-alloc` / `test/zero-alloc.test.ts` → 7/7 (`d858044`) |
| scheduler.postTask priority bands (W123) | **RECORD (measure-first DEFER)** — the postTask probe is a budgeted-bench frame; not asserted as a shipped win | bench-taxonomy (`d858044`) |
| granular loadAnimationEngine (W124) | **ADDRESSED-with-gate** — per-capability load accessors landed (the Promise.all-all-8 door made granular) | the granular accessors in `index.ts` (`d858044`) |
| EPF-1 read/write phase separation (W40, measure-first) | **RECORD (measure-first)** — the workload framed by the bench taxonomy; no JIT/phase-split asserted | bench-taxonomy (`d858044`) |
| value.js color-math hot paths allocate per-call (VJ.L1–L8) | **HANDOFF-with-tripwire — value.js O** — each ask dispatched (`KF-TO-VALUEJS-O-ASKS.md`); the alloc cure is sibling-owned | tripwire: value.js O (0.14.0) publish; `KF-TO-VALUEJS-O-ASKS.md` (`791b3bd`) |
| NO kf bench covers the value.js color-math alloc claims (Lane 33) | **ADDRESSED-with-gate** — the budgeted bench taxonomy frames the perf frontier (the claims now instrumented kf-side) | bench-taxonomy (`d858044`) |
| spring-vector ADOPT (3.8×@K=8) | **ADDRESSED-with-gate** — `SpringProgress.setTargets` vector-sugar SHIPPED (the 3.8×@K=8 win measured) | `proof:spring-vector` GREEN — `node scripts/proof-spring-vector.mjs` → **exit 0** (`d858044`) |

**§8b net: 8 rows (the §4b 7 + the spring-vector ADOPT ship) → 5 ADDRESSED-with-gate (lerpArray
LIGHT-consume, granular accessors, bench-taxonomy, spring-vector, warmEngine measure-first) + 2
RECORD(measure-first DEFER: postTask, EPF-1) + 1 HANDOFF-with-tripwire (value.js O color-math
alloc).** The spring-vector + zero-alloc gates RE-RAN GREEN.

### 8c — Band A · gate-suite device-honesty + the net-new DX/agent verbs (§4e/§4f → L.W4/W5/W6 LANDED)

| L-SCOPE plan row | L-impl terminal | Observed oracle |
|---|---|---|
| 259 fixed-ms sleeps — the macOS-pass/Linux-fail root (§4e; W28) | **ADDRESSED-with-gate** — the `waitForRender/settle` state-predicate primitive replaces the sleeps; `openControlsPanel` contains ZERO `waitForTimeout` | `proof:settle-is-predicate` GREEN — `node scripts/proof-settle-is-predicate.mjs` → **exit 0** (`f94fa7a`) |
| CI demo-smoke serial-AND fail-fast — no report-all (§4e; W27) | **ADDRESSED-with-gate** — report-all CI posture landed (demo-smoke `continue-on-error`; first-RED no longer aborts); Makefile `ci-linux` local-repro; CATEGORY taxonomy | report-all posture + `proof:settle-is-predicate` (`f94fa7a`) |
| no Linux-container local-repro (§4e; W29) | **ADDRESSED-with-gate** — the Makefile `ci-linux` local-repro target landed | `f94fa7a` |
| device-dependent thresholds not single-sourced (§4e; W30) | **ADDRESSED-with-gate** — the CATEGORY taxonomy (wall-clock / pixel-render / physics-settle) single-sources the thresholds | `f94fa7a` |
| proof:no-single-option-select missing gate (§4e; W2) | **ADDRESSED-with-gate** — every scene `<Select>` renders only when option-count > 1 | `proof:no-single-option-select` GREEN — `node scripts/proof-no-single-option-select.mjs` → **exit 0** (`f94fa7a`) |
| no proof:peer-satisfied gate catches the F-2 ELSPROBLEMS class (§4e; ⚠8) | **HANDOFF-with-tripwire** — the gate is AUTHORED and RE-RUNs **RED-by-design**: glass-ui 4.0.0 peer `^0.10.0‖^0.11.0` rejects value.js 0.13.0. It rides the report-all lane, never the blocking chain. RED is the kf-side proof the F-2 defect is LIVE | `proof:peer-satisfied` RED-by-design — `node scripts/proof-peer-satisfied.mjs` → **exit 1** (`f94fa7a`); tripwire: glass-ui BB widens the peer + kf re-pins |
| proof:live-session-mobile M2 touch path missing (§4e; W19) | **ADDRESSED-with-gate** — folded into the W4 transposition | `f94fa7a` |
| release.yml thinner roster than ci.yml (§4e; Lane 36) | **ADDRESSED-with-gate** — release.yml hardened (publish-path gate roster) | `f94fa7a` |
| Draggable bounds + snap + rubber-band — GSAP/Motion parity hole (§4f; Lane 32) | **ADDRESSED-with-gate** — `Draggable` clamps to bounds (S1), snaps to nearest target on release (S2), `drag2D` follows both axes (S4); LIGHT, value.js-free | `proof:drag-gesture` GREEN — `node scripts/proof-drag-gesture.mjs` → **exit 0** (`29bf376`) |
| Sequence segment-lifecycle + label-callback + LIGHT subscribe (§4f; Lane 32) | **ADDRESSED-with-gate** — `segment:enter` + `label` events fire with `(animation, masterClock)`; each returns an unsubscribe handle (the `.on` idiom). **Note: the gate's correctness-tier wiring is the subject of an §10 roster red — see `proof:gate-is-runtime`** | `proof:transport-events` GREEN — `node scripts/proof-transport-events.mjs` → **exit 0** (`29bf376`) |
| 2-D drag single-call sugar (§4f; Lane 32) | **ADDRESSED-with-gate** — `drag2D` shipped | `proof:drag-gesture` → **exit 0** (`29bf376`) |
| the agent-authoring `validate(css)`/`explain(css)` verb (§4f; Lane 35) | **ADDRESSED-with-gate** — `validate`/`explain` are a read-only projection returning `{parseable,eligible,refusals,diagnostics,waapi}`; the llms.txt validate→fix→compile LOOP documented; clause (c) spec-faithful (the `!important`/`@property` drop + multi-color refusal) | `proof:agent-validate` GREEN — `node scripts/proof-agent-validate.mjs` → **exit 0** (`5bef882`) |
| `generate()` from-intent verb (§4f; Lane 35 GEN-1) | **OUT (KILL)** — KISS/inv-16/moat-gestalt; the LLM generates, kf validates+compiles; the 13th anti-charter re-confirmation | `L.md §L.W6`; §6 KILL row |
| README prose for the six undocumented 4.3.0 exports (§4f; Lane 34) | **ADDRESSED-with-gate** — README prose paired with the publish/dogfood wave | `339d78b` (W8) |

**§8c net: 14 rows (8 from §4e gate-suite + 6 from §4f completion-lane) → 12 ADDRESSED-with-gate +
1 HANDOFF-with-tripwire (`proof:peer-satisfied` RED-by-design) + 1 OUT(KILL GEN-1).** The
settle/no-single-option/drag/transport/agent-validate gates RE-RAN GREEN; `proof:peer-satisfied`
RE-RAN RED-by-design (exit 1). *(The §4e perf-tier rows are dispositioned in §8b; the §4e
replay-band rows in §8a.)*

### 8d — Band A · constellation dogfood + publish (Q3 §4c → L.W8 LANDED)

| L-SCOPE plan row (§4c) | L-impl terminal | Observed oracle |
|---|---|---|
| ED-3 dogfood-inversion STAGED not landed — 0 barrel imports (W125) | **ADDRESSED-with-gate** — the inversion is COMPLETE: 0 demo files import `@src/animation/*`, 62 demo files write `@mkbabb/keyframes.js`; the boundary-ORACLE at the PACKAGE boundary bites | `proof:demo-on-published-surface` GREEN — `KFVUE_INVERSION_LANDED=1 node scripts/proof-demo-on-published-surface.mjs` → **exit 0** (`339d78b`) |
| keyframes-vue 0.1.0 UNPUBLISHED (W56/W15) | **HANDOFF-with-tripwire (USER-DOMAIN publish)** — clauses (a)+(c) GREEN (builds; peer floor `>=4.3.0`); **clause (b) RED-by-design** — `npm show @mkbabb/keyframes-vue@0.1.0` → E404. The publish is USER-DOMAIN (Mike Babb runs `npm publish --access public`); the clause rides the report-all lane | `proof:keyframes-vue-published` RED-by-design — `node scripts/proof-keyframes-vue-published.mjs` → **exit 1** (`339d78b`); tripwire: the USER-DOMAIN npm publish |
| extend animate() to dispatch the orchestration tier (W127) | **ADDRESSED-with-gate** — `animate()` gained a 5th branch routing `AnimationGroup‖Sequence` to `.play()` | the orchestration dispatch in `animate.ts` (`339d78b`) |
| PKG-3 d.ts collision-aliases (`Animation_2 as Animation`, W126) | **ADDRESSED-with-gate** — the `Animation`→`KeyframesAnimation` rename clears the API-Extractor collision; ZERO `_2` aliases (pure re-export alias `KeyframesAnimation as Animation`) | `proof:pkg3-clean` GREEN (`grep '_2 as' dist/keyframes.d.ts = 0`) (`339d78b`) |
| keyframes-react BOOK (W129) | **RECORD (BOOK, gate-first)** — the disposition doc on disk (`waves/L.W8-react-book.md`); `proof:keyframes-react-published` gate-first before any scaffold; NO react source written (tripwire: Vue proves the pattern first) | `docs/tranches/L/waves/L.W8-react-book.md` (`339d78b`) |
| aria-orientation consume-suppress band-aid — incomplete (⚠1-3/⚠7) | **HANDOFF-with-tripwire — glass-ui BB** — the COMPLETE fleet sweep (BOTH `SpringSidebar.vue` + `AnimationControls.vue`) is the S1/S2 arm of `proof:workaround-deletion`, PENDING | `proof:workaround-deletion` 5-PENDING — `node scripts/proof-workaround-deletion.mjs` → **exit 0** (staged); tripwire: glass-ui BB SegmentedTabs pill-variant fix + kf re-pin |
| RF-17/BLK-8 click-strand kf workaround (⚠5) | **HANDOFF-with-tripwire — glass-ui 4.1.0** | `proof:rf17-net-deletion` born-RED; tripwire: glass-ui 4.1.0 `W-DOCK-MORPH-FAMILY` + kf re-pin (interim deletes same commit) |
| the LIVE F-2 peer-cycle (⚠8) | **HANDOFF-with-tripwire — glass-ui BB** (see §8c `proof:peer-satisfied` RED-by-design) | `proof:peer-satisfied` → **exit 1** |
| FN_NAME Symbol stamp on value.js ValueUnit (⚠18) | **HANDOFF-with-tripwire — value.js VJ-L1** — the S8 arm of `proof:workaround-deletion`, PENDING | tripwire: value.js VJ-L1 first-class `flatLeaf`; workaround deletes on consume |
| linear() serialize/parse asymmetry regex (⚠19-20) | **HANDOFF-with-tripwire — value.js VJ-L2** — the S7 arm of `proof:workaround-deletion`, PENDING | tripwire: value.js VJ-L2 `FunctionValue.toString()` fix; regex deletes on consume |
| kf's direct parse-that dep for the `any` combinator (⚠24) | **HANDOFF-with-tripwire — value.js VJ-L3** — the S9 arm of `proof:workaround-deletion`, PENDING | tripwire: value.js VJ-L3 `parseCSSSubValue`; kf drops the dep |
| FunctionValue.toString() comma/space round-trip break (⚠23) | **HANDOFF-with-tripwire — value.js O W95** | tripwire: value.js O publish; `KF-TO-VALUEJS-O-ASKS.md` |

**§8d net: 12 rows → 3 ADDRESSED-with-gate (ED-3 inversion, animate() dispatch, PKG-3 rename) +
1 RECORD (keyframes-react BOOK) + 8 HANDOFF-with-tripwire (each named: keyframes-vue publish ·
aria S1/S2 · RF-17 · F-2 peer · FN_NAME VJ-L1 · linear VJ-L2 · parse-that VJ-L3 · ⚠23 W95).** The
demo-on-published-surface + pkg3-clean gates RE-RAN GREEN; keyframes-vue clause (b) + peer-satisfied
RE-RAN RED-by-design. *(The §4c §1-intake breakdown carried this as 4 L-SCOPE + 8 OUT/HANDOFF; the
keyframes-react row is the RECORD-BOOK, not an ADDRESSED gate.)*

### 8e — Band A · the design refinement (L.W11 — net-new this tranche)

| L.W11 plan row | L-impl terminal | Observed oracle |
|---|---|---|
| the crayons KEPT by register (the user's "design verdict: crayons-by-register" directive) | **ADDRESSED-with-gate** — every crayon keeper resolves to its 4.3.0 hue (the `--rainbow-*` six stops + cyan, `--accent-red`/`--color-progress`, the six cube facets, the bite-verified `--amiga-red`) | `proof:crayon-preserved` GREEN — `node scripts/proof-crayon-preserved.mjs` → **exit 0** (`4686aa4`) |
| nine engine-dogfooded per-scene instrument eggs (inv ζ — none hand-rolls a rAF) | **ADDRESSED-with-gate** — nine NEW per-scene eggs wired, each a hidden trigger → an off-the-normal-path effect dogfooding a public engine primitive | `proof:design-refinement` GREEN — `node scripts/proof-design-refinement.mjs` → **exit 0** (`4686aa4`) |
| the before/after TASTE packet | **USER-DOMAIN-PENDING** — the packet is on disk (`docs/frontend-design/taste-packets/l-w11/`); **THE TASTE VERDICT IS USER-DOMAIN** — closes ONLY on Mike Babb's "meets the bar" (the K precedent; an agent designer-eye PASS is corroboration, never the verdict). NOT self-certified | `docs/frontend-design/taste-packets/l-w11/` (`4686aa4`); verdict pending USER-DOMAIN |

**§8e net: 2 ADDRESSED-with-gate + 1 USER-DOMAIN-PENDING (the TASTE verdict).** The crayon/refinement
gates RE-RAN GREEN; the TASTE verdict is NOT self-certified.

---

## 9. THE DEFERRED-LEDGER TERMINALS — DL-L1..L13, each to its close disposition

The L `PROGRESS.md §"Open deferrals"` cluster ledger (DL-L1–DL-L13) + the 45 refining DLL rows
(`audit/deferred-ledger-L.md`). Each cluster row reaches a terminal disposition; the ≥4-tranche
HANDOFF rows (DL-L7 6-tranche, DL-L8 6-tranche, DL-L9 5-tranche) EXIT via a named sibling tripwire
+ a born-RED kf gate (P-invariant-28 — exit-shaped, not a punt). The `proof:chronic-closure`
re-point K→L is the orchestrator's final atomic motion (§11); it is NOT performed by this DOCS-ONLY
lane.

| DL-L row | Terminal disposition | Observed oracle / named tripwire |
|---|---|---|
| **DL-L1** replay-equality breach family | **FOLD (ADDRESSED-with-gate)** — L.W1+L.W2 LANDED | `proof:replay-equality` + `proof:compile-replay` + `proof:ingest-replay` all → **exit 0** (`8e386a7`/`4863446`) |
| **DL-L2** gate-corpus blind-spot (259 sleeps + fail-fast) | **FOLD (ADDRESSED-with-gate)** — L.W4 LANDED | `proof:settle-is-predicate` → **exit 0**; report-all posture (`f94fa7a`) |
| **DL-L3** F-2 peer-cycle | **FOLD (gate authored) + HANDOFF-with-tripwire (Band B cure)** — the gate exists; the cure is glass-ui BB-owned | `proof:peer-satisfied` RED-by-design → **exit 1** (`f94fa7a`); tripwire: glass-ui BB widened peer + kf re-pin |
| **DL-L4** ED-3 dogfood inversion | **FOLD (ADDRESSED-with-gate)** — L.W8 LANDED | `proof:demo-on-published-surface` → **exit 0** (`339d78b`) |
| **DL-L5** keyframes-vue unpublished | **FOLD (gate authored) + HANDOFF-with-tripwire (USER-DOMAIN publish)** — built + peer-floored; clause (b) RED until the npm publish | `proof:keyframes-vue-published` clauses a+c GREEN, b RED-by-design → **exit 1** (`339d78b`); tripwire: USER-DOMAIN `npm publish` |
| **DL-L6** RF-17 / DL-K9 GlassDock interim | **HANDOFF-with-tripwire** (chronicity 3, I,J,K→L) | `proof:rf17-net-deletion` born-RED; tripwire: glass-ui 4.1.0 RF-17 fix + kf re-pin (interim deletes same commit) |
| **DL-L7** GlassControlPoint / DL-K7 | **HANDOFF-with-tripwire** (chronicity 6, E→L; gate-first BOOK is the EXIT shape) | `proof:control-point-live` RED-by-design → **exit 1** (`791b3bd`; `GlassControlPoint` absent from glass-ui@4.0.0 dist); tripwire: glass-ui BB ships the primitive |
| **DL-L8** MorphSVG / FB-3 | **HANDOFF-with-tripwire** (chronicity 6, C→L) | `proof:morphsvg-consume` born-RED; tripwire: value.js O (0.14.0) VJ.W4 arc-length sampler remainder |
| **DL-L9** parse-that packrat / PT-2 | **HANDOFF-with-tripwire** (chronicity 5, E→L) | `proof:packrat-sound` born-RED; tripwire: parse-that PT-WAVE-6 (id,offset) re-key |
| **DL-L10** kf-owned constellation workarounds | **FOLD-on-consume / HANDOFF-with-tripwire** — 5-PENDING staged (each arm PRESENT, sibling-fix unpublished) | `proof:workaround-deletion` → **exit 0** (5-PENDING, `791b3bd`); tripwires per arm (S1/S2 glass-ui BB · S7 VJ-L2 · S8 VJ-L1 · S9 VJ-L3) |
| **DL-L11** true-CSS-parity frontier | **FOLD (research-spike decision) + HANDOFF-with-tripwire (W10-IMPL)** — Option B written + accepted (delete parse-that `parsers/css/` STRUCTURAL grammar; consolidate the one CSS grammar in value.js); **`proof:css-parity` is RED-today by honest declaration** — the gate SCRIPT is ABSENT from the tree (`scripts/proof-css-parity.mjs` does not exist; not in `package.json`). W10-IMPL is gated on the coordinated value.js-O + parse-that publish | `docs/tranches/L/audit/W10-css-parity-spike.md §3.2` (Option B); `8c134d9`; tripwire: value.js O + parse-that coordinated publish + kf re-pin |
| **DL-L12** mobile Lighthouse floors | **VERIFY-ONLY (RECORD, gated on a built L dist)** — re-run on the L dist with the K floors (home 68/cube 66/amiga 52/square 65/easing 63/spring 55) as the hard floor; non-gate (runner-calibrated, RECORDED). Gated on `proof:all` going green (§10) so the dist is deploy-ready | the K floors are the non-regression contract; the artifact is produced on the L close dist once the roster is green |
| **DL-L13** T1 formal resolution | **FOLD (ADDRESSED-with-gate)** — L.W0 LANDED; `proof:gate-is-runtime` is the formal T1 resolution (the gate set is DERIVED from `proof:correctness` membership, not a hand-edited list — the K-decision option (b) "own the corpus"); T1 non-re-litigable. **inv ε correction:** the "collapse the lattice" language is NOT deleted from `precepts-k.md` (grep → 2 hits, §3 T1 lines 246/253); the terminal rests on the WIRED derivation gate, not a language-deletion | `proof:gate-is-runtime` AUTHORED + WIRED `package.json:106`/`:190` (the formal resolution; RED-local at tip on the roster-reconciliation list); the language NOT absent — claim corrected |

**DL-L net: 5 FOLD (DL-L1/L2/L4/L13 ADDRESSED-with-gate; L11 research-spike-FOLD) + 4 pure
HANDOFF-with-tripwire (DL-L6/L7/L8/L9, each ≥3-tranche, EXIT-shaped) + 2 split FOLD+HANDOFF
(DL-L3/L5) + 1 FOLD-on-consume/HANDOFF (DL-L10) + 1 VERIFY-ONLY (DL-L12).** The ≥4-tranche
HANDOFF rows are exit-shaped (named tripwire + born-RED gate, P-invariant-28). The 45 refining DLL
rows in `audit/deferred-ledger-L.md` carry the per-item evidence each cluster terminal cites.

---

## 10. THE BAND-B DISPATCH ROWS — the three cross-repo dispatches, terminal

The L.W9 constellation dispatch (`791b3bd`) FILED three cross-repo ask documents; the Oscillator
LIGHT primitive shipped (`src/animation/index.ts:74` `export { Oscillator, waveformValue }`). EVERY
Band-B consume-edge is UN-CONSUMED at this close (registry-probed: glass-ui `4.0.0` with the F-2
peer-cycle LIVE · value.js `0.13.0`, O/0.14.0 unpublished · parse-that `0.9.0` · keyframes-vue
UNPUBLISHED). Each is a HANDOFF with a NAMED tripwire — the named sibling publish — per
P-invariant-28. **Nothing below is asserted closed.**

| Dispatch row | Terminal disposition | Observed oracle / named tripwire |
|---|---|---|
| `KF-TO-GLASSUI-BB-ASKS.md` FILED | **HANDOFF-with-tripwire** — the aria-suppress (S1/S2), the RF-17 dock-morph, the F-2 peer widen, GlassControlPoint, the dock-flicker | tripwire: glass-ui BB publish; `proof:peer-satisfied`/`proof:control-point-live`/`proof:rf17-net-deletion` born-RED kf-side |
| `KF-TO-VALUEJS-O-ASKS.md` FILED (14 asks incl. the 2 W10-confirmed value.js crashes) | **HANDOFF-with-tripwire** — VJ-L1 `flatLeaf` (FN_NAME), VJ-L2 `FunctionValue.toString()` (linear regex), VJ-L3 `parseCSSSubValue` (parse-that dep), VJ.W4 arc-length (MorphSVG), the comma-list/transform/color grammar (CSS-parity), the `!important`-drop diagnostic (#12) | tripwire: value.js O (0.14.0) publish; `proof:workaround-deletion` S7/S8/S9 + `proof:morphsvg-consume` born-RED |
| `KF-TO-PARSE-THAT-ASKS.md` FILED | **HANDOFF-with-tripwire** — PT-WAVE-6 (id,offset) packrat soundness; the CSS-module serializer (the Option-B consolidation) | tripwire: parse-that PT-WAVE-6 publish; `proof:packrat-sound` born-RED |
| `proof:workaround-deletion` 5-arm staged | **HANDOFF-with-tripwire (5-PENDING)** — each arm PRESENT, paired sibling-fix UNPUBLISHED; the workaround line deletes in the same commit as the consume | `node scripts/proof-workaround-deletion.mjs` → **exit 0** (STAGED report, `791b3bd`) |
| `proof:control-point-live` (GlassControlPoint absent) | **HANDOFF-with-tripwire (RED-by-design)** — `GlassControlPoint` absent from glass-ui@4.0.0 dist; a green here before the publish would HIDE the gap | `node scripts/proof-control-point-live.mjs` → **exit 1** (`791b3bd`); tripwire: glass-ui BB publish |
| W10 true-CSS-parity (Option B chosen) | **HANDOFF-with-tripwire** — the architectural verdict written/accepted; `proof:css-parity` RED-today (gate script ABSENT — the un-consumed frontier honestly declared) | `W10-css-parity-spike.md §3.2`; `8c134d9`; tripwire: coordinated value.js-O + parse-that publish |
| the Oscillator LIGHT primitive | **ADDRESSED-with-gate** — shipped at L.W9 (LIGHT, value.js-free) | `src/animation/index.ts:74` `export { Oscillator, waveformValue }` (`791b3bd`) |

**Band-B net: every consume-edge UN-CONSUMED at close → HANDOFF-with-tripwire (named sibling
publish), each with a born-RED kf gate RE-RUN RED-by-design** (`proof:peer-satisfied` exit 1,
`proof:control-point-live` exit 1, `proof:keyframes-vue-published` clause-b exit 1,
`proof:workaround-deletion` 5-PENDING exit 0). The Oscillator is the one ADDRESSED Band-B ship. This
is the inv ε state (P-invariant-28: a named tripwire + born-RED kf gate IS exit-shaped).

---

## 11. THE USER-DOMAIN FINALE + THE CLOSE MOTIONS — named, not asserted done

The close's final motions are USER-DOMAIN (Mike Babb) or the orchestrator's sequenced close-impl
step. **None is asserted done by this DOCS-ONLY recap.** Each is named with its terminal shape.

### 11a — the standing-mandate directives this session (every distinct user request, terminal)

| User request (this session) | Terminal verdict | Evidence / oracle |
|---|---|---|
| **begin the L tranche** (charter + waves + dev-phase audit-fold) | **ADDRESSED** — `L.md` + `waves/L.W0..L.W11+L.WZ` on disk; the 36-lane audit folded | `docs/tranches/L/` corpus; commits `ca1633d`/`6235b91`/`3dd6335` |
| **NO quick solutions / NO workarounds — idiomatic gestalt** | **ADDRESSED + the residual band NAMED** — the Band-A waves are root cures (the replay floor at the adapter/format seam; the settle primitive over 259 sleeps; lerpArray inlined to leaves); the kf-owned constellation workarounds are NAMED with a born-RED deletion gate each (`proof:workaround-deletion` 5-PENDING), NOT carried bare | §5 (34 ⚠ all dispositioned); `proof:workaround-deletion` → exit 0 (staged) |
| **maximal parallelism** (the file-disjoint Band-A wave fan-out) | **ADDRESSED** — W1∥W2∥W3∥W4∥W5∥W7∥W8 landed file-disjoint (W6 gated on W1+W2; the DAG honoured); each its own born-RED gate | `PROGRESS.md §1` DAG; the per-wave commits |
| **the design verdict: crayons KEPT by register** | **ADDRESSED-with-gate** — every keeper crayon resolves to its 4.3.0 hue | `proof:crayon-preserved` → **exit 0** (`4686aa4`) |
| **wait on glass-ui (BB tranche in flight)** | **HANDOFF-with-tripwire** — the Band-B edges that need glass-ui BB (aria, RF-17, F-2 peer, GlassControlPoint, dock-flicker) are DISPATCHED + born-RED-gated; the consume + deploy WAIT on the glass-ui BB publish (USER-DOMAIN/sibling-gated) | `KF-TO-GLASSUI-BB-ASKS.md`; `proof:peer-satisfied`/`proof:control-point-live` RED-by-design |
| **complete in totality** | **ADDRESSED for Band A (gate-cited) + HANDOFF for Band B (tripwire-named)** — Band A is gate-GREEN totality (or honest refusal); Band B is un-consumed-but-named; the round-trip is TOTAL or honestly refuses | §8 (Band A gates GREEN); §10 (Band B tripwires); FINAL §0–§S9 |

### 11b — the close-finale motions (USER-DOMAIN / orchestrator-sequenced)

| Finale motion | Terminal shape | Honest state (NOT asserted done) |
|---|---|---|
| `proof:all` GREEN on the close tree | **HANDOFF (orchestrator close-impl)** — RE-RUN at `4686aa4` REDs on THREE roster members that grew un-reconciled during Band-A: `proof:gate-is-runtime` (exit 1 — `proof:transport-events` is jsdom, not a browser-over-dist, colliding the I.W7/J.W3 meta-gate), `proof:agent-surface` (exit 1 — `/llms-full.txt` STALE, omits W9 `Oscillator`/`waveformValue`; fix = re-run `gen-agent-surface.mjs`), `proof:decomposition` (exit 1 — `drag.ts` 555L/`index.ts` 731L/`sequence.ts` 817L/`spring.ts` 806L grew past ceilings). DOCS-ONLY does not cure these | `proof:gate-is-runtime`/`proof:agent-surface`/`proof:decomposition` each → **exit 1** at `4686aa4` (re-run this close) |
| version cadence — MAJOR `5.0.0` vs MINOR `4.4.0` | **USER-DOMAIN (RECOMMEND 5.0.0)** — the recommendation is `5.0.0` (replay-equality TOTAL is a BREAKING output-surface change; the `Animation`/`ScrollTimeline` type renames; `@mkbabb/keyframes-vue` net-new + barrel-dogfood). The tree carries `4.3.0`; **the cut is Mike Babb's; NOT asserted shipped** | `package.json:version = 4.3.0` (re-verified); FINAL §S6; the cut is USER-DOMAIN |
| npm publishes (kf version cut + `@mkbabb/keyframes-vue` 0.1.0) | **USER-DOMAIN** — `npm publish` is the user's hand; `proof:keyframes-vue-published` clause (b) stays RED until then | `proof:keyframes-vue-published` clause-b → **exit 1**; tripwire: USER-DOMAIN publish |
| glass-ui BB consume + the deploy round-trip | **HANDOFF (USER-DOMAIN / sibling-gated)** — the deploy is gated, in order, on (1) `proof:all` green (the three roster reds cleared), (2) `proof:peer-satisfied` green (glass-ui BB widened peer + kf re-pin), (3) the USER-DOMAIN version cut + publish. **The J.W0/K.WZ round-trip is NOT re-observed at this close; the FINAL does not claim it** | FINAL §S6; tripwire: glass-ui BB publish → kf re-pin → CI green → `deploy-pages.yml` auto-fire |
| TASTE verdict (the L.W11 packet) | **USER-DOMAIN-PENDING** — closes ONLY on Mike Babb's "meets the bar" on the before/after packet; NOT self-certified | `docs/frontend-design/taste-packets/l-w11/`; verdict pending |
| Lighthouse re-verification (DL-L12) | **VERIFY-ONLY (RECORD, gated on a built L dist)** — re-run on the L dist; K floors the hard floor; gated on `proof:all` green | FINAL §S7; the K floors stand |
| chronic-closure substrate transition K→L | **HANDOFF (orchestrator final atomic motion)** — `scripts/proof-chronic-closure.mjs:110` `CHRONIC_LEDGER` STILL points at `docs/tranches/K/PROGRESS.md` (re-verified; gate → exit 0 on the K substrate). The re-point + the three planted-malformed-row non-vacuity proof + the L-ledger-terminal is ONE atomic source motion the DOCS-ONLY close does not perform | `proof:chronic-closure` → **exit 0** on K substrate (re-run); `CHRONIC_LEDGER` line 110 = K (re-verified) |

**§11 net: every standing-mandate directive this session is ADDRESSED or HANDOFF-with-tripwire; the
close-finale motions are USER-DOMAIN (version cut, npm publishes, TASTE verdict, glass-ui BB consume
+ deploy) or orchestrator-sequenced (`proof:all` roster-red clear, the chronic-closure re-point,
the Lighthouse re-verify) — NONE asserted done.** This is the inv ε close: the recap claims only what
a re-run reproduces; nothing un-consumed or USER-DOMAIN is claimed closed.

---

## inv ε / inv-16 compliance

This lane wrote ONLY `docs/tranches/L/audit/prompt-recap-L.md`. ZERO source/test/gate/CI/demo
edits (the chronic-closure substrate re-point is the orchestrator's final motion, NOT this
workflow's). Every status verified against the tree anchors at `tranche-l-dev` tip `4686aa4`:
`package.json` (kf `4.3.0` — the K cut, the L cut USER-DOMAIN; value.js `^0.13.0`; parse-that
`^0.9.0`; glass-ui `~4.0.0`); the L wave commits (`8e386a7` W1 · `4863446` W2+W3 · `f94fa7a` W4 ·
`29bf376` W5 · `5bef882` W6 · `d858044` W7 · `339d78b` W8 · `791b3bd` W9 · `8c134d9` W10-spike ·
`e42a95b` engine-decomp · `4686aa4` W11); the A→K commit log (`4737ab3` 4.3.0 release; `9bbc227`
master tip; the K wave commits `c427e39`…`138be67`); the L charter + close (`L.md`; `FINAL.md`;
`PROGRESS.md §"Open deferrals"` DL-L1–L13; `audit/deferred-ledger-L.md` the 45 DLL rows); the K
close ledger (`prompt-recap-k.md`, chain-trusted for the A→K rows).

**Every gate verdict in §8–§11 is a RE-RUN exit code at this close, observed not asserted:** GREEN
(exit 0) — `proof:replay-equality`, `proof:compile-replay`, `proof:ingest-replay`,
`proof:settle-is-predicate`, `proof:no-single-option-select`, `proof:demo-on-published-surface`
(`KFVUE_INVERSION_LANDED=1`), `proof:transport-events`, `proof:drag-gesture`, `proof:agent-validate`,
`proof:crayon-preserved`, `proof:design-refinement`, `proof:spring-vector`,
`proof:workaround-deletion` (5-PENDING staged), `proof:chronic-closure` (on the K substrate);
RED-by-design (exit 1) — `proof:peer-satisfied`, `proof:control-point-live`,
`proof:keyframes-vue-published` (clause b); roster-red for `proof:all` (exit 1, named for the
orchestrator close-impl) — `proof:gate-is-runtime`, `proof:agent-surface`, `proof:decomposition`.
The `scripts/proof-css-parity.mjs` script is ABSENT (the RED-today CSS-parity frontier, honestly
declared). No prompt A→L, no THIS-SESSION edict, no L-intake breach/frontier, no DL-L row, no
Band-B dispatch, no close-finale motion is dropped — each has a terminal verdict (ADDRESSED-with-gate
/ RECORD / HANDOFF-with-tripwire / USER-DOMAIN / OUT) with a named commit, gate exit code, wave, or
sibling tripwire. **Zero drops.**

---

## TOTALS

| Category | Count | Status |
|---|---|---|
| Standing-spine MANDATE clauses (1a) | 7 | 7 — 4 ADDRESSED · 3 L-SCOPE/HONORED |
| Design directive (1b) | 1 | ADDRESSED (K-closed/deployed; L carries demo-UX completion) |
| A→K lineage (chain-trusted to prompt-recap-k.md) | A→K | ALL terminal (zero drops at K close); 1 re-opened (U-K19 → L.W5) |
| THIS-SESSION: ship K in totality (4.3.0 cut/merge/deploy/publish) | 5 sub | 5 ADDRESSED — ALL DONE, live |
| THIS-SESSION: live-audit F1–F6 (Band I) | 6 | 6 ADDRESSED — TASTE-approved, DEPLOYED |
| THIS-SESSION: green the CI (6-round epic) | 6 sub | 6 ADDRESSED (3 roots → L.W4 terminal) |
| THIS-SESSION: the 32-to-36-lane audit + L development | 5 sub | 5 ADDRESSED |
| THIS-SESSION: 100+ prompts / BB-in-flight / no-half-baked / FULL lanes | 3 | 3 ADDRESSED/HONORED |
| L-intake Q1 round-trip breaches (4a) | 16 | 16 L-SCOPE (L.W1/W2/W3) |
| L-intake Q2 SOTA-perf frontier (4b) | 7 | 6 L-SCOPE (L.W7) · 1 OUT/HANDOFF (value.js O) |
| L-intake Q3 constellation (4c) | 13 | 5 L-SCOPE (L.W8) · 8 OUT/HANDOFF (L.W9) |
| L-intake Q4 true-CSS-parity frontier (4d) | 13 | 2 L-SCOPE spike (L.W10) · 11 OUT/HANDOFF |
| L-intake gate-suite blind-spots (4e) | 13 | 13 L-SCOPE (L.W1/W2/W3/W4/W7) |
| L-intake completion-lane net-new (4f) | 6 | 5 L-SCOPE (L.W5/W6/W8) · 1 KILL (GEN-1) |
| Precept violations ⚠1-34 (§5) | 34 | 5 ADDRESSED · 12 L-SCOPE · 17 OUT/HANDOFF — zero bare |
| KILL anti-charter (§6) | 13 (12 + GEN-1) | 13 KILL — non-re-litigable |
| Chronic/OUT/HANDOFF band (§7) | 11 named | ALL terminal (consume-edge shaped or RECORD) |
| **L-impl §8a — replay-equality TOTAL** | 16 | **16 ADDRESSED-with-gate** (1 RECORD rider: spec-corrected `!important` + value.js-O diagnostic handoff); 3 replay gates RE-RAN GREEN |
| **L-impl §8b — SOTA-perf** | 8 | **5 ADDRESSED-with-gate · 2 RECORD(measure-first DEFER) · 1 HANDOFF-with-tripwire** (value.js O); spring-vector/zero-alloc GREEN |
| **L-impl §8c — gate-suite + DX/agent verbs** | 14 | **12 ADDRESSED-with-gate · 1 HANDOFF-with-tripwire** (`proof:peer-satisfied` RED-by-design) **· 1 OUT(KILL GEN-1)** |
| **L-impl §8d — dogfood + publish** | 12 | **3 ADDRESSED-with-gate · 1 RECORD(react BOOK) · 8 HANDOFF-with-tripwire** (each named) |
| **L-impl §8e — design refinement (L.W11)** | 3 | **2 ADDRESSED-with-gate · 1 USER-DOMAIN-PENDING** (TASTE verdict) |
| **Deferred ledger DL-L1..L13 (§9)** | 13 | **5 FOLD · 2 FOLD+HANDOFF (L3/L5) · 4 HANDOFF-with-tripwire (L6/L7/L8/L9 ≥3-tranche, exit-shaped) · 1 FOLD-on-consume/HANDOFF (L10) · 1 VERIFY-ONLY (L12)** + the 45 refining DLL rows |
| **Band-B dispatch rows (§10)** | 7 | **6 HANDOFF-with-tripwire (all consume-edges UN-CONSUMED, each born-RED) · 1 ADDRESSED-with-gate (Oscillator)** |
| **Standing-mandate directives this session (§11a)** | 6 | **4 ADDRESSED / ADDRESSED-with-gate · 2 HANDOFF/split** (wait-on-glass-ui; complete-in-totality = Band-A GREEN + Band-B tripwire) |
| **Close-finale motions (§11b)** | 7 | **USER-DOMAIN (version cut · npm publishes · TASTE) · HANDOFF (proof:all roster-red clear · glass-ui BB consume + deploy) · VERIFY-ONLY (Lighthouse) · orchestrator-atomic (chronic-closure re-point)** — NONE asserted done |

**Zero drops. Every request A→L, every THIS-SESSION edict, every L-intake breach/frontier, every
DL-L row, every Band-B dispatch, and every close-finale motion reaches a TERMINAL verdict:
ADDRESSED-with-gate, RECORD, HANDOFF-with-tripwire, USER-DOMAIN, or OUT — each cited by a gate
RE-RUN exit code, a named commit, or a named sibling tripwire.** The honest close: Band A is
gate-GREEN totality (or honest refusal); every Band-B consume-edge is UN-CONSUMED at close, named
with its tripwire + a born-RED kf gate RE-RUN RED-by-design (P-invariant-28 — exit-shaped, not a
punt); `proof:all` is NOT green on this tip (three roster reds named for the orchestrator close-impl);
the deploy round-trip is HANDOFF (NOT observed); the version `5.0.0` is RECOMMENDED (NOT cut); the
TASTE verdict + the npm publishes + the glass-ui BB consume + deploy are USER-DOMAIN. Nothing
un-consumed or USER-DOMAIN is claimed closed. **That is the inv ε close.**
