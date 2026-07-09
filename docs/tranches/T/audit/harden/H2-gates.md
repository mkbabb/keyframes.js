# H2 — GATE QUALITY audit (adversarial review lane 2)

Scope: `T.md` §5 + `waves/T.M.md` (the mechanism) + every `waves/T.*.md`. Verified against
`tranche-s-impl` HEAD, read-only greps. Criteria: gate falsifiability; born-RED-names-today
accuracy; taste/appearance = BORN-OWNER (the S.G lesson); removal-wave lockstep clauses name
real gates; no proposed gate re-asserts owner-rejected UI.

## Verdict summary

The wave corpus is **exceptionally well-grounded**. I spot-checked **17 born-RED plants** against
the tree and **all 17 are accurate**: `interpolate.ts:285` (`anim.unflatten ? frame.vars…`),
`animation.ts:139` (`unflatten = true`), `controlSurfaceDFA.ts:90` (the literal) / `:99`
(`square:[]`), `useAnimationGroupPlayback.ts:19` (`const isPlaying = ref(getAnimationGroup().playing())`),
`style.css:452` (`.z-dock:has(> .pointer-events-auto)`), `SpringTarget.vue:293` (`font-weight:650`),
`useContractAnimGroup` (5 files / 11 hits), `proof-no-single-option-select.mjs` header ("renders a
STATIC label"), `gate-bands.mjs` FROZEN_SET=51 / DISCHARGE=1 (→ the 51−1=50 formula holds),
`proof:ci-coverage` exit 1, `proof-chronic-closure.mjs` `inCorrectnessTier` (demo-correctness-only),
the single `DEFERRED to a follow-up wave` at `frame-compiler.ts:341`, `bench/playwright.bench.ts`
reading the moved `demo/app/loaf-observer.ts` (file now at `runtime/`), easing-editor = 1082L,
glass-ui dock exports (all 5), `morph.css:80` (`--dock-reveal-blur:3px`), `SOURCE_EXT` excludes `.css`.
Every gate key cited in a removal/lockstep clause resolves in `package.json`/`scripts/` (and
`proof:prompt-recap-s` is correctly *absent* as T.M10/T.S7 claim). Removal waves each carry a
lockstep clause; **no proposed gate re-asserts rejected UI** (the tranche's central discipline holds).

Five defects survived verification. Ordered most→least severe.

---

## F1 — T.A11: a NEW appearance element gated INSTRUMENT-only, not BORN-OWNER (the S.G lesson) — CONFIRMED

**Wave:** T.A11 (Transient telemetry via glass-ui MetricBadge).

**Defect.** T.A11 *removes* the parked amiga ω readout (`AmigaTelemetry.vue`, verified present +
mounted at `AmigaScene.vue:47`) and *re-introduces a NEW visible element* — "ONE transient glass-ui
`MetricBadge` … top-right of the stage." Its gate is born-RED **structural only** (badge
absent-at-rest / present-within-200ms / unoccluded-on-390). But this is a design/appearance wave that
adds a bespoke on-stage element, and it is **not routed to T.M2 pre-authoring owner sign-off**:
- The T.A cross-band-edge table routes T.A2/T.A3/T.A10's appearance slices to **T.M** ("axis opacity,
  settle-easing choice, grid-room composition — no born-RED appearance oracle authored without the
  token"). **T.A11 is absent from that T.M row** — its only edge is → T.H (glass-ui consumption).
- The amiga telemetry is **not owner-ruled**. The VERDICT names the amiga *gesture legend* for removal
  (item #8) and calls amiga "a broken mess … does not interleave" (#9) — **no VERDICT line touches the
  ω readout**. The transient-badge redesign is lane-driven (lane 03 F6), not owner-blessed.
- This collides with the tranche's own default-removal doctrine: T.M4 (`stage-inventory`) enforces "no
  un-manifested chrome," and T.E11 states "**no bespoke affordance-hint/readout system is rebuilt
  unless the owner signs one via T.M2** — the default disposition is removal." A re-added telemetry
  badge is exactly the un-blessed design decision the S.G lesson exists to catch: a born-RED oracle
  crystallizes "there IS a top-right badge," and the fan-out drives to green.

**Exact fix.** Split T.A11's gate: keep the born-RED *correctness* clauses (honest = absent-at-rest;
unoccluded-on-390). Route the *existence + placement* of the badge to **BORN-OWNER** — mark the
appearance slice gated on a T.M2 token (a captured-render owner review that a transient ω badge is
wanted at all, and top-right), and **add the missing `T.A11 → T.M` cross-band edge** to the T.A table,
mirroring T.A2/A3/A10. If no owner token is captured, T.M4's default (removal, no replacement) governs.

---

## F2 — T.E6: BORN-OWNER easing gallery with NO owner-decision home (OD-7 never added) — CONFIRMED

**Wave:** T.E6 (the specimen-drawer gallery IS the easing scene).

**Defect.** T.E6 is correctly marked **BORN-OWNER** — the *direction* is ruled (VERDICT #14 "just have
the easing balls previewed here") but the specimen-drawer *design* (drawer layout, tile treatment,
one-shared-clock sweep) is a taste disposition whose born-RED oracle "may not be authored until an
owner token covers a live prototype." T.E6's own charter-conflict note 2 flags that this has **no §3 OD
row** and recommends: *"add an OD-7 (easing gallery design) to `OWNER-DECISIONS.md`, OR explicitly
document that T.E6 rides T.M2's general contract."* **Neither was done.** Verified: `OWNER-DECISIONS.md`
titles itself "OD-1 … OD-6" and `grep -c 'OD-7'` = **0**. So the one appearance wave whose owner-gating
depends on a *general* T.M2 ride (not a named OD row) has an undecided owner-gating home. Risk: the impl
authors `proof:easing-gallery`'s born-RED oracle without a captured design token — the exact S.E-shelf
failure ("critic consensus ≠ owner verdict") this tranche was built to prevent.

**Exact fix.** Add an **OD-7 (easing gallery design)** row to `OWNER-DECISIONS.md` (PENDING-OWNER,
served by T.E6's prototype, mirroring OD-4/OD-5/OD-6's "RULED direction / composition needs sign-off"
shape) — OR add one explicit sentence to OWNER-DECISIONS.md's register recording that T.E6 rides T.M2's
general design-wave contract and enumerating it there so `proof:owner-review-gate` (T.M2) can bind it.
The T.G6 perf-floor and T.C dock aesthetics ride the same "no-OD-row, general-T.M2" path and should be
listed the same way so the general-contract set is not implicit.

---

## F3 — T.D14: cites a gate that no longer exists (`proof:no-orphan-specular`) — CONFIRMED

**Wave:** T.D14 (`proof:no-hand-rolled-cursor-tracker` — the recurrence gate).

**Defect.** T.D14's scope justifies its new grep gate as "a **grep/AST gate (sibling to
`proof:no-orphan-specular`, which already exists** for glass-ui's own specular class)." That gate key
does **not** exist. Verified: `grep '"proof:no-orphan-specular"' package.json` → absent; the gate was
**renamed** — `scripts/proof-specular-absent-at-rest.mjs:4` reads *"old `proof:no-orphan-specular`
(which RECORDED the warm-white catch-light bloom …)"*, and `proof-chronic-closure.mjs:50` lists
`proof:no-orphan-specular` among retired chronic rows. The current key is `proof:specular-absent-at-rest`.
This is precisely the "gates anchor literal paths" stale-reference class this tranche polices, inside a
gate-authoring wave. (T.D14's own gate is otherwise sound and correctly born-RED.)

**Exact fix.** In T.D14 replace `proof:no-orphan-specular` → **`proof:specular-absent-at-rest`** (or
drop the specific key and say "sibling to glass-ui's existing specular-guard gate"). No other wave
carries the stale name (checked T.F/T.H/T.M).

---

## F4 — T.M3: born-RED basis mischaracterized; a golden captured post-rebuild can never diff the broken render — PLAUSIBLE

**Wave:** T.M3 (`proof:owner-golden` — the owner-anchored perceptual reference oracle; the keystone).

**Defect.** The gate line asserts **born-RED**: "reds on the one-face cube / bare-grid morph / blur-blob
icon **on today's tree**." A perceptual (SSIM/pHash) diff needs a golden to diff against; the same wave
states green "cannot be reached until an owner-blessed golden frame is captured for each scene" and it
"**Lands AFTER the T.A/T.D scene rebuilds** produce owner-approved renders (the golden frames come from
those approved scenes)." With no golden today the gate reds on golden-**absence** (the born-RED-on-absent
mechanism pattern, like M1/M4/M10) — not on the one-face-cube *render*. Worse, if the golden is captured
from the **post-rebuild** approved scene (as the edge says), by the time a golden exists the cube already
renders six faces, so the gate can **never** "fire on the one-face cube." The stated born-RED basis is
not a scenario that occurs.

