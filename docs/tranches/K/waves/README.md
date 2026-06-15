# Tranche K — the wave map · the cross-wave README

This is the cross-wave index for Tranche K — **two bands under one discipline: Band I the
PRODUCT-TRUTH + DESIGN-TOTALITY repair (K.W0–K.W6), Band II the ROUND-TRIP FRONTIER (K.W7–K.W12,
the frontier folded WHOLESALE into K — the 2026-06-15 total fold; there is no residual L)**. It
RENDERS the two-band DAG, gives a one-paragraph charter per wave, lists the gate roster K ADDS,
fixes the BINDING file-ownership boundaries for the implementation phase (the Band-I W2 voice-tokens
/ W3 grid-tier EXACT seam, AND the Band-II W7 engine.ts-honoring / W11 group.ts-physics / W10
compiler / W8·W9 new-surface disjoint loci — file-adjacent waves run in parallel, so each boundary
is a hard contract, not a guideline), summarizes the TASTE-packet protocol (the K-born TASTE-boundary
invariant), and the Band-II replay-equality + acyclic-spine invariants.

**This README is a MAP, not a spec.** It asserts nothing the binding docs do not. Authority order:
the charter `../K.md` (the cluster→wave ledger, the DAG, the three K-born invariants) GOVERNS; the
per-wave specs `K.W0.md … K.WZ.md` carry each wave's falsifiable §Hard gate, P6 postures, named
no-workaround prohibitions, BINDING cross-wave boundaries, and discharged fold rows; `../PATH-FORWARD.md`
is the executive summary; `../audit/*.md` (33 docs) is the evidence. Every claim here is rooted in
those — this doc duplicates none of their assertions, it only INDEXES them. Phase: **DEVELOPMENT on
`tranche-k-dev` @ `4f1fc4c`** — these wave specs are AUTHORED now, RUN later only on explicit user
authorization (the D→J dev/impl boundary; `K.md §Phase`). No source/demo/gate/test/CI edited in DEV.

---

## §1 — The DAG (rendered)

The longest serial path is **W0 → W1 → (W2 ∥ W3) → W4 → W7 → (W8 ∥ W9) → W10 → W12 → WZ**, with W5's
legs riding their owning waves, W6 parallel throughout, and W11 parallel to its owning Band-II band
(`K.md §WAVE MAP`, `PATH-FORWARD.md §5`). **Band I leads (the repair); Band II rides the honest
substrate Band I leaves behind:**

```
 ── BAND I (the repair — leads) ─────────────────────┐  ── BAND II (the round-trip frontier — rides after) ──
   ┌─────── proof:cold-entry + the de-vacuoused B1 ───┼──────── (consumed by every later wave, both bands) ───┐
   │        (W0's own hard gate)                      │                                                       ▼
 K.W0 ─> K.W1 ─────┬──> K.W2 ──┐                      │   K.W7 ──┬──> K.W8 ──────┐                    (every wave
 cold    consume   │  font     │                      │ fidelity │   ingest      │                     re-uses the
 door    edge      │  voice    ├──> K.W4 ─────────────┼─ floor   │   (consumes   ├──> K.W10 ──┬─> K.W12 ─> K.WZ
 plays   (3.11.2   └──> K.W3 ──┘  pane               │  (engine │    W7 diag)   │   compile  │  external  CLOSE
  │ P0    →3.13.0)     grid/      verdicts            │  honors  │              ╎│   (inverts │  (dogfood   ▲
  │ LEADS  precedes    anchoring  round 2             │  comp.)  └──> K.W9* ────╎┘   W7 +     │   inversion)│
  │        design                                     │          scroll-as-CSS ╎    composes │             │
  │                                                   │          (VJ.W1-gated) ╎    W8)  ∥ K.W11 (physics)  │
  │                                                   │                        ╎         (group.ts; file-  │
  │   ┌── K.W5 legs ride their OWNING waves ──────────┴──────────────────────╎─────────disjoint from W10) │
  │   │  cold-entry WITH W0 · subject-animates(real scenes) + single-option   ╎    · TASTE review-packet  │
  │   │  land as surfaces land · TASTE-packet rides W3 lib (generates at W4)  ╎      VERDICT (user-domain, │
  │   └────────────────────────────────────────────────────────────────────╎──────  BEFORE version cut) ─┘
  │                                                                          ╎  Band-II replay-equality / honest refusal
  └── K.W6 (P-invariant-28 terminations + measurements) — PARALLEL ─────────╎──────────────────────────────────────►
     * K.W9 born-RED-gates on value.js VJ.W1 (dispatched); K.W10's CC-2 on VJ.W2 — consume edges light on PUBLISH
```

**Edge rationale (BINDING — `K.md §WAVE MAP`):**

- **W0 LEADS.** It is the P0 (the cold-entry truth) AND it authors the two consumed oracles —
  `proof:cold-entry` and the de-vacuoused B1 (engine-write disambiguation). Until those land, no
  later wave can honestly verify that its own surface ANIMATES (it would re-inherit the B1 vacuity
  that greened on the `.idle-hover` bob with the engine off — `live-session-gap-analysis.md §0`).
- **W1 runs IMMEDIATELY AFTER W0 lands locally, and PRECEDES the design waves.** The glass-ui
  re-pin (`~3.11.2 → 3.13.0`) must precede W2/W3/W4 so the design waves build ON 3.13.0, not
  against it (the 3.13.0 dock taxonomy + re-cut sliders are the surface the panes consume —
  `live-glassui-currency.md`).
- **W2 ∥ W3.** File-adjacent in `demo/@/styles` but SEPARABLE: W2 owns the voice tokens, W3 owns
  the grid/anchoring tier. The spec boundary is BINDING (§4 below). They run in parallel.
- **W4 follows W2 + W3.** The pane redesigns CONSUME the new voice (W2) + the new grid (W3).
- **W5's legs partition.** The cold-entry oracle is W0's own hard gate (lands WITH W0); the
  remaining gate-truth legs land as the surfaces they certify land; the TASTE packets generate at
  W4's close. W5 is not a serial bottleneck — it is a roster of legs distributed across the DAG.
- **W6 is parallel.** Ledger terminations + measurements run throughout; they gate nothing on the
  critical path.
