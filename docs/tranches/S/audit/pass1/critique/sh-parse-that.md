# Critique — Band S.H (parse-that dispatch)

**Agent:** adversarial critique · **Band:** S.H (H1 packrat arming · H2 1.0.0 cut + chain fix ·
H3 Pratt DEVELOP-only · H4 ledger closure + re-pin) · **Date:** 2026-07-02
**Probe evidence for this band:** p11-packrat-arming.md (VERDICT confirms-spec: 14–18% throughput,
~34% retained heap, above the 5% floor). **Grounding reads:** parse-that `parser.ts:124-140`,
`packrat.ts:189-244`, `test/dist-surface.test.ts:52-60`; value.js `.chain` call-sites; r6 lane.
**Convergence: 50%.** Headline is rock-solid and probe-confirmed; five edits gate authorization,
one of them a genuine design decision (chain semantics).

---

## 0. What the spec got RIGHT (credited, so the deductions read fairly)

- **The born-RED gate for H1 is heap-based, and that is the correct choice.** Probe p11 §4
  refinement 1 (p11:186-190) explicitly warns AGAINST a throughput-% threshold gate — the %
  is workload-dependent (F2 mid-teens on short values, F5 1.64% on long strings), while retained
  heap is "the robust, grammar-independent signal." SPEC-v1 S.H1 already gates on retained-heap
  flat, NOT on a %. The probe **confirms the spec's existing gate choice** — do not add a % gate.
- **`proof:no-span-surface` is a genuine born-RED, falsifiable, runtime gate.** `dist-surface.test.ts:52`
  today asserts *"all 15 span fns are present in the dist"* (verified on disk); flipping it to a
  zero-`*Span` assertion is RED-on-today's-tree and reads the actual dist. Honest. Would have caught
  the R-class residue (a keep-gate that ossifies deprecated surface).
- **The arming stays a perf-wave, not demoted to hygiene** — p11 F2/F3 clear the 5% KILL threshold
  decisively. The DEVELOP-only Pratt scoping and the "no bbnf-lang / no file: links" guards are
  correctly carried from r6.

---

## 1. Deductions (each explicit, per the scoring rubric)

### D1 (−15) — H2's chain() regression test is UNFALSIFIABLE against the behavior change it ships

This is the sharpest finding. The r6/probe fix shape is `!state.isError || chainError`
(p11:66-68, r6 F3). But the **current** code (verified `parser.ts:128-133`) is:

```
this.parser(state);
if (state.isError) { return state; }          // ← early-return: chainError is NEVER read on error
else if (state.value || chainError) { return fn(state.value).parser(state); }
return state;
```

`chainError` is presently **dead on the error path** — the `if (state.isError) return state`
short-circuits before it is consulted. So today `chainError` only distinguishes *falsy-success*
from *truthy-success*. The proposed `!state.isError || chainError` **resurrects `chainError` as a
live "continue even on genuine error" flag** — a semantic change, not the "behavior-additive,
only adds correct behavior for falsy seeds" that both SPEC S.H2 and p11 §5 claim.

SPEC-v1's named oracle is "a `0`/`''`/`false`-seed regression test" (p11 F7 tested falsy-seed +
default-`chainError` error-shortcircuit only). **Neither the spec nor the probe tests
`chainError=true` on a genuine error** — the exact path the fix newly activates. The gate cannot
falsify the change it ships.

Mitigating fact I verified (not exonerating the gate): **no caller passes `chainError=true`** —
0 hits in value.js (`grep .chain(...true`) and 0 in parse-that's own `typescript/src`. So no live
consumer regresses today. But that makes the correct move a *decision*, not an omission:

- **Option A (truly additive):** since `chainError` is dead-on-error and no one arms it, fix only
  the bug — `if (state.isError) return state; return fn(state.value).parser(state);` — and retire
  the now-moot `chainError` param (or `@deprecate` it in the same 1.0.0 cut).
