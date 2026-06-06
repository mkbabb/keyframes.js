# Tranche-retro F — the honest D+E process retrospective

**Lane:** `a-tranche-retro-F`. **Scope:** retro on the **D+E tranche process +
outcomes** — what landed cleanly, what was withheld (honest measure-first vs
avoidance), the gate quality (13 `proof:*` gates + the test corpus), the
orchestration (workflows), the cross-repo discipline (inv-16). **Method:** the
two closed FINALs (`docs/tranches/E/FINAL.md`, the D close in
`8ff893f`/`a0303fe`), the consolidated deferred ledger, the value.js hand-off,
the live committed source (`src/animation/**`, `scripts/proof-*.mjs`,
`test/**`), and the git history — every claim `file:line` or `commit`-grounded.
**Diff target:** `docs/tranches/E/audit/sota/a-tranche-retro.md` (the pre-E A→E
retrospective).

**inv-16 / inv ε:** this is an audit doc only — zero source edits. Every code
claim cites a path/line/commit; every disposition is tagged. value.js items are
HANDOFF, never writes.

**Disposition legend:** `SHIP-in-F` · `MEASURE-FIRST` · `BOOK` · `KILL` ·
`RECORD` · `value.js-HANDOFF`.

---

## 0. Headline verdict — the process is healthy, and E discharged its own retro's #1 projection

**The single most important retro fact: the A→E retrospective
(`a-tranche-retro.md`) named the missing ORCHESTRATION LAYER as the highest-ROI
residual gap (F-1 stagger … F-8 presets, §3.1 + §6 disposition map) — and E
DELIVERED IT in the same tranche.** W10 (`4ee8e34`) shipped `stagger`
(`src/animation/stagger.ts`), `flip`/`flipShared` (`flip.ts`), `drag`/`Draggable`
+ `decay`/`decayRest` (`drag.ts`, `decay.ts`), the `Sequence` temporal
orchestrator (`sequence.ts` — named to not shadow the published `Timeline`, the
exact name-collision the retro flagged at `a-tranche-retro.md:111`),
`SpringProgress.fromDuration`, and the single-call `animate()` front door
(`animate.ts`). All six files are TRACKED + committed (`git log -1` →
`4ee8e34`), the working tree carries zero uncommitted source.

This is the **honest, exemplary** outcome: a predecessor retro's projected gap
map was not deferred onward — it was largely closed in the next tranche, with
the API-design BOOK (the `Timeline`/`Sequence` name collision the retro
demanded, `a-tranche-retro.md:111`) actually honored in the naming. **F should
NOT re-table F-1…F-5 as open gaps** — they landed. The F `r-anim-libs-2026`
brief already encodes this correction ("E shipped the orchestration tier").

**What this means for F's retro discipline:** the project's tranche cadence is
working as designed — assay → retro-projection → next-tranche discharge — and
the retro projections are being honored, not perpetually re-deferred. The one
caution below (§3) is gate-coverage, not delivery.

---

## 1. What landed cleanly (D + E)

| Surface | Landed | Commit | Clean? |
|---|---|---|---|
| Engine gestalt transposition (`FrameCompiler` seam split, zero-alloc group, `advanceTo` driver) | D.W4 | `a0303fe` | YES — `frame-compiler.ts` (390L) is a real seam, not a facade |
| 5 engine correctness bugs (colorSpace no-op · createFrame index · 2× WAAPI guards · `linear()` read-back) | E.W7 | `a7f6746` | YES — pixel-locked in `test/engine-correctness.test.ts` (a `proof:*` gate) |
| Standalone zero-alloc (hoisted buffer + `processFrame`) | E.W7 | `a7f6746` | YES — `test/standalone-zero-alloc.test.ts` gate |
| `FrameCompiler` determinism (content-derived `frameId`) + editor single-compile | E.W8 | `050204f` | YES — `test/compile-deterministic.test.ts` gate |
| Modern-platform adoption (`@property`, PRM, WAAPI fidelity, native-scroll bridge) | E.W9 | `4ee8e34` | YES — `test/platform-adopt.test.ts` + `proof:platform-adopt` (17 tests + 6 source clauses) |
| **The orchestration tier** (stagger/flip/drag/decay/Sequence/animate) | E.W10 | `4ee8e34` | YES on delivery; **see §3 for the gate gap** |
| Demo elevation (VT scene-nav · a11y uniformity · idiom r3 · first-paint · CWV) | E.W11 | `d400591` | YES — `proof:demo-elevate` (5 clauses) |
| Monaco defer · render-loop yield · font preload · modern-web checklist | E.W4 | `663805e` | YES — `proof:modern-web` (7 clauses) |