- **W7 LEADS Band II.** The fidelity floor — the engine HONORS the `animation-composition` it
  currently drops (`engine.ts` zero reads of the `adapter.ts:120-126` captured value) + the
  diagnostics channel. Engine-internal, value.js-INDEPENDENT; the round-trip must be made HONEST
  before it is widened. It rides the honest substrate Band I leaves behind (`K.md §WAVE MAP`).
- **W8 ∥ W9.** W8 (ingest — the CSSOM walk → `resolveKeyframes`) FOLLOWS W7 (it consumes W7's
  diagnostics channel). W9 (scroll-as-CSS) is value.js-GATED: it born-RED-gates on the PUBLISHED
  value.js VJ.W1 scroll grammar (the source half lands born-RED; the consume edge lights on publish —
  the acyclic-spine invariant, NEVER a `file:` link). They run in parallel.
- **W10 FOLLOWS W7 + W8.** The compiler INVERTS W7's honoring (it emits the `animation-composition`
  layering W7 taught the engine to read — a fidelity floor it must first HONOR before it can EMIT)
  and COMPOSES with W8's ingest (the ingest→recompile loop). CC-1 core proceeds on RIPE value.js
  (`reverseAnimationShorthand`); CC-2 oklab densify born-RED-gates on VJ.W2. The compiler is the
  round-trip's parser run BACKWARD over the same data model, NOT a re-derived lossy emitter.
- **W11 ∥ W10.** The physics (PHYS-C spring-driven blend weight) is engine-internal (`group.ts`),
  **file-disjoint from the W10 compiler**, and rides the K.W0/K.W1 `scenePlaybackAdapters`/
  `sceneMachine` playback seam Band I rebuilds. It runs parallel to the compiler.
- **W12 CLOSES Band II.** The externalize — `proof:agent-surface` + `proof:demo-on-published-surface`
  (ED-3 the dogfood inversion — the demo consumes the PUBLISHED barrel `@mkbabb/keyframes.js`, NOT
  `@src`). ED-3 is honest ONLY on Band I's repaired demo + all prior frontier surfaces published — so
  it closes the frontier band last.
- **WZ closes** — the design band closes ONLY on the user's review-packet verdict (the TASTE
  boundary), a named user-domain step scheduled BEFORE the version cut; the frontier band closes on
  the replay-equality invariant (W8/W10 replay pixel-equal, or an honest refusal per CC-3).

---

## §2 — Per-wave charters (one paragraph each)

Each links its spec and names its decisive move, its source lanes, and its headline gate. The full
falsifiable §Hard gate with born-RED witness, P6 postures, no-workaround prohibitions, cross-wave
boundaries, and fold rows lives IN each spec (the J.W0 precedent structure — `../audit/wave-J.W0.md`).

### K.W0 — the cold-entry truth (P0 · LEADS) → [`K.W0.md`](./K.W0.md)
The product's PRIMARY first-run gesture is broken: the hero rainbow-play navigates `#/` → `#/cube`
and resumes via `scenePlaybackAdapters.ts:76-79` — a `resume()` NO-OP on a never-started group, so
the FSM enters `playing` while every subject stands frozen (the cube only "moves" via the
`.idle-hover` CSS bob at rest). W0 kills the P0 at the ADAPTER seam (resume-made-total:
autoplay-intent + a freshly-bound group ⇒ `group.play()`), **NOT** a demo-side `play()` sprinkle;
de-vacuouses the B1 liveness oracle by engine-write disambiguation (read the engine's own write
channel — the `--ball-p`/aria pair load-bearing, an aria-gated OrbitalDrag-wrapper transform
corroborator, `.idle-hover` excluded — NOT a bare single-element count); fixes the hero→scene handoff; sets the
U-K1 dock default detent; cures the U-K4 amiga float+flash; and clears per-scene cold-mount
defects. **Headline gate:** `proof:cold-entry` (born-RED on the live P0 TODAY — the lead oracle the
whole later battery consumes). **Source lanes:** `live-cold-play-path.md`, `live-session-gap-analysis.md`,
`demo-scenes-k.md`, `live-amiga-breakage.md`.

### K.W1 — the consume edge → [`K.W1.md`](./K.W1.md)
glass-ui is two minors behind: the pin is `~3.11.2` (tilde — blocks 3.12/3.13) vs published
**3.13.0** (the re-cut sliders + the dock taxonomy the design waves want). W1 widens the pin to
`~3.13.0`, re-examines the W7b parity-clause exits (4 of 7 edges) against the 3.13.0 surface,
verifies the landed handoff-ledger rows, and dispositions the press-scale/RF-16/RF-17 hazards;
it also folds the release.yml `timeout-minutes` (F-1, `ci-cd-k.md §F-1`). The bump is SAFE on the
current consume surface (grep confirms kf consumes none of the removed primitives). **Headline
gate:** the re-pin witness — `proof:all` green on `~3.13.0`, the `proof:deps-current` floor advanced
`3.11.2 → 3.13.0`, each hand-rolled twin DELETED in the same motion it consumes the published
primitive (net-deletion). **Source lanes:** `live-glassui-currency.md`, `glassui-handoff-k.md`,
`ci-cd-k.md §F-1`.

### K.W2 — the typographic root (∥ W3) → [`K.W2.md`](./K.W2.md)
There is NO single font-voice authority: `--font-serif` AND `--font-display` are TWO redundant
tokens for the one Instrument-Serif display face, consumed at different sites with no rule for which
is "the display voice", and the dock falls through `.dock-label → var(--font-text)` to native sans
(U-K6/K8/K10). W2 collapses the display voice to ONE token authority (`--font-serif: var(--font-display)`)
and binds the dock band to it at the ROOT (one `@layer .dock-label` rule), **NOT** per-component font
classes; it decides the transport/tab register against that one token (Play=serif vs Reverse=sans
today), closes the `.font-display` utility trap, and repairs the false `style.css:41-44` comment.
**Headline gate:** the POSITIVE font-voice assert — `.dock-label`/chrome RESOLVES the display voice
(not merely the Jakarta negative), one token authority. **Source lanes:** `styling-typography-k.md`,
`live-typography-truth.md`.

