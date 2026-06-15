# Tranche K — keyframes.js: the PRODUCT-TRUTH + DESIGN-TOTALITY + ROUND-TRIP-FRONTIER tranche · two bands in one charter — (I) the product made TRUE from the first gesture and BEAUTIFUL at its roots, then (II) the CSS-@keyframes round-trip made TOTAL on the honest substrate the repair leaves behind · the frontier folded WHOLESALE into K, value.js dispatched to un-block its last two gates · NO residual L

K is keyframes.js' eleventh tranche. J (the tenth) extended the gate-ORACLE precept to every
boundary the product crosses — deploy, publish, docs, axes, design — and discharged each with
an OBSERVED oracle (`docs/tranches/J/FINAL.md`: 4.2.0 published via release.yml's first run;
the auto-deploy round-trip observed twice; the axes battery born-RED witnessed). **Hours after
the close, the user drove the live product and found its PRIMARY FIRST-RUN GESTURE broken:**
the hero rainbow-play does not start the engine — the playhead advances while every subject
stands frozen. The K audit — **32 lanes + a completeness critic, 33 evidence docs under
`audit/`, every claim file:line- or probe-rooted** — finds the J close HONEST at every boundary
it certified and **structurally blind on two axes it never named** (the COLD axis and the TASTE
boundary), atop a design language PARTIAL AT ITS ROOTS. That is **Band I — the repair.**

And the same audit re-confirmed the FRONTIER the J fleet divined (2026-06-10, the round-trip
charter) — deferred at K's first authoring because its scroll/compile waves gated on net-new
value.js grammar that did not yet exist. **In the interval that premise dissolved:** value.js
shipped **0.12.0** (its Tranche N, which superseded the never-dispatched M), un-blocking FOUR of
the six frontier waves outright and leaving only two genuine gates open. On **2026-06-15** the
user folded the frontier WHOLESALE into K and dispatched value.js's post-N tranche to ship the
last two grammar items (VJ.W1 scroll grammar + VJ.W2 perceptual ramp) in parallel. That is
**Band II — the frontier.** **There is no residual L** — `L-SEED.md` is consumed into this
charter (§Band II); the 12 KILLs and the BOOKs carry forward as K's anti-charter.

**The two bands are one tranche under one discipline, and the ORDERING is the discipline:** the
repair leads (the P0 gates first; every repair lands on a born-RED oracle), and the frontier
rides the substrate the repair leaves honest behind it (ED-3's dogfood inversion is honest only
because Band I makes the demo WORK; the compiler inverts a fidelity floor that must first HONOR
what it will emit). A larger tranche is not the J catastrophe — the catastrophe was a CLOSE that
claimed boundaries it had not verified. K's charter names both bands plainly, each wave
born-RED-gated, and the close claims only what landed.

---

## § The two blind axes + the design roots (Band I — verbatim from the audit)

- **The COLD axis.** Every J gate enters scenes by hash-nav and choreographs
  `openControlsPanel → select → play`. NO gate drives the HERO CTA, a cold mount, or a default
  state. The P0 chain (triple-rooted: `audit/live-cold-play-path.md`,
  `audit/live-session-gap-analysis.md`, `audit/demo-scenes-k.md`): the hero rainbow-play
  navigates `#/` → `#/cube` and resumes via **`scenePlaybackAdapters.ts:76-79` — a resume
  NO-OP on a never-started group** — the FSM enters `playing`, the progress UI polls `anim.t`,
  and `interpFrames` never writes a subject. WORSE: the certifying oracle was VACUOUS against
  exactly this — live-session B1 greens on **101 distinct transforms produced by the
  `.idle-hover` CSS bob at REST with the engine OFF** (`live-session-gap-analysis.md §1`).
- **The TASTE boundary.** The J.W7c verify rounds asked agents for a "designer-eye" verdict and
  got PASS; the user's same-day verdict on the same panes: "still sucks", "awful", "looks
  awful". Gate-green and agent-taste do not bound design-good — the boundary needs a NAME and a
  protocol, not a stronger adjective in a prompt.