The arc is net-additive and gate-backed. The deferred ledger
(`deferred-ledger.md`) is genuinely CLEAN — **zero KFE rows**, P-invariant-28
satisfied (D was the terminal home for all chronic debt; E manufactured none).
This is verified, not asserted: I re-walked the ledger and found no row that
folds a chronic deferral into an E wave.

---

## 2. The withholds — HONEST measure-first, with one gold-standard artifact

E recorded four withholds (`FINAL.md:39-60`). The retro question is: honest
measure-first, or avoidance dressed as discipline? **Verdict: honest** — and one
withhold carries a re-runnable proof that sets the bar.

### 2.1 — The gold standard: `test/d3-changed-keys.measure.test.ts`

The D-3 "changed-keys write-skip" transposition (cache last-written style per
key, skip `setProperty` when unchanged) was withheld. It is not withheld by
narration — it is withheld by a **committed, re-runnable measurement**
(`test/d3-changed-keys.measure.test.ts:1-50`) that sweeps a 60fps interpolation
and records the unchanged-key fraction, proving the keyframes-local win is **~0**
("every interpolating key changes every frame", docstring `:9-18`). **This is
the exemplar of measure-first vs avoidance** — the withhold is falsifiable and
the measurement is in the suite. F should treat this as the template for every
"withheld pending measurement" disposition. **Disposition: RECORD (the bar).**

### 2.2 — The other three withholds (honest, but bench-debt accrues)

- **W7 Strand-B micro-perf** (per-frame DOM write-skip, async fast path,
  delete-loop→stable-key, preset memo): withheld as "unmeasured costs"
  (`FINAL.md:42-44`). Honest framing — but unlike D-3, these three have **no
  committed measure artifact**. The delete-loop dict-mode deopt in particular
  (`r-v8-cost-model` lane territory; `engine.ts` interpFrames + `group.ts`) is a
  *known* V8 cost with no bench. **Disposition: MEASURE-FIRST** — F should
  author the shaped `interpolation.bench.ts` variants the F `a-runtime-remeasure`
  / `p-runtime-perf-F` lanes call for, so the withhold either lands on a
  demonstrated win or gains a D-3-style proof. The withhold is honest; the
  *bench debt* is the residual.
- **W8 SoA / incremental** (typed time index, slot map, incremental
  `updateSegments`): withheld because "the literal `Float64Array` form is awkward
  against the shared `binarySearchRange`" and "incremental complexity is
  unjustified at the demo's small stop-counts" (`FINAL.md:46-49`). Honest
  reasoning grounded in the real workload — but again no committed bench against
  an editing-session profile. **Disposition: MEASURE-FIRST** (the F
  `a-framecompiler-remeasure` lane re-opens it with a shaped plan; note
  `proof:compile-incremental` is named as the future byte-equality contract,
  `FINAL.md:48-49`, which is good forward-discipline).
- **`tryParseCache` eviction + lighthouse-off-CI**: both correctly withheld
  (small working set; sandbox CPU contention inflates lighthouse scores —
  `FINAL.md:50-54`). The lighthouse gate is *authored + CI-calibrated*
  (`KF_REQUIRE_LH=1`); refusing to assert an unmeasured win off-CI is the
  §Mandate working. **Disposition: RECORD** (correct non-action).

