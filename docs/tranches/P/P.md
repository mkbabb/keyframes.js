# Tranche P — aggressively optimize the engine · transpose at the true seam · build the demo-frontend-design fleet · cut 5.1.x

> **DEVELOPMENT PHASE — DOCS ONLY.** Authored 2026-06-20 from the 32-lane TRIUMVIRATE
> optimization re-audit (`P/audit/AUDIT-DIGEST.md`, ~3.8M tokens; 297 findings · **172 novel
> ideas**, 29 radical). This charter + its waves + the deferred-fold ledger + the prompt-recap +
> the two sibling dispatch packets are the deliverable. **No engine, demo, or library source is
> written here.** The implementation (P.W1…P.WZ) opens only on the owner's explicit
> authorization — exactly O's dev→impl boundary. **inv-16 holds throughout** (Tranche P writes
> only keyframes.js; every cross-repo need is a *dispatch* — `KF-TO-VALUEJS-P.md` /
> `KF-TO-PARSETHAT-B.md` — never a foreign-tree edit).

> **The constitution is `P/CONSTELLATION-OPTIMIZATION-CAMPAIGN.md`** — the shared spine the three
> sibling sessions cite. It locks the topology (ONE kf-hosted tranche + TWO dispatch packets), the
> DAG (parse-that B → value.js P → keyframes P), the CODEGEN SPINE (§4), and the version split. P.md
> is the kf-P tranche charter *under* that constitution; it does not re-litigate the locked
> decisions, it sequences the kf work that rides them.

> **PRECONDITION-STATE banner (the two-tier O→P gate).** P opens after O is **AUTHORIZED** and O's NOW
> correctness/chronic-terminal bands (DM-2/DM-3 build-ins O.W5/O.W6, the DM-22 cure) are available as
> P's substrate — NOT after O is fully *implemented*. **O is DEVELOPED-not-IMPLEMENTED** (verified:
> `engine.ts` is still 1397L). O.W7 (the VJ-L1-GATED engine split) is **RE-HOMED into P's execution
> window**: P.W11's realm-clean WeakMap early-cure discharges the VJ-L1 precondition NOW → O.W7-under-P
> lands the split → P.W3 S4 deepens it into the `Playhead` value-object. This is the canonical chain;
> §1/§5 below state it identically.

---

## 1 — Why Tranche P exists (the optimization+demo-design mandate atop O)

Tranche O is the **close-out tranche**: it implements what M developed, terminates the two absolute
chronics M.W14 named-but-never-built (DM-2 `DemoControlPoint` / DM-3 `fromMorphSVG`), executes the
engine-seam split, dispatches the value.js-P + glass-ui-BC asks, and cuts 5.0.0. O is the
*correctness-and-honesty* tranche — it makes the tree *true*. It is RATIFIED but **IMPLEMENTATION
remains UNauthorized** (O.md:11-19).

Tranche P is the **optimization+frontend-design tranche** that sequences ATOP O. The owner's
standing 7-clause mandate (verbatim, immutable since J.md:111-119) was **intensified** this pass into
an active *challenge* (F3 lane, CONSTITUTION §1): **aggressively optimize the triumvirate**
(value.js · parse-that · keyframes), **brainstorm novel architectural approaches that challenge each
library** (perf + arch above all), and **improve the demos' usability/clarity/correctness via a
frontend-design fleet.** Falsify-first, not passive.

Where O makes the tree *correct*, **P makes it *fast and beautiful*** — and does so over the
foundation O lays. The dependency is concrete and named:

| O substrate P sequences atop | O home | P consumes / extends |
|---|---|---|
| **O.W5/O.W6 chronic terminals** (`DemoControlPoint` over LIGHT `drag2D`; `fromMorphSVG` over value.js `PathGeometry`) — the forbidden-8th-carry BUILD-INs | O Band C (NOW) | **P Band C** dogfoods them as the demo-fleet showcase (the curve-editor handle is `DemoControlPoint`; the morph scene is `fromMorphSVG`) |
| **O.W7 engine-seam split** (`engine.ts` 1397→~900, the lifecycle/playback machine lifted off the compile facade) — **VJ-L1-gated** via O.W16 | O Band D (VJ-L1-GATED) | **P Band B** transposes the *shrunk* file at the TRUE seam (the `Playhead` value-object — K2 lane); **P Band F** ships the VJ-L1 WeakMap early-cure that unblocks O.W7 NOW if value.js P slips |
| **O.WZ 5.0.0 cut** (the no-legacy renames; the Oscillator + additive tail published) | O Band Z (USER-DOMAIN) | **P Band Z** cuts **5.1.x** — perf is non-breaking, it rides AFTER O's major |
| **value.js 1.0.2 `PathGeometry` / `./math` / `flatLeaf`(P) / `parseCSSSubValue`(P)** | constellation | **P Band B/E/F/G** consume the published surfaces; the codegen-consume (P.W4) rides parse-that B → value.js P |

P does **not** orphan O. P opens after O is **AUTHORIZED** and O's NOW correctness/chronic-terminal
bands are available as P's substrate (NOT after O is fully *implemented* — O is
DEVELOPED-not-IMPLEMENTED, `engine.ts` still 1397L; O.W7's VJ-L1-GATED split is RE-HOMED into P's
execution window per the PRECONDITION-STATE banner above). The two compose by phase (O = NOW
correctness; P = the perf/design layer over the corrected tree). The carried-forward chronics are
tracked in `P/audit/deferred-ledger-P.md` (every O terminal a P inheritance, not a re-defer).

The audit corrected **three stale premises** up front (record-as-built honesty, F5/V1/V2/P1 lanes):
both siblings **already have bench infrastructure** (the "no-bench" premise was FALSE — value.js has
9 bench files + a portable JSON.parse-ratio gate; parse-that has `test/benchmarks/`); **`bbnf-lang`
exists** locally (a real TS-emitter codegen tool — the spine is *wiring*, not greenfield); and
**glass-ui 4.1.0 published BUT `SegmentedTabs.vue:406` still emits `aria-orientation`
unconditionally** — so the kf S1 deletion is NOT yet safe (the O aria-guard dispatch stands), while
S2/dock (`useDockClickIntegrity`, shipped 4.0.1) **IS** deletable NOW.

## 2 — The precept reckoning (the transposition targets, applied to today's tree)

> *NO quick solutions, NO workarounds; idiomatic + gestalt; architectural transpositions for
> elegance/simplicity/PERFORMANCE above all are necessary + desirable; NO legacy code; KISS;
> observable-truth; born-RED; P-invariant-28.*

The re-audit enumerated the concrete transposition targets the tree carries **right now** — each owed
a terminal transposition in P (not a band-aid, not a file-rename masquerading as a transposition):

- **The `leaves.ts`→value.js/math TRAP (the precept-correction BLOCKER — F4/X4 lanes).**
  `internal/leaves.ts` duplicates `clamp`/`scale`/`lerp`/`lerpArray`/`deCasteljau`/`cubicBezier`
  that value.js 1.0.2's `./math` subpath now exports. O.W9 framed this as "import the canonical
  `./math`" — but `proof:boundary` **bans even the subpath specifier** from LIGHT source (the
  static/dynamic boundary is value.js-free in LIGHT). A plain delete-and-import would **RED
  `proof:boundary`**. The no-legacy cut is therefore a **bundle-externalization transposition**, NOT
  a delete: teach the LIGHT build to treat `@mkbabb/value.js/math` as a bundle-external (the subpath
  is provably parse-that-free + grammar-free — F4 verified), gated by a `math-subpath-clean` clause
  asserting the externalized entry's static graph never touches the grammar. **P Band E owns this**;
  it is the genuine transposition O.W9 named but could not execute as written.

