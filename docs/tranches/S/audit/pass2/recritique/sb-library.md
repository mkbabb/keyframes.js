# RE-CRITIQUE (Pass-2) — sb-library (Band S.B)

**Verdict: CONVERGED — 100%.** All 9 Pass-1 blocking edits (SB-1..SB-9) are absorbed in the v3 band
text (not merely claimed in §9); every probe adjustment for this band (p01/p02/p03/p07) is folded; and
the v3-introduced EN-a/EN-b hoist into S.B3 (C-25) + the `declaredKeyframeBodyFor` reversal (fold row
58) introduce **no admissible cross-band collision**. Blocking list is empty.

---

## Part A — the v3-introduced change I was told to scrutinize (admissibility clause ii)

### A.1 The EN-a/EN-b hoist carries its born-RED gates in the B3 wave text — VERIFIED

The mandate: check B3 wave text carries the browser-parse clause (EN-a) and the `bodyByStop` clause
(EN-b). Both are present verbatim in §3 S.B3:

- **EN-a browser-parse clause** (line 624-627): *"Fix: registry name → its CSS twin … the universal
  fallback is a `linear()` densify of the callable); throw preserved for twinless closures. ~3 files.
  **Born-RED gate clause: a browser-actuated parse of an emitted `easeOutCubic` artifact (computed
  `animation-name !== none`)** — the kf-parser round-trip structurally cannot catch this … so the
  clause is browser-harness by necessity."* Matches P2-2 §EN-a (p2-2 line 283) exactly.
- **EN-b `bodyByStop` clause** (line 630-633): *"Fix: thread the densify through `keyframesBlock`'s
  `bodyByStop` (merge color stops WITH the declared non-color declarations) per `format.ts:212-222`'s
  own design. ~3–4 files. **Born-RED gate clause: a mixed `opacity+color` compile artifact contains
  BOTH properties.**"* Matches P2-2 §EN-b (p2-2 lines 285-288) exactly.
- Both re-stated in the wave's rolled-up Gate line (line 636-638): *"+ the EN-a browser-parse clause
  and the EN-b mixed-artifact clause."*

Line references in the band text (`format.ts:43-58` EN-a; `backward.ts:289-293` EN-b;
`format.ts:212-222` for the `bodyByStop` design) reproduce the P2-2 probe's measured anchors
(p2-2 lines 152, 158, 164-167). Not misrepresented.

### A.2 The `declaredKeyframeBodyFor` deletion reversal is REAL and consistent

- Band text (line 615-617): *"**REVERSED (C-25):** `declaredKeyframeBodyFor` is NOT deleted — a18
  F3's 'likely-dead' call is overturned by P2-2; the export becomes the EN-b/EN-c load-bearing
  substrate."*