**Honest summary:** zero withholds read as avoidance. Three of four lack the
committed-measurement rigor that D-3 demonstrates is *possible* — that is the
honest gap, and it is a bench-debt gap, not a discipline failure.

---

## 3. Gate quality — the gates BITE, with two coverage asymmetries

The 13-gate claim (`FINAL.md:86-94`) checks out: 10 `proof-*.mjs` scripts +
3 vitest-backed proof targets (`zero-alloc`, `engine-correctness`,
`standalone-zero-alloc`, `compile-deterministic`) wired into `proof:all`
(`package.json`). I confirmed the bite mechanism is real (e.g.
`proof-brittleness.mjs:452` `process.exit(1)`; the decomposition gate prunes
dead overrides, `proof-decomposition.mjs:206-212`). These are instruments, not
narration — inv ε holds. **But two coverage asymmetries are the honest gate
findings F should address:**

### 3.1 — The orchestration tier shipped WITHOUT a named `proof:*` gate

The W10 tier has unit tests (`test/{stagger,flip,drag,sequence,animate}.test.ts`
exist) — but **no `proof-*.mjs` script references stagger/flip/drag/sequence/
animate** (grep over `scripts/proof-*.mjs`: zero hits). The tier runs only under
the bare `vitest run` at the tail of `proof:all`. Compare: every *other* E
surface got a *named* biting gate (`proof:engine-correctness`,
`proof:standalone-zero-alloc`, `proof:compile-deterministic`,
`proof:platform-adopt`). The FINAL itself states the orchestration proof is only
"unit tests + `proof:boundary`" (`FINAL.md:79`) — i.e. the *boundary* (light
helpers carry value.js:0) is gated, but the **orchestration BEHAVIOR is not a
named gate**. This is the single biggest gate-quality gap from E: the
highest-profile new public API has the weakest gate posture.
**Disposition: SHIP-in-F** — author `proof:orchestration` (the value.js-free
boundary clause already partially covered by `proof:boundary`; add the
stagger-distribution / FLIP-rect / decay-rest / Sequence-ordering behavior
clauses as biting instruments). Low cost, closes the asymmetry.

### 3.2 — The library is EXEMPT from the line-ceiling gate the demo lives under

`proof:decomposition` enforces a 350L `.vue` / 250L `.ts` ceiling — but only
over the **demo** (`ceilingSources` = `animation-controls/** + demo/app/** +
orbital-drag/**`, `proof-decomposition.mjs:151-158`). It does **not** sweep
`src/animation/**`. Consequence: `engine.ts` is **1179 lines**
(`wc -l src/animation/engine.ts`), with the `Animation` class spanning
`engine.ts:80-994` (~914L) and `CSSKeyframesAnimation` `:995-1179`. The D.W4
split created the `FrameCompiler` seam but the `Animation` god-object remains
near-1000L and grew unconstrained by any gate — the W4 "ceiling raised to 950"
note (F `a-engine-post-e` brief) is a *demo-style* discipline that the library
file is not actually held to by a `proof:*` gate. **This is the honest
asymmetry: the demo is decomposition-gated; the library is not.**
**Disposition: MEASURE-FIRST → BOOK** — F should DECIDE (not reflexively split):
extend the decomposition ceiling to `src/animation/**` OR record an explicit,
gated exception with rationale. A 914L `Animation` class may be the right
cohesion boundary (it is the public surface), but the *absence of a gate
deciding that* is the gap. Pair with the F `a-engine-post-e` lane's "is a
further split warranted" question — the answer should be a gated decision, not a
silent drift.

### 3.3 — Gate bite is otherwise genuine (ALREADY-SOTA, do not manufacture)