### K.W3 — the layout transposition (∥ W2) → [`K.W3.md`](./K.W3.md)
The macro `.controls-layout` grid is sound, but the anchoring/offset tier is not: the docks anchor
on `slack × bias` so at 5120×2880 the top dock floats ~700px down and the whole UI maroons as a tiny
island in dead space, and the rail is a fixed `400px` invariant across a 4× viewport-area span (U-K7).
W3 transposes the layout to a derived grid system — NO hardcoded dock offsets (anchor tokens
derived/capped, not retuned magic numbers), a `clamp()`/`minmax()` rail, and pathological-screen
CLUSTERING (width AND height ceilings past which docks + controls cluster to the content, clamp()/
container-query driven), refining desktop AND mobile — at the GRID/anchoring system, **NOT** retuned
offsets. **Headline gate:** the cluster + no-hardcoded-offset assert (pathological widths/heights
3440×1440, 5120×2880, 390px CLUSTER into a bounded container; no hardcoded dock offset survives the
census). **Source lanes:** `layout-grid-k.md`, `live-session-gap-analysis.md §2`.

### K.W4 — the pane verdicts, round 2 → [`K.W4.md`](./K.W4.md)
The panes the user indicted carry rooted defects on the current glass-ui. W4 re-cuts them
consuming the new voice (W2) + grid (W3): U-K11 a PROPER spring keyframes-editor variant (the cube
grammar) with the STEPPING slider cured at its ROOT (the few-Hz readout mirror must not drive the
slider) and the final-state register = the main-controls red with the dashed outline (U-K17);
U-K12 tabs → pills or dock-dropdown items; U-K13/K18 the noisy readout panes re-cut for hierarchy
with LESS information; U-K16 single-option selects NEVER render (the count IS the gate) + the vizs
gain REAL options; U-K17 the left-clipped pane un-clipped + draggable; U-K20 the FourierField
REMOVED from the hero + the grid lines less opaque. **Headline gate:** the single-option +
continuous-slider + red-dashed asserts. **Source lanes:** `live-dock-tabs-selects.md`,
`design-synthesis-k.md`, `live-fourier-grid.md`.

### K.W5 — the gate-truth wave (legs partition across the DAG) → [`K.W5.md`](./K.W5.md)
The axis-coverage map (`live-session-gap-analysis.md §2`) executed as a roster of legs riding their
owning waves: `proof:cold-entry` (W0's own hard gate); B1 de-vacuoused by engine-write
disambiguation; `proof:subject-animates` extended from the synthetic `<div>` over `dist/keyframes.js`
to the REAL scenes' matrix3d/`--ball-p` transform path; the single-option-select gate made total
(`>0 → >1`); the TASTE-boundary review-packet protocol INSTRUMENTED (the packet generator rides the
W3-lib capture harness); release.yml F-1 `timeout-minutes`; the demo-smoke wall-clock hazard
dispositioned (the live 35m ceiling re-measured against the post-J.W4 roster — `ci-cd-k.md §F-2`).
**Headline gate:** the axis-coverage map executed — each leg born-RED on the
defect it certifies. **Source lanes:** `live-session-gap-analysis.md`, `gate-estate-k.md`, `ci-cd-k.md`.

### K.W6 — the P-invariant-28 terminations (parallel) → [`K.W6.md`](./K.W6.md)
The DL-K deferred/chronic ledger's exit-only rows discharged: the ≥4-tranche riders exit
probe-or-KILL (never a bare BOOK); the mobile-lighthouse floor re-asserted on a calibrated quiet
host; the W2-noted pre-existing drag-seam gaps (TimelineTrack/useSheetGesture/useSphereSpin)
dispositioned; the dev-mode parity chronicle (the stale-vite-cache class) dispositioned; the
N2-resolved DL rows (DL-K18 LRU bound, DL-K17 diagnostics PRODUCER) exit by published-consume-edge.
**Headline gate:** the termination artifacts — each rider exits via a born-RED gate, a measurement, a
published consume-edge, or a reasoned KILL. **Source lane:** `deferred-ledger-k.md`.

---

**Band II — THE ROUND-TRIP FRONTIER (K.W7–K.W12; the frontier folded WHOLESALE into K — the
consumed body of record is `../L-SEED.md`, the §body→K.W7–K.W12 map is `../L-SEED.md §body-item
map`).** Band II rides the honest substrate Band I leaves behind; its waves carry NET-NEW oracles for
features that do not exist (born-RED in the FRONTIER sense — the gate reds because the capability is
ABSENT today), proven by the replay-equality invariant or an honest refusal.

### K.W7 — the fidelity floor (LEADS Band II) → [`K.W7.md`](./K.W7.md)
The engine DROPS a declared CSS operator: `adapter.ts:24-29,120-126` captures the author-declared
`animation-composition` (add/accumulate); `engine.ts` reads it NEVER (grep=0). W7 makes the engine
HONOR it on rAF (the additive accumulate path) + WAAPI (composite), and authors the diagnostics
channel on `ResolvedKeyframes` (consuming the 0.12.0 `ParseDiagnostic`/`OnParseError` producer, N2
row 10). Engine-internal, value.js-INDEPENDENT; the round-trip made HONEST before it is widened — the
fidelity floor W10's compiler then inverts. **Headline gate:** `proof:composition-honored` (born-RED
in the FRONTIER sense — the engine has zero reads of the captured value today). **Source lanes:**
`../L-SEED.md §2 WL2-B`, `waapi-level-2.md`.

### K.W8 — the ingest (∥ W9) → [`K.W8.md`](./K.W8.md)
W8 walks the live CSSOM: `fromStyleSheets()`/`fromLiveAnimations()` adopt every `@keyframes` +
`animation-*` declaration into kf objects (`CSSKeyframesRule.cssText` → `resolveKeyframes`, the path
that already eats exactly that); K2 `adoptRunning()` extends the round-trip into the TEMPORAL
dimension (seamless mid-flight takeover of a running CSS animation via `getAnimations()` currentTime
handoff — NAMED `adoptRunning` to disambiguate from the SHIPPED `engine.ts:324 adoptCompiled`,
HARDENING-5 HAZARD-1).
FOLLOWS W7 (consumes its diagnostics channel for the robustness surface). **Headline gate:**
`proof:ingest-replay-equal` (the ingested CSS replays PIXEL-EQUAL to its source animation; born-RED
in the FRONTIER sense — no CSSOM-walk surface exists; the VJ-9 totality tripwire recorded). **Source
lanes:** `../L-SEED.md §1 #2`, `live-stylesheet-ingestion.md`.

