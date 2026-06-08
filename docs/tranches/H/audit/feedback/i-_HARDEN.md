# i-_HARDEN — H.W11 + H.W12 (the round-3 I1–I12 fold) · the adversarial HARDEN-lane verdict

**Branch:** `tranche-h-impl` · **HEAD:** `f064cc1` (W10 LANDING uncommitted in the tree) · **Lane:**
TRIUMVIRATE-3 HARDEN (Lane B — the cut HARDEN of the round-3 W11/W12 spec). **DOCS-ONLY** — every
edit is under `docs/tranches/H/`; NO source, NO dist, NO `git commit` (the lead commits).

**Method.** Read the authored spec in full (`waves/H.W11.md`, `waves/H.W12.md`, the updated `H.md` +
`PROGRESS.md`, `audit/feedback/i-_PLAN.md`, `audit/feedback/i-r5-sequence-path.md`). Re-verified EVERY
gate's born-RED state + every cited anchor against LIVE source on `tranche-h-impl` HEAD + the W10
working-tree `M` files. Verified the supersede-map against the actual W10/W9/W1 gate texts. Fixed doc
defects in place.

---

## VERDICT — ACCEPT (with 1 HIGH defect FIXED + 4 doc-defects FIXED in place + 3 forks for the lead)

The round-3 W11/W12 spec is **structurally sound and the I5/G8 reversal is HONEST.** All twelve items
(I1–I12) are terminally homed across two waves with falsifiable born-RED→green gates citing real
anchors — EXCEPT `proof:styling-idioms` (I12), whose original born-RED premise was STALE against live
source (the `icon-*` no-op was already W4-closed). That **non-biting gate is the one HIGH defect; it is
FIXED in place** (the gate now bites the genuinely-open remainder, MEASURE-FIRST). The I5 reversal of
W10 G8 is explicit, two-altitude-correct, and precept-consistent. The I2 DFA EXTENDS the W1 FSM without
re-authoring it. The engine fence holds (I10 is demo-only; `src/animation/` is named only as FENCED).
The charter↔wave↔PROGRESS one-truth was BROKEN on the PROGRESS side (W11/W12 absent) — **FIXED.**

**One-line confirm on the I5/G8 reversal:** the I5/G8 reversal is HONEST — W10's `proof:scene-card-rounded`
literally carries the disjunct "Every scene surface … resolves a non-zero computed `border-radius` **OR
is the full-bleed bg-less stage**" (`H.W10.md:52`), and `proof:stage-glass-card` correctly SUPERSEDES
exactly that full-bleed disjunct (the lead folds it OUT because the full-bleed subject ceases to exist);
the `.stage-cell` LAYOUT PRIMITIVE half of G8 SURVIVES untouched, only the surface consequence reverses.

---

## (1) Every I1–I12 terminally homed · born-RED→green · real anchor — PASS (all live-verified)

Each item homes to a named wave with a gate that BITES; born-RED state re-verified live:

| Item | Wave | Gate | Born-RED LIVE-VERIFIED |
|------|------|------|------------------------|
| **I5** | W11 | `proof:stage-glass-card` | ✓ ZERO `<Card>` in all four `*Target.vue` (easing/spring full-bleed; sequence/path bare `cartoon-surface`, computed `border-radius: 0`) |
| **I4** | W11 (+glass-ui HANDOFF) | `proof:card-rounded-primitive` | ✓ kf half: `SequenceTarget.vue:3`/`MotionPathTarget.vue:3` bare cartoon; HANDOFF half: `cards.css:33-48` `@utility cartoon-surface` carries NO `border-radius` (verified — stays born-RED until the glass-ui bump) |
| **I1** | W11 | `proof:label-subgrid` | ✓ `EasingSidebar.vue:144-150` per-row `auto 1fr`; ZERO `subgrid`; `SequenceTarget.vue:25` `w-20` magic literal present |
| **I2** | W11 | `proof:scene-control-dfa` + `proof:scene-transition-perf` | ✓ `AnimationControls.vue:20-22` hard-codes 3 tabs; NO `controlSurfaces`/`ControlSurface` anywhere in `demo/`; reka-fallback hacks live |
| **I6** | W11 | `proof:bezier-single-card` | ✓ `TimingFunctionPanel.vue:15` inner `<Card>` + `:87` steps Card inside the `AnimationControlsControls.vue:119` host card |
| **I7** | W11 | `proof:bezier-panel-taller` | ✓ `TimingFunctionPanel.vue:251-252` 220px cap; `:33` "editing:" subtitle present |
| **I8** | W12 | `proof:dragscrub-single` | ✓ 3 copies: `SpringTarget.vue:88-93`, `SequenceTarget.vue:155-172`, `MotionPathTarget.vue:124-147` |
| **I9** | W12 | `proof:composable-encapsulation` | ✓ gesture engine in `MotionPathTarget.vue:79-220`; `useMotionPathDemo.ts` thin |
| **I10** | W12 | `proof:demo-no-oversize` | ✓ born-GREEN regression guard (max demo file 418L; engine FENCED) — honestly labelled |
| **I11** | W12 | `proof:no-brittle-selector` | ✓ `MotionPathTarget.vue:119` `SAMPLE_STEP = 5`; `:131-134` square-viewBox scale |
| **I12** | W12 | `proof:styling-idioms` | ✗→FIXED — original premise STALE (see HIGH defect below) |
| **I3** | W12 | `proof:sequence-rows-draggable` / `proof:motion-path-editable` / `proof:motion-path-copy` / `proof:easter-egg` | ✓ read-only rows `SequenceTarget.vue:19-38`; fixed `PATH_D` `motionPathGeometry.ts:1-11`; no copy; no eggs |

I1 (refines W9 F1 subgrid), I4 (card-rounding-primitive), I6/I7 (the bezier de-nest + grow) all
confirmed. The W4 `proof:icon-idiom` substrate is live (`scripts/proof-icon-idiom.mjs`).

---

## (2) Supersede-map HONEST + precept-consistent — PASS (the I5/G8 reversal is the load-bearing claim)

- **I5 SUPERSEDES W10 G8 (b) full-bleed — HONEST + EXPLICIT.** Stated in `H.W11.md §supersede-map`,
  `§Design-decisions`, and the DAG-deps header: "the FOUR stage scenes converge from THREE states
  (full-bleed / cartoon-square / target) to ONE standard non-cartoon glass `<Card>`." The WHY is
  precept-consistent: the user's authoritative round-3 direction (observed live); W10 FORK A explicitly
  flagged "needs the user's call ONLY if they reject full-bleed" — they did; the four scenes converge to
  ONE register (isomorphism); **the `.stage-cell` LAYOUT PRIMITIVE half of G8 SURVIVES, `dock-inset`
  stays deleted (no legacy beside the replacement).** Stages → standard glass card; control panels stay
  cartoon+quiet per W2/W9 (two registers cleanly separated). VERIFIED against the live W10 gate text:
  `proof:scene-card-rounded` (`H.W10.md:52`) really has the "OR is the full-bleed bg-less stage"
  disjunct that `proof:stage-glass-card` folds out — the reversal is at the gate level, not a hand-wave.
- **I1 refines W9 F1** (per-row `auto` → parent subgrid; the `w-20` literal dies) — REFINES not forks;
  `proof:single-column-pack` stays GREEN. Honest.
- **I2 EXTENDS W1** (not supersedes) + supersedes the reka-fallback hacks — honest; the hacks are the
  explicit owner stand-in.
- **I6/I7 refine W9 F2** (drop the inner card; grow the canvas within fit-without-scroll) — honest.
- **I8 RE-OPENS the W5-BOOKed `useDragScrub`** (now over its 3-consumer MEASURE-FIRST threshold) +
  EXTENDS W10 G3/G6 — honest; the W5 BOOK at `H.W5.md:66` is real.
- **I3 RE-OPENS** the W5-BOOKed H-MI-4 + the F4 editable-path elevation — honest.