**Exact fix.** Either (a) restate M3's born-RED basis as **golden-absence** ("reds because no
owner-blessed golden is committed; wired into ci-coverage so an appearance wave cannot close without
one"), consistent with the other T.M mechanism gates; and/or (b) clarify the golden source is the
**owner-blessed :5180 prototype render** (captured at OD sign-off, *before* the shipped rebuild) — which
is the only way M3 can honestly "red on today's broken cube," and reconciles the "T.M lands first" DAG
line with the "lands after the rebuild" edge.

---

## F5 — T.M8: the declared ~120 ceiling is likely unreachable given the tranche's own net-new gates — PLAUSIBLE (coordination)

**Wave:** T.M8 (`proof:roster-ceiling` — FROZEN discharge + 203 → ~120).

**Defect.** T.M8's gate greens only when `total proof: count ≤ declared ceiling` (target "~120"). The
count today is **203** (verified). T.M8 subtracts M7's ~15 feature-coupled retirements + the 50-key
FROZEN fold — but FROZEN *discharge* is "into successor system gates OR ledgered KILLs," and a
fold-into-successor does **not** drop the count (only KILLs do). Meanwhile the other bands **author many
new keys**: T.C7 (+4 dock), T.G6–G10 (~5 perf), T.M1–M10 (~10 mechanism), T.H1/H2 (+2), T.B (~8),
T.D1/D14/… (several), T.E (several new rendered-truth gates), and **T.F's own note 1 flags ~13 net-new
structural gates** as "a net INCREASE against the shrink goal." The ~120 target can be arithmetically
unreachable, in which case T.M8 (a close-gating gate wired to ci-coverage) never greens and blocks the
T close. This is partially self-flagged (T.F §4 note 1: "final gate count coordinated with T.M8") but no
wave reconciles the concrete arithmetic.