- **Option B (resurrect per r6's stated intent):** adopt `!state.isError || chainError`, ADD a
  `chainError=true`-on-error regression test, and record that 1.0.0 gives `chainError` live
  continue-on-error semantics (a documented behavior change in a major cut — legitimate, but must
  be stated).

Either is fine; SPEC-v1 silently picks B's *shape* with A's *risk claim* and a gate that tests
neither. **Blocking.**

### D2 (−10) — H1 omits the probe-mandated type ripple (evidence not yet absorbed)

p11 §4 refinement 3 (p11:194-197) and §5 (p11:207-208) require, and SPEC-v1 S.H1 does not mention:
widen `packratEnter(): PackratEpoch` → `PackratEpoch | null` (or a shared sentinel — the early
no-op return has no epoch to hand back), null-guard `packratExit(saved)`, and *decide*
`resetPackrat()` (`packrat.ts:230`) — it currently `.clear()`s live Maps and should early-return
when unarmed for symmetry. This is a mechanical spec edit but it is the load-bearing implementation
surface (p11: "the only surface is a `| null` type widening on two internal functions") and is
absent from S.H1's text.

### D3 (−10) — H4's recorded-decisions ledger is missing two r6-demanded entries

r6 explicitly asks S to **record** decisions so a future tranche doesn't re-litigate them. S.H4
records only "the WDM/LR keep-vs-KISS decision" + the non-goals (token streams, incremental,
Squirrel LR, SpanParser). It omits:
- **r6 #6** — do **NOT** apply kf's zone-partition to parse-that (the subpath map IS the zone map;
  splitting the 707-LOC `parser.ts` class is net-negative). Without this recorded, a future tranche
  reflexively partitions it (r6:192-200).
- **r6 #8** — zero-copy was **deliberately delegated to value.js's scanner layer**, not overlooked;
  the `*Span` retirement is the *correct* direction for the real consumer (r6:216-224).

Additionally the WDM-keep rationale is stated as "made free by H1's arming" — but arming is a
**process-global latch that never disarms** (`makeMemoized` at `packrat.ts:244` flips it
permanently). "Made free" only holds for processes that construct zero `memoize()`. The honest
keep-rationale is the **bbnf-lang left-recursion consumer question** (bbnf-lang is exactly the
grammar-DSL that would exercise WDM/LR) — which r6 flagged for `*Span` as external-consumer but did
NOT confirm for the packrat tier. S.H4 should state the keep rationale as "retained pending the
bbnf-lang LR consume question; arming makes it free for the LL(1) constellation," not the weaker
process-latching claim.

### D4 (−10) — the "E6 is the ONLY externally-gated wave" charter claim is false; S.H is a second cross-repo consume-edge

