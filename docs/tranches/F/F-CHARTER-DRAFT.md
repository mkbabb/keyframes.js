# Tranche F — CHARTER DRAFT (the path forward)

> **STATUS: DRAFT for the team lead to refine.** This is **not** the final `F.md` — the
> lead authors that. This draft synthesizes the F deep-SOTA audit (27 phase-1 lanes + 5
> synthesis lanes under `docs/tranches/F/audit/`) into a proposed band/wave structure,
> each wave carrying its **falsifiable hard gate**, its **dispositions**, and the inter-wave
> **DAG**. It is grounded line-by-line in the audit synthesis (`_SYNTHESIS-gap-scorecard.md`,
> `_SYNTHESIS-deferred-ledger.md`, `_SYNTHESIS-prompt-recap.md`, `a-tranche-retro-F.md`) and
> the live `tranche-e-impl` tree. **This is TRANCHE DEVELOPMENT — docs only, ZERO source
> edits.** inv-16: value.js items are HAND-OFFs (kf proposes, never writes value.js).

**Synthesis id:** `_F-CHARTER-DRAFT`. **Branch:** `tranche-e-impl` (D+E IMPLEMENTED + CLOSED).

---

## § Mandate (binding — every wave, every fold, every hand-off)

The standing precepts, re-asserted in the F ask, BINDING on every F wave, every gate, and
every cross-repo hand-off this tranche emits (carried verbatim-in-substance from
`E/E.md:26-53`, re-confirmed HONORED across A→F by `_SYNTHESIS-prompt-recap.md` §Precepts):

- **NO quick solutions, NO workarounds** — idiomatic, gestalt approaches only. A wave may
  not pin a bug as a "documented contract", patch a symptom at the wrong seam, or offer a
  weaker-alternative escape hatch beside the real fix. The hard gates are written to pass
  ONLY the transposition. (Specifically forbidden for F: the delete-loop fold is the
  V8-correct stable-key null-fill, **NOT** "revert to fresh-`{}`" — `p-runtime-perf-F §1.2`.)
- **Architectural transpositions for elegance · simplicity · performance are NECESSARY AND
  DESIRABLE** — this is a development product. F's transpositions: the stable-key buffer
  clear (perf), the single-frame alias (perf), the computed-endpoint cache (perf), the
  `serializeEasing` round-trip symmetry (correctness), `animations.ts` onto the heavy barrel
  (reachability), the 4×-`clamp` convergence through `leaves.clamp` (cohesion).
- **NO legacy code** — no compat alias, no deprecated path beside its replacement, no
  polyfill (feature-detect with the JS path as the genuine fallback). A replaced surface is
  replaced in one motion; a removed name is removed. (F-specific: the `parseLinearStops` shim
  at `utils.ts:106-130` RETIRES when value.js E1 lands — the no-legacy collapse; the
  `wrapBareKeyframes` regex-sniff is a legacy crutch to DECIDE-on-the-AST, not patch —
  `px-kf-grammar PX-1`.)
- **Measure-first** — every perf claim lands behind a shaped biting bench or is
  recorded-withheld with the measurement (the `d3-changed-keys.measure.test.ts` D-3
  gold-standard bar). **Isomorphic** — pixels/behaviour stable unless a befitting delta is
  NAMED. **KISS** — the §ALREADY-SOTA record is binding: manufacture NO work where the
  kernel already leads. **inv-16** — F writes only keyframes.js; value.js items route as
  HAND-OFFs.

**ENFORCEMENT (inv ε):** every code claim below cites a `file:line` or a named phase-1 lane;
every disposition is tagged; the §ALREADY-SOTA record (§7) is binding — no wave may
manufacture a deficit where the post-E state is exemplary.

---

## § The invariant set carried into F

| inv | Statement | F posture |
|---|---|---|
| **inv-16** | kf writes only keyframes.js; value.js items are HAND-OFFs (propose, never write) | HONORED — the value.js charter v2 (Band V) is the inv-16 artifact; kf consumes through the single `lerpValue → iv._lerp` seam, ZERO kf edits |
| **inv-27** | consume PUBLISHED value.js/glass-ui (not branches); gate on own green CI | HONORED — pin `@mkbabb/value.js ^0.10.0`, installed === HEAD-declared (`a-vj-consumption-F §0`); no pin lag |
| **inv ζ** | the shop-window runs on its own engine (no hand-rolled rAF/listeners) | EXTEND — `useOrbitalInertia.ts:62` hand-rolls `Math.pow` decay = the discrete Euler of the shipped `decay()` closed form; the dogfood discipline now reaches the orchestration tier (E2/NEW-35) |
| **inv ε** | verify, do not assert — cite for every claim, ground every SOTA claim | HONORED — every row traces to a lane or `file:line` |
| **P-invariant-28** | every keyframes-owned deferral has a terminal home (no perpetual punt) | VACUOUS for F — D was the terminal home; the ledger is CLEAN (zero KFE); F folds NO chronic debt (`a-tranche-retro-F §1`, `_SYNTHESIS-deferred-ledger §0`) |
| **inv δ** (drift-2) | "zero dock-over-content overlap" is a HARD gate, not advisory | HOLD — F's demo waves must not reintroduce an occlusion; the advisory→hard promotion is the template for F's per-wave hard-gate discipline |

---

## § Thesis — F is net-new, NARROW, and proves itself by what it leaves untouched

D+E was a healthy, gate-backed, measure-first arc that **discharged its own
predecessor-retro's #1 projection** (the orchestration tier landed in E.W10) and folded
**all** chronic debt in D (`a-tranche-retro-F §0`; `E/FINAL.md` — zero KFE). The post-E
stack is **~90% SOTA** (`_SYNTHESIS-gap-scorecard §0`): the interpolation kernel, the
spring/decay analytics, the WAAPI harness + native-scroll bridge, the FrameCompiler split,
the value.js boundary, the modern-web demo surface, the color science, and the parse-that
fast tier are **exemplary and must not be re-touched** (§7).

F's net-new content is **concentrated and honest**, and it groups into a clean band/wave
structure where **none re-architects and none manufactures**:

1. **Two measured, kf-local per-frame perf folds** the E close correctly WITHHELD and
   three F lanes independently re-measured at 3.8–6.2× (the dict-mode buffer deopt + the
   single-frame alias) — the single largest measured per-frame win in the engine.
2. **A cluster of parsing consumption-seam correctness fixes** where value.js already hands
   kf data the adapter silently drops (per-keyframe easing, `animation-composition`,
   the style-rule `animation` shorthand).
3. **A small finishing pass on the demo** (undo/redo, two un-landed a11y items, shortcut
   discoverability, the rail/ball idiom W11's commit message claimed but did not deliver).
4. **A verification-discipline fix** (3 inv-tagged gates never run in CI; the benches are
   broken — they import a type-only export and `TypeError` on construction).
5. **The augmented value.js charter** (Waves A–F carried, Wave D re-pointed by measurement,
   §2 rename DISCHARGED, F4 CLOSED-by-verification, three net-new color findings).

The single largest "gap" the SVG suite re-surfaces is the one real competitor-feature
absence (MotionPath / MorphSVG / DrawSVG / SplitText) — mostly BOOK + value.js-HANDOFF,
with the CSS-native MotionPath sliver SHIP-able. **No lane manufactured work; multiple
lanes plainly say "already-SOTA, leave it."**

---

## § The band → wave map (the proposed structure)

F decomposes into **six keyframes-local bands** (each a coherent set of waves) **plus one
cross-repo hand-off band** (value.js, inv-16) **plus the close**. The ordering reflects the
DAG (§ The DAG, below): the verification band (Band 0) leads because it unblocks the
measure-first instruments every perf disposition depends on.

| Band | Theme | Waves | Net-new vs folded |
|---|---|---|---|
| **Band 0 — Verification** | gate coverage + the broken-bench unblock | W0·F1·F2·F3 | net-new (gate-coverage residuals, NOT debt) |
| **Band 1 — Engine perf** | the re-measured runtime hot-path folds | F4·F5·F6 | net-new (E withholds RE-MEASURED + graduated) |
| **Band 2 — Parsing seam** | the consumption-seam correctness cluster | F7·F8 | net-new (silent data-loss holes) |
| **Band 3 — Orchestration + arch cohesion** | Sequence transport, dogfood, barrel/clamp folds | F9·F10·F11 | net-new (un-gated tier finish + isomorphic folds) |
| **Band 4 — Modern platform / SVG** | the CSS-native competitor sliver + Baseline adopts | F12·F13 | net-new (the one real feature gap) |
| **Band 5 — Demo design cogency** | the finishing pass | F14·F15·F16 | net-new (surfaces W11 reached partway) |
| **Band V — value.js charter v2** | the inv-16 hand-off (kf NEVER writes) | (hand-off doc) | CHRONIC-by-design (the only true chronic) |
| **Band Z — Close** | the F FINAL + the changeset + provenance | F-close | — |

---

## BAND 0 — VERIFICATION (the unblock; LEADS the DAG)

**Why first:** four F lanes converged on the same blocker — the compile/interp benches
import `CSSKeyframesAnimation` from the barrel, which E made a **type-only export**
(`src/animation/index.ts:108`) → `TypeError: not a constructor` (VERIFIED in the
gap-scorecard synthesis; `bench/interpolation.bench.ts:2` + `bench/parser.bench.ts:2`). Every
measure-first disposition in Band 1 is un-measurable until this is fixed. Band 0 also closes
the two gate-coverage asymmetries the retro surfaced.

### W0 — assay confirmation (this charter + the prompt-recap)
- **Content:** confirm the 27+5-lane assay is on disk; this charter is one synthesis artifact.
- **Disposition:** ADDRESSED (the assay IS the deliverable).
- **Gate:** the audit docs present under `docs/tranches/F/audit/`.

### F1 — fix the broken benches + author the missing ones (`C1`/`NEW-4`/`NEW-5`)
- **Content:** one-line import fix (`../src/animation/engine`) in `bench/{interpolation,parser}.bench.ts:2`; author `bench/interp-buffer.bench.ts`, `bench/sync-step.bench.ts`, `bench/compile.bench.ts` (editing-session profile), a `SpringProgress.tick` bench.
- **Disposition:** **SHIP-in-F** (harness-only, isomorphic).
- **Gate** `proof:bench-runs`: `npm run bench` exits 0 and produces non-empty results for the compile + interp suites (bites today: `TypeError`).
- **Lanes:** `r-frame-compile-sota F-5`, `a-framecompiler-remeasure §4`, `p-compile-perf-F §6`, `a-test-quality §4` (4 lanes converge).

### F2 — wire `proof:all` into CI (`V1`/`NEW-2`)
- **Content:** add `npm run proof:all` (or the 3 grep gates + the `proof:platform-adopt` source-half) to the CI `gates` job. Today 3 inv-tagged `.mjs` gates (`proof:dogfood` inv ζ, `proof:demo-elevate` inv ο — the SOLE View-Transitions lock, `proof:modern-web`) never run in CI.
- **Disposition:** **SHIP-in-F** (highest-leverage, lowest-cost verification fix).
- **Gate** `proof:ci-coverage`: a CI step invokes `proof:all`; a bite control flips one grep gate red and the CI job fails.
- **Lanes:** `a-test-quality §1`.

### F3 — author `proof:orchestration` + the two public-API tests (`E3`/`NEW-1`/`V2`/`NEW-6`)
- **Content:** author `proof:orchestration` (stagger-distribution / FLIP-rect / decay-rest / Sequence-ordering bite clauses) — the orchestration tier (E.W10) shipped as the highest-profile new public API with the WEAKEST gate posture (bare `vitest run` only). Add the two missing public-API behavioural tests (`createNativeTimeline` guard-absent, `toEasing` normalizer).
- **Disposition:** **SHIP-in-F** (low cost; closes the asymmetry).
- **Gate** `proof:orchestration` (new): bites if any orchestration behaviour clause regresses.
- **Lanes:** `a-tranche-retro-F §3.1`, `a-test-quality §3/§4`.

> **The library line-ceiling DECISION (`NEW-3`/`a-engine-post-e F-ENG-5`):** **MEASURE-FIRST → BOOK.** The library is exempt from the 350L ceiling the demo lives under; `Animation` is ~913L. `a-engine-post-e F-ENG-5` independently concludes the class is at its cohesive gestalt — a split would be legacy-shaped (extract-for-line-count). The gap is the ABSENCE of a *gated decision*. Band 0 should DECIDE: extend the ceiling to `src/animation/**` OR record an explicit gated exception with rationale. **Do not reflexively split.**

---

## BAND 1 — ENGINE PERF (the re-measured runtime hot-path; the highest-confidence band)

**Provenance:** every item here is an E measure-first WITHHOLD that F RE-MEASURED on the
LIVE engine. The verdict moved on two of them — they graduate from withheld to SHIP, gated.
**DAG: depends on F1** (the benches must run to gate these honestly).

### F4 — the dict-mode buffer fold + the single-frame alias (`R1`+`R2`/`MF-1`+`MF-2`)
- **The finding:** the `delete`-loop (`engine.ts:573` + `group.ts:212`) holds **every** reused buffer in V8 **dictionary mode** — proven on the live engine; threaded-buffer playback is **3.8–6.2× SLOWER** than the fresh-`{}` it replaced (the optimization regressed what it optimized). Paired: `Object.assign(result, frame.flatVars)` (`engine.ts:636`) re-copies a stable dict every frame; the single-active-frame case (the dominant 2-stop shape) can **alias `frame.flatVars` directly** — the leaves ARE the lerped units (`frame-compiler.ts:364`), measured 41.7× for the standalone path.
- **The transposition:** stable-key null-fill clear (buffer stays fast-properties AND zero-alloc); single-frame alias fast-path with the aliasing-correctness clause (the GROUP always takes the buffer path). Pixel-identical, kf-local.
- **Disposition:** **SHIP-in-F** (the single largest measured per-frame win; three independent re-measures agree).
- **Gate** `proof:interp-fastprops` (new): a `%HasFastProperties` assertion on the reused buffer + a threaded-buffer bench that bites if the buffer falls into dictionary mode; pixel-identical output lock.
- **Lanes:** `r-v8-cost-model F-1/F-2`, `a-runtime-remeasure RM-1`, `p-runtime-perf-F P-1/P-2`, `a-engine-post-e` brief.

### F5 — the sync-step fast path, `drive` half (`R3`/`MF-3`)
- **The finding:** `RAFPlayback._run` (`playback.ts:99-108`) wraps **every** frame in `Promise.resolve().then` (a microtask hop) even for synchronous `drive` steppers; `_frame`/`advanceTo` are `async` and the steady-state interior frame awaits nothing (33 ns drive · 43 ns Animation interior · ~2.1 µs/frame 50-child group).
- **The transposition:** `typeof result?.then` fast path → sync reschedule for `drive`.
- **Disposition:** **MEASURE-FIRST → LAND the `drive` half** (gated on a promise-count clause) **+ HOLD the `Animation`/group half** — the boundary awaits carry real event-ordering semantics (`animationstart`/`iteration`/`end` byte-unchanged), so they stay until the event-ordering lock exists.
- **Gate** `proof:sync-step` (new): a promise-count assertion (synchronous `drive` steppers schedule zero microtasks); the held `Animation`/group half is locked OUT by an event-ordering parity test.
- **Lanes:** `a-engine-post-e F-ENG-1`, `a-runtime-remeasure RM-2`.

### F6 — the computed-unit endpoint cache (`R4`/`C1`)
- **The finding:** `lerpComputedValue` re-resolves **both** endpoints every frame; the value.js memo **re-serializes its key** (`value.toString()`) on every hit for an O(1)-invariant pair (~190 ns/leaf/frame, empirically sized). The kf-side endpoint cache **never landed in E** (no `cachedStart`/resize-epoch in `src/`).
- **The transposition:** cache the resolved `(start, stop, unit)` on the `InterpolatedVar` at `prepareInterpVar`; invalidate on `setTargets`/resize-epoch. ~190 → ~1.2 ns/leaf/frame (−99.3% measured).
- **Disposition:** **kf SHIP-in-F seam** (the bigger half of D-3) **+ value.js-HANDOFF** (Band V Wave C — C2/C3/C4/C7 secondary hardening; the kf endpoint cache makes the value.js memo path cold).
- **Gate** `proof:computed-frame` (new): a call-counter on the per-frame resolve path; asserts the steady-state resolves are served from the endpoint cache, not re-derived.
- **Lanes:** `p-runtime-perf-F P-3`, `vj-units-compute-aug C1/C2/C4`, `a-vj-consumption-F §1`.

> **KILL/RECORD ledger for Band 1 (so no future lane re-raises):**
> - **DOM write-skip diff-cache** (`R5`/`MF-4`) — **KILL**: measured ~0 (every interpolating key changes every frame — E's `d3-changed-keys.measure.test.ts` settled it). The real per-frame garbage is `unflattenObjectToString` alloc → **value.js-HANDOFF (VJ-F4/VJS-2)**.
> - **D1 frozen-shape `ValueUnit`** (`R6`) — **KILL**: measured non-win (mono ≈ mega; the store IC is not the bottleneck). The lever is **D2 SoA `Float64Array`** (~2.0–2.3× at K≥16) → **value.js-HANDOFF (re-pointed Wave D)**. The kf-local numeric-segment compile is MEASURE-FIRST/BOOK (gated on representative-K, absent at the dominant K=1).
> - **CSS Typed OM as interp carrier** (`R7`) — **KILL (record)**: allocates per `.add`/`.mul`; vs a string-CSSOM baseline kf doesn't use; DOM-coupled (breaches the boundary). Recorded so no future "modernize the carrier" pass reaches for it. (The Typed-OM *write substrate* is a SEPARATE axis — MEASURE-FIRST, feature-detected, only if a bench bites + zero-alloc preserved.)
> - **W8 S1 typed time index** (`MF-6`) — **RECORD**: ~4 ns of a 128–168 ns tick, NEGATIVE at the dominant N=2. The withhold HOLDS with the full-tick denominator.
> - **W8 S2 slot map** (`MF-7`) — **MEASURE-FIRST + BOOK** (after the carrier lane; the shape exists at `numeric.ts:8-15`).
> - **W8 S3 incremental `updateSegments`** (`MF-8`) — **BOOK**: compiles in 0.039% of the editor's 1000 ms debounce at 80 stops; trading the FC-2 byte-determinism lock for a dirty-state machine is unjustified. The `proof:compile-incremental` byte-equality contract is recorded so it is not reinvented.
> - **`tryParseCache` eviction** (`MF-9`) — **RECORD** (withhold HOLDS; load-bearing 116×; the bound belongs in value.js `memoize`, Band V F3).
> - **preset lazy memo** (`MF-5`) — **RECORD** (a memo breaks instance independence — a correctness bug, not a perf win).

---

## BAND 2 — PARSING / CONSUMPTION SEAM (the net-new correctness cluster)

**Provenance:** value.js already parses these; the kf adapter silently drops them. These are
data-loss holes, several biting the LIVE editor's display-and-reapply seam. **DAG:
independent of Bands 0/1** (no shared surface) — can run in parallel.

### F7 — the serializer round-trip symmetry (`P1`/`NEW-12`)
- **The finding:** `fromString` READS per-keyframe `animation-timing-function` and stores it (`engine.ts:1089-1096`, `constants.ts:80`), but `CSSKeyframesToString` (`format.ts:105-151`) never reads `templateFrame.timingFunction` → **asymmetric round-trip** (per-stop curves silently lost on re-parse). This is the LIVE editor's reapply seam — data loss every keystroke, a CSS-Animations-L1 spec violation.
- **The transposition:** factor a `serializeEasing()` helper; emit per-keyframe `animation-timing-function` when it differs from the default. Strictly more correct; byte-stable for uniform-easing.
- **Disposition:** **SHIP-in-F (HIGH)** — the data is already on the template frame.
- **Gate:** a per-keyframe-easing round-trip test that bites today (emit → re-parse → assert per-stop curve preserved).
- **Lanes:** `a-parsing-post-e F-1`, `px-kf-grammar PX-2`.

### F8 — capture the dropped adapter metadata (`P2`+`P3`/`NEW-13`+`NEW-14`)
- **The finding (a):** `animation-composition` is **parsed by value.js** (`stylesheet.ts:327-333`) but the adapter **drops it** (`ResolvedKeyframes` carries no `composition`). **(b):** `resolveKeyframes.options` (the style-rule `animation` shorthand) is **computed then never consumed** (`adapter.ts:121`; `resolved.options` has 0 reads) — a documented field that is a maintenance lie.
- **The transposition:** capture `composition` in `ResolvedKeyframes` (SHIP); apply `resolved.options` as the base with constructor options overriding (SHIP). **BOOK** the deeper `composition`-honoring (map to WAAPI `composite` + rAF accumulate) — do not half-wire.
- **Disposition:** **SHIP-in-F (capture + options-apply)** + **BOOK (composition honoring)**.
- **Gate:** a `fromString` test asserting the style-rule shorthand takes effect + ctor overrides; a `composition`-captured assertion.
- **Lanes:** `a-parsing-post-e F-2/F-3`.

> **Also in the parsing surface (lower urgency):**
> - **`linear()` shim retirement** (`P5`/`F-PARSE-1`) — **RECORDED kf-side**: retire the hand-rolled `parseLinearStops` regex (`utils.ts:106-130`) when value.js E1 lands (the no-legacy collapse). kf's reader LANDED in E.W7 S5, so this is no longer a kf blocker. `linear()` hits Baseline-Widely-Available **2026-06-11**.
> - **the spring round-trip lock** (`NEW-17`/`PX-3`) — **SHIP-in-F (MED, test-only)**: a round-trip lock over the engine's OWN `springLinearStops` emission (E.W7 locked a hand-authored literal, never the engine's emission). Closes the E.W7 "half" + seeds the value.js byte-match corpus.
> - **`wrapBareKeyframes` regex-sniff** (`NEW-16`/`PX-1`) — **SHIP-in-F (LOW, kf half — decide on the AST)** + value.js-HANDOFF (the `stripCSSComments` pre-pass = Band V Wave A4).
> - **scroll-named selectors silently collapse to 0%** (`P4`/`NEW-15`) — **BOOK** (the right home is the E.W9 ScrollTimeline range model; interim fail-loud reject).
> - **`splitPathKey` double-`split(".")`** (`NEW-24`) — **MEASURE-FIRST (LOW)**: SHIP if the compile bench bites, else RECORD.
> - **diagnostics-blindness** (`NEW-18`/`PX-5`) — **BOOK** (a `ResolvedKeyframes.diagnostics` field) + value.js-HANDOFF (VJ-F2, the structured error sink).

---

## BAND 3 — ORCHESTRATION + ARCHITECTURE COHESION

**Provenance:** finish the un-gated E.W10 tier (gate it in Band 0 F3; complete its transport
+ dogfood here) + three clean isomorphic boundary folds. **DAG: the dogfood scene (F10)
depends on the transport (F9) and the demo band; the arch folds (F11) are independent.**

### F9 — complete the `Sequence` transport (`E1`/`NEW-34`)
- **The finding:** the just-shipped `Sequence` is transport-incomplete vs the GSAP Timeline it names as gold-standard — has `play`/`stop`/`seek`/`add`/`label` but no `pause`/`resume`/`reverse`/`timeScale`/`progress`/`repeat`/`yoyo`. The substrate (`seek` + `RAFPlayback` managed-pause) is already there.
- **The transposition:** complete the transport via scalar-field arithmetic over the existing `seek` + re-anchor.
- **Disposition:** **SHIP-in-F** (MEASURE-FIRST on `reverse`/`timeScale` C⁰-continuity).
- **Gate:** a seek↔play parity test (the boundary-frame event ordering and the C⁰-continuity at `reverse`/`timeScale` flips).
- **Lanes:** `r-anim-libs-2026 F26-2`.

### F10 — dogfood the orchestration tier (`E2`/`NEW-35`)
- **The finding:** the E.W10 tier shipped as API but is UNDOGFOODED — `decay`/`Draggable`/`Sequence`/`stagger`/`flip` have ZERO demo callsites; `useOrbitalInertia.ts:62` hand-rolls `Math.pow` frictional decay — the discrete Euler form of exactly the `decay()` closed form the engine now exports (an inv-ζ analogue).
- **The transposition:** swap `useOrbitalInertia` to `decay()`/`Draggable`; add a `Sequence`+`stagger` demo scene. The proof IS the demo.
- **Disposition:** **SHIP-in-F (dogfood, parity-gated)**.
- **Gate:** an inertia-parity test (the `decay()` swap is behaviour-equivalent to the hand-rolled `Math.pow` within epsilon); the new scene is exercised by `proof:dogfood`.
- **Lanes:** `r-anim-libs-2026 F26-3`.

### F11 — the boundary cohesion folds (`E4`+`E5`+`E6`/`NEW-20`+`NEW-21`+`NEW-22`)
- **The finding (a):** `animations.ts` (870L presets) is on **no barrel** — `import { fadeIn } from "@mkbabb/keyframes.js"` (the README's most-copied snippet) resolves nothing (the E D-1 fold slipped). **(b):** `clamp` is open-coded **four ways** across the light surface (`smooth.ts:78,132`, `timeline.ts:34`, `waapi.ts:225`, `spring.ts:110`) while `internal/leaves.clamp` exists and is adopted in the other half. **(c):** `group.ts` (heavy) borrows `internal/leaves.lerp` for one call where it already imports value.js directly — an inverted-tier import.
- **The transposition:** route presets through the heavy `AnimationEngine` interface + `loadAnimationEngine` + README reconcile; converge the 4× `clamp` through `leaves.clamp` (the codebase's own convergence idiom, byte-identical); retarget `group.ts`'s one `lerp` to `@mkbabb/value.js`.
- **Disposition:** **SHIP-in-F** (isomorphic; byte-identical).
- **Gate:** `proof:boundary` holds (presets route through the heavy surface); a preset-import smoke (`import { fadeIn }` resolves); `proof:idioms`/the clamp-convergence grep.
- **Lanes:** `a-boundary-arch-F F-A3/F-A2/F-A4`.

> **BOOK in this band:** `.finished` getter (`E8`/`NEW-10`); the WAAPI `commitStyles()`→`cancel()` csswg#11084 comment + the native-scroll smoothing-parity contract test (`E9`/`NEW-8`/`NEW-9`); the dogfood-the-barrel demo migration (`E7`/`NEW-19` — the boundary is gated but no first-party consumer crosses it; minimal SHIP = a dist-barrel smoke).

---

## BAND 4 — MODERN PLATFORM / SVG (the one real feature gap)

**Provenance:** the SVG suite is the one persisting competitor-feature gap (F-6, booked
pre-E, did not land). 2026 widened it (GSAP went 100% free; anime.js ships MorphSVG/DrawSVG
core). The CSS-native MotionPath sliver is SHIP-able with ZERO value.js dep; the geometry
heavier half is value.js-HANDOFF. **DAG: F12 is engine-side, independent; F13 depends on a
Baseline date + a glass-ui hand-off.**

### F12 — CSS-native MotionPath (`S1`/`NEW-33-1a`)
- **The finding:** keyframes ships zero path/SVG primitives; `offset-distance: 0%→100%` over an author `offset-path` is pure WAAPI-eligible CSS, reuses the existing eligibility gate, zero value.js dep.
- **The transposition:** a `MotionPath` that animates `offset-distance`, compositor-thread.
- **Disposition:** **SHIP-in-F** (highest-ROI competitor close; engine-side).
- **Gate:** a MotionPath eligibility + compositor-thread assertion (reuses the WAAPI eligibility gate); a demo scene.
- **Lanes:** `r-anim-libs-2026 F26-1a`.

### F13 — Baseline-platform adopts (mostly BOOK; one SHIP sliver)
- **The findings:** directional View-Transition **types** are now Baseline (2026-01-13) but the demo ships the bare callback (the enabler `startViewTransition({types})` is glass-ui-owned); Invoker Commands (`command="show-modal"`) Baseline 2025-12-12; `text-wrap: pretty` is a ≤1-line scoped SHIP.
- **Disposition:** **SHIP-in-F (`text-wrap: pretty`)** + **glass-ui-HANDOFF (the `types` helper, H-1)** + **BOOK (the typed/directional scene-VT; the `Mod+K` palette via Invoker; intrinsic-size; splitText).**
- **Gate:** the `text-wrap: pretty` presence; the demo BOOKs consume the glass-ui helper once it lands.
- **Lanes:** `r-scroll-vt-2026 H-1/B-1`, `r-modern-web-2026 F-MW-1/F-MW-2`, `r-demo-design-2026 §3/§4`.

> **GAP-NAMED (engine waves, gated on value.js) — not in F's keyframes-local scope yet:**
> - **`height: 0 → auto` intrinsic-size** (`I1`/`NEW-37`) — a new engine `IntrinsicSizeValue` interp branch (native PE fast-lane + JS-measure fallback) gated on the value.js `calc-size()` parser (E7). Native `interpolate-size`/`calc-size()` is NOT Baseline (Chrome-only) → RECORD don't-adopt-the-native-delegation-until-Baseline.
> - **MorphSVG + DrawSVG + numeric MotionPath** (`S2`/`NEW-33-1b/1c`) — **BOOK + value.js-HANDOFF (VJ-F1)**: the path-geometry sampler (`d` → bézier AST → length-parametrized sampler + point-count-reconciling lerp) is value-domain and MISSING from the E handoff.
> - **SplitText analogue** (`S3`/`NEW-36`) — **BOOK** (a value.js-free `splitText({by})` over `Intl.Segmenter`, Baseline 2024, feeding `stagger`); demo grapheme-fix (the demo splits by raw UTF-16 code unit).

---

## BAND 5 — DEMO DESIGN COGENCY (the finishing pass)

**Provenance:** the post-E.W11 demo is ~90% SOTA; F's residual is finishing, NOT a rebuild
(`a-demo-post-e §7` verifies nothing >350L post-E). **DAG: F14/F15/F16 are independent of
the engine bands; F10's dogfood scene (Band 3) lands a new demo scene that should respect
these.** The demo waves must not reintroduce a dock occlusion (inv δ).

### F14 — undo/redo for the destructive editor (`D1`/`NEW-25`)
- **The finding:** the demo is a destructive editor with NO undo/redo — "clear all keyframes", delete-frame, free-form CSS edits, all irreversible; gates the core try→undo→try loop (NEW; E lanes did not raise). `useRefHistory` is already a dep.
- **The transposition:** scoped, debounced `useRefHistory` over timeline+CSS state; `Mod+Z`/`Mod+Shift+Z` via the existing 19-shortcut registry.
- **Disposition:** **SHIP-in-F** (additive; state already centralized).
- **Gate:** an undo/redo round-trip behavioural test (a destructive op + `Mod+Z` restores prior state).
- **Lanes:** `a-demo-post-e §1`.

### F15 — the a11y SHIPs + shortcut discovery (`D4`+`D5`/`NEW-26`+`NEW-27`+`NEW-28`)
- **The findings:** the `contenteditable` CSS pane is **unlabeled + no focus ring** (E-UX-13, never landed); the playground asset `<img>` has **no alt** (E-UX-8 half-open); the 19-shortcut registry has **no visible discovery affordance** (`?`-only).
- **The transposition:** `role="textbox"`+`aria-multiline`+`aria-label`+`.focus-ring`; `:alt="asset.name"`; a visible shortcuts-trigger button (note Invoker `command="show-modal"` as the forward idiom; BOOK the `Mod+K` palette).
- **Disposition:** **SHIP-in-F** (two real correctness SHIPs + the trigger) + **BOOK (palette)**.
- **Gate:** `proof:demo-elevate` a11y clauses (the labeled textbox; the asset alt); the visible trigger present.
- **Lanes:** `a-demo-post-e §2/§3/§4`, `r-modern-web-2026 F-MW-1`.

### F16 — the rail/ball idiom + hero typography/a11y (`D2`+`D3`/`NEW-31`)
- **The findings:** the rail/ball idiom is still 4× with drift (rail tint 12/8/10%, glow 40/35%, ball 1.75rem/36px/1.1rem) — W11's commit claimed "progress-dot promoted" but promoted the WRONG primitive (the conic-gradient playing-ring). The per-character hero **defeats `text-wrap: balance`** (per-char spans give the balancer nothing), has **no accessible name** (AT reads "S…e…l…e…c…t"), and drives a JS `width<768` line-break (pre-CQ anti-pattern).
- **The transposition:** promote a real `progress-rail`/`progress-ball` idiom pair to `design-idioms.css` (honest correction of the E record); `sr-only` mirror + `aria-hidden` spans; stagger at word/line granularity or let `text-wrap: balance` own wrapping.
- **Disposition:** **SHIP-in-F** (the LCP element's typographic + a11y substrate; the named-befitting design-cohesion delta).
- **Gate:** `proof:idioms` (the rail/ball pair de-duplicated); a hero accessible-name assertion.
- **Lanes:** `r-demo-design-2026 §1/§2`, `a-demo-post-e §6`.

> **BOOK in this band (low urgency / secondary surfaces):** playground transform-handle keyboard/role + `::before` hit pad (`D6`); start-screen first-gesture copy/cue pass (`NEW-29`); icon-button touch-target generalization (`NEW-30`); the VT shared-element directional morph (`NEW-32`, gated on the glass-ui `types` helper H-1).

---

## BAND V — value.js CHARTER v2 (the inv-16 HAND-OFF; kf NEVER writes value.js)

This is the **only genuinely-chronic cross-history item, and it is chronic *correctly*** —
inv-16 binds kf from writing value.js, value.js is dirty+active (tranche M open), and the
win lands when value.js sequences it. F **augments** the 405-line `E/valuejs-sota-handoff.md`;
it does NOT close it. kf consumes everything below through the single `lerpValue(eased, iv)`
seam (`engine.ts:629`) with ZERO kf edits. The value.js owner sequences the waves.

| vj Wave | Item | F adjustment vs the E handoff |
|---|---|---|
| **A** | `any()`→`dispatch()` (58 live sites), the maximal-munch unit regex | Carried + numbered (3.65× at tail, 4.2× position spread); **re-rank A2 ahead of A1** (the per-dimension unit cost beats color dispatch on the dominant shape); **A2 is a LATENT CORRECTNESS bug** (sticky-`y` non-anchored prefix-match), not only perf |
| **B** | the color hot-path serializer (~190 ns/frame), channel-plan precompute, output-space targeting, egress gamut, hue domain | Carried + re-grounded; **3 NET-NEW findings**: `formatColor` always emits `/alpha` even at α=1, the exact per-frame `keys()`/closure/`forEach` alloc inventory B3 must kill, the `Color.clone()` static depth-counter constraint; **B2 emit-space rule CORRECTED** ("emit legacy as rgb()" contradicts default-oklab faithfulness) |
| **C** | the computed-unit endpoint memo (C1–C7) + the no-op length units | C1 empirically sized (−99.3%/leaf/frame); **C5 (24-of-45 no-op units, `50dvh→50px` silently) LEADS as standalone correctness** — the cleanest falsifiable gate in the set, jsdom can't catch it; the kf endpoint cache (F6) makes the value.js memo path cold |
| **D** | the interpolation carrier (D1 lean cell / D2 SoA) | **RE-POINTED by measurement**: D1 monomorphization is a measured non-win; **promote D2 SoA `Float64Array`**; B3 (color) and D2 (numeric) are the same SoA move on two carriers. MEASURE-FIRST, gate on real-K |
| **E1/E2** | `linear()`/`steps()` parsers | **RE-SCOPED DOWN**: kf's reader LANDED (E.W7 S5) → no longer a kf blocker; demotes to value.js DRY/round-trip completeness; the kf shim retires when E1 lands. E1 raised to MED-HIGH (`linear()` Baseline 2026-06-11) |
| **F3** | bounded LRU memo | Carried; the bound belongs on the value.js `memoize` PRIMITIVE (FIFO→LRU) — the terminal home for the `tryParseCache` chronic |
| **F4** | `@property` lossless syntax | **CLOSED by verification** — value.js stores the raw syntax string; kf registration is NOT lossy. Strike the "add if not" branch |
| **F7** | the `console.error` custom-name leak | Carried; the reorder fix (try the name-map before the speculative parse) is the bounded iso move; severity RE-SCOPED to LOW for the kf consumer |
| **§2 rename** | `AnimationOptions→CSSAnimationOptions`, `Color.L` | **DISCHARGED at 0.10.0** — kf imports neither name. STRIKE from the open ledger (C-2 EXITS the chronic band at F) |
| **VJ-F1** | path-geometry sampler (MorphSVG/DrawSVG/numeric-MotionPath enabler) | **NET-NEW** — MISSING from the E handoff; value-domain geometry |
| **VJ-F2** | structured parse-error sink (csstree `onParseError` shape) | **NET-NEW** — so kf can surface a `diagnostics` channel |
| **VJ-F3** | the `formatColor`/`lerpColorValue`/`Color.clone()` defects | **NET-NEW** — fold into Wave B precisely |
| **VJ-F4** | buffer-reusing `unflattenObjectToString` (VJS-2) | **NET-NEW** — the real MF-4 per-frame serialization garbage |
| **I2/I3** | WAAPI color un-reject (W9 S4); `currentColor`/`light-dark()` sentinels (W9 S6) | Carried + sharpened: the eligibility gate is a **4-clause HARD equality** (`color-interpolation-method` is NOT a settable property); resolve `light-dark()` against the **target's OWN computed `color-scheme`**, not `:root`. The kf eligibility lift is the paired FOLD (correctly NOT coded yet) |
| **contrast-color()** | Baseline Apr-2026, tri-engine | black/white-only — must NOT alias value.js's richer `safeAccentColor` |
| **WASM** | DECLINED, re-confirmed + STRENGTHENED (lightningcss-wasm's own marshalling tax; the win is pure-TS single-pass, already in-tree) | |

---

## BAND Z — THE CLOSE

### F-close — the F FINAL + the changeset + provenance
- Author `docs/tranches/F/FINAL.md` (the lead authors it; this is the DRAFT charter only).
- Cut the F changeset stacked atop **B `3.1.0` + C `major` + D `major` + E `minor`** — tier depends on what lands (the perf folds are isomorphic; the parsing round-trip fixes a WRONG value to right; the demo SHIPs are additive → likely **minor**, the version owner decides).
- **Commit the workflow provenance** (`F12`-retro/`a-tranche-retro-F §4`): the `wf-*.mjs` scripts (embedding the binding MANDATE) are UNTRACKED — committing them makes "how was this tranche produced" answerable from history. **SHIP-in-F (BOOK, low priority).**
- Re-name the version owner (Mike Babb, `mike@babb.dev`) — the publish leg stays USER-DOMAIN, confirm-first; the library legs gate-free; only the demo/dock legs gate on glass-ui 3.3.0 (D.W5, D's heartbeat — NOT F's scope).

---

## § The DAG (inter-wave dependencies)

```
                         ┌──────────────────────────────────────────────┐
                         │  Band 0 — VERIFICATION (LEADS)                │
                         │  F1 fix+author benches ──┐                    │
                         │  F2 CI proof:all         │  F3 proof:orch     │
                         └──────────┬───────────────┘──────┬─────────────┘
                                    │ (benches must run)    │ (gate exists)
            ┌───────────────────────▼──────────┐           │
            │ Band 1 — ENGINE PERF              │           │
            │ F4 dict-buffer+alias ─┐           │           │
            │ F5 sync-step (drive)  │ F6 cu-cache│          │
            └───────────────────────┘───────────┘           │
                                                             │
   ┌─────────────────────────────┐   ┌─────────────────────▼──────────────┐
   │ Band 2 — PARSING SEAM       │   │ Band 3 — ORCH + ARCH                │
   │ F7 serializer  F8 adapter   │   │ F9 Sequence transport ──┐           │
   │ (INDEPENDENT — parallel)    │   │ F11 arch folds (indep)  │ F10 dogfood│
   └─────────────────────────────┘   └─────────────────────────┘─────┬─────┘
                                                                      │ (transport+scene)
   ┌─────────────────────────────┐   ┌──────────────────────────────▼──────┐
   │ Band 4 — PLATFORM / SVG     │   │ Band 5 — DEMO DESIGN                 │
   │ F12 MotionPath (indep)      │   │ F14 undo  F15 a11y  F16 rail/hero    │
   │ F13 baseline adopts ────────┼──▶│ (F10's scene respects F16's idioms)  │
   │   (glass-ui H-1 gates VT)   │   │ (INDEPENDENT of engine bands)        │
   └─────────────────────────────┘   └──────────────────────────────┬──────┘
                                                                     │
   ┌─────────────────────────────────────────────────────────────────▼──────┐
   │ Band V — value.js charter v2 (HAND-OFF; sequenced by the vj owner;       │
   │   F6 pairs vj Wave C; F4-KILL hands vj Wave D; I2/I3 pair the kf FOLD)   │
   └─────────────────────────────────────────────────────────────────────────┘
                                       │
                              ┌────────▼────────┐
                              │ Band Z — CLOSE  │
                              └─────────────────┘
```

**Critical path:** `F1 → F4/F5/F6` (the benches gate the perf folds). **Parallelizable:**
Band 2 (parsing) and Band 5 (demo) share no surface with Band 1 (engine) and can run
concurrently. **Cross-band coupling:** F10's dogfood scene (Band 3) lands a demo scene that
should respect F16's promoted rail/ball idiom (Band 5); F13's VT adopt gates on the glass-ui
`types` helper (H-1). **Band V is orthogonal** — kf consumes through the unchanged
`lerpValue` seam; F6/F4-KILL/I2/I3 each pair a value.js wave but require ZERO kf edits to
land the kf half independently.

---

## § Honest provenance — net-new vs folded vs already-SOTA

**Net-new (the F content):** every SHIP/MEASURE-FIRST/BOOK above is a post-E assay finding —
either a net-new gap or an E withhold RE-MEASURED. The two graduated withholds (F4) are the
single largest measured per-frame win in the engine; they were correctly withheld by E
(`E/FINAL.md:40-43`) and now carry the live-engine number E lacked.

**Folded chronic debt: NONE.** P-invariant-28 is vacuous for F — D was the terminal home;
the deferred ledger is CLEAN (zero KFE). F manufactures no fold of inherited keyframes-owned
debt (`a-tranche-retro-F §1/§7`, `_SYNTHESIS-deferred-ledger §0`). Of the 6 chronic items,
**C-2 (the `AnimationOptions` rename) EXITS the band at F** (discharged by the 0.10.0 pin),
**C-1 (the value.js charter) is chronic-by-design**, and the rest are value.js-gated,
half-landed, or a gated decision F should take (the library line-ceiling).

**Already-SOTA — F refuses to touch (§7).** Stated plainly so no wave manufactures a deficit.

---

## § ALREADY-SOTA — the bulk; manufacture NO work (binding per the §Mandate)

Every lane independently confirms these are exemplary and must NOT be re-touched
(`_SYNTHESIS-gap-scorecard §3`, `a-engine-post-e §ALREADY-SOTA`, `a-boundary-arch-F
§ALREADY-SOTA`, `r-cwv-inp-2026` headline):

- **The engine kernel** — binary-search seed + contiguous-neighbor scan, pre-resolved monomorphic `_lerp` over pre-flattened `allInterpVars`, zero-width snap, the zero-alloc `_interpOut` buffer + `processFrame` (the residue is only F4's clear-mechanism, not allocation).
- **The interpolation core** — `NumericAnimation`'s zero-alloc SoA leads Motion/GSAP/anime; in-place `value.value` mutation + serialize-only-at-write-boundary.
- **The spring/decay/drag analytics** — closed-form 2nd-order ODE with live re-seat, `{visualDuration, bounce}`, analytic `decay`/`decayRest`, `Draggable`'s windowed velocity + C¹ fling, stall-robust by construction.
- **The WAAPI harness** — the easing-faithfulness gate, commit-on-finish lifecycle, dense sub-segment sampling, the var/calc/computed rejection (correct by reasoning), the additive native ScrollTimeline/ViewTimeline bridge with the ARCH-kill held, `@property` registration, live reduced-motion.
- **The orchestration tier (E.W10)** — stagger/flip/drag/decay/Sequence/animate, value.js-free on the LIGHT boundary (modulo F9 transport-finish + F10 dogfood + F3 gate).
- **The FrameCompiler** — the clock-free value-in→frames-out split, compile-once pre-flatten, O(log N) seed, monomorphic mint, content-derived idempotent ids, targeted color re-normalize; at the industry frontier for its scale.
- **The value.js boundary** — the barrels are GONE; kf reaches the whole heavy surface through the single `lerpValue → iv._lerp` seam, so value.js can land all of Wave B/C/D with ZERO kf edits; `proof:boundary` self-enforces.
- **The modern-web demo surface (E.W4/W9/W11)** — View Transitions (PE+a11y+PRM), `@starting-style`, `content-visibility:hidden` Monaco cache, the all-four-scenes background pause, the Capsize font-CLS fallback, `yieldToMain`/LoAF/bf-cache. No FOLD-in-F CWV wave to manufacture.
- **The value.js color science** — full L4/L5 surface (15 spaces, RCS, color-mix, Kelvin), `shorter`-hue default matching CSS Color 4 §12.4, the analytical Ottosson OKLab gamut map (AHEAD of shipping browsers).
- **The parse-that fast tier** — `dispatch` LUT, zero-alloc leaves, the complete hand-written `parseSingleValue` reader, identity-keyed result memo. The gap is value.js's NON-adoption, not the engine.
- **The test bite-discipline** — vitest behaviour-locks with named negative controls, the LoAF playwright gate, the orchestration-tier behavioural tests, zero `.skip`/`.todo`. The gap is the CI seam (F2), not the bite.
- **The process** — the retro→discharge cadence, the clean deferred ledger, the 405-line inv-16 charter, the measure-first withholds (the `d3-changed-keys.measure.test.ts` gold standard).

---

## § The honest bottom line (for the lead)

F is **net-new and narrow**. The **engine-perf band (F4+F5+F6)** is the single largest
measured per-frame win in the engine, every item an E withhold the F lanes re-measured on
the live engine (3.8–6.2×, three independent re-measures, pixel-identical). The **parsing
band (F7+F8)** closes silent data-loss holes where value.js already hands kf the data. The
**verification band (Band 0)** unblocks every measure-first instrument and closes the two
gate-coverage asymmetries the retro named. The **orchestration+arch band (Band 3)** finishes
and dogfoods the un-gated E.W10 tier. The **demo band (Band 5)** completes the surfaces W11
reached partway. The **value.js charter (Band V)** is sharpened, re-pointed by measurement,
and pruned of two discharged items. The **platform/SVG band (Band 4)** addresses the one
real competitor-feature gap, mostly booked behind the value.js path-geometry hand-off.

Everything else — the kernel, the spring, the WAAPI harness, the compiler, the boundary, the
modern-web demo, the color science, the parse-that tier — is **ALREADY-SOTA and left alone**.
The W8 FrameCompiler-SoA + incremental withhold **HOLDS, re-measured with the numbers the
BOOK lacked**. **F proves itself net-new by what it leaves untouched as much as by what it
ships.**

---

## inv-16 / inv ε compliance

This charter draft wrote ONLY `docs/tranches/F/F-CHARTER-DRAFT.md` — ZERO source edits to
keyframes.js or value.js. Every claim traces to a named phase-1/synthesis lane (cited inline)
or a `file:line` against the live `tranche-e-impl` tree (the broken-bench type-only export at
`src/animation/index.ts:108`; the dict-mode buffer at `engine.ts:573`/`group.ts:212`; the
serializer asymmetry at `format.ts:105-151` vs `engine.ts:1089-1096`). Every value.js item is
a HAND-OFF the value.js owner sequences (inv-16). This is a **DRAFT** for the team lead to
refine into the final `F.md` — it is NOT the final F.md.
