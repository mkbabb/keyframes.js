# Tranche O — converge the constellation · terminate the chronics · transpose to gestalt · cut 5.0.0

> **DEVELOPMENT PHASE — DOCS ONLY.** Authored 2026-06-19 from a 32-agent constellation
> re-audit (`audit/`, ~4M tokens, the successor to M's 32-lane audit). This charter +
> its waves + the deferred-fold ledger + the prompt-recap + the sibling dispatches are
> the deliverable. **No engine, demo, or library source is written here.** The
> implementation (O.W1…O.WZ) opens only on the owner's explicit authorization — exactly
> M's dev→impl boundary. **inv-16 holds throughout** (Tranche O writes only keyframes.js;
> every cross-repo need is a *dispatch*, never a foreign-tree edit).

> **RATIFIED (owner) — 2026-06-20.** The tranche-development phase is owner-approved + locked.
> The three open decisions are settled: **(1)** the glass-ui BC aria-orientation correction is
> **COMMUNICATED** — dropped in BC's inbound mailbox (`glass-ui/docs/tranches/BC/inbound/KF-O-ARIA-CORRECTION.md`),
> re-opening the misidentified ASK#2; BC owns the net-new SFC-guard wave + its gate. **(2)** the
> Oscillator republish rides the O.WZ **5.0.0** cut (USER-DOMAIN; the BC viz waves book the
> picker-loop seam against it). **(3)** the **value.js Tranche P** dispatch (`KF-TO-VALUEJS-P-ASKS.md`,
> VJ-L1 flatLeaf + VJ-L3 parseCSSSubValue) is ratified + ready to communicate when the value.js
> session opens. **IMPLEMENTATION remains UNauthorized** — O.W1…O.WZ open only on the owner's
> explicit go. Everything else herein is locked.

---

## 1 — Why Tranche O exists (the M-as-built delta)

Tranche M was authored as a 16-wave constellation-consume tranche (`M.W0…M.W15` + `M.WZ`).
The long-horizon campaign that followed **implemented only a slice** of it — and did so
correctly: M.W1 (the report-all runner + `proof:report-all`), the three consume gates
(`proof:css-parity`/`packrat-sound`/`consume-bundle`), the value.js 1.0.2 / parse-that
0.11.0 re-pin, the manual deploy, and the 5-fix master-merge CI cascade. **That slice is
green on `master` (`aef3ef3`) and the library gate passes.** This is genuine, shipped work.

But the **bulk of M's developed waves were never implemented** (verified live, 2026-06-19):

| M wave (DEVELOPED) | as-built today | Tranche O home |
|---|---|---|
| M.W2 lint-tier | no eslint/dep-cruiser config exists | **O Band A** |
| M.W3–W7 apparatus + correctness | vitest-browser, synthetic-clock, compile-surface, multi-color, ingest — unbuilt | **O Band A/B** |
| M.W5/W6 named-selector | `NAMED_SELECTOR_NO_TIMELINE` typed but never thrown; NaN frame-times (`frame-compiler.ts:128`, `utils.ts:398`) | **O Band B** |
| M.W12 perf | unbuilt | **O Band D** |
| M.W13 engine-seam transposition | `engine.ts` still **1397 lines** (target ~900); the god-object un-split | **O Band D** (VJ-L1-gated) |
| M.W14 terminal-belt | `fromMorphSVG` **ABSENT**, `DemoControlPoint` **ABSENT** | **O Band C** (the chronic terminals) |
| M.W8 BC consume | S1/S2 workaround deletes — DEVELOPED, BC-gated | **O Band F** |
| M.W9 value.js consume | S7 done (cascade); S8/S9 VJ-gated; `leaves.ts`→`/math` undone | **O Band D/G** |
| M.W-DESIGN-PAINT / M.W15 | `proof:design-paint` **ABSENT**; lighthouse observe-only | **O Band F** |
| M.WZ close | `proof:changelog-5.0.0` **ABSENT**; Oscillator absent from published 4.3.0 dist | **O Band Z** |

Tranche O is therefore the **close-out tranche**: it implements what M developed, **terminates
the absolute chronics M.W14 named but never built**, executes the architectural transpositions
the owner mandates, dispatches the two genuinely-new sibling asks the re-audit surfaced, consumes
the glass-ui BC cut, and cuts 5.0.0. It supersedes the M dev docs as the *implementation* tranche;
the M wave specs are O's substrate (referenced, delta'd — never re-authored).

## 2 — The precept reckoning (the owner's mandate, applied to today's tree)

