# Tranche K — PROGRESS (the board + the K open-deferrals chronic ledger)

**Branch:** `tranche-k-dev` (forked off `master` @ `4f1fc4c` — the J-close tip; kf `4.2.0` published
via `release.yml`'s first-ever run `27378331075`; value.js `^0.11.2`, glass-ui `~3.11.2`, parse-that
`^0.9.0` consumed PUBLISHED).
**Type:** TRANCHE K — **DEVELOPMENT (AUTHORED, NOT IMPLEMENTED).** This board records the wave
plan as AUTHORED-now-run-later specs and the consolidated K open-deferrals ledger. **No engine,
demo, gate, test, or CI source is written in this phase** (the D→J dev/impl boundary, charter §Phase /
§DEV-IMPL boundary). §1 carries each wave's AUTHORED status + its headline gate(s) named-now-born-RED-
later; the §"Open deferrals" ledger is the NEXT chronic-closure parse substrate (J's remains
AUTHORITATIVE until K.WZ — see the SUBSTRATE-TRANSITION note).
**Dev-phase date:** 2026-06-12. **Version in tree:** `4.2.0` (the J close cut); K's own version cut +
publish + close-merge deploy round-trip are USER-DOMAIN (Mike Babb, confirm-first), fired at K.WZ.

This board is the spine of the tranche-development phase: the §0 headline (why K exists — the two
unnamed J blind axes + the partial design roots), the §1 wave board with each wave's REAL headline
gate, the §2 finding-cluster ledger expanded with evidence anchors, the §3 precept reckoning, and the
§"Open deferrals" chronic ledger that FOLDS every DL-K row + the U-K register + the L-deferral band
into the next parse substrate. Companion documents:

- **`K.md`** — THE binding charter (the finding-cluster→wave ledger, the wave-map DAG, the three
  K-born invariants — the COLD-axis invariant, the engine-write disambiguation rule, the TASTE
  boundary — the MANDATE, the chronic+deferred fold). This board agrees with it exactly.
- **`PATH-FORWARD.md`** — the executive summary (the two blind axes, the partial roots, the
  remediation sequence, the wholesale-defer-to-L argument).