- Ruling C-25 (line 430-432) and fold row 58 (*"REVERSED at Pass-2 … the export is the EN-b/EN-c
  load-bearing substrate; constructed, not deleted"*) agree.
- Grounded in the probe: P2-2 F1/F5 measured `declaredKeyframeBodyFor` live-consumed at `format.ts:223`
  as the per-stop body substrate (p2-2 lines 45, 62, 118). The a18-F3 "dead" call is genuinely
  overturned by evidence, not asserted. The reversal is *required* — F3/EN-c projects endpoint bodies
  from this export; had B3 deleted it (v1's item), S.F3 would break. The reversal RESOLVES a would-be
  collision rather than creating one.

### A.3 Cross-band collision scan — NONE admissible

I checked every seam the hoist touches against every other band:

1. **B3 ↔ S.F3 (the collision C-25 exists to prevent).** EN-a edits `serializeEasing`
   (`format.ts:43-58`); EN-b edits the `compileChild`/densify region (`backward.ts:289-293`). S.F3/EN-c
   is a **new file** (`compile/entry.ts`) that *reads* the twin-fixed `serializeEasing` and
   `declaredKeyframeBodyFor` — it does not re-edit `backward.ts`/`format.ts`. So the hoist eliminates
   the double-edit that would exist if EN-a/EN-b lived in F3. The stated DAG edge **S.B3 → S.F3/EN-c →
   EN-d** (line 429-430; DAG line 1280) is *additive* — it breaks no pre-existing edge (the B chain
   B1→B3→B4→B5 and S.B2/B3→S.F1 are untouched).

2. **EN-b `bodyByStop` densify ↔ a18 F4 color-ramp hoist.** Both mutate the same
   `backward.ts` densify region, but **both are B3-internal, same commit** — and C-25(i) names this as
   the reason to co-home them (line 424-426: *"S.B3 already rewrites the exact seams (`backward.ts`'s
   compileChild/densify region via the a18 F4 color-ramp hoist)"*). Co-homing prevents the double-edit;
   it does not create one.

3. **`format.ts` move ↔ EN-a/EN-b edits.** B3 moves `format.ts` into `compile/backward/` (line 609)
   AND applies the EN-a serializeEasing fix + EN-b thread in the same wave. One wave, one commit — not
   cross-band. (C-2's "the two easing files stay flat" refers to the easing-registry/easing-option
   files, not the backward `format.ts` — no conflict.)

4. **T7 fixture co-edit.** EN-a/EN-b change emit → `proof:compile-replay`/`compile-deterministic`
   fixtures co-edited in B3's commit (line 634-635). No other band edits these compile fixtures
   (S.B5 carves `frame-compiler.ts` for line-count only; S.F3 has its own `proof:entry-roundtrip`
   fixtures). No cross-band fixture double-edit.

5. **`frame-compiler.ts`.** B3 deletes the re-export bridges *in* frame-compiler (line 610-611); S.B5
   later carves it (line 657). Sequenced B3→B4→B5 — pre-existing arrangement, untouched by the EN
   hoist (EN-a/EN-b live in `backward.ts`/`format.ts`, not `frame-compiler.ts`).

**Conclusion:** the hoist is coherent; no DAG edge is broken by an absorbed edit; no new v3
contradiction is introduced. Nothing admissible under clause (ii).

---

## Part B — Pass-1 blocking edits, verified absorbed in band text (clause i check)

| # | Pass-1 edit | v3 absorbing line(s) | Real? |
|---|---|---|---|
| SB-1 | FSM gate → "no field DECLARED on class body; accessors only"; single-STORAGE | S.B2 line 606-607 *"the honest FSM clause — 'no FSM transition field is DECLARED on the class body (accessor delegates only)' (plant a class-body field declaration → RED)"*; line 591 *"the sole backing store; the class exposes 8 accessor delegates"*; C-15 line 353 *"single-STORAGE, not single-writer"* | ✅ |
| SB-2 | Strike "animation.ts shrinks" | S.B2 line 596 *"v1's 'animation.ts shrinks' is STRUCK — the delegate fold **grows** the class 442→455L"* | ✅ |
| SB-3 | Pull animation.ts(499)/playback.ts(498) carves forward B5→B2; state in DAG | S.B2 line 597-599 *"the … ceiling carves are pulled FORWARD from B5 into B2 … B2 precedes B5 in the DAG"*; S.B5 line 655 *"The animation.ts/playback.ts carves moved to B2"*; DAG line 1279; fold row 33 | ✅ |
| SB-4 | Enumerate 9-script/10-site co-edit; gate on proof:all | S.B2 line 586-591 enumerates proof-engine recursive + `nan-frame/processframe-soa/soa-composite`, `replay-equality/diagnostics-channel/composition-honored`, `platform-adopt`, `no-silent-fallback`; *"B2 is gated on `proof:all`, not the Q1 subset"* | ✅ |
| SB-5 | RULE element-resolve.ts → resolve/ | S.B2 line 600 *"element-resolve.ts RULED → `resolve/` (its own header votes it — a17 F5; no in-wave open decision)"* | ✅ |
| SB-6 | Redefine mirror gate → runtime ⊆ d.ts TYPE keys | S.B6 line 669-673 *"proof:engine-subpath-mirror asserts runtime keys ⊆ the AnimationEngine d.ts TYPE key list … a runtime-vs-runtime Object.keys() diff is vacuous once the loader sources from the same import"* | ✅ |
| SB-7 | Decouple gate from loader collapse; record cost | S.B6 line 673-679 *"The loadAnimationEngine → import('./engine/public') collapse is DECOUPLED and demoted to an owner-recordable option … ONE 97.32 kB engine chunk … 23→5 dist files"*; §6.3 line 1485-1490 | ✅ |
| SB-8 | File-level B1 gate; 10 light repoints; correct "~55" | S.B1 line 576-583 *"the **10 mandatory light repoints** … the 38 heavy importers keep the barrel … v1's '~55 consumers repointed' was ceremony overcount — corrected. Gate: proof:boundary + a **FILE-level clause**: any non-`import type` import line in `constants/types.ts` REDs"* | ✅ |
| SB-9 | Book hard single-writer fold as future BREAKING, out of S | C-15 line 357-359 *"booked as a FUTURE BREAKING wave (34 files; requires a public `seek(ms)` verb + MIGRATION … ) — explicitly out of S scope (§8)"*; §8 recorded-future item 3 (line 15-17: *"107 test sites + the demo contract-anim writes + a public `seek(ms)` verb + a MIGRATION doc; do only behind the `seek()` surface"*) | ✅ |

All five Pass-1 deductions (−15 FSM gate, −15 mirror gate, −10 co-edit, −10 ceiling contradiction,
−10 element-resolve) are eliminated by real band-text changes, not table claims.

## Probe adjustments for this band — folded

- **p01 (engine/css)** → C-1 + S.B2 (10-site/9-script; proof:all). ✅ (§6.1 Q1, index line 1790)
- **p02 (PlaybackState)** → C-15 + S.B2 (single-STORAGE; growth acknowledged; carves forward) + §8-3
  (hard fold). ✅
- **p03 (constants)** → S.B1 (10 repoints; file-level gate). ✅
- **p07 (loader-unify)** → S.B6 (type-diff gate) + §6.3 (collapse = owner option; 97.32 kB recorded).
  ✅
- **P2-2 (Pass-2 residual, EN-a/EN-b discovery)** → C-25 / §3 S.B3 / fold rows 58, 73, 74. ✅ (Part A)

---

## Non-blocking polish (does NOT affect score)

1. B3's rolled-up Gate line is dense (six clauses in one sentence). At impl-authoring it may read more
   cleanly as an itemized list, but it is complete and falsifiable as written.
2. B3 header labels the wave "Mode: REWRITE" and lists EN-a as "XS" / EN-b as "S" inline; the sizing is
   consistent with p2-2 (EN-a ~3 files, EN-b ~3-4 files) — no action needed, noted for the impl
   estimate.
3. The §6.3 B6 version-ruling inputs (`=any → =Vars` narrowing; 126-private strip) are correctly
   pre-booked owner rulings with a recorded additive-minor default landing at S.Z3 — per the binding
   scoring clarification (a) these are NOT open design uncertainties and draw no deduction.

---

## Score

Pass-1: 64% (base 124, −60 across five defects). Every one of those defects is closed by a verified
band-text change; the v3-introduced EN-a/EN-b hoist + reversal is coherent and collision-free; both
born-RED gates are carried in the B3 wave text; blocking list is empty.

**convergence_pct = 100.** Empty blocking AND every Pass-1 edit verified absorbed — the rubric's two
conditions for 100 are both met.