> *NO quick solutions, NO workarounds; idiomatic + gestalt; architectural transpositions for
> elegance/simplicity/performance are necessary + desirable; NO legacy code; KISS; isomorphic.*

The re-audit enumerated the concrete violations the tree carries **right now** — each owed a
terminal transposition in O (not a band-aid):

- **Chronic carries (P-invariant-28 — no perpetual punts).** `DM-2` GlassControlPoint (born E) and
  `DM-3` MorphSVG (born C) — **DM-2 (born E) / DM-3 (born C) · 7 carries through M** — were both
  declared **"ABSOLUTE terminal at M — no 8th carry"** in the deferred ledger, yet **M.W14 NEVER
  BUILT them** (the forbidden 8th carry). O Band C builds both in over a PUBLISHED substrate
  (kf-owned, no sibling gate — value.js 1.0.2 already ships the `PathGeometry`
  `getTotalLength`/`getPointAtLength` that MorphSVG needs, and BC decided GlassControlPoint=NO so
  kf owns `DemoControlPoint` over its LIGHT `Draggable`/`drag2D`). **O closes the forbidden 8th
  carry via BUILD-IN — no 9th ride.**
- **Legacy on the published surface (no-legacy → the 5.0.0 cut absorbs it).** Deprecated `Animation`
  type alias (19 demo consumers) → `KeyframesAnimation`; `@deprecated ScrollTimeline`/`ScrollTimelineOptions`
  aliases → dropped; `internal/leaves.ts` duplicating `clamp`/`scale`/`lerp`/`lerpArray` that value.js
  1.0.2's `./math` subpath now exports → import the canonical (verify `proof:boundary` holds). The
  major cut (DM-16) is the honest home for the renames.
- **Workarounds (the consume-edge family).** S1 aria-suppress, S2 dock-pointer-interim, S8 `FN_NAME`
  Symbol sidechannel, S9 direct parse-that import. Each retires on a *root fix* — but two of those
  root fixes **do not yet exist** (value.js VJ-L1 flatLeaf, VJ-L3 parseCSSSubValue were anticipated at
  L.W9 but **not shipped in O**) and **one was misidentified** (glass-ui still emits `aria-orientation`
  unconditionally, including on `role=group` where ARIA forbids it). O does not band-aid these — it
  **dispatches the corrected asks** (Band E) and gates the deletes on the genuine publish.
- **Stale-gate dishonesty (observable-truth).** `proof:workaround-deletion` S1/S2 probe a phantom
  `glass-ui@4.1.0` that was never published (BB closed at 4.0.1; the cure is BC). `proof:control-point-live`
  asserts a `GlassControlPoint` BC decided never to ship. The gates are *structurally* sound but point
  at the wrong observable — O retargets them to content-aware probes / the BC cut version, and retires
  the dead one.

## 3 — The eight bands (the wave structure)

The M.md five-band DAG is the template; O extends it with an explicit **phase axis** — every wave is
tagged **NOW** (kf-internal, zero sibling dependency, executable on authorization), **DISPATCH** (a
cross-repo ask), or **GATED** (fires atomically on a named sibling publish).