- **`waves/K.W0..K.WZ.md`** — the authored-now-run-later wave specs (each spec's header reads
  `Phase: DEV — spec authored`; §1's board carries the per-wave AUTHORED status).
- **`L-SEED.md`** — the frontier re-seeded UNCHANGED (the CC-1 compiler, K1 ingestion, SO-1 scroll,
  WL2-B, PHYS-C, ED-1, the value.js half, the 12 KILLs, the BOOKs) — wholesale-deferred per
  `audit/k-seed-reconciliation.md` (Shape A).
- **`audit/*.md`** — the 33-doc K audit corpus (8 live-finding lanes, 10 J plan-vs-delivery lanes, 8
  current-state lanes, 6 ledger/synthesis lanes, + the completeness critic). The §2 cluster ledger and
  the §"Open deferrals" substrate cite these by name §section.
  - **`audit/deferred-ledger-k.md`** — THE consolidated J→K deferred/chronic ledger (32 DL-K rows);
    this board's §"Open deferrals" substrate input.
  - **`audit/precepts-k.md`** — the J→K precept register (P14/P14b/P16/P17, the two new K precepts
    P6-WITNESS + P-TASTE, the six J-born tensions T1–T6); this board's §3 input.
  - **`audit/live-session-gap-analysis.md`** — the axis-coverage map (the cold-entry P0, the B1
    vacuity, the K gate roster the coverage demands); the §1 K.W0/K.W5 headline-gate input.
  - **`audit/live-cold-play-path.md`**, **`live-amiga-breakage.md`**, **`live-dock-tabs-selects.md`**,
    **`live-typography-truth.md`**, **`live-glassui-currency.md`**, **`live-fourier-grid.md`**,
    **`live-spring-sequence-mp-verdict.md`** — the 8 live-finding lanes rooting U-K1..U-K20.
  - **`audit/k-seed-reconciliation.md`** — the Shape-A wholesale-defer-to-L argument (the L-deferral
    band's disposition authority).

---

## §0 — THE HEADLINE (why Tranche K exists)

Tranche J extended the gate-ORACLE precept to every boundary the product crosses — deploy, publish,
docs, axes, design — and discharged each with an OBSERVED oracle (`J/FINAL.md`: 4.2.0 published via
`release.yml`'s first run; the auto-deploy round-trip observed twice; the axes battery born-RED
witnessed). **Hours after the close, the user drove the live product and found its PRIMARY FIRST-RUN
GESTURE broken:** the hero rainbow-play does not start the engine — the playhead advances while every
subject stands frozen. The K audit (32 lanes + a completeness critic, 33 evidence docs, every claim
file:line- or probe-rooted) finds J's close HONEST at every boundary it certified and **structurally
blind on two axes it never named:**

- **The COLD axis.** Every J gate enters scenes by hash-nav and choreographs
  `openControlsPanel → select → play`. NO gate drives the HERO CTA, a cold mount, or a default
  state (`live-session-gap-analysis.md §0/§1`: `goto#/ AND clickPlay AND NOT seedControlsOpen → 0
  matches`). The P0 (triple-rooted: `live-cold-play-path.md P0-1`, `live-session-gap-analysis.md §1`,
  `demo-scenes-k.md`): the hero rainbow-play navigates `#/` → `#/cube` and resumes via
  **`scenePlaybackAdapters.ts:76-79` — a resume NO-OP on a never-started group** (the snapshot says
  `playing:false`, `:57`); the FSM enters `playing`, the progress UI polls `anim.t`, and `interpFrames`
  never writes a subject. WORSE: the certifying oracle was VACUOUS against exactly this defect —
  live-session B1 greens on **101 distinct transforms produced by the `.idle-hover` CSS bob at REST
  with the engine OFF** (`live-session-gap-analysis.md §1`, `k-verify-gate-blindspot.mjs`: B1 PASS while
  play aria reads `"Play animation"`): a liveness oracle that cannot tell an ENGINE write from a
  decorative CSS animation.
- **The TASTE boundary.** The J.W7c verify rounds asked agents for a "designer-eye" verdict and got
  PASS; the user's same-day verdict on the same panes: "still sucks", "awful", "looks awful"
  (`live-spring-sequence-mp-verdict.md`). Gate-green and agent-taste do not bound design-good. The
  boundary needs a NAME and a protocol, not a stronger adjective in a prompt.

Underneath the axes, the design language is PARTIAL AT ITS ROOTS: **no single font-voice authority**
(two redundant display tokens `--font-serif` AND `--font-display`, per-site stacks, the dock rendering
system-sans beside a serif hero — U-K6/8/10, `styling-typography-k.md`); the dock anchoring rides
hardcoded offsets (U-K7, `layout-grid-k.md`); pathological screens (3440×1440, 5120×2880) stretch
rather than cluster; glass-ui sits two minors behind (`~3.11.2` vs published 3.13.0,
`live-glassui-currency.md`); and the indicted panes carry rooted defects (the spring slider STEPS, lone
selects render, a pane clips left, the FourierField squats in the hero).

**K's correction is one move with two halves: extend the oracle discipline to the COLD axis (TRUE from
the first gesture), and bound it honestly at the TASTE boundary (where gates cannot carry the verdict,
the protocol hands it to the user — named, packaged, and BEFORE the close). The design language is made
total at its ROOTS** (one font authority, one anchoring system, the current glass-ui), not per-site.
**THE FRONTIER DEFERS WHOLESALE TO L** (`L-SEED.md`; `k-seed-reconciliation.md` Shape A) — un-blocking
the value.js grammar gates and decaying nothing, while the P0 decays daily.

**Board state at the development close:** all wave specs AUTHORED (§1); the §"Open deferrals" ledger
is the K parse substrate (J's remains AUTHORITATIVE until the K.WZ re-point). NO implementation has
occurred — the impl phase opens only on explicit user authorization.

---

## §1 — THE WAVE BOARD (AUTHORED statuses + headline gates)

The longest serial path (charter §WAVE-MAP): **W0 → W1 → (W2 ∥ W3) → W4 → WZ**, with W5's legs riding
their owning waves and W6 parallel throughout. Status legend: **AUTHORED** = the wave spec is on disk
this dev phase, born-RED witness plan named, run later on authorization. The headline gate is
named-now / born-RED-later (the gate SOURCE is written in the impl phase, never here).

| Wave | Title | Status | Headline gate(s) (named; born-RED-later) | Born-RED witness plan (the defect the oracle is written to bite) | DAG |
|---|---|---|---|---|---|
| **K.W0** | The cold-entry truth (the P0) | **AUTHORED** | `proof:cold-entry` — fresh context, NO seed, `goto #/`, click the hero rainbow play, assert the LOAD-BEARING pair (dock play aria flips `Play→Pause` AND the playback slider/`--ball-p` advances from 0) PLUS an aria-GATED corroborator (the OrbitalDrag-wrapper engine-write transform ≥3 distinct WHILE aria=Pause, `.idle-hover` excluded — NOT a bare single-element count; `.cube`=0 cold / `.graph`=13 engine-OFF per `K.W0.md §Provenance`); B1 de-vacuoused (engine-write disambiguation). `proof:chronic-closure` re-pointed J→K in ONE motion | RED on today's tree: `k-verify-gate-blindspot.mjs` shows B1 PASS while play aria = `"Play animation"`; the cold cube produces 0 engine-write transforms (`k-isolate.mjs`); the adapter resume is a NO-OP on a never-started group (`scenePlaybackAdapters.ts:76-79`) | **LEADS** — its oracle is consumed by every later wave |
| **K.W1** | The consume edge (glass-ui re-pin) | **AUTHORED** | `proof:deps-current` widen + a born-RED `proof:repin-witness` for glass-ui `~3.11.2 → ~3.13.0`; the W7b parity-clause exits re-examined on 3.13.0; the `click-integrity` composable consumed (retires the RF-17 pointerdown interim) | RED on today's pin: `~3.11.2` resolves `3.11.2`; the tilde blocks `3.12/3.13`; registry latest `3.13.0` (`npm view @mkbabb/glass-ui version`); the 4 removed primitives (InstrumentRail/HandMark/DeckProgress/GlassDialogNative) absent-after-bump | after W0 lands locally |
| **K.W2** | The typographic root | **AUTHORED** | `proof:font-voice-authority` — ONE voice-token authority (display/mono/body) resolves on every surface INCLUDING the dock-label (positive `dock-label → display serif` assert, not just the Jakarta negative); `--font-serif`/`--font-display` redundancy collapsed to one | RED on today's tree: `proof:demo-fonts` greens while the dock resolves the text/mono voice; `font-census.mjs` finds two display tokens + per-site stacks (`styling-typography-k.md`) | after W1 (∥ W3); BINDING boundary: W2 owns the VOICE tokens |
| **K.W3** | The layout transposition | **AUTHORED** | `proof:dock-anchor-derived` (NO hardcoded dock offsets — anchor tokens derived, not retuned) + `proof:pathological-cluster` (a width AND height ceiling after which docks + controls CLUSTER; `clamp()`/container-query driven) | RED on today's tree: `probe-pathological.mjs` shows docks/controls STRETCH at 3440×1440 / 5120×2880; `layout-grid-k.md` censuses the hardcoded offsets | after W1 (∥ W2); BINDING boundary: W3 owns the GRID/anchoring tier |
| **K.W4** | The pane verdicts, round 2 | **AUTHORED** | `proof:no-single-option-select` (TOTAL — no lone-option Select renders anywhere) + the spring-slider-smoothness oracle (the few-Hz readout mirror must NOT drive the slider) + the FourierField-absent-on-hero assert | RED on today's tree: the ChromeDock controls-tab `<Select>` renders a 1-item dropdown on the single-surface scenes (easing/spring) — the sole sweep violation (`live-dock-tabs-selects.md §2.1/§3 S1`, `ChromeDock.vue:199-221`); the spring slider STEPS (U-K15); `<FourierField variant="hero">` mounts (`live-fourier-grid.md`, `EditorStartScreen.vue:78-86`) | after W2 + W3 (consumes the new voice + grid) |
| **K.W5** | The gate-truth wave | **AUTHORED** | The axis-coverage map executed: `proof:cold-entry` (W0's own hard gate); `proof:subject-animates` extended from synthetic pages to the REAL scenes; the meta-gate `proof:gate-is-runtime` derives its set from `proof:correctness` membership (T3); the TASTE review-packet protocol instrumented; `release.yml` `timeout-minutes` (F-1); the demo-smoke wall-clock hazard dispositioned | RED-per-leg: each leg born-RED on a PLANTED dist defect; the meta-gate reds when `proof:demo-fonts` (load-rest) is audited (T3); the cold-entry leg born-RED on the live P0 | **LEGS PARTITION** — the cold-entry oracle lands WITH W0; the rest land as the surfaces they certify land; the TASTE packets generate at W4's close |
| **K.W6** | Terminations (P-invariant-28) | **AUTHORED** | No new gate (terminations + measurements): the DL-K ≥4-tranche riders exit probe-or-KILL; the mobile-lighthouse floor re-assertion on a calibrated host (`KF_REQUIRE_LH=1`); the W2 drag-seam gaps + the dev-mode parity chronicle dispositioned | The measurement IS the witness (a bench / a calibrated-host Lighthouse run / a node probe) per the EXIT-shaped disposition; no born-RED gate where the exit is a measurement artifact | **PARALLEL** throughout |
| **K.WZ** | CLOSE | **AUTHORED** | FINAL.md held to inv ε; the prompt-recap extended; `proof:chronic-closure` re-pointed J→K (the substrate transition); the TASTE review packets presented + the user verdict recorded; the version cut + publish + close-merge round-trip RE-observed; `L-SEED.md` committed; the K ledger terminal | The substrate re-point is GATED non-vacuous (planted malformed K-ledger rows red on the three clause shapes, per the J.WZ precedent); the close-merge deploy round-trip RE-observed (CI→deploy→live bytes) | **CLOSES** — the design band closes ONLY on the user's review-packet verdict (the TASTE boundary), a named USER-DOMAIN step BEFORE the version cut |

**P6 posture per wave (the device-independence taxonomy carried from J).** Each wave's spec declares,
per gate clause, one of: **hard** (asserts in CI, device-independent), **observe-only** (device-
dependent measurement recorded, never CI-hard-gated — the quiet-host measurement of record), **runner-
calibrated** (`KF_REQUIRE_LH=1` on a calibrated host). The cold-entry oracle (W0/W5) is **hard** (a
browser actuation over the built dist, device-independent — it reads the engine's own write channel, not
a frame budget). The pathological-cluster oracle (W3) is **hard** (a deterministic resize + computed-
layout read). The mobile-lighthouse floors (W6/DL-K11) are **runner-calibrated** (the J probe was
contention-tainted; never measured-quiet — P6-WITNESS forbids closing it on an observe-only score with
no on-device born-RED witness). The TASTE review-packet step (W4/WZ) is **non-gateable** (P-TASTE: the
user's verdict, never an agent's PASS).

---

## §2 — THE FINDING-CLUSTER LEDGER (expanded with evidence anchors)

The charter's §finding-cluster→wave table, expanded per cluster with the decisive evidence anchors
(audit lane §section + U-K id + DL-K id). Severity from the fleet: the cold-path **P0** (triple-rooted)
+ the U-K register (20 findings, 19 file:line-rooted, U-K19 critic-rooted to the playground) + the DL-K
ledger (32 rows) + the per-lane FOLD tables.

### 2.1 — The cold-entry truth (P0) → K.W0

| Finding | Evidence anchor | U-K / DL-K |
|---|---|---|
| The hero rainbow-play → `#/cube` resume NO-OP (resume on a never-started group; the FSM plays, subjects freeze) | `live-cold-play-path.md P0-1`; `live-session-gap-analysis.md §1`; `scenePlaybackAdapters.ts:76-79` (`:57` snapshot says `playing:false`); `demo-scenes-k.md` | U-K2/K3/K5 · DL-K1 |
| B1's vacuity (greens on idle CSS bob — 101 distinct transforms, engine OFF) | `live-session-gap-analysis.md §1` (`k-verify-gate-blindspot.mjs`: B1 PASS while play aria = `"Play animation"`); `CubeTarget.vue:207-214` (`.idle-hover { animation: idle-bob }`) | — · DL-K2 (the meta-chronic) |
| The hero→scene transition shows a loading gap (no smooth handoff) | `live-cold-play-path.md`; `live-session-gap-analysis.md §1` | U-K2 · DL-K1 |
| U-K1 the dock not shrunken by default (the W7c U2 always-expanded state) | `live-session-gap-analysis.md §2 (U-K1)`; `TransportDock.vue:23` `:always-expanded="false"` | U-K1 · — |
| U-K4 the amiga float+flash (3 compounding defects: texture-multiply, 69%w/37%h envelope, persisted cold-resume) | `live-amiga-breakage.md` (K4-A `useAmigaAnimations.ts:54-58`; K4-B `:24`+`AmigaScene.vue:62`; K4-C `useSceneMachine.ts:45`) | U-K4 · DL-K4 |
| FB-1 animation-composition HONORING (the engine drops a declared CSS operator) | `adapter.ts:24-29,120-126` captures it; `engine.ts` reads it never (grep=0); `K-SEED.md §2 WL2-B` | — · DL-K16 (5-tranche; K.W0 LEAD) |
| Per-scene cold-mount/default-state defects | `demo-scenes-k.md` | U-K5 · DL-K3 |

### 2.2 — The consume edge → K.W1

| Finding | Evidence anchor | U-K / DL-K |
|---|---|---|
| glass-ui `~3.11.2` (tilde blocks 3.12/3.13) vs published **3.13.0** (the "breaking tranche" — dock-taxonomy rewrite, fluid-typography tokens, CSS god-module carve, new primitives, `click-integrity` composable, autoLuminance default-ON, 4 primitives REMOVED) | `live-glassui-currency.md §1-2`; `package.json:182`; registry `3.13.0` | U-K14 · DL-K6 |
| The W7b parity-clause exits (4 of 7 edges) re-examined on 3.13.0; the handoff-ledger rows landed upstream | `glassui-handoff-k.md`; `glassui-AX-handoff.md:11,44-47` | — · DL-K8/K23 |
| The press-scale / RF-16 / RF-17 (BLK-8 family) hazards status; the `click-integrity` composable cures RF-17 at the root | `live-glassui-currency.md §1` (click-integrity in 3.13.0); `FINAL.md:585` (BLK-8 recurrence) | — · DL-K9 |
| AX-1 `GlassControlPoint` (the keyframes-editor enabler) — consume-on-3.13.0 OR reasoned build-in-kf | `glassui-AX-handoff.md:108-141` | — · DL-K7 (5-tranche net-new) |

### 2.3 — The typographic root → K.W2

| Finding | Evidence anchor | U-K / DL-K |
|---|---|---|
| NO single font-voice authority: `--font-serif` AND `--font-display` redundant; per-site stacks; the dock renders system-sans | `styling-typography-k.md`; `font-census.mjs`/`font-census-raw.json` | U-K6/U-K8/U-K10 · DL-K10 (4-tranche; CH-2 mis-RE-AFFIRMED) |
| The top-dock expanded fonts wrong; the one-line wrap; global inconsistencies | `live-typography-truth.md §2-4`; `ChromeDock.vue` | U-K8/U-K9/U-K10 · DL-K10 |
| The cure: ONE voice-token authority (display/mono/body) consumed everywhere, the dock joining the display voice at the ROOT (the RF-2 lever on the re-pin) | `styling-typography-k.md`; `live-typography-truth.md §2-4` (`dock-label → --font-text`); `glassui-AX-handoff.md` RF-2 | U-K6 · DL-K10 |

### 2.4 — The layout transposition → K.W3

| Finding | Evidence anchor | U-K / DL-K |
|---|---|---|
| U-K7 the hardcoded dock-offset census; the anchoring/offset tier is unsound (the macro `.controls-layout` grid IS sound) | `layout-grid-k.md`; `TransportDock.vue`/`ChromeDock.vue`/`AnimationControlsGroup.vue` | U-K7 · — |
| NO hardcoded offsets (anchor tokens DERIVED, not retuned) | `layout-grid-k.md` (the digested modern-web-guidance patterns) | U-K7 · — |
| Pathological screens: width AND height ceilings after which docks + controls CLUSTER (`clamp()`/container-query driven); desktop+mobile both refined | `layout-grid-k.md`; `probe-pathological.mjs` (3440×1440, 5120×2880 STRETCH today) | U-K7 · DL-K3 (mobile leg) |

### 2.5 — The pane verdicts, round 2 → K.W4

| Finding | Evidence anchor | U-K / DL-K |
|---|---|---|
| U-K11 spring: a PROPER keyframes-editor variant (the cube grammar); the STEPPING slider cured at its ROOT (the few-Hz readout mirror must not drive the slider) | `live-spring-sequence-mp-verdict.md`; `SpringSidebar.vue:110-126`; `SpringTarget.vue` | U-K11/U-K15 · DL-K3 |
| U-K17 the final-state register = the main-controls red with dashed outline (the green disliked) | `live-spring-sequence-mp-verdict.md`; `ControlsPaneWrapper.vue` | U-K17 · — |
| U-K12 the tabs → pills or dock-dropdown items | `live-dock-tabs-selects.md`; `ChromeDock.vue`/`App.vue` | U-K12 · — |
| U-K13/K18 the awful/noisy readout panes re-cut for hierarchy with less information | `live-spring-sequence-mp-verdict.md`; `AnimationControls.vue` (`TimingFunctionPanel.vue`/`LayerConfigPanel.vue`) | U-K13/U-K18 · — |
| U-K16 single-option selects NEVER render (the totality sweep) + the vizs gain REAL options (keyframes variants) | `live-dock-tabs-selects.md §2/§3` (the sole VIOLATION `ChromeDock.vue:199-221` S1 — the easing/spring 1-tab dropdown; the swept `EasingSelect.vue`/`AnimationControlsControls.vue` are cleared OK) | U-K16 · DL-K5 |
| U-K17 the left-clipped pane un-clipped + draggable | `live-dock-tabs-selects.md`/`live-spring-sequence-mp-verdict.md`; `ControlsPaneWrapper.vue` | U-K17 · — |
| U-K20 the FourierField REMOVED from the hero + grid lines less opaque | `live-fourier-grid.md` (the removal seam + the honest vacancy); `EditorStartScreen.vue:78-86` | U-K20 · — |
| U-K19 RECORDED playground-only (dispositioned, NOT deployed-SPA scope) | `completeness-critic.md` (critic-rooted to the playground app) | U-K19 · — (RECORD) |

### 2.6 — The gate-truth wave → K.W5

| Finding | Evidence anchor | U-K / DL-K |
|---|---|---|
| The axis-coverage map executed: `proof:cold-entry` (the engine-write channel asserts, born-RED on today's tree) | `live-session-gap-analysis.md §2` (the K gate roster); `live-cold-play-path.md` | — · DL-K1/K2 |
| B1 de-vacuoused (engine-write disambiguation — drop `.idle-hover`/`.graph` from the distinct-count; add a play-aria-flips precondition) | `live-session-gap-analysis.md §2` (items 1-2) | — · DL-K2 |
| `proof:subject-animates` extended from the synthetic page to the REAL scenes | `live-session-gap-analysis.md §FOLD F4`; `proof-subject-animates.mjs:81-117` | — · DL-K2 |
| The meta-gate derives its set from `proof:correctness` membership (T3); `proof:demo-fonts` tier-decided | `precepts-k.md §3 T3`; `scripts/proof-gate-is-runtime.mjs:84-93` | — · — |
| The TASTE-boundary review-packet protocol instrumented (rides the W3-lib capture harness) | `precepts-k.md §S2 P-TASTE`; the TASTE boundary (charter §invariants) | — · — |
| `release.yml` `timeout-minutes` (F-1); the demo-smoke wall-clock hazard dispositioned (the live 35m ceiling — `ci.yml:213` — re-measured against the post-J.W4 roster; the `19m13s` figure was the pre-J.W4 20m-era baseline) | `ci-cd-k.md §F-1/§F-2`; `J.W0-impl.md:205-206` (CICD-7) | — · DL-K13 |

### 2.7 — Terminations (P-invariant-28) → K.W6

| Finding | Evidence anchor | U-K / DL-K |
|---|---|---|
| The DL-K ≥4-tranche exit-only rows (the ten `‡` riders) exit probe-or-KILL | `deferred-ledger-k.md §2`; the §"Open deferrals" ledger below | — · DL-K1/K2/K3/K4/K6/K7/K10/K16/K17/K18/K20/K24 |
| The mobile-lighthouse floor re-assertion on a calibrated host | `deferred-ledger-k.md DL-K11`; `perf-battery-2026-06-10.md:36-55` | — · DL-K11 |
| The W2-noted pre-existing drag-seam gaps (TimelineTrack/useSheetGesture/useSphereSpin) dispositioned | `deferred-ledger-k.md DL-K15`; `J.W2-impl.md:208-218` | — · DL-K15 |
| The dev-mode parity chronicle (the stale-vite-cache class) dispositioned | `deferred-ledger-k.md` (the dev-mode parity row) | — · — |

### 2.8 — CLOSE → K.WZ

| Finding | Evidence anchor | U-K / DL-K |
|---|---|---|
| FINAL.md held to inv ε; the prompt-recap extended through the close | `prompt-recap-k.md` | — · — |
| The chronic-closure substrate transition J→K (the §"Open deferrals" re-point) | `precepts-k.md §3 T6` (P-SUBSTRATE); `scripts/proof-chronic-closure.mjs:109` | — · — |
| The TASTE review packets presented + the user verdict recorded (the design band closes ONLY here) | the TASTE boundary (charter §invariants); `precepts-k.md §S2 P-TASTE` | — · — |
| The version cut + publish + close-merge round-trip RE-observed; `L-SEED.md` committed; the K ledger terminal | `packaging-k.md`; `k-seed-reconciliation.md` (Shape A); `L-SEED.md` | — · DL-K26..K32 (SEED→L) |

---

## §3 — THE PRECEPT RECKONING (from `audit/precepts-k.md`)

The J-inherited precept spine + the J-born invariants + the two new K precepts + the six tensions K
must resolve (the full register with file:line evidence is `audit/precepts-k.md`).

### 3.1 — The structural spine (carried A→J, all five HELD through J impl)

| # | Precept | J status | Gate |
|---|---|---|---|
| P1 | no-legacy | HELD (`grep` deprecat/legacy/workaround/hack/FIXME/TODO → 0) | `proof:no-deprecated-guard` |
| P6 | inv α — boundary gated, not asserted | HELD (light modules 0 static value.js edge) | `proof:boundary` + `proof:published-surface` |
| P7 | inv β — library glass-ui-free | HELD (library deps = parse-that + value.js only) | `package.json` dep layout |
| P11 | inv ζ — dogfood | HELD (3 allowlist-gated rAF sites) | `proof:dogfood` |
| P13 | inv-16 — consume published siblings | HELD (glass-ui/value.js/parse-that from registry, zero `file:`) | `proof:deps-current` / lockfile |

### 3.2 — The J-born invariants (the gate discipline's core)

| # | Invariant | J status | K form |
|---|---|---|---|
| P14 | the gate-ORACLE precept | HELD for the correctness tier; one narrowing exposed (the meta-gate audits a hardcoded `WAVE_HARD_GATES` list, omits `proof:demo-fonts`; that gate is load-rest in correctness) | K.W5: the meta-gate DERIVES its set from `proof:correctness` membership (T3); `proof:demo-fonts` tier-decided |
| P14b | the AXES completeness corollary | HELD for the axes J.W4 exercised; the un-exercised axis it NAMES — the hero COLD PATH — is uncovered | K.W0: the cold-entry correctness leg (the FIRST concrete application) |
| P16 | P-invariant-28 — no perpetual punts | HELD on the PAPER substrate; INVERTED on the live product (the ten `‡` riders mis-terminated through the blindspot — `deferred-ledger-k.md §0/§2`) | K.W0/W6: the ≥4-tranche riders exit via a born-RED system gate or a measurement; the substrate grooming lands in ONE motion (P-SUBSTRATE) |
| P17 | born-RED discipline | HELD across all 10 waves; the P0 subject-write episode turned it inward | every K gate carries a born-RED witness for the exact defect its oracle bites |
| P18 | dev/impl boundary | HELD (this phase authors docs only) | unchanged — the process boundary; the impl phase opens on authorization |
| P20 | version-owner / user-domain publish | RESOLVED (4.2.0 cut + published) | K's own cut is USER-DOMAIN; the `release.yml`-gates-on-correctness question resolved at K.W5 |
| P21 | glass-ui-fixes-in-glass-ui | HELD (W7c cures are consumer-side uses of published APIs) | K.W1: re-pin `~3.11.2 → ~3.13.0`; the ROOT fixes (dock/font/anchoring) belong in glass-ui, never patched in kf |

### 3.3 — The two NEW K precepts (named, non-gateable in the mechanical sense)

| # | Precept | Statement (from `precepts-k.md §S1/§S2`) |
|---|---|---|
| **P6-WITNESS** | observe-only chronic closure | *A chronic closure that cites an observe-only gate MUST also carry a named on-device born-RED witness (a concrete run environment + measurement + defect-as-planted probe). A CI-green observe-only gate without an on-device witness is NOT a complete chronic closure.* (Binds DL-K11 — the mobile floors that have never measured-quiet.) |
| **P-TASTE** | the TASTE boundary made standing | *"Gate-green" certifies that the named oracles pass. It does NOT certify that the running product looks or feels correct to a human. Every appearance wave's close produces a review packet (per-pane before/after, desktop+mobile, the named deltas) and the design band closes ONLY on the user's verdict — a named USER-DOMAIN step BEFORE the close. An agent's "designer-eye PASS" is corroboration, never the verdict.* (The charter's TASTE-boundary invariant.) |

### 3.4 — The J-born tensions K's charter resolves (not inherits)

| # | Tension | Resolution in K |
|---|---|---|
| T1 | KISS vs the gate corpus (109 gates; the collapse was authority-only) | K.W0/W5 charter decision: net-deletion on the script estate OR formally own the corpus + KILL the "collapse the lattice" language |
| T2 | the engine un-fencing | **RESOLVED in J** (`J/FINAL.md §2` — permanent; `src/animation` is the kf PRODUCT). NOT re-litigated |
| T3 | the meta-gate one-directionality (P14 symmetry incomplete) | K.W5: derive `WAVE_HARD_GATES` from `proof:correctness` membership; `proof:demo-fonts` reds the meta-gate → forces the tier decision |
| T4 | the glass-ui currency gap (`~3.11.2` vs `3.13.0`) | K.W1: re-pin `~3.13.0` as the first infra motion before any design wave (U-K14) |
| T5 | props-destructuring | **RESOLVED in J** (the narrowed kernel; MEMORY rule rewritten). K inherits the narrowed rule only |
| T6 | the "two live narratives" risk at the tranche transition (NEW for K) | **P-SUBSTRATE**: the `proof:chronic-closure` re-point + the K chronic registration happen in ONE motion (K.WZ), never in sequence — never two live narratives, neither green |

---

## Open deferrals

**THE chronic-closure parse substrate (for `proof:chronic-closure`) — the K consolidated open-deferrals
ledger.** This is the consolidated J→K deferred/chronic ledger built from `audit/deferred-ledger-k.md`
(32 DL-K rows) + the U-K register + the L-deferral band + `K.md §clusters/§fold`, PLUS two
spine-authored consolidation rows (**DL-K33/DL-K34**) that home the `engine-core-k.md` and
`packaging-k.md` lane §FOLD findings the original 32-row ledger did not separately consolidate (the
completeness-hardening pass — every audit-lane §FOLD row band-dispositioned). Every row carries
born-tranche, chronicity (machine-readable integer), disposition, owning wave, and the gate/evidence
(the closure oracle). The header columns match the `scripts/proof-chronic-closure.mjs` parse grammar
exactly (Item | Born | Chronicity | Disposition | Owning wave | The gate / evidence).

> **SUBSTRATE-TRANSITION NOTE (binding — NOT YET EXECUTED; J's ledger remains AUTHORITATIVE until K.WZ).**
> Through K's development phase the authoritative parse target for `proof:chronic-closure` REMAINS
> `J/PROGRESS.md §"Open deferrals"` (`scripts/proof-chronic-closure.mjs:109` `CHRONIC_LEDGER` points
> there as of the J close, terminal and GREEN). **The substrate TRANSITION to THIS K ledger is a K.WZ
> IMPLEMENTATION-PHASE motion** (the single path-constant re-point `J/PROGRESS.md → K/PROGRESS.md
> §"Open deferrals"`, executed in ONE motion alongside the K ledger becoming authoritative — exactly
> the J.WZ→I precedent). The re-point is NOT a vacuous swap: per **P-SUBSTRATE** (`precepts-k.md §3 T6`)
> the grammar must BITE on the new substrate, PROVEN by re-running the gate against deliberately-
> malformed planted K-ledger rows (a FOLD citing a resolving-but-source-shape gate; a HANDOFF targeting
> an unpublished future version; a ≥4-tranche bare BOOK) and witnessing it RED on all three clause
> shapes before the probes are removed and the gate GREENS on this clean terminal K ledger. The grooming
> and the K chronic registration happen in ONE motion, never in sequence — never two live narratives,
> neither green. **No source is written in this DEV phase; this table is the AUTHORED substrate the K.WZ
> re-point will consume.**
>
> **CHRONICITY COLUMN SHAPE (binding for the parse target).** Every row's Chronicity cell leads with an
> explicit INTEGER tranche-span count, the tranche-letter provenance following in parentheses as prose
> (e.g. `7 (C,D,E,F,G,H,I)`, `4 (H,I,J,K)`); whole-lineage spans render as their integer (`A…J` →
> `10 (A…J)`); a `recurring` item renders as its best-known integer with the provenance kept (`9 (pre-A…J,
> recurring)`). The gate reads the leading integer ONLY; the parenthetical is for human audit. The
> ≥4-tranche EXIT-ONLY mandate (P-invariant-28) is enforced mechanically off that integer — no cell
> carries a bare non-numeric token the gate cannot read.
>
> **DISPOSITION VOCABULARY:** **FOLD** (into a K wave) · **RE-OPEN→FOLD** (a J-terminal row the K live
> audit re-falsified, re-folded into a K wave) · **RE-AFFIRM** (genuinely closed; do not re-litigate) ·
> **VERIFY-ONLY** (claimed-closed; K re-runs) · **HANDOFF** / **OUT** (sibling-owned, paired with a
> published consume-edge or a born-RED kf gate) · **BOOK** (net-new, terminal home named) · **RECORD**
> (historical, terminal) · **KILL** (permanent, reasoned) · **USER-DOMAIN** (version owner Mike Babb,
> confirm-first) · **SEED→L** (the frontier wholesale-deferred to L, re-seeded UNCHANGED in `L-SEED.md`).
> A FOLD/VERIFY-ONLY row cites the RUNTIME gate the K impl phase will author born-RED (named "author X
> first" / born-RED-pending), OR names its terminal non-gate mechanism (a measurement / a published
> consume-edge). A HANDOFF targets ONLY a PUBLISHED version or a kf-owned consume-edge — never a future
> version / unreleased commit (the B7 vaporware lesson). A ≥4-tranche row carries an EXIT-shaped
> disposition.
>
> **THE RUNTIME-BAND CITATION CONTRACT (binding for the re-point parse — the parser's FOLD/VERIFY band
> has NO "author X first" escape, unlike the sibling band).** A FOLD/VERIFY-ONLY row's CLOSURE-CELL
> grammar is therefore exact: (i) any `` `proof:*` `` it BACKTICKS in the closure cell is treated as a
> load-bearing closure ORACLE and MUST — once the K impl phase authors it — RESOLVE to a package.json
> key, run in the `proof:correctness` tier, AND be a RUNTIME gate (open a browser over the built dist
> via the `lib/demo-driver.mjs` lifecycle AND actuate via `navToScene`/click/dispatch/resize, per
> `scripts/lib/gate-shape.mjs`). A HYGIENE / source-shape / measurement gate (`proof:deps-current`,
> `proof:readme-runs`, `proof:published-surface`, `proof:lighthouse-mobile`, a dep-pin witness) is
> NEVER backticked as a FOLD/VERIFY closure oracle — it is named in PLAIN PROSE and the row's terminal
> mechanism is the non-gate keyword (a *measured* run, a *REWRITTEN* README, a *node probe*, a published
> *consume-edge*) the parser's `nonGateMechanism` clause reads; (ii) a row whose true closure is a
> sibling consume-edge or a measurement carries a HANDOFF/measurement disposition (NOT a bare FOLD) so
> the runtime contract does not vacuously bite it. This is why the K design gates this ledger cites in
> FOLD bands (`proof:cold-entry`, `proof:subject-animates`, `proof:font-voice-authority`,
> `proof:no-single-option-select`, `proof:dock-anchor-derived`) are each authored RUNTIME + correctness
> by their owning wave's §Hard-gate (W0/W4 navToScene scene-drive; W2 the computed-font census across
> all 8 scenes; W3 the deterministic resize + computed-layout read) — NOT computed-once source greps.
> A FOLD-cited gate left hygiene-tier or non-actuating REDS the re-point permanently (the DL-K6/DL-K34
> hygiene-gate-in-a-FOLD-band class this ledger was hardened against — the hardening lane's PARSE fix).

| Item (chronic / deferral) | Born | Chronicity | Disposition | Owning wave | The gate / evidence (the closure oracle) |
|---|---|---|---|---|---|
| **DL-K2 the gate-blindspot** (source-shape/idle-CSS oracles false-GREEN engine-start/appearance/state; B1 greens on idle bob) ★‡ | pre-A (memory) | 9 (pre-A…J, recurring) | **RE-OPEN→FOLD (P0)** | **K.W0** | The ROOT exit (the meta-chronic): author `proof:cold-entry` first — a SYSTEM gate that counts ONLY engine-driven transforms (excludes `.idle-*` CSS), drives the COLD path, reads the playback ribbon value. **Born-RED on today's tree:** `k-verify-gate-blindspot.mjs` shows B1 PASS (101 distinct) while the play aria reads `"Play animation"` — the engine OFF (`live-session-gap-analysis.md §1`); the cure de-vacuouses B1 and un-blinds DL-K1/K3/K4/K10 |
| **DL-K1 the cold home→play→subject-animates race** (the gate-blindspot's flagship victim; the hero rainbow-play resumes a never-started group) ★‡ | H (pre-J latent) | 4 (H,I,J + the J VERIFY-ONLY re-cert) | **RE-OPEN→FOLD (P0)** | **K.W0** | Author `proof:cold-entry` first — `localStorage.clear()` → hero CTA → assert the LOAD-BEARING pair (the slider/`--ball-p` ADVANCES from 0 + the dock aria flips Play→Pause) + an aria-GATED corroborator (the OrbitalDrag-wrapper engine-write transform ≥3 distinct WHILE aria=Pause, `.idle-hover` excluded — NOT a bare single-element count). **Born-RED on today's tree:** the cold cube produces 0 engine-write transforms (`k-isolate.mjs` `.cube`=0; `.graph`=13 is engine-OFF churn, so the aria-gate carries the disambiguation); the resume is a NO-OP on a never-started group (`scenePlaybackAdapters.ts:76-79`, `:57` snapshot says `playing:false`); `live-cold-play-path.md P0-1` |
| **CH-1/B7 specular sheen** (the cartoon specular at rest) ★ | D(D14)→H | 3 (D,H,I) | **RE-AFFIRM** (do not re-litigate; re-verify on the 3.13.0 dock-rewrite) | K.W1 (re-verify) | `proof:specular-absent-at-rest` GREEN (glass-ui flat default consumed); **born-RED** in its origin tranche (the cartoon specular rendered at rest); `proof:specular-handoff` DELETED, the self-guard asserts its absence. K.W1 re-verifies it stays resolved across the 3.13.0 dock taxonomy rewrite |
| **CH-2 φ-hero typography** (re-falsified at the dock voice) ★ | D(D7)→I(TYP-2) | 4 (D,I,J + K re-felt) | **RE-OPEN→FOLD (P1)** | **K.W2** | CH-2 was RE-AFFIRMED at J ("do not re-litigate") yet the K live audit re-falsified the dock voice (`live-typography-truth.md §2-4`). Author `proof:font-voice-authority` first — the dock-label resolves the DISPLAY serif at the ROOT (the RF-2 lever on the re-pin), not the text/mono voice. **Born-RED on today's tree:** `proof:demo-fonts` greens while the dock resolves system-sans; `font-census.mjs` finds two display tokens (`--font-serif` AND `--font-display`) |
| **CH-3 mobile chronic** (desktop-certified; spring slider STEPS; /square broken) ★‡ | D(D10) | 5 (D,H,I,J + K re-felt) | **RE-OPEN→FOLD (P1)** | **K.W4** (∥ K.W3 mobile leg) | Author `proof:subject-animates` first (the spring-slider-smoothness clause, K.W4 §Hard-gate clause-a, riding W0's `proof:cold-entry`) — a born-RED gate that reads the spring slider as smooth-not-stepped (the few-Hz readout mirror must not drive the slider; the 60 Hz painter drives the position). **Born-RED on today's tree:** the thumb `changeCount:0` over 240 frames (`live-spring-sequence-mp-verdict.md §2a`); U-K15 "spring slider literally steps"; U-K5 "none work on /square"; the mobile floors never asserted (DL-K11). `live-session-gap-analysis.md §2 (U-K3/U-K5/U-K15)` |
| **CH-4 dock** (D5 lag + D9 popover; the felt dock) ★ | D(D5/D9) | 3 (D,H,I) | **RE-AFFIRM** D5/D9; the dock LAYOUT → **FOLD (P1)** | **K.W3** | `proof:perf-frame-budget` present + the hygiene-tier dock-popover-opens runtime gate present (the spring/popover halves RE-AFFIRM — named in prose, NOT the K closure oracle, since it rides `proof:hygiene` not `proof:correctness`). The dock ANCHORING tier folds to K.W3: author `proof:dock-anchor-derived` first (the FOLD-half closure oracle — RUNTIME + correctness by the K.W3 §Hard-gate deterministic-resize + computed-layout read; NO hardcoded offsets). **Born-RED on today's tree:** `layout-grid-k.md` censuses the hardcoded dock offsets; `probe-pathological.mjs` shows the dock STRETCH at 3440×1440 |
| **CH-5/B1+B5 `"......"` empty-value crash** ★ | A(W0)→H | 3 (A,H,I) | **VERIFY-ONLY** (TERMINATED — re-run on the K dist) | K.W0 (re-run) | `proof:engine-no-throw-on-play` GREEN — re-run on the built dist; **born-RED** in its origin tranche (the empty-input parse threw on play); `parseCSSValueUnit("")=>{value:0}` no throw (node probe, value.js 0.11.2). RE-RUN, not re-derived |
| **CH-6/B2 `_gen` DFA suspend crash** | H | 2 (H,I) | **VERIFY-ONLY** (TERMINATED — re-run on the K dist) | K.W0 (re-run) | `proof:fsm-suspend-resume-live` GREEN — bind-proof RAFPlayback + `useRafScene`; **born-RED** in its origin tranche (the `_gen` suspend threw). RE-RUN, not re-derived |
| **scene-control-dfa** deploy-block + product lag (the I-close net-new chronic) ★ | I (post-close) | 2 (I,J) | **VERIFY-ONLY** (TERMINATED — re-verify on the 3.13.0 dock) | K.W1 (re-verify) | `proof:control-surface-single-writer` GREEN — the dock projection born-correct from the DFA (the `navToScene` per-expected-state predicate); **born-RED** on CI run `27228309606` trigger='null'-under-load BEFORE the cure; the observed green-CI→auto-deploy round-trip closed it terminally at J.W0. K.W1 re-verifies the DFA projection across the 3.13.0 dock taxonomy rewrite |
| **CH-8/B3 amiga float/flash** (3 compounding defects) ★‡ | H(B3)→D14 | 4 (H,I,J + K re-felt) | **RE-OPEN→FOLD (P1)** | **K.W0** | The J gate tests the spin-DRAG only (`proof-amiga-subject-is-pivot.mjs`), never the bounce-group play envelope. Author `proof:subject-animates` first (the amiga ENGINE-STARTED oracle, K.W0 §Hard-gate, riding `proof:cold-entry` over the cube/amiga/square cold-mount band) — assert the click flips play AND the engine-driven rotation advances AND no float at rest. **Born-RED on today's tree:** `live-amiga-breakage.md` K4-A texture-multiply flash (`useAmigaAnimations.ts:54-58`), K4-B 69%w/37%h envelope (`AmigaScene.vue:62`), K4-C persisted `playing:true` cold-resume (`useSceneMachine.ts:45`) |
| **DL-K5 the U4 no-single-option rule is NOT total** (per-scene selects render lone options) ★ | I→J | 2 (I,J) | **FOLD (P1)** | **K.W4** | Author `proof:no-single-option-select` first — a TOTAL rule + a born-RED "no single-option Select renders" gate. **Born-RED on today's tree:** the ChromeDock controls-tab `<Select>` renders a 1-item dropdown on the single-surface scenes (easing/spring) — the sole VIOLATION the sweep found (`live-dock-tabs-selects.md §2.1/§3 S1`, `ChromeDock.vue:199-221`, missing the `>1` guard `TransportDock.vue:39` already carries); the swept `EasingSelect.vue`/`AnimationControlsControls.vue` are CLEARED OK; the U4 fix covered the TRANSPORT dock only (`J.W7c-impl.md:70-82`) |
| **U-K20 the FourierField on the hero** (squats against the user verdict) | I(J.W7a) | 1 (net-new at K) | **FOLD (P2)** | **K.W4** | Author `proof:subject-animates` first (the FourierField-absent-on-hero clause, K.W4 §Hard-gate clause-e, riding `proof:cold-entry`) + the grid-opacity tune. **Born-RED on today's tree:** `<FourierField variant="hero">` mounts (`EditorStartScreen.vue:78-86`); `live-fourier-grid.md` owns the removal seam + the honest vacancy |
| **DL-K6 the glass-ui re-pin** (3.11.2 → 3.13.0; the published-edge consume sweep; the EXIT mechanism for the 46-row AX/RF ledger) ★‡ | H | 3 (H,I,J) | **FOLD (P1)** | **K.W1** | Author the re-pin witness first (the hygiene deps-current floor advances `~3.11.2 → ~3.13.0` atomically with the pin, `proof-deps-current.mjs:80` — a hygiene-tier floor, NOT the closure oracle), and close on the RUNTIME consume-edge re-verification gate `proof:live-session` (the K.W1 §Hard-gate consume-edge battery: every glass-ui-touching runtime gate re-run GREEN on the 3.13.0 dock-taxonomy rewrite). **Born-RED on today's tree:** `~3.11.2` resolves `3.11.2`; the tilde blocks `3.12/3.13`; registry latest `3.13.0` (`npm view @mkbabb/glass-ui version`); the `click-integrity` composable cures RF-17 at the root (`live-glassui-currency.md §1-2`). U-K14 makes this user-demanded |
| **DL-K7 AX-1 `GlassControlPoint`** (the curve-editor / keyframes-editor enabler) ★‡ | E (kf-invented) | 5 (E,F,G,H,I as ABSTRACT) | **HANDOFF** (consume-on-3.13.0) **OR build-in-kf** (gate-first, reasoned) | K.W1 | A published-consume-edge verification (sibling-owned, NOT a kf runtime gate): verify the PUBLISHED 3.13.0 primitive surface covers `GlassControlPoint` via the K.W1 consume-edge battery (the live-session re-run greens if the primitive is consumed); else a reasoned build-in-kf decision that must author `proof:control-point-live` first (the U-K11 keyframes-editor enabler). `glassui-AX-handoff.md:108-141` (P1 headline); consumed on the published 3.13.0 surface, never a future version |
| **DL-K8 the AX-2..13 + RF-1..15 publish-pending tail** (the 44-row remainder) ★ | E→I | 5 (E,F,G,H,I) | **HANDOFF** (consume-on-publish; re-reconcile vs 3.13.0) | K.W1 | Each consumes the instant the PUBLISHED 3.13.0 (or the next AX publish) ships it; the born-RED gates flip GREEN on consume; re-reconcile the 46 rows against the published 3.13.0 surface (`glassui-AX-handoff.md §1/§2`). Sibling-owned, published-consume-edge |
| **DL-K9 RF-16/RF-17 BLK-8 family** (PRM RO→render TDZ + GlassDock collapse-crossfade click-strand) ★ | I→J | 2 (I,J); BLK-8 recurred at the J.WZ close | **HANDOFF** (consume the PUBLISHED 3.13.0 `click-integrity` composable) | K.W1 | RF-17 is the SAME race as the J.WZ fix-round #1 AND the cold-play swallow class; the kf interim (`onPlayPointerDown`/`pointerHandled`) is a workaround the published composable retires. Consumed on the published 3.13.0 (`live-glassui-currency.md §1`), never a 3rd interim |
| **DL-K10 the typography ROOT seam** (the dock should carry the display voice; fonts inconsistent globally) ★‡ | D(CH-2)→I(TYP-2) | 4 (D,I,J + K re-felt) | **FOLD (P1)** | **K.W2** | Author `proof:font-voice-authority` first — ONE voice-token authority, the dock-label binding the display voice at the ROOT (the RF-2 lever). **Born-RED on today's tree:** `proof:demo-fonts` greens while the dock resolves the text/mono voice (`live-typography-truth.md §2-4`, `dock-label → --font-text`). CH-2 was mis-RE-AFFIRMED at J |
| **DL-K11 the mobile Lighthouse floors UNASSERTED** (the weak flank; never measured-quiet) ★‡ | B-era floors, re-deferred D→J | 5 (B,D,H,I,J — deferred every tranche since) | **FOLD/VERIFY-ONLY** (P1, runner-calibrated) | **K.W6** | Terminal measurement artifact (NOT a kf runtime gate): the already-authored lighthouse-mobile floor is re-MEASURED on a quiet host (load near 0) or the calibrated CI runner (`KF_REQUIRE_LH=1`) and the measured floor recorded; the J probe was CONTENTION-TAINTED (load≈10), 7–13 pts under floor, NOT asserted as regressions. **P6-WITNESS:** the closure carries a named on-device born-RED witness (the calibrated-host measured run), never an observe-only score alone (`perf-battery-2026-06-10.md:36-55,90-91`) |
| **DL-K13 the `demo-smoke` wall-clock hazard** (the 35m ceiling is unverified against the post-J.W4 roster K's gates extend) | J.W0 | 2 (J,K) | **FOLD/VERIFY-ONLY** (P1) | **K.W5** (∥ K.W6 measurement) | Terminal measurement artifact (a CI wall-clock bound, not a browser actuation). **Live ceiling = `timeout-minutes: 35`** (`ci.yml:213`, re-sized at J.W4); the `19m13s` figure (CI run `27310054675`, `c6c3c37`) is the **pre-J.W4 J.W0 baseline against the OLD 20m ceiling** — NOT the current state. `ci-cd-k.md §F-2`: the post-J.W4 additions project ~42m (> the 35m ceiling) and the 35m artifact has NOT been re-measured since. K re-measures the live wall clock and re-bounds/shards before adding the cold-path/appearance/amiga/typography gates (the scene-control-dfa deploy-block class). The K.W6 reconciliation retires this row's former "20m/~47s" framing. `ci-cd-k.md §F-2`; `J.W0-impl.md:205-206` (CICD-7) |
| **DL-K16 FB-1 animation-composition HONORING** (the engine drops a declared CSS operator) ★‡ | F | 5 (F,G,H,I,J BOOK-reaffirm) | **FOLD (P0/P1) — EXIT-ONLY** | **K.W0** (LEAD, WL2-B) | Author the composition-honoring runtime gate first — the engine READS the captured `animation-composition`. **Born-RED on today's tree:** `adapter.ts:24-29,120-126` captures it; `engine.ts` reads it never (grep=0); the K-SEED flags it RIPEST + born-RED-witnessable (`K-SEED.md §2 WL2-B`). P-inv-28 forbids a 6th BOOK |
| **DL-K17 VJ-F2 / LD-DIAG diagnostics sink** (no `diagnostics` field on `ResolvedKeyframes`) ★‡ | F | 5 (F,G,H,I,J BOOK-reaffirm) | **FOLD (K.W0)** **OR HANDOFF** (value.js VJ.W3) | **K.W0** | Author the diagnostics-channel gate first OR consume the value.js VJ.W3 producer. **Born-RED-able:** `adapter.ts:18` `ResolvedKeyframes` exists, no `diagnostics` field; the K3-internal half rode J.W1's typed-error totality; the FULL channel is K.W0 (`K-SEED.md §3/§7 VJ.W3`). P-inv-28 forbids a 6th BOOK |
| **DL-K18 tryParseCache eviction** (unbounded Map) ★‡ | C(C-3)/F | 6 (C,F,G,H,I,J) | **HANDOFF** (value.js VJ-4 `{maxCacheSize}`; consume on publish) | K.W1 (re-pin re-confirm) | `utils.ts:203` unbounded; the bound lives in value.js; kf consumes on the VJ.W0 publish, born-RED-able the moment value.js ships the config. Sibling-owned, published-consume-edge (`K-SEED.md §7 VJ.W0`) |
| **DL-K3-mobile / DS-2,DS-5 control-store retype** (BOOK-adjacent type hygiene) | I→J | 2 (I,J) | **BOOK → FOLD on touch** | K.W4 | Typed-narrow `selectedControl:string` + `storedControls:any` when the K control-surface work touches the dock store (`J.W2-impl.md:237-238`). Latent type-hygiene; folds when K.W4 touches the control store |
| **DL-K15 the OrbitalDrag third bypass** (local `user-select:none` + `setPointerCapture`) | I→J | 2 (I,J) | **BOOK** (verified-live, not converted) | K.W6 | Stays a BOOK per born-RED-or-leave; re-verify if K touches the cube orbit gesture (`orbital-drag/OrbitalDrag.vue:331`). Latent drag-gap class (the W2-noted pre-existing bypass) |
| **DL-K19 A7 cube idle-bob CSS dogfood + A9 matrix `acos` Euler recovery** (cohesion BOOKs) ★ | A | 10 (A…I + J) each | **BOOK-reaffirm** (cohesion, not defects); A7 gate-excluded by DL-K2 | K.W0 (A7 exclusion) | A7/A9 are 10-tranche cohesion BOOKs (NOT defects). BUT A7's `.idle-hover` (`CubeTarget.vue:207-214`) is the EXACT mechanism that false-GREENs DL-K1/K2; the DL-K2 cure gate-EXCLUDES it (counts engine-driven motion only) OR replaces the dogfound CSS with an engine-driven idle. Non-defect cohesion; the A7 exclusion is the load-bearing K motion |
| **DL-K33 the engine-core hygiene band** (`engine-core-k.md` §FOLD EC-1..EC-13; the lane's 13 file:line-rooted findings) ★ | A→J (per-row) | 2 (I,J — EC-1 the J.W6-ADOPT carry; the rest net-new at K) | **BOOK → FOLD on touch / VERIFY-LANDED** (EC-5 ≡ DL-K18 + EC-7 ≡ DL-K16 — NOT double-counted; routed there) | **K.W0** (EC-13/EC-2/EC-4/EC-6/EC-8..EC-12) · **K.W5** (EC-1) | The engine-core lane folds in TWO destinations: **EC-13** (P1 — "Group cold-path `NOOP_TRANSFORM` survives when the animation is un-parsed at `play()` time; likely root of U-K2/U-K3 subject-freeze", `group.ts:133`+`useSceneMachineApp.ts:128`) is a P0-ADJACENT root-cause finding folded into **K.W0** alongside the adapter resume cure (the engine-side twin of the `scenePlaybackAdapters.ts:76-79` no-op); **EC-1** (P1 — `lerpArray` SoA J.W6-ADOPT decision, IMPL not yet landed, `engine-core-k.md §2`) folds to **K.W5** as a born-RED engine-totality gate (the bench `bench/interp-buffer.bench.ts` is the witness substrate). The remaining P2 hygiene rows (EC-2/EC-3/EC-4/EC-6/EC-8..EC-12 — comment-gaps + trivial loop/index refactors + the brittle `format.ts:219` regex EC-4 the no-workaround precept indicts) are **BOOK → FOLD-on-touch** in **K.W0** (the engine-touching wave); EC-5 (`tryParseCache` no eviction, `utils.ts:203`) is **EC-5 ≡ DL-K18** (consume value.js VJ-4 `{maxCacheSize}`) and EC-7 (`animation-composition` captured-never-consumed) is **EC-7 ≡ DL-K16** (FB-1, the K.W0 LEAD) — both routed to their existing DL-K rows, NOT re-counted here. (`engine-core-k.md §FOLD`) |
| **DL-K34 the packaging + README + toolchain hygiene band** (`packaging-k.md` §FOLD PKG-1..PKG-11; the publish-surface honesty findings) | J→K (per-row) | 1 (net-new at K; the publish surface born at the J 4.2.0 cut) | **FOLD (docs/repin) / HANDOFF** | **K.WZ** (PKG-4/5/6/7 README + PKG-11 publish-gate + PKG-8 lockfile + PKG-3 d.ts-alias) · **K.W1** (PKG-1/PKG-10 repin) · **K.W6/value.js** (PKG-2/PKG-9) | Terminal docs/publish-surface hygiene closures (NOT kf runtime gates — the README is REWRITTEN, the publish-gate roster is corrected): the packaging lane's eleven file:line-rooted findings home as: **K.WZ** (the docs-close + the readme-runs/published-surface publish-gate parity, both hygiene-tier by construction — named in prose, not cited as runtime closure oracles) — **PKG-4** (README Quick Start broken — no `loadAnimationEngine()`, `README.md:11-35`) + **PKG-5/PKG-6** (HEAVY-API README block + 5 dead `src/parsing` / `units` / `easing` / `math` links) + **PKG-7** (`package.json:4` "standards-complaint" typo) + **PKG-11** (`release.yml` omits the published-surface + readme-runs publish-gate parity, hygiene-tier) + **PKG-8** (`package-lock.json` `4.1.0` drift vs `4.2.0`, corrected in the cut motion) + **PKG-3** (`Animation_2`/`ScrollTimeline_2`/`flip_2` d.ts collision aliases — DX, a 5.0-rename candidate); **K.W1** (the re-pin) — **PKG-1** (`"files"` negation missing `"!dist/demo-app"`) + **PKG-10** (the deps-current hygiene floor advances atomically with the 3.13.0 pin); **K.W6/sibling** — **PKG-2** (API-Extractor TS-6 forward-risk, fold-on-touch toolchain) + **PKG-9** (parse-that realm split `utils.ts:248` — HANDOFF value.js side). All publish-surface honesty; the K.WZ clauses already cite PKG-4/8/10/11, this band homes the remaining seven. (`packaging-k.md §FOLD`, K.WZ §clause (h)/§S6) |
| **DL-K20 C-1 value.js next-slice (VJ-1..9)** + the EF-5 tranche-M reconciliation ★‡ | C | 8 (C,D,E,F,G,H,I,J) | **HANDOFF — BOOK-reaffirm** (chronic-by-design; published-consume-edge) | K.W1 (re-pin re-confirm) | value.js `0.11.2` PUBLISHED-consumed; the K-SEED §7 VJ seed supersedes the stale tranche-M spine; each VJ item born-RED-able the instant its primitive publishes. P-inv-28 satisfied by the published-consume-edge form, never a bare BOOK (`K-SEED.md §7`; `valuejs-sota-handoff-v2.md`) |
| **DL-K21 VJ-4/MCI-5 identity-pad witness · FB-3 MorphSVG · VJ-F1 arc-length sampler** ★ | C | 6 (C,F,G,H,I,J for FB-3) | **HANDOFF** (consume on the value.js publish) | K.W1 | `it.fails(` at `test/interpolate-anything.test.ts:256` is the consume signal; FB-3 gated on value.js VJ.W4 (the real competitor gap). Sibling-owned, gated on a published primitive (`K-SEED.md §7 VJ.W4`) |
| **DL-K22 PT-1 parse-that `(id,offset)` packrat re-key** ★ | G(LD-PT) | 4 (G,H,I,J) | **HANDOFF** (gate-first BOOK) | K.W6 | parse-that `^0.9.0`, zero prod consumers; author `proof:packrat-position` first. Latent; sibling-owned, gate-first (`K-SEED.md §7 VJ-6`) |
| **DL-K23 GH-4/FB-4 `{types}` directional VT · G-3/RF-3 LabeledField orientation · glass-ui typography opt-in** ★ | G/I | 4 (G,H,I,J) | **HANDOFF** (consumed on the published re-pin) | K.W1 | glass-ui-owned; folds into the DL-K6 re-pin (RF-3/RF-4 may land in the PUBLISHED 3.13.0); `{types}` folds only IF K elects scene interactivity. Sibling-owned, published-consume-edge (`glassui-AX-handoff.md` RF-3/RF-4) |
| **DL-K24 dock double-click** (glass-ui root) ★‡ | pre-A | 10 (pre-A…I, recurring + J) | **HANDOFF — VERIFY-ONLY** (resolved in the published 3.9.0; re-verify on 3.13.0) | K.W1 (re-verify) | Terminal non-gate mechanism: the glass-ui root fix landed (published-consumed); the demo workaround REMOVED (the grep at `AnimationMenuBar.vue:106` clean). Re-verify it stays resolved across the 3.13.0 dock-taxonomy rewrite (the "breaking tranche" touches the dock). A glass-ui-root resolution, never kf-patched |
| **DL-K25 DEP-1/2/3 deploy (CNAME/template/roster)** | G | 4 (G,H,I,J) | **HANDOFF** (deploy-owned) | K.WZ (confirm) | Sibling-owned; live deploy is Cloudflare Pages (`keyframes.babb.dev`, `MEMORY.md`). The OBSERVED auto-deploy round-trip is the standing oracle; K.WZ RE-observes the close-merge round-trip. OUT-band |
| **DL-K12 the editor-pane LCP lever** (cube 58 / spring 73; Monaco lazy ~8MB) | E(Monaco)→J | 2 (E,J recorded) | **BOOK / MEASURE-FIRST** (re-measure on a quiet host) | K.W6 | Editor-pane skeleton/progressive paint OR the K-era CSSCodeEditor question; re-measure on a quiet host first (`perf-battery-2026-06-10.md:57-72`). Latent; recorded with a re-measure step (NOT a ≥4-tranche bare BOOK — 2-tranche) |
| **DL-K26..K30 the K-SEED charter** (CC-1 compiler / K1 ingest / SO-1 scroll / PHYS-C blend / ED-1 externalize) | C→J | 0 (SEED — frontier, no chronicity) | **SEED→L** (the frontier wholesale-deferred, re-seeded UNCHANGED) | — (L) | The entire K-SEED round-trip charter re-seeds UNCHANGED as `L-SEED.md` (`k-seed-reconciliation.md` Shape A): deferral un-blocks the value.js grammar gates (VJ.W1/W2) and decays nothing while the P0 decays daily. NOT a punt — a reasoned wholesale deferral (`L-SEED.md`; `K-SEED.md §1-3`) |
| **DL-K31 the 6 K-SEED BOOKs** (CC-5/CC-6/VT-D/K4/K5/EPF-1/EPF-4 — tripwire-gated) | C→J | 0 (SEED — frontier, no chronicity) | **SEED→L — BOOK** (tripwire-gated) | — (L) | Each with a named tripwire (Baseline/workload); rides an L wave when the tripwire fires. Re-seeded UNCHANGED (`L-SEED.md`; `K-SEED.md §6`) |
| **DL-K32 the 12 K-SEED KILLs** (VT-A/B, CE-2/3, EPF-2/5, K-T1/T3, SO-4, CC-7, ED-6, PHYS-A) | C→J | 0 (KILL — researched negative) | **KILL-reaffirm — RECORD permanent** (non-re-litigable) | — | Researched negative results; RECORD permanent, do not re-open. The ARCH "ScrollTimeline-native-replace" KILL does NOT block SO-1 (which ADDS a parse+dispatch tier, never deletes the JS driver) (`K-SEED.md §5`) |
| **The J-terminal RE-AFFIRM/RECORD/KILL bands** (DC-8 scene-swap VT; INVE-1/4/5 stale-FINAL drift; release.yml-never-run NOW-RUN; the ARCH kills K-1..K-9/D1/SUP-7; `proof:repin-safe` stale-by-construction) | A→J | 10 (A…J, the omnibus J-terminal band) | **RE-AFFIRM / RECORD / KILL** (carried for completeness; do NOT re-litigate) | — | Carried verbatim from `J/PROGRESS.md §"Open deferrals"` + `deferred-ledger-k.md §1g`; NOT re-litigated in K except where the K live audit re-falsified (CH-2→DL-K10, CH-3→CH-3 row, CH-8→CH-8/B3 row). Terminal; the RETIRED `proof:specular-handoff` required-ABSENT self-guard holds |
| **The K version cut + publish + close-merge deploy** | K | 1 (net-new at K) | **USER-DOMAIN** (Mike Babb, confirm-first) | K.WZ | The version cut (patch/minor per content — the P0 fix is at minimum a patch; the design band may justify minor) + the npm publish + the close-merge auto-deploy round-trip RE-observed (`packaging-k.md`). USER-DOMAIN, fired at K.WZ |

★ = chronically deferred (≥2 tranches) — the K fold-or-KILL mandate applies. ‡ = ≥4-tranche rider →
**P-invariant-28 EXIT-ONLY in K** (ten live: DL-K2/K1/CH-3/CH-8 + DL-K6/K7/K10/K11/K16/K17/K18/K20/K24).

### 4a — The ≥4-tranche EXIT-ONLY roll-up (P-invariant-28 — the riders that MUST exit K)

The `‡` riders the K live audit + the consolidation surface (`deferred-ledger-k.md §2`). The most
dangerous (DL-K2/DL-K1) exited J on PAPER while remaining RED on the product — the structural
precondition for honestly closing DL-K1/CH-3/CH-8/DL-K10 is terminating DL-K2 (the ≥9-tranche
gate-blindspot) FIRST, in K.W0.

| Rider | Chronicity | The REQUIRED K exit form |
|---|---|---|
| **DL-K2** gate-blindspot | 9 (pre-A…J) | a SYSTEM gate counting engine-driven (not idle-CSS) motion on the COLD path — the root exit (K.W0) |
| **DL-K1** cold play race | 4 (H…J) | a born-RED cold-path gate (clear localStorage → hero CTA → slider advances + aria flips) (K.W0) |
| **CH-3** mobile | 5 (D…J) | a born-RED mobile oracle reading the spring slider smooth-not-stepped (K.W4) |
| **CH-8** amiga | 4 (H…J) | a born-RED appearance/amplitude/persistence oracle (K.W0) |
| **DL-K6** glass-ui re-pin | 3 (H…J), riders span E→J | the 3.13.0 consume sweep (publish-edge exit for the 46-row ledger) (K.W1) |
| **DL-K7** AX-1 control-point | 5 (E…J) | consume-on-3.13.0 OR a reasoned build-in-kf decision (K.W1) |
| **DL-K10** typography root | 4 (D,I,J + K) | the ROOT seam fix (RF-2 lever) + a dock-voice gate (K.W2) |
| **DL-K11** mobile Lighthouse floors | 5 (B…J) | a calibrated-host measurement (P6-WITNESS — the on-device born-RED witness) (K.W6) |
| **DL-K16** FB-1 composition | 5 (F…J) | K.W0 LAND (the K-SEED fidelity-floor lead) |
| **DL-K17** diagnostics sink | 5 (F…J) | K.W0 channel OR value.js VJ.W3 producer |
| **DL-K18** parse-cache bound | 6 (C…J) | consume value.js VJ-4 `{maxCacheSize}` (K.W1) |
| **DL-K20** value.js next-slice | 8 (C…J) | published-consume-edge form (each VJ item born-RED-able on publish) (K.W1) |
| **DL-K24** dock double-click | 10 (pre-A…J) | VERIFY-ONLY re-confirm on the re-pin (K.W1) |

### 4b — The SEED→L band (the frontier wholesale-deferred; re-seeded UNCHANGED in `L-SEED.md`)

Per `k-seed-reconciliation.md` (Shape A, argued against both alternatives): the entire K-SEED
round-trip charter (CC-1 compiler, K1 ingestion, SO-1 scroll-as-CSS, WL2-B, PHYS-C, ED-1, the value.js
half, the 12 KILLs, the BOOKs) re-seeds UNCHANGED as `L-SEED.md`. **Deferral un-blocks it:** the
value.js grammar gates (VJ.W1/W2) get the interval to ship in value.js' own tranche process; none of
the frontier decays by waiting; the P0 decays daily. A tranche cannot anchor on an XL CSS compiler
while its front door does not animate. This band is NOT a punt — a reasoned wholesale deferral with the
un-blocking argument on record (`L-SEED.md`; `k-seed-reconciliation.md`).

---

## §5 — TERMINAL READING (the development-phase close)

J made every boundary between the certified product and a human tell the truth — and the user, hours
later, crossed the one boundary no gate had ever crossed: the first click. K's development phase has
NAMED that boundary (the COLD-axis invariant), named the oracle defect that hid it (the engine-write
disambiguation rule), and named where gates cannot carry the verdict (the TASTE boundary) — and laid
the wave plan (W0 → W1 → (W2 ∥ W3) → W4 → WZ, W5 legs riding, W6 parallel) that makes the product TRUE
from the first gesture and BEAUTIFUL at its roots. The §"Open deferrals" ledger folds every DL-K row,
the U-K register, and the L-deferral band into the next chronic-closure parse substrate — AUTHORED,
parse-valid, and READY for the K.WZ re-point (J's ledger AUTHORITATIVE until then). **No implementation
has occurred.** When K closes, "green" will mean: the first thing a human does — click the rainbow
button — works, smoothly, beautifully, on the first try, and every claim of beauty was signed by the
only oracle that can judge it.

Doc: `/Users/mkbabb/Programming/keyframes.js/docs/tranches/K/PROGRESS.md`