- **The SoA-compositor transposition (the radical engine play — K1/X2 lanes).** The HEAVY interp path
  (`CSSKeyframesAnimation.processFrame` → `lerpValue` per channel; `AnimationGroup.transformFramesGrouped`
  → `for..in` over `Record<string, ValueUnit[]>`) is still **boxed-ValueUnit AoS** while the LIGHT
  `NumericAnimation` already proved `Float64Array`+`lerpArray` SoA wins (3.86x in
  `spring-vector-decision.json`; the J.W6 S2 `interp-buffer.bench.ts` prototype showed the same on the
  engine corpus but was **never adopted**). The transposition: (1) a per-frame numeric SoA plan emitted
  at parse (`frame.soaFrom/soaTo: Float64Array` + a destination-ValueUnit index) for pure-numeric
  segments; (2) a **single contiguous `Float64Array` composite accumulator** for `AnimationGroup`
  indexed by a stable `(key→offset)` layout — the blend becomes a branch-free vectorizable typed fold.
  **P Band B owns this** (P.W2), gated by a PORTABLE ratio bench (SoA-hz / per-channel-hz at K=8).

- **The `Playhead` value-object transposition (the TRUE seam — K2 lane, deepening O.W7).** O.W7's
  `engine-playback.ts` lift is a *file-shrink*, not a transposition — it preserves the god-object's
  coupling under a new filename. The deeper truth: the "lifecycle/playback machine"
  (`advanceTo`/`interpFrames`/`startTime`/`pausedTime`/`settle`) is **not engine-internal** — it is a
  public **driver protocol** that `Sequence` (sequence.ts:426,497), `AnimationGroup`
  (group-layer-springs.ts:164,201), and `ingest` (ingest.ts:268,345) all reach into directly. The
  elegant move is to FORMALIZE that protocol — extract a `Playhead` value-object (clock + t + iteration
  + flags + `advanceTo`) the engine COMPOSES and the four drivers DRIVE through a typed handle — so
  `KeyframesAnimation` becomes a thin compile-facade. **P Band B owns this** (P.W3, Typed-OM write-path
  sibling), gated `proof:playhead-decoupled` (`engine-playback.ts`/the Playhead module has ZERO import
  of `KeyframesAnimation`). This sits ATOP O.W7's shrink — P deepens what O lands.

- **The Typed-OM (Houdini `StylePropertyMap`) write path (the aggressive DOM-write transposition —
  K1/K3 lanes).** Today `transformTargetsStyle` (utils.ts:417) allocates a fresh `Record<string,string>`
  every rAF frame and writes K individual `style.setProperty` calls (each a string-serialize + browser
  CSS re-parse). The transposition: a two-phase pipeline (interpolate-all → write-all) with batched
  `StylePropertyMap.set()` (Typed-OM — **LIMITED AVAILABILITY**: Chrome/Edge 66+, Safari 16.4+, NO
  Firefox for the aggregate API; PROGRESSIVE-ENHANCEMENT with a string-`setProperty` fallback,
  feature-detect-gated). **P Band B owns this** (P.W3), gated `proof:typed-om-eligible` (real-browser
  pixel-readback).

- **The codegen-consume (the campaign's missing perf payload — CONSTITUTION §4 · V1-N2/P1/P4/X2
  lanes).** Four audit lanes converged on the same radical play: emit, at BUILD TIME, ONE specialized
  straight-line `charCodeAt` scanner per grammar (no closures, no `callSpan` recursion, every call site
  monomorphic by construction). parse-that B ships `@mkbabb/parse-that/codegen` (the SpanParser /
  bbnf-lang `TsEmitter` substrate); value.js P generates its CSS-value parser from `css/l4/*.bbnf`; kf
  inherits faster frame-compilation for free. **P Band B owns the kf-side consume** (P.W4, GATED on
  parse-that B + value.js P), gated by a parity+throughput bench **guarded against the A.W3 runtime-
  dispatch falsification** (the emitter must produce STRAIGHT-LINE source, never a runtime interpreter
  dressed as a generated function).