### K.W9 — the scroll-as-CSS (∥ W8, value.js-gated) → [`K.W9.md`](./K.W9.md)
The field's #1 named gap, closed the only-kf way: W9 parses + round-trips the scroll grammar
(`animation-timeline: scroll()/view()`, `animation-range`, `timeline-scope`, the `animation-trigger`
layer) and DISPATCHES — native compositor ScrollTimeline where eligible, the kf `ScrollScene` JS
driver (SO-2) where the platform falls short (Firefox/pin/snap); the pin is `position:sticky`
SYNTHESIS (SO-3; transform-pinning SO-4 KILLED). **value.js-GATED:** the scroll grammar is VJ.W1,
DISPATCHED to value.js's post-N tranche via `../KF-TO-VALUEJS-GRAMMAR-ASKS.md` (confirmed ABSENT in
0.12.0). The acyclic-spine: the source half lands born-RED, the consume edge lights on value.js's
PUBLISH — NEVER a `file:` link. **Headline gate:** `proof:scroll-roundtrip` (born-RED in the FRONTIER
sense + value.js-gated). **Source lanes:** `../L-SEED.md §1 #3`, `scroll-orchestration.md`.

### K.W10 — the compile (the XL anchor) → [`K.W10.md`](./K.W10.md)
The round-trip's backward direction: W10 compiles `AnimationGroup`/`Sequence`/`stagger` → a
ZERO-RUNTIME pure-CSS artifact (@keyframes + animation-* longhands + linear() springs +
animation-composition layering — INVERTING W7's honoring), with CC-3 the honest ineligibility report
(the four refusals: weighted blend / custom renderers / perceptual oklab / computed-unit drift —
`waapiIneligibleReason` generalized to the CSS domain) and CC-4 the "Export CSS" editor button (the
CSS-animation IDE). FOLLOWS W7 (inverts the honoring) + W8 (composes the ingest→recompile loop); it is
the parser run BACKWARD over the same data model, NOT a re-derived lossy emitter (the moat is the
faithfulness). CC-1 core proceeds on RIPE `reverseAnimationShorthand`; CC-2 oklab densify born-RED-gates
on VJ.W2. **Headline gate:** `proof:compile-replay-equal` (the compiled CSS replays PIXEL-EQUAL
side-by-side to the JS playback, or CC-3 REFUSES). **Source lanes:** `../L-SEED.md §1 #1`,
`css-compiler.md`.

### K.W11 — the physics (∥ W10) → [`K.W11.md`](./K.W11.md)
The axis-3 headline, only POSSIBLE on kf's substrate: W11 drives a physical layer crossfade on the
weighted-blend compositor (a spring drives the blend weight between animation layers — no competitor
has a weighted-blend tier to drive). Riders: PHYS-B2 `reseatToSpring` (velocity-continuous
interruption of a parsed-CSS animation) + PHYS-E intensity-scaled reduced-motion (the ONE PRM gate
takes a scale, WCAG 2.3.3-aligned) + the optional `VectorSpring` S companion (sugar over N
`SpringProgress`, droppable). Engine-internal (`group.ts`/`spring.ts`/`reduced-motion.ts`),
**FILE-DISJOINT from the W10 compiler** (§4B below; and disjoint from W7's blend-MODE leaf — W11 is
the per-layer blend-WEIGHT tier), riding the K.W0/K.W1 playback seam Band I rebuilds. **Headline
gates:** `proof:spring-blend-weight` (the flagship) + `proof:reseat-velocity-continuous` +
`proof:scaled-prm` (all born-RED in the FRONTIER sense — no spring-driven blend weight today).
**Source lanes:** `../L-SEED.md §2 PHYS-C`, `physics-frontier.md`.

### K.W12 — the externalize (CLOSES Band II) → [`K.W12.md`](./K.W12.md)
W12 closes the frontier band: ED-1 llms.txt + the proof corpus as a public artifact + a
`proof:agent-surface` gate (only a proof-gated library HAS a proof corpus to expose); ED-2
`@mkbabb/keyframes-vue` (a thin NEW adapter); ED-3 the dogfood inversion (the demo consumes the
PUBLISHED barrel — the boundary-ORACLE at the package boundary, honest ONLY on Band I's repaired demo
+ all prior surfaces published); ED-4 the public color-FIDELITY conformance harness (`deltaEOK`,
RIPE). **Headline gates:** `proof:agent-surface` + `proof:demo-on-published-surface` (the
dogfood-inversion gate — the demo imports `@mkbabb/keyframes.js`, the published barrel, NOT `@src`).
**Source lanes:** `../L-SEED.md §2 ED-1`, `ecosystem-distribution.md`.

### K.WZ — the close → [`K.WZ.md`](./K.WZ.md)
FINAL.md held to inv ε; the prompt-recap extended through the close (`prompt-recap-k.md`); the
chronic-closure substrate transition J→K; **the TASTE review packets presented + the user verdict
recorded** (the named user-domain step BEFORE the version cut — the design band closes ONLY here); the
frontier band closed on the replay-equality invariant (W8/W10 replay pixel-equal, or an honest refusal
per CC-3); the version cut (≥patch for the P0; the design + frontier bands may justify minor — version
owner Mike Babb, confirm-first); publish + the close-merge auto-deploy round-trip RE-observed (the J.W0
oracle re-witnessed); `L-SEED.md` committed (the consumed body of record). **Headline gate:** the close
round-trip RE-observed + the TASTE verdict recorded + the frontier replay-equality oracles green.
**Source lanes:** `prompt-recap-k.md`, `precepts-k.md`, `packaging-k.md`.

---

## §3 — The gate roster K ADDS (the K oracle family)

K closes the two unnamed J-blind axes (the COLD axis, the engine-write disambiguation) and proxies
the named taste decisions as binary correctness asserts. Each new/changed gate carries a born-RED
witness plan IN its owning wave spec. Source: `gate-estate-k.md §9`, `live-session-gap-analysis.md
§2`, `PATH-FORWARD.md §6`. (The J estate is 119 `proof:*` scripts / 15 correctness-tier /
100 hygiene-tier at the J close — `gate-estate-k.md §1`; K ADDS to it, it does not re-author it.)

| Gate | Status | Owning wave | The assert | Born-RED witness (today's tree) |
|---|---|---|---|---|
| **`proof:cold-entry`** | NEW | K.W0 | Fresh context (`localStorage.clear()`), NO seed, `goto #/`, click the hero rainbow play as the FIRST gesture; assert the LOAD-BEARING engine-attributable pair — dock play aria flips Play→Pause AND `--ball-p`/slider advances from 0 — PLUS the aria-GATED corroborator: the **engine-write subject** (the OrbitalDrag wrapper for cube/amiga) traverses ≥3 distinct transforms WHILE aria="Pause", `.idle-hover` excluded. (Element-isolation excludes the idle bob; the aria-gate + `--ball-p` carry correctness — a bare single-element count is unfit BOTH ways: `.cube`=0/1 distinct even WARM, `.graph`=13 engine-OFF on the broken cold path — `K.W0.md §Provenance` reconciles `live-session-gap-analysis.md §2` with `gate-estate-k.md §3/§4`.) | `k-verify-gate-blindspot.mjs` greens B1=101 while the play button reads "Play animation" — the gate exists to red on exactly that. **No-workaround:** NOT a longer settle, NOT a raised distinct-count, NOT a bare single-element count. |
| **B1 (`proof:live-session` leg)** | DE-VACUOUSED | K.W0 / K.W5 | Drop `.idle-hover` from the distinct-count sample; GATE the OrbitalDrag-wrapper count on a `play-aria-flips Play→Pause` precondition (the wrapper carries engine-OFF orbital churn — 13 distinct on the broken cold path — so the aria-gate, not a bare element swap, is the disambiguation); make the `--ball-p`/slider advance the load-bearing read | B1 greens at REST on the `.idle-hover` bob with the engine off (`live-session-gap-analysis.md §1`). |
| **`proof:subject-animates`** | EXTENDED | K.W5 | Extend ARM C from the synthetic `<div> left:0→200px` over `dist/keyframes.js` to the REAL scenes' `matrix3d`/`--ball-p` transform path (assert `.graph` matrix advances while aria = "Pause") | The synthetic gate never exercises the demo's matrix/CSS-var path (`live-session-gap-analysis.md §F4`, `gate-estate-k.md §4`). |
| **`proof:demo-fonts` clause (d)** | NEW CLAUSE | K.W2 | The POSITIVE: `getComputedStyle(".dock-label").fontFamily.includes("Instrument Serif")` — not only the Plus-Jakarta negative | The dock renders native sans today and passes the negative-only gate (`gate-estate-k.md §6`). |
| **the single-option-select gate** | NEW | K.W4 / K.W5 | No single-option `<Select>` renders ANYWHERE (the count IS the gate, `>0 → >1` made total across all scenes) | The ChromeDock controls-tab `<Select>` renders a 1-item dropdown on the single-surface scenes (easing/spring) — the sole sweep violation (`live-dock-tabs-selects.md §2.1/§3 S1`, `ChromeDock.vue:199-221`), U-K16. |
| **the continuous-slider assert** | NEW | K.W4 | The spring slider value is CONTINUOUS, not stepped by the few-Hz readout mirror | The few-Hz readout mirror steps the slider (`design-synthesis-k.md §3`, U-K11). |
| **the red-dashed motion assert** | NEW | K.W4 | The "settled" motion register is the red-dashed everywhere (ONE motion-color authority) | The green-progress palette still drives sliders/rings (`design-synthesis-k.md §1.3`, U-K17). |
| **the cluster + no-hardcoded-offset assert** | NEW | K.W3 | Pathological widths/heights (3440×1440, 5120×2880, 390px) CLUSTER into a bounded container; no hardcoded dock offset survives the census | At 5120×2880 the docks float ~700/1130px in and nothing clusters (`layout-grid-k.md §2`). |
| **`proof:deps-current`** | FLOOR ADVANCED | K.W1 | The installed glass-ui floor advances `3.11.2 → 3.13.0` (the tilde widened) | `3.11.2 < 3.13.0`; the floor greens vacuously on the stale pin (`gate-estate-k.md §7`). |
| **`proof:visual-lock`** | RE-BASELINED | K.W4 / K.W5 | Re-capture the golden baseline AFTER the layout/pane refinement lands — never before | The W7c baseline IS the disliked state; "green" means "unchanged from W7c", not "good" (`gate-estate-k.md §5`). |
| **the TASTE review-packet generator** | NEW (instrument) | K.W5 (rides W3 lib) | Per-pane before/after screenshots, desktop+mobile, the named deltas — the artifact the WZ user-verdict step consumes | n/a — instrumentation, not a binary oracle (the taste band is HUMAN, `gate-estate-k.md §8`). |
| **`proof:composition-honored`** | NEW (Band II) | K.W7 | `engine.ts` READS the captured `animation-composition` (add/accumulate) on rAF + WAAPI — the engine honors the operator it currently drops | `engine.ts` has zero reads of the `adapter.ts:120-126` captured value (grep=0) — born-RED in the FRONTIER sense (`../L-SEED.md §2 WL2-B`). |
| **`proof:diagnostics-channel`** | NEW (Band II) | K.W7 | `ResolvedKeyframes` carries a `diagnostics` field consuming the 0.12.0 `ParseDiagnostic`/`OnParseError` producer (N2 row 10) | `adapter.ts:18` `ResolvedKeyframes` has no `diagnostics` field (`../L-SEED.md §7`). |
| **`proof:ingest-replay-equal`** | NEW (Band II) | K.W8 | The ingested CSS (`fromStyleSheets()`/`fromLiveAnimations()`) replays PIXEL-EQUAL to its source animation | No CSSOM-walk surface exists — born-RED in the FRONTIER sense (`../L-SEED.md §1 #2`). |
| **`proof:scroll-roundtrip`** | NEW (Band II, value.js-gated) | K.W9 | `animation-timeline`/`-range`/`-trigger` parse + round-trip + dispatch; native ScrollTimeline / kf `ScrollScene` | `CSSTimelineOptions`/`parseAnimationTimeline` ABSENT in 0.12.0 — born-RED + value.js VJ.W1-gated; consume edge lights on PUBLISH (`VALUEJS-N2-ASKS.md:61`). |
| **`proof:compile-replay-equal`** | NEW (Band II) | K.W10 | The compiled zero-runtime CSS replays PIXEL-EQUAL side-by-side to the JS playback, or CC-3 REFUSES (the four refusals) | No compiler exists; the moat is the faithfulness — born-RED in the FRONTIER sense (`../L-SEED.md §1 #1`). |
| **`proof:spring-blend-weight`** (+ riders `proof:reseat-velocity-continuous`, `proof:scaled-prm`) | NEW (Band II) | K.W11 | A spring drives the weighted-blend layer crossfade (the flagship); PHYS-B2 `reseatToSpring` is velocity-continuous; PHYS-E's PRM gate takes a SCALE (engine-internal, `group.ts`/`spring.ts`/`reduced-motion.ts`) | No spring-driven blend weight today (`weight` is a STATIC number, `constants.ts:202`; grep for `weightSpring`/`transitionLayer`/`crossfade` in `src/` = 0) — born-RED in the FRONTIER sense (`../L-SEED.md §2 PHYS-C`). |
| **`proof:agent-surface`** | NEW (Band II) | K.W12 | The published proof corpus + llms.txt/llms-full.txt exposed as a public artifact (the index can never drift from the published surface) | No agent surface exists (`ls llms.txt` → No such file) — born-RED in the FRONTIER sense (`../L-SEED.md §2 ED-1`). |
| **`proof:demo-on-published-surface`** | NEW (Band II) | K.W12 | ED-3 the dogfood inversion — the demo imports `@mkbabb/keyframes.js` (the published barrel), NOT `@src`; the boundary-ORACLE at the PACKAGE boundary | The demo reaches the engine via deep `@src/animation/*` paths (`grep "@mkbabb/keyframes" demo/`=0); honest ONLY on Band I's repaired demo (`../L-SEED.md §2 ED-3`). |

**The Band-II gate band (`K.md §invariant set` — the replay-equality invariant):** the frontier
gates are NET-NEW oracles for features that do not exist; they are born-RED in the FRONTIER sense
(the gate reds because the capability is ABSENT today, NOT because a regression was planted). Each is
proven GREEN by REPLAY-PIXEL-EQUALITY (W8 ingest, W10 compile) or an HONEST refusal (CC-3's four
refusals — REFUSED with a named reason, never silently approximated). The value.js-gated gates
(W9 VJ.W1, W10's CC-2 VJ.W2) light their consume edge ONLY on value.js's PUBLISH (the acyclic-spine
invariant — born-RED-gated kf-side, NEVER a `file:` link or a vendored copy).

**The honest band assignment (`gate-estate-k.md §8`):** gates carry CORRECTNESS (binary product
properties: the engine writes, the font resolves, the slider advances, no single-option select
renders). They do NOT carry the design VERDICT — that is the TASTE boundary (§5). A gate can proxy
a taste DECISION as a binary assert (e.g. "the dock carries ONE display voice") only AFTER a human
makes the decision; the decision itself is never the gate's.

---

## §4 — The BINDING file-ownership boundaries (the parallel-wave disjoint-loci contracts)

Two pairs of waves run in PARALLEL on file-ADJACENT loci, so each ownership boundary is a HARD
CONTRACT, not a guideline: **§4A — the Band-I W2 voice-tokens / W3 grid-tier seam** (both in
`demo/@/styles`), and **§4B — the Band-II engine/compiler/physics/new-surface seam** (W7 engine.ts
honoring ∥ W11 group.ts physics ∥ W10 the compiler ∥ W8·W9 new surfaces). Each spec restates its half
in its §Hand-off.

### §4A — Band I: W2 voice tokens vs W3 grid tier (EXACT)

W2 and W3 are file-ADJACENT (both live in `demo/@/styles`) and run in PARALLEL. The charter declares
them SEPARABLE: **"W2 owns the voice tokens, W3 owns the grid/anchoring tier; the spec boundary is
BINDING"** (`K.md §WAVE MAP`, `PATH-FORWARD.md §5`). The table below is the disjoint-loci contract
each spec restates in its §Hand-off; if the IMPL finds a line ambiguous, it is W2's iff it is a
FONT-FAMILY/voice decision and W3's iff it is a TRACK/ANCHOR/OFFSET/cluster decision.

| Concern | OWNER | Locus (file:line) | Root |
|---|---|---|---|
| The display voice token collapse (`--font-serif: var(--font-display)`) | **K.W2** | `demo/@/styles/style.css:40` vs `:53` | `styling-typography-k.md §3` |
| The dock-band display-voice binding (`@layer .dock-label { font-family: var(--font-display) }`) | **K.W2** | `demo/@/styles/style.css` (one `@layer` rule); root: glass-ui `typography.css:283` | `styling-typography-k.md §2` |
| The transport/tab voice register (Play=serif vs Reverse=sans decision, the serif-tabs call) | **K.W2** | `playback-button.css:22`, `tab-trigger.css:28` | `styling-typography-k.md §3` |
| The `.font-display` utility trap (`--font-stack-display: var(--font-display)`) | **K.W2** | `demo/@/styles/style.css` `:root` reclaim (one line) | `styling-typography-k.md §5` |
| The false `style.css:41-44` font comment repair | **K.W2** | `demo/@/styles/style.css:41-44` | `styling-typography-k.md §4` |
| The fixed `400px` rail → `clamp()`/`minmax()` track | **K.W3** | `design-idioms.css:116` (`--rail-width`); track at `AnimationControlsGroup.vue:441` | `layout-grid-k.md §1 C1` |
| The dock-anchor offset chain (cap `slack × bias`; derived, not retuned) | **K.W3** | `style.css:139-141, 224, 241` (the slack→offset→anchor chain) | `layout-grid-k.md §1, §2` |
| The work-area ceilings + cluster-past-a-max rule | **K.W3** | `style.css:121-122` (ceilings) + `AnimationControlsGroup.vue:309-314` | `layout-grid-k.md §4` |
| The macro grid `@media → @container` transposition | **K.W3** | `AnimationControlsGroup.vue:348, 432` | `layout-grid-k.md §3` |
| The hero `lg:mt-24` magic margin → work-area chain | **K.W3** | `EditorStartScreen.vue:11` | `layout-grid-k.md §1 C5` |
| The `--target-viewport-w/h: 30vw/30vh` → `cqi`/`cqb` | **K.W3** | `design-idioms.css` (`--target-viewport-w/h`) | `layout-grid-k.md §1 C6` |
| The grid-line opacity tune (U-K20 — a VISUAL value, not a voice or anchor) | **K.W4** | `design-idioms.css:182-183` (`--graph-opacity`, `--graph-major-opacity`) | `styling-typography-k.md §7` (caveat: re-check the substrate-legibility gate clause-g) |

**The seam edge cases (BINDING — restated from the source lanes):**

- `demo/@/styles/style.css` is touched by BOTH W2 (the font `@theme` + `:root` voice tokens, lines
  ~40-117) and W3 (the work-area ceilings + dock-anchor chain, lines ~121-241). They edit DISJOINT
  line ranges of the same file — the IMPL phase must land them as separable commits and each spec's
  §Hard gate must red only on ITS half.
- `--dock-margin` is a **glass-ui token** (`tokens.css:1304`), NOT demo-owned. Any change to the
  dock GAP itself is a glass-ui-repo edge (a born-RED handoff per MEMORY `feedback_glass_ui_root_changes`),
  NOT a demo patch — out of both W2 and W3 (`layout-grid-k.md §1 C4`, `glassui-handoff-k.md`).
- The grid-line opacity (U-K20) is a VISUAL tune, owned by **K.W4** (the pane/visual-refine wave),
  not W2 or W3 — it touches `design-idioms.css` but is neither a voice token nor an anchor.
- The FourierField removal (U-K20's other half) is **K.W4** via `live-fourier-grid.md`, not W3.

### §4B — Band II: the engine / compiler / physics / new-surface seam (EXACT)

The Band-II frontier waves touch `src/animation`. Three run in parallel against ADJACENT engine
loci — **W7 (fidelity floor) ∥ W11 (physics)** and **W10 (compiler) ∥ W11** — so the ownership
boundary is a HARD CONTRACT. The charter declares them disjoint: **W11 physics is "engine-internal
(`group.ts`) … file-disjoint from the compiler"** (`K.md §WAVE MAP`); **W7 honoring reads
`engine.ts`** (the interp/composite path) while **W10's compiler is the parser run BACKWARD over the
data model** (the `format.ts` serialize lineage extended into a compile module). The discriminator: a
line is W7's iff it is an engine READ of `animation-composition` (the honoring), W10's iff it is a
compile/EMIT of CSS (the round-trip backward), W11's iff it is a `group.ts` blend-weight/spring
decision, and W8's/W9's iff it is a NEW ingest/scroll surface.

| Concern | OWNER | Locus (file) | Root |
|---|---|---|---|
| The `animation-composition` HONORING — the engine READS the captured operator (rAF additive accumulate + WAAPI composite) | **K.W7** | `engine.ts` (the interp/composite path); reads `adapter.ts:120-126` captured value | `../L-SEED.md §2 WL2-B`, `waapi-level-2.md` |
| The diagnostics channel on `ResolvedKeyframes` (consume the 0.12.0 `ParseDiagnostic` producer) | **K.W7** | `adapter.ts:18` (`ResolvedKeyframes` gains a `diagnostics` field) | `../L-SEED.md §7`, `VALUEJS-N2-ASKS.md` N2 row 10 |
| `fromStyleSheets()`/`fromLiveAnimations()` (the CSSOM walk) + K2 `adoptRunning()` (named to avoid the `adoptCompiled` collision — HAZARD-1) | **K.W8** | a NEW ingest module + `index.ts`/`adapter.ts` export edges (feeds `resolveKeyframes`) | `../L-SEED.md §1 #2`, `live-stylesheet-ingestion.md` |
| The scroll grammar parse + round-trip + dispatch; the `ScrollScene` JS driver; sticky-pin synthesis | **K.W9** | a NEW scroll module + `timeline.ts` (`ScrollTimeline`) edges; the value.js VJ.W1 consume edge | `../L-SEED.md §1 #3`, `scroll-orchestration.md` |
| The CSS COMPILER — compile `AnimationGroup`/`Sequence`/`stagger` → zero-runtime CSS (the parser run BACKWARD) + CC-3 refusals + CC-4 Export button | **K.W10** | a NEW compile module over the `format.ts` serialize lineage (NOT in `engine.ts` — disjoint from W7's read path) | `../L-SEED.md §1 #1`, `css-compiler.md` |
| PHYS-C spring-driven blend weight on the weighted-blend compositor + PHYS-B2/PHYS-E | **K.W11** | `group.ts` (the weighted-blend tier) — **file-disjoint from the W10 compiler** | `../L-SEED.md §2 PHYS-C`, `physics-frontier.md` |
| ED-1 agent surface (llms.txt + proof corpus) + ED-2 `@mkbabb/keyframes-vue` + ED-3 dogfood + ED-4 `deltaEOK` harness | **K.W12** | NEW public artifacts + a NEW sibling package (`keyframes-vue`) + the demo's barrel-import edge (ED-3) | `../L-SEED.md §2 ED-1`, `ecosystem-distribution.md` |

**The Band-II seam edge cases (BINDING):**

- **`engine.ts` is W7's (the honoring read), NOT W10's.** W10's compiler is a NEW module over the
  `format.ts` serialize lineage — it does NOT edit `engine.ts`'s interp path. W7 lands FIRST (it
  LEADS Band II); W10 then INVERTS the honoring by EMITTING the `animation-composition` layering — a
  read-then-emit dependency, not a co-edit of the same file.
- **`group.ts` is W11's alone.** The physics blend-weight tier is file-disjoint from the W10
  compiler (`K.md §WAVE MAP`) — W11 and W10 run in parallel WITHOUT touching each other's files.
- **`adapter.ts` is touched by BOTH W7 (the `diagnostics` field) and W8 (the ingest feed into
  `resolveKeyframes`).** They edit DISJOINT concerns of the same file — the `ResolvedKeyframes` type
  (W7) vs the new `fromStyleSheets()` producer that calls `resolveKeyframes` (W8). W8 FOLLOWS W7, so
  these land in sequence, not in parallel — the seam is temporal, not just spatial.
- **The value.js consume edges (W9 VJ.W1, W10's CC-2 VJ.W2) are PUBLISHED consumes, born-RED-gated
  kf-side, NEVER a `file:` link or a vendored copy** (the acyclic-spine invariant, `K.md §invariant
  set`). The grammar lands in value.js's tree (its own repo/authorization); kf consumes it one tranche
  behind on the publish.

---

## §5 — The TASTE-packet protocol (summary)

The third K-born invariant (`K.md §invariant set` — "the TASTE boundary"; the J taste-tension
resolved). **Gates carry CORRECTNESS; they do NOT carry the design VERDICT.** The J.W7c verify
rounds asked agents for a "designer-eye" verdict and got PASS; the user's same-day verdict on the
same panes was "still sucks" / "awful" (`live-spring-sequence-mp-verdict.md`, `wave-J.W7bc.md`).
Gate-green and agent-taste do NOT bound design-good; the boundary needs a NAME and a protocol, not
a stronger adjective in a prompt (`gate-estate-k.md §8` — "no gate can carry taste; the band is
honestly human").

**The protocol, in five clauses:**

1. **The packet.** For EVERY appearance wave, the close motion PRODUCES a review packet:
   per-pane **before/after** screenshots, **desktop + mobile**, and the **named deltas** (which
   design decision each before/after pair exercises).
2. **The generator.** The packet generator is INSTRUMENTED in K.W5 and RIDES the W3-lib capture
   harness (the same `scripts/lib/demo-driver.mjs withPage` substrate the audit lanes used). The
   packets GENERATE at W4's close (when the redesigns have landed).
3. **The verdict is the USER's.** The wave's design band closes ONLY on the user's verdict on that
   packet — a named USER-DOMAIN step. An agent's "designer-eye PASS" is **corroboration, never the
   verdict** (the exact J.W7c failure mode the boundary names).
4. **Scheduled BEFORE the close.** The user-verdict step is scheduled BEFORE the tranche close —
   specifically before the version cut in K.WZ (`K.md §WZ` row) — never after. The design band
   cannot be claimed green by the close until the packet is signed.
5. **Version owner.** Mike Babb (`mike@babb.dev`), confirm-first; the TASTE review packets ARE the
   user's named verdict step (`K.md §chronic+deferred fold`).

**The TASTE anchors the user actually loves** (the packet's deltas amplify these, not replace them
— `design-synthesis-k.md §0`): the rainbow play CTA, the icon-family pops, the serif display
voice, the math graph-paper substrate, and the **red-dashed final-state** motion register (U-K17 —
the main-controls red the user prefers over the disliked green). The packet shows each pane moving
TOWARD those anchors.

---

## §6 — Wave file index

| File | Wave | Class | One-line |
|---|---|---|---|
| [`K.W0.md`](./K.W0.md) | K.W0 | P0 · LEADS | The cold front door plays (the adapter resume made total) + the de-vacuoused B1 |
| [`K.W1.md`](./K.W1.md) | K.W1 | consume edge | glass-ui `~3.11.2 → 3.13.0` (precedes the design waves) + release.yml F-1 |
| [`K.W2.md`](./K.W2.md) | K.W2 (∥ W3) | typographic root | ONE display-voice token authority; the dock joins it at the ROOT |
| [`K.W3.md`](./K.W3.md) | K.W3 (∥ W2) | layout transposition | Derived dock anchoring + pathological-screen clustering (no hardcoded offsets) |
| [`K.W4.md`](./K.W4.md) | K.W4 | pane verdicts r2 | Spring editor + continuous slider + red-dashed + single-option totality + FourierField removal |
| [`K.W5.md`](./K.W5.md) | K.W5 (legs) | gate-truth | `proof:cold-entry`, B1 de-vacuoused, subject-animates on real scenes, the TASTE generator |
| [`K.W6.md`](./K.W6.md) | K.W6 (∥) | terminations | DL-K exit-only rows discharged (probe-or-KILL, no bare BOOK) |
| [`K.W7.md`](./K.W7.md) | K.W7 (Band II · LEADS) | fidelity floor | The engine HONORS `animation-composition` (it currently drops it) + the diagnostics channel |
| [`K.W8.md`](./K.W8.md) | K.W8 (∥ W9) | ingest | `fromStyleSheets()`/`fromLiveAnimations()` (the CSSOM walk) + `adoptRunning()` — replay-equal |
| [`K.W9.md`](./K.W9.md) | K.W9 (∥ W8) | scroll-as-CSS | Parse + round-trip + dispatch the scroll grammar (value.js VJ.W1-gated) |
| [`K.W10.md`](./K.W10.md) | K.W10 (XL anchor) | compile | `AnimationGroup`/`Sequence`/`stagger` → zero-runtime CSS (the parser run BACKWARD) |
| [`K.W11.md`](./K.W11.md) | K.W11 (∥ W10) | physics | Spring-driven blend weight on the weighted-blend compositor (`group.ts`, file-disjoint) |
| [`K.W12.md`](./K.W12.md) | K.W12 (Band II · CLOSES) | externalize | Agent surface + the dogfood inversion (the demo consumes the PUBLISHED barrel) |
| [`K.WZ.md`](./K.WZ.md) | K.WZ | CLOSE | TASTE verdict recorded + frontier replay-equality green + version cut + round-trip RE-observed |

---

*Cross-references: the binding charter `../K.md` (two bands); the executive summary
`../PATH-FORWARD.md`; the board + the K open-deferrals ledger `../PROGRESS.md`; the frontier body of
record (consumed into Band II) `../L-SEED.md`; the outbound value.js grammar ask
`../KF-TO-VALUEJS-GRAMMAR-ASKS.md`; the inbound `../VALUEJS-N2-ASKS.md`; the 33-doc evidence corpus
`../audit/*.md` (the Band-II frontier lanes are `../audit/frontier/*.md`). The spec-structure
precedent is `../audit/wave-J.W0.md` (§Provenance / §State-verified / §Goal / §Scope / §Hard gate /
§No-workaround / §Folds / §Hand-off / §Design-decisions). This README is a MAP; where it and a binding
doc disagree, the binding doc wins.*
