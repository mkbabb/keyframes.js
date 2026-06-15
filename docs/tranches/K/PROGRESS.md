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
**Dev-phase date:** 2026-06-12 (Band I authored); **2026-06-15** — the TOTAL FOLD: the frontier folds
WHOLESALE into K **Band II** (K.W7–K.W12), value.js dispatched to ship its last two grammar gates;
**there is no residual L** (`K.md` title line, `§The frontier, un-blocked (Band II)`). **Version in
tree:** `4.2.0` (the J close cut); K's own version cut + publish + close-merge deploy round-trip are
USER-DOMAIN (Mike Babb, confirm-first), fired at K.WZ.

This board is the spine of the tranche-development phase: the §0 headline (why K exists — the two
unnamed J blind axes + the partial design roots, **plus the frontier folded into Band II**), the §1
wave board with each wave's REAL headline gate (**both bands**), the §2 finding-cluster ledger
expanded with evidence anchors, the §3 precept reckoning, and the §"Open deferrals" chronic ledger
that FOLDS every DL-K row + the U-K register + **the frontier band (DL-K26..K32, now FOLDED into K
Band II)** into the next parse substrate. Companion documents:

- **`K.md`** — THE binding charter (the two bands — Band I PRODUCT-TRUTH/DESIGN-TOTALITY repair, Band
  II the ROUND-TRIP FRONTIER; the finding-cluster→wave ledger, the wave-map DAG, the K-born invariants
  — the COLD-axis invariant, the engine-write disambiguation rule, the TASTE boundary, **the
  replay-equality invariant, the acyclic-spine invariant**; the MANDATE, the chronic+deferred fold).
  This board agrees with it exactly.
- **`PATH-FORWARD.md`** — the executive summary (the two blind axes, the partial roots, the
  remediation sequence across **both bands**, the total-fold argument that superseded the
  wholesale-defer-to-L Shape-A recommendation).
- **`waves/K.W0..K.WZ.md`** — the authored-now-run-later wave specs (**K.W0–K.W6 Band I, K.W7–K.W12
  Band II, K.WZ close**; each spec's header reads `Phase: DEV — spec authored`; §1's board carries the
  per-wave AUTHORED status).
- **`L-SEED.md`** — the frontier divination, **CONSUMED INTO K Band II** (the body of record — the
  CC-1 compiler→K.W10, K1 ingestion→K.W8, SO-1 scroll→K.W9, WL2-B→K.W7, PHYS-C→K.W11, ED-1→K.W12, the
  value.js half §7, the 12 KILLs, the BOOKs). The §body→K.W7–K.W12 wave map is `L-SEED.md §body-item
  map`; the Shape-A wholesale-deferral preface is SUPERSEDED by the 2026-06-15 total fold.
- **`KF-TO-VALUEJS-GRAMMAR-ASKS.md`** — the kf-side outbound grammar ask (the dispatch of VJ.W1 scroll
  grammar + VJ.W2 perceptual ramp to value.js's post-N tranche; the mirror of the inbound
  `VALUEJS-N2-ASKS.md`; the acyclic-spine consume edges K.W9/K.W10 light born-RED-gated kf-side).
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
  - **`audit/k-seed-reconciliation.md`** — the original Shape-A wholesale-defer-to-L argument
    (evidence-of-record only; its recommendation SUPERSEDED by the 2026-06-15 total fold — the
    un-blocking it argued the L interval would deliver was instead delivered by value.js 0.12.0 inside
    the K interval itself; `K.md §chronic + deferred fold`).

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

**K's correction is TWO BANDS under one discipline.** **Band I (the repair, K.W0–K.W6, leads):**
extend the oracle discipline to the COLD axis (TRUE from the first gesture), and bound it honestly at
the TASTE boundary (where gates cannot carry the verdict, the protocol hands it to the user — named,
packaged, and BEFORE the close); the design language is made total at its ROOTS (one font authority,
one anchoring system, the current glass-ui), not per-site. **Band II (the round-trip frontier,
K.W7–K.W12, rides the honest substrate Band I leaves):** the CSS-@keyframes round-trip made TOTAL —
the engine honors the `animation-composition` it had been dropping (K.W7), ingests the live web's CSS
(K.W8), parses + dispatches the scroll grammar (K.W9), compiles its orchestration BACK to
zero-runtime CSS that replays pixel-equal (K.W10), drives layer crossfades with springs no competitor
can hold (K.W11), and exposes itself to agents and its own dogfood (K.W12) — every frontier claim
signed by replay-equality or an honest refusal. **THE FRONTIER FOLDED WHOLESALE INTO K** (the
2026-06-15 total fold; **there is no residual L** — `L-SEED.md` is the consumed body of record, value.js
shipped 0.12.0 that un-blocked four of the six waves, and its last two grammar gates VJ.W1/VJ.W2 are
DISPATCHED via `KF-TO-VALUEJS-GRAMMAR-ASKS.md`). The Shape-A wholesale-defer-to-L recommendation is
SUPERSEDED (evidence-of-record only): the un-blocking it predicted the L interval would deliver was
delivered by value.js 0.12.0 inside the K interval itself.