- **The remaining live workarounds.** S8 `FN_NAME` Symbol sidechannel (utils.ts:45 — stamped onto
  foreign value.js `ValueUnit` instances, re-stamped on every `.clone()`); S9 direct `@mkbabb/parse-that`
  production import + two cross-realm `as any` casts (utils.ts:1,229,236); S1 aria-suppress; S2
  dock-pointer interim. Each retires on a *root fix* — **P does not band-aid these**: S2 deletes NOW
  (the BC `useDockClickIntegrity` root fix shipped 4.0.1); S1 stays GATED on the BC aria guard
  (`KF-TO-GLASSUI` correction stands); S8 (born E) / S9 (born C) **exit at O.W16** (the value.js
  VJ-L1/VJ-L3 consume, inherited at P) **+ P.W11 WeakMap early-cure for S8** — these are at
  **chronicity 4** (K,L,M,O→P), and the VJ-L1 WeakMap early-cure (Band F) is the **P-inv-28
  chronicity-4 belt exit** that unblocks O.W7 NOW if value.js P slips. (P.W12 is S1/S2 ONLY — the
  glass-ui aria/dock consume, NOT S8/S9.)

## 3 — The eight bands (the wave structure)

The O.md eight-band DAG is the template; P carries the same explicit **phase axis** — every wave is
tagged **NOW** (kf-internal, zero sibling dependency, executable on authorization), **DISPATCH** (a
cross-repo ask, authored in-tree, scheduled by the sibling), or **GATED** (fires atomically on a named
sibling publish).

| Band | Wave(s) | Phase | Headline |
|---|---|---|---|
| **A — Apparatus** | P.W1 (lint+bench-coverage+portable-perf-gate infra) | NOW | the optimization measurement floor — close the un-CI'd bench gaps, ratify the portable ratio discipline, author the perf-gate apparatus every aggressive idea below requires |
| **B — Engine-perf (the transpositions)** | P.W2 (SoA-compositor + computed-unit-cache), P.W3 (Typed-OM write-path + Playhead value-object), P.W4 (codegen-consume, GATED) | NOW W2,W3 · GATED W4 | the radical engine plays: the contiguous `Float64Array` composite fold, the `StylePropertyMap` batched write, the `Playhead` driver-protocol transposition, the BBNF codegen-consume |
| **C — Demo-fleet (frontend-design)** | P.W5 (cube + amiga), P.W6 (square + spring), P.W7 (easing-curve-editor + DemoControlPoint showcase), P.W8 (N-Stage switcher + mobile) | NOW | the 29-idea design fleet over the O-built chronic terminals: per-scene refinement, the spring parameter-space heatmap, amiga flick-to-boing, the curve-editor dogfooding `DemoControlPoint`, the N-Stage shelf-driver + the entirely-unbuilt mobile |
| **D — Correctness** | P.W9 (NaN-frame cure + grammar-fuzz + differential-oracle) | NOW | the property-based / differential-vs-browser oracle frontier the corpus tests miss — fast-check fuzz, the CDP computed-style differential, the named-selector roundtrip post-O.W3 |
| **E — No-legacy** | P.W10 (leaves.ts-externalization-TRAP + deprecated-aliases + cross-realm-seam-gate) | NOW | the genuine `leaves.ts`→`/math` bundle-externalization transposition (NOT a delete), the `proof:no-cross-realm-cast` structural gate, the deprecated-alias purge atop O's 5.0.0 renames |
| **F — Unblock** | P.W11 (VJ-L1-WeakMap early-cure → unblock O.W7) | NOW | the kf-internal `WeakMap<ValueUnit,string>` FN_NAME carrier — the P-inv-28 **chronicity-4 belt exit** for S8 (the belt fires THIS tranche) that lifts O.W7's VJ-L1 gate WITHOUT waiting for value.js P |
| **G — Consume** | P.W12 (glass-ui 4.1.0 S2-delete-NOW + S1-GATED-on-guard) | **NOW S2** (re-pin only — the glass-ui `useDockClickIntegrity` root fix is ALREADY published+installed; no sibling WAIT) · **GATED S1** (waits on the UNshipped BC SFC aria guard) | the glass-ui consume: delete S2/dock atomically on 4.1.0 (root fix shipped); hold S1/aria GATED on the BC SFC guard (the O correction premise unmet) |
| **Z — Close + 5.1.x cut** | P.WZ (close + 5.1.x cut) | NOW-author · USER-DOMAIN publish | the non-breaking perf cut riding AFTER O's 5.0.0 major — the SoA/Typed-OM/codegen wins published, the ledger re-pointed O→P, the deploy round-trip re-observed |