The inject-to-redden discipline is real and documented per gate
(`proof-brittleness.mjs:166` documents the inject-once pattern; each gate's wave
spec carries a bite-proof per `FINAL.md:94`). The honest-withhold for lighthouse
(CI-gated, not asserted off-CI) is the §Mandate's spine working. **Do not
re-litigate the bite quality — it is exemplary.** The findings are §3.1 (a
missing named gate) and §3.2 (a coverage boundary), not narration-gates.

---

## 4. Orchestration (the workflows) — disposable, un-versioned, but transparent

The tranche orchestration is workflow scripts (`docs/tranches/*/wf-*.mjs`) —
e.g. `docs/tranches/F/wf-audit.mjs` (the 27-lane + 5-synth fan-out I am running
under). Retro observations, grounded:

- **The workflows are UNTRACKED.** `git status` shows every `wf-*.mjs`
  (`docs/tranches/D/wf-*.mjs`, `docs/tranches/E/wf-*.mjs`,
  `docs/tranches/F/`) as `??` — untracked working-tree files. The *provenance*
  of how each tranche's audit/dev/finalize was orchestrated is therefore **not
  in git history** — only the resulting commits + docs are. This is honest in
  the sense that the *outputs* are committed and gated, but the *process
  artifacts* (the exact agent fan-out, the mandate text each lane ran under) are
  ephemeral. **Disposition: RECORD / BOOK** — F could commit the `wf-*.mjs`
  scripts (they ARE the reproducible-process record, and `wf-audit.mjs` embeds
  the full binding MANDATE at `:10-47`). Committing them makes the
  "how was this tranche produced" question answerable from history. Low
  priority, but it is the one provenance gap.
- **The fan-out is well-shaped.** `wf-audit.mjs:111-120` runs chunked batches of
  5 (rate-limit-aware), each lane gets the identical binding MANDATE +
  GROUNDING (`:10-47`), and the phase-2 synthesis lanes are instructed to READ
  every phase-1 doc first (`:91-97`) — deduplicate, not repeat. This is good
  orchestration design: parallel where independent, sequential where dependent,
  grounding-first to avoid re-derivation. **ALREADY-SOTA on design.**
- **The lane-id → doc mapping is 1:1 and disposition-tagged** (each lane writes
  exactly `docs/tranches/F/audit/<id>.md`, inv-16 single-file discipline). The
  15 F audit docs already on disk confirm the fan-out is executing as specified.

---

## 5. Cross-repo discipline (inv-16) — sound, with the ONE chronic the A→E retro already named

The A→E retro's §4.3 named the single chronic cross-repo item: the **kf↔vj
consumption seam** (XR-1 — pin drift + the `AnimationOptions →
CSSAnimationOptions` rename + the `Color.components.get → Color.L` migration +
the precept-pin divergence), filed five times by value.js, never owned by
keyframes because inv-16 binds it from both directions
(`a-tranche-retro.md:209-239`, `:304`). **This status is UNCHANGED post-E** —
and that is *correct*, not a failure:

- The pin is `@mkbabb/value.js ^0.10.0`; value.js is dirty + active (tranche M
  open per `valuejs-sota-handoff.md:18,396`). The retro's disposition was
  "FOLD-E when vj v1.0.0 publishes" — vj has NOT published v1.0.0, so the
  seam-reconciliation correctly did not trigger in E. **Honest non-action.**
- E *grew* the hand-off rather than closing the seam: `valuejs-sota-handoff.md`
  (405 lines) is the disciplined inv-16 artifact — Waves A-F of value.js
  proposals (parse fast-tier, color hot-path serializer, the computed-unit D-3
  win, the interp carrier, easing parsers, surface hygiene), each with a
  falsifiable gate + isomorphism note + the cross-repo edge. This is the model:
  keyframes **proposes** (the 405-line charter) and **never writes** value.js.
- **The W9 S4/S6 needs-handoff items** (native CSS Color L4 WAAPI interp needs
  `cssColorInterpKeyword` + L4 serializer; `currentColor`/`light-dark()` needs
  parser sentinels — `FINAL.md:56-60`) are correctly RECORDED as value.js-blocked
  and E did not block on them. inv-16 held.