- **The design roots.** No single font-voice authority (two redundant display tokens; per-site
  stacks let a dock render system-sans beside a serif hero); hardcoded dock-offset anchoring;
  pathological screens stretch rather than cluster; the panes the user indicted carry rooted
  defects (the spring slider STEPS, single-option selects still render, a pane clips left, the
  FourierField squats in the hero).

---

## § The frontier, un-blocked (Band II — what folded, and why now)

The J frontier fleet's one-sentence thesis (`audit/k-seed-reconciliation.md`, `L-SEED.md §0`):

> **Make kf's CSS-@keyframes round-trip TOTAL — the engine READS the live web's CSS, DRIVES it
> with physics and perceptual color the platform lacks, and EMITS it back as zero-runtime CSS —
> closing the scroll-orchestration gap in the only shape no imperative library can occupy, and
> honoring every CSS operator the source declares; all proven by replay-pixel-equality and an
> honest refusal surface.**

The moat: kf's authoring object IS CSS, so "export to CSS" is its parser run backward —
structurally impossible for GSAP/Motion/anime. The six frontier waves, **re-gated against the
PUBLISHED value.js 0.12.0** (`audit/live-glassui-currency.md`, `VALUEJS-N2-ASKS.md §1-3`,
re-verified by the orchestrator 2026-06-15):