**Phase-axis note.** P carries far more **NOW** weight than O did: the engine transpositions (Band B
W2/W3), the demo fleet (Band C), correctness (Band D), no-legacy (Band E), the VJ-L1 early-cure (Band
F), and the S2 delete (Band G) are all kf-internal — executable on authorization with zero sibling
wait. The two GATED edges are **P.W4 codegen-consume** (parse-that B + value.js P) and **P.W12 S1
delete** (glass-ui BC aria guard). Band F's existence is precisely to *minimize* the gated surface —
the WeakMap early-cure converts O.W7's hard VJ-L1 gate into a NOW.

## 4 — The DAG (the band ordering + the gated couplings)

```
parse-that Tranche B  ─►  value.js Tranche P  ─►  keyframes Tranche P (consumer)
  (0.12.0 codegen)         (1.1.0 API · 1.2.0 perf)    (5.1.x perf · demo-design)
        │                         │                            │
        └── the CODEGEN SPINE ────┴──── generated parser ──────┘  (P.W4 GATED)
```

```
P.W1 apparatus (NOW) ─► B{W2 SoA-compositor (NOW), W3 Typed-OM+Playhead (NOW)}
        │                                                              │
        ├──────────► C{W5 cube+amiga, W6 square+spring,                │
        │              W7 curve-editor+DemoControlPoint, W8 N-Stage+mobile} (NOW, atop O.W5/W6)
        ├──────────► D.W9 correctness (NOW)                            │
        ├──────────► E.W10 no-legacy TRAP (NOW)                        │
        │                                                             ▼
   F.W11 VJ-L1-WeakMap early-cure (NOW) ──────► unblocks O.W7 engine-seam ──┐
                                                                            │
   G.W12 S2-delete (NOW) · S1-delete (GATED: glass-ui BC aria guard)        │
                                                                            ▼
   parse-that B publish ─► value.js P publish ─► P.W4 codegen-consume (GATED) ─► P.WZ close (5.1.x)
```

**The band ordering.** Band A (the apparatus) lands FIRST — the portable-perf-gate infra is the
measurement substrate every aggressive idea in Bands B/C is gated against; without it a 2× regression
stays green (the device-dependence lesson). Bands B (engine-perf), C (demo-fleet), D (correctness), E
(no-legacy), F (unblock), and G/S2 (consume) are then **immediately executable** (the bulk of the
value — all NOW). The two gated edges close last:

- **The VJ-L1-gated engine-seam coupling (Band F → O.W7).** O.W7 (the `engine.ts` 1397→~900 split) is
  VJ-L1-GATED in O (O.W7.md:4-5 — it fires on value.js P shipping `flatLeaf`, consumed at O.W16). **P
  Band F (P.W11) is the early-cure**: author the kf-internal `WeakMap<ValueUnit,string>` FN_NAME
  carrier NOW (X4 radical idea) — it unblocks O.W7's split IMMEDIATELY without the value.js P wait. The
  WeakMap does NOT survive `ValueUnit.clone()` (the re-stamp ceremony stays — VJ-L1 remains strictly
  preferred as the *true* terminal), so P Band B's `Playhead` transposition (which deepens O.W7) can
  proceed over the cleared seam while value.js P is still in flight. This is the P-inv-28 **chronicity-4
  belt exit** for S8 (the belt fires THIS tranche, P) named in the CONSTITUTION §3.

- **The codegen-consume gated on parse-that B + value.js P (Band B.W4).** P.W4 consumes the generated
  value.js CSS-value parser — it CANNOT land until parse-that B ships `@mkbabb/parse-that/codegen` AND
  value.js P generates its parser from `css/l4/*.bbnf`. The kf-side consume is "inherit faster
  frame-compilation for free" — a re-pin + a parity+throughput gate, NOT a kf-authored emitter (inv-16:
  the emitter lives in parse-that; value.js owns the generation; kf consumes). The gate is **born-RED
  guarded against the A.W3 falsification** — it asserts the generated parser is STRAIGHT-LINE +
  throughput ≥0.85x hand-rolled, never a re-attempt of the runtime tagged-union switch.

