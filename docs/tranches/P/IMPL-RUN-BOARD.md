# Constellation IMPLEMENTATION run-board (the resumable state)

> The autonomous implementation drive authorized 2026-06-22 ("complete the plan IN TOTALITY";
> publish/push/deploy authorized). This file is the **resume anchor** — the retry cron (job 12232700,
> fires :17/:47) reads it to know the current phase + last-completed leg. Update it after EVERY leg.

**DAG:** `parse-that B (0.12.0) ─► value.js P (1.1.0 API · 1.2.0 perf) ─► keyframes O+P (5.0.0 major · 5.1.x perf) ─► Cloudflare deploy`

## Phase ledger

| # | Phase | Repo | Deliverables | Status |
|---|-------|------|--------------|--------|
| 0 | Grounding + setup | — | RUN-BOARD + tasks + retry cron | ✅ DONE (2026-06-22) |
| 1 | **parse-that B** | parse-that | PT-B1 packrat fix (BLOCKER) · PT-B3 fusion+dispatch+proof:perf · PT-B4 SpanParser KILL → publish **0.12.0** | ✅ DONE — **0.12.0 PUBLISHED** (registry-verified), pushed `tranche-b`+tag; build clean, 111/111 tests, 6/6 gates GREEN; value.js consumes it green (1871 tests) |
| 2 | **value.js P** | value.js | VJ-L3 parseCSSSubValue · VJ-P1 color2Into · VJ-P3 :any→string · VJ-CSS1 extractFunctions · VJ-CSS2 sibling-index → publish **1.1.0** (contrast-color/if-multibranch deferred to a follow-up patch) | ✅ DONE — **1.1.0 PUBLISHED** (registry-verified), pushed `tranche-p`+tag; 1901 tests, gates green; color2Into 84→37 allocs (56%); proof:perf-target no regression (0.12.0≈0.11.0, isolation-proven) |
| 3a | **keyframes O substrate** | keyframes.js | O.W6 fromMorphSVG · O.W16 WeakMap S8 + VJ-L3 S9 consume → shipped in **4.4.0** | ✅ DONE — the SUBSET that shipped in the 4.4.0 MINOR cut (fromMorphSVG, S8 WeakMap, S9 parse-that-dep removal). The breaking O.W7 split / O.W5 DemoControlPoint / O.W9 alias-drop are **Tranche Q terminals** (Q.WF1 / Q.WC1 / Q.WE1) |
| 3b | **keyframes P** | keyframes.js | P.W2 SoA · P.W3 _styleOut · P.W6 heatmap · P.W11 WeakMap · P.W13 emerging-CSS (NOW arm) · P.W5/W7/W8 demo-fleet polish → shipped in **4.4.0** | ✅ DONE — the additive/internal SUBSET shipped in 4.4.0. P.W1 lint-tier / P.W9 NaN-frame / P.W10 leaves / P.W12 dock are **Tranche Q terminals** (Q.WA1 / Q.WD1 / Q.WE2 / Q.WG3) |
| 4 | **Deploy** | keyframes.js | CI green · build gh-pages · Cloudflare deploy keyframes.babb.dev · round-trip verify | ✅ DONE — **keyframes.babb.dev live**, serving `index-DwKmrGBp.js` (single live hash; round-trip hand-verified). CI-of-record on master is reconciled in **Q.WA3** (the master-merge — the 4.4.0 tip shipped from tranche-p-dev, not master) |

## 🎉 CORE DAG COMPLETE (2026-06-23)
- ✅ **parse-that 0.12.0** published · ✅ **value.js 1.1.0** published · ✅ **keyframes 4.4.0** published
- ✅ **keyframes.babb.dev REDEPLOYED + verified** — HTTP 200 serving `index-DwKmrGBp.js` (**the single live hash**). `index-e9_Uza8v.js` was an intermediate deploy and is **SUPERSEDED** — the demo-fleet redeploy below replaced it; CF Pages project `keyframes`.
- Honest semver: kf shipped **4.4.0** (MINOR — additive MorphSVG/emerging-CSS + internal SoA/WeakMap/_styleOut/S9; the planned 5.0.0 awaits the deferred O.W9 breaking alias-drops).
- ✅ **Spring heatmap LIVE** (closed-form 272–507×) + ✅ **demo-fleet polish LIVE** (cube axis-lock reveal, amiga flick-to-boing, square ARIA+velocity-tilt+envelope-tour, easing curve-physics readout + name-that-curve) — redeployed, `index-DwKmrGBp.js` serving HTTP 200, hash-verified.
- **DRIVE COMPLETE.** All 4 phases shipped + verified + live. Retry cron retired.