| Frontier wave | What | value.js gate | Status now |
|---|---|---|---|
| **FIDELITY FLOOR** (→ K.W7) | WL2-B `animation-composition` honoring (the adapter captures it `adapter.ts:24-29,120-126`; `engine.ts` drops it) + the diagnostics channel | none — the diagnostics now CONSUME the shipped 0.12.0 producer (`ParseDiagnostic`/`OnParseError`, N2 row 10) | **UN-BLOCKED** ✅ |
| **INGEST** (→ K.W8) | K1 `fromStyleSheets()`/`fromLiveAnimations()` + K2 `adopt()` | none — `CSSKeyframesRule.cssText` already feeds `resolveKeyframes`; robustness wants VJ-9 full totality (PARTIAL) | **UN-BLOCKED** ✅ (robustness tripwire recorded) |
| **SCROLL-AS-CSS** (→ K.W9) | SO-1 parse+dispatch + SO-2 `ScrollScene` + SO-3 sticky-pin | **VJ.W1 scroll grammar — OPEN** (verified `CSSTimelineOptions`/`parseAnimationTimeline` absent in 0.12.0) | **DISPATCHED** — K asks value.js (§value.js coordination); born-RED-gates on the publish |
| **COMPILE** (→ K.W10, the XL anchor) | CC-1 the CSS compiler + CC-2 oklab densify + CC-3 ineligibility report | CC-1 core: `reverseAnimationShorthand` (RIPE 0.12.0) ✅; **CC-2 oklab densify: VJ.W2 `sampleColorRamp` — OPEN** | **DISPATCHED** — core proceeds on RIPE; the densify born-RED-gates on VJ.W2 |
| **PHYSICS** (→ K.W11) | PHYS-C spring-driven blend weight + PHYS-B2 reseatToSpring + PHYS-E | none — engine-internal (`group.ts`); rides the SAME `scenePlaybackAdapters`/`sceneMachine` seam K.W0/K.W1 rebuilds | **UN-BLOCKED** ✅ (and wants K's seam) |
| **EXTERNALIZE** (→ K.W12) | ED-1 agent surface + ED-3 dogfood inversion + ED-4 color-fidelity (`deltaEOK` RIPE) | J.W5 publish ✅; ED-3 honest ONLY after Band I repairs the demo | **UN-BLOCKED** ✅ (and STRONGER on the repaired substrate) |

**Why fold (not defer), per the 2026-06-15 ground truth:** the reconciliation's central
deferral argument — value.js un-dispatched — dissolved (Tranche N shipped 0.12.0). The
remaining arguments weaken under the ORDERING: the P0 is NOT mortgaged (K.W0→K.W1 lead
regardless; the frontier band rides after; K is not yet implemented, so the P0 waits for K's
impl either way), and the charter is NOT a lie of scope (it names BOTH bands; the close claims
only what lands). The playback-policy seam that made the original *split* unattractive now
argues FOR the fold: K already owns that wiring for the P0 — PHYS-C rides it once, not twice
across K and a separate L.

---

## § Phase — TRANCHE DEVELOPMENT (the audit + these docs; implementation awaits authorization)

K is in DEVELOPMENT on `tranche-k-dev` (forked off `master` @ `4f1fc4c` — the J close tip; kf
`4.2.0` published; value.js `^0.11.2` installed / `0.12.0` published (Band I K.W1 re-pins),
glass-ui `~3.11.2` / `3.13.0` published (K.W1 consumes), parse-that `^0.9.0`). The 32-lane audit
is RUN under `docs/tranches/K/audit/`. This charter, `PATH-FORWARD.md`, `PROGRESS.md` (the board
+ the K ledger), the per-wave specs (`waves/K.W0–K.WZ`, both bands), the **value.js outbound
grammar ask** (`KF-TO-VALUEJS-GRAMMAR-ASKS.md`), and the consumed `L-SEED.md` are the DEVELOPMENT
deliverables. **K.W0–K.WZ are authored-now-run-later wave specs; the implementation phase opens
only on explicit user authorization — exactly the D→J dev/impl boundary. No engine, demo, gate,
test, or CI source is written in development.**

---

## § The MANDATE (binding — every wave, every gate, every fold)

The user's verbatim-intent (2026-06-11/12, carried into every wave):

> Run a frontend design plugin audit of our ui — all UI panes. How might we better structure
> and suffuse proper design hierarchy of elements? Check for any obvious visual incongruences.
> Look for areas wherein we might better suffuse our design language of glass, grid, math,
> large and audacious typography, with colorful audacious pops, like those found in our icons
> (how might we increase this, too? within a sense of proportion), and our animation targets.
> What glass-ui idioms might we adopt — what glass-ui items, if totally befitting, might we
> smoothen, refine, hone, and abstract out — or just generally refine within an extant
> component — within glass-ui. Look for gaps.
>
> DEEPLY audit with 32 agents in parallel our original plan and waves thereof, alongside all
> changes made herein. Devise a path forward … NO quick solutions, NO workarounds: idiomatic,
> gestalt approaches. This is a development product, architectural transpositions in the sake
> of elegance, simplicity, and performance above all are both necessary and desirable. NO
> legacy code. Delineate any chronically deferred items and fold them into this new tranche.
> Delineate any deferred items and fold them into this tranche. Recap ALL of our prompts and
> requests hitherto and ensure they've been addressed. This is NOT an implementation phase.
> Tranche development only.

And the 2026-06-15 fold directive: *"Explicate what the deferred L is to be — we should likely
fold that into K"* → resolved (user-confirmed) as the **TOTAL fold + value.js dispatch**: the
entire frontier folds into K Band II; value.js's post-N tranche is dispatched to ship VJ.W1 +
VJ.W2; there is no residual L.

Plus the binding live-audit register **U-K1..U-K20** (Band I, each rooted by an owning lane) and
the standing precept spine (NO workarounds; NO legacy beside its replacement; transpositions for
elegance/simplicity/performance; measure-first; inv-16 published-only consumption; isomorphic
styling EXCEPT the named design deltas). **Specifically forbidden for K:** the cold-path P0 dies
at the ADAPTER seam (resume-made-total), NOT a demo-side `play()` sprinkle; the font truth dies
at ONE token authority, NOT per-site font classes; the dock layout dies at the GRID/anchoring
system, NOT retuned magic offsets; the B1 vacuity dies by DISAMBIGUATING engine writes from CSS
animation, NOT by raising the distinct-count threshold; **the frontier's value.js edges are
PUBLISHED consumes, born-RED-gated kf-side, NEVER a `file:` link or a vendored copy** (the
constellation acyclic-spine law); **the compiler is the round-trip's parser run BACKWARD over
the same data model, NOT a re-derived lossy emitter** (the moat is the faithfulness, not the
feature).

---

## § The invariant set carried into K

All J-born invariants carry VERBATIM: the gate-ORACLE precept, the boundary-ORACLE extension,
P6 (CI device-independence; the quiet-host measurement of record), the net-deletion rule for the
estate, the two-tier taxonomy, inv ε / inv ζ / inv δ, P-invariant-28 (no perpetual punts),
born-RED discipline, the dev/impl boundary, version-owner/user-domain publish, the standing
memory rules.

**NEW K-born invariants:**

| inv | Statement |
|---|---|
| **the COLD-axis invariant** | A certified surface is exercised from its COLD/DEFAULT entry — the hero CTA, a fresh mount, the default selection state — not only through choreographed setup paths. The cold entry is the FIRST boundary a human crosses; it gates FIRST. |
| **the engine-write disambiguation rule** | A liveness oracle must distinguish ENGINE-DRIVEN writes from decorative CSS animation. The B1 vacuity class (greening on `.idle-hover` bob with the engine off) is forbidden: the oracle reads the engine's own write channel (inline style mutation attributable to `interpFrames`/the group composite, or `anim.t`-correlated subject deltas), never bare `getComputedStyle` churn. |
| **the TASTE boundary** (the J taste-tension resolved) | Gates carry CORRECTNESS; they do not carry the design VERDICT. For every appearance wave, the close motion produces a **review packet** (per-pane before/after screenshots, desktop+mobile, the named deltas) and the wave's design band closes ONLY on the user's verdict on that packet — a named USER-DOMAIN step, scheduled BEFORE the tranche close, never after. An agent's "designer-eye PASS" is corroboration, never the verdict. |
| **the replay-equality invariant** (Band II born) | Every round-trip frontier claim is proven by REPLAY-PIXEL-EQUALITY or an HONEST refusal: ingested CSS (K.W8) replays equal to its source animation; compiled CSS (K.W10) replays equal side-by-side to the JS playback it emitted from (pixel-compared); what cannot round-trip faithfully is REFUSED with a named reason (`waapiIneligibleReason` generalized to the CSS domain — the four refusals: weighted blend / custom renderers / perceptual oklab / computed-unit drift), never silently approximated. The moat is the faithfulness; a lossy emitter forfeits it. |
| **the acyclic-spine invariant** (the constellation law, made charter-binding) | value.js ships VALUES (grammar, parse/serialize, color science, interp kernels); kf consumes ONE tranche behind, born-RED-gated kf-side; glass-ui consumes spring FROM kf. No cycle. K Band II's scroll/compile waves born-RED-gate on the PUBLISHED value.js grammar (VJ.W1/VJ.W2) — they do not block kf's impl on an unpublished symbol; the wave's source half lands against a recorded born-RED, the consume edge lights when value.js publishes. |

---

## § The finding-cluster → wave ledger

### Band I — PRODUCT-TRUTH + DESIGN-TOTALITY (the repair; leads)

| Cluster | The decisive findings | Wave |
|---|---|---|
| **The cold-entry truth (P0)** | The hero rainbow-play → `#/cube` resume NO-OP (`scenePlaybackAdapters.ts:76-79`); the hero→scene loading gap; U-K1 the dock not shrunken by default; U-K4 the amiga float+flash; per-scene cold-mount defaults; B1's vacuity | **K.W0** |
| **The consume edge** | glass-ui `~3.11.2` → **3.13.0** (the re-cut sliders + `useDockClickIntegrity` retiring the RF-17 interim); the W7b parity-clause exits re-examined; **+ the value.js `^0.11.2 → ^0.12.0` re-pin + the N2 witness-flip slate** (`VALUEJS-N2-ASKS.md §2` — MCI-5 arity pad, the E1/E2 parsers, the LRU bound; the kf owner's confirm-first slate) | **K.W1** |
| **The typographic root** | NO single font-voice authority (`--font-serif` AND `--font-display` redundant; per-site stacks; the dock renders system-sans U-K6); U-K8/K9/K10 — ONE voice-token authority (display/mono/body), the dock joining the display voice at the ROOT | **K.W2** |
| **The layout transposition** | U-K7: the hardcoded dock-offset census retired into a derived grid/subgrid anchoring system; **pathological screens** (width AND height ceilings after which docks + controls CLUSTER, `clamp()`/container-query driven); desktop+mobile both | **K.W3** |
| **The pane verdicts, round 2** | U-K11 spring keyframes-editor variant + the STEPPING slider cured at root + U-K17 red-dashed final state; U-K12 tabs→pills/dock-dropdown; U-K13/K18 readout panes re-cut; U-K16 single-option selects NEVER render (totality); U-K17 left-clip + draggable; U-K20 FourierField REMOVED from the hero + grid lines less opaque | **K.W4** |
| **The gate-truth wave** | `proof:cold-entry` (born-RED today); B1 de-vacuoused; `proof:subject-animates` extended to the REAL scenes; the single-option gate; the TASTE review-packet protocol instrumented; `release.yml` `timeout-minutes`; the demo-smoke wall-clock hazard | **K.W5** |
| **Terminations (P-invariant-28)** | The DL-K ledger exit-only rows; the mobile-lighthouse floor re-assertion; the W2 drag-seam gaps; the dev-mode parity chronicle (the stale-vite-cache class); **+ the N2-resolved DL rows** (DL-K18 LRU bound, DL-K21 path sampler, DL-K17 diagnostics producer — exit by published-consume-edge) | **K.W6** |

### Band II — THE ROUND-TRIP FRONTIER (after the repair lands on the honest substrate)

| Cluster | The decisive findings | Wave |
|---|---|---|
| **The fidelity floor** | WL2-B `animation-composition` honoring (the engine drops a declared operator: `engine.ts` zero reads of the captured `adapter.ts:120-126` value) on rAF (additive accumulate) + WAAPI (composite); the diagnostics channel consuming the 0.12.0 producer (the RIPEST item; the round-trip must be HONEST before it is widened) | **K.W7** |
| **The ingest** | K1 `fromStyleSheets()`/`fromLiveAnimations()` (walk the CSSOM; `CSSKeyframesRule.cssText` → `resolveKeyframes`); K2 `adopt()` mid-flight takeover via `getAnimations()` currentTime handoff; the sentinel/robustness edges (N2 rows 4, VJ-9 tripwire) | **K.W8** |
| **The scroll-as-CSS** | SO-1 parse + round-trip `animation-timeline`/`-range`/`-trigger` + DISPATCH (native ScrollTimeline where eligible, the kf `ScrollScene` JS driver SO-2 where not — Firefox/pin/snap); SO-3 `position:sticky` pin SYNTHESIS (SO-4 transform-pinning KILLED). **value.js-gated: VJ.W1 scroll grammar (dispatched)** | **K.W9** |
| **The compile (XL anchor)** | CC-1 compile `AnimationGroup`/`Sequence`/`stagger` → zero-runtime CSS (@keyframes + animation-* longhands + linear() springs + animation-composition layering); CC-2 oklab densify (**VJ.W2-gated, dispatched**); CC-3 the ineligibility report (the four refusals); CC-4 the "Export CSS" editor button (the CSS-animation IDE) | **K.W10** |
| **The physics** | PHYS-C spring-driven blend weight on the weighted-blend compositor (only POSSIBLE on kf's substrate — the flagship demo moment); PHYS-B2 `reseatToSpring` (velocity-continuous interruption of a parsed-CSS animation); PHYS-E intensity-scaled reduced-motion (the ONE PRM gate takes a scale, WCAG 2.3.3-aligned) | **K.W11** |
| **The externalize** | ED-1 llms.txt + the proof corpus as a public artifact + `proof:agent-surface`; ED-2 `@mkbabb/keyframes-vue` (the thin new adapter); ED-3 the dogfood inversion (the demo consumes the PUBLISHED barrel — honest ONLY on Band I's repaired demo); ED-4 the public color-fidelity conformance harness (`deltaEOK`, RIPE) | **K.W12** |

The 12 researched KILLs (`L-SEED.md §5`) carry as K's anti-charter, non-re-litigable; the BOOKs
(`L-SEED.md §6`) carry with their named tripwires.

---

## § The WAVE MAP (DAG — two bands)

**Band I leads. K.W0 LEADS the tranche** (the P0 — the cold-entry truth; its `proof:cold-entry`
oracle and the de-vacuoused B1 are consumed by every later wave's verification). **K.W1** (the
glass-ui 3.13.0 + value.js 0.12.0 re-pin) runs immediately after W0 lands locally — the re-pins
precede the design waves. **K.W2 (fonts) ∥ K.W3 (layout)** follow W1 (the styles boundary is
BINDING: W2 owns the VOICE tokens, W3 owns the GRID/anchoring tier). **K.W4 (the panes)** follows
W2+W3. **K.W5 (gate-truth)** legs partition (the cold-entry oracle lands WITH W0; the rest as
the surfaces they certify land). **K.W6 (terminations)** is parallel throughout.

**Band II rides the honest substrate Band I leaves behind.** **K.W7 (fidelity floor)** LEADS the
frontier band — engine-internal, value.js-independent, the round-trip made HONEST before it is
widened. **K.W8 (ingest)** follows W7 (consumes its diagnostics channel) **∥ K.W9 (scroll-as-CSS)**
(gated on value.js VJ.W1 — the consume edge lights when value.js publishes; the source half lands
born-RED). **K.W10 (compile, the XL anchor)** follows W7 (inverts the honoring) + W8 (composes
with ingest); CC-1 core proceeds on RIPE value.js, CC-2 densify gates on VJ.W2 **∥ K.W11 (physics)**
(engine-internal; rides the K.W0/K.W1 playback seam, file-disjoint from the compiler). **K.W12
(externalize)** CLOSES the frontier band (ED-3's dogfood is honest only on the repaired demo +
all prior surfaces published).

**The acyclic value.js spine (Band II):** K dispatches VJ.W1 (scroll grammar) + VJ.W2 (perceptual
ramp) to value.js's post-N tranche (`KF-TO-VALUEJS-GRAMMAR-ASKS.md`); value.js publishes; K.W9/W10's
consume edges light born-RED-gated kf-side. K's impl never blocks on an unpublished symbol — the
source half lands against a recorded born-RED, the edge consumes on the publish (the J.W7b
published-consume-edge idiom).

**The longest serial path:** K.W0 → K.W1 → (K.W2 ∥ K.W3) → K.W4 → K.W7 → (K.W8 ∥ K.W9) → K.W10
→ K.W12 → K.WZ, with K.W5's legs, K.W6, and K.W11 parallel to their owning bands. **K.WZ closes**
— the design band closes ONLY on the user's review-packet verdict (the TASTE boundary, a named
user-domain step BEFORE the version cut); the frontier band closes on the replay-equality
invariant.

---

## § value.js coordination (the dispatch — the acyclic spine in motion)

K does not write value.js's tree. It authors the **outbound grammar ask**
(`KF-TO-VALUEJS-GRAMMAR-ASKS.md`) — the kf-side spec value.js's post-N tranche consumes, the
mirror of the inbound `VALUEJS-N2-ASKS.md`. The dispatch:

- **VJ.W1 SCROLL GRAMMAR** (gates K.W9): the `CSSTimelineOptions` typed extractor + inverse
  serializer (`animation-timeline`/`-range`/`timeline-scope`/`animation-trigger`,
  `scroll()`/`view()`/range-phase) — the ONE genuine net-new grammar (`L-SEED.md §7`). Confirmed
  ABSENT in 0.12.0 (orchestrator-probed 2026-06-15).
- **VJ.W2 PERCEPTUAL RAMP** (gates K.W10's CC-2): `sampleColorRamp(from,to,n,{space,hueMethod})`
  beside `mix.ts`, reusing `lerpColorValue` + `gamutMapOKLab` (MEASURE-FIRST). Confirmed ABSENT
  in 0.12.0.
- value.js's post-N tranche reconciles these against its then-current `value.js/docs/tranches/N/
  PROGRESS.md` (Tranche N is live on `tranche-f-handoff`; it recorded both items for its post-N
  successor — `VALUEJS-N2-ASKS.md §3`). The 0.12.0 RIPE edges (`lerpArray`, `deltaEOK`,
  `reverseAnimationShorthand`) + the N2 witness-flip slate are K.W1/K.W6 consumes, already shipped.

**The dispatch does not block K's authorization.** Band I is value.js-grammar-independent and
leads; Band II's W7/W8/W11/W12 are un-blocked today; only W9 and W10's CC-2 light on the
publish. K can authorize and run Band I + the un-blocked frontier while value.js ships the two
grammar items in its own interval — the same acyclic cadence value.js's 0.12.0 just demonstrated.

---

## § The DEV / IMPL boundary

This DEV phase AUTHORS: this charter, `PATH-FORWARD.md`, `PROGRESS.md`, `waves/K.W0–K.WZ` (both
bands), `KF-TO-VALUEJS-GRAMMAR-ASKS.md`, the consumed `L-SEED.md`, atop the 33-doc audit corpus.
Run later, only on explicit user authorization: every source/demo/gate/test/CI edit; the re-pins;
the publish; the deploy legs; the value.js tranche (its own repo/authorization).

**Honest already-done — manufacture NO K work** (inv ε): J's ten waves delivered their specs
honestly (all 10 plan-vs-delivery lanes confirm). The deploy/publish/docs boundaries remain
discharged and are NOT re-litigated; the engine's zero-alloc/serialize gestalt holds; the icon
family, the hero serif, the rainbow play are the taste anchors K amplifies. **For Band II:** the
frontier is NEW capability — its waves carry NET-NEW oracles for features that don't exist; they
are born-RED in the FRONTIER sense (the gate reds because the capability is absent), and the
charter never claims a frontier item landed until its replay-equality oracle is GREEN.

---

## § The chronic + deferred fold (P-invariant-28 — complete disposition)

The full consolidated ledger is `audit/deferred-ledger-k.md` (32 DL-K rows); `PROGRESS.md`
carries the K board + the parse-substrate tables. The bands:

- **FOLDED into K Band I** — every Band-I cluster row above (the U-K register + the P0 + the
  gate-blindspot).
- **FOLDED into K Band II** — the ENTIRE frontier (the 6 waves, the value.js half via the
  dispatch, the 12 KILLs as anti-charter, the BOOKs with tripwires). `L-SEED.md` is CONSUMED into
  this charter; **there is no residual L** (the 2026-06-15 total-fold supersedes the
  reconciliation's Shape A; `audit/k-seed-reconciliation.md` is evidence-of-record, its Shape-A
  recommendation now superseded — the un-blocking it argued for HAPPENED via value.js 0.12.0).
- **OUT/sibling-DISPATCHED** — value.js VJ.W1/VJ.W2 (the outbound ask; value.js's own tranche);
  glass-ui root items via the handoff ledger.
- **RECORD** — U-K19 playground-only; the J close gap analysis.
- **KILL** — the 12 frontier KILLs (`L-SEED.md §5`) + the carried ARCH kills, un-re-litigated.

Version owner **Mike Babb** (`mike@babb.dev`), confirm-first; the TASTE review packets are the
user's named verdict step.

---

## § The terminal reading (one paragraph for the impl phase)

J made every boundary between the certified product and a human tell the truth — and the user,
hours later, crossed the one boundary no gate had ever crossed: the first click. **K's correction
is two bands under one discipline.** Band I makes the product TRUE FROM THE FIRST GESTURE and
BEAUTIFUL AT ITS ROOTS: the cold path plays because the adapter resume is total; the liveness
oracle reads the engine's own hand, never the idle bob that fooled it; one font authority gives
every surface — dock included — its voice; the dock anchoring becomes a derived grid that clusters
gracefully on a cinema display and a phone alike; the panes are re-cut on the current glass-ui
with the taste anchors the user loves, and where taste is the oracle, the protocol hands the user
the packet. Then Band II makes the round-trip TOTAL on the honest substrate the repair leaves: the
engine honors the `animation-composition` it had been dropping, ingests the live web's own CSS,
parses and dispatches the scroll grammar the platform is still shipping, compiles its orchestration
BACK to zero-runtime CSS that replays pixel-equal, drives layer crossfades with springs no
competitor's substrate can hold, and exposes itself to agents and to its own dogfood — every
frontier claim signed by replay-equality or an honest refusal. The frontier no longer waits in an
L that will not come; value.js shipped the grammar that un-blocked it, and the two it still owes
are dispatched. When K closes, "green" means: **the first thing a human does works, smoothly,
beautifully, on the first try — and the engine that makes it move can now read, drive, and emit
the entire living language of CSS animation, proven faithful both ways.**