**Board state at the development close:** all wave specs AUTHORED (§1); the §"Open deferrals" ledger
is the K parse substrate (J's remains AUTHORITATIVE until the K.WZ re-point). NO implementation has
occurred — the impl phase opens only on explicit user authorization.

---

## §1 — THE WAVE BOARD (AUTHORED statuses + headline gates)

The longest serial path (charter §WAVE-MAP, two bands): **W0 → W1 → (W2 ∥ W3) → W4 → W7 → (W8 ∥ W9)
→ W10 → W12 → WZ**, with W5's legs riding their owning waves, W6 parallel throughout, and W11 parallel
to its owning Band-II band. **Band I (K.W0–K.W6) leads; Band II (K.W7–K.W12) rides the honest
substrate the repair leaves behind** (`K.md §WAVE MAP`). Status legend: **AUTHORED** = the wave spec
is on disk this dev phase, born-RED witness plan named, run later on authorization (for the Band-II
frontier waves the born-RED is in the FRONTIER sense — the gate reds because the capability is ABSENT
today). The headline gate is named-now / born-RED-later (the gate SOURCE is written in the impl phase,
never here).

| Wave | Title | Status | Headline gate(s) (named; born-RED-later) | Born-RED witness plan (the defect the oracle is written to bite) | DAG |
|---|---|---|---|---|---|
| **K.W0** | The cold-entry truth (the P0) | **AUTHORED** | `proof:cold-entry` — fresh context, NO seed, `goto #/`, click the hero rainbow play, assert the LOAD-BEARING pair (dock play aria flips `Play→Pause` AND the playback slider/`--ball-p` advances from 0) PLUS an aria-GATED corroborator (the OrbitalDrag-wrapper engine-write transform ≥3 distinct WHILE aria=Pause, `.idle-hover` excluded — NOT a bare single-element count; `.cube`=0 cold / `.graph`=13 engine-OFF per `K.W0.md §Provenance`); B1 de-vacuoused (engine-write disambiguation). `proof:chronic-closure` re-pointed J→K in ONE motion | RED on today's tree: `k-verify-gate-blindspot.mjs` shows B1 PASS while play aria = `"Play animation"`; the cold cube produces 0 engine-write transforms (`k-isolate.mjs`); the adapter resume is a NO-OP on a never-started group (`scenePlaybackAdapters.ts:76-79`) | **LEADS** — its oracle is consumed by every later wave |
| **K.W1** | The consume edge (glass-ui re-pin) | **AUTHORED** | `proof:deps-current` widen + a born-RED `proof:repin-witness` for glass-ui `~3.11.2 → ~3.13.0`; the W7b parity-clause exits re-examined on 3.13.0; the `click-integrity` composable consumed (retires the RF-17 pointerdown interim) | RED on today's pin: `~3.11.2` resolves `3.11.2`; the tilde blocks `3.12/3.13`; registry latest `3.13.0` (`npm view @mkbabb/glass-ui version`); the 4 removed primitives (InstrumentRail/HandMark/DeckProgress/GlassDialogNative) absent-after-bump | after W0 lands locally |
| **K.W2** | The typographic root | **AUTHORED** | `proof:font-voice-authority` — ONE voice-token authority (display/mono/body) resolves on every surface INCLUDING the dock-label (positive `dock-label → display serif` assert, not just the Jakarta negative); `--font-serif`/`--font-display` redundancy collapsed to one | RED on today's tree: `proof:demo-fonts` greens while the dock resolves the text/mono voice; `font-census.mjs` finds two display tokens + per-site stacks (`styling-typography-k.md`) | after W1 (∥ W3); BINDING boundary: W2 owns the VOICE tokens |
| **K.W3** | The layout transposition | **AUTHORED** | `proof:dock-anchor-derived` (NO hardcoded dock offsets — anchor tokens derived, not retuned) + `proof:pathological-cluster` (a width AND height ceiling after which docks + controls CLUSTER; `clamp()`/container-query driven) | RED on today's tree: `probe-pathological.mjs` shows docks/controls STRETCH at 3440×1440 / 5120×2880; `layout-grid-k.md` censuses the hardcoded offsets | after W1 (∥ W2); BINDING boundary: W3 owns the GRID/anchoring tier |
| **K.W4** | The pane verdicts, round 2 | **AUTHORED** | `proof:no-single-option-select` (TOTAL — no lone-option Select renders anywhere) + the spring-slider-smoothness oracle (the few-Hz readout mirror must NOT drive the slider) + the FourierField-absent-on-hero assert | RED on today's tree: the ChromeDock controls-tab `<Select>` renders a 1-item dropdown on the single-surface scenes (easing/spring) — the sole sweep violation (`live-dock-tabs-selects.md §2.1/§3 S1`, `ChromeDock.vue:199-221`); the spring slider STEPS (U-K15); `<FourierField variant="hero">` mounts (`live-fourier-grid.md`, `EditorStartScreen.vue:78-86`) | after W2 + W3 (consumes the new voice + grid) |
| **K.W5** | The gate-truth wave | **AUTHORED** | The axis-coverage map executed: `proof:cold-entry` (W0's own hard gate); `proof:subject-animates` extended from synthetic pages to the REAL scenes; the meta-gate `proof:gate-is-runtime` derives its set from `proof:correctness` membership (T3); the TASTE review-packet protocol instrumented; `release.yml` `timeout-minutes` (F-1); the demo-smoke wall-clock hazard dispositioned | RED-per-leg: each leg born-RED on a PLANTED dist defect; the meta-gate reds when `proof:demo-fonts` (load-rest) is audited (T3); the cold-entry leg born-RED on the live P0 | **LEGS PARTITION** — the cold-entry oracle lands WITH W0; the rest land as the surfaces they certify land; the TASTE packets generate at W4's close |
| **K.W6** | Terminations (P-invariant-28) | **AUTHORED** | No new gate (terminations + measurements): the DL-K ≥4-tranche riders exit probe-or-KILL; the mobile-lighthouse floor re-assertion on a calibrated host (`KF_REQUIRE_LH=1`); the W2 drag-seam gaps + the dev-mode parity chronicle dispositioned; the N2-resolved DL rows (DL-K18 LRU bound, DL-K17 diagnostics producer) exit by published-consume-edge | The measurement IS the witness (a bench / a calibrated-host Lighthouse run / a node probe) per the EXIT-shaped disposition; no born-RED gate where the exit is a measurement artifact | **PARALLEL** throughout |
| *— Band II — THE ROUND-TRIP FRONTIER (K.W7–K.W12; rides the honest substrate Band I leaves; the §"Open deferrals" DL-K26..K32 fold here) —* | | | | | |
| **K.W7** | The fidelity floor (LEADS Band II) | **AUTHORED** (`waves/K.W7.md`) | `proof:composition-honored` + `proof:diagnostics-channel` — `engine.ts` READS the captured `animation-composition` it currently drops, on rAF (additive accumulate) + WAAPI (composite), with rAF↔WAAPI parity; + the diagnostics channel consuming the 0.12.0 `ParseDiagnostic`/`OnParseError` producer. value.js-RIPE-CONSUMED (N2 row 10 — the one frontier wave with NO acyclic-spine born-RED edge) | RED in the FRONTIER sense (capability ABSENT — not regressed): `grep "composition" src/animation/engine.ts` → ZERO hits (`K.W7.md §State-verified` — the captured `adapter.ts:24-29,120-126` Map is dead on arrival); `grep "composite" src/animation/waapi.ts` → the sole hit is the prose `waapi.ts:21`; `ResolvedKeyframes` has no `diagnostics` field (`adapter.ts:18`). A `composite:add` animation produces the REPLACE value on BOTH paths today | **LEADS Band II** — engine-internal; consumed by K.W8 (diagnostics channel) + inverted by K.W10 (the honoring it EMITS) |
| **K.W8** | The ingest (∥ W9) | **AUTHORED** (`waves/K.W8.md`) | `proof:ingest-replay-equal` — `fromStyleSheets()`/`fromLiveAnimations()` ingested CSS replays PIXEL-EQUAL to its source animation; K2 `adoptRunning()` (NAMED to disambiguate the shipped `adoptCompiled` — HARDENING-5 HAZARD-1) mid-flight takeover via `getAnimations()` currentTime handoff, flash-free; CORS skip is a DIAGNOSTIC, never a silent drop. value.js-RIPE-with-tripwire | RED in the FRONTIER sense: `grep -rn "styleSheets\|getAnimations\|cssRules\|fromStyleSheets\|fromLiveAnimations" src/` → ZERO hits (`K.W8.md §State-verified` — kf cannot see a single one of the page's own CSS animations); `CSSKeyframesRule.cssText` already feeds `resolveKeyframes` but no `fromStyleSheets()` surface reads it. Robustness tripwire: VJ-9 full totality (PARTIAL in 0.12.0) — recorded, NOT a gate | after W7 (consumes its diagnostics channel) ∥ W9 |
| **K.W9** | The scroll-as-CSS (∥ W8) | **AUTHORED** (`waves/K.W9.md`) | `proof:scroll-roundtrip` — parse + round-trip + dispatch `animation-timeline`/`-range`/`-trigger`; native ScrollTimeline where eligible, the kf `ScrollScene` SO-2 where not (Firefox/pin/snap); SO-3 sticky-pin synthesis (SO-4 transform-pinning KILLED). **value.js-DISPATCHED: VJ.W1 scroll grammar (OPEN)** — source half lands born-RED, the consume edge lights on value.js's publish | RED in the FRONTIER sense + value.js-gated: `CSSTimelineOptions`/`parseAnimationTimeline` verified ABSENT in 0.12.0 (orchestrator-probed 2026-06-15; `VALUEJS-N2-ASKS.md:61`); the acyclic-spine — the consume is a PUBLISHED edge, NEVER a `file:` link or vendored copy | after W7 ∥ W8; the consume edge born-RED-gates on VJ.W1's publish (the J.W7b published-consume-edge idiom) |
| **K.W10** | The compile (XL anchor) | **AUTHORED** (`waves/K.W10.md`) | `proof:compile-replay-equal` — the compiled zero-runtime CSS replays PIXEL-EQUAL side-by-side to the JS playback it emitted from (the parser run BACKWARD over the same data model, NOT a lossy emitter); CC-3 the four refusals (weighted blend / custom renderers / perceptual oklab / computed-unit drift — REFUSE, never approximate); CC-2 oklab densify (**VJ.W2-DISPATCHED**); CC-4 "Export CSS" button. CC-1 core on RIPE `reverseAnimationShorthand` | RED in the FRONTIER sense: no compiler exists (grep: no `compile`/`toCSS` emit surface); CC-1 core on RIPE `reverseAnimationShorthand` (0.12.0); CC-2 densify gates on VJ.W2 `sampleColorRamp` verified ABSENT in 0.12.0 (`VALUEJS-N2-ASKS.md:124`) | after W7 (inverts the honoring) + W8 (composes ingest — K1∘CC-1) ∥ W11 |
| **K.W11** | The physics (∥ W10) | **AUTHORED** (`waves/K.W11.md`) | `proof:spring-blend-weight` — PHYS-C spring-driven blend weight on the weighted-blend compositor (only POSSIBLE on kf's substrate — the flagship demo moment); PHYS-B2 `reseatToSpring` (velocity-continuous interruption); PHYS-E intensity-scaled reduced-motion (WCAG 2.3.3). Engine-internal (`group.ts` blend-WEIGHT tier), **file-disjoint from the compiler AND from W7's blend-MODE leaf** | RED in the FRONTIER sense: no spring-driven blend weight today (grep: `layer.weight` is a static scalar, not spring-driven); rides the K.W0/K.W1 `scenePlaybackAdapters`/`sceneMachine` playback seam. value.js-INDEPENDENT | ∥ W10; rides the K.W0/K.W1 seam; file-disjoint from K.W10 + the W7 blend-MODE leaf |
| **K.W12** | The externalize (CLOSES Band II) | **AUTHORED** (`waves/K.W12.md`) | `proof:agent-surface` over the published proof corpus + llms.txt (ED-1); ED-2 `@mkbabb/keyframes-vue`; ED-3 the dogfood inversion (the demo consumes the PUBLISHED barrel — honest ONLY on Band I's repaired demo); ED-4 the color-fidelity conformance harness (`deltaEOK`, RIPE 0.12.0). value.js-RIPE | RED in the FRONTIER sense: no agent surface exists (grep: no `llms.txt`, no `proof:agent-surface`); ED-3's dogfood is honest ONLY after Band I repairs the demo + all prior surfaces published (J.W5 publish ✅) | **CLOSES Band II** — after all prior frontier surfaces + Band I's repaired demo |
| **K.WZ** | CLOSE | **AUTHORED** | FINAL.md held to inv ε; the prompt-recap extended; `proof:chronic-closure` re-pointed J→K (the substrate transition); the TASTE review packets presented + the user verdict recorded; the frontier band closed on the replay-equality invariant; the version cut + publish + close-merge round-trip RE-observed; `L-SEED.md` committed (the consumed body of record); the K ledger terminal | The substrate re-point is GATED non-vacuous (planted malformed K-ledger rows red on the three clause shapes, per the J.WZ precedent); the close-merge deploy round-trip RE-observed (CI→deploy→live bytes) | **CLOSES** — the design band closes ONLY on the user's review-packet verdict (the TASTE boundary), a named USER-DOMAIN step BEFORE the version cut; the frontier band closes on replay-equality |

**P6 posture per wave (the device-independence taxonomy carried from J).** Each wave's spec declares,
per gate clause, one of: **hard** (asserts in CI, device-independent), **observe-only** (device-
dependent measurement recorded, never CI-hard-gated — the quiet-host measurement of record), **runner-
calibrated** (`KF_REQUIRE_LH=1` on a calibrated host). The cold-entry oracle (W0/W5) is **hard** (a
browser actuation over the built dist, device-independent — it reads the engine's own write channel, not
a frame budget). The pathological-cluster oracle (W3) is **hard** (a deterministic resize + computed-
layout read). The mobile-lighthouse floors (W6/DL-K11) are **runner-calibrated** (the J probe was
contention-tainted; never measured-quiet — P6-WITNESS forbids closing it on an observe-only score with
no on-device born-RED witness). The TASTE review-packet step (W4/WZ) is **non-gateable** (P-TASTE: the
user's verdict, never an agent's PASS). The Band-II replay-equality gates (W8 ingest, W10 compile) are
**hard** (a deterministic side-by-side pixel comparison over the built dist — device-independent; the
replay-equality invariant) or an **honest refusal** (the four refusals named in CC-3 — REFUSED with a
named reason, never silently approximated); the value.js-gated consume edges (W9 VJ.W1, W10's CC-2
VJ.W2) are **born-RED-until-publish** (the source half lands against a recorded born-RED, the consume
edge lights when value.js publishes — the acyclic-spine cadence, the J.W7b published-consume-edge idiom).

---

## §2 — THE FINDING-CLUSTER LEDGER (expanded with evidence anchors)

The charter's §finding-cluster→wave table, expanded per cluster with the decisive evidence anchors
(audit lane §section + U-K id + DL-K id). Severity from the fleet: the cold-path **P0** (triple-rooted)
+ the U-K register (20 findings, 19 file:line-rooted, U-K19 critic-rooted to the playground) + the DL-K
ledger (32 rows) + the per-lane FOLD tables. **§2.1–2.7 are Band I (the repair); §2.9–2.14 are Band II
(the round-trip frontier, folded WHOLESALE into K — the §body→K.W7–K.W12 map is `L-SEED.md
§body-item map`); §2.8 is the close.**

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

---

**§2.9–2.14 — BAND II (THE ROUND-TRIP FRONTIER, folded WHOLESALE into K).** The frontier divination
(`L-SEED.md` — the consumed body of record) maps §body→K.W7–K.W12 (`L-SEED.md §body-item map`). Each
cluster cites the frontier lane + the L-SEED §body item. The value.js gate status is per
`VALUEJS-N2-ASKS.md` (RIPE-consumed vs DISPATCHED-OPEN); the acyclic-spine handling (source half
born-RED, consume edge lights on publish) governs K.W9/K.W10's value.js-gated halves.

### 2.9 — The fidelity floor → K.W7 (LEADS Band II)

| Finding | Evidence anchor | L-SEED / value.js |
|---|---|---|
| WL2-B `animation-composition` HONORING — the engine drops a declared CSS operator | `adapter.ts:24-29,120-126` captures it; `engine.ts` reads it never (grep=0); `L-SEED.md §2 WL2-B`, `waapi-level-2.md` | DL-K16 · value.js-INDEPENDENT |
| The diagnostics channel consuming the 0.12.0 producer (`ParseDiagnostic`/`OnParseError`) | `adapter.ts:18` `ResolvedKeyframes` has no `diagnostics` field; `L-SEED.md §7 VJ.W3`; `VALUEJS-N2-ASKS.md` N2 row 10 | DL-K17 · RIPE (0.12.0 producer shipped) |

### 2.10 — The ingest → K.W8 (∥ W9)

| Finding | Evidence anchor | L-SEED / value.js |
|---|---|---|
| K1 `fromStyleSheets()`/`fromLiveAnimations()` — walk the CSSOM; `CSSKeyframesRule.cssText` → `resolveKeyframes` | `L-SEED.md §1 #2`, `live-stylesheet-ingestion.md`; the REPLAY-EQUALITY oracle (ingested replays pixel-equal to source) | DL-K27 (was SEED→L) · none — `cssText` already feeds `resolveKeyframes` |
| K2 `adopt()` mid-flight takeover via `getAnimations()` currentTime handoff | `L-SEED.md §1 #2 (K2)`; the temporal round-trip | — · robustness tripwire VJ-9 (PARTIAL) |

### 2.11 — The scroll-as-CSS → K.W9 (∥ W8, value.js-gated)

| Finding | Evidence anchor | L-SEED / value.js |
|---|---|---|
| SO-1 parse + round-trip `animation-timeline`/`-range`/`-trigger` + DISPATCH (native ScrollTimeline / kf `ScrollScene` SO-2); SO-3 sticky-pin (SO-4 KILLED) | `L-SEED.md §1 #3`, `scroll-orchestration.md` | DL-K28 (was SEED→L) · **VJ.W1 scroll grammar — OPEN/DISPATCHED** (`CSSTimelineOptions`/`parseAnimationTimeline` ABSENT in 0.12.0, `VALUEJS-N2-ASKS.md:61`; acyclic-spine: source half born-RED, consume edge lights on publish) |

### 2.12 — The compile (XL anchor) → K.W10

| Finding | Evidence anchor | L-SEED / value.js |
|---|---|---|
| CC-1 compile `AnimationGroup`/`Sequence`/`stagger` → zero-runtime CSS (the parser run BACKWARD, NOT a lossy emitter) | `L-SEED.md §1 #1`, `css-compiler.md`; the REPLAY-EQUALITY oracle (compiled replays pixel-equal side-by-side to JS playback) | DL-K26 (was SEED→L) · CC-1 core: `reverseAnimationShorthand` RIPE (0.12.0) |
| CC-2 oklab densify | `L-SEED.md §1 #1 (CC-2)` | **VJ.W2 `sampleColorRamp` — OPEN/DISPATCHED** (ABSENT in 0.12.0, `VALUEJS-N2-ASKS.md:124`; born-RED-gates kf-side on publish) |
| CC-3 the ineligibility report (the four refusals — REFUSE, never approximate) + CC-4 "Export CSS" button | `L-SEED.md §1 #1 (CC-3/CC-4)`; the replay-equality invariant (honest refusal) | — · `waapiIneligibleReason` generalized to the CSS domain |

### 2.13 — The physics → K.W11 (∥ W10)

| Finding | Evidence anchor | L-SEED / value.js |
|---|---|---|
| PHYS-C spring-driven blend weight on the weighted-blend compositor (only POSSIBLE on kf's substrate; the flagship demo moment) | `L-SEED.md §2 PHYS-C`, `physics-frontier.md`; engine-internal `group.ts`, **file-disjoint from the compiler**; rides the K.W0/K.W1 `scenePlaybackAdapters`/`sceneMachine` seam | DL-K29 (was SEED→L) · value.js-INDEPENDENT |
| PHYS-B2 `reseatToSpring` (velocity-continuous interruption of a parsed-CSS animation) + PHYS-E intensity-scaled reduced-motion (WCAG 2.3.3) | `L-SEED.md §2 PHYS-C riders` | — · none |

### 2.14 — The externalize → K.W12 (CLOSES Band II)

| Finding | Evidence anchor | L-SEED / value.js |
|---|---|---|
| ED-1 llms.txt + the proof corpus as a public artifact + `proof:agent-surface` | `L-SEED.md §2 ED-1`, `ecosystem-distribution.md` | DL-K30 (was SEED→L) · J.W5 publish ✅ |
| ED-2 `@mkbabb/keyframes-vue` (the thin new adapter) + ED-3 the dogfood inversion (the demo consumes the PUBLISHED barrel — honest ONLY on Band I's repaired demo) | `L-SEED.md §2 ED-1 riders`; ED-3 honest ONLY after Band I repairs the demo | — · STRONGER on the repaired substrate |
| ED-4 the public color-fidelity conformance harness (`deltaEOK`, RIPE) | `L-SEED.md §2 ED-1 (ED-4)`; `VALUEJS-N2-ASKS.md §2 row 12` (`deltaEOK` RIPE) | — · RIPE (0.12.0) |

### 2.8 — CLOSE → K.WZ

| Finding | Evidence anchor | U-K / DL-K |
|---|---|---|
| FINAL.md held to inv ε; the prompt-recap extended through the close | `prompt-recap-k.md` | — · — |
| The chronic-closure substrate transition J→K (the §"Open deferrals" re-point) | `precepts-k.md §3 T6` (P-SUBSTRATE); `scripts/proof-chronic-closure.mjs:109` | — · — |
| The TASTE review packets presented + the user verdict recorded (the design band closes ONLY here) | the TASTE boundary (charter §invariants); `precepts-k.md §S2 P-TASTE` | — · — |
| The frontier band closed on the replay-equality invariant; the version cut + publish + close-merge round-trip RE-observed; `L-SEED.md` committed (the consumed body of record); the K ledger terminal | `packaging-k.md`; `L-SEED.md`; `k-seed-reconciliation.md` (Shape-A SUPERSEDED, evidence-of-record) | — · DL-K26..K32 (FOLD → Band II K.W7–K.W12) |

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

### 3.2b — The K-born invariants (the COLD-axis set + the Band-II round-trip set)

The five NEW K-born invariants (`K.md §invariant set`). The first three (Band I — the cold-entry
discipline) were named at the 2026-06-12 audit; the last two (Band II — the round-trip frontier)
are born with the 2026-06-15 total fold. Each carries its born-RED witness and its owning wave(s).

| inv | Band | Statement (from `K.md §invariant set`) | Owning wave(s) · gate |
|---|---|---|---|
| **the COLD-axis invariant** | I | A certified surface is exercised from its COLD/DEFAULT entry — the hero CTA, a fresh mount, the default selection state — not only through choreographed setup paths. The cold entry is the FIRST boundary a human crosses; it gates FIRST. | K.W0/W5 · `proof:cold-entry` (born-RED on the live P0 — the hero rainbow-play resume NO-OP `scenePlaybackAdapters.ts:76-79`) |
| **the engine-write disambiguation rule** | I | A liveness oracle must distinguish ENGINE-DRIVEN writes from decorative CSS animation. The B1 vacuity class (greening on `.idle-hover` bob with the engine off) is forbidden: the oracle reads the engine's own write channel (inline-style mutation attributable to `interpFrames`/the group composite, or `anim.t`-correlated subject deltas), never bare `getComputedStyle` churn. | K.W0/W5 · the B1 de-vacuousing (born-RED: B1 PASS on 101 idle-bob transforms, engine OFF, `live-session-gap-analysis.md §1`). Carries into Band II — K.W7's `proof:composition-honored` reads the engine's own blend write (the SUM value), never decorative churn (`K.W7.md §Hard-gate`, §No-workaround) |
| **the TASTE boundary** | I | Gates carry CORRECTNESS; they do not carry the design VERDICT. Every appearance wave's close produces a review packet (per-pane before/after, desktop+mobile, named deltas) and the design band closes ONLY on the user's verdict on that packet — a named USER-DOMAIN step, scheduled BEFORE the tranche close, never after. An agent's "designer-eye PASS" is corroboration, never the verdict. | K.W4/WZ · P-TASTE (non-gateable; the user's verdict, born-RED in the J.W7c agent-PASS-vs-user-"awful" gap, `live-spring-sequence-mp-verdict.md`) |
| **the replay-equality invariant** (Band II born) | II | Every round-trip frontier claim is proven by REPLAY-PIXEL-EQUALITY or an HONEST refusal: ingested CSS (K.W8) replays equal to its source animation; compiled CSS (K.W10) replays equal side-by-side to the JS playback it emitted from (pixel-compared); what cannot round-trip faithfully is REFUSED with a named reason (`waapiIneligibleReason` generalized to the CSS domain — the four refusals: weighted blend / custom renderers / perceptual oklab / computed-unit drift), never silently approximated. The moat is the faithfulness; a lossy emitter forfeits it. | K.W8 · `proof:ingest-replay-equal` (born-RED in the FRONTIER sense — no `fromStyleSheets` surface, `K.W8.md §State-verified` ZERO grep); K.W10 · `proof:compile-replay-equal` + CC-3 the four refusals; the PRECONDITION is K.W7's honoring (`K.W7.md §Design-decisions` — replay-equality made causal: W10's compile replays equal ONLY on W7's honest substrate) |
| **the acyclic-spine invariant** (the constellation law, made charter-binding) | II | value.js ships VALUES (grammar, parse/serialize, color science, interp kernels); kf consumes ONE tranche behind, born-RED-gated kf-side; glass-ui consumes spring FROM kf. No cycle. K Band II's scroll/compile waves born-RED-gate on the PUBLISHED value.js grammar (VJ.W1/VJ.W2) — they do not block kf's impl on an unpublished symbol; the wave's source half lands against a recorded born-RED, the consume edge lights when value.js publishes. **NEVER a `file:` link or a vendored copy.** | K.W9 (VJ.W1 scroll grammar — DISPATCHED/OPEN, source half born-RED) · K.W10's CC-2 (VJ.W2 perceptual ramp — DISPATCHED/OPEN) · K.W7's diagnostics consume is the RIPE form (the producer shipped in 0.12.0, no born-RED edge — `K.W7.md §Hand-off`). Dispatched via `KF-TO-VALUEJS-GRAMMAR-ASKS.md` |

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
(32 DL-K rows) + the U-K register + the frontier band (DL-K26..K32, **now FOLDED into K Band II** —
the 2026-06-15 total fold superseded the original SEED→L disposition) + `K.md §clusters/§fold`, PLUS two
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
> **DISPOSITION VOCABULARY:** **FOLD** (into a K wave — INCLUDING the Band-II frontier waves K.W7–K.W12,
> the 2026-06-15 total fold; a FOLD-into-Band-II row's closure mechanism is the wave's replay-equality
> oracle or honest refusal, named in prose, OR the published value.js consume-edge for a value.js-gated
> half) · **RE-OPEN→FOLD** (a J-terminal row the K live audit re-falsified, re-folded into a K wave) ·
> **RE-AFFIRM** (genuinely closed; do not re-litigate) · **VERIFY-ONLY** (claimed-closed; K re-runs) ·
> **HANDOFF** / **OUT** (sibling-owned, paired with a published consume-edge or a born-RED kf gate) ·
> **BOOK** (net-new, terminal home named) · **RECORD** (historical, terminal) · **KILL** (permanent,
> reasoned) · **USER-DOMAIN** (version owner Mike Babb, confirm-first). *(The former SEED→L disposition
> is RETIRED — the frontier folded into K Band II rather than deferring to an L that will not come; the
> DL-K26..K32 rows below carry their Band-II FOLD/BOOK/KILL dispositions.)*
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
| **DL-K16 FB-1 animation-composition HONORING** (the engine drops a declared CSS operator) ★‡ | F | 5 (F,G,H,I,J BOOK-reaffirm) | **FOLD (Band II) — EXIT-ONLY** | **K.W7** (LEADS Band II, WL2-B) | Under the 2026-06-15 total fold the fidelity floor is **K.W7** (Band II's LEAD), NOT K.W0 — engine-internal, value.js-independent, the round-trip made HONEST before it is widened. Author `proof:composition-honored` first (the K.W7 §Hard-gate — RUNTIME + correctness, born-RED-pending) — `engine.ts` READS the captured `animation-composition` on rAF (additive accumulate) + WAAPI (composite). **Born-RED in the FRONTIER sense (capability ABSENT):** `adapter.ts:24-29,120-126` captures it; `engine.ts` reads it never (grep=0); `L-SEED.md §2 WL2-B`. P-inv-28 forbids a 6th BOOK — the EXIT is K.W7 LAND |
| **DL-K17 VJ-F2 / LD-DIAG diagnostics sink** (no `diagnostics` field on `ResolvedKeyframes`) ★‡ | F | 5 (F,G,H,I,J BOOK-reaffirm) | **FOLD (Band II K.W7 channel) + HANDOFF (value.js producer)** | **K.W7** (channel) · **K.W6** (producer consume-edge) | Author `proof:diagnostics-channel` first (the K.W7 §Hard-gate — RUNTIME + correctness, born-RED-pending): the kf-side diagnostics CHANNEL on `ResolvedKeyframes` is authored at **K.W7** (the fidelity floor — the round-trip must be HONEST); the value.js `ParseDiagnostic`/`OnParseError` PRODUCER is already shipped in 0.12.0 (N2 row 10) and consumed at **K.W6** as a published-consume-edge (the N2-resolved exit). **Born-RED-able:** `adapter.ts:18` `ResolvedKeyframes` exists, no `diagnostics` field (`L-SEED.md §7`; `VALUEJS-N2-ASKS.md` N2 row 10). P-inv-28 forbids a 6th BOOK — the EXIT is the K.W7 channel + the K.W6 published producer |
| **DL-K18 tryParseCache eviction** (unbounded Map) ★‡ | C(C-3)/F | 6 (C,F,G,H,I,J) | **HANDOFF** (value.js VJ-4 `{maxCacheSize}` — SHIPPED 0.12.0; exit by published-consume-edge) | K.W1 (re-pin consume) | `utils.ts:203` unbounded; the bound lives in value.js and is now PUBLISHED — **VJ.W0 LANDED in 0.12.0** (the LRU bound; `VALUEJS-N2-ASKS.md §5`, `X-KF.md`). The N2-resolved exit: kf consumes the bound on the K.W1 `^0.11.2 → ^0.12.0` re-pin (the published-consume-edge, no future-version wait). Sibling-owned, published-consume-edge (`K-SEED.md §7 VJ.W0`) |
| **DL-K3-mobile / DS-2,DS-5 control-store retype** (BOOK-adjacent type hygiene) | I→J | 2 (I,J) | **BOOK → FOLD on touch** | K.W4 | Typed-narrow `selectedControl:string` + `storedControls:any` when the K control-surface work touches the dock store (`J.W2-impl.md:237-238`). Latent type-hygiene; folds when K.W4 touches the control store |
| **DL-K15 the OrbitalDrag third bypass** (local `user-select:none` + `setPointerCapture`) | I→J | 2 (I,J) | **BOOK** (verified-live, not converted) | K.W6 | Stays a BOOK per born-RED-or-leave; re-verify if K touches the cube orbit gesture (`orbital-drag/OrbitalDrag.vue:331`). Latent drag-gap class (the W2-noted pre-existing bypass) |
| **DL-K19 A7 cube idle-bob CSS dogfood + A9 matrix `acos` Euler recovery** (cohesion BOOKs) ★ | A | 10 (A…I + J) each | **BOOK-reaffirm** (cohesion, not defects); A7 gate-excluded by DL-K2 | K.W0 (A7 exclusion) | A7/A9 are 10-tranche cohesion BOOKs (NOT defects). BUT A7's `.idle-hover` (`CubeTarget.vue:207-214`) is the EXACT mechanism that false-GREENs DL-K1/K2; the DL-K2 cure gate-EXCLUDES it (counts engine-driven motion only) OR replaces the dogfound CSS with an engine-driven idle. Non-defect cohesion; the A7 exclusion is the load-bearing K motion |
| **DL-K33 the engine-core hygiene band** (`engine-core-k.md` §FOLD EC-1..EC-13; the lane's 13 file:line-rooted findings) ★ | A→J (per-row) | 2 (I,J — EC-1 the J.W6-ADOPT carry; the rest net-new at K) | **BOOK → FOLD on touch / VERIFY-LANDED** (EC-5 ≡ DL-K18 + EC-7 ≡ DL-K16 — NOT double-counted; routed there) | **K.W0** (EC-13/EC-2/EC-4/EC-6/EC-8..EC-12) · **K.W5** (EC-1) | The engine-core lane folds in TWO destinations: **EC-13** (P1 — "Group cold-path `NOOP_TRANSFORM` survives when the animation is un-parsed at `play()` time; likely root of U-K2/U-K3 subject-freeze", `group.ts:133`+`useSceneMachineApp.ts:128`) is a P0-ADJACENT root-cause finding folded into **K.W0** alongside the adapter resume cure (the engine-side twin of the `scenePlaybackAdapters.ts:76-79` no-op); **EC-1** (P1 — `lerpArray` SoA J.W6-ADOPT decision, IMPL not yet landed, `engine-core-k.md §2`) folds to **K.W5** as a born-RED engine-totality gate (the bench `bench/interp-buffer.bench.ts` is the witness substrate). The remaining P2 hygiene rows (EC-2/EC-3/EC-4/EC-6/EC-8..EC-12 — comment-gaps + trivial loop/index refactors + the brittle `format.ts:219` regex EC-4 the no-workaround precept indicts) are **BOOK → FOLD-on-touch** in **K.W0** (the engine-touching wave); EC-5 (`tryParseCache` no eviction, `utils.ts:203`) is **EC-5 ≡ DL-K18** (consume value.js VJ-4 `{maxCacheSize}`) and EC-7 (`animation-composition` captured-never-consumed) is **EC-7 ≡ DL-K16** (FB-1, the **K.W7** Band-II fidelity-floor LEAD under the total fold — NOT K.W0) — both routed to their existing DL-K rows, NOT re-counted here. (`engine-core-k.md §FOLD`) |
| **DL-K34 the packaging + README + toolchain hygiene band** (`packaging-k.md` §FOLD PKG-1..PKG-11; the publish-surface honesty findings) | J→K (per-row) | 1 (net-new at K; the publish surface born at the J 4.2.0 cut) | **FOLD (docs/repin) / HANDOFF** | **K.WZ** (PKG-4/5/6/7 README + PKG-11 publish-gate + PKG-8 lockfile + PKG-3 d.ts-alias) · **K.W1** (PKG-1/PKG-10 repin) · **K.W6/value.js** (PKG-2/PKG-9) | Terminal docs/publish-surface hygiene closures (NOT kf runtime gates — the README is REWRITTEN, the publish-gate roster is corrected): the packaging lane's eleven file:line-rooted findings home as: **K.WZ** (the docs-close + the readme-runs/published-surface publish-gate parity, both hygiene-tier by construction — named in prose, not cited as runtime closure oracles) — **PKG-4** (README Quick Start broken — no `loadAnimationEngine()`, `README.md:11-35`) + **PKG-5/PKG-6** (HEAVY-API README block + 5 dead `src/parsing` / `units` / `easing` / `math` links) + **PKG-7** (`package.json:4` "standards-complaint" typo) + **PKG-11** (`release.yml` omits the published-surface + readme-runs publish-gate parity, hygiene-tier) + **PKG-8** (`package-lock.json` `4.1.0` drift vs `4.2.0`, corrected in the cut motion) + **PKG-3** (`Animation_2`/`ScrollTimeline_2`/`flip_2` d.ts collision aliases — DX, a 5.0-rename candidate); **K.W1** (the re-pin) — **PKG-1** (`"files"` negation missing `"!dist/demo-app"`) + **PKG-10** (the deps-current hygiene floor advances atomically with the 3.13.0 pin); **K.W6/sibling** — **PKG-2** (API-Extractor TS-6 forward-risk, fold-on-touch toolchain) + **PKG-9** (parse-that realm split `utils.ts:248` — HANDOFF value.js side). All publish-surface honesty; the K.WZ clauses already cite PKG-4/8/10/11, this band homes the remaining seven. (`packaging-k.md §FOLD`, K.WZ §clause (h)/§S6) |
| **DL-K20 C-1 value.js next-slice (VJ-1..9)** + the EF-5 tranche-M reconciliation ★‡ | C | 8 (C,D,E,F,G,H,I,J) | **HANDOFF — BOOK-reaffirm** (chronic-by-design; published-consume-edge) | K.W1 (re-pin re-confirm) | value.js `0.11.2` PUBLISHED-consumed; the K-SEED §7 VJ seed supersedes the stale tranche-M spine; each VJ item born-RED-able the instant its primitive publishes. P-inv-28 satisfied by the published-consume-edge form, never a bare BOOK (`K-SEED.md §7`; `valuejs-sota-handoff-v2.md`) |
| **DL-K21 VJ-4/MCI-5 identity-pad witness · VJ-F1 arc-length sampler · FB-3 MorphSVG** ★ | C | 6 (C,F,G,H,I,J for FB-3) | **HANDOFF — PARTIAL-RESOLVED 0.12.0** (the sampler+pad EXIT by published-consume-edge; MorphSVG remainder gated) | K.W1 (sampler/pad consume) · K.W6 (FB-3 tripwire) | The N2-resolved split (`VALUEJS-N2-ASKS.md §5` — **VJ.W4 PARTIAL: sampler+tangent, MCI-5 arity pad, VJ-F4 buffer-reuse SHIPPED in 0.12.0**): the MCI-5 identity-pad witness `it.fails(` at `test/interpolate-anything.test.ts:256` flips on the K.W1 re-pin (the published-consume-edge exit); the VJ-F1 arc-length sampler is consumed RIPE. Only **FB-3 MorphSVG** remains gated (the real competitor gap; the product half is kf's — VJ.W4 remainder/VJ-5 verify, a K.W6 tripwire). Sibling-owned, published-consume-edge for the shipped half (`K-SEED.md §7 VJ.W4`) |
| **DL-K22 PT-1 parse-that `(id,offset)` packrat re-key** ★ | G(LD-PT) | 4 (G,H,I,J) | **HANDOFF** (gate-first BOOK) | K.W6 | parse-that `^0.9.0`, zero prod consumers; author `proof:packrat-position` first. Latent; sibling-owned, gate-first (`K-SEED.md §7 VJ-6`) |
| **DL-K23 GH-4/FB-4 `{types}` directional VT · G-3/RF-3 LabeledField orientation · glass-ui typography opt-in** ★ | G/I | 4 (G,H,I,J) | **HANDOFF** (consumed on the published re-pin) | K.W1 | glass-ui-owned; folds into the DL-K6 re-pin (RF-3/RF-4 may land in the PUBLISHED 3.13.0); `{types}` folds only IF K elects scene interactivity. Sibling-owned, published-consume-edge (`glassui-AX-handoff.md` RF-3/RF-4) |
| **DL-K24 dock double-click** (glass-ui root) ★‡ | pre-A | 10 (pre-A…I, recurring + J) | **HANDOFF — VERIFY-ONLY** (resolved in the published 3.9.0; re-verify on 3.13.0) | K.W1 (re-verify) | Terminal non-gate mechanism: the glass-ui root fix landed (published-consumed); the demo workaround REMOVED (the grep at `AnimationMenuBar.vue:106` clean). Re-verify it stays resolved across the 3.13.0 dock-taxonomy rewrite (the "breaking tranche" touches the dock). A glass-ui-root resolution, never kf-patched |
| **DL-K25 DEP-1/2/3 deploy (CNAME/template/roster)** | G | 4 (G,H,I,J) | **HANDOFF** (deploy-owned) | K.WZ (confirm) | Sibling-owned; live deploy is Cloudflare Pages (`keyframes.babb.dev`, `MEMORY.md`). The OBSERVED auto-deploy round-trip is the standing oracle; K.WZ RE-observes the close-merge round-trip. OUT-band |
| **DL-K12 the editor-pane LCP lever** (cube 58 / spring 73; Monaco lazy ~8MB) | E(Monaco)→J | 2 (E,J recorded) | **BOOK / MEASURE-FIRST** (re-measure on a quiet host) | K.W6 | Editor-pane skeleton/progressive paint OR the K-era CSSCodeEditor question; re-measure on a quiet host first (`perf-battery-2026-06-10.md:57-72`). Latent; recorded with a re-measure step (NOT a ≥4-tranche bare BOOK — 2-tranche) |
| **DL-K26 CC-1 the CSS COMPILER** (the XL anchor; compile `AnimationGroup`/`Sequence`/`stagger` → zero-runtime CSS — the parser run BACKWARD, NOT a lossy emitter) | C→J (SEED) | 0 (frontier — net-new at K Band II) | **FOLD (Band II)** | **K.W10** | The frontier folded WHOLESALE into K (2026-06-15; the former SEED→L SUPERSEDED). Author `proof:compile-replay-equal` first (the K.W10 §Hard-gate — RUNTIME + correctness, born-RED-pending; named-now-authored-in-impl per the K convention) — the compiled zero-runtime CSS replays PIXEL-EQUAL side-by-side to the JS playback it emitted from, else CC-3 REFUSES with a named reason (the four refusals), never approximated. **Born-RED in the FRONTIER sense:** no compiler exists. CC-1 core consumes RIPE `reverseAnimationShorthand` (0.12.0); CC-2 oklab densify born-RED-gates on the **VJ.W2** publish (`L-SEED.md §1 #1`, `css-compiler.md`, `VALUEJS-N2-ASKS.md:124`) |
| **DL-K27 K1 LIVE-STYLESHEET INGESTION** (`fromStyleSheets()`/`fromLiveAnimations()` + K2 `adopt()`) | C→J (SEED) | 0 (frontier — net-new at K Band II) | **FOLD (Band II)** | **K.W8** | Author `proof:ingest-replay-equal` first (the K.W8 §Hard-gate — RUNTIME + correctness, born-RED-pending) — ingested CSS replays PIXEL-EQUAL to its source animation; `CSSKeyframesRule.cssText` already feeds `resolveKeyframes`. **Born-RED in the FRONTIER sense:** no CSSOM-walk surface exists. value.js-INDEPENDENT (robustness tripwire: VJ-9 full totality, PARTIAL — recorded). Follows K.W7 (consumes its diagnostics channel) (`L-SEED.md §1 #2`, `live-stylesheet-ingestion.md`) |
| **DL-K28 SO-1 SCROLL-AS-CSS** (parse + round-trip + dispatch `animation-timeline`/`-range`/`-trigger`; `ScrollScene` SO-2; sticky-pin SO-3) | C→J (SEED) | 0 (frontier — net-new at K Band II) | **FOLD (Band II) — value.js-gated HANDOFF on the grammar half** | **K.W9** | Author `proof:scroll-roundtrip` first (the K.W9 §Hard-gate — RUNTIME + correctness, born-RED-pending), **born-RED-gated on the published value.js VJ.W1 scroll grammar** (`CSSTimelineOptions`/`parseAnimationTimeline` ABSENT in 0.12.0 — `VALUEJS-N2-ASKS.md:61`; DISPATCHED via `KF-TO-VALUEJS-GRAMMAR-ASKS.md`). The acyclic-spine: the source half lands born-RED, the consume edge lights on value.js's PUBLISH — NEVER a `file:` link (`L-SEED.md §1 #3`, `scroll-orchestration.md`) |
| **DL-K29 PHYS-C SPRING-DRIVEN BLEND WEIGHT** (the physical layer crossfade on the weighted-blend compositor; PHYS-B2 reseatToSpring; PHYS-E intensity-scaled PRM) | C→J (SEED) | 0 (frontier — net-new at K Band II) | **FOLD (Band II)** | **K.W11** | Author `proof:spring-blend-weight` first (the K.W11 §Hard-gate — RUNTIME + correctness, born-RED-pending) — a spring drives the weighted-blend layer crossfade (only POSSIBLE on kf's substrate). **Born-RED in the FRONTIER sense:** no spring-driven blend weight today. Engine-internal (`group.ts`), **file-disjoint from the K.W10 compiler**; rides the K.W0/K.W1 `scenePlaybackAdapters`/`sceneMachine` seam. value.js-INDEPENDENT (`L-SEED.md §2 PHYS-C`, `physics-frontier.md`) |
| **DL-K30 ED-1 the AGENT-CONSUMABLE SURFACE** (llms.txt + the proof corpus + `proof:agent-surface`; ED-2 keyframes-vue; ED-3 dogfood inversion; ED-4 `deltaEOK` harness) | C→J (SEED) | 0 (frontier — net-new at K Band II) | **FOLD (Band II)** | **K.W12** | Author `proof:agent-surface` first (the K.W12 §Hard-gate — RUNTIME + correctness, born-RED-pending) over the published proof corpus, + ED-3 the dogfood inversion (the demo consumes the PUBLISHED barrel — honest ONLY on Band I's repaired demo + the J.W5 publish). **Born-RED in the FRONTIER sense:** no agent surface exists. ED-4 consumes RIPE `deltaEOK` (0.12.0). CLOSES Band II (`L-SEED.md §2 ED-1`, `ecosystem-distribution.md`) |
| **DL-K31 the K-SEED BOOKs** (CC-5/CC-6/VT-D/K4/K5/EPF-1/EPF-4 — tripwire-gated) | C→J (SEED) | 0 (frontier — net-new at K Band II) | **BOOK** (tripwire-gated; carried into K Band II) | **K.W7–K.W12** (the owning frontier wave per item) | Each with a named tripwire (Baseline/workload); rides its owning Band-II wave when the tripwire fires (CC-5/CC-6 → K.W10; the rest per `L-SEED.md §6`). Carried as K Band II's BOOK band, NOT deferred to L (`L-SEED.md §6`) |
| **DL-K32 the 12 K-SEED KILLs** (VT-A/B, CE-2/3, EPF-2/5, K-T1/T3, SO-4, CC-7, ED-6, PHYS-A) | C→J (SEED) | 0 (KILL — researched negative) | **KILL-reaffirm — RECORD permanent** (non-re-litigable; K's anti-charter) | — | Researched negative results; RECORD permanent, do not re-open. The 12 KILLs carry as K Band II's anti-charter. The ARCH "ScrollTimeline-native-replace" KILL does NOT block SO-1/K.W9 (which ADDS a parse+dispatch tier, never deletes the JS driver) (`L-SEED.md §5`) |
| **VJ.W1 scroll grammar + VJ.W2 perceptual ramp** (the Band-II value.js gates — the OUTBOUND dispatch, the acyclic-spine in motion) ‡ | C (frontier-spine)→K (dispatched) | 8 (C…J for the VJ ledger; net-DISPATCHED at K) | **OUT / sibling-DISPATCHED** (paired with the born-RED kf consume edges K.W9/K.W10) | **K.W9** (VJ.W1) · **K.W10** CC-2 (VJ.W2) | Sibling-owned, DISPATCHED to value.js's post-N successor tranche (anticipated next minor, 0.13.0 — version not yet cut, value.js-scheduled) via the kf-side outbound ask `KF-TO-VALUEJS-GRAMMAR-ASKS.md §1/§2`; the mirror of the inbound `VALUEJS-N2-ASKS.md §3`. value.js's Tranche N recorded BOTH items for its post-N successor (`X-KF.md §3.2/O5`, value.js's own 0.13.0 fold proposal); K re-confirmed both ABSENT in 0.12.0 (orchestrator-probed 2026-06-15 — `CSSTimelineOptions`/`parseAnimationTimeline`, `VALUEJS-N2-ASKS.md:61`; `sampleColorRamp`, `:124`). The acyclic-spine: the kf consume edges (`proof:scroll-roundtrip` (b); `proof:compile-replay-equal` (d) CC-2 densify) land born-RED kf-side, lighting ONLY on value.js's PUBLISH — NEVER a `file:` link or vendored copy. P-inv-28 satisfied by the published-consume-edge form, never a bare BOOK (`KF-TO-VALUEJS-GRAMMAR-ASKS.md §5`) |
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
| **DL-K16** FB-1 composition | 5 (F…J) | K.W7 LAND (the Band-II fidelity-floor LEAD; engine-internal, value.js-independent) |
| **DL-K17** diagnostics sink | 5 (F…J) | the K.W7 channel + the K.W6 published value.js producer (0.12.0 `ParseDiagnostic`, N2 row 10) |
| **DL-K18** parse-cache bound | 6 (C…J) | consume value.js VJ-4 `{maxCacheSize}` (K.W1) |
| **DL-K20** value.js next-slice | 8 (C…J) | published-consume-edge form (each VJ item born-RED-able on publish) (K.W1) |
| **DL-K24** dock double-click | 10 (pre-A…J) | VERIFY-ONLY re-confirm on the re-pin (K.W1) |

### 4b — The Band-II frontier band (FOLDED WHOLESALE into K; the consumed body of record is `L-SEED.md`)

Under the **2026-06-15 total fold** the entire frontier round-trip charter (CC-1 compiler→K.W10, K1
ingestion→K.W8, SO-1 scroll-as-CSS→K.W9, WL2-B→K.W7, PHYS-C→K.W11, ED-1→K.W12, the value.js half §7,
the 12 KILLs, the BOOKs) is CONSUMED into K **Band II** (DL-K26..K32 above; the §body→K.W7–K.W12 map is
`L-SEED.md §body-item map`). **The original Shape-A wholesale-deferral is SUPERSEDED** (evidence-of-record
only — `k-seed-reconciliation.md`): the un-blocking it argued the L interval would deliver was delivered
by **value.js 0.12.0** inside the K interval itself (it shipped 2026-06-12, un-blocking FOUR of the six
waves; `VALUEJS-N2-ASKS.md:20`). The two genuine net-new grammar gates that remain OPEN — **VJ.W1 scroll
grammar** (gates K.W9) + **VJ.W2 perceptual ramp** (gates K.W10's CC-2 densify) — are DISPATCHED via the
kf-side outbound ask `KF-TO-VALUEJS-GRAMMAR-ASKS.md`; their consume edges light born-RED-gated kf-side on
value.js's publish (the acyclic-spine invariant — NEVER a `file:` link or a vendored copy). The P0 was
NOT mortgaged: Band I (K.W0–K.W6) leads regardless and is value.js-grammar-independent; Band II rides the
honest substrate the repair leaves behind. **There is no residual L.**

---

## §5 — TERMINAL READING (the development-phase close)

J made every boundary between the certified product and a human tell the truth — and the user, hours
later, crossed the one boundary no gate had ever crossed: the first click. K's development phase has
NAMED that boundary (the COLD-axis invariant), named the oracle defect that hid it (the engine-write
disambiguation rule), named where gates cannot carry the verdict (the TASTE boundary), and — under the
2026-06-15 total fold — named the round-trip frontier as **Band II** (the replay-equality + acyclic-spine
invariants born). It laid the two-band wave plan (Band I: W0 → W1 → (W2 ∥ W3) → W4, W5 legs riding, W6
parallel; Band II: W7 → (W8 ∥ W9) → W10 → W12, W11 parallel; then WZ) that makes the product TRUE from
the first gesture and BEAUTIFUL at its roots, then makes the CSS-@keyframes round-trip TOTAL on the
honest substrate the repair leaves behind. The §"Open deferrals" ledger folds every DL-K row, the U-K
register, and the frontier band (DL-K26..K32, now FOLDED into K Band II — the former SEED→L SUPERSEDED)
into the next chronic-closure parse substrate — AUTHORED, parse-valid, and READY for the K.WZ re-point
(J's ledger AUTHORITATIVE until then). **No implementation has occurred.** When K closes, "green" will
mean: the first thing a human does — click the rainbow button — works, smoothly, beautifully, on the
first try, and the engine that makes it move can now read, drive, and emit the entire living language of
CSS animation, proven faithful both ways — every claim signed by the only oracle that can judge it.

Doc: `/Users/mkbabb/Programming/keyframes.js/docs/tranches/K/PROGRESS.md`