**Exact fix.** T.M8 should **declare the ceiling literal against the ACTUAL post-fold survivor count**
computed once the new-gate set is known (not the aspirational "~120"), and require the discharge column
to distinguish KILL (count-reducing) from fold-into-successor (count-neutral). Alternatively adopt T.F
note 1's composite-gate proposal (fold F/C/G structural clauses into a few `proof:demo-*` composites) so
the additions net out — but that must be a named coordination row between T.M8 and T.C7/T.G6/T.F, not an
implicit hope. Until reconciled, "~120" should be marked a target, not the gate literal.

---

## Checks that PASSED (no defect)

- **Falsifiability.** Every gate carries a concrete instrument (grep / computed-style probe / DOM
  census / CDP counter / rAF sampler / unit test) or an owner token. None is prose-only.
- **Removal-wave lockstep clauses.** T.A2/A10/A13, T.B1/B5/B6/B7, T.E1/E2/E3/E6/E7/E8, T.D12/D17,
  T.H3/H5/H6 all name real, existing gate keys (motion-path{,-copy,-editable,-scale}, morph-scene,
  compose-scene, easter-egg, design-refinement, easing surface-locks, scene-contract-identity, etc. —
  all verified present). The library sub-gates T.E cites (`proof:morph-renders-d`/`-orients`/
  `morphsvg-consume`) are real scripts run via the `proof:morph` aggregator and correctly distinguished
  from the retired demo `proof:morph-scene`.
- **No gate re-asserts rejected UI.** The four inverted S gates (`square-honest`, `no-single-option-
  select`, `gesture-manifest`→`stage-inventory`, the easing surface-locks) are each re-chartered or
  retired in lockstep to assert the *restored/absent* state, never the rejected one. Verified the
  polarity flips are specified (T.A13/T.B3/T.B5/T.C1/T.M4/T.M7/T.E11).
- **Born-OWNER discipline (elsewhere).** T.B4/B6/B7 (OD-5/OD-6), T.D7/D9/D11/D13 (OD-6/OD-4/OD-2),
  T.E2/E3 (OD-1) are all correctly BORN-OWNER with matching OD rows present in `OWNER-DECISIONS.md`
  (OD-1…OD-6 verified, all PENDING-OWNER). T.A2/A3/A10 taste slices correctly ride T.M capture.