The close (P.WZ) fires when all NOW bands are GREEN + the two gated edges resolve (or are
contingency-disposed per the ledger). The **5.1.x cut** is non-breaking — perf rides AFTER O's 5.0.0
major.

## 5 — The relationship to O (P sequences atop O — the dependency, stated precisely)

P is **not** a re-do of O and **not** a parallel tranche — it is the **next** tranche, opening after O
is **AUTHORIZED** and O's NOW correctness/chronic-terminal bands (DM-2/DM-3 build-ins O.W5/O.W6, the
DM-22 cure) are available as P's substrate — NOT after O is fully *implemented* (O is
DEVELOPED-not-IMPLEMENTED; `engine.ts` is still 1397L). O.W7 (the VJ-L1-GATED engine split) is RE-HOMED
into P's execution window: P.W11's WeakMap early-cure discharges the VJ-L1 precondition NOW → O.W7-under-P
lands the split → P.W3 S4 deepens it. The coupling is three concrete inheritances:

1. **O.W5/O.W6 chronic terminals are P Band C's substrate.** O builds `DemoControlPoint` (over LIGHT
   `drag2D`) and `fromMorphSVG` (over value.js `PathGeometry`). **P Band C dogfoods them** — the
   easing-curve-editor's draggable handle BECOMES `DemoControlPoint` (P.W7 retires the bespoke
   `useEasingCurveDrag` CTM transform onto the published primitive — KISS, no-legacy); a morph scene
   showcases `fromMorphSVG` (P.W5/W6). If O.W5/W6 are not yet built, P Band C has no substrate — the
   sequencing is hard.