No supersede CONTRADICTS a landed gate. The I4 glass-ui HANDOFF is a legitimate born-RED-paired
cross-repo deferral (inv-16): `cartoon-surface` genuinely carries no radius today, so the HANDOFF half
stays RED until the published bump while the kf half greens on the I5 swap.

---

## (3) I2 scene-control DFA EXTENDS the W1 FSM, does NOT re-author it — PASS

- W11 states "do NOT touch `useSceneMachine`'s reducer beyond adding the orthogonal table + the
  surface-projection" FOUR times across the spec. The W1 machine owns scene+playback (two orthogonal
  axes); I2 adds the control-surface DFA as a THIRD orthogonal axis (a `controlSurfaces` table keyed by
  scene). The transition routes through the W1 `SCENE_READY` suspend/resume contract — NOT re-authored.
- **No contradiction with `proof:scene-machine-irrefragable`.** That gate's identity field set (W1.md:62)
  is `{t, reversed, iteration, playing, started}` + the control projection `{selectedAnimation,
  selectedControl, isControlsPanelOpen}`. `proof:scene-transition-perf` EXTENDS it with the
  control-surface projection — additive, not a rewrite.
- **LOW wording wrinkle (left as-is, flagged for the lead).** W11 says the round-trip identity is
  "EXTENDED with the `{selectedControl, control-surfaces}` projection" — but `selectedControl` is ALREADY
  in the W1 field set; only `control-surfaces` is genuinely new. Not a contradiction (a no-op
  re-statement), but the impl lead should read the delta as `+ {control-surfaces}` only, to avoid the
  appearance of re-adding a field W1 already owns. Cosmetic; left for the lead's judgment rather than
  rewritten, since it does not mislead the gate.

---

## (4) The ENGINE fence holds (I10 demo-only) — PASS

- `src/animation/*.ts` is named in BOTH waves ONLY as FENCED / ALREADY-SOTA / NOT-touched — never as an
  edit target. Verified: no W11/W12 §Scope clause targets a `src/` path.
- I10 is VERIFY-not-split: max demo file is `useSpringDemo.ts` 418L; the only >500L files are the engine.
  `proof:demo-no-oversize`'s 500L clause is honestly born-GREEN as a regression guard.
- I3 dogfoods public engine primitives (`Sequence.add`/`ManualTimeline`/`setChildTime().render()`,
  inv ζ) — confirmed `sequence.add(...)` is the public seam at `useSequenceDemo.ts:~117-120`.

---

## (5) Styling changes ISOMORPHIC unless NAMED — PASS

- I1's subgrid-derived uniform label column is a NAMED structural delta (the W9 one-column direction is
  PRESERVED + strengthened). Named.
- I5's glass-card stage register IS the isomorphic convergence (four scenes → one register). Named.
- The I5-shadow NAMED-delta fork is flagged (default MEASURE-FIRST).
- **I12's icon-size differentiation is NO LONGER a NAMED delta** — it ALREADY LANDED in W4. The spec's
  framing of it as "the NAMED visual delta" was stale; the real I12 delta is the OWNED-IDIOMS contract
  MEMBERSHIP extension (corrected — see HIGH defect). No other non-isomorphic style change is unnamed.

---

## (6) charter↔wave↔PROGRESS ONE truth — PASS (1 HIGH structural defect FIXED)