§1 ("the consume-edge waves ... FIRE only when the joint 5.0.0 publishes"), §3 DAG note ("E6 is the
only externally-gated wave in the plan"), and T12 ("Exactly one wave (S.E6) is gated on an external
publish ... No other wave may acquire an external dependency without an owner ruling") are
contradicted by band S.H:

- **S.H3's gate** is "a consume-edge sketch **value.js signs off on**" — an external, cross-repo
  sign-off.
- **S.H4's gate** is "`proof:pin-ledger-current` reflects the new pin; the kf-side consume gate
  green" — but the re-pin presupposes parse-that **1.0.0 has published**, and kf cannot re-pin to a
  version that does not exist. In a **development-only** S (§1: "nothing runs until the owner
  authorizes an impl drive"), no parse-that publish occurs, so H4's pin-ledger gate is **not
  achievable during S** — it is structurally the *same* publish-then-re-pin consume-edge as E6.

parse-that is owner-controlled (unlike the not-yet-existent glass-ui 5.0.0), so this is more
defensible than E6 — but the spec must reframe H3/H4 gates as **born-SPECIFIED** (fire at the
impl-drive's publish step, per T4's "ships born-RED *or born-SPECIFIED*") and correct the three
"only-E6" assertions. As written they are internally inconsistent.

### D5 (−10) — the intra-band DAG mis-orders the impl drive

The DAG states "S.H1..H4 parallel to all; S.H4 before S.Z." That flattens a real dependency:
**H4 (the 1.0.0 cut + re-pin) depends on H1 + H2** — you cannot cut 1.0.0 without the arming (H1)
and the `*Span` deletion + chain fix (H2) in the bundle; the 1.0.0 publish IS H1+H2's payload.
Only **H3 (DEVELOP-only design doc) is genuinely parallel**. Correct intra-band DAG:
`H1, H2, H3 parallel; H1 + H2 ──► H4 ──► (re-pin) ──► S.Z`. The current "H1..H4 parallel" would let
an impl drive attempt the cut before its content exists.

---

## 2. Non-deducted observations (fold into SPEC-v2, no score impact)

- **Gate process-isolation caveat (H1):** the retained-heap "flat across N parses" gate must run in
  a **memoize-free process**. Because arming is a permanent process-global latch, a single stray
  `memoize()`/`mergeMemos()` construction anywhere in the gate's process arms the flag and the
  flat-heap probe **false-REDs**. p11's harness got this right by construction (separate
  baseline/armed bundles); the real gate must document the isolation requirement or it flakes.
- **Fold-table row #46 orphaned:** §4 row 46 (color2Into value.js WATCH) is dispositioned
  "verify at **S.H4** re-pin," but S.H4's wave text does not carry it. Reconcile.
- **Single-publish clarity:** S.H1 says "semver: patch," S.H4 says "cut 1.0.0." Make explicit that
  H1's patch + H2's breaking cut land in **one 1.0.0 publish** (no interim publish), so kf re-pins
  exactly once — otherwise a reader may infer a patch release then a major.
- **Changelog honesty (recorded-future, not blocking):** p11 §4 refinement 2 gives the honest
  wording — "~30 ns / 3-Map alloc per top-level parse; mid-teens % on short CSS values, negligible
  on long strings; ~34% less retained heap." Do not let the impl-drive changelog claim a flat 18%.

---

## 3. Prune / record-future

- **H3 (Pratt) — downgrade from gated wave to a recorded-future design appendix.** Its "gate" is a
  design doc + external value.js sign-off — a non-runtime oracle that violates T1's absolutism
  ("every closure oracle is a runtime-tier gate that opens the dist and actuates"). r6 rates it LOW;
  it designs a combinator that will not be implemented until a future value.js ratification. Keep the
  design note as a seed; drop the wave/gate ceremony so the band's gate roster stays runtime-honest.
- **Do NOT add a throughput-% gate to H1** (probe-confirmed ceremony trap — it would flake on input
  length; the heap gate is the right one). Recorded so a future pass doesn't "strengthen" it.

---

## 4. Idiomatic-gestalt check (charter §1 "no quick solutions")

The arming flag is a legitimate perf fix, not a band-aid over the deeper "does a consumerless 444-LOC
LR machine earn its complexity" question (r6 #7) — H4 confronts that question head-on rather than
smuggling it. **But** the resolution ("keep, made free by arming") leans on the weaker
process-latching claim (D3) instead of the real transposition-vs-patch fork: the *idiomatic* move, if
no in-realm consumer (incl. bbnf-lang) ever exercises WDM/LR, is to **remove** the tier (KISS), not
arm-flag around it. Arming is correct for S (it's the measurable win regardless), but H4 must state
the keep as *provisional pending the bbnf-lang consume question*, not settled — otherwise it launders
a deferred structural decision as closed (a T3-adjacent smell).

---

## 5. Verdict

**Band S.H headline is confirmed** (p11 confirms-spec) and its two runtime gates
(`proof:perf` heap clause, `proof:no-span-surface`) are falsifiable and born-RED-honest — a
materially healthier gate posture than the R residue this tranche is cleaning up. Convergence is held
to **50%** by one genuine design decision (chain semantics, D1) and four mechanical/framing edits
(D2–D5) the evidence already spells out. All five are absorbable into SPEC-v2 by the mechanical edits
listed in `blocking`.