2. **O.W7 engine-seam is P Band B's foundation (and P Band F is its accelerant).** O.W7 lifts the
   playback machine into `engine-playback.ts` (1397→~900), VJ-L1-gated. **P Band B (P.W3) deepens that
   shrink into the `Playhead` value-object transposition** — the TRUE seam K2 named that O.W7's
   file-lift under-reaches. **P Band F (P.W11) is the early-cure** that lifts O.W7's VJ-L1 gate so the
   split (and P's deepening of it) can proceed NOW. The chain: P.W11 WeakMap early-cure → O.W7 split
   (now NOW-able) → P.W3 Playhead transposition over the split.

3. **O.WZ 5.0.0 cut precedes P.WZ 5.1.x cut.** O cuts the major (the breaking no-legacy renames +
   Oscillator publish). **P cuts 5.1.x** — perf is non-breaking, it RIDES AFTER. P.WZ does not
   re-do the major; it ships the SoA/Typed-OM/codegen wins as a minor over O's 5.0.0 baseline,
   re-points the chronic ledger O→P, and re-observes the deploy round-trip.

The carried-forward chronics (O's DM-2/DM-3 BUILD-INs, the DM-22 NaN cure, the BC-gated S1, the
value.js-P-gated S8/S9) are P's inherited foundation — tracked in `deferred-ledger-P.md` with a real
terminal per item, never re-orphaned. O.W5/O.W6 (the chronic terminals) and O.W7.md (the engine-seam
dependency, VJ-L1-gated) are the load-bearing O waves P reads as substrate.

## 6 — The 5.1.x cut (P.WZ)

O.WZ cuts **5.0.0** (major — the no-legacy renames are breaking: `Animation`→`KeyframesAnimation`,
`ScrollTimeline`→`KeyframesScrollTimeline`, `ScrollTimelineOptions`→`KeyframesScrollTimelineOptions`,
`presets.flip`→`presets.flipPreset`; + the multi-color refusal semantic). It also ensures the
Oscillator + the eight-export additive tail reach the **published** dist (frozen at 4.3.0 today).

P.WZ cuts **5.1.x** — a **non-breaking** minor (BC-additive) riding AFTER O's major. The P perf+design
work is additive by construction: the SoA compositor and Typed-OM write-path are internal strategy
changes (no API delta); the `Playhead` value-object is an INTERNAL transposition (P.W3 S4 — the
public `startTime`/`pausedTime` field-write seam + `advanceTo`/`interpFrames`/`seek`/`effectiveT`
KEEP their published signatures via DELEGATING ACCESSORS; no public engine-class member is removed or
retyped, and P.W3 S4 wires `proof:published-surface` into its born-RED set to enforce that BC-preservation
clause — a future field-removal would escalate to 6.0.0, but the committed path is 5.1.x via delegating
accessors); the codegen-consume is a faster parser behind the same `CSSKeyframesAnimation` facade;
the demo-fleet is demo-only. P.WZ authors the changelog 5.1.x entry (the perf wins + the demo fleet),
re-points the chronic ledger O→P (the M→O→P substrate chain), and observes the deploy round-trip as
live-byte equality (the CI→deploy→live serves-the-exact-hash oracle). The publish + the keyframes-vue
peer-bump stay **USER-DOMAIN** (Mike Babb fires the tag).

## 7 — inv-16 (kf asks, never writes)

P writes **only keyframes.js**. The two cross-repo needs are **dispatch packets**, authored in-tree,
scheduled by the sibling sessions into their own trees — the proven inv-16 fence pattern (the same as
O's `KF-TO-VALUEJS-P-ASKS.md` + the BC aria correction):

- **`KF-TO-VALUEJS-P.md` → value.js Tranche P** — VJ-L1 `flatLeaf` provenance + VJ-L3 `parseCSSSubValue`
  (the S8/S9 root fixes), the VJ-P1 `color2Into` out-param + VJ-P2 typed Float64 channel view (the perf
  tail), the codegen-generation of the CSS-value parser from `css/l4/*.bbnf` (the spine's value.js leg),
  the **VJ-P.W0** doc-honesty reconciliation (commit the uncommitted O docs; the stale "DEVELOPMENT —
  charter only" PROGRESS → CLOSED-as-built — value.js Tranche P's first wave; there is NO kf P.W0, the
  kf roster starts at P.W1). Version split: 1.1.0 (API) then 1.2.0 (perf).
- **`KF-TO-PARSETHAT-B.md` → parse-that Tranche B** — `@mkbabb/parse-that/codegen` (the BBNF→specialized-
  monomorphic-TS emitter over the retained SpanParser + bbnf-lang `TsEmitter`), the **packrat cross-input
  pollution FIX** (the MEMO key has no `src` component — a real correctness BLOCKER), the Span-combinator
  generation, the combinator-fusion + 2-char dispatch widening. Version: 0.12.0.

The DAG enforces the inv-16 ordering: parse-that B → value.js P → kf-P. kf P's GATED waves (P.W4
codegen-consume; the value.js-P-gated S8/S9 deletes that feed O.W16/O.W7) fire atomically on the
named sibling publish; kf never reaches into a sibling tree to make them land.

## 8 — The dev→impl boundary + verification

This phase's deliverable is the Tranche P development docs, verified by: the 32-lane audit on disk
(`P/audit/`) + re-runnable; the deferred-fold ledger (`deferred-ledger-P.md`) with a real terminal per
item (every O chronic a P inheritance, zero un-dispositioned punts; the codegen P-inv-28 on the
SpanParser retention assigned its BUILD home); the prompt-recap (`prompt-recap-P.md`) capturing the
optimization+triumvirate+frontend-design intake (the one uncaptured prompt F3 found); the two sibling
dispatches authored; and **each wave's falsifiable born-RED gate** — for perf ideas a **PORTABLE ratio
bench** (numerator and denominator from the same report; device-independent by construction), for
codegen a **parity+throughput bench guarded against the A.W3 runtime-dispatch falsification**, for the
demo-fleet a real-browser observable (CDP/Playwright pixel-readback or a content-aware probe). The
IMPLEMENTATION (P.W1…P.WZ) opens only on the owner's explicit go, per-repo, DAG-ordered — gate-first,
born-RED, observable-truth, no-legacy, gestalt, KISS throughout. inv-16 holds: P writes only
keyframes.js.