- **Charter (`H.md`) — CORRECT before HARDEN.** 13 waves (W0–W12, `H.md:159`); DAG `W9 → W10 → H.W11
  → H.W12 → H.W8 golden` (`H.md:164`, `:451`); I5 reverses W10 G8; I2 extends W1; both waves AFTER W10,
  BEFORE H.W8. (Also fixed: the charter's embedded W12 block carried the stale icon claim — corrected.)
- **Wave specs — CORRECT.** W11 + W12 both state AFTER-W10 / BEFORE-W8-golden, the convergent order,
  the supersedes. W11 lands STRUCTURE, W12 fills it.
- **PROGRESS.md — WAS BROKEN, NOW FIXED (DEFECT-A, HIGH).** Before HARDEN, `PROGRESS.md` had ZERO
  mentions of H.W11/H.W12: the Planned-DAG bands (Band 4.6 → Band 5) skipped them, the critical-path
  string ended `… → H.W10 → H.W8`, the wave-status table jumped H.W10 → H.W8, and the H.WZ "absorbs"
  clause read "H.W0–H.W10." The charter was updated but PROGRESS was not — a direct one-truth break.
  **FIXED in place:** added Band 4.7 (W11) + Band 4.8 (W12) narrative; extended the critical path to
  `… → H.W10 → H.W11 → H.W12 → H.W8`; added the two wave-status rows (full gate enumerations, born-RED
  states, supersedes, folds); extended the H.W8 dependency to "+ H.W11 + H.W12"; updated the H.WZ
  "absorbs the H.W0–H.W12 gates" clause with all 16 new W11/W12 gates.

---

## HIGH DEFECT (FIXED) — `proof:styling-idioms` (I12) born-RED premise was STALE / non-biting

**The defect.** I12's premise — across `i-_PLAN.md §3`, `H.W12.md §state/§Scope/§gate/§Design-decisions`,
and the `H.md` embedded W12 block — asserted that `icon-(xs|sm|md|lg)` are "61 SILENT NO-OP classes
defined NOWHERE" and that `proof:styling-idioms` clause (a) "reds TODAY — 61 refs, 0 definitions."

**The reality (live-verified).** That finding was TRUE pre-W4 but is now W4-CLOSED:
- `demo/@/styles/design-idioms.css:209-232` ALREADY DEFINES all four `@utility icon-(xs|sm|md|lg)` →
  `size-3.5 / size-4 / size-5 / size-6`, with the nested `& svg` cascade. Authored in commit `084feb9`
  ("tranche-H W6+W4 … icon idiom"), git-confirmed via `git log -S "@utility icon-xs"`.
- The live gate `scripts/proof-icon-idiom.mjs` (`proof:icon-idiom`) already polices resolve-or-red +
  strict-monotonicity + the SVG cascade — and it is GREEN.
- (Also: the spec said "61 refs"; the live count is 124 across 23 files — the number was stale too.)

So `proof:styling-idioms` clause (a) as written would be GREEN today, NOT born-RED — a **non-biting
gate** (the exact failure mode the HARDEN charge is to catch). The root cause is provenance: the plan
grounded I12 on the deep-audit lane `a-styling-idioms.md §1` (a PRE-W4 snapshot) WITHOUT re-checking it
against live source, re-litigating an already-closed finding.

**The fix (in place).** The genuinely-open I12 remainder is real and worth a wave: `proof:icon-idiom`
only polices the four hand-enumerated `icon-*`; the demo references OTHER idiom-shaped classes
(`depth-text`/`text-mono-caption` resolve transitively via glass-ui grace, NOT through the kf-owned
contract). So I rewrote `proof:styling-idioms` to bite the OWNED-IDIOMS contract MEMBERSHIP extension
(a referenced-but-undefined idiom-shaped class beyond the resolved `icon-*` reds) + the magic-number /
brittle-calc regression guard — with an EXPLICIT MEASURE-FIRST instruction: if the membership probe
finds NO undefined idiom beyond `icon-*`, the gate HONESTLY reduces to a born-GREEN regression guard
(recorded, NOT papered as a born-RED that does not bite). Applied to: `H.W12.md` (gate row, §state, S5,
§Design-decisions, §Mandate-bar), `i-_PLAN.md` (§3 I12, §4 gate row), `H.md` (the embedded W12 block).
See **FORK-I12** below.

---

## OTHER DOC-DEFECTS (FIXED in place)

- **DEFECT-B (MED, FIXED) — the I2 reka-hack anchors implied the wrong directory.** W11 cited
  `EasingScene.vue:26-32`, `SpringScene.vue:62-74`, `MotionPathScene.vue:25`, `CubeScene.vue` as bare
  basenames. The `*Scene.vue` files live in `demo/app/scenes/`, NOT beside their `*Target.vue` siblings
  (a reader following the convention would look in the wrong dir). The line numbers are all CORRECT.
  **FIXED:** the `§state I2` anchor list now cites the full `demo/app/scenes/…` paths.
- **DEFECT-C (MED, FIXED) — the I2 DFA reka-hack set was INCOMPLETE.** Live, `demo/app/scenes/
  SequenceScene.vue:28` ALSO pokes `isControlsPanelOpen = false` — a FOURTH poke-set the table must
  supersede (the self-contained-stage set is sequence + motion-path, not just motion-path). The spec
  enumerated easing/spring/path/cube but omitted SequenceScene, so the DFA's "total navigation matrix"
  claim had an un-named cell. **FIXED:** `SequenceScene.vue:28` added to the I2 anchor enumeration.
- **DEFECT-D (LOW, NOTED not rewritten) — the I8 sequence-scrub anchor is imprecise.** W12/i-_PLAN cite
  "`SequenceTarget.vue` master-scrub `progressFromEvent`" with no line. The real site is
  `SequenceTarget.vue:155-172`. Resolvable by basename + symbol; left for the impl lead (a line-precision
  tidy, not a correctness defect).
- **DEFECT-E (LOW, NOTED not rewritten) — the I2 field-set extension wording double-counts
  `selectedControl`** (see §3 above). Cosmetic; flagged for the lead.

---

## FORKS THE LEAD MUST ADJUDICATE

- **FORK-I12 (NEW — the HARDEN-surfaced one; lead must pick the I12 rung).** Since the `icon-*` no-op is
  W4-CLOSED, I12's scope shrinks. The lead must decide the I12 rung at impl: **(a)** the
  contract-MEMBERSHIP extension is REAL only if the membership probe finds ≥1 referenced-but-undefined
  idiom-shaped class beyond `icon-*` (MEASURE-FIRST) — if so, `proof:styling-idioms` born-RED bites; OR
  **(b)** if the probe finds none, the gate honestly reduces to a born-GREEN regression guard + the
  magic-number/brittle-calc cleanup is the substantive I12 work. RECOMMENDED: run the probe first; do NOT
  ship a born-RED clause that cannot bite. The doc now reflects this; the lead confirms the rung.
- **FORK I5-shadow (already in-spec; NAMED delta, default MEASURE-FIRST).** The stage `<Card>` with
  `shadow` vs `shadow={false}` — the protagonist plate may read cleaner without a nested shadow. Lead's
  call against the live render. Not a hard user fork.
- **FORK I3-rung (already in-spec; default FULL).** Sequence full per-row drag vs the stagger-slider
  FLOOR; motion-path full editable control-points vs the 2–3 preset-paths FLOOR. RECOMMENDED: FULL (the
  user said "greatly refined"); the FLOOR is the MEASURE-FIRST scope-guard. Lead picks the rung.
- **(FORK W — two waves vs one — and FORK I4-handoff-timing are lead-tuning calls already documented in
  `i-_PLAN.md §7`; not hard user forks. This wave adopts TWO + lands the in-demo `<Card>` swap now.)**

---

## Files touched by this HARDEN lane (DOCS-ONLY, all under `docs/tranches/H/`)

- `PROGRESS.md` — added the W11/W12 Planned-DAG bands (4.7/4.8), extended the critical path, added the
  two wave-status rows, extended the H.W8 deps + the H.WZ "absorbs" clause to W12 (DEFECT-A).
- `waves/H.W11.md` — the I2 reka-hack anchors now cite `demo/app/scenes/…` + add `SequenceScene.vue:28`
  (DEFECT-B, DEFECT-C).
- `waves/H.W12.md` — `proof:styling-idioms` gate row + §state I12 + §Scope S5 + §Design-decisions +
  §Mandate-bar corrected for the W4-closed icon idiom (HIGH defect / FORK-I12).
- `audit/feedback/i-_PLAN.md` — §3 I12 + §4 gate row corrected (HIGH defect).
- `H.md` — the embedded W12 §Class + §Scope blocks corrected for the W4-closed icon idiom (one-truth).
- `audit/feedback/i-_HARDEN.md` — this verdict.
