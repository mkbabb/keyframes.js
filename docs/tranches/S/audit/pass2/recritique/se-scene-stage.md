# Re-critique (Pass-2) — S.E Scene-stage resurrection (se-scene-stage)

**Agent:** convergence re-critique · **Band:** S.E (DM-24 REVIVED) · **Predecessor Pass-1 score:** 48%
**Inputs read:** Pass-1 critique (B1–B9 / D1–D8); SPEC-v3 §3 S.E band IN FULL (L864–937), §2.2 rulings
C-7/C-10/C-12/C-13/C-17, §6.1–6.4 residue, §9 se-scene-stage table (L1692–1704) + Pass-2 addendum,
the DAG (L1277–1288), fold rows 56/71 + related; the Pass-2 probes (P2-1, P2-2 — neither is S.E band;
my band's probe was p05, a Pass-1 salvage that returned confirms-spec and is banked).

**Verdict: converged. 100%. Zero admissible blocking items.** Every one of the nine Pass-1 blocking
edits is absorbed with REAL delivery in the v3 band text (not merely claimed in the disposition table).
The salvage spine the predecessor already credited as probe-PROVEN is intact; the two structural
defects that drove the 48% (the device-dependent fps CI closure, D1/B4; the unscoped interim arrow
surface the acceptance gate depended on, D7/B8) are both cured in the band text, not deferred.

---

## Per-edit absorption verification (all quotes from SPEC-v3 §3 S.E)

- **SE-1 / B1 (DAG D3→E1; E1 no longer enumerates a scene that doesn't exist) — ABSORBED, real.**
  Band L881–882: "**E1 core enumerates the 8 shipped scenes and deps D1, D2; the compose row +
  adapter is sub-item E1c, gated on D3** (se-B1 — E1 no longer enumerates a scene that does not
  exist)." DAG L1281: "S.D2 ──► S.E1 (8-scene core) ; S.D3 ──► S.E1c (compose row)". The Pass-1
  correctness bug (E1 authorized before the wave minting `compose`) is closed by both branches the
  critique offered.

- **SE-2 / B2 (7 re-pathed + 2 authored-new; bare-tsc caveat) — ABSORBED, real.**
  Band L879–881: "**7 shelf adapters re-pathed + 2 authored NEW** — `previews/morph.ts` + a registry
  row (the shelf froze pre-morph, p05 F5), and the compose adapter." Bare-tsc caveat L883–884: "`check`
  is bare `tsc` (no `vue-tsc`) — it verifies the salvage engine fully but `.vue` script blocks only at
  import resolution; the render path is exercised by the browser gate." The D6 undercount ("re-homed"
  hiding authored-new work) is spelled out.

- **SE-3 / B3 (gate strengthened to mount+render) — ABSORBED, real.**
  Band L885–887: "Gate (strengthened per se-B3): runtime — **each scene row mounts and renders a
  non-error idle preview** (covers the inject-adapter runtime provisioning p05 could only clear at the
  type layer), not grep, not resolve-only." Closes p05 F4's one residual (inject-adapter Targets), and
  keeps the "runtime, not grep" instinct the critique's §3 said to preserve.

- **SE-4 / B4 (split fps; delete raw ≥55fps as CI closure) — ABSORBED, real.**
  Band L892–896: "**The fps criterion is split per C-10/se-B4:** the CI gate is device-independent
  (mount-count + LOD-state structural assertions); '≥55fps with all previews mounted' is a **declared
  LOCAL chrome-devtools-mcp acceptance** recorded in the wave doc (not a T4 closure) — or … a budgeted
  device-independent ratio per the taxonomy recipe." Reinforced by C-10 (L330–333): "**no raw absolute
  fps threshold may be a CI closure anywhere in the plan**." The −15 D1 anti-pattern is eliminated.

- **SE-5 / B5 (name E3's oracle; reconcile no-scratch-probes line) — ABSORBED, real.**
  Band L901–907: "**The oracle, named (se-B5):** a new `scripts/proof-stage-geometry.mjs` —
  playwright-core over the served dist (demo-correctness tier, shared harness), asserting the STAGE-SPEC
  measurables structurally: the overlay element is a body-level sibling with no `view-transition-name`;
  `getComputedStyle` transform matrix matches the pinned rotateX(-15deg)/perspective values within
  tolerance; disk/preview rects at fixed 375/desktop viewports. This gate **REPLACES the shelf's scratch
  `probe.mjs`/`verify-candidate-c.mjs` scripts** (the charter's no-scratch-probes line is now satisfied
  by a real gate)." The D2 prose-not-oracle gap and the charter self-contradiction are both resolved.

- **SE-6 / B6 (KfPillTabs removed from E5; test → B7) — ABSORBED, real.**
  Band L919–922: "**KfPillTabs is REMOVED from this wave's scope** (se-B6): it is the control-strip
  panel primitive inside animation-controls (a12), not a scene-nav surface — its test lives in B7, its
  promotion in D2; E5 introduces no second nav authority." Gate reduced to "the reborn mobile gate green
  at 375px (open→spin→commit on touch) — full stop" (L922–923). Cross-checked: S.B7 owns the test
  (L691–693: "The KfPillTabs test is B7's gate — it is NOT re-attributed to S.E5"); fold row 71 (L1382)
  points to "**S.B7 … + S.D2 … — NOT S.E5 (se-B6)**." The gate-misattribution defect is closed on both
  ends.

- **SE-7 / B7 (Oscillator pinned to ONE wave; fold row 56 aligned) — ABSORBED, real.**
  C-13 (L344–347): "**Pinned (se-B7):** the Oscillator decision lands in **S.G2** (ONE wave …); the
  `reseatToSpring`-vs-`decayRest` bench lands in **S.F5a**. Fold row 56 aligned." Fold row 56 (L1367):
  "**WAVE S.G2 (the ONE decision wave — C-13 pinned, se-B7) + S.F5a (the bench)**." The "here or in S.G"
  soft deferral (D3) is terminated to a single wave with a named binary outcome (build the home OR strip
  + ledger) — a proper terminal disposition, not an open design question.

- **SE-8 / B8 (scope the interim in-dock spin controls) — ABSORBED, real.**
  Band L909–913: "**the interim spin controls are scoped HERE (se-B8):** ordinary `DockIconButton`s
  inside the single ChromeDock (r7 A-10 … NOT the shelf's bespoke StageArrows/TransportDock/stageDockKey
  second-authority surface, which stays unlifted) — **this is the surface the E4/E5 gates actuate**."
  Mirrored in C-7 (L320–321). The D7 gap (the E4 arrow-commit gate had nothing to actuate) is closed;
  single-authority is preserved (dogfooding the existing ChromeDock, not reviving the second surface).

- **SE-9 / B9 (CI-budget accounting) — ABSORBED, real.**
  Band preamble L870–875: "**CI-budget accounting (se-B9):** the band adds … CI browser gates …, both
  riding the ONE shared chromium + served dist from S.A2's net-deletion (amortized, not +2 launches);
  `proof:stage-geometry` (E3) rides the same harness; the fps checks are LOCAL chrome-devtools-mcp
  acceptances costing zero CI launches — S.E does not re-red the plane S.A0 greens." The D8 concern
  (re-redding the plane A0 is greening) is directly costed against the ceiling.

## Banked-sound items (not re-litigated; confirmed still present)

- E4 born-RED `proof:scene-stage-commits` (the tranche's model gate): L915–917, present and browser-
  actuating, "a swipe/arrow COMMITS a scene."
- Geometry NOT re-derived (correct discipline): L898–900, "the empirically verified
  rotateX(-15deg)/perspective geometry (NOT re-derived …)."
- `proof:boundary` re-verify at E2: L891.
- E6 honestly externally-gated with tilde-never-caret + non-terminal RESIDUAL CARRY honesty +
  kf-internal dock double-click contingency: L924–937 + C-12 (amended by C-20).

## Cross-band / DAG integrity after the absorbed edits

- The E1→E2→E3→E4→E5 chain is intact (DAG L1281); E1c deps D3 (L1277, L1281); E6 gated on E4 +
  external publish with the HANDOFF escape (L1282). No DAG edge broken by an absorbed edit; the missing
  D3→E1 edge (D5) is now present.
- No cross-band collision introduced: the KfPillTabs relocation lands cleanly in S.B7 (test) + S.D2
  (promotion), both of which already own it in v3 (L689–693, L795, fold row 71). No EN-a/EN-b hoist
  touches S.E.

---

## Polish (non-blocking; NOT admissible as blocking under this round's rules)

1. **Preamble gate-count phrasing.** L870–875 says "adds exactly TWO CI browser gates
   (`proof:scene-stage-commits` at E4; the mobile commit gate at E5)" and then, in the same sentence,
   "`proof:stage-geometry` (E3) rides the same harness" — which is effectively a third CI browser gate
   (E3 is demo-correctness tier, playwright-core, L902). The launch-cost intent is honest and
   unambiguous (all three amortize on ONE shared chromium; zero incremental launches; fps is the only
   thing pushed to zero-launch local acceptance), so this is a wording imprecision, not a
   contradiction or a budget dishonesty. An impl-drive editor may want "two commit gates + the
   geometry gate, all on one shared launch." Non-blocking.

2. **E3 born-RED not stated verbatim.** `proof-stage-geometry.mjs` is named, tiered, and given a
   concrete assertion form (satisfying B5), but unlike E4 it is not explicitly labelled "born-RED."
   The T4/T7 mandates make born-RED the default for any new gate, so this is covered by the tranche-
   wide template gate (S.Z2), not a per-band gap. Non-blocking.

Neither polish item is a mis-absorption, a v3-introduced contradiction, or a dropped evidence item, so
per this round's binding scoring clarifications neither is admissible as blocking.

---

**Convergence: 100%.** Empty blocking; all nine Pass-1 edits verified absorbed against quoted v3 band
lines; the Oscillator disposition is a terminal single-wave pin (not an open question); no §6.3 owner
ruling touches S.E. The band is implementable-as-written.