| Band | Wave(s) | Phase | Headline |
|---|---|---|---|
| **A — Apparatus + ledger hygiene** | O.W0 (charter), O.W1 (lint/dep-cruiser tier), O.W2 (ledger re-point + stale-gate retarget) | NOW | the fast-iterate floor + the BB→BC / 4.1.0→BC-cut / DM-4→FIX / DM-24-add corrections, in one honest pass |
| **B — Engine correctness** | O.W3 (named-selector NaN-frame cure), O.W4 (multi-color refusal + ingest) | NOW | `NAMED_SELECTOR_NO_TIMELINE` actually thrown; the DM-22 NaN-always-active frame bug fixed |
| **C — The chronic terminals (P-inv-28 ABSOLUTE)** | O.W5 (`DemoControlPoint` over LIGHT `Draggable` + retire control-point-live), O.W6 (`fromMorphSVG` over value.js `PathGeometry`) | NOW | DM-2 (born E) / DM-3 (born C) · 7 carries through M · **O closes the forbidden 8th carry via BUILD-IN** |
| **D — Transposition + no-legacy** | O.W7 (engine-seam `engine.ts` 1397→~900), O.W8 (perf), O.W9 (no-legacy cuts: aliases + `leaves.ts`→`/math`) | NOW (all three — VJ-L1 gate removed from O.W7; see CONTRIVANCE-AUDIT.md #3) | the god-object split + the elegance/perf transpositions + the legacy purge |
| **E — Sibling dispatch** | O.W10 (`KF-TO-VALUEJS-P-ASKS`: VJ-L1 flatLeaf + VJ-L3 parseCSSSubValue), O.W11 (glass-ui BC aria-orientation **correction** ask) | DISPATCH | the two genuinely-new cross-repo asks the re-audit surfaced |
| **F — glass-ui BC consume** | O.W12 (S1+S2 delete + re-pin BC cut), O.W13 (design-paint pixel-readback on BC glass), O.W14 (lighthouse posture flip + content-visibility gate + hero word-gap verify), O.W15 (N Stage unshelf, DM-24) | GATED-BC-cut W12,W14/S1+S3,W15 · NOW-author W13/S1-gate,W14/S4-word-gap | the BC-gated consume (W12→W13→W14→W15) — the lighthouse floors lock at W14 before the W15 N-Stage perf integration |
| **G — value.js-P consume** | O.W16 (S8 `FN_NAME` + S9 parse-that delete; `proof:boundary` W96 scan GREEN) | GATED (value.js P) | the S8/S9 workaround deletion + the boundary-honesty close (O.W7 engine-seam is NOT gated on this — see CONTRIVANCE-AUDIT.md #3) |
| **Z — Close + the 5.0.0 cut** | O.WZ (`proof:changelog-5.0.0`, Oscillator republish, keyframes-vue, deploy round-trip, ledger re-point M→O) | NOW-author · USER-DOMAIN publish | the major cut + the auto round-trip restored |

**The DAG (phase-ordered).**
```
O.W0 charter ─► A{W1 lint, W2 ledger} ─► B{W3 nan-frame, W4 ingest} ─► C{W5 DemoControlPoint, W6 MorphSVG}
                       │                                                                       │
                       ├──────────► D.W9 no-legacy cuts (NOW) ──► D.W7 engine-seam (NOW) ─────┤
                       ├──────────► D.W8 perf (NOW) ──────────────────────────────────────────┤
                       │                                                                       ▼
   E.W10 value.js-P ask ──┐                                                               O.WZ close
   E.W11 glass-ui aria ──┐│                                                                    ▲
                         ▼▼            value.js-P spine                                        │
                 G.W16 (VJ-L1/L3 publish) ─────────────────────────────────────────────────── ┤
                                                                                               │
                 F (BC cut): W12 S1/S2 ─► W13 paint ─► W14 lighthouse+CV+word-gap ─► W15 N-Stage ┘
```
Bands A→C + D (all three: W7, W8, W9) are **immediately executable** (the bulk of the value).
O.W7 is NOW — the VJ-L1 gate is removed (CONTRIVANCE-AUDIT.md #3; the terminal S8 cure is P.W11's
in-realm WeakMap, not a value.js-P precondition). The value.js-P spine is **G.W16 → O.WZ** (O.W16
is independent of O.W7); F is BC-gated, sequenced **W12 → W13 → W14 → W15** (W14's lighthouse
floors lock BEFORE W15's N-Stage perf integration); Z closes when all green + the USER-DOMAIN
publishes fire.

## 4 — The chronic terminals (no 8th carry)

| Chronic | Tranches carried | O terminal |
|---|---|---|
| **DM-2 GlassControlPoint** | born E · 7 carries through M | **O.W5 BUILD-IN** — `DemoControlPoint.vue` over the LIGHT `Draggable`/`drag2D` (BC said NO; kf owns it). Retire `proof:control-point-live`; author `proof:demo-control-point` born-RED on the absent component, GREEN on the build. **O closes the forbidden 8th carry.** |
| **DM-3 MorphSVG** | born C · 7 carries through M | **O.W6 BUILD-IN** — `fromMorphSVG` over value.js 1.0.2 `PathGeometry` (`dist/transform/path`: `getTotalLength`/`getPointAtLength` confirmed published). Author `proof:morphsvg-consume` born-RED on the absent export. No sibling gate. **O closes the forbidden 8th carry.** |
| **DM-1 RF-17 dock crossfade** | 5-tranche entering O (I,J,K,L,M carried in-tree) | **O.W12 CONSUME** — delete S2 on the BC cut (`useDockClickIntegrity` ships at BC HEAD). BC-gated; the cut is the unblock. A pre-authored CONTINGENCY KILL stands in `deferred-ledger-O.md §6` if the S2 dock-pointer interim has no BC cut at the O.WZ close-gate (reclassify to a declared kf-internal input-integrity seam; VOID the instant glass-ui ships `useDockClickIntegrity`). |
| **DM-5 S8/S9 value.js workarounds** | chronicity 3 entering O (K,L,M) | **O.W16 CONSUME** on value.js P (VJ-L1/L3). Dispatched at O.W10; the P-inv-28 ≥4 belt fires at **kf-P** (the NEXT kf tranche after O) if value.js P slips — the terminal window is named explicitly, not left open. Two-arm fallback: S8 → a kf-side `WeakMap<ValueUnit,string>` at flatten time (realm-CLEAN, but does NOT survive `ValueUnit.clone()` — VJ-L1 strictly preferred); S9 → a DECLARED spine-edge quarantine (not eliminable without VJ-L3). |

## 5 — The sibling dispatches (inv-16 — kf asks, never writes)

- **`KF-TO-VALUEJS-P-ASKS.md` (O.W10).** value.js O shipped VJ-L2 (linear serialize) but **deferred
  VJ-L1 (a first-class `flatLeaf` provenance API) and VJ-L3 (`parseCSSSubValue`)**. kf's S8 `FN_NAME`
  Symbol sidechannel and S9 direct parse-that import exist *only* because those APIs are absent. The
  dispatch asks value.js Tranche P to ship them; O.W16 deletes S8/S9 on consume. O.W7 (engine-seam)
  is NOT gated on VJ-L1 — the TERMINAL S8 cure is P.W11's in-realm WeakMap; VJ-L1's residual value
  is retiring the 5-line clone-restamp ceremony (a nice-to-have, not a split precondition —
  CONTRIVANCE-AUDIT.md #3).
- **glass-ui BC aria-orientation CORRECTION (O.W11).** The re-audit found BC's `KF-INBOUND.md` ASK#2
  marked "CONFIRMED" but `SegmentedTabs.vue:406` emits `:aria-orientation` **unconditionally** — including
  on `role=group` (the pill variant), where ARIA disallows it. The kf S1 deletion premise is therefore
  unmet. O.W11 dispatches the corrected ask: emit `aria-orientation` *only* on the `tablist` role, omit
  it for `role=group`. O.W12 deletes the kf suppress lines (`SpringSidebar.vue:43` **and**
  `AnimationControls.vue:72`) once BC ships the guard.

## 6 — The 5.0.0 cut (O.WZ)

The npm registry is frozen at **4.3.0** (Tranche K close); every feature since — the Oscillator, the
constellation consume, the new gates, keyframes-vue — is local-only. O.WZ cuts **5.0.0** (major — the
no-legacy renames are breaking): author `proof:changelog-5.0.0` (born-RED; asserts the breaking set —
deprecated `Animation`/`ScrollTimeline` alias drops + the multi-color refusal semantic), bump + wire
into `release.yml`, ensure the **Oscillator is in the published dist** (`proof:published-surface` gates
it), and observe the **deploy round-trip as live-byte equality** (CI run → deploy run → live serves the
exact `index-<hash>.js`). The publish + the keyframes-vue publish stay **USER-DOMAIN** (confirm-first).

## 7 — Constellation cognizance (the lockstep)

- **glass-ui BC** is tranche-dev CONVERGED, EXECUTION ~60% (Bands F/0/14/1/7/12/2/3 done; viz/controls/
  pages/perf/CUT pending). The **BC cut version is USER-DOMAIN** (≥4.1.0). O Band F fires on that cut.
- **value.js** is at 1.0.2; **Tranche P** (VJ-L1/L3) is the kf-dispatched follow-on that unblocks O.W7 + O.W16.
- **parse-that** is at 0.11.0 (terminal for O's needs — consumed transitively).
- **The end-state:** BC cuts → kf consumes (Band F) + value.js P ships → kf consumes (Band G) → O.WZ cuts
  5.0.0 → the auto round-trip (`on: workflow_run` success) is restored (both blocking tripwires resolved:
  control-point-live retired in O.W5, keyframes-vue published USER-DOMAIN in O.WZ).

## 8 — The dev→impl boundary + verification

This phase's deliverable is the Tranche O development docs, verified by: the 32-lane audit on disk
(`audit/`) + re-runnable; the deferred-fold ledger with a real terminal per item (zero un-dispositioned
punts; the two P-inv-28 chronics assigned BUILD-IN homes); the prompt-recap confirming full A→O coverage;
each wave spec carrying a falsifiable born-RED gate; the two sibling dispatches authored. The
IMPLEMENTATION (O.W1…O.WZ) opens in a later, explicitly-authorized phase — gate-first, born-RED,
observable-truth, no-legacy, gestalt throughout. inv-16 holds: O writes only keyframes.js.