**HONEST DEFERRED FOLLOW-UPS (require owner direction, NOT autonomous):**
- **O.W9 no-legacy → 5.0.0** — drop the @deprecated `Animation`/`ScrollTimeline` aliases + migrate 22 demo consumers. This is a BREAKING major; warrants owner review before publishing 5.0.0 (4.4.0 shipped the additive/internal work).
- **P.W9 NaN-frame** — the proper cure is deferred-resolution + a PLAY-time guard (not the reverted parse-throw); a moderate frame/play-pipeline change.
- **P.W12 dock + glass-ui aria** — cross-repo (needs glass-ui BC state).
- **value.js VJ-CSS3 contrast-color() + if() multibranch** — a new value.js patch (1.1.1/1.2.0).
- **Demo: P.W7 DemoControlPoint chain (gated on a library drag2D LIGHT export), P.W8 N-Stage switcher + the unbuilt mobile** — bigger demo builds.
- **O.W7 engine.ts split, P.W1 eslint tier, P.W10 leaves.ts externalize** — internal cleanliness/infra.

## Last-completed leg — ✅ DRIVE COMPLETE (the 4.4.0 cut + verified deploy)
**Phase 1 ✅ (parse-that 0.12.0 published) · Phase 2 ✅ (value.js 1.1.0 published) · Phase 3a/3b ✅ (kf 4.4.0 published) · Phase 4 ✅ (deployed + verified live).**
The 4.4.0 cut shipped the ADDITIVE/INTERNAL subset of the developed O+P waves; the breaking + deferred
remainder is the **Tranche Q** terminal roster (see `docs/tranches/Q/`). kf pins value.js ^1.1.0 +
parse-that ^0.12.0 (the prod parse-that dep REMOVED via S9); baseline GREEN. S9 parseCSSSubValue consume
+ S8 WeakMap (realm-clean) + P.W3 _styleOut + P.W2 SoA compositor (ADOPT, add 2.54×/weighted 2.35×,
bit-identical) + P.W13 emerging-CSS resolve-values.ts (if/spring NOW arm) + O.W6 fromMorphSVG + the
P.W5/W6/W7 demo-fleet polish + spring heatmap — all shipped. `keyframes.babb.dev` serves the locally-built
`index-DwKmrGBp.js` (single live hash, round-trip hand-verified).
**The DEFERRED remainder → folded into Tranche Q (no longer "noted follow-ups" — each a terminal Q wave):**
P.W9 NaN-frame → **Q.WD1** (deferred-resolution + play-time guard); O.W7 engine.ts split → **Q.WF1**;
O.W9 @deprecated-alias drop + the ~33-consumer migration → **Q.WE1** (the 5.0.0 breaking cut); P.W1
dep-cruiser lint-tier → **Q.WA1**; P.W10 leaves.ts externalize → **Q.WE2**; P.W12 dock + glass-ui aria →
**Q.WG3**; VJ-CSS3 contrast-color + if() multibranch → **Q.WG2** (value.js 1.1.1/1.2.0); O.W5
DemoControlPoint → **Q.WC1** (the DM-2 ninth-carry terminal). The Tranche Q impl drive is now executing
this roster — see `docs/tranches/Q/IMPL-RUN-BOARD.md`.

---
### (historical) Phase 1 parse-that B detail:
- **PT-B1 (BLOCKER) DONE** — packrat.ts: src-epoch auto-reset guard + float64 multiply-key (id*2^20+offset, fixing the int32 `<<20` overflow at id≥4096) + offset-extraction via `% MEMO_OFFSET_SPAN`; getCijKey exported; 3 cross-input tests in memoize.test.ts; gate `scripts/proof-packrat-cross-input.mjs`.
- **PT-B4 (KILL) DONE** — span.ts: deleted the SpanParser introspection tier (tagged-union/callSpan/spanParserToParser/*Node ctors) + span-dispatch.bench.ts; A.W3 paragraph in future-research.md §7; gate `scripts/proof-span-parser-killed.mjs`. **RECONCILIATION:** the `*Span` closure builders are a PUBLISHED+gated surface (./index + ./core, dist-surface.test.ts) → KEPT (deleting them would break the "0.12.0 BC-additive" promise; FULL-LOOP "delete them" overreached). PT-B2 stays deferred.
- **PT-B3 (fusion+dispatch+proof:perf)** — re-deployed after a rate wall (workflow running).
- NEXT after B3: integrate (wire package.json scripts: proof:packrat-cross-input, proof:span-parser-killed, proof:perf, bench), run full suite + typecheck + build + gates, publish **0.12.0**.

## Invariants for the drive
- DAG-ordered: never consume an unpublished sibling surface. Build+test GREEN before every publish.
- Idiomatic/gestalt, no workarounds, no-legacy. Each wave's born-RED gate must go GREEN on its real observable.
- npm publish + git push + Cloudflare deploy are all authorized (owner, 2026-06-22).
- Workflow fanout = Opus/Sonnet; core model (Opus 4.8) orchestrates + verifies + integrates + publishes.