**Disposition: value.js-HANDOFF (carry the charter forward) + RECORD (XR-1 still
correctly parked on vj v1.0.0).** F should NOT manufacture a seam-reconciliation
before vj publishes — but F SHOULD (a) re-verify the pin is still current against
the published vj surface (the retro's `Color.L` / `AnimationOptions`
name-collision audit, `a-tranche-retro.md:220-227`, is a cheap behavior-neutral
check the existing test suite + `proof:boundary` already backstop), and (b)
augment the 405-line hand-off into the v2 the F `_SYNTHESIS-valuejs-handoff-v2`
lane is producing. The cross-repo discipline is **exemplary** — it is the one
genuinely SOTA-grade process invariant in the constellation.

---

## 6. What F should do BETTER (the actionable retro)

1. **Gate the orchestration tier (§3.1).** SHIP a named `proof:orchestration`.
   The highest-profile E public API has the weakest gate posture — close it.
2. **Decide the library line-ceiling (§3.2).** Either extend
   `proof:decomposition` to `src/animation/**` or gate an explicit exception for
   the 914L `Animation` class. The demo-vs-library decomposition asymmetry should
   be a *gated decision*, not silent drift.
3. **Pay the bench-debt on the W7/W8 withholds (§2.2).** Three of four withholds
   are honest but lack the committed `d3-changed-keys.measure.test.ts`-style
   artifact. F's `a-runtime-remeasure` / `a-framecompiler-remeasure` /
   `p-*-perf-F` lanes should produce them — so each withhold either lands on a
   measured win or gains a re-runnable proof of its non-win. Match the D-3 bar.
4. **Commit the workflow provenance (§4).** The `wf-*.mjs` scripts are the
   reproducible-process record (the binding MANDATE is embedded in them); they
   are untracked. Committing them makes "how was this tranche produced"
   answerable from history. Low priority.
5. **Do NOT re-table the orchestration gaps as open (§0).** F-1…F-5 from the A→E
   retro LANDED in W10. F's gap scorecard must start from the post-E state, not
   re-derive the pre-E projection. (The F brief already encodes this — hold the
   line.)
6. **Carry, don't close, the value.js seam (§5).** XR-1 correctly waits on vj
   v1.0.0. Augment the hand-off charter (v2); do not manufacture a premature
   reconciliation.

---

## 7. What is ALREADY-SOTA in the process (manufacture no work)

State this plainly, per the mandate:

- **The honest-close discipline (inv ε)** — every MET gate is a re-runnable
  instrument's passing run, not a claim. D-3's committed measurement
  (`d3-changed-keys.measure.test.ts`) is the gold standard the field rarely
  reaches. **Exemplary.**
- **The clean deferred ledger (P-invariant-28)** — zero KFE, D as terminal home
  for all chronic debt, E manufactured none. Verified row-by-row. **Exemplary.**
- **inv-16 cross-repo discipline** — the 405-line hand-off charter is the model
  of "propose, never write" cross-repo boundary management. **Exemplary.**
- **The retro→discharge cadence** — the A→E retro's #1 projected gap
  (orchestration) was delivered in the next tranche, with the flagged API-design
  caveat (the `Timeline`/`Sequence` name collision) actually honored. The
  assay→project→discharge loop works. **Exemplary.**
- **The workflow fan-out design** — chunked, grounding-first, single-file-per-lane,
  synthesis-reads-all. **Exemplary on design** (only the un-tracked provenance,
  §4, is the nit).

**The honest retro:** D+E is a healthy, gate-backed, measure-first arc that
discharged its own predecessor-retro's top projection. The residuals are
**gate-coverage** (orchestration un-gated, library un-ceilinged) and
**bench-debt** (three withholds lack committed measurements) — NOT delivery
failures, NOT avoidance, NOT chronic debt. F's job on this axis is to close two
gate gaps and pay the bench-debt, not to rescue anything.
